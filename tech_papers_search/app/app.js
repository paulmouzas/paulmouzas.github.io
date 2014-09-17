'use strict';

var TechPaperApp = angular.module('TechPaperApp', ['ngSanitize']);

TechPaperApp.controller('TechPaperListCtrl', function ($scope, $http) {
  $http.get('data.json').success(function(data) {
    $scope.papers = data;
  });
});