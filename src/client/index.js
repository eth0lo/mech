var Backbone   = require('backbone');
var Marionette = require('backbone.marionette');
var Model      = require('./model');
var Collection = require('./collection');
var View       = require('./view');

module.exports = {
  Model: Model,
  Collection: Collection,
  View: View,
  Backbone: Backbone,
  Marionette: Marionette
};
