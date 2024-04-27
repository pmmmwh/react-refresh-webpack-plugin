const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const path = require('path');

const app = express();
const compiler = webpack(config);

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

app.get("*", (req, res, next) => {
  const filename = path.join(compiler.outputPath, "index.html");
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set("content-type", "text/html");
    res.send(result);
    res.end();
  });
});



app.listen(8080, () => console.log('App is listening on port 8080!'));
