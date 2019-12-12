const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('../../src');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
