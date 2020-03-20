/** @typedef {string | string[] | import('webpack').Entry} StaticEntry */
/** @typedef {StaticEntry | import('webpack').EntryFunc} WebpackEntry */

/**
 * Injects an entry to the bundle for react-refresh.
 * @param {WebpackEntry} [originalEntry] A Webpack entry object.
 * @param {ReactRefreshPluginOptions} [options] Configuration options for this plugin
 * @returns {WebpackEntry} An injected entry object.
 */
const injectRefreshEntry = (originalEntry, options) => {
  const getEntryInjects = ({ webpackHotMiddlewareEntry } = {}) =>
    [
      options.useLegacyWDSSockets && require.resolve('../runtime/LegacyWebpackDevServerSocket'),
      // React-refresh runtime
      require.resolve('../runtime/ReactRefreshEntry'),
      // webpack-hot-middleware client
      webpackHotMiddlewareEntry && webpackHotMiddlewareEntry,
      // Error overlay runtime
      require.resolve('../runtime/ErrorOverlayEntry'),
      // React-refresh Babel transform detection
      require.resolve('../runtime/BabelDetectComponent'),
    ].filter(Boolean);

  // Single string entry point
  if (typeof originalEntry === 'string') {
    return [...getEntryInjects(), originalEntry];
  }
  // Single array entry point
  if (Array.isArray(originalEntry)) {
    const webpackHotMiddlewareEntry = originalEntry.find(entry =>
      entry.includes('webpack-hot-middleware')
    );
    return [
      ...getEntryInjects({ webpackHotMiddlewareEntry }),
      ...originalEntry.filter(entry => !entry.includes('webpack-hot-middleware')),
    ];
  }
  // Multiple entry points
  if (typeof originalEntry === 'object') {
    return Object.entries(originalEntry).reduce(
      (acc, [curKey, curEntry]) => ({
        ...acc,
        [curKey]: injectRefreshEntry(curEntry, options),
      }),
      {}
    );
  }
  // Dynamic entry points
  if (typeof originalEntry === 'function') {
    return (...args) =>
      Promise.resolve(originalEntry(...args)).then(resolvedEntry =>
        injectRefreshEntry(resolvedEntry, options)
      );
  }

  throw new Error('Failed to parse the Webpack `entry` object!');
};

module.exports = injectRefreshEntry;
