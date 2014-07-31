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
            console.log(es);
        }
    };
}());