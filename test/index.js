 'use strict';

var couchr = require('couchr');
var async = require('async');
var url = require('url');

var ChangesFeed = require('../');

describe('all dbs changes feed', function () {

  before(function (done) {
    var self = this;
    var host = 'http://127.0.0.1:5984';


    this.db_path = url.resolve(host, 'a');

    async.series([
      async.apply(couchr.put, this.db_path)
    ],
    function (err, res) {
      done();
    });

  });

  beforeEach(function () {
  });

  it('set up listener', function (done) {

  });

});
