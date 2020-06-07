/**
 * Parse URLSearchParams from a string like `?key=value&foo=ba`
 * @param {string} queryString
 * @returns {*}
 */
function parseURLSearchParams(queryString) {
  const params = {};

  // Decode any possible encoded characters and remove `?` from start
  const query = decodeURIComponent(queryString).replace(/^\?/, '');

  // Split string like `key=value&foo=bar`, first from &, and then =
  // The structure will be `[['key', 'value'], ['foo', 'bar']]`
  const entries = query.split('&').map(function (entry) {
    return entry.split('=');
  });

  // Add all entries to the overrides object
  entries.forEach(function (entry) {
    const key = entry[0];
    const value = entry[1];
    params[key] = value;
  });

  return params;
}

module.exports = parseURLSearchParams;
