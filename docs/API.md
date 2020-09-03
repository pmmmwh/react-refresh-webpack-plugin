# API

This plugin accepts a few options to tweak its behaviour.

In more simple scenarios, you probably wouldn't have to reach for them -
they exist specifically to enable integration in advance/complicated setups.

## `ReactRefreshPluginOptions`

```ts
interface ReactRefreshPluginOptions {
  forceEnable?: boolean;
  exclude?: string | RegExp | Array<string | RegExp>;
  include?: string | RegExp | Array<string | RegExp>;
  overlay?: boolean | ErrorOverlayOptions;
}
```

### `forceEnable`

Type: `boolean`

Default: `undefined`

Enables the plugin forcefully.

It is useful if you want to:

- Use the plugin in production;
- Use the plugin with the `none` mode in Webpack without setting `NODE_ENV`;
- Use the plugin in environments we do not support, such as `electron-prerender`
  (**WARNING: Proceed at your own risk!**).

### `exclude`

Type: `string | RegExp | Array<string | RegExp>`

Default: `/node_modules/`

Exclude files from being processed by the plugin.
This is similar to the `module.rules` option in Webpack.

### `include`

Type: `string | RegExp | Array<string | RegExp>`

Default: `/\.([jt]sx?|flow)$/i`

Include files to be processed by the plugin.
This is similar to the `module.rules` option in Webpack.

### `overlay`

Type: `boolean | ErrorOverlayOptions`

Default:

```json5
{
  entry: '@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry',
  module: '@pmmmwh/react-refresh-webpack-plugin/overlay',
  sockIntegration: 'wds',
}
```

Modifies behaviour of the plugin's error overlay integration:

- If `overlay` is not provided or `true`, the **DEFAULT** behaviour will be used;
- If `overlay` is `false`, the error overlay integration will be **DISABLED**;
- If `overlay` is an object (`ErrorOverlayOptions`), it will act with respect to what is provided
  (\*NOTE: This is targeted for ADVANCED use cases.).

See the [`ErrorOverlayOptions`](#erroroverlayoptions) section below for more details on the object API.

## `ErrorOverlayOptions`

```ts
interface ErrorOverlayOptions {
  entry?: string | false;
  module?: string | false;
  sockIntegration?: 'wds' | 'wdm' | 'wps' | false | string;
  sockHost?: string;
  sockPath?: string;
  sockPort?: number;
  useLegacyWDSSockets?: boolean;
}
```

### `entry`

Type: `string | false`

Default: `'@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry'`

The **PATH** to a file/module that sets up the error overlay integration.
Both **ABSOLUTE** and **RELATIVE** paths are acceptable, but it is recommended to use the **FORMER**.

When set to `false`, no code will be injected for this stage.

### `module`

Type: `string | false`

Default: `'@pmmmwh/react-refresh-webpack-plugin/overlay'`

The **PATH** to a file/module to be used as an error overlay (e.g. `react-error-overlay`).
Both **ABSOLUTE** and **RELATIVE** paths are acceptable, but it is recommended to use the **FORMER**.

The provided file should contain two **NAMED** exports:

```ts
function handleRuntimeError(error: Error) {}
function clearRuntimeErrors() {}
```

- `handleRuntimeError` is invoked when a **RUNTIME** error is **CAUGHT** (e.g. during module initialisation or execution);
- `clearRuntimeErrors` is invoked when a module is **RE-INITIALISED** via "Fast Refresh".

If the default `entry` is used, the file should contain two more **NAMED** exports:

```ts
function showCompileError(webpackErrorMessage: string) {}
function clearCompileErrors() {}
```

- `showCompileError` is invoked when an error occurred during a Webpack compilation
  (NOTE: `webpackErrorMessage` might be ANSI encoded depending on the integration);
- `clearRuntimeErrors` is invoked when a new Webpack compilation is started (i.e. HMR rebuild).

> Note: if you want to use `react-error-overlay` as a value to this option,
> you should instead use `react-dev-utils/refreshOverlayInterop` or implement a similar interop.
> The APIs expected by this plugin is slightly different from what `react-error-overlay` provides out-of-the-box.

### `sockIntegration`

Default: `wds`

Type: `wds`, `whm`, `wps`, `false` or `string`

The HMR integration that the error overlay will interact with -
it can either be a short form name of the integration (`wds`, `whm`, `wps`),
or a **PATH** to a file/module that sets up a connection to receive Webpack build messages.
Both **ABSOLUTE** and **RELATIVE** paths are acceptable, but it is recommended to use the **FORMER**.

Common HMR integrations (for Webpack) are support by this plugin out-of-the-box:

- For `webpack-dev-server`, you can skip this option or set it to `wds`;
- For `webpack-hot-middleware`, set this option to `whm`;
- For `webpack-plugin-serve`, set this option to `wps`.

If you use any other HMR integrations (e.g. custom ones), or if you want to customise how the connection is being setup,
you will need to implement a message client in the provided file/module.
You can reference implementations inside the [`sockets`](https://github.com/pmmmwh/react-refresh-webpack-plugin/tree/main/sockets) directory.

### `sockHost`

Default: `window.location.hostname`

Type: `string`

**This is relevant for `webpack-dev-server` only.**

Set a custom host for the error overlay to listen to Webpack build messages.
Useful if you set `devServer.sockHost` to something other than `window.location.hostname`.

### `sockPort`

Default: `window.location.port`

Type: `number`

**This is relevant for `webpack-dev-server` only.**

Set a custom port for the error overlay to listen to Webpack build messages.
Useful if you set `devServer.sockPort` to something other than `window.location.port`.

### `sockPath`

Default: `/sockjs-node`

Type: `string`

**This is relevant for `webpack-dev-server` only.**

Set a custom path for the error overlay to listen to Webpack build messages.
Useful if you set `devServer.sockPath` to something other than `/sockjs-node`.

#### `useLegacyWDSSockets`

Default: `undefined`

Type: `boolean`

**This is relevant for `webpack-dev-server` only.**

Wraps the `SockJS` client from `webpack-dev-server` prior to version `3.7.0` to make it compatible with the plugin.

You will also need to install `sockjs-client@1.3.0` as a peer dependency with one of the commands below:

```sh
# if you prefer npm
npm install -D sockjs-client@1.3.0

# if you prefer yarn
yarn add -D sockjs-client@1.3.0

# if you prefer pnpm
pnpm add -D sockjs-client@1.3.0
```
