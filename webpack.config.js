const path = require('path');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: "cheap-eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }
        ]
      }
    ]
  }
};
