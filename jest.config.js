module.exports = {
  globalSetup: '<rootDir>/jest-global-setup.js',
  globalTeardown: '<rootDir>/jest-global-teardown.js',
  modulePaths: [],
  rootDir: 'test',
  testEnvironment: '<rootDir>/jest-environment.js',
  testMatch: ['<rootDir>/**/*.test.js'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
