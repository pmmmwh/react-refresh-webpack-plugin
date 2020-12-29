const formatUrl = require('../../sockets/utils/formatUrl');
const url = require('native-url');
describe('formatUrl', () => {
  it('should return correct result for ipv6', () => {
    const obj = {
      hostname: '[::]',
      port: 3000,
    };
    expect(formatUrl(obj)).toContain('[::]:3000');
  });

  it('should return correct result for other cases', () => {
    const obj = {
      hostname: 'localhost',
      port: 3000,
    };
    expect(url.format(obj)).toBe(formatUrl(obj));

    obj.protocol = 'https';
    expect(url.format(obj)).toBe(formatUrl(obj));

    obj.auth = null;
    expect(url.format(obj)).toBe(formatUrl(obj));

    obj.pathname = '/wds';
    expect(url.format(obj)).toBe(formatUrl(obj));
  });
});
