/* =====================================================================================================
   SUSHI BAR KAITEN · painters, atlas helpers and the moving conveyor (used by src/44d-sushi.js).
   Two atlases carry almost every small thing in the car: SU.atl (signs, posters, lanterns, the noren,
   knives, the lucky cat, the tank water...) and SU.sushi (plates, rice, nori and every kind of neta).
   The belt is ONE mesh: every plate, every piece of sushi, every crescent slat of the chain and the fish in
   the tank are rewritten into a single vertex buffer each frame, so the whole moving counter is one draw call.
   ===================================================================================================== */
let SU_TEX=null;
const SU_A=192, SU_S=128;                       /* atlas sizes in painter units */
const SU_R={ /* [x,y,w,h] in SU.atl */
  poster:[0,0,64,96], price:[64,0,64,48], tags:[128,0,64,48], board:[64,48,64,48], screen:[128,48,32,32],
  blade:[160,48,32,8], handle:[160,56,32,8], koban:[160,64,16,16], catface:[176,64,16,16],
  crest:[128,80,16,16], tin:[144,80,16,16], sake:[160,80,16,16], plain:[176,80,16,16],
  sign:[0,96,96,32], noren:[96,96,96,48], lanR:[0,128,32,48], lanW:[32,128,32,48], wood:[64,128,32,16],
  water:[64,144,48,48], tuna:[112,144,64,24], yunomi:[112,168,32,24], crate:[144,168,48,24], ice:[176,144,16,24] };
/* atlas rect -> [u0,v0,u1,v1] (canvas y runs down, texture v runs up) */
function suUVr(S,r,ins=.6){ const [x,y,w,h]=r; return [(x+ins)/S,1-(y+h-ins)/S,(x+w-ins)/S,1-(y+ins)/S]; }
const suAt=(k,ins)=>suUVr(SU_A,SU_R[k],ins);
const suSub=(k,i,n,ins=.6)=>{ const [x,y,w,h]=SU_R[k]; return suUVr(SU_A,[x+w*i/n,y,w/n,h],ins); };   /* the i-th of n vertical slices */
const suCell=(c,ins=1)=>suUVr(SU_S,[(c%4)*32,(c>>2)*32,32,32],ins);
const suHalf=(c,bottom,ins=1)=>suUVr(SU_S,[(c%4)*32,(c>>2)*32+(bottom?16:0),32,16],ins);

/* ---------- small painting helpers ---------- */
function suWood(g,x,y,w,h,a,b,seed,vert=false,lines=10){ const r=rng(seed);
  if(vert) hfill(g,x,y,w,h,[[0,mix(a,b,.3)],[.5,a],[1,b]]); else vfill(g,x,y,w,h,[[0,a],[1,b]]);
  for(let i=0;i<lines;i++){ const p=r(), wob=r()*6, ph=r()*6, al=.05+r()*.09; g.strokeStyle=rgba(r()<.7?'#5a3a1a':'#ffffff',r()<.7?al:al*.8); g.lineWidth=.35+r()*.5; g.beginPath();
    if(vert){ const cx=x+p*w; for(let t=0;t<=h;t+=2) g.lineTo(cx+Math.sin(t*.08+ph)*wob*.25,y+t); }
    else { const cy=y+p*h; for(let t=0;t<=w;t+=2) g.lineTo(x+t,cy+Math.sin(t*.06+ph)*wob*.25); } g.stroke(); }
  for(let i=0;i<2;i++) if(r()<.5){ const kx=x+r()*w,ky=y+r()*h; ell(g,kx,ky,vert?.8:1.8,vert?1.8:.8,rgba('#5a3a1a',.28)); ell(g,kx,ky,vert?.35:.8,vert?.8:.35,rgba('#3a2410',.35)); } }
function suGlyphCol(g,x,y,n,cell,col,seed){ glyphs(g,x,y,n,cell,col,seed,true); }

