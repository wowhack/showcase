var route = require('express').Router()

/* GET / */
route.get('/', function(req, res) {
  res.render('index')
})

module.exports = route
