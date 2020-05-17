async function getPage(port, path) {
  const page = await browser.newPage();

  const url = `http://localhost:${port}${path}`;
  await page.goto(url);

  // This is evaluated when the current page have a new document,
  // which indicates a navigation or reload.
  // We'll have to signal the test runner that this has occurred,
  // whether it is expected or not.
  await page.evaluateOnNewDocument(() => {
    window.__REACT_REFRESH_RELOADED = true;

    if (typeof window.__REACT_REFRESH_RELOAD_CB === 'function') {
      window.__REACT_REFRESH_RELOAD_CB();
    }
  });

  return page;
}

module.exports = { getPage };
