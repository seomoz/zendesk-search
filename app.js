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
            var query = this.$('#search').val().toLowerCase().trim();
            this.getZendesk().search(query, function (results) {
                console.log(results);
                $$('#search').val();
            });
        },

        add: function () {
            var tag = this.$('#add-tag').val().toLowerCase().trim();
            tag.replace(' ', '_');
            var ticket = this.ticket();
            this.getZendesk().add(tag, function () {
                console.log('Added tag ' + tag);
                $$('#add-tag').val(''); 
            });

            ticket.tags().add(tag);
        },

        remove: function () {
            var tag = this.$('#remove-tag').val().toLowerCase().trim();
            tag.replace(' ', '_');
            var ticket = this.ticket();
            this.getZendesk().remove(tag, function () {
                console.log('Removed tag ' + tag);
                $$('#remove-tag').val('');
            }, function () {
                console.log('Failed to remove tag ' + tag);
            });

            ticket.tags().remove(tag);
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