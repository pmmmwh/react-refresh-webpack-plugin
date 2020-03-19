/*
 * If the consumers setup is to use webpack-hot-middleware with a custom express server
 * we want to bind onto the EventSource for error tracking
 *
 * [Ref](https://github.com/webpack-contrib/webpack-hot-middleware/blob/cb29abb9dde435a1ac8e9b19f82d7d36b1093198/client.js#L152)
 */

const singletonKey = '__webpack_hot_middleware_reporter__';

module.exports = function loadWHMEventSource(messageHandler) {
  const client = window[singletonKey] || require('webpack-hot-middleware/client');

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
