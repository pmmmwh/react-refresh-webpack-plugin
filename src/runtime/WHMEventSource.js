/*
 * If the consumers setup is to use webpack-hot-middleware with a custom express server
 * we want to bind onto the EventSource for error tracking
 */

module.exports = function loadWHMEventSource(messageHandler) {
  const client = require('webpack-hot-middleware/client');

  client.useCustomOverlay({
    showProblems(type, data) {
      const error = {
        type,
        data,
      };

      messageHandler(error);
    },
    clear() {
      messageHandler({ type: 'ok' });
    },
  });
};
