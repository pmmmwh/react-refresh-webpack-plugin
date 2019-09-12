const RefreshInjection = `
const RefreshUtils = require('${require.resolve('./utils')}');

if (
  module.hot &&
  RefreshUtils.isReactRefreshBoundary(
    module.exports
    || module.__proto__.exports
  )
) {
  module.hot.accept();
  RefreshUtils.enqueueUpdate()
}
`;

function RefreshHotLoader(source: string) {
  return source + RefreshInjection;
}

export default RefreshHotLoader;
