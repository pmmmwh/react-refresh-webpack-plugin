const path = require('path');
const { Template } = require('webpack');
const { refreshUtils } = require('./runtime/globals');

/** A token to match code statements similar to a React import. */
const reactModule = /['"]react['"]/;

/**
 * A simple Webpack loader to inject react-refresh HMR code into modules.
 * @param {string} source The original module source code.
 * @returns {string} The injected module source code.
 */
function RefreshHotLoader(source) {
  // Add dependency to allow caching and invalidations
  this.addDependency(path.resolve('./runtime/RefreshModuleRuntime'));

  // Only apply transform if the source code contains a React import
  return reactModule.test(source)
    ? source +
        '\n' +
        Template.getFunctionContent(require('./runtime/RefreshModuleRuntime'))
          .trim()
          .replace(/\$RefreshUtils\$/g, refreshUtils)
    : source;
}

module.exports = RefreshHotLoader;
