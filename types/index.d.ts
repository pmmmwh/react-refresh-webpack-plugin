export = ReactRefreshPlugin;
declare class ReactRefreshPlugin {
    /**
     * @param {import('./types').ReactRefreshPluginOptions} [options] Options for react-refresh-plugin.
     */
    constructor(options?: import("./types").ReactRefreshPluginOptions | undefined);
    /**
     * @readonly
     * @type {import('./types').ValidatedPluginOptions}
     */
    readonly options: import('./types').ValidatedPluginOptions;
    /**
     * Applies the plugin.
     * @param {import('webpack').Compiler} compiler A webpack compiler object.
     * @returns {void}
     */
    apply(compiler: import("webpack").Compiler): void;
}
declare namespace ReactRefreshPlugin {
    export { ReactRefreshPlugin };
}
