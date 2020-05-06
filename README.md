# React Refresh Webpack Plugin

[![Latest Version](https://img.shields.io/npm/v/@pmmmwh/react-refresh-webpack-plugin/latest)](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin/v/latest)
[![Next Version](https://img.shields.io/npm/v/@pmmmwh/react-refresh-webpack-plugin/next)](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin/v/next)
[![License](https://img.shields.io/github/license/pmmmwh/react-refresh-webpack-plugin)](./LICENSE)

An **EXPERIMENTAL** Webpack plugin to enable "Fast Refresh" (also previously known as _Hot Reloading_) for React components.

## Installation

First - this plugin is not 100% stable.
It works pretty reliably, and we have been testing it for some time, but there are still edge cases yet to be discovered.
Please **DO NOT** use it if you cannot afford to face breaking changes in the future.

```sh
# if you prefer npm
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh

# if you prefer yarn
yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

## Usage

First, apply the plugin in your Webpack configuration as follows:

**webpack.config.js**

```js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// ... your other imports

// You can tie this to whatever mechanisms you are using to detect a development environment.
// For example, as shown here, is to tie that to `NODE_ENV` -
// Then if you run `NODE_ENV=production webpack`, the constant will be set to false.
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  // It is suggested to run the plugin in development mode only
  // If you are an advanced user and would like to setup Webpack yourselves,
  // you can also use the `none` mode,
  // but you will need to set `forceEnable: true` in the plugin options.
  mode: isDevelopment ? 'development' : 'production',
  // ... other configurations
  plugins: [
    // ... other plugins
    // You could also keep the plugin in your production config,
    // It will simply do nothing.
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
};
```

Then, update your Babel configuration.
This can either be done in your Webpack config (via options of `babel-loader`), or in the form of a `.babelrc`/`babel.config.js`.

**webpack.config.js** (if you choose to inline the config)

```js
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  // DO NOT apply the plugin in production mode!
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      // ... other rules
      {
        // for TypeScript, change the following to "\.[jt]sx?"
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // ... other loaders
          {
            loader: require.resolve('babel-loader'),
            options: {
              // ... other options
              // DO NOT apply the Babel plugin in production mode!
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
};
```

**.babelrc.js** (if you choose to extract the config)

```js
module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    // ... other options
    plugins: [
      // ... other plugins
      // Applies the react-refresh Babel plugin on non-production modes only
      !api.env('production') && 'react-refresh/babel',
    ].filter(Boolean),
  };
};
```

More sample projects for common Webpack development setups are available in the [examples](https://github.com/pmmmwh/react-refresh-webpack-plugin/tree/master/examples) folder.

> Note 1: If you use `webpack.config.ts`, please also install `type-fest` as a peer dependency.

> Note 2: If you are using TypeScript (instead of Babel) as a transpiler, you will still need to use `babel-loader` to process your source code.
> Check out this [sample project](https://github.com/pmmmwh/react-refresh-webpack-plugin/tree/master/examples/typescript-without-babel) on how to set this up.

### Polyfill for Older Browsers

If you need to develop on IE11, you will need to polyfill the DOM URL API.
This can be done by adding the following before any of your code in the main entry (either one is fine):

**Using `url-polyfill`**

```js
import 'url-polyfill';
```

**Using `core-js`**

```js
import 'core-js/features/url';
import 'core-js/features/url-search-params';
```

**Using `react-app-polyfill`**

```js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```

## Options

This plugin accepts a few options that are specifically targeted for advanced users.

### `options.forceEnable`

Type: `boolean`
Default: `false`

Enables the plugin forcefully.
Useful if you want to use the plugin in production, or if you are using Webpack's `none` mode without `NODE_ENV`, for example.

### `options.overlay`

Type: `boolean | ErrorOverlayOptions`
Default: `undefined`

Modifies how the error overlay integration works in the plugin.

- If `options.overlay` is not provided or is `true`, the plugin will use the bundled error overlay interation.
- If `options.overlay` is `false`, it will disable the error overlay integration.
- If an `ErrorOverlayOptions` object is provided:
  (**NOTE**: This is an advanced option that exists mostly for tools like `create-react-app` or `Next.js`)

  - An optional `module` property could be defined.
    If it is not defined, the bundled error overlay will be used.
    If defined, it should reference a JS file that exports at least two functions with footprints as follows:

    ```ts
    function handleRuntimeError(error: Error) {}
    function clearRuntimeErrors() {}
    ```

  - An optional `entry` property could be defined, which should also reference a JS file that contains code needed to set up your custom error overlay integration.
    If it is not defined, the bundled error overlay entry will be used.
    It expects the `module` file to export two more functions:

    ```ts
    function showCompileError(webpackErrorMessage: string) {}
    function clearCompileErrors() {}
    ```

    Note that `webpackErrorMessage` is ANSI encoded, so you will need logic to parse it.

  - An example configuration:
    ```js
    const options = {
      overlay: {
        entry: 'some-webpack-entry-file',
        module: 'some-error-overlay-module',
      },
    };
    ```

#### `options.overlay.sockHost`

Type: `string`
Default: `window.location.hostname`

Set this if you are running webpack on a host other than `window.location.hostname`.
This will be used by the error overlay module, and is available for `webpack-dev-server` only.

#### `options.overlay.sockIntegration`

Type: `wds`, `whm`, `wps` or `string`
Default: `wds`

This controls how the error overlay connects to the sockets provided by several Webpack hot reload integrations.

- If you use `webpack-dev-server`, you don't need to set this as it defaults to `wds`.
- If you use `webpack-hot-middleware`, you should set this to `whm`.
- If you use `webpack-plugin-serve`, you should set this to `wps`.
- If you use anything else, or if you want to customize the socket handling yourself, you will have to provide a path to a module that will accept a message handler function and initializes the socket connection.
  See the [`runtime/sockets`](https://github.com/pmmmwh/react-refresh-webpack-plugin/tree/master/src/runtime/sockets) folder for sample implementations.

#### `options.overlay.sockPort`

Type: `number`
Default: `window.location.port`

Set this if you are running webpack on a port other than `window.location.port`.
This will be used by the error overlay module, and is available for `webpack-dev-server` only.

#### `options.overlay.sockPath`

Type: `string`
Default: `/sockjs-node`

Set this if you are running webpack on a custom path.
This will be used by the error overlay module, and is available for `webpack-dev-server` only.

### `options.useLegacyWDSSockets`

Type: `boolean`
Default: `false`

Set this to true if you are using a `webpack-dev-server` version prior to 3.8 as it requires a custom SockJS implementation.
If you use this feature, you will also need to install `sockjs-client` as a peer dependency.

## Related Work

- [Initial Implementation by @maisano](https://gist.github.com/maisano/441a4bc6b2954205803d68deac04a716)
