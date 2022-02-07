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
        "__webpack_require__.$Refresh$.runtime = require('react-refresh');

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (module.hot) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
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

        __webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh */ \\"../../../../node_modules/react-refresh/runtime.js\\");

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (true) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
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
        "__webpack_require__.$Refresh$.runtime = require('react-refresh');

        export default 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (module.hot) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
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
        __webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh */ \\"../../../../node_modules/react-refresh/runtime.js\\");

        /* harmony default export */ __webpack_exports__[\\"default\\"] = ('Test');


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (true) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
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
        "__webpack_require__.$Refresh$.runtime = require('react-refresh');

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (module.hot) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
        }"
      `);
      expect(execution).toMatchInlineSnapshot(`
        "(self[\\"webpackChunkcjs\\"] = self[\\"webpackChunkcjs\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.js\\":
        /*!******************!*\\\\
          !*** ./index.js ***!
          \\\\******************/
        /***/ ((module, __unused_webpack_exports, __webpack_require__) => {

        __webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh */ \\"../../../../node_modules/react-refresh/runtime.js\\");

        module.exports = 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (true) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
        }

        /***/ })

        },
        /******/ __webpack_require__ => { // webpackRuntimeModules
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
        "__webpack_require__.$Refresh$.runtime = require('react-refresh');

        export default 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (module.hot) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
        }"
      `);
      expect(execution).toMatchInlineSnapshot(`
        "\\"use strict\\";
        (self[\\"webpackChunkesm\\"] = self[\\"webpackChunkesm\\"] || []).push([[\\"main\\"],{

        /***/ \\"./index.js\\":
        /*!******************!*\\\\
          !*** ./index.js ***!
          \\\\******************/
        /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */   \\"default\\": () => (__WEBPACK_DEFAULT_EXPORT__)
        /* harmony export */ });
        __webpack_require__.$Refresh$.runtime = require('react-refresh');

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('Test');


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (module.hot) {
        		var errorOverlay;
        		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
        			errorOverlay = __react_refresh_error_overlay__;
        		}
        		var testMode;
        		if (typeof __react_refresh_test__ !== 'undefined') {
        			testMode = __react_refresh_test__;
        		}
        		return __react_refresh_utils__.executeRuntime(
        			exports,
        			$ReactRefreshModuleId$,
        			module.hot,
        			errorOverlay,
        			testMode
        		);
        	}
        }

        if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
        	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
        } else {
        	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
        }

        /***/ })

        },
        /******/ __webpack_require__ => { // webpackRuntimeModules
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
          \\"file\\": \\"main.js\\",
          \\"mappings\\": \\";;;;;;;;;;AAAA\\",
          \\"sources\\": [
            \\"webpack://cjs/./index.js\\"
          ],
          \\"sourcesContent\\": [
            \\"module.exports = 'Test';\\\\n\\"
          ],
          \\"names\\": [],
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
