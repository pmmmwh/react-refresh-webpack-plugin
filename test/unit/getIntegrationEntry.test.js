const getIntegrationEntry = require('../../lib/utils/getIntegrationEntry');

describe('getIntegrationEntry', () => {
  it('should work with webpack-hot-middleware', () => {
    expect(getIntegrationEntry('whm')).toStrictEqual('webpack-hot-middleware/client');
  });

  it('should work with webpack-plugin-serve', () => {
    expect(getIntegrationEntry('wps')).toStrictEqual('webpack-plugin-serve/client');
  });

  it('should return undefined for webpack-dev-server', () => {
    expect(getIntegrationEntry('wds')).toStrictEqual(undefined);
  });

  it('should return undefined for unknown integrations', () => {
    expect(getIntegrationEntry('unknown')).toStrictEqual(undefined);
  });
});
