const { SourceMapConsumer, SourceMapGenerator, SourceNode } = require('source-map');
const { Template } = require('webpack');

/**
 * Generates an identity source map from a source file.
 * @param {string} source The content of the source file.
 * @param {string} resourcePath The name of the source file.
 * @returns {import('source-map').RawSourceMap} The identity source map.
 */
function getIdentitySourceMap(source, resourcePath) {
  const sourceMap = new SourceMapGenerator();
  sourceMap.setSourceContent(resourcePath, source);

  source.split('\n').forEach((line, index) => {
    sourceMap.addMapping({
      source: resourcePath,
      original: {
        line: index + 1,
        column: 0,
      },
      generated: {
        line: index + 1,
        column: 0,
      },
    });
  });

  return sourceMap.toJSON();
}

/**
 * Gets a runtime template from provided function.
 * @param {function(): void} fn A function containing the runtime template.
 * @returns {string} The "sanitized" runtime template.
 */
function getTemplate(fn) {
  return Template.getFunctionContent(fn).trim().replace(/^ {2}/gm, '');
}

const RefreshSetupRuntime = getTemplate(require('./RefreshSetup.runtime'));
const RefreshModuleRuntime = getTemplate(require('./RefreshModule.runtime'));

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

  /**
   * @this {import('webpack').loader.LoaderContext}
   * @param {string} source
   * @param {import('source-map').RawSourceMap} [inputSourceMap]
   * @returns {Promise<[string, import('source-map').RawSourceMap]>}
   */
  async function _loader(source, inputSourceMap) {
    if (this.sourceMap) {
      let originalSourceMap = inputSourceMap;
      if (!originalSourceMap) {
        originalSourceMap = getIdentitySourceMap(source, this.resourcePath);
      }

      const node = SourceNode.fromStringWithSourceMap(
        source,
        await new SourceMapConsumer(originalSourceMap)
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
