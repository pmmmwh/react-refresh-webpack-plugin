/**
 * Gets the socket integration to use for Webpack messages.
 * @param {'wds' | 'whm' | 'wps' | string} integrationType A valid socket integration type or a path to a module.
 * @returns {string} Path to the resolved socket integration module.
 */
function getSocketIntegration(integrationType) {
  let resolvedSocketIntegration;
  switch (integrationType) {
    case 'wds':
      resolvedSocketIntegration = require.resolve('../runtime/sockets/WDSSocket');
      break;
    case 'whm':
      resolvedSocketIntegration = require.resolve('../runtime/sockets/WHMEventSource');
      break;
    case 'wps':
      resolvedSocketIntegration = require.resolve('../runtime/sockets/WPSSocket');
      break;
    default:
      resolvedSocketIntegration = require.resolve(integrationType);
      break;
  }

  return resolvedSocketIntegration;
}

module.exports = getSocketIntegration;
