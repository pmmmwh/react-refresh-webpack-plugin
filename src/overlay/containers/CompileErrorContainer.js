const ansiHTML = require('ansi-html');
const { Html5Entities } = require('html-entities');
const PageHeader = require('../components/PageHeader');
const theme = require('../theme');
const formatFilename = require('../utils/formatFilename');
const removeAllChildren = require('../utils/removeAllChildren');

ansiHTML.setColors(theme);

const entities = new Html5Entities();

/**
 * @typedef {Object} CompileErrorContainerProps
 * @property {string} errorMessage
 */

/**
 * A container to render Webpack compilation errors with source trace.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {CompileErrorContainerProps} props
 * @returns {void}
 */
function CompileErrorContainer(document, root, props) {
  removeAllChildren(root);

  const errorParts = props.errorMessage.split('\n');
  const errorMessage = errorParts
    .splice(1, 1)[0]
    // Strip filename from the error message
    .replace(/^(.*:)\s.*:(\s.*)$/, '$1$2');
  errorParts[0] = formatFilename(errorParts[0]);
  errorParts.unshift(errorMessage);

  PageHeader(document, root, {
    title: 'Failed to compile.',
    theme: theme,
  });
  root.insertAdjacentHTML(
    'beforeend',
    ansiHTML(entities.encode(errorParts.join('\n')))
  );
}

module.exports = CompileErrorContainer;
