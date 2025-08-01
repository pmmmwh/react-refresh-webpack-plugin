/**
 * Makes a runtime module to intercept module execution for React Refresh.
 * This module creates an isolated `__webpack_require__` function for each module,
 * and injects a `$Refresh$` object into it for use by React Refresh.
 * @param {import('webpack')} webpack The Webpack exports.
 * @returns {typeof import('webpack').RuntimeModule} The runtime module class.
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
      if (!this.compilation) throw new Error('Webpack compilation missing!');

      const { runtimeTemplate } = this.compilation;
      const constDeclaration = runtimeTemplate.supportsConst() ? 'const' : 'var';
      return webpack.Template.asString([
        `${constDeclaration} setup = ${runtimeTemplate.basicFunction('moduleId', [
          `${constDeclaration} refresh = {`,
          webpack.Template.indent([
            `moduleId: moduleId,`,
            `register: ${runtimeTemplate.basicFunction('type, id', [
              `${constDeclaration} typeId = moduleId + ' ' + id;`,
              'refresh.runtime.register(type, typeId);',
            ])},`,
            `signature: ${runtimeTemplate.returningFunction(
              'refresh.runtime.createSignatureFunctionForTransform()'
            )},`,
            `runtime: {`,
            webpack.Template.indent([
              `createSignatureFunctionForTransform: ${runtimeTemplate.returningFunction(
                runtimeTemplate.returningFunction('type', 'type')
              )},`,
              `register: ${runtimeTemplate.emptyFunction()}`,
            ]),
            `},`,
          ]),
          `};`,
          `return refresh;`,
        ])};`,
        '',
        `${webpack.RuntimeGlobals.interceptModuleExecution}.push(${runtimeTemplate.basicFunction(
          'options',
          [
            `${constDeclaration} originalFactory = options.factory;`,
            // Using a function declaration -
            // ensures `this` would propagate for modules relying on it
            `options.factory = function(moduleObject, moduleExports, webpackRequire) {`,
            webpack.Template.indent([
              // Our require function delegates to the original require function
              `${constDeclaration} hotRequire = ${runtimeTemplate.returningFunction(
                'webpackRequire(request)',
                'request'
              )};`,
              // The propery descriptor factory below ensures all properties but `$Refresh$`
              // are proxied through to the original require function
              `${constDeclaration} createPropertyDescriptor = ${runtimeTemplate.basicFunction(
                'name',
                [
                  `return {`,
                  webpack.Template.indent([
                    `configurable: true,`,
                    `enumerable: true,`,
                    `get: ${runtimeTemplate.returningFunction('webpackRequire[name]')},`,
                    `set: ${runtimeTemplate.basicFunction('value', [
                      'webpackRequire[name] = value;',
                    ])},`,
                  ]),
                  `};`,
                ]
              )};`,
              `for (${constDeclaration} name in webpackRequire) {`,
              webpack.Template.indent([
                'if (name === "$Refresh$") continue;',
                'if (Object.prototype.hasOwnProperty.call(webpackRequire, name)) {',
                webpack.Template.indent([
                  `Object.defineProperty(hotRequire, name, createPropertyDescriptor(name));`,
                ]),
                `}`,
              ]),
              `}`,
              `hotRequire.$Refresh$ = setup(options.id);`,
              `originalFactory.call(this, moduleObject, moduleExports, hotRequire);`,
            ]),
            '};',
          ]
        )});`,
      ]);
    }
  };
}

module.exports = makeRefreshRuntimeModule;
