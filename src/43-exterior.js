
/* =====================================================================================================
   THE MERIDIAN: the biggest bullet train ever built, on its first lap of the world. Nine cars, each 30 m
   long and 6.2 m wide on 3 m super-gauge track. Livery: midnight navy, a gold double pinstripe, the route
   drawn along the skirt with a dot for every stop, silver roof.
   ===================================================================================================== */
const WAGONS=[
  {key:'cab',num:'01',name:'The Locomotive',label:'THE MERIDIAN',crew:null,wins:[[.62,.7],[.74,.82]],glow:0xfff0d0,color:'#d4ad5a',
    sub:'Crew only · the front of the train',note:'A flight deck more than a cab: a horseshoe of consoles, two captain\'s chairs, a wall of route screens and a windscreen full of oncoming track. Reach it and the trip ends where you say.',sw:['#e8e4dc','#14203a','#d4ad5a','#5ab8e8','#c8302a']},
  {key:'capsule',num:'02',name:'Capsule Hotel',label:'CAPSULES',crew:'ren',wins:[[.42,.5],[.56,.64]],glow:0xe8f4ff,color:'#29e0e6',
    sub:'Boards in Tokyo, last stop · the Kagami-gumi',note:'Two storeys of glowing white sleep pods down both walls, a strip of lockers, vending machines and a neon-lit lounge in the middle. Clean, bright and very narrow to fight in.',sw:['#eeeee8','#29e0e6','#2a2a34','#ff4fae','#f5c542']},
  {key:'casino',num:'03',name:'The King\'s Casino',label:'CASINO',crew:'king',wins:[[.1,.16],[.3,.36],[.5,.56],[.7,.76],[.86,.92]],glow:0xff4fae,color:'#f5c542',
    sub:'Boards in Las Vegas · the Kings',note:'Red carpet with gold diamonds, a mirrored ceiling, rows of slot machines, a roulette wheel, blackjack tables and a stage with a gold curtain. The King holds court on the stage.',sw:['#8a1424','#f5c542','#12101a','#ff3fa4','#2a8a4a']},
  {key:'pool',num:'04',name:'Copacabana Pool Deck',label:'POOL DECK',crew:'tremor',wins:[[.05,.95]],glow:0x7ae8f0,color:'#2a9a5a',
    sub:'Boards in Rio · Tremor\'s crew',note:'The roof opens: a long turquoise pool, a wave-mosaic deck, striped loungers, potted palms, a bar under a thatch and a DJ booth stacked with speakers.',sw:['#2ac0d0','#f2ece0','#2a9a5a','#f2c230','#e0473a']},
  {key:'aquarium',num:'05',name:'Aquarium Lounge',label:'AQUARIUM',crew:null,wins:[[.06,.94]],glow:0x7ae8f0,color:'#1a6a86',
    sub:'The South Atlantic tunnel · the Espositos fall back here',note:'Floor-to-ceiling glass, a column tank of fish and blue velvet booths. Under the Atlantic the windows fill with whales; in the desert they fill with stars.',sw:['#0e3a52','#1a6a86','#bfefff','#2a2a5a','#d4ad5a']},
  {key:'trattoria',num:'06',name:'Trattoria Assunta',label:'TRATTORIA',crew:'nonna',wins:[[.1,.2],[.3,.4],[.5,.6],[.7,.8]],glow:0xffd8a0,color:'#e0a040',
    sub:'Boards in Naples · the Esposito family',note:'Lemon-yellow walls, red-check tablecloths, hams and garlic hanging over a deli counter, a wood-fired oven and family photographs everywhere. Nonna eats here every day.',sw:['#f2d27a','#c8302a','#f4efe6','#2a7a4a','#8a5a36']},
  {key:'pub',num:'07',name:'The Rusty Anchor',label:'THE RUSTY ANCHOR',crew:'gaffer',wins:[[.12,.2],[.3,.38],[.5,.58],[.7,.78]],glow:0xffc070,color:'#c8202a',
    sub:'Boards in London · the Southside firm',note:'A proper pub: bottle-green tiles, dark wood, brass taps, red leather booths, a dartboard, scarves pinned over the bar and the match on every screen.',sw:['#1f4a36','#4a2a1a','#c8202a','#d4ad5a','#e8dcc0']},
  {key:'banya',num:'08',name:'Banya & Ice Bar',label:'BANYA',crew:'volkov',wins:[[.08,.14],[.24,.3],[.56,.62],[.82,.88]],glow:0x9ad8ff,color:'#5aa8d8',
    sub:'Boards in Siberia · the Volkov brotherhood',note:'Half pine sauna, half bar carved from ice: log walls, steam, birch switches and buckets on one end; a glowing blue ice bar and bottles in frost on the other.',sw:['#c89a62','#7a4a2a','#bfefff','#2a6ab0','#d8d0c4']},
  {key:'dimsum',num:'09',name:'Golden Crane Dim Sum',label:'GOLDEN CRANE',crew:'lau',wins:[[.12,.2],[.3,.38],[.5,.58],[.66,.74]],glow:0xff6040,color:'#c8302a',
    sub:'Boards in Hong Kong · the Golden Crane triad',note:'Red lacquer and gold, round tables with lazy susans, trolleys stacked with bamboo steamers, red lanterns overhead, a gold crane mural, and a steaming kitchen full of woks.',sw:['#a81c1c','#d4ad5a','#1a1414','#2a8a6a','#f2ece0']}
];
const CAR_L=30, CAR_GAP=1.0, CAR_PITCH=CAR_L+CAR_GAP, CAR_HW=3.1+DW, WIDE=CAR_HW/3.1;
const PROF=[[0,-.7],[2.9,-.7],[3.05,-.4],[3.1,.4],[3.1,3.5],[3.02,3.95],[2.75,4.28],[2.1,4.48],[1.0,4.56],[0,4.58]];
const PY0=-.7, PY1=4.58, YC=1.8;
const vOf=y=>Math.min(.995,Math.max(.005,(y-PY0)/(PY1-PY0)));
const vRow=(y,H)=>(1-vOf(y))*H;
function loftHalf(g,secs,side,flipU,mi){ const base=g.P.length/3,start=g.I.length,n=PROF.length;
  for(const sc of secs) for(const [z,y] of PROF){ const Y=YC+(y-YC)*sc.sy+sc.dy; g.v([sc.x,Y,side*z*WIDE*sc.sz],[0,0,side],[flipU?1-sc.u:sc.u,vOf(y)]); }
  for(let i=0;i<secs.length-1;i++) for(let j=0;j<n-1;j++){ const a=base+i*n+j,b=a+n,c=b+1,d=a+1; if(side>0) g.I.push(a,b,c,a,c,d); else g.I.push(a,c,b,a,d,c); }
  g.groups.push({start,count:g.I.length-start,mi}); }
