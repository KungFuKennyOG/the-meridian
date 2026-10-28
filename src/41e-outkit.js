
/* =====================================================================================================
   OUTSIDE THE WINDOWS · painting kit. Painted, smooth-gradient scenery in the late-90s way: light and shade
   painted in, soft atmospheric haze with distance, clean readable silhouettes, rich colour. Used by the
   scene files that follow (41f..) and built into strips and a trackside atlas by src/42-scenery.js.
   ===================================================================================================== */
/* periodic value noise in x (period w) for any frequency: smooth ridges that wrap */
const outPN=(x,w,s,f=3,oct=4)=>pn(x,w,s,f,oct);
/* a sky band: gradient, a sun glow, painted cumulus with lit tops and shaded bellies, a little cirrus; wraps in x */
function oSkyTex(stops,o={}){ return outPX(256,128,o.S||4,(g,w,h)=>{ vfill(g,0,0,w,h,stops);
  const r=rng(o.seed||5);
  if(o.glow) for(const dx of [-w,0,w]) radial(g,o.glow[0]*w+dx,o.glow[1]*h,o.glow[2]*w,[[0,o.glow[3]],[1,rgba('#000000',0)]]);
  if(o.stars){ for(let i=0;i<o.stars;i++){ const y=r()*h*.62, a=(.3+r()*.7)*(1-y/(h*.7)); const s=r()<.08?.9:.45; g.fillStyle=`rgba(255,248,232,${a})`; g.fillRect(r()*w,y,s,s); } }
  if(o.cirrus) for(let i=0;i<o.cirrus;i++){ const x=r()*w,y=h*(.12+r()*.3),L=20+r()*40; for(const dx of [-w,0,w]) for(let k=0;k<5;k++) ell(g,x+dx+k*L*.18,y+k*.6,L*.22,.6+r()*.5,rgba(o.cirrusCol||'#ffffff',.18+r()*.12)); }
  const cl=o.clouds||0, lit=o.cloudCol||'#ffffff', sh=o.cloudShade||'#b8c4d8', mid=mix(lit,sh,.45);
  for(let i=0;i<cl;i++){ const t=r(), y=h*(.5+t*.36), sc=.35+t*.9, x=r()*w, cw=(14+r()*22)*sc, ch=(4+r()*4)*sc;
    for(const dx of [-w,0,w]){ const cx=x+dx; if(cx<-cw*2||cx>w+cw*2) continue; const q=rng(i*31+7);
      /* belly shadow, then the body, then lit puffs on top toward the sun, then a crisp highlight */
      ell(g,cx,y+ch*.35,cw*1.05,ch*.55,rgba(sh,.75));
      for(let k=0;k<7;k++){ const px=cx+(q()-.5)*cw*1.5, py=y-q()*ch*.7, pr=ch*(.6+q()*.7); ell(g,px,py,pr*1.25,pr,rgba(mid,.9)); }
      for(let k=0;k<6;k++){ const px=cx+(q()-.62)*cw*1.2, py=y-ch*.35-q()*ch*.8, pr=ch*(.45+q()*.55); ell(g,px,py,pr*1.2,pr,rgba(lit,.92)); }
      for(let k=0;k<4;k++){ const px=cx+(q()-.7)*cw, py=y-ch*.7-q()*ch*.6, pr=ch*(.25+q()*.3); ell(g,px,py,pr*1.1,pr*.9,rgba(mix(lit,'#ffffff',.6),.85)); }
      g.fillStyle=rgba(sh,.35); g.fillRect(cx-cw,y+ch*.62,cw*2,ch*.12); } }
  if(o.haze) vfill(g,0,h*.6,w,h*.4,[[0,rgba(o.haze,0)],[1,rgba(o.haze,.7)]]);
}); }

/* ---------- landforms ---------- */
/* a mountain range: shaded massif, sunlit slopes painted down from the ridge, gullies, snow caps, haze at the foot.
   prof(x) -> height above base. light: +1 = sun from the left */
