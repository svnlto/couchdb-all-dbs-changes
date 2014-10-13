 'use strict';

var couchr = require('couchr');
var utils = require('./lib/utils');
var async = require('async');
var path = require('path');
var url = require('url');
var urlFormat = url.format;
var urlParse = url.parse;

var changesFeed = require('../');


var COUCH = {
  user: 'admin',
  pass: 'password',
  url: 'http://localhost:8985',
  data_dir: path.resolve() + '/data'
};

var DEFAULT_OPTIONS = {
  couchdb: COUCH
};

describe('all dbs changes feed', function () {

  beforeEach(function (done) {

    var self = this;
    utils.setupCouch(COUCH, function (err, couch) {

      if (err) {
        return done(err);
      }

      self.couch = couch;

      var base = url.parse(COUCH.url);
      base.auth = COUCH.user + ':' + COUCH.pass;
      base = url.format(base);

      self.base_url = base;

      async.series([
        async.apply(couchr.put, url.resolve(base, 'a'))
      ],
      function (err, res) {
        done();
      });

    });

  });

  afterEach(function (done) {
    utils.stopCouch(COUCH, this.couch, done);
  });

  it('set up listener', function (done) {
    done();
  });

});
