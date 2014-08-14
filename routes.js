var route = require('express').Router()
var Teams = require('./lib/teams')

/* GET / */
route.get('/', function(req, res) {
  Teams.loadTeams(res.render.bind(res, 'index'));
})

module.exports = route
