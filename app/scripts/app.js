'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('CookTimer', ['ionic', 'ngCordova', 'config', 'Layout', 'Grid', 'my.cordova.plugins', 'ngAnimate', 'ngCookies', 'timer', 'ui.unique'])
  .config(function (GridServiceProvider) {

    /*
     *  Define dimensions of grid.
     *  Note: Changes here will require changes to SCSS.
     */
    GridServiceProvider.setDimensions(3, 4);

  }).controller('TimerController', ['$http', 'LayoutManager', '$rootScope', '$scope', '$ionicModal', '$ionicPopup', '$ionicPlatform', 'MediaSrv',
    function ($http, LayoutManager, $rootScope, $scope, $ionicModal, $ionicPopup, $ionicPlatform, MediaSrv) {

      var ctrl = this;
      ctrl.tileScope = null;

      // Default highlighted/selected category
      $scope.selectedCategoryIndex = 0;

      // Async call to pull in the timer info from local file
      $http.get('json/timer-data.json').success(function (data) {
        $scope.data = data;
      });

      /*
       *  Lifecycle events for Modal window
       */
      $ionicModal.fromTemplateUrl('views/timer-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $rootScope.openModal = function (tileScope) {
        ctrl.tileScope = tileScope;
        $scope.modal.show();
      };

      $scope.closeModal = function () {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function () {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function () {
        // Execute action
      });

      /*
       *  Handle click for category
       */
      $scope.categoryClicked = function ($index, itemType) {
        $scope.selectedCategoryIndex = $index;
        $scope.data.filter = itemType;
      };

      this.layout = LayoutManager;


      this.setTimer = function (tileScope, time, title) {
        tileScope.ngModel.label = title;
        tileScope.setCountDownTime(time);
        $scope.closeModal();
      };

      this.newLayout = function () {
        this.layout.newLayout();
      };


      $rootScope.reset = function () {
        console.log('Calling reset...');

        var confirmPopup = $ionicPopup.confirm({
          title: 'Reset All Timers',
          template: 'Are you sure you want to reset all timers?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log('You are sure');
            ctrl.newLayout();
          } else {
            console.log('You are not sure');
          }
        });


      };


      this.newLayout();

    }])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  });
