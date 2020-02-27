// eslint-disable-next-line no-unused-vars
/* global __resourceQuery, __webpack_dev_server_client__ */

const url = require('url');
const loadWHMEventSource = require('./WHMEventSource');

/**
 * Creates a socket server for HMR according to the user's Webpack configuration.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 */
function createSocket(messageHandler) {
  // This adds support for custom WDS socket transportModes
  // In the future, we should add support for custom clients to better support WDM
  if (typeof __webpack_dev_server_client__ !== 'undefined') {
    const SocketClient = __webpack_dev_server_client__;
    const connection = new SocketClient(
      // TODO: Dynamically generate this to handle resourceQuery
      // TODO: Use resourceQuery to fix servers under proxies
      url.format({
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        port: window.location.port,
        // TODO: Support usage of custom sockets after WDS 4.0 is released
        // Ref: https://github.com/webpack/webpack-dev-server/pull/2055
        pathname: '/sockjs-node',
      })
    );
    connection.onClose(function onSocketClose() {
      // TODO: Should we reconnect?
    });
    connection.onMessage(function onSocketMessage(data) {
      const message = JSON.parse(data);
      messageHandler(message);
    });
  } else {
    loadWHMEventSource(messageHandler);
  }
}

module.exports = createSocket;
