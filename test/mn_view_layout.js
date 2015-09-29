var test    = require('tape-catch')
var mech    = require('../src/node');
var $       = mech.Backbone.$;
var _       = require('underscore');
var sinon   = require('sinon');

var helpers = require('./helpers');
var View, region, regionOne, regionTwo, options, view;

test('on instantiation', function(t){

  t.test('with regions defined', function(t){
    View = helpers.ViewWithRegions.extend({
      initialize: function(){
        regionOne = this.regionOne;
      }
    });

    view = new View();

    t.ok(view.regionOne);
    t.ok(view.regionTwo);

    t.deepEqual(regionOne, view.regionOne, 'regions are instantiated before initialize');
    t.deepEqual(view.regionManager._parent, view, 'should create backlink with region manager');

    t.end();
  });


  t.test('with no regions defined', function(t){
    View = mech.View.extend({});

    function createViewWithNoRegions(){
      view = new View();
    };
    t.doesNotThrow(createViewWithNoRegions, 'does not throw');

    t.end();
  });


  t.test('with custom regions defined', function(t){
    View = helpers.ViewWithCustomRegions.extend({});
    view = new View();

    t.ok(view.regionOne);
    t.ok(view.regionOne instanceof helpers.CustomRegion1, 'inline region');
    t.ok(view.regionTwo);
    t.ok(view.regionTwo instanceof helpers.CustomRegion2);

    t.ok(view.regionThree)
    t.ok(view.regionThree instanceof helpers.CustomRegion1, 'default region');
    t.ok(view.regionFour)
    t.ok(view.regionFour instanceof helpers.CustomRegion1);

    t.ok(view.regionTwo.options, 'options are passed to the regions');
    t.ok(view.regionTwo.options.specialOption);


    View = helpers.ViewWithNoDefaultRegion.extend({});
    view = new View();

    t.ok(view.regionTwo);
    t.ok(view.regionTwo instanceof helpers.DefaultRegion, 'default region');

    t.end();
  });


  t.test('when regions are defined as a function', function(t){
    View = helpers.ViewWithRegions.extend({
      regions: function(opts){
        options = opts;
        return {
          'regionOne': '#regionOne'
        };
      }
    });
    view = new View();
    view.render();

    t.deepEqual(view.options, { destroyImmediate: false }, 'should supply the layoutView.options to the function when calling it');
    t.ok(view.regionOne);
    t.ok(view.regionOne instanceof helpers.DefaultRegion);

    t.end();
  });
});


test('on rendering', function(t){
  view = new helpers.ViewWithRegions();

  sinon.spy(view, 'onRender');
  sinon.spy(view, 'onBeforeRender');
  sinon.spy(view, 'trigger');
  view.render();

  view.regionOne._ensureElement();
  var el = view.$('#regionOne');
  t.deepEqual(view.regionOne.$el[0], el[0], 'should find the region scoped within the rendered template');

  t.ok(view.onBeforeRender.calledOnce, 'should call "onBeforeRender" before rendering');
  t.ok(view.onRender.calledOnce, 'should call "onRender" after rendering');
  t.ok(view.onBeforeRender.calledBefore(view.onRender), 'should call "onBeforeRender" before "onRender"');

  t.notOk(view.onBeforeRender.lastCall.returnValue, 'should be rendered when "onRender" is called');
  t.ok(view.onRender.lastCall.returnValue, 'should be rendered when "onRender" is called');

  t.ok(view.trigger.calledWith('before:render', view), 'should trigger a "before:render" event');
  t.ok(view.trigger.calledWith('render', view), 'should trigger a "render" event');
  t.ok(view.isRendered, true, 'should be marked rendered');

  t.end();
});


test('when destroying', function(t){
  var BaseView = helpers.ViewWithRegions,
      RegionView, regionOneView;

  function setup(viewOptions){
    view = new BaseView(viewOptions);
    $('<span id="parent">').append(view.el);
    view.render();

    regionOne = view.regionOne;
    regionTwo = view.regionTwo;

    RegionView = mech.View.extend({
      template: false,
      destroy: function() {
        this.hadParent = this.$el.closest('#parent').length > 0;
        return RegionView.__super__.destroy.call(this);
      }
    });

    regionOneView = new RegionView();

    view.regionOne.show(regionOneView);

    sinon.spy(regionOne, 'empty');
    sinon.spy(regionTwo, 'empty');

    sinon.spy(view, 'destroy');

    view.destroy();
    view.destroy();
  }

  setup();
  t.ok(regionOne.empty.calledOnce, 'should empty the region manager');
  t.ok(regionTwo.empty.calledOnce, 'should empty the region manager');

  t.notOk(view.regionOne, 'should delete the region manager');
  t.notOk(view.regionTwo, 'should delete the region manager');

  t.ok(view.destroy.alwaysReturned(view), 'should return the view');

  t.ok(view.isDestroyed, 'should be marked destroyed');
  t.notOk(view.isRendered, 'should be marked not rendered');

  t.ok(regionOneView.hadParent, 'should not remove itself from the DOM before destroying child regions by default');


  setup({ destroyImmediate: true });
  t.false(regionOneView.hadParent, 'should remove itself from the DOM before destroying child regions if flag set via options');


  BaseView.prototype.options.destroyImmediate = true;
  setup();
  t.false(regionOneView.hadParent, 'should remove itself from the DOM before destroying child regions if flag set on proto options');

  BaseView.prototype.options = null;
  BaseView.prototype.destroyImmediate = true;
  setup();
  t.false(regionOneView.hadParent, 'should remove itself from the DOM before destroying child regions if flag set on proto');

  t.end();
});

