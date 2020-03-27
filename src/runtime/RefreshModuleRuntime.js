/* global $RefreshUtils$ */

/**
 * Code injected to each JS-like module for react-refresh capabilities.
 *
 * `$RefreshUtils$` is replaced to the actual utils during source parsing by `webpack.ProvidePlugin`.
 *
 * The function declaration syntax below is needed for `Template.getFunctionContent` to parse this.
 *
 * [Reference for Runtime Injection](https://github.com/webpack/webpack/blob/b07d3b67d2252f08e4bb65d354a11c9b69f8b434/lib/HotModuleReplacementPlugin.js#L419)
 * [Reference for HMR Error Recovery](https://github.com/webpack/webpack/issues/418#issuecomment-490296365)
 */
module.exports = function () {
  $RefreshUtils$.registerExportsForReactRefresh(module);

  if (module.hot && $RefreshUtils$.isReactRefreshBoundary(module)) {
    module.hot.dispose($RefreshUtils$.createHotDisposeCallback(module));
    module.hot.accept($RefreshUtils$.createHotErrorHandler(module.id));

    if (!!module.hot.data && !!Object.keys(module.hot.data).length) {
      if (
        !module.hot.data.module ||
        $RefreshUtils$.shouldInvalidateReactRefreshBoundary(module.hot.data.module, module)
      ) {
        window.location.reload();
      }
      $RefreshUtils$.enqueueUpdate();
    }
  }
};
