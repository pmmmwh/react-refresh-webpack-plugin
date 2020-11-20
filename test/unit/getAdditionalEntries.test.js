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

  it('should append resource queries for sock protocol devServer options https', () => {
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

  it('should append resource queries for sock protocol devServer options http2', () => {
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
      overlayEntries: [
        `${ErrorOverlayEntry}?sockHost=localhost&sockPath=/socket&sockPort=9000&sockProtocol=http`,
      ],
    });
  });

  it('should use the devServer port and host as fallbacks if sockPort and sockHost are not defined', () => {
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

  it('should use the kdevServer sockHost and sockPort options, if they are available, over port and host ', () => {
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
