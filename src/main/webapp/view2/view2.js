/* global angular, d3 */

(function () {
    'use strict';

    angular.module('myApp.view2', ['ngRoute', 'myApp.dataService'])

            .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.when('/view2', {
                        templateUrl: 'view2/view2.html',
                        controller: 'View2Ctrl'
                    });
                }])
            .controller('View2Ctrl', ['$scope', 'dataService', function ($scope, dataService) {
                    var format = d3.time.format("%Y-%m-%d %H:%M:%S.%L");
                    var tickIntervel = 500, startDate = format.parse('2010-10-11 08:05:10.000').getTime();

                    $scope.startDate = '2010-10-11';
                    $scope.stocks = [];
                    ['msft','vod.l', 'ubs.l'].forEach(function (tick) {
                        var stock = {
                            name: tick,
                            last: {Date: '', High: 0},
                            cache: []
                        };
                        stock.onUpdate = drainQueue(stock);
                        stock.fillCallback = fillQueue(stock);
                        dataService.registerForTick(tick, stock.fillCallback);
                        genInitData(stock.cache, 2);
                        stock.last.High = stock.cache.slice(-1)[0].High;
                        stock.last.Date = stock.cache.slice(-1)[0].Date;
                        $scope.stocks.push(stock);
                    });
                    $scope.$on('$destroy', function () {
                        $scope.stocks.forEach(function (stock) {
                            dataService.unRegister(stock.name, stock.fillCallback);
                        });
                        console.log('destroy');
                    });
                    function drainQueue(_this) {
                        return function () {
                            if (_this.cache.length <= 0)
                                return;
                            if (_this.cache.length > 1) {
                                console.log(format(new Date()) + ' drain:[' + _this.name + '] ' + _this.cache.length);
                            }
                            var nextTicks = _this.cache.splice(0, _this.cache.length);
                            return nextTicks;
                        };
                    }
                    function fillQueue(_this) {
                        return function (data) {
                            data.forEach(function (d) {
                                _this.cache.push({
                                    Date: format.parse($scope.startDate + ' ' + d.time),
                                    High: d.high
                                });
                            });
                            _this.last.Date = _this.cache.slice(-1)[0].Date;
                            _this.last.High = _this.cache.slice(-1)[0].High;
                            $scope.$apply();
                        };

                    }
                    function genInitData(ticks, seed) {
                        for (var i = 0; i < 50; i++) {
                            startDate = startDate + tickIntervel;
                            ticks.push({
                                Date: new Date(startDate),
                                High: seed + Math.random()
                            });
                        }
                    }
                }
            ]);
})();