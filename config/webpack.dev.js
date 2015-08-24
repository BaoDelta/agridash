var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: "cheap-source-map",
  entry: {
    app: [path.resolve("src/node_modules/app/_client/index.js")]
  },
  output: {
    path: "./public/build",
    publicPath: "/public/build/",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        include: path.resolve("src")
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css?modules&localIdentName=[name]-[local]--[hash:base64:7]"),
        include: path.resolve("src")
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("[name].css")
  ]
};
