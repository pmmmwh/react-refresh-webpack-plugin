const puppeteer = require('puppeteer');
const TestEnvironment = require('../jest-environment');

class SandboxEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();

    const wsEndpoint = process.env.PUPPETEER_WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error('Puppeteer wsEndpoint not found!');
    }

    this.global.browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  async teardown() {
    await super.teardown();

    if (this.global.browser) {
      await this.global.browser.disconnect();
    }
  }
}

module.exports = SandboxEnvironment;
