/* © Copyright Vasantham Technologies Limited 2015
 * -----------------------------------------------
 * This file and the source code contained herein are the property of Vasantham Technologies Limited 
 * and are protected by English copyright law. All usage is restricted as per 
 * the terms & conditions of Vasantham Technologies Limited. You may not alter or remove 
 * any trademark, copyright or other notice from copies of the content.
 
 * The code contained herein may not be reproduced, copied, modified or redistributed in any form
 * without the express written consent by an officer of Vasantham Technologies Limited.
 */
/* global angular */

(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('myApp', [
        'ngRoute',
        'myApp.view1',
        'myApp.view2',
        'myApp.version',
        'myApp.historicalChart',
        'myApp.realtimeChart'
    ]).
            config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.otherwise({redirectTo: '/view1'});
                }]);
})();

