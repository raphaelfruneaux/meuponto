var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var runsequence = require('run-sequence');
var browsersync = require('browser-sync').create();
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer')

var bundleConfig = require('./bundle.config')

gulp.task('sass', function(){
  console.log('----------------------');
  console.log("Salvando em: "+ 'css/style.css');
  console.log('----------------------');

  return gulp.src('./src/css/style.scss')
  	.pipe(sourcemaps.init())
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer())
  	.pipe(sourcemaps.write())
    .pipe(gulp.dest('./'))
    .pipe(browsersync.stream());
});

gulp.task('browser-sync', function () {
    browsersync.init({
        server: {
          baseDir: './'
        }
    });
});

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
    .pipe(concat('./main.js'))
    .pipe(gulp.dest('./dist/js/'))
})

gulp.task('bundle', function () {
  runsequence('clean', 'bundle-js', 'bundle-css');

  return gulp.src(bundleConfig.copy)
    .pipe(gulp.dest('./dist/themes/'))

})

gulp.task('clean', function () {
  var del = require('del')
  return del('./dist/**/*')
})

gulp.task('default', function() {
	runsequence('sass', 'bundle', 'browser-sync');
  
  gulp.watch('css/style.scss',['sass']);
  gulp.watch('index.html').on('change', browsersync.reload);
});