function oRange(g,w,h,base,prof,c,o={}){ const L=o.light??1, top=x=>base-prof(x);
  g.fillStyle=c.shade; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x+=.5) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill();
  /* lit faces: where the ridge rises toward the light */
  for(let x=0;x<w;x+=.5){ const d=(prof(x+1)-prof(x-1))*L; const y=top(x); if(d<0) continue; const k=Math.min(1,d*.9);
    g.fillStyle=grad(g,0,y,0,y+(base-y)*.9,[[0,rgba(c.lit,.95*k+.05)],[1,rgba(c.lit,0)]]); g.fillRect(x,y,.6,(base-y)*.9); }
  /* gullies: thin darker streaks running down from notches */
  const r=rng(o.seed||3); for(let i=0;i<(o.gullies??w/4);i++){ const x=r()*w, y=top(x), len=(base-y)*(.3+r()*.5); g.strokeStyle=rgba(c.dark||c.shade,.5); g.lineWidth=.5; g.beginPath(); g.moveTo(x,y+1); g.quadraticCurveTo(x+(r()-.5)*4,y+len*.5,x+(r()-.5)*6,y+len); g.stroke(); }
  if(c.snow){ const sl=o.snowLine??.55; for(let x=0;x<w;x+=.5){ const p=prof(x), y=top(x), mx=Math.max(...[0,1,2,3].map(k=>prof(x+(k-1.5)*3))); const depth=(p-mx*sl); if(depth<=0) continue;
      const d=(prof(x+1)-prof(x-1))*L, sn=d>=0?c.snow:c.snowShade||mix(c.snow,c.shade,.45), ragged=Math.sin(x*1.7)*.8+Math.sin(x*.53)*1.2; g.fillStyle=sn; g.fillRect(x,y,.6,Math.max(0,depth*.8+ragged)); } }
  if(c.haze) vfill(g,0,base-(o.hazeH||20),w,o.hazeH||20,[[0,rgba(c.haze,0)],[1,rgba(c.haze,o.hazeA??.75)]]);
  if(o.fillBelow) R(g,o.fillBelow,0,base,w,h-base); }
/* rolling hills covered in trees: a soft silhouette, then rows of painted crowns along the top and down the slope */
function oWoodedHills(g,w,h,base,prof,pal,o={}){ const top=x=>base-prof(x), r=rng(o.seed||9), L=o.light??1;
  g.fillStyle=pal[0]; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x+=.5) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill();
  vfill(g,0,base-(o.depth||30),w,o.depth||30,[[0,rgba(pal[1],0)],[1,rgba(pal[1],.0)]]);
  const n=(o.density||1)*w*1.6;
  for(let i=0;i<n;i++){ const x=r()*w, t=r(), y=top(x)+t*t*(base-top(x)+4), s=(o.size||2.2)*(.7+r()*.6);
    ell(g,x+s*.25*L,y+s*.2,s*1.05,s*.85,pal[0]); ell(g,x,y,s,s*.8,pal[1]); ell(g,x-s*.3*L,y-s*.3,s*.6,s*.45,pal[2]); if(pal[3]&&r()<.3) ell(g,x-s*.4*L,y-s*.45,s*.3,s*.22,pal[3]); }
  if(o.haze) vfill(g,0,base-(o.hazeH||16),w,(o.hazeH||16)+2,[[0,rgba(o.haze,0)],[1,rgba(o.haze,o.hazeA??.5)]]);
  if(o.fillBelow) R(g,o.fillBelow,0,base,w,h-base); }
/* haze over a band of a card: distance in a single stroke */
function oHaze(g,w,y0,y1,col,a0,a1){ vfill(g,0,y0,w,y1-y0,[[0,rgba(col,a0)],[1,rgba(col,a1)]]); }

/* ---------- trees and plants (painted for cards; base of trunk at (x,base)) ---------- */
/* a leafy crown built from clumps: shadow mass, mid tones, sunlit clumps up-left, a few bright flecks */
function oCrown(g,cx,cy,rx,ry,pal,seed,o={}){ const r=rng(seed), L=o.light??1, n=o.n||22;
  for(let i=0;i<n;i++){ const a=r()*6.28, d=Math.sqrt(r()); const x=cx+Math.cos(a)*rx*d*.8, y=cy+Math.sin(a)*ry*d*.75+ry*.08; ell(g,x,y,rx*(.28+r()*.18),ry*(.26+r()*.16),pal[0]); }
  for(let i=0;i<n;i++){ const a=r()*6.28, d=Math.sqrt(r())*.85; const x=cx+Math.cos(a)*rx*d*.75-rx*.06*L, y=cy+Math.sin(a)*ry*d*.7-ry*.08; ell(g,x,y,rx*(.22+r()*.14),ry*(.2+r()*.12),pal[1]); }
  for(let i=0;i<n*.7;i++){ const a=-Math.PI*.5-L*.7+(r()-.5)*2.2, d=Math.sqrt(r())*.8; const x=cx+Math.cos(a)*rx*d*.7, y=cy+Math.sin(a)*ry*d*.7; ell(g,x,y,rx*(.14+r()*.1),ry*(.12+r()*.09),pal[2]); }
  if(pal[3]) for(let i=0;i<n*.5;i++){ const a=-Math.PI*.5-L*.8+(r()-.5)*1.8, d=Math.sqrt(r())*.75; ell(g,cx+Math.cos(a)*rx*d*.7,cy+Math.sin(a)*ry*d*.7,rx*.06+r()*rx*.05,ry*.05+r()*ry*.04,pal[3]); } }
