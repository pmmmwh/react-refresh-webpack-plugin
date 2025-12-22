// When available, use `__webpack_global__` which is a stable runtime function to use `__webpack_require__` in this compilation
// See: https://github.com/webpack/webpack/issues/20139
const RefreshGlobals = `(typeof __webpack_global__ !== 'undefined' ? __webpack_global__ : __webpack_require__)`;

module.exports = RefreshGlobals;
