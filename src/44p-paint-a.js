
/* =====================================================================================================
   PAINT KIT A: painted-surface helpers and texture atlases for the locomotive, the capsule hotel, the casino
   and the pool deck. Each of those cars paints its small props into one atlas (one draw call) and maps
   each box face onto its own rectangle of it.
   ===================================================================================================== */
/* a painted panel: light top, shaded foot, a bevel that catches the light on the top and left edges */
function paPanel(g,x,y,w,h,base,o={}){ const hi=o.hi??.16, lo=o.lo??.22, b=o.bevel??1;
  vfill(g,x,y,w,h,[[0,mix(base,'#ffffff',hi)],[.5,base],[1,mix(base,'#000000',lo)]]);
  if(b){ R(g,rgba('#ffffff',o.bhi??.32),x,y,w,b*.6); R(g,rgba('#ffffff',(o.bhi??.32)*.5),x,y,b*.6,h); R(g,rgba('#000000',.28),x,y+h-b*.6,w,b*.6); R(g,rgba('#000000',.16),x+w-b*.6,y,b*.6,h); } }
/* a recessed panel: dark inner lip at top and left (the shadow of the frame), light lip at bottom and right */
function paInset(g,x,y,w,h,base,o={}){ vfill(g,x,y,w,h,[[0,mix(base,'#000000',.08)],[.4,mix(base,'#ffffff',o.hi??.08)],[1,mix(base,'#000000',o.lo??.12)]]);
  const b=o.bevel??.8; R(g,rgba('#000000',.3),x,y,w,b); R(g,rgba('#000000',.2),x,y,b,h); R(g,rgba('#ffffff',.22),x,y+h-b,w,b); R(g,rgba('#ffffff',.14),x+w-b,y,b,h); }
/* soft painted ambient occlusion along the inside of a rectangle */
function paAO(g,x,y,w,h,s=3,a=.3){ for(let i=0;i<s;i++){ const k=a*(1-i/s)*(1-i/s); g.strokeStyle=rgba('#000000',k); g.lineWidth=1; g.strokeRect(x+i+.5,y+i+.5,w-i*2-1,h-i*2-1); } }
/* diagonal reflection streaks on glass or a screen */
function paStreaks(g,x,y,w,h,a=.18){ g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip(); g.fillStyle=rgba('#ffffff',a);
  for(const [o,wd] of [[.12,.18],[.42,.07],[.55,.04]]){ const x0=x+w*o; g.beginPath(); g.moveTo(x0,y); g.lineTo(x0+w*wd,y); g.lineTo(x0+w*wd-h*.6,y+h); g.lineTo(x0-h*.6,y+h); g.fill(); } g.restore(); }
/* a metal bar or rod painted round: dark edges, a hot line of highlight */
function paRod(g,x,y,w,h,base,vert=false){ const st=[[0,mix(base,'#000000',.35)],[.3,mix(base,'#ffffff',.45)],[.45,mix(base,'#ffffff',.15)],[1,mix(base,'#000000',.4)]];
  if(vert) hfill(g,x,y,w,h,st); else vfill(g,x,y,w,h,st); }
/* a round gauge */
function paDial(g,cx,cy,r,face,needle,ang){ ell(g,cx,cy,r+1,r+1,'#1a1c20'); radial(g,cx-r*.3,cy-r*.3,r*1.6,[[0,mix(face,'#ffffff',.3)],[1,mix(face,'#000000',.25)]]); g.save(); g.beginPath(); g.arc(cx,cy,r+1.2,0,7); g.clip(); g.restore();
  ell(g,cx,cy,r,r,face); for(let k=0;k<9;k++){ const a=Math.PI*.75+k/8*Math.PI*1.5; R(g,'#2a2c30',cx+Math.cos(a)*r*.78-.4,cy+Math.sin(a)*r*.78-.4,.8,.8); }
  g.strokeStyle=needle; g.lineWidth=.8; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(ang)*r*.8,cy+Math.sin(ang)*r*.8); g.stroke(); ell(g,cx,cy,.9,.9,'#2a2c30'); ell(g,cx-r*.35,cy-r*.45,r*.35,r*.15,rgba('#ffffff',.35)); }
/* a soft round button with a lit cap */
function paBtn(g,cx,cy,r,col,lit){ ell(g,cx,cy+.5,r+.5,r+.5,rgba('#000000',.45)); radial(g,cx-r*.3,cy-r*.3,r*1.4,[[0,mix(col,'#ffffff',lit?.6:.35)],[.6,col],[1,mix(col,'#000000',.4)]]); g.save(); g.beginPath(); g.arc(cx,cy,r,0,7); g.clip(); radial(g,cx-r*.3,cy-r*.3,r*1.4,[[0,mix(col,'#ffffff',lit?.6:.35)],[.6,col],[1,mix(col,'#000000',.4)]]); g.restore(); }
/* a little fabric weave */
function paWeave(g,x,y,w,h,col,a=.12,step=2){ for(let yy=y;yy<y+h;yy+=step) R(g,rgba(col,a),x,yy,w,.5); for(let xx=x;xx<x+w;xx+=step) R(g,rgba(col,a*.7),xx,y,.5,h); }

/* ---------- atlases: paint many small things into one texture and map box faces onto rectangles of it ---------- */
/* paAtlas(w,h,fn): fn(g,w,h,A) paints; A.r(name,x,y,w,h) records a named rectangle in painter units */
/* atlases are painted at a fixed pixel size (1024 by default: 8 px a painter unit, sharp at arm's length) whatever their painter units */
function paAtlas(w,h,fn,gr=0,seed=1,px=1024){ const A={W:w,H:h,rect:{}}; A.r=(n,x,y,ww,hh)=>{ A.rect[n]=[x,y,ww,hh]; return [x,y,ww,hh]; };
  const S=px/Math.max(w,h); A.tex=tex(Math.round(w*S),Math.round(h*S),null,g=>{ g.scale(S,S); fn(g,w,h,A); g.setTransform(1,0,0,1,0,0); if(gr) paGrain(g,gr,seed); }); return A; }
/* remap the 0..1 UVs of vertices [v0,v1) into a rectangle of the atlas (canvas y runs down, v runs up).
   A rectangle can carry a fifth entry, quarter turns: 1 turns the picture so its top runs along +u. */
function paMapUV(geo,A,rc,v0=0,v1=geo.T.length/2,pad=.35){ if(typeof rc==='string') rc=A.rect[rc]; if(!rc) return;
  const [x,y,w,h,rot=0]=rc, u0=(x+pad)/A.W, du=(w-pad*2)/A.W, vt=1-(y+pad)/A.H, dv=(h-pad*2)/A.H, cl=t=>Math.min(1,Math.max(0,t));
  for(let i=v0;i<v1;i++){ let u=cl(geo.T[i*2]), v=cl(geo.T[i*2+1]); for(let k=0;k<rot;k++) [u,v]=[1-v,u]; geo.T[i*2]=u0+u*du; geo.T[i*2+1]=vt-(1-v)*dv; } return geo; }
const paRot=(A,n,rot)=>{ const r=A.rect[n]; return [r[0],r[1],r[2],r[3],rot]; };
/* a box whose faces show rectangles of the atlas. rects: one name for every face, or {side,front,back,top,bottom,px,nx}
   (front is +z, back -z, px +x, nx -x; side fills the four vertical faces not named) */
function paBox(par,m,A,rects,x,y,z,w,h,d,ry=0,rx=0,rz=0){
  /* long straight runs (trims, ledges, skirtings) are built in pieces of 3.5 m or less: the baker cuts long faces by halving, so one 28 m box costs twice the vertices of eight short ones */
  if(w>4&&!ry&&!rx&&!rz){ const n=Math.ceil(w/3.5), L=w/n, grp=N(par,x,y,z), kids=[]; for(let k=0;k<n;k++) kids.push(paBox(grp,m,A,rects,-w/2+L*(k+.5),0,0,L,h,d));
    Object.defineProperty(grp,'noCollide',{set(v){ for(const c of kids) c.noCollide=v; },get(){ return kids[0].noCollide; }}); return grp; }
  const geo=box(w,h,d,{at:[0,h/2,0]}); const o=typeof rects==='string'||Array.isArray(rects)?{all:rects}:rects;
  const pick=[o.px??o.side??o.all,o.nx??o.side??o.all,o.top??o.all??o.side,o.bottom??o.all??o.side,o.front??o.side??o.all,o.back??o.side??o.all];
  for(let f=0;f<6;f++) if(pick[f]) paMapUV(geo,A,pick[f],f*4,f*4+4);
  return mk(geo,m,par,x,y,z,rx,ry,rz); }
/* a flat card (facing +z before rotation) showing one rectangle of the atlas */
function paCard(par,m,A,rc,x,y,z,w,h,ry=0,rx=0,rz=0){ const geo=plane(w,h); paMapUV(geo,A,rc); return mk(geo,m,par,x,y,z,rx,ry,rz); }
/* any geometry (a cylinder, a lathe) squeezed into one rectangle */
function paGeo(par,m,A,rc,geo,x,y,z,rx=0,ry=0,rz=0){ paMapUV(geo,A,rc); const n=mk(geo,m,par,x,y,z,rx,ry,rz); return n; }
/* a closed cylinder whose side, top cap and bottom cap show their own rectangles (round table tops, chip stacks, stools) */
function paCyl(par,m,A,o,rt,rb,h,seg,x,y,z,rx=0,ry=0,rz=0){ const geo=cyl(rt,rb,h,seg), ns=2*(seg+1), nc_=seg+2;
  paMapUV(geo,A,o.side,0,ns); paMapUV(geo,A,o.top||o.side,ns,ns+nc_); paMapUV(geo,A,o.bottom||o.side,ns+nc_,ns+2*nc_); const n=mk(geo,m,par,x,y,z,rx,ry,rz); return n; }
/* a palm frond: a strip curving down from its root, length along +x, width along z (use a double-sided cut material) */
function paFrond(len,wid,droop,seg=5){ const geo=plane(len,wid,seg,1); for(let i=0;i<geo.P.length;i+=3){ const t=(geo.P[i]+len/2)/len; const y0=geo.P[i+1]; geo.P[i]=t*len; geo.P[i+1]=t*len*.25-t*t*droop; geo.P[i+2]=y0*(1-t*.5); }
  for(let i=0;i<geo.Nm.length;i+=3){ geo.Nm[i]=0; geo.Nm[i+1]=1; geo.Nm[i+2]=0; } return geo; }
/* a collider the player meets but never sees: keeps a prop's old footprint when what you see of it is built from finer pieces */
const paHide=n=>(n.vis=false,n.keepHidden=1,n);
/* decoration only: nothing to walk into, nothing for the colliders to read */
const paNC=n=>(n.noCollide=1,n);
/* a tiling surface painted at a fixed pixel size (256 by default): walls, floors, ceilings */
function paTex(w,h,fn,gr=0,seed=1,px=256){ const S=px/Math.max(w,h); return tex(Math.round(w*S),Math.round(h*S),null,g=>{ g.scale(S,S); fn(g,w,h); g.setTransform(1,0,0,1,0,0); if(gr) paGrain(g,gr,seed); }); }
/* brush grain laid over a painted canvas as a tiled noise pattern ('overlay' keeps the painted alpha), far cheaper than touching every pixel */
const PA_NOISE={};
function paGrain(g,amt,seed){ const k=seed%4; let n=PA_NOISE[k]; if(!n){ n=document.createElement('canvas'); n.width=n.height=96; const c=n.getContext('2d'), I=c.createImageData(96,96), r=rng(4100+k);
    for(let i=0;i<I.data.length;i+=4){ const v=128+(r()-.5)*255; I.data[i]=I.data[i+1]=I.data[i+2]=v; I.data[i+3]=255; } c.putImageData(I,0,0); PA_NOISE[k]=n; }
  const W=g.canvas.width, H=g.canvas.height, t=document.createElement('canvas'); t.width=W; t.height=H; const c=t.getContext('2d');
  c.fillStyle=c.createPattern(n,'repeat'); c.fillRect(0,0,W,H); c.globalCompositeOperation='destination-in'; c.drawImage(g.canvas,0,0);
  g.save(); g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation='overlay'; g.globalAlpha=Math.min(.6,amt*.06); g.drawImage(t,0,0); g.restore(); }
/* a car's kit is painted once and kept: restarting a level or coming back reuses the same canvases */
const PA_KITS={}; const paKit=(k,fn)=>PA_KITS[k]||(PA_KITS[k]=fn());
/* a gangway door between cars: framed, a rounded window with the next car's light in it, a push bar, a kick plate */
function paDoor(base,trim,glow='#ffe8b0'){ return paTex(32,64,(g,w,h)=>{ paPanel(g,0,0,w,h,base,{hi:.18,lo:.25,bevel:1.2}); R(g,trim,0,0,w,1.2); R(g,trim,0,0,1.2,h); R(g,trim,w-1.2,0,1.2,h);
  paRR(g,7,6,18,20,4); g.fillStyle=mix(base,'#000000',.45); g.fill(); paRR(g,8,7,16,18,3.4); g.fillStyle=grad(g,0,7,0,25,[[0,rgba(glow,.95)],[1,mix(glow,'#000000',.6)]]); g.fill(); g.save(); paRR(g,8,7,16,18,3.4); g.clip(); paStreaks(g,8,7,16,18,.25); g.restore();
  paInset(g,5,30,22,16,base,{bevel:.7}); vfill(g,4,36,24,2.4,[[0,'#f4f6f8'],[.5,'#9aa0a8'],[1,'#5a6068']]); R(g,'#3a3e44',4,38.4,24,.4); for(const x of [4.5,26.5]) R(g,'#5a6068',x,35.4,1,3.6);
  vfill(g,1.2,54,w-2.4,10,[[0,'#d8dce0'],[1,'#7a8088']]); for(let k=0;k<6;k++) R(g,rgba('#000000',.15),3+k*4.6,55,2.4,8); R(g,'#000000',0,h-.6,w,.6); },2,77); }
