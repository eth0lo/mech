var domino = require('domino');
var _      = require('underscore');

var viewContext = {
  _win: undefined,

  load: function(html) {
    this._win = domino.createWindow(html);
    _.extend(this, _.omit(this._win, 'document'));
  }
};

Object.defineProperty(viewContext, 'document', {
  get: function() {
    if(this._win) return this._win.document;

    this._win = domino.createWindow();
    _.extend(this, _.omit(this._win, 'document'));
    return this._win.document;
  },
  enumerable: true,
  configurable: true
});

module.exports = viewContext;
