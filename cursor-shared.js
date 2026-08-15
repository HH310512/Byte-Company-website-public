(function(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if(matchMedia("(hover: none)").matches) return;

  var band = document.getElementById("logoRain");
  var hero = document.querySelector(".hero");

  var cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden","true");
  cv.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:40";
  document.body.appendChild(cv);
  var ctx = cv.getContext("2d"); if(!ctx) return;
  var DPR = Math.min(devicePixelRatio||1,2);

  var MONO='ui-monospace,"SF Mono","Cascadia Code",Consolas,Menlo,monospace';
  var W, heroH, viewH, bandTop=1e9, bandBot=-1e9, grid=[], GS=15, mx=-9999, my=-9999, sx=-9999, sy=-9999, raf=null;
  var SMOOTH = 0.20;

  function size(){
    W = document.documentElement.clientWidth;
    heroH = hero ? (hero.offsetTop + hero.offsetHeight) : 0; // page coord bottom of hero
    viewH = window.innerHeight;
    if (band) { bandTop = band.offsetTop; bandBot = bandTop + band.offsetHeight; }
    cv.width = Math.round(W * DPR); cv.height = Math.round(viewH * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    grid = [];
    for (var y=GS/2; y<heroH; y+=GS) for (var x=GS/2; x<W; x+=GS) grid.push({x:x,y:y,ch:Math.random()<0.5?"1":"0",fl:Math.random()*10});
  }

  function frame(now){
    raf = null;
    ctx.clearRect(0,0,W,viewH);
    if (my >= 0){
      if (sx < -1000) { sx = mx; sy = my; }
      sx += (mx - sx) * SMOOTH; sy += (my - sy) * SMOOTH;
      var t = now/1000;
      var pageCursorY = sy + window.scrollY;
      var pageCursorX = sx + window.scrollX;
      var dark = (band && pageCursorY>=bandTop-40 && pageCursorY<=bandBot+40);
      var R = 140;
      ctx.font = "12px " + MONO;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";

      if (pageCursorY <= heroH){
        for (var i=0;i<grid.length;i++){ var g = grid[i];
          var dx = g.x - pageCursorX, dy = g.y - pageCursorY, d2 = dx*dx + dy*dy;
          if (d2 > R*R) continue;
          var d = Math.sqrt(d2), inBand = (g.y >= bandTop && g.y <= bandBot);
          var a = Math.pow(1-d/R,1.6) * (inBand ? 0.5 : 0.30);
          if ((((t*3)+g.fl)|0) % 7 === 0) g.ch = Math.random() < 0.5 ? "1" : "0";
          ctx.globalAlpha = a;
          ctx.fillStyle = inBand ? (d<30?"#7FE8C3":"#14D3A3") : (d<30?"#14574C":"#2E7A66");
          ctx.fillText(g.ch, g.x - window.scrollX, g.y - window.scrollY);
        }
      }

      var GR = dark ? 160 : 120;
      var grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, GR);
      grd.addColorStop(0, dark ? "rgba(127,232,195,0.30)" : "rgba(20,211,163,0.16)");
      grd.addColorStop(0.35, dark ? "rgba(127,232,195,0.12)" : "rgba(20,211,163,0.07)");
      grd.addColorStop(1, "rgba(127,232,195,0)");
      ctx.globalAlpha = 1; ctx.fillStyle = grd; ctx.fillRect(sx-GR, sy-GR, GR*2, GR*2);

      raf = requestAnimationFrame(frame);
    }
  }

  function kick(){ if (raf === null) raf = requestAnimationFrame(frame); }

  addEventListener("pointermove", function(e){ mx = e.clientX; my = e.clientY; if (my >= 0 && my <= window.innerHeight) kick(); else ctx.clearRect(0,0,W,viewH); }, { passive: true });
  addEventListener("pointerleave", function(){ mx=-9999; my=-9999; sx=-9999; sy=-9999; ctx.clearRect(0,0,W,viewH); });
  var rt; addEventListener("resize", function(){ clearTimeout(rt); rt = setTimeout(size,150); });
  addEventListener("scroll", function(){ /* no-op; next pointermove will render in correct place */ });
  addEventListener("load", size);
  size();
})();
