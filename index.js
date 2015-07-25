var Backbone      = require('backbone');
var document      = require('jsdom').jsdom();
var window        = document.parentWindow;
var $             = require('jquery')(window);

var jQueryAjaxBridge = require('./src/jquery_ajax_node_bridge');
var backboneViewBridge = require('./src/backbone_view_node_bridge');

jQueryAjaxBridge($);
backboneViewBridge(Backbone, $, document);

module.exports = Backbone;