test('when showing a childview', function(t){
  view = new helpers.ViewWithRegions();
  regionView = new mech.View({template: false});

  view.render();
  view.showChildView('regionOne', regionView);

  t.deepEqual(view.getChildView('regionOne'), regionView);
  t.end();
});

test('when showing a layoutView via a region', function(t){
  var fixture = $('<div id="mgr"></div>');
  helpers.document.body.appendChild(fixture[0]);

  view = new helpers.ViewWithRegions();
  view.onRender = function(){
    regionOne = view.regionOne;
    regionOne._ensureElement();
  }

  region = new mech.Marionette.Region({
    el: '#mgr'
  });

  var exampleRegion = region.show(view);

  t.ok(regionOne, 'should make the regions available in `onRender');
  t.equal(regionOne.$el.length, 1, 'the regions should find their elements in `onRender`');
  t.deepEqual(exampleRegion, region, 'should return the region after showing a view in a region');

  t.end();
  helpers.document.body.removeChild(fixture[0]);
});


test('when re-rendering an already rendered layoutView', function(t){
  var View = helpers.ViewWithRegions.extend({
    initialize: function() {
      if (this.model) {
        this.listenTo(this.model, 'change', this.render);
      }
    }
  });

  view = new View({
    model: new mech.Backbone.Model()
  });

  sinon.spy(view.regionOne, 'empty');
  view.render();

  regionView = new mech.View({template: false});
  regionView.destroy = function() {};
  view.regionOne.show(regionView);

  view.render();
  view.regionOne.show(regionView);
  region = view.regionOne;

  t.deepEqual(region.$el.parent()[0], view.el, 'should re-bind the regions to the newly rendered elements');
  t.ok(region.empty.calledThrice, 'should call empty twice');

  view.onRender = function() {
    this.regionOne.show(regionView);
  };
  view.model.trigger('change');

  t.ok(view.$('#regionOne'));

  t.end();
});

test('when re-rendering a destroyed layoutView', function(t) {
  view = new helpers.ViewWithRegions();
  view.render();
  region = view.regionOne;

  regionView = new mech.View({template: false});
  regionView.destroy = function() {};

  view.regionOne.show(regionView);
  view.destroy();

  sinon.spy(region, 'empty');
  sinon.spy(regionView, 'destroy');

  view.onBeforeRender = sinon.stub();
  view.onRender = sinon.stub();

  t.throws(view.render, 'View (cid: "' + view.cid + '") has already been destroyed and cannot be used.',
    'should throw an error');

  t.end();
});


test('has a valid inheritance chain back to Marionette.View', function(t) {
  var constructor = sinon.spy(mech.Marionette, 'View');
  view = new helpers.ViewWithRegions();

  t.ok(constructor.called);
  t.end();
});


test('when getting a region', function(t) {
  view = new helpers.ViewWithRegions();
  regionOne = view.regionOne;

  t.deepEqual(view.getRegion('regionOne'), regionOne);
  t.end();
});


test('when adding regions in a layoutViews options', function(t) {
  Region = sinon.spy();

  options = {
    war: '.craft',
    is: {
      regionClass: Region,
      selector: '#a-fun-game'
    }
  }

  view = new mech.View({
    template: helpers.template,
    regions: options
  });

  t.ok(view.getRegion('is'), 'should lookup and set the regions');
  t.ok(view.getRegion('war'), 'should lookup and set the regions');

  view = new mech.View({
    template: helpers.template,
    regions: function() {
      return options;
    }
  });

  t.ok(view.getRegion('is'), 'should lookup and set the regions when passed a function');
  t.ok(view.getRegion('war'), 'should lookup and set the regions when passed a function');

  t.ok(Region.called, 'should set custom region classes');

  t.end();
});


test('when defining region selectors using @ui. syntax', function(t) {
  View = mech.View.extend({
    template: helpers.template,
    regions: {
      war: '@ui.war',
      mario: {
        selector: '@ui.mario'
      },
      princess: {
        el: '@ui.princess'
      }
    },
    ui: {
      war: '.craft',
      mario: '.bros',
      princess: '.toadstool'
    }
  });

  view = new View();

  t.ok(view.getRegion('war'), 'should apply the relevant @ui. syntax selector to a simple string value');
  t.equal(view.getRegion('war').$el.selector, '.craft');

  t.ok(view.getRegion('mario'), 'should apply the relevant @ui. syntax selector to a simple string value');
  t.equal(view.getRegion('mario').$el.selector, '.bros');

  t.ok(view.getRegion('princess'), 'should apply the relevant @ui. syntax selector to a simple string value');
  t.equal(view.getRegion('princess').$el.selector, '.toadstool');

  t.end();
});


