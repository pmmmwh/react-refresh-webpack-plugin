const getResourceQuery = require('../../src/runtime/sockets/utils/getResourceQuery');

describe('getResourceQuery', () => {
  let previousQuery;

  beforeEach(() => {
    previousQuery = global.__resourceQuery;
  });

  afterEach(() => {
    global.__resourceQuery = previousQuery;
  });

  it('should parse __resourceQuery', () => {
    global.__resourceQuery = '?sockHost=localhost&sockPort=8080&sockPath=/__socket';
    expect(getResourceQuery()).toEqual({
      sockHost: 'localhost',
      sockPath: '/__socket',
      sockPort: '8080',
    });
  });

  it('should handle undefined __resourceQuery', () => {
    delete global.__resourceQuery;
    expect(getResourceQuery()).toEqual({});
  });

  it('should handle empty string __resourceQuery', () => {
    global.__resourceQuery = '';
    expect(getResourceQuery()).toEqual({});
  });
});
