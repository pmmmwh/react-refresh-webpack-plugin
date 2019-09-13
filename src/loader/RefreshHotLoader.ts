// HMR Error Recovery
// Ref: https://github.com/webpack/webpack/issues/418#issuecomment-490296365
// TODO: Is it possible to move this into a file?
const RefreshInjection = `
const RefreshUtils = require('${require.resolve('./utils')}');

if (
  module.hot &&
  RefreshUtils.isReactRefreshBoundary(
    module.exports
    || module.__proto__.exports
  )
) {
  function hotErrorHandler(error) {
    console.warn('[HMR] Error Occurred!');
    console.error(error);
    require.cache[module.id].hot.accept(hotErrorHandler);
  }

  module.hot.accept(hotErrorHandler);
  RefreshUtils.enqueueUpdate()
}
`;

function RefreshHotLoader(source: string) {
  return source + RefreshInjection;
}

export default RefreshHotLoader;
