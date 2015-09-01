var window   = require('./window');
var jQuery   = require('jquery');
var $        = jQuery(window);

var parseUrl = require('url').parse;
var http     = require('http');
var https    = require('https');

var PROTOCOL_MAP = {
  'http:': http,
  'https:': https
}

$.ajaxTransport(function(options, originalOptions, jqXHR) {
  var url = parseUrl(options.url);
  var protocol = PROTOCOL_MAP[url.protocol];
  var req;
  console.time('request')
  url.method = options.type;
  return {
    send: function(headers, complete) {
      req = createRequest(headers, complete);
      req.end();
    },
    abort: function() {
      req.abort();
    }
  };

  function createRequest(headers, complete) {
    return protocol.request(url, function(res){
        var data = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
          data = data + chunk;
        });

        res.on('end', function() {
          console.timeEnd('request')
          complete(res.statusCode, res.statusMessage, {text:data}, res.headers);
        });
    });
  }
});

module.exports = $;