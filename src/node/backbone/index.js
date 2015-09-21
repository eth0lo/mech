var domino    = require('domino');
var jQuery    = require('jquery');
var Backbone  = require('backbone');
var transport = require('./transport');
var window    = domino.createWindow();
var $         = jQuery(window);

$.ajaxTransport(transport);

Backbone.$   = $

Backbone.ctx = window;

module.exports = Backbone;
