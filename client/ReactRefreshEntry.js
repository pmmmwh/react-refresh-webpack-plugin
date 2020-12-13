/* global __react_refresh_library__ */

const safeThis = require('./utils/safeThis');

if (process.env.NODE_ENV !== 'production' && typeof safeThis !== 'undefined') {
  let $RefreshInjected$ = '__reactRefreshInjected';
  // Namespace the injected flag (if necessary) for monorepo compatibility
  if (typeof __react_refresh_library__ !== 'undefined' && __react_refresh_library__) {
    $RefreshInjected$ += '_' + __react_refresh_library__;
  }

  // Only inject the runtime if it hasn't been injected
  if (!safeThis[$RefreshInjected$]) {
    const RefreshRuntime = require('react-refresh/runtime');
    // Inject refresh runtime into global scope
    RefreshRuntime.injectIntoGlobalHook(safeThis);

    // Mark the runtime as injected to prevent double-injection
    safeThis[$RefreshInjected$] = true;
  }
}
