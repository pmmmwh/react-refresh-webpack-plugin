/*
global
__react_refresh_error_overlay__,
__react_refresh_test__,
__react_refresh_utils__,
__webpack_hot__,
__webpack_require__
*/
/* eslint-disable no-undef */

// TODO: Consider refactoring to use `Template.asString` instead of a template file

/**
 * Code appended to each JS-like module for react-refresh capabilities.
 *
 * `__react_refresh_utils__` will be replaced with actual utils during source parsing by `webpack.ProvidePlugin`.
 *
 * The function declaration syntax below is needed for `Template.getFunctionContent` to parse this.
 *
 * [Reference for Runtime Injection](https://github.com/webpack/webpack/blob/b07d3b67d2252f08e4bb65d354a11c9b69f8b434/lib/HotModuleReplacementPlugin.js#L419)
 * [Reference for HMR Error Recovery](https://github.com/webpack/webpack/issues/418#issuecomment-490296365)
 */
module.exports = function () {
  /** @const */ $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
  /** @const */ $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
    $ReactRefreshModuleId$
  );
  __react_refresh_utils__.registerExportsForReactRefresh(
    $ReactRefreshCurrentExports$,
    $ReactRefreshModuleId$
  );

  if (__webpack_hot__) {
    /** @const */ $ReactRefreshHotUpdate$ = !!__webpack_hot__.data;
    /** @let */ $ReactRefreshPrevExports$;
    if ($ReactRefreshHotUpdate$) {
      $ReactRefreshPrevExports$ = __webpack_hot__.data.prevExports;
    }

    if (__react_refresh_utils__.isReactRefreshBoundary($ReactRefreshCurrentExports$)) {
      __webpack_hot__.dispose(
        /**
         * A callback to performs a full refresh if React has unrecoverable errors,
         * and also caches the to-be-disposed module.
         * @param {*} data A hot module data object from Webpack HMR.
         * @returns {void}
         */
        function hotDisposeCallback(data) {
          // We have to mutate the data object to get data registered and cached
          data.prevExports = $ReactRefreshCurrentExports$;
        }
      );
      __webpack_hot__.accept(
        /**
         * An error handler to allow self-recovering behaviours.
         * @param {Error} error An error occurred during evaluation of a module.
         * @returns {void}
         */
        function hotErrorHandler(error) {
          if (
            typeof __react_refresh_error_overlay__ !== 'undefined' &&
            __react_refresh_error_overlay__
          ) {
            __react_refresh_error_overlay__.handleRuntimeError(error);
          }

          if (typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__) {
            if (window.onHotAcceptError) {
              window.onHotAcceptError(error.message);
            }
          }

          __webpack_require__.c[$ReactRefreshModuleId$].hot.accept(hotErrorHandler);
        }
      );

      if ($ReactRefreshHotUpdate$) {
        if (
          __react_refresh_utils__.isReactRefreshBoundary($ReactRefreshPrevExports$) &&
          __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(
            $ReactRefreshPrevExports$,
            $ReactRefreshCurrentExports$
          )
        ) {
          __webpack_hot__.invalidate();
        } else {
          __react_refresh_utils__.enqueueUpdate(
            /**
             * A function to dismiss the error overlay after performing React refresh.
             * @returns {void}
             */
            function updateCallback() {
              if (
                typeof __react_refresh_error_overlay__ !== 'undefined' &&
                __react_refresh_error_overlay__
              ) {
                __react_refresh_error_overlay__.clearRuntimeErrors();
              }
            }
          );
        }
      }
    } else {
      if ($ReactRefreshHotUpdate$ && typeof $ReactRefreshPrevExports$ !== 'undefined') {
        __webpack_hot__.invalidate();
      }
    }
  }
};
