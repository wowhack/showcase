var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify-css'),
    path = require('path'),
    app = require('./app'),
    gutil = require('gulp-util')

var buildSass = function() {
  return gulp.src('public/stylesheets/*.scss')
    .pipe(sass())
    .pipe(minify({ cache: true }))
    .pipe(gulp.dest('public/css'))
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
  return gulp.watch('public/stylesheets/*.scss', ['css'])
})
