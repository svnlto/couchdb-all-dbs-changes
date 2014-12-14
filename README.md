# couchdb-all-dbs-changes

readable stream on couchdb' _all_dbs

```js

  var couch_url = 'http://localhost:5984';
  var ChangesFeed = require('./index');

  var feed = new ChangesFeed({
    url: couch_url
  });

  feed.on('data', function (a) {
    /.../
  });

  feed.on('error', function (err) {
    /.../
  });

```

### todos:

* request queue
* pass through options to changes feed.
