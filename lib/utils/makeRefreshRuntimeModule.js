const { getRefreshGlobalScope } = require('../globals');
const getRefreshGlobal = require('./getRefreshGlobal');

/**
 * Makes a runtime module to intercept module execution for React Refresh.
 * @param {import('webpack')} webpack The Webpack exports.
 * @returns {ReactRefreshRuntimeModule} The runtime module class.
 */
function makeRefreshRuntimeModule(webpack) {
  return class ReactRefreshRuntimeModule extends webpack.RuntimeModule {
    constructor() {
      // Second argument is the `stage` for this runtime module -
      // we'll use the same stage as Webpack's HMR runtime module for safety.
      super('react refresh', webpack.RuntimeModule.STAGE_BASIC);
    }

    /**
     * @returns {string} runtime code
     */
    generate() {
      const { runtimeTemplate } = this.compilation;
      const refreshGlobal = getRefreshGlobalScope(webpack.RuntimeGlobals);
      return webpack.Template.asString([
        `${webpack.RuntimeGlobals.interceptModuleExecution}.push(${runtimeTemplate.basicFunction(
          'options',
          [
            `${
              runtimeTemplate.supportsConst() ? 'const' : 'var'
            } originalFactory = options.factory;`,
            `options.factory = ${runtimeTemplate.basicFunction(
              'moduleObject, moduleExports, webpackRequire',
              [
                `${refreshGlobal}.setup(options.id);`,
                'try {',
                webpack.Template.indent(
                  'originalFactory.call(this, moduleObject, moduleExports, webpackRequire);'
                ),
                '} finally {',
                webpack.Template.indent(`${refreshGlobal}.cleanup(options.id);`),
                '}',
              ]
            )}`,
          ]
        )})`,
        '',
        getRefreshGlobal(webpack.Template, webpack.RuntimeGlobals, runtimeTemplate),
      ]);
    }
  };
}

module.exports = makeRefreshRuntimeModule;
