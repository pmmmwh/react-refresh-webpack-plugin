const CompileErrorContainer = require('./containers/CompileErrorContainer');
const RuntimeErrorContainer = require('./containers/RuntimeErrorContainer');

/**
 * @callback RenderFn
 * @returns {void}
 */

/* ===== Cached elements for DOM manipulations ===== */
/**
 * The iframe that contains the overlay.
 * @type {HTMLIFrameElement}
 */
let iframeRoot = null;
/**
 * The document object from the iframe root, used to create and render elements.
 * @type {Document}
 */
let rootDocument = null;
/**
 * The root div elements will attach to.
 * @type {HTMLDivElement}
 */
let root = null;
/**
 * A Cached function to allow deferred render
 * @type {RenderFn | null}
 */
let scheduledRenderFn = null;

/* ===== Overlay State ===== */
/**
 * The type of error handled by the overlay currently.
 * @type {'compileError' | 'runtimeError'}
 */
let currentMode = 'compileError';
/**
 * The latest error message from Webpack compilation.
 * @type {string}
 */
let currentCompileErrorMessage = '';
/**
 * Index of the error currently shown by the overlay.
 * @type {number}
 */
let currentRuntimeErrorIndex = 0;
/**
 * The latest runtime error objects.
 * @type {Error[]}
 */
let currentRuntimeErrors = [];

/**
 * @typedef {Object} IframeProps
 * @property {function(): void} onIframeLoad
 */

/**
 * Creates the main `iframe` the overlay will attach to.
 * Accepts a callback to be ran after iframe is initialized.
 * @param {Document} document
 * @param {HTMLElement} root
 * @param {IframeProps} props
 * @returns {HTMLIFrameElement}
 */
function IframeRoot(document, root, props) {
  const iframe = document.createElement('iframe');
  iframe.id = 'react-refresh-overlay';
  iframe.src = 'about:blank';

  iframe.style.border = 'none';
  iframe.style.height = '100vh';
  iframe.style.left = '0';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.width = '100vw';
  iframe.style.zIndex = '2147483647';
  iframe.addEventListener('load', function onLoad() {
    // Reset margin of iframe body
    iframe.contentDocument.body.style.margin = '0';
    props.onIframeLoad();
  });

  // We skip mounting and returns as we need to ensure
  // the load event is fired after we setup the global variable
  return iframe;
}

/**
 * Creates the main `div` element for the overlay to render.
 * @param {Document} document
 * @param {HTMLElement} root
 * @returns {HTMLDivElement}
 */
function OverlayRoot(document, root) {
  const div = document.createElement('div');
  div.id = 'react-refresh-overlay-error';

  // Style the contents container
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
  div.style.boxSizing = 'border-box';
  div.style.color = '#ffffff';
  div.style.fontFamily = [
    '"Operator Mono SSm"',
    '"Operator Mono"',
    '"Fira Code Retina"',
    '"Fira Code"',
    '"FiraCode-Retina"',
    '"Andale Mono"',
    '"Lucida Console"',
    'Menlo',
    'Consolas',
    'Monaco',
    'monospace',
  ].join(', ');
  div.style.fontSize = '0.8125rem';
  div.style.height = '100vh';
  div.style.lineHeight = '1.2';
  div.style.overflow = 'auto';
  div.style.padding = '2rem 2rem 0';
  div.style.whiteSpace = 'pre-wrap';
  div.style.width = '100vw';

  root.appendChild(div);
  return div;
}

/**
 * Ensures the iframe root and the overlay root are both initialized before render.
 * If check fails, render will be deferred until both roots are initialized.
 * @param {RenderFn} render
 * @returns {void}
 */
function ensureRootExists(render) {
  if (root) {
    // Overlay root is ready, we can render right away.
    render();
    return;
  }

  // Creating an iframe may be asynchronous so we'll defer render.
  // In case of multiple calls, function from the last call will be used.
  scheduledRenderFn = render;

  if (iframeRoot) {
    // Iframe is already ready, it will fire the load event.
    return;
  }

  // Create the iframe root, and, the overlay root inside it when it is ready.
  iframeRoot = IframeRoot(document, document.body, {
    onIframeLoad: function onIframeLoad() {
      rootDocument = iframeRoot.contentDocument;
      root = OverlayRoot(rootDocument, rootDocument.body);
      scheduledRenderFn();
    },
  });

  // We have to mount here to ensure `iframeRoot` is set when `onIframeLoad` fires.
  // This is because onIframeLoad() will be called synchronously
  // or asynchronously depending on the browser.
  document.body.appendChild(iframeRoot);
}

/**
 * Destroys the state of the overlay.
 * @returns {void}
 */
function cleanup() {
  // Clean up and reset all internal state.
  document.body.removeChild(iframeRoot);
  currentMode = 'compileError';
  scheduledRenderFn = null;
  root = null;
  iframeRoot = null;
}

/**
 * Clears Webpack compilation errors and dismisses the compile error overlay.
 * @returns {void}
 */
function clearCompileError() {
  if (!root || currentMode !== 'compileError' || !currentCompileErrorMessage) {
    return;
  }

  currentCompileErrorMessage = '';
  cleanup();
}

/**
 * Clears runtime error records and dismisses the runtime error overlay.
 * @returns {void}
 */
function clearRuntimeErrors() {
  if (!root || currentMode !== 'runtimeError' || !currentRuntimeErrors.length) {
    return;
  }

  currentRuntimeErrorIndex = 0;
  currentRuntimeErrors = [];
  cleanup();
}

/**
 * Shows the compile error overlay with the specific Webpack error message.
 * @param {string} message
 * @returns {void}
 */
function showCompileError(message) {
  if (!message) {
    return;
  }

  currentMode = 'compileError';
  currentCompileErrorMessage = message;

  /** @type {RenderFn} */
  function render() {
    CompileErrorContainer(rootDocument, root, {
      errorMessage: currentCompileErrorMessage,
    });
  }

  ensureRootExists(render);
}

/**
 * Shows the runtime error overlay with the specific error records.
 * @param {Error[]} errors
 * @returns {void}
 */
function showRuntimeErrors(errors) {
  if (!errors || !errors.length) {
    return;
  }

  currentMode = 'runtimeError';
  currentRuntimeErrors = errors;

  /** @type {RenderFn} */
  function render() {
    RuntimeErrorContainer(rootDocument, root, {
      activeErrorIndex: currentRuntimeErrorIndex,
      errors: currentRuntimeErrors,
      onClickCloseButton: clearRuntimeErrors,
      onClickNextButton: function onNext() {
        if (currentRuntimeErrorIndex === currentRuntimeErrors.length - 1) {
          return;
        }
        currentRuntimeErrorIndex += 1;
        ensureRootExists(render);
      },
      onClickPrevButton: function onPrev() {
        if (currentRuntimeErrorIndex === 0) {
          return;
        }
        currentRuntimeErrorIndex -= 1;
        ensureRootExists(render);
      },
    });
  }

  ensureRootExists(render);
}

module.exports = Object.freeze({
  clearCompileError,
  clearRuntimeErrors,
  showCompileError,
  showRuntimeErrors,
});
