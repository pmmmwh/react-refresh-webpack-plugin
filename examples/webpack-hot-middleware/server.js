const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');

const app = express();
const compiler = webpack(config);

app.use(
  require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.use(
  // FIXME:
  //  `webpack-hot-middleware` currently does not work reliably with Webpack 5:
  //  Ref: https://github.com/webpack-contrib/webpack-hot-middleware/pull/397
  require(`@gatsbyjs/webpack-hot-middleware`)(compiler, {
    log: false,
    path: `/__webpack_hmr`,
    heartbeat: 10 * 1000,
  })
);

app.listen(8080, () => console.log('App is listening on port 8080!'));
