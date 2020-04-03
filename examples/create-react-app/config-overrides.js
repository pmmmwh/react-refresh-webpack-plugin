const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { addBabelPlugin, addWebpackPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin(require.resolve('react-refresh/babel')),
  addWebpackPlugin(new ReactRefreshPlugin())
);
