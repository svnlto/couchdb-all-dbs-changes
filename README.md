# couchdb-all-dbs-changes

EventEmitter on _all_dbs

```js

var allDBsChangesPool = require('all-dbs-changes');
var couch_url = 'http://localhost:5984';

allDBsChangesPool.start(couch_url, function (err, pool) {

  if (err) {
    console.log(err);
  }

  pool.on('data', function (db) {
    db.data.results.forEach(function (result) {
      /.../
    });

  });

});

```

### todos:

* request queue
* pass through options to changes feed.
