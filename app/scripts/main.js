



$(document).ready(function () {
   'use strict';

   var game = new GameDB();
   $('#day-button').on('click', function() { game.playDay();} );
});