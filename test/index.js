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
    this.db_path = url.resolve(host, 'a');
    this.feed = new ChangesFeed({
      url: host
    });

    async.series([
      async.apply(couchr.put, this.db_path)
    ],
    function () {
      done();
    });
  });

  it('should provide a constructor', function () {
    expect(this.feed instanceof ChangesFeed).to.be.ok();
  });

  it('should expose a readable stream', function () {
    expect(this.feed.readable).to.be.ok();
  });

  it('should post a doc and trigger a change on the feed', function () {
    // create feed listener
    //  post doc to db
    //   see change come in through stream
  });

});
