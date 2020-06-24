const getResourceQuery = require('../../sockets/utils/getResourceQuery');

describe('getResourceQuery', () => {
  beforeEach(() => {
    global.__resourceQuery = undefined;
  });

  afterAll(() => {
    delete global.__resourceQuery;
  });

  it('should parse __resourceQuery', () => {
    global.__resourceQuery = '?sockHost=localhost&sockPath=/__socket&sockPort=8080';
    expect(getResourceQuery()).toStrictEqual({
      sockHost: 'localhost',
      sockPath: '/__socket',
      sockPort: '8080',
    });
  });

  it('should handle undefined __resourceQuery', () => {
    delete global.__resourceQuery;
    expect(getResourceQuery()).toStrictEqual({});
  });

  it('should handle empty string __resourceQuery', () => {
    global.__resourceQuery = '';
    expect(getResourceQuery()).toStrictEqual({});
  });
});
