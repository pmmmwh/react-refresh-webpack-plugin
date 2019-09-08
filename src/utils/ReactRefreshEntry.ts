if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  const Refresh = require('react-refresh/runtime');
  Refresh.injectIntoGlobalHook(window);
  (window as any).$RefreshReg$ = (): void => undefined;
  (window as any).$RefreshSig$ = () => <T>(type: T) => type;
}
