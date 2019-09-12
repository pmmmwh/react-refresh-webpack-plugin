interface WindowInjections {
  $RefreshReg$: (type?: string, id?: number) => void;
  $RefreshSig$: () => <T>(type: T) => T;
  __RefreshModule: (moduleId: number) => () => void;
}

type InjectedWindow = typeof window & WindowInjections;

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  const Refresh = require('react-refresh/runtime');
  // Inject runtime into global
  Refresh.injectIntoGlobalHook(window);

  // Setup placeholder functions
  (window as InjectedWindow).$RefreshReg$ = () => undefined;
  (window as InjectedWindow).$RefreshSig$ = () => type => type;

  // Setup module refresh
  (window as InjectedWindow).__RefreshModule = moduleId => {
    // Capture previous refresh state
    const prevRefreshReg = (window as InjectedWindow).$RefreshReg$;
    const prevRefreshSig = (window as InjectedWindow).$RefreshSig$;

    // Inject new refresh state
    (window as InjectedWindow).$RefreshReg$ = (type, id) => {
      const fullId = moduleId + ' ' + id;
      Refresh.register(type, fullId);
    };
    (window as InjectedWindow).$RefreshSig$ =
      Refresh.createSignatureFunctionForTransform;

    // Restore to previous functions after refresh
    return () => {
      (window as InjectedWindow).$RefreshReg$ = prevRefreshReg;
      (window as InjectedWindow).$RefreshSig$ = prevRefreshSig;
    };
  };
}
