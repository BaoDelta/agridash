import path from "path"
import webpack from "webpack"
import SplitByPathPlugin from "webpack-split-by-path"
import config from "./node_modules/app/config"

let app = [path.resolve("src/node_modules/app/web/client.js")]
if (config.webpack.port) {
  app = [
    ...app,
    `webpack-dev-server/client?http://${config.webpack.host}:${config.webpack.port}`,
    "webpack/hot/only-dev-server"
  ]
}

const {publicPath, ignoreStyles} = config.webpack

const webpackConfig = {
  devtool: "cheap-module-eval-source-map",
  entry: {
    app
  },
  output: {
    publicPath,
    path: path.resolve(publicPath),
    filename: "[name].js",
    chunkFilename: "[name].js"
  },
  module: {
    noParse: [
      path.resolve("src/node_modules/app/lib")
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: "react-hot!babel",
        include: path.resolve("src"),
        exclude: path.resolve("src/node_modules/app/lib")
      },
      {
        test: /\.css$/,
        loader: ignoreStyles ? "raw" : "style!css?modules&localIdentName=[name]-[local]--[hash:base64:7]",
        include: path.resolve("src"),
        exclude: path.resolve("src/node_modules/app/lib")
      },
      {
        test: /\.css$/,
        loader: ignoreStyles ? "raw" : "style!css",
        include: path.resolve("src/node_modules/app/lib")
      },
      {
        test: /\.css$/,
        loader: ignoreStyles ? "raw" : "style!css",
        include: path.resolve("node_modules")
      },
      {
        test: /\.(png|jpg)$/,
        loader: "url-loader?limit=10000"
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new SplitByPathPlugin([
      {
        name: "vendors",
        path: [
          path.resolve("node_modules"),
          path.resolve("src/node_modules/app/lib")
        ]
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

export default webpackConfig
