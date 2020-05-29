const safeThis = require('./safeThis');

if (process.env.NODE_ENV !== 'production' && typeof safeThis !== 'undefined') {
  const Refresh = require('react-refresh/runtime');

  // Only inject the runtime if it hasn't been injected
  if (!safeThis.__reactRefreshInjected) {
    // Inject refresh runtime into global
    Refresh.injectIntoGlobalHook(safeThis);

    // Mark the runtime as injected to prevent double-injection
    safeThis.__reactRefreshInjected = true;
  }
}
