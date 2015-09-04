var Page     = require('./page');
var Backbone = require('../backbone');

module.exports = function(req, res, next) {
  var page = new Page(req.app, req, res);
  res.page = page;
  res.locals.page = page;

  req.when = function() {
    return Backbone.$.when.apply(Backbone.$, arguments);
  }

  next();
}