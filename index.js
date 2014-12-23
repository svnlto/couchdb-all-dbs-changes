'use strict';

var changes = require('./lib/changes');
var events = require('events');
var util = require('util');

var Feed = function (options) {

  this.options = options || {};

  if (options && !options.url) {
    throw new Error('url parameter required');
  }

  options.interval = this.options.interval || 500;

  events.EventEmitter.call(this);

  changes.create(options, function (err, pool) {

    if (err) {
      this.emit('error', err);
    }

    this.emit('change', pool);

  }.bind(this));

};

util.inherits(Feed, events.EventEmitter);

module.exports = Feed;

