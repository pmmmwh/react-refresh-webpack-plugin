const semver = require('semver');

if (semver.lt(process.versions.node, '17.0.0')) {
  process.exitCode = 1;
}

process.exit();
