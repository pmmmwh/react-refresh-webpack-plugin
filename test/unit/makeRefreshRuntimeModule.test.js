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
      	options.factory = function (moduleObject, moduleExports, webpackRequire) {
      		__webpack_require__.$Refresh$.setup(options.id);
      		try {
      			originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
      		} finally {
      			if (typeof Promise !== 'undefined' && moduleObject.exports instanceof Promise) {
      				options.module.exports = options.module.exports.then(
      					function(result) {
      						__webpack_require__.$Refresh$.cleanup(options.id);
      						return result;
      					},
      					function(reason) {
      						__webpack_require__.$Refresh$.cleanup(options.id);
      						return Promise.reject(reason);
      					}
      				);
      			} else {
      				__webpack_require__.$Refresh$.cleanup(options.id)
      			}
      		}
      	};
      })

      __webpack_require__.$Refresh$ = {
      	register: function() { return undefined; },
      	signature: function() { return function(type) { return type; }; },
      	runtime: {
      		createSignatureFunctionForTransform: function() { return function(type) { return type; }; },
      		register: function() { return undefined; }
      	},
      	setup: function(currentModuleId) {
      		var prevModuleId = __webpack_require__.$Refresh$.moduleId;
      		var prevRegister = __webpack_require__.$Refresh$.register;
      		var prevSignature = __webpack_require__.$Refresh$.signature;
      		var prevCleanup = __webpack_require__.$Refresh$.cleanup;

      		__webpack_require__.$Refresh$.moduleId = currentModuleId;

      		__webpack_require__.$Refresh$.register = function(type, id) {
      			var typeId = currentModuleId + \\" \\" + id;
      			__webpack_require__.$Refresh$.runtime.register(type, typeId);
      		}

      		__webpack_require__.$Refresh$.signature = function() { return __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform(); };

      		__webpack_require__.$Refresh$.cleanup = function(cleanupModuleId) {
      			if (currentModuleId === cleanupModuleId) {
      				__webpack_require__.$Refresh$.moduleId = prevModuleId;
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
      	options.factory = function (moduleObject, moduleExports, webpackRequire) {
      		__webpack_require__.$Refresh$.setup(options.id);
      		try {
      			originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
      		} finally {
      			if (typeof Promise !== 'undefined' && moduleObject.exports instanceof Promise) {
      				options.module.exports = options.module.exports.then(
      					(result) => {
      						__webpack_require__.$Refresh$.cleanup(options.id);
      						return result;
      					},
      					(reason) => {
      						__webpack_require__.$Refresh$.cleanup(options.id);
      						return Promise.reject(reason);
      					}
      				);
      			} else {
      				__webpack_require__.$Refresh$.cleanup(options.id)
      			}
      		}
      	};
      })

      __webpack_require__.$Refresh$ = {
      	register: () => (undefined),
      	signature: () => ((type) => (type)),
      	runtime: {
      		createSignatureFunctionForTransform: () => ((type) => (type)),
      		register: () => (undefined)
      	},
      	setup: (currentModuleId) => {
      		const prevModuleId = __webpack_require__.$Refresh$.moduleId;
      		const prevRegister = __webpack_require__.$Refresh$.register;
      		const prevSignature = __webpack_require__.$Refresh$.signature;
      		const prevCleanup = __webpack_require__.$Refresh$.cleanup;

      		__webpack_require__.$Refresh$.moduleId = currentModuleId;

      		__webpack_require__.$Refresh$.register = (type, id) => {
      			const typeId = currentModuleId + \\" \\" + id;
      			__webpack_require__.$Refresh$.runtime.register(type, typeId);
      		}

      		__webpack_require__.$Refresh$.signature = () => (__webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform());

      		__webpack_require__.$Refresh$.cleanup = (cleanupModuleId) => {
      			if (currentModuleId === cleanupModuleId) {
      				__webpack_require__.$Refresh$.moduleId = prevModuleId;
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
