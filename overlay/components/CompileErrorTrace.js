const Anser = require('anser');
const entities = require('html-entities');
const utils = require('../utils.js');

/**
 * @typedef {Object} CompileErrorTraceProps
 * @property {string} errorMessage
 */

/**
 * A formatter that turns Webpack compile error messages into highlighted HTML source traces.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {CompileErrorTraceProps} props
 * @returns {void}
 */
function CompileErrorTrace(document, root, props) {
  const errorParts = props.errorMessage.split('\n');
  if (errorParts.length) {
    if (errorParts[0]) {
      errorParts[0] = utils.formatFilename(errorParts[0]);
    }

    const errorMessage = errorParts.splice(1, 1)[0];
    if (errorMessage) {
      // Strip filename from the error message
      errorParts.unshift(errorMessage.replace(/^(.*:)\s.*:(\s.*)$/, '$1$2'));
    }
  }

  const stackContainer = document.createElement('pre');
  stackContainer.style.fontFamily = [
    '"SFMono-Regular"',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'Courier',
    'monospace',
  ].join(', ');
  stackContainer.style.margin = '0';
  stackContainer.style.whiteSpace = 'pre-wrap';

  const entries = Anser.ansiToJson(
    entities.encode(errorParts.join('\n'), { level: 'html5', mode: 'nonAscii' }),
    {
      json: true,
      remove_empty: true,
      use_classes: true,
    }
  );
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const elem = document.createElement('span');
    elem.innerHTML = entry.content;
    elem.style.color = entry.fg ? `var(--color-${entry.fg})` : undefined;
    elem.style.wordBreak = 'break-word';
    switch (entry.decoration) {
      case 'bold':
        elem.style.fontWeight = 800;
        break;
      case 'italic':
        elem.style.fontStyle = 'italic';
        break;
    }

    stackContainer.appendChild(elem);
  }

  root.appendChild(stackContainer);
}

module.exports = CompileErrorTrace;
