/*****
 *
 *   holder.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
function Holder(id, game, x, y, line, column, moveble) {

  if(arguments.length > 0) {
    this.id = id;
    this.game = game;
    this.x = x;
    this.y = y;
    this.line = line;
    this.column = column;
    this.moveble = moveble;
  }
  else{
    this.id = 0;
    this.game = null;
    this.x = 0;
    this.y = 0;
    this.line = null;
    this.column = null;
    this.moveble = null;
  }
  
}

Holder.prototype.draw = function() {
  this.game.context.save();
  this.game.context.globalAlpha = 0.15
  this.game.context.fillStyle = "rgba(255, 255, 255, 0.5)";
  this.game.context.beginPath();
  this.game.context.strokeRect(this.x-this.game.piece_width/2,this.y-this.game.piece_height/2,this.game.piece_width,this.game.piece_height);
  this.game.context.fillRect(holder.x-this.piece_width/2,holder.y-this.piece_height/2,this.piece_width,this.piece_height);
  //this.game.context.fillStyle = "rgba(0, 0, 0, 0.5)";
  //this.game.context.fillText(this.id, this.x-3, this.y+3);
  this.game.context.closePath();
  this.game.context.restore();
}
