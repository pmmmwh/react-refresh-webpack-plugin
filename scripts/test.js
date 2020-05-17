// Setup environment before any code -
// this makes sure everything coming after will run in the correct env.
process.env.NODE_ENV = 'test';

// Crash on unhandled rejections instead of failing silently.
process.on('unhandledRejection', (error) => {
  throw error;
});

const jest = require('jest');
const yn = require('yn');

let argv = process.argv.slice(2);

if (yn(process.env.CI)) {
  // Force headless mode in CI environments
  process.env.HEADLESS = 'true';

  // Parallelized puppeteer tests have high memory overhead in CI environments.
  // Fall back to run in series so tests will run faster.
  argv.push('--runInBand');
}

if (yn(process.env.DEBUG)) {
  argv.push('--verbose');
}

void jest.run(argv);
