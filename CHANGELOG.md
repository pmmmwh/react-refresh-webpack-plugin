## 0.3.3 (29 May 2020)

### Fixes

- Removed unrecoverable React errors check and its corresponding bail out logic on hot dispose (#104)

## 0.3.2 (22 May 2020)

### Fixes

- Fixed error in overlay when stack trace is unavailable (#91)
- Fixed IE11 compatibility (#98)

## 0.3.1 (11 May 2020)

### Fixes

- Relaxed peer dependency requirements for `webpack-plugin-serve`

## 0.3.0 (10 May 2020)

### BREAKING

- Deprecated the `disableRefreshCheck` flag (#60)

### Features

- Added custom error overlay support (#44)
- Added example project to use TypeScript without usual Babel settings (#46)
- Added custom socket parameters for WDS (#52)
- Added TypeScript definition files (#65)
- Added stricter options validation rules (#62)
- Added option to configure socket runtime to support more hot integrations (#64)
- Added support for `webpack-plugin-serve` (#74)

### Fixes

- Fixed non-dismissible overlay for build warnings (#57)
- Fixed electron compatibility (#58)
- Fixed optional peer dependencies to be truly optional (#59)
- Fixed compatibility issues caused by `node-url` (#61)
- Removed check for `react` import for compatibility (#69)

## 0.2.0 (2 March 2020)

### Features

- Added `webpack-hot-middleware` support (#23)

### Fixes

- Fixed dependency on a global `this` variable to better support web workers (#29)

## 0.1.3 (19 December 2019)

### Fixes

- Fixed runtime template injection when the `runtimeChunks` optimization is used in Webpack (#26)

## 0.1.2 (18 December 2019)

### Fixes

- Fixed caching of Webpack loader to significantly improve performance (#22)

## 0.1.1 (13 December 2019)

### Fixes

- Fixed usage of WDS SockJS fallback (#17)

## 0.1.0 (7 December 2019)

- Initial public release
