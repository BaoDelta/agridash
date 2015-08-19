var path = require("path");

module.exports = {
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
      }
    ]
  }
};
