var Backbone      = require('backbone');
var document      = require('jsdom').jsdom();
var window        = document.parentWindow;
var $             = require('jquery')(window);

var backboneViewBridge = require('./src/backbone_view_node_bridge');
var backboneAjaxBridge = require('./src/backbone_ajax_node_bridge');

backboneViewBridge(Backbone, $, document);
backboneAjaxBridge(Backbone);

module.exports = Backbone;
