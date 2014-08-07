/*global console, ZendeskSearch*/
(function () {
    "use strict";
    return {
        events: {
            'app.activated': 'initialize',
            'click .searchbutton': 'search'
        },

        initialize: function() {
            this.es = new ZendeskSearch({
                host: this.setting('host'),
                index: this.setting('index')
            });
        },

        search: function () {
            this.es.search('hello', function (results) {
                console.log(results);
            });
        }
    };
}());