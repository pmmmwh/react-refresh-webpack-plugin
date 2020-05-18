/**
 * Gets a new page from the current browser instance,
 * and initializes up testing-related lifecycles.
 * @param {number} port
 * @param {string} path
 * @return {Promise<import('puppeteer').Page>}
 */
async function getPage(port, path) {
  const page = await browser.newPage();

  const url = `http://localhost:${port}${path}`;
  await page.goto(url);

  // Initialize page session logging
  await page.evaluate(() => {
    window.logs = [];
  });

  // This is evaluated when the current page have a new document,
  // which indicates a navigation or reload.
  // We'll have to signal the test runner that this has occurred,
  // whether it is expected or not.
  await page.evaluateOnNewDocument(() => {
    window.logs = [];

    window.__REACT_REFRESH_RELOADED = true;

    if (typeof window.__REACT_REFRESH_RELOAD_CB === 'function') {
      window.__REACT_REFRESH_RELOAD_CB();
    }
  });

  return page;
}

module.exports = { getPage };
