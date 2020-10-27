/**
 * Gets the source (i.e. host) of the script currently running.
 * @returns {string}
 */
function getCurrentScriptSource() {
  // eslint-disable-next-line no-undef
  return __webpack_public_path__;
}

module.exports = getCurrentScriptSource;
