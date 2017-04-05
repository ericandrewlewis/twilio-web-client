require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const db = require('./db');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const router = require('./routes')({io});

const webpackCompiler = webpack(webpackConfig);

app.use(bodyParser.json());

// Use middleware to parse incoming form bodies
app.use(bodyParser.urlencoded({extended: false}));

app.use(
  webpackDevMiddleware(webpackCompiler, {
    stats: {colors: true}
  })
);

app.use(
  webpackHotMiddleware(webpackCompiler, {
    log: console.log
  })
);

app.use(router);

app.use(express.static('dist'));

http.listen(EXPRESS_PORT, () => {
  console.log(`Application listening on ${EXPRESS_PORT}`);
});
