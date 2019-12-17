# React Refresh Webpack Plugin

[![NPM Version](https://img.shields.io/npm/v/@pmmmwh/react-refresh-webpack-plugin)](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin)
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
module.exports = api => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    // ... other options
    plugins: [
      // ... other plugins
      // Applies the react-refresh Babel plugin on development modes only
      api.env('development') && 'react-refresh/babel',
    ].filter(Boolean),
  };
};
```

## Options

This plugin accepts a few options that are specifically targeted for advanced users.
The allowed values are as follows:

|           Name            |   Type    | Default | Description                                                                                                                                                                     |
| :-----------------------: | :-------: | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`disableRefreshCheck`** | `boolean` | `false` | Disables detection of react-refresh's Babel plugin. Useful if you do not parse JS files within `node_modules`, or if you have a Babel setup not entirely controlled by Webpack. |
|     **`forceEnable`**     | `boolean` | `false` | Enables the plugin forcefully. Useful if you want to use the plugin in production, or if you are using Webpack's `none` mode without `NODE_ENV`, for example.                   |

## Related Work

- [Initial Implementation by @maisano](https://gist.github.com/maisano/441a4bc6b2954205803d68deac04a716)
