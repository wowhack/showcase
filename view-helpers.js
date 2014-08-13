var Handlebars = require('handlebars')

module.exports = {
  cleanUrl: function(url) {
    return url && url.replace(/https?:\/\//, '')
  },
  unSlugify: function(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase().replace(/[-|_](.)/g, function(match, group1) {
      return ' ' + group1.toUpperCase()
    })
  }
}
