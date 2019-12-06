const path = require('path');
const webpack = require('webpack');
const { createRefreshTemplate, injectRefreshEntry } = require('./helpers');
const { refreshUtils } = require('./runtime/globals');

/**
 * @typedef {Object} ReactRefreshPluginOptions
 * @property {boolean} [disableRefreshCheck] Disables detection of react-refresh's Babel plugin.
 * @property {boolean} [forceEnable] Enables the plugin forcefully.
 */

/** @type {ReactRefreshPluginOptions} */
const defaultOptions = {
  disableRefreshCheck: false,
  forceEnable: false,
};

class ReactRefreshPlugin {
  /**
   * @param {ReactRefreshPluginOptions} [options] Options for react-refresh-plugin.
   * @returns {void}
   */
  constructor(options) {
    this.options = Object.assign(defaultOptions, options);
  }

  /**
   * Applies the plugin
   * @param {import('webpack').Compiler} compiler A webpack compiler object.
   * @returns {void}
   */
  apply(compiler) {
    // Webpack does not set process.env.NODE_ENV
    // Ref: https://github.com/webpack/webpack/issues/7074
    // Skip processing on non-development mode, but allow manual force-enabling
    if (compiler.options.mode !== 'development' && !this.options.forceEnable) {
      return;
    }

    // Inject react-refresh context to all Webpack entry points
    compiler.options.entry = injectRefreshEntry(compiler.options.entry);

    // Inject refresh utilities to Webpack's global scope
    const providePlugin = new webpack.ProvidePlugin({
      [refreshUtils]: require.resolve('./runtime/utils'),
    });
    providePlugin.apply(compiler);

    compiler.hooks.beforeRun.tap(this.constructor.name, compiler => {
      // Check for existence of HotModuleReplacementPlugin in the plugin list
      // It is the foundation to this plugin working correctly
      if (
        !compiler.options.plugins.find(
          // It's validated with the name rather than the constructor reference
          // because a project might contain multiple references to Webpack
          plugin => plugin.constructor.name === 'HotModuleReplacementPlugin'
        )
      ) {
        throw new Error(
          'Hot Module Replacement (HMR) is not enabled! React-refresh requires HMR to function properly.'
        );
      }
    });

    compiler.hooks.normalModuleFactory.tap(this.constructor.name, nmf => {
      nmf.hooks.afterResolve.tap(this.constructor.name, data => {
        // Inject refresh loader to all JavaScript-like files
        if (
          // Test for known (and popular) JavaScript-like extensions
          /\.([jt]sx?|flow)$/.test(data.resource) &&
          // Skip all files from node_modules
          !/node_modules/.test(data.resource) &&
          // Skip files related to refresh runtime (to prevent self-referencing)
          // This is useful when using the plugin as a direct dependency
          !data.resource.includes(path.join(__dirname, './runtime'))
        ) {
          data.loaders.unshift({
            loader: require.resolve('./loader'),
            options: undefined,
          });
        }

        return data;
      });
    });

    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      compilation.mainTemplate.hooks.require.tap(
        this.constructor.name,
        // Constructs the correct module template for react-refresh
        createRefreshTemplate
      );

      compilation.hooks.finishModules.tap(this.constructor.name, modules => {
        if (!this.options.disableRefreshCheck) {
          const refreshPluginInjection = /\$RefreshReg\$/;
          const RefreshDetectionModule = modules.find(
            module => module.resource === require.resolve('./runtime/BabelDetectComponent.js')
          );

          // In most cases, if we cannot find the injected detection module,
          // there are other compilation instances injected by other plugins.
          // We will have to bail out in those cases.
          if (!RefreshDetectionModule) {
            return;
          }

          // Check for the function transform by the Babel plugin.
          if (!refreshPluginInjection.test(RefreshDetectionModule._source.source())) {
            throw new Error(
              [
                'The plugin is unable to detect transformed code from react-refresh.',
                'Did you forget to include "react-refresh/babel" in your list of Babel plugins?',
                'Note: you can disable this check by setting "disableRefreshCheck: true".',
              ].join(' ')
            );
          }
        }
      });
    });
  }
}

module.exports.ReactRefreshPlugin = ReactRefreshPlugin;
module.exports = ReactRefreshPlugin;
