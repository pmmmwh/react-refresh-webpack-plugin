const { addBabelPlugin, addWebpackPlugin, override } = require('customize-cra');

// When using from NPM you should import this as follows:
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const replaceCRADevServer = () => config => {
  config.entry = config.entry.map(entry => {
    if (entry.match(/react-dev-utils/)) {

      // When using from NPM you should resolve this as follows:
      // return require.resolve("@pmmmwh/react-refresh-webpack-plugin/src/webpackHotDevClient");
      return require.resolve("../../src/webpackHotDevClient");
    }
    return entry;
  })
  return config;
}

module.exports = override(
  addBabelPlugin(require.resolve('react-refresh/babel')),
  addWebpackPlugin(new ReactRefreshPlugin({ disableRefreshCheck: true })),
  replaceCRADevServer(),
);
