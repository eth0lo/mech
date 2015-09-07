var Backbone = require('backbone');

var Collection = Backbone.Collection.extend({
  constructor: function() {
    if(!this.name) throw new Error('name property missing');
    Backbone.Collection.apply(this, arguments);
  }
});

module.exports = Collection;
