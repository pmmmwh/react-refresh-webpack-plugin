const { TestEnvironment: NodeEnvironment } = require('jest-environment-node');
const semver = require('semver');
const yn = require('yn');

class TestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEBUG__ = yn(process.env.DEBUG);
    this.global.WEBPACK_VERSION = parseInt(process.env.WEBPACK_VERSION || '5', 10);
    this.global.WDS_VERSION =
      semver.major(process.version) < 12
        ? 3
        : semver.major(process.version) < 18 || this.global.WEBPACK_VERSION === 4
          ? 4
          : 5;
  }
}

module.exports = TestEnvironment;
