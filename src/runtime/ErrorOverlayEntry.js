/* global __resourceQuery, __react_refresh_error_overlay__ */

const formatWebpackErrors = require('./formatWebpackErrors');
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
  __react_refresh_error_overlay__.clearCompileError();
  __react_refresh_error_overlay__.clearRuntimeErrors(!hasRuntimeErrors);
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

  const formattedErrors = formatWebpackErrors(errors);

  // Only show the first error
  __react_refresh_error_overlay__.showCompileError(formattedErrors[0]);
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
    case 'still-ok':
    case 'warnings':
      // TODO: Implement handling for warnings
      handleCompileSuccess();
      break;
    case 'errors':
      handleCompileErrors(message.data);
      break;
    default:
    // Do nothing.
  }
}

let overrides = {};
if (__resourceQuery) {
  overrides = require('querystring').parse(__resourceQuery.slice(1));
}

// Registers handlers for compile errors
createSocket(compileMessageHandler, overrides);
// Registers handlers for runtime errors
registerErrorHandler(function handleError(error) {
  hasRuntimeErrors = true;
  __react_refresh_error_overlay__.handleRuntimeError(error);
});
registerUnhandledRejectionHandler(function handleUnhandledPromiseRejection(error) {
  hasRuntimeErrors = true;
  __react_refresh_error_overlay__.handleRuntimeError(error);
});
