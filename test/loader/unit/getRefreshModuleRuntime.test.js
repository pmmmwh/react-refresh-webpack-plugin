const getRefreshModuleRuntime = require('../../../loader/utils/getRefreshModuleRuntime');

describe('getRefreshModuleRuntime', () => {
  it('should return working refresh module runtime without const using CommonJS', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime({ const: false, moduleSystem: 'cjs' });

    expect(refreshModuleRuntime.indexOf('var')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('const')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('let')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('module.hot')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('import.meta.webpackHot')).toBe(-1);
    expect(refreshModuleRuntime).toMatchInlineSnapshot(`
      "var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
      var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
      	$ReactRefreshModuleId$
      );
      __react_refresh_utils__.registerExportsForReactRefresh(
      	$ReactRefreshCurrentExports$,
      	$ReactRefreshModuleId$
      );

      if (module.hot) {
      	var $ReactRefreshHotUpdate$ = !!module.hot.data;
      	var $ReactRefreshPrevExports$;
      	if ($ReactRefreshHotUpdate$) {
      		$ReactRefreshPrevExports$ = module.hot.data.prevExports;
      	}

      	if (__react_refresh_utils__.isReactRefreshBoundary($ReactRefreshCurrentExports$)) {
      		module.hot.dispose(
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
      		module.hot.accept(
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
      				module.hot.invalidate();
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
      			module.hot.invalidate();
      		}
      	}
      }"
    `);
  });

  it('should return working refresh module runtime with const using CommonJS', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime({ const: true, moduleSystem: 'cjs' });

    expect(refreshModuleRuntime.indexOf('var')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('const')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('let')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('module.hot')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('import.meta.webpackHot')).toBe(-1);
    expect(refreshModuleRuntime).toMatchInlineSnapshot(`
      "const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
      const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
      	$ReactRefreshModuleId$
      );
      __react_refresh_utils__.registerExportsForReactRefresh(
      	$ReactRefreshCurrentExports$,
      	$ReactRefreshModuleId$
      );

      if (module.hot) {
      	const $ReactRefreshHotUpdate$ = !!module.hot.data;
      	let $ReactRefreshPrevExports$;
      	if ($ReactRefreshHotUpdate$) {
      		$ReactRefreshPrevExports$ = module.hot.data.prevExports;
      	}

      	if (__react_refresh_utils__.isReactRefreshBoundary($ReactRefreshCurrentExports$)) {
      		module.hot.dispose(
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
      		module.hot.accept(
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
      				module.hot.invalidate();
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
      			module.hot.invalidate();
      		}
      	}
      }"
    `);
  });

  it('should return working refresh module runtime without const using ES Modules', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime({ const: false, moduleSystem: 'esm' });

    expect(refreshModuleRuntime.indexOf('var')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('const')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('let')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('module.hot')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('import.meta.webpackHot')).not.toBe(-1);
    expect(refreshModuleRuntime).toMatchInlineSnapshot(`
      "var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
      var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
      	$ReactRefreshModuleId$
      );
      __react_refresh_utils__.registerExportsForReactRefresh(
      	$ReactRefreshCurrentExports$,
      	$ReactRefreshModuleId$
      );

      if (import.meta.webpackHot) {
      	var $ReactRefreshHotUpdate$ = !!import.meta.webpackHot.data;
      	var $ReactRefreshPrevExports$;
      	if ($ReactRefreshHotUpdate$) {
      		$ReactRefreshPrevExports$ = import.meta.webpackHot.data.prevExports;
      	}

      	if (__react_refresh_utils__.isReactRefreshBoundary($ReactRefreshCurrentExports$)) {
      		import.meta.webpackHot.dispose(
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
      		import.meta.webpackHot.accept(
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
      				import.meta.webpackHot.invalidate();
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
      			import.meta.webpackHot.invalidate();
      		}
      	}
      }"
    `);
  });

  it('should return working refresh module runtime with const using ES Modules', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime({ const: true, moduleSystem: 'esm' });

    expect(refreshModuleRuntime.indexOf('var')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('const')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('let')).not.toBe(-1);
    expect(refreshModuleRuntime.indexOf('module.hot')).toBe(-1);
    expect(refreshModuleRuntime.indexOf('import.meta.webpackHot')).not.toBe(-1);
    expect(refreshModuleRuntime).toMatchInlineSnapshot(`
      "const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
      const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
      	$ReactRefreshModuleId$
      );
      __react_refresh_utils__.registerExportsForReactRefresh(
      	$ReactRefreshCurrentExports$,
      	$ReactRefreshModuleId$
      );

      if (import.meta.webpackHot) {
      	const $ReactRefreshHotUpdate$ = !!import.meta.webpackHot.data;
      	let $ReactRefreshPrevExports$;
      	if ($ReactRefreshHotUpdate$) {
      		$ReactRefreshPrevExports$ = import.meta.webpackHot.data.prevExports;
      	}

      	if (__react_refresh_utils__.isReactRefreshBoundary($ReactRefreshCurrentExports$)) {
      		import.meta.webpackHot.dispose(
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
      		import.meta.webpackHot.accept(
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
      				import.meta.webpackHot.invalidate();
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
      			import.meta.webpackHot.invalidate();
      		}
      	}
      }"
    `);
  });
});
