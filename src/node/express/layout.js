var path         = require('path');
var fs           = require('fs');
var LAYOUT_CACHE = {};

var instance;

function Layout(app) {
  if (instance) return instance;
  this.app = app;

  this.loadLayout();
  instance = this;
}

Layout.prototype.loadLayout = function() {
  if(!LAYOUT_CACHE['default.html']) {
    var viewsDir  = this.app.get('views');
    var layoutDir = path.join(viewsDir, 'layout');
    var layout    = path.join(layoutDir, 'default.html');
    var html      = fs.readFileSync(layout, {encoding: 'utf-8'});
    LAYOUT_CACHE['default.html'] = html;
  }

  this.layout = LAYOUT_CACHE['default.html'];
};

Layout.prototype.html = function() {
  return this.layout;
};

Layout.prototype.dismiss = function() {
  instance = undefined;
};

module.exports = Layout;
