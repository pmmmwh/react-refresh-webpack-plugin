const normalizeOptions = require('../../../loader/utils/normalizeOptions');

/** @type {Partial<import('../../../types/loader').ReactRefreshLoaderOptions>} */
const DEFAULT_OPTIONS = {
  const: false,
  esModule: undefined,
};

describe('normalizeOptions', () => {
  it('should return default options when an empty object is received', () => {
    expect(normalizeOptions({})).toStrictEqual(DEFAULT_OPTIONS);
  });

  it('should return user options', () => {
    expect(
      normalizeOptions({
        const: true,
        esModule: {
          exclude: 'exclude',
          include: 'include',
        },
      })
    ).toStrictEqual({
      const: true,
      esModule: {
        exclude: 'exclude',
        include: 'include',
      },
    });
  });

  it('should return true for overlay options when it is true', () => {
    expect(normalizeOptions({ esModule: true })).toStrictEqual({
      ...DEFAULT_OPTIONS,
      esModule: true,
    });
  });

  it('should return false for esModule when it is false', () => {
    expect(normalizeOptions({ esModule: false })).toStrictEqual({
      ...DEFAULT_OPTIONS,
      esModule: false,
    });
  });

  it('should return undefined for esModule when it is undefined', () => {
    expect(normalizeOptions({ esModule: undefined })).toStrictEqual({
      ...DEFAULT_OPTIONS,
      esModule: undefined,
    });
  });

  it('should return undefined for esModule when it is undefined', () => {
    expect(normalizeOptions({ esModule: undefined })).toStrictEqual({
      ...DEFAULT_OPTIONS,
      esModule: undefined,
    });
  });
});
