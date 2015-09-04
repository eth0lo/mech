var domino    = require('domino');
var jQuery    = require('jquery');
var Backbone  = require('backbone');
var transport = require('./transport');
var window    = domino.createWindow();
var $         = jQuery(window);

$.ajaxTransport(transport);

Backbone.$   = $

// Modify Backbone to be able to render server side
Backbone.View.prototype._createElement = function(tagName) {
  return window.document.createElement(tagName);
}

module.exports = Backbone;
