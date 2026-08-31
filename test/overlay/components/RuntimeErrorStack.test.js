/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const RuntimeErrorStack = require('../../../overlay/components/RuntimeErrorStack');

describe('RuntimeErrorStack', () => {
  it('renders stack frame values as text', () => {
    const root = document.createElement('div');
    const error = new Error('Failed');
    error.stack =
      'Error: Failed\n    at <img src=x onerror=alert(1)> (/tmp/<strong>file</strong>.js:1:2)';

    RuntimeErrorStack(document, root, { error });

    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('strong')).toBeNull();
    expect(root.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(root.textContent).toContain('tmp/<strong>file</strong>.js:1:2');
  });
});
