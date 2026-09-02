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
  var W, heroH, viewH, bandTop=1e9, bandBot=-1e9, grid=[], GS=15, gcols=0, growsN=0,
      mx=-9999, my=-9999, sx=-9999, sy=-9999, raf=null;
  var SMOOTH = 0.29;                       // was 0.20 -> ~40% minder naloop op de muis
  var R = 140, GR_DARK = 160, GR_LIGHT = 120;
  var MARGIN = Math.max(R, GR_DARK) + 12;  // marge voor het te wissen gebied
  var gradDark = null, gradLight = null;
  var px=0, py=0, pw=0, ph=0;              // vorige dirty rect

  function mkGrad(radius, dark){
    var g = ctx.createRadialGradient(0,0,0,0,0,radius);
    g.addColorStop(0, dark ? "rgba(127,232,195,0.30)" : "rgba(20,211,163,0.16)");
    g.addColorStop(0.35, dark ? "rgba(127,232,195,0.12)" : "rgba(20,211,163,0.07)");
    g.addColorStop(1, "rgba(127,232,195,0)");
    return g;
  }

  function clearAll(){ ctx.clearRect(0,0,W,viewH); pw = 0; }

  function size(){
    W = document.documentElement.clientWidth;
    heroH = hero ? (hero.offsetTop + hero.offsetHeight) : 0; // page coord bottom of hero
    viewH = window.innerHeight;
    if (band) { bandTop = band.offsetTop; bandBot = bandTop + band.offsetHeight; }
    cv.width = Math.round(W * DPR); cv.height = Math.round(viewH * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    gradDark = mkGrad(GR_DARK, true); gradLight = mkGrad(GR_LIGHT, false);
    grid = []; gcols = 0; growsN = 0;
    for (var x0=GS/2; x0<W; x0+=GS) gcols++;
    for (var y=GS/2; y<heroH; y+=GS){ growsN++;
      for (var x=GS/2; x<W; x+=GS) grid.push({x:x,y:y,ch:Math.random()<0.5?"1":"0",fl:Math.random()*10});
    }
    pw = 0;
  }

  function frame(now){
    raf = null;
    if (pw > 0) { ctx.clearRect(px,py,pw,ph); pw = 0; }   // alleen het vorige gebied wissen
    if (my < 0) return;

    if (sx < -1000) { sx = mx; sy = my; }
    sx += (mx - sx) * SMOOTH; sy += (my - sy) * SMOOTH;
    var t = now/1000;
    var pageCursorY = sy + window.scrollY;
    var pageCursorX = sx + window.scrollX;
    var dark = (band && pageCursorY>=bandTop-40 && pageCursorY<=bandBot+40);

    if (pageCursorY <= heroH && grid.length){
      ctx.font = "12px " + MONO;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      // alleen de cellen binnen de straal aflopen i.p.v. het hele raster
      var c0 = Math.max(0, Math.ceil((pageCursorX - R - GS/2)/GS));
      var c1 = Math.min(gcols-1, Math.floor((pageCursorX + R - GS/2)/GS));
      var r0 = Math.max(0, Math.ceil((pageCursorY - R - GS/2)/GS));
      var r1 = Math.min(growsN-1, Math.floor((pageCursorY + R - GS/2)/GS));
      for (var r=r0; r<=r1; r++){ var base = r*gcols;
        for (var c=c0; c<=c1; c++){ var g = grid[base+c];
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
    }

    var GR = dark ? GR_DARK : GR_LIGHT;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.globalAlpha = 1; ctx.fillStyle = dark ? gradDark : gradLight;
    ctx.fillRect(-GR, -GR, GR*2, GR*2);
    ctx.restore();

    px = sx - MARGIN; py = sy - MARGIN; pw = MARGIN*2; ph = MARGIN*2;
    raf = requestAnimationFrame(frame);
  }

  function kick(){ if (raf === null) raf = requestAnimationFrame(frame); }

  addEventListener("pointermove", function(e){ mx = e.clientX; my = e.clientY; if (my >= 0 && my <= window.innerHeight) kick(); else clearAll(); }, { passive: true });
  addEventListener("pointerleave", function(){ mx=-9999; my=-9999; sx=-9999; sy=-9999; clearAll(); });
  var rt; addEventListener("resize", function(){ clearTimeout(rt); rt = setTimeout(size,150); });
  addEventListener("scroll", function(){ /* no-op; frame() tekent zelf door op de juiste plek */ });
  addEventListener("load", size);
  size();
})();
