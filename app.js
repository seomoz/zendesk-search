/*global console, ZendeskSearch*/
(function () {
    "use strict";
    return {
        events: {
            'click #admin-toggle' : 'adminViewHandler',
            'click .addbutton': 'addToES',
            'click .add-tag': 'addToTicket',
            'click .remove-tag': 'removeFromES',
            'click .search-add-button': 'searchForAdd',
            'click .search-remove-button': 'searchForRemove',
            'click .initialize': 'initialize'
        },

        getZendesk: function () {
            if (this.zs === undefined) {
                this.zs = new ZendeskSearch({
                    host: this.setting('host'),
                    index: this.setting('index')
                });
            }
            return this.zs;
        },

        searchForAdd: function () {
            var me = this,
                query = this.$('#search-add-tag').val().toLowerCase().trim();
            this.getZendesk().search(query, function (response) {
                console.log(response);
                var results = ['hello', 'world']; // REMOVE: testing fake results. Should "response.results;"
                results.forEach(function(result) {
                    var esTag = me.$('<div class="es-tag add-tag">' + result + '</div>');
                    me.$('#es-add-results').append(esTag);
                });
                me.$('#search-add-tag').val('');
            });
        },

        searchForRemove: function () {
            var me = this,
                query = this.$('#search-remove-tag').val().toLowerCase().trim();
            this.getZendesk().search(query, function (response) {
                console.log(response);
                var results = ['hello', 'world']; // REMOVE: testing fake results. Should "response.results;"
                results.forEach(function(result) {
                    var esTag = me.$('<div class="es-tag remove-tag">' + result + '</div>');
                    me.$('#es-remove-results').append(esTag);
                });
                me.$('#search-remove-tag').val('');
            });
        },

        addToTicket: function(event) {
            var tag = this.$(event.target).html();
            this.ticket().tags().add(tag);
            this.$(event.target).remove();
        },

        addToES: function () {
            var me = this,
                tag = this.$('#add-tag').val().toLowerCase().trim();
            tag.replace(' ', '_');
            this.getZendesk().add(tag, function () {
                console.log('Added tag ' + tag);
                me.$('#add-tag').val('');
            });
        },

        removeFromES: function (event) {
            var me = this,
                tag = this.$(event.target).html();
            this.getZendesk().remove(tag, function () {
                console.log('Removed tag ' + tag);
                me.$('#remove-tag').val('');
                me.$(event.target).remove();
            }, function () {
                console.log('Failed to remove tag ' + tag);
            });
        },

        adminViewHandler: function(event) {
            event.preventDefault();
            var menuText = this.$("#zendesk-tag-admin-content").is(":visible") ? "admin view" : "close admin";
            this.$("#admin-toggle").html(menuText);
            this.$("#zendesk-tag-admin-content").toggle();
            this.$("#zendesk-tag-widget-content").toggle();
        },

        initialize: function () {
            this.getZendesk().initialize(1, 0, function () {
                console.log('Initialized index');
            }, function () {
                console.log('Failed to initialize index');
            });
        }
    };
}());