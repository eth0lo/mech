var Backbone    = require('./backbone');
var middleware  = require('./express/render_middleware');

module.exports = {
  Backbone:   Backbone,
  express: {
    middleware: {
      render: {
        helpers: middleware
      }
    }
  }
};
