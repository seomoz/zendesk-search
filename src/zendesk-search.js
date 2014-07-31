/*global ejs, console*/

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
    "use strict";
    this.config = config;
    ejs.client  = ejs.jQueryClient(config.host);

    /* The name of this type in Elasticsearch */
    this.estype = 'zendesk-tag';
    /* The schema of documents in elasticsearch */
    this.schema = {
        // We don't want to enable saving the source in elasticsearch
        '_source': {
            'enabled': false
        },
        'properties': {
            'name': {
                // The tag's name
                'type': 'string',
                'store': 'yes'
            }
        }
    };
}

/* Intitialize the elasticsearch index we're using to be ready to go */
ZendeskSearch.prototype.initialize = function (shards, replicas, cb, errb) {
    "use strict";
    var url = '/' + this.config.index,
        data = {
            'settings': {
                'number_of_shards': shards,
                'number_of_replicas': replicas
            },
            'mappings': {}
        };
    data.mappings[this.estype] = this.schema;

    ejs.client.post(url, JSON.stringify(data), cb, function (err) {
        console.log('Error making index');
        console.log(err);
        errb(err);
    });
};

/* Add a tag to the search cluster */
ZendeskSearch.prototype.add = function (tag, cb) {
    "use strict";
    var me = this;
    ejs.Document(
        this.config.index,
        this.estype,
        tag
    ).source({
        name: tag
    }).refresh(true).doIndex(function (doc) {
        cb.call(me, doc);
    });
};

/* Search for any tickets that match the provided query string */
ZendeskSearch.prototype.search = function (query, cb) {
    "use strict";
    var i = 0,
        me = this,
    /* Build up a request object */
        request = ejs.Request()
            .indices(this.config.index)
            .types(this.estype)
            .fields(['name'])
            .query(ejs.QueryStringQuery(query));

    console.log(request.toString());
    request.doSearch(function (results) {
        var result = {
            took: results.took,
            total: results.hits.total,
            results: []
        };
        for (i = 0; i < results.hits.hits.length; i += 1) {
            result.results.push(results.hits.hits[i].fields.name);
        }
        cb.call(me, result);
    });
};

/* Delete a tag */
ZendeskSearch.prototype.remove = function (tag, cb, errb) {
    "use strict";
    ejs.Document(this.config.index, this.estype, tag).doDelete(cb, errb);
};
