const path = require('path');
const spawn = require('cross-spawn');
const semver = require('semver');

const isOpenSSL3 = semver.gte(process.versions.node, '17.0.0');

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
  const webpackBin = getPackageExecutable('webpack-cli');

  const NODE_OPTIONS = [
    // This requires a script to alias `webpack` and `webpack-cli` -
    // both v4 and v5 is installed side by side,
    // so we have to ensure that they resolve to the `legacy` variant.
    WEBPACK_VERSION === 4 && `--require "${require.resolve('./aliasLegacyWebpack')}"`,
    // This make Node.js use the legacy OpenSSL provider -
    // it is necessary as OpenSSL 3.0 removed support for MD4,
    // which is the default hashing algorithm used in Webpack 4.
    WEBPACK_VERSION === 4 && isOpenSSL3 && '--openssl-legacy-provider',
  ]
    .filter(Boolean)
    .join(' ');

  return spawnTestProcess(
    webpackBin,
    [
      'serve',
      '--no-color',
      '--config',
      path.join(dirs.root, 'webpack.config.js'),
      WDS_VERSION === 3 ? '--content-base' : '--static-directory',
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
