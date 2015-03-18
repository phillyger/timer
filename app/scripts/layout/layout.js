'use strict';

angular.module('Layout', ['Grid', 'ngCookies'])
.service('LayoutManager', function($q, $timeout, GridService, $cookieStore) {

  this.grid = GridService.grid;
  this.tiles = GridService.tiles;
  this.layoutSize = GridService.getWidth();

  this.newLayout = function() {
    GridService.buildEmptyLayoutBoard();
    GridService.buildStartingPosition();
  };

});
