'use strict';

angular.module('Grid')
.directive('tile', function() {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/tile.html',
    controller: function($scope) {
      $scope.selectTimer = function(x, y) {
        console.log('scope');
        console.log(x);
        console.log(y);
      };
    }
  };
});