function oTrunk(g,x,base,top,w0,w1,cols,o={}){ g.fillStyle=grad(g,x-w0/2,0,x+w0/2,0,[[0,cols[1]],[.35,cols[0]],[1,cols[2]]]); g.beginPath(); g.moveTo(x-w0/2,base); g.lineTo(x-w1/2+(o.lean||0),top); g.lineTo(x+w1/2+(o.lean||0),top); g.lineTo(x+w0/2,base); g.fill(); }
function oBranch(g,x0,y0,x1,y1,wd,col){ g.strokeStyle=col; g.lineCap='round'; g.lineWidth=wd; g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo((x0+x1)/2+(y1-y0)*.15,(y0+y1)/2,x1,y1); g.stroke(); }
/* tree kinds for trackside cards: each fills a w x h cell, trunk base at the bottom centre */
function oTree(g,x,y,w,h,kind,seed,o={}){ const cx=x+w/2, b=y+h, r=rng(seed), L=o.light??1;
  if(kind==='round'||kind==='blossom'||kind==='lemon'||kind==='persimmon'){ const pal=o.pal||(kind==='blossom'?['#c86a8a','#ef9ab4','#ffcbd8','#fff2f6']:['#2e5a2a','#4a7e36','#78a848','#a8cc6a']);
    oTrunk(g,cx,b,b-h*.5,w*.09,w*.05,o.bark||['#5a4434','#3a2c22','#2a2018']);
    for(const [dx,dy,l] of [[-.18,-.55,.6],[.2,-.6,.55],[.02,-.7,.5]]) oBranch(g,cx,b-h*.38,cx+dx*w,b+dy*h,w*.035,(o.bark||['#4a3628'])[0]);
    oCrown(g,cx,y+h*.36,w*.46,h*.32,pal,seed,{light:L,n:o.n||26});
    if(kind==='lemon'||kind==='persimmon') for(let i=0;i<18;i++){ const a=r()*6.28, d=Math.sqrt(r()); const fx=cx+Math.cos(a)*w*.36*d, fy=y+h*.38+Math.sin(a)*h*.24*d; ell(g,fx,fy,w*.022,w*.02,kind==='lemon'?'#f2d23a':'#f0782a'); ell(g,fx-w*.006,fy-w*.006,w*.008,w*.007,'#fff6c0'); }
    if(kind==='blossom') for(let i=0;i<30;i++) ell(g,x+r()*w,b-r()*h*.1,w*.012,w*.006,'#ffc8d8'); }
  else if(kind==='pine'||kind==='spruce'||kind==='snowspruce'){ const pal=o.pal||['#1e3a30','#2e5444','#4a7458','#6a9470'];
    oTrunk(g,cx,b,b-h*.3,w*.06,w*.04,['#4a3426','#2a1e16','#20160e']);
    const tiers=o.tiers||9; for(let i=0;i<tiers;i++){ const t=i/tiers, ty=b-h*.12-t*h*.82, tw=w*(.5-t*.42)*(.9+r()*.2), th=h*.16;
      poly(g,[[cx-tw,ty],[cx+tw,ty],[cx+tw*.15,ty-th],[cx-tw*.15,ty-th]],pal[0]);
      for(let k=0;k<5;k++){ const sx=cx-tw+r()*tw*2; poly(g,[[sx-w*.05,ty+1],[sx+w*.05,ty+1],[sx,ty-th*.4]],pal[0]); }
      poly(g,[[cx-tw*.9,ty-1],[cx-tw*.1*L,ty-1],[cx,ty-th*.95],[cx-tw*.3,ty-th*.7]],pal[1]);
      poly(g,[[cx-tw*.75,ty-th*.25],[cx-tw*.3,ty-th*.3],[cx-tw*.12,ty-th*.85]],pal[2]);
      if(kind==='snowspruce'){ poly(g,[[cx-tw*1.02,ty-th*.08],[cx+tw*.6,ty-th*.1],[cx+tw*.2,ty-th*.45],[cx-tw*.4,ty-th*.5]],'#e4ecf4'); poly(g,[[cx-tw*.95,ty-th*.12],[cx-tw*.1,ty-th*.2],[cx-tw*.3,ty-th*.5]],'#ffffff'); } }
    poly(g,[[cx-w*.05,y+h*.07],[cx+w*.05,y+h*.07],[cx,y]],pal[1]); }
  else if(kind==='birch'){ const cols=['#f2f0ea','#c8c4bc','#9a968e']; oTrunk(g,cx,b,y+h*.08,w*.09,w*.04,cols);
    for(let k=0;k<26;k++){ const yy=b-r()*h*.9, ww=w*.03+r()*w*.04; R(g,'#2a2a2a',cx-w*.045+r()*w*.05,yy,ww,.7+r()*.8); }
    for(let k=0;k<8;k++){ const yy=b-h*(.45+r()*.45), dir=r()<.5?-1:1; oBranch(g,cx,yy,cx+dir*w*(.18+r()*.25),yy-h*(.08+r()*.12),w*.018,'#3a2e26'); }
    if(o.bare){ g.strokeStyle='#4a3a30'; g.lineWidth=.4; for(let k=0;k<40;k++){ const yy=b-h*(.5+r()*.45), xx=cx+(r()-.5)*w*.6; g.beginPath(); g.moveTo(xx,yy); g.lineTo(xx+(r()-.5)*w*.18,yy-h*.06); g.stroke(); } }
    else oCrown(g,cx,y+h*.32,w*.4,h*.28,o.pal||['#3a6a2a','#6a9a3a','#a8c858','#d8e888'],seed,{n:22}); }
  else if(kind==='cypress'){ const pal=o.pal||['#1e3624','#2e4e30','#4a6a40']; R(g,'#4a3426',cx-w*.04,b-h*.08,w*.08,h*.08);
    g.fillStyle=pal[0]; g.beginPath(); g.ellipse(cx,b-h*.5,w*.22,h*.48,0,0,6.28); g.fill();
    for(let i=0;i<40;i++){ const t=r(), yy=b-h*.06-t*h*.88, half=w*.2*Math.sin(Math.PI*Math.min(1,t*1.05+.05)); ell(g,cx-half*.4+r()*half*.6,yy,w*.09,h*.035,pal[1]); }
    for(let i=0;i<24;i++){ const t=r(), yy=b-h*.1-t*h*.8, half=w*.16*Math.sin(Math.PI*t); ell(g,cx-half*.5,yy,w*.06,h*.025,pal[2]); } }
  else if(kind==='umbrella'){ /* Italian stone pine */ oTrunk(g,cx,b,b-h*.62,w*.06,w*.035,['#6a4a36','#4a3426','#3a2a1e'],{lean:w*.06});
    for(const dx of [-.22,.2,0]) oBranch(g,cx+w*.06,b-h*.6,cx+dx*w,y+h*.3,w*.025,'#4a3426');
    const cy=y+h*.24; g.fillStyle=(o.pal||['#24402a'])[0]; g.beginPath(); g.ellipse(cx,cy+h*.04,w*.48,h*.16,0,0,6.28); g.fill();
    oCrown(g,cx,cy,w*.46,h*.14,o.pal||['#24402a','#36583a','#587a48','#7e9a5a'],seed,{n:30}); }
  else if(kind==='palm'){ const lean=(o.lean??(r()-.5))*w*.3; g.strokeStyle=(o.bark||['#8a6a4a'])[0];
    for(let i=0;i<20;i++){ const t=i/20, t2=(i+1)/20, x0=cx+lean*t*t, x1=cx+lean*t2*t2, y0=b-h*.72*t, y1=b-h*.72*t2; g.lineWidth=w*(.07-t*.025); g.strokeStyle=i%2?'#7a5a3e':'#9a7a56'; g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke(); }
    const tx=cx+lean, ty=b-h*.72, pal=o.pal||['#2a5a2a','#3e7a36','#6aa04a'];
    for(let k=0;k<11;k++){ const a=-Math.PI+k*Math.PI/10+(r()-.5)*.25, len=w*(.42+r()*.1), droop=h*(.12+r()*.1);
      const ex=tx+Math.cos(a)*len, ey=ty+Math.sin(a)*len*.45+droop;
      for(let j=0;j<14;j++){ const t=j/14, px=tx+(ex-tx)*t, py=ty+(ey-ty)*t-Math.sin(t*Math.PI)*h*.06; const lw=w*.05*(1-t*.6);
        g.strokeStyle=j%3===0?pal[2]:k%2?pal[0]:pal[1]; g.lineWidth=.5; g.beginPath(); g.moveTo(px,py); g.lineTo(px+Math.cos(a+1.3)*lw,py+lw*.9); g.moveTo(px,py); g.lineTo(px+Math.cos(a-1.3)*lw,py+lw*.9); g.stroke(); }
      g.strokeStyle=pal[0]; g.lineWidth=.6; g.beginPath(); g.moveTo(tx,ty); g.quadraticCurveTo((tx+ex)/2,(ty+ey)/2-h*.06,ex,ey); g.stroke(); }
    for(let k=0;k<5;k++) ell(g,tx+(r()-.5)*w*.08,ty+h*.02,w*.025,w*.025,'#6a4a2a'); }
  else if(kind==='bamboo'){ for(let k=0;k<9;k++){ const bx=x+w*(.12+k*.09)+(r()-.5)*w*.04, top=y+h*(r()*.15), lw=w*.035, c=k%3===0?'#5a8a3a':k%3===1?'#6aa04a':'#4a7a30';
      g.fillStyle=grad(g,bx-lw,0,bx+lw,0,[[0,mix(c,'#ffffff',.25)],[.5,c],[1,mix(c,'#000000',.3)]]); g.fillRect(bx-lw/2,top,lw,b-top); for(let yy=top+4;yy<b;yy+=4+r()*2) R(g,mix(c,'#ffffff',.4),bx-lw/2,yy,lw,.5); }
    for(let i=0;i<70;i++){ const lx=x+w*(.05+r()*.9), ly=y+r()*h*.75, a=(r()-.5)*1.6; g.fillStyle=['#3a6a2a','#5a8a3a','#8ab858'][i%3]; g.save(); g.translate(lx,ly); g.rotate(a); g.beginPath(); g.ellipse(0,0,w*.07,w*.014,0,0,6.28); g.fill(); g.restore(); } }
  else if(kind==='cactus'){ const c=['#3a6a3a','#5a8a4a','#2a4a2a']; const arm=(ax,ay,dir,len,up)=>{ g.fillStyle=c[0]; g.fillRect(ax,ay-w*.05,dir*len,w*.1); g.fillRect(ax+dir*len-(dir>0?w*.1:0),ay-up,w*.1,up); ell(g,ax+dir*len+(dir>0?-w*.05:w*.05),ay-up,w*.05,w*.05,c[0]); };
    arm(cx,b-h*.45,-1,w*.25,h*.25); arm(cx,b-h*.6,1,w*.22,h*.22);
    g.fillStyle=grad(g,cx-w*.1,0,cx+w*.1,0,[[0,c[1]],[.5,c[0]],[1,c[2]]]); g.fillRect(cx-w*.1,y+h*.06,w*.2,h*.94); ell(g,cx,y+h*.06,w*.1,w*.1,c[1]); for(let k=-2;k<=2;k++) R(g,rgba('#1a3a1a',.5),cx+k*w*.035,y+h*.08,.4,h*.9); }
  else if(kind==='joshua'){ oTrunk(g,cx,b,b-h*.5,w*.08,w*.06,['#6a5a46','#4a3e30','#3a3026']); for(const [ex,ey] of [[-.3,-.75],[.3,-.8],[-.1,-.9],[.15,-.62]]){ oBranch(g,cx,b-h*.48,cx+ex*w,b+ey*h,w*.05,'#5a4a3a'); for(let k=0;k<14;k++){ const a=r()*6.28; g.strokeStyle=k%2?'#5a7a3a':'#7a9a4a'; g.lineWidth=.6; g.beginPath(); g.moveTo(cx+ex*w,b+ey*h); g.lineTo(cx+ex*w+Math.cos(a)*w*.08,b+ey*h+Math.sin(a)*w*.08); g.stroke(); } } }
  else if(kind==='shrub'){ oCrown(g,cx,b-h*.42,w*.48,h*.4,o.pal||['#2a4a26','#3e6a30','#6a9a44','#9ac060'],seed,{n:o.n||20}); }
  else if(kind==='grass'){ const pal=o.pal||['#3e6a2a','#5a8a3a','#8ab050','#c8d878']; for(let i=0;i<70;i++){ const gx=x+w*(.05+r()*.9), gh=h*(.35+r()*.65), lean=(r()-.5)*w*.18; g.strokeStyle=pal[i%4]; g.lineWidth=.5+r()*.4; g.beginPath(); g.moveTo(gx,b); g.quadraticCurveTo(gx+lean*.3,b-gh*.6,gx+lean,b-gh); g.stroke(); }
    if(o.flowers) for(let i=0;i<10;i++) ell(g,x+w*(.1+r()*.8),b-h*(.4+r()*.5),.8,.8,o.flowers[i%o.flowers.length]); } }