function suTex(){ if(SU_TEX) return SU_TEX; const T={};
  /* dark charcoal stone, 60 cm tiles, each its own tone, polished with a soft sheen; 1.2 m per repeat */
  T.floor=P2(64,64,(g,w,h)=>{ const r=rng(901);
    for(let ty=0;ty<2;ty++) for(let tx=0;tx<2;tx++){ const x=tx*32,y=ty*32,b=mix('#45403a','#34302c',r());
      vfill(g,x,y,32,32,[[0,mix(b,'#ffffff',.05)],[1,mix(b,'#000000',.06)]]);
      for(let i=0;i<26;i++) ell(g,x+2+r()*28,y+2+r()*28,1+r()*4,.4+r()*1.4,rgba(r()>.5?'#ffffff':'#000000',.035));
      for(let i=0;i<10;i++) R(g,rgba('#d8d0c0',.12),x+1+r()*30,y+1+r()*30,.6,.6);
      g.strokeStyle=rgba('#ffffff',.06); g.lineWidth=2.5; g.beginPath(); g.moveTo(x+4,y+30); g.lineTo(x+30,y+6); g.stroke();
      R(g,'#1a1816',x,y,32,.9); R(g,'#1a1816',x,y,.9,32); R(g,rgba('#ffffff',.1),x+.9,y+.9,31,.5); R(g,rgba('#ffffff',.06),x+.9,y+.9,.5,31); R(g,rgba('#000000',.18),x+.9,y+31,31,1); R(g,rgba('#000000',.14),x+31,y+.9,1,31); } },5,901);
  /* duckboard (sunoko) for the chefs' well: hinoki slats with dark gaps, along x */
  T.duck=P2(32,32,(g,w,h)=>{ R(g,'#1a1410',0,0,w,h); for(let k=0;k<4;k++){ suWood(g,0,k*8+1,w,6,'#d8b884','#b8935e',910+k,false,4); R(g,rgba('#ffffff',.25),0,k*8+1,w,.5); R(g,rgba('#000000',.25),0,k*8+6.5,w,.5); }
    for(let k=0;k<4;k++) ell(g,6+k%2*20,k*8+4,.5,.5,'#5a4a3a'); },5,910);
  /* pale hinoki, long grain along u, a plank seam per repeat and a painted sheen */
  T.hinoki=P2(64,32,(g,w,h)=>{ suWood(g,0,0,w,16,'#ecd6ac','#dcc090',920,false,9); suWood(g,0,16,w,16,'#e8d0a2','#d8ba86',921,false,9);
    R(g,rgba('#ffffff',.18),0,3,w,2); R(g,rgba('#ffffff',.12),0,19,w,2); R(g,rgba('#7a5a32',.5),0,15.5,w,.6); R(g,rgba('#7a5a32',.4),w-.6,0,.6,h); },4,920);
  /* vertical hinoki slats (walls under the windows, the counter fronts): grooved, rounded, light from above */
  T.slat=P2(64,64,(g,w,h)=>{ R(g,'#2a1c12',0,0,w,h); for(let k=0;k<8;k++){ const x=k*8+.8;
      suWood(g,x,0,6.4,h,mix('#e2c494','#d2b07a',(k*37%10)/10),'#b89058',930+k,true,4); hfill(g,x,0,6.4,h,[[0,rgba('#000000',.18)],[.25,rgba('#ffffff',.12)],[.6,rgba('#ffffff',0)],[1,rgba('#000000',.22)]]); }
    vfill(g,0,0,w,h,[[0,rgba('#ffffff',.1)],[.5,rgba('#000000',0)],[1,rgba('#000000',.18)]]); },4,930);
  /* shoji: warm lit paper in a dark kumiko lattice */
  T.shoji=P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f6ecd4'],[1,'#ecdcb8']]); radial(g,16,16,20,[[0,rgba('#fff8e8',.6)],[1,rgba('#fff8e8',0)]]);
    for(let i=0;i<4;i++){ R(g,'#4a3422',i*8,0,1.2,h); R(g,'#4a3422',0,i*8,w,1.2); R(g,rgba('#ffffff',.25),i*8+1.2,0,.4,h); }
    for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8){ R(g,rgba('#a88a5a',.12),x+1.2,y+1.2,6.8,.6); } },3,940);
  /* sumi-indigo plaster for the piers and end walls: trowel marks, a soft top light */
  T.pier=P2(64,64,(g,w,h)=>{ R(g,'#262a3a',0,0,w,h); const r=rng(950); for(let i=0;i<60;i++){ const x=r()*w,y=r()*h; ell(g,x,y,3+r()*7,1+r()*2.5,rgba(r()>.5?'#3a3e54':'#1a1c28',.35)); }
    for(let i=0;i<30;i++){ g.strokeStyle=rgba('#4a4e66',.18); g.lineWidth=.6; g.beginPath(); const x=r()*w,y=r()*h; g.moveTo(x,y); g.quadraticCurveTo(x+5,y-2,x+10,y+1); g.stroke(); } },6,950);
  /* ceiling: dark boards, pale battens across the car */
  T.ceil=P2(64,64,(g,w,h)=>{ suWood(g,0,0,w,h,'#3a2c22','#2c2018',960,false,10); for(let k=0;k<4;k++){ const x=k*16+6; R(g,rgba('#000000',.35),x-1.5,0,1.5,h); suWood(g,x,0,4,h,'#c8a878','#a8885a',961+k,true,3); R(g,rgba('#ffffff',.2),x,0,.6,h); R(g,rgba('#000000',.25),x+3.4,0,.6,h); } },5,960);
  /* the underside of the counter roof: dark boards over rafters (the rafters are modelled; this is the boarding) */
  T.roof=P2(32,32,(g,w,h)=>{ for(let k=0;k<4;k++) suWood(g,0,k*8,w,8,'#4a3424','#3a281a',970+k,false,3); for(let k=0;k<4;k++) R(g,rgba('#000000',.4),0,k*8,w,.6); },5,970);
  /* brushed stainless: horizontal brushing, a painted bevel at the top, darker below */
  T.steel=P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d6dadc'],[.5,'#b2b8bc'],[1,'#8e949a']]); const r=rng(980); for(let y=0;y<h;y+=.5) R(g,rgba(r()>.5?'#ffffff':'#000000',.04+r()*.05),0,y,w,.5);
    g.strokeStyle=rgba('#ffffff',.25); g.lineWidth=3; g.beginPath(); g.moveTo(-4,h); g.lineTo(14,0); g.stroke(); g.lineWidth=1.2; g.beginPath(); g.moveTo(6,h); g.lineTo(22,0); g.stroke(); },3,980);
  /* stainless doors under the counter on the chefs' side: panels with pulls */
  T.doors=P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c8ccd0'],[1,'#8a9096']]); const r=rng(985); for(let y=0;y<h;y+=.5) R(g,rgba(r()>.5?'#ffffff':'#000000',.04),0,y,w,.5);
    for(const x of [0,16]){ R(g,'#4a4e54',x,0,.8,h); R(g,rgba('#ffffff',.35),x+.8,0,.5,h); R(g,'#5a5e64',x+3,5,10,1.4); R(g,'#e8ecee',x+3,5,10,.5); } R(g,'#3a3e44',0,h-3,w,3); },3,985);
  /* indigo stool cushions with white sashiko stitching */
  T.fab=P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a3a72'],[1,'#1e2a58']]); const r=rng(990); for(let y=0;y<h;y+=1) R(g,rgba(r()>.5?'#ffffff':'#000000',.03),0,y,w,.5);
    g.fillStyle=rgba('#e8e8f0',.8); for(let y=4;y<h;y+=8) for(let x=0;x<w;x+=3) g.fillRect(x,y,1.6,.5); for(let x=4;x<w;x+=8) for(let y=0;y<h;y+=3) g.fillRect(x,y,.5,1.6); },4,990);
  /* the exit door: black lacquer frame, frosted glass with the house crest, slatted kick panel */
  T.door=P2(32,64,(g,w,h)=>{ R(g,'#16120e',0,0,w,h); R(g,rgba('#ffffff',.12),1,1,w-2,.6);
    vfill(g,4,6,24,30,[[0,'#d8e2e6'],[1,'#a8b8c0']]); ell(g,16,18,6.5,6.5,rgba('#2a3a5a',.75)); ell(g,16,18,5,5,'#c8d4da'); g.strokeStyle='#2a3a5a'; g.lineWidth=1; g.beginPath(); g.moveTo(11.5,19); g.quadraticCurveTo(14,15,16,19); g.quadraticCurveTo(18,23,20.5,18); g.stroke();
    R(g,rgba('#ffffff',.3),6,8,1,26); for(let k=0;k<5;k++) R(g,'#c8a878',4+k*5,40,4,20); R(g,'#3a2a1e',4,39,24,1); R(g,'#e8c860',25,30,1.2,6); },3,1000);
  /* painted reflection streaks for every pane of glass (alpha-cut, unlit) */
  T.streak=P2(64,64,(g,w,h)=>{ g.lineCap='round'; for(const [x,wd,c] of [[10,1.0,'#6a98b4'],[13.5,.45,'#8ab8d0'],[44,.6,'#5a88a4']]){ g.strokeStyle=c; g.lineWidth=wd; g.beginPath(); g.moveTo(x,h*.85); g.lineTo(x+14,h*.15); g.stroke(); } },0,1010);

  /* ---------- the sign atlas ---------- */
  T.atl=P2(SU_A,SU_A,(g)=>{ const r=rng(1100), at=(k)=>SU_R[k];
    { const [x,y,w,h]=at('poster'); vfill(g,x,y,w,h,[[0,'#f6eedc'],[1,'#e6d8b8']]); R(g,'#2a2420',x,y,w,1); R(g,'#2a2420',x,y+h-1,w,1); R(g,'#2a2420',x,y,1,h); R(g,'#2a2420',x+w-1,y,1,h);
      vfill(g,x+3,y+3,w-6,15,[[0,'#c8242a'],[1,'#9a1418']]); text(g,'MAGURO',x+(w-textW('MAGURO',2))/2+1,y+6,'#f6eedc',2);
      /* the tuna with its cuts */
      const tx=x+6,ty=y+44; g.fillStyle='#22345a'; g.beginPath(); g.moveTo(tx,ty); g.quadraticCurveTo(tx+20,ty-16,tx+44,ty-6); g.lineTo(tx+50,ty-12); g.lineTo(tx+48,ty); g.lineTo(tx+50,ty+12); g.lineTo(tx+44,ty+6); g.quadraticCurveTo(tx+20,ty+16,tx,ty); g.fill();
      g.fillStyle='#c8ccd4'; g.beginPath(); g.moveTo(tx+2,ty+1); g.quadraticCurveTo(tx+22,ty+14,tx+43,ty+5); g.quadraticCurveTo(tx+22,ty+6,tx+2,ty+1); g.fill();
      for(let k=0;k<5;k++) R(g,'#f2c230',tx+33+k*2.2,ty-6+k*.3,1,1.2); ell(g,tx+5,ty-1,1.4,1.4,'#f6eedc'); ell(g,tx+5,ty-1,.7,.7,'#101010');
      g.strokeStyle='#c8242a'; g.lineWidth=.6; g.setLineDash([1.5,1]); for(const cx of [14,24,34]){ g.beginPath(); g.moveTo(tx+cx,ty-12); g.lineTo(tx+cx,ty+12); g.stroke(); } g.setLineDash([]);
      text(g,'OTORO',x+4,y+60,'#c8242a',1); text(g,'CHUTORO',x+30,y+60,'#2a2420',1); text(g,'AKAMI',x+4,y+67,'#2a2420',1);
      for(const [cx,c] of [[x+40,'#f0a0a8'],[x+48,'#d84050'],[x+56,'#9a1020']]){ R(g,c,cx-3,y+67,6,5); R(g,rgba('#ffffff',.5),cx-3,y+67,6,1); }
      for(let k=0;k<5;k++) suGlyphCol(g,x+6+k*7,y+75,3,5,'#2a2420',1101+k); R(g,'#c8242a',x+48,y+80,11,11); R(g,'#f6eedc',x+50,y+82,7,7); R(g,'#c8242a',x+51.5,y+83.5,4,4); }
    { const [x,y,w,h]=at('price'); suWood(g,x,y,w,h,'#4a3424','#34241a',1110,false,6); R(g,'#1a120c',x,y,w,1.5); R(g,'#1a120c',x,y+h-1.5,w,1.5); R(g,'#1a120c',x,y,1.5,h); R(g,'#1a120c',x+w-1.5,y,1.5,h);
      text(g,'PER PLATE',x+(w-textW('PER PLATE'))/2,y+4,'#f2e6c8',1);
      const cols=['#f4f2ec','#3a6ad8','#d8302a','#f0c040','#1a1a1e','#3a9a4a'], pr=['120','180','260','380','480','580'];
      for(let i=0;i<6;i++){ const cx=x+11+(i%3)*21,cy=y+17+(i/3|0)*15; ell(g,cx,cy+1,8,3.4,rgba('#000000',.4)); ell(g,cx,cy,8,3.4,cols[i]); ell(g,cx,cy,5.2,2.1,'#f8f6f0'); ell(g,cx,cy-.6,5.2,1.2,rgba('#ffffff',.6)); text(g,pr[i],cx-5,cy+5,'#f2e6c8',1); } }
    { const [x,y,w,h]=at('tags'); for(let k=0;k<8;k++){ const tx=x+k*8; suWood(g,tx,y,8,h,mix('#f0dcb0','#e2c898',(k*3%5)/5),'#c8a874',1120+k,true,2); vfill(g,tx,y,8,h,[[0,rgba('#ffffff',.15)],[1,rgba('#000000',.12)]]);
      R(g,'#7a5a3a',tx,y,.6,h); R(g,'#7a5a3a',tx+7.4,y,.6,h); ell(g,tx+4,y+3,1,1,'#2a1c12'); suGlyphCol(g,tx+1.5,y+7,5,5,'#1a1410',1130+k); suGlyphCol(g,tx+2,y+35,2,4,'#b81e24',1140+k); } }
    { const [x,y,w,h]=at('board'); suWood(g,x,y,w,h,'#6a4a2a','#4a321c',1150,false,4); vfill(g,x+3,y+3,w-6,h-6,[[0,'#24302a'],[1,'#1a241e']]); for(let i=0;i<14;i++) R(g,rgba('#ffffff',.04),x+4+r()*50,y+4+r()*36,6+r()*8,1);
      text(g,'TODAY',x+6,y+6,'#f2f0e6',1); R(g,'#f2f0e6',x+6,y+12,22,.5);
      const fish=(cx,cy,c)=>{ g.strokeStyle=c; g.lineWidth=.7; g.beginPath(); g.ellipse(cx,cy,6,2.6,0,0,Math.PI*2); g.moveTo(cx+6,cy); g.lineTo(cx+9,cy-2.5); g.lineTo(cx+9,cy+2.5); g.closePath(); g.stroke(); ell(g,cx-3.5,cy-.5,.5,.5,c); };
      fish(x+44,y+10,'#f2a0b0'); fish(x+44,y+22,'#a0d8f2'); fish(x+44,y+34,'#f2e080');
      for(let k=0;k<4;k++){ glyphs(g,x+6,y+16+k*7,5,5,['#f2f0e6','#f2a0b0','#f2e080','#a0d8f2'][k],1160+k,false); } }
    { const [x,y,w,h]=at('screen'); vfill(g,x,y,w,h,[[0,'#f2f6fa'],[1,'#d8e2ec']]); R(g,'#c8242a',x,y,w,6); text(g,'ORDER',x+2,y+1,'#ffffff',1);
      for(let i=0;i<6;i++){ const bx=x+2+(i%3)*10,by=y+8+(i/3|0)*10; R(g,'#ffffff',bx,by,9,9); R(g,'#b8c4d0',bx,by+8.4,9,.6); ell(g,bx+4.5,by+4,3.4,1.6,['#e8a070','#d8302a','#f0c040','#f4f2ec','#f07a3a','#2a2a2a'][i]); ell(g,bx+4.5,by+5.2,3,1,'#f8f6f0'); }
      R(g,'#2a9a4a',x+2,y+28,w-4,3); }
    { const [x,y,w,h]=at('blade'); vfill(g,x,y,w,h,[[0,'#6a7078'],[.45,'#c8ced4'],[.55,'#e8eef2'],[1,'#f8fcff']]); g.strokeStyle=rgba('#ffffff',.6); g.lineWidth=.5; g.beginPath(); for(let t=0;t<=w;t+=1) g.lineTo(x+t,y+5+Math.sin(t*.9)*.6); g.stroke(); R(g,'#3a3e44',x,y,w,.6); }
    { const [x,y,w,h]=at('handle'); suWood(g,x,y,w,h,'#e2d4b0','#c8b48a',1170,false,3); R(g,'#141414',x,y,6,h); R(g,rgba('#ffffff',.25),x,y+1,6,.6); R(g,'#2a2420',x+w-1,y,1,h); }
    { const [x,y,w,h]=at('koban'); R(g,'#c89a2a',x,y,w,h); ell(g,x+8,y+8,6,7.5,'#f2cc50'); ell(g,x+8,y+8,4.6,6.2,'#e0b038'); for(let k=0;k<5;k++) R(g,rgba('#a87a1a',.6),x+4,y+3+k*2.4,8,.5); suGlyphCol(g,x+6.5,y+4,2,3,'#7a5410',1180); }
    { const [x,y,w,h]=at('catface'); R(g,'#f6f2ea',x,y,w,h); radial(g,x+8,y+9,8,[[0,'#ffffff'],[1,'#e8e2d4']]);
      g.strokeStyle='#1a1410'; g.lineWidth=.9; g.beginPath(); g.arc(x+4.6,y+7.5,1.6,Math.PI*1.1,Math.PI*1.9); g.stroke(); g.beginPath(); g.arc(x+11.4,y+7.5,1.6,Math.PI*1.1,Math.PI*1.9); g.stroke();
      poly(g,[[x+7,y+9.5],[x+9,y+9.5],[x+8,y+10.6]],'#e86a7a'); g.lineWidth=.5; g.beginPath(); g.moveTo(x+8,y+10.6); g.quadraticCurveTo(x+7,y+12,x+6,y+11.2); g.moveTo(x+8,y+10.6); g.quadraticCurveTo(x+9,y+12,x+10,y+11.2); g.stroke();
      g.strokeStyle='#5a4a3a'; g.lineWidth=.35; for(const s of [-1,1]) for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(x+8+s*3,y+10.5+k*.6); g.lineTo(x+8+s*7.5,y+9.5+k*1.2); g.stroke(); }
      ell(g,x+3.5,y+10.5,1.4,.8,rgba('#f08a9a',.5)); ell(g,x+12.5,y+10.5,1.4,.8,rgba('#f08a9a',.5)); }
    { const [x,y,w,h]=at('crest'); R(g,'#3a3c42',x,y,w,h); radial(g,x+8,y+8,8,[[0,'#6a6e78'],[.7,'#4a4e58'],[1,'#2a2c32']]); g.strokeStyle='#2a2c32'; g.lineWidth=1; g.beginPath(); g.arc(x+8,y+8,6,0,Math.PI*2); g.stroke();
      for(let k=0;k<3;k++){ const a=k*Math.PI*2/3; ell(g,x+8+Math.cos(a)*2.6,y+8+Math.sin(a)*2.6,1.5,1.5,'#7a7e88'); ell(g,x+8+Math.cos(a+.6)*3.4,y+8+Math.sin(a+.6)*3.4,.7,.7,'#7a7e88'); } R(g,rgba('#ffffff',.25),x+3,y+3,5,.6); }
    { const [x,y,w,h]=at('tin'); vfill(g,x,y,w,h,[[0,'#3a7a3a'],[1,'#24542a']]); R(g,'#e8c860',x,y+4,w,8); suGlyphCol(g,x+5.5,y+4.5,2,3.6,'#24542a',1190); R(g,rgba('#ffffff',.3),x+2,y,1,h); }
    { const [x,y,w,h]=at('sake'); hfill(g,x,y,w,h,[[0,'#0e2a1a'],[.5,'#2a5a3a'],[.6,'#5a8a6a'],[1,'#0e2a1a']]); R(g,'#f4f0e4',x,y+4,w,8); suGlyphCol(g,x+6,y+4.5,2,3.5,'#1a1410',1195); R(g,'#c8242a',x+1,y+9,2,2); R(g,'#c8a040',x,y+4,w,.5); R(g,'#c8a040',x,y+11.5,w,.5); R(g,'#e8d8a0',x,y+1,w,1.5); }
    { const [x,y,w,h]=at('plain'); vfill(g,x,y,w,h,[[0,'#f4f0e6'],[1,'#e2dccc']]); }
    { const [x,y,w,h]=at('sign'); suWood(g,x,y,w,h,'#e8cc98','#c8a46c',1200,false,10); R(g,rgba('#ffffff',.25),x,y+1,w,1); R(g,'#5a3e22',x,y,w,.8); R(g,'#5a3e22',x,y+h-.8,w,.8); R(g,'#5a3e22',x,y,.8,h); R(g,'#5a3e22',x+w-.8,y,.8,h);
      const s='KAITEN', tw=textW(s,3), tx=x+(w-tw)/2; text(g,s,tx+.6,y+6.6,rgba('#ffffff',.5),3); text(g,s,tx,y+6,'#1a120a',3);
      glyphs(g,x+18,y+24,10,6,'#5a3e22',1205,false); R(g,'#b81e24',x+w-12,y+4,8,8); R(g,'#e8cc98',x+w-10.5,y+5.5,5,5); R(g,'#b81e24',x+w-9.5,y+6.5,3,3); }
    { const [x,y,w,h]=at('noren'); vfill(g,x,y,w,h,[[0,'#24326a'],[1,'#18224a']]); for(let yy=y;yy<y+h;yy+=1) R(g,rgba('#000000',(yy%2)?.06:0),x,yy,w,.5); for(let k=0;k<5;k++) R(g,rgba('#000000',.25),x+k*w/4-.5,y,1,h);
      const cx=x+w/2,cy=y+20; ell(g,cx,cy,11,11,'#f2f0e8'); ell(g,cx,cy,9,9,'#24326a'); ell(g,cx,cy,7.5,7.5,'#f2f0e8'); g.fillStyle='#24326a'; g.beginPath(); g.moveTo(cx-7.5,cy+1); g.quadraticCurveTo(cx-3,cy-5,cx,cy+1); g.quadraticCurveTo(cx+3,cy+6,cx+7.5,cy); g.lineTo(cx+7.5,cy+8); g.lineTo(cx-7.5,cy+8); g.fill();
      for(const gx of [x+8,x+18,x+w-14,x+w-24]) suGlyphCol(g,gx,y+6,5,6,'#f2f0e8',1210+gx|0); R(g,'#10183a',x,y+h-3,w,3); R(g,'#10183a',x,y,w,2); }
    { for(const [k,base,ink] of [['lanR','#d0202a','#1a0a08'],['lanW','#f4ecd8','#b81e24']]){ const [x,y,w,h]=at(k); hfill(g,x,y,w,h,[[0,mix(base,'#000000',.25)],[.5,mix(base,'#ffffff',.18)],[1,mix(base,'#000000',.25)]]);
      for(let yy=y+5;yy<y+h-5;yy+=3.2) R(g,rgba('#000000',.18),x,yy,w,.6); for(let yy=y+5;yy<y+h-5;yy+=3.2) R(g,rgba('#ffffff',.14),x,yy+.6,w,.4);
      suGlyphCol(g,x+w/2-5,y+10,3,10,ink,k.length*7); suGlyphCol(g,x+2,y+14,2,7,rgba(ink==='#1a0a08'?'#1a0a08':'#b81e24',.8),k.length*9); R(g,'#16100c',x,y,w,4.5); R(g,'#16100c',x,y+h-4.5,w,4.5); R(g,'#c8a040',x,y+4.5,w,.5); R(g,'#c8a040',x,y+h-5,w,.5); } }
    { const [x,y,w,h]=at('wood'); suWood(g,x,y,w,h,'#e2c490','#c8a46c',1230,false,5); }
    { const [x,y,w,h]=at('water'); vfill(g,x,y,w,h,[[0,'#3ab0d8'],[.6,'#1a6a98'],[1,'#0e3a5a']]);
      for(let k=0;k<5;k++){ g.fillStyle=rgba('#d8f8ff',.12); g.beginPath(); const sx=x+4+k*10; g.moveTo(sx,y); g.lineTo(sx+6,y); g.lineTo(sx+14,y+h); g.lineTo(sx+6,y+h); g.fill(); }
      for(let i=0;i<30;i++){ g.strokeStyle=rgba('#e8fcff',.35); g.lineWidth=.4; g.beginPath(); const cx=x+r()*w,cy=y+r()*14; g.ellipse(cx,cy,1.5+r()*2,.6+r()*.6,0,0,Math.PI*2); g.stroke(); }
      for(let k=0;k<7;k++){ g.strokeStyle=k%2?'#2a7a3a':'#3a9a4a'; g.lineWidth=1.3; g.beginPath(); const sx=x+3+k*7; g.moveTo(sx,y+h); for(let t=0;t<18;t+=2) g.lineTo(sx+Math.sin(t*.5+k)*1.5,y+h-t); g.stroke(); }
      for(let k=0;k<6;k++) ell(g,x+r()*w,y+h-1-r()*3,3+r()*4,2+r()*2,['#3a4048','#4a5058','#2a3038'][k%3]); for(let i=0;i<12;i++) ell(g,x+r()*w,y+r()*h*.8,.6,.6,rgba('#ffffff',.6)); }
    { const [x,y,w,h]=at('tuna'); /* u runs round the body: the dark back in the middle, the silver belly at both edges */
      hfill(g,x,y,w,h,[[0,'#d8dce4'],[.2,'#a8b0bc'],[.36,'#3a5078'],[.5,'#14203a'],[.64,'#3a5078'],[.8,'#a8b0bc'],[1,'#d8dce4']]);
      R(g,rgba('#e8f0ff',.35),x+w*.3,y,1,h); R(g,rgba('#e8f0ff',.35),x+w*.7,y,1,h); for(let k=0;k<8;k++) ell(g,x+w*.25+r()*w*.5,y+r()*h,1.5,.6,rgba('#5a7aa8',.4)); vfill(g,x,y,w,4,[[0,rgba('#202830',.6)],[1,rgba('#202830',0)]]); }
    { const [x,y,w,h]=at('yunomi'); vfill(g,x,y,w,h,[[0,'#b8c8b0'],[1,'#8aa088']]); for(let k=0;k<3;k++) suGlyphCol(g,x+3+k*10,y+3,3,6,'#3a2a1e',1240+k); R(g,'#e8ece0',x,y,w,1.4); R(g,'#5a4a3a',x,y+h-1.5,w,1.5); }
    { const [x,y,w,h]=at('crate'); vfill(g,x,y,w,h,[[0,'#f6f6f2'],[1,'#dcdcd6']]); for(let i=0;i<40;i++) ell(g,x+r()*w,y+r()*h,.6,.6,rgba('#b8b8b0',.4)); R(g,'#2a4aa8',x+4,y+5,24,10); glyphs(g,x+6,y+7,4,6,'#f6f6f2',1250,false); R(g,'#c8242a',x+32,y+5,10,10); text(g,'A1',x+33,y+8,'#f6f6f2',1); R(g,'#2a4aa8',x,y+h-3,w,1); }
    { const [x,y,w,h]=at('ice'); R(g,'#e6f2f6',x,y,w,h); for(let i=0;i<40;i++){ ell(g,x+r()*w,y+r()*h,1+r()*1.5,.8+r(),rgba(r()>.5?'#ffffff':'#a8c8d8',.6)); } }
  },0,1100);

  /* ---------- the sushi atlas: 4 x 4 cells of 32 ---------- */
  T.sushi=P2(SU_S,SU_S,(g)=>{ const r=rng(1300), C=(c)=>[(c%4)*32,(c>>2)*32];
    { const [x,y]=C(0); radial(g,x+16,y+16,22,[[0,'#ffffff'],[.6,'#f2f0ea'],[1,'#d8d4cc']]); ell(g,x+11,y+10,6,3,rgba('#ffffff',.9)); g.strokeStyle=rgba('#b8b4ac',.6); g.lineWidth=.6; g.beginPath(); g.arc(x+16,y+16,13,0,Math.PI*2); g.stroke(); }
    { const [x,y]=C(1); vfill(g,x,y,32,32,[[0,'#ffffff'],[1,'#d8d8d8']]); for(let k=0;k<8;k++){ g.strokeStyle=rgba('#ffffff',.7); g.lineWidth=1; g.beginPath(); g.arc(x+k*4+2,y+20,2,Math.PI,0); g.stroke(); } R(g,rgba('#000000',.15),x,y+26,32,6); R(g,rgba('#ffffff',.5),x,y+6,32,1.5); }
    { const [x,y]=C(2); R(g,'#ece6d6',x,y,32,32); for(let i=0;i<110;i++){ const gx=x+r()*32,gy=y+r()*32; ell(g,gx+.3,gy+.3,1.5,.8,rgba('#b8ae98',.45)); ell(g,gx,gy,1.4,.7,r()>.3?'#fbf8f0':'#f2ecdc'); } }
    { const [x,y]=C(3); R(g,'#18201a',x,y,32,32); for(let i=0;i<80;i++) R(g,rgba(r()>.5?'#2e4a2a':'#0a100a',.7),x+r()*32,y+r()*32,1.5+r()*2,.5); R(g,rgba('#7a9a8a',.18),x,y+8,32,3); }
    const neta=(c,a,b,fn)=>{ const [x,y]=C(c); vfill(g,x,y,32,32,[[0,a],[1,b]]); if(fn) fn(x,y); g.fillStyle=rgba('#ffffff',.35); g.beginPath(); g.moveTo(x+2,y+4); g.lineTo(x+30,y+2); g.lineTo(x+30,y+6); g.lineTo(x+2,y+9); g.fill(); };
    neta(4,'#c8182c','#8a0c1e',(x,y)=>{ for(let k=0;k<6;k++){ g.strokeStyle=rgba('#e8586a',.4); g.lineWidth=.6; g.beginPath(); g.moveTo(x+k*6,y+32); g.quadraticCurveTo(x+k*6+6,y+16,x+k*6+2,y); g.stroke(); } });
    neta(5,'#f68a44','#e0682a',(x,y)=>{ for(let k=-2;k<7;k++){ g.strokeStyle=rgba('#fff0e0',.85); g.lineWidth=1.3; g.beginPath(); g.moveTo(x+k*6,y+32); g.lineTo(x+k*6+14,y); g.stroke(); } });
    neta(6,'#f0909a','#d86a78',(x,y)=>{ for(let k=0;k<7;k++){ g.strokeStyle=rgba('#fff4f4',.7); g.lineWidth=.8; g.beginPath(); g.moveTo(x,y+4+k*4.5); for(let t=0;t<=32;t+=4) g.lineTo(x+t,y+4+k*4.5+Math.sin(t*.4+k)*1.5); g.stroke(); } });
    neta(7,'#f6e2d2','#e8c8b4',(x,y)=>{ vfill(g,x,y+22,32,10,[[0,rgba('#c84a4a',0)],[.5,'#c85a5a'],[1,'#a83a3a']]); });
    neta(8,'#fbf4ec','#f0e0d0',(x,y)=>{ for(let k=0;k<5;k++){ R(g,'#f05a2a',x,y+3+k*6.5,32,2.6); R(g,rgba('#ffb08a',.6),x,y+5.6+k*6.5,32,1); } });
    neta(9,'#fadc5a','#ecc038',(x,y)=>{ for(let k=0;k<6;k++) R(g,rgba('#d8a020',.5),x,y+4+k*5,32,.7); R(g,'#c88a2a',x,y,32,2); });
    neta(10,'#f8f8f4','#e8ecf0',(x,y)=>{ g.strokeStyle=rgba('#c8d0d8',.8); g.lineWidth=.5; for(let k=-4;k<8;k++){ g.beginPath(); g.moveTo(x+k*5,y); g.lineTo(x+k*5+12,y+32); g.stroke(); g.beginPath(); g.moveTo(x+k*5+12,y); g.lineTo(x+k*5,y+32); g.stroke(); } });
    neta(11,'#7a4220','#4a2410',(x,y)=>{ for(let k=0;k<4;k++){ R(g,rgba('#2a1206',.6),x+3+k*8,y,2.4,32); } for(let i=0;i<18;i++) ell(g,x+r()*32,y+r()*32,.7,.4,'#f2e8c8'); R(g,rgba('#e8a050',.4),x,y+10,32,2); });
    { const [x,y]=C(12); R(g,'#18201a',x,y,32,32); for(let i=0;i<34;i++){ const bx=x+2+r()*28,by=y+2+r()*28; ell(g,bx,by,2.4,2.4,'#c83a10'); ell(g,bx,by,2,2,'#ff6a1e'); ell(g,bx-.7,by-.7,.6,.6,'#fff0d0'); } }
    { const [x,y]=C(13); R(g,'#18201a',x,y,32,32); ell(g,x+16,y+16,14,14,'#18201a'); ell(g,x+16,y+16,12.5,12.5,'#f6f2e6'); for(let i=0;i<40;i++){ const a=r()*Math.PI*2,d=5+r()*7; ell(g,x+16+Math.cos(a)*d,y+16+Math.sin(a)*d,1,.6,'#e2dccc'); } ell(g,x+16,y+16,5,5,'#c8182c'); ell(g,x+15,y+15,1.5,1,rgba('#ffffff',.4)); }
    { const [x,y]=C(14); vfill(g,x,y,32,16,[[0,'#e8e6e0'],[1,'#c8c4bc']]); vfill(g,x,y+16,32,16,[[0,'#5a5852'],[1,'#3a3832']]); }
    { const [x,y]=C(15); for(const [oy,body,belly,fin] of [[0,'#e0504a','#f8c8b8','#c83a3a'],[16,'#5a7898','#e8eef2','#3a5878']]){
        g.fillStyle=body; g.beginPath(); g.moveTo(x+2,y+oy+8); g.quadraticCurveTo(x+12,y+oy+1,x+24,y+oy+7); g.lineTo(x+30,y+oy+3); g.lineTo(x+29,y+oy+8); g.lineTo(x+30,y+oy+13); g.lineTo(x+24,y+oy+9); g.quadraticCurveTo(x+12,y+oy+15,x+2,y+oy+8); g.fill();
        g.fillStyle=belly; g.beginPath(); g.moveTo(x+3,y+oy+9); g.quadraticCurveTo(x+12,y+oy+14,x+23,y+oy+9); g.quadraticCurveTo(x+12,y+oy+11,x+3,y+oy+9); g.fill();
        poly(g,[[x+10,y+oy+4],[x+16,y+oy+1],[x+18,y+oy+5]],fin); ell(g,x+6,y+oy+7,1.2,1.2,'#ffffff'); ell(g,x+6,y+oy+7,.6,.6,'#101010'); R(g,rgba('#ffffff',.4),x+8,y+oy+5,10,.5); } }
  },0,1300);
  return SU_TEX=T; }

