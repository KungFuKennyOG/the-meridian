
/* =====================================================================================================
   UNDERGROUND STATIONS. Every stop is underground: the scenery swaps while you are down here, the crew
   boards on the platform, and your handler has left the next weapon somewhere on it. Platform top y=0,
   the train on the far track at z=TZS (-6.7), the back wall at z=+8.5, 64 m long. Walls and ceilings face
   inward and are one-sided, so the orbit camera sees in from outside.
   ===================================================================================================== */
const ST={}, STATION_BUILD={}, STATION_POST={}, SL=64, SZ0=-10.2-DW-.5, SZ1=8.5, TZS=-5.2-DW;
const ARSENAL=[
  {stop:'Tokyo',weapon:'Suppressed pistol',how:'In a coin locker, key taped under the bench. Your holiday was supposed to be unarmed.'},
  {stop:'Hong Kong',weapon:'A second pistol',how:'Inside a takeaway box on the dim sum counter. Two hands, two guns.'},
  {stop:'Lake Baikal',weapon:'Pump shotgun',how:'Wrapped in a fur coat on a luggage trolley.'},
  {stop:'London',weapon:'Compact SMG',how:'In a briefcase on a platform bench, next to a newspaper.'},
  {stop:'Naples',weapon:'Assault rifle',how:'In a cello case leaning on the espresso bar.'},
  {stop:'Rio',weapon:'Grenade launcher',how:'In a beach cooler full of ice.'},
  {stop:'Las Vegas',weapon:'Gold-plated machine gun',how:'On a roulette table on the concourse, with a bow on it.'},
  {stop:'Tokyo',weapon:'A katana',how:'For the end of the line. Wrapped in silk in the ticket office.'}
];
function stationShell(key,o){
  const g=N(world); g.vis=false; const side={'-1':N(g),'1':N(g)};
  mk(wplane(SL,SZ1+1.75,o.floorTile||1.5,o.floorTile||1.5),o.floor,g,0,0,(SZ1-1.75)/2,-Math.PI/2);
  mk(wplane(SL,.5),C('#d8b020'),g,0,.004,-1.5,-Math.PI/2);
  B(g,o.edge||C('#5a5654'),0,-1.4,-1.62,SL,1.4,.3);
  mk(wplane(SL,SZ1-SZ0,2,2),M(sleeperTex(),{color:[.55,.55,.55]}),g,0,-1.25,(SZ1+SZ0)/2-6,-Math.PI/2);
  for(const z of [TZS-GAUGE,TZS+GAUGE]) B(g,C('#8c9096'),0,-1.1,z,SL,.16,.09);
  mk(wplane(SL,o.H,o.wallTile||1,o.wallTile||1),o.back,g,0,o.H/2,SZ1,0,Math.PI,0);
  mk(wplane(SL,o.H+1.4,o.wallTile||1,o.wallTile||1),o.far||o.back,g,0,o.H/2-.7,SZ0,0,0,0);
  for(const e of [-1,1]) mk(wplane(SZ1-SZ0,o.H+1.4,o.wallTile||1,o.wallTile||1),o.end||o.back,g,e*SL/2,o.H/2-.7,(SZ1+SZ0)/2,0,e<0?Math.PI/2:-Math.PI/2,0);
  if(o.ceil) mk(wplane(SL,SZ1-SZ0,o.ceilTile||1.5,o.ceilTile||1.5),o.ceil,g,0,o.H,(SZ1+SZ0)/2,Math.PI/2);
  [WAGONS[7],WAGONS[8]].forEach((W,i)=>{ const c=buildCarExt(g,W,(.5-i)*CAR_PITCH); c.p[2]=TZS; c.glow.vis=true; if(c.tail) c.tail.vis=false; });
  ST[key]=Object.assign({g,side,anim:[],back:N(g),top:N(g),H:o.H,H0:o.H},o.meta); return g; }