/* ---------- buildings ---------- */
/* a painted facade: plaster or brick, light from the top, AO at the foot, a cornice, a grid of framed windows
   (glass catches the sky, some lit), optional shop front with an awning. All in the cell (x,y,w,h). */
function oFacade(g,x,y,w,h,o={}){ const c=o.col||'#d8ccb4', fl=o.floors||3, bays=o.bays||3, r=rng(o.seed||1), wall=o.dark?mix(c,'#000000',.15):c;
  vfill(g,x,y,w,h,[[0,mix(wall,'#ffffff',.12)],[.6,wall],[1,mix(wall,'#000000',.28)]]);
  if(o.brick){ for(let yy=y+1;yy<y+h;yy+=1.2){ const off=((yy-y)/1.2|0)%2?1.1:0; for(let xx=x+off;xx<x+w;xx+=2.2) R(g,rgba(r()<.5?'#000000':'#ffffff',.06+r()*.06),xx,yy,2,1); R(g,rgba('#000000',.12),x,yy+1,w,.2); } }
  else for(let i=0;i<w*h*.05;i++) ell(g,x+r()*w,y+r()*h,.6+r()*1.4,.4+r()*.8,rgba(r()<.5?'#000000':'#ffffff',.035));
  const gH=o.shop?h*(o.shopH||.3):0, fh=(h-gH-(o.roofH||2))/fl, bw=w/bays, ww=bw*(o.winW||.5), wh=fh*(o.winH||.58);
  for(let f=0;f<fl;f++) for(let b=0;b<bays;b++){ const wx=x+b*bw+(bw-ww)/2, wy=y+(o.roofH||2)+f*fh+(fh-wh)*.45, lit=o.lit&&r()<o.lit;
    if(o.frame!==false) R(g,o.frame||mix(wall,'#ffffff',.35),wx-.5,wy-.5,ww+1,wh+1.4);
    const gl=lit?[[0,'#ffe6a8'],[1,'#f0b860']]:o.night?[[0,'#1a2030'],[1,'#2a3042']]:[[0,o.glassTop||'#9ab8d0'],[.55,o.glass||'#4a6078'],[1,o.glassBot||'#2a3448']];
    vfill(g,wx,wy,ww,wh,gl); if(!lit&&!o.night) poly(g,[[wx+ww*.15,wy+wh],[wx+ww*.45,wy+wh],[wx+ww*.85,wy],[wx+ww*.55,wy]],rgba('#ffffff',.18));
    if(o.mullion!==false){ R(g,o.frame||mix(wall,'#ffffff',.35),wx+ww/2-.25,wy,.5,wh); if(wh>ww) R(g,o.frame||mix(wall,'#ffffff',.35),wx,wy+wh*.45,ww,.4); }
    if(o.shutters){ R(g,o.shutters,wx-ww*.42,wy,ww*.4,wh); R(g,o.shutters,wx+ww*1.02,wy,ww*.4,wh); for(let k=1;k<5;k++){ R(g,rgba('#000000',.18),wx-ww*.42,wy+k*wh/5,ww*.4,.3); R(g,rgba('#000000',.18),wx+ww*1.02,wy+k*wh/5,ww*.4,.3); } }
    R(g,rgba('#000000',.25),wx-.6,wy+wh+.9,ww+1.2,.6); R(g,mix(wall,'#ffffff',.3),wx-.8,wy+wh+.5,ww+1.6,.5); /* sill and its shadow */
    if(o.balcony&&f>0&&r()<o.balcony){ R(g,o.rail||'#3a3a3a',wx-1,wy+wh-fh*.18,ww+2,.4); for(let k=0;k<=ww+2;k+=1.2) R(g,o.rail||'#3a3a3a',wx-1+k,wy+wh-fh*.18,.25,fh*.2); R(g,rgba('#000000',.2),wx-1,wy+wh+.2,ww+2,.5); }
    if(o.ac&&r()<o.ac){ R(g,'#d8d8d4',wx+ww+.4,wy+wh*.5,bw*.18,wh*.35); R(g,'#9a9a98',wx+ww+.4,wy+wh*.5+wh*.3,bw*.18,wh*.05); }
    if(o.laundry&&r()<o.laundry){ R(g,'#6a6a6a',wx-1,wy+wh*.2,ww+2,.2); for(let k=0;k<4;k++) R(g,['#e8e4dc','#c84a4a','#4a7ac8','#f2c230'][(k+b)%4],wx+k*ww/4,wy+wh*.22,ww/5,wh*.3); } }
  if(o.cornice!==false){ R(g,mix(wall,'#ffffff',.3),x,y,w,1.2); R(g,rgba('#000000',.22),x,y+1.2,w,.6); }
  if(o.shop){ const sy=y+h-gH; R(g,o.shopCol||'#3a3430',x,sy,w,gH); vfill(g,x+1,sy+gH*.32,w-2,gH*.68,[[0,o.shopGlow||'#f2d8a0'],[1,mix(o.shopGlow||'#f2d8a0','#000000',.35)]]);
    if(o.awning){ const aw=o.awning; for(let k=0;k<w;k+=2.4) poly(g,[[x+k,sy],[x+k+2.4,sy],[x+k+2.6,sy+gH*.34],[x+k+.2,sy+gH*.34]],k/2.4%2?aw[0]:aw[1]); R(g,rgba('#000000',.3),x,sy+gH*.34,w,.8); }
    if(o.sign){ R(g,o.sign[1]||'#1a1a1a',x+w*.15,sy-gH*.02,w*.7,gH*.2); if(o.sign[0]) text(g,o.sign[0],x+w/2-textW(o.sign[0],o.signS||.5)/2,sy+gH*.03,o.sign[2]||'#f2e8c8',o.signS||.5); } }
  vfill(g,x,y+h-2.5,w,2.5,[[0,rgba('#000000',0)],[1,rgba('#000000',.3)]]); /* ground AO */
  hfill(g,x,y,w*.08,h,[[0,rgba('#000000',.12)],[1,rgba('#000000',0)]]); hfill(g,x+w*.92,y,w*.08,h,[[0,rgba('#000000',0)],[1,rgba('#000000',.18)]]); }
