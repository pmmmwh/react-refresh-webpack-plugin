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
"var setup = function(moduleId) {
	var refresh = {
		moduleId: moduleId,
		register: function(type, id) {
			var typeId = moduleId + " " + id;
			refresh.runtime.register(type, typeId);
		},
		signature: function() { return refresh.runtime.createSignatureFunctionForTransform(); },
		runtime: {
			createSignatureFunctionForTransform: function() { return function(type) { return type; }; },
			register: function() {}
		},
	};
	return refresh;
}

__webpack_require__.i.push(function(options) {
	var originalFactory = options.factory;
	options.factory = function(moduleObject, moduleExports, webpackRequire) {
		var hotRequire = function(request) { return webpackRequire(request); };
		var createPropertyDescriptor = function(name) {
			return {
				configurable: true,
				enumerable: true,
				get: function() { return webpackRequire[name]; },
				set: function(value) {
					webpackRequire[name] = value;
				},
			};
		};
		for (var name in webpackRequire) {
			if (Object.prototype.hasOwnProperty.call(webpackRequire, name) && name !== "$Refresh$") {
				Object.defineProperty(hotRequire, name, createPropertyDescriptor(name));
			}
		}
		hotRequire.$Refresh$ = setup(options.id);
		originalFactory.call(this, moduleObject, moduleExports, hotRequire);
	};
});"
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
"const setup = (moduleId) => {
	const refresh = {
		moduleId: moduleId,
		register: (type, id) => {
			const typeId = moduleId + " " + id;
			refresh.runtime.register(type, typeId);
		},
		signature: () => (refresh.runtime.createSignatureFunctionForTransform()),
		runtime: {
			createSignatureFunctionForTransform: () => ((type) => (type)),
			register: x => {}
		},
	};
	return refresh;
}

__webpack_require__.i.push((options) => {
	const originalFactory = options.factory;
	options.factory = function(moduleObject, moduleExports, webpackRequire) {
		const hotRequire = (request) => (webpackRequire(request));
		const createPropertyDescriptor = (name) => {
			return {
				configurable: true,
				enumerable: true,
				get: () => (webpackRequire[name]),
				set: (value) => {
					webpackRequire[name] = value;
				},
			};
		};
		for (const name in webpackRequire) {
			if (Object.prototype.hasOwnProperty.call(webpackRequire, name) && name !== "$Refresh$") {
				Object.defineProperty(hotRequire, name, createPropertyDescriptor(name));
			}
		}
		hotRequire.$Refresh$ = setup(options.id);
		originalFactory.call(this, moduleObject, moduleExports, hotRequire);
	};
});"
`);
    expect(() => {
      eval(runtime);
    }).not.toThrow();
  });
});
