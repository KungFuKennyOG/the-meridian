
/* =====================================================================================================
   THE MERIDIAN · art direction set 02. Runs on the Stairwell engine (src/10-engine.js): same renderer, same PS1
   pass, same painted-garment and head painters, same skinned character rig. Everything below is new content.
   ===================================================================================================== */
for(const k in groups) groups[k].vis=false;

/* ---------- canvas painting helpers: smooth gradients first, the PS1 pass quantises them ---------- */
/* painted at 2-4x the size they are drawn at (the painters still work in their own units), so walls, cloth and signs are crisp up close */
function P2(w,h,fn,gr=0,seed=1){ const S=w*h<=4096?4:w*h<=40000?2:1; return tex(w*S,h*S,null,g=>{ g.scale(S,S); fn(g,w,h); g.setTransform(1,0,0,1,0,0); if(gr) grain(g,gr*.8,seed); }); }
function grad(g,x0,y0,x1,y1,stops){ const q=g.createLinearGradient(x0,y0,x1,y1); for(const [t,c] of stops) q.addColorStop(t,c); return q; }
function vfill(g,x,y,w,h,stops){ g.fillStyle=grad(g,0,y,0,y+h,stops); g.fillRect(x,y,w,h); }
function hfill(g,x,y,w,h,stops){ g.fillStyle=grad(g,x,0,x+w,0,stops); g.fillRect(x,y,w,h); }
function radial(g,cx,cy,r,stops){ const q=g.createRadialGradient(cx,cy,0,cx,cy,r); for(const [t,c] of stops) q.addColorStop(t,c); g.fillStyle=q; g.fillRect(cx-r,cy-r,r*2,r*2); }
function ell(g,cx,cy,rx,ry,col){ g.fillStyle=col; g.beginPath(); g.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2); g.fill(); }
function poly(g,pts,col){ g.fillStyle=col; g.beginPath(); pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y)); g.closePath(); g.fill(); }
function rgba(hex,a){ const [r,g_,b]=hexRGB(hex); return `rgba(${r},${g_},${b},${a})`; }
/* periodic noise: the same at x=0 and x=w, so every scenery tile wraps without a seam */
const pn=(x,w,s,f=3,oct=4)=>{ const a=x/w*Math.PI*2; return fbm(Math.cos(a)*f+20,Math.sin(a)*f+20,s,oct); };
function ridgeP(g,w,h,base,amp,f,seed,fill,oct=4){ g.fillStyle=fill; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,base-pn(x,w,seed,f,oct)*amp); g.lineTo(w,h); g.closePath(); g.fill(); }
/* pseudo-glyph signage: blocky strokes that read as lettering at PS1 resolution without pretending to be any real script */
function glyphs(g,x,y,n,cell,col,seed,vertical=true){ const r=rng(seed); g.fillStyle=col;
  for(let i=0;i<n;i++){ const cx=vertical?x:x+i*cell, cy=vertical?y+i*cell:y, s=cell-1;
    const k=r()*4|0; if(k===0){ g.fillRect(cx,cy+1,s,1); g.fillRect(cx+(s>>1),cy,1,s); }
    else if(k===1){ g.fillRect(cx,cy,s,1); g.fillRect(cx,cy+s-1,s,1); g.fillRect(cx,cy,1,s); }
    else if(k===2){ g.fillRect(cx+1,cy,1,s); g.fillRect(cx+s-2,cy,1,s); g.fillRect(cx,cy+(s>>1),s,1); }
    else { g.fillRect(cx,cy,s,1); g.fillRect(cx+(s>>1),cy,1,s); g.fillRect(cx,cy+s-1,s,1); } } }
/* soft painted tree canopies */
function canopy(g,x,y,r,cols,seed){ const q=rng(seed); for(let i=0;i<7;i++){ const a=q()*Math.PI*2,d=q()*r*.55; ell(g,x+Math.cos(a)*d,y+Math.sin(a)*d*.7,r*(.45+q()*.25),r*(.38+q()*.2),cols[0]); }
  for(let i=0;i<5;i++){ const a=-Math.PI*.5+(q()-.5)*2,d=q()*r*.45; ell(g,x+Math.cos(a)*d-r*.15,y+Math.sin(a)*d*.6-r*.12,r*(.25+q()*.15),r*(.2+q()*.1),cols[1]); }
  if(cols[2]) for(let i=0;i<4;i++) ell(g,x-r*.3+q()*r*.4,y-r*.35+q()*r*.3,r*.12,r*.09,cols[2]); }
function trunk(g,x,y0,y1,wd,col){ g.fillStyle=col; g.fillRect(Math.round(x-wd/2),y1,Math.max(1,Math.round(wd)),y0-y1); }
function pine(g,x,base,ht,wd,cols){ for(let i=0;i<4;i++){ const t=i/4, y=base-ht*t*.85, ww=wd*(1-t*.75); poly(g,[[x-ww/2,y],[x+ww/2,y],[x,y-ht*.42]],i%2?cols[0]:cols[1]); } g.fillStyle=cols[2]; g.fillRect(x-.5,base-2,1,3); }
function sakuraTree(g,x,base,ht,seed,full=true){ trunk(g,x,base,base-ht*.55,Math.max(1.5,ht*.07),'#4a2e26');
  g.strokeStyle='#4a2e26'; g.lineWidth=1; g.beginPath(); g.moveTo(x,base-ht*.45); g.lineTo(x-ht*.22,base-ht*.75); g.moveTo(x,base-ht*.5); g.lineTo(x+ht*.25,base-ht*.78); g.stroke();
  canopy(g,x,base-ht*.72,ht*.42,['#e98aa6','#ffc4d4','#fff0f4'],seed); if(full) canopy(g,x+ht*.18,base-ht*.62,ht*.26,['#d97896','#f7b0c4'],seed+3); }

