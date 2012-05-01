function Game(canvas) {
  this.started = false;
  this.num_lines = 2;
  console.log('start loading...')
  this.loadAssets();
}

Game.prototype.loadAssets = function() {
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  
  //Canvas size
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  console.log("canvas: "+window.innerWidth+", "+window.innerHeight)
  //

  this.loaded_items = 0;
  this.loaded = false;
  this.interval = null;
  this.maxElapsedTime = 0;
  this.start_time = 0;
  
  this.assets = Array({
      type: "image",
      src: "img/rainbow500x400.png",
      slug: "img"
    },{
      type: "image",
      src: "img/spfc.jpg",
      slug: "img2"
    },{
      type: "image",
      src: "img/play.png",
      slug: "btn_play"
    },{
      type: "image",
      src: "img/pause.png",
      slug: "btn_pause"
    },{
      type: "image",
      src: "img/fullscreen.png",
      slug: "btn_fullscreen"
    },{
      type: "image",
      src: "img/nofullscreen.png",
      slug: "btn_nofullscreen"
    },{
      type: "audio",
      src: "audio/final/drip",
      slug: "drip"
    },{
      type: "audio",
      src: "audio/final/twang2",
      slug: "twang"
    },{
      type: "audio",
      src: "audio/final/Pictures-Sleep_on_soft_sheets",
      slug: "bgm"
    },{
      type: "audio",
      src: "audio/final/chimes",
      slug: "chimes"
    }
  );
  
  this.items_to_load = this.assets.length;
  loadAssets(this, this.assets);
  
  console.log(this.loaded_items+' assets loaded');
    
  if(Modernizr.fullscreen){
    //BUTTON
    this.full_btn = document.createElement("input");
    this.full_btn.setAttribute("type", "button");
    this.full_btn.setAttribute("value", "FULLSCREEN on");
    this.full_btn.setAttribute("id", "full_btn");
    this.full_btn.onclick = function() {
      if(this.value == "FULLSCREEN off"){
        if(screenfull){
          screenfull.toggle();
          this.value = "FULLSCREEN on";
        }
      }else if(this.value == "FULLSCREEN on"){
        if(screenfull){
          screenfull.toggle();
          this.value = "FULLSCREEN off";
        }
      }
    };
    document.getElementById("controls").appendChild(this.full_btn);
  }
  
  /*
  if(Modernizr.audio){
    //BUTTON
    this.bgm_btn = document.createElement("input");
    this.bgm_btn.setAttribute("type", "button");
    this.bgm_btn.setAttribute("value", "BGM off");
    this.bgm_btn.setAttribute("id", "bgm_btn");
    this.bgm_btn.onclick = function() {
      if(this.value == "BGM off"){
        window.m.stopBGM();
        this.value = "BGM on";
      }else if(this.value == "BGM on"){
        window.m.startBGM();
        this.value = "BGM off";
      }
    };
    document.getElementById("controls").appendChild(this.bgm_btn);
  
    //BUTTON
    this.sfx_btn = document.createElement("input");
    this.sfx_btn.setAttribute("type", "button");
    this.sfx_btn.setAttribute("value", "SFX off");
    this.sfx_btn.setAttribute("id", "sfx_btn");
    this.sfx_btn.onclick = function() {
      if(this.value == "SFX off"){
        window.m.stopSFX();
        this.value = "SFX on";
      }else if(this.value == "SFX on"){
        window.m.startSFX();
        this.value = "SFX off";
      }
    };
    document.getElementById("controls").appendChild(this.sfx_btn);
  }

  //BUTTON
  this.snap_btn = document.createElement("input");
  this.snap_btn.setAttribute("type", "button");
  this.snap_btn.setAttribute("value", "AUTO-SNAP off");
  this.snap_btn.setAttribute("id", "snap_btn");
  this.snap_btn.onclick = function() {
    if(this.value == "AUTO-SNAP off"){
      window.m.game.auto_snap = false;
      this.value = "AUTO-SNAP on";
    }else if(this.value == "AUTO-SNAP on"){
      window.m.game.auto_snap = true;
      this.value = "AUTO-SNAP off";
    }
  };
  document.getElementById("controls").appendChild(this.snap_btn);

  //INPUT TEXT
  this.scale_input = document.createElement("input");
  this.scale_input.setAttribute("type", "text");
  this.scale_input.setAttribute("value", "2");
  this.scale_input.setAttribute("id", "scale");
  this.scale_input.onchange = function() {
    game.num_lines = this.value;
    game.num_pieces = this.value*this.value;
    game.piece_width = game.img_width / game.num_lines;
    game.piece_height = game.img_height / game.num_lines;
    game.init();
  };
  document.getElementById("controls").appendChild(this.scale_input);
  */

}

