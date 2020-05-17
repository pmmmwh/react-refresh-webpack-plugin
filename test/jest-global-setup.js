const puppeteer = require('puppeteer');

async function setup() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  global.__BROWSER_INSTANCE__ = browser;

  process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
}

module.exports = setup;
