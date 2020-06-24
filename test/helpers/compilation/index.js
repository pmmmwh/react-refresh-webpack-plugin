const path = require('path');
const { createFsFromVolume, Volume } = require('memfs');
const webpack = require('webpack');
const normalizeErrors = require('./normalizeErrors');

/** @type {Set<function(): Promise<void>>} */
const cleanupHandlers = new Set();
afterEach(async () => {
  await Promise.all([...cleanupHandlers].map((callback) => callback()));
});

const BUNDLE_FILENAME = 'main';
const CONTEXT_PATH = path.join(__dirname, '../../loader/fixtures');
const OUTPUT_PATH = path.join(__dirname, 'dist');

/**
 * Gets a Webpack compiler instance to test loader operations.
 * @param {string} fixtureFile
 * @param {Object} [options]
 * @param {boolean} [options.devtool]
 * @param {*} [options.prevSourceMap]
 * @returns {import('webpack').Compiler}
 */
function getCompilation(fixtureFile, options = {}) {
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
      },
    },
  });

  if (!compiler.outputFileSystem) {
    compiler.outputFileSystem = createFsFromVolume(new Volume());
    if (WEBPACK_VERSION !== 5) {
      compiler.outputFileSystem.join = path.join.bind(path);
    }
  }

  function cleanupCompilation() {
    return new Promise((resolve) => {
      compiler.close(() => {
        cleanupHandlers.delete(cleanupCompilation);
        resolve();
      });
    });
  }

  cleanupHandlers.add(cleanupCompilation);

  const compilerOutputFs = compiler.outputFileSystem;
  let compilationStats;

  return [
    {
      get errors() {
        return normalizeErrors(compilationStats.compilation.errors);
      },
      get warnings() {
        return normalizeErrors(compilationStats.compilation.errors);
      },
      get module() {
        if (!compilationStats) {
          throw new Error('Compilation stats data is not available!');
        }

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
      async run() {
        return new Promise((resolve, reject) => {
          compiler.run((error, stats) => {
            if (error) {
              reject(error);
              return;
            }

            if (stats.hasErrors()) {
              reject(stats.toJson().errors);
              return;
            }

            compilationStats = stats;
            resolve(stats.toJson({ source: true }));
          });
        });
      },
    },
    cleanupCompilation,
  ];
}

module.exports = getCompilation;
