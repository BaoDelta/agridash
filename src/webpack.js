import path from "path"
import webpack from "webpack"
import SplitByPathPlugin from "webpack-split-by-path"
import config from "./node_modules/app/config"

let app = [path.resolve("src/node_modules/app/client.js")]
if (config.webpack.port) {
  app = [
    ...app,
    `webpack-dev-server/client?http://${config.webpack.host}:${config.webpack.port}`,
    "webpack/hot/only-dev-server"
  ]
}

const webpackConfig = {
  devtool: "cheap-module-eval-source-map",
  entry: {
    app
  },
  output: {
    path: path.resolve(config.webpack.publicPath),
    publicPath: config.webpack.publicPath,
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
}

export default webpackConfig
