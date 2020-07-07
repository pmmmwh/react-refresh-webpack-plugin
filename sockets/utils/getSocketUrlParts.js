const getCurrentScriptSource = require('./getCurrentScriptSource');
const parseQuery = require('./parseQuery');

/**
 * @typedef {Object} SocketUrlParts
 * @property {string} [auth]
 * @property {string} [hostname]
 * @property {string} [protocol]
 * @property {string} [pathname]
 * @property {string} [port]
 */

/**
 * Parse current location and Webpack's `__resourceQuery` into parts that can create a valid socket URL.
 * @param {string} [resourceQuery] The Webpack `__resourceQuery` string.
 * @returns {SocketUrlParts} The parsed URL parts.
 * @see https://webpack.js.org/api/module-variables/#__resourcequery-webpack-specific
 */
function getSocketUrlParts(resourceQuery) {
  const url = new URL(getCurrentScriptSource());

  /** @type {string} */
  let auth;
  let hostname = url.hostname;
  let protocol = url.protocol;
  let pathname = '/sockjs-node'; // This is hard-coded in WDS
  let port = url.port;

  // Parse authentication credentials in case we need them
  if (url.username) {
    auth = url.username;

    // Since HTTP basic authentication does not allow empty username,
    // we only include password if the username is not empty.
    if (url.password) {
      // Result: <username>:<password>
      auth = auth.concat(':', url.password);
    }
  }

  // Check for IPv4 and IPv6 host addresses that corresponds to `any`/`empty`.
  // This is important because `hostname` can be empty for some hosts,
  // such as `about:blank` or `file://` URLs.
  const isEmptyHostname =
    url.hostname === '0.0.0.0' ||
    url.hostname === '0000:0000:0000:0000:0000:0000:0000:0000' ||
    url.hostname === '::';

  // We only re-assign the hostname if we are using the HTTP protocol
  if (
    isEmptyHostname &&
    window.location.hostname &&
    window.location.protocol.indexOf('http') === 0
  ) {
    hostname = window.location.hostname;
  }

  // We only re-assign `protocol` when `hostname` is available and is empty,
  // since otherwise we risk creating an invalid URL.
  // We also do this when `https` is used as it mandates the use of secure sockets.
  if (hostname && (isEmptyHostname || window.location.protocol === 'https:')) {
    protocol = window.location.protocol;
  }

  // We only re-assign port when it is not available or `empty`
  if (!port || port === '0') {
    port = window.location.port;
  }

  // If the resource query is available,
  // parse it and overwrite everything we received from the script host.
  const parsedQuery = parseQuery(resourceQuery || '');
  hostname = parsedQuery.sockHost || hostname;
  pathname = parsedQuery.sockPath || pathname;
  port = parsedQuery.sockPort || port;

  return {
    auth: auth,
    hostname: hostname,
    pathname: pathname,
    protocol: protocol,
    port: port,
  };
}

module.exports = getSocketUrlParts;
