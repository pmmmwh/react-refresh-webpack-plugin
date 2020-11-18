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
      	init: function() {
      		__webpack_require__.$Refresh$.cleanup = function() { return undefined; };
      		__webpack_require__.$Refresh$.register = function() { return undefined; };
      		__webpack_require__.$Refresh$.runtime = {};
      		__webpack_require__.$Refresh$.signature = function() { return function(type) { return type; }; };
      	},
      	setup: function(currentModuleId) {
      		var prevCleanup = __webpack_require__.$Refresh$.cleanup;
      		var prevReg = __webpack_require__.$Refresh$.register;
      		var prevSig = __webpack_require__.$Refresh$.signature;

      		__webpack_require__.$Refresh$.register = function(type, id) {
      			var typeId = currentModuleId + \\" \\" + id;
      			__webpack_require__.$Refresh$.runtime.register(type, typeId);
      		}

      		__webpack_require__.$Refresh$.signature = __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform;

      		__webpack_require__.$Refresh$.cleanup = function(cleanupModuleId) {
      			if (currentModuleId === cleanupModuleId) {
      				__webpack_require__.$Refresh$.register = prevReg;
      				__webpack_require__.$Refresh$.signature = prevSig;
      				__webpack_require__.$Refresh$.cleanup = prevCleanup;
      			}
      		}
      	},
      };"
    `);
    expect(() => {
      eval(refreshGlobalTemplate);
    }).not.toThrow();

    const refreshGlobal = global.__webpack_require__.$Refresh$;
    expect(() => {
      refreshGlobal.init();
    }).not.toThrow();
    expect(typeof refreshGlobal.cleanup).toBe('function');
    expect(typeof refreshGlobal.register).toBe('function');
    expect(typeof refreshGlobal.signature).toBe('function');
    expect(typeof refreshGlobal.runtime).toBe('object');
  });

  it.skipIf(
    WEBPACK_VERSION !== 5,
    'should return working refresh global with provided runtime template',
    () => {
      const RuntimeTemplate = require('webpack/lib/RuntimeTemplate');
      const refreshGlobalTemplate = getRefreshGlobal(
        new RuntimeTemplate({ environment: { arrowFunction: true, const: true } }, (i) => i)
      );
      expect(refreshGlobalTemplate).toMatchInlineSnapshot(`
        "__webpack_require__.$Refresh$ = {
        	init: () => {
        		__webpack_require__.$Refresh$.cleanup = () => undefined;
        		__webpack_require__.$Refresh$.register = () => undefined;
        		__webpack_require__.$Refresh$.runtime = {};
        		__webpack_require__.$Refresh$.signature = () => (type) => type;
        	},
        	setup: (currentModuleId) => {
        		const prevCleanup = __webpack_require__.$Refresh$.cleanup;
        		const prevReg = __webpack_require__.$Refresh$.register;
        		const prevSig = __webpack_require__.$Refresh$.signature;

        		__webpack_require__.$Refresh$.register = (type, id) => {
        			const typeId = currentModuleId + \\" \\" + id;
        			__webpack_require__.$Refresh$.runtime.register(type, typeId);
        		}

        		__webpack_require__.$Refresh$.signature = __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform;

        		__webpack_require__.$Refresh$.cleanup = (cleanupModuleId) => {
        			if (currentModuleId === cleanupModuleId) {
        				__webpack_require__.$Refresh$.register = prevReg;
        				__webpack_require__.$Refresh$.signature = prevSig;
        				__webpack_require__.$Refresh$.cleanup = prevCleanup;
        			}
        		}
        	},
        };"
      `);
      expect(() => {
        eval(refreshGlobalTemplate);
      }).not.toThrow();

      const refreshGlobal = global.__webpack_require__.$Refresh$;
      expect(() => {
        refreshGlobal.init();
      }).not.toThrow();
      expect(typeof refreshGlobal.cleanup).toBe('function');
      expect(typeof refreshGlobal.register).toBe('function');
      expect(typeof refreshGlobal.signature).toBe('function');
      expect(typeof refreshGlobal.runtime).toBe('object');
    }
  );
});