/* a weapon left for you: an open case, the gun inside, a soft light and a glint ring on the floor */
function weaponDrop(g,x,z,kind,caseCol){
  const n=N(g,x,0,z); const ring=mk(plane(1.6,1.6),M(tRing,{unlit:true,cut:true,color:0xf5c542}),n,0,.012,0,-Math.PI/2);
  const glow=U('#fff2c0');
  if(kind==='locker'){ for(let r=0;r<4;r++) for(let c=0;c<3;c++){ const open=r===1&&c===1; const b=B(n,C(['#e8ecf0','#c8d4e0','#a8c8e0'][(r+c)%3]),c*.5-.5,r*.45,0,.48,.43,.5); if(open){ b.vis=false; B(n,C('#6a7480'),c*.5-.5,r*.45,-.2,.46,.41,.06); B(n,C('#e8ecf0'),c*.5-.5-.24,r*.45,.35,.03,.41,.46,.6); } }
    const p=N(n,0,.62,0,0,Math.PI/2,0); pPistol(p); mk(cyl(.018,.018,.16,6),M(tBlued,{double:true}),p,0,.045,.23,Math.PI/2); B(n,glow,0,.86,.1,.3,.02,.3); }
  else if(kind==='briefcase'){ B(n,C('#4a2e1a'),0,.46,0,.9,.06,.4); B(n,C('#5a3a22'),-.0,.52,-.22,.9,.4,.04,0,-.5); B(n,C('#2a1a10'),0,.52,0,.86,.02,.36); const p=N(n,0,.56,0,0,Math.PI/2,0); pSMG(p); B(n,C('#e8e2d0'),.6,.46,0,.3,.02,.22); }
  else if(kind==='cello'){ const c=N(n,0,0,0,0,0,-.18); mk(lathe([[0,.06,.04],[.15,.2,.12],[.45,.22,.13],[.6,.15,.1],[.75,.2,.12],[1.1,.18,.1],[1.25,.07,.05]],12),C(caseCol||'#141416'),c,0,0,0); B(c,C('#2a1a12'),0,.2,.14,.3,.9,.02);
    const p=N(n,.35,.9,.2,0,Math.PI/2,-.6); pRifleM(p); }
  n.ring=ring; return n; }
function pRifleM(g){ const wood=M(woodT('#5a3a24','#3a2416',303)); mk(box(.045,.07,.26),mBlack,g,0,0,.02); mk(cyl(.011,.011,.42,6),M(tBlued,{double:true}),g,0,.02,.36,Math.PI/2); mk(box(.04,.05,.2),mBlack,g,0,-.02,.22); mk(box(.035,.16,.05),mBlack,g,0,-.1,.08,-.3); mk(box(.04,.1,.24,{td:.7}),wood,g,0,-.03,-.2,.1); mk(box(.012,.04,.012),mBlack,g,0,.06,.0); return g; }

