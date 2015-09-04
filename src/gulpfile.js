import path from "path"
import fs from "fs"
import toml from "toml"
import gulp from "gulp"
import gutil from "gulp-util"
import plumber from "gulp-plumber"
import cache from "gulp-cached"
import count from "gulp-count"
import eslint from "gulp-eslint"
import forEach from "gulp-foreach"
import nodemon from "gulp-nodemon"
import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"

const config = toml.parse(fs.readFileSync(path.resolve("conf/dev.toml"), "utf8"))
const webpackConfig = require(path.resolve("src/webpack"))

function handleError() {
  return plumber(err => {
    gutil.beep()
    gutil.log(err.toString())
    this.emit("end")
  })
}

gulp.task("dev", ["watch", "server", "dev-server"])

gulp.task("lint", () => {
  const cacheName = "lint"
  return gulp.src(["src/**/*.js"])
    .pipe(handleError())
    .pipe(cache(cacheName))
    .pipe(count("Linting ## files..."))
    .pipe(eslint())
    .pipe(forEach((stream, file) => {
      if (file.eslint && file.eslint.messages && file.eslint.messages.length) {
        delete cache.caches[cacheName][file.path]
      }
      return stream
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task("watch", ["lint"], () => {
  gulp.watch(["src/**/*.js"], ["lint"])
})

gulp.task("server", () => {
  nodemon({
    script: "index",
    watch: [
      "src/node_modules/**/_server/**/*.js",
      "src/node_modules/**/_shared/**/*.js"
    ]
  })
})

gulp.task("dev-server", () => {
  const compiler = webpack(webpackConfig)
  const devServer = new WebpackDevServer(compiler, {
    publicPath: config.webpack.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      assets: false,
      chunkModules: false
    }
  })
  devServer.listen(config.webpack.port, () => {
    console.log("Dev server running at port " + devServer.io.httpServer.address().port)
  })
})
