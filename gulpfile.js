const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('gulp-rollup');
const sass = require('gulp-sass');
const babel = require('rollup-plugin-babel');

const paths = {
  scripts: 'src/scripts/**/*.js',
  styles: 'src/styles/**/*.scss',
  templates: 'src/templates/**/*.scss',
  images: 'src/img/**/*'
};

gulp.task('rollup', function () {
  gulp.src(["./src/**/*.js"])
  .pipe(sourcemaps.init())
  .pipe(rollup({
    entry: "src/scripts/main.js",
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/'));
});

gulp.task('sass', function () {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.images, ['images']);
});


gulp.task('default', ['watch', 'sass', 'rollup']);
