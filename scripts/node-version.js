const semver = require('semver');

if (!semver.gte('17.0.0', process.versions.node)) {
  process.exitCode = 1;
}

process.exit();
