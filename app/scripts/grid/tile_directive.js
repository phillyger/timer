'use strict';

angular.module('Grid')
.directive('tile', function() {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/tile.html',
    controller: function($scope, $ionicActionSheet) {

      var timersRunning = false;
      var timerRunningCountDown = false;
      var timerRunningCountUp = false;

      $scope.timerMinusTen = false;


      var colors = ['#66CC00', '#FFFF00', '#FF3333', '#9A2BC3'];

      var menu = [
        {category: 'Lobster', name: 'MNE 3-4', time: '150'},
        {category: 'Pasta', name: 'CORK', time: '60'},
        {category: 'Crab', name: 'Maryland', time: '120'}
      ];

      // Triggered on a button click, or some other target
      var showActionSheet = function() {

        // Show the action sheet
        $ionicActionSheet.show({
          buttons: [
            { text: 'Lobster' },
            { text: 'Pasta' },
            { text: 'Crab' }
          ],
          titleText: 'Choose a Menu Option',
          cancelText: 'Cancel',
          cancel: function() {
            // add cancel code..
          },
          buttonClicked: function(index) {

            return true;
          }
        });


      };

      $scope.style = { "background-color": colors[0]};

      $scope.tileColor = '';

      $scope.timerType = 'Polling Server';

      $scope.selectTimer = function() {
        showActionSheet();

      };

      $scope.stopTimer = function() {
        $scope.$broadcast('timer-stop');
        timersRunning = true;
        timerRunningCountDown = false;
        timerRunningCountUp = true;
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
