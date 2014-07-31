/*global console, ZendeskSearch*/
(function () {
    "use strict";
    return {
        events: {
            'click .searchbutton': 'search'
        },
        search: function () {
            var es = new ZendeskSearch({
                host: this.setting('host'),
                index: 'dummy-index'
            });
            es.search('hello', function (results) {
                console.log(results);
            });
        }
    };
}());