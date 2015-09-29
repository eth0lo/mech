var _        = require('underscore');
var mech     = require('../src/node');

var window   = mech.window;
var doc      = window.document;
var div      = doc.createElement('div');
var h1       = doc.createElement('h1');

module.exports.document = doc;

//////////////////////
// Backbone Helpers //
//////////////////////

function createTestNode() {
  div.id = 'testElement';
  h1.innerHTML = 'Test';

  div.appendChild(h1);
  doc.body.appendChild(div);
}
module.exports.createTestNode = createTestNode;

function destroyTestNode() {
  doc.body.removeChild(div);
}
module.exports.destroyTestNode = destroyTestNode;

function createTestView() {
  return new mech.View({
    id        : 'test-view',
    className : 'test-view',
    other     : 'non-special-option'
  });
}
module.exports.createTestView = createTestView;

///////////////////////
// Marionete Helpers //
///////////////////////

var layoutViewManagerTemplateFn = _.template('<div id="regionOne"></div><div id="regionTwo"></div>');
module.exports.layoutViewManagerTemplateFn = layoutViewManagerTemplateFn;

module.exports.template = function(){
  return '<span class=".craft"></span><h1 id="#a-fun-game"></h1>';
};


var DefaultRegion = mech.Marionette.Region;
module.exports.DefaultRegion = DefaultRegion;

var CustomRegion1 = function(){};
module.exports.CustomRegion1 = CustomRegion1;

var CustomRegion2 = mech.Marionette.Region.extend();
module.exports.CustomRegion2 = CustomRegion2;


var ViewWithRegions = mech.View.extend({
  template: layoutViewManagerTemplateFn,
  regions: {
    regionOne: '#regionOne',
    regionTwo: '#regionTwo'
  },
  initialize: function(){
    if (this.model) {
      this.listenTo(this.model, 'change', this.render);
    }
  },
  onBeforeRender: function(){
    return this.isRendered;
  },
  onRender: function(){
    return this.isRendered;
  }
});
module.exports.ViewWithRegions = ViewWithRegions;


var ViewWithNoDefaultRegion = ViewWithRegions.extend({
  regions: {
    regionOne: {
      selector: '#regionOne',
      regionClass: CustomRegion1
    },
    regionTwo: '#regionTwo'
  }
});
module.exports.ViewWithNoDefaultRegion = ViewWithNoDefaultRegion;


var ViewWithCustomRegions = ViewWithRegions.extend({
  regionClass: CustomRegion1,
  regions: {
    regionOne: {
      selector: '#regionOne',
      regionClass: CustomRegion1
    },
    regionTwo: {
      selector: '#regionTwo',
      regionClass: CustomRegion2,
      specialOption: true
    },
    regionThree: {
      selector: '#regionThree'
    },
    regionFour: '#regionFour'
  }
});
module.exports.ViewWithCustomRegions = ViewWithCustomRegions;
