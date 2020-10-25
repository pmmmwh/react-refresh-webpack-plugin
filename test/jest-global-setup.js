const puppeteer = require('puppeteer');
const yn = require('yn');

async function setup() {
  const browser = await puppeteer.launch({
    headless: yn(process.env.HEADLESS, { default: false }),
    // Run Chromium without sandboxing on CI since it's unreliable
    ...(yn(process.env.CI) && {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }),
  });

  global.__BROWSER_INSTANCE__ = browser;

  process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
}

module.exports = setup;
