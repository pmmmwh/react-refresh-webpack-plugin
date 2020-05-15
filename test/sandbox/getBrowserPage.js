const puppeteer = require('puppeteer');

async function getBrowserPage(port, path) {
  const browser = await puppeteer.launch({
    // TODO: Make this configurable
    headless: false,
  });
  const page = await browser.newPage();

  const url = `http://localhost:${port}${path}`;
  await page.goto(url);

  await page.evaluateOnNewDocument(() => {
    window.__REACT_REFRESH_RELOADED = true;

    if (window.__REACT_REFRESH_RELOAD_CB) {
      window.__REACT_REFRESH_RELOAD_CB();
    }
  });

  return page;
}

module.exports = getBrowserPage;
