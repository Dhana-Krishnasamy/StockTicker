/* © Copyright Vasantham Technologies Limited 2015
 * -----------------------------------------------
 * This file and the source code contained herein are the property of Vasantham Technologies Limited 
 * and are protected by English copyright law. All usage is restricted as per 
 * the terms & conditions of Vasantham Technologies Limited. You may not alter or remove 
 * any trademark, copyright or other notice from copies of the content.
 
 * The code contained herein may not be reproduced, copied, modified or redistributed in any form
 * without the express written consent by an officer of Vasantham Technologies Limited.
 */

/* global angular, _ */

(function () {
    var app = angular.module('myApp.dataService', []);
    app.factory('dataService', function ($http, $log, $q) {
        var dataService = {};
        var registery = {
        };
        var webSocket = new WebSocketClient();
        webSocket.setMessageListener(dispatcher);
        dataService.loadData = loadData;
        dataService.registerForTick = registerForTick;
        dataService.unRegister = unRegister;

        return dataService;

        function loadData(tick, from, to) {
            //$log.log('loading data from:' + from + ', to:' + to)
            var defer = $q.defer();
            $http.get('data/' + tick.toLowerCase() + '.csv').success(function (data, status) {
                //$log.log('status:' + status);
                //$log.log(data.split('\n'));
                var values = [];
                data.split('\n').slice(1).forEach(function (line) {
                    var lines = line.split(',');
                    var high = parseInt(lines[2]);
                    var low = parseInt(lines[3]);
                    values.push({
                        Date: new Date(lines[0].trim()),
                        High: high,
                        Low: low
                    });

                });
                defer.resolve(_.filter(values, function (v) {
                    return (v.Date.getTime() > from.getTime()) && (v.Date.getTime() < to.getTime());
                }));
            });

            return defer.promise;
        }

        function registerForTick(tick, callback) {
            var callbacks = registery[tick];
            if (!callbacks) {
                registery[tick] = [];
            }
            registery[tick].push(callback);
            function loop() {
                setTimeout(function () {
                    if (webSocket.isConnecting) {
                        loop();
                        return;
                    }
                    if (!webSocket.isOpen) {
                        webSocket.reconect().then(function () {
                            webSocket.sendData({tick: tick, register: true});
                        });
                    } else {
                        webSocket.sendData({tick: tick, register: true});
                    }
                }, 2);
            }
            loop();

        }
        function unRegister(tick, callback) {
            var callbacks = registery[tick];
            var idx = callbacks.indexOf(callback);
            if (idx >= 0) {
                console.log('unregister callback at ' + idx);
                callbacks.splice(idx, 1);
            } else {
                console.log('can not find ' + idx);
            }
            if (callbacks.length === 0)
                webSocket.sendData({tick: tick, register: false});
        }

        function dispatcher(data) { 
            var callbacks = registery[data.tick] || [];
            var cnt = 0;
            callbacks.forEach(function (cb) {
                if (cb) {
                    cb(data.ticks);
                    cnt++;
                }
            });
            //console.log('dispatch:[' + data.tick + ']:' + cnt);
        }


        function WebSocketClient() {
            var WebSocketClient = this;
            WebSocketClient.isOpen = false;
            WebSocketClient.isConnecting = false;
            WebSocketClient.serverSock = false;

            WebSocketClient.reconect = function () {
                WebSocketClient.isConnecting = true;
                var defer = $q.defer();
                WebSocketClient.serverSock = new WebSocket("ws://localhost:8080/events/");
                WebSocketClient.serverSock.onopen = function () {
                    WebSocketClient.isOpen = true;
                    WebSocketClient.isConnecting = false;
                    defer.resolve();
                };
                WebSocketClient.serverSock.onmessage = function (data) {
                    //console.log('New message from server:' + JSON.stringify(data.data));
                    if (!WebSocketClient.callback) {
                        console.log('no call back found ' + JSON.stringify(data.data));
                        return;
                    }
                    WebSocketClient.callback(JSON.parse(data.data));
                };
                WebSocketClient.serverSock.onclose = function () {
                    WebSocketClient.isOpen = false;
                };
                WebSocketClient.serverSock.onerror = WebSocketClient.serverSock.onclose;
                return defer.promise;
            };

            WebSocketClient.sendData = function (data) {
                WebSocketClient.serverSock.send(JSON.stringify(data));
            };
            WebSocketClient.setMessageListener = function (cb) {
                if (!cb) {
                    console.log('invalid cb');
                    return;
                }

                WebSocketClient.callback = cb;

            };
            return WebSocketClient;
        }
    });


})();


