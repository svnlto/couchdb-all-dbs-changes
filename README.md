# couchdb-all-dbs-changes [![Build Status](https://travis-ci.org/svnlto/couchdb-all-dbs-changes.svg)](https://travis-ci.org/svnlto/couchdb-all-dbs-changes)

EventEmitter on \_all_dbs


## Install

```js
$ npm install couchdb-all-dbs-changes
```

## Usage

```js

var ChangesFeed = require('couchdb-all-dbs-changes');
var couch_url = 'http://localhost:5984';

var feed = new ChangesFeed({
  url: couch_url,
  interval: 5000 //optional
});

feed.on('change', function (change) {
  console.log(change);
  // { db: 'some_db',
  //  seq: 1,
  //  last_seq: 1,
  //  changes: [ { rev: '1-5531e47ffa2abd360505063ca714d5e2' } ],
  //  doc:
  //   { _id: 'ed63c9a78e7e46991957ec5858020085',
  //     _rev: '1-5531e47ffa2abd360505063ca714d5e2',
  //     name: 'some_doc'
  //   }
  // }
 });

feed.on('error', function (error) {
  console.log(error);
});


```
