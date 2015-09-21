var path = require('path');

module.exports = function(options) {
  options = options || {};

  var defaultLayout = options.defaultLayout || 'layout/default';

  return function(req, res, next) {
    var viewRootPath  = req.app.get('views');
    var oldRender     = res.render;


    res.render = function(viewPath, options) {
      var mechViewPath = path.resolve(viewRootPath, viewPath);
      var View = require(mechViewPath);
      var view = new View(options);

      renderOptions = {};

      var contentHtml = view.render().el.outerHTML;

      renderOptions.content = contentHtml;
      renderOptions.bootstrap = {};

      if(view.model) {
        renderOptions.bootstrap[view.model.name] = view.model.raw;
      }

      if(view.collection) {
        renderOptions.bootstrap[view.collection.name] = view.collection.raw;
      }

      oldRender.call(res, defaultLayout, renderOptions);
    }
    next();
  }
}
