const parseResourceQuery = require('../../client/utils/parseResourceQuery');

describe('parseResourceQuery', () => {
  it('should parse __resourceQuery', () => {
    expect(
      parseResourceQuery('?sockHost=localhost&sockPath=/__socket&sockPort=8080')
    ).toStrictEqual({
      sockHost: 'localhost',
      sockPath: '/__socket',
      sockPort: '8080',
    });
  });

  it('should handle undefined __resourceQuery', () => {
    expect(parseResourceQuery()).toStrictEqual({});
  });

  it('should handle empty string __resourceQuery', () => {
    expect(parseResourceQuery('')).toStrictEqual({});
  });
});
