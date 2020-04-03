/** @type {import('../types').ReactRefreshPluginOptions} */
const defaultOptions = {
  forceEnable: false,
  useLegacyWDSSockets: false,
};

/** @type {import('../types').ErrorOverlayOptions} */
const defaultOverlayOptions = {
  entry: require.resolve('../runtime/ErrorOverlayEntry'),
  module: require.resolve('../overlay'),
};

module.exports = {
  defaultOptions,
  defaultOverlayOptions,
};
