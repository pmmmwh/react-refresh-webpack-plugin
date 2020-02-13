/*
 * If the consumers setup is to use webpack-hot-middleware with a custom express server
 * we want to bind onto the EventSource for our updates.
 */

module.exports = function loadWHMEventSource(messageHandler) {
  let client;
  try {
    client = require('webpack-hot-middleware/client');
  } catch (e) {
    return false;
  }

  client.useCustomOverlay({
    showProblems(type, data) {
      const error = {
        type: 'errors',
        data: data,
      };

      messageHandler(error);
    },
    clear() {
      messageHandler({ type: 'ok' });
    },
  });
};
