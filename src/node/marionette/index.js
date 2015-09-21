var Backbone     = require('./../backbone');
var Marionette   = require('backbone.marionette');

Marionette.isNodeAttached = function(el) {
  return Backbone.$.contains( Backbone.ctx.document.documentElement, el);
};
