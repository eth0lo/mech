var Backbone    = require('./backbone');
var Marionette  = require('./marionette');
var data        = require('./express/data');
var render      = require('./express/render');
var Model       = require('./model');
var Collection  = require('./collection');
var View        = require('./view');

module.exports = {
  Model: Model,
  Collection: Collection,
  View: View,
  Backbone: Backbone,
  Marionette: Marionette,
  middleware: {
    data: {
      helpers: data
    },
    render: {
      helpers: render
    }
  }
};
