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

      var timersRunning = false;
      var timerRunningCountDown = false;
      var timerRunningCountUp = false;

      $scope.timerMinusTen = false;


      var colors = ['#66CC00', '#FFFF00', '#FF3333', '#9A2BC3'];


      $scope.style = { "background-color": colors[0]};

      $scope.tileColor = '';

      $scope.timerType = 'Polling Server';

      $scope.selectTimer = function(x, y) {
        //console.log('scope');
        //console.log($scope.ngModel.value);
        $scope.$broadcast('timer-start');
        timersRunning = true;
        timerRunningCountDown = true;
      };


      $scope.showNumber = function() {
        return !timersRunning;
      };


      $scope.showCountDownTimer = function() {
        return (timerRunningCountDown && !timerRunningCountUp);
      };

      $scope.showCountUpTimer = function() {
        return (!timerRunningCountDown && timerRunningCountUp);
      };


      $scope.$on('timer-tick', function (event, args) {
        var timerConsole = $scope.timerType  + ' - event.name = '+ event.name + ', timeoutId = ' + args.timeoutId + ', millis = ' + args.millis +'\n';

        // when timer is within 10, change background to yellow
        if (args.millis === 10000 && timerRunningCountDown) {
          $scope.style = { "background-color": colors[1]};
          $scope.$apply();
        }

        // when timer is within 0, change background to red and start timer counting up
        if (args.millis === 0 && timerRunningCountDown) {
          timerRunningCountDown = false;
          timerRunningCountUp = true;
          $scope.style = { "background-color": colors[2]};
          $scope.$broadcast('timer-reset');
          $scope.$broadcast('timer-start');
          $scope.$apply();
        }

        //console.log(timerConsole);
      });
    }
  };
});
