var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var runsequence = require('run-sequence');
var browsersync = require('browser-sync').create();
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');

var bundleConfig = require('./bundle.config')

gulp.task('sass', function () {
  return gulp.src('./src/css/style.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer())
    .pipe(gulp.dest('./src/css/'))
    .pipe(browsersync.stream());
});

gulp.task('browser-sync', function () {
  browsersync.init({
    server: {
      baseDir: './'
    },
    open: false
  });
});

gulp.task('bundle-html', function () {
  return gulp.src('./src/views/**.*html')
    .pipe(htmlmin({
      removeComments: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
    }))
    .pipe(templateCache({
      module: 'meuponto-app',
      root: 'views'
    }))
    .pipe(gulp.dest('./dist/js/'))
})

gulp.task('bundle-css', function () {
  return gulp.src(bundleConfig.bundle.main.styles)
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(concat('./styles.css'))
    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('bundle-js', function () {
  gulp.src(bundleConfig.bundle.vendor.scripts)
    .pipe(babel({
      presets: ['es2015'],
      minified: true,
      compact: true,
      sourceMaps: true
    }))
    .pipe(concat('./vendors.js'))
    .pipe(gulp.dest('./dist/js/'))

  gulp.src(bundleConfig.bundle.main.scripts)
    .pipe(babel({
      presets: ['es2015'],
      minified: true,
      compact: true,
      sourceMaps: true
    }))
    .pipe(ngAnnotate())
    .pipe(concat('./main.js'))
    .pipe(gulp.dest('./dist/js/'))
})

gulp.task('bundle', function () {
  runsequence('clean', 'bundle-js', 'bundle-html', 'bundle-css');

  return gulp.src(bundleConfig.copy)
    .pipe(gulp.dest('./dist/themes/'))

})

gulp.task('clean', function () {
  var del = require('del')
  return del('./dist/**/*')
})

gulp.task('default', function () {
  runsequence('sass', 'bundle', 'browser-sync');

  gulp.watch('./src/css/*.scss', ['sass', 'bundle-css']);
  gulp.watch(['./src/js/**/*.js', '!./src/js/vendors/**'], ['bundle-js'])
  gulp.watch('./src/views/**/*.html', ['bundle-html'])
  gulp.watch('**/*.html').on('change', browsersync.reload);
});
