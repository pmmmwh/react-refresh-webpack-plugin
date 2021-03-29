const { Template } = require('webpack');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Gets a runtime template from the provided function or string.
 * @param {function(): void | string} fnOrStr A function containing the runtime template.
 * @param {*} [data]
 * @returns {string} The "sanitized" runtime template.
 */
function renderTemplate(fnOrStr, data = {}) {
  // Get and sanitize template
  let content = typeof fnOrStr === 'function' ? Template.getFunctionContent(fnOrStr) : fnOrStr;
  content = content.trim().replace(/^ {2}/gm, '');

  // Render data
  content = Object.entries(data).reduce(
    (accRuntime, [key, value]) => accRuntime.replace(new RegExp(escapeRegExp(key), 'g'), value),
    content
  );

  return content;
}

module.exports = renderTemplate;
