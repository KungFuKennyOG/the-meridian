
/* =====================================================================================================
   MORE STATIONS, each after a real one:
   Hong Kong   – an MTR platform: one bold tile colour on every wall, stainless columns, yellow signs.
   Lake Baikal – a Moscow-metro palace: a yellow mosaic barrel vault, marble arcades, bronze chandeliers.
   Rio         – a cavern blasted out of raw granite, like Cardeal Arcoverde, with a Selaron-style tiled stair.
   Las Vegas   – a casino concourse under a Fremont Street LED canopy.
   Tokyo gets colour (lightbox ads, a kiosk) and the last-night katana in the ticket office.
   ===================================================================================================== */
function vaultArc(parent,R0,zc,yc,segs,mat,ribMat,ribStep){
  for(let i=0;i<segs;i++){ const a0=-Math.PI/2+i/segs*Math.PI, a1=-Math.PI/2+(i+1)/segs*Math.PI, am=(a0+a1)/2, len=2*R0*Math.sin((a1-a0)/2);
    mk(wplane(SL,len,1.6,1.6),mat,parent,0,yc+Math.cos(am)*R0,zc+Math.sin(am)*R0,am+Math.PI/2,0,0); }
  if(ribMat) for(let x=-SL/2+ribStep/2;x<SL/2;x+=ribStep) for(let i=0;i<segs;i++){ const a=-Math.PI/2+(i+.5)/segs*Math.PI; if(Math.sin(a)>.1) continue; B(parent,ribMat,x,yc+Math.cos(a)*(R0-.06)-.12,zc+Math.sin(a)*(R0-.06),.3,.24,R0*Math.PI/segs*1.03,0,a,0); } }
function dropRing(n){ n.ring=mk(plane(1.6,1.6),M(tRing,{unlit:true,cut:true,color:0xf5c542}),n,0,.012,0,-Math.PI/2); return n; }
function pDual(g){ const a=N(g,-.07,0,0); pPistol(a); const b=N(g,.07,0,0,0,0,.2); pPistol(b); return g; }
function pGL(g){ mk(cyl(.045,.045,.34,10),M(tBlued,{double:true}),g,0,.03,.2,Math.PI/2); mk(cyl(.07,.07,.12,10),C('#3a3c34'),g,0,-.02,0,Math.PI/2); mk(box(.03,.12,.04),mBlack,g,0,-.08,-.1,.3); mk(box(.04,.08,.22),C('#4a4a3a'),g,0,-.02,-.2); return g; }
function pMG(g){ const gold=C('#d4ad5a'); mk(box(.06,.1,.36),gold,g,0,0,0); mk(cyl(.018,.018,.7,8),M(null,{color:0xd4ad5a,double:true}),g,0,.02,.52,Math.PI/2); mk(box(.08,.1,.12),C('#2a2a2e'),g,.06,-.02,.06); mk(box(.05,.12,.24,{td:.7}),gold,g,0,-.03,-.28,.08); for(let k=0;k<8;k++) mk(box(.012,.04,.012),C('#d8b040'),g,.11+k*.02,-.06-k*.012,.06); return g; }
function pKatana(g){ mk(box(.03,.035,.28),M(P2(8,16,(g,w,h)=>{ R(g,'#1a1214',0,0,w,h); for(let y=0;y<h;y+=3) R(g,'#c8202a',1,y,w-2,1); })),g,0,0,0); mk(cyl(.045,.045,.01,10),C('#d4ad5a'),g,0,0,.15,Math.PI/2); mk(box(.006,.034,.72,{td:.5}),M(tBlade,{double:true}),g,0,0,.52,0,0,0); return g; }

