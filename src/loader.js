const path = require('path');
const { Template } = require('webpack');
const { refreshUtils } = require('./runtime/globals');

/** A token to match code statements similar to a React import. */
const reactModule = /['"]react['"]/;

/**
 * A simple Webpack loader to inject react-refresh HMR code into modules.
 *
 * [Reference for Loader API](https://webpack.js.org/api/loaders/)
 * @param {string} source The original module source code.
 * @param {*} [inputSourceMap] The source map of the module.
 * @property {function(string): void} addDependency Adds a dependency for Webpack to watch.
 * @property {function(Error | null, string | Buffer, *?, *?): void} callback Sends loader results to Webpack.
 * @returns {string} The injected module source code.
 */
function RefreshHotLoader(source, inputSourceMap) {
  // Add dependency to allow caching and invalidations
  this.addDependency(path.resolve('./runtime/RefreshModuleRuntime'));

  // Use callback to allow source maps to pass through
  this.callback(
    null,
    // Only apply transform if the source code contains a React import
    reactModule.test(source)
      ? source +
          '\n\n' +
          Template.getFunctionContent(require('./runtime/RefreshModuleRuntime'))
            .trim()
            .replace(/^ {2}/gm, '')
            .replace(/\$RefreshUtils\$/g, refreshUtils)
      : source,
    inputSourceMap
  );
}

module.exports = RefreshHotLoader;
