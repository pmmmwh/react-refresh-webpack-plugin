/**
 * Gets current bundle's global scope identifier for React Refresh.
 * @param {Record<string, string>} runtimeGlobals The Webpack runtime globals.
 * @returns {string} The React Refresh global scope within the Webpack bundle.
 */
module.exports.getRefreshGlobalScope = (runtimeGlobals) => {
  return `${runtimeGlobals.require || '__webpack_require__'}.$Refresh$`;
};
