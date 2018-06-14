var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
// minificar JS
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
// minificar css
var cssnano = require('gulp-cssnano');
// Limpiar
var del = require('del');
// para correr tareas en secuencias
var runSequence = require('run-sequence');

var scsslint = require('gulp-scss-lint');

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
  .pipe(scsslint({
    'config': 'lint.yml'
  }))
  .pipe(sass()) // Using gulp-sass
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
  .pipe(useref())
  // Minifies only if it's a JavaScript file
  .pipe(gulpIf('*.js', uglify()))
  // Minifies only if it's a CSS file
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', function (callback){
  runSequence('clean', ['sass', 'useref', 'fonts'], callback);
  console.log('Building files');
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'watch'], callback);
});

// Para cambiar dinamicamente los archivos que se cambian segun el src
// gulp.watch('app/scss/**/*.scss', ['sass']); 
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});
