const getSandbox = require('../helpers/sandbox');

it('allows self invalidation', async () => {
  const [session] = await getSandbox({ pluginOptions: { acceptSelf: false } });

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    `
      require('./bar');
      module.exports = function Foo() {};
      module.hot.accept('./bar', () => window.log('accept ./bar'));
    `
  );
  await session.write(
    'bar.js',
    `window.log('init BarV1'); module.exports = function Bar() { return null; };`
  );
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  // Edited Bar doesn't self-accept
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV2'); module.exports = function Bar() { return null; };`
  );
  expect(session.logs).toStrictEqual(['accept ./bar']);
});
