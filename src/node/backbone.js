var viewContext = require('./view_context');
var $           = require('./jquery');
var Backbone    = require('backbone');

Backbone.$ = $;

// Modify Backbone to be able to render server side
Backbone.View.prototype._createElement = function(tagName) {
    return viewContext.document.createElement(tagName);
}

module.exports = Backbone;
