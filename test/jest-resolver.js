/**
 * @param {string} request
 * @param {*} options
 * @return {string}
 */
function resolver(request, options) {
  // This acts as a mock for `require.resolve('react-refresh')`,
  // since the current mocking behaviour of Jest is not symmetrical,
  // i.e. only `require` is mocked but not `require.resolve`.
  if (request === 'react-refresh') {
    return 'react-refresh';
  }

  return options.defaultResolver(request, options);
}

module.exports = resolver;
