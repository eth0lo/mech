var Backbone = require('./backbone');
var helpers  = require('./express/helpers');
var auto     = require('./express/default');

module.exports = {
  Backbone:   Backbone,
  middleware: {
    render: {
      helpers: helpers,
      default: auto
    }
  }
};
