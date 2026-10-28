
/* =====================================================================================================
   WHAT THE WIDTH IS FOR. At 8.8 m inside, every car gets a set piece down the middle that turns it into
   a room you fight in: lanes to flank down, cover at waist height, a chokepoint, a perch, places to hide.
   Built in final (widened) coordinates, so nothing here moves.
   ===================================================================================================== */
const PLAY={
  cab:'The last room. The flight deck is a horseshoe you fight round; behind the bulkhead a waist-high spine of traction cabinets splits the crew mess into two lanes, with lockers and bunks to hide in.',
  casino:'Laid out like a real floor. You come in by the bar, cross a raised pit of tables round the pit boss\'s podium (waist-high cover, one step up), then a slot floor of two islands: a centre aisle and a lane down each wall, cross aisles between. The King watches it all from the stage.',
  pool:'Open ground. The pool is a 14 m moat down the middle: wade it slowly or go round. The lifeguard chair is a perch, the hot tub and the bar are the only hard cover.',
  pub:'A brawler\'s room. A long bar to vault and fight behind, booths to pin people in, high tables and stools to throw, and an etched-glass snug screen at the front to break line of sight.',
  trattoria:'Lunch service. Nonna\'s long Sunday table runs down the middle as cover, family tables line both walls, and the kitchen end is a dead end with an oven in it.',
  banya:'Two climates. The sauna end is close quarters round tiered benches and a cold plunge tub, half hidden in steam; through the one door, the ice bar end is bright and open.',
  dimsum:'One way through. Tables fill both sides, the trolleys run the middle lane, and a lacquered moon gate is the only doorway into the half of the car where Lau waits.',
  capsule:'The stealth car. Two storeys of pods line both walls and a pod island runs down the middle, leaving two dim corridors: every pod is a place to hide, or a place for someone to be waiting.',
  aquarium:'Glass everywhere. Column tanks and a long reef tank break the room up; velvet booths along both walls face the middle.',};
for(const W of WAGONS) W.play=PLAY[W.key];

/* 01 · cab: a spine of traction cabinets down the crew mess, cable trays overhead */
CAR_POST.cab=function(){ const g=WG.cab.g, cab=C('#c8ccd2'), dark=C('#2a2e36');
  const rack=M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8dcde'],[1,'#b8bcc0']]); R(g,'#8a8e94',0,0,1,h); for(let y=4;y<h-4;y+=4){ R(g,'#2a2e36',3,y,10,2); R(g,(y/4)%3?'#7cf06a':'#f5c542',4,y,1,1); } },4,301));
  for(const [x0,x1] of [[-11.2,-8.4],[-6.6,-3.8]]){ B(g,F(cab,rack,rack),(x0+x1)/2,0,0,x1-x0,1.25,1.0); B(g,dark,(x0+x1)/2,1.25,0,x1-x0+.06,.05,1.06); }
  for(const s of [-1,1]) B(g,dark,-5,WH-.25,s*1.4,18,.08,.4);
};

/* 02 · casino: laid out like a real floor. Back to front: the bar, a raised pit of table games round a
   pit boss's podium, a slot floor of two back-to-back islands (centre aisle plus a lane down each wall),
   then the stage apron and the King's stage. */
