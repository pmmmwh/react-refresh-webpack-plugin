const getAdditionalEntries = require('../../lib/utils/getAdditionalEntries');

const ErrorOverlayEntry = require.resolve('../../client/ErrorOverlayEntry');
const ReactRefreshEntry = require.resolve('../../client/ReactRefreshEntry');

describe('getAdditionalEntries', () => {
  it('should work with default settings', () => {
    expect(
      getAdditionalEntries({
        overlay: { entry: ErrorOverlayEntry },
        runtimeEntry: ReactRefreshEntry,
      })
    ).toStrictEqual({
      overlayEntries: [ErrorOverlayEntry],
      prependEntries: [ReactRefreshEntry],
    });
  });

  it('should skip overlay entries when overlay is false in options', () => {
    expect(
      getAdditionalEntries({
        overlay: false,
        runtimeEntry: ReactRefreshEntry,
      })
    ).toStrictEqual({
      overlayEntries: [],
      prependEntries: [ReactRefreshEntry],
    });
  });

  it('should skip prepend entries when runtimeEntry is false in options', () => {
    expect(getAdditionalEntries({ overlay: false, runtimeEntry: false })).toStrictEqual({
      overlayEntries: [],
      prependEntries: [],
    });
  });
});
