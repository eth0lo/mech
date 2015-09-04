var test = require('tape')
var mech = require('../src/node');

var Backbone = mech.Backbone;
var window   = Backbone.ctx;
var doc      = window.document;
var div      = doc.createElement('div');
var h1       = doc.createElement('h1');

function createTestNode() {
  div.id = 'testElement';
  h1.innerHTML = 'Test';

  div.appendChild(h1);
  doc.body.appendChild(div);
}

function destroyTestNode() {
  doc.body.removeChild(div);
}

function createTestView() {
  return new Backbone.View({
    id        : 'test-view',
    className : 'test-view',
    other     : 'non-special-option'
  });
}

test("constructor", function(t) {
  var view = createTestView();

  t.equal(view.el.id, 'test-view');
  t.equal(view.el.className, 'test-view');
  t.equal(view.el.other, void 0);

  t.end();
});

test("$", function(t) {
  var view = createTestView();
  view.setElement('<p><a><b>test</b></a></p>');
  var result = view.$('a b');

  t.equal(result[0].innerHTML, 'test', 'inner text should be test');
  t.ok(result.length === +result.length);

  t.end();
});

test("$el", function(t) {
  var view = createTestView();
  view.setElement('<p><a><b>test</b></a></p>');
  t.equal(view.el.nodeType, 1);

  t.ok(view.$el instanceof Backbone.$);
  t.equal(view.$el[0], view.el);

  t.end();
});

test("initialize", function(t) {
  var View = Backbone.View.extend({
    initialize: function() {
      this.one = 1;
    }
  });

  t.equal(new View().one, 1);

  t.end();
});

test("render", function(t) {
  var view = new Backbone.View();
  t.equal(view.render(), view, '#render returns the view instance');

  t.end();
});

test("delegateEvents", function(t) {
  createTestNode();
  var counter1 = 0, counter2 = 0;

  var view = new Backbone.View({el: '#testElement'});
  view.increment = function(){ counter1++; };
  view.$el.on('click', function(){ counter2++; });

  var events = {'click h1': 'increment'};

  view.delegateEvents(events);

  view.$('h1').trigger('click');
  t.equal(counter1, 1);
  t.equal(counter2, 1);

  view.$('h1').trigger('click');
  t.equal(counter1, 2);
  t.equal(counter2, 2);

  view.delegateEvents(events);
  view.$('h1').trigger('click');
  t.equal(counter1, 3);
  t.equal(counter2, 3);

  destroyTestNode();
  t.end();
});

test("delegate", function(t) {
  createTestNode();
  var view = new Backbone.View({el: '#testElement'});
  view.delegate('click', 'h1', function() {
    t.ok(true);
  });
  view.delegate('click', function() {
    t.ok(true);
  });
  view.$('h1').trigger('click');

  t.equal(view.delegate(), view, '#delegate returns the view instance');

  destroyTestNode();
  t.end();
});

test("delegateEvents allows functions for callbacks", 3, function(t) {
  var view = new Backbone.View({el: '<p></p>'});
  view.counter = 0;

  var events = {
    click: function() {
      this.counter++;
    }
  };

  view.delegateEvents(events);
  view.$el.trigger('click');
  t.equal(view.counter, 1);

  view.$el.trigger('click');
  t.equal(view.counter, 2);

  view.delegateEvents(events);
  view.$el.trigger('click');

  t.equal(view.counter, 3);

  t.end();
});


test("delegateEvents ignore undefined methods", function(t) {
  var view = new Backbone.View({el: '<p></p>'});
  view.delegateEvents({'click': 'undefinedMethod'});
  view.$el.trigger('click');

  t.end();
});

