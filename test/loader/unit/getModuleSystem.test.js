const path = require('path');
const { ModuleFilenameHelpers } = require('webpack');

describe('getModuleSystem', () => {
  let getModuleSystem;

  beforeEach(() => {
    jest.isolateModules(() => {
      getModuleSystem = require('../../../loader/utils/getModuleSystem');
    });
  });

  it('should return `esm` when `options.esModule` is true', async () => {
    await expect(getModuleSystem.call({}, ModuleFilenameHelpers, { esModule: true })).resolves.toBe(
      'esm'
    );
  });

  it('should return `cjs` when `options.esModule` is false', async () => {
    await expect(
      getModuleSystem.call({}, ModuleFilenameHelpers, { esModule: false })
    ).resolves.toBe('cjs');
  });

  it('should return `esm` when `resourcePath` matches `options.esModule.include`', async () => {
    await expect(
      getModuleSystem.call(
        {
          resourcePath: 'include',
        },
        ModuleFilenameHelpers,
        { esModule: { include: /include/ } }
      )
    ).resolves.toBe('esm');
  });

  it('should return `cjs` when `resourcePath` matches `options.esModule.exclude`', async () => {
    await expect(
      getModuleSystem.call(
        {
          resourcePath: 'exclude',
        },
        ModuleFilenameHelpers,
        { esModule: { exclude: /exclude/ } }
      )
    ).resolves.toBe('cjs');
  });

  it('should return `esm` when `resourcePath` ends with `.mjs` extension', async () => {
    await expect(
      getModuleSystem.call({ resourcePath: 'index.mjs' }, ModuleFilenameHelpers, {})
    ).resolves.toBe('esm');
  });

  it('should return `cjs` when `resourcePath` ends with `.cjs` extension', async () => {
    await expect(
      getModuleSystem.call({ resourcePath: 'index.cjs' }, ModuleFilenameHelpers, {})
    ).resolves.toBe('cjs');
  });

  it('should return `esm` when `package.json` uses the `module` type', async () => {
    await expect(
      getModuleSystem.call(
        {
          resourcePath: path.resolve(__dirname, '..', 'fixtures/esm', 'index.js'),
          rootContext: path.resolve(__dirname, '..', 'fixtures/esm'),
        },
        ModuleFilenameHelpers,
        {}
      )
    ).resolves.toBe('esm');
  });

  it('should return `cjs` when `package.json` uses the `commonjs` type', async () => {
    await expect(
      getModuleSystem.call(
        {
          resourcePath: path.resolve(__dirname, '..', 'fixtures/cjs', 'index.js'),
          rootContext: path.resolve(__dirname, '..', 'fixtures/cjs'),
        },
        ModuleFilenameHelpers,
        {}
      )
    ).resolves.toBe('cjs');
  });

  it('should return `cjs` when nothing matches', async () => {
    await expect(
      getModuleSystem.call(
        {
          resourcePath: path.resolve(__dirname, '..', 'fixtures/auto', 'index.js'),
          rootContext: path.resolve(__dirname, '..', 'fixtures/auto'),
        },
        ModuleFilenameHelpers,
        { esModule: {} }
      )
    ).resolves.toBe('cjs');
  });
});
