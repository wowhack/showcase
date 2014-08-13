var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch')
    minify = require('gulp-minify-css'),
    path = require('path'),
    app = require('./app'),
    gutil = require('gulp-util')

var paths = {
  css: gulp.dest('public/css'),
  scss: gulp.src('public/stylesheets/*.scss')
}

var buildSass = function() {
  paths.scss
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(minify({ cache: true }))
    .pipe(paths.css)
}

gulp.task('default', ['serve'])

gulp.task('css', buildSass)

gulp.task('serve', ['watch', 'server'])

gulp.task('server', function() {
  app.set('port', process.env.PORT || 3000)

  var server = app.listen(app.get('port'), function() {
    gutil.log('Express server listening on port ' + server.address().port)
  })
})

gulp.task('watch', function() {
  paths.scss
    .pipe(watch())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(paths.css)
})
