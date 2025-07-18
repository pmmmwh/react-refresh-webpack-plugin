# Troubleshooting

## Coming from `react-hot-loader`

If you are coming from `react-hot-loader`, before using the plugin,
you have to ensure that you've completely erased the integration of RHL from your app:

- Removed the `react-hot-loader/babel` Babel plugin (from Babel config variants or Webpack config)
- Removed the `react-hot-loader/patch` Webpack entry
- Removed the `react-hot-loader/webpack` Webpack loader
- Removed the alias of `react-dom` to `@hot-loader/react-dom` (from `package.json` or Webpack config)
- Removed imports and their usages from `react-hot-loader`

This has to be done because, internally,
`react-hot-loader` intercepts and reconciles the React tree before React can try to re-render it.
That in turn breaks mechanisms the plugin depends on to deliver the experience.

## Compatibility with `npm@7`

`npm@7` have brought back the behaviour of auto-installing peer dependencies with new semantics,
but their support for optional peer dependencies,
used by this plugin to provide support to multiple integrations without bundling them all,
are known to be a bit lacking.

If you encounter the `ERESOLVE` error code while running `npm install` -
you can fallback to use the legacy dependency resolution algorithm and it should resolve the issue:

```sh
npm install --legacy-peer-deps
```

## Usage with CSS Files/Imports

