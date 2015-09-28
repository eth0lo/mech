var test    = require('tape-catch')
var mech    = require('../src/node');
var $       = mech.Backbone.$;
var sinon   = require('sinon');

var helpers = require('./helpers');
var View, regionOne, regionTwo, options, view;

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
  View = helpers.ViewWithRegions.extend({});
  view = new View();

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

//   describe('when showing a childView', function() {
//     beforeEach(function() {
//       this.layoutView = new this.LayoutView();
//       this.layoutView.render();
//       this.childView = new Backbone.View();
//       this.layoutView.showChildView('regionOne', this.childView);
//     });

//     it('shows the childview in the region', function() {
//       expect(this.layoutView.getChildView('regionOne')).to.equal(this.childView);
//     });
//   });

//   describe('when showing a layoutView via a region', function() {
//     beforeEach(function() {
//       var suite = this;

//       this.setFixtures('<div id="mgr"></div>');

//       this.layoutView = new this.LayoutView();
//       this.layoutView.onRender = function() {
//         suite.regionOne = suite.layoutView.regionOne;
//         suite.regionOne._ensureElement();
//       };

//       this.region = new Backbone.Marionette.Region({
//         el: '#mgr'
//       });

//       this.showReturn = this.region.show(this.layoutView);
//     });

//     it('should make the regions available in `onRender`', function() {
//       expect(this.regionOne).to.exist;
//     });

//     it('the regions should find their elements in `onRender`', function() {
//       expect(this.regionOne.$el.length).to.equal(1);
//     });

//     it('should return the region after showing a view in a region', function() {
//       expect(this.showReturn).to.equal(this.region);
//     });
//   });

//   describe('when re-rendering an already rendered layoutView', function() {
//     beforeEach(function() {
//       this.LayoutViewBoundRender = this.LayoutView.extend({
//         initialize: function() {
//           if (this.model) {
//             this.listenTo(this.model, 'change', this.render);
//           }
//         }
//       });

//       this.layoutView = new this.LayoutViewBoundRender({
//         model: new Backbone.Model()
//       });
//       this.sinon.spy(this.layoutView.regionOne, 'empty');
//       this.layoutView.render();

//       this.view = new Backbone.View();
//       this.view.destroy = function() {};
//       this.layoutView.regionOne.show(this.view);

//       this.layoutView.render();
//       this.layoutView.regionOne.show(this.view);
//       this.region = this.layoutView.regionOne;
//     });

//     it('should re-bind the regions to the newly rendered elements', function() {
//       expect(this.region.$el.parent()[0]).to.equal(this.layoutView.el);
//     });

//     it('should call empty twice', function() {
//       expect(this.region.empty).to.have.been.calledThrice;
//     });

//     describe('and the views "render" function is bound to an event in the "initialize" function', function() {
//       beforeEach(function() {
//         var suite = this;
//         this.layoutView.onRender = function() {
//           this.regionOne.show(suite.view);
//         };

//         this.layoutView.model.trigger('change');
//       });

//       it('should re-bind the regions correctly', function() {
//         expect(this.layoutView.$('#regionOne')).not.to.equal();
//       });
//     });
//   });

//   describe('when re-rendering a destroyed layoutView', function() {
//     beforeEach(function() {
//       this.layoutView = new this.LayoutView();
//       this.layoutView.render();
//       this.region = this.layoutView.regionOne;

//       this.view = new Backbone.View();
//       this.view.destroy = function() {};
//       this.layoutView.regionOne.show(this.view);
//       this.layoutView.destroy();

//       this.sinon.spy(this.region, 'empty');
//       this.sinon.spy(this.view, 'destroy');

//       this.layoutView.onBeforeRender = this.sinon.stub();
//       this.layoutView.onRender = this.sinon.stub();
//     });

//     it('should throw an error', function() {
//       expect(this.layoutView.render).to.throw('View (cid: "' + this.layoutView.cid +
//           '") has already been destroyed and cannot be used.');
//     });
//   });

//   describe('has a valid inheritance chain back to Marionette.View', function() {
//     beforeEach(function() {
//       this.constructor = this.sinon.spy(Marionette, 'View');
//       this.layoutView = new Marionette.LayoutView();
//     });

