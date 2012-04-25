/**
 * Normalize the browser animation API across implementations. This requests
 * the browser to schedule a repaint of the window for the next animation frame.
 * Checks for cross-browser support, and, failing to find it, falls back to setTimeout.
 * @param {function}    callback  Function to call when it's time to update your animation for the next repaint.
 * @param {HTMLElement} element   Optional parameter specifying the element that visually bounds the entire animation.
 * @return {number} Animation frame request.
 */

// A robust polyfill for animation frame
( function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame) {
    console.log('!window.requestAnimationFrame');
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 22 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if(!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

// A robust polyfill for fullscreen
(function(window, document) {'use strict';
  var keyboardAllowed = 'ALLOW_KEYBOARD_INPUT' in Element, methods = (function() {
    var methodMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenchange', 'fullscreen', 'fullscreenElement'], ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitIsFullScreen', 'webkitCurrentFullScreenElement'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozfullscreenchange', 'mozFullScreen', 'mozFullScreenElement']], i = 0, l = methodMap.length;
    for(; i < l; i++) {
      var val = methodMap[i];
      if(val[1] in document) {
        return val;
      }
    }
  })(), screenfull = {
    isFullscreen : document[methods[3]],
    element : document[methods[4]],
    request : function(elem) {
      var request = methods[0];
      elem = elem || document.documentElement;
      // If you request a new element when already in fullscreen, Chrome will
      // change directly to that element, while Firefox will do nothing. Force
      // Firefox to change element by exiting and then reenter, making it consistent.
      if(request.indexOf('moz') !== -1 && elem !== this.element) {
        this.exit();
      }
      elem[ request ](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      if(!document.isFullscreen) {
        elem[ request ]();
      }
    },
    exit : function() {
      document[ methods[1] ]();
    },
    toggle : function(elem) {
      if(this.isFullscreen) {
        this.exit();
      } else {
        this.request(elem);
      }
    },
    onchange : function() {
    }
  };
  if(!methods) {
    return;
  }
  document.addEventListener(methods[2], function(e) {
    screenfull.isFullscreen = document[methods[3]];
    screenfull.element = document[methods[4]];
    screenfull.onchange(e);
  });
  window.screenfull = screenfull;
})(window, document);

// GAME START
var game = new Game();
game.debug = false;
window.m = {
  game : game
};
window.m.interv = function() {
  interval = setTimeout("window.m.game.mouse.moving = false; document.getElementById('moving').value = false; window.m.intervClear();", 500);
}
window.m.intervClear = function() {
  clearInterval(interval)
}
window.m.stopGame = function() {
  document.getElementById('canvas').style.zIndex = 14;
  document.getElementById('splash').style.zIndex = 15;
  document.getElementById('title').style.fontSize = "9em";
  document.getElementById('title').style.opacity = 1;
  window.m.stopSFX();
  window.m.stopBGM();
  game.started = false;
  window.cancelAnimationFrame(game.interval);
}
window.m.startGame = function() {
  document.getElementById('canvas').style.zIndex = 15;
  document.getElementById('splash').style.zIndex = 14;
  document.getElementById('title').style.fontSize = "3em";
  document.getElementById('title').style.opacity = 0.3;
  window.m.startSFX();
  window.m.startBGM();
  game.started = true;
  loop();
}
window.m.stopSFX = function() {
  window.m.game.drip.volume = 0.0;
  window.m.game.twang.volume = 0.0;
  window.m.game.drip.pause();
  window.m.game.twang.pause();
}
window.m.startSFX = function() {
  window.m.game.drip.volume = 1.0;
  window.m.game.twang.volume = 1.0;
}
window.m.stopBGM = function() {
  window.m.game.bgm.volume = 0.0;
  window.m.game.bgm.pause();
}
window.m.startBGM = function() {
  window.m.game.bgm.volume = 1.0;
  window.m.game.bgm.play();
}

document.getElementById('play').onclick = function() {
  if(this.value == "PLAY"){
    window.m.startGame();
    this.value = "PAUSE";
  }else if(this.value == "PAUSE"){
    window.m.stopGame();
    this.value = "PLAY";
  }
}

/*
function start() {
  document.getElementById('canvas').style.zIndex = 15;
  document.getElementById('splash').style.zIndex = 14;
  game.bgm.play();
  game.started = true;
  loop();
}
function stop() {
  game.bgm.pause();
  game.started = false;
  window.cancelAnimationFrame(game.interval);
}
*/
function loop() {
  game.interval = window.requestAnimationFrame(loop, game.canvas);
  game.canvas.width = game.canvas.width;
  game.context.scale(game.scale, game.scale);
  game.render();

  var elapsed = game.getTimer() - game.time;
  game.time = game.getTimer();

  //elapsed = Math.min(20, Math.max(-20, elapsed));
  if(elapsed > game.maxElapsedTime)
    game.maxElapsedTime = elapsed;

  game.context.fillText("scale: " + game.scale, 50, 30);
  game.context.fillText("loaded items: " + game.loaded_items, 50, 40);
  game.context.fillText(">>> " + elapsed, 50, 50);
  game.context.fillText("maxElapsedTime>>> " + game.maxElapsedTime, 50, 60);
  game.context.fillText(game.remaining_time, 50, 80);
  game.context.fillText(game.auto_snap, 50, 100);

}

function itemLoaded(g) {
  g.loaded_items++;
}

function mediaSupport(mimetype, container) {
  var elem = document.createElement(container);
  if( typeof elem.canPlayType == 'function') {
    var playable = elem.canPlayType(mimetype);
    if((playable.toLowerCase() == 'maybe') || (playable.toLowerCase() == 'probably')) {
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
  console.log("canvas: " + window.innerWidth + ", " + window.innerHeight)
  if(game.started)
    game.init();
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
