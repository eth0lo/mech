var window   = require('./window');
var $        = require('./jquery');
var Backbone = require('backbone');

Backbone.$ = $;

// Modify Backbone to be able to render server side
Backbone.View.prototype._createElement = function(tagName) {
    return window.document.createElement(tagName);
}

Backbone.ViewContext = window.document;

module.exports = Backbone;
