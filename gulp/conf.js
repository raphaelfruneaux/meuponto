const gutil = require('gulp-util')

exports.moduleName = 'meuponto-app'

exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
}

exports.wiredep = {
  exclude: [],
  directory: 'bower_components',
  overrides: {
    "semantic": {
      "main": [
        "dist/semantic.css",
        "dist/semantic.js"
      ]
    }
  }
}

exports.gulploadplugins = {
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
}

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = (title) => {
  'use strict'

  return function (err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString())
    this.emit('end')
  }
}
