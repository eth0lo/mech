module.exports = function(jQuery) {
  this._deferred = jQuery.Deferred();

  this.listenTo(this, 'sync', function(){
    this._deferred.resolve(this);
  });

  this.listenTo(this, 'error', function(model, xhr, options){
    this._deferred.reject(this, xhr, options);
  });

  // Proxy Promises methods
  this.done = function() {
    return this._deferred.done.apply(this._deferred, arguments);
  };

  this.fail = function() {
    return this._deferred.fail.apply(this._deferred, arguments);
  };

  this.then = function() {
    return this._deferred.then.apply(this._deferred, arguments);
  };

  // Helper Methods for handling promises
  this.isResolved = function() {
    return this._deferred.state() == 'resolved';
  };

  this.isRejected = function() {
    return this._deferred.state() == 'rejected';
  };

  var oldFetch = this.fetch;
  this.fetch = function(options) {
    this._deferred = jQuery.Deferred();
    var xhr = oldFetch.call(this, options);

    this.abort = function() {
      xhr.abort();
      return this;
    };

    return xhr;
  };
};
