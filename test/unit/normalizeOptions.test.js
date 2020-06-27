const normalizeOptions = require('../../lib/utils/normalizeOptions');

const DEFAULT_OPTIONS = {
  exclude: /node_modules/,
  include: /\.([jt]sx?|flow)$/,
  overlay: {
    entry: require.resolve('../../client/ErrorOverlayEntry'),
    module: require.resolve('../../overlay'),
    sockIntegration: 'wds',
  },
};

describe('normalizeOptions', () => {
  it('should return default options when an empty object is received', () => {
    expect(normalizeOptions({})).toStrictEqual(DEFAULT_OPTIONS);
  });

  it('should return user options', () => {
    expect(
      normalizeOptions({
        exclude: 'exclude',
        forceEnable: true,
        include: 'include',
        overlay: {
          entry: 'entry',
          module: 'overlay',
          sockHost: 'localhost',
          sockIntegration: 'whm',
          sockPath: '/socket',
          sockPort: 9000,
        },
        useLegacyWDSSockets: true,
      })
    ).toStrictEqual({
      exclude: 'exclude',
      forceEnable: true,
      include: 'include',
      overlay: {
        entry: 'entry',
        module: 'overlay',
        sockHost: 'localhost',
        sockIntegration: 'whm',
        sockPath: '/socket',
        sockPort: 9000,
      },
      useLegacyWDSSockets: true,
    });
  });

  // TODO: Remove when the deprecation warning is removed
  it('should emit warning and exclude its value when disableRefreshCheck is used', () => {
    jest.spyOn(console, 'warn').mockImplementationOnce(() => undefined);

    expect(normalizeOptions({ disableRefreshCheck: true })).toStrictEqual(DEFAULT_OPTIONS);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenLastCalledWith(
      [
        'The "disableRefreshCheck" option has been deprecated and will not have any effect on how the plugin parses files.',
        'Please remove it from your configuration.',
      ].join(' ')
    );

    console.warn.mockRestore();
  });

  it('should return default for overlay options when it is true', () => {
    expect(normalizeOptions({ overlay: true })).toStrictEqual(DEFAULT_OPTIONS);
  });

  it('should return false for overlay options when it is false', () => {
    expect(normalizeOptions({ overlay: false })).toStrictEqual({
      ...DEFAULT_OPTIONS,
      overlay: false,
    });
  });
});
