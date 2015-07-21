// Strategic Conquest
// terrain.js
// J Kogler
// 10/10/14
// A class (called Terrain) that generates and stores a representation of the terrain in the game.


function Terrain() {
   // size needs to be a power of 2.
   this.max = 32;
   this.size = this.max + 1;
   this.waterVal = this.size * 0.4; // sets the heigt for the water
   this.roughness = 0.4;
   this.map = new Float32Array(this.size * this.size);
}

Terrain.prototype.isGround = function (x, y) {
   if (this.inBounds(x, y)) {
      val = this.get(x, y);
      if (val > this.waterVal) {
         return true;
      }
   }
   return false;
};

Terrain.prototype.inBounds = function (x, y) {
   if (x < 0 || x > this.max || y < 0 || y > this.max) {
      return false;
   }
   return true;
};

Terrain.prototype.get = function (x, y) {
   if (this.inBounds(x, y)) {

      return this.map[x + this.size * y];
   }
   return -1;
};

Terrain.prototype.set = function (x, y, val) {
   this.map[x + this.size * y] = val;
};

Terrain.prototype.generate = function () {
   var self = this;

   this.set(0, 0, self.max);
   this.set(this.max, 0, self.max / 2);
   this.set(this.max, this.max, 0);
   this.set(0, this.max, self.max / 2);

   divide(this.max);

   function divide(size) {
      var x,
      y,
      half = size / 2;
      var scale = self.roughness * size;
      if (half < 1)
         return;

      for (y = half; y < self.max; y += size) {
         for (x = half; x < self.max; x += size) {
            square(x, y, half, Math.random() * scale * 2 - scale);
         }
      }
      for (y = 0; y <= self.max; y += half) {
         for (x = (y + half) % size; x <= self.max; x += size) {
            diamond(x, y, half, Math.random() * scale * 2 - scale);
         }
      }
      divide(size / 2);
   }

   function average(values) {
      var valid = values.filter(function (val) {
            return val !== -1;
         });
      var total = valid.reduce(function (sum, val) {
            return sum + val;
         }, 0);
      return total / valid.length;
   }

   function square(x, y, size, offset) {
      var ave = average([
               self.get(x - size, y - size), // upper left
               self.get(x + size, y - size), // upper right
               self.get(x + size, y + size), // lower right
               self.get(x - size, y + size) // lower left
            ]);
      self.set(x, y, ave + offset);
   }

   function diamond(x, y, size, offset) {
      var ave = average([
               self.get(x, y - size), // top
               self.get(x + size, y), // right
               self.get(x, y + size), // bottom
               self.get(x - size, y) // left
            ]);
      self.set(x, y, ave + offset);
   }
};

Terrain.prototype.draw = function (ctx, width, height) {
   var self = this;

   for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
         var val = this.get(x, y);
         var top = project(x, y, val);
         var bottom = project(x + 1, y, 0);
         var water = project(x, y, this.waterVal);
         var style = brightness(x, y, this.get(x + 1, y) - val);

         rect(top, bottom, style);
         rect(water, bottom, 'rgba(50, 150, 200, 0.15)');
      }
   }

   function rect(a, b, style) {
      if (b.y < a.y)
         return;
      ctx.fillStyle = style;
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
   }

   function brightness(x, y, slope) {
      if (y === self.max || x === self.max)
         return '#000';
      var b = ~~(slope * 50) + 128;
      return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
   }

   function iso(x, y) {
      return {
         x : 0.5 * (self.size + x - y),
         y : 0.5 * (x + y)
      };
   }

   function project(flatX, flatY, flatZ) {
      var point = iso(flatX, flatY);
      var x0 = width * 0.5;
      var y0 = height * 0.2;
      var z = self.size * 0.5 - flatZ + point.y * 0.75;
      var x = (point.x - self.size * 0.5) * 6;
      var y = (self.size - point.y) * 0.005 + 1;

      return {
         x : x0 + x / y,
         y : y0 + z / y
      };
   }
};