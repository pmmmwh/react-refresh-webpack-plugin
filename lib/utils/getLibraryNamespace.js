/**
 * Gets the library namespace for React Refresh injection.
 * @param {import('../types').NormalizedPluginOptions} pluginOptions Configuration options for this plugin.
 * @param {import('webpack').Compilation["options"]["output"]} outputOptions Configuration options for Webpack output.
 * @returns {string | undefined} The library namespace for React Refresh injection.
 */
function getLibraryNamespace(pluginOptions, outputOptions) {
  if (pluginOptions.library) return pluginOptions.library;
  if (outputOptions.uniqueName) return outputOptions.uniqueName;

  if (!outputOptions.library || !outputOptions.library.name) return;

  const libraryName = outputOptions.library.name;
  if (Array.isArray(libraryName)) return libraryName[0];
  if (typeof libraryName === 'string') return libraryName;
  if (Array.isArray(libraryName.root)) return libraryName.root[0];
  if (typeof libraryName.root === 'string') return libraryName.root;
}

module.exports = getLibraryNamespace;
