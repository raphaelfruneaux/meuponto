const path = require('path')
const gulp = require('gulp')
const conf = require('./conf')

const $ = require('gulp-load-plugins')(conf.gulploadplugins)

gulp.task('partials', () => {
  return gulp
    .src([
      path.join(conf.paths.src, '/views/**/*.html'),
      path.join(conf.paths.tmp, '/serve/views/**/*.html'),
      path.join(conf.paths.tmp, '/serve/apps/**/*.html')
    ])
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: conf.moduleName,
      root: 'views'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'))
})

gulp.task('html', ['inject', 'partials'], () => {
  const partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false })
  const partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  }

  const htmlFilter = $.filter('*.html', { restore: true })
  const cssFilter = $.filter('**/*.css', { restore: true })
  const jsFilter = $.filter('**/*.js', { restore: true })

  return gulp
    .src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }))
})

gulp.task('other', () => {
  const fileFilter = $.filter((file) => {
    return file.stat.isFile()
  })

  return gulp
    .src([
      path.join(conf.paths.src, '/**/*'),
      path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
    ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
})

gulp.task('fonts', () => {
  return gulp
    .src([
      './bower_components/bootstrap-css/fonts/*.{eot,svg,ttf,woff,woff2}',
      './bower_components/components-font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'
    ])
    .pipe($.flatten())
    .pipe(gulp.dest(
      path.join(conf.paths.dist, '/fonts/')
    ));
})

gulp.task('clean', () => {
  return $.del([
    path.join(conf.paths.dist, '/'),
    path.join(conf.paths.tmp, '/')
  ])
})


gulp.task('build', ['html', 'other', 'fonts'])
