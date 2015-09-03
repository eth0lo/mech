function Page(res) {
  this.components = {};
  this.res        = res;
}

Page.prototype.component = function(viewName, viewOptions) {
  this.components.main = {name: viewName, options: viewOptions};
  return this;
};

Page.prototype.content = Page.prototype.component;

Page.prototype.finish = function() {
  var main = this.components.main
  this.res.render(main.name, main.options);
  return this;
};

Page.prototype.layout = function(layoutName) {
  this.layout = layoutName;
  return this;
};

Page.prototype.region = function(region) {
  this.components[region] = this.components.main;
  this.components.main = undefined;
  return this;
};

Object.defineProperty(Page.prototype, 'and', {
  get: function() {
    return this;
  }
});

Object.defineProperty(Page.prototype, 'in', {
  get: function() {
    return this;
  }
});

Object.defineProperty(Page.prototype, 'with', {
  get: function() {
    return this;
  }
});

module.exports = Page;