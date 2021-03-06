import gulp from "gulp"
import plumber from "gulp-plumber"
import cache from "gulp-cached"
import count from "gulp-count"
import eslint from "gulp-eslint"
import forEach from "gulp-foreach"
import nodemon from "gulp-nodemon"
import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import {createLogger} from "bunyan"
import beep from "beepbeep"
import config from "./node_modules/app/config"
import webpackConfig from "./webpack"

const log = createLogger({name: "gulp"})

function handleError() {
  return plumber(function(error) {
    log.error(error)
    beep()
    this.emit("end")
  })
}

gulp.task("dev", ["watch", "server", "dev-server"])

gulp.task("lint", () => {
  const cacheName = "lint"
  return gulp.src(["src/**/*.js", "!src/node_modules/app/lib/**/*.js"])
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
      "src/node_modules"
    ],
    ignore: [
      "src/node_modules/app/lib",
      "src/node_modules/app/web"
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
    log.info({
      webpack: `http://${config.webpack.host}:${config.webpack.port}`
    })
  })
})
