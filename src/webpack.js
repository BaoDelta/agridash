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
    noParse: [
      path.resolve("src/node_modules/app/web/vendors")
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: "react-hot!babel",
        include: path.resolve("src"),
        exclude: path.resolve("src/node_modules/app/web/vendors")
      },
      {
        test: /\.css$/,
        loader: "style!css?modules&localIdentName=[name]-[local]--[hash:base64:7]",
        include: path.resolve("src"),
        exclude: path.resolve("src/node_modules/app/web/vendors")
      },
      {
        test: /\.css$/,
        loader: "style!css",
        include: path.resolve("node_modules")
      },
      {
        test: /\.css$/,
        loader: "style!css",
        include: path.resolve("src/node_modules/app/web/vendors")
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
          path.resolve("src/node_modules/app/web/vendors")
        ]
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

export default webpackConfig
