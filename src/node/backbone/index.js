var jQuery    = require('jquery');
var Backbone  = require('backbone');
var transport = require('./transport');
var window    = require('../window');
var $         = jQuery(window);

$.ajaxTransport(transport);

Backbone.$   = $

module.exports = Backbone;
