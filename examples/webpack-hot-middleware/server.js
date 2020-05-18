const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const compiler = webpack(config);

const app = express();

app.use(
  require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.use(
  require(`webpack-hot-middleware`)(compiler, {
    log: false,
    path: `/__webpack_hmr`,
    heartbeat: 10 * 1000,
  })
);

app.listen(3000, () => console.log('App is listening on port 3000!'));
