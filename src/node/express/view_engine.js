var _ = require('underscore');


var requestLocales = function(locale) {
  return _.omit(locale, ['components', 'renderer']);
}

var requestComponents = function(locale) {
  return locale._locals.components;
}

var requestRenderer = function(locale) {
  return locale._locals.renderer;
}

module.exports = function (filePath, options, callback) {
  var components = requestComponents(options);
  var locales    = requestLocales(options);
  var renderer   = requestRenderer(options);

  var View = require(filePath);
  var view = new View(locales);

  var page = renderer.page();
  var main = page.querySelector('[data-region="main"]');

  main.appendChild(view.render().el);
  return callback(null, page.outerHTML);
};
