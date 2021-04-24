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
      // Initialise the global with stubs.
      // This is to ensure unwanted calls to these functions would not error out.
      // If the module is processed by our loader,
      // they will be mutated in place during module initialisation by the `setup` function below.
      `register: ${runtimeTemplate.returningFunction('undefined')},`,
      `signature: ${runtimeTemplate.returningFunction(
        runtimeTemplate.returningFunction('type', 'type')
      )},`,
      `setup: ${runtimeTemplate.basicFunction('currentModuleId', [
        // Store all previous values for fields on `refreshGlobal` -
        // this allows proper restoration in the `cleanup` phase.
        `${declaration} prevModuleId = ${refreshGlobal}.moduleId;`,
        `${declaration} prevRuntime = ${refreshGlobal}.runtime;`,
        `${declaration} prevRegister = ${refreshGlobal}.register;`,
        `${declaration} prevSignature = ${refreshGlobal}.signature;`,
        `${declaration} prevCleanup = ${refreshGlobal}.cleanup;`,
        '',
        `${refreshGlobal}.moduleId = currentModuleId;`,
        '',
        // Initialise the runtime with stubs.
        // If the module is processed by our loader,
        // they will be mutated in place during module initialisation.
        `${refreshGlobal}.runtime = {`,
        Template.indent([
          `createSignatureFunctionForTransform: ${runtimeTemplate.returningFunction(
            runtimeTemplate.returningFunction('type', 'type')
          )},`,
          `register: ${runtimeTemplate.returningFunction('undefined')}`,
        ]),
        '};',
        '',
        `${refreshGlobal}.register = ${runtimeTemplate.basicFunction('type, id', [
          `${declaration} typeId = currentModuleId + " " + id;`,
          `${refreshGlobal}.runtime.register(type, typeId);`,
        ])}`,
        '',
        `${refreshGlobal}.signature = ${refreshGlobal}.runtime.createSignatureFunctionForTransform;`,
        '',
        `${refreshGlobal}.cleanup = ${runtimeTemplate.basicFunction('cleanupModuleId', [
          // Only cleanup if the module IDs match.
          // In rare cases, it might get called in another module's `cleanup` phase.
          'if (currentModuleId === cleanupModuleId) {',
          Template.indent([
            `${refreshGlobal}.moduleId = prevModuleId;`,
            `${refreshGlobal}.runtime = prevRuntime;`,
            `${refreshGlobal}.register = prevRegister;`,
            `${refreshGlobal}.signature = prevSignature;`,
            `${refreshGlobal}.cleanup = prevCleanup;`,
          ]),
          '}',
        ])}`,
      ])}`,
    ]),
    '};',
  ]);
}

module.exports = getRefreshGlobal;
