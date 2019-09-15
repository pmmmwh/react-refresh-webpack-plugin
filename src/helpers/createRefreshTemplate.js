const { Template } = require('webpack');

const beforeModule = `
var cleanup = function NoOp() {};

if (window && window.__RefreshModule) {
  cleanup = window.__RefreshModule(moduleId);
}

try {
`;

const afterModule = `
} finally {
  cleanup();
}
`;

/**
 * Creates a module wrapped by a refresh template.
 * @param {string} source The source code of a module.
 * @param {import('webpack').compilation.Chunk} chunk A webpack chunk.
 */
function createRefreshTemplate(source, chunk) {
  // If a chunk is injected with the plugin,
  // our custom entry musts be injected
  if (
    !chunk.entryModule ||
    !/ReactRefreshEntry/.test(chunk.entryModule._identifier || '')
  ) {
    return source;
  }

  const lines = source.split('\n');

  // Webpack generates this line whenever mainTemplate is called
  const moduleInitializationLineNumber = lines.findIndex(line =>
    line.startsWith('modules[moduleId].call')
  );

  return Template.asString([
    ...lines.slice(0, moduleInitializationLineNumber),
    beforeModule,
    Template.indent(lines[moduleInitializationLineNumber]),
    afterModule,
    ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
  ]);
}

module.exports = createRefreshTemplate;