/* ---------- geometry with atlas UVs ---------- */
/* a box (base at y=0) whose faces map into atlas rects: rects is one rect or [+x,-x,+y,-y,+z,-z] */
function suBox(w,h,d,rects,o){ const g=box(w,h,d,Object.assign({at:[0,h/2,0]},o||{})); const many=Array.isArray(rects[0]);
  for(let f=0;f<6;f++){ const r=many?(rects[f]||rects[6]||rects[0]):rects; for(let v=f*4;v<f*4+4;v++){ g.T[v*2]=r[0]+g.T[v*2]*(r[2]-r[0]); g.T[v*2+1]=r[1]+g.T[v*2+1]*(r[3]-r[1]); } } return g; }
function suRemap(g,r){ for(let i=0;i<g.T.length;i+=2){ g.T[i]=r[0]+g.T[i]*(r[2]-r[0]); g.T[i+1]=r[1]+g.T[i+1]*(r[3]-r[1]); } return g; }
function suPlane(w,h,r){ return suRemap(plane(w,h),r); }
/* a box with UVs in world units (tu x tv metres per repeat) on every face, so long counters never stretch */
function suBoxW(w,h,d,tu=1,tv=tu){ const g=box(w,h,d,{at:[0,h/2,0]}),S={w,h,d};
  FACES.forEach(([n,U,V,ku,kv],f)=>{ for(let v=f*4;v<f*4+4;v++){ g.T[v*2]*=S[ku]/tu; g.T[v*2+1]*=S[kv]/tv; } }); return g; }