/* ---------- Hong Kong: Meridian Central ---------- */
STATION_BUILD.hongkong=function hongkongStation(){
  const red='#b8202a';
  const wall=M(P2(32,32,(g,w,h)=>{ for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8) vfill(g,x,y,8,8,[[0,mix(red,'#ffffff',.08)],[1,red]]); for(let k=0;k<4;k++){ R(g,'#8a1820',0,k*8,w,1); R(g,'#8a1820',k*8,0,1,h); } },3,31));
  const floor=M(P2(32,32,(g,w,h)=>{ R(g,'#c8c4bc',0,0,w,h); for(let y=0;y<h;y+=16) for(let x=0;x<w;x+=16) R(g,'#b8b4ac',x,y,8,8); R(g,'#a8a49c',0,0,w,1); R(g,'#a8a49c',0,0,1,h); },4,32));
  const g=stationShell('hongkong',{floor,floorTile:2,back:wall,far:wall,end:wall,ceil:M(P2(32,32,(g,w,h)=>{ R(g,'#e8ecee',0,0,w,h); R(g,'#c8ccd0',0,0,w,2); R(g,'#ffffff',0,14,w,4); },4,33)),ceilTile:3,H:4.4,
    meta:{name:'Meridian Central',city:'Hong Kong',num:'02',sw:[red,'#e8ecee','#f2c230','#c8ccd2','#2a2a30'],crew:['lau','lauc'],weapon:1,
      note:'Built like an MTR platform: every wall in one bold colour of tile (this one is lucky red), stainless columns, platform screen doors, bright fluorescent light and yellow signs with black lettering. A dim sum counter does takeaway on the platform.',
      lamps:[lamp(-20,4.1,2,[1.05,1.05,1.1],10),lamp(-6,4.1,2,[1.05,1.05,1.1],10),lamp(8,4.1,2,[1.05,1.05,1.1],10),lamp(22,4.1,2,[1.05,1.05,1.1],10),lamp(0,3,-5,[.6,.6,.64],12),lamp(-12,1.6,6.2,[1.3,.8,.4],4)],amb:[.38,.36,.38],cam:{t:[-7,1.6,2.5],th:.38,ph:1.25,r:17}}});
  const BK=ST.hongkong.back;
  /* a white panel with the station name every few metres, as on the MTR */
  const nm=M(P2(64,32,(g,w,h)=>{ R(g,'#f4f4f0',0,0,w,h); text(g,'MERIDIAN',(w-textW('MERIDIAN',1))/2|0,4,'#1a1a1e',1); text(g,'CENTRAL',(w-textW('CENTRAL',1))/2|0,11,'#1a1a1e',1); glyphs(g,20,20,4,6,red,9,false); }));
  for(let x=-26;x<=26;x+=13) mk(wplane(2.6,1.3),nm,BK,x,2.2,SZ1-.06,0,Math.PI,0);
  for(let x=-30;x<30;x+=2){ if(Math.abs(((x+31)%31)-1)<1.5||Math.abs(x+.5)<1.6) continue; B(g,C('#c8ccd2'),x+1,0,-1.45,.08,2.1,.08); B(g,C('#a8c8d8',{emissive:0x0c1418}),x+1,.25,-1.45,1.92,1.7,.02); B(g,C(red),x+1,2.1,-1.45,2,.18,.1); }
  for(let x=-24;x<=24;x+=8){ B(g,C('#d8dce0'),x,0,3,.6,4.4,.6); B(g,C(red),x,1.8,3,.62,.5,.62); }
  const ysign=M(textTex(64,16,'#f2c230',[['EXIT  A','c',2,'#1a1a1e'],['TO TRAINS','c',9,'#1a1a1e']]),{unlit:true});
  for(const x of [-16,12]){ B(g,C('#1a1a1e'),x,3.2,1,2.6,.6,.08); mk(wplane(2.5,.55),ysign,g,x,3.5,1.05); mk(wplane(2.5,.55),ysign,g,x,3.5,.95,0,Math.PI,0); }
  /* the dim sum takeaway counter, stacked bamboo steamers, a red lantern */
  B(g,C('#2a1a12'),-12,0,6.3,3.6,1.05,1.0); B(g,C('#d4ad5a'),-12,1.05,6.3,3.7,.05,1.1); const bam=M(P2(16,8,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e2c890'],[1,'#c8a868']]); for(let x=0;x<w;x+=2) R(g,'#a8884a',x,0,1,h); }));
  for(let k=0;k<9;k++) mk(cyl(.17,.17,.12,10),bam,g,-13.4+(k%3)*.45,1.16+Math.floor(k/3)*.13,6.4); mk(lathe([[0,.1,.1],[.1,.3,.3],[.42,.3,.3],[.52,.1,.1]],10),U('#ff4030'),g,-12,2.6,6.3);
  const box_=N(g,-10.5,1.1,6.0); B(box_,C('#f4f2ec'),0,0,0,.36,.18,.26); B(box_,C('#c8202a'),0,.18,0,.36,.02,.26); const p=N(box_,0,.24,0,0,.5,Math.PI/2); pDual(p);;
  ST.hongkong.drop=dropRing(N(g,-10.5,0,5.0));
  ST.hongkong.spots={lau:{x:3,z:.8,ry:Math.PI*.85},lauc:{x:1.2,z:-.4,ry:Math.PI*.75},lauc2:{x:5,z:-.2,ry:Math.PI*.95}};
};

/* ---------- Lake Baikal: an underground palace ---------- */
STATION_BUILD.baikal=function baikalStation(){
  const yellow=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f2d890'],[1,'#e2c070']]); R(g,'#c8a050',0,0,w,1); for(const [x,y] of [[8,8],[24,24]]){ ell(g,x,y,4,3,'#ffffff'); ell(g,x,y,2.5,1.8,'#e2c070'); } },3,41));
  const mosaic=M(P2(32,32,(g,w,h)=>{ R(g,'#c8a050',0,0,w,h); vfill(g,2,2,w-4,h-4,[[0,'#2a5aa8'],[1,'#1a3a7a']]); ell(g,16,18,6,8,'#d8a040'); ell(g,16,10,4,4,'#e8c8a0'); R(g,'#c82a2a',12,22,8,6); for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; R(g,'#f2d890',16+Math.cos(a)*12|0,16+Math.sin(a)*12|0,1,1); } },2,42),{emissive:0x101010});
  const marble=M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f2ece4'],[1,'#ddd4c8']]); const r=rng(43); for(let i=0;i<5;i++){ g.strokeStyle=rgba('#a89a8a',.5); g.beginPath(); g.moveTo(r()*w,0); g.quadraticCurveTo(r()*w,h/2,r()*w,h); g.stroke(); } },3,43));
  const granite=M(P2(32,32,(g,w,h)=>{ for(let y=0;y<4;y++) for(let x=0;x<4;x++) vfill(g,x*8,y*8,8,8,(x+y)%2?[[0,'#8a2a2a'],[1,'#6a1e1e']]:[[0,'#5a5a5e'],[1,'#4a4a4e']]); const r=rng(44); for(let i=0;i<60;i++) R(g,rgba('#ffffff',.15),r()*w|0,r()*h|0,1,1); },4,44));
  const g=stationShell('baikal',{floor:granite,floorTile:2.4,back:marble,far:marble,end:marble,H:3.0,
    meta:{name:'Baikalskaya',city:'Lake Baikal',num:'03',sw:['#f2d890','#2a5aa8','#f2ece4','#8a2a2a','#d4ad5a'],crew:['volkov','volkovc'],weapon:2,
      note:'An underground palace in the Moscow-metro manner: a yellow barrel vault set with mosaic panels, white marble arcades, bronze chandeliers on chains and a red-and-grey granite floor. Freezing outside, warm and gold down here.',
      lamps:[lamp(-22,4.5,2,[1.3,1.0,.6],10),lamp(-8,4.8,2,[1.3,1.0,.6],10),lamp(8,4.8,2,[1.3,1.0,.6],10),lamp(22,4.5,2,[1.3,1.0,.6],10),lamp(0,4,-5,[.8,.65,.45],12),lamp(14,1.4,5.6,[1.0,.8,.5],4)],amb:[.36,.3,.24],cam:{t:[-7,2,2.5],th:.4,ph:1.2,r:18}}});
  ST.baikal.H=12.4; const top=ST.baikal.top; vaultArc(top,9.8+DW*.55,-.8-DW*.55,2.6,16,yellow,C('#c8a050'),8);
  /* mosaic panels set into the vault crown */ for(let x=-28;x<=28;x+=8){ const n=N(top,x,2.6+9.7,-.8); mk(wplane(3,2.4),mosaic,n,0,0,0,Math.PI/2,0,0); }
  /* marble arcade between platform and track */ for(let x=-28;x<=28;x+=4){ B(g,marble,x,0,-.6,.6,3.2,.6); B(g,C('#d4ad5a'),x,3.2,-.6,.8,.25,.8); B(g,marble,x,0,-.6,.8,.3,.8); }
  for(let x=-26;x<=26;x+=4) for(let k=0;k<6;k++){ const a=Math.PI*(k+.5)/6, ax=x+Math.cos(a)*-1.7; B(g,marble,ax,3.4+Math.sin(a)*1.2,-.6,.7,.2,.5,0,0,Math.PI/2-a); }
  /* bronze chandeliers on chains */ const bronze=C('#a87a3a'), glass=U('#fff0c8');
  for(const x of [-20,-10,0,10,20]){ B(top,bronze,x,4.6,2.2,.03,7,.03); const c=N(top,x,4.2,2.2); mk(torus(.7,.05,4,18),bronze,c,0,0,0,Math.PI/2); mk(torus(.45,.04,4,14),bronze,c,0,.35,0,Math.PI/2);
    for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; B(c,glass,Math.cos(a)*.7,.02,Math.sin(a)*.7,.08,.22,.08); } mk(lathe([[0,.05,.05],[.2,.2,.2],[.5,.08,.08]],8),bronze,c,0,-.4,0); }
  /* benches, a luggage trolley with a fur coat over the shotgun */
  for(const x of [-18,-6,6,18]){ B(g,C('#5a3a22'),x,.44,6.6,2.4,.08,.5); B(g,C('#5a3a22'),x,.5,6.9,2.4,.5,.08); for(const dx of [-1.1,1.1]) B(g,bronze,x+dx,0,6.6,.08,.44,.45); }
  const tr=N(g,-2,0,5.6,0,.3,0); B(tr,C('#3a3c40'),0,.3,0,1.6,.06,.7); for(const dx of [-.6,.6]) for(const dz of [-.3,.3]) mk(cyl(.1,.1,.05,8),C('#14141c'),tr,dx,.1,dz,Math.PI/2); B(tr,C('#3a3c40'),-.8,.3,0,.05,1.0,.7);
  B(tr,C('#6a4428'),.1,.36,0,.8,.5,.55); B(tr,M(fabT('#5a3e28',45,(g,w,h)=>{ for(let i=0;i<30;i++) R(g,i%2?'#7a5e40':'#3a2a1a',(i*7)%w,(i*5)%h,1,2); })),.2,.86,0,1.1,.12,.7,0,0,.1);
  const sg=N(tr,.0,.98,.0,0,1.2,0); pShotgun(sg); ST.baikal.drop=dropRing(N(g,-2,0,5.6));
  ST.baikal.spots={volkov:{x:4,z:.6,ry:Math.PI*.85},volkovc:{x:2.2,z:2.0,ry:Math.PI*.8},volkovc2:{x:6,z:1.8,ry:Math.PI*.95}};
};

