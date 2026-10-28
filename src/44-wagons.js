
/* =====================================================================================================
   THE CARS. 28 m of floor, 8.8 m wide, 3.4 m to the ceiling, floor at y=0, front of the train at +x.
   Each car is one crew's territory and has its own palette, materials, light and dressing.
   Walls face inward and are one-sided (orbit view sees in); dressing on each wall lives in that wall's
   side node so it hides with the wall.
   ===================================================================================================== */
const WL=28, WZ0=2.9, WZ=WZ0+DW, WH=3.4;
/* K: stays where it is when the car widens; Wz: moves out with the wall even though it sits near the middle */
const K=n=>(n.keep=1,n), Wz=n=>(n.wz=1,n);
const WG={}, CAR_BUILD={}, CAR_POST={};
function wplane(w,h,tu=1,tv=1){ const g=plane(w,h,Math.max(1,Math.round(w/2)),Math.max(1,Math.round(h/1.5))); for(let i=0;i<g.T.length;i+=2){ g.T[i]*=w/tu; g.T[i+1]*=h/tv; } return g; }
function B(g,m,x,y,z,w,h,d,ry=0,rx=0,rz=0){ return mk(box(w,h,d,{at:[0,h/2,0]}),m,g,x,y,z,rx,ry,rz); }
const C=(hex,o={})=>M(null,Object.assign({color:typeof hex==='string'?hexInt(hex):hex},o));
const U=(hex)=>M(null,{color:typeof hex==='string'?hexInt(hex):hex,unlit:true});
const G=(hex)=>M(null,{color:typeof hex==='string'?hexInt(hex):hex,emissive:hexInt(mix(hex,'#000000',.45))});
function woodT(a,b,seed,vert=false){ return P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,a],[1,b]]); const r=rng(seed); for(let i=0;i<14;i++){ const p=r()*32|0; g.fillStyle=rgba('#000000',.12+r()*.1); if(vert) g.fillRect(p,0,1,h); else g.fillRect(0,p,w,1); } for(let i=0;i<5;i++) ell(g,r()*w,r()*h,vert?1:3,vert?3:1,rgba('#000000',.12)); },8,seed); }
function fabT(a,seed,motif){ return P2(16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,a],[1,mix(a,'#000000',.12)]]); if(motif) motif(g,w,h); },10,seed); }
const lineT=(base,line,seed,s=32)=>P2(s,s,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,mix(base,'#ffffff',.06)],[1,base]]); R(g,line,0,0,w,1); R(g,line,0,0,1,h); },6,seed);
function textTex(w,h,bg,lines){ return P2(w,h,(g,W_,H_)=>{ R(g,bg,0,0,W_,H_); for(const [s,x,y,c,sc] of lines) text(g,s,x==='c'?((W_-textW(s,sc||1))/2|0):x,y,c,sc||1); }); }
const lamp=(x,y,z,col,dist)=>[[x,y,z],col,dist];
function shell(key,d){
  const g=N(world); g.vis=false; const lo=d.lo??1.0, hi=d.hi??2.6; const side={'-1':N(g),'1':N(g)};
  mk(wplane(WL,WZ*2,d.floorTile||1,d.floorTile||1),d.floor,g,0,0,0,-Math.PI/2);
  if(d.ceil) mk(wplane(WL,WZ*2,d.ceilTile||1,d.ceilTile||1),d.ceil,g,0,WH,0,Math.PI/2);
  for(const s of [-1,1]){ const z=s*WZ, ry=s<0?0:Math.PI, wins=(d.winsBySide&&d.winsBySide[s>0?'pos':'neg'])||d.wins;
    const piece=(x0,x1,y0,y1,m)=>{ if(x1-x0<.01||y1-y0<.01) return; mk(wplane(x1-x0,y1-y0,d.wallTile||1,d.wallTile||1),m,g,(x0+x1)/2,(y0+y1)/2,z,0,ry,0); };
    piece(-WL/2,WL/2,0,lo,d.dado); if(!d.noTop) piece(-WL/2,WL/2,hi,WH,d.upper);
    let x=-WL/2; for(const [a,b] of wins){ piece(x,a,lo,hi,d.pier||d.upper); x=b; } piece(x,WL/2,lo,hi,d.pier||d.upper);
    const sg=side[s]; if(d.trim) for(const [a,b] of wins){ const zt=z-s*.03; B(sg,d.trim,(a+b)/2,lo-.06,zt,b-a+.1,.08,.12); B(sg,d.trim,(a+b)/2,hi-.02,zt,b-a+.1,.06,.08); B(sg,d.trim,a,lo,zt,.06,hi-lo,.08); B(sg,d.trim,b,lo,zt,.06,hi-lo,.08); }
    if(d.rail) B(sg,d.rail,0,lo,z-s*.05,WL,.06,.09); }
  for(const e of [-1,1]){ const x=e*WL/2, ry=e<0?Math.PI/2:-Math.PI/2, m=d.end||d.upper, end=e>0?d.front:d.rear;
    if(end==='windscreen'){ const y0=1.2,y1=2.9; mk(wplane(WZ*2,y0),d.dado,g,x,y0/2,0,0,ry,0); mk(wplane(WZ*2,WH-y1),m,g,x,(y1+WH)/2,0,0,ry,0); for(const s of [-1,1]) mk(wplane(.2,y1-y0),m,g,x,(y0+y1)/2,s*(WZ-.1),0,ry,0); continue; }
    const pz=(z0,z1,y0,y1,mm)=>mk(wplane(z1-z0,y1-y0,d.wallTile||1,d.wallTile||1),mm,g,x,(y0+y1)/2,(z0+z1)/2,0,ry,0);
    pz(-WZ,-.6,0,WH,m); pz(.6,WZ,0,WH,m); pz(-.6,.6,2.3,WH,m);
    B(g,d.door||C('#3a3c40'),x-e*.05,0,0,.07,2.3,1.2); if(d.trim) B(g,d.trim,x-e*.05,2.28,0,.09,.07,1.32); }
  B(g,C('#14161a'),0,-.7,0,WL,.65,WZ*2); bogie(g,-CAR_L*.36); bogie(g,CAR_L*.36);
  const W=WAGONS.find(w=>w.key===key);
  WG[key]={n0:g.kids.length,s0:{'-1':side['-1'].kids.length,'1':side['1'].kids.length},g,side,W,lamps:d.lamps||[],ambK:d.ambK??1,sunK:d.sunK??1,cam:d.cam||{t:[0,1.2,0],th:.55,ph:.95,r:20},minLamp:d.minLamp??0,spots:{},anim:[]};
  return g; }
const winsEvery=(n,w,x0=-12.4,x1=12.4)=>{ const out=[],step=(x1-x0)/(n-1); for(let i=0;i<n;i++){ const c=x0+i*step; out.push([c-w/2,c+w/2]); } return out; };
const stripes=(a,b,wd=4)=>P2(16,16,(g,w,h)=>{ for(let x=0;x<w;x+=wd*2){ R(g,a,x,0,wd,h); R(g,b,x+wd,0,wd,h); } },6,wd);

