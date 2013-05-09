Zendesk Search
==============
Sam and friends have been hoping for a way to get search working with
zendesk, and this is a project where we're trying to make that happen!

Files
=====
There's a wrapper designed to communicate with whatever search backend we
use kept in `zendesk-search.js`. It happens to work with elasticsearch, and
knows how to:

- create an index and schema
- add zendesk tickets
- search zendesk tickets
- suggest matching tags (this requires elasticsearch 0.90.0+, which we haven't
    yet used)

Trying it Out
=============
If you have access to an elasticsearch node, then:

```javascript
// This is just to include all of the dependencies
ZendeskSearch.prototype.includes(function() { console.log('Loaded'); });
// Create an instance of `ZendeskSearch`
var zendesk = new ZendeskSearch({
    // Put the elasticsearch host in here
    'host': 'http://my.elasticsearch.host:9200',
    // The name of the index we're using for this particular ES cluster
    'index': 'zendesk'
});
```

Initializing the Index
----------------------
Before you can insert documents into Elasticsearch, you have to create an
index. This is something that only has to be done _once_, and __not__ once per
session.

```javascript
zendesk.initialize(function() { console.log('Initialized'); });
```

Searching
---------
To find tickets with a particular tag:

```javascript
// Find all the tickets tagged 'foo'
zendesk.search('foo', function(results) {
    /**
     *  {
     *      'took': 4,
     *      'total': 1,
     *      'results': [{
     *          'id': '1',
     *          'name': 'Testing'
     *          'created': '2013-05-09T20:43:40.588Z',
     *          'tags': ['foo', 'bar', 'whiz']
     *      }]
     *  }
     */
    console.log('Found ' + results['took'] + ' results');
});
```

I haven't added wildcards here, but I think it's definitely doable. Newer
versions of elasticsearch also have support for suggesting alternate tags.

Adding docs
-----------
Currently, all documents require `id`, `name`, `created`, `text` and `tags`
attributes. Those can easily be changed, but I figured it was a good place to
start:

```javascript
zendesk.add({
    'id': 1,
    'name': 'Testing Name',
    'created': new Date(),
    'text': 'This is an example document',
    'tags': ['foo', 'bar', 'whiz']
}, function() { console.log('Added'); });
```
