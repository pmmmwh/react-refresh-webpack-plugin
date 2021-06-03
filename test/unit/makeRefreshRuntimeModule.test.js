const makeRefreshRuntimeModule = require('../../lib/utils/makeRefreshRuntimeModule');

describe.skipIf(WEBPACK_VERSION !== 5, 'makeRefreshRuntimeModule', () => {
  beforeEach(() => {
    global.__webpack_require__ = { i: [] };
  });

  afterAll(() => {
    delete global.__webpack_require__;
  });

  it('should make runtime module', () => {
    const webpack = require('webpack');

    let RefreshRuntimeModule;
    expect(() => {
      RefreshRuntimeModule = makeRefreshRuntimeModule(webpack);
    }).not.toThrow();

    expect(() => {
      new RefreshRuntimeModule();
    }).not.toThrow();
  });

  it('should generate with ES5 settings', () => {
    const webpack = require('webpack');
    const RuntimeTemplate = require('webpack/lib/RuntimeTemplate');

    const RefreshRuntimeModule = makeRefreshRuntimeModule(webpack);
    const instance = new RefreshRuntimeModule();
    instance.compilation = {
      runtimeTemplate: new RuntimeTemplate(
        {},
        { environment: { arrowFunction: false, const: false } },
        (i) => i
      ),
    };

    const runtime = instance.generate();
    expect(runtime).toMatchInlineSnapshot(`
      "__webpack_require__.i.push(function(options) {
      	var originalFactory = options.factory;
      	options.factory = function(moduleObject, moduleExports, webpackRequire) {
      		__webpack_require__.$Refresh$.setup(options.id);
      		try {
      			originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
      		} finally {
      			__webpack_require__.$Refresh$.cleanup(options.id);
      		}
      	}
      })

      __webpack_require__.$Refresh$ = {
      	register: function() { return undefined; },
      	signature: function() { return function(type) { return type; }; },
      	setup: function(currentModuleId) {
      		var prevModuleId = __webpack_require__.$Refresh$.moduleId;
      		var prevRuntime = __webpack_require__.$Refresh$.runtime;
      		var prevRegister = __webpack_require__.$Refresh$.register;
      		var prevSignature = __webpack_require__.$Refresh$.signature;
      		var prevCleanup = __webpack_require__.$Refresh$.cleanup;

      		__webpack_require__.$Refresh$.moduleId = currentModuleId;

      		__webpack_require__.$Refresh$.runtime = {
      			createSignatureFunctionForTransform: function() { return function(type) { return type; }; },
      			register: function() { return undefined; }
      		};

      		__webpack_require__.$Refresh$.register = function(type, id) {
      			var typeId = currentModuleId + \\" \\" + id;
      			__webpack_require__.$Refresh$.runtime.register(type, typeId);
      		}

      		__webpack_require__.$Refresh$.signature = __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform;

      		__webpack_require__.$Refresh$.cleanup = function(cleanupModuleId) {
      			if (currentModuleId === cleanupModuleId) {
      				__webpack_require__.$Refresh$.moduleId = prevModuleId;
      				__webpack_require__.$Refresh$.runtime = prevRuntime;
      				__webpack_require__.$Refresh$.register = prevRegister;
      				__webpack_require__.$Refresh$.signature = prevSignature;
      				__webpack_require__.$Refresh$.cleanup = prevCleanup;
      			}
      		}
      	}
      };"
    `);
    expect(() => {
      eval(runtime);
    }).not.toThrow();
  });

  it('should make working runtime module with ES6 settings', () => {
    const webpack = require('webpack');
    const RuntimeTemplate = require('webpack/lib/RuntimeTemplate');

    const RefreshRuntimeModule = makeRefreshRuntimeModule(webpack);
    const instance = new RefreshRuntimeModule();
    instance.compilation = {
      runtimeTemplate: new RuntimeTemplate(
        {},
        { environment: { arrowFunction: true, const: true } },
        (i) => i
      ),
    };

    const runtime = instance.generate();
    expect(runtime).toMatchInlineSnapshot(`
      "__webpack_require__.i.push((options) => {
      	const originalFactory = options.factory;
      	options.factory = (moduleObject, moduleExports, webpackRequire) => {
      		__webpack_require__.$Refresh$.setup(options.id);
      		try {
      			originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
      		} finally {
      			__webpack_require__.$Refresh$.cleanup(options.id);
      		}
      	}
      })

      __webpack_require__.$Refresh$ = {
      	register: () => (undefined),
      	signature: () => ((type) => (type)),
      	setup: (currentModuleId) => {
      		const prevModuleId = __webpack_require__.$Refresh$.moduleId;
      		const prevRuntime = __webpack_require__.$Refresh$.runtime;
      		const prevRegister = __webpack_require__.$Refresh$.register;
      		const prevSignature = __webpack_require__.$Refresh$.signature;
      		const prevCleanup = __webpack_require__.$Refresh$.cleanup;

      		__webpack_require__.$Refresh$.moduleId = currentModuleId;

      		__webpack_require__.$Refresh$.runtime = {
      			createSignatureFunctionForTransform: () => ((type) => (type)),
      			register: () => (undefined)
      		};

      		__webpack_require__.$Refresh$.register = (type, id) => {
      			const typeId = currentModuleId + \\" \\" + id;
      			__webpack_require__.$Refresh$.runtime.register(type, typeId);
      		}

      		__webpack_require__.$Refresh$.signature = __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform;

      		__webpack_require__.$Refresh$.cleanup = (cleanupModuleId) => {
      			if (currentModuleId === cleanupModuleId) {
      				__webpack_require__.$Refresh$.moduleId = prevModuleId;
      				__webpack_require__.$Refresh$.runtime = prevRuntime;
      				__webpack_require__.$Refresh$.register = prevRegister;
      				__webpack_require__.$Refresh$.signature = prevSignature;
      				__webpack_require__.$Refresh$.cleanup = prevCleanup;
      			}
      		}
      	}
      };"
    `);
    expect(() => {
      eval(runtime);
    }).not.toThrow();
  });
});
