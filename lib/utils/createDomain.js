// taken from
// https://github.com/webpack/webpack-dev-server/blob/4ab1f21bc85cc1695255c739160ad00dc14375f1/lib/utils/createDomain.js
// with the only change being we use 'native-url' here

'use strict';

const url = require('native-url');
const ip = require('internal-ip');

function createDomain(options, server) {
  const protocol = options.https ? 'https' : 'http';
  const hostname = options.useLocalIp ? ip.v4.sync() || 'localhost' : options.host || 'localhost';

  const port = options.socket ? 0 : server ? server.address().port : 0;
  // use explicitly defined public url
  // (prefix with protocol if not explicitly given)
  if (options.public) {
    return /^[a-zA-Z]+:\/\//.test(options.public)
      ? `${options.public}`
      : `${protocol}://${options.public}`;
  }
  // the formatted domain (url without path) of the webpack server
  return url.format({
    protocol,
    hostname,
    port,
  });
}

module.exports = createDomain;
