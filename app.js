var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser')
    Handlebars  = require('express-handlebars'),
    viewHelpers = require('./view-helpers')

var routes = require('./routes')

var app = express()

var hbs = Handlebars.create({
  defaultLayout: 'main',
  helpers: viewHelpers
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(favicon(__dirname + '/public/images/favicon.png'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

if(app.get('env') === 'production') {
  app.enable('view cache')
}

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})


module.exports = app
