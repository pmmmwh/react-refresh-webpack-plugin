/* global __react_refresh_utils__ */

/**
 * Code appended to each JS-like module for react-refresh capabilities.
 *
 * `$RefreshUtils$` is replaced to the actual utils during source parsing by `webpack.ProvidePlugin`.
 *
 * The function declaration syntax below is needed for `Template.getFunctionContent` to parse this.
 *
 * [Reference for Runtime Injection](https://github.com/webpack/webpack/blob/b07d3b67d2252f08e4bb65d354a11c9b69f8b434/lib/HotModuleReplacementPlugin.js#L419)
 * [Reference for HMR Error Recovery](https://github.com/webpack/webpack/issues/418#issuecomment-490296365)
 */
module.exports = function () {
  const currentExports = __react_refresh_utils__.getModuleExports(module);
  __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

  if (module.hot) {
    const isHotUpdate = !!module.hot.data;
    const prevExports = isHotUpdate ? module.hot.data.prevExports : null;

    if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
      module.hot.dispose(__react_refresh_utils__.createHotDisposeCallback(currentExports));
      module.hot.accept(__react_refresh_utils__.createHotErrorHandler(module.id));

      if (isHotUpdate) {
        if (
          __react_refresh_utils__.isReactRefreshBoundary(prevExports) &&
          __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)
        ) {
          module.hot.invalidate();
        } else {
          __react_refresh_utils__.enqueueUpdate();
        }
      }
    } else {
      if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
        module.hot.invalidate();
      }
    }
  }
};
