const path = require('path');
const spawn = require('cross-spawn');

/**
 * @param {string} packageName
 * @returns {string}
 */
function getPackageExecutable(packageName) {
  let { bin: binPath } = require(`${packageName}/package.json`);
  if (!binPath) {
    throw new Error(`Package ${packageName} does not have an executable!`);
  }

  // "bin": { "package": "bin.js" }
  if (typeof binPath === 'object') {
    binPath = binPath[packageName];
  }

  return require.resolve(path.join(packageName, binPath));
}

/**
 * @param {import('child_process').ChildProcess | void} instance
 * @returns {void}
 */
function killTestProcess(instance) {
  if (!instance) {
    return;
  }

  try {
    process.kill(instance.pid);
  } catch (error) {
    if (
      process.platform === 'win32' &&
      typeof error.message === 'string' &&
      (error.message.includes(`no running instance of the task`) ||
        error.message.includes(`not found`))
    ) {
      // Windows throws an error if the process is already dead
      return;
    }

    throw error;
  }
}

/**
 * @typedef {Object} SpawnOptions
 * @property {string} [cwd]
 * @property {*} [env]
 * @property {string | RegExp} [successMessage]
 */

/**
 * @param {string} processPath
 * @param {*[]} argv
 * @param {SpawnOptions} [options]
 * @returns {Promise<import('child_process').ChildProcess | void>}
 */
function spawnTestProcess(processPath, argv, options = {}) {
  const cwd = options.cwd || path.resolve(__dirname, '../../..');
  const env = {
    ...process.env,
    NODE_ENV: 'development',
    ...options.env,
  };
  const successRegex = new RegExp(options.successMessage || 'compiled successfully', 'i');

  return new Promise((resolve, reject) => {
    const instance = spawn(processPath, argv, { cwd, env });
    let didResolve = false;

    /**
     * @param {Buffer} data
     * @returns {void}
     */
    function handleStdout(data) {
      const message = data.toString();
      if (successRegex.test(message)) {
        if (!didResolve) {
          didResolve = true;
          resolve(instance);
        }
      }

      if (__DEBUG__) {
        process.stdout.write(message);
      }
    }

    /**
     * @param {Buffer} data
     * @returns {void}
     */
    function handleStderr(data) {
      const message = data.toString();
      process.stderr.write(message);
    }

    instance.stdout.on('data', handleStdout);
    instance.stderr.on('data', handleStderr);

    instance.on('close', () => {
      instance.stdout.removeListener('data', handleStdout);
      instance.stderr.removeListener('data', handleStderr);

      if (!didResolve) {
        didResolve = true;
        resolve();
      }
    });

    instance.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * @param {number} port
 * @param {string} directory
 * @param {SpawnOptions} [options]
 * @returns {Promise<import('child_process').ChildProcess | void>}
 */
function spawnWebpackServe(port, directory, options = {}) {
  const webpackBin = getPackageExecutable('webpack-cli');
  return spawnTestProcess(
    webpackBin,
    [
      'serve',
      '--config',
      path.resolve(directory, 'webpack.config.js'),
      '--content-base',
      directory,
      '--hot',
      '--port',
      port,
    ],
    {
      ...options,
      env: {
        ...options.env,
        ...(WEBPACK_VERSION === 4 && {
          // This requires a script to alias `webpack` and `webpack-cli` -
          // both v4 and v5 is installed side by side,
          // so we have to ensure that they resolve to the `legacy` variant.
          NODE_OPTIONS: `--require "${require.resolve('./aliasLegacyWebpack')}"`,
        }),
      },
    }
  );
}

module.exports = {
  killTestProcess,
  spawnWebpackServe,
};
