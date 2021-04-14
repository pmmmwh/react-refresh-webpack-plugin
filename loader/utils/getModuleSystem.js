const { promises: fsPromises } = require('fs');
const path = require('path');
const { ModuleFilenameHelpers } = require('webpack');

/** @type {string | undefined} */
let packageJsonType;

/**
 * Infers the current active module system from loader context and options.
 * @param {import('webpack').loader.LoaderContext} loaderContext The Webpack loader context.
 * @param {import('../types').NormalizedLoaderOptions} options The normalized loader options.
 * @return {Promise<'esm' | 'cjs'>} The inferred module system.
 */
async function getModuleSystem(loaderContext, options) {
  // Check loader options -
  // if `esModule` is set we don't have to do extra guess work.
  switch (typeof options.esModule) {
    case 'boolean': {
      return options.esModule ? 'esm' : 'cjs';
    }
    case 'object': {
      if (
        options.esModule.include &&
        ModuleFilenameHelpers.matchPart(loaderContext.resourcePath, options.esModule.include)
      ) {
        return 'esm';
      }
      if (
        options.esModule.exclude &&
        ModuleFilenameHelpers.matchPart(loaderContext.resourcePath, options.esModule.exclude)
      ) {
        return 'cjs';
      }

      break;
    }
    default: // Do nothing
  }

  // Check current resource's extension
  if (/\.mjs$/.test(loaderContext.resourcePath)) return 'esm';
  if (/\.cjs$/.test(loaderContext.resourcePath)) return 'cjs';

  // Load users' `package.json` -
  // We will cache the results in a global variable so it will only be parsed once.
  if (!packageJsonType) {
    try {
      const packageJsonPath = require.resolve(path.join(loaderContext.rootContext, 'package.json'));
      const buffer = await fsPromises.readFile(packageJsonPath, { encoding: 'utf-8' });
      const rawPackageJson = buffer.toString('utf-8');
      ({ type: packageJsonType } = JSON.parse(rawPackageJson));
    } catch (e) {
      // Failed to parse `package.json`, do nothing.
    }
  }

  // Check `package.json` for the `type` field -
  // fallback to use `cjs` for anything ambiguous.
  return packageJsonType === 'module' ? 'esm' : 'cjs';
}

module.exports = getModuleSystem;
