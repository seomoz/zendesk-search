Zendesk Search
==============
![Status: Production](https://img.shields.io/badge/status-production-green.svg?style=flat)
![Team: Big Data](https://img.shields.io/badge/team-big_data-green.svg?style=flat)
![Scope: External](https://img.shields.io/badge/scope-external-green.svg?style=flat)
![Open Source: MIT](https://img.shields.io/badge/open_source-MIT-green.svg?style=flat)
![Critical: No](https://img.shields.io/badge/critical-yes-red.svg?style=flat)

Sam and friends have been hoping for a way to keep track of the tags that they
use for their tickets. Since the plugin architecture requires that it all be
JavaScript-based, we figured the quickest way to get that going would be to use
the REST ElasticSearch API.

Usage
=====
First things first, you'll need the dependencies:

```html
<script src="app.js"></script>
```

Then, you can initialize a client with a configuration:

```javascript
var client = new ZendeskSearch({
    host: 'http://hostname:9200/',
    index: 'index-name'
});
```

With that object in hand, you'll be able to find tags:

```javascript
/* Find all tags */
client.search('*', function(results) {
    for (var index in results['results']) {
        console.log('Found ' + results['results'][index]);
    }
});
```

And of course, you'll be able to add tags:

```javascript
/* Add a tag called foo */
client.add('foo', function(obj) { console.log(obj); });
```

And if you ever tire of the tags, you can of course, delete them:

```javascript
/* DELETE! DELETE! DELEEEEETE! */
client.remove('foo', function(obj) { console.log(obj); });
```

Building
========
There's a `Makefile` included in this source that will build up the `.zip` file
that we can upload. It builds everything in the `src` and then bundles up
`assets` and everything:

```bash
# After this, `zendesk-search.zip` will exist
make zip
```
