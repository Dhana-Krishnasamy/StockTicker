/* © Copyright Vasantham Technologies Limited 2015
 * -----------------------------------------------
 * This file and the source code contained herein are the property of Vasantham Technologies Limited 
 * and are protected by English copyright law. All usage is restricted as per 
 * the terms & conditions of Vasantham Technologies Limited. You may not alter or remove 
 * any trademark, copyright or other notice from copies of the content.
 
 * The code contained herein may not be reproduced, copied, modified or redistributed in any form
 * without the express written consent by an officer of Vasantham Technologies Limited.
 */


/* global angular, d3 */

(function () {
    var app = angular.module('myApp.historicalChart', []);
    app.directive('historicalChart', ['$log',
        function ($log) {
            return {
                scope: {
                    value: '='
                },
                link: function ($scope, iElm, iAttrs, controller) {
                    var historicalChart = new HistoricalChart(iElm);
                    updatePrice();
                    $scope.$watch('value', updatePrice, true);
                    function updatePrice() {
                        var v = $scope.value;
                        if (!angular.isArray(v))
                            v = [v];
                        historicalChart.render(v);
                    }
                }
            };
        }
    ]);


    function HistoricalChart(element) {
        var HistoricalChart = this;
        var margin = {
            left: 35,
            right: 20,
            top: 25,
            bottom: 25
        };
        HistoricalChart.height = 260 - margin.top - margin.bottom;
        HistoricalChart.width = 960 - margin.left - margin.right;
        HistoricalChart.canvas = d3.select(element[0]).attr({
            "width": HistoricalChart.width + margin.left + margin.right,
            "height": HistoricalChart.height + margin.top + margin.bottom
        })
                .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        HistoricalChart.xScale = d3.time.scale().rangeRound([0, HistoricalChart.width]);
        HistoricalChart.yScale = d3.scale.linear().range([HistoricalChart.height, 0]);
        HistoricalChart.xAxis = d3.svg.axis().scale(HistoricalChart.xScale).orient("Bottom").tickFormat(d3.time.format('%d/%b/%y'));
        HistoricalChart.yAxis = d3.svg.axis().scale(HistoricalChart.yScale).orient('left');
        HistoricalChart.yScaleMax = 0;
        HistoricalChart.color = d3.scale.category10();
        //Set Axis
        HistoricalChart.canvas.selectAll('g.x.axis').data([1])
                .enter().append("g").attr({
            'class': 'x axis',
            'transform': 'translate(0,' + HistoricalChart.height + ')'
        }).call(HistoricalChart.xAxis);

        HistoricalChart.canvas.selectAll('g.y.axis').data([1])
                .enter().append("g").attr({
            'class': 'y axis'
        }).call(HistoricalChart.yAxis);

        HistoricalChart.HighPathGen = pathGenerator('Date', 'High');
        HistoricalChart.LowPathGen = pathGenerator('Date', 'Low');
        function pathGenerator(xProp, yProp) {
            return d3.svg.line()
                    .x(function (d) {
                        return HistoricalChart.xScale(d[xProp]);
                    })
                    .y(function (d) {
                        return HistoricalChart.yScale(d[yProp]);
                    }).interpolate("linear");
        }

    }

    HistoricalChart.prototype.render = function (stock) {
        if (!angular.isArray(stock))
            return;
        var HistoricalChart = this;
        var px = [];
        stock.forEach(function (s) {
            s.prices.forEach(function (d) {
                px.push(d.High);
                px.push(d.Low);
            });
        });
        var dates = [];
        stock.forEach(function (s) {
            s.prices.forEach(function (ss) {
                ss.Date = new Date(ss.Date);
                dates.push(ss.Date);
            });
        });
        if (dates.length > 0)
            HistoricalChart.xScale.domain([dates[dates.length - 1], dates[0]]);
        if (px.length > 0)
            HistoricalChart.yScale.domain([Math.floor(d3.min(px)), Math.ceil(d3.max(px))]);

        HistoricalChart.canvas.select(".x.axis")
                .transition()
                .duration(1000)
                .call(HistoricalChart.xAxis);
        HistoricalChart.canvas.select(".y.axis")
                .transition()
                .duration(1000)
                .call(HistoricalChart.yAxis);

        var lineG = HistoricalChart.canvas.selectAll('g.priceLine')
                .data(stock, function (d) {
                    return d.name;
                });

        //Enter
        var priceLine = lineG.enter().append('g')
                .attr('class', 'priceLine');
        priceLine.append("path")
                .attr({
                    "class": 'high',
                    stroke: function (d, i) {
                        return HistoricalChart.color(i);
                    }
                })
                .attr("d", function (d) {
                    return HistoricalChart.HighPathGen(d.prices);
                });
        priceLine.append("path")
                .attr({
                    "class": 'low',
                    stroke: function (d, i) {
                        return HistoricalChart.color(10 - i);
                    }
                })
                .attr("d", function (d) {
                    return HistoricalChart.LowPathGen(d.prices);
                });
        //Update 
        lineG.select('path.high').transition().duration(1000).delay(250)
                .attr("d", function (d) {
                    return HistoricalChart.HighPathGen(d.prices);
                });
        lineG.select('path.low').transition().duration(1000).delay(250)
                .attr("d", function (d) {
                    return HistoricalChart.LowPathGen(d.prices);
                });
        //Exit
        lineG.exit().transition().duration(500).duration(250).remove();

    };

})();