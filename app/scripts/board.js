// Strategic Conquest
// board.js
// J Kogler
// 10/10/14
//


function Board(t, c, u) {
   this.terrain = t;
   this.cityManager = c;
   this.unitManager = u;
   // a class to manage drag movement.
   this.dragManager = new DragManager();

}

Board.prototype.draw = function () {
   // draw the terrain
   var display = document.getElementById('display');
   $('#game-board').html(this.renderTerrain(this.terrain));
};

Board.prototype.makeTile = function (x, y) {
   var self = this;
   var c = this.cityManager;
   var t = this.terrain;
   var u = this.unitManager;
   var units = u.getUnits(x, y);

   var span = $('<img>');
   // show cities as first priority -- we need to annotate these with a number of units in it
   var city = c.isCity(x, y);
   if (city) {
      if (city.force === SCTypes.forceType.neutral) {
         span.attr('src', './images/city.png');
      } else if (city.force === SCTypes.forceType.red) {
         span.attr('src', './images/city-red.png');
      } else {
         span.attr('src', './images/city-blue.png');
      }
   }
   // If there are units, lets show the units first.
   else if (units.length > 0) {
      var u1 = units[0];
      if (u1.force === SCTypes.forceType.red) {
         span.attr('src', './images/tank-red.png');
      } else if (u1.force === SCTypes.forceType.blue) {
         span.attr('src', './images/tank-blue.png');
      }
   }
   // Show the terrain if here is nothing here.
   else if (t.isGround(x, y)) {
      span.attr('src', './images/grass.png');
   } else {
      span.attr('src', './images/water.png');
   }
   span.addClass('game-tile');
   span.data('x', x);
   span.data('y', y);

   span.draggable({
	   start: function(event, ui){console.log('start');},
	   stop: function(event, ui){console.log('stop')}
   });
   // On Dbl click if its a city open up a production dialog
   span.on('dblclick',
      function () {
      var x = $(this).data('x');
      var y = $(this).data('y');
      var city = c.isCity(x, y);
      if (city) {
         city.productionDialog();
      }
   });

   // on Click if its not a city, give info on it in the console.
   span.on('click',
      function () {
      var x = $(this).data('x');
      var y = $(this).data('y');
      var s = '[' + x + ',' + y + '] ';

      if (t.isGround(x, y)) {
         s += 'Ground ';
      } else {
         s += 'Water ';
      }

      var city = c.isCity(x, y);
      if (city) {
         s += ' with city (force = ' + city.force + '; production = '
          + city.productionType + ' with '
          + city.daysRemaining + ' days left until next unit is ready)';
      }
      console.log(s);
      var ulist = u.getUnits(x, y);
      for (var i in ulist) {
         var unit = ulist[i];
         console.log('\t Unit force=' + unit.force + ' type=' + unit.type + ' strength=' + unit.strength
             + ' dest=[' + unit.destX + ',' + unit.destY + ']');
      }
   });
   return span;

};

Board.prototype.renderTerrain = function () {
   var t = this.terrain;
   // render a single tile.
   var container = $('<div id=\'impl\'>');
   for (var y = 0; y < t.size; y++) {
      var row = $('<div>').appendTo(container);
      row.addClass('game-row');
      for (var x = 0; x < t.size; x++) {
         this.makeTile(x, y).appendTo(row);
      }
      var br = $('<br>').appendTo(row);
   }
   return container;
}