/* rounded rectangle path */
function paRR(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.quadraticCurveTo(x+w,y,x+w,y+r); g.lineTo(x+w,y+h-r); g.quadraticCurveTo(x+w,y+h,x+w-r,y+h); g.lineTo(x+r,y+h); g.quadraticCurveTo(x,y+h,x,y+h-r); g.lineTo(x,y+r); g.quadraticCurveTo(x,y,x+r,y); g.closePath(); }
function paScrew(g,x,y,r=.8){ ell(g,x,y+.3,r,r,rgba('#000000',.35)); ell(g,x,y,r,r,'#b8b4aa'); R(g,'#6a665e',x-r*.7,y-.15,r*1.4,.3); ell(g,x-r*.3,y-r*.35,r*.35,r*.25,rgba('#ffffff',.6)); }
/* text centred in a box */
function paText(g,s,x,y,w,col,sc=1){ text(g,s,x+((w-textW(s,sc))/2),y,col,sc); }

/* =========================== the locomotive: navy, gold and cream, a flight deck =========================== */
function paCabKit(){ const NV='#1a2846', NV2='#24365e', GD='#d4ad5a', CR='#ebe5d8';
  const walls={
    upper:paTex(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f0eadc'],[1,'#dcd5c6']]); paInset(g,5,5,54,54,'#ebe4d6',{hi:.1,lo:.1,bevel:.7});
      R(g,'#a29c8e',0,0,w,1); R(g,'#fffaf0',0,1,w,.6); R(g,'#a29c8e',0,0,1,h); R(g,'#fffaf0',1,0,.6,h); for(const [x,y] of [[2.8,2.8],[61.2,2.8],[2.8,61.2],[61.2,61.2]]) paScrew(g,x,y,.8);
      R(g,rgba(NV,.8),5,52,54,.8); R(g,rgba(GD,.9),5,53.4,54,.5); },3,601),
    dado:paTex(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a3c66'],[.55,NV],[1,'#121c34']]); R(g,GD,0,3,w,1.2); R(g,rgba('#fff0c0',.5),0,3,w,.4); R(g,'#0e1628',0,4.2,w,.6);
      paInset(g,4,9,56,40,'#1e2e50',{bevel:.8}); R(g,'#0e1628',0,0,.8,h); R(g,rgba('#ffffff',.12),.8,0,.5,h);
      vfill(g,0,52,w,12,[[0,'#9aa0a8'],[.2,'#c8ccd2'],[1,'#6a7078']]); for(let x=2;x<w;x+=4) R(g,rgba('#000000',.18),x,54,.5,9); R(g,'#4a4e56',0,52,w,.6); },2,602),
    floor:paTex(48,48,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2c3038'],[1,'#24282f']]); for(let y=3;y<h;y+=6) for(let x=(y/6|0)%2?6:3;x<w;x+=6){ ell(g,x+.3,y+.4,1.5,1.5,rgba('#000000',.45)); ell(g,x,y,1.5,1.5,'#3a3f4a'); ell(g,x-.4,y-.4,.7,.6,rgba('#ffffff',.18)); }
      R(g,'#15181d',0,0,w,.6); R(g,'#15181d',0,0,.6,h); R(g,rgba('#ffffff',.08),0,.6,w,.4); },3,603),
    ceil:paTex(64,64,(g,w,h)=>{ radial(g,32,32,46,[[0,'#f2eee6'],[1,'#d6d0c4']]); R(g,'#9a9488',0,0,w,1); R(g,'#9a9488',0,0,1,h); R(g,'#ffffff',0,1,w,.5);
      paInset(g,40,6,18,8,'#c8c2b6'); for(let k=0;k<6;k++) R(g,'#5a564e',42,7.4+k*1.1,14,.5); for(const [x,y] of [[3,3],[61,3],[3,61],[61,61]]) paScrew(g,x,y,.6); },2,604)};
  /* every small lit thing in the cab */
  const A=paAtlas(128,128,(g,w,h,A)=>{
    let [x,y,W,H]=A.r('ctop',0,0,64,24); paPanel(g,x,y,W,H,'#22325a',{hi:.14});
    paInset(g,x+2,y+2,17,20,'#121c32'); paInset(g,x+21,y+2,22,8,'#121c32'); paInset(g,x+21,y+12,22,10,'#121c32'); paInset(g,x+45,y+2,17,20,'#121c32');
    paDial(g,x+6.5,y+7,3.6,'#ece6d6','#c8302a',.3); paDial(g,x+14.5,y+7,3.6,'#ece6d6','#c8302a',2.4); paDial(g,x+6.5,y+16,3.6,'#ece6d6','#2a7a3a',1.4); paDial(g,x+14.5,y+16,3.6,'#ece6d6','#2a7a3a',3.6);
    for(let k=0;k<5;k++) for(let j=0;j<2;j++) paBtn(g,x+24+k*4,y+4+j*3.4,1.2,['#c8302a','#f5c542','#7cd06a','#5ab8e8','#ece6d6'][(k+j*2)%5],k%2===0);
    for(let k=0;k<10;k++) for(let j=0;j<3;j++){ R(g,'#0a0e18',x+22.4+k*2.05,y+13.4+j*2.8,1.8,2.3); vfill(g,x+22.5+k*2.05,y+13.4+j*2.8,1.6,2,[[0,'#d8d4cc'],[1,'#9a968e']]); }
    for(let k=0;k<4;k++){ R(g,'#0a0e18',x+47+k*3.6,y+4,1.6,9); paRod(g,x+47.3+k*3.6,y+5,1,6,'#c8ccd2',true); ell(g,x+47.8+k*3.6,y+4.6,1.1,1.1,['#c8302a','#ece6d6','#ece6d6','#f5c542'][k]); }
    for(let k=0;k<6;k++) paBtn(g,x+48+k*2.4,y+17,.9,k<2?'#7cd06a':'#f5c542',k<2); text(g,'THROTTLE',x+46,y+20.4,'#d4ad5a',.35);
    R(g,GD,x,y,W,.7); R(g,GD,x,y+H-.7,W,.7);
    [x,y,W,H]=A.r('cfront',64,0,64,24); paPanel(g,x,y,W,H,NV,{hi:.18,lo:.3}); R(g,GD,x,y+2,W,.8); R(g,rgba('#fff0c0',.5),x,y+2,W,.3);
    for(let k=0;k<4;k++){ paInset(g,x+3+k*15.5,y+5,13,13,'#16223c',{bevel:.6}); for(let j=0;j<6;j++) R(g,'#0a1020',x+5+k*15.5,y+7+j*1.8,9,.8); paScrew(g,x+4+k*15.5,y+6,.5); paScrew(g,x+15+k*15.5,y+6,.5); }
    vfill(g,x,y+20,W,4,[[0,'#3a3e46'],[1,'#121418']]);
    [x,y,W,H]=A.r('cside',0,24,48,20); paPanel(g,x,y,W,H,'#22325a'); paInset(g,x+2,y+2,20,16,'#121c32'); paInset(g,x+24,y+2,22,16,'#121c32');
    for(let k=0;k<4;k++) for(let j=0;j<3;j++) paBtn(g,x+5+k*4.5,y+6+j*4.5,1.3,['#5ab8e8','#ece6d6','#f5c542'][(k+j)%3],(k*j)%3===0);
    paDial(g,x+30,y+10,5,'#ece6d6','#c8302a',.8); paDial(g,x+41,y+10,4,'#ece6d6','#2a7a3a',2.6); R(g,GD,x,y,W,.6);
    [x,y,W,H]=A.r('navyP',48,24,16,16); paPanel(g,x,y,W,H,NV,{hi:.2,lo:.3});
    [x,y,W,H]=A.r('creamP',48,40,16,16); paPanel(g,x,y,W,H,CR,{hi:.08,lo:.18});
    [x,y,W,H]=A.r('leather',64,24,32,32); vfill(g,x,y,W,H,[[0,'#2c4070'],[1,'#162444']]); for(let j=0;j<4;j++) for(let k=0;k<4;k++){ const cx=x+4+k*8+(j%2)*4, cy=y+4+j*8; radial(g,cx,cy-1,5,[[0,rgba('#5a74a8',.55)],[1,rgba('#5a74a8',0)]]); ell(g,cx,cy+2.5,1,1,'#0c1428'); ell(g,cx,cy+2.2,.5,.5,'#d4ad5a'); }
    for(let j=0;j<5;j++){ g.strokeStyle=rgba('#0c1428',.6); g.lineWidth=.5; g.beginPath(); g.moveTo(x,y+j*8+2.5); for(let k=0;k<=8;k++) g.lineTo(x+k*4,y+j*8+2.5+((k+j)%2?4:-4)); g.stroke(); } R(g,'#d4ad5a',x,y,W,.8); R(g,'#d4ad5a',x,y+H-.8,W,.8);
    [x,y,W,H]=A.r('chrome',96,24,16,16); vfill(g,x,y,W,H,[[0,'#f4f6f8'],[.35,'#9aa0a8'],[.5,'#e4e8ec'],[1,'#5a6068']]);
    [x,y,W,H]=A.r('gold',112,24,16,16); vfill(g,x,y,W,H,[[0,'#fff0b8'],[.35,'#c8983a'],[.55,'#f2d48a'],[1,'#8a6420']]);
    [x,y,W,H]=A.r('locker',0,44,16,32); vfill(g,x,y,W,H,[[0,'#d4d8de'],[1,'#a4aab2']]); R(g,'#7e848c',x,y,.8,H); R(g,'#f4f6f8',x+.8,y,.4,H); for(let k=0;k<5;k++){ R(g,'#4a5058',x+4,y+3+k*1.4,8,.7); R(g,'#f4f6f8',x+4,y+3.7+k*1.4,8,.3); }
    paInset(g,x+4.5,y+11,7,2.6,'#f2ece0',{bevel:.4}); R(g,'#1a2846',x+5.5,y+11.8,4,.35); R(g,'#8a8e94',x+5.5,y+12.6,3,.3); R(g,'#3a3c40',x+12,y+16,1.6,4.5); R(g,'#c8ccd2',x+12.3,y+16.5,1,1.2); for(let k=0;k<5;k++) R(g,'#4a5058',x+4,y+H-9+k*1.4,8,.7); radial(g,x+8,y+H,10,[[0,rgba('#000000',.25)],[1,rgba('#000000',0)]]);
    [x,y,W,H]=A.r('rack',16,44,24,32); vfill(g,x,y,W,H,[[0,'#d8dce0'],[1,'#a8aeb6']]); R(g,'#7e848c',x,y,.6,H); R(g,'#7e848c',x+W-.6,y,.6,H);
    for(let j=0;j<5;j++){ paInset(g,x+2,y+2+j*5.4,20,4.4,'#2a2e36',{bevel:.5}); for(let k=0;k<5;k++) R(g,(j+k)%4?'#7cf06a':'#f5c542',x+3+k*1.6,y+3+j*5.4,.9,.9); for(let k=0;k<6;k++) R(g,'#14161a',x+12+k*1.5,y+3+j*5.4,.6,2.6); }
    R(g,'#f5c542',x+3,y+H-4,8,3); poly(g,[[x+7,y+H-3.6],[x+8.6,y+H-1.4],[x+5.4,y+H-1.4]],'#1a1a1a'); text(g,'600V',x+12,y+H-3.5,'#c8302a',.5);
    [x,y,W,H]=A.r('cupb',40,56,32,20); paPanel(g,x,y,W,H,'#e2ddd2',{bevel:0}); for(let k=0;k<2;k++){ paPanel(g,x+1+k*15.5,y+1,14.5,H-2.5,'#ece6da',{hi:.12,lo:.12}); paRod(g,x+(k?17.5:13),y+4,1,7,'#c8ccd2',true); } vfill(g,x,y+H-1.5,W,1.5,[[0,'#3a3e46'],[1,'#1a1c20']]);
    [x,y,W,H]=A.r('steel',72,56,24,8); vfill(g,x,y,W,H,[[0,'#e8ecf0'],[.5,'#b8bec6'],[1,'#d4d8de']]); for(let k=0;k<10;k++) R(g,rgba('#ffffff',.2),x,y+k*.8,W,.2);
    [x,y,W,H]=A.r('micro',72,64,20,12); paPanel(g,x,y,W,H,'#3a3c42'); R(g,'#121418',x+1.5,y+1.5,12,9); paStreaks(g,x+1.5,y+1.5,12,9,.12); R(g,'#5ab8e8',x+15,y+2,3.5,1.6); for(let k=0;k<6;k++) paBtn(g,x+15.5+(k%2)*2,y+5+(k>>1)*2,.6,'#c8ccd2');
    [x,y,W,H]=A.r('coffee',112,40,16,20); paPanel(g,x,y,W,H,'#2a2c30'); paInset(g,x+2,y+8,12,9,'#121316'); R(g,'#c8ccd2',x+6,y+8,4,2); ell(g,x+8,y+15,2.4,1.2,'#e8e4dc'); paBtn(g,x+4,y+4,1,'#7cd06a',true); paBtn(g,x+8,y+4,1,'#c8ccd2'); paBtn(g,x+12,y+4,1,'#c8ccd2'); text(g,'BREW',x+4,y+1,'#d4ad5a',.4);
    [x,y,W,H]=A.r('tabletop',96,60,32,16); vfill(g,x,y,W,H,[[0,'#f4f0e8'],[1,'#e2dcd0']]); R(g,GD,x,y,W,.8); R(g,GD,x,y+H-.8,W,.8); R(g,GD,x,y,.8,H); R(g,GD,x+W-.8,y,.8,H); for(let k=0;k<6;k++) R(g,rgba('#ffffff',.25),x+3+k*5,y+1,.6,H-2);
    [x,y,W,H]=A.r('blanket',0,76,32,16); vfill(g,x,y,W,H,[[0,'#2a3c66'],[1,'#18264a']]); paWeave(g,x,y,W,H,'#000000',.15,1); R(g,GD,x,y+3,W,1); R(g,GD,x,y+H-4,W,1); for(let k=0;k<5;k++){ g.strokeStyle=rgba('#0c1428',.4); g.lineWidth=.6; g.beginPath(); g.moveTo(x+k*7,y+5); g.quadraticCurveTo(x+k*7+3,y+8,x+k*7+1,y+11); g.stroke(); }
    [x,y,W,H]=A.r('pillow',32,76,16,10); vfill(g,x,y,W,H,[[0,'#ffffff'],[1,'#d8d4cc']]); radial(g,x+8,y+4,7,[[0,rgba('#ffffff',.8)],[1,rgba('#ffffff',0)]]); g.strokeStyle=rgba('#a8a49c',.7); g.lineWidth=.4; g.beginPath(); g.moveTo(x+2,y+7); g.quadraticCurveTo(x+8,y+5,x+14,y+7.5); g.stroke();
    [x,y,W,H]=A.r('curtain',48,76,16,24); for(let k=0;k<W;k++){ const v=.5+.5*Math.sin(k*1.1); R(g,mix('#1a2846','#3a5490',v*.7),x+k,y,1,H); } R(g,GD,x,y+H-1.5,W,.8); radial(g,x+8,y+H,14,[[0,rgba('#000000',.25)],[1,rgba('#000000',0)]]);
    [x,y,W,H]=A.r('poster',64,76,32,24); R(g,'#0e1628',x,y,W,H); R(g,GD,x,y,W,1); R(g,GD,x,y+H-1,W,1); R(g,GD,x,y,1,H); R(g,GD,x+W-1,y,1,H); vfill(g,x+2,y+2,W-4,H-4,[[0,'#f2e2b8'],[1,'#d8c08a']]);
    g.strokeStyle='#1a2846'; g.lineWidth=1.2; g.beginPath(); g.ellipse(x+16,y+11,11,6,0,0,Math.PI*2); g.stroke(); g.strokeStyle='#c8302a'; g.lineWidth=.5; g.beginPath(); g.ellipse(x+16,y+11,11,6,0,0,Math.PI*2); g.stroke();
    for(let k=0;k<7;k++){ const a=k/7*Math.PI*2-Math.PI/2; ell(g,x+16+Math.cos(a)*11,y+11+Math.sin(a)*6,1.1,1.1,'#1a2846'); ell(g,x+16+Math.cos(a)*11,y+11+Math.sin(a)*6,.5,.5,'#f5c542'); }
    paText(g,'MERIDIAN 24',x,y+5.5,W,'#1a2846',.5); paText(g,'ONE DAY ROUND THE WORLD',x,y+9.6,W,'#8a2a22',.33); paText(g,'TOKYO-TOKYO',x,y+19.5,W,'#1a2846',.45);
    [x,y,W,H]=A.r('clock',96,76,16,16); ell(g,x+8,y+8.4,7.6,7.6,rgba('#000000',.4)); ell(g,x+8,y+8,7.6,7.6,GD); ell(g,x+8,y+8,6.4,6.4,'#f6f2e8'); for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; R(g,'#1a2846',x+8+Math.cos(a)*5.3-.35,y+8+Math.sin(a)*5.3-.35,.7,.7); }
    g.strokeStyle='#1a2846'; g.lineWidth=.7; g.beginPath(); g.moveTo(x+8,y+8); g.lineTo(x+8+2.8,y+8-2.4); g.moveTo(x+8,y+8); g.lineTo(x+8-.6,y+8+4.6); g.stroke(); ell(g,x+5.5,y+4.5,2.5,1.2,rgba('#ffffff',.6));
    [x,y,W,H]=A.r('ext',112,76,16,24); hfill(g,x,y,W,H,[[0,'#7a1010'],[.3,'#e83a2a'],[.45,'#ff8a70'],[.6,'#c8202a'],[1,'#6a0c0c']]); R(g,'#f2ece0',x+3,y+9,10,8); text(g,'FIRE',x+4,y+10,'#c8202a',.5); R(g,'#1a1a1a',x+4,y+14,8,.6); R(g,'#1a1a1a',x+4,y+15.2,6,.6);
    [x,y,W,H]=A.r('aid',0,92,16,16); paPanel(g,x,y,W,H,'#2a8a4a'); R(g,'#ffffff',x+6.5,y+3,3,10); R(g,'#ffffff',x+3,y+6.5,10,3); R(g,'#1e6a38',x,y+H-2,W,2);
    [x,y,W,H]=A.r('intercom',16,92,16,16); paPanel(g,x,y,W,H,'#c8ccd2'); for(let j=0;j<4;j++) for(let k=0;k<5;k++) ell(g,x+4+k*2,y+3+j*1.6,.5,.5,'#2a2e36'); paBtn(g,x+5,y+11,1.4,'#c8302a'); paBtn(g,x+10,y+11,1.4,'#7cd06a',true); text(g,'TALK',x+3,y+14,'#1a2846',.4);
    [x,y,W,H]=A.r('mug',32,100,16,8); hfill(g,x,y,W,H,[[0,'#a8a49c'],[.3,'#ffffff'],[1,'#a8a49c']]); R(g,NV,x,y+1,W,1.5); R(g,GD,x,y+2.5,W,.4); ell(g,x+8,y+5,1.2,1.2,GD);
    [x,y,W,H]=A.r('thermos',48,100,16,8); hfill(g,x,y,W,H,[[0,'#5a6068'],[.3,'#e4e8ec'],[.5,'#9aa0a8'],[1,'#3a3e46']]); R(g,'#1a1a1a',x,y,W,1.6);
    [x,y,W,H]=A.r('paper',64,100,24,16); R(g,'#ece8dc',x,y,W,H); text(g,'MERIDIAN TIMES',x+1,y+1,'#1a1a1a',.4); R(g,'#1a1a1a',x+1,y+3.6,W-2,.3); for(let k=0;k<8;k++) R(g,'#8a8a84',x+1+(k%2)*11,y+5+(k>>1)*2.4,10,.5); R(g,'#5a5a54',x+12,y+5,10,6);
    [x,y,W,H]=A.r('tray',88,100,40,8); R(g,'#3a3e46',x,y,W,H); for(let k=0;k<5;k++){ const c=['#1a1a1a','#c8302a','#2a2e36','#f5c542','#1a1a1a'][k]; vfill(g,x,y+1+k*1.3,W,1.1,[[0,mix(c,'#ffffff',.3)],[1,mix(c,'#000000',.3)]]); } R(g,'#7e848c',x,y,W,.6); R(g,'#7e848c',x,y+H-.6,W,.6);
    [x,y,W,H]=A.r('bezel',0,108,24,16); paPanel(g,x,y,W,H,'#14161c',{hi:.25,lo:.2}); paInset(g,x+1.5,y+1.5,W-3,H-3,'#0a0b0e'); for(const [sx,sy] of [[.8,.8],[W-.8,.8],[.8,H-.8],[W-.8,H-.8]]) paScrew(g,x+sx,y+sy,.4);
    [x,y,W,H]=A.r('rubber',24,108,8,8); vfill(g,x,y,W,H,[[0,'#3a3c40'],[1,'#141518']]);
    [x,y,W,H]=A.r('cushion',88,108,40,12); vfill(g,x,y,W,H,[[0,'#3a5490'],[.5,'#22345e'],[1,'#121c34']]); R(g,GD,x,y,W,.6); for(let k=0;k<4;k++) radial(g,x+5+k*10,y+5,5,[[0,rgba('#6a84c0',.35)],[1,rgba('#6a84c0',0)]]);
    [x,y,W,H]=A.r('cap',32,108,16,8); vfill(g,x,y,W,H,[[0,'#2a3c66'],[1,'#0e1628']]); R(g,GD,x,y+5,W,1); R(g,'#0a0e18',x,y+6,W,2); ell(g,x+8,y+3,1.6,1.6,GD);
    [x,y,W,H]=A.r('visor',48,116,40,8); vfill(g,x,y,W,H,[[0,'#2a2e36'],[1,'#121418']]); for(let k=0;k<8;k++) R(g,rgba('#ffffff',.06),x+k*5,y,2,H);
    [x,y,W,H]=A.r('plate',88,120,8,8); ell(g,x+4,y+4,3.9,3.9,'#c8c4bc'); radial(g,x+3.4,y+3.4,4.2,[[0,'#ffffff'],[1,'#e2ded4']]); g.save(); g.beginPath(); g.arc(x+4,y+4,3.6,0,7); g.clip(); radial(g,x+3.4,y+3.4,4,[[0,'#ffffff'],[1,'#dcd8ce']]); g.restore(); g.strokeStyle='#d4ad5a'; g.lineWidth=.25; g.beginPath(); g.arc(x+4,y+4,3.2,0,7); g.stroke(); ell(g,x+4,y+4,2.3,2.3,'#eeeae2');
    [x,y,W,H]=A.r('wood',0,124,32,4); for(let k=0;k<4;k++) R(g,['#6a3a1e','#7a4626','#5a3018','#6a3a1e'][k],x,y+k,W,1);
  },5,605);
  /* the screens: route loop, speed, signals, cameras down the train, a list of the cars */
  const S=paAtlas(128,64,(g,w,h,A)=>{
    const bg=(x,y,W,H)=>{ vfill(g,x,y,W,H,[[0,'#0c1e30'],[1,'#06101c']]); for(let k=0;k<H;k+=1.5) R(g,rgba('#000000',.18),x,y+k,W,.5); };
    let [x,y,W,H]=A.r('route',0,0,48,32); bg(x,y,W,H);
    for(const [cx,cy,rx,ry] of [[10,12,6,5],[16,22,3,5],[25,10,5,3],[32,13,8,5],[38,24,4,3],[44,9,3,2]]) ell(g,x+cx,y+cy,rx,ry,'#16364a');
    g.strokeStyle='#29e0e6'; g.lineWidth=.6; g.beginPath(); g.ellipse(x+24,y+16,18,8,0,0,Math.PI*2); g.stroke();
    const st=['TKY','HKG','BKL','LDN','NAP','RIO','LAS']; st.forEach((s,k)=>{ const a=k/7*Math.PI*2-Math.PI/2, px=x+24+Math.cos(a)*18, py=y+16+Math.sin(a)*8; ell(g,px,py,1.2,1.2,k===6?'#ff5a4a':'#f5c542'); text(g,s,px-3,py+(Math.sin(a)>0?1.6:-4),'#8ae8f0',.3); });
    radial(g,x+24+Math.cos(-Math.PI/2-.5)*18,y+16+Math.sin(-Math.PI/2-.5)*8,4,[[0,rgba('#ffffff',.9)],[1,rgba('#29e0e6',0)]]); text(g,'LOOP 24',x+1.5,y+1.5,'#29e0e6',.5); text(g,'NEXT TKY',x+30,y+28,'#f5c542',.4);
    [x,y,W,H]=A.r('speed',48,0,32,32); bg(x,y,W,H); g.strokeStyle='#1e4a6a'; g.lineWidth=2; g.beginPath(); g.arc(x+16,y+17,11,Math.PI*.8,Math.PI*2.2); g.stroke(); g.strokeStyle='#5ab8e8'; g.beginPath(); g.arc(x+16,y+17,11,Math.PI*.8,Math.PI*1.9); g.stroke();
    paText(g,'1920',x,y+13,W,'#e8f8ff',.9); paText(g,'KM/H',x,y+19.5,W,'#5ab8e8',.45); text(g,'ATP',x+2,y+28,'#7cf06a',.4); text(g,'LIM 2000',x+14,y+28,'#f5c542',.35);
    [x,y,W,H]=A.r('track',80,0,48,32); bg(x,y,W,H); R(g,'#3a6a8a',x+3,y+16,W-6,.6); R(g,'#3a6a8a',x+3,y+22,W-6,.6); for(let k=0;k<8;k++) R(g,k<5?'#7cf06a':k<7?'#f5c542':'#ff5a4a',x+4+k*5.2,y+12,4,2);
    R(g,'#e8f8ff',x+10,y+15,8,2); text(g,'ATC OK',x+2,y+2,'#7cf06a',.5); text(g,'BLOCK 7',x+28,y+2,'#8ae8f0',.4); for(let k=0;k<6;k++) R(g,'#1e4a6a',x+3+k*7.4,y+25,6,4); text(g,'BRAKE',x+3,y+26,'#e8f8ff',.3);
    [x,y,W,H]=A.r('cctv',0,32,32,24); R(g,'#06101c',x,y,W,H); const rooms=[['#b82020','#d4ad5a'],['#2a6a4a','#5a2a1a'],['#2ac0d0','#f2ece0'],['#8a1424','#d4ad5a']];
    rooms.forEach(([a,b],k)=>{ const rx=x+1+(k%2)*15.5, ry=y+1+(k>>1)*11.5; vfill(g,rx,ry,14.5,10.5,[[0,mix(a,'#000000',.2)],[1,mix(a,'#000000',.6)]]); poly(g,[[rx+3,ry+3],[rx+11.5,ry+3],[rx+14.5,ry+10.5],[rx,ry+10.5]],mix(b,'#000000',.4)); R(g,'#e8f8ff',rx+.6,ry+.6,1,1); text(g,'CAM'+(k+3),rx+4,ry+.8,'#e8f8ff',.3); }); R(g,rgba('#ffffff',.06),x,y,W,H);
    [x,y,W,H]=A.r('cars',32,32,32,24); bg(x,y,W,H); ['DIM SUM','BANYA','PUB','TRATTORIA','AQUARIUM','POOL','CASINO','CAPSULE'].forEach((s,k)=>{ text(g,s,x+2,y+1.5+k*2.7,'#8ae8f0',.38); R(g,k<7?'#ff5a4a':'#f5c542',x+W-4,y+1.8+k*2.7,2,1.4); });
    [x,y,W,H]=A.r('ledG',64,32,4,4); radial(g,x+2,y+2,2.6,[[0,'#e8ffe0'],[.5,'#7cf06a'],[1,'#2a6a2a']]);
    [x,y,W,H]=A.r('ledR',68,32,4,4); radial(g,x+2,y+2,2.6,[[0,'#ffe0d8'],[.5,'#ff4a3a'],[1,'#6a1010']]);
    [x,y,W,H]=A.r('ledA',72,32,4,4); radial(g,x+2,y+2,2.6,[[0,'#fff8d8'],[.5,'#f5c542'],[1,'#6a4a10']]);
    [x,y,W,H]=A.r('ledB',76,32,4,4); radial(g,x+2,y+2,2.6,[[0,'#e8f8ff'],[.5,'#5ab8e8'],[1,'#1a3a6a']]);
    [x,y,W,H]=A.r('lamp',64,36,32,8); vfill(g,x,y,W,H,[[0,'#ffffff'],[1,'#e4ecf8']]); R(g,'#c8ccd2',x,y,W,.6); R(g,'#c8ccd2',x,y+H-.6,W,.6); for(let k=1;k<8;k++) R(g,rgba('#a8b0c0',.5),x+k*4,y,.3,H);
    [x,y,W,H]=A.r('exit',96,32,32,10); R(g,'#1a8a4a',x,y,W,H); paText(g,'DECK',x,y+2.5,W,'#ffffff',1);
    [x,y,W,H]=A.r('sign',64,44,64,12); R(g,'#0a0e18',x,y,W,H); paText(g,'FLIGHT DECK',x,y+3,W,'#d4ad5a',1); R(g,'#d4ad5a',x+2,y+1,W-4,.4); R(g,'#d4ad5a',x+2,y+H-1.4,W-4,.4);
    [x,y,W,H]=A.r('night',0,56,64,8); vfill(g,x,y,W,H,[[0,'#ffe8b0'],[1,'#ffb860']]);
  },0,606);
  return {walls,A,S}; }

