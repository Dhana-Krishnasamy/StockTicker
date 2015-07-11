/* © Copyright Vasantham Technologies Limited 2015
 /* -----------------------------------------------
 * This file and the source code contained herein are the property of Vasantham Technologies Limited 
 * and are protected by English copyright law. All usage is restricted as per 
 * the terms & conditions of Vasantham Technologies Limited. You may not alter or remove 
 * any trademark, copyright or other notice from copies of the content.
 
 * The code contained herein may not be reproduced, copied, modified or redistributed in any form
 * without the express written consent by an officer of Vasantham Technologies Limited.
 */

/* global angular */

(function(){
    var app= angular.module('myApp.test2', []);
    app.controller('test',['$scope',function($scope){
        $scope.date='2010-10-11';
    }]);
})();
