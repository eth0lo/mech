var mech       = require('../../src/node');
var Marionette = require('backbone.marionette');
var jade       = require('jade');

var settings = {
  views: './test/node/fixtures/views/'
}
module.exports.settings = settings;

Marionette.Renderer.render = function(template, data) {
  if(typeof template === 'function') return template(data);

  var path = settings.views + template + '.jade';
  var fn   = jade.compileFile(path, {cache: true});

  return fn(data);
}

var ModelOne = mech.Model.extend({
  name: 'one',
  defaults: {
    name: 'one'
  },
  raw: {
    name: 'one'
  }
});
module.exports.ModelOne = ModelOne;

var ModelTwo = mech.Model.extend({
  name: 'two',
  defaults: {
    name: 'two'
  },
  raw: {
    name: 'two'
  }
});
module.exports.ModelTwo = ModelTwo;


var exampleViewHTML = ''+
  '<div>'+
    '<div data-region="one">'+
      '<div>one</div>'+
    '</div>'+
    '<div data-region="two">'+
      '<div>two</div>'+
    '</div>'+
  '</div>';

var examplePageHTML = ''+
  '<html>'+
    '<body>'+
      exampleViewHTML+
    '</body>'+
  '</html>';

var exampleBootstrapObject = {
  one: { name: 'one' },
  two: { name: 'two' }
};

module.exports.examples = {
  html: {
    page: examplePageHTML,
    view: exampleViewHTML
  },
  object: {
    bootstrap: exampleBootstrapObject
  }
}
