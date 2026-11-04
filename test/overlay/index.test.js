/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

describe('error overlay', () => {
  let loadHandler;

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '';
    jest
      .spyOn(HTMLIFrameElement.prototype, 'addEventListener')
      .mockImplementation((eventType, handler) => {
        if (eventType === 'load') loadHandler = handler;
      });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it.each([
    ['compile', (overlay) => overlay.showCompileError('Failed'), 'clearCompileError'],
    [
      'runtime',
      (overlay) => overlay.showRuntimeErrors([new Error('Failed')]),
      'clearRuntimeErrors',
    ],
  ])('clears a pending %s error before the iframe loads', (_, showError, clearError) => {
    const overlay = require('../../overlay');
    showError(overlay);
    const iframe = document.getElementById('react-refresh-overlay');

    overlay[clearError]();

    expect(iframe).not.toBeNull();
    expect(document.getElementById('react-refresh-overlay')).toBeNull();
    expect(() => loadHandler.call(iframe)).not.toThrow();
    expect(document.getElementById('react-refresh-overlay')).toBeNull();
  });

  it('does not render a runtime error cleared during the debounce', () => {
    jest.useFakeTimers();
    const overlay = require('../../overlay');

    overlay.handleRuntimeError(new Error('Failed'));
    overlay.clearRuntimeErrors();
    jest.runAllTimers();

    expect(document.getElementById('react-refresh-overlay')).toBeNull();
  });
});
