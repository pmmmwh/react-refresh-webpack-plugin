const path = require('path');
const fse = require('fs-extra');
const getPort = require('get-port');
const { nanoid } = require('nanoid');
const { getIndexHTML, getWDSConfig } = require('./configs');
const { killTestProcess, spawnWDS, spawnWebpackServe } = require('./spawn');

// Extends the timeout for tests using the sandbox
jest.setTimeout(1000 * 60 * 5);

// Setup a global "queue" of cleanup handlers to allow auto-teardown of tests,
// even when they did not run the cleanup function.
/** @type {Set<function(): Promise<void>>} */
const cleanupHandlers = new Set();
afterEach(async () => {
  await Promise.all([...cleanupHandlers].map((callback) => callback()));
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
 * @returns {Promise<void>}
 */
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * @typedef {Object} SandboxSession
 * @property {boolean} didFullRefresh
 * @property {*[]} errors
 * @property {*[]} logs
 * @property {function(): void} resetState
 * @property {function(filename: string, content: string): Promise<void>} write
 * @property {function(filename: string, content: string): Promise<void>} patch
 * @property {function(filename: string): Promise<void>} remove
 * @property {function(fn: *, args: ...*): Promise<*>} evaluate
 * @property {function(): Promise<void>} reload
 */

const rootSandboxDir = path.join(__dirname, '../..', '__tmp__');
const spawnFn = WEBPACK_VERSION === 5 ? spawnWebpackServe : spawnWDS;

/**
 * Creates a Webpack and Puppeteer backed sandbox to execute HMR operations on.
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {Map<string, string>} [options.initialFiles]
 * @returns {Promise<[SandboxSession, function(): Promise<void>]>}
 */
async function getSandbox({ id = nanoid(), initialFiles = new Map() } = {}) {
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
  const app = await spawnFn(port, sandboxDir);
  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}/`);

  let didFullRefresh = false;
  let errors = [];
  let logs = [];

  // Expose logging and hot callbacks to the page
  await Promise.all([
    page.exposeFunction('log', (...args) => {
      logs.push(args.join(' '));
    }),
    page.exposeFunction('onHotAcceptError', (errorMessage) => {
      errors.push(errorMessage);
    }),
    page.exposeFunction('onHotSuccess', () => {
      page.emit('hotSuccess');
    }),
  ]);

  // Reset testing logs and errors on any navigation.
  // This is done for the main frame only,
  // because child frames (e.g. iframes) might attach to the document,
  // which will cause this event to fire.
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      resetState();
    }
  });

  /** @returns {void} */
  function resetState() {
    errors = [];
    logs = [];
  }

  async function cleanupSandbox() {
    try {
      await page.close();
      await killTestProcess(app);

      if (!__DEBUG__) {
        await fse.remove(sandboxDir);
      }

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
      /** @returns {boolean} */
      get didFullRefresh() {
        return didFullRefresh;
      },
      /** @returns {*[]} */
      get errors() {
        return errors;
      },
      /** @returns {*[]} */
      get logs() {
        return logs;
      },
      /** @returns {void} */
      resetState,
      /**
       * @param {string} fileName
       * @param {string} content
       * @returns {Promise<void>}
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
       * @returns {Promise<void>}
       */
      async patch(fileName, content) {
        // Register an event for HMR completion
        let hmrStatus = 'pending';
        // Parallelize file writing and event listening to prevent race conditions
        await Promise.all([
          this.write(fileName, content),
          new Promise((resolve) => {
            const hmrTimeout = setTimeout(() => {
              hmrStatus = 'timeout';
              resolve();
            }, 30 * 1000);

            // Frame Navigate and Hot Success events have to be exclusive,
            // so we remove the other listener when one of them is triggered.

            const onFrameNavigate = (frame) => {
              if (frame === page.mainFrame()) {
                page.removeListener('hotSuccess', onHotSuccess);
                clearTimeout(hmrTimeout);
                hmrStatus = 'reloaded';
                resolve();
              }
            };

            const onHotSuccess = () => {
              page.removeListener('framenavigated', onFrameNavigate);
              clearTimeout(hmrTimeout);
              hmrStatus = 'success';
              resolve();
            };

            // Make sure that the event listener is bound to trigger only once
            page.once('framenavigated', onFrameNavigate);
            page.once('hotSuccess', onHotSuccess);
          }),
        ]);

        if (hmrStatus === 'reloaded') {
          log('Application reloaded.');
          didFullRefresh = didFullRefresh || true;
        } else if (hmrStatus === 'success') {
          log('Hot update complete.');
        } else {
          throw new Error(`Application is in an inconsistent state: ${hmrStatus}.`);
        }

        // Slow down tests to wait for re-rendering
        await sleep(1000);
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
       * @param {...*} restArgs
       * @returns {Promise<*>}
       */
      async evaluate(fn, ...restArgs) {
        if (typeof fn === 'function') {
          return await page.evaluate(fn, ...restArgs);
        } else {
          throw new Error('You must pass a function to be evaluated in the browser!');
        }
      },
      /** @returns {Promise<void>} */
      async reload() {
        await page.reload({ waitUntil: 'networkidle2' });
        didFullRefresh = false;
      },
    },
    cleanupSandbox,
  ];
}

module.exports = getSandbox;
