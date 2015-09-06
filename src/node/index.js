var Backbone = require('./backbone');
var data     = require('./express/data');
var render   = require('./express/render');

module.exports = {
  Backbone:   Backbone,
  middleware: {
    data: {
      helpers: data
    },
    render: {
      helpers: render
    }
  }
};
