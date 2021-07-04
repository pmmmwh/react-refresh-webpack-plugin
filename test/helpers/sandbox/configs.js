const path = require('path');

const BUNDLE_FILENAME = 'main';

/**
 * @param {number} port
 * @returns {string}
 */
function getIndexHTML(port) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sandbox React App</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="http://localhost:${port}/${BUNDLE_FILENAME}.js"></script>
  </body>
</html>
`;
}

/**
 * @param {boolean} esModule
 * @returns {string}
 */
function getPackageJson(esModule = false) {
  return `
{
  "type": "${esModule ? 'module' : 'commonjs'}"
}
`;
}

/**
 * @param {string} srcDir
 * @returns {string}
 */
function getWDSConfig(srcDir) {
  return `
const { DefinePlugin } = require('webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  context: '${srcDir}',
  devtool: false,
  entry: {
    '${BUNDLE_FILENAME}': [
      '${path.join(__dirname, 'fixtures/hmr-notifier.js')}',
      './index.js',
    ],
  },
  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        include: '${srcDir}',
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            }
          }
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({ __react_refresh_test__: true }),
    new ReactRefreshPlugin(),
  ],
  resolve: {
    alias: {
      webpack: '${WEBPACK_VERSION === 4 ? 'webpack.legacy' : 'webpack'}'
    },
    extensions: ['.js', '.jsx'],
  },
};
`;
}

module.exports = { getIndexHTML, getPackageJson, getWDSConfig };
