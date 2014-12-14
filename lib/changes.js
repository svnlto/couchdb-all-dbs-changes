'use strict';

var couchr = require('couchr');
var url = require('url');

var db_updates = require('./db_updates');

// dbs that we are interested in.
var pool = [];

/**
 * Creates a new changes pool
 */
exports.create = function (couch_url, callback) {

  db_updates.available(couch_url, function (err, exists) {

    if (err) {
      return callback(err);
    }

    if (exists) {
      exports.createDbUpdatesPool(couch_url, function (err, data) {
        return callback(null, data);
      });
    }

  });

};


/**
 *
 */
exports.createDbUpdatesPool = function (couch_url, callback) {

  exports.updatePool(couch_url, function (err) {

    if (err) {
      return callback(err);
    }

    db_updates.listen(couch_url, function (err, data) {

      // only listen to feeds
      if (pool.indexOf(data.db_name) !== -1) {

        if (err) {
          return callback(err);
        }

        if (data.type === 'deleted') {
          exports.removeDB(pool, data.db_name);
        }

        if (data.type === 'updated') {
          var dbUrl = url.resolve(couch_url, data.db_name);

          exports.requestChanges(dbUrl, function (err, change) {

            if (err) {
              return callback(err);
            }

            return callback(null, {
              name: data.db_name,
              data: change
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
exports.updatePool = function (couch_url, callback) {
  // TODO: timeout to clear interval
  var f = [];

  setInterval(function () {

    couchr.get(url.resolve(couch_url, '/_all_dbs'), function (err, dbs) {
      if (err) {
        return callback(err);
      }

      pool = dbs.filter(function (db) {
        // dont return system dbs
        return db.match(/^(?!_)/);
      });

      pool.forEach(function (db) {
        f.push(db);
      });

      pool.concat(f);

    });

  }, 500);

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
exports.requestChanges = function (db_url, callback) {
  // TODO: add request queue
  var query = {
    feed: 'normal',
    include_docs: true,
    descending: true,
    limit: 1
  };

  couchr.get(db_url + '/_changes', query, function (err, data) {

    if (err) {
      return callback(err);
    }

    query.since = data.last_seq;

    return callback(null, data);

  });

};

