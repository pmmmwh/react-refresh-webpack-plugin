/**
 * @typedef ModuleRuntimeOptions {Object}
 * @property {boolean} const Use ES6 `const` and `let` in generated runtime code.
 * @property {'cjs' | 'esm'} moduleSystem The module system to be used.
 */

/**
 * Generates code appended to each JS-like module for react-refresh capabilities.
 *
 * `__react_refresh_utils__` will be replaced with actual utils during source parsing by `webpack.ProvidePlugin`.
 *
 * [Reference for Runtime Injection](https://github.com/webpack/webpack/blob/b07d3b67d2252f08e4bb65d354a11c9b69f8b434/lib/HotModuleReplacementPlugin.js#L419)
 * [Reference for HMR Error Recovery](https://github.com/webpack/webpack/issues/418#issuecomment-490296365)
 *
 * @param {import('webpack').Template} Webpack's templating helpers.
 * @param {ModuleRuntimeOptions} options The refresh module runtime options.
 * @returns {string} The refresh module runtime template.
 */
function getRefreshModuleRuntime(Template, options) {
  const constDeclaration = options.const ? 'const' : 'var';
  const letDeclaration = options.const ? 'let' : 'var';
  const webpackHot = options.moduleSystem === 'esm' ? 'import.meta.webpackHot' : 'module.hot';
  return Template.asString([
    `${constDeclaration} $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;`,
    `${constDeclaration} $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(`,
    Template.indent('$ReactRefreshModuleId$'),
    ');',
    '__react_refresh_utils__.registerExportsForReactRefresh(',
    // prettier-ignore
    Template.indent([
      '$ReactRefreshCurrentExports$,',
      '$ReactRefreshModuleId$',
    ]),
    ');',
    '',
    `if (${webpackHot}) {`,
    Template.indent([
      `${constDeclaration} $ReactRefreshHotUpdate$ = !!${webpackHot}.data;`,
      `${letDeclaration} $ReactRefreshPrevExports$;`,
      'if ($ReactRefreshHotUpdate$) {',
      Template.indent(`$ReactRefreshPrevExports$ = ${webpackHot}.data.prevExports;`),
      '}',
      '',
      'if (__react_refresh_utils__.isReactRefreshBoundary($ReactRefreshCurrentExports$)) {',
      Template.indent([
        `${webpackHot}.dispose(`,
        Template.indent([
          '/**',
          ' * A callback to performs a full refresh if React has unrecoverable errors,',
          ' * and also caches the to-be-disposed module.',
          ' * @param {*} data A hot module data object from Webpack HMR.',
          ' * @returns {void}',
          ' */',
          'function hotDisposeCallback(data) {',
          Template.indent([
            '// We have to mutate the data object to get data registered and cached',
            'data.prevExports = $ReactRefreshCurrentExports$;',
          ]),
          '}',
        ]),
        ');',
        `${webpackHot}.accept(`,
        Template.indent([
          '/**',
          ' * An error handler to allow self-recovering behaviours.',
          ' * @param {Error} error An error occurred during evaluation of a module.',
          ' * @returns {void}',
          ' */',
          'function hotErrorHandler(error) {',
          Template.indent([
            'if (',
            Template.indent([
              "typeof __react_refresh_error_overlay__ !== 'undefined' &&",
              '__react_refresh_error_overlay__',
            ]),
            ') {',
            Template.indent('__react_refresh_error_overlay__.handleRuntimeError(error);'),
            '}',
            '',
            "if (typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__) {",
            Template.indent([
              'if (window.onHotAcceptError) {',
              Template.indent('  window.onHotAcceptError(error.message);'),
              '}',
            ]),
            '}',
            '',
            '__webpack_require__.c[$ReactRefreshModuleId$].hot.accept(hotErrorHandler);',
          ]),
          '}',
        ]),
        ');',
        '',
        'if ($ReactRefreshHotUpdate$) {',
        Template.indent([
          'if (',
          Template.indent([
            '__react_refresh_utils__.isReactRefreshBoundary($ReactRefreshPrevExports$) &&',
            '__react_refresh_utils__.shouldInvalidateReactRefreshBoundary(',
            // prettier-ignore
            Template.indent([
              '$ReactRefreshPrevExports$,',
              '$ReactRefreshCurrentExports$',
            ]),
            ')',
          ]),
          ') {',
          Template.indent(`${webpackHot}.invalidate();`),
          '} else {',
          Template.indent([
            '__react_refresh_utils__.enqueueUpdate(',
            Template.indent([
              '/**',
              ' * A function to dismiss the error overlay after performing React refresh.',
              ' * @returns {void}',
              ' */',
              'function updateCallback() {',
              Template.indent([
                'if (',
                Template.indent([
                  "typeof __react_refresh_error_overlay__ !== 'undefined' &&",
                  '__react_refresh_error_overlay__',
                ]),
                ') {',
                Template.indent('__react_refresh_error_overlay__.clearRuntimeErrors();'),
                '}',
              ]),
              '}',
            ]),
            ');',
          ]),
          '}',
        ]),
        '}',
      ]),
      '} else {',
      Template.indent([
        "if ($ReactRefreshHotUpdate$ && typeof $ReactRefreshPrevExports$ !== 'undefined') {",
        Template.indent(`${webpackHot}.invalidate();`),
        '}',
      ]),
      '}',
    ]),
    '}',
  ]);
}

module.exports = getRefreshModuleRuntime;
