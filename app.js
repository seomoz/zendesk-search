/* Create an object that can be used to interact with our search database
 *
 * It requires a configuration object:
 *
 *      - host: The elasticsearch host and port to connect to
 *          Example: 'http://localhost:9200/'
 *      - index: The name of the elasticsearch index you're working with
 *          Example: 'zendesk'
 */
function ZendeskSearch(config) {
    this.config = config;
    ejs.client  = ejs.jQueryClient(config['host']);

    /* The name of this type in Elasticsearch */
    this.estype = 'zendesk-ticket';
    /* The schema of documents in elasticsearch */
    this.schema = {
        // We don't want to enable saving the source in elasticsearch
        '_source': {
            'enabled': false
        }, 'properties': {
            'tags': {
                // The tags we're storing with each ticket
                'type': 'string',
                'index': 'not_analyzed',
                'store': 'yes'
            }, 'text': {
                // The textual content of the ticket
                'type': 'string',
                'analyzer': 'default',
                'store': 'no'
            }, 'name': {
                // The name of the ticket
                'type': 'string',
                'analyzer': 'default',
                'store': 'yes'
            }, 'created': {
                // The date the ticket was created
                'type': 'date',
                'index': 'not_analyzed',
                'store': 'yes'
            }
        }
    };
}

/* Ensure all of our dependencies are included */
ZendeskSearch.prototype.include = function(urls, callback) {
    // Check our termination condition
    var me = this;
    if (urls.length === 0) {
        return callback.call(me);
    }

    var head = document.getElementsByTagName("head")[0];
    var segments = urls[0].split('/');
    var eid = segments[segments.length-1];
    var script = document.getElementById(eid);
    if (script !== null) {
        return me.include(urls.splice(1), callback);
    }

    console.log('Including url ' + urls[0]);
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = eid;
    script.onload = function() {
        me.include(urls.splice(1), callback);
    };
    script.src = urls[0];
    head.appendChild(script);
};

/* Ensure all of our dependencies are included */
ZendeskSearch.prototype.includes = function(callback) {
    this.include([
        'https://github.com/fullscale/elastic.js/raw/master/dist/elastic.min.js',
        'https://github.com/fullscale/elastic.js/raw/master/dist/elastic-jquery-client.min.js',
        'http://code.jquery.com/jquery-1.9.1.min.js'
    ], callback);
};

/* Intitialize the elasticsearch index we're using to be ready to go */
ZendeskSearch.prototype.initialize = function(callback) {
    var url = '/' + this.config['index'];
    var data = {
        'settings': {
            'number_of_shards': 5,
            'number_of_replicas': 2
        }, 'mappings': {
        }
    };
    data['mappings'][this.estype] = this.schema;

    ejs.client.post(url, JSON.stringify(data), callback, function(err) {
        console.log('Error making index');
        console.log(err);
    });
};

/* Add a document to the search cluster. If the document already exists, then
 * it's considered an update. Each doc object is expected to have at least the
 * following attributes:
 *
 *      - id: The id of the zendesk ticket
 *      - name: Name of the ticket in zendesk
 *      - created: A Date object representing when the doc was created
 *      - text: The string text content of the ticket
 *      - tags: An array of strings -- the tags associated with the ticket
 */
ZendeskSearch.prototype.add = function(doc, callback) {
    var me = this;
    ejs.Document(
        this.config['index'], this.estype, doc['id']).source({
            name: doc['name'],
            created: doc['created'],
            text: doc['text'],
            tags: ['foo', 'bar', 'whiz']
        }).refresh(true).doIndex(function() {
            callback.call(me, doc);
        });
};

/* Search for any tickets that match the provided query string */
ZendeskSearch.prototype.search = function(query, callback) {
    var me = this;
    /* Build up a request object */
    var request = ejs.Request()
        .indices(this.config['index'])
        .types(this.estype)
        .fields(['tags', 'name', 'created'])
        .query(ejs.TermQuery('tags', query));

    console.log(request.toString());
    request.doSearch(function(results) {
        var result = {
            took: results['took'],
            total: results['hits']['total'],
            results: []
        };
        for (var i = 0; i < results['hits']['hits'].length; ++i) {
            var item = results['hits']['hits'][i];
            result.results.push({
                'id': item['_id'],
                'name': item['fields']['name'],
                'tags': item['fields']['tags'],
                'created': item['fields']['created']
            });
        }
        callback.call(me, result);
    });
};

/* Find tags that are similar to the provided query string */
ZendeskSearch.prototype.tags = function(query, callback) {
    var url = '/_suggest';
    var data = {
        'suggestion': {
            'text': query,
            'term': {
                'field': 'tags'
            }
        }
    };
    
    ejs.client.post(url, JSON.stringify(data), callback, function(err) {
        console.log('Error getting tags');
        console.log(err);
    });
};
