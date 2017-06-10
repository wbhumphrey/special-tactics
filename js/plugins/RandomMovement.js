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

  Game_Character.prototype.guardRegion = function(regionId) {
    if(this.canSeePlayer()) {
      this.moveTowardPlayer();
    } else {
      this.patrolRegion();
    }
  }

  Game_Character.prototype.canSeePlayer = function() {
    distance = Math.squrt(Math.pow(this.x - $gamePlayer.x, 2) + Math.pow(this.y - $gamePlayer.y, 2))
    return distance <= 5;
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
    switch (this.direction()) {
      case 2:
        return 6;
      case 4:
        return 2;
      case 6:
        return 8;
      case 8:
        return 4;
    }
  };

  Game_Character.prototype.right90Direction = function() {
    switch (this.direction()) {
      case 6:
        return 2;
      case 2:
        return 4;
      case 8:
        return 6;
      case 4:
        return 8
    }
  };

})();