Game.prototype.init = function(){
  //IMAGE SIZE
  if((window.innerHeight <= 80)||(window.innerWidth <= 230)){
    this.context.scale(0.05,0.05);
    this.scale = 0.05;
  }else if((window.innerHeight <= 95)||(window.innerWidth <= 230)){
    this.context.scale(0.1,0.1);
    this.scale = 0.2;
  }else if((window.innerHeight <= 150)||(window.innerWidth <= 330)){
    this.context.scale(0.2,0.2);
    this.scale = 0.2;
  }else if((window.innerHeight <= 300)||(window.innerWidth <= 430)){
    this.context.scale(0.5,0.5);
    this.scale = 0.5;
  }else if((window.innerHeight <= 400)||(window.innerWidth <= 530)){
    this.context.scale(0.6,0.6);
    this.scale = 0.6;
  }else if((window.innerHeight <= 500)||(window.innerWidth <= 630)){
    this.context.scale(0.8,0.8);
    this.scale = 0.8;
  }else{
    this.context.scale(1,1);
    this.scale = 1;
  }
  console.log('scale: '+this.scale)
  
  this.loaded = true;
  this.pieces = new Array();
  this.holders = new Array();
  this.placed_pieces = new Array();
  this.moving = true;
  this.selected = null;
  this.over = null;
  this.is_over = false;

  console.log(this.img.width+','+this.img.height)
  this.img_width = this.img.width;
  this.img_height = this.img.height;
  this.num_pieces = this.num_lines * this.num_lines;
  this.piece_width = this.img_width / this.num_lines;
  this.piece_height = this.img_height / this.num_lines;

  this.remaining_time = this.num_pieces*3;
  this.clock_interval = null;
  this.mouse = new Mouse(this);

  this.auto_snap = true;

  this.placeHolders();
  this.placePieces();
}

Game.prototype.placePieces = function(){
  for(i=0; i<this.num_pieces; i++){
    x = Math.floor(Math.random()*this.canvas.width/this.scale);
    y = Math.floor(Math.random()*this.canvas.height/this.scale);
    temp = new Piece(
      i+1,
      this,
      this.piece_width,
      this.piece_height,
      x,
      y,
      new Point2D(this.x,this.y),
      new Point2D(this.holders[i].x,this.holders[i].y),
      this.holders[i],
      true,
      false
    );
    this.pieces.push(temp);
    console.log('pieces array length>>'+this.pieces.length);
  }
  if(this.chimes.currentTime != 0)
    this.chimes.currentTime = 0;
  this.chimes.play();
}

Game.prototype.placeHolders = function(){
  var pieces = 1;
  var offsetx = (this.canvas.width/this.scale)/2-(this.img_width)/2;
  var offsety = (this.canvas.height/this.scale)/2-(this.img_height)/2;
  offsety += 40;
  for(var i = 0; i < this.num_lines; ++i) {
    for(var j = 0; j < this.num_lines; ++j) {
      temp = new Holder(
        pieces,
        this,
        j*this.piece_width+offsetx+this.piece_width/2,
        i*this.piece_height+offsety+this.piece_height/2,
        i,
        j,
        false
      );
      this.holders.push(temp);
      console.log('holders array length>>'+this.holders.length+' '+temp.x+','+temp.y);
      pieces++;
    }
  }
}

