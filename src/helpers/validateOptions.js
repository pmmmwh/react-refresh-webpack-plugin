const { defaultOptions, defaultOverlayOptions } = require('./defaults');

/**
 * Checks if a value is a boolean or undefined, and throw if it isn't.
 * @param {string} name The name of the value.
 * @param {*} value The value itself.
 * @returns {void} Whether the value is a boolean or undefined.
 */
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

/**
 * Checks if a value is a number or undefined, and throw if it isn't.
 * @param {string} name The name of the value.
 * @param {*} value The value itself.
 * @returns {void} Whether the value is a number or undefined.
 */
function isNumberOrUndefined(name, value) {
  const valueType = typeof value;
  if (valueType !== 'undefined' && valueType !== 'number') {
    throw new Error(
      [
        `The "${name}" option, if defined, must be a number.`,
        `Instead received: "${valueType}".`,
      ].join('\n')
    );
  }
}

/**
 * Checks if a value is a string or undefined, and throw if it isn't.
 * @param {string} name The name of the value.
 * @param {*} value The value itself.
 * @returns {void} Whether the value is a string or undefined.
 */
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
 * @returns {import('../types').ValidatedPluginOptions} Validated plugin options.
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
    const {
      entry,
      module: overlayModule,
      sockHost,
      sockIntegration,
      sockPath,
      sockPort,
    } = defaultedOptions.overlay;
    isStringOrUndefined('overlay.entry', entry);
    isStringOrUndefined('overlay.module', overlayModule);
    isStringOrUndefined('overlay.sockHost', sockHost);
    isStringOrUndefined('overlay.sockIntegration', sockIntegration);
    isStringOrUndefined('overlay.sockPath', sockPath);
    isNumberOrUndefined('overlay.sockPort', sockPort);

    defaultedOptions.overlay = {
      ...defaultedOptions.overlay,
      entry: entry || defaultOverlayOptions.entry,
      module: overlayModule || defaultOverlayOptions.module,
      sockIntegration: sockIntegration || defaultOverlayOptions.sockIntegration,
    };
  } else {
    defaultedOptions.overlay =
      (typeof defaultedOptions.overlay === 'undefined' || defaultedOptions.overlay) &&
      defaultOverlayOptions;
  }

  return defaultedOptions;
}

module.exports = validateOptions;
