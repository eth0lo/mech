var path = require('path');

module.exports = function(options) {
  options = options || {};

  var defaultLayout = options.defaultLayout || 'layouts/default';

  return function(req, res, next) {
    var viewRootPath  = req.app.get('views');
    var oldRender     = res.render;

    function bootstrapData(view, data) {
      if(view && view.model) {
        data[view.model.name] = view.model.raw;
      }

      if(view && view.collection) {
        data[view.collection.name] = view.collection.raw;
      }

      if(view && view.regionManager) {
        view.regionManager.each(function(region) {
          bootstrapData(region.currentView, data);
        });
      }

      return data;
    }


    res.render = function(viewPath, options, cb) {
      var mechViewPath = path.resolve(viewRootPath, viewPath);
      var View = require(mechViewPath);
      var view = new View(options);

      renderOptions = {};

      var contentHtml = view.render().el.outerHTML;

      renderOptions.content = contentHtml;
      renderOptions.bootstrap = bootstrapData(view, {});


      var args = [defaultLayout, renderOptions];
      if(cb) {
        args.push(cb);
      }
      oldRender.apply(res, args);
    }
    next();
  }
}
