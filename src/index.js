const webpack = require('webpack');
const { createRefreshTemplate, injectRefreshEntry } = require('./helpers');
const { runtimeUtils } = require('./runtime/globals');

class ReactRefreshPlugin {
  /**
   * @param {*} [options] Options for react-refresh-plugin.
   * @param {boolean} [options.forceEnable] A flag to enable the plugin forcefully.
   * @returns {void}
   */
  constructor(options) {
    this.options = options || {};
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

    // Inject refresh utilities to Webpack global scope
    const providePlugin = new webpack.ProvidePlugin({
      [runtimeUtils]: require.resolve('./runtime/utils'),
    });
    providePlugin.apply(compiler);

    compiler.hooks.normalModuleFactory.tap(this.constructor.name, nmf => {
      nmf.hooks.afterResolve.tap(this.constructor.name, data => {
        // Inject refresh loader to all JavaScript-like files
        if (
          /\.([jt]sx?|flow)$/.test(data.resource) &&
          !/node_modules/.test(data.resource)
        ) {
          data.loaders.unshift({
            loader: require.resolve('./loader'),
          });
        }

        return data;
      });
    });

    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      compilation.mainTemplate.hooks.require.tap(
        this.constructor.name,
        createRefreshTemplate
      );

      compilation.hooks.normalModuleLoader.tap(
        this.constructor.name,
        context => {
          if (!context.hot) {
            throw Error(
              'Hot Module Replacement (HMR) is not enabled! React-refresh requires HMR to function properly.'
            );
          }
        }
      );
    });
  }
}

module.exports.ReactRefreshPlugin = ReactRefreshPlugin;
module.exports = ReactRefreshPlugin;
