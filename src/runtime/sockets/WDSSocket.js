/* global __webpack_dev_server_client__ */

const url = require('native-url');

/**
 * Initializes a socket server for HMR for webpack-dev-server.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @param {*} overrides Socket integration overrides to change the connection URL.
 * @returns {void}
 */
function initWDSSocket(messageHandler, overrides) {
  if (typeof __webpack_dev_server_client__ !== 'undefined') {
    const SocketClient = __webpack_dev_server_client__;
    // TODO: Support usage of custom sockets after WDS 4.0 is released
    // Ref: https://github.com/webpack/webpack-dev-server/pull/2055
    const connection = new SocketClient(
      url.format({
        protocol: window.location.protocol,
        hostname: overrides.sockHost || window.location.hostname,
        port: overrides.sockPort || window.location.port,
        pathname: overrides.sockPath || '/sockjs-node',
      })
    );

    connection.onMessage(function onSocketMessage(data) {
      const message = JSON.parse(data);
      messageHandler(message);
    });
  }
}

module.exports = initWDSSocket;
