const path = require('path');
const validateOptions = require('schema-utils');
const { DefinePlugin, ModuleFilenameHelpers, ProvidePlugin, Template } = require('webpack');
const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const NullFactory = require('webpack/lib/NullFactory');
const ParserHelpers = require('webpack/lib/ParserHelpers');
const { getSocketIntegration, injectRefreshEntry, normalizeOptions } = require('./helpers');
const schema = require('./options.json');

const refreshObj = '__webpack_require__.$Refresh$';

// Mapping of react-refresh globals to Webpack require extensions
const PARSER_REPLACEMENTS = {
  $RefreshRuntime$: `${refreshObj}.runtime`,
  $RefreshSetup$: `${refreshObj}.setup`,
  $RefreshCleanup$: `${refreshObj}.cleanup`,
  $RefreshReg$: `${refreshObj}.register`,
  $RefreshSig$: `${refreshObj}.signature`,
};

const PARSER_REPLACEMENT_TYPES = {
  $RefreshRuntime$: 'object',
  $RefreshSetup$: 'function',
  $RefreshCleanup$: 'function',
  $RefreshReg$: 'function',
  $RefreshSig$: 'function',
};

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
    // Skip processing on non-development mode, but allow manual force-enabling
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

    // Inject react-refresh context to all Webpack entry points
    compiler.options.entry = injectRefreshEntry(compiler.options.entry, this.options);

    // Inject necessary modules to bundle's global scope
    let providedModules = {
      __react_refresh_utils__: require.resolve('./runtime/refreshUtils'),
    };

    if (this.options.overlay === false) {
      // Stub errorOverlay module so calls to it can be erased
      const definePlugin = new DefinePlugin({
        __react_refresh_error_overlay__: false,
        __react_refresh_init_socket__: false,
      });
      definePlugin.apply(compiler);
    } else {
      providedModules = {
        ...providedModules,
        __react_refresh_error_overlay__: require.resolve(this.options.overlay.module),
        __react_refresh_init_socket__: getSocketIntegration(this.options.overlay.sockIntegration),
      };
    }

    const providePlugin = new ProvidePlugin(providedModules);
    providePlugin.apply(compiler);

    compiler.hooks.beforeRun.tap(this.constructor.name, (compiler) => {
      // Check for existence of HotModuleReplacementPlugin in the plugin list
      // It is the foundation to this plugin working correctly
      if (
        !compiler.options.plugins ||
        !compiler.options.plugins.find(
          // It's validated with the name rather than the constructor reference
          // because a project might contain multiple references to Webpack
          (plugin) => plugin.constructor.name === 'HotModuleReplacementPlugin'
        )
      ) {
        throw new Error(
          'Hot Module Replacement (HMR) is not enabled! React-refresh requires HMR to function properly.'
        );
      }
    });

    const matchObject = ModuleFilenameHelpers.matchObject.bind(undefined, this.options);
    compiler.hooks.compilation.tap(
      this.constructor.name,
      (compilation, { normalModuleFactory }) => {
        compilation.dependencyFactories.set(ConstDependency, new NullFactory());
        compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());

        compilation.mainTemplate.hooks.require.tap(
          this.constructor.name,
          // Constructs the module template for react-refresh
          (source, chunk, hash) => {
            const mainTemplate = compilation.mainTemplate;

            // Check for the output filename
            // This is to ensure we are processing a JS-related chunk
            let filename = mainTemplate.outputOptions.filename;
            if (typeof filename === 'function') {
              // Only usage of the `chunk` property is documented by Webpack.
              // However, some internal Webpack plugins uses other properties,
              // so we also pass them through to be on the safe side.
              filename = filename({
                chunk,
                hash,
                //  TODO: Figure out whether we need to stub the following properties, probably no
                contentHashType: 'javascript',
                hashWithLength: (length) => mainTemplate.renderCurrentHashCode(hash, length),
                noChunkHash: mainTemplate.useChunkHash(chunk),
              });
            }

            // Check whether the current compilation is outputting to JS,
            // since other plugins can trigger compilations for other file types too.
            // If we apply the transform to them, their compilation will break fatally.
            // One prominent example of this is the HTMLWebpackPlugin.
            // If filename is falsy, something is terribly wrong and there's nothing we can do.
            if (!filename || !filename.includes('.js')) {
              return source;
            }

            // Split template source code into lines for easier processing
            const lines = source.split('\n');
            // Webpack generates this line when the MainTemplate is called
            const moduleInitializationLineNumber = lines.findIndex((line) =>
              line.startsWith('modules[moduleId].call')
            );

            return Template.asString([
              ...lines.slice(0, moduleInitializationLineNumber),
              '',
              `${refreshObj}.setup = function(currentModuleId) {`,
              Template.indent([
                `const prevSetup = ${refreshObj}.setup;`,
                `const prevCleanup = ${refreshObj}.cleanup;`,
                `const prevReg = ${refreshObj}.register;`,
                `const prevSig = ${refreshObj}.signature;`,
                '',
                `${refreshObj}.register = function register(type, id) {`,
                Template.indent([
                  'const typeId = currentModuleId + " " + id;',
                  `${refreshObj}.runtime.register(type, typeId);`,
                ]),
                '};',
                '',
                `${refreshObj}.signature = ${refreshObj}.runtime.createSignatureFunctionForTransform;`,
                '',
                `${refreshObj}.cleanup = function cleanup() {`,
                Template.indent([
                  `${refreshObj}.register = prevReg;`,
                  `${refreshObj}.signature = prevSig;`,
                  `${refreshObj}.cleanup = prevCleanup;`,
                ]),
                '};',
                '',
                `${refreshObj}.setup = prevSetup;`,
              ]),
              '};',
              '',
              'try {',
              Template.indent(lines[moduleInitializationLineNumber]),
              '} finally {',
              Template.indent(`${refreshObj}.cleanup();`),
              '}',
              '',
              ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
            ]);
          }
        );

        compilation.mainTemplate.hooks.requireExtensions.tap(
          this.constructor.name,
          // Setup react-refresh globals as extensions to Webpack's require function
          (source) => {
            return Template.asString([
              source,
              '',
              `${refreshObj} = {};`,
              `${refreshObj}.runtime = {};`,
              `${refreshObj}.setup = function() {};`,
              `${refreshObj}.cleanup = function() {};`,
              `${refreshObj}.register = function() {};`,
              `${refreshObj}.signature = function() {`,
              Template.indent('return function(type) { return type; };'),
              '};',
            ]);
          }
        );

        normalModuleFactory.hooks.afterResolve.tap(this.constructor.name, (data) => {
          // Inject refresh loader to all JavaScript-like files
          if (
            // Include and exclude user-specified files
            matchObject(data.resource) &&
            // Skip plugin's runtime utils to prevent self-referencing -
            // this is useful when using the plugin as a direct dependency.
            !data.resource.includes(path.join(__dirname, './runtime/refreshUtils'))
          ) {
            const resolvedLoader = require.resolve('./loader');
            if (!data.loaders.find(({ loader }) => loader === resolvedLoader)) {
              data.loaders.unshift({
                loader: resolvedLoader,
                options: undefined,
              });
            }
          }

          return data;
        });

        // Transform global calls into require extensions calls
        const parserHandler = (parser) => {
          Object.entries(PARSER_REPLACEMENTS).forEach(([key, replacement]) => {
            parser.hooks.expression
              .for(key)
              .tap(
                this.constructor.name,
                ParserHelpers.toConstantDependencyWithWebpackRequire(parser, replacement)
              );
            if (PARSER_REPLACEMENT_TYPES[key]) {
              parser.hooks.evaluateTypeof
                .for(key)
                .tap(
                  this.constructor.name,
                  ParserHelpers.evaluateToString(PARSER_REPLACEMENT_TYPES[key])
                );
            }
          });
        };

        normalModuleFactory.hooks.parser
          .for('javascript/auto')
          .tap(this.constructor.name, parserHandler);
        normalModuleFactory.hooks.parser
          .for('javascript/dynamic')
          .tap(this.constructor.name, parserHandler);
        normalModuleFactory.hooks.parser
          .for('javascript/esm')
          .tap(this.constructor.name, parserHandler);
      }
    );
  }
}

module.exports.ReactRefreshPlugin = ReactRefreshPlugin;
module.exports = ReactRefreshPlugin;
