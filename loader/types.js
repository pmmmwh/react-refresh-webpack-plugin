/**
 * @typedef {Object} ESModuleOptions
 * @property {string | RegExp | Array<string | RegExp>} [exclude] Files to explicitly exclude from processing.
 * @property {string | RegExp | Array<string | RegExp>} [include] Files to explicitly include for processing.
 */

/**
 * @typedef {Object} ReactRefreshLoaderOptions
 * @property {boolean} [const]
 * @property {boolean | ESModuleOptions} [esModule]
 */

/**
 * @typedef {import('type-fest').SetRequired<ReactRefreshLoaderOptions, 'const'>} NormalizedLoaderOptions
 */

module.exports = {};
