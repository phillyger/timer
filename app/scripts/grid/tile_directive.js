'use strict';

angular.module('Grid')
.directive('tile', function() {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/tile.html',


    controller: function($scope, $timeout, $ionicActionSheet, $ionicPopup) {

      var timersRunning = false;
      var timerRunningCountDown = false;
      var timerRunningCountUp = false;

      $scope.timerMinusTen = false;


      var colors = ['#66CC00', '#FFFF00', '#FF3333', '#9A2BC3'];

      var menu = [
        {category: 'Lobster', name: 'MNE 3-4', time: 15},
        {category: 'Pasta', name: 'CORK', time: 25},
        {category: 'Crab', name: 'Maryland', time: 70}
      ];

      // Triggered on a button click, or some other target
      var showActionSheet = function() {

        // Show the action sheet
        $ionicActionSheet.show({
          buttons: [
            { text: menu[0].category },
            { text: menu[1].category },
            { text: menu[2].category }
          ],
          titleText: 'Choose a Menu Option',
          cancelText: 'Cancel',
          cancel: function() {
            // add cancel code..
          },
          buttonClicked: function(index) {
            switch (index) {
              case 0:
                $scope.ngModel.label = menu[0].category;
                setCountDownTime(menu[0].time);
                break;
              case 1:
                $scope.ngModel.label = menu[1].category;
                setCountDownTime(menu[1].time);
                break;
              case 2:

                $scope.ngModel.label = menu[2].category;
                setCountDownTime(menu[2].time);
                break;
              default:
                    break;

            }


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
        var confirmPopup = $ionicPopup.confirm({
          title: 'Stop Timer',
          template: 'Are you sure you want to stop the timer?'
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $scope.$broadcast('timer-stop');
          } else {
            console.log('You are not sure');
            $scope.$broadcast('timer-resume');
          }
        }).then(function(res){
          timersRunning = true;
          timerRunningCountDown = false;
          timerRunningCountUp = true;
        });


      };


      //$scope.getCountDownTime = function () {
      //  console.log('Run getCountDownTime...');
      //  return $scope.ngModel.countDownTime;
      //};

      var setCountDownTime = function (time) {

        $scope.ngModel.countDownTime = time;

        $timeout(function(){
          $scope.$broadcast('timer-start');
          timersRunning = true;
          timerRunningCountDown = true;
        },0);


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
        if (args.millis === 10000 && timerRunningCountDown ) {
          $timeout(function() {
            $scope.style = { "background-color": colors[1]};
          }, 0);
          //$scope.$apply();
        }

        // when timer is within 0, change background to red and start timer counting up
        if (args.millis === 0 && timerRunningCountDown) {
          timerRunningCountDown = false;
          timerRunningCountUp = true;
          $timeout(function() {

            //$scope.$broadcast('timer-reset');
            $scope.$broadcast('timer-clear');
            $scope.$broadcast('timer-start');
            $scope.style = { "background-color": colors[2]};

          }, 0);

          //$scope.$apply();
        }

        //console.log(timerConsole);
      });
    }
  };
});
