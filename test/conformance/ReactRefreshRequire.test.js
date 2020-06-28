const getSandbox = require('../helpers/sandbox');

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1028-L1087
it('re-runs accepted modules', async () => {
  const [session] = await getSandbox();

  // Bootstrap test and reload session to not rely on auto-refresh semantics
  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write('foo.js', `window.log('init FooV1'); require('./bar');`);
  await session.write(
    'bar.js',
    `window.log('init BarV1'); module.exports = function Bar() { return null; };`
  );

  session.resetState();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init FooV1', 'init BarV1']);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV2'); module.exports = function Bar() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV2']);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV3'); module.exports = function Bar() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV3']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1089-L1176
it('propagates a hot update to closest accepted module', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // Exporting a component marks it as auto-accepting.
    `window.log('init FooV1'); require('./bar'); module.exports = function Foo() {};`
  );
  await session.write('bar.js', `window.log('init BarV1');`);

  session.resetState();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init FooV1', 'init BarV1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2');`);
  expect(session.logs).toStrictEqual([
    // FIXME: Metro order:
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
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV3');`);
  expect(session.logs).toStrictEqual([
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
  session.resetState();
  await session.patch(
    'bar.js',
    // Exporting a component marks it as auto-accepting.
    `window.log('init BarV4'); module.exports = function Bar() {};`
  );
  expect(session.logs).toStrictEqual([
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
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV5'); module.exports = function Bar() {};`);
  expect(session.logs).toStrictEqual(['init BarV5']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1178-L1346
it('propagates hot update to all inverse dependencies', async () => {
  const [session] = await getSandbox();

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
    window.log('init RootV1');

    require('./middleA');
    require('./middleB');
    require('./middleC');

    module.exports = function Root() {};
    `
  );
  await session.write(
    'middleA.js',
    `window.log('init MiddleAV1'); require('./leaf'); module.exports = function MiddleA() {};`
  );
  await session.write(
    'middleB.js',
    `window.log('init MiddleBV1'); require('./leaf'); module.exports = function MiddleB() {};
    `
  );
  // This one doesn't import leaf and also doesn't export a component,
  // so, it doesn't accept its own updates.
  await session.write('middleC.js', `window.log('init MiddleCV1'); module.exports = {};`);
  // Doesn't accept its own updates; they will propagate.
  await session.write('leaf.js', `window.log('init LeafV1'); module.exports = {};`);

  session.resetState();
  await session.patch(
    'index.js',
    `require('./root'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual([
    'init RootV1',
    'init MiddleAV1',
    'init LeafV1',
    'init MiddleBV1',
    'init MiddleCV1',
  ]);

  // We edited Leaf, but it doesn't accept.
  // So we expect it to re-run together with MiddleA and MiddleB which do.
  session.resetState();
  await session.patch('leaf.js', `window.log('init LeafV2'); module.exports = {};`);
  expect(session.logs).toStrictEqual(['init MiddleAV1', 'init LeafV2', 'init MiddleBV1']);

  // Let's try the same one more time.
  session.resetState();
  await session.patch('leaf.js', `window.log('init LeafV3'); module.exports = {};`);
  expect(session.logs).toStrictEqual(['init MiddleAV1', 'init LeafV3', 'init MiddleBV1']);

  // Now edit MiddleB. It should accept and re-run alone.
  session.resetState();
  await session.patch(
    'middleB.js',
    `window.log('init MiddleBV2'); require('./leaf'); module.exports = function MiddleB() {};
    `
  );
  expect(session.logs).toStrictEqual(['init MiddleBV2']);

  // Finally, edit MiddleC. It didn't accept so it should bubble to Root.
  session.resetState();
  await session.patch('middleC.js', `window.log('init MiddleCV2'); module.exports = {};`);
  expect(session.logs).toStrictEqual(['init RootV1', 'init MiddleCV2']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1348-L1445
it('runs dependencies before dependents', async () => {
  const [session] = await getSandbox();

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
    `window.log('init RootV1'); require('./middleA'); module.exports = function Root() {};`
  );
  await session.write(
    'middleA.js',
    `window.log('init MiddleAV1');
     const Leaf = require('./leaf');
     const MiddleB = require('./middleB');
     module.exports = function MiddleA() {
       return Leaf * MiddleB;
     };`
  );
  await session.write(
    'middleB.js',
    `window.log('init MiddleBV1'); const Leaf = require('./leaf'); module.exports = Leaf;`
  );
  await session.write(
    'leaf.js',
    // Doesn't accept its own updates; they will propagate.
    `window.log('init LeafV1'); module.exports = 2;`
  );

  session.resetState();
  await session.patch(
    'index.js',
    `require('./root'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual([
    'init RootV1',
    'init MiddleAV1',
    'init LeafV1',
    'init MiddleBV1',
  ]);

  session.resetState();
  await session.patch('leaf.js', `window.log('init LeafV2'); module.exports = 3;`);
  expect(session.logs).toStrictEqual(['init MiddleAV1', 'init LeafV2', 'init MiddleBV1']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1447-L1537
it('provides fresh value for module.exports in parents', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `const BarValue = require('./bar');
     window.log('init FooV1 with BarValue = ' + BarValue);
     module.exports = function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.log('init BarV1'); module.exports = 1;`
  );

  session.resetState();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2'); module.exports = 2;`);
  expect(session.logs).toStrictEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV3'); module.exports = 3;`);
  expect(session.logs).toStrictEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  session.resetState();
  await session.patch(
    'foo.js',
    `const BarValue = require('./bar');
     window.log('init FooV2 with BarValue = ' + BarValue);
     module.exports = function Foo() {};`
  );
  expect(session.logs).toStrictEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV4'); module.exports = 4;`);
  expect(session.logs).toStrictEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1539-L1629
it('provides fresh value for exports.* in parents', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `
    const BarValue = require('./bar').value;
    window.log('init FooV1 with BarValue = ' + BarValue);
    exports.Foo = function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.log('init BarV1'); exports.value = 1;`
  );

  session.resetState();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2'); exports.value = 2;`);
  expect(session.logs).toStrictEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV3'); exports.value = 3;`);
  expect(session.logs).toStrictEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  session.resetState();
  await session.patch(
    'foo.js',
    `
    const BarValue = require('./bar').value;
    window.log('init FooV2 with BarValue = ' + BarValue);
    exports.Foo = function Foo() {};`
  );
  expect(session.logs).toStrictEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV4'); exports.value = 4;`);
  expect(session.logs).toStrictEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1631-L1727
it('provides fresh value for ES6 named import in parents', async () => {
  const [session] = await getSandbox();

  await session.write('root.js', `export default function Noop() { return null; };`);
  await session.write('index.js', `import Root from './root'; Root();`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `
    import { value as BarValue } from './bar';
    window.log('init FooV1 with BarValue = ' + BarValue);
    export function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.log('init BarV1'); export const value = 1;`
  );

  session.resetState();
  await session.patch(
    'root.js',
    `import './foo'; export default function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2'); export const value = 2;`);
  expect(session.logs).toStrictEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV3'); export const value = 3;`);
  expect(session.logs).toStrictEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  session.resetState();
  await session.patch(
    'foo.js',
    `
    import { value as BarValue } from './bar';
    window.log('init FooV2 with BarValue = ' + BarValue);
    export function Foo() {};`
  );
  expect(session.logs).toStrictEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV4'); export const value = 4;`);
  expect(session.logs).toStrictEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1729-L1825
it('provides fresh value for ES6 default import in parents', async () => {
  const [session] = await getSandbox();

  await session.write('root.js', `export default function Noop() { return null; };`);
  await session.write('index.js', `import Root from './root'; Root();`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `
    import BarValue from './bar';
    window.log('init FooV1 with BarValue = ' + BarValue);
    export default function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.log('init BarV1'); export default 1;`
  );

  session.resetState();
  await session.patch(
    'root.js',
    `import './foo'; export default function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1 with BarValue = 1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2'); export default 2;`);
  expect(session.logs).toStrictEqual(['init BarV2', 'init FooV1 with BarValue = 2']);

  // Let's try this again
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV3'); export default 3;`);
  expect(session.logs).toStrictEqual(['init BarV3', 'init FooV1 with BarValue = 3']);

  // Now let's edit the parent which accepts itself
  session.resetState();
  await session.patch(
    'foo.js',
    `
    import BarValue from './bar';
    window.log('init FooV2 with BarValue = ' + BarValue);
    export default function Foo() {};`
  );
  expect(session.logs).toStrictEqual(['init FooV2 with BarValue = 3']);

  // Verify editing the child didn't break after parent update
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV4'); export default 4;`);
  expect(session.logs).toStrictEqual(['init BarV4', 'init FooV2 with BarValue = 4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// Currently, webpack does not stop propagation after errors,
// but rather stops execution in parent after the errored module.
// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1827-L1938
it('stops execution after module-level errors', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    `const Bar = require('./bar');
     window.log('init FooV1');
     module.exports = function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module normally propagates to the parent.
    `module.exports = 'V1'; window.log('init BarV1');`
  );

  session.resetState();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1']);
  expect(session.errors).toHaveLength(0);

  // We only edited Bar.
  // Normally it would propagate to the parent.
  // But the error should stop the execution early.
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV2'); module.exports = 'V2'; throw new Error('init error during BarV2');`
  );
  expect(session.logs).toStrictEqual(['init BarV2']);
  expect(session.errors).toHaveLength(1);
  expect(session.errors[0]).toStrictEqual('init error during BarV2');

  // Let's make another error.
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV3'); throw new Error('init error during BarV3');`
  );
  expect(session.logs).toStrictEqual(['init BarV3']);
  expect(session.errors).toHaveLength(1);
  expect(session.errors[0]).toStrictEqual('init error during BarV3');

  // Finally, let's fix the code.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV4'); module.exports = 'V4';`);
  expect(session.logs).toStrictEqual(['init BarV4', 'init FooV1']);
  expect(session.errors).toHaveLength(0);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1940-L2049
it('can continue hot updates after module-level errors with module.exports', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write('foo.js', `require('./bar'); window.log('init FooV1');`);
  await session.write(
    'bar.js',
    // This module accepts itself
    `window.log('init BarV1'); module.exports = function Bar() {};`
  );

  session.resetState();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1']);
  expect(session.errors).toHaveLength(0);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV2'); module.exports = function Bar() {}; throw new Error('init error during BarV2');`
  );
  expect(session.logs).toStrictEqual(['init BarV2']);
  expect(session.errors).toHaveLength(1);
  expect(session.errors[0]).toBe('init error during BarV2');

  // Let's fix the code.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV4'); module.exports = function Bar() {};`);
  expect(session.logs).toStrictEqual(['init BarV4']);
  expect(session.errors).toHaveLength(0);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2051-L2162
it('can continue hot updates after module-level errors with ES6 exports', async () => {
  const [session] = await getSandbox();

  await session.write('root.js', `export default function Noop() { return null; };`);
  await session.write('index.js', `import Root from './root'; Root();`);
  await session.reload();

  await session.write('foo.js', `import Bar from './bar'; Bar(); window.log('init FooV1');`);
  await session.write(
    'bar.js',
    // This module accepts itself
    `window.log('init BarV1'); export default function Bar() {};`
  );

  session.resetState();
  await session.patch(
    'root.js',
    `import './foo'; export default function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1']);
  expect(session.errors).toHaveLength(0);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV2'); export default function Bar() {}; throw new Error('init error during BarV2');`
  );
  expect(session.logs).toStrictEqual(['init BarV2']);
  expect(session.errors).toHaveLength(1);
  expect(session.errors[0]).toBe('init error during BarV2');

  // Let's fix the code.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV3'); export default function Bar() {};`);
  expect(session.logs).toStrictEqual(['init BarV3']);
  expect(session.errors).toHaveLength(0);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2164-L2272
it('does not accumulate stale exports over time', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    // This module accepts itself
    `const BarExports = require('./bar');
     window.log('init FooV1 with BarExports = ' + JSON.stringify(BarExports));
     module.exports = function Foo() {};`
  );
  await session.write(
    'bar.js',
    // This module will propagate to the parent
    `window.log('init BarV1'); exports.a = 1; exports.b = 2;`
  );

  session.resetState();
  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV1', 'init FooV1 with BarExports = {"a":1,"b":2}']);

  session.resetState();
  await session.patch(
    'bar.js',
    // These are completely different exports
    `window.log('init BarV2'); exports.c = 3; exports.d = 4;`
  );
  // Make sure we don't see {a, b} anymore.
  expect(session.logs).toStrictEqual(['init BarV2', 'init FooV1 with BarExports = {"c":3,"d":4}']);

  // Also edit the parent and verify the same again
  session.resetState();
  await session.patch(
    'foo.js',
    `const BarExports = require('./bar');
     window.log('init FooV2 with BarExports = ' + JSON.stringify(BarExports));
     module.exports = function Foo() {};`
  );
  expect(session.logs).toStrictEqual(['init FooV2 with BarExports = {"c":3,"d":4}']);

  // Temporarily crash the child.
  session.resetState();
  await session.patch('bar.js', `throw new Error('oh no');`);
  expect(session.logs).toStrictEqual([]);

  // Try one last time to edit the child.
  session.resetState();
  await session.patch(
    'bar.js',
    // These are completely different exports
    `window.log('init BarV3'); exports.e = 5; exports.f = 6;`
  );
  expect(session.logs).toStrictEqual(['init BarV3', 'init FooV2 with BarExports = {"e":5,"f":6}']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2274-L2318
it('bails out if update bubbles to the root via the only path', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = () => null;`);
  await session.reload();

  await session.write('foo.js', `window.log('init FooV1'); require('./bar');`);
  await session.write('bar.js', `window.log('init BarV1');`);

  session.resetState();
  await session.patch('index.js', `require('./foo'); module.exports = () => null;`);
  expect(session.logs).toStrictEqual(['init FooV1', 'init BarV1']);

  // Because root will not except,
  // we need to reload the session to make sure the app is in an updated state.
  await session.reload();

  // Neither Bar nor Foo accepted, so update reached the root.
  session.resetState();
  await session.patch(
    'bar.js',
    `if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('init', 'init BarV2');
    }`
  );
  await expect(session.evaluate(() => window.localStorage.getItem('init'))).resolves.toEqual(
    'init BarV2'
  );

  // Expect full refresh.
  // TODO:
  // expect(Refresh.performReactRefresh).not.toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(true);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2320-L2410
it('bails out if the update bubbles to the root via one of the paths', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = () => null;`);
  await session.reload();

  await session.write('foo.js', `window.log('init FooV1'); require('./bar'); require('./baz');`);
  await session.write(
    'bar.js',
    // This module accepts itself
    `window.log('init BarV1'); require('./qux'); module.exports = function Bar() {};`
  );
  await session.write(
    'baz.js',
    // This one doesn't accept itself,
    // causing updates to Qux to bubble through the root.
    `window.log('init BazV1'); require('./qux');`
  );
  await session.write(
    'qux.js',
    // Doesn't accept itself, and only one its parent path accepts.
    `window.log('init QuxV1');`
  );

  session.resetState();
  await session.patch('index.js', `require('./foo'); module.exports = () => null;`);
  expect(session.logs).toStrictEqual(['init FooV1', 'init BarV1', 'init QuxV1', 'init BazV1']);

  // Because root will not except,
  // we need to reload the session to make sure the app is in an updated state.
  await session.reload();

  // Edit Bar. It should self-accept.
  session.resetState();
  await session.patch(
    'bar.js',
    `window.log('init BarV2'); require('./qux'); module.exports = function Bar() {};`
  );
  expect(session.logs).toStrictEqual(['init BarV2']);

  // TODO:
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(false);

  // Edit Qux. It should bubble. Baz accepts the update, Bar won't.
  // So this update should bubble through the root.
  session.resetState();
  await session.patch(
    'qux.js',
    `if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('init', 'init QuxV2');
    }`
  );
  await expect(session.evaluate(() => window.localStorage.getItem('init'))).resolves.toEqual(
    'init QuxV2'
  );

  // Expect full refresh.
  // TODO:
  // expect(Refresh.performReactRefresh).not.toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(true);
});

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2412-L2511
it('propagates a module that stops accepting in next version', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = () => null;`);
  await session.reload();

  // Accept in parent
  await session.write(
    'foo.js',
    `window.log('init FooV1'); require('./bar'); module.exports = function Foo() {};`
  );
  // Accept in child
  await session.write('bar.js', `window.log('init BarV1'); module.exports = function Bar() {};`);

  await session.patch('index.js', `require('./foo'); module.exports = () => null;`);
  expect(session.logs).toStrictEqual(['init FooV1', 'init BarV1']);

  // Because root will not except,
  // we need to reload the session to make sure the app is in an updated state.
  await session.reload();

  // Verify the child can accept itself
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV1.1'); module.exports = function Bar() {};`);
  expect(session.logs).toStrictEqual(['init BarV1.1']);

  // Now let's change the child to *not* accept itself.
  // We'll expect that now the parent will handle the evaluation.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2');`);
  // We re-run Bar and expect to stop there.
  // However, it didn't export a component, so we go higher.
  // We stop at Foo which currently _does_ export a component.
  expect(session.logs).toStrictEqual(
    // Bar is evaluated twice:
    // 1. To invalidate itself once it realizes it's no longer acceptable.
    // 2. As a child of Foo re-evaluating.
    ['init BarV2', 'init FooV1', 'init BarV2']
  );

  // Change it back so that the child accepts itself.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2'); module.exports = function Bar() {};`);
  // Since the export list changed, we have to re-run both the parent and the child.
  expect(session.logs).toStrictEqual(['init FooV1', 'init BarV2']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(session.didFullRefresh).toBe(false);

  // Editing the child alone now doesn't reevaluate the parent.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV3'); module.exports = function Bar() {};`);
  expect(session.logs).toStrictEqual(['init BarV3']);

  // Finally, edit the parent in a way that changes the export.
  // It would still be accepted on its own -
  // but it's incompatible with the past version which didn't have two exports.
  await session.evaluate(() => window.localStorage.setItem('init', ''));
  await session.patch(
    'foo.js',
    `
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('init', 'init FooV2');
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

// https://github.com/facebook/metro/blob/c083da2a9465ef53f10ded04bb7c0b748c8b90cb/packages/metro/src/lib/polyfills/__tests__/require-test.js#L2513-L2562
it('can replace a module before it is loaded', async () => {
  const [session] = await getSandbox();

  await session.write('index.js', `module.exports = function Noop() { return null; };`);
  await session.reload();

  await session.write(
    'foo.js',
    `window.log('init FooV1'); exports.loadBar = function () { require('./bar'); };`
  );
  await session.write('bar.js', `window.log('init BarV1');`);

  await session.patch(
    'index.js',
    `require('./foo'); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init FooV1']);

  // Replace Bar before it is loaded.
  session.resetState();
  await session.patch('bar.js', `window.log('init BarV2');`);
  expect(session.logs).toStrictEqual([]);

  // Now force Bar to load. It should use the latest version.
  await session.patch(
    'index.js',
    `const { loadBar } = require('./foo'); loadBar(); module.exports = function Noop() { return null; };`
  );
  expect(session.logs).toStrictEqual(['init BarV2']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
  expect(session.didFullRefresh).toBe(false);
});
