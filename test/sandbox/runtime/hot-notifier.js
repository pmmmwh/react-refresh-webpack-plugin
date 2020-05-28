if (module.hot) {
  module.hot.addStatusHandler(function (status) {
    if (status === 'idle') {
      if (window.onHotSuccess) {
        window.onHotSuccess();
      }
    }
  });
}
