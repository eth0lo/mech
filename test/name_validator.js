var test  = require('tape-catch');
var sinon = require('sinon');

var mech  = require('../src/node');

test('constructor', function(t) {
  var NotThrowingModel = mech.Model.extend({
    name: 'modelOne'
  });

  var ThrowingModel = mech.Model.extend({
  });

  function createModel(Model) {
    return function() {
      new Model()
    };
  }

  t.doesNotThrow(createModel(NotThrowingModel));
  t.throws(createModel(ThrowingModel));
  t.end();
});
