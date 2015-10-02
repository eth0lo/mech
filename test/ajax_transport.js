var test       = require('tape-catch');
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

var httpStub   = {
  request: function() {
    return {
      end: function(){}
    }
  }
};
var httpsStub  = httpStub;
var transport  = proxyquire('../src/node/backbone/transport', {http: httpStub, https: httpsStub});

test('jQuery ajax transport', function(t) {

  t.test('complies with jQuery interface', function(t) {
    var example = transport({url: 'https://sample.com', type: 'get'});

    t.ok(example.send);
    t.equal(example.send.length, 2);

    t.ok(example.abort);
    t.end();
  });

  t.test('making simple requests', function(t) {
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


  t.end();
});
