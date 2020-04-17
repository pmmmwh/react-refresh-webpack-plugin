const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackPluginServe: ServePlugin } = require('webpack-plugin-serve');

const isDevelopment = process.env.NODE_ENV !== 'production';
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: ['webpack-plugin-serve/client', './src/index.js'],
  },
  output: {
    filename: 'bundle.js',
    path: outputPath,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    isDevelopment &&
      new ServePlugin({
        static: outputPath,
        status: false,
      }),
    isDevelopment &&
      new ReactRefreshPlugin({
        overlay: {
          sockIntegration: 'wps',
        },
      }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './public/index.html',
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
