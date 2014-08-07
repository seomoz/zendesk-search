/*global console, ZendeskSearch*/
(function () {
    "use strict";
    return {
        events: {
            'click .addbutton': 'add',
            'click .searchbutton': 'search',
            'click .removebutton': 'remove',
            'click .initialize': 'initialize'
        },

        getZendesk: function() {
            if (this.zs === undefined) {
                this.zs = new ZendeskSearch({
                    host: this.setting('host'),
                    index: this.setting('index')
                });
            }
            return this.zs;
        },

        search: function () {
            var query = this.$('#search').val();
            this.getZendesk().search(query, function (results) {
                console.log(results);
            });
        },

        add: function () {
            var tag = this.$('#add-tag').val();
            this.getZendesk().add(tag, function () {
                console.log('Added tag ' + tag);
            });
        },

        remove: function () {
            var tag = this.$('#remove-tag').val();
            this.getZendesk().remove(tag, function () {
                console.log('Removed tag ' + tag);
            }, function () {
                console.log('Failed to remove tag ' + tag);
            });
        },

        initialize: function() {
            this.getZendesk().initialize(1, 0, function () {
                console.log('Initialized index');
            }, function () {
                console.log('Failed to initialize index');
            });
        }
    };
}());