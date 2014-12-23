 /* global require, describe, before, it*/

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var couchr = require('couchr');
var async = require('async');
var url = require('url');
var expect = require('expect.js');

var ChangesFeed = require('../');
var host = 'http://127.0.0.1:5984';

describe('all dbs changes feed', function () {

  before(function (done) {
    var self = this;

    this.db_path = url.resolve(host, 'a');

    this.change = null;
    this.error = null;

    async.series([
      async.apply(couchr.put, this.db_path)
    ],
    function () {
      self.feed = new ChangesFeed({
        url: host
      });

      done();
    });
  });

  beforeEach(function () {
    this.feed.on('change', function (change) {
      this.change = change;
    }.bind(this));

    this.feed.on('error', function (error) {
      this.error = error;
    });
  });

  it('should provide a constructor', function () {
    expect(this.feed instanceof ChangesFeed).to.be.ok();
  });

  it('should implement an even emitter', function () {
    expect(this.feed.on).to.be.ok();
  });

  it('should post a doc and trigger a change on the feed', function (done) {
      couchr.post(this.db_path, {
        name: 'test_doc'
      }, function (err, resp) {
        console.log(this.change, this.error);
        done();
      }.bind(this));
  });

  it('should', function (done) {
    this.timeout(5000);
    done();
  });

});
