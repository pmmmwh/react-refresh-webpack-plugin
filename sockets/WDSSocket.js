/* global __webpack_dev_server_client__ */

const url = require('native-url');
const getResourceQuery = require('./utils/getResourceQuery');

/**
 * Initializes a socket server for HMR for webpack-dev-server.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @returns {void}
 */
function initWDSSocket(messageHandler) {
  if (typeof __webpack_dev_server_client__ !== 'undefined') {
    // Get config overrides from webpack __resourceQuery global
    const query = getResourceQuery();
    const SocketClient = __webpack_dev_server_client__;
    // TODO: Support usage of custom sockets after WDS 4.0 is released
    // Ref: https://github.com/webpack/webpack-dev-server/pull/2055
    const connection = new SocketClient(
      url.format({
        protocol: window.location.protocol,
        hostname: query.sockHost || window.location.hostname,
        port: query.sockPort || window.location.port,
        pathname: query.sockPath || '/sockjs-node',
      })
    );

    connection.onMessage(function onSocketMessage(data) {
      const message = JSON.parse(data);
      messageHandler(message);
    });
  }
}

module.exports = initWDSSocket;
