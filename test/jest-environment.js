const { TestEnvironment: NodeEnvironment } = require('jest-environment-node');
const yn = require('yn');

class TestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEBUG__ = yn(process.env.DEBUG);
    this.global.WDS_VERSION = parseInt(process.env.WDS_VERSION || 5);
  }
}

module.exports = TestEnvironment;
