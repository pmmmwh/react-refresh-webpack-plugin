const getOverlayEntry = require('../../lib/utils/getOverlayEntry');

const ErrorOverlayEntry = require.resolve('../../client/ErrorOverlayEntry');
const ReactRefreshEntry = require.resolve('../../client/ReactRefreshEntry');

const DEFAULT_OPTIONS = {
  overlay: {
    entry: ErrorOverlayEntry,
  },
};

describe('getOverlayEntry', () => {
  it('should append legacy WDS entry when required', () => {
    expect(
      getOverlayEntry({
        overlay: {
          entry: ErrorOverlayEntry,
          useLegacyWDSSockets: true,
        },
      })
    ).toStrictEqual({
      overlayEntries: [require.resolve('../../client/LegacyWDSSocketEntry'), ErrorOverlayEntry],
      prependEntries: [ReactRefreshEntry],
    });
  });

  it('should append resource queries to the overlay entry when specified', () => {
    expect(
      getOverlayEntry({
        overlay: {
          entry: ErrorOverlayEntry,
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

  it('should append resource queries to the overlay entry when specified in devServer options', () => {
    expect(
      getOverlayEntry(DEFAULT_OPTIONS, {
        sockHost: 'localhost',
        sockPath: '/socket',
        sockPort: '9000',
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000`],
    });
  });

  it('should append resource queries to the overlay entry when specified in both devServer options and overlay options', () => {
    expect(
      getOverlayEntry(
        {
          overlay: {
            entry: ErrorOverlayEntry,
            sockHost: 'localhost',
            sockPath: '/socket',
            sockPort: '9000',
          },
        },
        {
          sockHost: 'someotherhost',
          sockPath: '/socketpath',
          sockPort: '9001',
        }
      )
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000`],
    });
  });
});
