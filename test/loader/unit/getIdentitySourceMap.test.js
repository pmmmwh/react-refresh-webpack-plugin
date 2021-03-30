const { SourceMapConsumer } = require('source-map');
const validate = require('sourcemap-validator');
const getIdentitySourceMap = require('../../../loader/utils/getIdentitySourceMap');

describe('getIdentitySourceMap', () => {
  it('should generate valid source map with source equality', async () => {
    const source = "module.exports = 'Test'";
    const path = 'index.js';

    const identityMap = getIdentitySourceMap(source, path);
    expect(() => {
      validate(source, JSON.stringify(identityMap));
    }).not.toThrow();

    const sourceMapConsumer = await new SourceMapConsumer(identityMap);
    expect(sourceMapConsumer.sourceContentFor(path)).toBe(source);
  });
});
