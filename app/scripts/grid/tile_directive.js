'use strict';

angular.module('Grid')
  .directive('tile', function () {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      templateUrl: 'scripts/grid/tile.html',


      controller: function ($rootScope, $scope, $compile, $timeout, $ionicActionSheet, $ionicPopup, LayoutManager, MediaSrv) {

        var timersRunning = false;
        var timerRunningCountDown = false;
        var timerRunningCountUp = false;
        var maxTicks = 0;
        var poll = null;
        var colors = ['#66CC00', '#FFFF00', '#FF3333', '#9A2BC3'];


        $scope.selectTimer = function () {
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
              $scope.$broadcast('timer-stop');
              $scope.$broadcast('timer-clear');
              $scope.$broadcast('timer-set-countdown', 0);
              resetScope();
            } else {
              // do nothing
            }
          });

        };


        var resetScope = function () {
          $scope.playStop();
          $timeout.cancel($scope.blinkTimeout);
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

          $timeout(function () {
            $scope.setCountdown(time);
          }, 0);


        };

        $scope.setCountdown = function(newVal) {
          $scope.ngModel.countDownTime =newVal;
          $scope.countdown =newVal;
          var timer = document.getElementById('tile-count-down-timer-'+ $scope.ngModel.value);
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

        function onBlinkTimeout(timer){
          $timeout(function() {
            angular.element(timer).toggleClass("backgroundRed");
          }, 100);

          var polling_interval = 1000;
          poll = function(timer)
          {
            //Execution code
            return $timeout(function() {onBlinkTimeout(timer)}, polling_interval);
          };

          $scope.blinkTimeout = poll(timer);
        }


        $scope.blink = function(timer) {
          if($scope.blinkTimeout) {
            console.log('Cancelling blinkTimeout');
            $timeout.cancel($scope.blinkTimeout);
          }

          var polling_interval = 0;
          poll = function(timer)
          {
            //Execution code
            return $timeout(function() {onBlinkTimeout(timer)}, polling_interval);
          };

          $scope.blinkTimeout = poll(timer);

        };

        /**
         *
         * @type {boolean}
         */
        var shouldPlay = false;
        var myMedia = new Array(12);

        var onStop = function(){
          var cellNum = $scope.ngModel.value;
          if(myMedia[cellNum -1] !== null && shouldPlay){
            myMedia[cellNum -1].play();
          }
        };

        MediaSrv.loadMedia('sounds/alarm.mp3', onStop)
          .then(function(media){
            var cellNum = $scope.ngModel.value;
            myMedia[cellNum -1] = media;
          });

        $scope.playStart = function(){
          shouldPlay = true;
          onStop();
        };

        $scope.playStop = function() {
          shouldPlay = false;
          var cellNum = $scope.ngModel.value;
          myMedia[cellNum -1].stop();
        };


        $scope.$on('timer-tick', function (event, args) {

          if (angular.isDefined($scope.ngModel.countDownTime)) {

            var warningTime = getWarningTime();

            // when timer is within 10, change background to yellow
            if (timerRunningCountDown && args.millis === 10000 && (warningTime < 0) ) {
              var timer = document.getElementById('tile-count-down-timer-'+ $scope.ngModel.value);

              move(timer)
                .set('background-color', colors[1])
                .end();

            }

            // when timer is within 0, change background to red and start timer counting up
            if (timerRunningCountDown && args.millis === 0  && (warningTime < 0)) {
              timerRunningCountDown = false;
              timerRunningCountUp = true;

              $timeout(function () {

                //$scope.$broadcast('timer-reset');
                $scope.$broadcast('timer-clear');
                $scope.$broadcast('timer-start');


                var timer = document.getElementById('tile-count-up-timer-'+ $scope.ngModel.value);
                //console.log(timer);
                $scope.blink(timer);
              }, 0);

              $scope.playStart();


            }
          }

        });
      }
    };
  });
