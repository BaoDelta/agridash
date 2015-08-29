var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var plumber = require("gulp-plumber");
var cache = require("gulp-cached");
var count = require("gulp-count");
var eslint = require("gulp-eslint");
var forEach = require("gulp-foreach");
var nodemon = require("gulp-nodemon");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");

var serverConfig = require(path.resolve("config/server.dev"));
var webpackConfig = require(path.resolve("config/webpack.dev"));

function handleError() {
  return plumber(function(err) {
    gutil.beep();
    gutil.log(err.toString());
    this.emit("end");
  });
}

gulp.task("dev", ["watch", "server", "dev-server"]);

gulp.task("lint", function() {
  var cacheName = "lint";
  return gulp.src(["src/**/*.js"])
    .pipe(handleError())
    .pipe(cache(cacheName))
    .pipe(count("Linting ## files..."))
    .pipe(eslint())
    .pipe(forEach(function(stream, file) {
      if (file.eslint && file.eslint.messages && file.eslint.messages.length) {
        delete cache.caches[cacheName][file.path];
      }
      return stream;
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("watch", ["lint"], function() {
  gulp.watch(["src/**/*.js"], ["lint"]);
});

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
