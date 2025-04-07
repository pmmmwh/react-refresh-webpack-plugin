/* global __react_refresh_error_overlay__, __react_refresh_socket__ */

if (process.env.NODE_ENV !== 'production') {
  const events = require('./utils/errorEventHandlers.js');
  const formatWebpackErrors = require('./utils/formatWebpackErrors.js');
  const runWithRetry = require('./utils/retry.js');

  // Setup error states
  let isHotReload = false;
  let hasRuntimeErrors = false;

  /**
   * Try dismissing the compile error overlay.
   * This will also reset runtime error records (if any),
   * because we have new source to evaluate.
   * @returns {void}
   */
  const tryDismissErrorOverlay = function () {
    __react_refresh_error_overlay__.clearCompileError();
    __react_refresh_error_overlay__.clearRuntimeErrors(!hasRuntimeErrors);
    hasRuntimeErrors = false;
  };

  /**
   * A function called after a compile success signal is received from Webpack.
   * @returns {void}
   */
  const handleCompileSuccess = function () {
    isHotReload = true;

    if (isHotReload) {
      tryDismissErrorOverlay();
    }
  };

  /**
   * A function called after a compile errored signal is received from Webpack.
   * @param {string[]} errors
   * @returns {void}
   */
  const handleCompileErrors = function (errors) {
    isHotReload = true;

    const formattedErrors = formatWebpackErrors(errors);

    // Only show the first error
    __react_refresh_error_overlay__.showCompileError(formattedErrors[0]);
  };

  /**
   * Handles compilation messages from Webpack.
   * Integrates with a compile error overlay.
   * @param {*} message A Webpack HMR message sent via WebSockets.
   * @returns {void}
   */
  const compileMessageHandler = function (message) {
    switch (message.type) {
      case 'ok':
      case 'still-ok':
      case 'warnings': {
        // TODO: Implement handling for warnings
        handleCompileSuccess();
        break;
      }
      case 'errors': {
        handleCompileErrors(message.data);
        break;
      }
      default: {
        // Do nothing.
      }
    }
  };

  // Only register if no other overlay have been registered
  if (
    typeof window !== 'undefined' &&
    !window.__reactRefreshOverlayInjected &&
    __react_refresh_socket__
  ) {
    // Registers handlers for compile errors with retry -
    // This is to prevent mismatching injection order causing errors to be thrown
    runWithRetry(
      function initSocket() {
        __react_refresh_socket__.init(compileMessageHandler);
      },
      3,
      'Failed to set up the socket connection.'
    );
    // Registers handlers for runtime errors
    events.handleError(function handleError(error) {
      hasRuntimeErrors = true;
      __react_refresh_error_overlay__.handleRuntimeError(error);
    });
    events.handleUnhandledRejection(function handleUnhandledPromiseRejection(error) {
      hasRuntimeErrors = true;
      __react_refresh_error_overlay__.handleRuntimeError(error);
    });

    // Mark overlay as injected to prevent double-injection
    window.__reactRefreshOverlayInjected = true;
  }
}
