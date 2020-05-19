const createSandbox = require('../sandbox');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L989-L1048
test('re-runs accepted modules', async () => {
  const [session] = await createSandbox();

  // Bootstrap test and reload session to not rely on auto-refresh semantics
  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write('foo.js', `window.logs.push('init FooV1'); require('./bar');`);
  await session.write(
    'bar.js',
    `window.logs.push('init BarV1'); module.exports = function Bar() { return null; };`
  );

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init FooV1', 'init BarV1']);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  await session.resetLogs();
  await session.patch(
    'bar.js',
    `window.logs.push('init BarV2'); module.exports = function Bar() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV2']);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  await session.resetLogs();
  await session.patch(
    'bar.js',
    `window.logs.push('init BarV3'); module.exports = function Bar() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV3']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1050-L1137
test('propagates a hot update to closest accepted module', async () => {
  const [session] = await createSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // Exporting a component marks it as auto-accepting.
    `window.logs.push('init FooV1'); require('./bar'); module.exports = function Foo() {};`
  );
  await session.write('bar.js', `window.logs.push('init BarV1');`);

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init FooV1', 'init BarV1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV2');`);
  await expect(session.logs).resolves.toEqual([
    // // FIXME: Metro order:
    // 'init BarV2',
    // 'init FooV1',
    'init FooV1',
    'init BarV2',
    // Webpack runs in this order because it evaluates modules parent down, not
    // child up. Parents will re-run child modules in the order that they're
    // imported from the parent.
  ]);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV3');`);
  await expect(session.logs).resolves.toEqual([
    // // FIXME: Metro order:
    // 'init BarV3',
    // 'init FooV1',
    'init FooV1',
    'init BarV3',
    // Webpack runs in this order because it evaluates modules parent down, not
    // child up. Parents will re-run child modules in the order that they're
    // imported from the parent.
  ]);

  // We edited Bar so that it accepts itself.
  // We still re-run Foo because the exports of Bar changed.
  await session.resetLogs();
  await session.patch(
    'bar.js',
    // Exporting a component marks it as auto-accepting.
    `window.logs.push('init BarV4'); module.exports = function Bar() {};`
  );
  await expect(session.logs).resolves.toEqual([
    // // FIXME: Metro order:
    // 'init BarV4',
    // 'init FooV1',
    'init FooV1',
    'init BarV4',
    // Webpack runs in this order because it evaluates modules parent down, not
    // child up. Parents will re-run child modules in the order that they're
    // imported from the parent.
  ]);

  // Further edits to Bar don't re-run Foo.
  await session.resetLogs();
  await session.patch(
    'bar.js',
    `window.logs.push('init BarV5'); module.exports = function Bar() {};`
  );
  await expect(session.logs).resolves.toEqual(['init BarV5']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1139-L1307
test('propagates hot update to all inverse dependencies', async () => {
  const [session] = await createSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  // This is the module graph:
  //         MiddleA*
  //     /              \
  // Root* - MiddleB* - Leaf
  //     \
  //        MiddleC
  //
  // * - accepts update
  //
  // We expect that editing Leaf will propagate to
  // MiddleA and MiddleB both of which can handle updates.

  await session.write(
    'root.js',
    `
    window.logs.push('init RootV1');

    require('./middleA');
    require('./middleB');
    require('./middleC');

    module.exports = function Root() {};
    `
  );
  await session.write(
    'middleA.js',
    `window.logs.push('init MiddleAV1'); require('./leaf'); module.exports = function MiddleA() {};`
  );
  await session.write(
    'middleB.js',
    `window.logs.push('init MiddleBV1'); require('./leaf'); module.exports = function MiddleB() {};
    `
  );
  // This one doesn't import leaf and also doesn't export a component,
  // so, it doesn't accept its own updates.
  await session.write('middleC.js', `window.logs.push('init MiddleCV1'); module.exports = {};`);
  // Doesn't accept its own updates; they will propagate.
  await session.write('leaf.js', `window.logs.push('init LeafV1'); module.exports = {};`);

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./root'); module.exports = function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual([
    'init RootV1',
    'init MiddleAV1',
    'init LeafV1',
    'init MiddleBV1',
    'init MiddleCV1',
  ]);

  // We edited Leaf, but it doesn't accept.
  // So we expect it to re-run together with MiddleA and MiddleB which do.
  await session.resetLogs();
  await session.patch('leaf.js', `window.logs.push('init LeafV2'); module.exports = {};`);
  await expect(session.logs).resolves.toEqual(['init MiddleAV1', 'init LeafV2', 'init MiddleBV1']);

  // Let's try the same one more time.
  await session.resetLogs();
  await session.patch('leaf.js', `window.logs.push('init LeafV3'); module.exports = {};`);
  await expect(session.logs).resolves.toEqual(['init MiddleAV1', 'init LeafV3', 'init MiddleBV1']);

  // Now edit MiddleB. It should accept and re-run alone.
  await session.resetLogs();
  await session.patch(
    'middleB.js',
    `window.logs.push('init MiddleBV2'); require('./leaf'); module.exports = function MiddleB() {};
    `
  );
  await expect(session.logs).resolves.toEqual(['init MiddleBV2']);

  // Finally, edit MiddleC. It didn't accept so it should bubble to Root.
  await session.resetLogs();
  await session.patch('middleC.js', `window.logs.push('init MiddleCV2'); module.exports = {};`);
  await expect(session.logs).resolves.toEqual(['init RootV1', 'init MiddleCV2']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1309-L1406
test('runs dependencies before dependents', async () => {
  const [session] = await createSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  // This is the module graph:
  //        MiddleA* ----
  //     /      |         \
  // Root    MiddleB ----- Leaf
  //
  // * - refresh boundary (exports a component)
  //
  // We expect that editing Leaf will propagate to
  // MiddleA which is a Refresh Boundary.
  //
  // However, it's essential that code for MiddleB executes *before* MiddleA on updates.

  await session.write(
    'root.js',
    `window.logs.push('init RootV1'); require('./middleA'); module.exports = function Root() {};`
  );
  await session.write(
    'middleA.js',
    `window.logs.push('init MiddleAV1');
     const Leaf = require('./leaf');
     const MiddleB = require('./middleB');
     module.exports = function MiddleA() {
       return Leaf * MiddleB;
     };`
  );
  await session.write(
    'middleB.js',
    `window.logs.push('init MiddleBV1'); const Leaf = require('./leaf'); module.exports = Leaf;`
  );
  await session.write(
    'leaf.js',
    // Doesn't accept its own updates; they will propagate.
    `window.logs.push('init LeafV1'); module.exports = 2;`
  );

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./root'); module.exports = function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual([
    'init RootV1',
    'init MiddleAV1',
    'init LeafV1',
    'init MiddleBV1',
  ]);

  await session.resetLogs();
  await session.patch('leaf.js', `window.logs.push('init LeafV2'); module.exports = 3;`);
  await expect(session.logs).resolves.toEqual(['init MiddleAV1', 'init LeafV2', 'init MiddleBV1']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1408-L1498
test('provides fresh value for module.exports in parents', async () => {
  const [session] = await createSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `const BarValue = require('./bar');
     window.logs.push('init FooV1 with BarValue = ' + BarValue);
     module.exports = function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.logs.push('init BarV1'); module.exports = 1;`
  );

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV2'); module.exports = 2;`);
  await expect(session.logs).resolves.toEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV3'); module.exports = 3;`);
  await expect(session.logs).resolves.toEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  await session.resetLogs();
  await session.patch(
    'foo.js',
    `const BarValue = require('./bar');
     window.logs.push('init FooV2 with BarValue = ' + BarValue);
     module.exports = function Foo() {};`
  );
  await expect(session.logs).resolves.toEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV4'); module.exports = 4;`);
  await expect(session.logs).resolves.toEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1500-L1590
test('provides fresh value for exports.* in parents', async () => {
  const [session] = await createSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `
    const BarValue = require('./bar').value;
    window.logs.push('init FooV1 with BarValue = ' + BarValue);
    exports.Foo = function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.logs.push('init BarV1'); exports.value = 1;`
  );

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV2'); exports.value = 2;`);
  await expect(session.logs).resolves.toEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV3'); exports.value = 3;`);
  await expect(session.logs).resolves.toEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  await session.resetLogs();
  await session.patch(
    'foo.js',
    `
    const BarValue = require('./bar').value;
    window.logs.push('init FooV2 with BarValue = ' + BarValue);
    exports.Foo = function Foo() {};`
  );
  await expect(session.logs).resolves.toEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV4'); exports.value = 4;`);
  await expect(session.logs).resolves.toEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1592-L1688
test('provides fresh value for ES6 named import in parents', async () => {
  const [session] = await createSandbox();

  await session.write('index.js', `export default function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `
    import { value as BarValue } from './bar';
    window.logs.push('init FooV1 with BarValue = ' + BarValue);
    export function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.logs.push('init BarV1'); export const value = 1;`
  );

  await session.resetLogs();
  await session.patch(
    'index.js',
    `import './foo'; export default function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV2'); export const value = 2;`);
  await expect(session.logs).resolves.toEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV3'); export const value = 3;`);
  await expect(session.logs).resolves.toEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  await session.resetLogs();
  await session.patch(
    'foo.js',
    `
    import { value as BarValue } from './bar';
    window.logs.push('init FooV2 with BarValue = ' + BarValue);
    export function Foo() {};`
  );
  await expect(session.logs).resolves.toEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV4'); export const value = 4;`);
  await expect(session.logs).resolves.toEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1690-L1786
test('provides fresh value for ES6 default import in parents', async () => {
  const [session] = await createSandbox();

  await session.write('index.js', `export default function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `
    import BarValue from './bar';
    window.logs.push('init FooV1 with BarValue = ' + BarValue);
    export default function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.logs.push('init BarV1'); export default 1;`
  );

  await session.resetLogs();
  await session.patch(
    'index.js',
    `import './foo'; export default function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV2'); export default 2;`);
  await expect(session.logs).resolves.toEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV3'); export default 3;`);
  await expect(session.logs).resolves.toEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  await session.resetLogs();
  await session.patch(
    'foo.js',
    `
    import BarValue from './bar';
    window.logs.push('init FooV2 with BarValue = ' + BarValue);
    export default function Foo() {};`
  );
  await expect(session.logs).resolves.toEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV4'); export default 4;`);
  await expect(session.logs).resolves.toEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1788-L1899
test.todo('stops update propagation after module-level errors');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1901-L2010
test.todo('can continue hot updates after module-level errors with module.exports');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2012-L2123
test.todo('can continue hot updates after module-level errors with ES6 exports');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2125-L2233
test.todo('does not accumulate stale exports over time');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2235-L2279
test.todo('bails out if update bubbles to the root via the only path');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2281-L2371
test.todo('bails out if the update bubbles to the root via one of the paths');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2373-L2472
test('propagates a module that stops accepting in next version', async () => {
  const [session] = await createSandbox();

  // Accept in parent
  await session.write(
    'foo.js',
    `window.logs.push('init FooV1'); require('./bar'); module.exports = function Foo() {};`
  );
  // Accept in child
  await session.write(
    'bar.js',
    `window.logs.push('init BarV1'); module.exports = function Bar() {};`
  );

  await session.patch('index.js', `require('./foo'); module.exports = () => null;`);
  await expect(session.logs).resolves.toEqual(['init FooV1', 'init BarV1']);

  // Because root will not except,
  // we need to reload the session to make sure the app is in an updated state.
  await session.reload();

  // Verify the child can accept itself
  await session.resetLogs();
  await session.patch(
    'bar.js',
    `window.logs.push('init BarV1.1'); module.exports = function Bar() {};`
  );
  await expect(session.logs).resolves.toEqual(['init BarV1.1']);

  // Now let's change the child to *not* accept itself.
  // We'll expect that now the parent will handle the evaluation.
  await session.resetLogs();
  await session.patch('bar.js', `window.logs.push('init BarV2');`);
  // We re-run Bar and expect to stop there.
  // However, it didn't export a component, so we go higher.
  // We stop at Foo which currently _does_ export a component.
  await expect(session.logs).resolves.toEqual(
    // Bar is evaluated twice:
    // 1. To invalidate itself once it realizes it's no longer acceptable.
    // 2. As a child of Foo re-evaluating.
    ['init BarV2', 'init FooV1', 'init BarV2']
  );

  // Change it back so that the child accepts itself.
  await session.resetLogs();
  await session.patch(
    'bar.js',
    `window.logs.push('init BarV2'); module.exports = function Bar() {};`
  );
  // Since the export list changed, we have to re-run both the parent and the child.
  await expect(session.logs).resolves.toEqual(['init FooV1', 'init BarV2']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(false);

  // Editing the child alone now doesn't reevaluate the parent.
  await session.resetLogs();
  await session.patch(
    'bar.js',
    `window.logs.push('init BarV3'); module.exports = function Bar() {};`
  );
  await expect(session.logs).resolves.toEqual(['init BarV3']);

  // Finally, edit the parent in a way that changes the export.
  // It would still be accepted on its own -
  // but it's incompatible with the past version which didn't have two exports.
  await session.evaluate(() => window.localStorage.setItem('init', ''));
  await session.patch(
    'foo.js',
    `
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('init', 'init FooV2')
    }
    exports.Foo = function Foo() {};
    exports.FooFoo = function FooFoo() {};`
  );

  // Check that we attempted to evaluate, but had to fall back to full refresh.
  await expect(session.evaluate(() => window.localStorage.getItem('init'))).resolves.toEqual(
    'init FooV2'
  );

  // TODO:
  // expect(Refresh.performFullRefresh).toHaveBeenCalled();
  // expect(Refresh.performReactRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(true);
});