test('overiding default regionManager', function(t) {
  var customRegionManager = sinon.spy();

  View = mech.View.extend({
    getRegionManager: function() {
      customRegionManager.apply(this, arguments);
      return new mech.Marionette.RegionManager();
    }
  });

  view = new View();

  t.ok(customRegionManager.called, 'should call into the custom regionManager lookup');
  t.ok(customRegionManager.calledOn(view), 'should call into the custom regionManager lookup');

  t.end();
});


 test('childView get onDomRefresh from parent', function(t) {
  var fixture = $('<div id="james-kyle"></div>');
  helpers.document.body.appendChild(fixture[0]);
  var spy = sinon.spy();
  var spy2 = sinon.spy();

  var ItemView = mech.View.extend({
    template: _.template('<yes><my><lord></lord></my></yes>'),
    onDomRefresh: spy2
  });

  var LucasArts = mech.CollectionView.extend({
    onDomRefresh: spy,
    childView: ItemView
  });

  View = mech.View.extend({
    template: _.template('<sam class="and-max"></sam>'),
    regions: {
      'sam': '.and-max'
    },

    onShow: function() {
      var collection = new mech.Backbone.Collection([{}]);
      this.getRegion('sam').show(new LucasArts({collection: collection}));
    }
  });
  view = new View();

  region = new mech.Marionette.Region({el: '#james-kyle'});
  region.show(view);

  t.ok(spy.called, 'should call onDomRefresh on region views when shown within the parents onShow');
  t.ok(spy2.called, 'should call onDomRefresh on region view children when shown within the parents onShow');

  t.end();
  helpers.document.body.removeChild(fixture[0]);
 });


test('when a layout has regions', function(t) {
  view = new helpers.ViewWithRegions();
  view.render();
  regions = view.getRegions();

  t.deepEqual(regions.regionOne, view.getRegion('regionOne'), 'should be able to retrieve all regions');
  t.deepEqual(regions.regionTwo, view.getRegion('regionTwo'));

  t.test('when the regions are specified via regions hash and the view has no template', function(t) {
    var fixture = $(
      '<div class="region-hash-no-template-spec">' +
        '<div class="region-one">Out-of-scope region</div>' +
        '<div class="some-layout-view">' +
          '<div class="region-one">In-scope region</div>' +
        '</div>' +
      '</div>'
    );
    helpers.document.body.appendChild(fixture[0]);

    View = mech.View.extend({
      el: '.region-hash-no-template-spec .some-layout-view',
      template: false,
      regions: {
        regionOne: '.region-one'
      }
    });

    view = new View();
    view.render();

    var $specNode = $('.region-hash-no-template-spec');
    var $inScopeRegion =  $specNode.find('.some-layout-view .region-one');
    var $outOfScopeRegion = $specNode.children('.region-one');

    t.equal(view.regionOne.$el.length, 1, 'after initialization, the view\'s regions should be scoped to its parent view');

    t.equal(view.regionOne.$el.is($inScopeRegion), true);
    t.equal(view.regionOne.$el.is($outOfScopeRegion), false);

    t.end();
    helpers.document.body.removeChild(fixture[0]);
  });

  t.end();
});


test('manipulating regions', function(t) {
  var beforeAddRegionSpy = sinon.spy();
  var addRegionSpy = sinon.spy();
  var beforeRegionRemoveSpy = sinon.spy();
  var removeRegionSpy = sinon.spy();

  View = mech.View.extend({
    template: false,
    onBeforeAddRegion: beforeAddRegionSpy,
    onAddRegion: addRegionSpy,
    onBeforeRemoveRegion: beforeRegionRemoveSpy,
    onRemoveRegion: removeRegionSpy
  });

  view = new View();
  regionName = 'myRegion';
  view.addRegion(regionName, '.region-selector');

  t.ok(beforeAddRegionSpy.calledOnce);
  t.ok(beforeAddRegionSpy.calledOn(view));
  t.ok(beforeAddRegionSpy.calledWith(regionName));

  t.ok(addRegionSpy.calledOnce);
  t.ok(addRegionSpy.calledOn(view));
  t.ok(addRegionSpy.calledWith(regionName));

  view.removeRegion(regionName);

  t.ok(beforeRegionRemoveSpy.calledOnce);
  t.ok(beforeRegionRemoveSpy.calledOn(view));
  t.ok(beforeRegionRemoveSpy.calledWith(regionName));

  t.ok(removeRegionSpy.calledOnce);
  t.ok(removeRegionSpy.calledOn(view));
  t.ok(removeRegionSpy.calledWith(regionName));

  t.end();
});
