const path = require('path');

describe('getModuleSystem', () => {
  let getModuleSystem;

  beforeEach(() => {
    jest.isolateModules(() => {
      getModuleSystem = require('../../../loader/utils/getModuleSystem');
    });
  });

  it('should return `esm` when `options.esModule` is true', async () => {
    await expect(getModuleSystem({}, { esModule: true })).resolves.toBe('esm');
  });

  it('should return `cjs` when `options.esModule` is false', async () => {
    await expect(getModuleSystem({}, { esModule: false })).resolves.toBe('cjs');
  });

  it('should return `esm` when `resourcePath` matches `options.esModule.include`', async () => {
    await expect(
      getModuleSystem({ resourcePath: 'include' }, { esModule: { include: /include/ } })
    ).resolves.toBe('esm');
  });

  it('should return `cjs` when `resourcePath` matches `options.esModule.exclude`', async () => {
    await expect(
      getModuleSystem({ resourcePath: 'exclude' }, { esModule: { exclude: /exclude/ } })
    ).resolves.toBe('cjs');
  });

  it('should return `esm` when `resourcePath` ends with `.mjs` extension', async () => {
    await expect(getModuleSystem({ resourcePath: 'index.mjs' }, {})).resolves.toBe('esm');
  });

  it('should return `cjs` when `resourcePath` ends with `.cjs` extension', async () => {
    await expect(getModuleSystem({ resourcePath: 'index.cjs' }, {})).resolves.toBe('cjs');
  });

  it('should return `esm` when `package.json` uses the `module` type', async () => {
    await expect(
      getModuleSystem(
        { resourcePath: 'index.js', rootContext: path.resolve(__dirname, '..', 'fixtures/esm') },
        {}
      )
    ).resolves.toBe('esm');
  });

  it('should return `cjs` when `package.json` uses the `commonjs` type', async () => {
    await expect(
      getModuleSystem(
        { resourcePath: 'index.js', rootContext: path.resolve(__dirname, '..', 'fixtures/cjs') },
        {}
      )
    ).resolves.toBe('cjs');
  });

  it('should return `cjs` when nothing matches', async () => {
    await expect(
      getModuleSystem(
        { resourcePath: 'index.js', rootContext: path.resolve(__dirname, '..', 'fixtures/auto') },
        { esModule: {} }
      )
    ).resolves.toBe('cjs');
  });
});
