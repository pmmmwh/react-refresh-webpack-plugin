const path = require('path');
const fse = require('fs-extra');
const getPort = require('get-port');
const { nanoid } = require('nanoid');
const getBrowserPage = require('./getBrowserPage');
const { killInstance, spawnWDS } = require('./spawn');

const rootSandboxDirectory = path.join(__dirname, '..', '__tmp__');

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

async function sandbox({ id = nanoid(), initialFiles = new Map() } = {}) {
  const port = await getPort();

  const sandboxDirectory = path.join(rootSandboxDirectory, id);
  const srcDirectory = path.join(sandboxDirectory, 'src');

  await fse.remove(sandboxDirectory);
  await fse.mkdirp(srcDirectory);

  await fse.writeFile(
    path.join(sandboxDirectory, 'webpack.config.js'),
    `
const ReactRefreshPlugin = require('../../../src');

module.exports = {
  mode: 'development',
  context: '${srcDirectory}',
  entry: {
    main: ['${path.join(__dirname, 'hot-notifier.js')}', './index.js'],
  },
  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        include: '${srcDirectory}',
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                ['react-refresh/babel', { skipEnvCheck: true }],
              ],
            }
          }
        ],
      },
    ],
  },
  plugins: [new ReactRefreshPlugin()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
`
  );

  await fse.writeFile(
    path.join(sandboxDirectory, 'index.html'),
    `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox React App</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="http://localhost:${port}/main.js"></script>
  </body>
</html>
`
  );

  await fse.writeFile(
    path.join(srcDirectory, 'index.js'),
    `export default function Sandbox() { return 'new sandbox'; }`
  );

  for (const [filePath, fileContent] of initialFiles.entries()) {
    await fse.writeFile(filePath.join(srcDirectory, filePath), fileContent);
  }

  // TODO: Add handling for webpack-hot-middleware and webpack-plugin-serve
  const app = await spawnWDS(port, sandboxDirectory);
  const page = await getBrowserPage(port, '/');

  return [
    {
      async write(fileName, content) {
        // Update the file on filesystem
        const fullFileName = path.join(srcDirectory, fileName);
        const directory = path.dirname(fullFileName);
        await fse.mkdirp(directory);
        await fse.writeFile(fullFileName, content);
      },
      async patch(fileName, content) {
        // Register an event for HMR completion
        await page.evaluate(() => {
          window.__HMR_STATE = 'pending';

          const timeout = setTimeout(function () {
            window.__HMR_STATE = 'timeout';
          }, 30 * 1000);

          window.__HMR_CALLBACK = function () {
            clearTimeout(timeout);
            window.__HMR_STATE = 'success';
          };
        });

        await this.write(fileName, content);

        for (;;) {
          let status;
          try {
            status = await page.evaluate(() => window.__HMR_STATE);
          } catch (error) {
            // This indicates a navigation
            if (!error.message.includes('Execution context was destroyed')) {
              console.error(error);
            }
          }

          if (!status) {
            await sleep(1000);

            // Wait for application to re-hydrate:
            await page.evaluate(() => {
              return new Promise((resolve) => {
                if (window.__REACT_REFRESH_RELOADED) {
                  resolve();
                } else {
                  const timeout = setTimeout(resolve, 30 * 1000);
                  window.__REACT_REFRESH_RELOADED_CB = function () {
                    clearTimeout(timeout);
                    resolve();
                  };
                }
              });
            });

            console.log('Application re-loaded.');

            // Slow down tests a bit
            await sleep(1000);
            return false;
          }

          if (status === 'success') {
            console.log('Hot update complete.');
            break;
          }

          if (status !== 'pending') {
            throw new Error(`Application is in inconsistent state: ${status}.`);
          }

          await sleep(30);
        }

        // Slow down tests a bit (we don't know how long re-rendering takes):
        await sleep(1000);
        return true;
      },
      async remove(fileName) {
        const fullFileName = path.join(srcDirectory, fileName);
        await fse.remove(fullFileName);
      },
      async evaluate(fn) {
        if (typeof fn === 'function') {
          const result = await page.evaluate(fn);
          await sleep(30);
          return result;
        } else {
          throw new Error('You must pass a function to be evaluated in the browser.');
        }
      },
    },
    function cleanup() {
      async function _cleanup() {
        await page.browser().close();
        await killInstance(app);

        // TODO: Make this optional for easier debugging
        await fse.remove(sandboxDirectory);
      }
      _cleanup().catch(() => {});
    },
  ];
}

module.exports = sandbox;