function loft(secs){ const g=new Geo(); loftHalf(g,secs,1,false,0); loftHalf(g,secs,-1,true,0); smoothNormals(g); return g; }
const NAVY='#14203a', GOLD='#d4ad5a';
function liveryTex(W){ return P2(512,64,(g,w,h)=>{ const row=y=>vRow(y,h);
  vfill(g,0,0,w,row(3.9),[[0,'#c8ccd2'],[1,'#a8aeb6']]); R(g,'#7e848c',0,row(3.9)|0,w,1);
  vfill(g,0,row(3.9),w,row(-.1)-row(3.9),[[0,'#22305a'],[.5,NAVY],[1,'#0e1628']]);
  vfill(g,0,row(-.1),w,h-row(-.1),[[0,'#0a0f1c'],[1,'#05080f']]);
  R(g,GOLD,0,row(.9)|0,w,1); R(g,GOLD,0,(row(.9)|0)+3,w,1); R(g,GOLD,0,row(2.95)|0,w,1);
  /* the route along the skirt: a line with a dot per stop */ R(g,rgba(GOLD,.7),0,row(.25)|0,w,1); for(let k=0;k<9;k++){ const x=24+k*(w-48)/8; ell(g,x,row(.25),2,2,GOLD); }
  if(W.key==='pool'){ vfill(g,0,row(4.4),w,row(2.95)-row(4.4),[[0,'#6ad0e0'],[1,'#2a8aa8']]); for(let x=8;x<w;x+=30) R(g,'#c8ccd2',x,row(4.4)|0,2,(row(2.95)-row(4.4))|0); }
  for(const [u0,u1] of W.wins){ const x0=u0*w,x1=u1*w,y0=row(2.62),y1=row(1.02); vfill(g,x0,y0,x1-x0,y1-y0,[[0,'#5a7a9a'],[.35,'#1e2e48'],[1,'#0e1626']]); R(g,GOLD,x0,y0,x1-x0,1); R(g,GOLD,x0,y1,x1-x0,1); R(g,rgba('#ffffff',.22),x0+3,y0+2,3,(y1-y0)*.5); }
  for(const u of [.03,.97]){ const x=u*w; R(g,'#3a4a6a',x-7,row(2.8)|0,1,(row(.15)-row(2.8))|0); R(g,'#3a4a6a',x+7,row(2.8)|0,1,(row(.15)-row(2.8))|0); R(g,'#5a7a9a',x-4,row(2.5)|0,8,8); }
  const lab=W.label; text(g,lab,(w-textW(lab,1))/2|0,row(.62)|0,GOLD,1); text(g,W.num,w*.07|0,row(.62)|0,'#f2ece0',1);
},4,W.num.charCodeAt(1)); }
function noseTex(){ return P2(128,64,(g,w,h)=>{ const row=y=>vRow(y,h);
  vfill(g,0,0,w,h,[[0,'#22305a'],[1,'#0e1628']]); vfill(g,0,row(-.1),w,h-row(-.1),[[0,'#0a0f1c'],[1,'#05080f']]);
  for(let k=0;k<5;k++) poly(g,[[k*12,row(.9)],[k*12+40,row(1.8)],[k*12+44,row(1.8)],[k*12+4,row(.9)]],rgba(GOLD,.9-k*.15));
  poly(g,[[w*.16,row(4.0)],[w*.62,row(3.4)],[w*.66,row(2.3)],[w*.2,row(2.8)]],'#0a1220'); poly(g,[[w*.24,row(3.8)],[w*.4,row(3.5)],[w*.42,row(3.15)],[w*.26,row(3.4)]],rgba('#9ab8d8',.55));
  ell(g,w*.9,row(.9),4,2,'#fff6d8'); },3,17); }
