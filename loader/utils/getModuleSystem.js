const fs = require('fs/promises');
const path = require('path');
const { ModuleFilenameHelpers } = require('webpack');

/** @type {string | undefined} */
let packageJsonType;

/**
 *
 * @param {import('webpack').loader.LoaderContext} loaderContext
 * @param {import('../types').NormalizedLoaderOptions} options
 * @return {Promise<'esm' | 'cjs'>}
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
        ModuleFilenameHelpers.matchPart(options.esModule.include, loaderContext.resourcePath)
      ) {
        return 'esm';
      }
      if (
        options.esModule.exclude &&
        ModuleFilenameHelpers.matchPart(options.esModule.exclude, loaderContext.resourcePath)
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
      const buffer = await fs.readFile(packageJsonPath, { encoding: 'utf-8' });
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
