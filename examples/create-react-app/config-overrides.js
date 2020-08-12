const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { addBabelPlugin, addWebpackPlugin, override } = require('customize-cra');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = override(
  isDevelopment && addBabelPlugin(require.resolve('react-refresh/babel')),
  isDevelopment && addWebpackPlugin(new ReactRefreshPlugin())
);
