  function Components() {
    this.list = []
  }

  Components.prototype.render = function(viewName, viewOptions) {
    this.list.push({name: viewName, options: viewOptions});
    return this;
  };

  Components.prototype.to = function(region) {
    var last = this.list[this.list.length - 1];
    last.region = region;
    return this;
  };

  module.exports = Components;