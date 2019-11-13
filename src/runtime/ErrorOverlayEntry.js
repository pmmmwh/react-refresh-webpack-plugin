// TODO: Implement handling of this
/* global __resourceQuery */

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const stripAnsi = require('strip-ansi');
const ErrorOverlay = require('../overlay');
const createSocket = require('./createSocket');
const {
  error: registerErrorHandler,
  unhandledRejection: registerUnhandledRejectionHandler,
} = require('./errorEventHandlers');

// Setup error states
let isHotReload = false;
let hasCompileErrors = false;
let runtimeErrors = [];

/**
 * Detects if an error is a Webpack compilation error.
 * @param {Error} error The error of interest.
 * @returns {boolean} If the error is a Webpack compilation error.
 */
function isWebpackCompileError(error) {
  return /Module [A-z ]+\(from/.test(error.message);
}

/**
 * Try dismissing the compile error overlay.
 * This will also reset runtime error records because we have new source to evaluate.
 * @returns {void}
 */
function tryDismissCompileErrorOverlay() {
  if (runtimeErrors.length) {
    runtimeErrors = [];
  }
  if (!hasCompileErrors) {
    ErrorOverlay.clearCompileError();
  }
}

/**
 * A function called after a compile success signal is received from Webpack.
 * @returns {void}
 */
function handleCompileSuccess() {
  isHotReload = true;
  hasCompileErrors = false;

  if (isHotReload) {
    tryDismissCompileErrorOverlay();
  }
}

/**
 * A function called after a compile errored signal is received from Webpack.
 * @param {string} errors
 * @returns {void}
 */
function handleCompileErrors(errors) {
  isHotReload = true;
  hasCompileErrors = true;

  const formatted = formatWebpackMessages({
    errors: errors,
    warnings: [],
  });

  // Only show the first error
  ErrorOverlay.showCompileError(formatted.errors[0]);

  for (let i = 0; i < formatted.errors.length; i += 1) {
    console.error(stripAnsi(formatted.errors[i]));
  }

  // Do not attempt to reload now.
  // We will reload on next success instead.
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

/**
 * Handles runtime error contexts captured with EventListeners.
 * Integrates with a runtime error overlay.
 * @param {error} context A valid error object.
 * @returns {void}
 */
function runtimeErrorHandler(context) {
  if (
    context &&
    !isWebpackCompileError(context) &&
    runtimeErrors.indexOf(context) === -1
  ) {
    runtimeErrors = runtimeErrors.concat(context);
  }
  ErrorOverlay.showRuntimeErrors(runtimeErrors);
}

// Registers handlers for compile errors
createSocket(compileMessageHandler);
// Registers handlers for runtime errors
registerErrorHandler(runtimeErrorHandler);
registerUnhandledRejectionHandler(runtimeErrorHandler);