/* ---------- Tokyo: B5, white tile, screen doors, ticket gates, vending machines ---------- */
STATION_BUILD.tokyo=function tokyoStation(){
  const tile=M(P2(16,16,(g,w,h)=>{ R(g,'#eef0ee',0,0,w,h); R(g,'#d8dcd8',0,0,w,1); R(g,'#d8dcd8',0,0,1,h); },4,1));
  const back=M(P2(32,32,(g,w,h)=>{ R(g,'#eef0ee',0,0,w,h); for(let k=0;k<4;k++){ R(g,'#d8dcd8',0,k*8,w,1); R(g,'#d8dcd8',k*8,0,1,h); } R(g,'#2a9a5a',0,18,w,5); },4,2));
  const terr=M(P2(32,32,(g,w,h)=>{ R(g,'#9a9c9e',0,0,w,h); const r=rng(3); for(let i=0;i<160;i++) R(g,['#b8babc','#7a7c80','#c8c4b8'][i%3],r()*w|0,r()*h|0,1,1); },4,3));
  const g=stationShell('tokyo',{floor:terr,floorTile:2,back,far:tile,end:back,ceil:M(P2(32,32,(g,w,h)=>{ R(g,'#e4e6e4',0,0,w,h); R(g,'#c8ccc8',0,0,w,1); R(g,'#c8ccc8',0,0,1,h); R(g,'#ffffff',12,0,8,h); },4,4)),ceilTile:3,H:4.6,
    meta:{name:'Tokyo · B5',city:'Tokyo',num:'01',sw:['#eef0ee','#2a9a5a','#9a9c9e','#d63a2c','#f2c230'],crew:['ren','renc'],weapon:0,
      note:'Five floors under the city: white tile, a green line colour, platform screen doors, ticket gates and a row of vending machines. You walk in here with nothing but a golf bag and board at the back of the train; when the loop comes back round to Tokyo, the Kagami-gumi are waiting.',
      lamps:[lamp(-20,4.2,2,[1.0,1.05,1.1],10),lamp(-6,4.2,2,[1.0,1.05,1.1],10),lamp(8,4.2,2,[1.0,1.05,1.1],10),lamp(22,4.2,2,[1.0,1.05,1.1],10),lamp(0,3,-5,[.6,.62,.66],12),lamp(14,1.2,1.5,[1.2,1.0,.7],3.5)],amb:[.36,.37,.4],cam:{t:[-7,1.6,2.5],th:.35,ph:1.25,r:17}}});
  /* platform screen doors: frames and a glass band, gaps at the car doors */
  for(let x=-30;x<30;x+=2){ const door=Math.abs(((x+31)%31)-1)<1.5||Math.abs(x-(-.5))<1.6; if(door) continue; B(g,C('#c8ccd2'),x+1,0,-1.45,.08,1.5,.08); B(g,C('#a8c8d8',{emissive:0x0c1418}),x+1,.3,-1.45,1.92,1.1,.02); B(g,C('#2a9a5a'),x+1,1.5,-1.45,2,.1,.1); }
  /* square columns with station number plates */
  const plate=M(textTex(16,16,'#2a9a5a',[['G','c',2,'#ffffff'],['05','c',8,'#ffffff']]));
  for(let x=-24;x<=24;x+=12){ B(g,tile,x,0,3,.7,4.6,.7); mk(wplane(.4,.4),plate,g,x,2.6,3.36); mk(wplane(.4,.4),plate,g,x,2.6,2.64,0,Math.PI,0); }
  /* hanging signs */ const sign=M(textTex(96,16,'#1a1a1e',[['MERIDIAN  TOKYO','c',2,'#ffffff'],['PLATFORM 0  B5','c',9,'#2ae08a']]),{unlit:true});
  for(const x of [-14,14]){ B(g,C('#1a1a1e'),x,3.3,1,3.2,.6,.08); mk(wplane(3,.5),sign,g,x,3.6,1.05); mk(wplane(3,.5),sign,g,x,3.6,.95,0,Math.PI,0); B(g,C('#888c90'),x-1.4,3.9,1,.03,.7,.03); B(g,C('#888c90'),x+1.4,3.9,1,.03,.7,.03); }
  /* ticket gates along the back */ for(let k=0;k<6;k++){ const x=-6+k*1.6; B(g,C('#c8ccd2'),x,0,7.2,.25,1.0,1.4); B(g,G('#2ae08a'),x,1.0,6.6,.2,.02,.12); B(g,C('#d63a2c'),x+.8,.7,7.2,.6,.06,.06); }
  /* vending machines, benches, an escalator up */
  const vm=(x,c)=>B(g,F(C(c),M(P2(32,64,(g2,w,h)=>{ R(g2,c,0,0,w,h); R(g2,'#e8f4ff',3,4,w-6,30); const r=rng(x*5); for(let y=0;y<3;y++) for(let k=0;k<5;k++) R(g2,['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#f28a3a'][(k+y+(r()*3|0))%5],5+k*5,7+y*9,3,7); R(g2,'#2a2a30',4,40,w-8,8); }),{emissive:0x202020})),x,0,7.9,.9,1.9,.7,Math.PI);
  vm(13,'#d63a2c'); vm(14,'#2a6ad8'); vm(15,'#f2f2ee'); vm(16,'#2a9a5a');
  for(const x of [-18,-10,20]){ B(g,C('#c8ccd2'),x,.42,6.2,1.8,.06,.45); for(const dx of [-.8,.8]) B(g,C('#888c90'),x+dx,0,6.2,.06,.42,.4); }
  for(let k=0;k<2;k++){ const ez=7.6-k*1.2; const n=N(g,-27,0,ez,0,0,.42); B(n,C('#c8ccd2'),3.5,0,0,8,.5,1.0); B(n,C('#2a2c30'),3.5,.5,0,8,.04,.8); B(n,C('#2a2c30'),3.5,.5,.42,8,.9,.06); }
  const drop=weaponDrop(g,-10,5.8,'locker'); drop.r[1]=Math.PI; ST.tokyo.drop=drop;
  ST.tokyo.spots={nico:{x:-8.2,z:4.6,ry:Math.PI*.85},ren:{x:3,z:.6,ry:Math.PI*.8},renc:{x:1.2,z:-.6,ry:Math.PI*.7},renc2:{x:5,z:-.4,ry:Math.PI*.9}};
};

