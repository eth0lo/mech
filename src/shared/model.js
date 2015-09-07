var Backbone = require('backbone');

var Model = Backbone.Model.extend({
  constructor: function() {
    if(!this.name) throw new Error('name property missing');
    Backbone.Model.apply(this, arguments);
  }
});

module.exports = Model;
