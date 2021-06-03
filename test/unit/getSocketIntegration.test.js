const getSocketIntegration = require('../../lib/utils/getSocketIntegration');

describe('getSocketIntegration', () => {
  it('should work with webpack-dev-server', () => {
    const WDSSocket = require.resolve('../../sockets/WDSSocket');
    expect(getSocketIntegration('wds')).toStrictEqual(WDSSocket);
  });

  it('should work with webpack-hot-middleware', () => {
    const WHMEventSource = require.resolve('../../sockets/WHMEventSource');
    expect(getSocketIntegration('whm')).toStrictEqual(WHMEventSource);
  });

  it('should work with webpack-plugin-serve', () => {
    const WPSSocket = require.resolve('../../sockets/WPSSocket');
    expect(getSocketIntegration('wps')).toStrictEqual(WPSSocket);
  });

  it('should resolve when module path is provided', () => {
    const FixtureSocket = require.resolve('./fixtures/socketIntegration');
    expect(getSocketIntegration(FixtureSocket)).toStrictEqual(FixtureSocket);
  });

  it('should throw when non-path string is provided', () => {
    expect(() => getSocketIntegration('unknown')).toThrowErrorMatchingInlineSnapshot(
      `"Cannot find module 'unknown' from '../lib/utils/getSocketIntegration.js'"`
    );
  });
});
