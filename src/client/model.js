var Backbone      = require('backbone');
var $             = require('jquery');
var nameValidator = require('../shared/name_validator');
var promisable    = require('../shared/promisable');
var bootstrapData = require('./bootstrap_data');
var OriginalModel = Backbone.Model;

var Model = OriginalModel.extend({
  constructor: function() {
    nameValidator.call(this);
    OriginalModel.apply(this, arguments);
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

    return OriginalModel.prototype.fetch.apply(this, arguments);
  },

  hidratedJqxhr: function(values) {
    var deferred = $.Deferred();
    deferred.resolve(values);
    return deferred;
  }
});

module.exports = Model;
