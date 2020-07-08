const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const yn = require('yn');

class SandboxEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEBUG__ = yn(process.env.DEBUG);
    this.global.WEBPACK_VERSION = parseInt(process.env.WEBPACK_VERSION || '4', 10);

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
