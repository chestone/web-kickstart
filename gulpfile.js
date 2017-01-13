var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var rollup = require('gulp-rollup');
var sass = require('gulp-sass');
var babel = require('rollup-plugin-babel');

gulp.task('rollup', function () {
  gulp.src(["./src/**/*.js"])
  .pipe(sourcemaps.init())
  .pipe(rollup({
    entry: "./src/main.js",
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dist/'));
});

var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
