const { Template } = require('webpack');
const getRefreshModuleRuntime = require('../../../loader/utils/getRefreshModuleRuntime');

describe('getRefreshModuleRuntime', () => {
  it('should return working refresh module runtime without const using CommonJS', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime(Template, {
      const: false,
      moduleSystem: 'cjs',
    });

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
  });

  it('should return working refresh module runtime with const using CommonJS', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime(Template, {
      const: true,
      moduleSystem: 'cjs',
    });

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

      function $ReactRefreshModuleRuntime$(exports) {
      	if (module.hot) {
      		let errorOverlay;
      		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
      			errorOverlay = __react_refresh_error_overlay__;
      		}
      		let testMode;
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
  });

  it('should return working refresh module runtime without const using ES Modules', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime(Template, {
      const: false,
      moduleSystem: 'esm',
    });

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
  });

  it('should return working refresh module runtime with const using ES Modules', () => {
    const refreshModuleRuntime = getRefreshModuleRuntime(Template, {
      const: true,
      moduleSystem: 'esm',
    });

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

      function $ReactRefreshModuleRuntime$(exports) {
      	if (import.meta.webpackHot) {
      		let errorOverlay;
      		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
      			errorOverlay = __react_refresh_error_overlay__;
      		}
      		let testMode;
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
  });
});
