const path = require('path');

const BUNDLE_FILENAME = 'main';

/**
 * @param {number} port
 * @return {string}
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
 * @param {string} srcDir
 * @return {string}
 */
function getWDSConfig(srcDir) {
  return `
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  context: '${srcDir}',
  entry: {
    '${BUNDLE_FILENAME}': [
      '${path.join(__dirname, './runtime/hot-notifier.js')}',
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
            loader: 'babel-loader',
            options: {
              plugins: ['react-refresh/babel'],
            }
          }
        ],
      },
    ],
  },
  plugins: [new ReactRefreshPlugin()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
`;
}

module.exports = { getIndexHTML, getWDSConfig };
