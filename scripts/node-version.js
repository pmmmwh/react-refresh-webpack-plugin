const semver = require('semver');

if (semver.lt(process.versions.node, '18.12.0')) {
  process.exitCode = 1;
}

process.exit();
