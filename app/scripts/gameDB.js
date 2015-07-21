// Strategic Conquest
// gameDB.js
// J Kogler
// 10/10/14
// A class (called Terrain) that generates and stores a representation of the terrain in the game.

function GameDB() {
   this.terrain = new Terrain();
   this.terrain.generate();
   // the game is played in days.
   this.day = 0;
   
   this.unitManager = new UnitManager(this.terrain);


   // create cities
   this.cityManager = new CityManager(this.terrain, this.unitManager);
   // assign some initial cities a foce type -- everyone needs that.
   this.cityManager.cities[0].force = SCTypes.forceType.red;
   this.cityManager.cities[this.cityManager.cities.length - 1].force = SCTypes.forceType.blue;

   this.board = new Board(this.terrain, this.cityManager, this.unitManager);

   this.board.draw();
   this.updateStats();
};

// run through a whole day of play.
GameDB.prototype.playDay = function () {

   var self = this;
   this.cityManager.tick();
   this.unitManager.tick();
   this.updateStats();
   this.board.draw();

   var f = function () {
      if (self.unitManager.isActionPending()) {
         setInterval(function () {
            self.unitManager.processOnPendingAction(self.board, f);
         }, 10);
         self.updateStats();
         self.board.draw();
      }
   }
   f();
   this.day++;
   this.updateStats();

};

// update game statistics
GameDB.prototype.updateStats = function () {
   $('#game-day').text(this.day);
   $('#game-red-units').text(this.unitManager.numUnits(SCTypes.forceType.red));
   $('#game-blue-units').text(this.unitManager.numUnits(SCTypes.forceType.blue));
};