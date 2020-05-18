const puppeteer = require('puppeteer');
const yn = require('yn');

async function setup() {
  const browser = await puppeteer.launch({
    headless: yn(process.env.HEADLESS, { default: false }),
  });

  global.__BROWSER_INSTANCE__ = browser;

  process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
}

module.exports = setup;