Game.prototype.render = function() {
  //bg
  this.context.fillStyle = "rgba(0, 0, 0, 1)";
  this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
  
  this.draw_bg();

  //this.draw_menu();

  //LOADING
  if(!this.loaded){
    if((this.items_to_load > 0)&&(this.loaded_items == this.items_to_load)){
      this.items_to_load = 0;
      var t = setTimeout("game.init();", 3000);
      //this.init();
    }else{
      this.draw_loading();
    }
  }
  else{
    //HOLDERS
    for(var i = 0; i < this.holders.length; i++){
      holder = this.holders[i];
      holder.draw();
    }
  
    //PIECES
    var not_placed = new Array();
    var over = false;
    for(var i = 0; i < this.pieces.length; i++){
      piece = this.pieces[i];
      if(!over && piece.mouse_is_over())
        over = true;
      if(!piece.placed)
        not_placed.push(piece);
      else if(piece != this.selected)
        piece.draw();
        
      if(!this.selected){
        if((!this.over)||(this.over.id < piece.id)||(piece.mouse_is_over())){
          if(piece.mouse_is_over() && !piece.placed){
            this.over = piece;
          }
        }
      }
        
    }
    for(var i = 0; i < not_placed.length; i++){
      not_placed[i].draw();
    }
    if(this.selected)
      this.selected.draw();
  
    if(!over)
      this.over = null;
    
    //move
    if((this.selected != null)&&(this.selected.moveble)){
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }

    //REMAINING TIME
    this.draw_remaining();

    //Game Over
    if(this.remaining_time <= 0){
      this.remaining_time = 0;
      window.m.pauseGame();
      if(confirm('Timeup! Try again')){
        this.is_over = false;
        this.init();
        window.m.startGame();
      }
    }
    else{
      if(this.is_over){
        window.m.pauseGame();
        if(confirm('Yes, you did it! Try the next level')){
          this.is_over = false;
          this.num_lines++;
          this.init();
          window.m.startGame();
        }
      }else{
        if(this.num_pieces == this.placed_pieces.length){
          this.is_over = true;
        }
      }
    }
  }

  //DEBUG
  /*
  if(this.debug){
    document.getElementById('mx').value = this.mouse.x;
    document.getElementById('my').value = this.mouse.y;
  
    document.getElementById('hx').value = this.holders[0].x;
    document.getElementById('hy').value = this.holders[0].y;
    document.getElementById('hx2').value = this.holders[1].x;
    document.getElementById('hy2').value = this.holders[1].y;
  
    document.getElementById('moving').value = this.mouse.moving;
    if(this.over)
      document.getElementById('over').value = this.over.id;
    else
      document.getElementById('over').value = "";
    if(this.selected)
      document.getElementById('selected').value = this.selected.id;
    else
      document.getElementById('selected').value = "";
  
    document.getElementById('p').value = this.num_pieces;
    document.getElementById('l').value = this.num_lines;
    document.getElementById('pw').value = this.piece_width;
    document.getElementById('ph').value = this.piece_height;
  
    document.getElementById('pp').value = this.placed_pieces.length;
  }
  */

}

