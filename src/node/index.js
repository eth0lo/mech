var Backbone       = require('./backbone');
var Marionette     = require('./marionette');
var window         = require('./window');

var Collection     = require('./collection');
var Model          = require('./model');

var CollectionView = require('./view_collection');
var View           = require('./view');

var data           = require('./express/data');
var render         = require('./express/render');


module.exports = {
  Collection: Collection,
  Model: Model,

  CollectionView: CollectionView,
  View: View,

  middleware: {
    data: {
      helpers: data
    },
    render: {
      helpers: render
    }
  },

  Backbone: Backbone,
  Marionette: Marionette,

  window: window
};