/* ---------- Rio: a granite cavern and a tiled stair ---------- */
STATION_BUILD.rio=function rioStation(){
  const rock=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#8a8680'],[1,'#6a6660']]); const r=rng(51); for(let i=0;i<40;i++){ const x=r()*w,y=r()*h; ell(g,x,y,3+r()*5,2+r()*3,rgba(r()>.5?'#a8a49c':'#4a4640',.5)); } for(let i=0;i<6;i++){ g.strokeStyle=rgba('#3a3630',.6); g.beginPath(); g.moveTo(r()*w,r()*h); g.lineTo(r()*w,r()*h); g.stroke(); } },10,51));
  const floor=M(P2(32,32,(g,w,h)=>{ R(g,'#d8d0c0',0,0,w,h); for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(Math.sin(x/w*Math.PI*4+Math.sin(y/h*Math.PI*2)*2)>.6) R(g,'#2a2a2e',x,y,1,1); },3,52));
  const g=stationShell('rio',{floor,floorTile:2.5,back:rock,far:rock,end:rock,H:2.6,
    meta:{name:'Meridiano Copacabana',city:'Rio',num:'06',sw:['#8a8680','#d8d0c0','#e0473a','#f2c230','#2a9a5a'],crew:['tremor','tremorc'],weapon:5,
      note:'Blasted out of raw granite like Cardeal Arcoverde, with the rock left bare and lit warm from below. A staircase covered in hundreds of bright mismatched tiles comes down from the beach, the platform floor has the wave mosaic of the promenade, and there are palms in the gaps.',
      lamps:[lamp(-22,2.2,6,[1.4,1.0,.6],10),lamp(-8,2.2,6,[1.4,1.0,.6],10),lamp(8,2.2,6,[1.4,1.0,.6],10),lamp(22,2.2,6,[1.4,1.0,.6],10),lamp(0,5,-3,[.8,.6,.5],14),lamp(-20,1.2,4.5,[1.2,.7,.4],5)],amb:[.3,.26,.24],cam:{t:[-7,2,2.5],th:.4,ph:1.2,r:18}}});
  ST.rio.H=12.8; const top=ST.rio.top; vaultArc(top,10.2+DW*.55,-.9-DW*.55,2.6,12,rock,null,0);
  /* boulders bulging out of the back wall */ const r=rng(53); for(let k=0;k<14;k++){ const x=-30+k*4.4+r()*2; if(Math.abs(x-15)<3.4) continue; /* the wall map */ mk(lathe([[0,.6,.4],[.6,1.1,.7],[1.4,.9,.6],[1.9,.2,.2]],7),rock,ST.rio.back,x,r()*1.2,SZ1-.4,0,r()*3,0); }
  /* the tiled staircase down from the beach */ const tileCols=['#e0473a','#f2c230','#2a9a5a','#2a6ad8','#f27ab0','#f2ece0','#e88a3a','#7ac0d8'];
  const tiles=M(P2(32,32,(g,w,h)=>{ const q=rng(54); for(let y=0;y<h;y+=4) for(let x=0;x<w;x+=4){ R(g,tileCols[q()*tileCols.length|0],x,y,4,4); if(q()<.3) ell(g,x+2,y+2,1,1,tileCols[q()*tileCols.length|0]); R(g,'#f2ece0',x,y,4,1); R(g,'#f2ece0',x,y,1,4); } },0,54));
  for(let k=0;k<12;k++){ B(g,tiles,24-k*.45,0,6.6,.46,(12-k)*.21,2.4); } B(g,tiles,26,0,5.2,.3,2.6,.3); for(let k=0;k<3;k++) B(g,C('#f2ece0'),24-k*2,2.6-k*.6,7.8,2,.06,.06);
  /* palms in planters, a coconut cart, the cooler with the launcher in the ice */
  for(const x of [-24,-12,10]){ mk(cyl(.4,.35,.6,10),C('#c8643a'),g,x,.3,5.8); B(g,C('#7a5a3e'),x,.6,5.8,.14,2.2,.14,0,0,.1); for(let k=0;k<7;k++) mk(box(.16,.05,1.2),C('#3f8a3e'),g,x+.2,2.8,5.8,0,k/7*Math.PI*2,.45); }
  B(g,C('#2a9a5a'),-4,.3,6.2,1.4,.6,.8); for(const dx of [-.5,.5]) mk(cyl(.25,.25,.08,10),C('#2a2a2e'),g,-4+dx,.25,5.8,Math.PI/2); for(let k=0;k<6;k++) mk(lathe([[0,.08,.08],[.1,.12,.12],[.2,.06,.06]],6),C('#5a8a3a'),g,-4.4+(k%3)*.35,.9,6.0+(k>2?.3:0));
  const cool=N(g,0,0,5.4,0,.2,0); B(cool,C('#2a6ad8'),0,0,0,1.1,.6,.6); B(cool,C('#f2ece0'),0,.6,0,1.12,.06,.62); B(cool,C('#e8f8ff'),0,.62,0,.9,.06,.4); B(cool,C('#2a6ad8'),0,.66,-.36,1.1,.5,.06,0,-.7); const gl=N(cool,0,.78,0,0,1.3,0); pGL(gl);
  ST.rio.drop=dropRing(N(g,0,0,5.4));
  ST.rio.spots={tremor:{x:4,z:.8,ry:Math.PI*.85},tremorc:{x:2.2,z:2.2,ry:Math.PI*.75},tremorc2:{x:6.2,z:1.4,ry:Math.PI*.95}};
};