/* ---------- Naples: the sea cave, blue mosaic, a light well spiralling up ---------- */
STATION_BUILD.naples=function naplesStation(){
  const mosaic=(base,lite,seed)=>M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,lite],[1,base]]); const r=rng(seed); for(let y=0;y<h;y+=2) for(let x=(y>>1)%2;x<w;x+=2){ if(r()<.35) R(g,mix(base,'#ffffff',r()*.35),x,y,1,1); } for(let k=0;k<3;k++){ g.strokeStyle=rgba('#bfefff',.5); g.lineWidth=1; g.beginPath(); for(let x=0;x<=w;x++) g.lineTo(x,8+k*9+Math.sin(x/w*Math.PI*2+k)*2); g.stroke(); } },2,seed),{emissive:hexInt(mix(base,'#000000',.6))});
  const deep=mosaic('#0e3a7a','#2a6ac8',11), gold=M(P2(16,16,(g,w,h)=>{ R(g,'#c89a3a',0,0,w,h); const r=rng(12); for(let i=0;i<40;i++) R(g,r()>.5?'#f2d27a':'#8a6a24',r()*w|0,r()*h|0,1,1); },0,12));
  const stone=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#4a4c58'],[1,'#3a3c48']]); for(let x=0;x<w;x+=16) R(g,'#2a2c36',x,0,1,h); R(g,'#2a2c36',0,0,w,1); const r=rng(13); for(let i=0;i<8;i++) ell(g,r()*w,r()*h,4,1,rgba('#7ad8ff',.35)); },4,13));
  const g=stationShell('naples',{floor:stone,floorTile:2.5,back:deep,far:deep,end:deep,ceil:mosaic('#0a2a5a','#1a4a9a',14),ceilTile:3,H:6.5,
    meta:{name:'Napoli Meridiana',city:'Naples',num:'05',sw:['#0e3a7a','#2a6ac8','#bfefff','#c89a3a','#1e1e24'],crew:['nonna','nonnac'],weapon:4,
      note:'Built to look like the inside of a sea cave: walls and vault in deep blue mosaic with wave lines of light, a gold band at hand height, black stone underfoot and a light well spiralling up through the ceiling. There is an espresso bar on the platform.',
      lamps:[lamp(-18,4.5,2,[.45,.75,1.3],12),lamp(0,5.5,2,[.6,.9,1.4],12),lamp(18,4.5,2,[.45,.75,1.3],12),lamp(-6,1.8,6.5,[1.3,.95,.55],5),lamp(10,1.4,5.5,[1.2,.9,.5],4),lamp(0,3,-5,[.3,.45,.7],12)],amb:[.18,.24,.36],cam:{t:[-7,2.2,1.5],th:.5,ph:1.2,r:18}}});
  for(const z of [SZ1-.02]) B(ST.naples.back,gold,0,.9,z-.02,SL,.6,.04);
  /* the light well: a spiralling cone going up through the vault */
  const cone=M(P2(16,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8f8ff'],[.3,'#6ab8f0'],[1,'#0e3a7a']]); for(let y=0;y<h;y+=6) R(g,'#bfefff',0,y,w,1); }),{unlit:true,double:true});
  mk(lathe([[0,4.5,4.5],[1.5,3,3],[3,1.6,1.6],[4.5,.6,.6]],20,{capB:false,capT:false}),cone,ST.naples.top,0,6.5,3);
  for(let k=0;k<24;k++){ const a=k/24*Math.PI*6, rr=4.2-k*.15; B(ST.naples.top,U('#e8f8ff'),Math.cos(a)*rr,6.6+k*.17,3+Math.sin(a)*rr,.3,.05,.3); }
  /* wave lines of LED along the back wall */ for(let k=0;k<3;k++) for(let x=-31;x<31;x+=1){ B(ST.naples.back,U('#7ad8ff'),x+.5,2.6+k*1.1+Math.sin(x*.25+k)*.3,SZ1-.05,1.02,.05,.03); }
  /* the espresso bar and its stools */
  B(g,C('#1a1a1e'),-6,0,6.4,4,1.05,.9); B(g,gold,-6,1.05,6.4,4.1,.05,1.0); B(g,C('#c8ccd2'),-7.2,1.1,6.6,.6,.45,.4); B(g,C('#c8302a'),-7.2,1.55,6.6,.62,.06,.42); for(let k=0;k<5;k++) mk(cyl(.04,.035,.07,8),C('#f2ece0'),g,-5.4+k*.3,1.12,6.2);
  for(let k=0;k<4;k++){ const x=-7.4+k*1; mk(cyl(.18,.18,.07,10),C('#c8302a'),g,x,.75,5.6); mk(cyl(.03,.03,.75,6),C('#c8ccd2'),g,x,.37,5.6); }
  /* curved benches and lemon crates waiting to go on the train */
  for(const x of [-20,14,22]){ B(g,stone,x,0,5.5,2.4,.45,.6); B(g,gold,x,.45,5.5,2.4,.03,.6); }
  for(let k=0;k<5;k++){ B(g,M(woodT('#a87a46','#8a5e30',15)),18+(k%3)*.7,Math.floor(k/3)*.5,2.2,.6,.45,.45); for(let j=0;j<6;j++) mk(lathe([[0,.02,.02],[.04,.06,.05],[.08,.02,.02]],6),C('#f2d23a'),g,17.8+(k%3)*.7+(j%3)*.15,Math.floor(k/3)*.5+.45,2.1+(j>2?.15:0)); }
  const name=M(textTex(96,16,'#0a2a5a',[['NAPOLI MERIDIANA','c',5,'#f2d27a']]),{unlit:true}); for(const x of [-24,8]) mk(wplane(5,.8),name,ST.naples.back,x,3.2,SZ1-.06,0,Math.PI,0);
  const drop=weaponDrop(g,-3.2,5.8,'cello','#2a1a12'); drop.r[1]=Math.PI*.9; ST.naples.drop=drop;
  ST.naples.spots={nonna:{x:2,z:1.4,ry:Math.PI*.85,seat:true},nonnac:{x:.6,z:.3,ry:Math.PI*.8},nonnac2:{x:3.6,z:.2,ry:Math.PI*.95}};
};

/* ---------- London: a vaulted tiled tunnel, posters, a clock, wet floors ---------- */
STATION_BUILD.london=function londonStation(){
  const cream=M(P2(32,16,(g,w,h)=>{ R(g,'#ece2c8',0,0,w,h); for(let x=0;x<w;x+=8) R(g,'#d4c8a8',x,0,1,h); R(g,'#d4c8a8',0,0,w,1); R(g,'#d4c8a8',0,8,w,1); },4,21));
  const band=M(P2(32,16,(g,w,h)=>{ R(g,'#2a4a3a',0,0,w,h); for(let x=0;x<w;x+=8) R(g,'#1e3a2c',x,0,1,h); R(g,'#8a2a2a',0,6,w,4); },4,22));
  const floor=M(P2(32,32,(g,w,h)=>{ R(g,'#3a3634',0,0,w,h); for(let y=0;y<h;y+=8) for(let x=((y>>3)%2)*8;x<w;x+=16) R(g,'#46423e',x,y,16,8); const r=rng(23); for(let i=0;i<6;i++) ell(g,r()*w,r()*h,5,1.5,rgba('#9ab0c4',.35)); },6,23));
  const g=stationShell('london',{floor,floorTile:2,back:band,far:cream,end:cream,H:2.4,
    meta:{name:'Kings Meridian',city:'London',num:'04',sw:['#ece2c8','#2a4a3a','#8a2a2a','#3a3634','#f2c230'],crew:['gaffer','gafferc'],weapon:3,
      note:'A Victorian tube hall dug out to fit the Meridian: one long barrel vault of cream tile over both tracks, a green-and-maroon band, poster frames, a big platform clock and puddles that never dry. The firm come down the stairs singing.',
      lamps:[lamp(-22,5,2,[1.15,.95,.7],10),lamp(-8,5.4,1,[1.15,.95,.7],10),lamp(8,5.4,1,[1.15,.95,.7],10),lamp(22,5,2,[1.15,.95,.7],10),lamp(0,4,-5,[.8,.7,.55],12),lamp(16,1.6,6,[1.0,.8,.5],4)],amb:[.3,.27,.24],cam:{t:[-7,2,1],th:.5,ph:1.18,r:18}}});
  /* the barrel vault: planes round an arc over both tracks and the platform, facing in */
  const R0=9.6+DW*.55, zc=-1.0-DW*.55, yc=2.4, segs=14;
  for(let i=0;i<segs;i++){ const a0=-Math.PI/2+i/segs*Math.PI, a1=-Math.PI/2+(i+1)/segs*Math.PI, am=(a0+a1)/2, len=2*R0*Math.sin((a1-a0)/2);
    const y=yc+Math.cos(am)*R0, z=zc+Math.sin(am)*R0; mk(wplane(SL,len,1.6,1.6),cream,g,0,y,z,am+Math.PI/2,0,0); }
  for(let x=-30;x<=30;x+=6){ for(let i=0;i<segs;i++){ const a=-Math.PI/2+i/segs*Math.PI; if(Math.sin(a)>.1) continue; B(g,C('#2a4a3a'),x,yc+Math.cos(a)*(R0-.05)-.1,zc+Math.sin(a)*(R0-.05),.25,.2,R0*Math.PI/segs*1.02,0,a,0); } }
  /* poster frames on the back wall, a clock, benches, the name board */
  const posters=['#f2c230','#2a6ad8','#c8302a','#2a9a5a','#f27ab0','#e88a3a'];
  for(let k=0;k<8;k++){ const x=-26+k*7.4; const p=M(P2(16,24,(g,w,h)=>{ R(g,posters[k%6],0,0,w,h); ell(g,8,9,5,5,mix(posters[k%6],'#ffffff',.5)); R(g,'#14141c',2,17,12,2); R(g,'#14141c',2,20,8,1); }),{emissive:0x101010});
    B(ST.london.back,C('#14141c'),x,1.2,SZ1-.05,1.3,1.8,.04); mk(wplane(1.2,1.7),p,ST.london.back,x,2.1,SZ1-.08,0,Math.PI,0); }
  const nb=M(textTex(64,16,'#ece2c8',[['KINGS MERIDIAN','c',5,'#1a2a5a']]),{unlit:false}); for(const x of [-12,16]){ B(ST.london.back,C('#1a2a5a'),x,2.3,SZ1-.05,3.4,.7,.04); mk(wplane(3.2,.55),nb,ST.london.back,x,2.65,SZ1-.08,0,Math.PI,0); }
  const clockT=P2(32,32,(g,w,h)=>{ ell(g,16,16,15,15,'#1a1a1c'); ell(g,16,16,13,13,'#f6efe0'); for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; R(g,'#14141c',16+Math.sin(a)*11|0,16-Math.cos(a)*11|0,1,1); } g.strokeStyle='#14141c'; g.lineWidth=1.5; g.beginPath(); g.moveTo(16,16); g.lineTo(16+Math.sin(5.1)*6,16-Math.cos(5.1)*6); g.moveTo(16,16); g.lineTo(16+Math.sin(4.7)*10,16-Math.cos(4.7)*10); g.stroke(); });
  mk(cyl(.7,.7,.16,16),[C('#1a1a1c'),M(clockT,{unlit:true}),M(clockT,{unlit:true})],g,2,4.8,2.4,Math.PI/2); B(g,C('#1a1a1c'),2,5.4,2.4,.05,2.4,.05);
  for(const x of [-18,-4,10,24]){ B(g,M(woodT('#6a4428','#4a2e18',24)),x,.44,6.6,2.2,.06,.5); B(g,M(woodT('#6a4428','#4a2e18',25)),x,.5,6.88,2.2,.6,.06); for(const dx of [-1,1]) B(g,C('#2a4a3a'),x+dx,0,6.6,.06,.44,.45); }
  mk(wplane(SL,.6),M(textTex(64,8,'#d8b020',[['MIND THE GAP','c',2,'#14141c']]),{repeat:[8,1]}),g,0,.006,-1.05,-Math.PI/2);
  /* stairs coming down at the back corner */ for(let k=0;k<10;k++) B(g,C('#4a4642'),26-k*.4,0,7.2,.4,(10-k)*.18,1.8);
  const drop=weaponDrop(g,-4,6.2,'briefcase'); drop.r[1]=Math.PI; ST.london.drop=drop;
  ST.london.spots={gaffer:{x:4,z:1.2,ry:Math.PI*.85},gafferc:{x:2.4,z:2.6,ry:Math.PI*.75},gafferc2:{x:6,z:.4,ry:Math.PI*.95}};
};
const STATION_ORDER=['tokyo','london','naples'];
