function runWithRetry(callback, maxRetries, message) {
  function executeWithRetryAndTimeout(currentCount) {
    try {
      if (currentCount > maxRetries - 1) {
        console.warn('[React Refresh]', message);
        return;
      }

      callback();
    } catch (err) {
      setTimeout(
        function () {
          executeWithRetryAndTimeout(currentCount + 1);
        },
        Math.pow(10, currentCount)
      );
    }
  }

  executeWithRetryAndTimeout(0);
}

module.exports = runWithRetry;
