var path        = require('path');
var jade        = require('jade');
var viewContext = require('../view_context');

var instance;

function Renderer(app) {
  if (instance) return instance;

  this.express = app;
  this.viewsDir = this.express.get('views');
  this.layoutDir = path.join(this.viewsDir, 'layout');

  this.setLayoutPath();
  this.createRenderContext();

  instance = this;
}

Renderer.prototype.createRenderContext = function() {
  this.renderLayout();
  this.updateContext();
};

Renderer.prototype.renderLayout = function() {
  this.layout = jade.renderFile(this.layoutPath);
};

Renderer.prototype.setLayoutPath = function() {
  this.layoutPath = path.join(this.layoutDir, 'default.jade');
};

Renderer.prototype.updateContext = function() {
  viewContext.load(this.layout);
};

Renderer.prototype.page = function() {
  return viewContext.document;
};

Renderer.prototype.dismiss = function() {
  instance = undefined;
};

module.exports = Renderer;
