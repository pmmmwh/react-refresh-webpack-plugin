const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.tsx',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
        use: isDevelopment ? [
          {
            loader: 'babel-loader',
            options: { plugins: ['react-refresh/babel'] }
          },
          'awesome-typescript-loader'
        ]
        : 'awesome-typescript-loader'
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    isDevelopment && new ReactRefreshPlugin({ disableRefreshCheck: true }),
  ].filter(Boolean),

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['.', 'node_modules']
  },
};
