# Migration Guide: react-hot-loader → react-refresh-webpack-plugin

This guide walks you through migrating from the deprecated `react-hot-loader` to the official `react-refresh-webpack-plugin` (Fast Refresh).

## Why Migrate?

- `react-hot-loader` is deprecated and no longer maintained
- `react-refresh-webpack-plugin` is the official solution for Fast Refresh
- Better compatibility with React 18+ and webpack 5
- Active maintenance and bug fixes

---

## Prerequisites

- webpack 4.34+ or webpack 5
- React 16.9+ (React 17+ recommended)
- Node.js 14+

---

## Step 1: Remove react-hot-loader Dependencies

**Uninstall:**

```bash
npm uninstall react-hot-loader
# or
yarn remove react-hot-loader
```

**If using babel plugin:**

```bash
npm uninstall @babel/plugin-react-hot-reload
# or
yarn remove @babel/plugin-react-hot-reload
```

---

## Step 2: Install react-refresh-webpack-plugin

**For webpack 5:**

```bash
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
# or
yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

**For webpack 4:**

```bash
npm install -D @pmmmwh/react-refresh-webpack-plugin@0.4.3 react-refresh@0.9.0
# or
yarn add -D @pmmmwh/react-refresh-webpack-plugin@0.4.3 react-refresh@0.9.0
```

---

## Step 3: Update webpack Configuration

### Before (react-hot-loader)

```javascript
// webpack.config.js
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js',
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-hot-loader/babel'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ReactRefreshPlugin(),
  ],
  // Disable HMR entirely if needed
  // hot: false,
};
```

### After (react-refresh-webpack-plugin)

```javascript
// webpack.config.js
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  entry: [
    './src/index.js',  // No react-hot-loader/patch needed
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // Remove react-hot-loader/babel plugin
              // Add react-refresh/babel if using Babel
              plugins: ['react-refresh/babel'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ReactRefreshPlugin(),
  ],
  // hot: true, // Keep HMR enabled for best experience
};
```

---

## Step 4: Update Your Entry Point

### Before (react-hot-loader)

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// react-hot-loader setup
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
```

### After (react-refresh-webpack-plugin)

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// No manual HMR setup needed - react-refresh handles it automatically
ReactDOM.render(<App />, document.getElementById('root'));
```

---

## Step 5: Update Class Components (Optional)

react-refresh-webpack-plugin supports class components, but with limitations:

| Feature | Supported |
|---------|-----------|
| State preservation on save | ✅ Yes |
| `componentDidCatch` updates | ✅ Yes |
| `getDerivedStateFromProps` | ⚠️ Partial (may reset state) |
| `shouldComponentUpdate` | ✅ Yes |
| `PureComponent` | ✅ Yes |

**Note:** If you experience issues with class components, consider converting them to functional components with hooks.

---

## Common Setup Patterns

### Create React App (CRA) Users

CRA 4+ uses `react-scripts` which includes react-refresh-webpack-plugin automatically.

**If using `react-scripts` < 4:**

```bash
npm install react-scripts@latest
# or
yarn upgrade react-scripts@latest
```

### Vite Users

Vite has built-in Fast Refresh. No extra setup needed:

```bash
npm create vite@latest my-app -- --template react
# Fast Refresh works out of the box
```

### Custom webpack with TypeScript

```javascript
// webpack.config.js
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript', '@babel/preset-react'],
              plugins: ['react-refresh/babel'],
            },
          },
          {
            loader: 'ts-loader', // or fork-ts-checker-webpack-plugin
          },
        ],
      },
    ],
  },
  plugins: [
    new ReactRefreshPlugin(),
  ],
};
```

---

## Troubleshooting

### 1. "Module not found: Error: Can't resolve 'react-refresh'"

**Cause:** `react-refresh` package not installed.

**Fix:**
```bash
npm install -D react-refresh
# or
yarn add -D react-refresh
```

### 2. "React Refresh not working - changes don't preserve state"

**Cause:** `hot: false` or HMR disabled.

**Fix:** Ensure HMR is enabled in webpack config:
```javascript
module.exports = {
  // ...
  devServer: {
    hot: true,
  },
};
```

### 3. "Maximum update depth exceeded" / Infinite render loop

**Cause:** Duplicate React Refresh runtime or incorrect setup.

**Fix:**
1. Ensure only one `ReactRefreshPlugin()` instance
2. Check for duplicate `react-refresh` imports in `node_modules`
3. Clear webpack cache: `rm -rf node_modules/.cache`

### 4. TypeScript errors with `react-refresh/babel`

**Cause:** TypeScript's `ts-loader` not handling Babel plugin correctly.

**Fix:** Use Babel for transpilation with TypeScript:
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
              plugins: ['react-refresh/babel'],
            },
          },
        ],
      },
    ],
  },
};
```

### 5. DevTools not working after migration

**Cause:** React DevTools may need to reconnect.

**Fix:**
1. Close DevTools tab
2. Reload page
3. Reopen DevTools

---

## Rollback Plan

If you need to revert to `react-hot-loader`:

```bash
npm install react-hot-loader@latest
# Revert webpack.config.js changes
# Re-add react-hot-loader/babel plugin
```

---

## Migration Checklist

- [ ] Uninstall `react-hot-loader`
- [ ] Install `@pmmmwh/react-refresh-webpack-plugin` and `react-refresh`
- [ ] Update webpack config (remove `react-hot-loader/patch` from entry)
- [ ] Remove manual HMR setup in entry point
- [ ] Update Babel config (remove `react-hot-loader/babel`, add `react-refresh/babel`)
- [ ] Test Fast Refresh functionality
- [ ] Verify class components work as expected
- [ ] Update documentation for your team

---

## Resources

- [react-refresh-webpack-plugin GitHub](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- [React Fast Refresh RFC](https://github.com/reactjs/rfcs/pull/145)
- [Webpack HMR Documentation](https://webpack.js.org/concepts/hot-module-replacement/)
