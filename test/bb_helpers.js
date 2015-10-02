var _        = require('underscore');
var mech     = require('../src/node');

var window   = mech.window;
var doc      = window.document;
var div      = doc.createElement('div');
var h1       = doc.createElement('h1');

module.exports.document = doc;

function createTestNode() {
  div.id = 'testElement';
  h1.innerHTML = 'Test';

  div.appendChild(h1);
  doc.body.appendChild(div);
}
module.exports.createTestNode = createTestNode;

function destroyTestNode() {
  doc.body.removeChild(div);
}
module.exports.destroyTestNode = destroyTestNode;

function createTestView() {
  return new mech.View({
    id        : 'test-view',
    className : 'test-view',
    other     : 'non-special-option'
  });
}
module.exports.createTestView = createTestView;
