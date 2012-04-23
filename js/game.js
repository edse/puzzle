function Game(canvas) {
  console.log('start loading...')
  this.loadAssets();
}

Game.prototype.loadAssets = function() {
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  
//
    document.getElementById('canvas').width = window.innerWidth;
    document.getElementById('canvas').height = window.innerHeight;
    console.log("canvas: "+window.innerWidth+", "+window.innerHeight)
//
  this.items_to_load = 4;
  this.loaded_items = 0;
  this.loaded = false;
  this.interval = null;
  this.maxElapsedTime = 0;
  this.start_time = 0;

  //IMAGE
  this.img = new Image();
  this.img.src = "img/rainbow500x400.png";
  this.img.onload = this.loaded_items++;

  //IMAGE
  /*
  this.img_bg = new Image();
  this.img_bg.src = "img/bg.jpg";
  this.img_bg.onload = this.loaded_items++;
  */
  
  //AUDIO
  this.drip = document.createElement('audio');
  var source= document.createElement('source');
  if(this.drip.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/final/drip.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/final/drip.ogg';
  }
  this.drip.appendChild(source);
  this.drip.addEventListener('canplaythrough', asdf(this), false);
  
  //AUDIO
  this.twang = document.createElement('audio');
  var source= document.createElement('source');
  if(this.twang.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/final/twang2.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/final/twang2.ogg';
  }
  this.twang.appendChild(source);
  this.twang.addEventListener('canplaythrough', asdf(this), false);

  //AUDIO
  /*
  this.bgm = document.createElement('audio');
  var source= document.createElement('source');
  if(this.bgm.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/final/Pictures-Sleep_on_soft_sheets.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/final/Pictures-Sleep_on_soft_sheets.ogg';
  }
  this.bgm.appendChild(source);
  this.bgm.addEventListener('canplaythrough', asdf(this), false);
  this.bgm.play();
  */
  
  //AUDIO
  this.chimes = document.createElement('audio');
  var source= document.createElement('source');
  if(this.chimes.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/final/chimes.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/final/chimes.ogg';
  }
  this.chimes.appendChild(source);
  this.chimes.addEventListener('canplaythrough', asdf(this), false);
      
  //BUTTON
  this.full_btn = document.createElement("input");
  this.full_btn.setAttribute("type", "button");
  this.full_btn.setAttribute("value", "FULLSCREEN on");
  this.full_btn.setAttribute("id", "full_btn");
  this.full_btn.onclick = function() {
    if(this.value == "FULLSCREEN off"){
      document.webkitCancelFullScreen();
      document.mozCancelFullScreen();
      this.value = "FULLSCREEN on";
    }else if(this.value == "FULLSCREEN on"){
      document.getElementById("canvas").webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      document.getElementById("canvas").mozRequestFullScreen();
      this.value = "FULLSCREEN off";
    }
  };
  document.getElementById("controls").appendChild(this.full_btn);

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
}

Game.prototype.init = function(){
  //IMAGE SIZE
  if(window.innerHeight <= 300){
    this.context.scale(0.3,0.3);
    this.scale = 0.3;
  }else if(window.innerHeight <= 600){
    this.context.scale(0.5,0.5);
    this.scale = 0.5;
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
  this.num_lines = this.scale_input.value;
  this.num_pieces = this.scale_input.value * this.scale_input.value;
  this.piece_width = this.img_width / this.num_lines;
  this.piece_height = this.img_height / this.num_lines;

  this.remaining_time = this.num_pieces*3;
  this.clock_interval = null;
  this.mouse = new Mouse(this);

  if(this.snap_btn.value != "AUTO-SNAP on")
    this.auto_snap = true;
  else
    this.auto_snap = false;

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
}

Game.prototype.placeHolders = function(){
  if(this.chimes.currentTime != 0)
    this.chimes.currentTime = 0;
  this.chimes.play();

  var pieces = 1;
  var offsetx = (this.canvas.width/this.scale)/2-(this.img_width)/2;
  var offsety = (this.canvas.height/this.scale)/2-(this.img_height)/2;
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
  
  this.draw_bg();
    
  //LOADING
  if(!this.loaded){
    if((this.items_to_load > 0)&&(this.loaded_items == this.items_to_load)){
      this.items_to_load = 0;
      var t = setTimeout("game.init();", 3000);
      //this.init();
    }else{
      this.context.fillText("loading...", 50, 20);
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
    
    //Game Over
    if(this.remaining_time <=0 ){
      window.m.stopGame();
      if(confirm('Timeup! Game Over! Wanna try again?')){
        this.is_over = false;
        this.init();
        window.m.startGame();
      }
    }
    else{
      if(this.is_over){
        window.m.stopGame();
        if(confirm('Huhuhuh! You did it! Wanna try the next level?')){
          this.is_over = false;
          this.scale_input.value++;
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

}

Game.prototype.draw_bg = function() {
  this.context.save();
  //bg
  this.context.fillStyle = '#FEFEFE';
  this.context.fillRect(0,0,this.canvas.width/this.scale,this.canvas.height/this.scale);
  
  //box
  this.context.strokeStyle = '#000000';
  this.context.lineWidth = 1;
  this.context.strokeRect(1,1,this.canvas.width/this.scale-2,this.canvas.height/this.scale-2);

  //bg image
  /*
  var offsetx = this.canvas.width/2-this.img_bg.width/2;
  var offsety = this.canvas.height/2-this.img_bg.height/2;
  this.context.globalAlpha = 1
  this.context.drawImage(this.img_bg, offsetx, offsety);
  */
  
  //puzzle image
  var offsetx = (this.canvas.width/this.scale)/2-(this.img_width)/2;
  var offsety = (this.canvas.height/this.scale)/2-(this.img_height)/2;
  this.context.globalAlpha = 0.2
  this.context.drawImage(this.img, offsetx, offsety);
  
  this.context.restore();
}

////////////////////////////////////////

Game.prototype.clockTick = function() {
  this.remaining_time--;
}

Game.prototype.getTimer = function() {
  return (new Date().getTime() - this.start_time); //milliseconds
}

Game.prototype.loop = function(){
  var instance = this;
  instance.interval = requestAnimationFrame(instance.drawFrame2(instance), instance.canvas);
}