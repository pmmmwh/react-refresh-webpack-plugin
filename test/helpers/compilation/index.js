const path = require('path');
const { createFsFromVolume, Volume } = require('memfs');
const webpack = require('webpack');
const normalizeErrors = require('./normalizeErrors');

const BUNDLE_FILENAME = 'main';
const CONTEXT_PATH = path.join(__dirname, '../..', 'loader/fixtures');
const OUTPUT_PATH = path.join(__dirname, 'dist');

/**
 * @typedef {Object} CompilationModule
 * @property {string} execution
 * @property {string} parsed
 * @property {string} [sourceMap]
 */

/**
 * @typedef {Object} CompilationSession
 * @property {*[]} errors
 * @property {*[]} warnings
 * @property {CompilationModule} module
 */

/**
 * Gets a Webpack compiler instance to test loader operations.
 * @param {string} subContext
 * @param {Object} [options]
 * @param {boolean | string} [options.devtool]
 * @param {import('../../../loader/types').ReactRefreshLoaderOptions} [options.loaderOptions]
 * @param {*} [options.prevSourceMap]
 * @returns {Promise<CompilationSession>}
 */
async function getCompilation(subContext, options = {}) {
  const compiler = webpack({
    mode: 'development',
    cache: false,
    context: path.join(CONTEXT_PATH, subContext),
    devtool: options.devtool || false,
    entry: {
      [BUNDLE_FILENAME]: './index.js',
    },
    output: {
      filename: '[name].js',
      hashFunction: WEBPACK_VERSION === 4 ? 'sha1' : 'xxhash64',
      path: OUTPUT_PATH,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: require.resolve('@pmmmwh/react-refresh-webpack-plugin/loader'),
              options: options.loaderOptions,
            },
            !!options.devtool &&
              Object.prototype.hasOwnProperty.call(options, 'prevSourceMap') && {
                loader: path.join(__dirname, 'fixtures/source-map-loader.js'),
                options: {
                  sourceMap: options.prevSourceMap,
                },
              },
          ].filter(Boolean),
        },
      ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    // Options below forces Webpack to:
    // 1. Move Webpack runtime into the runtime chunk;
    // 2. Move node_modules into the vendor chunk with a stable name.
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        name: (module, chunks, cacheGroupKey) => cacheGroupKey,
      },
    },
  });

  // Use an in-memory file system to prevent emitting files
  compiler.outputFileSystem = createFsFromVolume(new Volume());
  if (WEBPACK_VERSION === 4) {
    compiler.outputFileSystem.join = path.join.bind(path);
  }

  /** @type {import('memfs').IFs} */
  const compilerOutputFs = compiler.outputFileSystem;
  /** @type {import('webpack').Stats | undefined} */
  let compilationStats;

  await new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        reject(error);
        return;
      }

      compilationStats = stats;

      if (WEBPACK_VERSION === 4) {
        resolve();
      } else {
        // The compiler have to be explicitly closed in Webpack 5
        compiler.close(() => {
          resolve();
        });
      }
    });
  });

  return {
    /** @type {*[]} */
    get errors() {
      return normalizeErrors(compilationStats.compilation.errors);
    },
    /** @type {*[]} */
    get warnings() {
      return normalizeErrors(compilationStats.compilation.errors);
    },
    /** @type {CompilationModule} */
    get module() {
      const compilationModules = compilationStats.toJson({ source: true }).modules;
      if (!compilationModules) {
        throw new Error('Module compilation stats not found!');
      }

      const parsed = compilationModules.find(({ name }) => name === './index.js');
      if (!parsed) {
        throw new Error('Fixture module is not found in compilation stats!');
      }

      let execution;
      try {
        execution = compilerOutputFs
          .readFileSync(path.join(OUTPUT_PATH, `${BUNDLE_FILENAME}.js`))
          .toString();
      } catch (error) {
        execution = error.toString();
      }

      /** @type {string | undefined} */
      let sourceMap;
      const [, sourceMapUrl] = execution.match(/\/\/# sourceMappingURL=(.*)$/) || [];
      const isInlineSourceMap = !!sourceMapUrl && /^data:application\/json;/.test(sourceMapUrl);
      if (!isInlineSourceMap) {
        try {
          sourceMap = JSON.stringify(
            JSON.parse(
              compilerOutputFs.readFileSync(path.join(OUTPUT_PATH, sourceMapUrl)).toString()
            ),
            null,
            2
          );
        } catch (error) {
          sourceMap = error.toString();
        }
      }

      return {
        parsed: parsed.source,
        execution,
        sourceMap,
      };
    },
  };
}

module.exports = getCompilation;
