const querystring = require('querystring');

/**
 * Creates the webpack entry for the overlay
 * @param {import('../types').NormalizedPluginOptions} options Configuration options for this plugin.
 * @param {import('webpack').Compiler.options.devServer} devServer The webpack devServer config
 * @returns {WebpackEntry[]} An array of webpack entries; first is the prepend entry, and second is the overlay entry
 */
function getOverlayEntry(options, devServer) {
  /** @type {Record<string, *>} */
  let resourceQuery = {};

  if (Object.keys(devServer).length) {
    const { sockHost, sockPath, sockPort } = devServer;

    sockHost && (resourceQuery.sockHost = sockHost);
    sockPath && (resourceQuery.sockPath = sockPath);
    sockPort && (resourceQuery.sockPort = sockPort);
  }

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
    require.resolve('../../client/ReactRefreshEntry'),
  ];

  const overlayEntries = [
    // Legacy WDS SockJS integration
    options.overlay &&
      options.overlay.useLegacyWDSSockets &&
      require.resolve('../../client/LegacyWDSSocketEntry'),
    // Error overlay runtime
    options.overlay &&
      options.overlay.entry &&
      options.overlay.entry + (queryString && `?${queryString}`),
  ].filter(Boolean);

  return [prependEntries, overlayEntries];
}

module.exports = getOverlayEntry;
