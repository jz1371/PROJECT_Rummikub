/**
 * Created by Steven on 3/15/15.
 */

'use strict';

angular.module('myApp').filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});
