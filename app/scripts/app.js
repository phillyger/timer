'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('CookTimer', ['ionic', 'ngCordova', 'config','Layout', 'Grid', 'my.cordova.plugins', 'ngAnimate', 'ngCookies', 'timer', 'ui.unique'])
  .config(function(GridServiceProvider) {
    //GridServiceProvider.setSize(3);
    GridServiceProvider.setDimensions(3, 4);
  }).controller('TimerController', ['LayoutManager', '$rootScope','$scope', '$ionicModal','$ionicPopup', '$ionicPlatform','MediaSrv',
    function(LayoutManager, $rootScope, $scope, $ionicModal, $ionicPopup, $ionicPlatform, MediaSrv) {

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
          time : 360
        },
        {
          type : "Live Maine",
          name : "SPLT&CLN 2.0",
          time : 480
        },
        {
          type : "Live Maine",
          name : "SPLT&CLN 3.0",
          time : 840
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


    $scope.selectedIndex = 0;

    $scope.itemClicked = function ($index, itemType) {
      //console.log($index);
      $scope.selectedIndex = $index;
      $scope.data.filter = itemType;
    }

    this.layout = LayoutManager;


    this.setTimer = function(tileScope, time, title) {
      //console.log(tileScope);
      //console.log(time);
      //console.log(title);
      tileScope.ngModel.label = title;
      tileScope.setCountDownTime(time);
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

    $rootScope.reset = function() {
      console.log('Calling reset...');

      var confirmPopup = $ionicPopup.confirm({
        title: 'Reset All Timers',
        template: 'Are you sure you want to reset all timers?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          ctrl.newLayout();
        } else {
          console.log('You are not sure');
        }
      });


    };


      this.newLayout();

    //console.log(this.layout);
  }])

  .controller('PlayCtrl', function($scope, MediaSrv){
    var myMedia = null;
    MediaSrv.loadMedia('audio/alarm.mp3').then(function(media){
      myMedia = media;
    });

    $scope.play = function(){
      myMedia.play();
    };
  })

  .controller('PlayLoopCtrl', function($scope, MediaSrv){
    var shouldPlay = false;
    var myMedia = null;
    function onStop(){
      if(myMedia !== null && shouldPlay){
        myMedia.play();
      }
    }
    MediaSrv.loadMedia('audio/alarm.mp3', onStop).then(function(media){
      myMedia = media;
    });

    function playStart(){
      shouldPlay = true;
      onStop();
    }
    function playStop(){
      shouldPlay = false;
      myMedia.stop();
    }
  })

  //.controller('PlayLoopMultiCtrl', function($scope, MediaSrv){
  //  var shouldPlay = false;
  //  var soundFiles = ['sounds/alarm.mp3', 'sounds/alarm.mp3', 'sounds/alarm.mp3'];
  //  var playingMediaIndex = null;
  //  var mediaInstances = [];
  //  var onStop = function(){
  //    if(shouldPlay){
  //      if(playingMediaIndex === null){
  //        playingMediaIndex = 0;
  //      } else {
  //        playingMediaIndex = (playingMediaIndex+1) % mediaInstances.length;
  //      }
  //      mediaInstances[playingMediaIndex].play();
  //    }
  //  };
  //  for(var i in soundFiles){
  //    MediaSrv.loadMedia(soundFiles[i], onStop).then(function(media){
  //      mediaInstances.push(media);
  //    });
  //  }
  //
  //  function playStart(){
  //    shouldPlay = true;
  //    onStop();
  //  }
  //  function playStop(){
  //    shouldPlay = false;
  //    mediaInstances[playingMediaIndex].stop();
  //  }
  //})


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
