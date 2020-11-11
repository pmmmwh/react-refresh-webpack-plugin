const querystring = require('querystring');

/**
 * Creates an object that contains two entry arrays: the prependEntries and overlayEntries
 * @param {import('../types').NormalizedPluginOptions} options Configuration options for this plugin.
 * @param {import('webpack').Compiler.options.devServer | undefined} devServer The webpack devServer config
 * @returns {import('./injectRefreshEntry').AdditionalEntries} An object that contains the Webpack entries for prepending and the overlay feature
 */
function getOverlayEntry(options, devServer) {
  /** @type {Record<string, *>} */
  let resourceQuery = {};

  if (devServer) {
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

  return { prependEntries, overlayEntries };
}

module.exports = getOverlayEntry;
