const path = require('path')
const gulp = require('gulp')
const conf = require('./conf')

const $ = require('gulp-load-plugins')()
const _ = require('lodash')
const wiredep = require('wiredep').stream

const browserSync = require('browser-sync')

gulp.task('inject-reload', ['inject'], function () {
  browserSync.reload()
})

gulp.task('inject', ['scripts', 'styles'], function () {
  const injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false })

  const injectScripts = gulp
    .src([
      path.join(conf.paths.src, '/js/**/*.module.js'),
      path.join(conf.paths.src, '/js/**/*.js'),
      path.join('!' + conf.paths.src, '/js/**/main.js'),
      path.join('!' + conf.paths.src, '/js/**/*.spec.js'),
      path.join('!' + conf.paths.src, '/js/**/*.mock.js'),
    ])
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'))

  const injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  }

  return gulp
    .src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')))
})
