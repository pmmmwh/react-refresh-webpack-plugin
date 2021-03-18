/**
 * Gets the source (i.e. host) of the script currently running.
 * @returns {string}
 */
function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to get the current running script,
  // but is not supported in all browsers (most notably, IE).
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  }

  // Fallback to getting all scripts running in the document.
  const scriptElements = document.scripts || [];
  const nonNullScriptElements = [...scriptElements].filter((elm) => elm.getAttribute('src'));
  const currentScript = nonNullScriptElements[nonNullScriptElements.length - 1];
  if (currentScript) {
    return currentScript.getAttribute('src');
  }
}

module.exports = getCurrentScriptSource;
