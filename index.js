'use strict';

var feed = require('./lib/changes');
var util = require('util');
var stream = require('stream');

var Readable = stream.Readable;

var Changes = function (options) {

  this.options = options || {};

  Readable.call(this, this.options);
};

util.inherits(Changes, Readable);

Changes.prototype._read = function () {

  feed.create(this.options.url, function (err, change) {

    if (err) {
      this.emit('error', err);
    }

    this.emit('data', change);
    this.emit(null);

  }.bind(this));

};

module.exports = Changes;
