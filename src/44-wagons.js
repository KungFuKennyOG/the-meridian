
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
  for(let k=0;k<4;k++) K(mk(wplane(1.1,.7),[route,speed,track,route][k],g,8.4,1.6,(k-1.5)*WZ*.41,0,Math.PI/2,0));
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
  B(g,wood,-12.5,0,0,.7,1.1,WZ*2-1.6); B(g,gold,-12.15,1.1,0,.14,.04,WZ*2-1.6); for(let k=0;k<12;k++) K(mk(cyl(.04,.05,.28,6),G(['#c8742a','#2a8a3a','#e8e0c8','#8a2a8a'][k%4]),g,-13.8,1.35+(k%2)*.45,(WZ-1.4)*((k>>1)/2.5-1)));
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
  B(g,wood,-12.4,0,0,.8,1.1,WZ*2-1.8); B(g,C('#2a9a5a'),-12.05,1.1,0,.14,.05,WZ*2-1.8); mk(box(2.2,.15,WZ*2-.4),thatch,g,-12.8,2.6,0,0,0,-.25); for(const z of [-1.9,1.9]) B(g,wood,-12.4,0,z,.12,2.6,.12);
  for(let k=0;k<6;k++) K(mk(cyl(.05,.05,.18,6),G(['#f2c230','#e0473a','#2a9a5a'][k%3]),g,-12.4,1.2,(WZ-1.4)*(k/2.5-1)));
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
  const A=qAtlasPub(), r=A.r, mA=M(A.tex), mU=M(A.tex,{unlit:true}), tint=c=>M(A.tex,{color:c}), brass=C('#d4ad5a'), oakC=C('#4a2a16');
  /* the room: bottle-green glazed tiles to the dado with a moulded border, red flock above, an embossed frieze, pressed-tin ceiling, worn oak boards */
  const tiles=M(P2(64,64,(g,w,h)=>{ R(g,'#3a2a1a',0,h-7,w,7); vfill(g,0,h-7,w,7,[[0,'#5a3a22'],[1,'#2a180c']]); R(g,rgba('#ffffff',.25),0,h-7,w,.8);
    qTiles(g,0,9,w,h-16,8,4,'#24684a','#16261c',331,{brick:true,hi:.45,vary:.1});
    vfill(g,0,0,w,9,[[0,'#e8dcb8'],[1,'#b8a880']]); for(let x=0;x<w;x+=4){ g.strokeStyle='#2a6a4a'; g.lineWidth=1.1; g.beginPath(); g.moveTo(x,7.5); g.quadraticCurveTo(x+2,1,x+4,7.5); g.stroke(); } R(g,'#1e4a34',0,8,w,1.2); },3,331));
  const flock=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#7a1c1c'],[1,'#621414']]); const q=rng(332);
    const motif=(cx,cy,s)=>{ g.fillStyle='#4e0c0e'; g.beginPath(); g.moveTo(cx,cy-12*s); g.bezierCurveTo(cx+9*s,cy-8*s,cx+9*s,cy+2*s,cx,cy+12*s); g.bezierCurveTo(cx-9*s,cy+2*s,cx-9*s,cy-8*s,cx,cy-12*s); g.fill();
      g.fillStyle='#7a1c1c'; g.beginPath(); g.ellipse(cx,cy-1*s,3.4*s,6*s,0,0,Math.PI*2); g.fill(); for(const sd of [-1,1]){ g.fillStyle='#4e0c0e'; g.beginPath(); g.ellipse(cx+sd*8*s,cy+4*s,2.6*s,5*s,sd*.6,0,Math.PI*2); g.fill(); }
      for(let k=0;k<10;k++){ const a=k/10*Math.PI*2; ell(g,cx+Math.cos(a)*7*s,cy+Math.sin(a)*10*s,.5,.5,'#c89a3a'); } };
    motif(16,16,1); motif(48,48,1); motif(48,16,.55); motif(16,48,.55); motif(0,48,.55); motif(64,48,.55);
    for(let i=0;i<300;i++) R(g,rgba(q()<.5?'#000000':'#ff9a9a',.05),q()*w,q()*h,.6,.6); },3,332));
  const frieze=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8c49a'],[1,'#b89a6a']]); for(const y of [24,52]){ for(let x=0;x<w;x+=16){ g.strokeStyle=rgba('#6a4a28',.55); g.lineWidth=1.4; g.beginPath(); g.moveTo(x,y-8); g.quadraticCurveTo(x+8,y+4,x+16,y-8); g.stroke(); g.strokeStyle=rgba('#fff4d8',.6); g.lineWidth=.7; g.beginPath(); g.moveTo(x,y-9); g.quadraticCurveTo(x+8,y+3,x+16,y-9); g.stroke(); ell(g,x,y-9,2,2,rgba('#6a4a28',.6)); ell(g,x-.5,y-9.5,1,1,rgba('#fff4d8',.7)); } } },3,333));
  const boards=M(P2(64,64,(g,w,h)=>{ for(let y=0;y<h;y+=16){ qWood(g,0,y,w,16,'#5a3820','#3a2212',y+334,{lines:6,knots:1}); R(g,rgba('#000000',.55),0,y,w,1); const e=(y*13)%40+10; R(g,rgba('#000000',.45),e,y,1,16); for(const x of [e-3,e+3]) for(const yy of [y+4,y+12]) ell(g,x,yy,.6,.6,'#1a1008'); }
    g.fillStyle=grad(g,0,0,0,h,[[0,rgba('#ffffff',.04)],[1,rgba('#000000',.04)]]); g.fillRect(0,0,w,h); },3,334));
  const tin=M(P2(64,64,(g,w,h)=>{ R(g,'#d8c8a0',0,0,w,h); for(let y=0;y<h;y+=32) for(let x=0;x<w;x+=32){ qBevel(g,x+2,y+2,28,28,'#e2d4ae',.3,1.2); qInset(g,x+7,y+7,18,18,'#d0c094',.3,1); ell(g,x+16,y+16,5,5,'#c8b488'); ell(g,x+15.4,y+15.4,4,4,'#e8dcb8'); for(let k=0;k<4;k++){ const a=k*Math.PI/2+Math.PI/4; ell(g,x+16+Math.cos(a)*10,y+16+Math.sin(a)*10,1.6,1.6,'#bca878'); } }
    radial(g,w/2,h/2,46,[[0,rgba('#ffffff',0)],[1,rgba('#6a4a1a',.18)]]); },3,335));
  const WINS=winsEvery(4,1.8);
  const g=shell('pub',{floor:boards,floorTile:1,ceil:tin,ceilTile:1,dado:tiles,upper:frieze,pier:flock,trim:oakC,end:flock,door:oakC,
    wins:WINS,lamps:[lamp(-9,2.6,-1,[1.2,.8,.45],6),lamp(-2,2.6,-1,[1.2,.8,.45],6),lamp(5,2.6,1,[1.2,.8,.45],6),lamp(11,2.6,0,[1.1,.75,.4],6),lamp(-5,1.8,2.2,[.9,.6,.35],4)],ambK:.8});
  for(const s of [-1,1]) qBar(WG.pub.side[s],oakC,0,0,1.0,s*(WZ-.05),WL,.06,.09);
  const DEC=[], dn=(...a)=>{ const n=N(...a); DEC.push(n); return n; }, D=dn(g), hide=qHide;
  const sphere=(n,m,rc,x,y,z,rad,seg=8)=>qL(n,m,rc,[[-rad,.001,.001],[-rad*.7,rad*.71,rad*.71],[0,rad,rad],[rad*.7,rad*.71,rad*.71],[rad,.001,.001]],seg,x,y,z);
  const pint=(n,x,y,z,k)=>{ qL(n,mA,k%3===2?r.stout:r.pint,[[0,.03,.03],[.1,.034,.034],[.13,.04,.04],[.15,.038,.038]],8,x,y,z); };
  const mat=(n,x,y,z,k)=>qC(n,mA,[r.oak,k%2?r.mat2:r.mat1,r.oak],x,y+.002,z,.05,.05,.004,10);
  /* walls: oak capping on the tiles, a skirting, a picture rail and a moulded cornice, brass sconces, café curtains on brass rods */
  for(const s of [-1,1]){ const n=qWall('pub',s); DEC.push(n); const lx=X=>s<0?X:-X;
    qBar(n,M(A.tex),r.oak,0,1.0,.05,WL,.07,.05); qBar(n,M(A.tex),r.oak,0,.94,.03,WL,.06,.03); qBar(n,oakC,0,0,0,.025,WL,.1,.035); qBar(n,M(A.tex),r.oak,0,2.6,.03,WL,.05,.035);
    qBar(n,C('#c8b48a'),0,0,3.22,.05,WL,.18,.1); qBar(n,C('#8a6a3a'),0,0,3.18,.08,WL,.04,.08); qBar(n,C('#e0d0a8'),0,0,3.3,.11,WL,.1,.05);
    for(const [a,b] of WINS){ const c=(a+b)/2,L=b-a; qB(n,mA,r.oak,lx(c),.96,.06,L+.3,.05,.14); qB(n,mA,r.brass,lx(c),1.72,.07,L+.1,.02,.02); for(const e of [-1,1]) qL(n,mA,r.brass,[[0,.02,.02],[.03,.012,.012]],6,lx(c)+e*(L/2+.05),1.715,.07,0,0,Math.PI/2*e);
      for(const e of [-1,1]) qB(n,mA,qF(r.curtain),lx(c)+e*L*.27,1.02,.07,L*.46,.7,.03); }
    for(const [a,b] of qRuns(WINS)){ if(b-a<2) continue; const c=(a+b)/2; const sc=N(n,lx(c),0,0); qC(sc,mA,r.brass,0,1.95,.03,.05,.05,.03,10,Math.PI/2); qB(sc,mA,r.brass,0,1.94,.08,.02,.02,.1);
      for(const e of [-1,1]){ qB(sc,mA,r.brass,e*.12,1.93,.13,.24,.015,.015); qL(sc,mU,r.sconce,[[0,.035,.035],[.06,.06,.06],[.12,.04,.04]],8,e*.22,1.96,.13); } } }
  /* the bar: fielded oak panels between pilasters, a polished mahogany top with a rounded nosing, a brass foot rail on brackets */
  hide(B(g,oakC,-5,0,-1.6,9,1.1,.7)); hide(B(g,oakC,-5,1.1,-1.6,9.2,.06,.8)); hide(Wz(B(g,brass,-5,.2,-1.22,9,.04,.04)));
  { const n=dn(g); qBar(n,M(A.tex),r.oak,-5,0,-1.6,9,1.1,.66); for(let k=0;k<12;k++){ const x=-9.5+.375+k*.75; qB(n,mA,qF(r.oak,r.barPanel),x,.14,-1.255,.62,.84,.03); }
    for(let k=0;k<=12;k++){ const x=-9.5+k*.75; qB(n,mA,r.oakV,x,.06,-1.25,.09,.98,.05); qB(n,mA,r.oak,x,.98,-1.23,.12,.06,.06); }
    qBar(n,oakC,0,-5,0,-1.25,9.04,.08,.07); qBar(n,M(A.tex),r.mahog,-5,1.1,-1.6,9.2,.06,.8); qBar(n,M(A.tex),r.mahog,-5,1.085,-1.2,9.2,.075,.08);
    qBar(n,M(A.tex),r.brass,-5,.19,-1.08,9,.045,.045); for(let k=0;k<7;k++) qB(n,mA,r.brass,-9.3+k*1.43,.17,-1.15,.03,.06,.14);
    /* beer engines: ceramic handles with pump clips over a brass drip tray, pints and mats, a till at the end, crisps */
    qBar(n,M(A.tex),r.brass,-5.6,1.16,-1.5,5.6,.02,.16);
    for(let k=0;k<6;k++){ const x=-8.2+k*1.05; qC(n,mA,r.brass,x,1.21,-1.6,.03,.035,.06,8); qL(n,mA,r.handle,[[0,.02,.02],[.05,.026,.026],[.22,.03,.03],[.26,.022,.022]],8,x,1.24,-1.6,-.15,0,0); qB(n,mA,qF(r.handle,[r.clip1,r.clip2,r.clip3][k%3]),x,1.33,-1.565,.075,.1,.008,0,-.15,0); }
    for(let k=0;k<7;k++){ const x=-9.1+k*1.2+((k*7)%3)*.1; mat(n,x,1.16,-1.35,k); if(k%3!==1) pint(n,x,1.164,-1.35,k); }
    const ti=dn(g,-1.2,1.16,-1.7); qB(ti,mA,qF(r.brass,r.till),0,0,0,.36,.26,.3); qB(ti,mA,r.brass,0,.26,-.06,.34,.14,.12,0,-.4,0); qB(ti,mA,r.oak,0,-.0,0,.4,.04,.34);
    qB(n,mA,qF(r.crisps),-3.5,1.16,-1.75,.3,.18,.16); qL(n,mA,r.brass,[[0,.05,.05],[.02,.02,.02],[.06,.035,.035],[.1,.002,.002]],10,-9.3,1.16,-1.8); }
  /* the back bar: optics on a mirrored gantry, shelves of bottles and glasses, the old sign over it all */
  { const n=dn(g); qB(n,mA,qF(r.oak,r.barPanel),-5,0,-2.72,9,.9,.34); qBar(n,M(A.tex),r.mahog,-5,.9,-2.7,9.1,.04,.38);
    for(let k=0;k<6;k++){ const x=-8.75+k*1.5; qB(n,mA,qF(r.oak,k===2?r.mirror:r.mirror2,r.mirror),x,1.05,-2.88,1.3,1.3,.02); }
    for(let k=0;k<=6;k++) qB(n,mA,r.oakV,-9.5+k*1.5,.94,-2.84,.1,1.5,.1); qBar(n,M(A.tex),r.oak,-5,2.42,-2.8,9.2,.1,.22);
    for(const y of [1.42,1.86]) qBar(n,M(A.tex),r.mahog,-5,y,-2.75,9,.03,.24);
    const q=rng(341); for(let k=0;k<12;k++){ const x=-9.1+k*.74, c=[0xfff0d0,0xd8a050,0xb8e0a8,0xf0f0f0,0xc87040][k%5];
      qL(n,M(A.tex,{color:c}),r.bottleS,[[0,.04,.04],[.14,.045,.045],[.19,.02,.02],[.25,.018,.018]],8,x,1.38,-2.76,Math.PI,0,0); qC(n,mA,r.optic,x,1.06,-2.76,.022,.03,.09,8); }
    for(let k=0;k<16;k++){ const x=-9.2+k*.56+q()*.1, c=[0xfff0d0,0xd8a050,0xb8e0a8,0xf0f0f0,0xc87040,0x8ab0d8][k%6]; qL(n,M(A.tex,{color:c}),r.bottleS,[[0,.04,.04],[.16,.042,.042],[.2,.02,.02],[.27,.017,.017]],8,x,1.89,-2.75); }
    for(let k=0;k<14;k++) qL(n,mA,r.optic,[[0,.03,.03],[.12,.04,.04]],8,-9.0+k*.3,1.45,-2.7);
    for(let k=0;k<5;k++){ const x=-9+k*2.1; qL(n,mA,r.pint,[[0,.03,.03],[.13,.04,.04]],8,x,.94,-2.62); }
    qB(n,mA,qF(r.oak,r.sign,r.sign),-5,2.55,-2.82,2.2,.5,.04); }
  hide(B(g,C('#3a2014'),-5,1.35,-2.8,9,.04,.24)); hide(B(g,C('#3a2014'),-5,1.85,-2.8,9,.04,.24));
  /* stools: tufted seats, turned brass poles, foot rings */
  for(let k=0;k<6;k++){ const x=-9+k*1.5; Wz(mk(qUV(cyl(.2,.2,.07,14),[r.leather,r.tufted,r.oak]),mA,g,x,.75,-.95)); Wz(mk(qUV(cyl(.035,.035,.75,8),r.brass),mA,g,x,.37,-.95));
    const n=dn(g,x,0,-.95); qT(n,mA,r.brass,.15,.012,4,14,0,.3,0,Math.PI/2); qC(n,mA,r.iron,0,.02,0,.2,.22,.04,14); qT(n,mA,r.brass,.2,.012,4,14,0,.71,0,Math.PI/2); }
  /* scarves over the bar, knitted, fringed */
  for(let k=0;k<5;k++) qNC(qB(WG.pub.side[-1],mA,qF(r.scarf),-9+k*2,2.16,-2.83,1.4,.3,.02,0,0,(k%2?.03:-.03)));
  /* booths: oxblood buttoned leather, oak frames, cast-iron tables, a picture and a sconce for each */
  for(let k=0;k<4;k++){ const x=-10+k*3.1; for(const s of [-1,1]){ hide(B(g,C('#8a1c1c'),x+s*.95,0,2.25,.5,.48,1.2)); hide(B(g,C('#8a1c1c'),x+s*1.2,.48,2.25,.12,.8,1.2)); }
    hide(B(g,oakC,x,.75,2.25,1.0,.06,1.0)); hide(B(g,oakC,x,0,2.25,.1,.75,.1));
    const n=dn(g,x,0,2.25); for(const s of [-1,1]){ qB(n,mA,qF(r.oak,r.barPanel,r.barPanel),s*.95,0,0,.5,.3,1.2); qB(n,mA,qF(r.leather,r.leather,r.leather,r.tufted),s*.93,.3,0,.46,.17,1.16);
      qB(n,mA,[r.tufted,r.tufted,r.oak,r.oak,r.oak,r.oak],s*1.14,.47,0,.06,.76,1.1); qB(n,mA,[r.barPanel,r.barPanel,r.oak,r.oak,r.oak,r.oak],s*1.22,0,0,.08,1.28,1.24); qB(n,mA,r.oak,s*1.22,1.28,0,.16,.05,1.3); qB(n,mA,r.oakV,s*1.22,0,-.62,.12,1.32,.06); }
    qB(n,mA,qF(r.oak,r.oak,r.oak,r.mahog),0,.73,0,1.0,.05,1.0); qB(n,mA,r.oak,0,.69,0,.9,.04,.9); qC(n,mA,r.iron,0,.36,0,.04,.05,.66,8); for(let j=0;j<4;j++) qB(n,mA,r.iron,0,0,0,.6,.05,.06,j*Math.PI/4); qC(n,mA,r.iron,0,.03,0,.08,.1,.06,8);
    for(const [dx,dz,j] of [[-.25,-.2,0],[.28,.15,1],[.2,-.28,2]]){ mat(n,dx,.78,dz,j+k); pint(n,dx,.784,dz,j+k*2); }
    qL(n,mA,r.brass,[[0,.04,.04],[.02,.015,.015],[.12,.012,.012],[.14,.03,.03],[.2,.035,.035]],8,-.05,.78,.3); B(n,U('#ffd890'),-.05,.93,.3,.02,.04,.02);
    qB(n,mA,qF(r.mat1,r.newsp),.18,.78,.3,.2,.004,.28,.3); qL(n,mA,r.optic,[[0,.02,.02],[.07,.02,.02],[.09,.01,.01]],6,-.32,.78,.32); qL(n,tint(0x8a6a3a),r.optic,[[0,.02,.02],[.07,.02,.02],[.09,.01,.01]],6,-.27,.78,.35);
    const pic=[r.ship,r.map,r.photo,r.ship][k]; qNC(qB(WG.pub.side[1],mA,qF(r.gilt,r.gilt,pic),x,1.6,WZ-.03,k%2?.7:1.0,k%2?.6:.75,.04)); }
  /* high tables: oak tops on beer barrels */
  /* the pool table: carved legs, mahogany cushions with diamond inlays, leather pockets, a lamp over it */
  hide(B(g,oakC,6,0,.2,2.6,.78,1.5)); hide(B(g,C('#1f6a3a'),6,.78,.2,2.4,.04,1.3));
  { const n=dn(g,6,0,.2); qB(n,mA,qF(r.oak,r.barPanel,r.barPanel),0,.5,0,2.5,.26,1.4); for(const [dx,dz] of [[-1.1,-.55],[1.1,-.55],[-1.1,.55],[1.1,.55],[0,-.55],[0,.55]]) qL(n,mA,r.oakV,[[0,.08,.08],[.06,.06,.06],[.15,.09,.09],[.3,.06,.06],[.45,.08,.08],[.52,.07,.07]],8,dx,0,dz);
    qB(n,mA,qF(r.felt),0,.76,0,2.36,.04,1.26); for(const s of [-1,1]){ qBar(n,M(A.tex),r.mahog,0,.76,s*.69,2.6,.08,.12); qBar(n,M(A.tex),r.mahog,s*1.24,.76,0,1.26,.08,.12,'z'); qBar(n,M(A.tex),r.felt,0,.79,s*.615,2.3,.035,.04); qBar(n,M(A.tex),r.felt,s*1.165,.79,0,1.15,.035,.04,'z');
      for(let j=0;j<6;j++) qB(n,mA,r.ball,-1+j*.4,.841,s*.69,.03,.002,.02,Math.PI/4); }
    for(const [dx,dz] of [[-1.2,-.65],[1.2,-.65],[-1.2,.65],[1.2,.65],[0,-.68],[0,.68]]) qC(n,mA,[r.leather,r.pocket,r.pocket],dx,.82,dz,.065,.06,.03,10);
    const balls=[0xffffff,0xe8c020,0x2a4ab8,0xd02a20,0x6a2a8a,0xe86a20,0x2a8a3a,0x8a2a1a,0x121212,0xe8c020]; balls.forEach((c,j)=>{ const bx=j?.55+((j-1)%4)*.07:-.6, bz=j?((j-1)/4|0)*.07-.05+((j-1)%4)*.035:0; sphere(n,M(A.tex,{color:c}),r.ball,bx,.808,bz,.028,8); });
    qB(n,mA,r.oak,-.2,.785,.25,1.45,.012,.012,.15); qB(n,mA,r.handle,-.85,.785,.36,.4,.02,.02,.15); qB(n,C('#3a6ab8'),[0,0,1,1],.2,.8,-.6,.025,.025,.025);
    qB(n,mA,qF(r.shade,r.shade,r.shade,r.shade,r.shadeIn),0,2.25,0,1.6,.14,.36); for(const dx of [-.5,0,.5]) sphere(n,U('#fff2c8'),[0,0,1,1],dx,2.22,0,.05,6); for(const dx of [-.6,.6]) qB(n,mA,r.brass,dx,2.39,0,.012,WH-2.39,.012); }
  for(let k=0;k<6;k++) hide(mk(cyl(.03,.03,.03,8),C('#f2ece0'),g,5.4+k*.2,.83,.1+(k%2)*.2));
  /* darts at the front: the board in an oak cabinet with chalk scoreboards, an oche on the floor */
  { const n=dn(g,WL/2,0,-1.8,0,-Math.PI/2,0); qC(n,mA,[r.iron,r.dart,r.dart],0,1.75,.06,.23,.23,.04,24,Math.PI/2); qB(n,mA,qF(r.oak),0,1.38,.02,.62,.74,.04); for(const s of [-1,1]){ qB(n,mA,qF(r.oak,r.scoreB,r.oak),s*.48,1.38,.2,.32,.74,.03,s*.5); }
    for(let j=0;j<3;j++){ qB(n,mA,r.brass,-.04+j*.05,1.78-j*.04,.1,.006,.006,.1); qB(n,C('#c82a22'),[0,0,1,1],-.04+j*.05,1.78-j*.04,.15,.002,.03,.03); }
    qB(n,mA,r.brass,0,0,2.37,.9,.006,.04); }
  hide(mk(cyl(.24,.24,.04,16),C('#121214'),g,WL/2-.05,1.75,-1.8,0,0,Math.PI/2));
  /* the match on three screens */
  for(const x of [-8,-2,4]){ const n=dn(g,x,2.88,-2.82); qB(n,mA,qF(r.iron),0,-.36,0,1.12,.72,.07); qPl(n,mU,r.tv,0,0,.04,1.0,.6); qB(n,mA,r.iron,0,-.12,-.05,.12,.24,.06); }
  /* chesterfield by the fire, a side table with the paper and a whisky */
  hide(B(g,C('#4a1e14'),10,0,1.8,2.4,.45,.9)); hide(B(g,C('#4a1e14'),10,.45,2.2,2.4,.5,.2)); for(const s of [-1,1]) hide(B(g,C('#4a1e14'),10+s*1.15,.45,1.8,.2,.35,.9));
  { const n=dn(g,10,0,1.8); qB(n,mA,qF(r.chesL),0,.1,0,2.4,.35,.9); qB(n,mA,qF(r.chesL,r.chesL,r.chesL,r.leather),0,.32,-.05,2.0,.14,.78); qB(n,mA,[r.chesL,r.chesL,r.leather,r.chesL,r.chesL,r.chesL],0,.45,.4,2.4,.5,.2);
    for(const s of [-1,1]){ qB(n,mA,qF(r.chesL),s*1.15,.45,0,.2,.32,.9); qC(n,mA,[r.chesL,r.leather,r.leather],s*1.15,.8,0,.13,.13,.9,10,Math.PI/2); }
    qC(n,mA,[r.leather,r.chesL,r.chesL],0,.95,.4,.12,.12,2.4,10,0,0,Math.PI/2); for(const [dx,dz] of [[-1.1,-.38],[1.1,-.38],[-1.1,.38],[1.1,.38]]) sphere(n,mA,r.oak,dx,.05,dz,.06,6);
    const t=dn(g,8.3,0,2.3); qC(t,mA,[r.oak,r.mahog,r.oak],0,.6,0,.28,.28,.04,14); qL(t,mA,r.oakV,[[0,.12,.12],[.06,.04,.04],[.5,.03,.03],[.58,.05,.05]],8,0,0,0); qB(t,mA,qF(r.newsp),.04,.62,-.02,.3,.008,.22,.4); qC(t,tint(0xd89040),r.pint,-.12,.66,.1,.035,.03,.07,8); }
  /* the fireplace: oak surround with columns, green tile slips, a cast-iron grate of glowing coal, an overmantel mirror, a clock */
  hide(B(g,C('#3a3632'),WL/2-.3,0,1.6,.5,1.3,1.6)); hide(B(g,C('#0a0806'),WL/2-.52,.15,1.6,.06,.8,1.0)); hide(B(g,U('#ff8a30'),WL/2-.5,.2,1.6,.05,.25,.7)); hide(B(g,oakC,WL/2-.35,1.3,1.6,.6,.08,1.9));
  { const n=dn(g,WL/2,0,1.6,0,-Math.PI/2,0); qB(n,mA,qF(r.oak,r.barPanel),0,0,.25,1.6,1.3,.1); for(const s of [-1,1]){ qB(n,mA,r.oakV,s*.72,0,.32,.14,1.28,.1); qB(n,mA,qF(r.tileG),s*.47,.1,.31,.3,.85,.02); }
    qB(n,mA,r.iron,0,.1,.31,.62,.85,.03); qB(n,M(A.tex,{color:0x000000}),[0,0,.01,.01],0,.15,.33,.46,.62,.01); qB(n,mU,qF(r.fire),0,.18,.36,.42,.28,.01); qB(n,mU,qF(r.coal,r.coal,r.coal,r.coal),0,.15,.38,.4,.06,.14);
    for(let j=0;j<5;j++) qB(n,mA,r.iron,-.18+j*.09,.15,.46,.02,.14,.02); qBar(n,M(A.tex),r.mahog,0,1.3,.38,1.9,.07,.32); qBar(n,M(A.tex),r.brass,0,0,.85,1.5,.08,.025); for(const s of [-1,1]) qB(n,mA,r.brass,s*.75,0,.6,.025,.08,.5);
    qB(n,mA,qF(r.gilt,r.mirror),0,1.42,.28,1.2,.8,.03); const cl=dn(n,0,1.37,.4); qB(cl,mA,qF(r.mahog),0,0,0,.26,.24,.1); qC(cl,mA,[r.brass,r.clockF,r.clockF],0,.13,.06,.08,.08,.02,14,Math.PI/2);
    for(const s of [-1,1]){ qL(n,mA,r.brass,[[0,.04,.04],[.02,.015,.015],[.16,.012,.012],[.2,.025,.025]],8,s*.6,1.37,.4); qL(n,U('#f4ecd8'),[0,0,1,1],[[0,.01,.01],[.1,.01,.01]],6,s*.6,1.57,.4); B(n,U('#ffd060'),s*.6,1.67,.4,.008,.025,.008); }
    qL(n,mA,r.iron,[[0,.12,.1],[.25,.14,.12],[.3,.1,.08]],8,-.9,0,.6); for(let j=0;j<3;j++) qB(n,mA,r.brass,.85+j*.05,0,.55,.015,.6,.015,0,0,(j-1)*.08); }
  /* the ceiling: oak beams across, schoolhouse pendants with green enamel shades over the bar */
  for(let x=-12;x<13;x+=2.4) qBar(D,M(A.tex),r.oak,x,WH-.16,0,WZ*2,.16,.14,'z');
  for(const [x,z] of [[-9,-1],[-2,-1],[5,1],[11,0]]){ const n=dn(g,x,0,z); qBowl(n,mA,r.shade,r.shadeIn,[[0,.04],[.04,.12],[.1,.2],[.14,.22]],.008,12,0,2.79,0).r=[Math.PI,0,0]; qC(n,mA,r.brass,0,2.88,0,.04,.04,.06,8); sphere(n,U('#fff2c8'),[0,0,1,1],0,2.67,0,.06,8); qB(n,mA,r.brass,0,2.9,0,.012,WH-2.9,.012); }
  /* the entry wall: chalkboard, lifebuoy and ship's wheel, coat hooks */
  { const n=dn(g,-WL/2,0,0,0,Math.PI/2,0); qB(n,mA,qF(r.oak,r.chalk),-1.75,1.15,.03,1.1,1.1,.04); qT(n,mA,r.buoy,.26,.07,6,16,1.75,1.85,.08,0,0,0); qB(n,mA,qF(r.oak,r.sign,r.sign),1.75,1.42,.06,.5,.12,.02);
    const wh=dn(n,1.75,1.1,.06); qT(wh,mA,r.oak,.22,.025,4,16,0,0,0); for(let j=0;j<4;j++) mk(qUV(box(.02,.6,.02),r.oakV),mA,wh,0,0,0,0,0,j*Math.PI/4); qC(wh,mA,r.brass,0,0,0,.05,.05,.05,10,Math.PI/2);
    qBar(n,M(A.tex),r.oak,0,1.62,.03,1.2,.08,.03); for(let j=0;j<4;j++){ qB(n,mA,r.brass,-.45+j*.3,1.6,.08,.02,.1,.02,0,.5,0); } qL(n,tint(0x2a2a30),r.leather,[[0,.13,.1],[.03,.1,.08],[.1,.09,.075],[.14,.001,.001]],10,-.45,1.55,.14,.3,0,0); }
  qDoor(g,mA,r.barPanel,r.brass,-1); qDoor(g,mA,r.barPanel,r.brass,1); DEC.forEach(qNC); WG.pub.atl={mA,mU,r};
  WG.pub.spots={gaffer:{x:7.5,z:-.4,ry:-Math.PI/2},gaffer_c:{x:3.6,z:1.4,ry:-Math.PI/2},gaffer_c2:{x:-4,z:-.6,ry:-Math.PI/2}};
};

