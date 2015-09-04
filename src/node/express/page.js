var domino   = require('domino');
var Backbone = require('../backbone');
var Layout   = require('./layout');

function Page(app, req, res) {
  this.components = {};
  this.res        = res;
  this.app        = app;
}

Page.prototype.component = function(view) {
  this.components.main = view;
  return this;
};

Page.prototype.content = Page.prototype.component;

Page.prototype.finish = function() {
  this.res.send(this.html());
  return this;
};

Page.prototype.layout = function(layoutName) {
  this.layout = layoutName;
  return this;
};

Page.prototype.region = function(region) {
  this.components[region] = this.components.main;
  this.components.main = undefined;
  return this;
};

Page.prototype.html = function() {
  var page = this.render();
  var html = page.outerHTML;

  return html;
};

Page.prototype.render = function() {
  var layout = new Layout(this.app);
  var html   = layout.html();
  var document, mainRegion, view, window;

  window     = domino.createWindow(html);
  document   = window.document;
  view       = this.components.main.render().el;
  mainRegion = document.querySelector('[data-region="main"]');

  mainRegion.innerHTML = view.outerHTML;
  // Clean up the Rendering context of Backbone's views;
  this.components.main.el = null;
  return document;
};

Object.defineProperty(Page.prototype, 'and', {
  get: function() {
    return this;
  }
});

Object.defineProperty(Page.prototype, 'in', {
  get: function() {
    return this;
  }
});

Object.defineProperty(Page.prototype, 'with', {
  get: function() {
    return this;
  }
});

module.exports = Page;
