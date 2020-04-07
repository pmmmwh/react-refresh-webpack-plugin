function getSocketIntegration(integrationType) {
  let resolvedSocketIntegration;
  switch (integrationType) {
    case 'wds':
      resolvedSocketIntegration = require.resolve('../runtime/sockets/WDSSocket');
      break;
    case 'whm':
      resolvedSocketIntegration = require.resolve('../runtime/sockets/WHMEventSource');
      break;
    default:
      resolvedSocketIntegration = require.resolve(integrationType);
      break;
  }

  return resolvedSocketIntegration;
}

module.exports = getSocketIntegration;
