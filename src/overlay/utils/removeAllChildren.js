/**
 * Remove all children of an element.
 * @param {HTMLElement} element A valid HTML element.
 * @returns {void}
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

module.exports = removeAllChildren;
