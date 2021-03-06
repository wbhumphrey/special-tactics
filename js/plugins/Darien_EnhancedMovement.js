//=============================================================================
// Enhanced Movement
// by darien
// Date: 06/08/2017

//=============================================================================


/*:
 * @plugindesc Provides realisic bounded random movement for events
 * @author darien        // your name goes here
 *
 * @param xxxxx      //name of a parameter you want the user to edit
 * @desc yyyyy       //short description of the parameter
 * @default zzzzz    // set default value for the parameter

 */

(function() {

  /**
    * New Move Commands
    */

  Game_Character.prototype.guardRegion = function(regionId, selfSwitch) {
    if(this.canSeePlayer()) {
      this.setSelfSwitch(selfSwitch, true);
    } else {
      this.patrolRegion(regionId);
    }
  }

  Game_Character.prototype.patrolRegion = function(regionId) {
    canPass = function(x, y, d) {
      var x2 = $gameMap.roundXWithDirection(x, d);
      var y2 = $gameMap.roundYWithDirection(y, d);

      return this.canPass(x, y, d) && $gameMap.regionId(x2, y2) == regionId;
    }
    this.moveSmartRandom(canPass.bind(this));
  }

  Game_Character.prototype.moveSmartRandom = function(canPass) {
    canPass = canPass || this.canPass.bind(this)

    availableMoves = [];
    if(canPass(this.x, this.y, this.direction())) {
      availableMoves.push(this.moveForward);
      availableMoves.push(this.moveForward);
      availableMoves.push(this.moveForward);
      availableMoves.push(this.wait30Frames);
    }

    if(canPass(this.x, this.y, this.right90Direction())) {
      availableMoves.push(this.moveRight);
    }

    if(canPass(this.x, this.y, this.left90Direction())) {
      availableMoves.push(this.moveLeft);
    }

    if(availableMoves.length == 0) {
      availableMoves.push(this.turn180);
    }

    move = Math.randomInt(availableMoves.length);
    availableMoves[move].call(this);
  };

  /**
    * Utility Functions
    */

  Game_Character.DOWN = 2;
  Game_Character.LEFT = 4;
  Game_Character.RIGHT = 6;
  Game_Character.UP = 8;

  Game_Character.prototype.setSelfSwitch = function(selfSwitch, value) {
    var key = [this._mapId, this._eventId, selfSwitch];
    $gameSelfSwitches.setValue(key, value === true);
  }

  Game_Character.prototype.canSeePlayer = function() {
    var gc = Game_Character;

    var y = this.y;
    var x = this.x;

    var xDiff = $gamePlayer.x - this.x;
    var distance = this.distanceTo($gamePlayer.x, $gamePlayer.y);

    if (xDiff == 0){
      var increment = distance / ($gamePlayer.y - this.y);

      while(this.distanceTo(x,y) < distance) {
        y += increment;

        if(!$gameMap.isTwoWayPassable(x, y, this.direction())){
          return false;
        }
      }
    } else {
      var slope = (y - $gamePlayer.y) / (x - $gamePlayer.x);
      var yIntercept = y - slope * x;
      var increment = xDiff / distance;

      var prevX = Math.round(x);
      var prevY = Math.round(y);
      x += increment;
      y = slope * x + yIntercept;

      while(this.distanceTo(x,y) < distance) {
        var horz = horizontalDirection(prevX, x);
        var vert = verticalDirection(prevY, y);

        if(!$gameMap.isDiagonallyPassable(prevX, prevY, horz, vert)){
          return false;
        }

        prevX = Math.round(x);
        prevY = Math.round(y);
        x += increment;
        y = slope * x + yIntercept;
      }
    }

    return true;
  }

  function verticalDirection(fromY, toY) {
    fromY = Math.round(fromY);
    toY = Math.round(toY);
    if(toY == fromY) {
      return null;
    } else if(toY > fromY){
      return Game_Character.DOWN;
    } else {
      return Game_Character.UP;
    }
  }

  function horizontalDirection(fromX, toX) {
    fromX = Math.round(fromX);
    toX = Math.round(toX);
    if(toX == fromX) {
      return null;
    } else if(toX > fromX){
      return Game_Character.RIGHT;
    } else {
      return Game_Character.LEFT;
    }
  }

  Game_Map.prototype.isDiagonallyPassable = function(x, y, horz, vert) {
    if(horz && vert) {
      return (this.isTwoWayPassable(x, y, horz) && this.isTwoWayPassable(this.roundXWithDirection(x, horz), y, vert)) ||
        (this.isTwoWayPassable(x, y, vert) && this.isTwoWayPassable(x, this.roundYWithDirection(y, vert), horz));
    } else if(horz){
      return this.isTwoWayPassable(x, y, horz);
    } else if(vert){
      return this.isTwoWayPassable(x, y, vert);
    } else {
      return true; //No direction provided so return true
    }
  }

  Game_Map.prototype.isTwoWayPassable = function(x, y, d) {
    var x2 = this.roundXWithDirection(x, d);
    var y2 = this.roundYWithDirection(y, d);
    var d2 = Game_CharacterBase.prototype.reverseDir(d);
    return this.isPassable(x, y, d) && this.isPassable(x2, y2, d2);
  }

  Game_Character.prototype.distanceTo = function(x, y) {
    return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
  }

  Game_Character.prototype.moveLeft = function() {
    this.moveStraight(this.left90Direction());
  };

  Game_Character.prototype.moveRight = function() {
    this.moveStraight(this.right90Direction());
  };

  Game_Character.prototype.wait30Frames = function() {
    this._waitCount = 30 - 1;
  };

  Game_Character.prototype.left90Direction = function() {
    var gc = Game_Character;
    switch(this.direction()){
      case gc.DOWN:
        return gc.RIGHT;
      case gc.RIGHT:
        return gc.UP;
      case gc.UP:
        return gc.LEFT;
      case gc.LEFT:
        return gc.DOWN;
    }
  };

  Game_Character.prototype.right90Direction = function() {
    var gc = Game_Character;
    switch(this.direction()){
      case gc.RIGHT:
        return gc.DOWN;
      case gc.UP:
        return gc.RIGHT;
      case gc.LEFT:
        return gc.UP;
      case gc.DOWN:
        return gc.LEFT;
    }
  };

})();

