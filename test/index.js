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

    async.series([
      async.apply(couchr.put, this.db_path)
    ],
    function () {

      this.feed = new ChangesFeed({
        url: host
      });

      setTimeout(function () {
        done();
      }, 1000);
    }.bind(this));
  });

  after(function (done) {
    couchr.del(this.db_path, function () {
     done();
    });
  });

  it('should provide a constructor', function () {
    expect(this.feed instanceof ChangesFeed).to.be.ok();
  });

  it('should implement an even emitter', function () {
    expect(this.feed.on).to.be.ok();
  });

  it('should receive inserted doc through feed', function (done) {
    var doc = {
      name: 'test_doc'
    };

    couchr.post(this.db_path, doc, function () {
      this.feed.on('change', function (a) {
        expect(a.name).to.eql('a');
        expect(a.doc.name).to.eql(doc.name);
        done();
      });
    }.bind(this));
  });

});
