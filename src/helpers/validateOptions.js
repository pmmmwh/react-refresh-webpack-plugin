const { defaultOptions, defaultOverlayOptions } = require('./defaults');

function isBooleanOrUndefined(name, value) {
  const valueType = typeof value;
  if (valueType !== 'undefined' && valueType !== 'boolean') {
    throw new Error(
      [
        `The "${name}" option, if defined, must be a boolean value.`,
        `Instead received: "${valueType}".`,
      ].join('\n')
    );
  }
}

function isStringOrUndefined(name, value) {
  const valueType = typeof value;
  if (valueType !== 'undefined' && valueType !== 'string') {
    throw new Error(
      [
        `The "${name}" option, if defined, must be a string.`,
        `Instead received: "${valueType}".`,
      ].join('\n')
    );
  }
}

/**
 * Validates the options for the plugin.
 * @param {import('../types').ReactRefreshPluginOptions} options Non-validated plugin options object.
 * @returns {import('../types').ReactRefreshPluginOptions} Validated plugin options.
 */
function validateOptions(options) {
  // Show deprecation notice and remove the option before any processing
  if (typeof options.disableRefreshCheck !== 'undefined') {
    console.warn(
      [
        'The "disableRefreshCheck" option has been deprecated and will not have any effect on how the plugin parses files.',
        'Please remove it from your configuration.',
      ].join(' ')
    );
    delete options.disableRefreshCheck;
  }

  isBooleanOrUndefined('forceEnable', options.forceEnable);
  isBooleanOrUndefined('useLegacyWDSSockets', options.useLegacyWDSSockets);

  const overlayValueType = typeof options.overlay;
  if (
    // Not undefined
    overlayValueType !== 'undefined' &&
    // Not a boolean
    overlayValueType !== 'boolean' &&
    // Not a function ([object Function])
    overlayValueType !== 'function' &&
    // Not an object ([object *]) or is null
    (overlayValueType !== 'object' || options.overlay === null)
  ) {
    throw new Error(
      [
        `The "overlay" option, if defined, must be one of: boolean or object.`,
        `Instead received: "${overlayValueType}".`,
      ].join('\n')
    );
  }

  const defaultedOptions = Object.assign(defaultOptions, options);

  if (
    typeof defaultedOptions.overlay !== 'undefined' &&
    typeof defaultedOptions.overlay !== 'boolean'
  ) {
    const { entry, module: overlayModule } = defaultedOptions.overlay;
    isStringOrUndefined('overlay.entry', entry);
    isStringOrUndefined('overlay.module', overlayModule);

    defaultedOptions.overlay = {
      ...defaultedOptions.overlay,
      entry: entry || defaultOverlayOptions.entry,
      module: overlayModule || defaultOverlayOptions.module,
    };
  } else {
    defaultedOptions.overlay =
      (typeof defaultedOptions.overlay === 'undefined' || defaultedOptions.overlay) &&
      defaultOverlayOptions;
  }

  return defaultedOptions;
}

module.exports = validateOptions;
