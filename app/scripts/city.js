// Strategic Conquest
// city.js
// J Kogler
// 10/10/14
// A class to represent a single city

function City(x, y) {
   this.x = x;
   this.y = y;
   this.isPort = false;
   this.force = SCTypes.forceType.neutral;
   this.productionType = SCTypes.productionType.none;
   this.daysRemaining = 0;
}

City.prototype.isNeutral = function () {
   return (this.force === SCTypes.forceType.neutral);
}

City.prototype.productionDialog = function () {
   if (!this.isNeutral()) {
      new ConfirmDialog('City  Production', 'This city is producing Tanks, it cannot be changed yet', function () {});
   } else {
      new ConfirmDialog('City  Production', 'This city is has yet to be conquered', function () {});
   }
}