var test       = require('tape-catch');
var proxyquire = require('proxyquire').noPreserveCache();
var nock       = require('nock');
var sinon      = require('sinon');

var httpStub   = {
  request: function() {
    return {
      end: function() {}
    }
  }
};
var httpsStub  = httpStub;

test('jQuery ajax transport', function(t) {

  t.test('complies with jQuery interface', function(t) {
    var transport  = proxyquire('../../src/node/backbone/transport', {http: httpStub, https: httpsStub});
    var example = transport({url: 'https://sample.com', type: 'get'});

    t.ok(example.send);
    t.equal(example.send.length, 2);

    t.ok(example.abort);
    t.end();
  });


  t.test('making simple requests', function(t) {
    var transport  = proxyquire('../../src/node/backbone/transport', {http: httpStub, https: httpsStub});
    var request = transport({url: 'https://sample.com', type: 'get'});
    var httpsRequest = sinon.spy(httpsStub, 'request');

    request.send();
    var requestOptions = httpsRequest.args[0][0];
    t.equal(requestOptions.protocol, 'https:');
    t.equal(requestOptions.host, 'sample.com');
    httpsStub.request.restore();


    var request = transport({url: 'http://sample.com', type: 'get'});
    var httpRequest = sinon.spy(httpStub, 'request');

    request.send();
    var requestOptions = httpRequest.args[0][0];
    t.equal(requestOptions.protocol, 'http:');
    t.equal(requestOptions.host, 'sample.com');
    httpStub.request.restore();

    t.end();
  });


  t.test('reciving data', function(t) {
    nock('https://sample.com')
      .get('/')
      .reply(200, {hello: 'world'});

    var transport  = require('../../src/node/backbone/transport');
    var request = transport({url: 'https://sample.com', type: 'get'});

    request.send({}, function(statusCode, statusMessage, data, headers){
      t.equal(statusCode, 200);
      t.false(statusMessage);
      t.deepEqual(data, {text:'{"hello":"world"}'});
      t.deepEqual(headers, {'content-type': 'application/json'});

      t.end();
    });
  });

  t.end();
});
