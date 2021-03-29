export type ESModuleOptions = {
  /**
   * Files to explicitly exclude from processing.
   */
  exclude?: string | RegExp | (string | RegExp)[] | undefined;
  /**
   * Files to explicitly include for processing.
   */
  include?: string | RegExp | (string | RegExp)[] | undefined;
};
export type ReactRefreshLoaderOptions = {
  /**
   * Enables the plugin forcefully.
   */
  blockIdentifier?: boolean | undefined;
  /**
   * Files to explicitly exclude from processing.
   */
  esModule?: boolean | ESModuleOptions | undefined;
};
export type NormalizedLoaderOptions = import('type-fest').SetRequired<
  ReactRefreshLoaderOptions,
  'blockIdentifier'
>;
