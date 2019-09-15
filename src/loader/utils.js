const Refresh = require('react-refresh/runtime');

/**
 * Performs a delayed React refresh.
 */
function enqueueUpdate() {
  /**
   * A cached setTimeout handler.
   * @type {number | void}
   */
  let refreshTimeout = undefined;

  /**
   * Caches the refresh timer.
   */
  function _execute() {
    if (refreshTimeout === undefined) {
      refreshTimeout = setTimeout(() => {
        refreshTimeout = undefined;
        Refresh.performReactRefresh();
      }, 30);
    }
  }

  return _execute();
}

/**
 * Checks if exports are likely a React component.
 *
 * This implementation is cherry-picked from [Metro](https://github.com/facebook/metro/blob/febdba2383113c88296c61e28e4ef6a7f4939fda/packages/metro/src/lib/polyfills/require.js#L748-L774).
 *
 * @param {*} moduleExports A webpack module.exports object.
 * @returns {boolean} Whether the exports are React component like.
 */
function isReactRefreshBoundary(moduleExports) {
  if (Refresh.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports === null || typeof moduleExports !== 'object') {
    return false;
  }

  let hasExports = false;
  let areAllExportsComponents = true;
  for (const key in moduleExports) {
    hasExports = true;
    if (key === '__esModule') {
      continue;
    }

    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      return false;
    }

    const exportValue = moduleExports[key];
    if (!Refresh.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }

  return hasExports && areAllExportsComponents;
}

module.exports.enqueueUpdate = enqueueUpdate;
module.exports.isReactRefreshBoundary = isReactRefreshBoundary;
