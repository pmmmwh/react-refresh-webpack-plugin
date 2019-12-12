// TODO: Implement handling of this
// eslint-disable-next-line no-unused-vars
/* global __resourceQuery */

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const ErrorOverlay = require('../overlay');
const createSocket = require('./createSocket');
const {
  error: registerErrorHandler,
  unhandledRejection: registerUnhandledRejectionHandler,
} = require('./errorEventHandlers');

// Setup error states
let isHotReload = false;
let hasRuntimeErrors = false;

/**
 * Try dismissing the compile error overlay.
 * This will also reset runtime error records (if any),
 * because we have new source to evaluate.
 * @returns {void}
 */
function tryDismissErrorOverlay() {
  ErrorOverlay.clearCompileError();
  ErrorOverlay.clearRuntimeErrors(!hasRuntimeErrors);
  hasRuntimeErrors = false;
}

/**
 * A function called after a compile success signal is received from Webpack.
 * @returns {void}
 */
function handleCompileSuccess() {
  isHotReload = true;

  if (isHotReload) {
    tryDismissErrorOverlay();
  }
}

/**
 * A function called after a compile errored signal is received from Webpack.
 * @param {string} errors
 * @returns {void}
 */
function handleCompileErrors(errors) {
  isHotReload = true;

  const formatted = formatWebpackMessages({
    errors: errors,
    warnings: [],
  });

  // Only show the first error
  ErrorOverlay.showCompileError(formatted.errors[0]);
}

/**
 * Handles compilation messages from Webpack.
 * Integrates with a compile error overlay.
 * @param {*} message A Webpack HMR message sent via WebSockets.
 * @returns {void}
 */
function compileMessageHandler(message) {
  switch (message.type) {
    case 'ok':
      handleCompileSuccess();
      break;
    case 'errors':
      handleCompileErrors(message.data);
      break;
    default:
    // Do nothing.
  }
}

// Registers handlers for compile errors
createSocket(compileMessageHandler);
// Registers handlers for runtime errors
registerErrorHandler(function handleError(error) {
  hasRuntimeErrors = true;
  ErrorOverlay.handleRuntimeError(error);
});
registerUnhandledRejectionHandler(function handleUnhandledPromiseRejection(error) {
  hasRuntimeErrors = true;
  ErrorOverlay.handleRuntimeError(error);
});
