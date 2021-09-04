# React Refresh Webpack Plugin

[![Latest Version](https://img.shields.io/npm/v/@pmmmwh/react-refresh-webpack-plugin/latest)](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin/v/latest)
[![Next Version](https://img.shields.io/npm/v/@pmmmwh/react-refresh-webpack-plugin/next)](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin/v/next)
[![CircleCI](https://img.shields.io/circleci/project/github/pmmmwh/react-refresh-webpack-plugin/main)](https://app.circleci.com/pipelines/github/pmmmwh/react-refresh-webpack-plugin)
[![License](https://img.shields.io/github/license/pmmmwh/react-refresh-webpack-plugin)](./LICENSE)

An **EXPERIMENTAL** Webpack plugin to enable "Fast Refresh" (also known as _Hot Reloading_) for React components.

> This plugin is not 100% stable.
> We're hoping to land a v1 release soon - please help us by reporting any issues you've encountered!

## Getting Started

### Prerequisites

Ensure that you are using at least the minimum supported versions of this plugin's peer dependencies -
older versions unfortunately do not contain code to orchestrate "Fast Refresh",
and thus cannot be made compatible.

We recommend using at least the following versions:

| Dependency      | Version             |
| --------------- | ------------------- |
| `react`         | `16.13.0` or `17.x` |
| `react-dom`     | `16.13.0` or `17.x` |
| `react-refresh` | `0.10.0`            |
| `webpack`       | `4.46.0` or `5.2.0` |

<details>
<summary>Minimum requirements</summary>

| Dependency      | Version  |
| --------------- | -------- |
| `react`         | `16.9.0` |
| `react-dom`     | `16.9.0` |
| `react-refresh` | `0.10.0` |
| `webpack`       | `4.43.0` |

</details>

<details>
<summary>
Using custom renderers (e.g. <code>react-three-fiber</code>, <code>react-pdf</code>, <code>ink</code>)
</summary>

To ensure full support of "Fast Refresh" with components rendered by custom renderers,
you should ensure the version of the renderer you're using depend on a recent version of `react-reconciler`.

We recommend version `0.25.0` or above, but any versions above `0.22.0` should work.

If the renderer is not compatible, please file them an issue instead.

</details>

### Installation

With all prerequisites met, you can install this plugin with your package manager of choice:

```sh
# if you prefer npm
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh

# if you prefer yarn
yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh

# if you prefer pnpm
pnpm add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

The `react-refresh` package (from the React team) is a required peer dependency of this plugin.
We recommend using version `0.10.0` or above.

<details>
<summary>Support for TypeScript</summary>

TypeScript support is available out-of-the-box for those who use `webpack.config.ts`.

Our exported types however depends on `type-fest`, so you'll have to add it as a `devDependency`:

```sh
# if you prefer npm
npm install -D type-fest

# if you prefer yarn
yarn add -D type-fest

# if you prefer pnpm
pnpm add -D type-fest
```

</details>

### Usage

For most setups, we recommend using `babel-loader`.
It covers the most use cases and is officially supported by the React team.

The examples below will also assume you're using `webpack-dev-server`.

If you haven't done so, set up your development Webpack configuration for Hot Module Replacement (HMR).

```js
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    hot: true,
  },
};
```

<details>
<summary>Using <code>webpack-hot-middleware</code></summary>

```js
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  plugins: [isDevelopment && new webpack.HotModuleReplacementPlugin()].filter(Boolean),
};
```

</details>

<details>
<summary>Using <code>webpack-plugin-serve</code></summary>

```js
const { WebpackPluginServe } = require('webpack-plugin-serve');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  plugins: [isDevelopment && new WebpackPluginServe()].filter(Boolean),
};
```

> **:memo: Note**:
> `webpack-plugin-server` officially only supports Webpack 4.

</details>

Then, add the `react-refresh/babel` plugin to your Babel configuration and add this plugin to your Webpack configuration.

```js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
};
```

> **:memo: Note**:
>
> Even though both the Babel transform (`react-refresh/babel`) and this plugin have optimisations to do nothing in `production`,
> it is suggested to only have them both enabled in `development` mode to prevent shipping any additional code accidentally.

<details>
<summary>Using <code>ts-loader</code></summary>

> **:warning: Warning**:
> This is an un-official integration maintained by the community.

Install [`react-refresh-typescript`](https://github.com/Jack-Works/react-refresh-transformer/tree/main/typescript).
Ensure your TypeScript version is at least 4.0.

```sh
# if you prefer npm
npm install -D react-refresh-typescript

# if you prefer yarn
yarn add -D react-refresh-typescript

# if you prefer pnpm
pnpm add -D react-refresh-typescript
```

Then, instead of wiring up `react-refresh/babel` via `babel-loader`,
you can wire-up `react-refresh-typescript` with `ts-loader`:

```js
const ReactRefreshTypeScript = require('react-refresh-typescript');
// ... other imports

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
      },
    ],
  },
};
```

> `ts-loader` won't work with HMR unless `transpileOnly` is set to `true`.
> You should use `ForkTsCheckerWebpackPlugin` if you need typechecking during development.

</details>

<details>
<summary>Using <code>swc-loader</code></summary>

> **:warning: Warning**:
> This is an un-official integration maintained by the community.

Ensure your `@swc/core` version is at least `1.2.52`.
It is also recommended to use `swc-loader` version `0.1.13` or above.

Then, instead of wiring up `react-refresh/babel` via `babel-loader`,
you can wire-up `swc-loader` to use the `refresh` transform:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('swc-loader'),
            options: {
              jsc: {
                transform: {
                  react: {
                    development: isDevelopment,
                    refresh: isDevelopment,
                  },
                },
              },
            },
          },
        ],
      },
    ],
  },
};
```

> Starting from version `0.1.13`, `swc-loader` will detect the `development` option based on the current Webpack mode.
> `swc` won't enable fast refresh when `development` is `false`.

</details>

### Overlay Integration

This plugin integrates with the most common Webpack HMR solutions to surface errors during development using an overlay.
By default, `webpack-dev-server` is used,
but you can set the [`overlay.sockIntegration`](docs/API.md#sockintegration) option to match what you're using.

The supported versions are as follows:

| Dependency               | Version           |
| ------------------------ | ----------------- |
| `wewbpack-dev-server`    | `3.6.0`+ or `4.x` |
| `webpack-hot-middleware` | `2.x`             |
| `webpack-plugin-serve`   | `0.x` or `1.x`    |

## API

Please refer to [the API docs](docs/API.md) for all available options.

## FAQs and Troubleshooting

Please refer to [the Troubleshooting guide](docs/TROUBLESHOOTING.md) for FAQs and resolutions to common issues.

## License

This project is licensed under the terms of the [MIT License](/LICENSE).

## Related Work

- [Initial Implementation by @maisano](https://gist.github.com/maisano/441a4bc6b2954205803d68deac04a716)
