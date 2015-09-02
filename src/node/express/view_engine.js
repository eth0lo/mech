var _ = require('underscore');

var requestLocales = function(locale) {
  return _.omit(locale, ['components']);
}

var requestComponents = function(locale) {
  return locale._locals.components;
}

module.exports = function (filePath, options, callback) {
  var components = requestComponents(options);
  var locales    = requestLocales(options)

  var View = require(filePath);
  var view = new View(locales);
  return callback(null, view.render().el.outerHTML);
};