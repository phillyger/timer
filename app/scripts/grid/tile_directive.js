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

        var menu = [
          {category: 'Lobster', name: 'MNE 3-4', time: 15},
          {category: 'Lobster', name: 'MNE 4-5', time: 25},
          {category: 'Lobster', name: 'ROCK 6', time: 215},
          {category: 'Lobster', name: 'ROCK 9', time: 345},
          {category: 'Live Maine', name: 'STM 1.25', time: 600},
          {category: 'Live Maine', name: 'STM 2.0', time: 900},
          {category: 'Live Maine', name: 'STM 3.0', time: 1200},
          {category: 'Pasta', name: 'CORK', time: 20},
          {category: 'Pasta', name: 'LING', time: 20},
          {category: 'Crab', name: 'Maryland', time: 70}
        ];

        // Triggered on a button click, or some other target
        var showActionSheet = function () {

          // Show the action sheet
          $ionicActionSheet.show({
            buttons: [
              {text: menu[0].category + '-' + menu[0].name},
              {text: menu[1].category + '-' + menu[1].name},
              {text: menu[2].category + '-' + menu[2].name},
              {text: menu[3].category + '-' + menu[3].name},
              {text: menu[4].category + '-' + menu[4].name},
              {text: menu[5].category + '-' + menu[5].name},
              {text: menu[6].category + '-' + menu[6].name},
              {text: menu[7].category + '-' + menu[7].name},
              {text: menu[8].category + '-' + menu[8].name},
              {text: menu[9].category + '-' + menu[9].name}
            ],
            titleText: 'Choose a Menu Option',
            cancelText: 'Cancel',
            cancel: function () {
              // add cancel code..
            },
            buttonClicked: function (index) {
              console.log(menu[index]);
              $scope.ngModel.label = menu[index].category;
              setCountDownTime(menu[index].time);
              return true;
            }
          });


        };


        $scope.style = {"background-color": colors[0]};

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
            $scope.$broadcast('timer-set-countdown-seconds', 0);
            $scope.ngModel.countDownTime = 0;
            $scope.countdown = 0;
            resetScope();
          }, 0);





        };



        var resetScope = function () {
          $scope.style = {"background-color": colors[0]};
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
            console.log(time);
          }, 0);


        };

        $scope.setCountdown = function(newVal) {
          $scope.ngModel.countDownTime =newVal;
          $scope.countdown =newVal;
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

        //$scope.$on('timer-stopped', function (event, args) {
        //  args.timeoutId = null;
        //  args.seconds = 0;
        //  args.millis = 0;
        //  console.log('Timer Stopped event: '+ event +' - data = ' +  args);
        //  console.log(event);
        //  console.log(args);
        //});

        $scope.$on('timer-tick', function (event, args) {
          //var timerConsole = $scope.timerType + ' - event.name = ' + event.name + ', timeoutId = ' + args.timeoutId + ', millis = ' + args.millis + '\n';



          if (angular.isDefined($scope.ngModel.countDownTime)) {

            var warningTime = getWarningTime();

            // when timer is within 10, change background to yellow
            if (timerRunningCountDown && args.millis === 10000 && (warningTime < 0) ) {
              $timeout(function () {
                $scope.style = {"background-color": colors[1]};
              }, 0);

            }

            // when timer is within 0, change background to red and start timer counting up
            if (timerRunningCountDown && args.millis === 0  && (warningTime < 0)) {
              timerRunningCountDown = false;
              timerRunningCountUp = true;
              $timeout(function () {

                //$scope.$broadcast('timer-reset');
                $scope.$broadcast('timer-clear');
                $scope.$broadcast('timer-start');
                $scope.style = {"background-color": colors[2]};

              }, 0);


            }
          }

          //console.log(timerConsole);
        });
      }
    };
  });
