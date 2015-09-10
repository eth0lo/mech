var Backbone      = require('./backbone');
var nameValidator = require('../shared/name_validator');
var promisable    = require('../shared/promisable');
var saveResponse  = require('./save_response');
var OriginalModel = Backbone.Model;

var Model = OriginalModel.extend({
  constructor: function() {
    nameValidator.call(this);
    OriginalModel.apply(this, arguments);
    promisable.call(this, Backbone.$);
    saveResponse.call(this);
  }
});

module.exports = Model;
