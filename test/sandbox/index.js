const path = require('path');
const fse = require('fs-extra');
const getPort = require('get-port');
const { nanoid } = require('nanoid');
const { getPage } = require('./browser');
const { getIndexHTML, getWDSConfig } = require('./configs');
const { killTestProcess, spawnWDS } = require('./spawn');

// Extends the timeout for tests using the sandbox
jest.setTimeout(1000 * 60 * 5);

// Setup a global "queue" of cleanup handlers to allow auto-teardown of tests,
// even when they did not run the cleanup function.
/** @type {Set<function(): Promise<void>>} */
const cleanupHandlers = new Set();
afterEach(async () => {
  await Promise.all([...cleanupHandlers].map((c) => c()));
});

/**
 * Logs output to the console (only in debug mode).
 * @param {...*} args
 * @returns {void}
 */
const log = (...args) => {
  if (__DEBUG__) {
    console.log(...args);
  }
};

/**
 * Pause current asynchronous execution for provided milliseconds.
 * @param {number} ms
 * @return {Promise<void>}
 */
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * @typedef {Object} SandboxSession
 * @property {Promise<*[]>} logs
 * @property {function(): Promise<void>} resetLogs
 * @property {function(string, string): Promise<void>} write
 * @property {function(string, string): Promise<boolean>} patch
 * @property {function(string): Promise<void>} remove
 * @property {function(*): Promise<*>} evaluate
 * @property {function(): Promise<void>} reload
 */

const rootSandboxDir = path.join(__dirname, '..', '__tmp__');

/**
 * Creates a Webpack and Puppeteer backed sandbox to execute HMR operations on.
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {Map<string, string>} [options.initialFiles]
 * @returns {Promise<[SandboxSession, function(): Promise<void>]>}
 */
async function sandbox({ id = nanoid(), initialFiles = new Map() } = {}) {
  const port = await getPort();

  // Get sandbox directory paths
  const sandboxDir = path.join(rootSandboxDir, id);
  const srcDir = path.join(sandboxDir, 'src');
  // In case of an ID clash, remove the existing sandbox directory
  await fse.remove(sandboxDir);
  // Create the sandbox source directory
  await fse.mkdirp(srcDir);

  // Write necessary files to sandbox
  await fse.writeFile(path.join(sandboxDir, 'webpack.config.js'), getWDSConfig(srcDir));
  await fse.writeFile(path.join(sandboxDir, 'index.html'), getIndexHTML(port));
  await fse.writeFile(
    path.join(srcDir, 'index.js'),
    `export default function Sandbox() { return 'new sandbox'; }`
  );

  // Write initial files to sandbox
  for (const [filePath, fileContent] of initialFiles.entries()) {
    await fse.writeFile(path.join(srcDir, filePath), fileContent);
  }

  // TODO: Add handling for webpack-hot-middleware and webpack-plugin-serve
  const app = await spawnWDS(port, sandboxDir);
  const page = await getPage(port, '/');

  async function cleanupSandbox() {
    async function _cleanup() {
      await page.close();
      await killTestProcess(app);

      if (!__DEBUG__) {
        await fse.remove(sandboxDir);
      }
    }

    try {
      await _cleanup();

      // Remove current cleanup handler from the global queue since it has been called
      cleanupHandlers.delete(cleanupSandbox);
    } catch (e) {
      // Do nothing
    }
  }

  // Cache the cleanup handler for global cleanup
  // This is done in case tests fail and async handlers are kept alive
  cleanupHandlers.add(cleanupSandbox);

  return [
    {
      /** @returns {Promise<*[]>} */
      get logs() {
        return page.evaluate(() => window.logs);
      },
      /** @returns {Promise<void>} */
      async resetLogs() {
        await page.evaluate(() => {
          window.logs = [];
        });
      },
      /**
       * @param {string} fileName
       * @param {string} content
       * @return {Promise<void>}
       */
      async write(fileName, content) {
        // Update the file on filesystem
        const fullFileName = path.join(srcDir, fileName);
        const directory = path.dirname(fullFileName);
        await fse.mkdirp(directory);
        await fse.writeFile(fullFileName, content);
      },
      /**
       * @param {string} fileName
       * @param {string} content
       * @return {Promise<boolean>}
       */
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
            // This message indicates a navigation, so it can be safely ignored.
            // Else, we re-throw the error to indicate a failure.
            if (!error.message.includes('Execution context was destroyed')) {
              throw error;
            }
          }

          if (!status) {
            await sleep(1000);

            // Wait for application to reload
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

            log('Application re-loaded.');

            // Slow down tests to wait for re-rendering
            await sleep(1000);
            return false;
          }

          if (status === 'success') {
            log('Hot update complete.');
            break;
          }

          if (status !== 'pending') {
            throw new Error(`Application is in inconsistent state: ${status}.`);
          }

          await sleep(30);
        }

        // Slow down tests to wait for re-rendering
        await sleep(1000);
        return true;
      },
      /**
       * @param {string} fileName
       * @returns {Promise<void>}
       */
      async remove(fileName) {
        const fullFileName = path.join(srcDir, fileName);
        await fse.remove(fullFileName);
      },
      /**
       * @param {*} fn
       * @returns {Promise<*>}
       */
      async evaluate(fn) {
        if (typeof fn === 'function') {
          const result = await page.evaluate(fn);
          await sleep(30);
          return result;
        } else {
          throw new Error('You must pass a function to be evaluated in the browser!');
        }
      },
      /** @returns {Promise<void>} */
      async reload() {
        await page.reload({ waitUntil: 'networkidle2' });
      },
    },
    cleanupSandbox,
  ];
}

module.exports = sandbox;
