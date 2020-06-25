const validate = require('sourcemap-validator');
const getCompilation = require('../helpers/compilation');

describe('loader', () => {
  describe.skipIf(WEBPACK_VERSION === 5, 'on Webpack 4', () => {
    it('should work for CommonJS', async () => {
      const compilation = await getCompilation('./index.cjs.js');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
              "$RefreshRuntime$ = require('react-refresh/runtime');
              $RefreshSetup$(module.id);

              module.exports = 'Test';


              const currentExports = __react_refresh_utils__.getModuleExports(module.id);

              __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

              if (module.hot) {
                const isHotUpdate = !!module.hot.data;
                const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
                // FIXME: Revert after webpack/webpack#11059 is merged

                const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

                if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
                  module.hot.dispose(
                  /**
                   * A callback to performs a full refresh if React has unrecoverable errors,
                   * and also caches the to-be-disposed module.
                   * @param {*} data A hot module data object from Webpack HMR.
                   * @returns {void}
                   */
                  function hotDisposeCallback(data) {
                    // We have to mutate the data object to get data registered and cached
                    data.prevExports = currentExports;
                  });
                  module.hot.accept(
                  /**
                   * An error handler to allow self-recovering behaviours.
                   * @param {Error} error An error occurred during evaluation of a module.
                   * @returns {void}
                   */
                  function hotErrorHandler(error) {
                    if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                      __react_refresh_error_overlay__.handleRuntimeError(error);
                    }

                    if (isTestMode) {
                      if (window.onHotAcceptError) {
                        window.onHotAcceptError(error.message);
                      }
                    }

                    __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
                  });

                  if (isHotUpdate) {
                    if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                      module.hot.invalidate();
                    } else {
                      __react_refresh_utils__.enqueueUpdate(
                      /**
                       * A function to dismiss the error overlay after performing React refresh.
                       * @returns {void}
                       */
                      function updateCallback() {
                        if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                          __react_refresh_error_overlay__.clearRuntimeErrors();
                        }
                      });
                    }
                  }
                } else {
                  if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
                    module.hot.invalidate();
                  }
                }
              }"
          `);
      expect(execution).toMatchInlineSnapshot(`
              "(window[\\"webpackJsonp\\"] = window[\\"webpackJsonp\\"] || []).push([[\\"main\\"],{

              /***/ \\"./index.cjs.js\\":
              /*!**********************!*\\\\
                !*** ./index.cjs.js ***!
                \\\\**********************/
              /*! no static exports found */
              /***/ (function(module, exports, __webpack_require__) {

              $RefreshRuntime$ = __webpack_require__(/*! react-refresh/runtime */ \\"../../../node_modules/react-refresh/runtime.js\\");
              $RefreshSetup$(module.i);

              module.exports = 'Test';


              const currentExports = __react_refresh_utils__.getModuleExports(module.i);

              __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.i);

              if (true) {
                const isHotUpdate = !!module.hot.data;
                const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
                // FIXME: Revert after webpack/webpack#11059 is merged

                const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

                if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
                  module.hot.dispose(
                  /**
                   * A callback to performs a full refresh if React has unrecoverable errors,
                   * and also caches the to-be-disposed module.
                   * @param {*} data A hot module data object from Webpack HMR.
                   * @returns {void}
                   */
                  function hotDisposeCallback(data) {
                    // We have to mutate the data object to get data registered and cached
                    data.prevExports = currentExports;
                  });
                  module.hot.accept(
                  /**
                   * An error handler to allow self-recovering behaviours.
                   * @param {Error} error An error occurred during evaluation of a module.
                   * @returns {void}
                   */
                  function hotErrorHandler(error) {
                    if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                      __react_refresh_error_overlay__.handleRuntimeError(error);
                    }

                    if (isTestMode) {
                      if (window.onHotAcceptError) {
                        window.onHotAcceptError(error.message);
                      }
                    }

                    __webpack_require__.c[module.i].hot.accept(hotErrorHandler);
                  });

                  if (isHotUpdate) {
                    if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                      module.hot.invalidate();
                    } else {
                      __react_refresh_utils__.enqueueUpdate(
                      /**
                       * A function to dismiss the error overlay after performing React refresh.
                       * @returns {void}
                       */
                      function updateCallback() {
                        if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                          __react_refresh_error_overlay__.clearRuntimeErrors();
                        }
                      });
                    }
                  }
                } else {
                  if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
                    module.hot.invalidate();
                  }
                }
              }

              /***/ })

              },[[\\"./index.cjs.js\\",\\"runtime\\",\\"vendors\\"]]]);"
          `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should work for ES Modules', async () => {
      const compilation = await getCompilation('./index.esm.js');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
              "$RefreshRuntime$ = require('react-refresh/runtime');
              $RefreshSetup$(module.id);

              export default 'Test';


              const currentExports = __react_refresh_utils__.getModuleExports(module.id);

              __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

              if (module.hot) {
                const isHotUpdate = !!module.hot.data;
                const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
                // FIXME: Revert after webpack/webpack#11059 is merged

                const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

                if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
                  module.hot.dispose(
                  /**
                   * A callback to performs a full refresh if React has unrecoverable errors,
                   * and also caches the to-be-disposed module.
                   * @param {*} data A hot module data object from Webpack HMR.
                   * @returns {void}
                   */
                  function hotDisposeCallback(data) {
                    // We have to mutate the data object to get data registered and cached
                    data.prevExports = currentExports;
                  });
                  module.hot.accept(
                  /**
                   * An error handler to allow self-recovering behaviours.
                   * @param {Error} error An error occurred during evaluation of a module.
                   * @returns {void}
                   */
                  function hotErrorHandler(error) {
                    if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                      __react_refresh_error_overlay__.handleRuntimeError(error);
                    }

                    if (isTestMode) {
                      if (window.onHotAcceptError) {
                        window.onHotAcceptError(error.message);
                      }
                    }

                    __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
                  });

                  if (isHotUpdate) {
                    if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                      module.hot.invalidate();
                    } else {
                      __react_refresh_utils__.enqueueUpdate(
                      /**
                       * A function to dismiss the error overlay after performing React refresh.
                       * @returns {void}
                       */
                      function updateCallback() {
                        if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                          __react_refresh_error_overlay__.clearRuntimeErrors();
                        }
                      });
                    }
                  }
                } else {
                  if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
                    module.hot.invalidate();
                  }
                }
              }"
          `);
      expect(execution).toMatchInlineSnapshot(`
              "(window[\\"webpackJsonp\\"] = window[\\"webpackJsonp\\"] || []).push([[\\"main\\"],{

              /***/ \\"./index.esm.js\\":
              /*!**********************!*\\\\
                !*** ./index.esm.js ***!
                \\\\**********************/
              /*! exports provided: default */
              /***/ (function(module, __webpack_exports__, __webpack_require__) {

              \\"use strict\\";
              __webpack_require__.r(__webpack_exports__);
              $RefreshRuntime$ = __webpack_require__(/*! react-refresh/runtime */ \\"../../../node_modules/react-refresh/runtime.js\\");
              $RefreshSetup$(module.i);

              /* harmony default export */ __webpack_exports__[\\"default\\"] = ('Test');


              const currentExports = __react_refresh_utils__.getModuleExports(module.i);

              __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.i);

              if (true) {
                const isHotUpdate = !!module.hot.data;
                const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
                // FIXME: Revert after webpack/webpack#11059 is merged

                const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

                if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
                  module.hot.dispose(
                  /**
                   * A callback to performs a full refresh if React has unrecoverable errors,
                   * and also caches the to-be-disposed module.
                   * @param {*} data A hot module data object from Webpack HMR.
                   * @returns {void}
                   */
                  function hotDisposeCallback(data) {
                    // We have to mutate the data object to get data registered and cached
                    data.prevExports = currentExports;
                  });
                  module.hot.accept(
                  /**
                   * An error handler to allow self-recovering behaviours.
                   * @param {Error} error An error occurred during evaluation of a module.
                   * @returns {void}
                   */
                  function hotErrorHandler(error) {
                    if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                      __react_refresh_error_overlay__.handleRuntimeError(error);
                    }

                    if (isTestMode) {
                      if (window.onHotAcceptError) {
                        window.onHotAcceptError(error.message);
                      }
                    }

                    __webpack_require__.c[module.i].hot.accept(hotErrorHandler);
                  });

                  if (isHotUpdate) {
                    if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                      module.hot.invalidate();
                    } else {
                      __react_refresh_utils__.enqueueUpdate(
                      /**
                       * A function to dismiss the error overlay after performing React refresh.
                       * @returns {void}
                       */
                      function updateCallback() {
                        if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                          __react_refresh_error_overlay__.clearRuntimeErrors();
                        }
                      });
                    }
                  }
                } else {
                  if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
                    module.hot.invalidate();
                  }
                }
              }

              /***/ })

              },[[\\"./index.esm.js\\",\\"runtime\\",\\"vendors\\"]]]);"
          `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should generate valid source map when the `devtool` option is specified', async () => {
      const compilation = await getCompilation('./index.cjs.js', { devtool: 'source-map' });
      const { execution, sourceMap } = compilation.module;

      expect(sourceMap).toMatchInlineSnapshot(`
              "{
                \\"version\\": 3,
                \\"sources\\": [
                  \\"webpack:///./index.cjs.js\\"
                ],
                \\"names\\": [],
                \\"mappings\\": \\";;;;;;;;;;;;AAAA\\",
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

  describe.skipIf(WEBPACK_VERSION === 4, 'on Webpack 5', () => {
    it('should work for CommonJS', async () => {
      const compilation = await getCompilation('./index.cjs.js');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
              "$RefreshRuntime$ = require('react-refresh/runtime');
              $RefreshSetup$(module.id);

              module.exports = 'Test';


              const currentExports = __react_refresh_utils__.getModuleExports(module.id);

              __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

              if (module.hot) {
                const isHotUpdate = !!module.hot.data;
                const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
                // FIXME: Revert after webpack/webpack#11059 is merged

                const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

                if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
                  module.hot.dispose(
                  /**
                   * A callback to performs a full refresh if React has unrecoverable errors,
                   * and also caches the to-be-disposed module.
                   * @param {*} data A hot module data object from Webpack HMR.
                   * @returns {void}
                   */
                  function hotDisposeCallback(data) {
                    // We have to mutate the data object to get data registered and cached
                    data.prevExports = currentExports;
                  });
                  module.hot.accept(
                  /**
                   * An error handler to allow self-recovering behaviours.
                   * @param {Error} error An error occurred during evaluation of a module.
                   * @returns {void}
                   */
                  function hotErrorHandler(error) {
                    if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                      __react_refresh_error_overlay__.handleRuntimeError(error);
                    }

                    if (isTestMode) {
                      if (window.onHotAcceptError) {
                        window.onHotAcceptError(error.message);
                      }
                    }

                    __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
                  });

                  if (isHotUpdate) {
                    if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                      module.hot.invalidate();
                    } else {
                      __react_refresh_utils__.enqueueUpdate(
                      /**
                       * A function to dismiss the error overlay after performing React refresh.
                       * @returns {void}
                       */
                      function updateCallback() {
                        if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                          __react_refresh_error_overlay__.clearRuntimeErrors();
                        }
                      });
                    }
                  }
                } else {
                  if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
                    module.hot.invalidate();
                  }
                }
              }"
          `);
      expect(execution).toMatchInlineSnapshot(`
        "(window[\\"webpackJsonp\\"] = window[\\"webpackJsonp\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.cjs.js\\":
        /*!**********************!*\\\\
          !*** ./index.cjs.js ***!
          \\\\**********************/
        /*! unknown exports (runtime-defined) */
        /*! exports [maybe provided (runtime-defined)] [maybe used (runtime-defined)] */
        /*! runtime requirements: module, __webpack_require__, module.id */
        /***/ ((module, __unused_webpack_exports, __webpack_require__) => {

        $RefreshRuntime$ = __webpack_require__(/*! react-refresh/runtime */ \\"../../../node_modules/react-refresh/runtime.js\\");
        $RefreshSetup$(module.id);

        module.exports = 'Test';


        const currentExports = __react_refresh_utils__.getModuleExports(module.id);

        __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

        if (true) {
          const isHotUpdate = !!module.hot.data;
          const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
          // FIXME: Revert after webpack/webpack#11059 is merged

          const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

          if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
            module.hot.dispose(
            /**
             * A callback to performs a full refresh if React has unrecoverable errors,
             * and also caches the to-be-disposed module.
             * @param {*} data A hot module data object from Webpack HMR.
             * @returns {void}
             */
            function hotDisposeCallback(data) {
              // We have to mutate the data object to get data registered and cached
              data.prevExports = currentExports;
            });
            module.hot.accept(
            /**
             * An error handler to allow self-recovering behaviours.
             * @param {Error} error An error occurred during evaluation of a module.
             * @returns {void}
             */
            function hotErrorHandler(error) {
              if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                __react_refresh_error_overlay__.handleRuntimeError(error);
              }

              if (isTestMode) {
                if (window.onHotAcceptError) {
                  window.onHotAcceptError(error.message);
                }
              }

              __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
            });

            if (isHotUpdate) {
              if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                module.hot.invalidate();
              } else {
                __react_refresh_utils__.enqueueUpdate(
                /**
                 * A function to dismiss the error overlay after performing React refresh.
                 * @returns {void}
                 */
                function updateCallback() {
                  if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                    __react_refresh_error_overlay__.clearRuntimeErrors();
                  }
                });
              }
            }
          } else {
            if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
              module.hot.invalidate();
            }
          }
        }

        /***/ })

        },[[\\"./index.cjs.js\\",\\"runtime\\",\\"defaultVendors\\"]]]);"
      `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should work for ES Modules', async () => {
      const compilation = await getCompilation('./index.esm.js');
      const { execution, parsed } = compilation.module;

      expect(parsed).toMatchInlineSnapshot(`
              "$RefreshRuntime$ = require('react-refresh/runtime');
              $RefreshSetup$(module.id);

              export default 'Test';


              const currentExports = __react_refresh_utils__.getModuleExports(module.id);

              __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

              if (module.hot) {
                const isHotUpdate = !!module.hot.data;
                const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
                // FIXME: Revert after webpack/webpack#11059 is merged

                const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

                if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
                  module.hot.dispose(
                  /**
                   * A callback to performs a full refresh if React has unrecoverable errors,
                   * and also caches the to-be-disposed module.
                   * @param {*} data A hot module data object from Webpack HMR.
                   * @returns {void}
                   */
                  function hotDisposeCallback(data) {
                    // We have to mutate the data object to get data registered and cached
                    data.prevExports = currentExports;
                  });
                  module.hot.accept(
                  /**
                   * An error handler to allow self-recovering behaviours.
                   * @param {Error} error An error occurred during evaluation of a module.
                   * @returns {void}
                   */
                  function hotErrorHandler(error) {
                    if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                      __react_refresh_error_overlay__.handleRuntimeError(error);
                    }

                    if (isTestMode) {
                      if (window.onHotAcceptError) {
                        window.onHotAcceptError(error.message);
                      }
                    }

                    __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
                  });

                  if (isHotUpdate) {
                    if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                      module.hot.invalidate();
                    } else {
                      __react_refresh_utils__.enqueueUpdate(
                      /**
                       * A function to dismiss the error overlay after performing React refresh.
                       * @returns {void}
                       */
                      function updateCallback() {
                        if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                          __react_refresh_error_overlay__.clearRuntimeErrors();
                        }
                      });
                    }
                  }
                } else {
                  if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
                    module.hot.invalidate();
                  }
                }
              }"
          `);
      expect(execution).toMatchInlineSnapshot(`
        "(window[\\"webpackJsonp\\"] = window[\\"webpackJsonp\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.esm.js\\":
        /*!**********************!*\\\\
          !*** ./index.esm.js ***!
          \\\\**********************/
        /*! namespace exports */
        /*! export default [provided] [unused] [could be renamed] */
        /*! other exports [not provided] [unused] */
        /*! runtime requirements: module, __webpack_require__, module.id */
        /***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

        \\"use strict\\";
        $RefreshRuntime$ = __webpack_require__(/*! react-refresh/runtime */ \\"../../../node_modules/react-refresh/runtime.js\\");
        $RefreshSetup$(module.id);

        /* unused harmony default export */ var _unused_webpack_default_export = ('Test');


        const currentExports = __react_refresh_utils__.getModuleExports(module.id);

        __react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

        if (true) {
          const isHotUpdate = !!module.hot.data;
          const prevExports = isHotUpdate ? module.hot.data.prevExports : null; // This is a workaround for webpack/webpack#11057
          // FIXME: Revert after webpack/webpack#11059 is merged

          const isTestMode = typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__;

          if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
            module.hot.dispose(
            /**
             * A callback to performs a full refresh if React has unrecoverable errors,
             * and also caches the to-be-disposed module.
             * @param {*} data A hot module data object from Webpack HMR.
             * @returns {void}
             */
            function hotDisposeCallback(data) {
              // We have to mutate the data object to get data registered and cached
              data.prevExports = currentExports;
            });
            module.hot.accept(
            /**
             * An error handler to allow self-recovering behaviours.
             * @param {Error} error An error occurred during evaluation of a module.
             * @returns {void}
             */
            function hotErrorHandler(error) {
              if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                __react_refresh_error_overlay__.handleRuntimeError(error);
              }

              if (isTestMode) {
                if (window.onHotAcceptError) {
                  window.onHotAcceptError(error.message);
                }
              }

              __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
            });

            if (isHotUpdate) {
              if (__react_refresh_utils__.isReactRefreshBoundary(prevExports) && __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                module.hot.invalidate();
              } else {
                __react_refresh_utils__.enqueueUpdate(
                /**
                 * A function to dismiss the error overlay after performing React refresh.
                 * @returns {void}
                 */
                function updateCallback() {
                  if (typeof __react_refresh_error_overlay__ !== 'undefined' && __react_refresh_error_overlay__) {
                    __react_refresh_error_overlay__.clearRuntimeErrors();
                  }
                });
              }
            }
          } else {
            if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
              module.hot.invalidate();
            }
          }
        }

        /***/ })

        },[[\\"./index.esm.js\\",\\"runtime\\",\\"defaultVendors\\"]]]);"
      `);

      expect(compilation.errors).toStrictEqual([]);
      expect(compilation.warnings).toStrictEqual([]);
    });

    it('should generate valid source map when the `devtool` option is specified', async () => {
      const compilation = await getCompilation('./index.cjs.js', { devtool: 'source-map' });
      const { execution, sourceMap } = compilation.module;

      expect(sourceMap).toMatchInlineSnapshot(`
        "{
          \\"version\\": 3,
          \\"sources\\": [
            \\"webpack:///./index.cjs.js\\"
          ],
          \\"names\\": [],
          \\"mappings\\": \\";;;;;;;;;;;;;;AAAA\\",
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

  it('should generate valid source map when `undefined` source map is provided', async () => {
    const compilation = await getCompilation('./index.cjs.js', {
      devtool: 'source-map',
      prevSourceMap: undefined,
    });
    const { execution, sourceMap } = compilation.module;

    expect(() => {
      validate(execution, sourceMap);
    }).not.toThrow();
  });

  it('should generate valid source map when `null` source map is provided', async () => {
    const compilation = await getCompilation('./index.cjs.js', {
      devtool: 'source-map',
      prevSourceMap: null,
    });
    const { execution, sourceMap } = compilation.module;

    expect(() => {
      validate(execution, sourceMap);
    }).not.toThrow();
  });

  it('should generate valid source map when source map string is provided', async () => {
    const compilation = await getCompilation('./index.cjs.js', {
      devtool: 'source-map',
      prevSourceMap: JSON.stringify({
        version: 3,
        sources: ['./index.cjs.js'],
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
    const compilation = await getCompilation('./index.cjs.js', {
      devtool: 'source-map',
      prevSourceMap: {
        version: 3,
        sources: ['./index.cjs.js'],
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
});