test("undelegateEvents", function(t) {
  createTestNode();
  var counter1 = 0, counter2 = 0;

  var view = new Backbone.View({el: '#testElement'});
  view.increment = function(){ counter1++; };
  view.$el.on('click', function(){ counter2++; });

  var events = {'click h1': 'increment'};

  view.delegateEvents(events);
  view.$('h1').trigger('click');
  t.equal(counter1, 1);
  t.equal(counter2, 1);

  view.undelegateEvents();
  view.$('h1').trigger('click');
  t.equal(counter1, 1);
  t.equal(counter2, 2);

  view.delegateEvents(events);
  view.$('h1').trigger('click');
  t.equal(counter1, 2);
  t.equal(counter2, 3);

  t.equal(view.undelegateEvents(), view, '#undelegateEvents returns the view instance');

  destroyTestNode();
  t.end();
});

test("undelegate", function(t) {
  createTestNode();
  view = new Backbone.View({el: '#testElement'});
  view.delegate('click', function() { t.ok(false); });
  view.delegate('click', 'h1', function() { t.ok(false); });

  view.undelegate('click');

  view.$('h1').trigger('click');
  view.$el.trigger('click');

  t.equal(view.undelegate(), view, '#undelegate returns the view instance');

  destroyTestNode();
  t.end();
});

test("undelegate with passed handler", function(t) {
  createTestNode();
  view = new Backbone.View({el: '#testElement'});

  var listener = function() { t.ok(false); };
  view.delegate('click', listener);
  view.delegate('click', function() { t.ok(true); });
  view.undelegate('click', listener);

  view.$el.trigger('click');

  destroyTestNode();
  t.end();
});

test("undelegate with selector", function(t) {
  createTestNode();
  view = new Backbone.View({el: '#testElement'});

  view.delegate('click', function() { t.ok(true); });
  view.delegate('click', 'h1', function() { t.ok(false); });
  view.undelegate('click', 'h1');

  view.$('h1').trigger('click');
  view.$el.trigger('click');

  destroyTestNode();
  t.end();
});

test("undelegate with handler and selector", function(t) {
  createTestNode();
  view = new Backbone.View({el: '#testElement'});

  view.delegate('click', function() { t.ok(true); });
  var handler = function(){ t.ok(false); };
  view.delegate('click', 'h1', handler);
  view.undelegate('click', 'h1', handler);

  view.$('h1').trigger('click');
  view.$el.trigger('click');

  destroyTestNode();
  t.end();
});

test("tagName can be provided as a string", function(t) {
  var View = Backbone.View.extend({
    tagName: 'span'
  });

  t.equal(new View().el.tagName, 'SPAN');

  t.end();
});

test("tagName can be provided as a function", function(t) {
  var View = Backbone.View.extend({
    tagName: function() {
      return 'p';
    }
  });

  t.ok(new View().$el.is('p'));

  t.end();
});

test("_ensureElement with DOM node el", function(t) {
  var View = Backbone.View.extend({
    el: doc.body
  });

  t.equal(new View().el, doc.body);

  t.end();
});

test("_ensureElement with string el", function(t) {
  var View = Backbone.View.extend({
    el: "body"
  });
  t.strictEqual(new View().el, doc.body);

  createTestNode();
  View = Backbone.View.extend({
    el: "#testElement > h1"
  });
  t.strictEqual(new View().el, Backbone.$("#testElement > h1").get(0));
  destroyTestNode();

  View = Backbone.View.extend({
    el: "#nonexistent"
  });
  t.ok(!new View().el);

  t.end();
});

test("with className and id functions", function(t) {
  var View = Backbone.View.extend({
    className: function() {
      return 'className';
    },
    id: function() {
      return 'id';
    }
  });

  t.strictEqual(new View().el.className, 'className');
  t.strictEqual(new View().el.id, 'id');

  t.end();
});

test("with attributes", 2, function(t) {
  var View = Backbone.View.extend({
    attributes: {
      id: 'id',
      'class': 'class'
    }
  });

  t.strictEqual(new View().el.className, 'class');
  t.strictEqual(new View().el.id, 'id');

  t.end();
});

test("with attributes as a function", function(t) {
  var View = Backbone.View.extend({
    attributes: function() {
      return {'class': 'dynamic'};
    }
  });

  t.strictEqual(new View().el.className, 'dynamic');

  t.end();
});

