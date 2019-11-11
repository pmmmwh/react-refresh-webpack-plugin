/**
 * @typedef {Object} PageHeaderProps
 * @property {import('../theme').Theme} theme
 * @property {string} title
 */

/**
 * The header of the overlay.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {PageHeaderProps} props
 * @returns {void}
 */
function PageHeader(document, root, props) {
  const header = document.createElement('h3');
  header.innerText = props.title;
  header.style.color = `#${props.theme.red}`;
  header.style.fontSize = '1.125rem';
  header.style.lineHeight = '1.25rem';
  header.style.margin = '0';

  root.appendChild(header);
  root.appendChild(document.createElement('br'));
}

module.exports = PageHeader;
