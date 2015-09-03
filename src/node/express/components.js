  function Components() {
    this.list = []
  }

  Components.prototype.with = function(viewName, viewOptions) {
    this.list.push({name: viewName, options: viewOptions, region: 'main'});
    return this;
  };

  Components.prototype.in = function(region) {
    var last = this.list[this.list.length - 1];
    last.region = region;
    return this;
  };

  module.exports = Components;