/* ---------- sky: a gradient band with soft painted clouds or stars, wrapped round a cylinder ---------- */
function skyTex(stops,o={}){ return P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,stops);
  if(o.stars){ const r=rng(77); for(let i=0;i<120;i++){ const y=r()*h*.6; g.fillStyle=`rgba(255,248,230,${.35+r()*.6*(1-y/(h*.6))})`; g.fillRect(r()*w|0,y|0,1,1); } }
  if(o.clouds){ const r=rng(o.seed||5); for(let i=0;i<o.clouds;i++){ const x=r()*w,y=h*(.25+r()*.45),rx=8+r()*16,ry=2+r()*3.5;
      for(const dx of [-w,0,w]){ ell(g,x+dx,y+1.5,rx,ry,rgba(o.cloudShade||'#c8cfe0',.55)); ell(g,x+dx,y,rx*.9,ry*.85,rgba(o.cloudCol||'#ffffff',.85)); ell(g,x+dx-rx*.3,y-ry*.6,rx*.45,ry*.8,rgba(o.cloudCol||'#ffffff',.9)); } } }
  if(o.glow) radial(g,o.glow[0]*w,o.glow[1]*h,o.glow[2]*w,[[0,o.glow[3]],[1,'rgba(0,0,0,0)']]);
},o.night?3:2,9); }

/* ---------- ground and verge (the strip either side of the track that scrolls past) ---------- */
const flatTex=(base,seed,fn)=>P2(64,64,(g,w,h)=>{ R(g,base,0,0,w,h); const r=rng(seed); for(let i=0;i<90;i++) R(g,rgba(r()>.5?'#ffffff':'#000000',.05),r()*w|0,r()*h|0,2+(r()*4|0),1); if(fn) fn(g,w,h,r); },10,seed);
function vergeTex(kind){ return P2(128,64,(g,w,h)=>{ const r=rng(kind.length*7);
  if(kind==='grass'||kind==='meadow'||kind==='rape'){ vfill(g,0,0,w,h,[[0,'#7aa34e'],[1,'#5e8a3c']]); for(let i=0;i<500;i++){ const x=r()*w|0,y=r()*h|0; R(g,r()>.5?'#8cb85a':'#4f7a34',x,y,1,2); }
    if(kind==='rape') for(let y=4;y<h;y+=9) for(let x=0;x<w;x++) if(pn(x,w,y,6)>-.1) R(g,r()>.3?'#f2d23a':'#e2b02a',x,y+(r()*3|0),1,2);
    if(kind==='meadow') for(let i=0;i<120;i++) R(g,['#f0f0f0','#e8c84a','#c87ad0','#e86a5a'][r()*4|0],r()*w|0,r()*h|0,1,1); }
  else if(kind==='city'){ R(g,'#7d7a78',0,0,w,h); for(let x=0;x<w;x+=32){ R(g,'#6c6a69',x,0,1,h); } R(g,'#a4a09a',0,h-6,w,3); for(let x=0;x<w;x+=16) R(g,'#e8e2d2',x,30,8,2); }
  else if(kind==='night'){ R(g,'#1a1822',0,0,w,h); for(let i=0;i<40;i++){ const x=r()*w|0; R(g,['#ff3fa4','#29e0e6','#f5c542'][r()*3|0],x,r()*h|0,1,4+(r()*8|0)); } for(let x=0;x<w;x+=16) R(g,'#3a3644',x,30,8,2); }
  else if(kind==='sand'){ vfill(g,0,0,w,h,[[0,'#e6d2a0'],[1,'#d8be86']]); for(let i=0;i<300;i++) R(g,r()>.5?'#f0e0b8':'#c8aa70',r()*w|0,r()*h|0,1,1); for(let x=0;x<w;x++) if(pn(x,w,3,4)>.2) R(g,'#8aa85a',x,0,1,4+(pn(x,w,4,8)*6|0)); }
  else if(kind==='tunnel'){ R(g,'#232120',0,0,w,h); for(let i=0;i<200;i++) R(g,r()>.5?'#2e2b29':'#1a1817',r()*w|0,r()*h|0,2,1); R(g,'#3a3634',0,h-8,w,2); }
},8,kind.length); }
function sleeperTex(){ return P2(64,32,(g,w,h)=>{ R(g,'#6e6862',0,0,w,h); const r=rng(31); for(let i=0;i<400;i++) R(g,['#7e7870','#5e5852','#8a847a'][r()*3|0],r()*w|0,r()*h|0,1,1);
  for(let x=2;x<w;x+=10){ vfill(g,x,3,6,h-6,[[0,'#8a8680'],[1,'#6a6660']]); R(g,'#4a4642',x,3,6,1); } },6,31); }

function palm(g,x,base,ht,seed){ const r=rng(seed); g.strokeStyle='#7a5a3e'; g.lineWidth=3; g.beginPath(); g.moveTo(x,base); g.quadraticCurveTo(x+ht*.15,base-ht*.5,x+ht*.05,base-ht); g.stroke();
  const tx=x+ht*.05,ty=base-ht; for(let k=0;k<7;k++){ const a=-Math.PI+k*Math.PI/6+(r()-.5)*.3,len=ht*.35; g.strokeStyle=k%2?'#3f7a36':'#5a9a44'; g.lineWidth=3; g.beginPath(); g.moveTo(tx,ty); g.quadraticCurveTo(tx+Math.cos(a)*len*.6,ty+Math.sin(a)*len*.5-6,tx+Math.cos(a)*len,ty+Math.sin(a)*len*.3+8); g.stroke(); }
  ell(g,tx,ty+2,3,2,'#6a4a2e'); }
