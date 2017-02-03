'use strict'

const path = require('path')
const gulp = require('gulp')
const conf = require('./conf')

const browserSync = require('browser-sync')
const browserSyncSpa = require('browser-sync-spa')

const util = require('util')

const proxyMiddleware = require('http-proxy-middleware')

const browserSyncInit = (baseDir, browser) => {
  browser = browser === undefined ? 'default' : browser

  let routes = null

  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    }
  }

  const server = {
    baseDir: baseDir,
    routes: routes
  }

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  })
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}))

gulp.task('serve', ['watch'], () => {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src])
})

gulp.task('serve:dist', ['build'], () => {
  browserSyncInit([
    path.join(conf.paths.dist, '/')
  ])
})
