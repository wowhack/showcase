// Deps
var
  request = require('request')
  fs = require('fs')

// Github endpoints
var gh = {
  teams_url: 'https://api.github.com/orgs/wowhack/teams'
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
  return team;
}

// Fetch and group teams by winners and others
function fetchTeams (callback) {
  request.get(gh.teams_url, options, function (req, res, body) {
    var teams;
    try {
      teams = JSON.parse(body);
    } catch (e) {
      callback({ error: e })
    }

    var winners = [];
    var others = teams;

    teams.forEach(function (team) {
      if (winnerIDs.indexOf(team.id) >= 0) {
        winners.push(populate(team))
      } else {
        others.push(populate(team))
      }
    })

    console.assert(winners.length === 3, winners)

    callback({
      winners: winners,
      others: others
    })
  });

}

module.exports = {
  loadTeams: fetchTeams
}

