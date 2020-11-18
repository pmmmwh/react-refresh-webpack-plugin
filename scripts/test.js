// Setup environment before any code -
// this makes sure everything coming after will run in the correct env.
process.env.NODE_ENV = 'test';

// Crash on unhandled rejections instead of failing silently.
process.on('unhandledRejection', (reason) => {
  throw reason;
});

const jest = require('jest');
const yn = require('yn');

let argv = process.argv.slice(2);

if (yn(process.env.CI)) {
  // Force headless mode in CI environments
  process.env.HEADLESS = 'true';

  // Use CI mode
  argv.push('--ci');
  // Parallelized puppeteer tests have high memory overhead in CI environments.
  // Fall back to run in series so tests could run faster.
  argv.push('--runInBand');
  // Add JUnit reporter
  argv.push('--reporters="default"');
  argv.push('--reporters="jest-junit"');
}

if (yn(process.env.DEBUG)) {
  argv.push('--verbose');
}

if (parseInt(process.env.WEBPACK_VERSION || 4, 10) === 5) {
  // Apply Webpack npm aliases in Jest's module system
  argv.push(
    `--moduleNameMapper="${JSON.stringify({
      '^webpack($|/.*)': 'webpack.latest$1',
      '^webpack-cli($|/.*)': 'webpack-cli.latest$1',
    })}"`
  );
}

void jest.run(argv);
