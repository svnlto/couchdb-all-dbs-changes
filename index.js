'use strict';

var changes = require('./lib/changes');
var events = require('events');

exports.start = function (couch_url, callback) {
  var ev = new events.EventEmitter();
  var dbPool = {};

  dbPool.on = function () {
    return ev.on.apply(ev, arguments);
  };

  dbPool.emit = function () {
    return ev.emit.apply(ev, arguments);
  };

  changes.create(couch_url, function (err, pool) {

    if (err) {
      return callback(err);
    }

    dbPool.emit('data', pool);

  });

  return callback(null, dbPool);

};

