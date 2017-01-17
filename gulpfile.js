const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const nunjucksRender = require('gulp-nunjucks-render');
const wrap = require('gulp-wrap');
const concat = require('gulp-concat');
const declare = require('gulp-declare');
const rename = require('gulp-rename');
const rollup = require('gulp-rollup');
const sass = require('gulp-sass');
const babel = require('rollup-plugin-babel');
const browserSync = require('browser-sync').create();
const argv = require('yargs').argv;

const {paths} = require('./src/config.json');

function serve() {
  const options = {
    server: {
      baseDir: paths.build
    },
    open: false
  };

  browserSync(options);
  gulp.watch(scripts);
}

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

function copyStatic() {
  return gulp.src(paths.build + '/**/*')
    .pipe(gulp.dest(paths.build));

}

gulp.task('clean', clean);

gulp.task('js', () => {
  return gulp.src([paths.scripts])
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
  .pipe(gulp.dest(paths.build))
  .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.build + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('templates', () => {
  return gulp.src(paths.templates)
    .pipe(nunjucksRender({
        path: ['src/templates']
      }))
    .pipe(gulp.dest(paths.build))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/pages/"
        }
    });

    gulp.watch(paths.build).on('change', browserSync.reload);
});

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['js']);
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['sass', 'js', 'templates', 'watch', 'browser-sync']);
