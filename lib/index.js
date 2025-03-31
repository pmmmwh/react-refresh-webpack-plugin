const { validate: validateOptions } = require('schema-utils');
const { getRefreshGlobalScope } = require('./globals');
const {
  getAdditionalEntries,
  getIntegrationEntry,
  getSocketIntegration,
  injectRefreshLoader,
  makeRefreshRuntimeModule,
  normalizeOptions,
} = require('./utils');
const schema = require('./options.json');

class ReactRefreshPlugin {
  /**
   * @param {import('./types').ReactRefreshPluginOptions} [options] Options for react-refresh-plugin.
   */
  constructor(options = {}) {
    validateOptions(schema, options, {
      name: 'React Refresh Plugin',
      baseDataPath: 'options',
    });

    /**
     * @readonly
     * @type {import('./types').NormalizedPluginOptions}
     */
    this.options = normalizeOptions(options);
  }

  /**
   * Applies the plugin.
   * @param {import('webpack').Compiler} compiler A webpack compiler object.
   * @returns {void}
   */
  apply(compiler) {
    // Skip processing in non-development mode, but allow manual force-enabling
    if (
      // Webpack do not set process.env.NODE_ENV, so we need to check for mode.
      // Ref: https://github.com/webpack/webpack/issues/7074
      (compiler.options.mode !== 'development' ||
        // We also check for production process.env.NODE_ENV,
        // in case it was set and mode is non-development (e.g. 'none')
        (process.env.NODE_ENV && process.env.NODE_ENV === 'production')) &&
      !this.options.forceEnable
    ) {
      return;
    }

    const logger = compiler.getInfrastructureLogger(this.constructor.name);

    // Get Webpack imports from compiler instance (if available) -
    // this allow mono-repos to use different versions of Webpack without conflicts.
    const webpack = compiler.webpack || require('webpack');
    const {
      DefinePlugin,
      EntryDependency,
      EntryPlugin,
      ModuleFilenameHelpers,
      NormalModule,
      ProvidePlugin,
      RuntimeGlobals,
      Template,
    } = webpack;

    // Inject react-refresh context to all Webpack entry points.
    const { overlayEntries, prependEntries } = getAdditionalEntries(this.options);
    // Prepended entries does not care about injection order,
    // so we can utilise EntryPlugin for simpler logic.
    for (const entry of prependEntries) {
      new EntryPlugin(compiler.context, entry, { name: undefined }).apply(compiler);
    }

    const integrationEntry = getIntegrationEntry(this.options.overlay.sockIntegration);
    const socketEntryData = [];
    compiler.hooks.make.tap(
      { name: this.constructor.name, stage: Number.POSITIVE_INFINITY },
      (compilation) => {
        // Exhaustively search all entries for `integrationEntry`.
        // If found, mark those entries and the index of `integrationEntry`.
        for (const [name, entryData] of compilation.entries.entries()) {
          const index = entryData.dependencies.findIndex(
            (dep) => dep.request && dep.request.includes(integrationEntry)
          );
          if (index !== -1) {
            socketEntryData.push({ name, index });
          }
        }
      }
    );

    // Overlay entries need to be injected AFTER integration's entry,
    // so we will loop through everything in `finishMake` instead of `make`.
    // This ensures we can traverse all entry points and inject stuff with the correct order.
    for (const [idx, entry] of overlayEntries.entries()) {
      compiler.hooks.finishMake.tapPromise(
        {
          name: this.constructor.name,
          stage: Number.MIN_SAFE_INTEGER + (overlayEntries.length - idx - 1),
        },
        (compilation) => {
          // Only hook into the current compiler
          if (compilation.compiler !== compiler) {
            return Promise.resolve();
          }

          const injectData = socketEntryData.length ? socketEntryData : [{ name: undefined }];
          return Promise.all(
            injectData.map(({ name, index }) => {
              return new Promise((resolve, reject) => {
                const options = { name };
                const dep = EntryPlugin.createDependency(entry, options);
                compilation.addEntry(compiler.context, dep, options, (err) => {
                  if (err) return reject(err);

                  // If the entry is not a global one,
                  // and we have registered the index for integration entry,
                  // we will reorder all entry dependencies to our desired order.
                  // That is, to have additional entries DIRECTLY behind integration entry.
                  if (name && typeof index !== 'undefined') {
                    const entryData = compilation.entries.get(name);
                    entryData.dependencies.splice(
                      index + 1,
                      0,
                      entryData.dependencies.splice(entryData.dependencies.length - 1, 1)[0]
                    );
                  }

                  resolve();
                });
              });
            })
          );
        }
      );
    }

    // Inject necessary modules and variables to bundle's global scope
    const refreshGlobal = getRefreshGlobalScope(RuntimeGlobals || {});
    /** @type {Record<string, string | boolean>}*/
    const definedModules = {
      // Mapping of react-refresh globals to Webpack runtime globals
      $RefreshReg$: `${refreshGlobal}.register`,
      $RefreshSig$: `${refreshGlobal}.signature`,
      'typeof $RefreshReg$': 'function',
      'typeof $RefreshSig$': 'function',

      // Library mode
      __react_refresh_library__: JSON.stringify(
        Template.toIdentifier(
          this.options.library ||
            compiler.options.output.uniqueName ||
            compiler.options.output.library
        )
      ),
    };
    /** @type {Record<string, string>} */
    const providedModules = {
      __react_refresh_utils__: require.resolve('./runtime/RefreshUtils'),
    };

    if (this.options.overlay === false) {
      // Stub errorOverlay module so their calls can be erased
      definedModules.__react_refresh_error_overlay__ = false;
      definedModules.__react_refresh_socket__ = false;
    } else {
      if (this.options.overlay.module) {
        providedModules.__react_refresh_error_overlay__ = require.resolve(
          this.options.overlay.module
        );
      }
      if (this.options.overlay.sockIntegration) {
        providedModules.__react_refresh_socket__ = getSocketIntegration(
          this.options.overlay.sockIntegration
        );
      }
    }

    new DefinePlugin(definedModules).apply(compiler);
    new ProvidePlugin(providedModules).apply(compiler);

    const match = ModuleFilenameHelpers.matchObject.bind(undefined, this.options);
    let loggedHotWarning = false;
    compiler.hooks.compilation.tap(
      this.constructor.name,
      (compilation, { normalModuleFactory }) => {
        // Only hook into the current compiler
        if (compilation.compiler !== compiler) {
          return;
        }

        // Set factory for EntryDependency which is used to initialise the module
        compilation.dependencyFactories.set(EntryDependency, normalModuleFactory);

        const ReactRefreshRuntimeModule = makeRefreshRuntimeModule(webpack);
        compilation.hooks.additionalTreeRuntimeRequirements.tap(
          this.constructor.name,
          // Setup react-refresh globals with a Webpack runtime module
          (chunk, runtimeRequirements) => {
            runtimeRequirements.add(RuntimeGlobals.interceptModuleExecution);
            runtimeRequirements.add(RuntimeGlobals.moduleCache);
            runtimeRequirements.add(refreshGlobal);
            compilation.addRuntimeModule(chunk, new ReactRefreshRuntimeModule());
          }
        );

        normalModuleFactory.hooks.afterResolve.tap(
          this.constructor.name,
          // Add react-refresh loader to process files that matches specified criteria
          (resolveData) => {
            injectRefreshLoader(resolveData.createData, {
              match,
              options: {
                const: compilation.runtimeTemplate.supportsConst(),
                esModule: this.options.esModule,
              },
            });
          }
        );

        NormalModule.getCompilationHooks(compilation).loader.tap(
          // `Infinity` ensures this check will run only after all other taps
          { name: this.constructor.name, stage: Infinity },
          // Check for existence of the HMR runtime -
          // it is the foundation to this plugin working correctly
          (context) => {
            if (!context.hot && !loggedHotWarning) {
              logger.warn(
                [
                  'Hot Module Replacement (HMR) is not enabled!',
                  'React Refresh requires HMR to function properly.',
                ].join(' ')
              );
              loggedHotWarning = true;
            }
          }
        );
      }
    );
  }
}

module.exports.ReactRefreshPlugin = ReactRefreshPlugin;
module.exports = ReactRefreshPlugin;
