/**
 * File: app/js/filters/filters.js
 * ----------------------------------------
 * provide range filter for ng-repeat
 *
 * usage (repeat 3 times) :
 *
 *      ng-repeat="i in [] | range: 3"
 *
 * ----------------------------------------
 * @author: Jingxin Zhu
 * @date:   2015.03.15
 *
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
