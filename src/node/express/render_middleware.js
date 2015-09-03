var Page = require('./page');
var Renderer   = require('./renderer');

module.exports = function(req, res, next) {
  var page = new Page(res);
  res.page = page;
  res.locals.page = page;

  var renderer = new Renderer(req.app);
  res.locals.renderer = renderer;
  next();
}