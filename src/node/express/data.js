var Backbone = require('../backbone');

function when() {
  var args = [].slice.apply(arguments);
  var deferreds = args.map(function(model) {
    return model._deferred;
  });

  return Backbone.$.when.apply(Backbone.$, deferreds);
};

module.exports = function(req, res, next) {
  req.appData = {};
  res.appData = {};

  req.when = when;
  res.when = when;

  next();
}