/* ---------- 05 · Trattoria Assunta ---------- */
CAR_BUILD.trattoria=function trattoria(){
  const A=qAtlasTrattoria(), r=A.r, mA=M(A.tex), mU=M(A.tex,{unlit:true}), tint=c=>M(A.tex,{color:c}), green=C('#2a7a4a');
  /* the room: lemon-yellow trowelled plaster, a majolica tile dado, cotto floor, whitewashed ceiling between dark beams */
  const plaster=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f8de8c'],[1,'#eec872']]); const q=rng(441); for(let i=0;i<26;i++) ell(g,q()*w,q()*h,4+q()*9,2+q()*5,rgba(q()<.5?'#d8a850':'#fff0b8',.18));
    for(let i=0;i<40;i++){ g.strokeStyle=rgba('#c89848',.12); g.lineWidth=1.2; g.beginPath(); const x=q()*w,y=q()*h; g.arc(x,y,4+q()*6,q()*6,q()*6+1.2); g.stroke(); }
    g.strokeStyle=rgba('#a87838',.35); g.lineWidth=.5; g.beginPath(); g.moveTo(40,10); g.lineTo(43,16); g.lineTo(41,22); g.lineTo(45,27); g.stroke(); },3,441));
  const dado=M(P2(64,64,(g,w,h)=>{ R(g,'#b8b0a0',0,0,w,h); for(let y=12;y<h-6;y+=12.5) for(let x=0;x<w;x+=16) qMajolica(g,x+.4,y+.4,15.2,(x+y)|0);
    vfill(g,0,0,w,12,[[0,'#2a4a9a'],[1,'#1e3a7a']]); for(let x=0;x<w;x+=8){ qLemon(g,x+4,6,.9,(x%16)?.5:-.5); qLeaf(g,x+1,6,3,Math.PI,'#3a8a3a'); } R(g,'#f8e8a0',0,11,w,1); R(g,'#5a3a20',0,h-6,w,6); R(g,rgba('#ffffff',.25),0,h-6,w,.6); },3,442));
  const cotto=M(P2(64,64,(g,w,h)=>{ qTiles(g,0,0,w,h,16,16,'#94604a','#45302a',443,{vary:.1,hi:.1,gw:1.2}); const q=rng(444); for(let i=0;i<40;i++) ell(g,q()*w,q()*h,1+q()*2,.6+q(),rgba('#6a3018',.2)); },3,443));
  const ceil=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f6f0e2'],[1,'#ece2cc']]); const q=rng(445); for(let i=0;i<20;i++) ell(g,q()*w,q()*h,5+q()*8,3+q()*5,rgba('#d8c8a8',.18)); },3,445));
  const brick=M(P2(64,64,(g,w,h)=>{ R(g,'#6a4a3a',0,0,w,h); for(let y=0,row=0;y<h;y+=8,row++) for(let x=(row%2)*8-8;x<w;x+=16){ vfill(g,x+.6,y+.6,14.8,6.8,[[0,'#c8704a'],[1,'#8a4024']]); R(g,rgba('#ffd0a0',.2),x+1,y+1,13,1); } const q=rng(446); for(let i=0;i<60;i++) R(g,rgba('#2a1008',.25),q()*w,q()*h*.5,2,1); },3,446),{repeat:[6,2.5]});
  const WINS=winsEvery(4,1.8,-12,8);
  const g=shell('trattoria',{floor:cotto,floorTile:1,ceil,ceilTile:1,dado,upper:plaster,pier:plaster,trim:green,end:plaster,door:green,
    wins:WINS,lamps:[lamp(-10,2.6,0,[1.25,.95,.6],6),lamp(-4,2.6,0,[1.25,.95,.6],6),lamp(2,2.6,0,[1.25,.95,.6],6),lamp(8,2.6,0,[1.2,.9,.6],6),lamp(12.5,1.0,0,[1.6,.7,.25],4)]});
  for(const s of [-1,1]) qBar(WG.trattoria.side[s],mA,r.walnut,0,1.0,s*(WZ-.05),WL,.06,.09);
  const DEC=[], dn=(...a)=>{ const n=N(...a); DEC.push(n); return n; }, D=dn(g), hide=qHide;
  const sphere=(n,m,rc,x,y,z,rad,seg=8,sy=1)=>qL(n,m,rc,[[-rad*sy,.001,.001],[-rad*.7*sy,rad*.71,rad*.71],[0,rad,rad],[rad*.7*sy,rad*.71,rad*.71],[rad*sy,.001,.001]],seg,x,y,z);
  const wglass=(n,x,y,z,full)=>{ qL(n,mA,full?r.wine:r.glass,[[0,.03,.03],[.004,.03,.03],[.01,.004,.004],[.08,.004,.004],[.1,.03,.03],[.15,.035,.035],[.17,.03,.03]],8,x,y,z); };
  /* tables: gingham cloths with a white runner, two places laid, a candle in a straw fiasco, bread, oil */
  const chair=(x,z,ry)=>{ const n=N(g,x,0,z,0,ry,0); hide(B(n,C('#8a5a34'),0,.45,0,.44,.06,.44)); hide(B(n,C('#8a5a34'),-.2,.5,0,.05,.55,.42)); const v=dn(n);
    for(const [dx,dz] of [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]]) qB(v,mA,r.walnutV,dx,0,dz,.04,.45,.04); for(const dz of [-.18,.18]) qB(v,mA,r.walnutV,-.2,.45,dz,.04,.58,.04);
    for(const s of [-1,1]){ qB(v,mA,r.walnut,0,.14,s*.18,.36,.025,.025); qB(v,mA,r.walnut,s*.18,.18,0,.025,.025,.36); } qB(v,mA,qF(r.walnut,r.walnut,r.walnut,r.rush),0,.42,0,.44,.06,.44);
    for(let k=0;k<3;k++) qB(v,mA,r.walnut,-.2,.62+k*.14,0,.03,.07,.36); qB(v,mA,r.walnut,-.2,1.0,0,.04,.04,.42); };
  const tables=[]; for(const x of [-11,-7.4,-3.8,-.2,3.4]) for(const s of [-1,1]) tables.push([x,s*1.7]);
  tables.forEach(([x,z],ti)=>{ qB(g,mA,qF(r.checkS,r.checkS,r.checkS,r.check),x,.72,z,1.1,.05,1.0); qB(g,mA,[r.checkS,r.checkS,r.check,r.walnut,r.checkS,r.checkS],x,.42,z,1.14,.3,1.04); hide(B(g,C('#6a4426'),x,0,z,.1,.72,.1));
    chair(x-.75,z,0); chair(x+.75,z,Math.PI);
    const n=dn(g,x,.77,z), nonna=x===-.2&&z>0; qB(n,mA,qF(nonna?r.lace:r.runner),0,0,0,nonna?.9:.62,.004,nonna?.8:.62,nonna?0:Math.PI/4);
    for(const s of [-1,1]){ const px=s*.3; qC(n,mA,[r.plate,(ti+s)%3===0?r.plate:r.pasta,r.plate],px,.008,0,.11,.09,.015,12); qB(n,mA,r.steel,px,.004,-.16,.16,.004,.012); qB(n,mA,r.steel,px,.004,.16,.16,.004,.014);
      qB(n,mA,qF(r.napkin),px+s*.1,.006,-.2,.1,.012,.1,.3); wglass(n,px-s*.1,0,.22,(ti+s)%2===0); qC(n,mA,[r.glass,r.glass,r.glass],px+s*.02,.045,.26,.03,.026,.09,8); }
    qL(n,mA,r.fiasco,[[0,.06,.06],[.1,.075,.075],[.15,.06,.06],[.2,.02,.02],[.28,.015,.015],[.3,.02,.02]],10,0,0,-.05); qC(n,tint(0xfffaf0),r.mozz,0,.33,-.05,.012,.012,.07,6); B(n,U('#ffd890'),0,.37,-.05,.012,.03,.012);
    qBowlish(n,0,.0,.25); qL(n,mA,r.glass,[[0,.02,.02],[.08,.022,.022],[.11,.008,.008],[.13,.01,.01]],6,.12,0,-.2); qL(n,tint(0xe0d080),r.glass,[[0,.02,.02],[.08,.022,.022],[.11,.008,.008],[.13,.01,.01]],6,.17,0,-.24);
    if(nonna){ qBowl(n,mA,r.plate,r.pasta,[[0,.08],[.06,.15],[.1,.17]],.008,12,0,0,.1); for(const s of [-1,1]){ qL(n,mA,r.copper,[[0,.03,.03],[.02,.012,.012],[.16,.01,.01],[.18,.025,.025]],8,s*.38,0,-.3); qC(n,tint(0xfffaf0),r.mozz,s*.38,.24,-.3,.012,.012,.08,6); B(n,U('#ffd890'),s*.38,.29,-.3,.012,.03,.012); } } });
  function qBowlish(n,x,y,z){ qC(n,mA,[r.basket,r.basket,r.basket],x,y+.03,z,.1,.08,.06,10); for(let k=0;k<3;k++) qL(n,mA,r.bread,[[0,.03,.025],[.03,.035,.03],[.05,.02,.016],[.055,.001,.001]],8,x+(k-1)*.05,y+.05,z,0,k,0); }
  /* the kitchen end: a deli counter of majolica and marble with the glass case full, shelves of tins and bottles, the oven */
  hide(B(g,C('#f2ece0'),9,0,-2.1,4,1.0,1.0)); hide(Wz(B(g,C('#d8f0f2'),9,.55,-1.58,4,.4,.04)));
  { const n=dn(g,9,0,-2.1); qB(n,mA,qF(r.walnut),0,0,0,4,1.0,.96); for(let k=0;k<6;k++) qB(n,mA,qF(r.walnut,r.majol),-2+.333+k*.667,.08,.48,.62,.42,.02); qBar(n,mA,r.walnut,0,0,.5,4.02,.08,.04); qBar(n,mA,r.walnut,0,.5,.5,4.02,.04,.05);
    qB(n,mA,qF(r.chrome,r.glassCase),0,.55,.5,4.0,.42,.03); qBar(n,mA,r.marble,0,.98,0,4.1,.05,1.04); for(let k=0;k<4;k++) qB(n,mA,r.chrome,-2+k*1.333,.55,.5,.02,.42,.04);
    for(let k=0;k<5;k++){ qC(n,mA,[r.cheese,r.cheeseTop,r.cheeseTop],-1.4+k*.7,1.06+(k===2?.12:0),-.1,.24,.24,.12,16); if(k===2) qC(n,mA,[r.cheese,r.cheeseTop,r.cheeseTop],0,1.06,-.1,.24,.24,.12,16); }
    const sl=dn(n,1.3,1.03,.15); qB(sl,mA,qF(r.red),0,0,0,.3,.08,.22); qC(sl,mA,[r.chrome,r.chrome,r.chrome],0,.2,0,.12,.12,.02,16,Math.PI/2); qB(sl,mA,qF(r.red),.05,.08,-.08,.12,.2,.06); qC(sl,mA,r.chrome,.1,.12,.14,.02,.02,.1,6,Math.PI/2);
    qBowl(n,mA,r.plate,r.plate,[[0,.06],[.04,.12],[.07,.14]],.008,12,-1.2,1.03,.25); for(let k=0;k<7;k++) sphere(n,mA,r.lemon,-1.2+Math.cos(k*.9)*.07,1.09+(k>4?.04:0),.25+Math.sin(k*.9)*.06,.035,8,1.25);
    qBowl(n,mA,r.plate,r.plate,[[0,.05],[.03,.1],[.06,.12]],.008,12,-.4,1.03,.28); for(let k=0;k<4;k++) sphere(n,mA,r.mozz,-.4+(k%2-.5)*.06,1.08,.28+((k>>1)-.5)*.06,.035,8);
    qB(n,mA,qF(r.steel),.5,1.03,.22,.22,.06,.2); qB(n,mA,qF(r.chrome),.5,1.12,.16,.04,.2,.04); qC(n,mA,[r.chrome,r.steel,r.steel],.5,1.33,.16,.08,.08,.03,12,Math.PI/2); }
  { const n=dn(g); for(let k=0;k<3;k++){ const y=1.25+k*.45; qBar(n,mA,r.walnut,10.45,y,-2.74,1.7,.035,.3); for(const dx of [-.75,.75]) qB(n,mA,r.walnut,10.45+dx,y-.14,-2.84,.03,.14,.06);
      for(let j=0;j<7;j++){ const x=9.75+j*.23, kind=(j+k*2)%5;
        if(kind===0) qL(n,mA,r.wineB,[[0,.035,.035],[.18,.036,.036],[.22,.015,.015],[.3,.013,.013]],8,x,y+.035,-2.72);
        else if(kind===1) qC(n,mA,[r.tomCan,r.steel,r.steel],x,y+.095,-2.72,.04,.04,.12,10);
        else if(kind===2) qB(n,mA,qF(r.oilTin),x,y+.035,-2.72,.12,.2,.08);
        else if(kind===3) qB(n,mA,qF(r.packet),x,y+.035,-2.74,.13,.22,.05);
        else qL(n,mA,r.jar,[[0,.04,.04],[.12,.045,.045],[.14,.03,.03],[.16,.035,.035]],8,x,y+.035,-2.72); } } }
  for(let k=0;k<5;k++) hide(mk(cyl(.24,.24,.12,12),C('#e8c460'),g,7.6+k*.7,1.06,-2.2));
  /* the wood-fired oven: brick dome, a tiled arch round the glowing mouth, a peel and a stack of oak */
  const ov=Wz(mk(lathe([[0,1.2,1.2],[.6,1.2,1.2],[1.2,.95,.95],[1.6,.5,.5],[1.75,.1,.1]],16),brick,g,12.6,0,1.4)); hide(Wz(B(g,C('#0a0604'),11.45,.55,1.4,.06,.6,.8))); hide(Wz(B(g,U('#ff7a20'),11.5,.6,1.4,.05,.3,.6)));
  { const n=dn(g,11.42,0,1.4); qB(n,mA,qF(r.soot),0,.55,0,.04,.62,.74); qB(n,mU,qF(r.fire),-.03,.56,0,.02,.3,.6); for(let k=0;k<5;k++) qB(n,mU,qF(r.fire),-.035,.56,-.26+k*.13,.012,.1,.07);
    for(let k=0;k<9;k++){ const a=k/8*Math.PI, rr=.46; qB(n,mA,[r.soot,r.pot,r.soot,r.soot,r.soot,r.soot],-.04,.7+Math.sin(a)*rr-.06,Math.cos(a)*rr,.05,.1,.17,0,a-Math.PI/2); } for(const e of [-1,1]) qB(n,mA,[r.soot,r.majol,r.pot,r.pot,r.pot,r.pot],-.04,.55,e*.46,.04,.15,.12);
    qB(n,mA,qF(r.majol),-.05,0,0,.08,.55,1.0); qBar(n,mA,r.marble,-.1,.52,0,1.1,.05,.24,'z');
    const pl=dn(g,11.0,0,2.65); qB(pl,mA,qF(r.peel),0,0,0,.04,1.4,.3,0,0,-.15); qB(pl,mA,r.peel,0,1.0,0,.03,.9,.06,0,0,-.15);
    for(let j=0;j<12;j++){ const yy=.06+(j>>2)*.12, zz=-2.7+(j%4)*.14+(j>>2)*.07; qC(D,mA,[r.bark,r.logEnd,r.logEnd],13.55,yy,zz,.06,.06,.55,8,0,0,Math.PI/2); } }
  /* hams, salami and provolone on the drying poles; garlic and chilli strings by the windows */
  for(const z of [-.4,.4]){ qBar(D,mA,r.walnut,-1,2.85,z,22,.06,.06); }
  for(let k=0;k<10;k++){ const x=-11+k*2.2, z=(k%2?1:-1)*.4; B(g,C('#2a1a10'),x,2.8,z,.01,.6,.01); mk(qUV(lathe([[0,.03,.03],[.1,.11,.09],[.35,.13,.11],[.5,.05,.05]],10),r.ham),mA,g,x,2.3,z,Math.PI,0,0);
    const n=dn(g,x+1.1,0,-z); qB(n,mA,r.walnut,0,2.55,0,.006,.3,.006); if(k%2) qL(n,mA,r.salami,[[0,.04,.04],[.36,.045,.045],[.4,.02,.02]],8,0,2.55,0,Math.PI,0,0); else { qL(n,mA,r.provolone,[[0,.02,.02],[.04,.09,.09],[.16,.11,.11],[.26,.06,.06],[.32,.03,.03]],10,0,2.55,0,Math.PI,0,0); } }
  for(let k=0;k<14;k++){ const x=-12+k*1.6; for(let j=0;j<4;j++) mk(qUV(lathe([[0,.02,.02],[.04,.05,.05],[.08,.02,.02]],6),k%2?r.garlic:r.chilli),mA,g,x,3.25-j*.12,1.3); B(D,C('#c8a868'),x,2.8,1.3,.008,.5,.008); }
  /* walls: green shutters folded back, lace at the windows, basil on the sills, photographs, the Madonna, Vesuvio */
  for(const s of [-1,1]){ const n=qWall('trattoria',s); DEC.push(n); const lx=X=>s<0?X:-X;
    qBar(n,mA,r.walnut,0,0,.02,WL,.1,.035);
    for(const [a,b] of WINS){ const c=(a+b)/2,L=b-a; for(const e of [-1,1]) qB(n,mA,qF(r.walnut,r.shutter,r.shutter),lx(c)+e*(L/2+.3),.98,.04,.46,1.66,.04);
      qB(n,mA,qF(r.lace),lx(c),2.28,.07,L,.32,.02); qB(n,mA,r.chrome,lx(c),2.6,.08,L+.2,.02,.02); qB(n,mA,r.walnut,lx(c),.95,.08,L+.24,.05,.18);
      if(!(s<0&&c>6)){ const p=dn(n,lx(c)+.5,1.0,.1); qL(p,mA,r.pot,[[0,.07,.07],[.14,.09,.09],[.16,.095,.095]],10,0,0,0); for(let j=0;j<5;j++) sphere(p,mA,r.basil,Math.cos(j*1.3)*.05,.2+(j%2)*.04,Math.sin(j*1.3)*.05,.06,6); } }
    for(let k=0;k<8;k++){ const x=-12.8+k*3; if(Math.abs(x+.2)<.8) continue; qB(n,mA,qF(r.frame,[r.photo1,r.photo2,r.photo3][(k+(s>0?1:0))%3]),lx(x),2.66,.015,.36,.48,.03); }
    for(let k=0;k<3;k++) qB(n,mA,qF(r.frame,[r.photo2,r.photo3,r.photo1][k]),lx(-9.8+k*.45),1.7,.015,.28,.36,.025); }
  { const n=dn(WG.trattoria.side[1],-.2,0,WZ-.02,0,Math.PI,0); qB(n,mA,qF(r.walnut,r.madonna),0,1.5,.04,.8,.8,.05); qB(n,mA,qF(r.frame),0,2.3,.06,.96,.06,.12); qB(n,mA,r.walnut,0,1.42,.12,.9,.04,.24);
    for(const e of [-1,1]){ qC(n,U('#d82020'),[0,0,1,1],e*.3,1.5,.14,.035,.03,.08,8); B(n,U('#ffd060'),e*.3,1.55,.14,.012,.025,.012); } qL(n,mA,r.pot,[[0,.04,.04],[.1,.05,.05]],8,0,1.46,.15); for(let j=0;j<6;j++) sphere(n,M(A.tex,{color:j%2?0xffffff:0xff9aa0}),r.mozz,Math.cos(j)*.06,1.6+(j%3)*.03,.15+Math.sin(j)*.04,.035,6); }
  { const n=dn(WG.trattoria.side[-1],-.2,0,-WZ+.02); qB(n,mA,qF(r.frame,r.vesuvio),0,1.4,.03,1.1,.85,.04); }
  /* end walls: the entry with the sign and a coat stand corner, the kitchen wall with the menu and copper pans */
  { const n=dn(g,-WL/2,0,0,0,Math.PI/2,0); qB(n,mA,qF(r.walnut,r.signT),0,2.45,.04,1.6,.6,.04); qBar(n,mA,r.walnut,0,0,.02,WZ*2,.1,.035); }
  { const n=dn(g,WL/2,0,0,0,-Math.PI/2,0); qB(n,mA,qF(r.walnut,r.chalk),1.7,1.3,.03,1.0,1.0,.04); qBar(n,mA,r.chrome,-1.75,2.25,.08,1.6,.02,.02); qBar(n,mA,r.walnut,0,0,.02,WZ*2,.1,.035);
    for(let k=0;k<5;k++){ const x=-2.4+k*.32; qB(n,mA,r.chrome,x,2.05,.08,.008,.2,.008); qBowl(n,mA,r.copper,r.copperIn,[[0,.08+k*.012],[.06,.1+k*.012],[.09,.11+k*.012]],.006,12,x,1.72-k*.02,.16).r=[Math.PI/2,0,0]; } }
  /* beams, festa lights, milk-glass pendants over the tables */
  for(let x=-13.2;x<14;x+=1.6) qBar(D,mA,r.walnut,x,WH-.17,0,WZ*2,.17,.16,'z'); for(const z of [-WZ+.1,WZ-.1]) qBar(D,mA,r.walnut,0,WH-.24,z,WL,.12,.12);
  for(let k=0;k<44;k++){ const x=-13+k*.6, y=WH-.32-Math.abs(Math.sin(k*Math.PI/2.66))*.18; B(D,U(['#ff5a3a','#f8d040','#5ac85a','#4a8aff','#ffffff'][k%5]),x,y,0,.04,.05,.04); } qBar(D,C('#2a2a2a'),0,0,WH-.3,0,26.4,.008,.008);
  for(const x of [-10,-4,2,8]){ const n=dn(g,x,0,0); qBowl(n,mU,r.milk,r.milk,[[0,.04],[.05,.18],[.12,.26],[.15,.27]],.01,12,0,2.85,0).r=[Math.PI,0,0]; sphere(n,U('#fff4d8'),[0,0,1,1],0,2.68,0,.06,6); qB(n,mA,r.chrome,0,2.85,0,.01,WH-2.85,.01); }
  /* the scooter by the door: rounded red body, chrome, a round headlamp */
  { const sc=N(g,-12.2,0,1.9,0,.3,0); for(const dx of [-.55,.55]) mk(qUV(cyl(.2,.2,.1,14),[r.bark,r.chrome,r.chrome]),mA,sc,dx,.2,0,Math.PI/2); qB(sc,mA,qF(r.red),-.2,.25,0,.8,.35,.4); qB(sc,mA,qF(r.bark,r.bark,r.bark,r.walnut),-.3,.6,0,.5,.1,.32); qB(sc,mA,qF(r.red),.45,.25,0,.15,.7,.36,0,0,-.2); qB(sc,mA,r.chrome,.55,.98,0,.05,.05,.6);
    const d=dn(sc); qL(d,mA,r.red,[[0,.22,.2],[.2,.24,.21],[.32,.16,.15],[.36,.001,.001]],10,-.3,.25,0,0,0,Math.PI/2*0); sphere(d,mA,r.red,-.4,.45,0,.2,10,.8); qC(d,mA,[r.chrome,r.milk,r.milk],.6,1.06,0,.07,.07,.04,12,0,0,Math.PI/2); for(const e of [-1,1]) qB(d,mA,r.chrome,.56,1.0,e*.32,.02,.14,.02); sphere(d,mA,r.red,.55,.2,0,.16,8,1.2); }
  qDoor(g,tint(0x7ac890),r.walnutV,r.chrome,-1); qDoor(g,tint(0x7ac890),r.walnutV,r.chrome,1); DEC.forEach(qNC); WG.trattoria.atl={mA,mU,r};
  WG.trattoria.spots={nonna:{x:-.2,z:.6,ry:-Math.PI/2,chair:true},nonna_c:{x:-1.6,z:-.3,ry:Math.PI/2},nonna_c2:{x:1.6,z:.0,ry:-Math.PI/2}};
};

