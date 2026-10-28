/* ---------- Izakaya Hanami: the painted atlases and the little geometry helpers its builder uses ----------
   Three atlases keep the car to a handful of draw calls: IZ.A (lit: wood, cloth, tatami, labels, posters, props),
   IZ.G (unlit: lanterns, embers, the TV, backlit shoji, the drinks fridge) and IZ.K (cut-out: sakura sprays).
   Every slot is painted like the reference: smooth gradients, light painted in from above, soft AO at the edges.
   Lettering is invented brush strokes, never a real script. Painted once and cached across visits. */
let IZ=null;
/* an invented brush glyph in an s-wide cell centred on (cx,cy): a few calligraphic strokes */
function izGlyph(g,cx,cy,s,col,seed,wt=1){ const r=rng(seed*7+3); g.strokeStyle=col; g.fillStyle=col; g.lineCap='round'; g.lineJoin='round';
  const n=3+(r()*3|0), q=s*.42;
  for(let i=0;i<n;i++){ const k=r()*6|0; g.lineWidth=s*(.1+r()*.05)*wt; const x0=cx+(r()-.5)*s*.6, y0=cy+(r()-.5)*s*.6; g.beginPath();
    if(k===0){ const y=cy+(r()-.5)*s*.7; g.moveTo(cx-q*(.6+r()*.4),y); g.quadraticCurveTo(cx,y-s*.06,cx+q*(.6+r()*.4),y+s*.04); }
    else if(k===1){ const x=cx+(r()-.5)*s*.6; g.moveTo(x,cy-q); g.lineTo(x+s*.02,cy+q*(.5+r()*.5)); }
    else if(k===2){ g.moveTo(x0,y0-s*.2); g.quadraticCurveTo(x0-s*.05,y0+s*.15,x0-s*.32,y0+s*.34); }
    else if(k===3){ g.moveTo(x0-s*.05,y0-s*.1); g.quadraticCurveTo(x0+s*.12,y0+s*.18,x0+s*.36,y0+s*.32); }
    else if(k===4){ const w=s*(.3+r()*.25),h=s*(.25+r()*.25); g.moveTo(x0-w/2,y0-h/2); g.lineTo(x0+w/2,y0-h/2); g.lineTo(x0+w/2,y0+h/2); g.moveTo(x0-w/2,y0-h/2); g.lineTo(x0-w/2,y0+h/2); g.lineTo(x0+w/2,y0+h/2); }
    else { g.lineWidth=s*.16*wt; g.moveTo(x0,y0); g.lineTo(x0+s*.06,y0+s*.08); }
    g.stroke(); } }
/* a vertical or horizontal run of glyphs */
function izWrite(g,x,y,n,s,col,seed,vert=true,wt=1){ for(let i=0;i<n;i++) izGlyph(g,vert?x:x+i*s,vert?y+i*s:y,s*.92,col,seed+i*13,wt); }
/* painted wood: light from above, wavy grain, a knot or two, a sheen band, dark bevels */
function izWood(g,x,y,w,h,light,dark,seed,vert=false,o={}){ const r=rng(seed);
  vfill(g,x,y,w,h,[[0,mix(light,'#ffffff',.08)],[.45,light],[1,dark]]);
  g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip();
  const L=vert?h:w, S=vert?w:h, n=Math.max(4,S*(o.dens||.55)|0);
  for(let i=0;i<n;i++){ const off=r()*S, amp=.4+r()*1.2, f=.05+r()*.12, ph=r()*6; g.strokeStyle=rgba(r()<.65?mix(dark,'#000000',.25):mix(light,'#ffffff',.25),.12+r()*.16); g.lineWidth=.35+r()*.6; g.beginPath();
    for(let t=0;t<=L;t+=1.5){ const d=off+Math.sin(t*f+ph)*amp; if(vert) (t?g.lineTo(x+d,y+t):g.moveTo(x+d,y+t)); else (t?g.lineTo(x+t,y+d):g.moveTo(x+t,y+d)); } g.stroke(); }
  for(let i=0;i<(o.knots??1);i++){ const kx=x+r()*w,ky=y+r()*h; ell(g,kx,ky,vert?1.2:2.6,vert?2.6:1.2,rgba(dark,.5)); ell(g,kx,ky,vert?.5:1.1,vert?1.1:.5,rgba('#000000',.35)); }
  if(o.sheen!==false){ g.fillStyle=grad(g,x,y,x,y+h,[[0,'rgba(255,255,255,0.10)'],[.3,'rgba(255,255,255,0.0)']]); g.fillRect(x,y,w,h); }
  if(o.edge!==false){ R(g,rgba('#ffffff',.18),x,y,w,.6); R(g,rgba('#000000',.28),x,y+h-.8,w,.8); R(g,rgba('#000000',.14),x,y,.6,h); R(g,rgba('#000000',.14),x+w-.6,y,.6,h); }
  g.restore(); }
/* soft cloth: base gradient, a fine weave, darker edges */
function izCloth(g,x,y,w,h,col,seed,weave=1){ vfill(g,x,y,w,h,[[0,mix(col,'#ffffff',.1)],[.5,col],[1,mix(col,'#000000',.22)]]); const r=rng(seed);
  if(weave){ for(let yy=y;yy<y+h;yy+=1) R(g,rgba('#000000',.05+r()*.03),x,yy,w,.35); for(let xx=x;xx<x+w;xx+=1) R(g,rgba('#ffffff',.03),xx,y,.35,h); } }
function izAO(g,x,y,w,h,k=.3,e=2){ g.fillStyle=grad(g,x,y,x+e,y,[[0,rgba('#000000',k)],[1,'rgba(0,0,0,0)']]); g.fillRect(x,y,e,h); g.fillStyle=grad(g,x+w,y,x+w-e,y,[[0,rgba('#000000',k)],[1,'rgba(0,0,0,0)']]); g.fillRect(x+w-e,y,e,h);
  g.fillStyle=grad(g,x,y,x,y+e,[[0,rgba('#000000',k*.7)],[1,'rgba(0,0,0,0)']]); g.fillRect(x,y,w,e); g.fillStyle=grad(g,x,y+h,x,y+h-e,[[0,rgba('#000000',k)],[1,'rgba(0,0,0,0)']]); g.fillRect(x,y+h-e,w,e); }
/* a sakura blossom: five rounded petals */
function izBlossom(g,x,y,s,col,core){ for(let k=0;k<5;k++){ const a=k/5*Math.PI*2-Math.PI/2; ell(g,x+Math.cos(a)*s*.55,y+Math.sin(a)*s*.55,s*.42,s*.42,col); } ell(g,x,y,s*.25,s*.25,core||'#c8406a'); }

