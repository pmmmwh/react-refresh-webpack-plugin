export type ErrorOverlayOptions = {
  /**
   * Path to a JS file that sets up the error overlay integration.
   */
  entry?: string | false | undefined;
  /**
   * The error overlay module to use.
   */
  module?: string | false | undefined;
  /**
   * The socket host to use (WDS only).
   */
  sockHost?: string | undefined;
  /**
   * Path to a JS file that sets up the Webpack socket integration.
   */
  sockIntegration?:
    | false
    | (string & {
        _?: undefined;
      })
    | 'wds'
    | 'whm'
    | 'wps'
    | undefined;
  /**
   * The socket path to use (WDS only).
   */
  sockPath?: string | undefined;
  /**
   * The socket port to use (WDS only).
   */
  sockPort?: number | undefined;
  /**
   * The socket protocol to use (WDS only).
   */
  sockProtocol?: 'http' | 'https' | 'ws' | 'wss' | undefined;
  /**
   * Uses a custom SocketJS implementation for older versions of WDS.
   */
  useLegacyWDSSockets?: boolean | undefined;
  /**
   * Uses a polyfill for the DOM URL API (WDS only).
   */
  useURLPolyfill?: boolean | undefined;
};
export type NormalizedErrorOverlayOptions = {
  /**
   * The socket host to use (WDS only).
   */
  sockHost?: string | undefined;
  /**
   * The socket path to use (WDS only).
   */
  sockPath?: string | undefined;
  /**
   * The socket port to use (WDS only).
   */
  sockPort?: number | undefined;
  /**
   * The socket protocol to use (WDS only).
   */
  sockProtocol?: 'http' | 'https' | 'ws' | 'wss' | undefined;
  /**
   * Uses a custom SocketJS implementation for older versions of WDS.
   */
  useLegacyWDSSockets?: boolean | undefined;
  /**
   * Uses a polyfill for the DOM URL API (WDS only).
   */
  useURLPolyfill?: boolean | undefined;
  /**
   * The error overlay module to use.
   */
  module: string | false;
  /**
   * Path to a JS file that sets up the error overlay integration.
   */
  entry: string | false;
  /**
   * Path to a JS file that sets up the Webpack socket integration.
   */
  sockIntegration: import('type-fest').LiteralUnion<'wds' | 'whm' | 'wps' | false, string>;
};
export type ReactRefreshPluginOptions = {
  /**
   * Files to explicitly exclude from processing.
   */
  exclude?: string | RegExp | (string | RegExp)[] | undefined;
  /**
   * Enables the plugin forcefully.
   */
  forceEnable?: boolean | undefined;
  /**
   * Files to explicitly include for processing.
   */
  include?: string | RegExp | (string | RegExp)[] | undefined;
  /**
   * Name of the library bundle.
   */
  library?: string | undefined;
  /**
   * Modifies how the error overlay integration works in the plugin.
   */
  overlay?: boolean | ErrorOverlayOptions | undefined;
};
export type OverlayOverrides = {
  /**
   * Modifies how the error overlay integration works in the plugin.
   */
  overlay: false | NormalizedErrorOverlayOptions;
};
export type NormalizedPluginOptions = {
  /**
   * Enables the plugin forcefully.
   */
  forceEnable?: boolean | undefined;
  /**
   * Name of the library bundle.
   */
  library?: string | undefined;
  /**
   * Files to explicitly include for processing.
   */
  include: string | RegExp | Array<string | RegExp>;
  /**
   * Files to explicitly exclude from processing.
   */
  exclude: string | RegExp | Array<string | RegExp>;
} & OverlayOverrides;
