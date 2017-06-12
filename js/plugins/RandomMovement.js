//=============================================================================
// Random Movement
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


 // Declare your function


// 1.  change *** to your plug ins file name below.
// You are telling RPG maker that this plugin exsists.
(function() {

  var parameters = PluginManager.parameters('RandomMovement');

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'RandomMovement') {
      var gc = Game_Character;
      character = this.character();
      moveRoute = {
        list:[
          {code: gc.ROUTE_TURN_RANDOM, indent: null},
          // {code: gc.ROUTE_MOVE_FORWARD, indent: null},
          {}
        ],
        repeat: true,
        skippable: true,
        wait: true
      };
      character.forceMoveRoute(moveRoute);
    }
  };

  /**
    * New Move Commands
    */

  Game_Character.prototype.guardRegion = function(regionId) {
    if(this.canSeePlayer()) {
      this.moveTowardPlayer();
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

  Game_Character.prototype.canSeePlayer = function() {
    var gc = Game_Character;

    var y = this.y;
    var x = this.x;

    var xDirection = null;
    var yDirection = null;

    var xDiff = $gamePlayer.x - this.x;

    var distance = this.distanceTo($gamePlayer.x, $gamePlayer.y);

    if (xDiff == 0){
      var increment = distance / ($gamePlayer.y - this.y);

      while(this.distanceTo(x,y) < distance) {
        y += increment;

        if(!$gameMap.isPassable(x, y, direction)){
          return false;
        }
      }
    } else {
      var slope = (y - $gamePlayer.y) / (x - $gamePlayer.x);
      var yIntercept = y - slope * x;
      var increment = distance / ($gamePlayer.x - this.x);

      do {
        x += increment;
        y = slope * x + yIntercept;

        if(!$gameMap.isDiagonallyPassable(Math.round(x), Math.round(y), xDirection, yDirection)){
          return false;
        }
      } while(this.distanceTo(x,y) < distance);
    }

    return true;
  }

  Game_Map.prototype.isDiagonallyPassable = function(x, y, horz, vert) {
    return (!horz || this.isPassable(x, y, hor)) && (!vert || this.isPassable(x, y, vert))
  }

  Game_character.prototype.distanceTo = function(x, y) {
    Math.squrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))
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
      case gc.LEFT;
        return gc.DOWN;
      }
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
      case gc.DOWN;
        return gc.LEFT;
      }
    }
  };

})();

