var _ = require('underscore');


var requestLocales = function(locale) {
  return _.omit(locale, ['page', 'renderer']);
}

var requestComponents = function(locale) {
  return locale._locals.page;
}

var requestRenderer = function(locale) {
  return locale._locals.renderer;
}

module.exports = function (filePath, options, callback) {
  var components = requestComponents(options);
  var locales    = requestLocales(options);
  var page       = requestRenderer(options);

  var View = require(filePath);
  var view = new View(locales);

  var document = page.document();
  var main     = document.querySelector('[data-region="main"]');

  main.appendChild(view.render().el)
  var html = document.outerHTML;

  main.innerHTML = '';
  return callback(null, html);
};
