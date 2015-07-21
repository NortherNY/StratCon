// Strategic Conquest
// city.js
// J Kogler
// 10/10/14
// A class to represent a single city

// passes it a reference to terrain
function CityManager(terrain, unitManager) {
   if (!terrain) {
      throw 'No terrain passed!';
   }

   this.terrain = terrain;
   this.unitManager = unitManager;
   this.cities = [];
   this.numCities = 5;
   this.generate();
};

CityManager.prototype.isCity = function (x, y) {
   for (var i in this.cities) {
      if ((this.cities[i].x === x) && (this.cities[i].y === y)) {
         return this.cities[i];
      }
   }
   return null;
};

CityManager.prototype.tick = function () {
   for (var i in this.cities) {
      var city = this.cities[i];
      if (city.force !== SCTypes.forceType.neutral) {
         if (city.productionType === SCTypes.productionType.none) {
            // TBD -- pick a type -- just make it an army type.
            city.productionType = SCTypes.productionType.army;
            city.daysRemaining = SCTypes.productionLengthType.army;
         } else {
            if (city.daysRemaining === 0) {
               // make the unit.
               var u = new Unit(city.x, city.y);
               u.force = city.force;
               this.unitManager.addUnit(u);

               // force us to pick something for the next turn.
               city.productionType = SCTypes.productionType.none;
               // Produce something!
            } else {
               // production takes time!
               city.daysRemaining--;
            }
         }
      }
   }
};

CityManager.prototype.generate = function () {

   var placed = 0;

   // In case the whole world is water, lets only try 100 times.
   var triesRemaining = 100;
   while (placed < this.numCities && triesRemaining > 0) {
      var x = Math.floor((Math.random() * this.terrain.max));
      var y = Math.floor((Math.random() * this.terrain.max));
      if (this.terrain.isGround(x, y)) {
         this.cities.push(new City(x, y));
         placed++;
      }
      triesRemaining--;
   }
};