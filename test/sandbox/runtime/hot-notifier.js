if (module.hot) {
  module.hot.addStatusHandler(function (status) {
    if (status === 'idle') {
      if (window.__HMR_CALLBACK) {
        window.__HMR_CALLBACK();
        window.__HMR_CALLBACK = null;
      }
    }
  });
}
