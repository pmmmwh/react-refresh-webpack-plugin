const ErrorStackParser = require('error-stack-parser');
const formatFilename = require('../utils/formatFilename');

/**
 * @typedef {Object} RuntimeErrorStackProps
 * @property {Error} error
 * @property {import("../theme").Theme} theme
 */

/**
 * A formatter that turns runtime error stacks into highlighted HTML.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {RuntimeErrorStackProps} props
 * @returns {void}
 */
function RuntimeErrorStack(document, root, props) {
  const stackContainer = document.createElement('div');
  stackContainer.style.fontSize = '0.75rem';
  stackContainer.style.marginBottom = '2rem';
  stackContainer.style.marginTop = '0.25rem';

  const errorStacks = ErrorStackParser.parse(props.error);

  for (let i = 0; i < Math.min(errorStacks.length, 10); i += 1) {
    const currentStack = errorStacks[i];
    stackContainer.insertAdjacentHTML('beforeend', '&emsp;&emsp;at ');

    const functionName = document.createElement('span');
    functionName.style.color = '#' + props.theme.cyan;
    functionName.innerText =
      currentStack.functionName || '(anonymous function)';
    stackContainer.appendChild(functionName);

    stackContainer.insertAdjacentText(
      'beforeend',
      ' (' +
        formatFilename(currentStack.fileName) +
        ':' +
        currentStack.lineNumber +
        ':' +
        currentStack.columnNumber +
        ')'
    );

    if (i < errorStacks.length - 1) {
      stackContainer.insertAdjacentText('beforeend', '\n');
    }
  }

  root.insertAdjacentText('beforeend', formatFilename(errorStacks[0].fileName));
  root.appendChild(stackContainer);
}

module.exports = RuntimeErrorStack;
