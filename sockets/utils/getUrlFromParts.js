/**
 * Create a valid URL from parsed URL parts.
 * @param {import('./getSocketUrlParts').SocketUrlParts} urlParts The parsed URL parts.
 * @returns {string} The generated URL.
 */
function urlFromParts(urlParts) {
  const fullProtocol = (urlParts.protocol || 'http:') + '//';

  let fullHost = urlParts.hostname;
  if (urlParts.auth) {
    const fullAuth = urlParts.auth.split(':').map(encodeURIComponent).join(':') + '@';
    fullHost = fullAuth + fullHost;
  }
  if (urlParts.port) {
    fullHost = fullHost + ':' + urlParts.port;
  }

  const url = new URL(urlParts.pathname, fullProtocol + fullHost);
  return url.href;
}

export default urlFromParts;