/* ---------- 01 · the locomotive ---------- */
CAR_BUILD.cab=function cab(){
  const panel=M(lineT('#e8e4dc','#cac6be',3)), navy=C('#14203a'), gold=C('#d4ad5a'), leather=M(fabT('#1e2e52',4,(g,w,h)=>{ for(let y=0;y<h;y+=4) R(g,'#16223e',0,y,w,1); }));
  const floor=M(P2(16,16,(g,w,h)=>{ R(g,'#2a2e36',0,0,w,h); for(let y=2;y<h;y+=4) for(let x=(y>>2)%2?0:2;x<w;x+=4) R(g,'#3a3e48',x,y,1,1); },6,4));
  const g=shell('cab',{floor,floorTile:.6,ceil:C('#ece8e0'),dado:M(lineT('#14203a','#22305a',5)),upper:panel,pier:panel,trim:gold,end:panel,door:C('#b8bcc0'),
    wins:[[4,6.4],[7.2,9.6]],front:'windscreen',lamps:[lamp(11.5,1.6,0,[.3,.6,1.0],4),lamp(6,3,0,[.95,.95,1.05],7),lamp(-2,3,0,[.95,.95,1.05],7),lamp(-10,3,0,[.9,.9,1.0],7),lamp(12.5,3,0,[.9,.9,1.0],5)]});
  /* the flight deck: a horseshoe of consoles and two captain's chairs */
  const scr=(fn)=>M(P2(48,32,(g,w,h)=>{ R(g,'#06121e',0,0,w,h); fn(g,w,h); }),{unlit:true});
  const route=scr((g,w,h)=>{ ell(g,24,16,20,11,'#0e2a3e'); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; ell(g,24+Math.cos(a)*16,16+Math.sin(a)*8,1.3,1.3,'#f5c542'); } g.strokeStyle='#29e0e6'; g.beginPath(); g.ellipse(24,16,16,8,0,0,Math.PI*2); g.stroke(); text(g,'LOOP',2,2,'#29e0e6',1); });
  const speed=scr((g,w,h)=>{ text(g,'1920',8,8,'#5ab8e8',2); text(g,'KM/H',14,24,'#3a7ab0',1); });
  const track=scr((g,w,h)=>{ for(let k=0;k<6;k++) R(g,'#7cf06a',4+k*7,24-k*3,5,2); R(g,'#f5c542',4,26,40,1); text(g,'ATC OK',4,3,'#7cf06a',1); });
  B(g,navy,12.4,0,0,1.6,1.0,WZ*2-1.6); mk(box(1.4,.1,WZ*2-1.8),navy,g,12.0,1.05,0,0,0,.3);
  for(const s of [-1,1]){ B(g,navy,10.8,0,s*2.0,2.6,1.0,1.2,s*.35); }
  [[11.6,-1.4,route],[11.8,0,speed],[11.6,1.4,track]].forEach(([x,z,m])=>{ mk(wplane(1.1,.7),m,g,x,1.62,z,0,-Math.PI/2+(z>0?-.35:z<0?.35:0),0); B(g,navy,x+.08,1.18,z,.1,.86,1.2,z>0?-.35:z<0?.35:0); });
  for(let i=0;i<14;i++) B(g,i%4?G('#f5c542'):G('#c8302a'),11.5+(i%2)*.1,1.07,-1.2+i*.18,.06,.03,.06);
  for(const z of [-.9,.9]){ B(g,C('#2a2c30'),10.2,0,z,.14,.45,.14); B(g,leather,10.2,.45,z,.7,.14,.7); B(g,leather,9.85,.55,z,.14,1.0,.7,0,0,-.12); B(g,leather,9.78,1.55,z,.12,.24,.42,0,0,-.12); for(const s of [-1,1]) B(g,leather,10.2,.6,z+s*.37,.6,.2,.08); }
  /* a wall of route screens on the bulkhead behind the deck */
  for(let k=0;k<4;k++) K(mk(wplane(1.1,.7),[route,speed,track,route][k],g,8.4,1.6,-2.7+k*1.8,0,Math.PI/2,0));
  K(B(g,panel,8.3,0,0,.1,1.1,WZ*2-1.8));
  /* crew mess: galley, table, bunks, lockers */
  const locker=M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c8ccd2'],[1,'#a8aeb6']]); R(g,'#7e848c',0,0,1,h); for(let y=4;y<10;y+=2) R(g,'#7e848c',4,y,8,1); R(g,'#3a3c40',12,16,2,4); },4,6));
  for(let x=-13.4;x<-4;x+=.7) B(g,F(C('#a8aeb6'),locker),x,0,-2.55,.68,2.2,.62);
  B(g,C('#d8dcde'),2,0,-2.5,3.6,.95,.7); B(g,C('#2a2e36'),2,.95,-2.5,3.6,.05,.72); B(g,C('#2a2c30'),.8,.95,-2.6,.4,.5,.4); B(g,G('#5ab8e8'),.8,1.2,-2.38,.2,.1,.02);
  B(g,C('#f4f2ec'),2,.0,1.2,.08,.75,.08); B(g,C('#f4f2ec'),2,.75,1.2,2.4,.06,1.1); for(const s of [-1,1]) K(B(g,leather,2,0,1.2+s*.85,2.4,.45,.45));
  for(const x of [-2.5,-8]){ B(g,C('#a8aeb6'),x,.4,2.3,2.2,.12,1.0); B(g,M(fabT('#1e2e52',8)),x,.52,2.3,2.0,.14,.9); B(g,C('#a8aeb6'),x,1.6,2.3,2.2,.12,1.0); B(g,M(fabT('#1e2e52',9)),x,1.72,2.3,2.0,.14,.9); }
  for(const x of [-10,-4,2]) B(g,U('#f4f8ff'),x,WH-.04,0,3,.03,.2);
};

