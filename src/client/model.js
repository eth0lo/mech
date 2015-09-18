var Backbone      = require('backbone');
var nameValidator = require('../shared/name_validator');
var promisable    = require('../shared/promisable');
var hydration     = require('./hydration');
var OriginalModel = Backbone.Model;

var Model = OriginalModel.extend({
  constructor: function() {
    nameValidator.call(this);
    OriginalModel.apply(this, arguments);
    promisable.call(this, Backbone.$);
    hydration.call(this, Backbone.$);
  }
});

module.exports = Model;
