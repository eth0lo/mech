var BaseCollection = require('../shared/collection');

var Collection = BaseCollection.extend({
  constructor: function() {
    BaseCollection.apply(this, arguments);
  },

  sync: function() {
    var xhr = BaseCollection.prototype.sync.apply(this, arguments);
    xhr.done(this.saveResponse.bind(this));

    return xhr;
  },

  saveResponse: function(data) {
    this.raw = data;
  }
});

module.exports = Collection;