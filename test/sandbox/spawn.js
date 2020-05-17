const path = require('path');
const spawn = require('cross-spawn');

/**
 * @param {string} processPath
 * @param {*[]} argv
 * @param {object} [options]
 * @property {string} [options.cwd]
 * @property {*} [options.env]
 * @property {string | RegExp} [options.successMessage]
 * @return {Promise<unknown>}
 */
function spawnTestProcess(processPath, argv, options = {}) {
  const cwd = options.cwd || path.resolve(__dirname, '../..');
  const env = {
    ...process.env,
    NODE_ENV: 'development',
    ...options.env,
  };
  const successRegex = new RegExp(options.successMessage || 'compiled successfully', 'i');

  return new Promise((resolve, reject) => {
    const instance = spawn(processPath, argv, { cwd, env });
    let didResolve = false;

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

function spawnWDS(port, directory, options) {
  const wdsBin = path.resolve('node_modules/.bin/webpack-dev-server');
  return spawnTestProcess(
    wdsBin,
    [
      '--config',
      path.resolve(directory, 'webpack.config.js'),
      '--content-base',
      directory,
      '--hot-only',
      '--port',
      port,
    ],
    options
  );
}

function killTestProcess(instance) {
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

module.exports = {
  killTestProcess,
  spawnWDS,
};
