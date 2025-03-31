const getAdditionalEntries = require('./getAdditionalEntries');
const getIntegrationEntry = require('./getIntegrationEntry');
const getSocketIntegration = require('./getSocketIntegration');
const injectRefreshLoader = require('./injectRefreshLoader');
const makeRefreshRuntimeModule = require('./makeRefreshRuntimeModule');
const normalizeOptions = require('./normalizeOptions');

module.exports = {
  getAdditionalEntries,
  getIntegrationEntry,
  getSocketIntegration,
  injectRefreshLoader,
  makeRefreshRuntimeModule,
  normalizeOptions,
};