function suBW(par,m,x,y,z,w,h,d,tu,tv,ry=0){ return mk(suBoxW(w,h,d,tu,tv),m,par,x,y,z,0,ry,0); }
/* flat ring sector (top face) and a curved wall, for the round end of the counter; angles from +x toward +z */
function suRingTop(r0,r1,y,a0,a1,seg,tile=1,down=false){ const g=new Geo();
  for(let i=0;i<=seg;i++){ const a=a0+(a1-a0)*i/seg,c=Math.cos(a),s=Math.sin(a); for(const r of [r0,r1]) g.v([r*c,y,r*s],[0,down?-1:1,0],[r*c/tile,r*s/tile]); }
  for(let i=0;i<seg;i++){ const a=i*2,b=a+1,c=a+3,d=a+2; if(down) g.I.push(a,b,c,a,c,d); else g.I.push(a,c,b,a,d,c); }
  g.groups.push({start:0,count:g.I.length,mi:0}); return g; }
function suRingWall(r,y0,y1,a0,a1,seg,out,tu=1,tv=1){ const g=new Geo(),L=Math.abs(a1-a0)*r;
  for(let i=0;i<=seg;i++){ const a=a0+(a1-a0)*i/seg,c=Math.cos(a),s=Math.sin(a),u=L*i/seg/tu; g.v([r*c,y0,r*s],[c*out,0,s*out],[u,0]); g.v([r*c,y1,r*s],[c*out,0,s*out],[u,(y1-y0)/tv]); }
  for(let i=0;i<seg;i++){ const a=i*2,b=a+1,c=a+3,d=a+2; if(out>0) g.I.push(a,b,c,a,c,d); else g.I.push(a,c,b,a,d,c); }
  g.groups.push({start:0,count:g.I.length,mi:0}); return g; }

