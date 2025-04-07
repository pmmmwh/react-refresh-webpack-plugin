/**
 * Initializes a socket server for HMR for webpack-dev-server.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @returns {void}
 */
function initWDSSocket(messageHandler) {
  const { default: SockJSClient } = require('webpack-dev-server/client/clients/SockJSClient');
  const { default: WebSocketClient } = require('webpack-dev-server/client/clients/WebSocketClient');
  const { client } = require('webpack-dev-server/client/socket');

  /** @type {WebSocket} */
  let connection;
  if (client instanceof SockJSClient) {
    connection = client.sock;
  } else if (client instanceof WebSocketClient) {
    connection = client.client;
  } else {
    throw new Error('Failed to determine WDS client type');
  }

  connection.addEventListener('message', function onSocketMessage(message) {
    messageHandler(JSON.parse(message.data));
  });
}

module.exports = { init: initWDSSocket };
