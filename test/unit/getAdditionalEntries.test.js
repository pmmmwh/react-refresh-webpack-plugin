const getAdditionalEntries = require('../../lib/utils/getAdditionalEntries');

const ErrorOverlayEntry = require.resolve('../../client/ErrorOverlayEntry');
const ReactRefreshEntry = require.resolve('../../client/ReactRefreshEntry');

const DEFAULT_OPTIONS = {
  overlay: {
    entry: ErrorOverlayEntry,
  },
};

describe('getAdditionalEntries', () => {
  it('should work with default settings', () => {
    expect(getAdditionalEntries({ options: DEFAULT_OPTIONS })).toStrictEqual({
      overlayEntries: [ErrorOverlayEntry],
      prependEntries: [ReactRefreshEntry],
    });
  });

  it('should append legacy WDS entry when required', () => {
    expect(
      getAdditionalEntries({
        options: {
          overlay: {
            entry: ErrorOverlayEntry,
            useLegacyWDSSockets: true,
          },
        },
      })
    ).toStrictEqual({
      overlayEntries: [require.resolve('../../client/LegacyWDSSocketEntry'), ErrorOverlayEntry],
      prependEntries: [ReactRefreshEntry],
    });
  });

  it('should append resource queries to the overlay entry when specified in overlay options', () => {
    expect(
      getAdditionalEntries({
        options: {
          overlay: {
            entry: ErrorOverlayEntry,
            sockHost: 'localhost',
            sockPath: '/socket',
            sockPort: '9000',
          },
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000`],
    });
  });

  it('should append resource queries to the overlay entry when specified in devServer options', () => {
    expect(
      getAdditionalEntries({
        options: DEFAULT_OPTIONS,
        devServer: {
          sockHost: 'localhost',
          sockPath: '/socket',
          sockPort: '9000',
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000`],
    });
  });

  it('should append resource queries to the overlay entry when specified in both devServer options and overlay options', () => {
    expect(
      getAdditionalEntries({
        options: {
          overlay: {
            entry: ErrorOverlayEntry,
            sockHost: 'localhost',
            sockPath: '/socket',
            sockPort: '9000',
          },
        },
        devServer: {
          sockHost: 'someotherhost',
          sockPath: '/socketpath',
          sockPort: '9001',
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000`],
    });
  });
});