function tailTex(){ return P2(128,64,(g,w,h)=>{ const row=y=>vRow(y,h);
  vfill(g,0,0,w,h,[[0,'#22305a'],[1,'#0e1628']]); vfill(g,0,row(4.5),w*.85,row(1.0)-row(4.5),[[0,'#5a7a9a'],[.4,'#1e2e48'],[1,'#0e1626']]); for(let x=10;x<w*.85;x+=16) R(g,GOLD,x,row(4.5)|0,1,(row(1.0)-row(4.5))|0);
  R(g,GOLD,0,row(.9)|0,w,1); ell(g,w*.92,row(.9),3,2,'#ff4a3a'); },3,19); }
function winGlowTex(W){ return P2(512,16,(g,w,h)=>{ for(const [u0,u1] of W.wins){ vfill(g,u0*w,0,(u1-u0)*w,h,[[0,'#fff6e0'],[1,'#d8b888']]); for(let x=u0*w+8;x<u1*w;x+=14) R(g,'#5a4a3a',x|0,h-7,3,7); } }); }
const LIVERY={}, GLOWM={};
const mBogie=M(null,{color:0x22242a}), mWheel=M(tSteel,{color:[.55,.55,.58]});
function bogie(parent,x){ const b=N(parent,x,0,0); mk(box(3.6,.5,GAUGE*2+.6),mBogie,b,0,-.66,0); for(const dx of [-1.25,1.25]) for(const z of [-GAUGE,GAUGE]) mk(cyl(.5,.5,.16,12),mWheel,b,dx,-.6,z,Math.PI/2); return b; }
function buildCarExt(parent,W,x){ const n=N(parent,x,0,0);
  const mat=LIVERY[W.key]||(LIVERY[W.key]=M(liveryTex(W)));
  const secs=[]; for(let i=0;i<=14;i++){ const t=i/14; secs.push({x:-CAR_L/2+t*CAR_L,sz:1,sy:1,dy:0,u:t}); }
  mk(loft(secs),mat,n); bogie(n,-CAR_L*.36); bogie(n,CAR_L*.36);
  mk(box(CAR_GAP+.1,3.6,3.6+DW*2),M(null,{color:0x14161a}),n,CAR_L/2+CAR_GAP/2,1.7,0);
  const gm=GLOWM[W.key]||(GLOWM[W.key]=M(winGlowTex(W),{cut:true,emissive:W.glow,color:[.1,.1,.1]}));
  const gw=N(n); gw.vis=false; n.glow=gw;
  for(const s of [1,-1]){ const gp=plane(CAR_L,1.6,24,1); if(s<0) for(let i=0;i<gp.T.length;i+=2) gp.T[i]=1-gp.T[i]; mk(gp,gm,gw,0,1.82,s*(CAR_HW+.06),0,s>0?0:Math.PI,0); }
  if(W.key==='cab'){ const ns=[]; for(let i=0;i<=10;i++){ const t=i/10; ns.push({x:CAR_L/2+t*12,sz:Math.max(.03,1-.86*Math.pow(t,1.5)),sy:Math.max(.05,1-.7*Math.pow(t,1.1)),dy:-1.05*Math.pow(t,1.3),u:t}); }
    mk(loft(ns),M(noseTex()),n); const pm=M(null,{color:0x3a3c40});
    mk(box(2,.1,.9),pm,n,-8,4.65,0); mk(box(.08,1.3,.08),pm,n,-8.3,5.2,0,0,0,.6); mk(box(.08,1.3,.08),pm,n,-7.7,5.2,0,0,0,-.6); mk(box(.1,.08,2.4),pm,n,-8,5.75,0); }
  if(W===WAGONS[WAGONS.length-1]){ const ns=[]; for(let i=0;i<=6;i++){ const t=i/6; ns.push({x:-CAR_L/2-t*6,sz:Math.max(.05,1-.6*Math.pow(t,2)),sy:Math.max(.08,1-.55*Math.pow(t,2.2)),dy:-.5*Math.pow(t,2),u:t}); } n.tail=mk(loft(ns),M(tailTex()),n); }
  return n; }
