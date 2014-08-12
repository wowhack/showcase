// Deps
var
  request = require('request')
  fs = require('fs'),
  Promise = require('es6-promise').Promise,
  util = require('util'),
  us = require('underscore'),
  debug = console.log.bind(console),

  OWNERS_ID = 919870

function compile (string, key) {
  return string.replace('@', key);
}

// Github endpoints
var gh = {
  teams: compile.bind(null, 'https://api.github.com/orgs/wowhack/teams'),
  members: compile.bind(null, 'https://api.github.com/teams/@/members'),
  repos: compile.bind(null, 'https://api.github.com/teams/@/repos'),
  thumnbnail: compile.bind(null, process.env.HOST_NAME + '/thumbnails/@.png')
}

var winnerIDs = JSON.parse(fs.readFileSync('./winners.json'));
var auth = {
  user: process.env.GH_USER,
  pass: process.env.GH_PASS
};

// Request options
request = request.defaults({
  auth: auth,
  headers: {
    // Github best practices proposes this
    "User-Agent": "wowhack-showcase"
  }
})

function populator (url, key, fn) {
  return new Promise(function (resolve, reject) {
    debug('Sending populate request to ' + url)
    request.get(url, function (err, res, body) {
      var value = fn(body, (res || {}).statusCode);
      var result = {}
      result[key] = value
      debug('Resolving request to ' + url + ' with ' + result)
      resolve(result)
    });
  });
}


// TODO, populate with repository data etc.
function populate (team) {
  debug('Populating team ' + team.id)
  var populators = [];

  // Add team members
  populators.push(populator(gh.members(team.id), 'members', function (body) {
    return JSON.parse(body)
  }));

  // Repo data
  populators.push(populator(gh.repos(team.id), 'repository', function (body) {
    return JSON.parse(body)[0]
  }))

  // Image
  var tnUrl = gh.thumnbnail(team.id);
  populators.push(populator(tnUrl, 'thumbnail', function (body, statusCode) {
    return statusCode === 200 ? tnUrl : 'http://placehold.it/400x200'
  }))

  debug('Waiting for ' + populators.length + ' populations to finish')

  // Collect all info and return
  return Promise.all(populators).then(function (objects) {
    debug('Collecting info for team ' + team.id)
    return us.extend.apply(us, [team].concat(objects));
  })
}

// Fetch and group teams by winners and others
function fetchTeams (callback) {
  debug('Fetching teams')
  console.log('Fetching teams')
  request.get(gh.teams(), function (err, res, body) {
    var teams;
    try {
      teams = JSON.parse(body);
    } catch (e) {
      return callback({ error: e })
    }

    // Exclude owner team
    teams = us.reject(teams, function (team) {
      return team.id === OWNERS_ID
    })

    var populationRequests = teams.map(function (team) {
      debug('Starting population for team ' + team.id)
      return populate(team)
    })


    debug('Waiting for ' + populationRequests + ' FULL populations to finish')
    Promise.all(populationRequests).then(function (teams) {
      debug('All populations finished, found ' + teams.length + ' teams')
      var winners = [];
      var others = [];

      // Categories winning teams
      teams.forEach(function (team) {
        if (winnerIDs.indexOf(team.id) >= 0) {
          winners.push(team)
        } else {
          others.push(team)
        }
      })

      // We know how the outcome :)
      console.assert(winners.length === 3, winners)

      // We should cache the result and send modified since headers
      var result = {
        winners: winners,
        others: others
      };

      callback(result)
    });
  });
}

module.exports = {
  loadTeams: fetchTeams
}

