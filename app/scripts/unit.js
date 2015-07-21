// Strategic Conquest
// city.js
// J Kogler
// 10/10/14
// A class to represent a single unit (army, plane, boat etc)

function Unit(x, y) {
   this.x = x;
   this.y = y;
   this.destX = x;
   this.destY = y;
   this.force = SCTypes.forceType.neutral;
   this.type = SCTypes.productionType.none;
   this.strength = 5;
   this.movesPerDay = 1;
};

// checks if a unit is at its destination. 
Unit.prototype.atDestination = function () {
   if ((this.x !== this.destX) || (this.y !== this.destY)) {
      return false;
   }
   return true;
};

// moves this unit closer to its destination. 
Unit.prototype.moveUnit = function () {
   var dX = 0;
   var dY = 0;
   if (this.x !== this.destX) {
      if (this.destX > this.x) {
         dX++;
      } else {
         dX--;
      }
   }
   if (this.y !== this.destY) {
      if (this.destY > this.y) {
         dY++;
      } else {
         dY--;
      }
   }

   this.x = this.x + dX;
   this.y = this.y + dY;
};

// moves the unit for one day
Unit.prototype.tick = function () {
   if (!this.atDestination()) {
      this.moveUnit();
   }

};