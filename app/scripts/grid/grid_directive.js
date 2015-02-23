'use strict';

angular.module('Grid')
.directive('grid', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/grid.html'
    //controller: function($scope) {
    //  $scope.selectTimer = function() {
    //    console.log('Inside scope');
    //  };
    //}
  };
});