CAR_POST.casino=function(){ const g=WG.casino.g, wood=M(woodT('#3a1e14','#24120c',314,true)), felt=M(fabT('#1f6a3a',315)), gold=C('#d4ad5a'), stool=C('#8a1424');
  const pitC=M(P2(16,16,(g,w,h)=>{ R(g,'#1a3a2a',0,0,w,h); for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8){ ell(g,x+4,y+4,1.6,1.6,'#d4ad5a'); } },6,316));
  /* the bar: stools along it */ for(let k=0;k<5;k++){ const z=-2.4+k*1.2; mk(cyl(.2,.2,.07,10),stool,g,-11.5,.75,z); mk(cyl(.035,.035,.75,6),gold,g,-11.5,.37,z); }
  /* the pit: a raised green dais with a gold edge */
  const PX=-6, PY=.14; B(g,pitC,PX,0,0,8.6,PY,5.8); for(const s of [-1,1]){ B(g,gold,PX,PY-.02,s*2.9,8.64,.04,.06); B(g,gold,PX+s*4.3,PY-.02,0,.06,.04,5.84); }
  /* the pit boss's podium */ B(g,wood,PX,PY,0,.9,1.05,.6); B(g,gold,PX,PY+1.05,0,.96,.04,.66); B(g,U('#8ad8ff'),PX+.2,PY+1.1,0,.04,.28,.4); mk(cyl(.02,.02,.4,6),gold,g,PX-.3,PY+1.25,.2); B(g,U('#fff0c0'),PX-.3,PY+1.42,.2,.1,.06,.1);
  /* roulette */ { const x=PX-2.3, z=-1.5; B(g,wood,x,PY,z,2.8,.8,1.3); B(g,felt,x,PY+.8,z,2.6,.04,1.1); const wh=mk(cyl(.42,.42,.08,20),[wood,WG.casino.wheel,WG.casino.wheel],g,x-1.0,PY+.88,z); WG.casino.anim.push(t=>{ wh.r[1]=t*1.4; });
    for(let k=0;k<4;k++){ const sx=x-.6+k*.5; mk(cyl(.2,.2,.07,10),stool,g,sx,PY+.55,z-.95); mk(cyl(.035,.035,.55,6),gold,g,sx,PY+.27,z-.95); } }
  /* craps */ { const x=PX+2.3, z=-1.5; B(g,wood,x,PY,z,2.8,.9,1.4); B(g,felt,x,PY+.9,z,2.5,.03,1.1); for(const s of [-1,1]) B(g,gold,x,PY+.93,z+s*.62,2.8,.05,.06); for(const [dx,dz] of [[-.4,.1],[-.25,-.05]]) B(g,C('#f2ece0'),x+dx,PY+.93,z+dz,.08,.08,.08,.4); }
  /* two blackjack tables, players on the wall side, dealers facing the podium */
  for(const x of [PX-2.3,PX+2.3]){ const z=1.3; mk(cyl(1.0,1.0,.08,16),[wood,felt,wood],g,x,PY+.8,z); B(g,wood,x,PY,z,.4,.8,.4); for(let k=0;k<5;k++){ const a=-.9+k*.45, cx=x+Math.sin(a)*1.35, cz=z+Math.cos(a)*1.35; mk(cyl(.2,.2,.07,10),stool,g,cx,PY+.5,cz); mk(cyl(.035,.035,.5,6),gold,g,cx,PY+.25,cz); } }
  /* the slot floor: two islands, each two runs of back-to-back machines with a cross aisle */
  const scr=(seed)=>M(P2(16,24,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a1a4a'],[1,'#120a22']]); const r=rng(seed); for(let k=0;k<3;k++){ R(g,'#f2ece0',1+k*5,6,4,8); text(g,r()<.5?'7':'0',2+k*5,7,['#f5c542','#d63a2c','#29e0e6'][k],1); } R(g,'#ff3fa4',0,0,w,3); R(g,'#f5c542',2,18,12,2); }),{unlit:true});
  const sign=M(textTex(48,12,'#121014',[['JACKPOT','c',3,'#f5c542']]),{unlit:true});
  for(const zi of [-1.8,1.8]) for(const x0 of [-.6,4.6]){ for(let i=0;i<4;i++) for(const s of [-1,1]){ const n=N(g,x0+i*.95,0,zi+s*.32,0,s>0?0:Math.PI,0);
      B(n,C(['#2a2a5a','#5a1a3a','#1a4a5a'][(i+s+2)%3]),0,0,0,.8,1.2,.62); mk(wplane(.6,.7),scr(400+i*3+s+(x0>0?20:0)+(zi>0?40:0)),n,0,1.55,.32); B(n,C('#2a2a30'),0,1.2,0,.8,.72,.58); B(n,G('#f5c542'),0,1.92,.05,.82,.12,.66); }
    const xc=x0+1.425; B(g,C('#121014'),xc,2.04,zi,3.0,.4,.08); for(const s of [-1,1]) mk(wplane(2.8,.36),sign,g,xc,2.24,zi+s*.05,0,s>0?0:Math.PI,0); }
  /* stage apron: a gold-edged runway carpet up to the stage */ B(g,M(P2(16,16,(g,w,h)=>{ R(g,'#3a0a14',0,0,w,h); R(g,'#d4ad5a',0,0,w,1); },4,317)),9.4,0,0,2.4,.02,3.2);
};

/* 03 · pool: a hot tub, a lifeguard chair to perch on, a flamingo in the pool */
CAR_POST.pool=function(){ const g=WG.pool.g, white=C('#f4f2ec'), wood=M(woodT('#c8a070','#a88050',321));
  mk(cyl(1.3,1.3,.75,16),wood,g,-9.5,.375,0); mk(cyl(1.15,1.15,.02,16),U('#5ae0f0'),g,-9.5,.66,0);
  for(let k=0;k<8;k++){ const b=mk(cyl(.05,.05,.02,6),U('#e8ffff'),g,-9.5,.68,0), a=k*.8, r0=.2+(k%4)*.22; WG.pool.anim.push(t=>{ b.p=[-9.5+Math.cos(a+t*.6)*r0,.68,Math.sin(a+t*.6)*r0]; }); }
  const lc=N(g,1.5,0,2.7,0,Math.PI,0); for(const [dx,dz] of [[-.4,-.35],[.4,-.35],[-.4,.35],[.4,.35]]) B(lc,white,dx,0,dz,.08,1.8,.08,0,dz*.25,-dx*.15);
  B(lc,C('#e0473a'),0,1.8,0,.9,.1,.7); B(lc,C('#e0473a'),0,1.9,-.33,.9,.7,.08); for(let k=0;k<4;k++) B(lc,white,0,.3+k*.4,.38,.8,.05,.06);
  mk(cyl(.025,.025,1.4,6),white,lc,.35,2.6,-.3); mk(lathe([[0,.9,.9],[.35,.05,.05]],10,{capB:false}),M(stripes('#e0473a','#f2ece0',2),{double:true}),lc,.35,3.25,-.3);
  const fl=N(g,3,.47,.4), pink=C('#ff7ab0'); mk(torus(.42,.16,8,14),pink,fl,0,0,0,Math.PI/2); mk(cyl(.07,.07,.7,8),pink,fl,.4,.35,0,0,0,-.2); B(fl,pink,.48,.66,0,.24,.14,.14); B(fl,C('#2a2a2e'),.62,.66,0,.08,.06,.06);
  WG.pool.anim.push(t=>{ fl.p[1]=.47+Math.sin(t*1.3)*.03; fl.r[1]=Math.sin(t*.2)*.6; });
};

/* 04 · pub: high tables down the middle and an etched-glass snug screen at the front */
CAR_POST.pub=function(){ const g=WG.pub.g, oak=M(woodT('#5a3420','#3a2014',341,true)), brass=C('#d4ad5a');
  for(const x of [-9,-5.5,-2]){ mk(cyl(.06,.06,1.0,6),brass,g,x,.5,.2); mk(cyl(.3,.3,.04,10),C('#2a1408'),g,x,.02,.2); mk(cyl(.45,.45,.05,12),oak,g,x,1.03,.2);
    for(const dz of [-.15,.18]) mk(cyl(.05,.045,.16,8),G('#d8a040'),g,x+dz,1.14,.2+dz*.6); }
  const glass=M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8d8a8'],[1,'#c8b078']]); g.strokeStyle='#f8f0d8'; for(let y=4;y<h;y+=8){ g.beginPath(); g.arc(8,y,4,0,Math.PI*2); g.stroke(); } R(g,'#5a3420',0,0,w,1); }),{emissive:0x2a2010});
  for(const [z0,z1] of [[-3.6,-.9],[.9,3.6]]){ const zc=(z0+z1)/2, wd=z1-z0; B(g,oak,8.6,0,zc,.12,1.0,wd); B(g,glass,8.6,1.0,zc,.05,.9,wd-.1); B(g,oak,8.6,1.9,zc,.14,.08,wd+.04); for(const z of [z0,z1]) B(g,oak,8.6,0,z,.14,1.98,.14); }
};

/* 05 · trattoria: Nonna's long Sunday table down the middle */
CAR_POST.trattoria=function(){ const g=WG.trattoria.g, check=M(P2(16,16,(g,w,h)=>{ for(let y=0;y<h;y+=4) for(let x=0;x<w;x+=4) R(g,((x+y)>>2)%2?'#f4efe6':'#c8302a',x,y,4,4); },4,351)), wood=M(woodT('#8a5a34','#6a4426',352));
  B(g,wood,-7,0,0,9,.72,1.1); B(g,check,-7,.72,0,9.2,.04,1.25); for(const s of [-1,1]) B(g,check,-7,.42,s*.63,9.2,.32,.02);
  for(const s of [-1,1]){ B(g,wood,-7,0,s*.98,8.6,.45,.38); }
  for(let k=0;k<8;k++) for(const s of [-1,1]){ const x=-10.6+k*1.05; mk(cyl(.17,.17,.02,12),C('#f8f6f0'),g,x,.765,s*.36); mk(cyl(.1,.1,.03,10),C(['#c8502a','#e8c460','#6a8a3a'][(k+s+2)%3]),g,x,.78,s*.36); }
  for(let k=0;k<4;k++){ const x=-10+k*2.1; mk(cyl(.05,.06,.3,8),C('#2a5a2a'),g,x,.9,0); B(g,C('#d8a868'),x+.9,.76,0,.5,.12,.2,.3); }
  for(let k=0;k<3;k++){ const x=-9+k*2.6; mk(cyl(.04,.04,.25,6),C('#f2ece0'),g,x,.88,0); B(g,U('#ffd890'),x,1.0,0,.025,.05,.025); }
};

/* 06 · banya: a cold plunge tub in the sauna, an ice bear on the ice side */
CAR_POST.banya=function(){ const g=WG.banya.g, wood=M(woodT('#a87a46','#8a5a30',361)), ice=U('#bfefff'), hoop=C('#3a2a1a');
  B(g,wood,-7.5,0,0,3.2,.95,1.8); mk(wplane(3.0,1.6),U('#7ad0f0'),g,-7.5,.88,0,-Math.PI/2); for(const dx of [-1.2,0,1.2]) B(g,hoop,-7.5+dx,.2,0,.06,.06,1.84); B(g,hoop,-7.5,.7,0,3.24,.06,1.84);
  for(let k=0;k<3;k++) B(g,wood,-5.75,.0+k*.3,0,.3,.06,.6);
  const bear=N(g,12.2,0,2.8,0,-.6,0); B(bear,ice,0,0,0,1.4,.5,1.0); B(bear,ice,0,.5,0,1.0,.8,.8); B(bear,ice,.55,.6,0,.5,.45,.6); B(bear,ice,.85,.75,0,.3,.22,.32); for(const s of [-1,1]) B(bear,ice,.5,1.0,s*.2,.1,.12,.1);
  for(const [dx,dz] of [[-.3,-.25],[-.3,.25],[.3,-.25],[.3,.25]]) B(bear,ice,dx,.5,dz,.22,.0001+.01,.22);
};

/* 07 · dim sum: the moon gate, the only way through to the kitchen half */
CAR_POST.dimsum=function(){ const g=WG.dimsum.g, lac=C('#a81c1c'), gold=C('#d4ad5a'), r=1.45, cy=1.45, X=-5;
  for(let y=0;y<WH-.001;y+=.1){ const dy=y+.05-cy, hw=Math.abs(dy)<r?Math.sqrt(r*r-dy*dy):0; for(const s of [-1,1]) if(WZ-hw>.01) B(g,lac,X,y,s*(hw+WZ)/2,.3,.1,WZ-hw); }
  for(let k=0;k<32;k++){ const a=k/32*Math.PI*2, y=cy+Math.sin(a)*r; if(y<.05) continue; B(g,gold,X,y-.05,Math.cos(a)*r,.34,.1,.3,0,-a); }
  for(const y of [.1,WH-.3]) B(g,gold,X,y,0,.34,.06,WZ*2);
  const plaque=M(textTex(32,12,'#121014',[['GOLDEN CRANE','c',3,'#d4ad5a']]),{unlit:true}); for(const s of [-1,1]) mk(wplane(1.6,.5),plaque,g,X+s*.16,cy+r+.4,0,0,s*Math.PI/2,0);
};

/* 08 · capsule: a two-storey island of pods down the middle, two dim corridors either side */
CAR_POST.capsule=function(){ const g=WG.capsule.g, pod=C('#f4f4ee'), podIn=[U('#ffe8c0'),U('#c8e8ff'),U('#1a1a22')];
  for(const x0 of [-10.4,4.65]) for(let i=0;i<6;i++) for(let lv=0;lv<2;lv++) for(const s of [-1,1]){ const n=N(g,x0+i*1.15,lv*1.25,s*.64);
    B(n,pod,0,0,0,1.1,1.2,1.25); mk(wplane(.9,.85),podIn[(i+lv+(s>0?0:1))%3],n,0,.6,s*.63,0,s>0?0:Math.PI,0); B(n,C('#2a2a34'),0,.05,s*.63,.95,.06,.02); }
  for(const x0 of [-10.4,4.65]){ B(g,C('#c8ccd2'),x0+2.875,2.5,0,6.95,.06,1.3); for(const s of [-1,1]) for(let x=x0;x<x0+6.5;x+=2) B(g,U('#29e0e6'),x+.5,.005,s*2.2,1.2,.01,.04); }
  WG.capsule.spots.ren_c={x:-6,z:2.2,ry:-Math.PI/2}; WG.capsule.spots.ren_c2={x:7,z:-2.2,ry:Math.PI/2};
};

/* 09 · aquarium: a long reef tank down the middle between the column tanks */
CAR_POST.aquarium=function(){ const g=WG.aquarium.g, gold=C('#d4ad5a');
  const reef=M(P2(64,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3ad0e8'],[1,'#1a6a9a']]); const r=rng(391); for(let i=0;i<14;i++){ const x=r()*w|0, hh=3+(r()*7|0); R(g,['#ff6a8a','#ffb040','#c86aff','#5af0a0'][i%4],x,h-hh,2+(r()*3|0),hh); } for(let i=0;i<12;i++) R(g,rgba('#e8ffff',.6),r()*w|0,r()*h*.6|0,1,1); }),{unlit:true});
  B(g,C('#14203a'),0,0,0,6.8,.5,1.1); B(g,F(M(reef.tex,{unlit:true}),reef,reef),0,.5,0,6.6,.9,.95); B(g,gold,0,1.4,0,6.8,.05,1.1); B(g,gold,0,.48,0,6.86,.04,1.14);
  const fish=M(fishTex('gold'),{unlit:true,cut:true,double:true});
  for(let k=0;k<6;k++){ const s=k%2?1:-1, n=mk(plane(.5,.25),fish,g,0,0,0), ph=k*1.3; WG.aquarium.anim.push(t=>{ const u=((t*.15+k/6)%1)*2-1; n.p=[u*3.0*s,.75+(k%3)*.2+Math.sin(t+ph)*.04,s*.5]; n.r=[0,s>0?0:Math.PI,0]; }); }
};


/* the crews: more of them in every car, placed where they would be (at the bar, at a table, on watch).
   Final coordinates; ry -PI/2 faces the rear, where you come in. */
function addCrewSpots(key){ const B_=-Math.PI/2, F_=Math.PI/2, P=Math.PI, add=(k,o)=>{ if(k===key) Object.assign(WG[k].spots,o); };
  add('casino',{king_c:{x:2.0,z:0,ry:B_},king_c2:{x:-6,z:-.75,ry:B_,y:.14},king_c3:{x:-11,z:1.4,ry:B_},king_c4:{x:6,z:3.15,ry:0},king_c5:{x:3,z:-3.15,ry:B_},king_c6:{x:9.3,z:1.4,ry:B_},king_c7:{x:9.3,z:-1.4,ry:B_},king_c8:{x:-3.2,z:2.75,ry:P,y:.14}});
  add('pool',{tremor_c3:{x:-9.6,z:1.9,ry:B_},tremor_c4:{x:1.5,z:2.62,ry:P,y:1.38,pose:'sit'},tremor_c5:{x:8.6,z:-2.5,ry:B_},tremor_c6:{x:-7.6,z:-2.4,ry:B_},tremor_c7:{x:-11.2,z:-2.2,ry:B_}});
  add('pub',{gaffer_c3:{x:-6.75,z:-2.0,ry:P},gaffer_c4:{x:-9,z:.95,ry:B_},gaffer_c5:{x:-5.5,z:-.55,ry:B_},gaffer_c6:{x:-10.95,z:3.75,ry:F_,pose:'sit'},gaffer_c7:{x:10.6,z:1.4,ry:B_},gaffer_c8:{x:.5,z:2.4,ry:B_}});
  add('trattoria',{nonna_c3:{x:-9.5,z:1.05,ry:P,pose:'sit',y:-.04},nonna_c4:{x:-6,z:-1.05,ry:0,pose:'sit',y:-.04},nonna_c5:{x:9,z:-2.5,ry:B_},nonna_c6:{x:5.6,z:2.2,ry:B_},nonna_c7:{x:-12.6,z:1.6,ry:F_}});
  add('banya',{volkov_c2:{x:-9,z:3.15,ry:P,pose:'sit'},volkov_c3:{x:-4,z:-3.15,ry:0,pose:'sit'},volkov_c4:{x:-7.5,z:1.45,ry:B_},volkov_c5:{x:5.4,z:-1.9,ry:P},volkov_c6:{x:11.4,z:.6,ry:B_},volkov_c7:{x:2.2,z:2.6,ry:B_}});
  add('dimsum',{lau_c3:{x:-9.4,z:0,ry:B_},lau_c4:{x:-12.09,z:3.22,ry:1.9,pose:'sit'},lau_c5:{x:2.1,z:-2.51,ry:-1.87,pose:'sit'},lau_c6:{x:10.5,z:1.2,ry:B_},lau_c7:{x:-3,z:-1.1,ry:B_}});
  add('capsule',{ren_c3:{x:-10,z:-2.2,ry:B_},ren_c4:{x:10,z:2.2,ry:B_},ren_c5:{x:-1.6,z:1.5,ry:P,pose:'sit',y:-.08},ren_c6:{x:2.6,z:-2.7,ry:B_}});
  add('aquarium',{lau_c:{x:-8.6,z:1.3,ry:B_},volkov_c:{x:8.6,z:-1.2,ry:B_},gaffer_c:{x:.4,z:2.2,ry:B_}});
  add('cab',{ren_c:{x:3.6,z:-1.6,ry:B_},ren_c2:{x:-8.5,z:2.4,ry:B_},ren_c3:{x:9.9,z:2.4,ry:B_}});
}
