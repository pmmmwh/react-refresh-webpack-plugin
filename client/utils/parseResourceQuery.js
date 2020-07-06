/**
 * Parse Webpack's `__resourceQuery` string into an object.
 * @see https://webpack.js.org/api/module-variables/#__resourcequery-webpack-specific
 * @param {*} [query] The Webpack `__resourceQuery` string.
 * @returns {*} The parsed query params.
 */
function parseResourceQuery(query = '') {
  /**
   * Reduce __resourceQuery string such as `?foo1=bar1&foo2=bar2`:
   * - remove `?` from the start
   * - split with `&`
   * - split with `=`
   * The resulting format will be { foo1: 'bar1', foo2: 'bar2' }
   */
  return query
    .replace(/^\?/, '')
    .split('&')
    .reduce(function (acc, entry) {
      const pair = entry.split('=');
      // Add all non-empty entries to the accumulated object
      if (pair[0]) {
        acc[pair[0]] = pair[1];
      }

      return acc;
    }, {});
}

module.exports = parseResourceQuery;
