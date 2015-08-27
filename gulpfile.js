var path = require("path");
var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");

var serverConfig = require(path.resolve("config/server.dev"))
var webpackConfig = require(path.resolve("config/webpack.dev"))

gulp.task("dev", ["server", "dev-server"]);

gulp.task("server", function() {
  nodemon({
    script: "index",
    watch: [
      "src/node_modules/**/_server/**/*.js",
      "src/node_modules/**/_shared/**/*.js"
    ]
  });
});

gulp.task("dev-server", function() {
  var compiler = webpack(webpackConfig);
  var devServer = new WebpackDevServer(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      assets: false,
      chunkModules: false
    }
  });
  devServer.listen(serverConfig.devPort, function() {
    console.log("Dev server running at port " + devServer.io.httpServer.address().port);
  });
});
