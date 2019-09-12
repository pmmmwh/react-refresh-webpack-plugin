import { compilation, Template } from 'webpack';

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

function createRefreshTemplate(source: string, chunk: compilation.Chunk) {
  // If a chunk is injected with the plugin,
  // our custom entry musts be injected
  if (
    !chunk.entryModule ||
    !/ReactRefreshEntry/.test(chunk.entryModule._identifier!)
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

export default createRefreshTemplate;
