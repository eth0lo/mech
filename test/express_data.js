var test    = require('tape-catch');
var request = require('supertest');
var sinon   = require('sinon');
var nock    = require('nock');

var mech    = require('../src/node');
var express = require('express');

test('appData is present on req and res objects', function(t){
  var app = express();

  app.use(mech.middleware.data.helpers);
  app.get('/', function(req, res, next){
    t.ok(req.appData);
    t.ok(res.appData);

    next();
  });

  request(app)
    .get('/')
    .end(t.end);
});

test('when is present on req and res objects', function(t){
  var app = express();

  app.use(mech.middleware.data.helpers);
  app.get('/', function(req, res, next){
    t.ok(req.when);
    t.equal(typeof req.when, 'function');
    t.ok(res.when);
    t.equal(typeof res.when, 'function');

    next();
  });

  request(app)
    .get('/')
    .end(t.end);
});

test('when is a proxy for jQuery.when', function(t){
  var app    = express();
  var jQuery = mech.Backbone.$;
  var when   = sinon.spy(jQuery, 'when');

  app.use(mech.middleware.data.helpers);
  app.get('/', function(req, res, next){

    var ModelOne = mech.Model.extend({
      url: 'http://sample.com/one',
      name: 'one'
    });

    var ModelTwo = mech.Model.extend({
      url: 'http://sample.com/two',
      name: 'two'
    });

    var modelOne = new ModelOne();
    var modelTwo = new ModelTwo();

    modelOne.fetch();
    modelTwo.fetch();

    res.when(modelOne, modelTwo)
      .done(function(){
        t.ok(when.called);
        t.ok(when.calledWith(modelOne._deferred, modelTwo._deferred));

        t.deepEquals(modelOne.toJSON(), {model: 'one'});
        t.deepEquals(modelTwo.toJSON(), {model: 'two'});

        next();
      });

  });

  nock('http://sample.com')
    .get('/one')
    .reply(200, {model: 'one'});

  nock('http://sample.com')
    .get('/two')
    .reply(200, {model: 'two'});

  request(app)
    .get('/')
    .end(t.end);
});