/* ---------- the moving counter: one dynamic mesh ---------- */
/* builder with vertex colour; quads fix their own winding from the normal they are given */
function suMB(){ return {P:[],N:[],T:[],C:[],I:[]}; }
function suQ(s,ps,n,uv,col){ const b=s.P.length/3; for(let i=0;i<4;i++){ s.P.push(ps[i][0],ps[i][1],ps[i][2]); s.N.push(n[0],n[1],n[2]); s.T.push(uv[i][0],uv[i][1]); s.C.push(col[0],col[1],col[2]); }
  const e1=v3.sub(ps[1],ps[0]),e2=v3.sub(ps[2],ps[0]),c=v3.cross(e1,e2); if(c[0]*n[0]+c[1]*n[1]+c[2]*n[2]>=0) s.I.push(b,b+1,b+2,b,b+2,b+3); else s.I.push(b,b+2,b+1,b,b+3,b+2); }
/* a box centred on (cx,cz), base at cy; faces [+x,-x,+y,-y,+z,-z] take a rect each; tw/td taper the top */
function suMBox(s,cx,cy,cz,w,h,d,rects,col,tw=1,td=1,rz=0){ const many=Array.isArray(rects[0]);
  FACES.forEach(([n,U,V,ku,kv,ko],f)=>{ if(f===3) return; const r=many?(rects[f]||rects[0]):rects, S={w,h,d}, du=S[ku]/2,dv=S[kv]/2,off=S[ko]/2, ps=[],uv=[];
    for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ let p=[0,1,2].map(k=>n[k]*off+U[k]*a*du+V[k]*b*dv); if(p[1]>0){ p[0]*=tw; p[2]*=td; }
      if(rz){ const c=Math.cos(rz),sn=Math.sin(rz),x=p[0],y=p[1]; p[0]=x*c-y*sn; p[1]=x*sn+y*c; }
      ps.push([cx+p[0],cy+h/2+p[1],cz+p[2]]); uv.push([r[0]+(a+1)/2*(r[2]-r[0]),r[1]+(b+1)/2*(r[3]-r[1])]); }
    let nn=n; if(rz){ const c=Math.cos(rz),sn=Math.sin(rz); nn=[n[0]*c-n[1]*sn,n[0]*sn+n[1]*c,n[2]]; } suQ(s,ps,nn,uv,f===2?col:col.map(v=>v*.82)); }); }
