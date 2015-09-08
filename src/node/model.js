var BaseModel = require('../shared/model');

var Model = BaseModel.extend({
  constructor: function() {
    BaseModel.apply(this, arguments);
  },

  sync: function(options) {
    var xhr = BaseModel.prototype.sync.apply(this, arguments);
    xhr.done(this.saveResponse.bind(this));

    return xhr;
  },

  saveResponse: function(data) {
    this.raw = data;
  }
});

module.exports = Model;
