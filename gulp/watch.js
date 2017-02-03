const path = require('path')
const gulp = require('gulp')
const conf = require('./conf')

const browserSync = require('browser-sync')

const isOnlyChange = (event) => {
  return event.type === 'changed'
}

gulp.task('watch', ['inject'], () => {

  gulp.watch([
    path.join(conf.paths.src, '/*.html'),
    'bower.json'
  ], ['inject-reload'])

  gulp.watch([
    path.join(conf.paths.src, '/css/**/*.css'),
    path.join(conf.paths.src, '/css/**/*.scss')
  ], (event) => {
    if (isOnlyChange(event)) {
      gulp.start('styles-reload')
    } else {
      gulp.start('inject-reload')
    }
  })

  gulp.watch(path.join(conf.paths.src, '/js/**/*.js'), (event) => {
    if (isOnlyChange(event)) {
      gulp.start('scripts-reload')
    } else {
      gulp.start('inject-reload')
    }
  })

  gulp.watch(path.join(conf.paths.src, '/views/**/*.html'), (event) => {
    browserSync.reload(event.path)
  })
})
