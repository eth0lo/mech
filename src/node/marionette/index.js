var Backbone     = require('./../backbone');
var Marionette   = require('backbone.marionette');
var window       = require('./../window');

Marionette.isNodeAttached = function(el) {
  return Backbone.$.contains( window.document.documentElement, el);
};
