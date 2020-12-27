const formatUrl = require('../../sockets/utils/formatUrl');
const url = require('native-url');
const urlParts = {
  auth: undefined,
  hostname: '[::]',
  pathname: '/sockjs-node',
  port: '8080',
  protocol: 'http:',
};
describe('formatUrl function', () => {
  it('should return correct url for ipv6', () => {
    const url = formatUrl(urlParts);
    expect(url).toEqual('http://[::]:8080/sockjs-node');
  });
  it('should return wrong url for ipv6', () => {
    const myUrl = url.format(urlParts);
    expect(myUrl).toBe('http://[[::]]:8080/sockjs-node');
  });
});
