const del = require('del');
const path = require('path');
const gulp = require('gulp');
const file = require('gulp-file');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const nunjucksRender = require('gulp-nunjucks-render');
const wrap = require('gulp-wrap');
const concat = require('gulp-concat');
const declare = require('gulp-declare');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const argv = require('yargs').argv;
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const paths = require('./config.json').paths;

function isProduction() {
  return argv.production;
}

function logBuildMode() {
  if (isProduction()) {
    gutil.log(gutil.colors.green('Running production build...'));
  } else {
    gutil.log(gutil.colors.yellow('Running development build...'));
  }
}

function clean() {
  return del([paths.build + '**/']);
}

gulp.task('clean', clean);

gulp.task('js', function () {
  return gulp.src('./src/scripts/main.js')
    .pipe(sourcemaps.init())
    .pipe(webpackStream(webpackConfig))
    .pipe(sourcemaps.write(paths.build + 'scripts'))
    .pipe(gulp.dest(paths.build + 'scripts'))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write(paths.build + 'css'))
    .pipe(gulp.dest(paths.build + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('render:templates', () => {
  return gulp.src(paths.pages)
    .pipe(nunjucksRender({
        path: ['src/templates/pages']
      }))
    .pipe(gulp.dest(paths.build + 'templates/pages'))
    .pipe(browserSync.stream());
});

gulp.task('copy:images', () => {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.build + 'images'));
});

gulp.task('copy:components', () => {
  return gulp.src(paths.components)
    .pipe(gulp.dest(paths.build + 'templates/components'));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    port: 3030,
    server: {
      baseDir: "dist",
      index: "templates/pages/index.html"
    }
  });

  gulp.watch(paths.build).on('change', browserSync.reload);
});

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['js']);
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.pages, ['render:templates']);
  gulp.watch(paths.components, ['copy:components']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['js', 'sass', 'copy:components', 'copy:images', 'render:templates', 'watch', 'browser-sync']);
