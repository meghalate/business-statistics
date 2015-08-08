'use strict';

angular.module('businessStatisticsAppApp')
  .factory('Quote', function ($resource) {
    return $resource('/api/quotes/:sym', {
      sym: '@sym',start:'@start',end:'@end'
    },{
    	get:{isArray: true}
    });
  });