//     it('calls the parent Marionette.Views constructor function on instantiation', function() {
//       expect(this.constructor).to.have.been.called;
//     });
//   });

//   describe('when getting a region', function() {
//     beforeEach(function() {
//       this.layoutView = new this.LayoutView();
//       this.region = this.layoutView.regionOne;
//     });

//     it('should return the region', function() {
//       expect(this.layoutView.getRegion('regionOne')).to.equal(this.region);
//     });
//   });

//   describe('when adding regions in a layoutViews options', function() {
//     beforeEach(function() {
//       var suite = this;

//       this.CustomRegion = this.sinon.spy();
//       this.regionOptions = {
//         war: '.craft',
//         is: {
//           regionClass: this.CustomRegion,
//           selector: '#a-fun-game'
//         }
//       };

//       this.layoutView = new Backbone.Marionette.LayoutView({
//         template: this.template,
//         regions: this.regionOptions
//       });

//       this.layoutView2 = new Backbone.Marionette.LayoutView({
//         template: this.template,
//         regions: function() {
//           return suite.regionOptions;
//         }
//       });
//     });

//     it('should lookup and set the regions', function() {
//       expect(this.layoutView.getRegion('is')).to.exist;
//       expect(this.layoutView.getRegion('war')).to.exist;
//     });

//     it('should lookup and set the regions when passed a function', function() {
//       expect(this.layoutView2.getRegion('is')).to.exist;
//       expect(this.layoutView2.getRegion('war')).to.exist;
//     });

//     it('should set custom region classes', function() {
//       expect(this.CustomRegion).to.have.been.called;
//     });
//   });

//   describe('when defining region selectors using @ui. syntax', function() {
//     beforeEach(function() {
//       var UILayoutView = Backbone.Marionette.LayoutView.extend({
//         template: this.template,
//         regions: {
//           war: '@ui.war',
//           mario: {
//             selector: '@ui.mario'
//           },
//           princess: {
//             el: '@ui.princess'
//           }
//         },
//         ui: {
//           war: '.craft',
//           mario: '.bros',
//           princess: '.toadstool'
//         }
//       });
//       this.layoutView = new UILayoutView();
//     });

//     it('should apply the relevant @ui. syntax selector to a simple string value', function() {
//       expect(this.layoutView.getRegion('war')).to.exist;
//       expect(this.layoutView.getRegion('war').$el.selector).to.equal('.craft');
//     });
//     it('should apply the relevant @ui. syntax selector to selector in a region definition object', function() {
//       expect(this.layoutView.getRegion('mario')).to.exist;
//       expect(this.layoutView.getRegion('mario').$el.selector).to.equal('.bros');
//     });
//     it('should apply the relevant @ui. syntax selector to el in a region definition object', function() {
//       expect(this.layoutView.getRegion('princess')).to.exist;
//       expect(this.layoutView.getRegion('princess').$el.selector).to.equal('.toadstool');
//     });
//   });

//   describe('overiding default regionManager', function() {
//     beforeEach(function() {
//       var suite = this;
//       this.spy     = this.sinon.spy();
//       this.layout  = new (Marionette.LayoutView.extend({
//         getRegionManager: function() {
//           suite.spy.apply(this, arguments);
//           return new Marionette.RegionManager();
//         }
//       }))();
//     });

//     it('should call into the custom regionManager lookup', function() {
//       expect(this.spy).to.have.been.called;
//     });

//     it('should call the custom regionManager with the view as the context', function() {
//       expect(this.spy).to.have.been.calledOn(this.layout);
//     });
//   });

//   describe('childView get onDomRefresh from parent', function() {
//     beforeEach(function() {
//       var suite = this;
//       this.setFixtures('<div id="james-kyle"></div>');
//       this.spy = this.sinon.spy();
//       this.spy2 = this.sinon.spy();

//       this.ItemView = Marionette.ItemView.extend({
//         template: _.template('<yes><my><lord></lord></my></yes>'),
//         onDomRefresh: this.spy2
//       });

//       this.LucasArts = Marionette.CollectionView.extend({
//         onDomRefresh: this.spy,
//         childView: this.ItemView
//       });

