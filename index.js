// Peer dependencies
var Backbone = require('backbone');
var jQuery   = require('jquery');

// Setup jQuery to work on node
var domino = require('domino');
var window = domino.createWindow();
var $      = jQuery(window);

// Allow jQuery to use ajax calls in node
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

// Make Backbone to work with the modified jQuery
Backbone.$ = $;

// Modify Backbone to be able to render server side
var cheerio = require('cheerio');

Backbone.View.prototype.setElement = function($cheerio) {
    this.$el = $cheerio("*");
    return this;
},

Backbone.View.prototype._createElement = function(tagName) {
    return cheerio.load('<' + tagName + '>');
}

module.exports = Backbone;

var Test = Backbone.Model.extend({
	url: 'https://api.wuaki.tv/movies.json'
})

var test = new Test();
console.time('jquery')
test.fetch({
	success: function() {
        console.timeEnd('jquery')
		// console.log(test.toJSON())
	}
})
