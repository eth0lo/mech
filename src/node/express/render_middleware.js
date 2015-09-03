var Components = require('./components');
var Renderer   = require('./renderer');

module.exports = function(req, res, next) {
  var components = new Components();
  res.page = components;
  res.locals.components = components;

  var renderer = new Renderer(req.app);
  res.locals.renderer = renderer;
  next();
}