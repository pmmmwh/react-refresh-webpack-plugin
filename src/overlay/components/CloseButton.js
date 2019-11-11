/**
 * @typedef {Object} CloseButtonProps
 * @property {function(MouseEvent): *} onClick
 */

/**
 * A button that is intended to close the overlay.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {CloseButtonProps} props
 * @returns {void}
 */
function CloseButton(document, root, props) {
  const button = document.createElement('button');
  button.innerText = '×';

  button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  button.style.border = 'none';
  button.style.borderRadius = '100%';
  button.style.color = 'inherit';
  button.style.font = 'inherit';
  button.style.fontSize = '1.5rem';
  button.style.height = '2rem';
  button.style.margin = '-0.5rem';
  button.style.position = 'fixed';
  button.style.right = '2rem';
  button.style.top = '2rem';
  button.style.width = '2rem';
  button.addEventListener('click', props.onClick);

  root.appendChild(button);
}

module.exports = CloseButton;
