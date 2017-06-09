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

//var _Game_Character_moveRandom = Game_Character.prototype.moveRandom
Game_Event.prototype.moveTypeRandom = function() {
  availableMoves = [];
  if(this.canPass(this.x, this.y, this.direction())) {
    availableMoves.push(this.moveForward);
    availableMoves.push(this.moveForward);
  }

  if(this.canPass(this.x, this.y, this.right90Direction())) {
    availableMoves.push(this.moveRight);
  }

  if(this.canPass(this.x, this.y, this.left90Direction())) {
    availableMoves.push(this.moveLeft);
  }

  if(availableMoves.length == 0) {
    availableMoves.push(this.turn180);
  } else {
    //availableMoves.push(this.wait20Frames);
  }

  move = Math.randomInt(availableMoves.length)
  availableMoves[move].call(this);
};

Game_Character.prototype.moveLeft = function() {
  this.moveStraight(this.left90Direction());
};

Game_Character.prototype.moveRight = function() {
  this.moveStraight(this.right90Direction());
};

Game_Character.prototype.wait20Frames = function() {
  this._waitCount = 20 - 1;
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



  // NOTE: THIS WILL NOT MAKE YOU A DARK WIZARD. HERE ARE SOME BASE FOR YOU TO LAY A FOUNDATION FOR PLUGINS!
// Now find something you want to edit in the core plugins.  You can
// find them in the Project\www\js folder
// 2. find the EXACT function you want to edit


  /*
  This function can be found in rpg_scenes.js

  Scene_Title.prototype.drawGameTitle = function() {
    var x = 20;
    var y = Graphics.height / 4;
    var maxWidth = Graphics.width - x * 2;
    var text = $dataSystem.gameTitle;
    this._gameTitleSprite.bitmap.outlineColor = 'black';
    this._gameTitleSprite.bitmap.outlineWidth = 8;
    this._gameTitleSprite.bitmap.fontSize = 72;
    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');

  */



  // You need to come up with a name for your modification while keeping
  // class name the same.

  // the name of the function I want to edit is called
  //  Scene_Title.prototype.drawGameTitle
  // The name of my function will be called _Scene_Title_xxx
  //Follow for ease of use,  follow the template below.
  // Start your var as _NAME_NAME_YOURCLASSNAME
  // Have it equal the function you are replacing

 //  var _Scene_Title_xxx = Scene_Title.prototype.drawGameTitle;

 //  // make your adjustments by adding code, or adjusting them below.
 //  // This is an exact copy of the code above,  but with some of my adjustments
 //  // to some of the parameters.  Later,  I will show how you can call your parameters that the user adjusts
 //  // so your plugin has a little more control

 //    Scene_Title.prototype.drawGameTitle = function() {

  // // _Scene_Title_xxx.call(this);    //sometimes you have to call your function to get this to work.  In this case you don't Ill explain why later.

 //    var x = 20;
 //    var y = Graphics.height / 4;
 //    var maxWidth = Graphics.width - x * 2;
 //    var text = $dataSystem.gameTitle;
 //    this._gameTitleSprite.bitmap.outlineColor = 'black';
 //    this._gameTitleSprite.bitmap.outlineWidth = 8;
 //    this._gameTitleSprite.bitmap.fontSize = 200;
 //    this._gameTitleSprite.bitmap.drawText(text, 0,0 , maxWidth, 48, 'center');




 //  }
  })();  // dont touch this.

