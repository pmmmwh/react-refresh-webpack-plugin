const path = require('path');

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
    <script src="http://localhost:${port}/main.js"></script>
  </body>
</html>
`;
}

function getWDSConfig(srcDir) {
  return `
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  context: '${srcDir}',
  entry: {
    main: ['${path.join(__dirname, './runtime/hot-notifier.js')}', './index.js'],
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
              plugins: [
                ['react-refresh/babel', { skipEnvCheck: true }],
              ],
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