/* ---------- Las Vegas: the concourse under the canopy ---------- */
STATION_BUILD.vegas=function vegasStation(){
  const carpet=M(P2(32,32,(g,w,h)=>{ R(g,'#3a0e3a',0,0,w,h); for(const [x,y,c] of [[8,8,'#f5c542'],[24,24,'#29e0e6'],[24,8,'#ff3fa4'],[8,24,'#7cf06a']]){ ell(g,x,y,5,5,c); ell(g,x,y,3,3,'#3a0e3a'); poly(g,[[x,y-7],[x+2,y],[x,y+7],[x-2,y]],c); } },6,61));
  const wall=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a1438'],[1,'#1a0c26']]); for(let x=0;x<w;x+=8) R(g,'#3a2048',x,0,1,h); },4,62));
  const g=stationShell('vegas',{floor:carpet,floorTile:1.6,back:wall,far:wall,end:wall,H:6.5,
    meta:{name:'Meridian Strip',city:'Las Vegas',num:'07',sw:['#3a0e3a','#ff3fa4','#29e0e6','#f5c542','#2a1438'],crew:['king','kingc'],weapon:6,
      note:'A casino concourse more than a station, under a canopy of LEDs like Fremont Street that never stops changing. Casino carpet, slot machines along the back wall, a drive-in wedding chapel booth and a roulette table on the platform.',
      lamps:[lamp(-20,5,2,[1.3,.5,1.0],12),lamp(-6,5,2,[.5,1.1,1.2],12),lamp(8,5,2,[1.3,1.0,.4],12),lamp(22,5,2,[1.3,.5,1.0],12),lamp(0,4,-5,[.6,.4,.7],14),lamp(-8,1.6,5.8,[1.4,1.1,.6],4)],amb:[.24,.18,.28],minLamp:1,cam:{t:[-7,2.4,2.5],th:.4,ph:1.4,r:16}}});
  /* the LED canopy: three painted frames swapped in turn */
  const frames=[0,1,2].map(f=>P2(64,32,(g,w,h)=>{ const cols=['#ff3fa4','#29e0e6','#f5c542','#7cf06a','#b07aff']; for(let y=0;y<h;y+=2) for(let x=0;x<w;x+=2){ const v=Math.sin(x*.18+f*2.1)+Math.sin(y*.3+x*.05-f*1.4); R(g,v>1.1?cols[(f+((x>>3)%5))%5]:v>.3?mix(cols[(f+2)%5],'#1a0c26',.55):'#1a0c26',x,y,2,2); } text(g,['MERIDIAN','JACKPOT','WELCOME'][f],10,12,'#ffffff',1); }));
  const canopyM=M(frames[0],{unlit:true}); mk(wplane(SL,SZ1-SZ0+2,16,8),canopyM,ST.vegas.top,0,6.4,(SZ1+SZ0)/2,Math.PI/2); let fi=0; ST.vegas.anim.push(t=>{ const k=Math.floor(t*2.5)%3; if(k!==fi){ fi=k; canopyM.tex=frames[k]; } });
  for(let x=-30;x<=30;x+=6){ B(ST.vegas.top,C('#2a2a30'),x,6.1,(SZ1+SZ0)/2,.3,.3,SZ1-SZ0); }
  /* slot machines along the back */ const scr=(s)=>M(P2(16,24,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a1a4a'],[1,'#120a22']]); const q=rng(s); for(let k=0;k<3;k++){ R(g,'#f2ece0',1+k*5,6,4,8); text(g,q()<.5?'7':'$',2+k*5,7,['#f5c542','#d63a2c','#2a9a5a'][k],1); } R(g,'#ff3fa4',0,0,w,3); }),{unlit:true});
  for(let i=0;i<16;i++){ const x=-28+i*3.6, n=N(ST.vegas.back,x,0,7.9,0,Math.PI,0); B(n,C(['#5a1a3a','#1a4a5a','#2a2a5a'][i%3]),0,0,0,.9,1.2,.7); mk(wplane(.7,.8),scr(i),n,0,1.6,.36); B(n,C('#2a2a30'),0,1.2,0,.9,.8,.66); B(n,G('#f5c542'),0,2.0,.05,.92,.14,.72); }
  /* neon signs */ const neon=(s,c)=>M(textTex(64,16,'#0a0814',[[s,'c',4,c,1]]),{unlit:true});
  [['JACKPOT','#f5c542',-20],['MERIDIAN','#29e0e6',0],['SLOTS','#ff3fa4',20]].forEach(([s,c,x])=>{ mk(wplane(5,1.25),neon(s,c),ST.vegas.back,x,4.2,SZ1-.06,0,Math.PI,0); });
  /* the wedding chapel booth */ const ch=N(g,18,0,6.2); B(ch,C('#f6f0f2'),0,0,0,3,2.6,1.8); B(ch,C('#f2a0b8'),0,2.6,0,3.2,.15,2); B(ch,C('#f5c542'),0,2.75,0,.1,.8,.1); B(ch,C('#f5c542'),0,3.2,0,.5,.1,.1); mk(wplane(2.4,.5),neon('CHAPEL','#f2a0b8'),ch,0,2.2,-.92,0,Math.PI,0);
  /* the roulette table with the gold machine gun and a bow on it */ const felt=M(fabT('#1f6a3a',63)), wood=M(woodT('#3a1e14','#24120c',64));
  const rt=N(g,-8,0,5.4); B(rt,wood,0,0,0,3.2,.85,1.6); B(rt,felt,0,.85,0,3.0,.04,1.4); mk(cyl(.4,.4,.08,18),[wood,C('#c8202a'),C('#c8202a')],rt,-1.1,.92,0);
  const mg=N(rt,.4,.98,0,0,1.4,0); pMG(mg); B(rt,C('#d63a2c'),.4,1.05,0,.06,.04,.5); B(rt,C('#d63a2c'),.4,1.1,0,.2,.12,.06,0,0,.6); B(rt,C('#d63a2c'),.4,1.1,0,.2,.12,.06,0,0,-.6);
  ST.vegas.drop=dropRing(N(g,-8,0,4.4));
  ST.vegas.spots={king:{x:3.5,z:.8,ry:Math.PI*.85},kingc:{x:1.6,z:2.2,ry:Math.PI*.75},kingc2:{x:5.6,z:1.6,ry:Math.PI*.95}};
};

/* ---------- Tokyo: colour, and the katana for the last night ---------- */
STATION_POST.tokyo=function tokyoPolish(){
  const g=ST.tokyo.g, BK=ST.tokyo.back;
  const ad=(seed,a,b,word)=>M(P2(32,48,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,a],[1,b]]); ell(g,16,18,10,10,mix(a,'#ffffff',.5)); glyphs(g,4,32,6,5,'#ffffff',seed,false); if(word) text(g,word,3,4,'#ffffff',1); }),{unlit:true});
  const ads=[ad(1,'#ff4fae','#8a2a6a','SALE'),ad(2,'#29e0e6','#1a5a7a','NEW'),ad(3,'#f5c542','#c86a20','COLA'),ad(4,'#7cf06a','#2a7a3a','TEA'),ad(5,'#b07aff','#4a2a8a','LIVE')];
  for(let k=0;k<9;k++){ const x=-26+k*6.5; B(BK,C('#c8ccd2'),x,1.0,SZ1-.06,1.4,2.0,.06); mk(wplane(1.25,1.85),ads[k%5],BK,x,2.0,SZ1-.1,0,Math.PI,0); }
  /* a little convenience kiosk */ B(g,C('#2a9a5a'),22,0,6.5,3,2.4,1.6); B(g,C('#f2f2ee'),22,.9,5.68,2.8,1.2,.04); for(let k=0;k<12;k++) B(g,C(['#d63a2c','#2a6ad8','#f2c230','#f28a3a'][k%4]),20.8+(k%6)*.45,1.0+Math.floor(k/6)*.5,5.66,.3,.35,.03); B(g,U('#f2f2ee'),22,2.3,5.68,2.8,.25,.03);
  /* floor guide lines towards the gates */ for(const [z,c] of [[2.2,'#2a9a5a'],[2.5,'#f28a3a']]) B(g,U(c),0,.006,z,SL-4,.01,.12);
  /* the ticket office, with the katana wrapped in silk on the counter */ const off=N(g,-20,0,6.4); B(off,C('#e8ecee'),0,0,0,3.2,2.4,2); B(off,C('#2a9a5a'),0,2.4,0,3.3,.25,2.1); B(off,C('#a8c8d8',{emissive:0x101418}),0,1.0,-1.02,2.6,1.1,.04); B(off,C('#c8ccd2'),0,1.0,-1.1,2.8,.06,.3);
  const silk=N(g,-20,1.08,5.25,0,.15,0); B(silk,C('#c8202a'),0,0,0,1.1,.05,.18); const kt=N(silk,0,.12,0,0,Math.PI/2,0); pKatana(kt);
  ST.tokyo.drop2=dropRing(N(g,-20,0,4.6)); ST.tokyo.drop2.ring.mesh.mats[0]=M(tRing,{unlit:true,cut:true,color:0xff4a4a});
};
STATION_ORDER.splice(0,STATION_ORDER.length,'tokyo','hongkong','baikal','london','naples','rio','vegas');

