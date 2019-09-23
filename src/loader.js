const { Template } = require('webpack');
const { runtimeUtils } = require('./runtime/globals');

/**
 * A simple Webpack loader to inject react-refresh HMR code into modules.
 * @param {string} source The original module source code.
 * @returns {string} The injected module source code.
 */
function RefreshHotLoader(source) {
  return (
    source +
    Template.getFunctionContent(
      require('./runtime/RefreshModuleRuntime')
    ).replace(/\$RefreshUtils\$/g, runtimeUtils)
  );
}

module.exports = RefreshHotLoader;
