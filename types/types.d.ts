export type ErrorOverlayOptions = {
    /**
     * Path to a JS file that sets up the error overlay integration.
     */
    entry?: string;
    /**
     * The error overlay module to use.
     */
    module?: string;
    /**
     * The socket host to use.
     */
    sockHost?: string;
    /**
     * Path to a JS file that sets up the Webpack socket integration.
     */
    sockIntegration?: string;
    /**
     * The socket path to use.
     */
    sockPath?: string;
    /**
     * The socket port to use.
     */
    sockPort?: number;
};
export type ReactRefreshPluginOptions = {
    /**
     * Disables detection of react-refresh's Babel plugin. (Deprecated since v0.3.0)
     */
    disableRefreshCheck?: boolean;
    /**
     * Enables the plugin forcefully.
     */
    forceEnable?: boolean;
    /**
     * Modifies how the error overlay integration works in the plugin.
     */
    overlay?: boolean | ErrorOverlayOptions;
    /**
     * Uses a custom SocketJS implementation for older versions of webpack-dev-server.
     */
    useLegacyWDSSockets?: boolean;
};
export type BaselinePluginOptions = {
    overlay: ErrorOverlayOptions;
};
export type ValidatedPluginOptions = Pick<Required<ReactRefreshPluginOptions>, "forceEnable" | "useLegacyWDSSockets"> & BaselinePluginOptions;
