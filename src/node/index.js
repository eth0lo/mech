var Backbone    = require('./backbone');
var data        = require('./express/data');
var render      = require('./express/render');
var Model       = require('./model');
var Collection  = require('./collection');

module.exports = {
  Model: Model,
  Collection: Collection,
  Backbone: Backbone,
  middleware: {
    data: {
      helpers: data
    },
    render: {
      helpers: render
    }
  }
};
