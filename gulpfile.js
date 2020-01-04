var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

const webp = require('imagemin-webp');
const extReplace = require('gulp-ext-replace');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./dist"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('src/images/*')
    .pipe(imagemin([
      webp({quality: 50})
    ]))
    .pipe(extReplace('.webp'))
    .pipe(gulp.dest('dist/images/'))
});

gulp.task('styles', function(){
  gulp.src(['src/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('views', function buildHTML() {
  return gulp.src('views/*.pug')
  .pipe(pug({
    // Your options in here.
    pretty: true
  }))
  .pipe(gulp.dest('dist/'))
});

gulp.task('default', ['images', 'browser-sync'], function(){
  gulp.watch("views/*.pug", ['views']);
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("*.pug", ['bs-reload']);
});
