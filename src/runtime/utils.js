const Refresh = require('react-refresh/runtime');

/**
 * Extracts exports from a webpack module object.
 * @param {*} module A Webpack module object.
 * @returns {*} An exports object from the module.
 */
function getModuleExports(module) {
  return module.exports || module.__proto__.exports;
}

/**
 * Creates self-recovering an error handler for webpack hot.
 * @returns {hotErrorHandler} A webpack hot error handler.
 */
function createHotErrorHandler(moduleId) {
  /*
   * An error handler to allow self-recovering behaviours.
   * @returns {void}
   */
  function hotErrorHandler() {
    require.cache[moduleId].hot.accept(hotErrorHandler);
  }

  return hotErrorHandler;
}

/**
 * Creates a helper that performs a delayed React refresh.
 * @returns {enqueueUpdate} A debounced React refresh function.
 */
function createDebounceUpdate() {
  /**
   * A cached setTimeout handler.
   * @type {number | void}
   */
  var refreshTimeout = undefined;

  /**
   * Performs react refresh on a delay.
   * @returns {void}
   */
  function enqueueUpdate() {
    if (refreshTimeout === undefined) {
      refreshTimeout = setTimeout(function() {
        refreshTimeout = undefined;
        Refresh.performReactRefresh();
      }, 30);
    }
  }

  return enqueueUpdate;
}

/**
 * Checks if all exports are likely a React component.
 *
 * This implementation is based on the one in [Metro](https://github.com/facebook/metro/blob/febdba2383113c88296c61e28e4ef6a7f4939fda/packages/metro/src/lib/polyfills/require.js#L748-L774).
 * @param {*} module A Webpack module object.
 * @returns {boolean} Whether the exports are React component like.
 */
function isReactRefreshBoundary(module) {
  const moduleExports = getModuleExports(module);

  if (Refresh.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports === null || typeof moduleExports !== 'object') {
    return false;
  }

  var hasExports = false;
  var areAllExportsComponents = true;
  for (var key in moduleExports) {
    hasExports = true;

    // This is the ES Module indicator flag set by Webpack
    if (key === '__esModule') {
      continue;
    }

    // We can (and have to) safely execute getters here,
    // as Webpack manually assigns harmony exports to getters,
    // without any side-effects attached.
    // Ref: https://github.com/webpack/webpack/blob/b93048643fe74de2a6931755911da1212df55897/lib/MainTemplate.js#L281
    var exportValue = moduleExports[key];
    if (!Refresh.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }

  return hasExports && areAllExportsComponents;
}

/**
 * Performs a full refresh if React has unrecoverable errors.
 * @returns {void}
 */
function performFullRefreshIfNeeded() {
  if (Refresh.hasUnrecoverableErrors()) {
    window.location.reload();
  }
}

/**
 * Checks if exports are likely a React component and registers them.
 *
 * This implementation is based on the one in [Metro](https://github.com/facebook/metro/blob/febdba2383113c88296c61e28e4ef6a7f4939fda/packages/metro/src/lib/polyfills/require.js#L818-L835).
 * @param {*} module A Webpack module object.
 * @returns {void}
 */
function registerExportsForReactRefresh(module) {
  var moduleExports = getModuleExports(module);
  var moduleId = module.id;

  if (Refresh.isLikelyComponentType(moduleExports)) {
    // Register module.exports if it is likely a component
    Refresh.register(moduleExports, moduleId + ' %exports%');
  }

  if (moduleExports === null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over the exports.
    return;
  }

  for (var key in moduleExports) {
    // Skip registering the Webpack ES Module indicator
    if (key === '__esModule') {
      continue;
    }

    var exportValue = moduleExports[key];
    if (Refresh.isLikelyComponentType(exportValue)) {
      var typeID = moduleId + ' %exports% ' + key;
      Refresh.register(exportValue, typeID);
    }
  }
}

module.exports = Object.freeze({
  createHotErrorHandler,
  enqueueUpdate: createDebounceUpdate(),
  isReactRefreshBoundary,
  performFullRefreshIfNeeded,
  registerExportsForReactRefresh,
});
