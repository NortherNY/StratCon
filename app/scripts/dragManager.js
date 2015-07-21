// Strategic Conquest
// city.js
// J Kogler
// 10/10/14
// A class to manage clicks and drags

function DragManager() {
   this.dragging = false;
   this.startX = -1;
   this.startY = -1;
   this.selectedUnit = null;
}

DragManager.prototype.mouseDown = function (x, y, unit) {
   console.log('md');
   // you cannot have a drag event without a selected unit.
   if (unit) {
      this.selectedUnit = unit;
      // when the mouse goes down, assume this is a move.
      this.dragging = true;
      this.startX = x;
      this.startY = y;
   } else {
      this.selectedUnit = null;
      this.dragging = false;
   }
}

DragManager.prototype.mouseUp = function (x, y) {
   console.log('mu');
   this.dragging = false;
   // for there to
   if (this.selectedUnit && ((this.startX !== x) || (this.startY !== y))) {
      // there was a move event.
      alert('Dragged Unit');
   }
}