async function teardown() {
  if (global.__BROWSER_INSTANCE__) {
    await global.__BROWSER_INSTANCE__.close();
  }
}

module.exports = teardown;
