var viewContext = require('./view_context');
var $           = require('./jquery');
var Backbone    = require('./backbone');
var middleware  = require('./express/render_middleware');
var viewEngine  = require('./express/view_engine');

module.exports = {
  Backbone:   Backbone,
  $:          $,
  express: {
    middleware: middleware,
    viewEngine: viewEngine
  },
  viewContext: viewContext
};
