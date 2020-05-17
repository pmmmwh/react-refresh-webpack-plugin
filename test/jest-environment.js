const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');

class SandboxEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEBUG__ = process.env.DEBUG === 'true';

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
