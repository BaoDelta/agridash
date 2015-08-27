var path = require("path");
var webpack = require("webpack");
var SplitByPathPlugin = require("webpack-split-by-path");
var serverConfig = require("./server.dev");

module.exports = {
  devtool: "cheap-module-eval-source-map",
  entry: {
    app: [
      path.resolve("src/node_modules/app/_client/index.js"),
      "webpack-dev-server/client?http://" + serverConfig.connection.host + ":" + serverConfig.devPort,
      "webpack/hot/only-dev-server"
    ]
  },
  output: {
    path:  path.resolve("public/build"),
    publicPath: "/public/build/",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "react-hot!babel",
        include: path.resolve("src")
      },
      {
        test: /\.css$/,
        loader: "style!css?modules&localIdentName=[name]-[local]--[hash:base64:7]",
        include: path.resolve("src")
      }
    ]
  },
  plugins: [
    new SplitByPathPlugin([
      {
        name: "vendors",
        path: path.resolve("node_modules")
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
