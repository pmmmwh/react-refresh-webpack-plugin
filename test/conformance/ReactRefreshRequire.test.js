const createSandbox = require('../sandbox');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L989-L1048
test('re-runs accepted modules', async () => {
  const [session] = await createSandbox();

  await session.patch('./index.js', `export default function Noop() { return null; };`);

  await session.write('./foo.js', `window.logs.push('init FooV1'); require('./bar');`);
  await session.write(
    './bar.js',
    `window.logs.push('init BarV1'); export default function Bar() { return null; };`
  );

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./foo'); export default function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init FooV1', 'init BarV1']);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  await session.resetLogs();
  await session.patch(
    './bar.js',
    `window.logs.push('init BarV2'); export default function Bar() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV2']);

  // We only edited Bar, and it accepted.
  // So we expect it to re-run alone.
  await session.resetLogs();
  await session.patch(
    './bar.js',
    `window.logs.push('init BarV3'); export default function Bar() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init BarV3']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1050-L1137
test('propagates a hot update to closest accepted module', async () => {
  const [session] = await createSandbox();

  await session.patch('index.js', `export default function Noop() { return null; };`);

  await session.write(
    './foo.js',
    // Exporting a component marks it as auto-accepting.
    `window.logs.push('init FooV1'); require('./bar'); export default function Foo() {};`
  );
  await session.write('./bar.js', `window.logs.push('init BarV1');`);

  await session.resetLogs();
  await session.patch(
    'index.js',
    `require('./foo'); export default function Noop() { return null; };`
  );
  await expect(session.logs).resolves.toEqual(['init FooV1', 'init BarV1']);

  // We edited Bar, but it doesn't accept.
  // So we expect it to re-run together with Foo which does.
  await session.resetLogs();
  await session.patch('./bar.js', `window.logs.push('init BarV2');`);
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
  await session.patch('./bar.js', `window.logs.push('init BarV3');`);
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
    './bar.js',
    // Exporting a component marks it as auto-accepting.
    `window.logs.push('init BarV3'); export default function Bar() {};`
  );
  expect(await session.evaluate(() => window.logs)).toEqual([
    // // FIXME: Metro order:
    // 'init BarV3',
    // 'init FooV1',
    'init FooV1',
    'init BarV3',
    // Webpack runs in this order because it evaluates modules parent down, not
    // child up. Parents will re-run child modules in the order that they're
    // imported from the parent.
  ]);

  // Further edits to Bar don't re-run Foo.
  await session.evaluate(() => (window.logs = []));
  await session.patch(
    './bar.js',
    `
    window.logs.push('init BarV4');
    export default function Bar() {};
    `
  );
  await expect(session.logs).resolves.toEqual(['init BarV4']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1139-L1307
test('propagates hot update to all inverse dependencies', async () => {
  const [session] = await createSandbox();

  await session.patch('index.js', `export default function Noop() { return null; };`);

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

    import './middleA';
    import './middleB';
    import './middleC';

    export default function Root() {};
    `
  );
  await session.write(
    'middleA.js',
    `
    window.logs.push('init MiddleAV1');

    import './leaf';

    export default function MiddleA() {};
    `
  );
  await session.write(
    'middleB.js',
    `
    window.logs.push('init MiddleBV1');

    import './leaf';

    export default function MiddleB() {};
    `
  );
  // This one doesn't import leaf and also doesn't export a component,
  // so, it doesn't accept its own updates.
  await session.write('middleC.js', `window.logs.push('init MiddleCV1'); export default {};`);
  // Doesn't accept its own updates; they will propagate.
  await session.write('leaf.js', `window.logs.push('init LeafV1'); export default {};`);

  await session.patch(
    'index.js',
    `require('./root'); export default function Noop() { return null; };`
  );

  await expect(session.logs).resolves.toEqual([
    'init LeafV1',
    'init MiddleAV1',
    'init MiddleBV1',
    'init MiddleCV1',
    'init RootV1',
  ]);

  // We edited Leaf, but it doesn't accept.
  // So we expect it to re-run together with MiddleA and MiddleB which do.
  await session.resetLogs();
  await session.patch('leaf.js', `window.logs.push('init LeafV2'); export default {};`);
  await expect(session.logs).resolves.toEqual(['init LeafV2', 'init MiddleAV1', 'init MiddleBV1']);

  // Let's try the same one more time.
  await session.resetLogs();
  await session.patch('leaf.js', `window.logs.push('init LeafV3'); export default {};`);
  await expect(session.logs).resolves.toEqual(['init LeafV3', 'init MiddleAV1', 'init MiddleBV1']);

  // Now edit MiddleB. It should accept and re-run alone.
  await session.resetLogs();
  await session.patch(
    'middleB.js',
    `
    window.logs.push('init MiddleBV2');

    import './leaf';

    export default function MiddleB() {};
    `
  );
  await expect(session.logs).resolves.toEqual(['init MiddleBV2']);

  // Finally, edit MiddleC. It didn't accept so it should bubble to Root.
  await session.resetLogs();
  await session.patch('middleC.js', `window.logs.push('init MiddleCV2'); export default {};`);
  await expect(session.logs).resolves.toEqual(['init MiddleCV2', 'init RootV1']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled()
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled()
});

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1309-L1406
test.todo('runs dependencies before dependents');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1408-L1498
test.todo('provides fresh value for module.exports in parents');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1500-L1590
test.todo('provides fresh value for exports.* in parents');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1592-L1688
test.todo('provides fresh value for ES6 named import in parents');

// https://github.com/facebook/metro/blob/b651e535cd0fc5df6c0803b9aa647d664cb9a6c3/packages/metro/src/lib/polyfills/__tests__/require-test.js#L1690-L1786
test.todo('provides fresh value for ES6 default import in parents');

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
// FIXME: Enable this test in #89
test.skip('propagates a module that stops accepting in next version', async () => {
  const [session] = await createSandbox();

  // Accept in parent
  await session.write(
    './foo.js',
    `window.logs.push('init FooV1'); import './bar'; export default function Foo() {};`
  );
  // Accept in child
  await session.write(
    './bar.js',
    `window.logs.push('init BarV1'); export default function Bar() {};`
  );

  await session.patch('index.js', `require('./foo'); export default () => null;`);
  await expect(session.logs).resolves.toEqual(['init BarV1', 'init FooV1']);

  // Verify the child can accept itself
  let didFullRefresh = false;
  await session.resetLogs();
  didFullRefresh =
    didFullRefresh ||
    !(await session.patch(
      './bar.js',
      `window.logs.push('init BarV1.1'); export default function Bar() {};`
    ));
  await expect(session.logs).resolves.toEqual(['init BarV1.1']);

  // Now let's change the child to *not* accept itself.
  // We'll expect that now the parent will handle the evaluation.
  await session.resetLogs();
  didFullRefresh =
    didFullRefresh ||
    !(await session.patch(
      './bar.js',
      // It's important we still export _something_, otherwise webpack will
      // also emit an extra update to the parent module. This happens because
      // webpack converts the module from ESM to CJS, which means the parent
      // module must update how it "imports" the module (drops interop code).
      // TODO: propose Webpack to interrupt the current update phase when `module.hot.invalidate()` is called.
      `window.logs.push('init BarV2'); export {};`
    ));
  // We re-run Bar and expect to stop there. However,
  // it didn't export a component, so we go higher.
  // We stop at Foo which currently _does_ export a component.
  await expect(session.logs).resolves.toEqual([
    // Bar is evaluated twice:
    // 1. To invalidate itself once it realizes it's no longer acceptable.
    // 2. As a child of Foo re-evaluating.
    'init BarV2',
    'init BarV2',
    'init FooV1',
  ]);

  // Change it back so that the child accepts itself.
  await session.resetLogs();
  didFullRefresh =
    didFullRefresh ||
    !(await session.patch(
      './bar.js',
      `window.logs.push('init BarV2'); export default function Bar() {};`
    ));
  // Since the export list changed, we have to re-run both the parent and the child.
  await expect(session.logs).resolves.toEqual(['init BarV2', 'init FooV1']);

  // TODO:
  // expect(Refresh.performReactRefresh).toHaveBeenCalled();
  // expect(Refresh.performFullRefresh).not.toHaveBeenCalled();
  expect(didFullRefresh).toBe(false);

  // Editing the child alone now doesn't reevaluate the parent.
  await session.resetLogs();
  didFullRefresh =
    didFullRefresh ||
    !(await session.patch(
      './bar.js',
      `window.logs.push('init BarV3'); export default function Bar() {};`
    ));
  await expect(session.logs).resolves.toEqual(['init BarV3']);

  // Finally, edit the parent in a way that changes the export.
  // It would still be accepted on its own -
  // but it's incompatible with the past version which didn't have two exports.
  await session.evaluate(() => window.localStorage.setItem('init', ''));
  didFullRefresh =
    didFullRefresh ||
    !(await session.patch(
      './foo.js',
      `
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('init', 'init FooV2')
      }
      export function Foo() {};
      export function FooFoo() {};`
    ));

  // Check that we attempted to evaluate, but had to fall back to full refresh.
  await expect(session.evaluate(() => window.localStorage.getItem('init'))).resolves.toEqual(
    'init FooV2'
  );

  // TODO:
  // expect(Refresh.performFullRefresh).toHaveBeenCalled();
  // expect(Refresh.performReactRefresh).not.toHaveBeenCalled();
  expect(didFullRefresh).toBe(true);
});
