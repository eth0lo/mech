var Backbone = require('../backbone');

module.exports = function(req, res, next) {
  req.appData = {};

  req.when = function() {
    return Backbone.$.when.apply(Backbone.$, arguments);
  }

  next();
}