This plugin does not provide HMR for CSS.
To achieve that,
you should be using [`style-loader`](https://github.com/webpack-contrib/style-loader) or [`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin).

Both provides HMR capabilities out of the box for Webpack 5 -
if are still on Webpack 4 and uses `mini-css-extract-plugin`, you might have to [do some setup](https://github.com/webpack-contrib/mini-css-extract-plugin/#hot-module-reloading-hmr).

## Usage with Indirection (like Workers and JS Templates)

If you share the Babel config for files in an indirect code path (e.g. Web Workers, JS Templates with partial pre-render) and all your other source files,
you might experience this error:

```
Uncaught ReferenceError: $RefreshReg$ is not defined
```

The reason is that when using child compilers (e.g. `html-webpack-plugin`, `worker-plugin`), plugins are usually not applied (but loaders are).
This means that code processed by `react-refresh/babel` is not further transformed by this plugin and will lead to broken builds.

To solve this issue, you can choose one of the following workarounds:

**Sloppy**

In the entry of your indirect code path (e.g. some `index.js`), add the following two lines:

```js
self.$RefreshReg$ = () => {};
self.$RefreshSig$ = () => () => {};
```

This basically acts as a "polyfill" for helpers expected by `react-refresh/babel`, so the worker can run properly.

**Simple**

Ensure all exports within the indirect code path are not named in `PascalCase`.
This will tell the Babel plugin to do nothing when it hits those files.

In general, the `PascalCase` naming scheme should be reserved for React components only,
and it doesn't really make sense for them to exist within non-React-rendering contexts.

**Robust but complex**

In your Webpack configuration, alter the Babel setup as follows:

```js
{
  rules: [
    // JS-related rules only
    {
      oneOf: [
        {
          test: /\.[jt]s$/,
          include: '<Your indirection files here>',
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // Your Babel config here
            },
          },
        },
        {
          test: /\.[jt]sx?$/,
          include: '<Your files here>',
          exclude: ['<Your indirection files here>', /node_modules/],
          use: {
            loader: 'babel-loader',
            options: {
              // Your Babel config here
              plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean),
            },
          },
        },
      ],
    },
    // Any other rules, such as CSS
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
  ];
}
```

This would ensure that your indirect code path will not be processed by `react-refresh/babel`,
thus eliminating the problem completely.

## Hot Module Replacement (HMR) is not enabled

This means that you have not enabled HMR for Webpack, or we are unable to detect a working HMR implementation from the compilation context.

**Using `webpack-dev-server`**

Set the `hot` or `hotOnly` options to `true`.

**Using `webpack-hot-middleware`**

Add `HotModuleReplacementPlugin` to your list of plugins to use in development mode.

**Using `webpack-plugin-serve`**

Set the `hmr` option to `true`.

## State not preserved for class components

This is intended behaviour.
If you're coming from [react-hot-loader](https://github.com/gaearon/react-hot-loader), this might be the biggest surprise for you.

The main rationale behind this is listed in [this wish list for hot reloading](https://overreacted.io/my-wishlist-for-hot-reloading/):

> It is better to lose local state than to behave incorrectly.
>
> It is better to lose local state than use an old version.

The truth is, historically, hot reloading for class components was never reliable and maintainable.
It was implemented based on workarounds like wrapping components with Proxies.

While these workarounds made hot reloading "work" on the surface, they led to inconsistencies in other departments:

- Lifecycle methods will fire randomly at random times;
- Type checks will fail randomly (`<Component />.type === Component` is `false`); and
- Mutation of React's internals, which is difficult to manage and will need to play catch up with React as we move into the future (a-la Concurrent Mode).

Thus, to keep fast refresh reliable and resilient to errors (with recovery for most cases), class components will always be re-mounted on a hot update.

## Edits always lead to full reload

In most cases, if the plugin is applied correctly, it would mean that we weren't able to set up boundaries to stop update propagation.
It can be narrowed down to a few unsupported patterns:

1. Un-named/non-pascal-case-named components

   See [this tweet](https://twitter.com/dan_abramov/status/1255229440860262400) for drawbacks of not giving component proper names.
   They are impossible to support because we have no ways to statically determine they are React-related.
   This issue also exist for other React developer tools, like the [hooks ESLint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks).
   Internal components in HOCs also have to conform to this rule.

   ```jsx
   // won't work
   export default () => <div />;
   export default function () {
     return <div />;
   }
   export default function divContainer() {
     return <div />;
   }
   ```

2. Chain of files leading to root with none containing React-related content only

   This pattern cannot be supported because we cannot ensure non-React-related content are free of side effects.
   Usually with this error you will see something like this in the browser console:

   ```
   Ignored an update to unaccepted module ... [a very long path]
   ```

3. `export * from 'namespace'` (TypeScript only)

   This only affect users using TypeScript on Babel.
   This pattern is only supported when you don't mix normal exports with type exports, or when all your exports conform to the `PascalCase` rule.
   This is because we cannot statically analyse the exports from the namespace to determine whether we can set up a boundary and stop update propagation.

## Component not updating with bundle splitting techniques

Webpack allows various bundle splitting techniques to improve performance and cacheability.
However, these techniques often result in a shuffled execution order, which will break fast refresh.

To make fast refresh work properly, make sure your Webpack configuration comply to the following rules:

1. All React-related packages (including custom reconcilers) should be in the same chunk with `react-refresh/runtime`

   Because fast refresh internally uses the React DevTools protocol and have to be registered before any React code runs,
   all React-related stuff needs to be in the same chunk to ensure execution order and object equality in the form of `WeakMap` keys.

   **Using DLL plugin**

   Ensure the entries for the DLL include `react-refresh/runtime`,
   and the `mode` option is set to `development`.

   ```js
   module.exports = {
     mode: 'development',
     entry: ['react', 'react-dom', 'react-refresh/runtime'],
   };
   ```

   **Using multiple entries**

   Ensure the `react` chunk includes `react-refresh/runtime`.

   ```js
   module.exports = {
     entry: {
       main: 'index.js',
       vendors: ['react', 'react-dom', 'react-refresh/runtime'],
     },
   };
   ```

2. Only one copy of both the HMR runtime and the plugin's runtime should be embedded for one Webpack app

   This concern only applies when you have multiple entry points.
   You can use Webpack's `optimization.runtimeChunk` option to enforce this.

   ```js
   module.exports = {
     optimization: {
       runtimeChunk: 'single',
     },
   };
   ```

## Externalising React

Fast refresh relies on initialising code before **ANY** React code is ran.
If you externalise React, however, it is likely that this plugin cannot inject the necessary runtime code before it.

You can deal with this in a few ways (also see [#334](https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/334) for relevant discussion).

**Production-only externalisation**

The simplest solution to this issue is to simply not externalise React in development.
This would guarantee any code injected by this plugin run before any React code,
and would require the least manual tweaking.

**Use React DevTools**

If the execution environment is something you can control, and you wanted to externalise React in development,
you can use React DevTools which would inject hooks to the environment for React to attach to.

React Refresh should be able to hook into copies of React connected this way even it runs afterwards,
but do note that React DevTools does not inject hooks over a frame boundary (`iframe`).

**Externalise React Refresh**

If all solutions above are not applicable, you can also externalise `react-refresh/runtime` together with React.
We provide an entrypoint to easily achieve this - `@pmmmwh/react-refresh-webpack-plugin/umd/client.min.js`.

If you would like to use the provided script, ensure that it is loaded before React and/or React-DOM.
You can load this script via any CDN for `npm`, such as `jsDelivr` and `unpkg`:

```html
<!-- if you prefer jsDelivr -->
<script src=" https://cdn.jsdelivr.net/npm/@pmmmwh/react-refresh-webpack-plugin@^0.6.1/umd/client.min.js "></script>

<!-- if you prefer unpkg -->
<script src="https://unpkg.com/@pmmmwh/react-refresh-webpack-plugin@^0.6.1/umd/client.min.js"></script>
```

If you don't want to use the provided script,
you can check out [this sandbox](https://codesandbox.io/s/react-refresh-externals-14fpn) for an example on how this could be done manually.

## Running multiple instances of React Refresh simultaneously

If you are running on a micro-frontend architecture (e.g. Module Federation in Webpack 5),
you should set the `library` output to ensure proper namespacing in the runtime injection script.

**Using Webpack's `output.uniqueName` option (Webpack 5 only)**

```js
module.exports = {
  output: {
    uniqueName: 'YourLibrary',
  },
};
```

**Using Webpack's `output.library` option**

```js
module.exports = {
  output: {
    library: 'YourLibrary',
  },
};
```

**Using the plugin's `library` option**

```js
module.exports = {
  plugins: [
    new ReactRefreshPlugin({
      library: 'YourLibrary',
    }),
  ],
};
```
