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
            sockProtocol: 'https',
          },
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [
        `${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000&sockProtocol=https`,
      ],
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
      overlayEntries: [
        `${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000&sockProtocol=http`,
      ],
    });
  });

  it('should correctly set sock protocol when https is specified in devServer options', () => {
    expect(
      getAdditionalEntries({
        options: DEFAULT_OPTIONS,
        devServer: {
          https: true,
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockProtocol=https`],
    });
  });

  it('should correctly set sock protocol when http2 is specified in devServer options', () => {
    expect(
      getAdditionalEntries({
        options: DEFAULT_OPTIONS,
        devServer: {
          http2: true,
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockProtocol=https`],
    });
  });

  it('should use overlay options over devServer options with both are specified', () => {
    expect(
      getAdditionalEntries({
        options: {
          overlay: {
            entry: ErrorOverlayEntry,
            sockHost: 'localhost',
            sockPath: '/socket',
            sockPort: '9000',
            sockProtocol: 'https',
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
      overlayEntries: [
        `${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000&sockProtocol=https`,
      ],
    });
  });

  it('should use devServer port and host as fallbacks if sockPort and sockHost are not defined', () => {
    expect(
      getAdditionalEntries({
        options: DEFAULT_OPTIONS,
        devServer: {
          port: 8888,
          host: 'localhost',
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockHost=localhost&sockPort=8888&sockProtocol=http`],
    });
  });

  it('should use the devServer sockHost and sockPort options over port and host if they are available', () => {
    expect(
      getAdditionalEntries({
        options: DEFAULT_OPTIONS,
        devServer: {
          port: 8888,
          host: 'otherhost',
          sockPort: 9999,
          sockHost: 'localhost',
        },
      })
    ).toStrictEqual({
      prependEntries: [ReactRefreshEntry],
      overlayEntries: [`${ErrorOverlayEntry}?sockHost=localhost&sockPort=9999&sockProtocol=http`],
    });
  });
});
