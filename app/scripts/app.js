'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('RLTimerApp', ['ionic', 'config','Layout', 'Grid', 'ngAnimate', 'ngCookies', 'timer'])
  .config(function(GridServiceProvider) {
    GridServiceProvider.setSize(3);
  }).controller('TimerController', ['LayoutManager', '$scope', function(LayoutManager, $scope) {

    this.layout = LayoutManager;


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