/* =========================== the capsule hotel: white moulded pods, steel, cyan light =========================== */
function paCapsuleKit(){ const CY='#29e0e6', WH_='#f2f2ee';
  const walls={
    wall:paTex(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f8f8f4'],[1,'#e2e2dc']]); paInset(g,3,3,58,58,'#f2f2ec',{hi:.06,lo:.08,bevel:.5}); R(g,'#b8b8b2',0,0,w,.8); R(g,'#b8b8b2',0,0,.8,h); R(g,'#ffffff',.8,0,.4,h);
      for(let k=0;k<5;k++) R(g,'#c8c8c2',50,8+k*1.4,8,.5); },2,701),
    floor:paTex(48,48,(g,w,h)=>{ R(g,'#3a3a44',0,0,w,h); for(let y=0;y<h;y+=1) for(let x=(y%2);x<w;x+=2) if((x*7+y*3)%5===0) R(g,'#444450',x,y,1,1);
      for(let y=0;y<h;y+=12) for(let x=0;x<w;x+=12){ poly(g,[[x+6,y+1.5],[x+10.5,y+6],[x+6,y+10.5],[x+1.5,y+6]],rgba('#50505e',.6)); poly(g,[[x+6,y+4],[x+8,y+6],[x+6,y+8],[x+4,y+6]],rgba('#30303a',.7)); } },4,702),
    ceil:paTex(64,64,(g,w,h)=>{ radial(g,32,32,46,[[0,'#ffffff'],[1,'#e4e4de']]); R(g,'#b8b8b2',0,0,w,.7); R(g,'#b8b8b2',0,0,.7,h); R(g,'#ffffff',0,.7,w,.4); for(let k=0;k<4;k++) R(g,'#c8c8c2',6,6+k*1.4,10,.5); },2,703)};
  const A=paAtlas(128,128,(g,w,h,A)=>{
    let [x,y,W,H]=A.r('podside',0,0,32,32); vfill(g,x,y,W,H,[[0,'#fbfbf8'],[.6,'#ececE6'],[1,'#d2d2cc']]); g.strokeStyle='#c4c4be'; g.lineWidth=.6; paRR(g,x+2,y+2,W-4,H-4,4); g.stroke(); g.strokeStyle=rgba('#ffffff',.9); g.lineWidth=.4; paRR(g,x+2.6,y+2.6,W-4,H-4,4); g.stroke();
    for(let k=0;k<6;k++){ R(g,'#a8a8a2',x+20,y+6+k*1.4,8,.6); R(g,'#ffffff',x+20,y+6.6+k*1.4,8,.3); }
    [x,y,W,H]=A.r('rimH',32,0,16,16); vfill(g,x,y,W,H,[[0,'#ffffff'],[.25,'#f6f6f2'],[.8,'#dcdcd6'],[1,'#b8b8b2']]);
    [x,y,W,H]=A.r('rimV',48,0,16,16); hfill(g,x,y,W,H,[[0,'#d0d0ca'],[.3,'#ffffff'],[.7,'#f0f0ea'],[1,'#c0c0ba']]);
    [x,y,W,H]=A.r('steel',64,0,16,16); vfill(g,x,y,W,H,[[0,'#f4f6f8'],[.35,'#9aa0a8'],[.5,'#e4e8ec'],[1,'#5a6068']]);
    [x,y,W,H]=A.r('dark',80,0,16,16); paPanel(g,x,y,W,H,'#2a2a34',{hi:.2,lo:.3});
    [x,y,W,H]=A.r('locker',96,0,16,32); vfill(g,x,y,W,H,[[0,'#e4e6ea'],[1,'#b4b8be']]); R(g,'#8a8e94',x,y,.6,H); R(g,'#ffffff',x+.6,y,.4,H);
    paInset(g,x+3,y+3,10,6,'#2a2a34',{bevel:.4}); for(let j=0;j<3;j++) for(let k=0;k<3;k++) R(g,'#c8ccd2',x+4+k*2.8,y+3.8+j*1.7,2,1.2); R(g,CY,x+11,y+4,1,1); for(let k=0;k<4;k++) R(g,'#9aa0a8',x+4,y+20+k*1.4,8,.6);
    [x,y,W,H]=A.r('vmside',112,0,16,32); vfill(g,x,y,W,H,[[0,'#e8e8e4'],[1,'#b8b8b4']]); R(g,'#d63a2c',x,y+10,W,4); R(g,'#2a6ad8',x,y+15,W,1.5); for(let k=0;k<3;k++) R(g,rgba('#000000',.2),x+3,y+24+k*1.4,10,.5);
    [x,y,W,H]=A.r('sofa',0,32,32,16); vfill(g,x,y,W,H,[[0,'#4a4a58'],[1,'#2a2a34']]); paWeave(g,x,y,W,H,'#000000',.18,1); R(g,'#1a1a22',x,y,W,.6); R(g,'#5a5a6a',x,y+.6,W,.4); radial(g,x+16,y+5,14,[[0,rgba('#ffffff',.08)],[1,rgba('#ffffff',0)]]);
    [x,y,W,H]=A.r('pillowC',32,32,16,16); vfill(g,x,y,W,H,[[0,'#5af0f6'],[1,'#1a9aa8']]); paWeave(g,x,y,W,H,'#000000',.15,1); radial(g,x+7,y+6,7,[[0,rgba('#ffffff',.35)],[1,rgba('#ffffff',0)]]); R(g,'#0e6a74',x,y+H-.6,W,.6);
    [x,y,W,H]=A.r('pillowP',48,32,16,16); vfill(g,x,y,W,H,[[0,'#ff7ac0'],[1,'#c02a7a']]); paWeave(g,x,y,W,H,'#000000',.15,1); radial(g,x+7,y+6,7,[[0,rgba('#ffffff',.35)],[1,rgba('#ffffff',0)]]); R(g,'#7a1a4a',x,y+H-.6,W,.6);
    [x,y,W,H]=A.r('white',64,16,16,16); paPanel(g,x,y,W,H,'#f2f2ee',{hi:.1,lo:.14});
    [x,y,W,H]=A.r('tabletop',80,16,16,16); radial(g,x+6,y+6,12,[[0,'#ffffff'],[1,'#dcdcd6']]); g.strokeStyle=rgba('#ffffff',.9); g.lineWidth=.5; g.beginPath(); g.arc(x+8,y+8,7.4,3.6,5.2); g.stroke();
    [x,y,W,H]=A.r('mag',64,32,24,16); [['#d63a2c','#f2f2ee'],['#2a6ad8','#f2c230'],['#f2c230','#121214']].forEach(([a,b],k)=>{ const mx=x+k*8; vfill(g,mx,y,7.6,H,[[0,a],[1,mix(a,'#000000',.2)]]); R(g,b,mx+1,y+1,5.6,2.4); ell(g,mx+4,y+9,2.4,3,rgba(b,.8)); glyphs(g,mx+1,y+13,3,2,b,k*5,false); });
    [x,y,W,H]=A.r('spines',0,48,32,48); vfill(g,x,y,W,H,[[0,'#2a2a34'],[1,'#1a1a22']]); const r=rng(74);
    for(let row=0;row<5;row++){ const y0=y+1+row*9.4; let cx=x+1; while(cx<x+W-1.5){ const sw=1+r()*1.2, c=['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#ff4fae','#f2ece0','#f28a3a','#7a4ac8'][r()*8|0], sh=6.4+r()*1.6;
      hfill(g,cx,y0+8-sh,sw,sh,[[0,mix(c,'#000000',.35)],[.4,mix(c,'#ffffff',.15)],[1,mix(c,'#000000',.4)]]); R(g,rgba('#ffffff',.7),cx+.2,y0+8-sh+1,sw-.4,.4); R(g,rgba('#000000',.4),cx+.2,y0+8-sh+sh*.6,sw-.4,.6); cx+=sw+.1; }
      R(g,'#0c0c12',x,y0+8,W,1.4); }
    [x,y,W,H]=A.r('shelf',32,48,16,8); vfill(g,x,y,W,H,[[0,'#f6f6f2'],[1,'#c8c8c2']]);
    [x,y,W,H]=A.r('slip',32,56,16,8); vfill(g,x,y,W,H,[[0,'#ffffff'],[1,'#d0d8e4']]); R(g,'#2a6ad8',x,y+2,W,2);
    [x,y,W,H]=A.r('cup',48,48,16,8); hfill(g,x,y,W,H,[[0,'#c8c8c2'],[.35,'#ffffff'],[1,'#b8b8b2']]); R(g,CY,x,y+3,W,1.2); R(g,'#2a2a34',x,y,W,1);
    [x,y,W,H]=A.r('leaf',64,48,16,16); vfill(g,x,y,W,H,[[0,'#6ac04a'],[1,'#2a6a2a']]); R(g,'#2a5a22',x,y+H/2-.3,W,.6); for(let k=0;k<8;k++){ R(g,rgba('#1a4a1a',.5),x+k*2,y,.4,H/2); R(g,rgba('#1a4a1a',.5),x+k*2+1,y+H/2,.4,H/2); }
    [x,y,W,H]=A.r('pot',80,48,16,16); hfill(g,x,y,W,H,[[0,'#3a3a44'],[.35,'#6a6a78'],[1,'#22222a']]); R(g,'#4a3a2a',x,y,W,2);
    [x,y,W,H]=A.r('rug',0,96,48,32); R(g,'#2a2a34',x,y,W,H); R(g,CY,x+1.5,y+1.5,W-3,.6); R(g,CY,x+1.5,y+H-2.1,W-3,.6); R(g,CY,x+1.5,y+1.5,.6,H-3); R(g,CY,x+W-2.1,y+1.5,.6,H-3);
    for(let j=0;j<4;j++) for(let k=0;k<6;k++){ const cx=x+6+k*7.2, cy=y+6+j*6.8; poly(g,[[cx,cy-2.6],[cx+2.6,cy],[cx,cy+2.6],[cx-2.6,cy]],(j+k)%2?'#3a3a48':'#ff4fae'); } paWeave(g,x,y,W,H,'#000000',.12,1);
    const signs=[['PODS 101-109','sign1'],['PODS 110-118','sign2'],['PODS 121-129','sign3'],['PODS 130-138','sign4'],['LOUNGE','sign5'],['SHOWERS','sign6']];
    signs.forEach(([s,n],k)=>{ [x,y,W,H]=A.r(n,48+(k%2)*40,64+(k>>1)*10,40,10); paPanel(g,x,y,W,H,'#24242e',{hi:.15,lo:.2,bevel:.6}); R(g,CY,x+1.5,y+2,1.2,6); paText(g,s,x+3,y+2.5,W-6,'#f2f2ee',1); poly(g,[[x+W-4,y+3],[x+W-1.5,y+5],[x+W-4,y+7]],CY); });
    [x,y,W,H]=A.r('wood',48,94,32,8); for(let k=0;k<8;k++) R(g,['#c8a070','#b88e5e','#d4ac7c','#a88050'][k%4],x,y+k,W,1);
    [x,y,W,H]=A.r('cab',96,94,16,10); paPanel(g,x,y,W,H,'#e8e8e4',{hi:.1,lo:.16}); R(g,'#9aa0a8',x+W/2-.2,y+2,.4,H-4); paRod(g,x+W/2-2.5,y+6,1,4,'#c8ccd2',true); paRod(g,x+W/2+1.5,y+6,1,4,'#c8ccd2',true);
    /* the pod numbers: four rows of eighteen */
    for(let lv=0;lv<2;lv++) for(const sd of [0,1]) for(let i=0;i<18;i++){ const n=100*(lv+1)+i+sd*20, k=(lv*2+sd)*18+i, px=48+(k%12)*6.6, py=104+(k/12|0)*4; A.r('n'+n,px,py,6.6,4); R(g,'#2a2a34',px,py,6.6,4); R(g,CY,px,py+3.5,6.6,.5); paText(g,String(n),px,py+.6,6.6,'#f2f2ee',.5); }
  },3,704);
  const S=paAtlas(128,96,(g,w,h,A)=>{
    /* pod interiors in three moods (warm, cool, lights out): back wall, ceiling, side wall, mattress, pillow, blanket */
    [['w','#fff0d0','#f0c890','#9a6a3a','#d8584a'],['c','#e4f2ff','#a8c8e8','#4a5a7a','#3a5ab8'],['d','#4a4a5a','#30303e','#16161e','#3a2a4a']].forEach(([t,lt,md,dk,bl],row)=>{ const y0=row*16, dim=t==='d';
      let [x,y,W,H]=A.r('pB'+t,0,y0,16,16); vfill(g,x,y,W,H,[[0,lt],[.55,md],[1,dk]]); paAO(g,x,y,W,H,3,.35); R(g,'#1a1a22',x+3,y+3,7,4.4); vfill(g,x+3.4,y+3.4,6.2,3.6,dim?[[0,'#1a2a4a'],[1,'#0a1020']]:[[0,'#5ab8e8'],[1,'#2a5a9a']]); if(!dim) paStreaks(g,x+3.4,y+3.4,6.2,3.6,.2);
        R(g,'#d8d8d2',x+11.5,y+3.4,2.4,3.4); R(g,dim?'#7ab8ff':'#7cf06a',x+12.2,y+4,1,.8); R(g,rgba('#000000',.25),x+1,y+9,W-2,.5); R(g,rgba('#ffffff',.3),x+1,y+9.5,W-2,.3);
      [x,y,W,H]=A.r('pC'+t,16,y0,16,16); radial(g,x+8,y+8,11,[[0,dim?md:'#ffffff'],[.4,lt],[1,dk]]); if(!dim){ R(g,'#ffffff',x+4,y+6,8,4); R(g,mix(lt,'#ffffff',.5),x+3.6,y+5.6,8.8,.4); } R(g,'#2a2a34',x+12,y+2,2,1.2);
      [x,y,W,H]=A.r('pS'+t,32,y0,16,16); hfill(g,x,y,W,H,[[0,dk],[.5,md],[1,lt]]); vfill(g,x,y,W,H,[[0,rgba('#ffffff',.15)],[1,rgba('#000000',.25)]]); R(g,mix(md,'#ffffff',.3),x+3,y+5,7,.8); R(g,rgba('#000000',.2),x+3,y+5.8,7,.4); for(let k=0;k<4;k++) R(g,rgba('#000000',.2),x+11,y+8+k*1.2,3,.4);
      [x,y,W,H]=A.r('pM'+t,48,y0,16,16); vfill(g,x,y,W,H,[[0,mix(lt,'#ffffff',dim?0:.6)],[1,mix(md,'#ffffff',dim?0:.3)]]); for(let k=0;k<3;k++){ g.strokeStyle=rgba('#000000',.08); g.lineWidth=.5; g.beginPath(); g.moveTo(x,y+4+k*4); g.quadraticCurveTo(x+8,y+2+k*4,x+16,y+5+k*4); g.stroke(); } R(g,rgba('#000000',.2),x,y+H-1,W,1);
      [x,y,W,H]=A.r('pP'+t,64,y0,16,16); radial(g,x+7,y+6,10,[[0,dim?md:'#ffffff'],[1,dim?dk:mix(md,'#ffffff',.4)]]); g.strokeStyle=rgba('#000000',.12); g.lineWidth=.5; g.beginPath(); g.moveTo(x+2,y+11); g.quadraticCurveTo(x+8,y+9,x+14,y+12); g.stroke();
      [x,y,W,H]=A.r('pK'+t,80,y0,16,16); vfill(g,x,y,W,H,[[0,mix(bl,'#ffffff',dim?0:.25)],[1,mix(bl,'#000000',.35)]]); paWeave(g,x,y,W,H,'#000000',.12,1); R(g,rgba('#ffffff',dim?.1:.5),x,y+3,W,.8); R(g,rgba('#ffffff',dim?.1:.5),x,y+12,W,.8); });
    let [x,y,W,H]=A.r('blind',0,48,16,16); for(let k=0;k<16;k++) vfill(g,x,y+k,W,1,[[0,'#f8f0dc'],[1,'#d8ccb0']]); radial(g,x+8,y+8,10,[[0,rgba('#fff0c0',.5)],[1,rgba('#fff0c0',0)]]); R(g,'#a89a80',x,y+H-1.4,W,1.4); ell(g,x+8,y+H-2.6,1,1,'#8a7a60');
    const vm=(n,x0,c)=>{ const [x,y,W,H]=A.r(n,x0,0,16,32); vfill(g,x,y,W,H,[[0,mix(c,'#ffffff',.15)],[1,mix(c,'#000000',.25)]]); R(g,'#e8f4ff',x+1.5,y+3,W-3,17); const r=rng(x0);
      for(let j=0;j<4;j++){ R(g,'#b8c4d0',x+1.5,y+7.2+j*4.2,W-3,.5); for(let k=0;k<4;k++){ const cc=['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#f28a3a','#ffffff'][(r()*6)|0]; hfill(g,x+2.2+k*3,y+3.6+j*4.2,2.2,3.4,[[0,mix(cc,'#000000',.3)],[.4,mix(cc,'#ffffff',.3)],[1,mix(cc,'#000000',.3)]]); R(g,'#2a2a34',x+2.6+k*3,y+7.4+j*4.2,1.4,.5); } }
      paStreaks(g,x+1.5,y+3,W-3,17,.15); R(g,'#ffffff',x+1.5,y+.6,W-3,1.8); text(g,n==='vmR'?'GENKI':'AQUA',x+3,y+.8,c,.35); for(let k=0;k<8;k++) R(g,k%2?'#f2c230':'#7cf06a',x+2.2+k*1.5,y+21,1,.8);
      R(g,'#1a1a22',x+2,y+23,6,4); R(g,'#f2c230',x+9,y+23,5,1.4); R(g,'#2a2a30',x+3,y+28.5,W-6,2.4); R(g,'#0a0a0e',x+3.5,y+29,W-7,1.4); };
    vm('vmR',96,'#d63a2c'); vm('vmB',112,'#2a6ad8');
    [x,y,W,H]=A.r('neon',0,64,64,16); R(g,'#101018',x,y,W,H); radial(g,x+32,y+8,30,[[0,rgba(CY,.25)],[1,rgba(CY,0)]]);
    for(const [dx,dy,a] of [[0,0,.5],[.4,.4,.5]]) text(g,'CAPSULES',x+6+dx,y+4+dy,rgba(CY,a),1.1); text(g,'CAPSULES',x+6,y+4,'#d8ffff',1.1); glyphs(g,x+48,y+3,2,5,'#ff4fae',9,true); glyphs(g,x+3,y+12.5,10,4,rgba('#ff9ad0',.9),5,false);
    [x,y,W,H]=A.r('led',64,64,8,4); vfill(g,x,y,W,H,[[0,'#e8ffff'],[.5,CY],[1,'#1a8a9a']]);
    [x,y,W,H]=A.r('down',72,64,8,8); radial(g,x+4,y+4,4,[[0,'#ffffff'],[.6,'#f0f4ff'],[1,'#b8c0d0']]);
    [x,y,W,H]=A.r('exit',80,64,16,6); R(g,'#1a8a4a',x,y,W,H); paText(g,'EXIT',x,y+.6,W,'#ffffff',1);
    [x,y,W,H]=A.r('tv',96,32,32,20); vfill(g,x,y,W,H,[[0,'#ff9a6a'],[.6,'#ffd0a0'],[1,'#3a3a6a']]); poly(g,[[x,y+H],[x+10,y+9],[x+18,y+H]],'#4a3a6a'); poly(g,[[x+12,y+H],[x+22,y+11],[x+32,y+H]],'#2a2a4a'); ell(g,x+24,y+6,3,3,'#fff4c0'); R(g,'#101018',x,y+H-4,W,4); glyphs(g,x+2,y+H-3.4,6,3,'#f2f2ee',3,false);
    [x,y,W,H]=A.r('shade',16,48,16,16); vfill(g,x,y,W,H,[[0,'#fff4d8'],[1,'#ffd090']]); for(let k=0;k<8;k++) R(g,rgba('#d8a060',.25),x+k*2,y,.5,H);
    [x,y,W,H]=A.r('panel',32,48,16,16); R(g,'#e8f4ff',x,y,W,H); R(g,'#c8d8e8',x,y,W,.6);
  },0,705);
  return {walls,A,S}; }