function suMCyl(s,cx,cy,cz,rad,h,seg,side,top,col){ for(let i=0;i<seg;i++){ const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2,am=(a0+a1)/2;
    const p=(a,y)=>[cx+Math.cos(a)*rad,y,cz+Math.sin(a)*rad];
    suQ(s,[p(a0,cy),p(a1,cy),p(a1,cy+h),p(a0,cy+h)],[Math.cos(am),0,Math.sin(am)],[[side[0]+(side[2]-side[0])*i/seg,side[1]],[side[0]+(side[2]-side[0])*(i+1)/seg,side[1]],[side[0]+(side[2]-side[0])*(i+1)/seg,side[3]],[side[0]+(side[2]-side[0])*i/seg,side[3]]],col.map(v=>v*.85));
    const tu=(a)=>[top[0]+(top[2]-top[0])*(.5+Math.cos(a)/2),top[1]+(top[3]-top[1])*(.5+Math.sin(a)/2)], tc=[(top[0]+top[2])/2,(top[1]+top[3])/2];
    const b=s.P.length/3; for(const [pp,uv] of [[[cx,cy+h,cz],tc],[p(a0,cy+h),tu(a0)],[p(a1,cy+h),tu(a1)]]){ s.P.push(...pp); s.N.push(0,1,0); s.T.push(...uv); s.C.push(...col); } s.I.push(b,b+2,b+1); } }
