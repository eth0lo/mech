var parseUrl = require('url').parse;

module.exports = function($) {

  $.ajaxTransport('node', function( options, originalOptions, jqXHR ) {
    var url = parseUrl(options.url);
    var protocolName = url.protocol.slice(0,-1);
    var protocol = require(protocolName);
    var req;

    function handleResponseData(complete, res, data) {
      data = {text: JSON.stringify(data)};
      complete(res.statusCode, res.statusMessage, data, res.headers);
    }

    function createRequest(headers, complete) {
      return protocol.request(url, function(res){
          res.setEncoding('utf8');
          res.on('data', handleResponseData.bind(this, complete, res));
      });
    }

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
  });

  $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    return 'node';
  });

  $.ajaxSetup({
    converters: {
      "text node": global.String
    }
  });
}
