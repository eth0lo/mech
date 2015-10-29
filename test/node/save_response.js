var test  = require('tape-catch');
var sinon = require('sinon');
var nock  = require('nock');

var mech  = require('../../src/node');

test('#raw', function(t) {
  var ModelOne = mech.Model.extend({
    name: 'modelOne',
    url: 'http://sample.com/one'
  });

  var response =  {model: 'one'};
  nock('http://sample.com')
    .get('/one')
    .reply(200,response);

  var modelOne = new ModelOne();
  modelOne.fetch({
    success: function() {
      t.deepEqual(modelOne.raw, response)
    }
  });

  t.end();
});