/* a kaiten plate: foot, coloured underside and lip, patterned inner rim, white glazed well */
function suMPlate(s,col){ const seg=12, prof=[[.05,0],[.056,.007],[.088,.02],[.085,.025],[.068,.017]], rim=suCell(1), ctr=suCell(0);
  for(let b=0;b<4;b++){ const [r0,y0]=prof[b],[r1,y1]=prof[b+1], dr=r1-r0,dy=y1-y0, L=Math.hypot(dr,dy), nr=dy/L, ny=-dr/L, tint=b===0?col.map(v=>v*.6):b===3?col.map(v=>.55+v*.45):col;
    for(let i=0;i<seg;i++){ const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2,am=(a0+a1)/2, P=(r,y,a)=>[Math.cos(a)*r,y,Math.sin(a)*r], u0=rim[0]+(rim[2]-rim[0])*i/seg,u1=rim[0]+(rim[2]-rim[0])*(i+1)/seg, vA=rim[1]+(rim[3]-rim[1])*(1-b/4),vB=rim[1]+(rim[3]-rim[1])*(1-(b+1)/4);
      suQ(s,[P(r0,y0,a0),P(r0,y0,a1),P(r1,y1,a1),P(r1,y1,a0)],[Math.cos(am)*nr,ny,Math.sin(am)*nr],[[u0,vA],[u1,vA],[u1,vB],[u0,vB]],tint); } }
  const R0=.068,Y=.017; for(let i=0;i<seg;i++){ const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2, uv=a=>[ctr[0]+(ctr[2]-ctr[0])*(.5+Math.cos(a)*.5),ctr[1]+(ctr[3]-ctr[1])*(.5+Math.sin(a)*.5)];
    const b=s.P.length/3; for(const [pp,t] of [[[0,Y-.002,0],[(ctr[0]+ctr[2])/2,(ctr[1]+ctr[3])/2]],[[Math.cos(a0)*R0,Y,Math.sin(a0)*R0],uv(a0)],[[Math.cos(a1)*R0,Y,Math.sin(a1)*R0],uv(a1)]]){ s.P.push(...pp); s.N.push(0,1,0); s.T.push(...t); s.C.push(1,1,1); } s.I.push(b,b+2,b+1); } }
