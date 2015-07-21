// Strategic Conquest
// city.js
// J Kogler
// 10/10/14
// A class to represent all the units.

// passes it a reference to terrain
function UnitManager(terrain) {
   this.terrain = terrain;
   // the master list of all known units
   this.units = [];

   // a list of units that need something done for them.
   this.pendingActionUnits = [];
};

// reports true if there is pending action.
UnitManager.prototype.isActionPending = function () {
   return (this.pendingActionUnits.length > 0);
};

function ConfirmDialog(title, message, finishCB) {
   'use strict';
   // The jquery object for the dialog (the main object here). it
   // is created later.
   this.d = null;

   this.d = $('<div>');
   var el = $('<span>').appendTo(this.d);
   el.text(message);
   this.d.addClass('query-dialog');
   $(document.body).append(this.d);

   var dialogOpt = {
      autoOpen : false,
      backdrop : false,
      keyboard : false,
      backdropClick : false,
      modal : false
   };

   this.d.dialog(dialogOpt);
   this.d.dialog('option', 'title', title);
   // jek revisit -- I know there is a better way -- I just don't know it :(
   var thisDialogInstance = this;
   this.d.dialog('option', 'buttons', {
      'okay' : function () {
         if (finishCB) {
            finishCB();
         }
         $(this).remove();
      },
      // Cancel does not save the data.
      'cancel' : function () {
         $(this).remove();
      }
   });
   this.d.dialog('open');
};

// returns the preferred unit at this location. The preferred unit is
// either the top unit, or the unit that is currently pending.
UnitManager.prototype.getPreferedUnitAtLocation = function(x, y) {
   // TBD -- need to actually pick the preferred unit. Now I am just getting anything.
   for (var i in this.units) {
      var u = this.units[i];
      if (u.x === x && u.y === y) {
         return u
      }
   }
   return null;
};

// f is the function to call when we are done.
UnitManager.prototype.processOnPendingAction = function (board, onSuccess) {
   if (this.isActionPending()) {
      // JEK do something.
      var u = this.pendingActionUnits.pop();
      u.destX = 1;
      u.destY = 1;
      console.log('ProcessingOnPendingAction');

      new ConfirmDialog('jtitle', 'jmessage', onSuccess);

   }
};

// count the number of units (or with optional force type).
UnitManager.prototype.numUnits = function (force) {
   var count = 0;
   if (!force) {
      count = this.units.length;
   } else {
      for (var i in this.units) {
         var u = this.units[i];
         if (u.force === force) {
            count++;
         }
      }
   }
   return count;
}

UnitManager.prototype.getUnits = function (x, y) {
   var list = [];
   for (var i in this.units) {
      var u = this.units[i];
      if (u.x === x && u.y === y) {
         list.push(u);
      }
   }
   return list;
};

UnitManager.prototype.addUnit = function (u) {
   this.units.push(u);
};

UnitManager.prototype.tickForce = function (force) {
   for (var i in this.units) {
      var u = this.units[i];
      if (u.force === force) {
         // Unit has somewhere to go
         if (!u.atDestination()) {
            // tick moves the unit.
            u.tick();
         } else {
            this.pendingActionUnits.push(u);
         }

      }
   }
};

UnitManager.prototype.tick = function () {
   this.tickForce(SCTypes.forceType.red);
   this.tickForce(SCTypes.forceType.blue);
};