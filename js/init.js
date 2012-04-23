/**
 * Normalize the browser animation API across implementations. This requests
 * the browser to schedule a repaint of the window for the next animation frame.
 * Checks for cross-browser support, and, failing to find it, falls back to setTimeout.
 * @param {function}    callback  Function to call when it's time to update your animation for the next repaint.
 * @param {HTMLElement} element   Optional parameter specifying the element that visually bounds the entire animation.
 * @return {number} Animation frame request.
 */

// A robust polyfill for animation frame
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var game = new Game();
game.debug = false;
window.m = {game: game};
window.m.interv = function () {
  interval = setTimeout("window.m.game.mouse.moving = false; document.getElementById('moving').value = false; window.m.intervClear();", 500);
}
window.m.intervClear = function () {
  clearInterval(interval)
}
window.m.stopGame = function () {
  window.cancelAnimationFrame(window.m.game.interval);
}
window.m.startGame = function () {
  start();
}
window.m.stopSFX = function () {
  window.m.game.drip.volume = 0.0;
  window.m.game.twang.volume = 0.0;
}
window.m.startSFX = function () {
  window.m.game.drip.volume = 1.0;
  window.m.game.twang.volume = 1.0;
}
window.m.stopBGM = function () {
  window.m.game.bgm.volume = 0.0;
}
window.m.startBGM = function () {
  window.m.game.bgm.volume = 1.0;
}

function start(){
  loop();
}
start();

function loop(){
  game.interval = window.requestAnimationFrame(loop, game.canvas);
  game.canvas.width = game.canvas.width;
  game.context.scale(game.scale,game.scale);
  game.render();

  var elapsed = game.getTimer() - game.time;
  game.time = game.getTimer();
    
  //elapsed = Math.min(20, Math.max(-20, elapsed));
  if(elapsed > game.maxElapsedTime)
    game.maxElapsedTime = elapsed;

  game.context.fillText("scale: "+game.scale, 50, 30);
  game.context.fillText("loaded items: "+game.loaded_items, 50, 40);
  game.context.fillText(">>> "+elapsed, 50, 50);
  game.context.fillText("maxElapsedTime>>> "+game.maxElapsedTime, 50, 60);
  game.context.fillText(game.remaining_time, 50, 80);
  game.context.fillText(game.auto_snap, 50, 100);

}

function asdf(g){
  g.loaded_items++;
}

function mediaSupport(mimetype, container) {
  var elem = document.createElement(container);
  if(typeof elem.canPlayType == 'function'){
    var playable = elem.canPlayType(mimetype);
    if((playable.toLowerCase() == 'maybe')||(playable.toLowerCase() == 'probably')){
      return true;
    }
  }
  return false;
}
/*
//Handle the melody
  if(mediaSupport('audio/ogg; codecs=vorbis', 'audio') ||
    mediaSupport('audio/mpeg', 'audio')) {
*/

function resizeGame() {
    document.getElementById('canvas').width = window.innerWidth;
    document.getElementById('canvas').height = window.innerHeight;
    console.log("canvas: "+window.innerWidth+", "+window.innerHeight)
    game.init();
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
