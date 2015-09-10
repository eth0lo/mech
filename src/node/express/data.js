var Backbone = require('../backbone');

module.exports = function(req, res, next) {
  req.appData = {};

  req.when = function() {
    var args = [].slice.apply(arguments);
    var deferreds = args.map(function(model) {
      return model._deferred;
    });

    return Backbone.$.when.apply(Backbone.$, deferreds);
  }

  next();
}
