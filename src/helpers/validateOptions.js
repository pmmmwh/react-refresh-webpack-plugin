/** @type {import('../types').ReactRefreshPluginOptions} */
const defaultOptions = {
  disableRefreshCheck: false,
  forceEnable: false,
  useLegacyWDSSockets: false,
};

/** @type {import('../types').ErrorOverlayOptions} */
const defaultOverlayOptions = {
  entry: require.resolve('../runtime/ErrorOverlayEntry'),
  overlay: require.resolve('../overlay'),
};

/**
 * Validates the options for the plugin.
 * @param {import('../types').ReactRefreshPluginOptions} options Non-validated plugin options object.
 * @returns {import('../types').ReactRefreshPluginOptions} Validated plugin options.
 */
module.exports = function validateOptions(options) {
  const validatedOptions = Object.assign(defaultOptions, options);

  if (typeof validatedOptions.overlay !== 'boolean') {
    if (typeof validatedOptions.overlay.module !== 'string') {
      throw new Error(
        `To use the "overlay" option, a string must be provided in the "module" property. Instead, the provided value has type: "${typeof options
          .overlay.module}".`
      );
    }

    validatedOptions.overlay = {
      entry: options.overlay.entry || defaultOverlayOptions.entry,
      module: options.overlay.module,
    };
  } else {
    validatedOptions.overlay =
      (typeof validatedOptions.overlay === 'undefined' || validatedOptions.overlay) &&
      defaultOverlayOptions;
  }

  return validatedOptions;
};
