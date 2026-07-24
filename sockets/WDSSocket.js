/**
 * Initializes a socket server for HMR for webpack-dev-server.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @returns {void}
 */
function initWDSSocket(messageHandler) {
  const { client } = require('webpack-dev-server/client/socket');

  /** @type {WebSocket} */
  let connection;
  if (client.sock) {
    // SockJSClient exposes the underlying socket via `.sock`.
    // WDS 6.0.0 dropped SockJS support, so this branch is dead in WDS 6+.
    connection = client.sock;
  } else if (client.client) {
    // WebSocketClient exposes the underlying socket via `.client`.
    connection = client.client;
  } else {
    throw new Error('Failed to determine WDS client type');
  }

  connection.addEventListener('message', function onSocketMessage(message) {
    messageHandler(JSON.parse(message.data));
  });
}

module.exports = { init: initWDSSocket };
