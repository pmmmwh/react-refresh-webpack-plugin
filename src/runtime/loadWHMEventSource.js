/*
 * If the consumers setup is to use webpack-hot-middleware with a custom express server
 * we want to bind onto the EventSource for our updates.
 *
 * The EventSource is not attached immediately, so we have a timeout + retry mechanism.
 * This is also a safe approach for consumers who are not using webpack-hot-middleware. It'll be a noop after 3s.
 */
const MAX_RETRIES = 3;
let retries = 0;

function tryLoadingWHMEventSource() {
  setTimeout(() => {
    if (!window.__whmEventSourceWrapper) {
      if (retries >= MAX_RETRIES) return;
      retries++;
      tryLoadingWHMEventSource();
      return;
    }

    const eventSource = Object.values(window.__whmEventSourceWrapper)[0];
    eventSource.addMessageListener(event => {
      try {
        const message = JSON.parse(event.data);
        console.log(message);
        messageHandler(message);
      } catch (e) {
        // heartbeat
        if (event.data === '💓') {
          return;
        }

        console.error(e);
      }
    });
  }, 1000);
}

module.exports = tryLoadingWHMEventSource;
