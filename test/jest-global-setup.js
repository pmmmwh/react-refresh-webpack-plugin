const puppeteer = require('puppeteer');
const yn = require('yn');

async function setup() {
  if (yn(process.env.BROWSER, { default: true })) {
    const browser = await puppeteer.launch({
      devtools: yn(process.env.DEBUG, { default: false }),
      headless: yn(process.env.HEADLESS, {
        // Force headless mode in CI environments
        default: yn(process.env.CI, { default: false }),
      }),
    });

    global.__BROWSER_INSTANCE__ = browser;

    process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
  }
}

module.exports = setup;
