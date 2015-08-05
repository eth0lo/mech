var superSync = require('backbone-super-sync');

module.exports = function(Backbone) {
  Backbone.sync = superSync;
}