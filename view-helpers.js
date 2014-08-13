var Handlebars = require('handlebars')

module.exports = {
  cleanUrl: function(url) {
    return url && url.replace(/https?:\/\//, '')
  },
  contentOr: function(str, opt) {
    str = Handlebars.Utils.escapeExpression(str)
    opt = Handlebars.Utils.escapeExpression(opt)
    return str ? str : new Handlebars.SafeString('<span class="no-content">'+opt+'</span>')
  }
}
