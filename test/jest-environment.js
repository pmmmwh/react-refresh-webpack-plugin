const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const semver = require('semver');
const yn = require('yn');

class SandboxEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEBUG__ = yn(process.env.DEBUG);
    this.global.WEBPACK_VERSION = parseInt(process.env.WEBPACK_VERSION || '5', 10);
    this.global.WDS_VERSION = this.resolveWdsVersion(semver.major(process.version));

    const wsEndpoint = process.env.PUPPETEER_WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error('Puppeteer wsEndpoint not found!');
    }

    this.global.browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  resolveWdsVersion(nodeVersion) {
    if (nodeVersion < 12) {
      return 3;
    } else if (nodeVersion < 18) {
      return 4;
    }

    return 5;
  }

  async teardown() {
    await super.teardown();

    if (this.global.browser) {
      await this.global.browser.disconnect();
    }
  }
}

module.exports = SandboxEnvironment;
