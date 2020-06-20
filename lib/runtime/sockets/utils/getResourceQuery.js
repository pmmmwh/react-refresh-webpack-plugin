/* global __resourceQuery */

/**
 * Parse webpack `__resourceQuery` string into an object.
 * @see https://webpack.js.org/api/module-variables/#__resourcequery-webpack-specific
 * @param {string} [__resourceQuery]
 * @returns {*}
 */
function getResourceQuery() {
  const params = {};

  var query = '';
  if (typeof __resourceQuery === 'string') {
    query = __resourceQuery;
  }

  /**
   * Map __resourceQuery string such as `?foo1=bar1&foo2=bar2`:
   * - remove `?` from the start
   * - split from `&`
   * - split from `=`
   * The mapped format will be [['foo1', 'bar1'], ['foo2', 'bar2']]
   */
  const entries = query
    .replace(/^\?/, '')
    .split('&')
    .map(function (entry) {
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

module.exports = getResourceQuery;
