var Backbone           = require('./backbone');
var nameValidator      = require('../shared/name_validator');
var promisable         = require('../shared/promisable');
var saveResponse       = require('./save_response');
var OriginalCollection = Backbone.Collection;

var Collection = OriginalCollection.extend({
  constructor: function() {
    nameValidator.call(this);
    OriginalCollection.apply(this, arguments);
    promisable.call(this, Backbone.$);
    saveResponse.call(this);
  }
});

module.exports = Collection;
