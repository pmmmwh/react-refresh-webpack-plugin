const getAdditionalEntries = require('./getAdditionalEntries');
const getIntegrationEntry = require('./getIntegrationEntry');
const getLibraryNamespace = require('./getLibraryNamespace');
const getSocketIntegration = require('./getSocketIntegration');
const injectRefreshLoader = require('./injectRefreshLoader');
const makeRefreshRuntimeModule = require('./makeRefreshRuntimeModule');
const normalizeOptions = require('./normalizeOptions');

module.exports = {
  getAdditionalEntries,
  getIntegrationEntry,
  getLibraryNamespace,
  getSocketIntegration,
  injectRefreshLoader,
  makeRefreshRuntimeModule,
  normalizeOptions,
};