/* =========================== the King's casino: red, gold, mahogany, green felt =========================== */
function paCasinoKit(){ const RD='#8a1424', GD='#d4ad5a', GDk='#8a6420';
  const gildV=(g,x,y,w,h)=>hfill(g,x,y,w,h,[[0,GDk],[.35,'#fff0b8'],[.55,GD],[1,GDk]]), gildH=(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#fff0b8'],[.4,GD],[1,GDk]]);
  const walls={
    damask:paTex(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#7a1020'],[.5,'#640c18'],[1,'#4a0810']]);
      const med=(cx,cy,s)=>{ g.fillStyle=rgba('#9a1c30',.9); g.beginPath(); g.moveTo(cx,cy-13*s); g.bezierCurveTo(cx+9*s,cy-8*s,cx+9*s,cy+2*s,cx,cy+13*s); g.bezierCurveTo(cx-9*s,cy+2*s,cx-9*s,cy-8*s,cx,cy-13*s); g.fill();
        g.fillStyle=rgba('#4a0810',.8); g.beginPath(); g.ellipse(cx,cy,3.5*s,6*s,0,0,7); g.fill(); ell(g,cx,cy-1*s,1.6*s,2.4*s,rgba(GD,.85)); for(const d of [-1,1]){ g.strokeStyle=rgba('#b8304a',.8); g.lineWidth=.8*s; g.beginPath(); g.moveTo(cx,cy+6*s); g.quadraticCurveTo(cx+d*8*s,cy+8*s,cx+d*7*s,cy-2*s); g.stroke(); ell(g,cx+d*7*s,cy-2.5*s,1*s,1*s,rgba(GD,.7)); } };
      med(16,16,1); med(48,48,1); med(48,16,.55); med(16,48,.55); med(-16,48,1); med(80,16,1); med(48,-16,1); med(16,80,1);
      radial(g,32,6,40,[[0,rgba('#ffffff',.08)],[1,rgba('#ffffff',0)]]); },4,801),
    dado:paTex(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#4a2416'],[1,'#2a120a']]); for(let k=0;k<26;k++) R(g,rgba(k%2?'#000000':'#ffffff',.05),k*2.5,0,1,h);
      vfill(g,0,0,w,4,[[0,'#fff0b8'],[.5,GD],[1,GDk]]); R(g,'#1a0a04',0,4,w,1);
      R(g,'#1a0a04',6,10,52,46); vfill(g,7,11,50,44,[[0,'#6a3420'],[1,'#3a1a0e']]); poly(g,[[7,11],[57,11],[52,16],[12,16]],rgba('#ffffff',.18)); poly(g,[[7,11],[12,16],[12,50],[7,55]],rgba('#ffffff',.1)); poly(g,[[57,11],[57,55],[52,50],[52,16]],rgba('#000000',.25)); poly(g,[[7,55],[57,55],[52,50],[12,50]],rgba('#000000',.35));
      vfill(g,12,16,40,34,[[0,'#5a2c1a'],[1,'#3a1a0e']]); for(let k=0;k<12;k++) R(g,rgba('#000000',.12),14+k*3.2,16,.5,34); R(g,rgba(GD,.6),13,17,38,.4);
      vfill(g,0,58,w,6,[[0,'#2a120a'],[1,'#120604']]); R(g,GD,0,58,w,.6); },3,802),
    carpet:paTex(64,64,(g,w,h)=>{ R(g,'#7a1020',0,0,w,h); const r=rng(803); for(let i=0;i<400;i++) R(g,rgba(r()>.5?'#a01a30':'#5a0a16',.5),r()*w,r()*h,1,1);
      g.strokeStyle=rgba(GD,.85); g.lineWidth=1.2; for(let k=-2;k<=2;k++){ g.beginPath(); g.moveTo(k*32,0); g.lineTo(k*32+64,64); g.stroke(); g.beginPath(); g.moveTo(k*32+64,0); g.lineTo(k*32,64); g.stroke(); }
      for(const [x,y] of [[0,0],[64,0],[0,64],[64,64],[32,32]]){ poly(g,[[x,y-8],[x+8,y],[x,y+8],[x-8,y]],'#d4a83a'); poly(g,[[x,y-5],[x+5,y],[x,y+5],[x-5,y]],'#5a0a16'); ell(g,x,y,2,2,'#2a8a8a'); }
      for(const [x,y] of [[32,0],[0,32],[64,32],[32,64]]){ ell(g,x,y,4,4,'#3a1a5a'); ell(g,x,y,2.5,2.5,'#d4a83a'); for(let k=0;k<4;k++){ const a=k*Math.PI/2+Math.PI/4; ell(g,x+Math.cos(a)*6,y+Math.sin(a)*6,1.6,1.6,'#e8c860'); } }
      for(const [x,y] of [[16,16],[48,16],[16,48],[48,48]]){ for(let k=0;k<4;k++){ const a=k*Math.PI/2; g.fillStyle=rgba('#c8a040',.8); g.beginPath(); g.ellipse(x+Math.cos(a)*3.5,y+Math.sin(a)*3.5,3,1.2,a,0,7); g.fill(); } ell(g,x,y,1.4,1.4,'#2a8a8a'); } },6,803),
    ceil:paTex(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a2a34'],[1,'#1a1218']]); for(let k=0;k<5;k++) poly(g,[[k*16,0],[k*16+5,0],[k*16-11,64],[k*16-16,64]],rgba('#ffe8c0',.05)); radial(g,40,24,10,[[0,rgba('#fff0c0',.35)],[1,rgba('#fff0c0',0)]]); ell(g,40,24,1.2,1.2,'#fff8e0');
      gildH(g,0,0,w,2.4); gildV(g,0,0,2.4,h); R(g,'#1a0a04',0,2.4,w,.6); R(g,'#1a0a04',2.4,0,.6,h); },2,804)};
  const A=paAtlas(128,128,(g,w,h,A)=>{
    const lac=(n,x0,c)=>{ const [x,y,W,H]=A.r(n,x0,0,16,32); vfill(g,x,y,W,H,[[0,mix(c,'#ffffff',.25)],[.3,c],[1,mix(c,'#000000',.45)]]); hfill(g,x,y,2,H,[[0,'#5a6068'],[.5,'#f4f6f8'],[1,'#9aa0a8']]); hfill(g,x+W-2,y,2,H,[[0,'#9aa0a8'],[.5,'#f4f6f8'],[1,'#5a6068']]); poly(g,[[x+3,y],[x+7,y],[x+3,y+H]],rgba('#ffffff',.12)); };
    lac('lacR',0,'#a8142a'); lac('lacP',16,'#4a1a7a'); lac('lacB',32,'#145a7a');
    let [x,y,W,H]=A.r('door',48,0,16,24); paPanel(g,x,y,W,H,'#1a1a22',{hi:.2,lo:.3}); g.strokeStyle='#c8ccd2'; g.lineWidth=.6; g.strokeRect(x+1.5,y+1.5,W-3,H-3); poly(g,[[x+5,y+8],[x+6.5,y+5],[x+8,y+7],[x+9.5,y+5],[x+11,y+8]],GD); R(g,GD,x+5,y+8,6,1.2); ell(g,x+12.5,y+12,.8,.8,'#c8ccd2'); R(g,'#0a0a0e',x+3,y+17,10,4); vfill(g,x+3,y+17,10,1.2,[[0,'#c8ccd2'],[1,'#5a6068']]);
    [x,y,W,H]=A.r('deck',64,0,32,10); vfill(g,x,y,W,H,[[0,'#3a3a44'],[1,'#1a1a22']]); R(g,'#c8ccd2',x,y,W,.6); const bc=['#f5c542','#d63a2c','#2a9a5a','#2a6ad8','#ffffff'];
    for(let k=0;k<5;k++){ paRR(g,x+2+k*4.4,y+2.5,3.6,2.6,.8); g.fillStyle=mix(bc[k],'#000000',.3); g.fill(); paRR(g,x+2.2+k*4.4,y+2.6,3.2,2,.7); g.fillStyle=bc[k]; g.fill(); R(g,rgba('#ffffff',.5),x+2.6+k*4.4,y+2.8,2.4,.5); }
    paRR(g,x+24,y+2,6,4,1); g.fillStyle='#d63a2c'; g.fill(); text(g,'SPIN',x+24.6,y+3,'#ffffff',.33); R(g,'#0a0a0e',x+3,y+7,8,1); text(g,'BET MAX',x+13,y+7,'#f5c542',.3);
    [x,y,W,H]=A.r('chrome',96,0,16,16); vfill(g,x,y,W,H,[[0,'#f4f6f8'],[.35,'#9aa0a8'],[.5,'#e4e8ec'],[1,'#5a6068']]);
    [x,y,W,H]=A.r('gold',112,0,16,16); gildH(g,x,y,W,H);
    [x,y,W,H]=A.r('feltR',0,32,48,24); vfill(g,x,y,W,H,[[0,'#2a8a4a'],[1,'#1a6a3a']]); paWeave(g,x,y,W,H,'#000000',.08,1);
    g.strokeStyle='#f2ece0'; g.lineWidth=.35; const gx=x+8, gy=y+3, cw=3, ch=4.6; const reds=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
    for(let c=0;c<12;c++) for(let r_=0;r_<3;r_++){ const n=c*3+(3-r_); const cx=gx+c*cw, cy=gy+r_*ch; R(g,'#1e7a42',cx,cy,cw,ch); g.strokeRect(cx,cy,cw,ch); ell(g,cx+cw/2,cy+ch/2,1.25,1.25,reds.has(n)?'#c8202a':'#121014'); paText(g,String(n),cx,cy+1.6,cw,'#f2ece0',.22); }
    poly(g,[[gx,gy],[gx,gy+ch*3],[gx-4,gy+ch*1.5]],'#1e7a42'); g.beginPath(); g.moveTo(gx,gy); g.lineTo(gx-4,gy+ch*1.5); g.lineTo(gx,gy+ch*3); g.stroke(); text(g,'0',gx-2.6,gy+ch*1.5-1,'#f2ece0',.4);
    for(let k=0;k<3;k++){ g.strokeRect(gx+k*cw*4,gy+ch*3,cw*4,3.5); paText(g,['1ST 12','2ND 12','3RD 12'][k],gx+k*cw*4,gy+ch*3+1,cw*4,'#f2ece0',.3); }
    for(let k=0;k<6;k++){ g.strokeRect(gx+k*cw*2,gy+ch*3+3.5,cw*2,3.5); } poly(g,[[gx+cw*4+3,gy+ch*3+5.2],[gx+cw*4+4.4,gy+ch*3+4.2],[gx+cw*4+5.8,gy+ch*3+5.2],[gx+cw*4+4.4,gy+ch*3+6.2]],'#c8202a'); poly(g,[[gx+cw*6+3,gy+ch*3+5.2],[gx+cw*6+4.4,gy+ch*3+4.2],[gx+cw*6+5.8,gy+ch*3+5.2],[gx+cw*6+4.4,gy+ch*3+6.2]],'#121014');
    [x,y,W,H]=A.r('feltC',48,32,48,24); vfill(g,x,y,W,H,[[0,'#2a8a4a'],[1,'#1a6a3a']]); paWeave(g,x,y,W,H,'#000000',.08,1); g.strokeStyle='#f2ece0'; g.lineWidth=.4;
    g.strokeRect(x+2,y+2,W-4,H-4); g.strokeRect(x+4,y+4,W-8,H-8); text(g,'PASS LINE',x+14,y+2.4,'#f2ece0',.4); g.strokeRect(x+8,y+8,32,5); paText(g,'FIELD 2 3 4 9 10 11 12',x+8,y+9.6,32,'#f5c542',.25);
    R(g,'#c8202a',x+10,y+14.5,28,3.4); paText(g,'COME',x+10,y+15.3,28,'#f2ece0',.4); for(let k=0;k<6;k++){ g.strokeRect(x+6+k*6,y+18.5,5,2.6); paText(g,String([4,5,6,8,9,10][k]),x+6+k*6,y+19,5,'#f2ece0',.3); }
    [x,y,W,H]=A.r('feltBJ',96,32,32,32); vfill(g,x,y,W,H,[[0,'#2a8a4a'],[1,'#1a6a3a']]); paWeave(g,x,y,W,H,'#000000',.08,1); g.strokeStyle='#f2ece0'; g.lineWidth=.4;
    g.beginPath(); g.arc(x+16,y+8,17,.35,Math.PI-.35); g.stroke(); g.beginPath(); g.arc(x+16,y+8,12,.4,Math.PI-.4); g.stroke(); paText(g,'BLACKJACK PAYS 3 TO 2',x,y+12.4,W,'#f5c542',.25); paText(g,'DEALER STANDS ON 17',x,y+15.4,W,'#f2ece0',.22);
    for(let k=0;k<5;k++){ const a=.6+k*.48, cx=x+16+Math.cos(a)*14.5, cy=y+8+Math.sin(a)*14.5; g.save(); g.translate(cx,cy); g.rotate(a-Math.PI/2); g.strokeRect(-1.6,-2.2,3.2,4.4); g.restore(); } ell(g,x+16,y+4,4,1.5,rgba('#000000',.25));
    [x,y,W,H]=A.r('feltP',96,64,32,32); vfill(g,x,y,W,H,[[0,'#1e7a8a'],[1,'#145a6a']]); paWeave(g,x,y,W,H,'#000000',.08,1); g.strokeStyle='#d4ad5a'; g.lineWidth=.5; g.beginPath(); g.arc(x+16,y+16,11,0,7); g.stroke(); paText(g,'THE KING',x,y+14.5,W,'#d4ad5a',.45); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; g.strokeRect(x+16+Math.cos(a)*13.5-1.2,y+16+Math.sin(a)*13.5-1.2,2.4,2.4); }
    [x,y,W,H]=A.r('rail',0,56,16,16); vfill(g,x,y,W,H,[[0,'#3a3034'],[.3,'#6a5a60'],[.5,'#2a2024'],[1,'#0e0a0c']]); for(let k=1;k<4;k++) R(g,rgba('#000000',.35),x+k*4,y,.3,H);
    [x,y,W,H]=A.r('mahog',16,56,32,24); vfill(g,x,y,W,H,[[0,'#5a2c1a'],[1,'#2a120a']]); for(let k=0;k<2;k++){ const px=x+1.5+k*15, pw=13.5; R(g,'#1a0a04',px,y+3,pw,H-7); vfill(g,px+.6,y+3.6,pw-1.2,H-8.2,[[0,'#7a3e24'],[1,'#3a1a0e']]); R(g,rgba('#ffffff',.2),px+.6,y+3.6,pw-1.2,.5); R(g,rgba('#000000',.3),px+.6,y+H-5.2,pw-1.2,.6); R(g,rgba(GD,.7),px+2,y+5,pw-4,.3); R(g,rgba(GD,.7),px+2,y+H-6.5,pw-4,.3); }
      gildH(g,x,y,W,1.6); R(g,'#120604',x,y+H-3,W,3); R(g,GD,x,y+H-3,W,.5);
    [x,y,W,H]=A.r('woodTop',48,56,32,8); vfill(g,x,y,W,H,[[0,'#7a3a20'],[.5,'#4a2010'],[1,'#6a3018']]); for(let k=0;k<6;k++) R(g,rgba('#ffffff',.08),x,y+k*1.3,W,.3); poly(g,[[x+6,y],[x+10,y],[x+8,y+H],[x+4,y+H]],rgba('#ffffff',.12));
    [x,y,W,H]=A.r('stool',80,56,16,16); radial(g,x+7,y+7,9,[[0,'#d8304a'],[1,'#6a0a18']]); for(const [a,b] of [[5,5],[11,5],[8,8],[5,11],[11,11]]){ ell(g,x+a,y+b,.6,.6,'#3a0610'); ell(g,x+a-.2,y+b-.2,.25,.25,GD); }
    [x,y,W,H]=A.r('chips',0,72,16,8); for(let k=0;k<8;k++){ const c=['#c8202a','#121014','#2a6ad8','#2a9a5a'][k%4]; R(g,c,x,y+k,W,1); for(let j=0;j<4;j++) R(g,'#f2ece0',x+1+j*4+(k%2)*2,y+k,1.2,1); R(g,rgba('#000000',.3),x,y+k+.8,W,.2); }
    [x,y,W,H]=A.r('chipTop',16,80,8,8); ell(g,x+4,y+4,3.9,3.9,'#c8202a'); for(let k=0;k<6;k++){ const a=k/6*Math.PI*2; ell(g,x+4+Math.cos(a)*3.1,y+4+Math.sin(a)*3.1,.6,.6,'#f2ece0'); } ell(g,x+4,y+4,2,2,'#f2ece0'); ell(g,x+4,y+4,1.4,1.4,'#c8202a');
    [x,y,W,H]=A.r('cardB',24,80,8,12); R(g,'#f2ece0',x,y,W,H); R(g,'#a8142a',x+.6,y+.6,W-1.2,H-1.2); for(let k=0;k<6;k++) R(g,rgba(GD,.6),x+1+k*1.1,y+1,.3,H-2);
    [x,y,W,H]=A.r('cardF',32,80,8,12); R(g,'#fbf8f0',x,y,W,H); text(g,'A',x+.8,y+.8,'#121014',.5); ell(g,x+4,y+6,1.6,1.6,'#121014'); poly(g,[[x+4,y+6],[x+3,y+8.6],[x+5,y+8.6]],'#121014');
    [x,y,W,H]=A.r('cardK',40,80,8,12); R(g,'#fbf8f0',x,y,W,H); text(g,'K',x+.8,y+.8,'#c8202a',.5); R(g,'#c8202a',x+2,y+4,4,5); R(g,GD,x+2.5,y+4,3,1); ell(g,x+4,y+6.4,1,1,'#f2d0a0');
    [x,y,W,H]=A.r('die',48,80,8,8); R(g,'#fbf8f0',x,y,W,H); for(const [a,b] of [[2,2],[6,2],[4,4],[2,6],[6,6]]) ell(g,x+a,y+b,.8,.8,'#c8202a'); R(g,rgba('#000000',.15),x,y+H-.6,W,.6);
    [x,y,W,H]=A.r('boards',0,96,32,16); for(let k=0;k<8;k++) vfill(g,x,y+k*2,W,2,[[0,['#5a3018','#4a2814','#6a3a1e','#523016'][k%4]],[1,'#2a1408']]); for(let k=0;k<8;k++) R(g,'#1a0a04',x+((k*11)%W),y+k*2,.4,2);
    [x,y,W,H]=A.r('stageF',32,96,32,16); vfill(g,x,y,W,H,[[0,'#2a1a1e'],[1,'#0a0608']]); gildH(g,x,y,W,1.5); gildH(g,x,y+H-1.5,W,1.5); for(let k=0;k<4;k++){ g.strokeStyle=rgba(GD,.6); g.lineWidth=.4; g.strokeRect(x+1.5+k*7.6,y+3.5,6.4,H-7); }
    [x,y,W,H]=A.r('velvet',64,96,32,32); for(let k=0;k<W;k++){ const v=.5+.5*Math.sin(k*.78); R(g,mix('#7a0a18','#e03a4a',v*.75),x+k,y,1,H); } vfill(g,x,y,W,H,[[0,rgba('#000000',0)],[.8,rgba('#000000',.1)],[1,rgba('#000000',.4)]]); gildH(g,x,y+H-2,W,2);
    [x,y,W,H]=A.r('poster',0,112,16,16); R(g,'#1a0a0e',x,y,W,H); gildV(g,x,y,.8,H); gildV(g,x+W-.8,y,.8,H); gildH(g,x,y,W,.8); gildH(g,x,y+H-.8,W,.8); vfill(g,x+1.5,y+1.5,W-3,H-3,[[0,'#f5c542'],[1,'#c8302a']]);
      g.fillStyle='#1a0a0e'; g.beginPath(); g.ellipse(x+8,y+7,2.4,2.8,0,0,7); g.fill(); g.beginPath(); g.ellipse(x+8.6,y+4.6,2.8,1.4,-.3,0,7); g.fill(); poly(g,[[x+3.5,y+14.5],[x+5,y+9.6],[x+11,y+9.6],[x+12.5,y+14.5]],'#1a0a0e'); R(g,'#f2ece0',x+7.5,y+9.8,1,3);
      paText(g,'THE KING',x,y+2,W,'#1a0a0e',.35); paText(g,'TONIGHT',x,y+13.2,W,'#f2ece0',.3);
    [x,y,W,H]=A.r('speaker',16,112,16,16); paPanel(g,x,y,W,H,'#1a1a1e'); for(const [cy,r] of [[5,3],[11.5,4.4]]){ ell(g,x+8,y+cy,r+.6,r+.6,'#0a0a0c'); radial(g,x+7.4,y+cy-.6,r,[[0,'#4a4a52'],[1,'#121216']]); ell(g,x+8,y+cy,r*.3,r*.3,'#2a2a30'); }
    [x,y,W,H]=A.r('dark',32,112,16,16); paPanel(g,x,y,W,H,'#1a1418',{hi:.2,lo:.3});
    for(let k=0;k<4;k++){ const c=['#5a2a0e','#1e5a2a','#c8c0a0','#3a0a2a'][k], [bx_,by,BW,BH]=A.r('b'+k,96+k*8,96,8,32);
      hfill(g,bx_,by,BW,BH,[[0,mix(c,'#000000',.4)],[.3,mix(c,'#ffffff',.35)],[.45,c],[1,mix(c,'#000000',.5)]]); R(g,'#f2ece0',bx_+1,by+18,6,7); R(g,GD,bx_+1,by+18,6,1); R(g,'#121014',bx_+2,by+21,4,.6); R(g,'#c8202a',bx_+1,by+4,6,2); }
    [x,y,W,H]=A.r('glass',48,112,8,8); hfill(g,x,y,W,H,[[0,'#a8c0c8'],[.3,'#f4ffff'],[.5,'#c8e0e8'],[1,'#7a9098']]); R(g,'#c8902a',x,y+4,W,4);
    [x,y,W,H]=A.r('brass',56,112,8,8); vfill(g,x,y,W,H,[[0,'#fff0b8'],[.4,'#c8983a'],[1,'#6a4a10']]);
  },3,805);
  const S=paAtlas(128,64,(g,w,h,A)=>{
    const sym=(cx,cy,k)=>{ if(k===0){ text(g,'7',cx-1.5,cy-2.5,'#d63a2c',1); } else if(k===1){ ell(g,cx-1.2,cy+1,1.3,1.3,'#c8202a'); ell(g,cx+1.2,cy+1.2,1.3,1.3,'#c8202a'); g.strokeStyle='#2a8a3a'; g.lineWidth=.5; g.beginPath(); g.moveTo(cx-1,cy); g.quadraticCurveTo(cx,cy-3,cx+1.6,cy-2.6); g.stroke(); }
      else if(k===2){ R(g,'#121014',cx-2.6,cy-1.2,5.2,2.4); text(g,'BAR',cx-2.4,cy-.9,'#f2ece0',.4); } else if(k===3){ poly(g,[[cx,cy-2.6],[cx+2.4,cy],[cx,cy+2.6],[cx-2.4,cy]],'#29a8e6'); poly(g,[[cx,cy-2.6],[cx+2.4,cy],[cx,cy]],'#a8f0ff'); } else { poly(g,[[cx-2.4,cy+1.6],[cx-2.4,cy-1.6],[cx-1.2,cy],[cx,cy-2.4],[cx+1.2,cy],[cx+2.4,cy-1.6],[cx+2.4,cy+1.6]],'#f5c542'); } };
    for(let v=0;v<3;v++){ const [x,y,W,H]=A.r('reel'+v,v*16,0,16,12); R(g,'#1a1a22',x,y,W,H); for(let k=0;k<3;k++){ vfill(g,x+1+k*4.8,y+1,4.4,H-2,[[0,'#9a968e'],[.3,'#ffffff'],[.7,'#ffffff'],[1,'#9a968e']]); sym(x+3.2+k*4.8,y+H/2,(v*2+k*3+1)%5); } R(g,rgba('#d63a2c',.8),x,y+H/2-.2,W,.4); paStreaks(g,x,y,W,H,.15); }
    const topper=(n,y0,word,c)=>{ const [x,y,W,H]=A.r(n,48,y0,32,10); vfill(g,x,y,W,H,[[0,mix(c,'#ffffff',.2)],[1,mix(c,'#000000',.3)]]); for(let k=0;k<15;k++){ ell(g,x+1.2+k*2.1,y+.9,.55,.55,'#fff8d0'); ell(g,x+1.2+k*2.1,y+H-.9,.55,.55,'#fff8d0'); }
      text(g,word,x+(W-textW(word,.9))/2+.3,y+2.8,'#000000',.9); text(g,word,x+(W-textW(word,.9))/2,y+2.5,'#fff8e0',.9); };
    topper('top0',0,"KING 7S",'#c8202a'); topper('top1',10,'DIAMONDS','#2a6ad8'); topper('top2',20,'JACKPOT','#7a2ac8');
    let [x,y,W,H]=A.r('belly',80,0,16,16); vfill(g,x,y,W,H,[[0,'#3a0a4a'],[1,'#1a0420']]); radial(g,x+8,y+8,8,[[0,rgba('#f5c542',.5)],[1,rgba('#f5c542',0)]]); poly(g,[[x+3,y+10],[x+3,y+5],[x+5.5,y+7.5],[x+8,y+3.5],[x+10.5,y+7.5],[x+13,y+5],[x+13,y+10]],'#f5c542'); paText(g,'THE KING',x,y+11.5,W,'#fff0c0',.35);
    [x,y,W,H]=A.r('marquee',0,32,64,16); R(g,'#1a0a0e',x,y,W,H); vfill(g,x+1,y+1,W-2,H-2,[[0,'#3a0a14'],[1,'#1a0408']]); for(let k=0;k<30;k++){ ell(g,x+2+k*2.07,y+1.3,.7,.7,'#fff4c0'); ell(g,x+2+k*2.07,y+H-1.3,.7,.7,'#fff4c0'); }
      radial(g,x+32,y+8,24,[[0,rgba('#f5c542',.3)],[1,rgba('#f5c542',0)]]); text(g,'THE KING',x+7.3,y+4.3,'#6a1a08',1.6); text(g,'THE KING',x+7,y+4,'#ffe890',1.6);
    [x,y,W,H]=A.r('backbar',64,32,32,16); vfill(g,x,y,W,H,[[0,'#ffd890'],[1,'#c87a2a']]); radial(g,x+16,y+8,16,[[0,rgba('#ffffff',.4)],[1,rgba('#ffffff',0)]]);
    [x,y,W,H]=A.r('shade',96,32,16,16); vfill(g,x,y,W,H,[[0,'#fff4d0'],[1,'#f0a850']]); for(let k=0;k<8;k++) R(g,rgba('#b87830',.3),x+k*2,y,.5,H);
    [x,y,W,H]=A.r('crystal',112,32,8,8); radial(g,x+4,y+4,4,[[0,'#ffffff'],[1,'#fff0c8']]);
    [x,y,W,H]=A.r('foot',120,32,8,8); radial(g,x+4,y+4,4.5,[[0,'#ffffff'],[.6,'#ffe090'],[1,'#c88a2a']]);
    [x,y,W,H]=A.r('bulb',80,16,8,8); radial(g,x+4,y+4,4,[[0,'#ffffff'],[.7,'#fff0b0'],[1,'#e8b850']]);
    [x,y,W,H]=A.r('cashier',0,48,48,12); R(g,'#1a0a0e',x,y,W,H); R(g,GD,x+1,y+1,W-2,.5); R(g,GD,x+1,y+H-1.5,W-2,.5); paText(g,"THE KING'S",x,y+3.2,W,'#ffe890',.9);
  },0,806);
  return {walls,A,S}; }