/* ---------- 06 · Banya & ice bar ---------- */
CAR_BUILD.banya=function banya(){
  const A=qAtlasBanya(), r=A.r, mA=M(A.tex), mU=M(A.tex,{unlit:true}), mC=M(A.tex,{cut:true,double:true}), tint=c=>M(A.tex,{color:c});
  /* behind the modelled logs and ice: tongue-and-groove pine (also the sauna ceiling); the floor is scrubbed boards */
  const pine=M(P2(64,64,(g,w,h)=>{ for(let x=0;x<w;x+=8){ qWood(g,x,0,8,h,'#d8ac70','#b4844c',x+51,{vert:true,lines:5,knots:.6,sheen:false}); R(g,rgba('#3a2010',.55),x,0,.8,h); R(g,rgba('#fff0d0',.3),x+.8,0,.6,h); }
    g.fillStyle=grad(g,0,0,0,h,[[0,rgba('#ffffff',.08)],[1,rgba('#000000',.1)]]); g.fillRect(0,0,w,h); },3,51));
  const boards=M(P2(64,64,(g,w,h)=>{ for(let y=0;y<h;y+=16){ qWood(g,0,y,w,16,'#caa06a','#a87c4a',y+53,{lines:6,knots:1}); R(g,rgba('#2a1808',.6),0,y,w,1); R(g,rgba('#ffffff',.15),0,y+1,w,.6); const e=(y*7)%48+8; R(g,rgba('#2a1808',.5),e,y,1,16); for(const x of [e-3,e+3]) for(const yy of [y+4,y+12]) ell(g,x,yy,.6,.6,'#4a3a2a'); } },3,53));
  const WIN=[[-12,-10.8],[-7.6,-6.4],[2.4,3.6],[9.6,10.8]];
  const g=shell('banya',{floor:boards,floorTile:1,ceil:pine,ceilTile:1,dado:pine,upper:pine,pier:pine,trim:C('#7a4a2a'),end:pine,door:C('#7a4a2a'),
    winsBySide:{pos:WIN,neg:WIN},
    lamps:[lamp(-10,2.2,0,[1.4,.75,.35],6),lamp(-4,2.2,0,[1.3,.7,.35],6),lamp(-7,.6,0,[1.4,.4,.1],3),lamp(4,2.6,0,[.5,.85,1.3],6),lamp(10,2.6,0,[.5,.85,1.3],6),lamp(7,1.0,-2,[.4,.8,1.2],4)],ambK:.75});
  const DEC=[], dn=(...a)=>{ const n=N(...a); DEC.push(n); return n; }, D=dn(g), hide=qHide;
  const sphere=(n,m,rc,x,y,z,rad,seg=6,sy=1)=>qL(n,m,rc,[[-rad*sy,.001,.001],[-rad*.7*sy,rad*.71,rad*.71],[0,rad,rad],[rad*.7*sy,rad*.71,rad*.71],[rad*sy,.001,.001]],seg,x,y,z);
  /* the ice half keeps its old wall panels as collision; the ceiling over it is ice slabs */
  for(const s of [-1,1]){ const sg=WG.banya.side[s]; for(let x=.5;x<WL/2;x+=3.4) hide(B(sg,C('#9ad0ec'),x+1.7,0,s*(WZ0-.05),3.3,WH,.06)); }
  for(let x=.5;x<WL/2-.01;x+=13.5/12) for(let k=0;k<6;k++) qB(D,mA,qF(r.frost,r.frost,r.frost,r.iceTop,r.iceTop),x+13.5/24,WH-.07+((k+Math.round(x*3))%2)*.02,-WZ+(k+.5)*WZ/3,13.5/12-.01,.07,WZ/3-.01);
  /* partition with a door in the middle (the old log planes stay as its collision) */
  const pt=M(pine.tex,{double:true}); for(const s of [-1,1]) hide(K(mk(wplane(WZ-.9,WH),pt,g,0,WH/2,s*(WZ+.9)/2,0,Math.PI/2,0))); hide(mk(wplane(1.8,1.0),pt,g,0,2.9,0,0,Math.PI/2,0));
  /* the sauna is a log room: half-round logs on every wall, chinked with moss, cut round the windows and doors */
  const RR=WH/28, rows=[...Array(14)].map((_,j)=>RR+j*2*RR);
  const logWall=(n,x0,x1,gap,seed)=>rows.forEach((y,j)=>{ const rc=j%2?r.log2:r.log, spans=[]; let a=x0; for(const [g0,g1,y0,y1] of gap) if(y>y0-RR*.5&&y<y1+RR*.5){ if(g0>a) spans.push([a,g0]); a=Math.max(a,g1); } if(x1>a) spans.push([a,x1]);
    for(const [p,q] of spans) mk(qLogGeo(p,q,y,RR*1.05,rc,6,2.2),mA,n); });
  for(const s of [-1,1]){ const n=qWall('banya',s); DEC.push(n); const lx=X=>s<0?X:-X, gaps=WIN.filter(w=>w[1]<0).map(([a,b])=>s<0?[a-.08,b+.08,.95,2.65]:[-b-.08,-a+.08,.95,2.65]);
    logWall(n,s<0?-WL/2:0,s<0?0:WL/2,gaps.sort((p,q)=>p[0]-q[0]),s);
    for(const [a,b] of WIN.filter(w=>w[1]<0)){ const c=(a+b)/2,L=b-a; qB(n,mA,r.wood,lx(c),.92,.0,L+.36,.07,.2); qB(n,mA,qF(r.wood,r.nal,r.nal),lx(c),2.62,.06,L+.5,.42,.05);
      for(const e of [-1,1]){ qB(n,mA,qF(r.wood),lx(c)+e*(L/2+.1),.98,.05,.14,1.64,.06); qB(n,M(A.tex,{color:0x4a7ac8}),r.wood,lx(c)+e*(L/2+.1),.98,.085,.08,1.64,.02); }
      qB(n,mA,r.wood,lx(c),.86,.12,L+.2,.06,.04); for(const e of [-1,1]) qB(n,mA,r.wood,lx(c)+e*(L/2+.05),.64,.1,.05,.24,.05); } }
  { const n=dn(g,-.001,0,0,0,-Math.PI/2,0); logWall(n,-WZ,WZ,[[-.95,.95,0,2.4]]); qB(n,mA,r.wood,0,2.36,.12,2.1,.12,.12); for(const e of [-1,1]) qB(n,mA,r.wood,e*.98,0,.12,.12,2.4,.12); qB(n,mA,qF(r.wood,r.signB,r.signB),0,2.6,.2,1.1,.5,.04); }
  { const n=dn(g,-WL/2+.001,0,0,0,Math.PI/2,0); logWall(n,-WZ,WZ,[[-.66,.66,0,2.34]]); qB(n,mA,r.wood,0,2.3,.1,1.5,.12,.12); for(const e of [-1,1]) qB(n,mA,r.wood,e*.68,0,.1,.12,2.32,.12);
    const th=dn(n,1.4,1.75,.03); qC(th,mA,[r.wood,r.thermo,r.thermo],0,0,.0,.16,.16,.04,16,Math.PI/2,0,0); for(let k=0;k<2;k++) qB(n,mA,r.wood,-1.5+k*.25,1.3,.03,.16,.05,.18);
    qB(n,mA,r.wood,-1.6,1.36,.08,.5,.03,.16); qL(n,mA,r.jar,[[0,.04,.04],[.02,.02,.02],[.06,.004,.004],[.1,.02,.02],[.12,.04,.04]],8,-1.6,1.39,.1); }
  /* tiered benches: slatted seats on bearers, plank risers (the old solid boxes stay as collision) */
  for(let t=0;t<3;t++) for(const s of [-1,1]){ hide(B(g,C('#c89a62'),-6.5,.4+t*.45,s*(1.6+t*.5),12,.1,.5)); hide(Wz(B(g,C('#c89a62'),-6.5,0,s*(1.38+t*.5),12,.4+t*.45,.06)));
    const y=.4+t*.45, zc=s*(1.6+t*.5); for(let i=0;i<5;i++) qBar(D,mA,(i+t)%2?r.slat:r.plank,-6.5,y+.062,zc+(i-2)*.098,12,.038,.088);
    for(let x=-12.3;x<-.6;x+=1.17) qB(D,mA,r.plank,x,y,zc,.05,.062,.48);
    const y0=t?.4+(t-1)*.45+.1:0; for(let p=0;p<3;p++){ const ph=(y-y0)/3; qBar(D,mA,p%2?r.plank:r.slat,-6.5,y0+p*ph+.008,s*(1.38+t*.5),12,ph-.016,.05); }
    for(const x of [-12.52,-.48]) qB(D,mA,r.plank,x,0,s*(1.38+t*.5+.25),.04,y+.1,.5); }
  /* duckboards down the aisle */
  for(const [x0,x1] of [[-13.4,-8.9],[-6.1,-2.1]]){ for(let k=0;k<11;k++) qBar(D,mA,k%2?r.slat:r.plank,(x0+x1)/2,.022,-1.2+k*.24,x1-x0,.026,.16); for(let x=x0+.2;x<x1;x+=.9) qBar(D,mA,r.plank,x,0,0,2.5,.022,.07,'z'); }
  /* the stove: riveted iron, a glowing firebox, a cage of stones, the flue */
  hide(B(g,C('#2a2a2e'),-1.4,0,0,.9,.9,.9)); for(let k=0;k<9;k++) hide(mk(lathe([[0,.06,.06],[.06,.09,.08],[.12,.04,.04]],6),C('#6a6a6a'),g,-1.6+(k%3)*.2,.9,-.2+(k/3|0)*.2));
  { const n=dn(g,-1.4,0,0); qB(n,mA,[r.stove,r.sdoor,r.stove,r.iron,r.stove,r.stove],0,.06,0,.9,.84,.9); qB(n,mA,r.iron,0,0,0,.96,.06,.96); for(const [dx,dz] of [[-.4,-.4],[.4,-.4],[-.4,.4],[.4,.4]]) qB(n,mA,r.iron,dx,0,dz,.08,.08,.08);
    for(let k=0;k<3;k++) B(n,U(k?'#ff7a20':'#ffc060'),-.452,.3+k*.1,0,.005,.035,.36);
    for(const [dx,dz] of [[-.42,-.42],[.42,-.42],[-.42,.42],[.42,.42]]) qB(n,mA,r.iron,dx,.9,dz,.03,.32,.03); for(const y of [1.05,1.2]) for(const s of [-1,1]){ qB(n,mA,r.iron,0,y,s*.42,.87,.02,.02); qB(n,mA,r.iron,s*.42,y,0,.02,.02,.87); }
    const q=rng(501); for(let k=0;k<26;k++){ const x=(q()-.5)*.72, z=(q()-.5)*.72, rad=.06+q()*.04; sphere(n,mA,r.stone,x,.93+rad*.7+(k>15?.08:0),z,rad,6,.75); }
    qC(n,mA,r.iron,.25,2.3,.25,.1,.1,2.2,10); qC(n,mA,r.iron,.25,1.45,.25,.14,.14,.08,10); qC(n,mA,r.iron,.25,3.37,.25,.2,.2,.06,10); }
  /* buckets with brass hoops, a ladle, birch veniks and felt hats on pegs, towels on the benches */
  for(let k=0;k<3;k++){ K(mk(qUV(cyl(.16,.13,.28,12),[r.bucket,r.water,r.iron]),mA,g,-3+k*.7,.14,1.6)); K(mk(qUV(cyl(.17,.17,.03,12,{open:true}),r.iron),mA,g,-3+k*.7,.26,1.6)); }
  { const n=dn(g,-3,.28,1.6); qBowl(n,mA,r.bucket,r.wood,[[0,.02],[.03,.055],[.06,.065]],.006,8,0,0,-.04); qB(n,mA,r.wood,0,.04,-.2,.025,.025,.3,0,-.5,0); }
  for(let k=0;k<4;k++){ const x=-11+k*1.3; hide(B(WG.banya.side[-1],C('#c8a040'),x,1.8,-2.82,.5,.6,.06)); hide(B(WG.banya.side[-1],C('#4a7a32'),x,1.5,-2.8,.4,.32,.08)); }
  { const n=dn(WG.banya.side[-1]); qB(n,mA,r.wood,-9,2.3,-WZ+.27,4.6,.12,.04); for(let k=0;k<8;k++){ const x=-11.2+k*.62; qC(n,mA,r.wood,x,2.33,-WZ+.32,.022,.022,.1,6,Math.PI/2);
      if(k%2===0){ for(const a of [-.5,.5]) qPl(n,mC,r.venikC,x,2.04,-WZ+.4,.36,.56,0,a,0); qL(n,mA,r.venik,[[0,.02,.02],[.08,.07,.03],[.2,.06,.03],[.28,.03,.02]],6,x,1.95,-WZ+.4); }
      else qL(n,mA,r.felt,[[0,.15,.15],[.02,.15,.15],[.025,.1,.1],[.16,.09,.09],[.22,.05,.05],[.24,.02,.02]],10,x,2.12,-WZ+.42,-.25,0,0); } }
  for(const [x,s,t] of [[-11.6,1,2],[-8.4,-1,1],[-3.3,1,1],[-5.8,-1,2]]){ const y=.4+t*.45+.1, z=s*(1.6+t*.5); qB(D,mA,qF(r.towel),x,y,z,.42,.06,.32); qB(D,mA,qF(r.towel),x+.04,y+.06,z,.38,.05,.3); }
  qL(D,mA,r.felt,[[0,.15,.15],[.02,.15,.15],[.025,.1,.1],[.16,.09,.09],[.22,.05,.05],[.24,.02,.02]],10,-10.2,.5,1.6);
  /* steam off the stones: a few soft dithered wisps that turn to face you, rise, swell and thin out */
  const wisp=[M(qPuff(48,48,57,.4),{cut:true,double:true,unlit:true,color:[.76,.74,.7]}),M(qPuff(48,48,58,.3),{cut:true,double:true,unlit:true,color:[.76,.74,.7]})];
  for(let k=0;k<7;k++){ const n=mk(plane(.6,.7),wisp[k%2],g,-1.4,1.3,0); n.noCollide=1; const ph=k*.83, dx=(k%3-1)*.18, dz=((k*5)%3-1)*.18;
    WG.banya.anim.push(t=>{ const f=(t*.11+k/7)%1, x=-1.4+dx-f*.9+Math.sin(t*.5+ph)*.12, z=dz+Math.sin(t*.37+ph)*.15; n.p=[x,1.25+f*1.9,z]; const s=f<.75?.35+f*.9:(1-f)/.25*1.0; n.s=[s,s,s]; n.vis=s>.05; n.r=[0,Math.atan2(PL.x-x,PL.z-z),0]; }); }
  /* the ice bar: glowing ice blocks, a frosted slab, a back bar of bottles, a frozen sturgeon, the samovar */
  const iceBar=U('#bfefff'); hide(B(g,iceBar,7,0,-1.9,6,1.1,.8)); hide(B(g,iceBar,7,1.1,-1.9,6.2,.08,.9));
  for(let k=0;k<10;k++) hide(mk(cyl(.045,.05,.3,6),C('#e8f4ff'),g,4.4+k*.55,1.33,-2.65));
  { const n=dn(g); for(let k=0;k<10;k++) for(let j=0;j<2;j++) qB(n,mU,k===6&&j===1?qF(r.iceGlow,r.fishIce,r.iceGlow):qF(r.iceGlow),4.3+k*.6,j*.55,-1.9+((k+j)%2)*.012,.6,.55,.8);
    qBar(n,mA,r.iceTop,7,1.1,-1.9,6.2,.08,.9); qBar(n,mA,r.birch,7,.18,-1.42,6,.07,.07);
    for(let k=0;k<4;k++) qB(n,mA,r.birch,4.4+k*1.75,0,-1.42,.05,.18,.05);
    for(let k=0;k<3;k++){ qBar(n,mA,r.iceTop,7,1.25+k*.42,-2.72,5.6,.04,.32); const q=rng(510+k); for(let b=0;b<9;b++){ const x=4.5+b*.62+q()*.1, c=[0xffffff,0xf0c080,0xa8e0a0,0xf09090,0xffffff][(b+k)%5];
      qL(n,M(A.tex,{color:c}),r.bottle,[[0,.04,.04],[.15,.042,.042],[.19,.025,.025],[.25,.016,.016],[.28,.017,.017]],8,x,1.29+k*.42,-2.72); } }
    for(let k=0;k<4;k++) qL(n,mA,r.bottle,[[0,.04,.04],[.15,.042,.042],[.19,.025,.025],[.25,.016,.016],[.28,.017,.017]],8,4.6+k*1.6,1.18,-2.1);
    for(let k=0;k<8;k++) qC(n,mA,[r.frost,r.iceTop,r.iceTop],4.9+k*.6+(k%2)*.1,1.205,-1.75,.025,.02,.05,8);
    qC(n,mA,[r.caviar,r.caviar,r.caviar],6.2,1.155,-1.95,.07,.07,.03,14); qB(n,mA,r.wood,7.4,1.14,-2.0,.36,.025,.22); qL(n,mA,r.bread,[[0,.08,.06],[.06,.09,.07],[.1,.05,.04],[.11,.001,.001]],8,7.4,1.165,-2.0,0,.3,0);
    qL(n,mA,r.jar,[[0,.06,.06],[.16,.06,.06],[.18,.045,.045],[.2,.05,.05]],10,8.2,1.14,-2.05); qC(n,mA,[r.wood,r.wood,r.wood],5.3,1.15,-2.0,.16,.16,.02,14); for(let k=0;k<6;k++) qB(n,tint(0xfff0e0),r.fur,5.22+(k%3)*.06,1.16,-2.06+(k>2?.1:0),.05,.02,.08,k*.4); for(let k=0;k<5;k++) qL(n,mA,r.jar,[[0,.012,.012],[.05,.014,.014],[.06,.006,.006]],6,5.42,1.16,-2.02+k*.03,0,0,Math.PI/2);
    qL(n,mA,r.frost,[[0,.06,.06],[.12,.07,.07],[.2,.03,.03],[.28,.025,.025],[.3,.03,.03]],10,8.9,1.14,-1.9); for(let k=0;k<3;k++) qC(n,mA,[r.frost,r.iceTop,r.iceTop],9.05+k*.07,1.205,-1.72,.025,.02,.05,8);
    qB(n,mA,r.iceTop,6.9,1.14,-1.8,.5,.02,.3); for(let k=0;k<4;k++) qL(n,mA,r.bottle,[[0,.04,.04],[.15,.042,.042],[.19,.025,.025],[.25,.016,.016],[.28,.017,.017]],8,6.72+k*.12,1.16,-1.85,0,0,0);
    const sv=dn(g,9.7,1.14,-2.0); qL(sv,mA,r.samovar,[[0,.08,.08],[.04,.05,.05],[.08,.06,.06],[.12,.14,.14],[.3,.15,.15],[.38,.1,.1],[.42,.05,.05],[.46,.06,.06],[.48,.03,.03]],12,0,0,0); qB(sv,mA,r.samovar,.16,.12,0,.08,.025,.025); qL(sv,mA,r.porc||r.samovar,[[0,.05,.05],[.05,.06,.06],[.1,.035,.035]],8,0,.48,0); for(const s of [-1,1]) qB(sv,mA,r.iron,s*.17,.26,0,.03,.1,.02); }
  /* bar stools: fur seats on carved ice */
  for(let k=0;k<5;k++){ const x=4.6+k*1.2; Wz(mk(qUV(cyl(.2,.2,.08,12),[r.fur,r.fur,r.furG]),mA,g,x,.72,-.9)); Wz(mk(qUV(cyl(.12,.14,.72,10),r.frost),mA,g,x,.36,-.9)); const n=dn(g,x,0,-.9); qT(n,mA,r.iceTop,.13,.025,4,12,0,.25,0,Math.PI/2); qT(n,mA,r.iceTop,.15,.03,4,12,0,.03,0,Math.PI/2); qL(n,mA,r.fur,[[0,.2,.2],[.03,.21,.21],[.06,.16,.16],[.07,.001,.001]],12,0,.76,0); }
  /* fur sofas on birch-log frames, ice tables with a bottle and glasses, a candle frozen in ice */
  for(const x of [5,10]){ hide(B(g,C('#e8e0d4'),x,0,1.6,2.2,.42,1.0)); hide(B(g,C('#e8e0d4'),x,.42,2.1,2.2,.6,.2)); Wz(mk(qUV(cyl(.4,.4,.05,16),[r.frost,r.iceTop,r.frost]),mA,g,x,.5,.6));
    const n=dn(g,x,0,1.6); qBar(n,mA,r.birch,0,.05,-.45,2.2,.12,.12); qBar(n,mA,r.birch,0,.05,.45,2.2,.12,.12); for(const e of [-1,1]){ qB(n,mA,r.birch,e*1.05,0,0,.14,.62,1.0); qB(n,mA,r.logEnd,e*1.05,.62,0,.16,.04,1.02); }
    qB(n,mA,qF(r.fur),0,.17,-.02,1.96,.25,.9); qB(n,mA,qF(r.fur),0,.42,.43,1.96,.58,.2); qB(n,mA,qF(r.furG),.2,.5,.56,1.3,.55,.06,0,-.08,0);
    for(const e of [-1,1]) qB(n,mA,qF(r.furG),e*.72,.42,.28,.36,.3,.12,e*.2,-.3,0);
    const tb=dn(g,x,0,.6); qL(tb,mA,r.frost,[[0,.2,.2],[.05,.16,.16],[.12,.1,.1],[.4,.09,.09],[.475,.12,.12]],10,0,0,0); qL(tb,mA,r.bottle,[[0,.04,.04],[.15,.042,.042],[.19,.025,.025],[.25,.016,.016],[.28,.017,.017]],8,-.12,.525,.05);
    for(const [dx,dz] of [[.12,-.1],[.18,.08]]) qC(tb,mA,[r.frost,r.iceTop,r.iceTop],dx,.55,dz,.025,.02,.05,8); qC(tb,mA,[r.iceGlow,r.iceTop,r.iceTop],-.02,.56,-.18,.05,.05,.07,8); B(tb,U('#ffd060'),-.02,.6,-.18,.012,.03,.012); }
  /* the ice chandelier and two crystal pendants (the lamps) */
  { const n=dn(g,7.5,2.95,0); qT(n,mA,r.iceTop,.62,.04,4,24,0,0,0,Math.PI/2); qT(n,mA,r.iceTop,.32,.03,4,16,0,-.1,0,Math.PI/2); sphere(n,U('#e8fcff'),[0,0,1,1],0,-.12,0,.12,8);
    for(let k=0;k<20;k++){ const a=k/20*Math.PI*2, rad=k%2?.62:.32, L=.25+(k%3)*.14; qL(n,mU,r.iceGlow,[[-L,.002,.002],[0,.03,.03]],5,Math.cos(a)*rad,-.02,Math.sin(a)*rad); }
    for(let k=0;k<4;k++) qB(n,mA,r.iceTop,Math.cos(k*1.57)*.3,.02,Math.sin(k*1.57)*.3,.02,WH-2.95,.02); }
  for(const x of [4,10]){ const n=dn(g,x,2.62,0); qL(n,mU,r.iceGlow,[[0,.002,.002],[.12,.1,.1],[.22,.08,.08],[.3,.002,.002]],8,0,0,0); qB(n,mA,r.iceTop,0,.3,0,.015,WH-2.92,.015); }
  qB(D,mA,qF(r.fur),10,.005,-.2,3,.012,2); qB(D,mA,qF(r.furG),10,.006,-.2,2.6,.012,1.6);
  /* ice cladding: block walls with a little relief, frosted floor slabs on the ice side */
  const blocks=(n,x0,x1,gap,seed)=>{ const q=rng(seed); for(let j=0;j*.4<WH-.01;j++){ const y=j*.4, h=Math.min(.4,WH-y); for(let x=x0-(j%2)*.3;x<x1-.01;x+=.6){ const a=Math.max(x,x0), b=Math.min(x+.6,x1); if(b-a<.05) continue; if(gap&&y<gap[2]&&b>gap[0]&&a<gap[1]) continue;
      qB(n,mA,qF(r.frost,r.ice,r.ice),(a+b)/2,y,.03+q()*.025,b-a-.008,h-.008,.06+q()*.04); } } };
  for(const s of [-1,1]){ const n=qWall('banya',s); DEC.push(n); blocks(n,s<0?0:-WL/2,s<0?WL/2:0,null,520+s); }
  { const n=dn(g,.001,0,0,0,Math.PI/2,0); blocks(n,-WZ,WZ,[-.95,.95,2.4],530); qB(n,mU,qF(r.iceGlow,r.signI,r.signI),0,2.5,.12,1.4,.6,.06); }
  { const n=dn(g,WL/2-.001,0,0,0,-Math.PI/2,0); blocks(n,-WZ,WZ,[-.66,.66,2.34],540); }
  for(let x=.6;x<WL/2-.01;x+=.8) for(let k=0;k<7;k++) qB(D,mA,qF(r.frost,r.frost,r.frost,r.iceTop),x+.4,0,-WZ+(k+.5)*WZ*2/7,.79,.006,WZ*2/7-.01);
  qDoor(g,mA,r.plank,r.iron,-1); qDoor(g,mA,r.frost,r.iron,1); DEC.forEach(qNC); WG.banya.atl={mA,mU,r};
  WG.banya.spots={volkov:{x:9.2,z:-.6,ry:-Math.PI/2},volkov_c:{x:5.5,z:.6,ry:-Math.PI/2},volkov_c2:{x:-4.5,z:.0,ry:Math.PI/2,pose:'sit'}};
};

