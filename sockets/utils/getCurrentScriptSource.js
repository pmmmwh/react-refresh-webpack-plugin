/**
 * Gets the source (i.e. host) of the script currently running.
 * @returns {string}
 */
function getCurrentScriptSource() {
  return __webpack_public_path__
}

module.exports = getCurrentScriptSource;
