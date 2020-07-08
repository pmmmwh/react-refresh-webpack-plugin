const webpackVersion = parseInt(process.env.WEBPACK_VERSION || '4', 10);

module.exports = {
  globalSetup: '<rootDir>/jest-global-setup.js',
  globalTeardown: '<rootDir>/jest-global-teardown.js',
  rootDir: 'test',
  setupFilesAfterEnv: ['<rootDir>/jest-test-setup.js'],
  testEnvironment: '<rootDir>/jest-environment.js',
  testMatch: ['<rootDir>/**/*.test.js'],
  testRunner: 'jest-circus/runner',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  ...(webpackVersion === 5 && {
    moduleNameMapper: {
      '^webpack$': 'webpack:next',
      '^webpack/(.*)': 'webpack:next/$1',
      '^webpack-cli$': 'webpack-cli:beta',
      '^webpack-cli/(.*)': 'webpack-cli:beta/$1',
    },
  }),
};
