const path = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'client-external': './client/ReactRefreshEntry.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  output: {
    path: path.resolve(__dirname),
  },
};
