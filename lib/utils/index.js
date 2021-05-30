const getAdditionalEntries = require('./getAdditionalEntries');
const getIntegrationEntry = require('./getIntegrationEntry');
const getParserHelpers = require('./getParserHelpers');
const getRefreshGlobal = require('./getRefreshGlobal');
const getSocketIntegration = require('./getSocketIntegration');
const injectRefreshEntry = require('./injectRefreshEntry');
const injectRefreshLoader = require('./injectRefreshLoader');
const normalizeOptions = require('./normalizeOptions');

module.exports = {
  getAdditionalEntries,
  getIntegrationEntry,
  getParserHelpers,
  getRefreshGlobal,
  getSocketIntegration,
  injectRefreshEntry,
  injectRefreshLoader,
  normalizeOptions,
};
