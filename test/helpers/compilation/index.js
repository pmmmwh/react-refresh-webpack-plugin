const path = require('path');
const { createFsFromVolume, Volume } = require('memfs');
const webpack = require('webpack');
const normalizeErrors = require('./normalizeErrors');

const BUNDLE_FILENAME = 'main';
const CONTEXT_PATH = path.join(__dirname, '../../loader/fixtures');
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
 * @param {string} fixtureFile
 * @param {Object} [options]
 * @param {boolean} [options.devtool]
 * @param {*} [options.prevSourceMap]
 * @returns {CompilationSession}
 */
async function getCompilation(fixtureFile, options = {}) {
  const compiler = webpack({
    mode: 'development',
    context: CONTEXT_PATH,
    devtool: options.devtool || false,
    entry: {
      [BUNDLE_FILENAME]: path.join(CONTEXT_PATH, fixtureFile),
    },
    output: {
      filename: '[name].js',
      path: OUTPUT_PATH,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            require.resolve('@pmmmwh/react-refresh-webpack-plugin/loader'),
            !!options.devtool &&
              Object.prototype.hasOwnProperty.call(options, 'prevSourceMap') && {
                loader: path.join(__dirname, './fixtures/source-map-loader.js'),
                options: {
                  sourceMap: options.prevSourceMap,
                },
              },
          ].filter(Boolean),
        },
      ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        name: (module, chunks, cacheGroupKey) => cacheGroupKey,
      },
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  if (WEBPACK_VERSION !== 5) {
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

      if (WEBPACK_VERSION !== 5) {
        resolve();
      } else {
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
      const parsed = compilationStats
        .toJson({ source: true })
        .modules.find(({ name }) => name === fixtureFile);
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
