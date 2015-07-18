var Backbone      = require('backbone');
var document      = require('jsdom').jsdom();
var window        = document.parentWindow;
var $             = require('jquery')(window);
var View          = Backbone.View;

Backbone.$ = $;

var Virtual = View.extend({
  _createElement: function(tagName) {
    return document.createElement(tagName);
  }
});

Backbone.View = Virtual;
Backbone.ViewContext = document;

module.exports = Backbone;
