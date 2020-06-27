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
    // It is important to have inject loader before anything,
    // especially if runtime transforms (e.g. @babel/plugin-transform-runtime) are being used.
    // Runtime transforms might make use of cache mechanisms (e.g. WeakMaps) to handle imports,
    // so if we do things out of their loop,
    // we might risk referencing a different version of the same dependency in the runtime.
    // This in its worst form will break HMR referential equality checks,
    // making us bail out on every change.
    // e.g. React in the file will not be equal to React as consumed by react-refresh.
    data.loaders.push({
      loader: resolvedLoader,
      options: undefined,
    });
  }

  return data;
}

module.exports = injectRefreshLoader;
