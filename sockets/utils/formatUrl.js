const url = require('native-url');
function isIpv6Literal(hostname) {
  return hostname.startsWith('[') && hostname.endsWith(']');
}
/**
 * @param {import('./getSocketUrlParts').SocketUrlParts} urlParts
 * @returns {string}
 */
function formatUrl(urlParts) {
  if (Object.prototype.toString.call(urlParts.hostname) === '[object String]') {
    // check hostname for [::]
    if (isIpv6Literal(urlParts.hostname)) {
      // strip `[` and `]`
      urlParts.hostname = urlParts.hostname.substr(1, urlParts.hostname.length - 2);
    }
  }
  return url.format(urlParts);
}
module.exports = formatUrl;