test("multiple views per element", function(t) {
  var count = 0;
  var $el = Backbone.$('<p></p>');

  var View = Backbone.View.extend({
    el: $el,
    events: {
      click: function() {
        count++;
      }
    }
  });

  var view1 = new View;
  $el.trigger('click');
  t.equal(1, count);

  var view2 = new View;
  $el.trigger('click');
  t.equal(3, count);

  view1.delegateEvents();
  $el.trigger('click');
  t.equal(5, count);

  t.end();
});

test("custom events", function(t) {
  var $ = Backbone.$;

  var View = Backbone.View.extend({
    el: $('body'),
    events: {
      "fake$event": function() { t.ok(true); }
    }
  });

  var view = new View;
  $('body').trigger('fake$event').trigger('fake$event');

  $('body').off('fake$event');
  $('body').trigger('fake$event');

  t.end();
});

test("#1048 - setElement uses provided object.", function(t) {
  var $ = Backbone.$;
  var $el = $('body');

  var view = new Backbone.View({el: $el});
  t.ok(view.$el === $el);

  view.setElement($el = $($el));
  t.ok(view.$el === $el);

  t.end();
});

test("#986 - Undelegate before changing element.", function(t) {
  var $ = Backbone.$;
  var button1 = $('<button></button>');
  var button2 = $('<button></button>');

  var View = Backbone.View.extend({
    events: {
      click: function(e) {
        t.ok(view.el === e.target);
      }
    }
  });

  var view = new View({el: button1});
  view.setElement(button2);

  button1.trigger('click');
  button2.trigger('click');

  t.end();
});

test("#1172 - Clone attributes object", function(t) {
  var View = Backbone.View.extend({
    attributes: {foo: 'bar'}
  });

  var view1 = new View({id: 'foo'});
  t.strictEqual(view1.el.id, 'foo');

  var view2 = new View();
  t.ok(!view2.el.id);

  t.end();
});

test("views stopListening", function(t) {
  var View = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'all x', function(){ t.ok(false); });
      this.listenTo(this.collection, 'all x', function(){ t.ok(false); });
    }
  });

  var view = new View({
    model: new Backbone.Model,
    collection: new Backbone.Collection
  });

  view.stopListening();
  view.model.trigger('x');
  view.collection.trigger('x');

  t.end();
});

test("Provide function for el.", function(t) {
  var View = Backbone.View.extend({
    el: function() {
      return "<p><a></a></p>";
    }
  });

  var view = new View;
  t.ok(view.$el.is('p'));
  t.ok(view.$el.has('a'));

  t.end();
});

test("events passed in options", function(t) {
  createTestNode();
  var counter = 0;

  var View = Backbone.View.extend({
    el: '#testElement',
    increment: function() {
      counter++;
    }
  });

  var view = new View({
    events: {
      'click h1': 'increment'
    }
  });

  view.$('h1').trigger('click').trigger('click');
  t.equal(counter, 2);

  destroyTestNode();
  t.end();
});

test("remove", function(t) {
  var view = new Backbone.View;
  doc.body.appendChild(view.el);

  view.delegate('click', function() { t.ok(false); });
  view.listenTo(view, 'all x', function() { t.ok(false); });

  t.equal(view.remove(), view, '#remove returns the view instance');
  view.$el.trigger('click');
  view.trigger('x');

  // In IE8 and below, parentNode still exists but is not document.body.
  t.notEqual(view.el.parentNode, doc.body);

  t.end();
});

test("setElement", function(t) {
  var view = new Backbone.View({
    events: {
      click: function() { t.ok(false); }
    }
  });
  view.events = {
    click: function() { t.ok(true); }
  };
  var oldEl = view.el;
  var $oldEl = view.$el;

  view.setElement(doc.createElement('div'));

  $oldEl.click();
  view.$el.click();

  t.notEqual(oldEl, view.el);
  t.notEqual($oldEl, view.$el);

  t.end();
});