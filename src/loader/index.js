const { SourceMapConsumer, SourceNode } = require('source-map');
const { Template } = require('webpack');

const RefreshSetupRuntime = Template.getFunctionContent(require('./RefreshSetup.runtime'))
  .trim()
  .replace(/^ {2}/gm, '');

const RefreshModuleRuntime = Template.getFunctionContent(require('./RefreshModule.runtime'))
  .trim()
  .replace(/^ {2}/gm, '')
  .replace(/\$RefreshUtils\$/g, '__react_refresh_utils__');

/**
 * A simple Webpack loader to inject react-refresh HMR code into modules.
 *
 * [Reference for Loader API](https://webpack.js.org/api/loaders/)
 * @this {import('webpack').loader.LoaderContext}
 * @param {string} source The original module source code.
 * @param {import('source-map').RawSourceMap} [inputSourceMap] The source map of the module.
 * @param {*} [meta] The loader metadata passed in.
 * @returns {void}
 */
function ReactRefreshLoader(source, inputSourceMap, meta) {
  const callback = this.async();

  async function _loader(source, inputSourceMap) {
    if (this.sourceMap) {
      const node = SourceNode.fromStringWithSourceMap(
        source,
        await new SourceMapConsumer(inputSourceMap)
      );

      node.prepend([RefreshSetupRuntime, '\n\n']);
      node.add(['\n\n', RefreshModuleRuntime]);

      const { code, map } = node.toStringWithSourceMap();
      return [code, map.toJSON()];
    } else {
      return [[RefreshSetupRuntime, source, RefreshModuleRuntime].join('\n\n'), inputSourceMap];
    }
  }

  _loader.call(this, source, inputSourceMap).then(
    ([code, map]) => {
      callback(null, code, map, meta);
    },
    (error) => {
      callback(error);
    }
  );
}

module.exports = ReactRefreshLoader;
