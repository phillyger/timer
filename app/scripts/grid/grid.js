'use strict';

angular.module('Grid', [])
.factory('GenerateUniqueId', function() {
  var generateUid = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  };
  return {
    next: function() { return generateUid(); }
  };
})
.factory('TileModel', function(GenerateUniqueId) {
  var Tile = function(pos, val) {
    this.x      = pos.x;
    this.y      = pos.y;
    this.value  = val || 2;
    this.countDownTime = 0;
    this.label = null;
    this.id = GenerateUniqueId.next();
  };


  Tile.prototype.getPosition = function() {
    return {
      x: this.x,
      y: this.y
    };
  };

  return Tile;
})
.provider('GridService', function() {
  this.height = 4; // Default height
  this.width = 3; // Default width
  this.startingTileNumber = this.height * this.width; // default starting tiles

  this.setHeight = function(ht) {
    this.height = ht ? ht : 0;
  };

    this.setWidth = function(wt) {
      this.width = wt ? wt : 0;
    };

    this.setDimensions = function(wt, ht) {
      this.setWidth(wt);
      this.setHeight(ht);
    };


  var service = this;

  this.$get = function(TileModel) {
    this.grid   = [];
    this.tiles  = [];

    // Private things
    var vectors = {
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 },
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 }
    };

    this.getHeight = function() {
      return service.height;
    };

    this.getWidth = function() {
      return service.width;
    };

    this.getDimensions = function() {
      var wt = this.getHeight;
      var ht = this.getWidth;
      return new Object(wt, ht);
    };


    /*
     * Build timer board
     */
    this.buildEmptyLayoutBoard = function() {
      var self = this;
      // Initialize our grid
      for (var x = 0; x < service.height * service.width; x++) {
        this.grid[x] = null;
      }

      this.forEach(function(x,y) {
        self.setCellAt({x:x,y:y}, null);
      });
    };

    /*
     * Prepare for traversal
     */
    this.prepareTiles = function() {
      this.forEach(function(x,y,tile) {
        if (tile) {
          tile.savePosition();
          tile.reset();
        }
      });
    };

    /*
     * Is the position within the grid?
     */
    this.withinGrid = function(cell) {
      return cell.x >= 0 && cell.x < this.width &&
              cell.y >= 0 && cell.y < this.height;
    };

    /*
     * Is a cell available at a given position
     */
    this.cellAvailable = function(cell) {
      if (this.withinGrid(cell)) {
        return !this.getCellAt(cell);
      } else {
        return null;
      }
    };

    /*
     * Build the initial starting position
     * with specifically placed tiles
     */
    this.buildStartingPosition = function() {
      for (var x = this.startingTileNumber; x > 0;  x--) {
        //this.randomlyInsertNewTile();
        var val = 0;
        switch (x) {
          case 12:
            val = 10;
            break;
          case 10:
              val = 12;
            break;
          case 9:
            val = 7;
            break;
          case 7:
            val = 9;
            break;
          case 6:
            val = 4;
            break;
          case 4:
            val = 6;
            break;
          case 3:
            val = 1;
            break;
          case 1:
            val = 3;
            break;
          default:
            val = x;

        }
        this.fixedInsertNewTile(val);
      }
    };

    /*
     * Get a cell at a position
     */
    this.getCellAt = function(pos) {
      if (this.withinGrid(pos)) {
        var x = this._coordinatesToPosition(pos);
        return this.tiles[x];
      } else {
        return null;
      }
    };

    /*
     * Set a cell at position
     */
    this.setCellAt = function(pos, tile) {
      if (this.withinGrid(pos)) {
        var xPos = this._coordinatesToPosition(pos);
        this.tiles[xPos] = tile;
      }
    };


    /*
     * Run a callback for every cell
     * either on the grid or tiles
     */
    this.forEach = function(cb) {
      var totalSize = service.width * service.height;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        cb(pos.x, pos.y, this.tiles[i]);
      }
    };

    /*
     * Helper to convert x to x,y
     */
    this._positionToCoordinates = function(i) {
      var x = i % service.width,
          y = (i - x) / service.width;
          //y = i % service.height;
      //console.log('x:' + x +  '- y: '+ y);
      return {
        x: x,
        y: y
      };
    };

    /*
     * Helper to convert coordinates to position
     */
    this._coordinatesToPosition = function(pos) {
      return (pos.y * service.width) + pos.x;
    };

    /*
     * Insert a new tile
     */
    this.insertTile = function(tile) {
      var pos = this._coordinatesToPosition(tile);
      //console.log(pos);
      this.tiles[pos] = tile;
    };

    /*
     * Return a new tile
     */
    this.newTile = function(pos, value) {
      return new TileModel(pos, value);
    };

    /*
     * Remove an existing tile
     */
    this.removeTile = function(pos) {
      pos = this._coordinatesToPosition(pos);
      delete this.tiles[pos];
    };


    /*
     * Get all the available tiles
     */
    this.availableCells = function() {
      var cells = [],
          self = this;

      this.forEach(function(x,y) {
        var foundTile = self.getCellAt({x:x, y:y});
        if (!foundTile) {
          cells.push({x:x,y:y});
        }
      });

      return cells;
    };


    /*
     * Fixed insert of new tile
     */
    this.fixedInsertNewTile = function(val) {
      var cell = this.nextAvailableCell(),
        tile = this.newTile(cell, val);
      //console.log(cell);
      this.insertTile(tile);
    };


    /*
     * Get next available cell from all the
     * currently available cells
     */
    this.nextAvailableCell = function() {
      var cells = this.availableCells();
      if (cells.length > 0) {
        return cells[0];
      }
    };

    /*
     * Check to see there are still cells available
     */
    this.anyCellsAvailable = function() {
      return this.availableCells().length > 0;
    };

    return this;
  };
});
