var Backbone     = require('./backbone');
var Marionette   = require('backbone.marionette');
var OriginalView = Marionette.LayoutView;

var View = OriginalView.extend({
  _createElement: function(tagName) {
    return Backbone.ctx.document.createElement(tagName);
  }
})

module.exports = View;
