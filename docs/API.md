# API

## Directives

The `react-refresh/babel` plugin provide support to directive comments out of the box.

### `reset`

```js
/* @refresh reset */
```

This directive tells React Refresh to force reset state on every refresh (current file only).
This can be useful, for example, to reset error boundary components' state,
so it doesn't persist when new code is executed.

## Options

This plugin accepts a few options to tweak its behaviour.

In usual scenarios, you probably wouldn't have to reach for them -
they exist specifically to enable integration in more advanced/complicated setups.

### `ReactRefreshPluginOptions`

```ts
interface ReactRefreshPluginOptions {
  forceEnable?: boolean;
  exclude?: string | RegExp | Array<string | RegExp>;
  include?: string | RegExp | Array<string | RegExp>;
  library?: string;
  esModule?: boolean | ESModuleOptions;
  overlay?: boolean | ErrorOverlayOptions;
}
```

#### `forceEnable`

Type: `boolean`

Default: `undefined`

Enables the plugin forcefully.

It is useful if you want to:

- Use the plugin in production;
- Use the plugin with the `none` mode in Webpack without setting `NODE_ENV`;
- Use the plugin in environments we do not support, such as `electron-prerender`
  (**WARNING: Proceed at your own risk!**).

#### `exclude`

Type: `string | RegExp | Array<string | RegExp>`

Default: `/node_modules/`

Exclude files from being processed by the plugin.
This is similar to the `module.rules` option in Webpack.

#### `include`

Type: `string | RegExp | Array<string | RegExp>`

Default: `/\.([jt]sx?|flow)$/i`

Include files to be processed by the plugin.
This is similar to the `module.rules` option in Webpack.

#### `library`

Type: `string`

Default: `''`, or `output.uniqueName` in Webpack 5, or `output.library` for both Webpack 4/5 if set

Sets a namespace for the React Refresh runtime.
This is similar to the `output.uniqueName` in Webpack 5 or the `output.library` option in Webpack 4/5.

It is most useful when multiple instances of React Refresh is running together simultaneously.

#### `esModule`

Type: `boolean | ESModuleOptions`

Default: `undefined` (auto-detection)

Enables strict ES Modules compatible runtime.
By default, the plugin will try to infer the module system same as Webpack 5,
either via the `type` property in `package.json` (`commonjs` and `module`),
or via the file extension (`.cjs` and `.mjs`).

It is most useful when you want to enforce output of native ESM code.

See the [`ESModuleOptions`](#esmoduleoptions) section below for more details on the object API.

#### `overlay`

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

### `ESModuleOptions`

```ts
interface ESModuleOptions {
  exclude?: string | RegExp | Array<string | RegExp>;
  include?: string | RegExp | Array<string | RegExp>;
}
```

#### `exclude`

Type: `string | RegExp | Array<string | RegExp>`

Default: `/node_modules/`

Exclude files from being processed as ESM.
This is similar to the `module.rules` option in Webpack.

#### `include`

Type: `string | RegExp | Array<string | RegExp>`

Default: `/\.([jt]sx?|flow)$/i`

Include files to be processed as ESM.
This is similar to the `module.rules` option in Webpack.

### `ErrorOverlayOptions`

```ts
interface ErrorOverlayOptions {
  entry?: string | false;
  module?: string | false;
  sockIntegration?: 'wds' | 'whm' | 'wps' | false | string;
  sockHost?: string;
  sockPath?: string;
  sockPort?: number;
  sockProtocol?: 'http' | 'https' | 'ws' | 'wss';
  useURLPolyfill?: boolean;
}
```

#### `entry`

Type: `string | false`

Default: `'@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry'`

The **PATH** to a file/module that sets up the error overlay integration.
Both **ABSOLUTE** and **RELATIVE** paths are acceptable, but it is recommended to use the **FORMER**.

When set to `false`, no code will be injected for this stage.

#### `module`

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
- `clearCompileErrors` is invoked when a new Webpack compilation is started (i.e. HMR rebuild).

> Note: if you want to use `react-error-overlay` as a value to this option,
> you should instead use `react-dev-utils/refreshOverlayInterop` or implement a similar interop.
> The APIs expected by this plugin is slightly different from what `react-error-overlay` provides out-of-the-box.

#### `sockIntegration`

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

#### `sockHost`

Default: Parsed from current URL

Type: `string`

**This is relevant for `webpack-dev-server` only.**

Set a custom host for the error overlay to listen to Webpack build messages.
Useful if you set `devServer.sockHost` to something other than `window.location.hostname`.

#### `sockPort`

Default: Parsed from current URL

Type: `number`

**This is relevant for `webpack-dev-server` only.**

Set a custom port for the error overlay to listen to Webpack build messages.
Useful if you set `devServer.sockPort` to something other than `window.location.port`.

#### `sockPath`

Default: `/ws` for WDS v4, `/sockjs-node` for WDS v3

Type: `string`

**This is relevant for `webpack-dev-server` only.**

Set a custom path for the error overlay to listen to Webpack build messages.
Useful if you set `devServer.sockPath` to something other than `/sockjs-node`.

#### `sockProtocol`

Default: Parsed from current URL

Type: `http`, `https`, `ws` or `wss`

**This is relevant for `webpack-dev-server` only.**

Force a protocol for the error overlay to listen for Webpack build messages.
Useful if you want to enforce https communication, or if you're working under a non-HTTP path.

#### `useURLPolyfill`

Default: Detected from availability in the global scope

Type: `boolean`

**This is relevant for `webpack-dev-server` only.**

Uses a polyfill for the DOM URL API to maintain compatibility in IE11.
This is only applied to code from the plugin.