const TRAIN_CARS=[]; /* the game builds car exteriors only where a station needs them */
const STATION=N(world), STATION_CARS=[];
function setGlow(on){ for(const c of TRAIN_CARS) c.glow.vis=on; for(const c of STATION_CARS) c.glow.vis=on; }

/* =====================================================================================================
   TOKYO MERIDIAN TERMINAL, platform 0: the line-up. A tall steel-and-glass shed, cream tile, yellow tactile
   strip, vending machines, sakura planters, departure board listing the whole loop.
   ===================================================================================================== */
const buildTerminal=function buildStation(){ /* the art page's terminal; unused in the game */
  const S=STATION, TZ=-5.2-DW;
  const tile=M(P2(32,32,(g,w,h)=>{ for(let y=0;y<4;y++) for(let x=0;x<4;x++) vfill(g,x*8,y*8,8,8,(x+y)%2?[[0,'#e8e2d4'],[1,'#ddd6c6']]:[[0,'#d4ccbc'],[1,'#c8c0b0']]); for(let k=0;k<4;k++){ R(g,'#b0a898',k*8,0,1,h); R(g,'#b0a898',0,k*8,w,1); } },6,3),{repeat:[18,5]});
  { const ed=M(null,{color:0x8a8478}); mk(box(40,1.0,10,{at:[0,-.5,0]}),F(ed,ed,ed,tile,ed),S,0,0,3.2); }
  mk(plane(40,.6),M(P2(64,8,(g,w,h)=>{ R(g,'#f2c230',0,0,w,h); for(let x=0;x<w;x+=3) for(let y=1;y<h;y+=3) R(g,'#d8a820',x,y,2,2); },0),{repeat:[16,1]}),S,0,.002,-1.4,-Math.PI/2);
  [WAGONS[0],WAGONS[1]].forEach((W,i)=>{ const c=buildCarExt(S,W,(-.2-i)*CAR_PITCH+4); c.p[2]=TZ; STATION_CARS.push(c); });
  for(const z of [TZ-GAUGE,TZ+GAUGE]) mk(box(90,.16,.09),M(null,{color:0x8c9096}),S,0,RAIL_Y-.08,z);
  const steel=M(null,{color:0xd8dce0}), dark=M(null,{color:0x2a2e36}), gold=M(null,{color:0xd4ad5a}), white=M(null,{color:0xf4f2ec});
  for(let x=-16;x<=16;x+=8){ mk(box(.36,8,.36),steel,S,x,4,-.9); for(const s of [-1,1]) mk(box(.12,3.2,.12),steel,S,x+s*1.1,7.3,-.9,0,0,s*.75); mk(box(.5,.25,.5),dark,S,x,.12,-.9); }
  const roof=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b8c8d4'],[1,'#a0b4c4']]); R(g,'#5a6470',0,0,w,2); R(g,'#5a6470',0,0,2,h); },4,5),{repeat:[14,4]});
  mk(plane(40,12),roof,S,0,8.5,2.5,Math.PI/2); mk(box(40,.6,.2),dark,S,0,8.2,8.4); mk(box(40,.08,.22),gold,S,0,7.9,8.4);
  const sign=P2(160,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#14203a'],[1,'#0e1628']]); R(g,GOLD,2,2,w-4,1); R(g,GOLD,2,h-3,w-4,1); text(g,'TOKYO MERIDIAN TERMINAL',(w-textW('TOKYO MERIDIAN TERMINAL'))/2|0,8,'#f2ece0',1); text(g,'PLATFORM 0  WORLD LOOP',(w-textW('PLATFORM 0  WORLD LOOP'))/2|0,18,'#29e0e6',1); },0);
  mk(box(4.4,.9,.06),F(dark,M(sign),M(sign)),S,-8,5.4,-.7); for(const dx of [-1.9,1.9]) mk(box(.03,2.2,.03),gold,S,-8+dx,6.9,-.7);
  const board=P2(128,64,(g,w,h)=>{ R(g,'#0e0d0c',0,0,w,h); text(g,'THE MERIDIAN 24  SEE THE WORLD',3,3,'#ffb020',1);
    const stops=[['01','HONG KONG'],['02','LAKE BAIKAL'],['03','LONDON'],['04','NAPLES'],['05','RIO'],['06','LAS VEGAS'],['07','TOKYO']];
    stops.forEach(([d,n],i)=>{ text(g,d,3,12+i*7,'#c88a20',1); text(g,n,16,12+i*7,'#c88a20',1); }); });
  mk(box(3.4,1.7,.12),F(dark,M(board,{unlit:true}),mBlack),S,8,5.0,-.7); mk(box(3.6,.1,.16),gold,S,8,5.9,-.7); for(const dx of [-1.4,1.4]) mk(box(.03,2.5,.03),gold,S,8+dx,7.1,-.7);
  const clockT=P2(32,32,(g,w,h)=>{ ell(g,16,16,15,15,'#d4ad5a'); ell(g,16,16,13,13,'#f6efe0'); for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; R(g,'#14203a',16+Math.sin(a)*11|0,16-Math.cos(a)*11|0,1,1); } g.strokeStyle='#14203a'; g.lineWidth=1.5; g.beginPath(); g.moveTo(16,16); g.lineTo(16+Math.sin(.15)*10,16-Math.cos(.15)*10); g.moveTo(16,16); g.lineTo(16+Math.sin(6.2)*6,16-Math.cos(6.2)*6); g.stroke(); });
  mk(cyl(.55,.55,.14,16),[gold,M(clockT,{unlit:true}),M(clockT,{unlit:true})],S,0,5.6,-.7,Math.PI/2); mk(box(.04,2.6,.04),gold,S,0,7.1,-.7);
  /* vending machines, benches, sakura, lamps */
  const vm=(x,c)=>{ const n=N(S,x,0,-.2); mk(box(1.0,1.9,.7,{at:[0,.95,0]}),F(M(null,{color:hexInt(c)}),M(P2(32,64,(g,w,h)=>{ R(g,c,0,0,w,h); R(g,'#e8f4ff',3,4,w-6,30); const r=rng(x*7+3); for(let y=0;y<3;y++) for(let k=0;k<5;k++) R(g,['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#f28a3a'][(k+y)%5],5+k*5,7+y*9,3,7); R(g,'#2a2a30',4,40,w-8,8); R(g,'#101014',8,52,16,6); }),{emissive:0x1a1a1a})),n); };
  vm(-14,'#d63a2c'); vm(-12.8,'#2a6ad8'); vm(14,'#f2f2ee');
  const wood=M(P2(16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#a87a4a'],[1,'#8a5e36']]); for(let y=0;y<h;y+=4) R(g,'#6a4428',0,y,w,1); },4,7));
  for(const x of [-5,5]){ const b=N(S,x,0,-.5); mk(box(2.4,.06,.5),wood,b,0,.46,0); mk(box(2.4,.45,.06),wood,b,0,.74,-.26,.15); for(const dx of [-1,1]) mk(box(.06,.46,.45),steel,b,dx,.23,0); }
  const pot=M(null,{color:0x2a2e36}),soil=M(null,{color:0x3a2a1e}),bark=M(null,{color:0x4a2e26}),pink=[M(null,{color:0xf2a0b8}),M(null,{color:0xffc8d6}),M(null,{color:0xe48aa8})];
  for(const x of [-18,18]){ const p=N(S,x,0,2.5); mk(box(1.4,.8,1.4),pot,p,0,.4,0); mk(box(1.3,.04,1.3),soil,p,0,.8,0); mk(box(.16,2.4,.16),bark,p,0,2,0,0,0,.08); const r=rng(x+50); for(let k=0;k<12;k++) mk(box(.6+r()*.5,.5+r()*.3,.6+r()*.5),pink[k%3],p,(r()-.5)*1.4,3+r()*.9,(r()-.5)*1.4,r(),r(),0); }
  const lampM=M(null,{unlit:true,color:0xf4f8ff}); for(let x=-15;x<=15;x+=6) mk(box(2.4,.06,.3),lampM,S,x,8.4,2.5);
  S.vis=false;
};
