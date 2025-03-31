/**
 * @typedef {Object} AdditionalEntries
 * @property {string[]} prependEntries
 * @property {string[]} overlayEntries
 */

/**
 * Creates an object that contains two entry arrays: the prependEntries and overlayEntries
 * @param {import('../types').NormalizedPluginOptions} options Configuration options for this plugin.
 * @returns {AdditionalEntries} An object that contains the Webpack entries for prepending and the overlay feature
 */
function getAdditionalEntries(options) {
  const prependEntries = [
    // React-refresh runtime
    require.resolve('../../client/ReactRefreshEntry'),
  ];

  const overlayEntries = [
    // Error overlay runtime
    options.overlay && options.overlay.entry && require.resolve(options.overlay.entry),
  ].filter(Boolean);

  return { prependEntries, overlayEntries };
}

module.exports = getAdditionalEntries;
