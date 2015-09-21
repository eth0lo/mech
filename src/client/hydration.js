var bootstrapData = require('./bootstrap_data');

module.exports = function($) {
  var oldFetch = this.fetch;

  this.fetch = function(options) {
    if(this.isBootstraped()) return this.hydrated();

    return oldFetch.apply(this, arguments);
  },

  this.hydrated = function() {
    this.updateBootstrapedAttrs();
    this.cleanBootstrap();

    return this.hydratedJqxhr();
  }

  this.updateBootstrapedAttrs = function() {
    this._raw = bootstrapData[this.name];
    this.set(this.parse(this._raw));
  }

  this.cleanBootstrap = function() {
    delete bootstrapData[this.name];
  }

  this.hydratedJqxhr = function() {
    this._deferred = $.Deferred();
    this._deferred.resolve(this._raw);

    delete this._raw;
    return this._deferred;
  }

  this.isBootstraped = function() {
    return !!bootstrapData[this.name];
  }
};