/* an atlas: slots are packed in rows; rect names map to [x,y,w,h] in painter units */
function izAtlas(W,H,S,slots,o={}){ const rects={}; let x=0,y=0,rh=0;
  for(const s of slots){ if(x+s[1]>W){ x=0; y+=rh; rh=0; } rects[s[0]]=[x,y,s[1],s[2]]; x+=s[1]; rh=Math.max(rh,s[2]); }
  if(y+rh>H) console.warn('izakaya atlas overflow',y+rh,H);
  const t=tex(W*S,H*S,null,g=>{ g.scale(S,S); for(const s of slots){ const [rx,ry,rw,rh_]=rects[s[0]]; g.save(); g.beginPath(); g.rect(rx,ry,rw,rh_); g.clip(); g.translate(rx,ry); s[3](g,rw,rh_); g.restore(); } g.setTransform(1,0,0,1,0,0); if(o.grain) grain(g,o.grain,o.seed||5); });
  return {tex:t,rects,W,H}; }
/* map a geometry's 0..1 UVs into one slot (or one slot per material group: [side, top, bottom] for cylinders, six faces for boxes) */
function izUV(geo,at,slot){ const pad=.45, used=new Set();
  const map=(v,name)=>{ if(used.has(v)) return; used.add(v); const r=at.rects[name]; if(!r){ console.warn('izakaya: no slot',name); return; } const [x,y,w,h]=r, u=geo.T[v*2], vv=geo.T[v*2+1];
    geo.T[v*2]=(x+pad+u*(w-2*pad))/at.W; geo.T[v*2+1]=1-(y+pad+(1-vv)*(h-2*pad))/at.H; };
  if(typeof slot==='string'){ for(let v=0;v<geo.T.length/2;v++) map(v,slot); return geo; }
  for(const gr of geo.groups){ const name=slot[gr.mi]??slot[0]; for(let i=gr.start;i<gr.start+gr.count;i++) map(geo.I[i],name); }
  for(let v=0;v<geo.T.length/2;v++) map(v,slot[0]); return geo; }
/* box faces in the engine's order: +x, -x, top, bottom, +z (front), -z (back) */
function izFaces(s){ if(typeof s==='string'||Array.isArray(s)) return s; const d=s.s||s.f; return [s.px||d,s.nx||d,s.t||d,s.u||s.t||d,s.f||d,s.b||d]; }

