/**
 * @typedef {Object} ESModuleOptions
 * @property {string | RegExp | Array<string | RegExp>} [exclude] Files to explicitly exclude from processing.
 * @property {string | RegExp | Array<string | RegExp>} [include] Files to explicitly include for processing.
 */

/**
 * @typedef {Object} ReactRefreshLoaderOptions
 * @property {boolean} [blockIdentifier] Enables the plugin forcefully.
 * @property {boolean | ESModuleOptions} [esModule] Files to explicitly exclude from processing.
 */

/**
 * @typedef {import('type-fest').SetRequired<ReactRefreshLoaderOptions, 'blockIdentifier'>} NormalizedLoaderOptions
 */

module.exports = {};
