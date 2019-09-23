// TODO: Implement handling of this
/* global __resourceQuery */

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const ErrorOverlay = require('react-error-overlay');
const stripAnsi = require('strip-ansi');
const { runtimeGlobalHook } = require('./globals');
const createSocket = require('./createSocket');

// Error Overlay Integration for Compile Errors
var isHotReload = false;
var hasCompileErrors = false;

function handleSuccess() {
  isHotReload = true;
  hasCompileErrors = false;

  if (isHotReload) {
    tryDismissErrorOverlay();
  }
}

function handleErrors(errors) {
  isHotReload = true;
  hasCompileErrors = true;

  var formatted = formatWebpackMessages({
    errors: errors,
    warnings: [],
  });

  // Only show the first error
  ErrorOverlay.reportBuildError(formatted.errors[0]);

  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    for (var i = 0; i < formatted.errors.length; i += 1) {
      console.error(stripAnsi(formatted.errors[i]));
    }
  }

  // Do not attempt to reload now.
  // We will reload on next success instead.
}

function tryDismissErrorOverlay() {
  if (!hasCompileErrors) {
    ErrorOverlay.dismissBuildError();
  }
}

createSocket(function messageHandler(message) {
  switch (message.type) {
    case 'ok':
      handleSuccess();
      break;
    case 'errors':
      handleErrors(message.data);
      break;
    default:
    // Do nothing.
  }
});

// Error Overlay Integration for Runtime Errors
// Setup Global Hook
window[runtimeGlobalHook] = window[runtimeGlobalHook] || {};
window[runtimeGlobalHook].hasRuntimeErrors = false;

ErrorOverlay.startReportingRuntimeErrors({
  onError: function() {
    window[runtimeGlobalHook].hasRuntimeErrors = true;
  },
});
