'use strict';

angular.module('businessStatisticsAppApp')
  .controller('JobsCtrl', function ($scope,$element, $http,Stock) {
    Stock.get({sym:'YHOO'}).$promise.then(function(data){
      $scope.stocks = data;
      console.log($scope.stocks);
      data=data.quotes.slice(0,30);
      var width = 960,
          height = 300;
      var chart = d3.select('.chart')
        .attr("width", width)
        .attr("height", height);

      var y = d3.scale.linear()
      .range([height, 50]);

          y.domain([0, d3.max(data, function(d) { return d.High; })]);

          var barWidth = width / data.length;

          var bar = chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

          bar.append("rect")
              .attr("y", function(d) { return y(d.High); })
              .attr("height", function(d) { return height - y(d.High); })
              .attr("width", barWidth - 1);

          bar.append("text")
              .attr("x", barWidth / 2)
              .attr("y", function(d) { return y(d.High) + 3; })
              .attr("dy", ".75em")
              .text(function(d) { return d.High; });
    });


$scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
    

  });