Game.prototype.draw_bg = function() {
  this.context.save();

  //bg
  if(!this.scale)
    this.scale = 1;
  var grd = this.context.createRadialGradient((this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2, 0, (this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2, this.canvas.width/this.scale);
  grd.addColorStop(0, "rgb(225, 225, 225)");
  grd.addColorStop(1, "rgb(0, 0, 0)");
  this.context.fillStyle = grd;    
  this.context.fillRect(0,0,this.canvas.width/this.scale,this.canvas.height/this.scale);

  //puzzle images
  var offsetx = (this.canvas.width/this.scale)/2-(this.img_width)/2;
  var offsety = (this.canvas.height/this.scale)/2-(this.img_height)/2;
  offsety += 40;
  this.context.globalAlpha = 0.2;
  this.context.drawImage(this.img, offsetx, offsety, this.img_width, this.img_height);
  //this.context.drawImage(this.img2, offsetx+this.img_width, offsety, 200, 200);
  
  this.context.restore();
}

Game.prototype.draw_splash = function() {
  console.log('asdf');
  this.context.save();

  //bg  
  var grd = this.context.createRadialGradient(this.canvas.width/2, this.canvas.height/2, 0, this.canvas.width/2, this.canvas.height/2, this.canvas.height);
  //grd.addColorStop(0, "#8ED6FF"); // light blue
  grd.addColorStop(0, "#CCC");
  //grd.addColorStop(1, "#004CB3"); // dark blue
  grd.addColorStop(1, "#666");
  this.context.fillStyle = grd;    
  this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

  //btn
  //this.context.globalAlpha = 0.7
  this.context.drawImage(this.btn_play, this.canvas.width/2-this.btn_play.width/2, 300);

  //txt
  this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
  //this.context.fillStyle = '#FFF';
  this.context.font = "bold "+Math.round(this.canvas.width/8)+"px Arial";
  this.context.textBaseline = 'bottom';
  this.context.textAlign = 'center';

  this.context.shadowColor = "#000"
  this.context.shadowOffsetX = 5;
  this.context.shadowOffsetY = 5;
  this.context.shadowBlur = 25;
  this.context.lineWidth = 5;

  this.context.strokeText("HTML5 PUZZLE", this.canvas.width/2, this.canvas.height/2);
  this.context.fillText("HTML5 PUZZLE", this.canvas.width/2, this.canvas.height/2);

  this.context.restore();
  
  //this.draw_menu();
}

Game.prototype.draw_remaining = function() {
  this.context.save();    
  this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
  this.context.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  this.context.font = "bold "+Math.round(this.canvas.width/8)+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.shadowColor = "#000"
  this.context.shadowOffsetX = 5;
  this.context.shadowOffsetY = 5;
  this.context.shadowBlur = 25;
  this.context.lineWidth = 5;
  this.context.strokeText(game.remaining_time, (this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2);
  this.context.fillText(game.remaining_time, (this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2);
  this.context.restore();
}

Game.prototype.draw_loading = function() {
  this.context.save();    
  this.context.fillStyle = "rgba(255, 255, 255, 0.8)";
  this.context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  this.context.font = "bold "+Math.round(this.canvas.width/8)+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.shadowColor = "#000"
  this.context.shadowOffsetX = 5;
  this.context.shadowOffsetY = 5;
  this.context.shadowBlur = 25;
  this.context.lineWidth = 5;
  this.context.strokeText("LOADING", (this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2);
  this.context.fillText("LOADING", (this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2);
  this.context.restore();
  //this.context.fillText("loading...", 50, 60);
}
Game.prototype.draw_gameover = function() {
  this.context.save();    
  this.context.fillStyle = "rgba(255, 255, 255, 0.8)";
  this.context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  this.context.font = "bold "+Math.round(this.canvas.width/8)+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.shadowColor = "#000"
  this.context.shadowOffsetX = 5;
  this.context.shadowOffsetY = 5;
  this.context.shadowBlur = 25;
  this.context.lineWidth = 5;
  this.context.strokeText("TIME UP", (this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2);
  this.context.fillText("TIME UP", (this.canvas.width/this.scale)/2, (this.canvas.height/this.scale)/2);
  this.context.restore();
  //this.context.fillText("gameover", 50, 60);
}

////////////////////////////////////////

Game.prototype.clockTick = function() {
  this.remaining_time--;
}

Game.prototype.getTimer = function() {
  return (new Date().getTime() - this.start_time); //milliseconds
}

/*
Game.prototype.loop = function(){
  var instance = this;
  instance.interval = requestAnimationFrame(instance.draw(), instance.canvas);
}
*/
