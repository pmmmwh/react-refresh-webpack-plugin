const url = require('native-url');
/**
 * @param {import('./getSocketUrlParts/SocketUrlParts')} urlParts
 * @returns {string}
 */
module.exports = function formatUrl(urlParts) {
  const myUrl = new URL('http://./');
  for (const [key, value] of Object.entries(urlParts)) {
    myUrl[key] = value;
  }
  return url.format(myUrl);
};
