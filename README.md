# React Refresh Plugin

An **EXPERIMENTAL** Webpack plugin to enable "Fast Refresh" (also known as _Hot Reloading_) for React components.

## Installation

First - this plugin is not ready and is currently not compliant to the "Fast Refresh" branding.
Please **DO NOT** us it in any important apps.

But, if you are adventurous, the steps for installation are as follows:

1. Install the plugin

   ```sh
   # if you prefer npm
   npm install -D https://github.com/pmmmwh/react-refresh-webpack-plugin

   # if you prefer yarn
   yarn add -D https://github.com/pmmmwh/react-refresh-webpack-plugin
   ```

2. Install the peer dependencies of this plugin

   ```sh
   # exclude babel-loader if you already installed it
   # if you prefer npm
   npm install -D react-refresh babel-loader

   # if you prefer yarn
   yarn add -D react-refresh
   ```

## Usage

In your webpack configuration, alter as follows:

```diff
+ const ReactRefreshPlugin = require('react-refresh-webpack-plugin');
// ... your other imports

module.exports = {
  // ... other configurations
  module: {
    rules: [
      // ... other rules
      {
        // for TypeScript, change the following to "tsx?"
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // ... other loaders
          {
            loader: require.resolve('babel-loader'),
            options: {
              // ... other options
              // DON'T apply the plugin in production mode!
+             plugins: ['react-refresh/babel'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // ... other plugins
+   new ReactRefreshPlugin(),
  ],
};
```

## References

- [Implementation by @maisano](https://gist.github.com/maisano/441a4bc6b2954205803d68deac04a716)
