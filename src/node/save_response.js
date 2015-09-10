module.exports = function() {

  this.saveData = function(model, resp, xhr) {
    this.raw = resp;
  };

  this.wrapSuccess = function(success) {
    var saveData = this.saveData.bind(this);

    return function(model, resp, xhr) {
      saveData(model, resp, xhr);
      return success(model, resp, xhr);
    };
  };

  var oldFetch = this.fetch;
  this.fetch = function(options) {
    options = options || {};

    if(options.success) {
      options.success = this.wrapSuccess(options.success);
    } else {
      options.success = this.saveData.bind(this);
    }

    return oldFetch.call(this, options);
  }
};
