var Backbone           = require('backbone');
var $                  = require('jquery');
var nameValidator      = require('../shared/name_validator');
var promisable         = require('../shared/promisable');
var bootstrapData      = require('./bootstrap_data');
var OriginalCollection = Backbone.Collection;

var Collection = OriginalCollection.extend({
  constructor: function() {
    nameValidator.call(this);
    OriginalCollection.apply(this, arguments);
    promisable.call(this, Backbone.$);
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

    return OriginalCollection.prototype.fetch.apply(this, arguments);
  },

  hidratedJqxhr: function(values) {
    var deferred = $.Deferred();
    deferred.resolve(values);
    return deferred;
  }
});

module.exports = Collection;
