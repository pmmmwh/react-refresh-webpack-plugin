/**
 * @jest-environment jsdom
 */

jest.mock('../../sockets/utils/getCurrentScriptSource');

import getCurrentScriptSource from '../../sockets/utils/getCurrentScriptSource';
import getSocketUrlParts from '../../sockets/utils/getSocketUrlParts';

describe('getSocketUrlParts', () => {
  beforeEach(() => {
    getCurrentScriptSource.mockReset();
    jest.resetModules();
  });

  it('should work when script source is a valid HTTP URL', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should work when script source is a valid HTTPS URL', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'https://localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'https:',
    });
  });

  it('should work when script source is 0.0.0.0', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://0.0.0.0:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should work when script source is [::]', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://[::]:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should work when script source is relative', () => {
    window.location.assign('http://localhost:8080');
    getCurrentScriptSource.mockImplementationOnce(() => 'main.js');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should work when script source port is unavailable', () => {
    window.location.assign('http://localhost:8080');
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should work when current location is about:blank', () => {
    window.location.assign('about:blank');
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should work when current location uses the file protocol', () => {
    window.location.assign('file://test.html');
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should use HTTPS when current location uses HTTPS', () => {
    window.location.assign('https://localhost:8080');
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'https:',
    });
  });

  it('should include username when it is available from the script source', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://username@localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: 'username',
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should include username and password when both are available from the script source', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://username:password@localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: 'username:password',
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should not include password when username is unavailable from the script source', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://:password@localhost:8080');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should use info from resource query if script source is unavailable', () => {
    getCurrentScriptSource.mockImplementationOnce(() => null);

    expect(getSocketUrlParts('?sockHost=foo.com&sockPath=/socket&sockPort=9000')).toStrictEqual({
      auth: undefined,
      hostname: 'foo.com',
      pathname: '/socket',
      port: '9000',
      protocol: 'http:',
    });
  });

  it('should use info from resource query when available', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost:8080');

    expect(
      getSocketUrlParts('?sockProtocol=https&sockHost=foo.com&sockPath=/socket&sockPort=9000')
    ).toStrictEqual({
      auth: undefined,
      hostname: 'foo.com',
      pathname: '/socket',
      port: '9000',
      protocol: 'https:',
    });
  });

  it('should work with incomplete resource query', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost:8080');

    expect(getSocketUrlParts('?sockHost=foo.com')).toStrictEqual({
      auth: undefined,
      hostname: 'foo.com',
      pathname: '/sockjs-node',
      port: undefined,
      protocol: 'http:',
    });
  });

  it('should throw if script source and resource query are not defined', () => {
    window.location.assign('file://test/');
    getCurrentScriptSource.mockImplementationOnce(() => null);

    expect(() => getSocketUrlParts(null)).toThrow(
      '[React Refresh] Failed to get an URL for the socket connection.'
    );
  });

  it('should work when script source has no protocol defined and location is https', () => {
    window.location.assign('https://localhost:8080');
    getCurrentScriptSource.mockImplementationOnce(() => '//localhost:8080/index.js');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'https:',
    });
  });

  it('should work when script source has no protocol defined and location is http', () => {
    window.location.assign('http://localhost:8080');
    getCurrentScriptSource.mockImplementationOnce(() => '//localhost:8080/index.js');

    expect(getSocketUrlParts()).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/sockjs-node',
      port: '8080',
      protocol: 'http:',
    });
  });

  it('should force /ws when metadata.version is 4', () => {
    getCurrentScriptSource.mockImplementationOnce(() => 'http://localhost:8080');

    expect(getSocketUrlParts(undefined, { version: 4 })).toStrictEqual({
      auth: undefined,
      hostname: 'localhost',
      pathname: '/ws',
      port: '8080',
      protocol: 'http:',
    });
  });
});
