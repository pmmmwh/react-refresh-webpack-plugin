const path = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    client: './client/ReactRefreshEntry.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: { comments: false },
        },
      }),
    ],
    nodeEnv: 'development',
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'umd'),
  },
};
