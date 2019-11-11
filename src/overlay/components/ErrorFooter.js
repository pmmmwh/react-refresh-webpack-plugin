/**
 * @typedef {Object} ErrorFooterProps
 * @property {number} activeErrorIndex
 * @property {(string | Error)[]} errors
 * @property {function(MouseEvent): *} onNext
 * @property {function(MouseEvent): *} onPrev
 * @property {import('../theme').Theme} theme
 */

/**
 * A fixed footer that handles pagination of errors and shows the total error count.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {ErrorFooterProps} props
 * @returns {void}
 */
function ErrorFooter(document, root, props) {
  const footer = document.createElement('div');
  footer.style.backgroundColor = '#' + props.theme.darkgrey;
  footer.style.bottom = '0';
  footer.style.left = '0';
  footer.style.fontSize = '0.6875rem';
  footer.style.padding = '0.5rem 2rem';
  footer.style.position = 'fixed';
  footer.style.width = '100vw';
  footer.style.zIndex = '2';

  if (props.errors.length > 1) {
    const buttonContainer = document.createElement('span');
    buttonContainer.style.marginRight = '1rem';

    const arrows = ['←', '→'];
    for (let i = 0; i < arrows.length; i += 1) {
      const button = document.createElement('button');
      button.innerText = arrows[i];
      button.tabIndex = 0;
      button.style.border = 'none';
      button.style.color = '#' + props.theme.red;
      button.style.cursor = 'pointer';
      button.style.padding = '0.25rem 0.5rem';

      if (i === 0) {
        button.style.borderRadius = '4px 0 0 4px';
        button.style.borderRight = '1px solid currentColor';
        button.addEventListener('click', props.onPrev);
      } else {
        button.style.borderRadius = '0 4px 4px 0';
        button.addEventListener('click', props.onNext);
      }

      buttonContainer.appendChild(button);
    }

    footer.appendChild(buttonContainer);
  }

  footer.insertAdjacentText(
    'beforeend',
    'Error ' + (props.activeErrorIndex + 1) + ' of ' + props.errors.length
  );
  root.appendChild(footer);
}

module.exports = ErrorFooter;