/* roof surfaces for the atlas (they get stretched over gables) */
function oRoofTiles(g,x,y,w,h,col,o={}){ vfill(g,x,y,w,h,[[0,mix(col,'#ffffff',.18)],[1,mix(col,'#000000',.25)]]); const rows=o.rows||8, rh=h/rows, r=rng(o.seed||4);
  for(let i=0;i<rows;i++){ const yy=y+i*rh; R(g,rgba('#000000',.32),x,yy+rh-.6,w,.6); R(g,rgba('#ffffff',.14),x,yy,w,.4); if(o.ridged!==false) for(let xx=x;xx<x+w;xx+=o.pitch||2){ R(g,rgba('#000000',.18),xx,yy,.35,rh); R(g,rgba('#ffffff',.08),xx+.35,yy,.35,rh); } }
  for(let i=0;i<w*h*.02;i++) R(g,rgba(r()<.5?'#000000':'#ffffff',.07),x+r()*w,y+r()*h,1.2,.6); }
/* corrugated metal, planks or logs for sheds and fences */
function oPlanks(g,x,y,w,h,col,o={}){ const vert=o.vert, n=o.n||8, r=rng(o.seed||6);
  for(let i=0;i<n;i++){ const c=mix(col,i%2?'#000000':'#ffffff',.04+r()*.06); if(vert){ const pw=w/n; hfill(g,x+i*pw,y,pw,h,[[0,mix(c,'#ffffff',.12)],[.8,c],[1,mix(c,'#000000',.35)]]); } else { const ph=h/n; vfill(g,x,y+i*ph,w,ph,[[0,mix(c,'#ffffff',.14)],[.8,c],[1,mix(c,'#000000',.4)]]); } }
  for(let i=0;i<w*h*.04;i++) R(g,rgba('#000000',.08),x+r()*w,y+r()*h,vert?.3:1.5,vert?1.5:.3);
  if(o.ao!==false) vfill(g,x,y+h*.75,w,h*.25,[[0,rgba('#000000',0)],[1,rgba('#000000',.25)]]); }
