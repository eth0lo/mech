module.exports = function(options) {
  options = options || {};

  var defaultLayout = options.defaultLayout || 'layout/default';

  return function(req, res, next) {
    res.viewData = {};

    res.component = function(region, view) {
      res.viewData[region] = view;
    }

    var oldRender = res.render;
    res.render = function(view, options) {
      options = options = {};
      res.viewData.content = view;

      var viewData = res.viewData;
      var contentView = viewData.content;
      var contentCollection = contentView.collection;
      var contentHtml = contentView.render().el.outerHTML;

      options.content = contentHtml;
      options.bootstrap = {
        content: {
          collection: contentCollection.toJSON()
        }
      }

      oldRender.call(res, defaultLayout, options);
    }
    next();
  }
}
