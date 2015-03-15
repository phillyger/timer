'use strict';

angular.module('Grid')
  .directive('tile', function () {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      templateUrl: 'scripts/grid/tile.html',


      controller: function ($rootScope, $scope, $compile, $timeout, $ionicActionSheet, $ionicPopup, LayoutManager) {

        var timersRunning = false;
        var timerRunningCountDown = false;
        var timerRunningCountUp = false;
        var maxTicks = 0;

        var colors = ['#66CC00', '#FFFF00', '#FF3333', '#9A2BC3'];


        //$scope.style = {"background-color": colors[0]};

        $scope.tileColor = '';

        $scope.timerType = 'Polling Server';

        $scope.selectTimer = function () {
          //showActionSheet();

          //console.log(this);
          //console.log(this.$parent);
          //console.log($rootScope);
          //console.log("Open Modal...");
          $rootScope.openModal(this.$parent);
        };

        $scope.stopTimer = function () {

          $timeout(function () {

            $scope.$broadcast('timer-stop');
            $scope.$broadcast('timer-clear');
            $scope.$broadcast('timer-set-countdown', 0);
            $scope.ngModel.countDownTime = 0;
            $scope.countdown = 0;
            resetScope();
          }, 0);





        };

        $scope.displayStopTimerActionPopup = function() {

          var confirmPopup = $ionicPopup.confirm({
            title: 'Reset Timer',
            template: 'Are you sure you want to reset the timer?'
          });
          confirmPopup.then(function(res) {
            if(res) {
              //console.log('You are sure');
              $scope.$broadcast('timer-stop');
              $scope.$broadcast('timer-clear');
              $scope.$broadcast('timer-set-countdown', 0);
              resetScope();
            } else {
              //console.log('You are not sure');
            }
          });

        };


        var resetScope = function () {
          //$scope.style = {"background-color": colors[0]};
          var timer = document.getElementById('tile-count-down-timer-'+ $scope.ngModel.value);
          move(timer)
            .set('background-color', colors[0])
            .end();

          timersRunning = false;
          timerRunningCountDown = false;
          timerRunningCountUp = false;
          maxTicks = 0;
        };

        $scope.setCountDownTime = function (time) {

          maxTicks = (time - 10) * 2; // ** MAJOR HACK ** need to multiply by 2 since 2 timer events will get called.


          timersRunning = true;
          timerRunningCountDown = true;
          timerRunningCountUp= false;
          LayoutManager.activeCells = true;

          $timeout(function () {
            $scope.setCountdown(time);
            //console.log(time);
          }, 0);


        };

        $scope.setCountdown = function(newVal) {
          $scope.ngModel.countDownTime =newVal;
          $scope.countdown =newVal;
          var timer = document.getElementById('tile-count-down-timer-'+ $scope.ngModel.value);
          console.log('Setting initial color...');
          move(timer)
            .set('background-color', colors[0])
            .end();

          $timeout(function(){
            $scope.$broadcast('timer-start');

          },0);
        };

        $scope.showNumber = function () {
          return !timersRunning;
        };


        $scope.showCountDownTimer = function () {
          return (timerRunningCountDown && !timerRunningCountUp);
        };

        $scope.showCountUpTimer = function () {
          return (!timerRunningCountDown && timerRunningCountUp);
        };


        var getWarningTime = function() {
          return --maxTicks;

        };

        function onBlinkTimeout(){

          //console.log('tile-'+ $scope.ngModel.value);
          //var cell = document.getElementById('tile-'+ $scope.ngModel.value);
          //console.log(cell);

          var timer = document.getElementById('tile-count-up-timer-'+ $scope.ngModel.value);
          var highlightBack = move(timer)
            .set('background-color', colors[2])
            .duration('0.2s')
            .end();

          var highlight = move(timer)
            .set('background-color', colors[1])
            .duration('0.2s')
            .then(highlightBack)
            .end();


          //var highlight = move(cell)
          //  .set('background', '#B9F6CA')
          //  .duration('0.2s')
          //  .then(highlightBack)
          //  .end();
          $scope.blinkTimeout = $timeout(onBlinkTimeout,1000);
        }


        $scope.blink = function() {
          if($scope.blinkTimeout) {
            console.log('Cancelling blinkTimeout');
            $timeout.cancel($scope.blinkTimeout);
          }
          //$scope.time = 0;
          $scope.blinkTimeout = $timeout(onBlinkTimeout,0);
        };

        $scope.$on('timer-tick', function (event, args) {
          //var timerConsole = $scope.timerType + ' - event.name = ' + event.name + ', timeoutId = ' + args.timeoutId + ', millis = ' + args.millis + '\n';



          if (angular.isDefined($scope.ngModel.countDownTime)) {

            var warningTime = getWarningTime();

            // when timer is within 10, change background to yellow
            if (timerRunningCountDown && args.millis === 10000 && (warningTime < 0) ) {
              console.log('tile-count-down-timer-'+ $scope.ngModel.value);
              console.log('Setting warning color...');
              var timer = document.getElementById('tile-count-down-timer-'+ $scope.ngModel.value);
              move(timer)
                .set('background-color', colors[1])
                .end();

              //$timeout(function () {
              //  //$scope.style = {"background-color": colors[1]};
              //
              //}, 0);

            }

            // when timer is within 0, change background to red and start timer counting up
            if (timerRunningCountDown && args.millis === 0  && (warningTime < 0)) {
              timerRunningCountDown = false;
              timerRunningCountUp = true;
              $timeout(function () {

                //$scope.$broadcast('timer-reset');
                $scope.$broadcast('timer-clear');
                $scope.$broadcast('timer-start');
                console.log('Calling blink...');
                $scope.blink();
              }, 0);


            }
          }

          //console.log(timerConsole);
        });
      }
    };
  });
