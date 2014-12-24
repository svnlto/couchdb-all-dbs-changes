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
});

feed.on('error', function (error) {
  console.log(error);
});


```
