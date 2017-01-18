const del = require('del');
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
const rollup = require('gulp-rollup');
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const uglify = require('rollup-plugin-uglify');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const browserSync = require('browser-sync').create();
const argv = require('yargs').argv;

const paths = require('./src/config.json').paths;

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
  return gulp.src(paths.scripts)
    .pipe(rollup(
      {
        entry: 'src/scripts/main.js',
        dest: 'dist/scripts/main.js',
        format: 'iife',
        sourceMap: 'inline',
        plugins: [
          resolve({
            jsnext: true,
            main: true,
            browser: true,
          }),
          commonjs(),
          eslint({
            exclude: [
              'src/styles/**',
            ]
          }),
          babel({
            exclude: 'node_modules/**',
          }),
          rollupIncludePath({paths: ['src/scripts']})
        ],
      }
    ));
});

gulp.task('js', function () {
  gulp.src(paths.scripts)
  .pipe(rollup({
    allowRealFiles: true,
    entry: 'src/scripts/main.js',
    sourceMap: 'inline',
    format: 'umd',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup']
      }),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs()
    ],
  }))
  .pipe(gulp.dest(paths.build + 'scripts'));
})

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
      baseDir: "dist",
      index: "pages/index.html"
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
