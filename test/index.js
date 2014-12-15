/* global require, describe, before, it*/

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var couchr = require('couchr');
var async = require('async');
var url = require('url');
var expect = require('expect.js');

var ChangesFeed = require('../');
var host = 'http://127.0.0.1:5984';

var feed = new ChangesFeed({
  url: host
});

describe('all dbs changes feed', function () {

  before(function (done) {
    this.db_path = url.resolve(host, 'a');

    async.series([
      async.apply(couchr.put, this.db_path)
    ],
    function () {
      done();
    });
  });

  it('should expose a readable stream', function () {
    expect(feed.readable).to.be.ok();
  });

});
