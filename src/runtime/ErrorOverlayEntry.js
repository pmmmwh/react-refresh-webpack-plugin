/* global __resourceQuery, __react_refresh_error_overlay__, __react_refresh_init_socket__ */

const registerErrorEventHandlers = require('./errorEventHandlers');
const formatWebpackErrors = require('./formatWebpackErrors');

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
  // Decode any possible encoded characters and remove `?` from start
  const query = decodeURIComponent(__resourceQuery).slice(1);
  // Split string like `key=value&foo=bar`, first from &, and then =
  // The structure will be `[['key', 'value'], ['foo', 'bar']]`
  const entries = query.split('&').map(function (entry) {
    return entry.split('=');
  });
  // Add all entries to the overrides object
  entries.forEach(function (entry) {
    const key = entry[0];
    const value = entry[1];
    overrides[key] = value;
  });
}

// Registers handlers for compile errors
__react_refresh_init_socket__(compileMessageHandler, overrides);
// Registers handlers for runtime errors
registerErrorEventHandlers.error(function handleError(error) {
  hasRuntimeErrors = true;
  __react_refresh_error_overlay__.handleRuntimeError(error);
});
registerErrorEventHandlers.unhandledRejection(function handleUnhandledPromiseRejection(error) {
  hasRuntimeErrors = true;
  __react_refresh_error_overlay__.handleRuntimeError(error);
});
