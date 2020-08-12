const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { addBabelPlugin, addWebpackPlugin, override } = require('customize-cra');

const webpackEnv = process.env.NODE_ENV;
const isEnvDevelopment = webpackEnv === 'development';

module.exports = override(
  isEnvDevelopment && addBabelPlugin(require.resolve('react-refresh/babel')),
  isEnvDevelopment && addWebpackPlugin(new ReactRefreshPlugin())
);
