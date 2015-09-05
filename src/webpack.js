import path from "path"
import fs from "fs"
import toml from "toml"
import webpack from "webpack"
import SplitByPathPlugin from "webpack-split-by-path"

const config = toml.parse(fs.readFileSync(path.resolve("conf/dev.toml"), "utf8"))

let app = [path.resolve("src/node_modules/app/_client/index.js")]
if (config.webpack.port) {
  app = [
    ...app,
    "webpack-dev-server/client?http://" + config.webpack.host + ":" + config.webpack.port,
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
