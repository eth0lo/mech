var mech = require('../src/node');

var Layout = mech.View.extend({
  template: 'layout',
  regions: {
    'one': '[data-region="one"]',
    'two': '[data-region="two"]'
  },
  onRender: function() {
    this.one.show(new SubViewOne({model: this.options.modelOne}));
    this.two.show(new SubViewTwo({model: this.options.modelTwo}));
  }
});

var SubViewOne = mech.View.extend({
  template: 'one'
});

var SubViewTwo = mech.View.extend({
  template: 'two'
});
module.exports.DeepNestedView = Layout;
