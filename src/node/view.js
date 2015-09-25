var window       = require('./window');
var Marionette   = require('backbone.marionette');
var OriginalView = Marionette.LayoutView;

var View = OriginalView.extend({
  _createElement: function(tagName) {
    return window.document.createElement(tagName);
  }
})

module.exports = View;
