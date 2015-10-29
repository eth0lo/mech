var test    = require('tape-catch');
var request = require('supertest');
var sinon   = require('sinon');
var nock    = require('nock');

var mech    = require('../../src/node');
var helpers = require('./express_helpers');
var express = require('express');

test('render with defaults', function(t) {
  var app = express();
  var render = sinon.spy(app, 'render');

  app.set('views', helpers.settings.views);
  app.set('view engine', 'jade');
  app.use(mech.middleware.render.helpers());
  app.get('/', function(req, res, next){
    var locales = {
      modelOne: new helpers.ModelOne,
      modelTwo: new helpers.ModelTwo
    }

    res.render('deep_nested_view', locales, function(err, pageHTML){
      var renderArgs = render.getCall(0).args;
      var layoutName = renderArgs[0];
      var locales    = renderArgs[1];
      var viewHTML   = locales.content;
      var bootstrap  = locales.bootstrap;

      t.ok(render.called);
      t.equal(layoutName, 'layouts/default');
      t.equal(viewHTML, helpers.examples.html.view);
      t.equal(pageHTML, helpers.examples.html.page);
      t.deepEqual(bootstrap, helpers.examples.object.bootstrap);
      next();
    });
  });

  request(app)
    .get('/')
    .end(t.end);
});
