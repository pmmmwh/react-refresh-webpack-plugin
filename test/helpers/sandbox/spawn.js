const path = require('path');
const spawn = require('cross-spawn');

/**
 * @param {string} packageName
 * @returns {string}
 */
function getPackageExecutable(packageName, binName) {
  let { bin: binPath } = require(`${packageName}/package.json`);
  // "bin": { "package": "bin.js" }
  if (typeof binPath === 'object') {
    binPath = binPath[binName || packageName];
  }
  if (!binPath) {
    throw new Error(`Package ${packageName} does not have an executable!`);
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
  const successRegex = new RegExp(options.successMessage || 'webpack compilation complete.', 'i');

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

      if (__DEBUG__) {
        process.stderr.write(message);
      }
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
 * @param {Object} dirs
 * @param {string} dirs.public
 * @param {string} dirs.root
 * @param {string} dirs.src
 * @param {SpawnOptions} [options]
 * @returns {Promise<import('child_process').ChildProcess | void>}
 */
function spawnWebpackServe(port, dirs, options = {}) {
  const webpackBin = getPackageExecutable('webpack-cli', 'webpack-cli');

  const NODE_OPTIONS = [
    // This requires a script to alias `webpack-dev-server` -
    // both v4 and v5 are installed,
    // so we have to ensure that they resolve to the correct variant.
    WDS_VERSION === 4 && `--require "${require.resolve('./aliasWDSv4')}"`,
  ]
    .filter(Boolean)
    .join(' ');

  return spawnTestProcess(
    webpackBin,
    [
      'serve',
      '--no-color',
      '--no-client-overlay',
      '--config',
      path.join(dirs.root, 'webpack.config.js'),
      '--static-directory',
      dirs.public,
      '--hot',
      '--port',
      port,
    ],
    {
      ...options,
      env: { ...options.env, ...(NODE_OPTIONS && { NODE_OPTIONS }) },
    }
  );
}

module.exports = {
  killTestProcess,
  spawnWebpackServe,
};
