const validate = require('sourcemap-validator');
const mockFetch = require('../mocks/fetch');

describe('loader', () => {
  let getCompilation;

  beforeEach(() => {
    jest.isolateModules(() => {
      getCompilation = require('../helpers/compilation');
    });
  });

  describe('on Webpack 5', () => {
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
       "(self["webpackChunkcjs"] = self["webpackChunkcjs"] || []).push([["main"],{

       /***/ "./index.js":
       /*!******************!*\\
         !*** ./index.js ***!
         \\******************/
       /***/ ((module, __unused_webpack_exports, __webpack_require__) => {

       __webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh */ "../../../../node_modules/react-refresh/runtime.js");

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
       /******/ __webpack_require__.O(0, ["defaultVendors"], () => (__webpack_exec__("./index.js")));
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
        "import * as __react_refresh_runtime__ from 'react-refresh';
        __webpack_require__.$Refresh$.runtime = __react_refresh_runtime__;

        export default 'Test';


        var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
        var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
        	$ReactRefreshModuleId$
        );

        function $ReactRefreshModuleRuntime$(exports) {
        	if (import.meta.webpackHot) {
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
        			import.meta.webpackHot,
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
       ""use strict";
       (self["webpackChunkesm"] = self["webpackChunkesm"] || []).push([["main"],{

       /***/ "./index.js":
       /*!******************!*\\
         !*** ./index.js ***!
         \\******************/
       /***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

       var react_refresh__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
       __webpack_require__.r(__webpack_exports__);
       /* harmony export */ __webpack_require__.d(__webpack_exports__, {
       /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
       /* harmony export */ });
       /* harmony import */ var react_refresh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-refresh */ "../../../../node_modules/react-refresh/runtime.js");

       __webpack_require__.$Refresh$.runtime = /*#__PURE__*/ (react_refresh__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react_refresh__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react_refresh__WEBPACK_IMPORTED_MODULE_0__, 2)));

       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('Test');


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
       			__webpack_module__.hot,
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
       /******/ __webpack_require__.O(0, ["defaultVendors"], () => (__webpack_exec__("./index.js")));
       /******/ var __webpack_exports__ = __webpack_require__.O();
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
         "version": 3,
         "file": "main.js",
         "mappings": ";;;;;;;;;;AAAA",
         "sources": [
           "webpack://cjs/./index.js"
         ],
         "sourcesContent": [
           "module.exports = 'Test';\\n"
         ],
         "names": [],
         "sourceRoot": ""
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
