//=============================================================================
// Battle Engine
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
  Window_ActorCommand.prototype.addGuardCommand = function() {
    guardSkill = $dataSkills[Game_BattlerBase.prototype.guardSkillId()];
    this.addCommand(guardSkill.name, 'guard', this._actor.canGuard());
  };
})();