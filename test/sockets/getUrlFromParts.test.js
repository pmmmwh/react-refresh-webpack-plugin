/**
 * @jest-environment jsdom
 */

import getUrlFromParts from '../../sockets/utils/getUrlFromParts';

describe('getUrlFromParts', () => {
  it('should work when required parts are present and protocol is HTTP', () => {
    expect(
      getUrlFromParts({
        auth: undefined,
        hostname: 'localhost',
        pathname: '/sockjs-node',
        port: '8080',
        protocol: 'http:',
      })
    ).toStrictEqual('http://localhost:8080/sockjs-node');
  });

  it('should work when required parts are present and protocol is HTTPS', () => {
    expect(
      getUrlFromParts({
        auth: undefined,
        hostname: 'localhost',
        pathname: '/sockjs-node',
        port: '8080',
        protocol: 'https:',
      })
    ).toStrictEqual('https://localhost:8080/sockjs-node');
  });

  it('should work when hostname is [::]', () => {
    expect(
      getUrlFromParts({
        auth: undefined,
        hostname: '[::]',
        pathname: '/sockjs-node',
        port: '8080',
        protocol: 'https:',
      })
    ).toStrictEqual('https://[::]:8080/sockjs-node');
  });

  it('should work when port is empty', () => {
    expect(
      getUrlFromParts({
        auth: undefined,
        hostname: 'localhost',
        pathname: '/sockjs-node',
        port: '',
        protocol: 'http:',
      })
    ).toStrictEqual('http://localhost/sockjs-node');
  });

  it('should work when protocol is unavailable', () => {
    expect(
      getUrlFromParts({
        auth: undefined,
        hostname: 'localhost',
        pathname: '/sockjs-node',
        port: '8080',
        protocol: undefined,
      })
    ).toStrictEqual('http://localhost:8080/sockjs-node');
  });

  it('should work when auth is present with username', () => {
    expect(
      getUrlFromParts({
        auth: 'username',
        hostname: 'localhost',
        pathname: '/sockjs-node',
        port: '8080',
        protocol: 'http:',
      })
    ).toStrictEqual('http://username@localhost:8080/sockjs-node');
  });

  it('should work when auth is present with both username and password', () => {
    expect(
      getUrlFromParts({
        auth: 'username:password',
        hostname: 'localhost',
        pathname: '/sockjs-node',
        port: '8080',
        protocol: 'http:',
      })
    ).toStrictEqual('http://username:password@localhost:8080/sockjs-node');
  });

  it('should force WS when metadata.enforceWs is true and protocol is HTTP', () => {
    expect(
      getUrlFromParts(
        {
          auth: undefined,
          hostname: 'localhost',
          pathname: '/sockjs-node',
          port: '8080',
          protocol: 'http:',
        },
        { enforceWs: true }
      )
    ).toStrictEqual('ws://localhost:8080/sockjs-node');
  });

  it('should force WSS when metadata.enforceWs is true and protocol is HTTPS', () => {
    expect(
      getUrlFromParts(
        {
          auth: undefined,
          hostname: 'localhost',
          pathname: '/sockjs-node',
          port: '8080',
          protocol: 'https:',
        },
        { enforceWs: true }
      )
    ).toStrictEqual('wss://localhost:8080/sockjs-node');
  });
});
