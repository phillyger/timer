'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('RLTimerApp', ['ionic', 'config','Layout', 'Grid', 'ngAnimate', 'ngCookies', 'timer'])
  .config(function(GridServiceProvider) {
    //GridServiceProvider.setSize(3);
    GridServiceProvider.setDimensions(3, 4);
  }).controller('TimerController', ['LayoutManager', '$rootScope','$scope', '$ionicModal', function(LayoutManager, $rootScope, $scope, $ionicModal) {

    var ctrl = this;
    ctrl.tileScope = null;

    $ionicModal.fromTemplateUrl('views/timer-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $rootScope.openModal = function(tileScope) {
      //console.log('Open Modal');
      ctrl.tileScope = tileScope;
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });


    $scope.data = {
      "filter" : 'Appetizer',
      "menu": [
        {
          type : "Appetizer",
          name : "CLAM",
          time : 180
        },
        {
          type : "Appetizer",
          name : "MUSSEL",
          time : 90
        },
        {
          type : "Crab",
          name : "KING",
          time : 300
        },
        {
          type : "Crab",
          name : "SNOW",
          time : 240
        },
        {
          type : "Live Maine",
          name : "SPLT&CLN 1.25",
          time : 480
        },
        {
          type : "Live Maine",
          name : "SPLT&CLN 2.0",
          time : 840
        },
        {
          type : "Live Maine",
          name : "SPLT&CLN 3.0"
        },
        {
          type : "Live Maine",
          name : "SPLT&CLN 4.0",
          time : 960
        },
        {
          type : "Live Maine",
          name : "STM 1.25",
          time : 600
        },
        {
          type : "Live Maine",
          name : "STM 2.0",
          time : 900
        },
        {
          type : "Live Maine",
          name : "STM 3.0",
          time : 1200
        },
        {
          type : "Live Maine",
          name : "STM 4.0",
          time : 1500
        },
        {
          type : "Lobster",
          name : "MNE 3-4",
          time : 150
        },
        {
          type : "Lobster",
          name : "MNE 4-5",
          time : 255
        },
        {
          type : "Lobster",
          name : "ROCK-6",
          time : 225
        },
        {
          type : "Lobster",
          name : "ROCK-9",
          time : 345
        },
        {
          type : "Pasta",
          name : "LING",
          time : 20
        },
        {
          type : "Pasta",
          name : "CORK",
          time : 20
        },
        {
          type : "Sides",
          name : "MASHED",
          time : 1500
        },
        {
          type : "Soups",
          name : "POTATO",
          time : 1500
        },
        {
          type : "Soups",
          name : "BISQUE",
          time : 1200
        },
        {
          type : "Soups",
          name : "GUMBO",
          time : 1200
        },
        {
          type : "Soups",
          name : "MANHATTAN",
          time : 1200
        },
        {
          type : "Veggies",
          name : "BROC",
          time : 210
        }



      ]
    };


    this.layout = LayoutManager;


    this.setTimer = function(tileScope) {
      tileScope.ngModel.label = 'Test';
      tileScope.setCountDownTime(15);
      $scope.closeModal();
    };

    this.newLayout = function() {
      this.layout.newLayout();
      this.layout.activeCells = false;
      //this.startTimer();
    };

    //this.startTimer = function() {
      //var self = this;
      //KeyboardService.on(function(key) {
      //  self.game.move(key);
      //});
    //};




    this.newLayout();

    //console.log(this.layout);
  }])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
