'use strict';

angular.module('businessStatisticsAppApp')
  .factory('Stock', function ($resource) {
    return $resource('/api/stocks/:sym', {
      sym: '@sym'
    });
  });