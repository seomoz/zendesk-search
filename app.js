(function() {
  return {
    events: { 
     'click .searchbutton': 'sayHello'
    },
    sayHello: function() {
      alert('Hello');
    }
  };
}());