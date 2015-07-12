/* © Copyright Vasantham Technologies Limited 2015
 /* -----------------------------------------------
 * This file and the source code contained herein are the property of Vasantham Technologies Limited 
 * and are protected by English copyright law. All usage is restricted as per 
 * the terms & conditions of Vasantham Technologies Limited. You may not alter or remove 
 * any trademark, copyright or other notice from copies of the content.
 
 * The code contained herein may not be reproduced, copied, modified or redistributed in any form
 * without the express written consent by an officer of Vasantham Technologies Limited.
 */

/* global d3, angular */

(function () {

    var app = angular.module('myApp.realtimeChart', []);
    app.directive('realtimeChart',
            function ($log) {
                return {
                    scope: {
                        startDate: '@startDate',
                        value: '=value',
                        update: '&onUpdate'
                    },
                    link: function ($scope, iElm) {
                        var liveChart = new RealtimeChart(iElm, $scope.startDate);
                        liveChart.init($scope.value, $scope.update);
                    }
                };
            }
    );

    function RealtimeChart(element, startDate) {
        var RealtimeChart = this;
        var format = d3.time.format("%Y-%m-%d %H:%M:%S");
        var margin = {
            left: 35,
            right: 20,
            top: 25,
            bottom: 25
        };
        RealtimeChart.height = 260 - margin.top - margin.bottom;
        RealtimeChart.width = 960 - margin.left - margin.right;
        RealtimeChart.canvas = d3.select(element[0]).attr({
            "width": RealtimeChart.width + margin.left + margin.right,
            "height": RealtimeChart.height + margin.top + margin.bottom
        })
                .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        RealtimeChart.xScale = d3.time.scale().rangeRound([0, RealtimeChart.width]);
        RealtimeChart.xScale.domain([format.parse(startDate + ' 08:00:00'), format.parse(startDate + ' 08:10:00')]);
        RealtimeChart.yScale = d3.scale.linear().range([RealtimeChart.height, 0]);
        RealtimeChart.xAxis = d3.svg.axis().scale(RealtimeChart.xScale).orient("Bottom");
        RealtimeChart.yAxis = d3.svg.axis().scale(RealtimeChart.yScale).orient('left');
        RealtimeChart.yScaleMax = 0;
        RealtimeChart.color = d3.scale.category10();
        //Set Axis
        RealtimeChart.canvas.selectAll('g.x.axis').data([1])
                .enter().append("g").attr({
            'class': 'x axis',
            'transform': 'translate(0,' + RealtimeChart.height + ')'
        }).call(RealtimeChart.xAxis);

        RealtimeChart.canvas.selectAll('g.y.axis').data([1])
                .enter().append("g").attr({
            'class': 'y axis'
        }).call(RealtimeChart.yAxis);

        RealtimeChart.HighPathGen = pathGenerator('Date', 'High');
        function pathGenerator(xProp, yProp) {
            return d3.svg.line()
                    .x(function (d) {
                        return RealtimeChart.xScale(d[xProp]);
                    })
                    .y(function (d) {
                        return RealtimeChart.yScale(d[yProp]);
                    }).interpolate("linear");
        }
        RealtimeChart.HighPathGen.yScaleLimits = {min: 100, max: 0};

    }
    RealtimeChart.prototype.init = function (ticks, onUpdate) {
        var RealtimeChart = this;
        var lineG, lastTick;
        var start = null;
        var inProgress = false;

        if (ticks && ticks.length > 0) {
            updateYScale(ticks);
            initPriceLine(ticks);
            lastTick = ticks.slice(-1)[0];
        }

        if (onUpdate)
            getUpdate(500);

        function initPriceLine(ticks) {
            lineG = RealtimeChart.canvas.selectAll('g.priceLine')
                    .data([ticks]);
            var priceLine = lineG.enter().append('g')
                    .attr('class', 'priceLine');
            priceLine.append("path")
                    .attr({
                        "class": 'low',
                        stroke: function (d, i) {
                            return RealtimeChart.color(i);
                        },
                        d: RealtimeChart.HighPathGen
                    });
        }
        function updateTick(newData) {
            var combinedPath = "";
            if (!lineG)
                initPriceLine(newData);
            updateYScale(newData);
            var line = lineG.select('path.low');
            line.each(function () {
                combinedPath += d3.select(this).attr("d");
            });
            line.attr("d", combinedPath + RealtimeChart.HighPathGen(newData));
        }

        function getUpdate(next) {
            // setTimeout(function () {
            if (!inProgress) {
                inProgress = true;
                requestAnimationFrame(function (timestamp) {

                    if (!start)
                        start = timestamp;
                    var progress = timestamp - start;
                    //console.log(progress);
                    var ticks = onUpdate();
                    if (ticks && ticks.length > 0) {
                        if (lastTick)
                            ticks.unshift(lastTick);
                        updateTick(ticks);
                        lastTick = ticks.slice(-1)[0] || lastTick;
                    }
                    inProgress = false;
                    getUpdate(next);
                });
            }
            // }, next);
        }
        function updateYScale(ticks) {
            var max = RealtimeChart.HighPathGen.yScaleLimits.max,
                    min = RealtimeChart.HighPathGen.yScaleLimits.min;
            ticks.forEach(function (s) {
                if (s.High > max)
                    max = s.High;
                if (s.High < min)
                    min = s.High;
            });
            if ((max !== RealtimeChart.HighPathGen.yScaleLimits.max) ||
                    (min !== RealtimeChart.HighPathGen.yScaleLimits.min)) {
                RealtimeChart.yScale.domain([Math.floor(min), Math.ceil(max)]);
                RealtimeChart.canvas.select(".y.axis").transition().duration(250).call(RealtimeChart.yAxis);
                RealtimeChart.HighPathGen.yScaleLimits.max = max;
                RealtimeChart.HighPathGen.yScaleLimits.min = min;
            }
        }
    };
})();
