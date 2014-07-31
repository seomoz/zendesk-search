/*global alert*/
(function () {
    "use strict";
    return {
        events: {
            'click .searchbutton': 'sayHello'
        },
        sayHello: function () {
            alert('Hello');
        }
    };
}());