function oMetal(g,x,y,w,h,col,o={}){ hfill(g,x,y,w,h,[[0,mix(col,'#000000',.25)],[.3,mix(col,'#ffffff',.25)],[.55,col],[1,mix(col,'#000000',.4)]]); if(o.bands) for(let yy=y+o.bands;yy<y+h;yy+=o.bands) R(g,rgba('#000000',.25),x,yy,w,.4); }
function oStone(g,x,y,w,h,col,o={}){ vfill(g,x,y,w,h,[[0,mix(col,'#ffffff',.15)],[1,mix(col,'#000000',.25)]]); const r=rng(o.seed||8);
  if(o.blocks){ const bh=o.blocks; for(let yy=y;yy<y+h;yy+=bh){ R(g,rgba('#000000',.25),x,yy,w,.35); const off=((yy-y)/bh|0)%2?bh:0; for(let xx=x+off;xx<x+w;xx+=bh*2) R(g,rgba('#000000',.2),xx,yy,.35,bh); } }
  for(let i=0;i<w*h*.08;i++) ell(g,x+r()*w,y+r()*h,.3+r()*.8,.3+r()*.6,rgba(r()<.5?'#000000':'#ffffff',.06)); }
/* soft blob shadow for under trees and props (flat on the ground) */
function oShadow(g,x,y,w,h,a=.4){ radial(g,x+w/2,y+h/2,Math.min(w,h)/2,[[0,rgba('#000000',a)],[.6,rgba('#000000',a*.6)],[1,rgba('#000000',0)]]); }
/* a cell fill helper: run fn with its own clip so neighbours stay clean */
function oCell(g,c,fn){ const [x,y,w,h]=c; g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip(); fn(g,x,y,w,h); g.restore(); }