//       this.Layout = Marionette.LayoutView.extend({
//         template: _.template('<sam class="and-max"></sam>'),
//         regions: {
//           'sam': '.and-max'
//         },

//         onShow: function() {
//           this.getRegion('sam').show(new suite.LucasArts({collection: new Backbone.Collection([{}])}));
//         }
//       });

//       this.region = new Marionette.Region({el: '#james-kyle'});

//       this.region.show(new this.Layout());
//     });

//     it('should call onDomRefresh on region views when shown within the parents onShow', function() {
//       expect(this.spy).to.have.been.called;
//     });

//     it('should call onDomRefresh on region view children when shown within the parents onShow', function() {
//       expect(this.spy2).to.have.been.called;
//     });
//   });

//   describe('when a layout has regions', function() {
//     beforeEach(function() {
//       this.layout = new this.LayoutView();
//       this.layout.render();
//       this.regions = this.layout.getRegions();
//     });

//     it('should be able to retrieve all regions', function() {
//       expect(this.regions.regionOne).to.equal(this.layout.getRegion('regionOne'));
//       expect(this.regions.regionTwo).to.equal(this.layout.getRegion('regionTwo'));
//     });

//     describe('when the regions are specified via regions hash and the view has no template', function() {
//       beforeEach(function() {
//         var fixture =
//           '<div class="region-hash-no-template-spec">' +
//             '<div class="region-one">Out-of-scope region</div>' +
//             '<div class="some-layout-view">' +
//               '<div class="region-one">In-scope region</div>' +
//             '</div>' +
//           '</div>';
//         this.setFixtures(fixture);
//         this.LayoutView = Backbone.Marionette.LayoutView.extend({
//           el: '.region-hash-no-template-spec .some-layout-view',
//           template: false,
//           regions: {
//             regionOne: '.region-one'
//           }
//         });
//         this.layoutViewInstance = new this.LayoutView();
//         this.layoutViewInstance.render();
//         var $specNode = $('.region-hash-no-template-spec');
//         this.$inScopeRegion =  $specNode.find('.some-layout-view .region-one');
//         this.$outOfScopeRegion = $specNode.children('.region-one');
//       });

//       it('after initialization, the view\'s regions should be scoped to its parent view', function() {
//         expect(this.layoutViewInstance.regionOne.$el).to.have.length(1);
//         expect(this.layoutViewInstance.regionOne.$el.is(this.$inScopeRegion)).to.equal(true);
//         expect(this.layoutViewInstance.regionOne.$el.is(this.$outOfScopeRegion)).to.equal(false);
//       });
//     });
//   });

//   describe('manipulating regions', function() {
//     beforeEach(function() {
//       this.beforeAddRegionSpy = this.sinon.spy();
//       this.addRegionSpy = this.sinon.spy();
//       this.beforeRegionRemoveSpy = this.sinon.spy();
//       this.removeRegionSpy = this.sinon.spy();

//       this.Layout = Marionette.LayoutView.extend({
//         template: false,
//         onBeforeAddRegion: this.beforeAddRegionSpy,
//         onAddRegion: this.addRegionSpy,
//         onBeforeRemoveRegion: this.beforeRegionRemoveSpy,
//         onRemoveRegion: this.removeRegionSpy
//       });

//       this.layout = new this.Layout();

//       this.regionName = 'myRegion';
//       this.layout.addRegion(this.regionName, '.region-selector');
//     });

//     it('should trigger correct region add events', function() {
//       expect(this.beforeAddRegionSpy)
//         .to.have.been.calledOnce
//         .and.calledOn(this.layout)
//         .and.calledWith(this.regionName);

//       expect(this.addRegionSpy)
//         .to.have.been.calledOnce
//         .and.calledOn(this.layout)
//         .and.calledWith(this.regionName);
//     });

//     it('should trigger correct region remove events', function() {
//       this.layout.removeRegion(this.regionName);

//       expect(this.beforeRegionRemoveSpy)
//         .to.have.been.calledOnce
//         .and.calledOn(this.layout)
//         .and.calledWith(this.regionName);

//       expect(this.removeRegionSpy)
//         .to.have.been.calledOnce
//         .and.calledOn(this.layout)
//         .and.calledWith(this.regionName);
//     });
//   });

// });
