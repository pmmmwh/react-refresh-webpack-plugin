const getRefreshGlobal = require('../../lib/utils/getRefreshGlobal');

describe('getRefreshGlobal', () => {
  beforeEach(() => {
    global.__webpack_require__ = {};
  });

  afterAll(() => {
    delete global.__webpack_require__;
  });

  it('should return template without providing runtime template', () => {
    const refreshGlobal = getRefreshGlobal();
    expect(refreshGlobal).toMatchInlineSnapshot(`
      "__webpack_require__.$Refresh$ = {
      	cleanup: function() { return undefined; },
      	register: function() { return undefined; },
      	runtime: {},
      	setup: function(currentModuleId) {
      		var prevCleanup = __webpack_require__.$Refresh$.cleanup;
      		var prevReg = __webpack_require__.$Refresh$.register;
      		var prevSig = __webpack_require__.$Refresh$.signature;

      		__webpack_require__.$Refresh$.register = function(type, id) {
      			var typeId = currentModuleId + \\" \\" + id;
      			__webpack_require__.$Refresh$.runtime.register(type, typeId);
      		}

      		__webpack_require__.$Refresh$.signature = __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform;

      		__webpack_require__.$Refresh$.cleanup = function() {
      			__webpack_require__.$Refresh$.register = prevReg;
      			__webpack_require__.$Refresh$.signature = prevSig;
      			__webpack_require__.$Refresh$.cleanup = prevCleanup;
      		}
      	},
      	signature: function() { return function(type) { return type; }; }
      };"
    `);
    expect(() => {
      eval(refreshGlobal);
    }).not.toThrow();
  });

  it.skipIf(WEBPACK_VERSION !== 5, 'should return template with provided runtime template', () => {
    const RuntimeTemplate = require('webpack/lib/RuntimeTemplate');
    const refreshGlobal = getRefreshGlobal(
      new RuntimeTemplate({ ecmaVersion: 6 }, { shorten: (item) => item })
    );
    expect(refreshGlobal).toMatchInlineSnapshot(`
      "__webpack_require__.$Refresh$ = {
      	cleanup: () => undefined,
      	register: () => undefined,
      	runtime: {},
      	setup: (currentModuleId) => {
      		const prevCleanup = __webpack_require__.$Refresh$.cleanup;
      		const prevReg = __webpack_require__.$Refresh$.register;
      		const prevSig = __webpack_require__.$Refresh$.signature;

      		__webpack_require__.$Refresh$.register = (type, id) => {
      			const typeId = currentModuleId + \\" \\" + id;
      			__webpack_require__.$Refresh$.runtime.register(type, typeId);
      		}

      		__webpack_require__.$Refresh$.signature = __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform;

      		__webpack_require__.$Refresh$.cleanup = () => {
      			__webpack_require__.$Refresh$.register = prevReg;
      			__webpack_require__.$Refresh$.signature = prevSig;
      			__webpack_require__.$Refresh$.cleanup = prevCleanup;
      		}
      	},
      	signature: () => (type) => type
      };"
    `);
    expect(() => {
      eval(refreshGlobal);
    }).not.toThrow();
  });
});
