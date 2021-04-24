const getRefreshGlobal = require('../../lib/utils/getRefreshGlobal');

describe('getRefreshGlobal', () => {
  beforeEach(() => {
    global.__webpack_require__ = {};
  });

  afterAll(() => {
    delete global.__webpack_require__;
  });

  it('should return working refresh global without providing runtime template', () => {
    const refreshGlobalTemplate = getRefreshGlobal();
    expect(refreshGlobalTemplate).toMatchInlineSnapshot(`
      "__webpack_require__.$Refresh$ = {
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
      eval(refreshGlobalTemplate);
    }).not.toThrow();

    const refreshGlobal = global.__webpack_require__.$Refresh$;
    expect(() => {
      refreshGlobal.setup('1');
    }).not.toThrow();
    expect(refreshGlobal.moduleId).toBe('1');
    expect(typeof refreshGlobal.runtime).toBe('object');
    expect(typeof refreshGlobal.runtime.createSignatureFunctionForTransform).toBe('function');
    expect(typeof refreshGlobal.runtime.register).toBe('function');
    expect(typeof refreshGlobal.cleanup).toBe('function');
    expect(typeof refreshGlobal.register).toBe('function');
    expect(typeof refreshGlobal.signature).toBe('function');
  });

  it.skipIf(
    WEBPACK_VERSION !== 5,
    'should return working refresh global with provided runtime template',
    () => {
      const RuntimeTemplate = require('webpack/lib/RuntimeTemplate');
      const refreshGlobalTemplate = getRefreshGlobal(
        new RuntimeTemplate({}, { environment: { arrowFunction: true, const: true } }, (i) => i)
      );
      expect(refreshGlobalTemplate).toMatchInlineSnapshot(`
        "__webpack_require__.$Refresh$ = {
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
        eval(refreshGlobalTemplate);
      }).not.toThrow();

      const refreshGlobal = global.__webpack_require__.$Refresh$;
      expect(() => {
        refreshGlobal.setup('1');
      }).not.toThrow();
      expect(refreshGlobal.moduleId).toBe('1');
      expect(typeof refreshGlobal.runtime).toBe('object');
      expect(typeof refreshGlobal.runtime.createSignatureFunctionForTransform).toBe('function');
      expect(typeof refreshGlobal.runtime.register).toBe('function');
      expect(typeof refreshGlobal.cleanup).toBe('function');
      expect(typeof refreshGlobal.register).toBe('function');
      expect(typeof refreshGlobal.signature).toBe('function');
    }
  );
});
