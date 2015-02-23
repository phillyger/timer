'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('TimerApp', ['ionic', 'config','Timer', 'Grid', 'ngAnimate', 'ngCookies'])
  .config(function(GridServiceProvider) {
    GridServiceProvider.setSize(4);
  }).controller('TimerController', ['TimerManager', '$scope', function(TimerManager, $scope) {

    this.timer = TimerManager;

    this.newTimer = function() {
      this.timer.newTimer();
      this.startTimer();
    };

    this.startTimer = function() {
      //var self = this;
      //KeyboardService.on(function(key) {
      //  self.game.move(key);
      //});
    };

    $scope.selectTimer = function() {
      console.log('hello');
      //alert('hello');
    };

    this.newTimer();
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
