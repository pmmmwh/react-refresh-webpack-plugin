if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  const Refresh = require('react-refresh/runtime');

  // Inject refresh runtime into global
  Refresh.injectIntoGlobalHook(window);

  // Setup placeholder functions
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => type => type;

  /**
   * Setup module refresh.
   * @param {number} moduleId An ID of a module.
   * @returns {function(): void} A function to restore handlers to their previous state.
   */
  window.__RefreshModule = moduleId => {
    // Capture previous refresh state
    const prevRefreshReg = window.$RefreshReg$;
    const prevRefreshSig = window.$RefreshSig$;

    /**
     * Registers a refresh to react-refresh.
     * @param {string} [type] A valid type of a module.
     * @param {number} [id] An ID of a module.
     * @returns {void}
     */
    window.$RefreshReg$ = (type, id) => {
      const fullId = moduleId + ' ' + id;
      Refresh.register(type, fullId);
    };

    /**
     * Createes a module signature function from react-refresh.
     * @returns {function(string): string} A created signature function.
     */
    window.$RefreshSig$ = Refresh.createSignatureFunctionForTransform;

    // Restore to previous functions after refresh
    return () => {
      window.$RefreshReg$ = prevRefreshReg;
      window.$RefreshSig$ = prevRefreshSig;
    };
  };
}
