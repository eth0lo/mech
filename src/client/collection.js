var Backbone           = require('backbone');
var nameValidator      = require('../shared/name_validator');
var promisable         = require('../shared/promisable');
var hydration          = require('./hydration');
var OriginalCollection = Backbone.Collection;

var Collection = OriginalCollection.extend({
  constructor: function() {
    nameValidator.call(this);
    OriginalCollection.apply(this, arguments);
    promisable.call(this, Backbone.$);
    hydration.call(this, Backbone.$);
  }
});

module.exports = Collection;
