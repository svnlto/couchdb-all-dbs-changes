'use strict';

var couchr = require('couchr');
var url = require('url');
var async = require('async');
var db_updates = require('./db_updates');

// dbs that we are interested in.
var pool = [];

/**
 * Creates a new changes pool
 */
exports.create = function (options, callback) {

  db_updates.available(options.url, function (err, exists) {

    if (err) {
      return callback(err);
    }

    if (exists) {
      exports.createDbUpdatesPool(options, function (err, data) {
        return callback(null, data);
      });
    }

  });

};


/**
 *
 */
exports.createDbUpdatesPool = function (options, callback) {

  exports.updatePool(options, function (err) {

    if (err) {
      return callback(err);
    }

    db_updates.listen(options.url, function (err, data) {

      // only listen to feeds
      if (pool.indexOf(data.db_name) !== -1) {

        if (err) {
          return callback(err);
        }

        if (data.type === 'deleted') {
          exports.removeDB(pool, data.db_name);
        }

        if (data.type === 'updated') {
          options.db = data.db_name;

          exports.requestChanges(options, function (err, change) {

            if (err) {
              return callback(err);
            }

            return callback(null, {
              name: data.db_name,
              data: change.results[0].doc
            });

          });

        }

      }

    });

  });

};


/**
 * polls for newly added dbs and adds them to the db pool
 */
exports.updatePool = function (options, callback) {
  var timer;

  (function () {
    var interval = options.interval + 1;

    timer = function () {
      --interval;

      couchr.get(url.resolve(options.url, '/_all_dbs'), function (err, dbs) {
        if (err) {
          return callback(err);
        }

        pool = dbs.filter(function (db) {
          //dont return system dbs
          return db.match(/^(?!_)/);
        });

        pool = pool.map(function (db) {
          return db;
        });

      });

      if (interval >= 40) {
        setTimeout(timer, interval);
      }

    };

    timer();

  })();

  return callback(null);

};


/**
 * Remove a db from the pool
 */
exports.removeDB = function (pool, db) {

  for (var i = 0; i < pool.length; i++) {

    if (pool[i].db === db) {
      return pool.splice(i, 1)[0];
    }

  }

};


/**
 * Makes a request to the changes feed of a given db, this returns an object with
 * the new since value.
 */
exports.requestChanges = function (options, cb) {
  var db_url = url.resolve(options.url, options.db);
  var queue = async.queue(function (task, callback) {

    var query = {
      feed: task.cfg.feed,
      include_docs: task.cfg.include_docs,
      descending: task.cfg.descending,
      limit: task.cfg.limit
    };

    couchr.get(task.cfg.url + '/_changes', query, function (err, data) {
      if (err) {
        return cb(err);
      }

      query.since = data.last_seq;

      cb(null, data);
      callback(null, data);
    });

  }, 4);

  queue.push({
    cfg: {
      url: db_url,
      feed: 'normal',
      include_docs: true,
      descending: true,
      limit: 1
    }
  }, function (err) {
    if (err) {
      return cb(err);
    }
  });

};

