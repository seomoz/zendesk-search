(function() {
  return {
    events: {
      'app.activated': 'initialize',
      'click .searchbutton': 'sayHello'
    },
    sayHello: function() {
      alert(this.client.config);
    },
    initialize: function() {
      this.client = new ZendeskSearch({
        'host': this.setting('host')
      });
    }
  };
}());