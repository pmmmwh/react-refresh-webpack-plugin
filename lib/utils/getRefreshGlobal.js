const Template = require('webpack/lib/Template');
const { refreshGlobal } = require('../globals');

/**
 * @typedef {Object} RuntimeTemplate
 * @property {function(string, string[]): string} basicFunction
 * @property {function(): boolean} supportsConst
 * @property {function(string, string=): string} returningFunction
 */

/** @type {RuntimeTemplate} */
const FALLBACK_RUNTIME_TEMPLATE = {
  basicFunction(args, body) {
    return `function(${args}) {\n${Template.indent(body)}\n}`;
  },
  supportsConst() {
    return false;
  },
  returningFunction(returnValue, args = '') {
    return `function(${args}) { return ${returnValue}; }`;
  },
};

/**
 * Generates the refresh global runtime template.
 * @param {RuntimeTemplate} [runtimeTemplate] The runtime template helpers.
 * @returns {string} The refresh global runtime template.
 */
function getRefreshGlobal(runtimeTemplate = FALLBACK_RUNTIME_TEMPLATE) {
  const declaration = runtimeTemplate.supportsConst() ? 'const' : 'var';
  return Template.asString([
    `${refreshGlobal} = {`,
    Template.indent([
      `init: ${runtimeTemplate.basicFunction('', [
        `this.cleanup = ${runtimeTemplate.returningFunction('undefined')};`,
        `this.register = ${runtimeTemplate.returningFunction('undefined')};`,
        'this.runtime = {};',
        `this.signature = ${runtimeTemplate.returningFunction(
          runtimeTemplate.returningFunction('type', 'type')
        )};`,
      ])}`,
      `setup: ${runtimeTemplate.basicFunction('currentModuleId', [
        `${declaration} prevCleanup = this.cleanup;`,
        `${declaration} prevReg = this.register;`,
        `${declaration} prevSig = this.signature;`,
        '',
        `this.register = ${runtimeTemplate.basicFunction('type, id', [
          `${declaration} typeId = currentModuleId + " " + id;`,
          'this.runtime.register(type, typeId);',
        ])}`,
        '',
        'this.signature = this.runtime.createSignatureFunctionForTransform;',
        '',
        `this.cleanup = ${runtimeTemplate.basicFunction('cleanupModuleId', [
          'if (currentModuleId === cleanupModuleId) {',
          Template.indent([
            'this.register = prevReg;',
            'this.signature = prevSig;',
            'this.cleanup = prevCleanup;',
          ]),
          '}',
        ])}`,
      ])},`,
    ]),
    '};',
  ]);
}

module.exports = getRefreshGlobal;
