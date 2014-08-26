/*global ejs, console, $*/

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
    this.client = new $.es.Client({
        hosts: this.config.host
    });

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

    /* Intitialize the elasticsearch index we're using to be ready to go */
    this.initialize = function (shards, replicas, cb, errb) {
        /* I've not gotten around to porting this to use the new Elasitcsearch
         * client */
    };

    /* Add a tag to the search cluster */
    this.add = function (tag, cb, errb) {
        var me = this;
        this.client.index({
            index: this.config.index,
            type: this.estype,
            body: {
                'name': tag
            },
            id: tag
        }, function(err, response, status) {
            if (err === null || err === undefined) {
                cb.call(me, response);
            } else {
                errb.call(me, response);
            }
        });
    };

    /* Search for any tickets that match the provided query string */
    this.search = function (query, cb, errb) {
        var me = this,
            i  = 0;
        this.client.search({
            index: this.config.index,
            body: {
                query: {
                    match: {
                        name: 'hello'
                    }
                },
                fields: ['name']
            }
        }, function (err, response, status) {
            if (err === null || err === undefined) {
                var result = {
                    took: response.took,
                    total: response.hits.total,
                    results: []
                };
                console.log(response);
                for (i = 0; i < response.hits.hits.length; i += 1) {
                    result.results.push(response.hits.hits[i].fields.name);
                }
                cb.call(me, result);
            } else {
                errb.call(me, err);
            }
        });

    };

    /* Delete a tag */
    this.remove = function (tag, cb, errb) {
        var me = this;
        this.client.delete({
            index: this.config.index,
            type: this.estype,
            id: tag
        }, function(err, response, status) {
            if (err === null || err === undefined) {
                cb.call(me, response);
            } else {
                errb.call(me, err);
            }
        });
    };
}