function izPaint(){ if(IZ) return IZ;
  /* ---------- tiling surfaces ---------- */
  const floor=P2(64,64,(g,w,h)=>{ const r=rng(901); R(g,'#1c1814',0,0,w,h);
    for(let ty=0;ty<2;ty++) for(let tx=0;tx<2;tx++){ const x=tx*32+.8,y=ty*32+.8,c=['#4a443c','#544c42','#463f38','#4e463e'][(tx+ty*2+(r()*2|0))%4];
      vfill(g,x,y,30.4,30.4,[[0,mix(c,'#ffffff',.1)],[1,mix(c,'#000000',.12)]]);
      for(let i=0;i<10;i++) ell(g,x+r()*30,y+r()*30,2+r()*5,1.5+r()*3,rgba(r()<.5?'#000000':'#ffffff',.04));
      R(g,rgba('#ffffff',.14),x,y,30.4,.6); R(g,rgba('#ffffff',.08),x,y,.6,30.4); R(g,rgba('#000000',.25),x,y+29.8,30.4,.6); }
  },6,901);
  const ceil=P2(64,64,(g,w,h)=>{ /* woven ajiro panels between the beams */ vfill(g,0,0,w,h,[[0,'#b08a58'],[1,'#94704a']]);
    for(let y=0;y<h;y+=4) for(let x=0;x<w;x+=4){ const d=((x+y)>>2)%2; vfill(g,x+.3,y+.3,3.4,3.4,d?[[0,'#c49c66'],[1,'#a07a4c']]:[[0,'#a07a4c'],[1,'#8a6640']]); R(g,rgba('#000000',.18),x,y+3.6,4,.4); }
    izAO(g,0,0,w,h,.35,4); },6,902);
  const plaster=P2(64,64,(g,w,h)=>{ const r=rng(903); vfill(g,0,0,w,h,[[0,'#ecdcb6'],[1,'#e2cfa4']]);
    for(let i=0;i<60;i++) ell(g,r()*w,r()*h,2+r()*4,1.5+r()*3,rgba(r()<.5?'#c8ae7c':'#f6ead0',.14));
    for(let i=0;i<260;i++) R(g,rgba(r()<.5?'#a88a5a':'#fff8e8',.3),r()*w,r()*h,.5,.5);
    g.lineCap='round'; for(let i=0;i<70;i++){ const x=r()*w,y=r()*h,a=r()*Math.PI,l=1.5+r()*3; g.strokeStyle=rgba(r()<.6?'#b89a5a':'#8a6a3a',.45); g.lineWidth=.35; g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); g.stroke(); } },4,903);
  const dado=P2(64,64,(g,w,h)=>{ for(let k=0;k<4;k++) izWood(g,k*16,0,16,h,'#7a4a2c','#4a2a18',904+k,true,{knots:k%2}); for(let k=0;k<4;k++){ R(g,'#2a1a10',k*16,0,.6,h); } },4,904);
  /* ---------- the lit atlas ---------- */
  const A=izAtlas(256,320,4,[
    ['cedarTop',64,32,(g,w,h)=>{ /* straight-grained cedar, two boards: fine crisp lines, a soft sheen, a dark seam */
      for(const [y0,c,sd] of [[0,'#caa882',911],[16,'#c2a078',917]]){ vfill(g,0,y0,w,16,[[0,mix(c,'#ffffff',.12)],[.6,c],[1,mix(c,'#000000',.1)]]); const r=rng(sd);
        for(let i=0;i<40;i++){ const y=y0+.5+r()*15, a=.2+r()*.5, f=.02+r()*.06, ph=r()*6; g.strokeStyle=rgba(r()<.72?'#6a4428':'#f2dcb4',.16+r()*.24); g.lineWidth=.2+r()*.35; g.beginPath(); for(let x=0;x<=w;x+=2){ const yy=y+Math.sin(x*f+ph)*a; x?g.lineTo(x,yy):g.moveTo(x,yy); } g.stroke(); }
        for(let i=0;i<2;i++){ const x=r()*w, y=y0+3+r()*10; ell(g,x,y,2.4,.9,rgba('#6a4428',.35)); ell(g,x,y,1,.4,rgba('#3a2010',.4)); }
        R(g,rgba('#ffffff',.16),0,y0+.4,w,.5); }
      R(g,rgba('#2a1608',.6),0,15.6,w,.7); g.fillStyle=grad(g,0,0,w,0,[[0,'rgba(255,245,225,0)'],[.4,'rgba(255,245,225,0.12)'],[.6,'rgba(255,245,225,0)']]); g.fillRect(0,0,w,h); }],
    ['cedarFront',32,32,(g,w,h)=>{ for(let k=0;k<4;k++) izWood(g,k*8,0,8,h,['#b08458','#a87c50','#b48a5c','#a6784c'][k],'#6e4a2a',912+k,true,{knots:0}); R(g,'#3a2414',0,h-3,w,3); R(g,rgba('#ffffff',.2),0,0,w,.8); }],
    ['timber',32,32,(g,w,h)=>izWood(g,0,0,w,h,'#4a3424','#22160e',913,false,{dens:.6})],
    ['timberV',32,32,(g,w,h)=>izWood(g,0,0,w,h,'#4a3424','#22160e',914,true,{dens:.6})],
    ['midwood',32,32,(g,w,h)=>izWood(g,0,0,w,h,'#9a6438','#62381c',915)],
    ['hinoki',32,32,(g,w,h)=>izWood(g,0,0,w,h,'#ecd4a6','#c8a676',916,false,{knots:0})],
    ['lacquer',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#4a140e'],[1,'#220604']]); g.fillStyle=grad(g,0,0,w,h,[[0,'rgba(255,255,255,0)'],[.45,'rgba(255,220,200,0.18)'],[.55,'rgba(255,255,255,0)']]); g.fillRect(0,0,w,h); R(g,'#c89a3a',0,0,w,.8); R(g,'#c89a3a',0,h-.8,w,.8); }],
    ['zabuB',32,32,(g,w,h)=>{ izCloth(g,0,0,w,h,'#2a3a6a',921); g.strokeStyle='#e8dcc0'; g.lineWidth=.8; g.strokeRect(2,2,w-4,h-4); for(let k=0;k<6;k++) izBlossom(g,6+k*4,8+((k*7)%14),1.6,rgba('#e8dcc0',.6),'#2a3a6a'); ell(g,16,16,2,2,'#e8dcc0'); ell(g,16,16,1,1,'#1a2448'); izAO(g,0,0,w,h,.35,3); }],
    ['zabuR',32,32,(g,w,h)=>{ izCloth(g,0,0,w,h,'#8a2a22',922); g.strokeStyle='#f2c26a'; g.lineWidth=.8; g.strokeRect(2,2,w-4,h-4); for(let y=6;y<h-4;y+=6) for(let x=6;x<w-4;x+=6) ell(g,x,y,.8,.8,rgba('#f2c26a',.5)); ell(g,16,16,2,2,'#f2c26a'); izAO(g,0,0,w,h,.35,3); }],
    ['stoolTop',32,32,(g,w,h)=>{ R(g,'#3a120e',0,0,w,h); radial(g,16,16,16,[[0,'#c43a2a'],[.7,'#8a2018'],[1,'#3a0e0a']]); ell(g,11,10,5,3,rgba('#ffd8c8',.28)); g.strokeStyle=rgba('#2a0806',.6); g.lineWidth=.6; g.beginPath(); g.arc(16,16,12.5,0,Math.PI*2); g.stroke(); }],
    ['norenN',48,48,(g,w,h)=>{ for(let k=0;k<3;k++){ izCloth(g,k*16,0,16,h,'#1e2a4e',931+k); R(g,'#16203c',k*16,0,16,4); R(g,rgba('#000000',.3),k*16+15.4,0,.6,h); R(g,rgba('#ffffff',.08),k*16,0,.6,h); }
      g.fillStyle='#ece4d0'; g.beginPath(); g.arc(24,24,9,0,Math.PI*2); g.fill(); izBlossom(g,24,24,6.5,'#1e2a4e','#ece4d0'); izBlossom(g,24,24,2.6,'#ece4d0','#1e2a4e');
      izWrite(g,8,14,2,7,'#ece4d0',41); izWrite(g,40,14,2,7,'#ece4d0',57); }],
    ['norenR',48,48,(g,w,h)=>{ for(let k=0;k<3;k++){ izCloth(g,k*16,0,16,h,'#9a2a1e',934+k); R(g,'#7a1e14',k*16,0,16,4); R(g,rgba('#000000',.3),k*16+15.4,0,.6,h); R(g,rgba('#ffffff',.08),k*16,0,.6,h); }
      for(let k=0;k<3;k++) izGlyph(g,8+k*16,24,11,'#f2e8d4',71+k*5,1.1); }],
    ['tatami',64,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c8c07a'],[1,'#a8a060']]); const r=rng(941); for(let x=0;x<w;x+=.9) R(g,rgba(r()<.5?'#6a6a30':'#e8e0a0',.18),x,3,.45,h-6);
      for(let x=0;x<w;x+=8) R(g,rgba('#6a6430',.12),x,3,.4,h-6); R(g,'#2a3424',0,0,w,3); R(g,'#2a3424',0,h-3,w,3); R(g,rgba('#d8d0a8',.5),0,.8,w,.4); R(g,rgba('#d8d0a8',.5),0,h-2.2,w,.4); izAO(g,0,0,w,h,.2,2); }],
    ['jacketA',24,40,(g,w,h)=>izJacket(g,w,h,'#2e3034',951)],
    ['jacketB',24,40,(g,w,h)=>izJacket(g,w,h,'#2a3046',952)],
    ['jacketC',24,40,(g,w,h)=>izJacket(g,w,h,'#4a4a4e',953)],
    ['brief',32,24,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#6a3e22'],[1,'#3a200e']]); R(g,rgba('#000000',.3),0,6,w,.6); g.strokeStyle=rgba('#e8c890',.35); g.lineWidth=.4; g.setLineDash([1,1]); g.strokeRect(1.5,1.5,w-3,h-3); g.setLineDash([]); R(g,'#d4ad5a',6,5,3,3); R(g,'#d4ad5a',w-9,5,3,3); R(g,rgba('#ffffff',.25),0,0,w,.6); izAO(g,0,0,w,h,.3,2); }],
    ['taruSide',64,40,(g,w,h)=>{ /* straw-wrapped sake barrel with a painted brand panel */ vfill(g,0,0,w,h,[[0,'#ece0b8'],[.5,'#dccc9a'],[1,'#b8a670']]); const r=rng(961);
      for(let x=0;x<w;x+=.8) R(g,rgba(r()<.5?'#a89660':'#fff6d8',.25),x,0,.4,h); for(const y of [3,h-4]){ R(g,'#6a4a2a',0,y,w,1.6); for(let x=0;x<w;x+=2) R(g,'#8a6a3a',x,y,1,1.6); }
      for(const y of [h*.3,h*.68]) R(g,rgba('#5a3a1a',.5),0,y,w,.8);
      const px=8,pw=22; vfill(g,px,7,pw,h-14,[[0,'#f6efe0'],[1,'#e0d6c0']]); g.strokeStyle='#b8241c'; g.lineWidth=1.2; g.strokeRect(px+1.5,8.5,pw-3,h-17); ell(g,px+pw/2,15,5,5,'#b8241c'); izGlyph(g,px+pw/2,15,6,'#f6efe0',81); izWrite(g,px+pw/2,24,2,5,'#1a1410',83);
      const px2=40; vfill(g,px2,7,pw,h-14,[[0,'#f6efe0'],[1,'#e0d6c0']]); R(g,'#1a1410',px2,7,pw,4); izWrite(g,px2+pw/2,17,3,6,'#1a1410',87); ell(g,px2+5,h-11,2.5,2.5,'#b8241c'); }],
    ['taruTop',32,32,(g,w,h)=>{ R(g,'#6a4a2a',0,0,w,h); radial(g,16,16,16,[[0,'#d8b880'],[.8,'#b08a58'],[.92,'#6a4a2a'],[1,'#4a3018']]); for(let k=-3;k<=3;k++) R(g,rgba('#7a5a34',.4),4,16+k*3.2,24,.5); R(g,'#8a6a3a',15,2,2,28); R(g,'#8a6a3a',2,15,28,2); }],
    ['crateSide',32,24,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f2c230'],[1,'#c89414']]); R(g,'#a87a10',0,h-2,w,2); for(let x=3;x<w-3;x+=7) vfill(g,x,9,5,10,[[0,'#8a6008'],[1,'#b88a14']]); vfill(g,10,3,12,4,[[0,'#6a4806'],[1,'#a87a10']]); izWrite(g,4,4,1,3,'#b8241c',91,false); R(g,rgba('#ffffff',.3),0,0,w,.8); }],
    ['crateSideR',32,24,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c8302a'],[1,'#8a1a14']]); R(g,'#6a1410',0,h-2,w,2); for(let x=3;x<w-3;x+=7) vfill(g,x,9,5,10,[[0,'#4a0a08'],[1,'#7a1610']]); vfill(g,10,3,12,4,[[0,'#3a0806'],[1,'#6a1410']]); R(g,rgba('#ffffff',.25),0,0,w,.8); }],
    ['crateTop',32,32,(g,w,h)=>{ R(g,'#2a1a08',0,0,w,h); for(let y=0;y<4;y++) for(let x=0;x<5;x++){ const cx=3.5+x*6.2,cy=4+y*8; radial(g,cx,cy,3.4,[[0,'#8a5a20'],[.7,'#4a2a0a'],[1,'#1a0e04']]); ell(g,cx,cy,1.6,1.6,(x+y)%3?'#d4ad5a':'#c8302a'); ell(g,cx-.5,cy-.5,.6,.6,rgba('#ffffff',.6)); } g.strokeStyle='#d8a820'; g.lineWidth=1.4; g.strokeRect(.7,.7,w-1.4,h-1.4); }],
    ['bottleBeer',16,32,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#2a1406'],[.3,'#7a4a14'],[.45,'#c88a3a'],[.6,'#6a3a10'],[1,'#2a1406']]); vfill(g,0,14,w,12,[[0,'#f2ece0'],[1,'#d8d0c0']]); R(g,'#b8241c',0,15,w,3); izGlyph(g,4,21,4,'#1a1410',101); izGlyph(g,12,21,4,'#1a1410',102); R(g,'#d4ad5a',0,0,w,2); R(g,rgba('#ffffff',.5),4,3,1,10); }],
    ['bottleSake',16,32,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#0e2a14'],[.3,'#2a6a34'],[.45,'#6ab070'],[.6,'#1e5a28'],[1,'#0e2a14']]); vfill(g,1,11,w-2,16,[[0,'#f6f0e2'],[1,'#e2d8c4']]); izWrite(g,8,14,2,5,'#1a1410',111); R(g,'#b8241c',2,24,w-4,1.5); R(g,'#1a1410',0,0,w,3); R(g,rgba('#ffffff',.45),4,4,1,6); }],
    ['bottleSake2',16,32,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#2a1a0a'],[.3,'#6a4a20'],[.45,'#b08a50'],[.6,'#5a3a14'],[1,'#2a1a0a']]); vfill(g,1,10,w-2,17,[[0,'#2a2420'],[1,'#141210']]); izWrite(g,8,13,2,5,'#e8c060',121); ell(g,8,25,2,2,'#b8241c'); R(g,'#e8dcc0',0,0,w,3); R(g,rgba('#ffffff',.45),4,4,1,5); }],
    ['tokkuri',16,32,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#c8c4b8'],[.4,'#f6f2ea'],[1,'#b8b4a8']]); for(let k=0;k<3;k++){ g.strokeStyle='#2a4a8a'; g.lineWidth=.7; g.beginPath(); g.moveTo(0,16+k*3); for(let x=0;x<=w;x+=2) g.lineTo(x,16+k*3+Math.sin(x*.8+k)*1); g.stroke(); } izBlossom(g,8,9,2.2,'#2a4a8a','#f6f2ea'); }],
    ['beerMug',16,32,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#a86a10'],[.35,'#f2b830'],[.5,'#ffd870'],[.7,'#e0a020'],[1,'#a86a10']]); vfill(g,0,0,w,7,[[0,'#ffffff'],[1,'#f2ead0']]); const r=rng(131); for(let i=0;i<14;i++) R(g,rgba('#fff4c0',.7),r()*w,8+r()*20,.5,.5); R(g,rgba('#ffffff',.6),3,8,1,20); }],
    ['glassTea',16,32,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#5a3a10'],[.4,'#c88a3a'],[.5,'#e8b060'],[1,'#6a4214']]); vfill(g,0,0,w,8,[[0,'#d8e8ec'],[1,'#b8c8cc']]); R(g,rgba('#ffffff',.6),3,2,1,26); }],
    ['food',96,16,(g,w,h)=>{ /* six dishes seen from above, each on its plate */
      const plate=(cx,c1,c2)=>{ radial(g,cx,8,8,[[0,c1],[.82,c2],[.9,mix(c2,'#000000',.2)],[1,mix(c2,'#000000',.4)]]); };
      plate(8,'#f2eee4','#d8d2c4'); for(let k=0;k<3;k++){ g.save(); g.translate(8,8); g.rotate(-.5+k*.35); R(g,'#e8dcc0',-6,-.3+k*0,12,.6); for(let j=0;j<4;j++) ell(g,-3.5+j*2.4,0,1.2,1,['#8a4a1a','#a85a24','#3a6a2a','#8a4a1a'][j]); g.restore(); }
      plate(24,'#2a4a6a','#1a2a4a'); for(let k=0;k<22;k++){ const a=k*2.4,d=1+(k%5)*1.1; ell(g,24+Math.cos(a)*d,8+Math.sin(a)*d,1.3,.8,k%3?'#6aa040':'#8ac050'); }
      plate(40,'#e8e4dc','#c8c0b4'); for(let k=0;k<5;k++) ell(g,37+k*1.6,7+k*.5,1.6,2.6,k%2?'#e86a5a':'#f28a6a'); ell(g,43,10,2,1.4,'#7aa040'); ell(g,36.5,10.5,1.6,1.6,'#f2f2ea');
      plate(56,'#f2eee4','#d0c8b8'); for(let k=0;k<5;k++) ell(g,53+(k%3)*2.6,6+(k>>1)*2.8,2,1.7,k%2?'#c8862a':'#a86a1a'); ell(g,60,10,1.8,1.2,'#f2e24a'); R(g,'#5a8a3a',51,10,3,1);
      plate(72,'#3a2a20','#24180e'); for(let k=0;k<3;k++){ vfill(g,67,4+k*2.6,10,2.4,[[0,'#f6d860'],[1,'#e2b030']]); } R(g,'#e8dcc0',68,12,6,1.2);
      plate(88,'#f2eee4','#d8d2c4'); for(let k=0;k<5;k++){ g.save(); g.translate(84.5+k*1.8,8); g.rotate(.3); ell(g,0,0,1.3,2.8,'#e8c890'); ell(g,0,-1,1,1.2,'#c8964a'); g.restore(); } ell(g,92,11,1.6,1.2,'#5a2a14'); }],
    ['plaques',64,40,(g,w,h)=>{ /* hanging menu plaques: pale wood, brush lettering, a red price chit */ for(let k=0;k<8;k++){ const x=k*8; izWood(g,x+.3,0,7.4,h,'#f0dcb0','#d4b884',171+k,true,{knots:0}); izWrite(g,x+4,6,3+(k%2),5.6,'#1a1410',173+k*7); R(g,'#b8241c',x+1.6,h-9,4.8,6); izGlyph(g,x+4,h-6,3.6,'#f6efe0',179+k); } }],
    ['strips',64,32,(g,w,h)=>{ /* paper menu strips pinned in a row */ for(let k=0;k<8;k++){ const x=k*8, c=['#f6f0e0','#f2e28a','#f6f0e0','#f8c8b0'][k%4]; vfill(g,x+.4,0,7.2,h,[[0,mix(c,'#ffffff',.2)],[1,mix(c,'#c8b088',.25)]]); izWrite(g,x+4,5,3,5,k%3?'#1a1410':'#b8241c',191+k*5); izGlyph(g,x+4,h-5,3.4,'#b8241c',199+k); R(g,'#2a2a2a',x+3.5,.6,1,1); } }],
    ['posterBeer',32,48,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f2c230'],[1,'#e88a1a']]); radial(g,16,20,16,[[0,'rgba(255,250,220,0.8)'],[1,'rgba(255,250,220,0)']]);
      vfill(g,10,10,12,22,[[0,'#ffe080'],[1,'#d88a10']]); vfill(g,10,8,12,4,[[0,'#ffffff'],[1,'#f0e8d0']]); R(g,rgba('#ffffff',.6),12,13,1.4,17); g.strokeStyle='#b06a10'; g.lineWidth=1.2; g.beginPath(); g.arc(23,20,4,-1.2,1.2); g.stroke();
      R(g,'#b8241c',0,34,w,10); izWrite(g,5,39,4,6,'#f6efe0',211,false); izWrite(g,4,4,1,6,'#b8241c',219); R(g,rgba('#000000',.3),0,h-1,w,1); }],
    ['posterSake',32,48,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#1e2a4e'],[1,'#121a30']]); ell(g,22,12,7,7,'#e84a3a');
      g.fillStyle='#e8f0f4'; for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(0,30+k*5); for(let x=0;x<=w;x+=2) g.lineTo(x,30+k*5-Math.abs(Math.sin(x*.25+k))*4); g.lineTo(w,h); g.lineTo(0,h); g.closePath(); g.fillStyle=k%2?'#2a4a7a':'#e8f0f4'; g.fill(); }
      izWrite(g,6,6,4,6,'#f2e8d4',231); izGlyph(g,26,40,5,'#b8241c',239); }],
    ['calendar',24,32,(g,w,h)=>{ R(g,'#f6f2ea',0,0,w,h); vfill(g,1,1,w-2,13,[[0,'#a8d0e8'],[1,'#e8f0f4']]); R(g,'#4a2e26',4,8,1,6); for(let k=0;k<12;k++) ell(g,5+((k*7)%14),5+((k*5)%7),1.4,1.4,k%2?'#f2a0b8':'#ffd0dc'); izGlyph(g,18,4,4,'#b8241c',241);
      for(let y=0;y<5;y++) for(let x=0;x<7;x++) R(g,x===6?'#b8241c':'#3a3a3a',2+x*3,17+y*3,1.4,1.4); R(g,'#2a2a2a',11,0,2,1); }],
    ['kanban',96,24,(g,w,h)=>{ izWood(g,0,0,w,h,'#5a3a22','#2a180c',251,false,{knots:2}); R(g,rgba('#000000',.35),2,2,w-4,h-4); izWood(g,3,3,w-6,h-6,'#6a4428','#3a2212',252,false,{knots:1,edge:false});
      for(const x of [14,82]){ ell(g,x,12,7,7,'#f2a0b8'); izBlossom(g,x,12,5,'#ffd0dc','#c8406a'); }
      for(let k=0;k<4;k++) izGlyph(g,31+k*11.5,12,10,'#f2e2b0',253+k*3,1.25); R(g,'#d4ad5a',0,0,w,.8); R(g,'#d4ad5a',0,h-.8,w,.8); }],
    ['shoji',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f6efdc'],[1,'#e2d6ba']]); for(let x=0;x<=w;x+=8) R(g,'#7a5434',x-.5,0,1,h); for(let y=0;y<=h;y+=6.4) R(g,'#7a5434',0,y-.5,w,1); R(g,'#4a3020',0,0,w,1.5); R(g,'#4a3020',0,h-1.5,w,1.5); R(g,'#4a3020',0,0,1.5,h); R(g,'#4a3020',w-1.5,0,1.5,h); }],
    ['getabako',32,32,(g,w,h)=>{ /* shoe lockers: little wooden doors with numbered tags */ R(g,'#3a2414',0,0,w,h); for(let y=0;y<4;y++) for(let x=0;x<4;x++){ izWood(g,x*8+.5,y*8+.5,7,7,'#b8844a','#8a5a2e',261+x+y*4,false,{knots:0}); R(g,'#f2e8d0',x*8+2.5,y*8+2,3,3.4); izGlyph(g,x*8+4,y*8+3.7,2.6,'#1a1410',263+x*5+y); R(g,'#2a2a2a',x*8+3.6,y*8+6,.8,.8); } }],
    ['jacketTie',8,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a4a8a'],[1,'#1a2a5a']]); for(let y=-4;y<h;y+=4){ g.strokeStyle=rgba('#c8302a',.8); g.lineWidth=.8; g.beginPath(); g.moveTo(0,y); g.lineTo(w,y+4); g.stroke(); } }],
    ['byobu',96,40,(g,w,h)=>{ /* gold-leaf folding screen: an old sakura over a stream */ vfill(g,0,0,w,h,[[0,'#f0d27a'],[1,'#d4ac4a']]); const r=rng(271); for(let y=0;y<h;y+=6) for(let x=((y/6)%2)*6;x<w;x+=12) R(g,rgba('#fff4c0',.12),x,y,6,6);
      g.fillStyle='#4a8ab0'; g.beginPath(); g.moveTo(0,h); g.quadraticCurveTo(30,h-14,48,h-8); g.quadraticCurveTo(70,h-2,96,h-12); g.lineTo(96,h); g.closePath(); g.fill(); g.strokeStyle='#e8f0f4'; g.lineWidth=.6; for(let k=0;k<4;k++){ g.beginPath(); g.moveTo(10+k*20,h-3); g.quadraticCurveTo(16+k*20,h-6,22+k*20,h-3); g.stroke(); }
      g.strokeStyle='#3a2418'; g.lineCap='round'; g.lineWidth=3.5; g.beginPath(); g.moveTo(8,h); g.quadraticCurveTo(14,20,36,14); g.quadraticCurveTo(56,10,78,4); g.stroke(); g.lineWidth=1.6; g.beginPath(); g.moveTo(30,15); g.quadraticCurveTo(36,26,52,28); g.moveTo(56,9); g.quadraticCurveTo(66,16,84,18); g.stroke();
      for(let i=0;i<70;i++){ const t=r(); const x=10+t*80+(r()-.5)*14, y=4+t*-2+12+(r()-.5)*18; izBlossom(g,x,Math.max(3,y),1.1+r()*.9,r()<.5?'#f6b8c8':'#fde0e8',r()<.5?'#d0507a':'#c8406a'); }
      for(let k=1;k<4;k++) R(g,rgba('#000000',.25),k*24-.4,0,.8,h); R(g,'#2a1a10',0,0,w,1.2); R(g,'#2a1a10',0,h-1.2,w,1.2); }],
    ['catFace',16,16,(g,w,h)=>{ R(g,'#f6f2ea',0,0,w,h); ell(g,4.5,7,1.5,1.8,'#1a1410'); ell(g,11.5,7,1.5,1.8,'#1a1410'); ell(g,4.9,6.4,.5,.5,'#ffffff'); ell(g,11.9,6.4,.5,.5,'#ffffff'); ell(g,8,9.6,1.1,.8,'#e86a7a');
      g.strokeStyle='#1a1410'; g.lineWidth=.5; g.beginPath(); g.moveTo(8,10.2); g.quadraticCurveTo(6.8,11.8,5.6,11); g.moveTo(8,10.2); g.quadraticCurveTo(9.2,11.8,10.4,11); for(const s of [-1,1]) for(let k=0;k<2;k++){ g.moveTo(8+s*3.5,9.5+k); g.lineTo(8+s*7.5,9+k*1.6); } g.stroke(); ell(g,2,13,1.5,1,rgba('#f2a0b0',.6)); ell(g,14,13,1.5,1,rgba('#f2a0b0',.6)); }],
    ['catBody',16,24,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f6f2ea'],[1,'#d8d2c4']]); R(g,'#c8302a',0,1,w,2.4); ell(g,8,5,1.8,1.8,'#e8c040'); ell(g,7.5,4.5,.6,.6,'#fff4c0'); vfill(g,3,10,10,8,[[0,'#f2d060'],[1,'#c8a030']]); R(g,'#a87a20',3,10,10,.6); izWrite(g,8,13,1,4,'#6a4a10',281); for(const x of [2,12]) ell(g,x,h-2,1.8,1.2,rgba('#f2a0b0',.7)); }],
    ['basket',32,16,(g,w,h)=>{ /* the robata display: bamboo baskets of vegetables and fish on ice, from above */ R(g,'#8a6a3a',0,0,w,h);
      for(let y=0;y<h;y+=1.2) R(g,rgba('#5a4220',.5),0,y,w,.4); for(let k=0;k<2;k++){ const x=k*16; vfill(g,x+1,1,14,14,[[0,'#c8a868'],[1,'#a88848']]); for(let yy=1;yy<15;yy+=1.5) R(g,rgba('#6a5028',.4),x+1,yy,14,.5); }
      for(let k=0;k<5;k++){ ell(g,4+k*2,6+(k%2)*3,1.6,3.2,['#e8e0d0','#7a4a8a','#3a7a2a','#e8a030','#c84a2a'][k]); } R(g,'#4a8a2a',3,12,10,1.4); R(g,'#f2e8e0',3,13.5,10,1);
      R(g,'#d8eef4',17,1,14,14); for(let k=0;k<3;k++){ g.save(); g.translate(24,4+k*4); g.rotate(.15); ell(g,0,0,5.5,1.4,'#6a7a8a'); ell(g,-1,-.4,4,.5,'#c8d4dc'); ell(g,-4.6,0,.5,.5,'#1a1a1a'); poly(g,[[5,0],[7,-1.3],[7,1.3]],'#5a6a7a'); g.restore(); } }],
    ['copper',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c87a44'],[.5,'#a85a2a'],[1,'#6a3416']]); const r=rng(291); for(let i=0;i<60;i++) ell(g,r()*w,r()*h,1.2,1.2,rgba(r()<.5?'#e8a070':'#5a2a10',.22)); for(let i=0;i<5;i++) R(g,rgba('#4a8a6a',.3),r()*w,h*.6+r()*h*.4,1.2,4); R(g,rgba('#ffd0a0',.4),0,0,w,.8); izAO(g,0,0,w,h,.25,2); }],
    ['tiles',32,32,(g,w,h)=>{ R(g,'#d8d0c0',0,0,w,h); const r=rng(295); for(let y=0;y<4;y++) for(let x=0;x<4;x++){ const c=(x+y)%3===0?'#3a5a8a':['#efe8d8','#e6dece','#f2ecdc','#e2d8c6'][(x*3+y*5+(r()*2|0))%4]; vfill(g,x*8+.5,y*8+.5,7,7,[[0,mix(c,'#ffffff',.25)],[.5,c],[1,mix(c,'#000000',.2)]]); R(g,rgba('#ffffff',.45),x*8+1.3,y*8+1.2,3,.6); R(g,rgba('#ffffff',.25),x*8+1.2,y*8+1.2,.6,2.5); } }],
    ['sugi',32,32,(g,w,h)=>{ /* a cedar-needle ball: dense green tufts, dry tips */ vfill(g,0,0,w,h,[[0,'#5a7a3a'],[1,'#2e4a22']]); const r=rng(297); g.lineCap='round'; for(let i=0;i<420;i++){ const x=r()*w,y=r()*h,a=r()*Math.PI*2,l=1+r()*1.6; g.strokeStyle=r()<.15?'#a8945a':r()<.5?'#6a8a44':'#3a5a2a'; g.lineWidth=.45; g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); g.stroke(); } }],
    ['steel',16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c8ccd0'],[.5,'#9aa0a6'],[1,'#6a7076']]); R(g,rgba('#ffffff',.4),0,0,w,.6); for(let y=2;y<h;y+=3) R(g,rgba('#ffffff',.08),0,y,w,.5); }],
    ['sudare',32,32,(g,w,h)=>{ /* bamboo blind */ for(let y=0;y<h;y+=1.6){ vfill(g,0,y,w,1.2,[[0,'#d8b878'],[1,'#a8884a']]); R(g,'#2a1a0a',0,y+1.2,w,.4); } for(const x of [5,16,27]) R(g,'#5a3a1a',x,0,.8,h); R(g,'#3a6a3a',0,0,w,2.4); R(g,'#3a6a3a',0,h-2.4,w,2.4); }],
    ['scroll',16,48,(g,w,h)=>{ R(g,'#3a5a4a',0,0,w,h); vfill(g,2,5,12,38,[[0,'#f2ead4'],[1,'#e0d4b4']]); g.strokeStyle='#3a2a20'; g.lineWidth=.9; g.beginPath(); g.moveTo(3,40); g.quadraticCurveTo(8,26,13,18); g.stroke(); for(let k=0;k<8;k++) izBlossom(g,6+((k*5)%8),18+((k*7)%18),1,'#f2a0b8','#c8406a'); izWrite(g,11,8,2,3.6,'#1a1410',301); R(g,'#2a1a10',0,0,w,2); R(g,'#2a1a10',0,h-2.5,w,2.5); }],
    ['register',16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8d4c8'],[1,'#a8a498']]); R(g,'#1a2a1a',2,2,12,4); text(g,'1280',3,2.5,'#7cf06a',.6); for(let y=0;y<3;y++) for(let x=0;x<4;x++) R(g,x===3?'#c8302a':'#f2f0e8',2+x*3.2,8+y*2.6,2.4,1.9); }],
    ['ashtray',16,16,(g,w,h)=>{ R(g,'#5a5a5e',0,0,w,h); radial(g,8,8,8,[[0,'#8a8a8e'],[.6,'#5a5a5e'],[.75,'#c8ccd0'],[1,'#6a6a6e']]); for(let k=0;k<3;k++){ g.save(); g.translate(8,8); g.rotate(k*2.1); R(g,'#f2ece0',0,-.5,4,1); R(g,'#c87a3a',3.2,-.5,.9,1); g.restore(); } ell(g,7,9,1.6,1,rgba('#2a2a2a',.6)); }],
    ['newspaper',32,24,(g,w,h)=>{ R(g,'#e8e2d2',0,0,w,h); for(let k=0;k<5;k++) for(let j=0;j<6;j++) R(g,'#5a5a5a',2+k*6,3+j*3.4,4.6,.7); izWrite(g,27,4,3,4,'#1a1410',311); R(g,'#8a8a8a',2,13,9,8); R(g,rgba('#000000',.15),w/2-.3,0,.6,h); }],
    ['daruma',16,16,(g,w,h)=>{ R(g,'#c8241c',0,0,w,h); ell(g,8,7,5,4.6,'#f6efe0'); ell(g,6,7,1.4,1.4,'#f6efe0'); g.strokeStyle='#1a1410'; g.lineWidth=.8; g.beginPath(); g.arc(5.6,7,1.2,0,Math.PI*2); g.stroke(); ell(g,10.4,7,1.3,1.3,'#1a1410'); R(g,'#1a1410',4,4,3,.7); R(g,'#1a1410',9,4,3,.7); izGlyph(g,8,13,3.5,'#f2d060',321); }],
  ],{grain:3,seed:910});
  /* ---------- the glowing atlas (unlit) ---------- */
  const lantern=(g,w,h,base,ink,seed,pale)=>{ hfill(g,0,0,w,h,[[0,mix(base,'#000000',.35)],[.25,base],[.5,mix(base,'#000000',.2)],[.75,base],[1,mix(base,'#000000',.35)]]);
    vfill(g,0,0,w,h,[[0,'rgba(0,0,0,0.35)'],[.2,'rgba(0,0,0,0)'],[.5,rgba(pale?'#fff8e0':'#ffd890',.35)],[.8,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.4)']]);
    for(let y=4;y<h-3;y+=2.2) R(g,rgba('#000000',.16),0,y,w,.5);
    for(const cx of [w*.25,w*.75]){ izGlyph(g,cx,h*.38,9,ink,seed,1.15); izGlyph(g,cx,h*.64,8,ink,seed+5,1.1); }
    R(g,'#140c08',0,0,w,3.2); R(g,'#140c08',0,h-3.2,w,3.2); R(g,'#d4ad5a',0,3.2,w,.6); R(g,'#d4ad5a',0,h-3.8,w,.6); };
  const GA=izAtlas(128,128,4,[
    ['lanR',32,40,(g,w,h)=>lantern(g,w,h,'#e8402a','#1a0e0a',401)],
    ['lanR2',32,40,(g,w,h)=>lantern(g,w,h,'#d8301e','#1a0e0a',431)],
    ['lanW',32,40,(g,w,h)=>lantern(g,w,h,'#fff0d0','#c8241c',411,true)],
    ['lanCap',16,16,(g,w,h)=>{ R(g,'#140c08',0,0,w,h); ell(g,8,8,7,7,'#2a1a10'); ell(g,8,8,3,3,'#ffd890'); }],
    ['embers',32,16,(g,w,h)=>{ R(g,'#1a0a04',0,0,w,h); const r=rng(421); for(let i=0;i<50;i++){ const x=r()*w,y=r()*h; radial(g,x,y,2.6,[[0,r()<.6?'#ffb040':'#ff6a1a'],[.6,'rgba(200,40,0,0.6)'],[1,'rgba(40,10,0,0)']]); } for(let i=0;i<30;i++) ell(g,r()*w,r()*h,1.2,.8,rgba('#2a2420',.7)); }],
    ['tv',32,24,(g,w,h)=>{ /* a ball game on the TV: green field, a scoreboard bug */ vfill(g,0,0,w,h,[[0,'#3a7a3a'],[1,'#2a6a2a']]); g.fillStyle='#c8a060'; g.beginPath(); g.moveTo(16,8); g.lineTo(26,16); g.lineTo(16,24); g.lineTo(6,16); g.closePath(); g.fill(); for(const [x,y] of [[16,9],[25,16],[7,16],[16,22]]) R(g,'#f2f2ea',x-.6,y-.6,1.2,1.2);
      for(const [x,y,c] of [[16,15,'#f2f2ea'],[12,19,'#1e2a6a'],[21,12,'#c8302a'],[9,11,'#c8302a']]){ R(g,c,x,y,1.2,2.4); ell(g,x+.6,y-.4,.6,.6,'#e8c8a0'); } R(g,'#0a0a1a',1,1,14,5); text(g,'3-2',2,1.5,'#f2c230',.8); R(g,'#f2f2ea',1,h-4,w-2,3); izWrite(g,3,h-2.5,6,2.4,'#1a1a1a',441,false); R(g,rgba('#ffffff',.18),0,0,w,h*.45); }],
    ['fridge',24,48,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8f4f8'],[1,'#c8dce4']]); const r=rng(451); for(let s=0;s<4;s++){ const y=4+s*11; R(g,'#a8b8c0',1,y+9,w-2,1); for(let k=0;k<6;k++){ const c=['#c8302a','#2a6ad8','#f2c230','#f2f2ea','#2a9a5a','#7a4a14'][(k+s*2)%6]; vfill(g,2+k*3.4,y+(s%2?2:0),2.6,s%2?7:9,[[0,mix(c,'#ffffff',.2)],[1,c]]); R(g,'#e8e8e8',2+k*3.4,y+(s%2?2:0),2.6,1); } } R(g,rgba('#ffffff',.35),2,0,2,h); R(g,'#c8302a',0,0,w,3); izWrite(g,4,1.5,5,2.6,'#ffffff',461,false); }],
    ['shojiLit',32,32,(g,w,h)=>{ radial(g,16,16,24,[[0,'#fff8e8'],[1,'#f2e2c0']]); for(let x=0;x<=w;x+=8) R(g,'#6a4a2e',x-.5,0,1,h); for(let y=0;y<=h;y+=6.4) R(g,'#6a4a2e',0,y-.5,w,1); R(g,'#3a2414',0,0,w,1.6); R(g,'#3a2414',0,h-1.6,w,1.6); R(g,'#3a2414',0,0,1.6,h); R(g,'#3a2414',w-1.6,0,1.6,h); }],
    ['glowWarm',16,16,(g,w,h)=>{ radial(g,8,8,10,[[0,'#fff4d0'],[1,'#ffc070']]); }],
    ['bulb',16,16,(g,w,h)=>{ radial(g,8,8,9,[[0,'#ffffff'],[.5,'#ffe8a0'],[1,'#ffa040']]); }],
  ]);
  /* ---------- cut-outs (alpha): sakura sprays to hang along the beams ---------- */
  const KA=izAtlas(64,32,4,[
    ['spray',64,16,(g,w,h)=>{ const r=rng(501); g.strokeStyle='#4a2e22'; g.lineCap='round'; g.lineWidth=1.1; g.beginPath(); g.moveTo(0,4); g.quadraticCurveTo(20,9,32,6); g.quadraticCurveTo(46,3,64,7); g.stroke();
      g.lineWidth=.6; for(let k=0;k<9;k++){ const x=4+k*7; g.beginPath(); g.moveTo(x,5+Math.sin(k)*1.5); g.lineTo(x+3*(k%2?1:-1),11+(k%3)); g.stroke(); }
      for(let i=0;i<46;i++){ const x=2+r()*60, y=3+r()*10; izBlossom(g,x,y,1.2+r()*.8,r()<.5?'#f6b0c4':'#ffd8e2',r()<.5?'#d0507a':'#b83a62'); } for(let i=0;i<10;i++) ell(g,r()*w,4+r()*9,.9,.5,'#7aa04a'); }],
    ['branch',32,16,(g,w,h)=>{ const r=rng(511); g.strokeStyle='#3a2418'; g.lineCap='round'; g.lineWidth=1.2; g.beginPath(); g.moveTo(16,16); g.quadraticCurveTo(14,8,6,2); g.moveTo(15,10); g.quadraticCurveTo(20,6,28,3); g.stroke();
      for(let i=0;i<34;i++){ const t=r(); const side=r()<.5; const x=side?16-t*10:16+t*12, y=side?16-t*14:10-t*7; izBlossom(g,x+(r()-.5)*4,y+(r()-.5)*3,1+r()*.7,r()<.5?'#f6b0c4':'#ffd8e2','#c8406a'); } }],
    ['petals',32,16,(g,w,h)=>{ const r=rng(521); for(let i=0;i<40;i++) ell(g,r()*w,r()*h,.8,.5,r()<.5?'#f6b0c4':'#ffd8e2'); }],
  ]);
  return IZ={floor,ceil,plaster,dado,A,GA,KA};
}
/* a hung suit jacket: shoulders, lapels, buttons, a pocket square, painted folds */
function izJacket(g,w,h,col,seed){ g.clearRect(0,0,w,h); vfill(g,0,0,w,h,[[0,mix(col,'#ffffff',.12)],[.6,col],[1,mix(col,'#000000',.25)]]);
  for(const x of [5,19]){ g.fillStyle=grad(g,x-3,0,x+3,0,[[0,'rgba(0,0,0,0)'],[.5,'rgba(0,0,0,0.22)'],[1,'rgba(0,0,0,0)']]); g.fillRect(x-3,8,6,h-8); }
  poly(g,[[9,0],[15,0],[12,14]],'#eef0f2'); poly(g,[[10.6,0],[13.4,0],[12,12]],'#8a2a2a');
  poly(g,[[7,0],[9,0],[12,16],[10,17]],mix(col,'#000000',.3)); poly(g,[[17,0],[15,0],[12,16],[14,17]],mix(col,'#000000',.3));
  for(let k=0;k<2;k++) ell(g,12.4,20+k*5,.9,.9,'#1a1a1a'); R(g,mix(col,'#000000',.35),3,27,6,.8); R(g,mix(col,'#000000',.35),15,27,6,.8); R(g,'#f2ece0',17,10,3,1.4); R(g,rgba('#ffffff',.15),0,0,w,.8); }
