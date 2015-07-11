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

    angular.module('myApp.view1', ['ngRoute', 'myApp.dataService'])

            .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.when('/view1', {
                        templateUrl: 'view1/view1.html',
                        controller: 'View1Ctrl'
                    });
                }])

            .controller('View1Ctrl', ['$scope', 'dataService', function ($scope, dataService) {
                    //Defaults
                    $scope.ticks = [
                        {name: 'MSFT', prices: {name: 'unknown', prices: []}},
                        {name: 'Vod.L', prices: {name: 'unknown', prices: []}}
                    ];
                    $scope.from = '2006-01-01';
                    $scope.to = '2011-01-01';
                    $scope.loadHistorical = function () {
                        var start = new Date($scope.from);
                        var to = new Date($scope.to);
                        $scope.ticks.forEach(function (tick) {
                            dataService.loadData(tick.name, start, to).then(function (prices) {
                                tick.prices.name = tick.name;
                                tick.prices.prices = prices;
                            });
                        });
                    };


                }]);
})();