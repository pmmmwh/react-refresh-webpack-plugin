const { getRefreshGlobalScope, getWebpackVersion } = require('../../lib/globals');

describe('getRefreshGlobalScope', () => {
  it.skipIf(WEBPACK_VERSION !== 4, 'should work for Webpack 4', () => {
    expect(getRefreshGlobalScope({})).toStrictEqual('__webpack_require__.$Refresh$');
  });

  it.skipIf(WEBPACK_VERSION !== 5, 'should work for Webpack 5', () => {
    const { RuntimeGlobals } = require('webpack');
    expect(getRefreshGlobalScope(RuntimeGlobals)).toStrictEqual('__webpack_require__.$Refresh$');
  });
});

describe('getWebpackVersion', () => {
  it.skipIf(WEBPACK_VERSION !== 4, 'should work for Webpack 4', () => {
    const webpack = require('webpack');
    expect(getWebpackVersion(webpack({}))).toStrictEqual(4);
  });

  it.skipIf(WEBPACK_VERSION !== 5, 'should work for Webpack 5', () => {
    const webpack = require('webpack');
    expect(getWebpackVersion(webpack({}))).toStrictEqual(5);
  });
});