/* what can ride on a plate */
const SU_NETA={akami:4,salmon:5,chutoro:6,hamachi:7,ebi:8,tamago:9,ika:10,unagi:11};
function suMSushi(s,kind,y0=.017){ const W=[1,1,1], rice=suCell(2), nori=suCell(3);
  if(SU_NETA[kind]!==undefined){ const nt=suCell(SU_NETA[kind]);
    for(const z of [-.023,.023]){ suMBox(s,0,y0,z,.07,.024,.033,rice,W,.88,.8); suMBox(s,.002,y0+.022,z,.084,.011,.041,[nt,nt,nt,nt,nt,nt],W,.96,.9);
      if(kind==='tamago') suMBox(s,0,y0-.001,z,.014,.036,.045,nori,W);
      if(kind==='ebi') suMBox(s,.046,y0+.026,z,.022,.008,.03,nt,[1,.9,.85],1,.6,.5);
      if(kind==='unagi') suMBox(s,0,y0+.031,z,.07,.002,.006,nori,W); } }
  else if(kind==='gunkan'||kind==='uni'){ const top=kind==='uni'?suCell(9):suCell(12); for(const z of [-.024,.024]) suMBox(s,0,y0,z,.05,.034,.038,[nori,nori,top,nori,nori,nori],W,1,1); }
  else if(kind==='maki'||kind==='kappa'){ const top=suCell(13); for(let k=-1;k<=1;k++) suMCyl(s,k*.04,y0,0,.02,.03,8,nori,top,kind==='kappa'?[.75,1,.8]:W); } }
