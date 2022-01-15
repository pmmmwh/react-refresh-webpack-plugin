module.exports = {
  globalSetup: '<rootDir>/jest-global-setup.js',
  globalTeardown: '<rootDir>/jest-global-teardown.js',
  resolver: '<rootDir>/jest-resolver.js',
  rootDir: 'test',
  setupFilesAfterEnv: ['<rootDir>/jest-test-setup.js'],
  testEnvironment: '<rootDir>/jest-environment.js',
  testMatch: ['<rootDir>/**/*.test.js'],
};