/* ---------- standard atlas cells any scene can name; a scene's own painters override these ---------- */
const OUT_STDCELL={
  wire:(g,x,y,w,h)=>R(g,'#1e1e22',x,y,w,h),
  dark:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#3a3a3e'],[1,'#1a1a1e']]),
  white:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#f6f6f2'],[1,'#d8d8d2']]),
  post:(g,x,y,w,h)=>hfill(g,x,y,w,h,[[0,'#8a8a84'],[.4,'#c8c6be'],[1,'#6a6a64']]),
  steel:(g,x,y,w,h)=>oMetal(g,x,y,w,h,'#7a8088'),
  blackmetal:(g,x,y,w,h)=>hfill(g,x,y,w,h,[[0,'#1a1a1c'],[.35,'#4a4a50'],[1,'#121214']]),
  wood:(g,x,y,w,h)=>oPlanks(g,x,y,w,h,'#5a4232',{vert:true,n:4}),
  pole:(g,x,y,w,h)=>{ hfill(g,x,y,w,h,[[0,'#8a8a86'],[.3,'#c8c8c2'],[.6,'#a2a29c'],[1,'#6a6a66']]); for(let k=0;k<8;k++) R(g,rgba('#000000',.06),x,y+k*12+3,w,.4); for(let k=0;k<5;k++) R(g,k%2?'#1a1a1a':'#f2d23a',x,y+h-14+k*2.4,w,2.4); },
  woodpole:(g,x,y,w,h)=>{ hfill(g,x,y,w,h,[[0,'#4a3a2a'],[.35,'#7a6248'],[1,'#3a2c20']]); const r=rng(3); for(let i=0;i<30;i++) R(g,rgba('#000000',.15),x+r()*w,y+r()*h,.3,2+r()*4); },
  tufts:(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',47,{pal:['#3e6a2a','#5a8a3a','#8ab050','#b8c870']}),
  drygrass:(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',53,{pal:['#8a7a4a','#a89a5a','#c8b878','#6a6a3a']}),
  flowers:(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',51,{pal:['#4a7a32','#5a8a3a','#7aa848','#8ab858'],flowers:['#f2d23a','#ffffff','#e88aa8']}),
  shrub:(g,x,y,w,h)=>oTree(g,x,y,w,h,'shrub',39),
  stone:(g,x,y,w,h)=>oStone(g,x,y,w,h,'#9a968a',{seed:3}),
  concrete:(g,x,y,w,h)=>{ oStone(g,x,y,w,h,'#a8a6a0',{seed:5}); vfill(g,x,y+h*.8,w,h*.2,[[0,rgba('#000000',0)],[1,rgba('#000000',.2)]]); },
  rock:(g,x,y,w,h)=>{ const r=rng(61); ell(g,x+w/2,y+h*.62,w*.48,h*.38,'#5a5a56'); for(let i=0;i<14;i++){ const a=r()*6.28, d=r()*.6; ell(g,x+w/2+Math.cos(a)*w*.3*d-w*.06,y+h*.55+Math.sin(a)*h*.25*d-h*.06,w*(.12+r()*.12),h*(.1+r()*.1),['#7a7a74','#8a8882','#6a6a64'][i%3]); } ell(g,x+w*.4,y+h*.4,w*.16,h*.08,'#9a9892'); R(g,'#4a4a46',x,y+h-1.5,w,1.5); },
};
/* paint every cell of a kit: its own painter if it has one, else the standard one */
function outKitAtlas(K){ return (g)=>{ for(const k in K.cells){ const fn=(K.paint&&K.paint[k])||OUT_STDCELL[k]; if(fn) oCell(g,K.cells[k],fn); } }; }
/* a floor-by-floor tower front: ground floor cell, n floors from a few floor cells, a parapet. One box face per floor keeps the
   texture sharp up close. cells: {g: ground, f:[floor cells], p: parapet, e: side, t: roof} */
function outTower(E,u,d,w,dp,floors,cells,o={}){ const fh=o.fh||3, gh=o.gh||4, r=o.r||Math.random;
  E.box(u,d,w,gh,dp,{f:cells.g,e:cells.e,t:null},{ao:.7});
  for(let i=0;i<floors;i++) E.box(u,d,w,fh,dp,{f:cells.f[(r()*cells.f.length)|0],e:cells.e,t:null},{y:gh+i*fh,sb:1,st:1,ao:1,fs:1-.0*i});
  const top=gh+floors*fh; E.box(u,d,w,o.ph||1,dp,{f:cells.p||cells.e,e:cells.e,t:cells.t||cells.e},{y:top,ao:1});
  return top+(o.ph||1); }