/* ---------- 02 · the King's casino ---------- */
CAR_BUILD.casino=function casino(){
  const carpet=M(P2(32,32,(g,w,h)=>{ R(g,'#8a1424',0,0,w,h); for(const [x,y] of [[8,8],[24,24]]){ poly(g,[[x,y-5],[x+5,y],[x,y+5],[x-5,y]],'#d4a83a'); poly(g,[[x,y-2],[x+2,y],[x,y+2],[x-2,y]],'#6a0e1a'); } for(const [x,y] of [[24,8],[8,24]]) ell(g,x,y,1.5,1.5,'#d4a83a'); },8,11));
  const mirror=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a2a3a'],[1,'#20161e']]); R(g,'#d4ad5a',0,0,w,1); R(g,'#d4ad5a',0,0,1,h); ell(g,16,16,2,2,'#fff0c0'); },4,12),{emissive:0x14100c});
  const damask=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#6a0e1a'],[1,'#4a0a12']]); for(const [x,y] of [[8,8],[24,24]]){ poly(g,[[x,y-7],[x+4,y],[x,y+7],[x-4,y]],'#8a1828'); ell(g,x,y,1.4,1.4,'#d4ad5a'); } },6,13));
  const wood=M(woodT('#3a1e14','#24120c',14,true)), gold=C('#d4ad5a'), felt=M(fabT('#1f6a3a',15)), black=C('#121014');
  const g=shell('casino',{floor:carpet,floorTile:1.2,ceil:mirror,ceilTile:1.2,dado:wood,upper:damask,pier:damask,trim:gold,end:wood,door:wood,rail:gold,
    wins:winsEvery(5,1.6),lamps:[lamp(-9,2.8,0,[1.3,.95,.6],7),lamp(-2,2.8,0,[1.3,.95,.6],7),lamp(5,2.8,0,[1.3,.95,.6],7),lamp(11.5,2.6,0,[1.6,.6,1.0],5),lamp(12.5,1.4,-1.5,[1.4,1.1,.5],3.5),lamp(-12.5,1.8,0,[1.0,.7,.4],4)],minLamp:.7,ambK:.7});
  /* slot machines along both walls, screens lit */
  const slotScr=(seed)=>M(P2(16,24,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a1a4a'],[1,'#120a22']]); const r=rng(seed); for(let k=0;k<3;k++){ const c=['#f5c542','#d63a2c','#2a9a5a','#29e0e6'][r()*4|0]; R(g,'#f2ece0',1+k*5,6,4,8); if(r()<.5) text(g,'7',2+k*5,7,c,1); else ell(g,3+k*5,10,1.5,1.5,c); } R(g,'#ff3fa4',0,0,w,3); R(g,'#f5c542',2,18,12,2); }),{unlit:true});
  for(const s of [-1,1]) for(let i=0;i<9;i++){ const x=-10.5+i*2.4,z=s*2.4,n=N(WG.casino.side[s],x,0,z,0,s<0?0:Math.PI,0);
    B(n,C(['#2a2a5a','#5a1a3a','#1a4a5a'][i%3]),0,0,0,.8,1.2,.62); mk(wplane(.6,.7),slotScr(i*7+s),n,0,1.55,.32); B(n,C('#2a2a30'),0,1.2,0,.8,.72,.58); B(n,G('#f5c542'),0,1.92,.05,.82,.12,.66); B(n,gold,.42,1.05,.1,.04,.4,.04,0,0,-.3); }
  /* the roulette table */
  const wheel=M(P2(32,32,(g,w,h)=>{ for(let k=0;k<37;k++){ const a=k/37*Math.PI*2,a2=(k+1)/37*Math.PI*2; poly(g,[[16,16],[16+Math.cos(a)*15,16+Math.sin(a)*15],[16+Math.cos(a2)*15,16+Math.sin(a2)*15]],k===0?'#2a9a5a':k%2?'#c8202a':'#121014'); } ell(g,16,16,8,8,'#6a3a1e'); ell(g,16,16,3,3,'#d4ad5a'); }),{unlit:false});
  WG.casino.wheel=wheel;
  /* stage with a gold curtain */
  B(g,C('#24120c'),12.3,0,0,3.2,.45,WZ*2); B(g,G('#f5c542'),10.7,.42,0,.05,.05,WZ*2);
  const curtain=M(P2(16,32,(g,w,h)=>{ for(let x=0;x<w;x++){ const v=.75+.25*Math.sin(x*1.2); R(g,mix('#a87a20','#ffd860',v*.6),x,0,1,h); } },4,16),{double:true});
  for(const s of [-1,1]) B(g,curtain,13.6,.45,s*1.8,.1,2.9,2.0); B(g,curtain,13.6,2.9,0,.12,.5,WZ*2-.2); mk(wplane(1.8,2.4),C('#120a0a'),g,13.94,1.65,0,0,-Math.PI/2,0);
  mk(cyl(.015,.015,1.5,6),C('#c8ccd2'),g,11.9,1.2,0); B(g,black,11.9,1.95,0,.05,.12,.05);
  /* bar at the back */
  B(g,wood,-12.5,0,0,.7,1.1,7); B(g,gold,-12.15,1.1,0,.14,.04,7); for(let k=0;k<12;k++) K(mk(cyl(.04,.05,.28,6),G(['#c8742a','#2a8a3a','#e8e0c8','#8a2a8a'][k%4]),g,-13.8,1.35+(k%2)*.45,-3+(k>>1)*1.2));
  /* chandeliers */
  const crystal=U('#fff4d8'); for(const x of [-9,-2,5]){ mk(torus(.45,.03,4,16),gold,g,x,2.95,0,Math.PI/2); for(let k=0;k<14;k++){ const a=k/14*Math.PI*2; B(g,crystal,x+Math.cos(a)*.45,2.8,Math.sin(a)*.45,.05,.16,.05); } B(g,crystal,x,2.6,0,.12,.3,.12); }
  WG.casino.spots={king:{x:12.0,z:-.4,ry:-Math.PI/2,y:.45},king_c:{x:4.2,z:1.3,ry:-Math.PI/2},king_c2:{x:-6.8,z:-1.6,ry:Math.PI/2}};
};

/* ---------- 03 · Copacabana pool deck ---------- */
CAR_BUILD.pool=function pool(){
  const deck=M(P2(32,32,(g,w,h)=>{ R(g,'#f2ece0',0,0,w,h); for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(Math.sin(x/w*Math.PI*4+Math.sin(y/h*Math.PI*2)*2.2)>.55) R(g,'#2a2a2e',x,y,1,1); }),{});
  const white=C('#f4f2ec'), teal=C('#2ac0d0'), wood=M(woodT('#c8a070','#a88050',21));
  const water=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#38d0e0'],[1,'#20a8c8']]); const r=rng(22); for(let i=0;i<14;i++){ g.strokeStyle=rgba('#c8f8ff',.6); g.lineWidth=1; g.beginPath(); const x=r()*w,y=r()*h; g.moveTo(x,y); g.quadraticCurveTo(x+4,y-3,x+8,y+1); g.stroke(); } },0),{unlit:true,color:[.92,.98,1]});
  const g=shell('pool',{floor:deck,floorTile:1.2,dado:M(lineT('#f2ece0','#d8d0c0',23)),upper:white,pier:white,trim:C('#2a9a5a'),end:M(lineT('#2a9a5a','#1e7a46',24)),door:C('#2a9a5a'),lo:.9,hi:3.2,noTop:true,
    wins:[[-13.6,13.6]],lamps:[lamp(-10,2.5,0,[1.0,.8,.6],6),lamp(11.5,2.2,0,[1.4,.4,1.0],5),lamp(0,1.0,0,[.3,.9,1.0],6)],sunK:1.15,ambK:1.1});
  /* the pool, raised in a tiled rim */
  for(const s of [-1,1]){ B(g,C('#e8f0f2'),0,0,s*1.5,14,.55,.2); B(g,C('#e8f0f2'),s*6.9,0,0,.2,.55,3.2); } mk(wplane(13.6,2.8,1.6,1.6),water,g,0,.45,0,-Math.PI/2); B(g,C('#2a90a8'),0,0,0,13.6,.44,2.8); WG.pool.anim.push(t=>{ water.rep=[1+Math.sin(t*.7)*.02,1]; });
  for(const s of [-1,1]) B(g,C('#2ac0d0'),0,.55,s*1.6,14,.04,.08); for(let k=0;k<2;k++){ B(g,C('#c8ccd2'),-6.6,.55,-1.0+k*.4,.04,.7,.04); }
  /* striped loungers with towels */
  const lounge=M(stripes('#f2c230','#f2ece0'),{});
  for(const s of [-1,1]) for(let i=0;i<5;i++){ const x=-6+i*3,z=s*2.3,n=N(g,x,0,z,0,s<0?.0:Math.PI,0); B(n,white,0,0,0,1.6,.28,.6); B(n,lounge,0,.28,0,1.5,.06,.56); B(n,lounge,-.7,.3,0,.5,.06,.56,0,0,.7); }
  /* umbrellas */
  const umb=M(P2(16,16,(g,w,h)=>{ for(let x=0;x<w;x+=4){ R(g,'#e0473a',x,0,2,h); R(g,'#f2ece0',x+2,0,2,h); } }),{double:true});
  for(const x of [-4.5,1.5,7.5]) for(const s of [-1,1]){ if(x===1.5&&s>0) continue; mk(cyl(.025,.025,2.3,6),white,g,x,1.15,s*2.4); mk(lathe([[0,1.0,1.0],[.4,.05,.05]],10,{capB:false}),umb,g,x,2.1,s*2.4); }
  /* palms in pots */
  for(const x of [-8.5,8.5]) for(const s of [-1,1]){ mk(cyl(.3,.24,.6,10),C('#c8643a'),g,x,.3,s*2.4); B(g,C('#7a5a3e'),x,.6,s*2.4,.12,1.8,.12,0,0,.1); for(let k=0;k<7;k++) mk(box(.14,.05,1.1),C('#3f8a3e'),g,x,2.45,s*2.4,.0,k/7*Math.PI*2,.45); }
  /* tiki bar under thatch at the back */
  const thatch=M(P2(16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c8a060'],[1,'#a88048']]); for(let x=0;x<w;x+=2) R(g,'#8a6a38',x,0,1,h); },8,25),{double:true});
  B(g,wood,-12.4,0,0,.8,1.1,6.4); B(g,C('#2a9a5a'),-12.05,1.1,0,.14,.05,6.4); mk(box(2.2,.15,8),thatch,g,-12.8,2.6,0,0,0,-.25); for(const z of [-1.9,1.9]) B(g,wood,-12.4,0,z,.12,2.6,.12);
  for(let k=0;k<6;k++) K(mk(cyl(.05,.05,.18,6),G(['#f2c230','#e0473a','#2a9a5a'][k%3]),g,-12.4,1.2,-2.5+k*1.0));
  /* the DJ booth and speaker stacks */
  B(g,C('#121214'),12,0,0,1.0,1.1,2.4); B(g,M(textTex(32,16,'#121214',[['TREMOR','c',5,'#ff3fa4']]),{unlit:true}),11.48,.5,0,.02,.4,1.6);
  for(const z of [-.6,.6]) mk(cyl(.26,.26,.04,14),C('#2a2a2e'),g,12,1.12,z);
  const spk=M(P2(16,16,(g,w,h)=>{ R(g,'#1a1a1e',0,0,w,h); ell(g,8,8,6,6,'#2a2a30'); ell(g,8,8,3,3,'#0a0a0c'); }));
  for(const s of [-1,1]) for(let k=0;k<3;k++) B(g,F(C('#1a1a1e'),spk),13.3,k*.9,s*2.1,.9,.9,.9,-Math.PI/2*s*0);
  for(let k=0;k<30;k++){ const x=-13+k*.9, y=3.05+Math.sin(k*.6)*.12; B(g,U(['#ff3fa4','#f2c230','#29e0e6','#7cf06a'][k%4]),x,y,0,.08,.08,.08); } B(g,C('#2a2a2e'),0,3.1,0,26,.02,.02);
  WG.pool.spots={tremor:{x:11.4,z:.0,ry:-Math.PI/2},tremor_c:{x:-2,z:2.0,ry:-Math.PI/2},tremor_c2:{x:4,z:-2.0,ry:Math.PI/2}};
};

/* ---------- 04 · The Rusty Anchor ---------- */
CAR_BUILD.pub=function pub(){
  const tiles=M(P2(16,16,(g,w,h)=>{ for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8){ vfill(g,x,y,8,8,[[0,'#2a6a4a'],[1,'#1a4a34']]); R(g,rgba('#ffffff',.18),x+1,y+1,2,1); R(g,'#10301f',x,y,8,1); R(g,'#10301f',x,y,1,8); } },4,31));
  const paper=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#6a2a22'],[1,'#4a1c18']]); for(let x=0;x<w;x+=8) R(g,'#7a3a2a',x,0,2,h); for(let y=4;y<h;y+=16) for(let x=4;x<w;x+=8) ell(g,x+1,y,1.2,1.6,'#c9a23a'); },6,32));
  const boards=M(woodT('#4a2a1a','#3a2014',33)), oak=M(woodT('#5a3420','#3a2014',34,true)), brass=C('#d4ad5a'), leather=M(fabT('#8a1c1c',35,(g,w,h)=>{ for(let y=2;y<h;y+=5) for(let x=2;x<w;x+=5) R(g,'#5a0e0e',x,y,1,1); }));
  const ceil=M(P2(32,32,(g,w,h)=>{ R(g,'#e8dcc0',0,0,w,h); for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8) R(g,'#d8ccb0',x+2,y+2,4,4); R(g,'#3a2014',0,0,w,4); },6,36));
  const g=shell('pub',{floor:boards,floorTile:.8,ceil,ceilTile:1.2,dado:tiles,upper:paper,pier:paper,trim:oak,end:oak,door:oak,rail:oak,
    wins:winsEvery(4,1.8),lamps:[lamp(-9,2.6,-1,[1.2,.8,.45],6),lamp(-2,2.6,-1,[1.2,.8,.45],6),lamp(5,2.6,1,[1.2,.8,.45],6),lamp(11,2.6,0,[1.1,.75,.4],6),lamp(-5,1.8,2.2,[.9,.6,.35],4)],ambK:.8});
  /* the bar along the -z wall */
  B(g,oak,-5,0,-1.6,9,1.1,.7); B(g,C('#2a1408'),-5,1.1,-1.6,9.2,.06,.8); Wz(B(g,brass,-5,.2,-1.22,9,.04,.04));
  for(let k=0;k<6;k++){ mk(cyl(.025,.025,.35,6),brass,g,-8.5+k*1.4,1.33,-1.75); B(g,C(['#c8202a','#2a4a8a','#f2c230'][k%3]),-8.5+k*1.4,1.48,-1.72,.08,.12,.02); }
  for(let k=0;k<7;k++) for(let j=0;j<2;j++) mk(cyl(.04,.05,.26,6),G(['#6a3a1a','#2a7a3a','#d8c8a0','#8a2a1a'][(k+j)%4]),g,-9+k*1.3,1.5+j*.5,-2.75);
  B(g,C('#3a2014'),-5,1.35,-2.8,9,.04,.24); B(g,C('#3a2014'),-5,1.85,-2.8,9,.04,.24);
  for(let k=0;k<6;k++){ const x=-9+k*1.5; Wz(mk(cyl(.2,.2,.07,10),leather,g,x,.75,-.95)); Wz(mk(cyl(.035,.035,.75,6),brass,g,x,.37,-.95)); }
  /* scarves over the bar, striped club colours */
  const scarf=M(stripes('#c8202a','#f2ece0',2),{double:true}); for(let k=0;k<5;k++) B(WG.pub.side[-1],scarf,-9+k*2,2.25,-2.83,1.4,.22,.02);
  /* red leather booths along +z */
  for(let k=0;k<4;k++){ const x=-10+k*3.1; for(const s of [-1,1]){ B(g,leather,x+s*.95,0,2.25,.5,.48,1.2); B(g,leather,x+s*1.2,.48,2.25,.12,.8,1.2); } B(g,oak,x,.75,2.25,1.0,.06,1.0); B(g,oak,x,0,2.25,.1,.75,.1); mk(cyl(.04,.05,.18,6),G('#d8a040'),g,x,.81,2.25); }
  /* a pool table, a dartboard, televisions */
  B(g,oak,6,0,.2,2.6,.78,1.5); B(g,M(fabT('#1f6a3a',37)),6,.78,.2,2.4,.04,1.3); for(let k=0;k<6;k++) mk(cyl(.03,.03,.03,8),C(['#f2ece0','#c8202a','#f2c230','#121214'][k%4]),g,5.4+k*.2,.83,.1+(k%2)*.2);
  const dart=M(P2(16,16,(g,w,h)=>{ ell(g,8,8,7.5,7.5,'#121214'); for(let k=0;k<20;k++){ const a=k/20*Math.PI*2,a2=(k+1)/20*Math.PI*2; poly(g,[[8,8],[8+Math.cos(a)*7,8+Math.sin(a)*7],[8+Math.cos(a2)*7,8+Math.sin(a2)*7]],k%2?'#f2e2b8':'#121214'); } ell(g,8,8,5,5,rgba('#c8202a',.6)); ell(g,8,8,1.2,1.2,'#c8202a'); }));
  mk(cyl(.24,.24,.04,16),[C('#121214'),dart,dart],g,WL/2-.05,1.75,-1.8,0,0,Math.PI/2);
  const tv=M(P2(32,20,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a8a3a'],[1,'#1a6a2a']]); for(let x=0;x<w;x+=6) R(g,'#2f9a42',x,0,3,h); R(g,'#f2ece0',w/2,0,1,h); ell(g,w/2,h/2,4,4,rgba('#f2ece0',.0)); for(let k=0;k<6;k++) R(g,k<3?'#c8202a':'#2a4a8a',4+k*4,4+(k*3)%12,1,2); R(g,'#121214',0,0,w,3); text(g,'2-1',2,0,'#f2ece0',1); }),{unlit:true});
  for(const x of [-8,-2,4]) { B(g,C('#121214'),x,2.55,-2.82,1.1,.66,.06); mk(wplane(1.0,.6),tv,g,x,2.88,-2.78); }
  /* a chesterfield and a fireplace at the front */
  const ches=M(fabT('#4a1e14',38,(g,w,h)=>{ for(let y=2;y<h;y+=4) for(let x=(y>>2)%2?0:2;x<w;x+=4) R(g,'#2a100a',x,y,1,1); }));
  B(g,ches,10,0,1.8,2.4,.45,.9); B(g,ches,10,.45,2.2,2.4,.5,.2); for(const s of [-1,1]) B(g,ches,10+s*1.15,.45,1.8,.2,.35,.9);
  B(g,C('#3a3632'),WL/2-.3,0,1.6,.5,1.3,1.6); B(g,C('#0a0806'),WL/2-.52,.15,1.6,.06,.8,1.0); B(g,U('#ff8a30'),WL/2-.5,.2,1.6,.05,.25,.7); B(g,oak,WL/2-.35,1.3,1.6,.6,.08,1.9);
  for(const x of [-9,-2,5,11]) mk(lathe([[0,.18,.18],[.18,.06,.06]],8,{capB:false}),C('#2a5a3a',{double:true}),g,x,2.95,-1);
  WG.pub.spots={gaffer:{x:7.5,z:-.4,ry:-Math.PI/2},gaffer_c:{x:3.6,z:1.4,ry:-Math.PI/2},gaffer_c2:{x:-4,z:-.6,ry:-Math.PI/2}};
};

/* ---------- 05 · Trattoria Assunta ---------- */
CAR_BUILD.trattoria=function trattoria(){
  const plaster=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f6dc8a'],[1,'#ecc870']]); const r=rng(41); for(let i=0;i<12;i++) ell(g,r()*w,r()*h,3+r()*4,2+r()*3,rgba('#d8a850',.25)); },6,41));
  const terra=M(P2(16,16,(g,w,h)=>{ for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8) vfill(g,x,y,8,8,[[0,'#c8643a'],[1,'#a84e2a']]); for(let k=0;k<2;k++){ R(g,'#7a3a1e',k*8,0,1,h); R(g,'#7a3a1e',0,k*8,w,1); } },8,42));
  const beams=M(P2(32,32,(g,w,h)=>{ R(g,'#f2e8d0',0,0,w,h); R(g,'#5a3a22',0,0,w,6); R(g,'#4a2e1a',0,5,w,1); },6,43));
  const wain=M(woodT('#7a4a28','#5a3418',44,true)), check=M(P2(16,16,(g,w,h)=>{ for(let y=0;y<h;y+=4) for(let x=0;x<w;x+=4) R(g,((x+y)>>2)%2?'#f4efe6':'#c8302a',x,y,4,4); },4,45)), chairW=M(woodT('#8a5a34','#6a4426',46));
  const g=shell('trattoria',{floor:terra,floorTile:1,ceil:beams,ceilTile:1.4,dado:wain,upper:plaster,pier:plaster,trim:C('#2a7a4a'),end:plaster,door:C('#2a7a4a'),rail:wain,
    wins:winsEvery(4,1.8,-12,8),lamps:[lamp(-10,2.6,0,[1.25,.95,.6],6),lamp(-4,2.6,0,[1.25,.95,.6],6),lamp(2,2.6,0,[1.25,.95,.6],6),lamp(8,2.6,0,[1.2,.9,.6],6),lamp(12.5,1.0,0,[1.6,.7,.25],4)]});
  /* tables with checked cloths, candles in straw-covered bottles */
  const chair=(x,z,ry)=>{ const n=N(g,x,0,z,0,ry,0); B(n,chairW,0,.45,0,.44,.06,.44); B(n,chairW,-.2,.5,0,.05,.55,.42); for(const [dx,dz] of [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]]) B(n,chairW,dx,0,dz,.04,.45,.04); };
  for(const x of [-11,-7.4,-3.8,-.2,3.4]) for(const s of [-1,1]){ const z=s*1.7; B(g,check,x,.72,z,1.1,.05,1.0); B(g,check,x,.42,z,1.14,.3,1.04); B(g,chairW,x,0,z,.1,.72,.1);
    mk(cyl(.06,.07,.2,8),C('#c89a52'),g,x,.87,z); mk(cyl(.02,.02,.12,6),C('#2a6a3a'),g,x,1.02,z); B(g,U('#ffd890'),x,1.08,z,.025,.05,.025); chair(x-.75,z,0); chair(x+.75,z,Math.PI); }
  /* hanging hams, garlic and chillies */
  for(let k=0;k<10;k++){ const x=-11+k*2.2, z=(k%2?1:-1)*.4; B(g,C('#2a1a10'),x,2.8,z,.01,.6,.01); mk(lathe([[0,.03,.03],[.1,.11,.09],[.35,.13,.11],[.5,.05,.05]],8),C('#a8603a'),g,x,2.3,z,Math.PI,0,0); }
  for(let k=0;k<14;k++){ const x=-12+k*1.6; for(let j=0;j<4;j++) mk(lathe([[0,.02,.02],[.04,.05,.05],[.08,.02,.02]],6),C(k%2?'#f2ece0':'#c8202a'),g,x,3.25-j*.12,1.3); }
  /* deli counter, cheese wheels, the oven */
  B(g,C('#f2ece0'),9,0,-2.1,4,1.0,1.0); B(g,M(P2(32,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8f0f2'],[1,'#a8c8cc']]); for(let k=0;k<6;k++) ell(g,4+k*5,11,2.2,1.6,['#c8302a','#f2d27a','#e8a070'][k%3]); }),{emissive:0x1a1a1a}),9,.55,-1.58,4,.4,.04).wz=1;
  for(let k=0;k<5;k++) mk(cyl(.24,.24,.12,12),C('#e8c460'),g,7.6+k*.7,1.06,-2.2);
  const brick=M(P2(16,16,(g,w,h)=>{ for(let y=0;y<h;y+=4) for(let x=((y>>2)%2)*4;x<w;x+=8) vfill(g,x,y,8,4,[[0,'#b85a3a'],[1,'#8a4024']]); },6,47));
  Wz(mk(lathe([[0,1.2,1.2],[.6,1.2,1.2],[1.2,.95,.95],[1.6,.5,.5],[1.75,.1,.1]],12),brick,g,12.6,0,1.4)); Wz(B(g,C('#0a0604'),11.45,.55,1.4,.06,.6,.8)); Wz(B(g,U('#ff7a20'),11.5,.6,1.4,.05,.3,.6));
  /* family photographs on the walls */
  const photo=(s)=>M(P2(12,16,(g,w,h)=>{ R(g,'#3a2a1a',0,0,w,h); vfill(g,1,1,w-2,h-2,[[0,'#d8c8a0'],[1,'#a8946c']]); const r=rng(s); ell(g,6,6,2,2.5,'#6a5a40'); R(g,'#6a5a40',3,9,6,6); if(r()<.5){ ell(g,3,7,1.5,2,'#6a5a40'); } }));
  for(const s of [-1,1]) for(let k=0;k<8;k++){ const x=-12.8+k*3; B(WG.trattoria.side[s],photo(k*3+s),x,2.75,s*(WZ0-.03),.36,.48,.03); }
  /* a red scooter parked by the door */
  const sc=N(g,-12.2,0,1.9,0,.3,0), red=C('#c8202a'); for(const dx of [-.55,.55]) mk(cyl(.2,.2,.1,10),C('#121214'),sc,dx,.2,0,Math.PI/2); B(sc,red,-.2,.25,0,.8,.35,.4); B(sc,C('#3a2a1a'),-.3,.6,0,.5,.1,.32); B(sc,red,.45,.25,0,.15,.7,.36,0,0,-.2); B(sc,C('#c8ccd2'),.55,.98,0,.05,.05,.6);
  WG.trattoria.spots={nonna:{x:-.2,z:.6,ry:-Math.PI/2,chair:true},nonna_c:{x:-1.6,z:-.3,ry:Math.PI/2},nonna_c2:{x:1.6,z:.0,ry:-Math.PI/2}};
};

/* ---------- 06 · Banya & ice bar ---------- */
CAR_BUILD.banya=function banya(){
  const logs=M(P2(32,32,(g,w,h)=>{ for(let y=0;y<h;y+=8) vfill(g,0,y,w,8,[[0,'#d8aa6e'],[.5,'#c08a50'],[1,'#8a5a30']]); for(let y=0;y<h;y+=8) R(g,'#5a3a1e',0,y+7,w,1); const r=rng(51); for(let i=0;i<8;i++) ell(g,r()*w,(r()*4|0)*8+4,1.5,1,'#8a5a30'); },8,51));
  const ice=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8f4ff'],[1,'#9ad0ec']]); for(let y=0;y<h;y+=10) R(g,'#7ab4d8',0,y,w,1); for(let x=0;x<w;x+=16) R(g,'#7ab4d8',x+((x>>4)%2)*8,0,1,h); const r=rng(52); for(let i=0;i<10;i++) R(g,rgba('#ffffff',.6),r()*w|0,r()*h|0,3,1); },4,52),{emissive:0x1a3040});
  const boards=M(woodT('#c89a62','#a87a46',53)), fur=M(fabT('#e8e0d4',54,(g,w,h)=>{ for(let i=0;i<30;i++) R(g,'#c8c0b4',(i*7)%w,(i*5)%h,1,2); }));
  const g=shell('banya',{floor:boards,floorTile:.8,ceil:logs,ceilTile:1.2,dado:logs,upper:logs,pier:logs,trim:C('#7a4a2a'),end:logs,door:C('#7a4a2a'),
    winsBySide:{pos:[[-12,-10.8],[-7.6,-6.4],[2.4,3.6],[9.6,10.8]],neg:[[-12,-10.8],[-7.6,-6.4],[2.4,3.6],[9.6,10.8]]},
    lamps:[lamp(-10,2.2,0,[1.4,.75,.35],6),lamp(-4,2.2,0,[1.3,.7,.35],6),lamp(-7,.6,0,[1.4,.4,.1],3),lamp(4,2.6,0,[.5,.85,1.3],6),lamp(10,2.6,0,[.5,.85,1.3],6),lamp(7,1.0,-2,[.4,.8,1.2],4)],ambK:.75});
  /* the -x half is ice: cover the logs with ice panels on that half */
  for(const s of [-1,1]){ const sg=WG.banya.side[s]; for(let x=.5;x<WL/2;x+=3.4) B(sg,ice,x+1.7,0,s*(WZ0-.05),3.3,WH,.06); }
  mk(wplane(WL/2-.5,WZ*2,1.5,1.5),ice,g,(WL/2+.5)/2,WH-.01,0,Math.PI/2);
  /* partition with a door in the middle */
  const pt=M(logs.tex,{double:true}); for(const s of [-1,1]) K(mk(wplane(WZ-.9,WH),pt,g,0,WH/2,s*(WZ+.9)/2,0,Math.PI/2,0)); mk(wplane(1.8,1.0),pt,g,0,2.9,0,0,Math.PI/2,0);
  /* sauna: tiered benches, the stove, buckets, birch switches */
  for(let t=0;t<3;t++) for(const s of [-1,1]) B(g,boards,-6.5,.4+t*.45,s*(1.6+t*.5),12,.1,.5);
  for(const s of [-1,1]) for(let t=0;t<3;t++) Wz(B(g,boards,-6.5,0,s*(1.38+t*.5),12,.4+t*.45,.06));
  B(g,C('#2a2a2e'),-1.4,0,0,.9,.9,.9); for(let k=0;k<9;k++) mk(lathe([[0,.06,.06],[.06,.09,.08],[.12,.04,.04]],6),C(k%3?'#6a6a6a':'#c8502a',{emissive:k%3?0:0x5a1a00}),g,-1.6+(k%3)*.2,.9,-.2+(k/3|0)*.2);
  for(let k=0;k<3;k++){ K(mk(cyl(.16,.13,.28,10),C('#9a6a3a'),g,-3+k*.7,.0+.14,1.6)); K(mk(cyl(.17,.17,.03,10),C('#4a3a2a'),g,-3+k*.7,.26,1.6)); }
  for(let k=0;k<4;k++){ const x=-11+k*1.3; B(WG.banya.side[-1],C('#c8a040'),x,1.8,-2.82,.5,.6,.06); B(WG.banya.side[-1],C('#4a7a32'),x,1.5,-2.8,.4,.32,.08); }
  /* steam puffs rising in the sauna */
  const puff=M(P2(16,16,(g,w,h)=>{ ell(g,8,8,7,6,rgba('#ffffff',.9)); }),{cut:true,double:true,unlit:true,color:[.95,.95,.95]});
  for(let k=0;k<14;k++){ const n=mk(plane(.7,.6),puff,g,0,0,0); const x0=-12+(k*1.7)%11,z0=((k*.37)%1-.5)*3.6,ph=k*.9; WG.banya.anim.push(t=>{ const f=(t*.12+k/14)%1; n.p=[x0+Math.sin(t*.3+ph)*.3,.6+f*2.6,z0]; const s=.6+f*1.4; n.s=[s,s,s]; n.vis=f<.92; n.r=[0,Math.PI/2+Math.sin(ph),0]; }); }
  /* the ice bar */
  const iceBar=U('#bfefff'); B(g,iceBar,7,0,-1.9,6,1.1,.8); B(g,M(ice.tex,{unlit:true,color:[.9,1,1.05]}),7,1.1,-1.9,6.2,.08,.9);
  for(let k=0;k<10;k++) mk(cyl(.045,.05,.3,6),C(['#e8f4ff','#c8e0f0','#f2e0c0'][k%3],{emissive:0x203040}),g,4.4+k*.55,1.33,-2.65);
  for(let k=0;k<5;k++){ const x=4.6+k*1.2; Wz(mk(cyl(.2,.2,.08,10),fur,g,x,.72,-.9)); Wz(mk(cyl(.12,.14,.72,8),iceBar,g,x,.36,-.9)); }
  for(const x of [5,10]){ B(g,fur,x,0,1.6,2.2,.42,1.0); B(g,fur,x,.42,2.1,2.2,.6,.2); Wz(mk(cyl(.4,.4,.05,12),iceBar,g,x,.5,.6)); }
  for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; B(g,U('#e8f8ff'),7.5+Math.cos(a)*.6,2.9,Math.sin(a)*.6,.04,.4+(k%3)*.15,.04); }
  B(g,fur,10,.005,-.2,3,.01,2);
  WG.banya.spots={volkov:{x:9.2,z:-.6,ry:-Math.PI/2},volkov_c:{x:5.5,z:.6,ry:-Math.PI/2},volkov_c2:{x:-4.5,z:.0,ry:Math.PI/2,pose:'sit'}};
};

/* ---------- 07 · Golden Crane dim sum ---------- */
CAR_BUILD.dimsum=function dimsum(){
  const lacquer=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b82020'],[1,'#8a1414']]); R(g,'#d4ad5a',0,0,w,1); R(g,'#d4ad5a',0,h-2,w,1); for(let k=4;k<w;k+=8){ R(g,'#d4ad5a',k,6,1,20); R(g,'#d4ad5a',k-3,16,7,1); } },6,61));
  const carpet=M(P2(32,32,(g,w,h)=>{ R(g,'#7a1010',0,0,w,h); for(const [x,y] of [[8,8],[24,24]]){ ell(g,x,y,5,5,'#c89a3a'); ell(g,x,y,3.5,3.5,'#7a1010'); ell(g,x,y,1.5,1.5,'#c89a3a'); } },8,62));
  const ceil=M(P2(32,32,(g,w,h)=>{ R(g,'#4a0e0e',0,0,w,h); R(g,'#d4ad5a',0,0,w,2); R(g,'#d4ad5a',0,0,2,h); R(g,'#6a1414',8,8,16,16); },4,63));
  const dark=C('#1a1414'), gold=C('#d4ad5a'), cloth=C('#f2ece0'), bamboo=M(P2(16,8,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e2c890'],[1,'#c8a868']]); for(let x=0;x<w;x+=2) R(g,'#a8884a',x,0,1,h); }),{});
  const g=shell('dimsum',{floor:carpet,floorTile:1.2,ceil,ceilTile:1.2,dado:M(woodT('#2a1414','#1a0c0c',64,true)),upper:lacquer,pier:lacquer,trim:gold,end:lacquer,door:dark,rail:gold,
    wins:winsEvery(4,1.8,-12,6),lamps:[lamp(-10,2.4,0,[1.4,.55,.35],6),lamp(-4,2.4,0,[1.4,.55,.35],6),lamp(2,2.4,0,[1.4,.55,.35],6),lamp(10,2.6,0,[.9,.95,1.0],6),lamp(11,1.0,-2,[1.5,.5,.1],3.5)],ambK:.8});
  /* round tables with lazy susans and steamer stacks */
  for(const x of [-11,-7,-3,1,5]) for(const s of [-1,1]){ const t=K(N(g,x,0,s*2.85)); mk(cyl(.85,.85,.06,16),cloth,t,0,.74,0); mk(cyl(.86,.8,.3,16,{open:true}),M(null,{color:0xf2ece0,double:true}),t,0,.58,0); mk(cyl(.36,.36,.04,14),gold,t,0,.8,0);
    for(let k=0;k<3;k++) mk(cyl(.12,.12,.08,10),bamboo,t,Math.cos(k*2.1)*.22,.86+(k%2)*.08,Math.sin(k*2.1)*.22);
    for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+.3, cx=Math.cos(a)*1.15, cz=Math.sin(a)*1.15; B(t,dark,cx,0,cz,.4,.45,.4); B(t,M(fabT('#b82020',65)),cx,.45,cz,.42,.06,.42); } }
  /* trolleys */
  for(const x of [-9,3]){ B(g,C('#c8ccd2'),x,0,0,.9,.85,.6); for(let k=0;k<6;k++) mk(cyl(.15,.15,.09,10),bamboo,g,x-.25+(k%3)*.25,.9+(k>>1&1)*.1+(k>2?.0:0),-.12+(k>2?.24:0)); }
  /* red lanterns */
  const lan=U('#ff4030'); for(let k=0;k<9;k++){ const x=-12+k*2.4; for(const z of [-2.85,2.85]){ K(mk(lathe([[0,.08,.08],[.08,.24,.24],[.34,.24,.24],[.42,.08,.08]],10),lan,g,x,2.5,z)); K(B(g,gold,x,2.5,z,.2,.03,.2)); K(B(g,gold,x,2.92,z,.03,.48,.03)); K(B(g,U('#f2c230'),x,2.38,z,.03,.14,.03)); } }
  /* the gold crane mural on the rear wall */
  const crane=M(P2(64,48,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#a81c1c'],[1,'#7a1010']]); g.fillStyle='#e8c050'; g.beginPath(); g.moveTo(10,36); g.quadraticCurveTo(26,20,40,22); g.lineTo(56,6); g.lineTo(44,26); g.quadraticCurveTo(48,34,30,38); g.closePath(); g.fill(); g.strokeStyle='#e8c050'; g.lineWidth=2; g.beginPath(); g.moveTo(26,36); g.lineTo(22,46); g.moveTo(32,36); g.lineTo(34,46); g.stroke(); ell(g,52,10,3,2,'#e8c050'); R(g,'#c8202a',54,8,2,2); ell(g,14,12,6,6,'#e8c050'); }));
  mk(wplane(3.6,2.4),crane,g,-WL/2+.04,1.85,-1.4,0,Math.PI/2,0);
  /* kitchen: steel, woks over flames, roast ducks */
  const steel=M(tSteel); B(g,C('#d8d4cc'),7.5,0,0,.12,1.0,WZ*2-2.4); B(g,steel,7.5,1.0,0,.4,.05,WZ*2-2.4);
  for(const s of [-1,1]){ B(g,steel,10.5,0,s*2.2,5,.95,1.0); B(g,C('#2a2c30'),10.5,.95,s*2.2,5,.04,1.02); }
  for(let k=0;k<4;k++){ const x=9+k*1.1; mk(lathe([[0,.05,.05],[.08,.3,.3],[.12,.34,.34]],12,{capT:false}),M(null,{color:0x2a2a2e,double:true}),g,x,1.0,-2.2); B(g,U('#ff7a20'),x,.98,-2.2,.3,.02,.3); }
  for(let k=0;k<5;k++){ const x=8.6+k*.9; B(g,C('#3a3c40'),x,2.6,2.2,.01,.6,.01); mk(lathe([[0,.04,.04],[.1,.12,.1],[.3,.1,.08],[.4,.03,.03]],8),C('#a8501e',{emissive:0x200800}),g,x,2.1,2.2,Math.PI,0,0); }
  WG.dimsum.spots={lau:{x:7.0,z:.0,ry:-Math.PI/2},lau_c:{x:-1,z:.0,ry:-Math.PI/2},lau_c2:{x:-6,z:.3,ry:Math.PI/2}};
};

/* ---------- 08 · capsule hotel ---------- */
CAR_BUILD.capsule=function capsule(){
  const white=M(lineT('#eeeee8','#d8d8d2',71)), carpet=M(P2(16,16,(g,w,h)=>{ R(g,'#3a3a44',0,0,w,h); const r=rng(72); for(let i=0;i<20;i++) R(g,'#4a4a54',r()*w|0,r()*h|0,1,1); },4,72));
  const g=shell('capsule',{floor:carpet,floorTile:.6,ceil:C('#f4f4f0'),dado:white,upper:white,pier:white,trim:C('#29e0e6'),end:white,door:C('#2a2a34'),
    wins:[[-1.8,-.4],[.4,1.8]],lamps:[lamp(-10,2.8,0,[.85,.95,1.1],6),lamp(-4,2.8,0,[.85,.95,1.1],6),lamp(0,2.6,0,[1.2,.5,1.0],5),lamp(4,2.8,0,[.85,.95,1.1],6),lamp(10,2.8,0,[.85,.95,1.1],6)]});
  /* two storeys of pods down both walls, the middle left open as a lounge */
  const pod=C('#f4f4ee'), podIn=[U('#ffe8c0'),U('#c8e8ff'),U('#1a1a22')], num=(n)=>M(textTex(16,8,'#f4f4ee',[[String(n),'c',2,'#2a2a34']]));
  const PODX=[...Array(9)].map((_,i)=>-12.8+i*1.15).concat([...Array(9)].map((_,i)=>3.6+i*1.15));
  for(const s of [-1,1]) PODX.forEach((x,i)=>{ for(let lv=0;lv<2;lv++){ const y=lv*1.25, n=N(WG.capsule.side[s],x,y,s*2.25);
      B(n,pod,0,0,0,1.1,1.2,1.25); mk(wplane(.9,.85),podIn[(i+lv+(s>0?1:0))%3],n,0,.6,-s*.63,0,s>0?Math.PI:0,0); B(n,C('#2a2a34'),0,.05,-s*.63,.95,.06,.02);
      mk(wplane(.24,.12),num(100*(lv+1)+i+(s>0?20:0)),n,.35,1.08,-s*.64,0,s>0?Math.PI:0,0); }
    B(WG.capsule.side[s],C('#c8ccd2'),x+.5,0,s*1.6,.04,2.5,.04); });
  /* lounge: neon sign, vending machines, sofas, a shelf of comics */
  const neon=M(textTex(64,16,'#14141c',[['CAPSULES','c',4,'#29e0e6',1]]),{unlit:true}); mk(wplane(2.8,.7),neon,g,0,2.9,-2.86);
  const vm=(x,c,z)=>B(g,F(C(c),M(P2(32,64,(g,w,h)=>{ R(g,c,0,0,w,h); R(g,'#e8f4ff',3,4,w-6,30); const r=rng(x*13); for(let y=0;y<3;y++) for(let k=0;k<5;k++) R(g,['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#f28a3a'][(k+y)%5],5+k*5,7+y*9,3,7); R(g,'#2a2a30',4,40,w-8,8); }),{emissive:0x1a1a1a})),x,0,z,.9,1.9,.7);
  vm(2.4,'#d63a2c',-2.4); vm(3.3,'#2a6ad8',-2.4);
  const sofa=M(fabT('#2a2a34',73)); for(const s of [-1,1]){ K(B(g,sofa,-1.2+s*0,0,s*1.6,2.2,.42,.8)); K(B(g,sofa,-1.2,.42,s*1.95,2.2,.5,.16)); }
  mk(cyl(.4,.4,.04,12),C('#f4f4ee'),g,-1.2,.45,0); mk(cyl(.05,.05,.45,6),C('#c8ccd2'),g,-1.2,.22,0);
  const spines=M(P2(32,32,(g,w,h)=>{ R(g,'#2a2a34',0,0,w,h); const r=rng(74); for(let y=1;y<h;y+=8) for(let x=1;x<w;x+=2) R(g,['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#ff4fae','#f2ece0'][r()*6|0],x,y,1,6); }));
  B(g,F(C('#2a2a34'),spines),2.85,0,2.3,1.6,2.2,.4);
  for(let x=-13;x<13.5;x+=2) B(g,U('#29e0e6'),x,.005,0,1.2,.01,.04);
  for(let k=0;k<6;k++) B(g,F(C('#c8ccd2'),M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8dce0'],[1,'#b8bcc0']]); R(g,'#8a8e94',0,0,1,h); R(g,'#2a2a34',11,14,2,4); text(g,String(k+1),3,3,'#2a2a34',1); }))),-13.4,0,-1.5+k*.62,.6,1.9,.6,Math.PI/2).keep=1;
  WG.capsule.spots={ren:{x:-.4,z:-.5,ry:-Math.PI/2},ren_c:{x:-6,z:.2,ry:-Math.PI/2},ren_c2:{x:7,z:-.2,ry:Math.PI/2}};
};

/* ---------- 09 · aquarium lounge ---------- */
CAR_BUILD.aquarium=function aquarium(){
  const carpet=M(P2(32,32,(g,w,h)=>{ R(g,'#14204a',0,0,w,h); for(let y=0;y<h;y+=8){ g.strokeStyle='#1e2e62'; g.lineWidth=1; g.beginPath(); for(let x=0;x<=w;x++) g.lineTo(x,y+2+Math.sin(x/w*Math.PI*4)*2); g.stroke(); } },6,81));
  const navy=M(lineT('#14203a','#1e2e52',82)), gold=C('#d4ad5a'), velvet=M(fabT('#1a4a8a',83));
  const g=shell('aquarium',{floor:carpet,floorTile:1.2,ceil:M(P2(16,16,(g,w,h)=>{ R(g,'#0a1428',0,0,w,h); ell(g,8,8,1.5,1.5,'#fff0c0'); })),ceilTile:1.5,dado:navy,upper:navy,pier:navy,trim:gold,end:navy,door:C('#14203a'),lo:.35,hi:3.1,
    wins:winsEvery(7,3.5),lamps:[lamp(-8,2.8,0,[.5,.8,1.1],6),lamp(0,1.6,0,[.3,.8,1.1],5),lamp(8,2.8,0,[.5,.8,1.1],6),lamp(-12,2.4,0,[1.1,.85,.5],4),lamp(12,2.4,0,[1.1,.85,.5],4)],sunK:1.1,ambK:1.0});
  /* column tanks with fish */
  const tank=M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2ab0d0'],[1,'#0e5a86']]); const r=rng(84); for(let i=0;i<14;i++) R(g,rgba('#bfefff',.5),r()*w|0,r()*h|0,1,2); }),{unlit:true,double:true});
  const fish=M(fishTex('gold'),{unlit:true,cut:true,double:true});
  for(const x of [-6,6]){ mk(cyl(.9,.9,3.2,16,{open:true}),tank,g,x,1.75,0); mk(cyl(1.0,1.0,.15,16),gold,g,x,.08,0); mk(cyl(1.0,1.0,.15,16),gold,g,x,3.33,0);
    for(let k=0;k<4;k++){ const n=mk(plane(.8,.4),fish,g,x,1+k*.6,0); const ph=k*1.7; WG.aquarium.anim.push(t=>{ const a=t*.5+ph; n.p=[x+Math.cos(a)*.45,1+k*.6+Math.sin(t+ph)*.1,Math.sin(a)*.45]; n.r=[0,-a,0]; }); } }
  /* blue velvet booths */
  for(const x of [-11,-2.5,2.5,11]) for(const s of [-1,1]){ B(g,velvet,x,0,s*2.2,2.4,.45,1.0); B(g,velvet,x,.45,s*2.65,2.4,.7,.2); Wz(mk(cyl(.4,.4,.04,12),C('#f2ece0'),g,x,.68,s*1.3)); Wz(mk(cyl(.04,.04,.68,6),gold,g,x,.34,s*1.3)); }
  B(g,C('#14203a'),13,0,0,.8,1.05,6); B(g,gold,12.65,1.05,0,.1,.04,6); for(let k=0;k<5;k++) K(mk(cyl(.04,.05,.24,6),G(['#29e0e6','#f5c542','#ff3fa4'][k%3]),g,13.2,1.2,-2+k*1));
};


/* The Meridian is 9.2 m across, half again a real bullet train, so there is room to fight. The car builders
   above lay out against a 5.8 m car; here everything they set near a wall slides out to the real wall and
   the middle stays where it is, so the extra width becomes open floor between the two sides. */
const WIDEN_AT=1.6, widenZ=z=>Math.abs(z)>=WIDEN_AT?z+Math.sign(z)*DW:z;
function widenCar(k){ const w=WG[k];
  for(const n of w.g.kids.slice(w.n0)){ if(n.keep) continue; n.p[2]=n.wz?n.p[2]+Math.sign(n.p[2])*DW:widenZ(n.p[2]); }
  for(const s of ['-1','1']) for(const n of w.side[s].kids.slice(w.s0[s])) n.p[2]+=(+s)*DW;
  for(const id in w.spots) w.spots[id].z=widenZ(w.spots[id].z);
  for(const l of w.lamps) l[0][2]=widenZ(l[0][2]); }
