var Backbone       = require('backbone');
var Marionette     = require('backbone.marionette');
var Model          = require('./model');
var Collection     = require('./collection');
var View           = require('./view');
var CollectionView = require('./collection_view');

module.exports = {
  Collection: Collection,
  Model: Model,

  CollectionView: CollectionView,
  View: View,

  Backbone: Backbone,
  Marionette: Marionette,
};