/* ---------- 07 · Golden Crane dim sum ---------- */
CAR_BUILD.dimsum=function dimsum(){
  const T0=performance.now(); const A=qAtlasDimsum(); console.warn("atlas ms",performance.now()-T0); const r=A.r, mA=M(A.tex), mU=M(A.tex,{unlit:true}), gold=C('#d4ad5a'), dark=C('#1a1414'), lacR=C('#8a1414'), tint=c=>M(A.tex,{color:c});
  /* the room: carpet with gold medallions, red lacquer walls (calm: the framed screens carry the painting), panelled rosewood dado, dark coffers */
  const carpet=M(P2(64,64,(g,w,h)=>{ R(g,'#6a0e12',0,0,w,h); radial(g,w/2,h/2,44,[[0,'#841418'],[1,'#620c10']]);
    for(const [x,y] of [[0,0],[w,0],[0,h],[w,h],[w/2,h/2]]){ ell(g,x,y,11,11,'#c89a3a'); ell(g,x,y,9.6,9.6,'#5a0a0e'); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; ell(g,x+Math.cos(a)*6,y+Math.sin(a)*6,2.2,2.2,'#c89a3a'); ell(g,x+Math.cos(a)*6,y+Math.sin(a)*6,1,1,'#8a1a1e'); } ell(g,x,y,3,3,'#c89a3a'); ell(g,x,y,1.6,1.6,'#2a5a6a'); }
    for(const [x,y] of [[w/2,0],[0,h/2],[w/2,h],[w,h/2]]){ for(let k=0;k<4;k++){ const a=k/4*Math.PI*2+Math.PI/4; ell(g,x+Math.cos(a)*3,y+Math.sin(a)*3,1.8,1.8,'#b88a32'); } ell(g,x,y,1.2,1.2,'#e8c860'); }
    for(const [x,y] of [[w/4,h/4],[w*.75,h/4],[w/4,h*.75],[w*.75,h*.75]]) qCloud(g,x-2,y,.5,rgba('#c89a3a',.55),.7);
    const q=rng(62); for(let i=0;i<900;i++) R(g,rgba(q()<.5?'#000000':'#ff8a8a',.07),q()*w,q()*h,.5,.5); },4,62));
  const lacquer=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b22222'],[.5,'#a41c1c'],[1,'#981818']]); const q=rng(61);
    for(let i=0;i<26;i++){ const x=q()*w; hfill(g,x,0,2+q()*4,h,[[0,rgba('#ffffff',0)],[.5,rgba(q()<.5?'#ffffff':'#000000',.04)],[1,rgba('#ffffff',0)]]); }
    for(const [cx,cy] of [[16,16],[48,48],[48,16],[16,48]]){ const big=(cx===cy); g.strokeStyle=rgba(big?'#5a0606':'#d8a040',big?.28:.16); g.lineWidth=1.1;
      if(big){ g.beginPath(); g.arc(cx,cy,9,0,Math.PI*2); g.stroke(); g.beginPath(); g.arc(cx,cy,5.5,0,Math.PI*2); g.stroke(); for(let k=0;k<4;k++){ const a=k*Math.PI/2; g.beginPath(); g.moveTo(cx+Math.cos(a)*5.5,cy+Math.sin(a)*5.5); g.lineTo(cx+Math.cos(a)*9,cy+Math.sin(a)*9); g.stroke(); } ell(g,cx,cy,2,2,rgba('#5a0606',.28)); }
      else qCloud(g,cx-2,cy,.9,rgba('#d8a040',.16),.8); }
    g.fillStyle=grad(g,0,0,0,h,[[0,rgba('#ffffff',.05)],[1,rgba('#000000',.06)]]); g.fillRect(0,0,w,h); },3,61));
  const upperT=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#7a1010'],[1,'#8e1616']]); const q=rng(63); for(let i=0;i<20;i++) R(g,rgba('#000000',.05),q()*w,0,1+q()*3,h); },3,63));
  const dadoT=M(P2(64,64,(g,w,h)=>{ qWood(g,0,0,w,h,'#3a1a12','#22100a',64,{vert:true}); qBevel(g,7,9,50,40,'#4a2218',.35,1.2); qInset(g,11,13,42,32,'#34160e',.35,1);
    ell(g,w/2,29,7,5,'#3e1c12'); g.strokeStyle='#c8a040'; g.lineWidth=.8; g.beginPath(); g.ellipse(w/2,29,6,4.2,0,0,Math.PI*2); g.stroke(); qCloud(g,w/2-2.5,29,.5,'#c8a040',.6);
    qAO(g,0,0,w,h-8,.25,3); R(g,'#160806',0,h-8,w,8); R(g,'#c8a040',0,h-8.5,w,.7); },3,64));
  const ceilT=M(P2(64,64,(g,w,h)=>{ radial(g,w/2,h/2,46,[[0,'#6a1414'],[1,'#3e0a0a']]); g.strokeStyle=rgba('#d4ad5a',.45); g.lineWidth=.8; g.beginPath(); g.arc(w/2,h/2,18,0,Math.PI*2); g.stroke(); g.beginPath(); g.arc(w/2,h/2,13,0,Math.PI*2); g.stroke();
    for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; qCloud(g,w/2+Math.cos(a)*15.5-1,h/2+Math.sin(a)*15.5,.3,rgba('#d4ad5a',.5),.5); } ell(g,w/2,h/2,5,5,rgba('#d4ad5a',.5)); ell(g,w/2,h/2,3,3,'#4a0e0e'); },3,65));
  const wins=winsEvery(4,1.8,-12,6);
  const g=shell('dimsum',{floor:carpet,floorTile:1.2,ceil:ceilT,ceilTile:1.2,dado:dadoT,upper:upperT,pier:lacquer,trim:gold,end:lacquer,door:dark,
    wins,lamps:[lamp(-10,2.4,0,[1.4,.55,.35],6),lamp(-4,2.4,0,[1.4,.55,.35],6),lamp(2,2.4,0,[1.4,.55,.35],6),lamp(10,2.6,0,[.9,.95,1.0],6),lamp(11,1.0,-2,[1.5,.5,.1],3.5),lamp(-12.6,1.6,1.8,[1.2,.5,.3],3)],ambK:.8});
  for(const s of [-1,1]) qBar(WG.dimsum.side[s],gold,0,0,1.0,s*(WZ-.05),WL,.06,.09); /* the shell's gold dado rail, cut short so the baker keeps it light */
  WG.dimsum.lacq=lacquer; WG.dimsum.atl={mA,mU,r};
  const DEC=[], dn=(...a)=>{ const n=N(...a); DEC.push(n); return n; }; const D=dn(g); /* everything below that you walk past rather than into */
  const vbar=(n,m,rc,x,y0,y1,z,w,d)=>mk(qUV(box(y1-y0,w,d),rc),m,n,x,(y0+y1)/2,z,0,0,Math.PI/2);
  const sphere=(n,m,rc,x,y,z,rad,seg=6)=>qL(n,m,rc,[[-rad,.001,.001],[-rad*.7,rad*.71,rad*.71],[0,rad,rad],[rad*.7,rad*.71,rad*.71],[rad,.001,.001]],seg,x,y,z);
  /* round tables: embroidered cloth over a pleated skirt, a smoked-glass lazy susan, steamer baskets, five place settings, carved rosewood chairs */
  const steamer=(n,x,y,z,rad,levels,open)=>{ for(let k=0;k<levels;k++) qC(n,mA,[r.steamS,r.steamT,r.steamT],x,y+.035+k*.068,z,rad,rad,.065,10);
    const top=y+levels*.068; if(open){ for(let k=0;k<3;k++){ const a=k*2.1+.4; qL(n,mA,r.dump,[[0,.032,.032],[.018,.036,.036],[.034,.024,.024],[.046,.006,.006]],6,x+Math.cos(a)*rad*.45,top-.004,z+Math.sin(a)*rad*.45); } }
    else { qC(n,mA,[r.steamS,r.steamT,r.steamT],x,top+.012,z,rad*.96,rad*1.02,.024,10); qL(n,mA,r.steamS,[[0,.02,.02],[.02,.012,.012]],6,x,top+.024,z); } };
  for(const x of [-11,-7,-3,1,5]) for(const s of [-1,1]){ const t=K(N(g,x,0,s*(WZ-1.5)));
    mk(qUV(cyl(.85,.85,.06,20),[r.skirt,r.cloth,r.cloth]),mA,t,0,.74,0); mk(qUV(cyl(.86,.8,.3,20,{open:true}),r.skirt),mA,t,0,.58,0);
    const d=dn(t); qC(d,mA,[r.frame,r.glass,r.glass],0,.785,0,.36,.36,.03,20); qT(d,mA,r.frame,.36,.016,3,20,0,.8,0,Math.PI/2); qC(d,mA,r.frame,0,.772,0,.08,.1,.016,10);
    steamer(d,.22,.8,0,.12,2,false); steamer(d,-.11,.8,.19,.12,1,true); steamer(d,-.11,.8,-.19,.11,1,false);
    for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+.3, ca=Math.cos(a), sa=Math.sin(a), px=ca*.6, pz=sa*.6, tx=-sa, tz=ca, ry=Math.atan2(ca,sa);
      qC(d,mA,[r.porc,r.plate,r.plate],px,.776,pz,.1,.085,.014,10); qBowl(d,mA,r.porc,r.porc,[[0,.022],[.02,.045],[.045,.055]],.004,8,px-ca*.02,.783,pz-sa*.02);
      for(const o of [.13,.15]) B(d,lacR,px+tx*o-ca*.05,.778,pz+tz*o-sa*.05,.007,.007,.23,ry); B(d,gold,px+tx*.14+ca*.07,.778,pz+tz*.14+sa*.07,.04,.006,.025,ry);
      qC(d,mA,[r.porc,r.sauce,r.sauce],px-tx*.15+ca*.03,.785,pz-tz*.15+sa*.03,.032,.028,.03,8);
      if(k%2===0) qC(d,mA,[r.porc,r.sauce,r.sauce],px-tx*.12-ca*.12,.776,pz-tz*.12-sa*.12,.04,.035,.012,8); }
    { const a=.3+Math.PI/5, px=Math.cos(a)*.5, pz=Math.sin(a)*.5; qL(d,mA,r.porc,[[0,.05,.05],[.02,.07,.07],[.06,.078,.078],[.1,.06,.06],[.115,.035,.035],[.125,.04,.04]],10,px,.77,pz); sphere(d,mA,r.porc,px,.905,pz,.015,6);
      B(d,C('#f4f4ee'),px+.08,.82,pz,.08,.02,.025,0,0,.7); qT(d,C('#f4f4ee'),[0,0,1,1],.035,.008,4,10,px-.075,.86,pz,0,0,0); }
    for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+.3, cx=Math.cos(a)*1.15, cz=Math.sin(a)*1.15; qHB(t,cx,0,cz,.4,.45,.4); qHB(t,cx,.45,cz,.42,.06,.42);
      const c=dn(t,cx,0,cz,0,Math.atan2(cx,cz),0);
      for(const [dx,dz] of [[-.17,-.17],[.17,-.17],[-.17,.17],[.17,.17]]) qB(c,mA,r.rose,dx,0,dz,.04,.4,.04);
      for(const dz of [-.17,.17]) qB(c,mA,r.rose,0,.13,dz,.32,.025,.025); qB(c,mA,r.rose,0,.36,-.19,.36,.05,.02);
      qB(c,mA,r.rose,0,.4,0,.42,.045,.42); qB(c,mA,r.cush,0,.445,-.01,.37,.045,.36);
      for(const dx of [-.17,.17]) qB(c,mA,r.rose,dx,.4,.18,.04,.62,.04); qB(c,mA,r.rose,0,.98,.185,.48,.05,.06); qB(c,mA,qF(r.rose,r.splat,r.splat,r.rose,r.rose),0,.52,.185,.28,.42,.025); qB(c,mA,r.frame,0,.94,.185,.3,.03,.03); } }
  /* dim sum trolleys: steel frame, a heated cabinet, a tray of baskets, a menu card on the handle */
  for(const x of [-9,3]){ qHB(g,x,0,0,.9,.85,.6); const tr=dn(g,x,0,0);
    for(const [dx,dz] of [[-.42,-.27],[.42,-.27],[-.42,.27],[.42,.27]]){ qB(tr,mA,r.steel,dx,.06,dz,.03,.8,.03); qC(tr,dark,[0,0,1,1],dx,.045,dz,.045,.045,.03,10,Math.PI/2); }
    qB(tr,mA,r.steel,0,.25,0,.88,.025,.58); qB(tr,mA,qF(r.steel,r.cab,r.cab),0,.28,0,.7,.42,.48); qB(tr,mA,r.steel,0,.82,0,.92,.025,.62);
    for(const s of [-1,1]){ qB(tr,mA,r.steel,0,.845,s*.3,.92,.035,.012); qB(tr,mA,r.steel,s*.45,.845,0,.012,.035,.6); }
    for(const dz of [-.27,.27]) qB(tr,mA,r.steel,.46,.82,dz,.025,.2,.025); qB(tr,mA,r.steel,.46,1.0,0,.03,.03,.6); qB(tr,mU,r.menu,.48,.86,0,.008,.12,.24);
    for(let k=0;k<6;k++) steamer(tr,-.3+(k%3)*.25,.845,-.14+(k>2?.28:0),.11,1+(k%2),k===4); }
  /* red silk lanterns on the two ceiling beams, big palace lanterns over the aisle (the lamps) */
  const lantern=(n,x,y,z,s)=>{ qL(n,mU,r.lantern,[[0,.09*s,.09*s],[.05*s,.2*s,.2*s],[.14*s,.25*s,.25*s],[.28*s,.25*s,.25*s],[.37*s,.2*s,.2*s],[.42*s,.09*s,.09*s]],10,x,y,z);
    qC(n,mA,qF(r.frame),x,y+.01*s,z,.1*s,.1*s,.04*s,10); qC(n,mA,qF(r.frame),x,y+.415*s,z,.1*s,.1*s,.04*s,10); sphere(n,mA,r.frame,x,y-.04*s,z,.025*s,6); B(n,U('#c81c1c'),x,y-.24*s,z,.035*s,.18*s,.035*s); B(n,gold,x,y-.07*s,z,.05*s,.02*s,.05*s); };
  for(let k=0;k<9;k++){ if(k===3) continue; const x=-12+k*2.4; for(const z of [-(WZ-1.7),WZ-1.7]){ lantern(D,x,2.5,z,1); B(D,gold,x,2.92,z,.012,WH-.16-2.92,.012); } }
  for(const x of [-10,-4,2]){ const p=N(D,x,2.42,0); qL(p,mU,r.lantern,[[0,.14,.14],[.08,.3,.3],[.22,.36,.36],[.4,.36,.36],[.54,.3,.3],[.62,.14,.14]],12,0,0,0);
    for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; vbar(p,mA,r.frame,Math.cos(a)*.365,.06,.56,Math.sin(a)*.365,.02,.02); }
    for(const y of [.0,.6]){ qT(p,mA,r.frame,.15,.02,4,16,0,y,0,Math.PI/2); } for(let k=0;k<4;k++){ const a=k/4*Math.PI*2+.4; B(p,U('#c81c1c'),Math.cos(a)*.3,-.3,Math.sin(a)*.3,.03,.26,.03); sphere(p,mA,r.frame,Math.cos(a)*.3,-.03,Math.sin(a)*.3,.03,6); }
    B(p,gold,0,.62,0,.02,WH-.16-2.42-.62,.02); }
  /* coffered ceiling: two lacquer beams down the car, cross beams between the lanterns, gold edges and painted cartouches */
  const beamL=C('#8a1414'), XB=[]; for(let k=0;k<8;k++) XB.push(-10.8+k*2.4);
  for(const z of [-1.2,1.2]){ qBar(D,beamL,0,0,WH-.16,z,WL,.16,.16); for(const s of [-1,1]) qBar(D,gold,0,0,WH-.17,z+s*.075,WL,.02,.02); for(let x=-12;x<13;x+=2.4) if(Math.abs(x+4.8)>.4) qB(D,mA,qF(r.blackL,r.blackL,r.blackL,r.blackL,r.beam),x,WH-.172,z,.5,.012,.14); }
  for(const x of XB){ if(Math.abs(x+5)<.3) continue; qBar(D,beamL,0,x,WH-.14,0,WZ*2,.14,.14,'z'); for(const s of [-1,1]) qBar(D,gold,0,x+s*.065,WH-.15,0,WZ*2,.018,.018,'z'); for(const z of [-2.05,0,2.05]) qB(D,mA,qF(r.blackL,r.blackL,r.blackL,r.blackL,r.beam),x,WH-.152,z,.46,.012,.12,0,0,0).r=[0,Math.PI/2,0]; }
  /* the walls: panelled rosewood dado with real stiles, a gold fret frieze under a stepped cornice, black-lacquer screens in gold frames, lantern sconces, silk valances over the windows */
  const runs=qRuns(wins);
  for(const s of [-1,1]){ const n=qWall('dimsum',s); DEC.push(n); const lx=X=>s<0?X:-X;
    for(let X=-13;X<=13;X++){ if(X>7) break; qB(n,mA,r.rose,lx(X),.1,.012,.07,.8,.024); }
    for(const [a,b] of [[-WL/2,7.4]]){ const L=b-a; qBar(n,C('#2a120c'),0,lx((a+b)/2),.88,.03,L,.1,.05); qBar(n,C('#160806'),0,lx((a+b)/2),0,.02,L,.1,.04); qBar(n,gold,0,lx((a+b)/2),.1,.035,L,.012,.012); }
    for(let X=-13.5;X<13.6;X+=1){ qB(n,mA,qF(r.fret,r.fret,r.fret,r.fret,r.fret),lx(X),2.95,.012,1.0,.25,.024); }
    qBar(n,C('#5a0c0c'),0,0,3.2,.04,WL,.2,.08); qBar(n,gold,0,0,3.19,.08,WL,.03,.03); qBar(n,C('#4a0a0a'),0,0,3.32,.07,WL,.08,.06);
    for(const [a,b] of runs){ if(b>7.5||b-a<3) continue; const c=(a+b)/2; { const x0=a+.12,x1=b-.12; for(const y of [1.08,2.47]) qBar(n,mA,r.frame,lx((x0+x1)/2),y,.015,x1-x0,.035,.03); for(const x of [x0,x1]) vbar(n,mA,r.frame,lx(x),1.08,2.505,.015,.035,.03); }
      [c-1,c+1].forEach((X,i)=>{ const art=[r.art1,r.art2,r.art3][(Math.round(X)+s+30)%3]; qB(n,mA,qF(r.blackL,art,art),lx(X),1.25,.025,1.3,1.1,.03);
        qB(n,mA,r.frame,lx(X),2.33,.05,1.44,.07,.05); qB(n,mA,r.frame,lx(X),1.18,.05,1.44,.07,.05); for(const e of [-.685,.685]) vbar(n,mA,r.frame,lx(X)+e,1.21,2.36,.05,.07,.05); });
      const sc=N(n,lx(c),0,0); qB(sc,mA,qF(r.blackL),0,1.62,.02,.18,.34,.03); B(sc,gold,0,1.98,.1,.03,.03,.16); lantern(sc,0,1.68,.17,.55); }
    for(const [a,b] of wins){ const c=(a+b)/2,L=b-a; qB(n,mA,qF(r.rose,r.valance,r.valance,r.rose,r.rose),lx(c),2.55,.07,L+.4,.32,.05); B(n,gold,lx(c),2.86,.07,L+.44,.03,.07);
      for(const e of [-1,1]){ const tx=lx(c)+e*(L/2+.17); sphere(n,mA,r.frame,tx,2.5,.1,.03,6); B(n,U('#c81c1c'),tx,2.22,.1,.04,.26,.04); }
      qB(n,mA,qF(r.blackL),lx(c),.95,.06,L+.3,.05,.12); for(const e of [-1,1]){ const ex=lx(c)+e*(L/2-.12); qB(n,mA,r.frame,ex,2.36,.03,.22,.025,.025); vbar(n,mA,r.frame,ex+e*.1,2.14,2.37,.03,.025,.025); qB(n,mA,r.frame,ex,2.25,.03,.16,.02,.02,0,0,e*.8); } } }
  /* the entry wall: the Golden Crane mural, a live seafood tank below it, a family shrine by the door */
  { const n=dn(g); qPl(n,mA,r.mural,-13.94,1.95,-1.75,1.8,1.35,0,Math.PI/2,0); for(const y of [1.25,2.65]) B(n,gold,-13.94,y,-1.75,.05,.06,1.96); for(const z of [-2.68,-.82]) B(n,gold,-13.94,1.25,z,.05,1.46,.06);
    qB(g,mA,qF(r.blackL),-13.58,0,-2.2,.6,.42,1.1); qB(g,mU,qF(r.tank),-13.58,.42,-2.2,.54,.56,1.04); qB(n,mA,r.steel,-13.58,.98,-2.2,.58,.03,1.08);
    for(const dz of [-.5,.5]) vbar(n,mA,r.steel,-13.3,.42,1.0,-2.2+dz,.02,.02);
    qB(n,mA,qF(r.blackL),-13.84,1.2,1.75,.28,.05,1.0); qB(n,mA,[r.shrine,r.blackL,r.blackL,r.blackL,r.blackL,r.blackL],-13.96,1.25,1.75,.03,.5,.92); B(n,gold,-13.8,1.2,1.75,.3,.015,1.02);
    qC(n,mA,qF(r.plate),-13.8,1.26,1.45,.08,.07,.012,12); for(let k=0;k<5;k++) sphere(n,mA,r.orange,-13.8+(k%2)*.04-.02,1.29+(k>3?.05:0),1.45+((k%3)-1)*.045,.03,8);
    qC(n,mA,r.frame,-13.8,1.285,1.75,.06,.05,.07,10); for(let k=0;k<3;k++){ B(n,C('#6a3a1e'),-13.8,1.3,1.73+k*.02,.005,.18,.005,0,0,(k-1)*.12); B(n,U('#ff4020'),-13.8+(k-1)*.02,1.48,1.73+k*.02,.008,.012,.008); }
    for(const z of [1.38,2.12]){ qC(n,U('#c81c1c'),[0,0,1,1],-13.8,1.31,z,.022,.022,.12,8); sphere(n,U('#ffd060'),[0,0,1,1],-13.8,1.39,z,.018,6); } }
  /* the kitchen: steel counters, tiled walls, a wok line under the hood, roast ducks on the rail, the pass with heat lamps and menu boards */
  qHB(g,7.5,0,0,.12,1.0,WZ*2-2.4); qHB(g,7.5,1.0,0,.4,.05,WZ*2-2.4);
  { const n=dn(g), PZ=WZ-1.2; for(let k=0;k<4;k++){ const z=-PZ+PZ/4+k*PZ/2; qB(n,mA,[r.cab,r.blackL,r.steel,r.steel,r.steel,r.steel],7.5,0,z,.12,1.0,PZ/2-.01); qB(n,mA,r.steel,7.5,1.0,z,.4,.05,PZ/2-.005); }
    for(const z of [-1.72,1.72]) qB(n,mA,r.steel,7.5,1.05,z,.035,1.3,.035); qB(n,mA,r.steel,7.5,2.32,0,.06,.06,3.5);
    for(const z of [-1,0,1]){ qL(n,mA,r.steel,[[0,.09,.09],[.08,.05,.05],[.12,.02,.02]],10,7.5,2.14,z); sphere(n,U('#ff9a40'),[0,0,1,1],7.5,2.15,z,.035,6); B(n,gold,7.5,2.26,z,.006,.06,.006); }
    for(const z of [-.95,.95]) qB(n,mU,[r.blackL,r.menu,r.blackL,r.blackL,r.blackL,r.blackL],7.48,2.36,z,.03,.42,.9);
    for(let k=0;k<7;k++) qPl(n,C('#f4efe4'),[0,0,1,1],7.32,2.02,-1.2+k*.4,.07,.1,0,-Math.PI/2,(k%3-1)*.08); qB(n,mA,r.steel,7.35,2.08,0,.012,.012,3.0);
    steamer(n,7.5,1.05,-.9,.12,2,false); steamer(n,7.5,1.05,-.6,.11,1,true); qC(n,mA,[r.porc,r.plate,r.plate],7.5,1.06,.4,.13,.11,.015,14); for(let k=0;k<3;k++) sphere(n,tint(0xfff4e0),r.dump,7.5+Math.cos(k*2.1)*.05,1.09,.4+Math.sin(k*2.1)*.05,.035,8);
    qL(n,mA,r.frame,[[0,.05,.05],[.01,.05,.05],[.05,.035,.035],[.07,.008,.008]],10,7.5,1.05,1.2); }
  for(const s of [-1,1]){ qHB(g,10.5,0,s*2.2,5,.95,1.0); qHB(g,10.5,.95,s*2.2,5,.04,1.02); const n=dn(g,10.5,0,s*2.2,0,s>0?Math.PI:0,0);
    for(let k=0;k<5;k++){ qB(n,mA,[r.steel,r.steel,r.steel,r.steel,r.cab,r.steel],-2+k,0,0,.99,.9,1.0); qB(n,mA,r.steel,-2+k,.9,0,1.0,.05,1.04); } }
  { const n=dn(g); for(let X=7.6;X<13.9;X+=.8) for(const s of [-1,1]) for(let y=.96;y<2.5;y+=.8) qNC(qB(s<0?WG.dimsum.side[-1]:WG.dimsum.side[1],mA,qF(r.tile),X+.4,y,s*(WZ-.008),.8,.8,.012));
    for(const z0 of [-WZ,.6]) for(let k=0;k<3;k++) for(let y=0;y<2.5;y+=.8) qB(n,mA,qF(r.tile),WL/2-.008,y,z0+(k+.5)*(WZ-.6)/3,.012,.8,(WZ-.6)/3);
    for(let X=7.56;X<13.99;X+=.8) for(let k=0;k<8;k++) qB(n,mA,qF(r.qtile),X+.4,0,-WZ+(k+.5)*WZ/4,.8,.005,WZ/4);
    for(let k=0;k<4;k++){ const x=8.9+k*1.15; qB(n,mA,[r.steel,r.steel,r.steel,r.filter,r.steel,r.steel],x,2.3,-2.35,1.15,.5,1.1); }
    qB(n,mA,r.steel,10.6,2.25,-1.8,4.6,.08,.04);
    for(let k=0;k<4;k++){ const x=9+k*1.1; qBowl(n,mA,r.wok,r.wokIn,[[0,.05],[.04,.2],[.09,.3],[.12,.34]],.008,14,x,.99,-2.2); qB(n,mA,r.rose,x,1.08,-1.78,.04,.03,.22); qT(n,dark,[0,0,1,1],.17,.025,4,14,x,.975,-2.2,Math.PI/2);
      qC(n,mU,r.flame,x,1.02,-2.2,.15,.12,.08,12,0,0,0,{open:true}); }
    qB(n,mA,r.steel,10.6,2.62,2.3,4.6,.03,.03); for(let k=0;k<5;k++){ const x=8.6+k*.9; B(n,C('#9aa0a6'),x,2.32,2.3,.008,.3,.008); qL(n,mA,r.duck,[[0,.03,.03],[.08,.11,.09],[.25,.12,.1],[.36,.06,.05],[.42,.03,.03]],10,x,2.32,2.3,Math.PI,0,0);
      qB(n,tint(0xc8603a),r.duck,x,1.8,2.3,.035,.12,.035); if(k<4){ const xs=x+.45; B(n,C('#9aa0a6'),xs,2.42,2.3,.006,.2,.006); qB(n,tint(0xffa080),r.duck,xs,2.1,2.3,.07,.32,.04); } }
    qC(n,mA,[r.rose,r.chop,r.chop],11.8,1.04,2.2,.22,.22,.13,16); qB(n,mA,r.steel,11.8,1.105,2.12,.2,.006,.09,.4); qB(n,dark,[0,0,1,1],11.66,1.105,2.06,.1,.02,.025,.4);
    qB(n,mA,r.steel,9.6,1.0,2.2,.42,.02,.26); for(let k=0;k<6;k++) qB(n,mA,r.duck,9.44+k*.065,1.02,2.2,.05,.025,.18);
    for(let k=0;k<4;k++) qBowl(n,mA,r.porc,r.porc,[[0,.03],[.03,.06],[.06,.07]],.004,10,10.6,.99+k*.032,2.35);
    for(let k=0;k<3;k++){ qL(n,C('#2a1a10'),[0,0,1,1],[[0,.03,.03],[.12,.03,.03],[.16,.012,.012],[.2,.01,.01]],8,12.7+k*.08,.99,2.5); B(n,U('#f2e2b0'),12.7+k*.08,1.04,2.47,.04,.05,.005); }
    for(const z0 of [-1,1]) for(let k=0;k<3;k++){ const y=1.1+k*.42, z=z0*1.98; qB(n,mA,r.steel,13.78,y,z,.36,.025,1.5); for(const dz of [-.7,.7]) qB(n,mA,r.steel,13.95,y-.12,z+dz,.03,.12,.02);
      for(let j=0;j<4;j++){ const zz=z-.55+j*.36; if((j+k)%2) steamer(n,13.78,y+.025,zz,.12,2,false); else for(let b=0;b<3;b++) qBowl(n,mA,r.porc,r.porc,[[0,.03],[.03,.06],[.06,.07]],.004,10,13.78,y+.025+b*.032,zz); } }
    for(const x of [9,12]){ qB(n,mA,r.steel,x,WH-.08,0,1.3,.06,.18); B(n,U('#f4f8ff'),x,WH-.1,0,1.2,.03,.08); }
    qC(n,mU,qF(r.tank),WL/2-.1,1.6,0,.15,.15,.02,14,0,0,Math.PI/2); qT(n,mA,r.steel,.15,.02,4,14,WL/2-.1,1.6,0,0,Math.PI/2,0); qB(n,mA,r.steel,WL/2-.1,.0,0,.02,.3,1.0); }
  qDoor(g,mA,r.blackL,r.frame,-1); qDoor(g,mA,r.blackL,r.steel,1,false); DEC.forEach(qNC);
 
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
  const A=qAtlasAquarium(), r=A.r, mA=M(A.tex), mU=M(A.tex,{unlit:true}), mC=M(A.tex,{cut:true,double:true}), mG=M(A.tex,{cut:true,unlit:true}), tint=c=>M(A.tex,{color:c}), gold=C('#e8a050');
  /* the room: navy deco carpet with gold fans, navy lacquer panelling with a gold pinstripe, a starry navy ceiling */
  const carpet=M(P2(64,64,(g,w,h)=>{ R(g,'#121c3a',0,0,w,h); for(let y=0,row=0;y<h+8;y+=16,row++) for(let x=(row%2)*16;x<w+16;x+=32){ qFan(g,x,y+12,11,8,rgba('#c8a048',.55),.8); qFan(g,x,y+12,6,5,rgba('#3a5aa8',.8),.7); }
    const q=rng(521); for(let i=0;i<600;i++) R(g,rgba(q()<.5?'#000000':'#5a7ac8',.07),q()*w,q()*h,.6,.6); },3,521));
  const navy=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#1c2a4a'],[1,'#121c34']]); const q=rng(522); for(let i=0;i<16;i++){ const x=q()*w; hfill(g,x,0,2+q()*4,h,[[0,rgba('#ffffff',0)],[.5,rgba('#8ab0e8',.05)],[1,rgba('#ffffff',0)]]); }
    R(g,rgba('#d4ad5a',.55),0,0,.7,h); R(g,rgba('#d4ad5a',.55),0,0,w,.7); R(g,rgba('#000000',.3),.7,.7,1,h); },3,522));
  const ceil=M(P2(64,64,(g,w,h)=>{ radial(g,w/2,h/2,46,[[0,'#16224a'],[1,'#0a1228']]); const q=rng(523); for(let i=0;i<26;i++){ const x=q()*w,y=q()*h,s=.4+q()*.8; ell(g,x,y,s,s,'#fff0c0'); if(q()<.3){ R(g,rgba('#fff0c0',.5),x-2,y-.15,4,.3); R(g,rgba('#fff0c0',.5),x-.15,y-2,.3,4); } } },3,523));
  const WINS=winsEvery(7,3.5);
  const g=shell('aquarium',{floor:carpet,floorTile:1.2,ceil,ceilTile:1.5,dado:navy,upper:navy,pier:navy,trim:gold,end:navy,door:C('#14203a'),lo:.35,hi:3.1,
    wins:WINS,lamps:[lamp(-8,2.7,0,[1.0,.82,.6],6),lamp(0,1.6,0,[.3,.75,1.05],5),lamp(8,2.7,0,[1.0,.82,.6],6),lamp(-12,2.4,0,[1.1,.85,.5],4),lamp(12,2.4,0,[1.1,.85,.5],4),lamp(-6,1.4,0,[.2,.6,.9],3)],sunK:1.1,ambK:1.0});
  const DEC=[], dn=(...a)=>{ const n=N(...a); DEC.push(n); return n; }, D=dn(g), hide=qHide;
  const sphere=(n,m,rc,x,y,z,rad,seg=8,sy=1)=>qL(n,m,rc,[[-rad*sy,.001,.001],[-rad*.7*sy,rad*.71,rad*.71],[0,rad,rad],[rad*.7*sy,rad*.71,rad*.71],[rad*sy,.001,.001]],seg,x,y,z);
  const martini=(n,x,y,z)=>{ qL(n,mA,r.martini,[[0,.03,.03],[.005,.03,.03],[.01,.004,.004],[.08,.004,.004],[.13,.055,.055]],8,x,y,z); sphere(n,mA,r.olive,x,y+.1,z,.008,6); };
  /* walls: fluted pilasters with stepped gold capitals between the windows, fan sconces, slim mullions, a brass viewing rail, walnut below */
  const piers=[]; for(let k=0;k<6;k++) piers.push(-12.4+4.1333*(k+.5));
  for(const s of [-1,1]){ const n=qWall('aquarium',s); DEC.push(n); const lx=X=>s<0?X:-X;
    qBar(n,mA,r.walnut,0,0,.02,WL,.33,.03); qBar(n,mA,r.gold,0,.33,.04,WL,.025,.03); qBar(n,mA,r.black,0,3.1,.04,WL,.1,.08); qBar(n,mA,r.gold,0,3.09,.085,WL,.025,.02);
    for(const xp of piers){ const p=N(n,lx(xp),0,0); qB(p,mA,qF(r.black,r.pilaster),0,.35,.05,.44,2.6,.08); qB(p,mA,r.gold,0,.33,.06,.5,.06,.12); qB(p,mA,r.gold,0,2.92,.06,.5,.05,.12); qB(p,mA,r.black,0,2.97,.06,.46,.08,.1); qB(p,mA,r.gold,0,3.05,.07,.54,.03,.14);
      qB(p,mU,qF(r.gold,r.sconce),0,1.98,.1,.3,.22,.05); qB(p,mA,r.gold,0,1.95,.1,.34,.03,.07); for(let j=0;j<3;j++) qB(p,mA,r.gold,0,.7+j*.04,.095,.36,.012,.012); }
    for(const [a,b] of WINS){ for(const t of [1/3,2/3]){ const x=a+(b-a)*t; if(Math.abs(x)>13.9) continue; qB(n,mA,r.goldV,lx(x),.35,.03,.035,2.75,.03); } }
    qBar(n,mA,r.gold,0,.92,.13,WL,.04,.04); for(const xp of piers) qB(n,mA,r.goldV,lx(xp),.38,.11,.03,.56,.03); }
  /* column tanks: a painted water column seen through cut glass, rock, coral and kelp inside, fish swimming round, gold bands and a crown */
  for(const x of [-6,6]){ hide(mk(cyl(.9,.9,3.2,16,{open:true}),C('#2ab0d0'),g,x,1.75,0)); mk(qUV(cyl(1.0,1.0,.15,24),[r.gold,r.black,r.gold]),mA,g,x,.08,0); mk(qUV(cyl(1.0,1.0,.15,24),[r.gold,r.gold,r.black]),mA,g,x,3.33,0);
    const n=dn(g,x,0,0); mk(qFlip(qUV(cyl(.88,.88,3.1,20,{open:true}),r.tank)),mU,n,0,1.71,0); mk(qUV(cyl(.9,.9,3.17,20,{open:true}),r.glassC),mG,n,0,1.745,0);
    for(const y of [1.05,2.45]) qT(n,mA,r.gold,.915,.022,4,28,0,y,0,Math.PI/2); qC(n,mA,[r.black,r.black,r.black],0,.21,0,1.06,1.08,.12,24); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; qB(n,mA,r.goldV,Math.cos(a)*.98,3.0,Math.sin(a)*.98,.03,.26,.08,-a); }
    const q=rng(530+x); for(let k=0;k<6;k++){ const a=q()*6.28, d=.2+q()*.5; sphere(n,mA,r.rock,Math.cos(a)*d,.2,Math.sin(a)*d,.12+q()*.1,7,.6); }
    for(let k=0;k<5;k++){ const a=q()*6.28, d=.2+q()*.5, cx=Math.cos(a)*d, cz=Math.sin(a)*d; for(let j=0;j<3;j++) qL(n,mA,r.coral,[[0,.03,.03],[.18+j*.05,.018,.018],[.22+j*.05,.03,.03]],6,cx+(j-1)*.05,.18,cz,(j-1)*.3,0,(j-1)*.4); }
    for(let k=0;k<3;k++) qPl(n,mC,r.kelpC,Math.cos(k*2.1)*.35,1.0,Math.sin(k*2.1)*.35,.42,1.6,0,k*1.05,0); for(let k=0;k<9;k++) sphere(n,U('#e8fcff'),[0,0,1,1],.25,.5+k*.3,-.2,.015+(k%3)*.008,5); }
  const fish=M(fishTex('gold'),{unlit:true,cut:true,double:true});
  for(const x of [-6,6]) for(let k=0;k<4;k++){ const n=mk(plane(.8,.4),fish,g,x,1+k*.6,0); const ph=k*1.7; WG.aquarium.anim.push(t=>{ const a=t*.5+ph; n.p=[x+Math.cos(a)*.45,1+k*.6+Math.sin(t+ph)*.1,Math.sin(a)*.45]; n.r=[0,-a,0]; }); }
  /* blue velvet booths: channel-tufted backs with a gold rail, piped cushions on walnut plinths, deco lamps on the tables */
  for(const x of [-11,-2.5,2.5,11]) for(const s of [-1,1]){ hide(B(g,C('#1a4a8a'),x,0,s*2.2,2.4,.45,1.0)); hide(B(g,C('#1a4a8a'),x,.45,s*2.65,2.4,.7,.2));
    Wz(mk(qUV(cyl(.4,.4,.04,20),[r.gold,r.walnut,r.walnut]),mA,g,x,.68,s*1.3)); Wz(mk(qUV(cyl(.04,.04,.68,8),r.goldV),mA,g,x,.34,s*1.3));
    const n=dn(g,x,0,s*2.2,0,s<0?0:Math.PI,0); qB(n,mA,qF(r.walnut,r.deco,r.walnut),0,0,0,2.4,.3,1.0); qBar(n,mA,r.gold,0,.28,.5,2.4,.02,.02); qB(n,mA,qF(r.velvet,r.velvet,r.velvet,r.velvetCh),0,.3,-.02,2.36,.15,.96);
    qB(n,mA,qF(r.velvet,r.velvetCh),0,.45,-.45,2.4,.7,.2); qB(n,mA,r.gold,0,1.15,-.45,2.44,.04,.22); for(const e of [-1,1]){ qB(n,mA,qF(r.walnutV),e*1.22,0,-.05,.04,1.12,1.1); qB(n,mA,r.goldV,e*1.22,1.12,-.05,.05,.025,1.12); }
    const t=dn(g,x,.7,s*1.3); qC(t,mA,r.black,0,-.67,0,.22,.24,.03,14); qL(t,mA,r.gold,[[0,.05,.05],[.02,.03,.03],[.12,.012,.012],[.16,.02,.02]],8,.15,0,s*.12); qL(t,mU,r.shade,[[0,.09,.09],[.06,.07,.07],[.12,.04,.04]],10,.15,.15,s*.12); sphere(t,mA,r.gold,.15,.29,s*.12,.012,5);
    martini(t,-.12,0,-.05*s); martini(t,-.02,0,.18*s); qB(t,mA,qF(r.menu),-.2,0,.15*s,.12,.16,.01,0,-.25*s,0); qC(t,mA,[r.black,r.marbleB,r.marbleB],.05,.01,-.2*s,.05,.05,.02,10); }
  /* the bar at the front: walnut deco panels, black marble, a gold foot rail; mirrored back bar of bottles either side of the door */
  hide(B(g,C('#14203a'),13,0,0,.8,1.05,WZ*2-2.8)); hide(B(g,gold,12.65,1.05,0,.1,.04,WZ*2-2.8));
  { const n=dn(g,13,0,0), L=WZ*2-2.8; for(let k=0;k<4;k++) qB(n,mA,[r.walnut,r.deco,r.walnut,r.walnut,r.walnut,r.walnut],0,.06,-L/2+L/8+k*L/4,.78,.94,L/4-.01); for(let k=0;k<=4;k++) qB(n,mA,r.goldV,-.41,.06,-L/2+k*L/4,.03,.94,.04);
    qB(n,mA,r.black,0,0,0,.82,.06,L+.02); qBar(n,mA,r.marbleB,-.02,1.0,0,L+.12,.06,.9,'z'); qBar(n,mA,r.gold,-.47,1.0,0,L+.12,.06,.03,'z'); qBar(n,mA,r.gold,-.55,.15,0,L,.04,.04,'z'); for(let k=0;k<4;k++) qB(n,mA,r.gold,-.48,.14,-L/2+.3+k*(L-.6)/3,.14,.03,.03);
    martini(n,-.2,1.06,-1.1); martini(n,-.2,1.06,-.95); martini(n,-.25,1.06,-.8); qL(n,mA,r.gold,[[0,.04,.04],[.16,.045,.045],[.2,.03,.03],[.24,.015,.015],[.27,.02,.02]],10,-.2,1.06,-.5);
    qBowl(n,mA,r.gold,r.black,[[0,.06],[.04,.1],[.16,.12]],.006,12,-.15,1.06,.6); qL(n,mA,r.champ,[[0,.04,.04],[.16,.042,.042],[.22,.02,.02],[.3,.016,.016]],8,-.15,1.1,.6,.3,0,0); qBowl(n,mA,r.marbleB,r.olive,[[0,.03],[.02,.06],[.03,.065]],.005,10,-.25,1.06,1.05);
    qB(n,mA,qF(r.walnut,r.radio,r.walnut),.25,1.06,1.2,.18,.22,.28,-Math.PI/2); }
  { const n=dn(g,WL/2,0,0,0,-Math.PI/2,0); for(const s of [-1,1]){ const z=s*1.85; qB(n,mA,qF(r.gold,r.decoMirror),z,.95,.02,1.9,1.7,.03); for(const y of [1.3,1.75,2.2]){ qBar(n,mA,r.black,z,y,.14,1.8,.025,.24); qBar(n,mA,r.gold,z,y,.26,1.8,.03,.01); }
      const q=rng(540+s); for(const y of [1.33,1.78,2.23]) for(let k=0;k<7;k++){ const bx=z-.78+k*.26, c=[0xfff0d0,0xd8a050,0xb8e0a8,0xffffff,0xc87040,0x8ab0d8][(k+(y*10|0))%6]; if(q()<.2) martini(n,bx,y,.13); else qL(n,M(A.tex,{color:c}),r.bottle,[[0,.035,.035],[.15,.038,.038],[.19,.018,.018],[.26,.015,.015]],8,bx,y,.13); } }
    qB(n,mA,qF(r.gold,r.sign),0,2.4,.04,1.5,.55,.04); }
  /* the entry: the route chart, a deco mirror, the depth gauge over the door, palms in brass pots in the corners */
  { const n=dn(g,-WL/2,0,0,0,Math.PI/2,0); qB(n,mA,qF(r.gold,r.chart),1.75,.95,.03,1.3,1.3,.04); qB(n,mA,qF(r.gold,r.decoMirror),-1.75,.6,.02,1.5,1.9,.03); qC(n,mA,[r.gold,r.gauge,r.gauge],0,2.72,.04,.24,.24,.06,20,Math.PI/2);
    for(const s of [-1,1]){ const z=s*2.45; mk(qUV(lathe([[0,.18,.18],[.05,.22,.22],[.4,.26,.26],[.46,.27,.27]],14),r.pot),mA,g,-13.45,0,z); const p=dn(g,-13.45,0,z); qC(p,mA,[r.pot,r.soil,r.soil],0,.44,0,.25,.25,.02,14);
      for(let k=0;k<4;k++) qPl(p,mC,r.palmC,0,1.15,0,.95,1.4,0,k*Math.PI/4,0); qC(p,mA,r.walnutV,0,.7,0,.03,.04,.6,6); } }
  /* ceiling: a lowered black centre panel with a lit cove each side, gold ribs, tiered glass chandeliers */
  qBar(D,mA,r.black,0,WH-.12,0,26,.12,1.2); for(const s of [-1,1]){ qBar(D,mU,r.cove,0,WH-.125,s*.62,26,.02,.05); qBar(D,mA,r.gold,0,WH-.14,s*.6,26,.02,.02); }
  for(let k=0;k<7;k++){ const x=-12.4+k*4.1333; for(const s of [-1,1]) qBar(D,mA,r.gold,x,WH-.03,s*1.75,2.3,.03,.05,'z'); }
  for(const x of [-8,8]){ const n=dn(g,x,0,0); for(let k=0;k<3;k++){ const y=2.5+k*.18, rr=.38-k*.1; qL(n,mU,r.shade,[[0,rr,rr],[.1,rr*.9,rr*.9]],16,0,y,0,0,0,0,{capB:false,capT:false}); qT(n,mA,r.gold,rr,.012,3,16,0,y,0,Math.PI/2); }
    for(let k=0;k<4;k++){ const a=k*Math.PI/2; qB(n,mA,r.goldV,Math.cos(a)*.28,2.5,Math.sin(a)*.28,.012,WH-2.62,.012); } sphere(n,U('#fff4d8'),[0,0,1,1],0,2.55,0,.08,8); }
  qDoor(g,mA,r.deco,r.gold,-1); qDoor(g,mA,r.deco,r.gold,1); DEC.forEach(qNC); WG.aquarium.atl={mA,mU,r};
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
