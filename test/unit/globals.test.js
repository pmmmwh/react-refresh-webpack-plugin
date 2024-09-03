const { getRefreshGlobalScope } = require('../../lib/globals');

describe('getRefreshGlobalScope', () => {
  it('should work for Webpack 5', () => {
    const { RuntimeGlobals } = require('webpack');
    expect(getRefreshGlobalScope(RuntimeGlobals)).toStrictEqual('__webpack_require__.$Refresh$');
  });
});
