const querystring = require('querystring');

/** @typedef {string | string[] | import('webpack').Entry} StaticEntry */
/** @typedef {StaticEntry | import('webpack').EntryFunc} WebpackEntry */

/**
 * Injects an entry to the bundle for react-refresh.
 * @param {WebpackEntry} [originalEntry] A Webpack entry object.
 * @param {import('../types').NormalizedPluginOptions} options Configuration options for this plugin.
 * @returns {WebpackEntry} An injected entry object.
 */
function injectRefreshEntry(originalEntry, options) {
  /** @type {Record<string, *>} */
  let resourceQuery = {};
  if (options.overlay) {
    options.overlay.sockHost && (resourceQuery.sockHost = options.overlay.sockHost);
    options.overlay.sockPath && (resourceQuery.sockPath = options.overlay.sockPath);
    options.overlay.sockPort && (resourceQuery.sockPort = options.overlay.sockPort);
  }

  // We don't need to URI encode the resourceQuery as it will be parsed by Webpack
  const queryString = querystring.stringify(resourceQuery, undefined, undefined, {
    /**
     * @param {string} string
     * @returns {string}
     */
    encodeURIComponent(string) {
      return string;
    },
  });

  const prependEntries = [
    // React-refresh runtime
    require.resolve('../runtime/ReactRefreshEntry'),
  ];

  const appendEntries = [
    // Legacy WDS SockJS integration
    options.useLegacyWDSSockets && require.resolve('../runtime/LegacyWDSSocketEntry'),
    // Error overlay runtime
    options.overlay && options.overlay.entry + (queryString && `?${queryString}`),
  ].filter(Boolean);

  // Single string entry point
  if (typeof originalEntry === 'string') {
    return [...prependEntries, originalEntry, ...appendEntries];
  }
  // Single array entry point
  if (Array.isArray(originalEntry)) {
    return [...prependEntries, ...originalEntry, ...appendEntries];
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
      Promise.resolve(originalEntry(...args)).then((resolvedEntry) =>
        injectRefreshEntry(resolvedEntry, options)
      );
  }

  throw new Error('Failed to parse the Webpack `entry` object!');
}

module.exports = injectRefreshEntry;
