const getAdditionalEntries = require('../../lib/utils/getAdditionalEntries');

const ErrorOverlayEntry = require.resolve('../../client/ErrorOverlayEntry');
const ReactRefreshEntry = require.resolve('../../client/ReactRefreshEntry');

describe('getAdditionalEntries', () => {
  it('should work with default settings', () => {
    expect(getAdditionalEntries({ overlay: { entry: ErrorOverlayEntry } })).toStrictEqual({
      overlayEntries: [ErrorOverlayEntry],
      prependEntries: [ReactRefreshEntry],
    });
  });

  it('should skip overlay entries when overlay is false in options', () => {
    expect(getAdditionalEntries({ overlay: false })).toStrictEqual({
      overlayEntries: [],
      prependEntries: [ReactRefreshEntry],
    });
  });
});
