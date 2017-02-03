const path = require('path')
const gulp = require('gulp')
const conf = require('./conf')

const browserSync = require('browser-sync')

const $ = require('gulp-load-plugins')()


gulp.task('scripts-reload', () => {
  return buildScripts().pipe(browserSync.stream())
})

gulp.task('scripts', () => {
  return buildScripts()
})

const buildScripts = () => {
  return gulp
    .src([
      path.join(conf.paths.src, '/js/**/*.js'),
      path.join('!' + conf.paths.src, '/js/vendors/**/*.js')
    ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size())
}
