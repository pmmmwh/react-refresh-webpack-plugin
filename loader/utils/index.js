const getIdentitySourceMap = require('./getIdentitySourceMap');
const getModuleSystem = require('./getModuleSystem');
const getRefreshModuleRuntime = require('./getRefreshModuleRuntime');
const normalizeOptions = require('./normalizeOptions');
const webpackGlobal = require('./webpackGlobal');

module.exports = {
  getIdentitySourceMap,
  getModuleSystem,
  getRefreshModuleRuntime,
  normalizeOptions,
  webpackGlobal,
};
