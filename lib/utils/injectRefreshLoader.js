const path = require('path');

/**
 * @callback MatchObject
 * @param {string} [str]
 * @returns {boolean}
 */

const resolvedLoader = require.resolve('../../loader');

/**
 * Injects refresh loader to all JavaScript-like and user-specified files.
 * @param {*} data Module factory creation data.
 * @param {MatchObject} matchObject A function to include/exclude files to be processed.
 * @returns {*} The injected module factory creation data.
 */
function injectRefreshLoader(data, matchObject) {
  if (
    // Include and exclude user-specified files
    matchObject(data.resource) &&
    // Skip plugin's runtime utils to prevent self-referencing -
    // this is useful when using the plugin as a direct dependency.
    !data.resource.includes(path.join(__dirname, '../runtime/RefreshUtils')) &&
    // Check to prevent double injection
    !data.loaders.find(({ loader }) => loader === resolvedLoader)
  ) {
    data.loaders.unshift({
      loader: resolvedLoader,
      options: undefined,
    });
  }

  return data;
}

module.exports = injectRefreshLoader;
