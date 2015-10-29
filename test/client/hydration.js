var test  = require('tape-catch');
var sinon = require('sinon');

var modelOneResponse = {model: 'one'};
var modelTwoResponse = {model: 'two'};

window.bootstrap = {
  modelOne: modelOneResponse,
  modelTwo: modelTwoResponse
};

var mech     = require('../../src/client');
var Backbone = require('backbone');

test('#hydrate', function (t) {
  var fetchSpy = sinon.spy(Backbone.Model.prototype, 'fetch');

  var ModelOne = mech.Model.extend({
    name: 'modelOne',
    url: 'http://sample.com/one'
  });
  var modelOne = new ModelOne();

  modelOne.fetch();
  t.deepEqual(modelOne.toJSON(), modelOneResponse, 'the json representation is the same that was in node');
  t.deepEqual(window.bootstrap, {modelTwo: modelTwoResponse}, 'only deletes the hydrated value');
  t.ok(Backbone.Model.prototype.fetch.notCalled, 'it does not generate a xhr request when hydrating');

  modelOne.fetch();
  t.ok(Backbone.Model.prototype.fetch.called, 'after hydration it should behave as a regular Backbone model');


  var ModelTwo = mech.Model.extend({
    name: 'modelTwo',
    url: 'http://sample.com/two'
  });

  var modelTwo = new ModelTwo();
  modelTwo.fetch();

  t.deepEqual(modelTwo.toJSON(), modelTwoResponse, 'the json representation is the same that was in node');
  t.deepEqual(window.bootstrap, {}, 'deletes the remaining objects');

  t.end();
});
