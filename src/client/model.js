var BaseModel     = require('../shared/model');
var bootstrapData = require('./bootstrap_data');

var Model = BaseModel.extend({
  constructor: function() {
    BaseModel.apply(this, arguments);
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

    return BaseModel.prototype.fetch.apply(this, arguments);
  },

  hidratedJqxhr: function(values) {
    var deferred = $.Deferred();
    deferred.resolve(values);
    return deferred;
  }
});

module.exports = Model;