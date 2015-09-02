var Components = require('./components');

module.exports = function(req, res, next) {
  var components = new Components();
  res.components = components;
  res.locals.components = components;
  next();
}