const validate = require('sourcemap-validator');
const mockFetch = require('../mocks/fetch');

describe('loader', () => {
  let getCompilation;

  beforeEach(() => {
    jest.isolateModules(() => {
      getCompilation = require('../helpers/compilation');
    });
  });

  describe.skipIf(WEBPACK_VERSION !== 4, 'on Webpack 4', () => {
    it('should work for CommonJS', async () => {
      const compilation = await getCompilation('cjs');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
        "__webpack_require__.$Refresh$.runtime = require('react-refresh/runtime.js');

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
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
      expect(execution).toMatchInlineSnapshot(`
        "(window[\\"webpackJsonp\\"] = window[\\"webpackJsonp\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.js\\":
        /*!******************!*\\\\
          !*** ./index.js ***!
          \\\\******************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

        __webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh/runtime.js */ \\"../../../../node_modules/react-refresh/runtime.js\\");

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );
        __react_refresh_utils__.registerExportsForReactRefresh(
        	$ReactRefreshCurrentExports$,
        	$ReactRefreshModuleId$
        );

        if (true) {
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
        }

        /***/ })

        },[[\\"./index.js\\",\\"runtime\\",\\"vendors\\"]]]);"
      `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should work for ES Modules', async () => {
      const compilation = await getCompilation('esm');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
        "__webpack_require__.$Refresh$.runtime = require('react-refresh/runtime.js');

        export default 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
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
      expect(execution).toMatchInlineSnapshot(`
        "(window[\\"webpackJsonp\\"] = window[\\"webpackJsonp\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.js\\":
        /*!******************!*\\\\
          !*** ./index.js ***!
          \\\\******************/
        /*! exports provided: default */
        /***/ (function(module, __webpack_exports__, __webpack_require__) {

        \\"use strict\\";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh/runtime.js */ \\"../../../../node_modules/react-refresh/runtime.js\\");

        /* harmony default export */ __webpack_exports__[\\"default\\"] = ('Test');


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );
        __react_refresh_utils__.registerExportsForReactRefresh(
        	$ReactRefreshCurrentExports$,
        	$ReactRefreshModuleId$
        );

        if (true) {
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
        }

        /***/ })

        },[[\\"./index.js\\",\\"runtime\\",\\"vendors\\"]]]);"
      `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should generate valid source map when the "devtool" option is specified', async () => {
      const compilation = await getCompilation('cjs', { devtool: 'source-map' });
      const { execution, sourceMap } = compilation.module;

      expect(sourceMap).toMatchInlineSnapshot(`
        "{
          \\"version\\": 3,
          \\"sources\\": [
            \\"webpack:///./index.js\\"
          ],
          \\"names\\": [],
          \\"mappings\\": \\";;;;;;;;;;;AAAA\\",
          \\"file\\": \\"main.js\\",
          \\"sourcesContent\\": [
            \\"module.exports = 'Test';\\\\n\\"
          ],
          \\"sourceRoot\\": \\"\\"
        }"
      `);
      expect(() => {
        validate(execution, sourceMap);
      }).not.toThrow();
    });
  });

  describe.skipIf(WEBPACK_VERSION !== 5, 'on Webpack 5', () => {
    it('should work for CommonJS', async () => {
      const compilation = await getCompilation('cjs');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
        "__webpack_require__.$Refresh$.runtime = require('react-refresh/runtime.js');

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
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
      expect(execution).toMatchInlineSnapshot(`
        "(self[\\"webpackChunkcjs\\"] = self[\\"webpackChunkcjs\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.js\\":
        /*!******************!*\\\\
          !*** ./index.js ***!
          \\\\******************/
        /***/ ((module, __unused_webpack_exports, __webpack_require__) => {

        __webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh/runtime.js */ \\"../../../../node_modules/react-refresh/runtime.js\\");

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );
        __react_refresh_utils__.registerExportsForReactRefresh(
        	$ReactRefreshCurrentExports$,
        	$ReactRefreshModuleId$
        );

        if (true) {
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
        }

        /***/ })

        },
        /******/ __webpack_require__ => { // webpackRuntimeModules
        /******/ \\"use strict\\";
        /******/ 
        /******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
        /******/ __webpack_require__.O(0, [\\"defaultVendors\\"], () => (__webpack_exec__(\\"./index.js\\")));
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ }
        ]);"
      `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should work for ES Modules', async () => {
      const compilation = await getCompilation('esm');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
        "__webpack_require__.$Refresh$.runtime = require('react-refresh/runtime.js');

        export default 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
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
      expect(execution).toMatchInlineSnapshot(`
        "(self[\\"webpackChunkesm\\"] = self[\\"webpackChunkesm\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.js\\":
        /*!******************!*\\\\
          !*** ./index.js ***!
          \\\\******************/
        /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

        \\"use strict\\";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */   \\"default\\": () => (__WEBPACK_DEFAULT_EXPORT__)
        /* harmony export */ });
        __webpack_require__.$Refresh$.runtime = require('react-refresh/runtime.js');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('Test');


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
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
        }

        /***/ })

        },
        /******/ __webpack_require__ => { // webpackRuntimeModules
        /******/ \\"use strict\\";
        /******/ 
        /******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
        /******/ var __webpack_exports__ = (__webpack_exec__(\\"./index.js\\"));
        /******/ }
        ]);"
      `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should generate valid source map when the "devtool" option is specified', async () => {
      const compilation = await getCompilation('cjs', { devtool: 'source-map' });
      const { execution, sourceMap } = compilation.module;

      expect(sourceMap).toMatchInlineSnapshot(`
        "{
          \\"version\\": 3,
          \\"sources\\": [
            \\"webpack://cjs/./index.js\\"
          ],
          \\"names\\": [],
          \\"mappings\\": \\";;;;;;;;;;AAAA\\",
          \\"file\\": \\"main.js\\",
          \\"sourcesContent\\": [
            \\"module.exports = 'Test';\\\\n\\"
          ],
          \\"sourceRoot\\": \\"\\"
        }"
      `);
      expect(() => {
        validate(execution, sourceMap);
      }).not.toThrow();
    });
  });

  it('should generate valid source map when undefined source map is provided', async () => {
    const compilation = await getCompilation('cjs', {
      devtool: 'source-map',
      prevSourceMap: undefined,
    });
    const { execution, sourceMap } = compilation.module;

    expect(() => {
      validate(execution, sourceMap);
    }).not.toThrow();
  });

  it('should generate valid source map when null source map is provided', async () => {
    const compilation = await getCompilation('cjs', {
      devtool: 'source-map',
      prevSourceMap: null,
    });
    const { execution, sourceMap } = compilation.module;

    expect(() => {
      validate(execution, sourceMap);
    }).not.toThrow();
  });

  it('should generate valid source map when source map string is provided', async () => {
    const compilation = await getCompilation('cjs', {
      devtool: 'source-map',
      prevSourceMap: JSON.stringify({
        version: 3,
        sources: ['cjs'],
        names: [],
        mappings: 'AAAA;AACA',
        sourcesContent: ["module.exports = 'Test';\n"],
      }),
    });
    const { execution, sourceMap } = compilation.module;

    expect(() => {
      validate(execution, sourceMap);
    }).not.toThrow();
  });

  it('should generate valid source map when source map object is provided', async () => {
    const compilation = await getCompilation('cjs', {
      devtool: 'source-map',
      prevSourceMap: {
        version: 3,
        sources: ['cjs'],
        names: [],
        mappings: 'AAAA;AACA',
        sourcesContent: ["module.exports = 'Test';\n"],
      },
    });
    const { execution, sourceMap } = compilation.module;

    expect(() => {
      validate(execution, sourceMap);
    }).not.toThrow();
  });

  it('should work with global fetch polyfill', async () => {
    const [fetch] = mockFetch();

    await expect(getCompilation('cjs')).resolves.not.toThrow();
    expect(global.fetch).toStrictEqual(fetch);
  });
});
