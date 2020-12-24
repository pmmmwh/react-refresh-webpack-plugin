/* global __react_refresh_polyfill_url__ */

/**
 * @typedef {Object} UrlAPIs
 * @property {typeof URL} URL
 * @property {typeof URLSearchParams} URLSearchParams
 */

/**
 * Runs a callback with patched the DOM URL APIs.
 * @param {function(UrlAPIs): void} callback The code to run with patched URL globals.
 * @returns {void}
 */
function runWithURLPatch(callback) {
  let __originalURL;
  let __originalURLSearchParams;

  // Polyfill the DOM URL and URLSearchParams constructors
  if (__react_refresh_polyfill_url__ || !window.URL) {
    const SafeURL = require('core-js-pure/web/url');

    __originalURL = window.URL;
    window.URL = SafeURL;
  }
  if (__react_refresh_polyfill_url__ || !window.URLSearchParams) {
    const SafeURLSearchParams = require('core-js-pure/web/url-search-params');

    __originalURLSearchParams = window.URLSearchParams;
    window.URLSearchParams = SafeURLSearchParams;
  }

  // Pass in polyfilled URL APIs in case they are needed
  callback({ URL: window.URL, URLSearchParams: window.URLSearchParams });

  // Restore polyfills to their original state
  if (__originalURL) {
    window.URL = __originalURL;
  }
  if (__originalURLSearchParams) {
    window.URLSearchParams = __originalURLSearchParams;
  }
}

module.exports = runWithURLPatch;
