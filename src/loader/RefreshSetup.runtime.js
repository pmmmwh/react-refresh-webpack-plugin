/* global $RefreshCleanup$, $RefreshReg$, $RefreshRuntime$, $RefreshSig$ */
/* eslint-disable no-global-assign */

/**
 * Code prepended to each JS-like module to setup react-refresh globals.
 *
 * All globals are injected via Webpack parser hooks.
 *
 * The function declaration syntax below is needed for `Template.getFunctionContent` to parse this.
 */
module.exports = function () {
  $RefreshRuntime$ = require('react-refresh/runtime');

  const __react_refresh_prev_reg__ = $RefreshReg$;
  const __react_refresh_prev_sig__ = $RefreshSig$;
  const __react_refresh_prev_cleanup__ = $RefreshCleanup$;

  $RefreshReg$ = function (type, id) {
    const typeId = module.i + ' ' + id;
    $RefreshRuntime$.register(type, typeId);
  };

  $RefreshSig$ = $RefreshRuntime$.createSignatureFunctionForTransform;

  $RefreshCleanup$ = function () {
    $RefreshReg$ = __react_refresh_prev_reg__;
    $RefreshSig$ = __react_refresh_prev_sig__;
    $RefreshCleanup$ = __react_refresh_prev_cleanup__;
  };
};
