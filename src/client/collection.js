var Backbone       = require('backbone');
var bootstrapData  = require('./bootstrap_data');
var $              = require('jquery');

var Collection = Backbone.Collection.extend({
  constructor: function() {
    Backbone.Collection.apply(this, arguments);
  },

  fetch: function(options) {
    var name = this.name;
    if(bootstrapData[name]) {
      var data = bootstrapData[name];
      delete bootstrapData[name];
      var serverAttr = this.parse(data);
      this.set(serverAttr);
      return this.hidratedJqxhr(data);
    }

    return Backbone.Collection.prototype.fetch.apply(this, arguments);
  },

  hidratedJqxhr: function(values) {
    var deferred = $.Deferred();
    deferred.resolve(values);
    return deferred;
  }
});

module.exports = Collection;
