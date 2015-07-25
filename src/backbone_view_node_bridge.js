
module.exports = function(Backbone, $, document) {
  Backbone.$ = $;

  var View = Backbone.View;

	var Virtual = View.extend({
    _createElement: function(tagName) {
      return document.createElement(tagName);
    }
  });

  Backbone.View = Virtual;
  Backbone.ViewContext = document;

  Backbone = Backbone;
}