/* =========================== Copacabana pool deck: white and black wave stones, turquoise water, green and yellow =========================== */
function paPoolKit(){ const GR='#2a9a5a', YL='#f2c230';
  const walls={
    deck:paTex(64,64,(g,w,h)=>{ const r=rng(901); for(let y=0;y<h;y+=2) for(let x=(y/2%2);x<w;x+=2){ const v=Math.sin(x/w*Math.PI*4+Math.sin(y/h*Math.PI*2)*2.2), blk=v>.45;
        const c=blk?mix('#24242a','#3a3a44',r()):mix('#f2ece0','#fffaf0',r()); R(g,c,x+.15,y+.15,1.75,1.75); R(g,rgba('#ffffff',blk?.08:.4),x+.15,y+.15,1.75,.4); R(g,rgba('#000000',.18),x+.15,y+1.5,1.75,.4); }
      g.globalCompositeOperation='destination-over'; R(g,'#b8b0a0',0,0,w,h); g.globalCompositeOperation='source-over'; radial(g,32,32,48,[[0,rgba('#fff4d8',.12)],[1,rgba('#000000',.06)]]); },0,901),
    wall:paTex(64,64,(g,w,h)=>{ R(g,'#c8c4b8',0,0,w,h); for(let j=0;j<4;j++) for(let k=0;k<4;k++){ const x=k*16+.5, y=j*16+.5; vfill(g,x,y,15,15,[[0,'#ffffff'],[1,'#e2ddd2']]); R(g,rgba('#ffffff',.8),x,y,15,.6); R(g,rgba('#000000',.08),x,y+14.2,15,.8);
        poly(g,[[x+2,y+2],[x+6,y+2],[x+2,y+8]],rgba('#ffffff',.5)); }
      vfill(g,0,0,w,6,[[0,'#3ab06a'],[1,'#1e7a46']]); R(g,'#ffffff',0,6,w,.6); for(let k=0;k<8;k++) ell(g,4+k*8,3,1.4,1.4,YL); },2,902),
    end:paTex(64,64,(g,w,h)=>{ R(g,'#e8e2d6',0,0,w,h); for(let j=0;j<8;j++) for(let k=0;k<8;k++){ const x=k*8+.4, y=j*8+.4, az=(j+k)%2; vfill(g,x,y,7.2,7.2,az?[[0,'#3ab06a'],[1,'#1e7a46']]:[[0,'#ffffff'],[1,'#e8e2d6']]);
        if(!az){ g.strokeStyle=rgba('#1e7a46',.7); g.lineWidth=.5; g.beginPath(); g.arc(x+3.6,y+3.6,2.2,0,7); g.stroke(); ell(g,x+3.6,y+3.6,.9,.9,YL); } else R(g,rgba('#ffffff',.25),x,y,7.2,.6); } },2,903)};
  const A=paAtlas(128,128,(g,w,h,A)=>{
    let [x,y,W,H]=A.r('coping',0,0,32,8); vfill(g,x,y,W,H,[[0,'#fffaf0'],[.3,'#f2e8d4'],[1,'#c8bca4']]); const r=rng(904); for(let i=0;i<40;i++) ell(g,x+r()*W,y+r()*H,.6+r(),.3,rgba('#a89878',.4)); for(let k=0;k<4;k++) R(g,'#a89878',x+k*8,y,.4,H);
    [x,y,W,H]=A.r('mosaic',32,0,32,8); for(let j=0;j<4;j++) for(let k=0;k<16;k++){ const c=['#1a8ab0','#2aa8c8','#38c0d8','#1e98b8'][(j*3+k*7)%4]; R(g,'#e8f4f4',x+k*2,y+j*2,2,2); R(g,c,x+k*2+.2,y+j*2+.2,1.6,1.6); R(g,rgba('#ffffff',.4),x+k*2+.2,y+j*2+.2,1.6,.4); }
    [x,y,W,H]=A.r('tileW',64,0,16,16); R(g,'#c8c4b8',x,y,W,H); for(let j=0;j<2;j++) for(let k=0;k<2;k++){ vfill(g,x+k*8+.4,y+j*8+.4,7.2,7.2,[[0,'#ffffff'],[1,'#e2ddd2']]); R(g,rgba('#ffffff',.8),x+k*8+.4,y+j*8+.4,7.2,.4); }
    [x,y,W,H]=A.r('chrome',80,0,16,16); vfill(g,x,y,W,H,[[0,'#ffffff'],[.35,'#a8b0b8'],[.5,'#eef2f4'],[1,'#6a7078']]);
    [x,y,W,H]=A.r('white',96,0,16,16); paPanel(g,x,y,W,H,'#f4f2ec',{hi:.08,lo:.16});
    [x,y,W,H]=A.r('green',112,0,16,16); paPanel(g,x,y,W,H,GR,{hi:.2,lo:.25});
    const cush=(n,x0,y0,a,b)=>{ const [x,y,W,H]=A.r(n,x0,y0,32,16); for(let k=0;k<8;k++) vfill(g,x+k*4,y,4,H,[[0,mix(k%2?a:b,'#ffffff',.25)],[.5,k%2?a:b],[1,mix(k%2?a:b,'#000000',.2)]]); for(let k=1;k<4;k++) R(g,rgba('#000000',.15),x+k*8,y,.5,H);
      for(let k=0;k<4;k++){ ell(g,x+4+k*8,y+8,.8,.8,rgba('#000000',.35)); radial(g,x+4+k*8,y+6,5,[[0,rgba('#ffffff',.2)],[1,rgba('#ffffff',0)]]); } R(g,'#ffffff',x,y,W,.7); R(g,'#ffffff',x,y+H-.7,W,.7); };
    cush('cushY',0,8,YL,'#fffaf0'); cush('cushT',32,8,'#2ac0d0','#fffaf0');
    [x,y,W,H]=A.r('slats',64,16,32,16); R(g,'#3a3a40',x,y,W,H); for(let k=0;k<8;k++) vfill(g,x+k*4+.4,y,3.2,H,[[0,'#ffffff'],[1,'#d8d4cc']]);
    const towel=(n,x0,y0,a,b)=>{ const [x,y,W,H]=A.r(n,x0,y0,16,16); for(let k=0;k<4;k++) R(g,k%2?a:b,x,y+k*4,W,4); paWeave(g,x,y,W,H,'#000000',.15,1); vfill(g,x,y,W,H,[[0,rgba('#ffffff',.2)],[1,rgba('#000000',.2)]]); for(let k=0;k<8;k++) R(g,rgba('#ffffff',.6),x+k*2,y+H-.8,.6,.8); };
    towel('towel',96,16,'#ff6a8a','#ffb03a'); towel('towel2',112,16,'#2a6ad8','#f2ece0');
    const umb=(n,x0,y0,a,b)=>{ const [x,y,W,H]=A.r(n,x0,y0,32,16); for(let k=0;k<8;k++) hfill(g,x+k*4,y,4,H,[[0,mix(k%2?a:b,'#000000',.15)],[.5,mix(k%2?a:b,'#ffffff',.15)],[1,mix(k%2?a:b,'#000000',.15)]]);
      vfill(g,x,y,W,H,[[0,rgba('#ffffff',.25)],[.6,rgba('#ffffff',0)],[1,rgba('#000000',.25)]]); for(let k=0;k<8;k++){ g.fillStyle=mix(k%2?a:b,'#000000',.2); g.beginPath(); g.arc(x+k*4+2,y+H-1.6,2,0,Math.PI); g.fill(); } };
    umb('umbR',0,24,'#e0473a','#fffaf0'); umb('umbY',32,24,YL,GR);
    [x,y,W,H]=A.r('trunk',64,32,16,16); for(let k=0;k<8;k++) vfill(g,x,y+k*2,W,2,[[0,'#9a7a52'],[.6,'#7a5a3a'],[1,'#4a3420']]); for(let k=0;k<6;k++) R(g,rgba('#3a2a18',.5),x+k*2.6,y,.5,H); hfill(g,x,y,W,H,[[0,rgba('#000000',.3)],[.4,rgba('#ffffff',.1)],[1,rgba('#000000',.3)]]);
    [x,y,W,H]=A.r('pot',80,32,16,16); vfill(g,x,y,W,H,[[0,'#e07a4a'],[.2,'#c8643a'],[1,'#8a3a1e']]); R(g,'#f0a070',x,y,W,1.6); R(g,'#7a3018',x,y+1.6,W,.6); for(let k=0;k<4;k++) R(g,'#f2ece0',x+1+k*4,y+5,2,2); R(g,'#3a2a1a',x,y,W,.6);
    [x,y,W,H]=A.r('bamboo',96,32,32,16); for(let k=0;k<8;k++){ hfill(g,x+k*4,y,4,H,[[0,'#8a6a2a'],[.35,'#e8cc80'],[.6,'#c8a050'],[1,'#6a4a1a']]); for(const j of [3,9,14]) R(g,'#6a4a1a',x+k*4,y+j+((k*3)%4)*.5,4,.7); }
    [x,y,W,H]=A.r('woodTop',0,40,32,8); for(let k=0;k<4;k++){ vfill(g,x,y+k*2,W,2,[[0,['#dcae70','#c89a5c','#d4a468','#c0925a'][k]],[1,'#9a6a36']]); R(g,'#6a4420',x,y+k*2+1.8,W,.2); for(let j=0;j<5;j++){ g.strokeStyle=rgba('#7a5028',.35); g.lineWidth=.15; g.beginPath(); const yy=y+k*2+.4+j*.3; g.moveTo(x,yy); for(let t=0;t<=8;t++) g.lineTo(x+t*4,yy+Math.sin(t*1.3+k*2+j)*.12); g.stroke(); } }
      for(let k=0;k<3;k++) ell(g,x+5+k*11,y+1+((k*3)%4)*2,1,.4,'#7a4a20'); R(g,rgba('#ffffff',.5),x,y,W,.3); poly(g,[[x+8,y],[x+12,y],[x+9,y+H],[x+5,y+H]],rgba('#ffffff',.1));
    [x,y,W,H]=A.r('thatch',32,40,32,16); vfill(g,x,y,W,H,[[0,'#e2c070'],[1,'#a8803a']]); for(let i=0;i<120;i++){ const sx=x+r()*W, sy=y+r()*H; R(g,rgba(r()>.5?'#fff0b0':'#7a5a2a',.6),sx,sy,.4,2+r()*3); }
    [x,y,W,H]=A.r('mask',64,48,16,24); vfill(g,x,y,W,H,[[0,'#8a5a30'],[1,'#4a2a14']]); for(let k=0;k<12;k++) R(g,rgba('#2a1408',.3),x+k*1.3,y,.3,H);
      R(g,'#2a1408',x+2,y+4,12,1); for(const dx of [4,10]){ ell(g,x+dx+.3,y+8.4,2.2,1.8,'#2a1408'); ell(g,x+dx,y+8,2,1.6,'#f2ece0'); ell(g,x+dx,y+8,.9,.9,'#1a0a04'); } poly(g,[[x+8,y+9],[x+6.5,y+14],[x+9.5,y+14]],'#6a3a1a');
      R(g,'#2a1408',x+3,y+16,10,4); for(let k=0;k<5;k++) R(g,'#f2ece0',x+3.5+k*2,y+16.4,1.2,1.4); R(g,'#c8302a',x+2,y+1,12,1.2); R(g,'#2a9a5a',x+2,y+22,12,1);
    [x,y,W,H]=A.r('sign',80,48,48,12); vfill(g,x,y,W,H,[[0,'#a8783e'],[1,'#6a4420']]); for(let k=0;k<5;k++) R(g,rgba('#3a2010',.4),x,y+k*2.6,W,.3); text(g,'COPACABANA',x+4.5,y+3.4,'#2a1408',.95); text(g,'COPACABANA',x+4,y+3,YL,.95);
    [x,y,W,H]=A.r('staves',0,48,32,16); for(let k=0;k<16;k++) hfill(g,x+k*2,y,2,H,[[0,'#8a5a30'],[.5,'#c8925a'],[1,'#7a4a24']]); for(const j of [2,13]){ vfill(g,x,y+j,W,1.4,[[0,'#c8ccd2'],[1,'#5a6068']]); }
    [x,y,W,H]=A.r('buoy',32,56,16,8); for(let k=0;k<4;k++) vfill(g,x+k*4,y,4,H,[[0,k%2?'#ffffff':'#e0302a'],[.5,mix(k%2?'#ffffff':'#e0302a','#ffffff',.3)],[1,mix(k%2?'#ffffff':'#e0302a','#000000',.3)]]);
    [x,y,W,H]=A.r('flam',48,56,16,8); vfill(g,x,y,W,H,[[0,'#ffb0d0'],[.5,'#ff7ab0'],[1,'#c8487a']]);
    [x,y,W,H]=A.r('vinyl',80,60,16,16); ell(g,x+8,y+8,7.9,7.9,'#0e0e10'); for(let k=2;k<8;k++){ g.strokeStyle=rgba('#ffffff',.06); g.lineWidth=.3; g.beginPath(); g.arc(x+8,y+8,k,0,7); g.stroke(); } ell(g,x+8,y+8,2.4,2.4,'#ff3fa4'); ell(g,x+8,y+8,.4,.4,'#ffffff'); poly(g,[[x+8,y+8],[x+15,y+3],[x+15,y+5]],rgba('#ffffff',.12));
    [x,y,W,H]=A.r('mixer',96,60,32,12); paPanel(g,x,y,W,H,'#2a2a30'); for(let k=0;k<4;k++){ for(let j=0;j<3;j++) paBtn(g,x+4+k*7,y+2.2+j*2.6,.9,'#c8ccd2'); R(g,'#0a0a0c',x+3.4+k*7,y+8.6,1.2,2.6); R(g,'#e8e8e8',x+3+k*7,y+9.2+(k%2),2,.7); }
    [x,y,W,H]=A.r('speaker',0,64,16,16); paPanel(g,x,y,W,H,'#1a1a1e'); ell(g,x+8,y+8,6.4,6.4,'#0a0a0c'); radial(g,x+7.4,y+7.4,6,[[0,'#4a4a52'],[1,'#121216']]); ell(g,x+8,y+8,2,2,'#2a2a30'); ell(g,x+7.5,y+7.5,.8,.8,'#5a5a64');
    [x,y,W,H]=A.r('dark',16,64,16,16); paPanel(g,x,y,W,H,'#1e1e24',{hi:.2,lo:.3});
    const surf=(n,x0,a,b)=>{ const [x,y,W,H]=A.r(n,x0,80,8,32); hfill(g,x,y,W,H,[[0,mix(a,'#000000',.25)],[.4,mix(a,'#ffffff',.3)],[1,mix(a,'#000000',.3)]]); R(g,b,x+3.4,y,1.2,H); R(g,'#1a1a1e',x,y+H-6,W,.8); };
    surf('surf1',0,'#fffaf0','#e0473a'); surf('surf2',8,YL,GR);
    const glass=(n,x0,c)=>{ const [x,y,W,H]=A.r(n,x0,80,8,8); hfill(g,x,y,W,H,[[0,mix(c,'#000000',.2)],[.35,mix(c,'#ffffff',.5)],[1,mix(c,'#000000',.2)]]); R(g,'#ffffff',x,y,W,1); };
    glass('glass',16,'#ff8a3a'); glass('glass2',24,'#2ac0e0');
    [x,y,W,H]=A.r('pine',32,80,8,8); vfill(g,x,y,W,H,[[0,'#f2c230'],[1,'#a87a18']]); for(let k=0;k<4;k++) for(let j=0;j<4;j++) R(g,rgba('#6a4a10',.5),x+k*2+(j%2),y+j*2,.5,.5);
    [x,y,W,H]=A.r('coco',40,80,8,8); radial(g,x+3,y+3,6,[[0,'#8a5a30'],[1,'#3a2410']]); for(let k=0;k<10;k++) R(g,rgba('#c8a070',.4),x+r()*W,y+r()*H,.3,1);
    for(let k=0;k<4;k++){ const c=['#5a2a0e','#1e6a2a','#e8e0c0','#c86a1a'][k], [bx_,by,BW,BH]=A.r('bt'+k,48+k*8,80,8,24); hfill(g,bx_,by,BW,BH,[[0,mix(c,'#000000',.4)],[.3,mix(c,'#ffffff',.35)],[.45,c],[1,mix(c,'#000000',.5)]]); R(g,'#fffaf0',bx_+1,by+12,6,6); R(g,GR,bx_+1,by+12,6,1); R(g,YL,bx_+1,by+3,6,1.6); }
    [x,y,W,H]=A.r('cooler',80,80,16,16); vfill(g,x,y,W,H,[[0,'#2a7ad8'],[1,'#1a4a9a']]); R(g,'#fffaf0',x,y,W,4); R(g,'#c8c4b8',x,y+4,W,.6); R(g,'#fffaf0',x+5,y+8,6,2);
    [x,y,W,H]=A.r('mag',96,80,16,12); vfill(g,x,y,W,H,[[0,'#2ac0d0'],[1,'#1a8a9a']]); R(g,'#fffaf0',x+1,y+1,14,2.4); ell(g,x+10,y+8,3,3,YL); text(g,'SOL',x+1.5,y+1.3,'#e0473a',.4);
    [x,y,W,H]=A.r('ball',112,80,16,16); for(let k=0;k<6;k++) R(g,['#e0473a','#fffaf0',YL,'#fffaf0','#2a6ad8','#fffaf0'][k],x+k*2.7,y,2.7,H); vfill(g,x,y,W,H,[[0,rgba('#ffffff',.3)],[1,rgba('#000000',.3)]]);
    [x,y,W,H]=A.r('lifesign',16,96,32,8); R(g,'#e0302a',x,y,W,H); paText(g,'LIFEGUARD',x,y+2,W,'#ffffff',.6);
    [x,y,W,H]=A.r('red',48,104,16,16); paPanel(g,x,y,W,H,'#e0302a',{hi:.2,lo:.25});
    [x,y,W,H]=A.r('frond',64,96,32,16); g.strokeStyle='#4a7a2a'; g.lineWidth=.8; g.beginPath(); g.moveTo(x+1,y+8); g.quadraticCurveTo(x+16,y+6,x+31,y+9); g.stroke();
      for(let k=0;k<15;k++){ const px=x+2+k*2, t=k/15, len=6.5*(1-t*.6); for(const d of [-1,1]){ g.fillStyle=k%2?'#3f8a3e':'#5aa84a'; g.beginPath(); g.moveTo(px,y+8-d*.2); g.quadraticCurveTo(px+1.6,y+8+d*len*.5,px+2.6,y+8+d*len); g.lineTo(px+1.2,y+8+d*len*.9); g.quadraticCurveTo(px+.4,y+8+d*len*.5,px-.4,y+8); g.fill(); } }
    [x,y,W,H]=A.r('fringe',96,96,32,16); for(let k=0;k<64;k++){ const sx=x+k*.5, len=8+((k*37)%7); vfill(g,sx,y,.6,len,[[0,'#d8b060'],[1,'#8a6a2a']]); }
    [x,y,W,H]=A.r('tower',16,104,32,8); paPanel(g,x,y,W,H,'#f4f2ec'); R(g,'#e0302a',x,y+3,W,2);
  },3,905);
  const S=paAtlas(128,64,(g,w,h,A)=>{
    let [x,y,W,H]=A.r('tremor',0,0,64,16); R(g,'#0e0a14',x,y,W,H); radial(g,x+32,y+8,30,[[0,rgba('#ff3fa4',.35)],[1,rgba('#ff3fa4',0)]]); text(g,'TREMOR',x+9.4,y+3.4,rgba('#ff3fa4',.6),1.8); text(g,'TREMOR',x+9,y+3,'#ffd0ec',1.8); R(g,'#29e0e6',x+2,y+H-2,W-4,.6);
    ['#ff3fa4',YL,'#29e0e6','#7cf06a'].forEach((c,k)=>{ const [bx_,by]=A.r('bulb'+k,64+k*8,0,8,8); radial(g,bx_+4,by+4,4.2,[[0,'#ffffff'],[.4,mix(c,'#ffffff',.4)],[1,c]]); });
    [x,y,W,H]=A.r('tub',96,0,32,32); radial(g,x+16,y+16,16,[[0,'#8af0ff'],[1,'#2ab0d0']]); const r=rng(906); for(let i=0;i<40;i++) ell(g,x+4+r()*24,y+4+r()*24,.6+r()*1.2,.6+r()*1.2,rgba('#ffffff',.6));
    [x,y,W,H]=A.r('screen',0,16,16,10); vfill(g,x,y,W,H,[[0,'#2a1a4a'],[1,'#120a22']]); for(let k=0;k<14;k++) R(g,k%3?'#29e0e6':'#ff3fa4',x+1+k,y+H-1-((k*5)%7),.6,(k*5)%7);
    [x,y,W,H]=A.r('flame',16,16,8,16); radial(g,x+4,y+11,6,[[0,'#fff8c0'],[.4,'#ffb030'],[1,'#e0401a']]);
    [x,y,W,H]=A.r('glow',24,16,8,8); radial(g,x+4,y+4,4,[[0,'#fff4d0'],[1,'#ffb860']]);
  },0,907);
  return {walls,A,S}; }
