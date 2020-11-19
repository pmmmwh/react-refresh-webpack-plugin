/**
 * @jest-environment jsdom
 */

const parseQuery = require('../../sockets/utils/parseQuery');

describe('parseQuery', () => {
  it('should handle valid query string', () => {
    expect(
      parseQuery('?sockHost=localhost&sockPath=/__socket&sockPort=8080&sockProtocol=https')
    ).toStrictEqual({
      sockHost: 'localhost',
      sockPath: '/__socket',
      sockPort: '8080',
      sockProtocol: 'https',
    });
  });

  it('should handle malformed query string', () => {
    expect(parseQuery('?malformedKey&=malformedValue&valid=1')).toStrictEqual({
      malformedKey: undefined,
      valid: '1',
    });
  });

  it('should handle undefined query string', () => {
    expect(parseQuery()).toStrictEqual({});
  });

  it('should handle empty query string', () => {
    expect(parseQuery('')).toStrictEqual({});
  });
});
