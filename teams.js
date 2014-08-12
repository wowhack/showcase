// Deps
var
  request = require('request')
  fs = require('fs')
  Promise = require('es6-promise').Promise
  util = require('util')

function compile (string, key) {
  return string.replace('@', key);
}

// Github endpoints
var gh = {
  teams: compile.bind(null, 'https://api.github.com/orgs/wowhack/teams'),
  members: compile.bind(null, 'https://api.github.com/teams/@/members'),
  repos: compile.bind(null, 'https://api.github.com/teams/@/repos')
}

var winnerIDs = JSON.parse(fs.readFileSync('./winners.json'));
var auth = JSON.parse(fs.readFileSync('./auth.json'));

// Request options
var options = {
  auth: auth,
  headers: {
    // Github best practices proposes this
    "User-Agent": "wowhack-showcase"
  }
}


// TODO, populate with repository data etc.
function populate (team) {

  return new Promise(function (resolve, reject) {
    request.get(gh.members(team.id), options, function (req, res, body) {
      var members = JSON.parse(body);
      team.members = members;
      resolve(team.id);
    });
  });
}

// Fetch and group teams by winners and others
function fetchTeams (callback) {
  request.get(gh.teams(), options, function (req, res, body) {
    var teams;
    try {
      teams = JSON.parse(body);
    } catch (e) {
      callback({ error: e })
    }

    var winners = [];
    var others = [];
    var populationRequests = [];

    teams.forEach(function (team) {
      if (winnerIDs.indexOf(team.id) >= 0) {
        winners.push(populate(team))
      } else {
        others.push(populate(team))
      }

      populationRequests.push(populate(team));
    })

    console.assert(winners.length === 3, winners)

    // We should cache the result and send modified since headers
    var result = {
      winners: winners,
      others: others
    };

    Promise.all(populationRequests).then(function () {
      callback(result)
    });
  });
}

fetchTeams(function () {
  console.log(arguments)
})

module.exports = {
  loadTeams: fetchTeams
}

