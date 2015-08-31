var Backbone      = require('backbone');
var document      = require('jsdom').jsdom();
var window        = document.parentWindow;
var $             = require('jquery')(window);

var backboneViewBridge = require('./src/backbone_view_node_bridge');
var jqueryAjaxBridge = require('./src/jquery_ajax_node_bridge');

backboneViewBridge(Backbone, $, document);
jqueryAjaxBridge($);

module.exports = Backbone;

var Test = Backbone.Model.extend({
	url: 'https://api.wuaki.tv/movies.json'
})

var test = new Test();

test.fetch({
	success: function() {
		console.log(test.toJSON())
	}
})
