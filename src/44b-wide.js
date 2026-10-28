
/* =====================================================================================================
   EACH CAR AS A ROOM YOU FIGHT IN. On top of the art set's dressing, every car gets what makes it play:
   lanes, waist-high cover, a chokepoint, a perch, places to hide. Sized for the 5.8 m car (WZ is the half width).
   And the crews: who stands where in each car (the art set places one boss and two; these fill the car).
   The order you meet them, back of the train to the front, is the order they get on:
   dim sum (Hong Kong) · banya (Baikal) · pub (London) · trattoria (Naples) · aquarium (the Atlantic tunnel) ·
   pool (Rio) · casino (Las Vegas) · capsule hotel (Tokyo, the last night) · locomotive.
   ===================================================================================================== */
const PLAY={
  cab:'The last room. The flight deck is a horseshoe you fight round; behind the bulkhead a waist-high row of traction cabinets splits the crew mess into two lanes, with lockers and bunks to hide by.',
  casino:'You come in at the bar. Down the middle runs the table pit, a raised row of roulette, craps and blackjack, waist-high cover with a lane down each side between it and the slot machines. The King watches it all from the stage at the far end.',
  pool:'Open ground. The pool is a 14 m moat down the middle: step down into it or go round. The lifeguard chair is a perch, the hot tub and the bar are the only hard cover.',
  pub:'A brawler\'s room. A long bar to fight along, booths to pin people in, high tables and stools to throw, and an etched-glass snug screen at the front to break line of sight.',
  trattoria:'Lunch service. Family tables down both walls with a narrow aisle between, hams hanging overhead, and the kitchen end is a dead end with an oven in it. Nonna sits in the middle of it all.',
  banya:'Two climates. The sauna end is close quarters between tiered benches and a cold plunge tub, half hidden in steam; through the one door, the ice bar end is bright and open.',
  dimsum:'One way through. Round tables fill both sides, the trolleys run the middle lane, and a lacquered moon gate is the only doorway into the half of the car where Lau waits.',
  capsule:'The stealth car. Two storeys of pods line both walls with a lounge in the middle: every pod is a place to hide, or a place for someone to be waiting.',
  aquarium:'The observation car, under the South Atlantic. Whales and shoals past the glass, column tanks and blue velvet booths. What is left of the Espositos has fallen back here from the trattoria.'};
for(const W of WAGONS) W.play=PLAY[W.key];
const NARROW=WZ<3.5;

/* cab: a row of traction cabinets down the crew mess, cable trays overhead */
CAR_POST.cab=function(){ const g=WG.cab.g, cab=C('#c8ccd2'), dark=C('#2a2e36');
  const rack=M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8dcde'],[1,'#b8bcc0']]); R(g,'#8a8e94',0,0,1,h); for(let y=4;y<h-4;y+=4){ R(g,'#2a2e36',3,y,10,2); R(g,(y/4)%3?'#7cf06a':'#f5c542',4,y,1,1); } },4,301));
  for(const [x0,x1] of [[-11.2,-8.4],[-6.6,-3.8]]){ B(g,F(cab,rack,rack),(x0+x1)/2,0,0,x1-x0,1.25,.9); B(g,dark,(x0+x1)/2,1.25,0,x1-x0+.06,.05,.96); }
  for(const s of [-1,1]) B(g,dark,-5,WH-.25,s*1.2,18,.08,.4);
};

/* casino: back to front, the bar with stools, the table pit down the middle (a raised row of tables with a
   lane each side to the slot machines on the walls), a blackjack table, the stage apron, the King's stage */
CAR_POST.casino=function(){ const g=WG.casino.g, wood=M(woodT('#3a1e14','#24120c',314,true)), felt=M(fabT('#1f6a3a',315)), gold=C('#d4ad5a'), stool=C('#8a1424');
  const pitC=M(P2(16,16,(g,w,h)=>{ R(g,'#1a3a2a',0,0,w,h); for(let y=0;y<h;y+=8) for(let x=0;x<w;x+=8) ell(g,x+4,y+4,1.6,1.6,'#d4ad5a'); },6,316));
  for(let k=0;k<3;k++){ const z=-1.1+k*1.1; mk(cyl(.2,.2,.07,10),stool,g,-11.5,.75,z); mk(cyl(.035,.035,.75,6),gold,g,-11.5,.37,z); }
  const PY=.14, X0=-9.6, X1=1.4, PZ=1.12; B(g,pitC,(X0+X1)/2,0,0,X1-X0,PY,PZ*2); for(const s of [-1,1]) B(g,gold,(X0+X1)/2,PY-.02,s*PZ,X1-X0+.04,.04,.06); for(const x of [X0,X1]) B(g,gold,x,PY-.02,0,.06,.04,PZ*2+.04);
  const stools=(x,len)=>{ for(const s of [-1,1]) for(let k=0;k<3;k++){ const sx=x-len/2+.35+k*(len-.7)/2; mk(cyl(.18,.18,.07,10),stool,g,sx,PY+.5,s*.85); mk(cyl(.03,.03,.5,6),gold,g,sx,PY+.25,s*.85); } };
  { const x=-7.6; B(g,wood,x,PY,0,2.6,.8,1.1); B(g,felt,x,PY+.8,0,2.4,.04,.9); const wh=mk(cyl(.38,.38,.08,20),[wood,WG.casino.wheel,WG.casino.wheel],g,x-.9,PY+.88,0); WG.casino.anim.push(t=>{ wh.r[1]=t*1.4; }); stools(x,2.6); }
  { const x=-4.0; B(g,wood,x,PY,0,2.6,.9,1.1); B(g,felt,x,PY+.9,0,2.3,.03,.85); for(const s of [-1,1]) B(g,gold,x,PY+.93,s*.5,2.6,.05,.06); for(const [dx,dz] of [[-.4,.1],[-.25,-.05]]) B(g,C('#f2ece0'),x+dx,PY+.93,dz,.08,.08,.08,.4); stools(x,2.6); }
  { const x=-.5; mk(cyl(.95,.95,.08,16),[wood,felt,wood],g,x,PY+.8,0); B(g,wood,x,PY,0,.4,.8,.4); for(let k=0;k<4;k++){ const a=-1.1+k*.73, cx=x+Math.sin(a)*1.0, cz=Math.cos(a)*.75; mk(cyl(.18,.18,.07,10),stool,g,cx,PY+.5,cz); mk(cyl(.03,.03,.5,6),gold,g,cx,PY+.25,cz); } }
  { const x=4.0; mk(cyl(.95,.95,.08,16),[wood,felt,wood],g,x,.8,-.5); B(g,wood,x,0,-.5,.4,.8,.4); for(let k=0;k<4;k++){ const a=-1.1+k*.73, cx=x+Math.sin(a)*1.25, cz=-.5+Math.cos(a)*1.25; mk(cyl(.2,.2,.07,10),stool,g,cx,.5,cz); mk(cyl(.035,.035,.5,6),gold,g,cx,.25,cz); } }
  B(g,M(P2(16,16,(g,w,h)=>{ R(g,'#3a0a14',0,0,w,h); R(g,'#d4ad5a',0,0,w,1); },4,317)),9.4,0,0,2.4,.02,2.6);
};

/* pool: a hot tub by the bar, a lifeguard chair at the deep end to perch on, a flamingo in the pool */
CAR_POST.pool=function(){ const g=WG.pool.g, white=C('#f4f2ec'), wood=M(woodT('#c8a070','#a88050',321));
  mk(cyl(1.15,1.15,.75,16),wood,g,-9.6,.375,0); mk(cyl(1.0,1.0,.02,16),U('#5ae0f0'),g,-9.6,.66,0);
  for(let k=0;k<8;k++){ const b=mk(cyl(.05,.05,.02,6),U('#e8ffff'),g,-9.6,.68,0), a=k*.8, r0=.2+(k%4)*.2; WG.pool.anim.push(t=>{ b.p=[-9.6+Math.cos(a+t*.6)*r0,.68,Math.sin(a+t*.6)*r0]; }); }
  const lc=N(g,7.75,0,0,0,-Math.PI/2,0); for(const [dx,dz] of [[-.4,-.35],[.4,-.35],[-.4,.35],[.4,.35]]) B(lc,white,dx,0,dz,.08,1.8,.08,0,dz*.25,-dx*.15);
  B(lc,C('#e0473a'),0,1.8,0,.9,.1,.7); B(lc,C('#e0473a'),0,1.9,-.33,.9,.7,.08); for(let k=0;k<4;k++) B(lc,white,0,.3+k*.4,.38,.8,.05,.06);
  const fl=N(g,3,.47,.4), pink=C('#ff7ab0'); mk(torus(.42,.16,8,14),pink,fl,0,0,0,Math.PI/2); mk(cyl(.07,.07,.7,8),pink,fl,.4,.35,0,0,0,-.2); B(fl,pink,.48,.66,0,.24,.14,.14); B(fl,C('#2a2a2e'),.62,.66,0,.08,.06,.06);
  WG.pool.anim.push(t=>{ fl.p[1]=.47+Math.sin(t*1.3)*.03; fl.r[1]=Math.sin(t*.2)*.6; });
};

/* pub: high tables down the middle, an etched-glass snug screen at the front */
CAR_POST.pub=function(){ const g=WG.pub.g, {mA,r}=WG.pub.atl, brass=C('#d4ad5a');
  /* high tables: oak tops on beer barrels, pints on mats (the pole stays as the table's collision inside the barrel) */
  for(const x of [-9,-5.5,-2]){ const p=mk(cyl(.06,.06,1.0,6),brass,g,x,.5,.25); qHide(p); mk(qUV(cyl(.4,.4,.05,16),[r.oak,r.mahog,r.oak]),mA,g,x,1.03,.25);
    const n=N(g,x,0,.25); qL(n,mA,r.oakV,[[0,.26,.26],[.25,.31,.31],[.5,.33,.33],[.75,.31,.31],[1.0,.26,.26]],12,0,0,0); for(const y of [.12,.32,.68,.88]) qT(n,mA,r.iron,y<.5?.29+y*.12:.29+(1-y)*.12,.012,3,14,0,y,0,Math.PI/2);
    for(const [dx,dz,k] of [[-.15,-.09,0],[.18,.11,2]]){ qC(n,mA,[r.oak,k?r.mat2:r.mat1,r.oak],dx,1.057,dz,.05,.05,.004,10); qL(n,mA,k===2?r.stout:r.pint,[[0,.03,.03],[.1,.034,.034],[.13,.04,.04],[.15,.038,.038]],8,dx,1.059,dz); } qNC(n); }
  /* the snug screen: fielded oak below, acid-etched glass above, brass rail */
  const zs=NARROW?[[-2.4,-.8],[.8,2.4]]:[[-3.6,-.9],[.9,3.6]];
  for(const [z0,z1] of zs){ const zc=(z0+z1)/2, wd=z1-z0; qB(g,mA,[r.barPanel,r.barPanel,r.oak,r.oak,r.oak,r.oak],8.6,0,zc,.12,1.0,wd); qB(g,mA,[r.etched,r.etched,r.oak,r.oak,r.oak,r.oak],8.6,1.0,zc,.05,.9,wd-.1); qB(g,mA,r.mahog,8.6,1.9,zc,.14,.08,wd+.04); for(const z of [z0,z1]) qB(g,mA,r.oakV,8.6,0,z,.14,1.98,.14);
    const n=N(g); qBar(n,mA,r.brass,8.6,1.0,zc,wd-.1,.04,.16,'z'); qBar(n,mA,r.brass,8.52,.62,zc,wd-.2,.03,.03,'z'); for(const z of [z0+.25,zc,z1-.25]) qB(n,mA,r.brass,8.54,.58,z,.06,.05,.02); qNC(n); }
};

/* banya: a cold plunge tub in the sauna, an ice bear on the ice side */
CAR_POST.banya=function(){ const g=WG.banya.g, {mA,mU,r}=WG.banya.atl, hoop=C('#3a2a1a');
  const tl=NARROW?2.4:3.2, tw=NARROW?1.1:1.8;
  /* the cold plunge: a hollow staved tub with iron hoops, water near the brim, a ladder over the side (the solid box stays as its collision) */
  const tb=B(g,hoop,-7.5,0,0,tl,.9,tw); qHide(tb); const n=N(g,-7.5,0,0);
  for(const s of [-1,1]){ qB(n,mA,qF(r.tub,r.tub,r.tub,r.wood),0,0,s*(tw/2-.04),tl,.9,.08); qB(n,mA,qF(r.tub,r.tub,r.tub,r.wood),s*(tl/2-.04),0,0,.08,.9,tw-.16);
    qB(n,mA,r.wood,0,.9,s*(tw/2-.04),tl+.04,.035,.11); qB(n,mA,r.wood,s*(tl/2-.04),.9,0,.11,.035,tw-.16); }
  qB(n,mA,r.plank,0,0,0,tl-.16,.06,tw-.16); qPl(n,mU,r.water,0,.8,0,tl-.16,tw-.16,-Math.PI/2);
  for(const y of [.1,.42,.74]){ for(const s of [-1,1]){ qBar(n,mA,r.iron,0,y,s*(tw/2+.006),tl+.03,.05,.014); qBar(n,mA,r.iron,s*(tl/2+.006),y,0,tw+.03,.05,.014,'z'); } }
  for(const s of [-1,1]) qB(n,mA,r.wood,tl/2-.02,.25,s*.18,.04,.85,.04,0,0,-.35); for(let k=0;k<3;k++) qB(n,mA,r.wood,tl/2-.03-k*.1+.15,.4+k*.25,0,.04,.03,.4);
  qNC(n);
  /* the ice bear, carved: same blocks, painted ice, eyes and a nose */
  const bear=N(g,12.2,0,WZ-1.0,0,-.6,0), ice=qF(r.ice,r.ice,r.ice,r.iceTop); qB(bear,mA,ice,0,0,0,1.3,.45,.9); qB(bear,mA,ice,0,.45,0,.95,.75,.75); qB(bear,mA,ice,.52,.55,0,.48,.42,.56); qB(bear,mA,ice,.8,.68,0,.28,.2,.3); for(const s of [-1,1]) qB(bear,mA,ice,.48,.93,s*.19,.1,.12,.1);
  const f=N(bear); for(const s of [-1,1]){ qB(f,mA,r.iron,.765,.9,s*.12,.02,.04,.04); qB(f,mU,r.iceGlow,-.4,0,s*.46,.4,.3,.02); } qB(f,mA,r.iron,.945,.76,0,.02,.06,.08); qB(f,mU,r.iceGlow,0,.0,0,1.5,.04,1.1); qNC(f);
};

/* dim sum: the moon gate, the only way through to the kitchen half */
CAR_POST.dimsum=function(){ const g=WG.dimsum.g, lac=C('#a81c1c'), gold=C('#d4ad5a'), r=1.4, cy=1.4, X=-5, {mA,r:A}=WG.dimsum.atl;
  /* the stepped boxes stay as the gate's collision; what you see is one lacquered slab with a true round opening, gold rings on both faces */
  for(let y=0;y<WH-.001;y+=.1){ const dy=y+.05-cy, hw=Math.abs(dy)<r?Math.sqrt(r*r-dy*dy):0; for(const s of [-1,1]) if(WZ-hw>.01){ const n=B(g,lac,X,y,s*(hw+WZ)/2,.3,.1,WZ-hw); qHide(n); } }
  const v=N(g); mk(qHole(WZ,WH,cy,r,.3,56),WG.dimsum.lacq,v,X,0,0,0,Math.PI/2,0);
  for(const s of [-1,1]){ qT(v,mA,A.frame,r+.04,.05,6,56,X+s*.16,cy,0,0,Math.PI/2,0); qT(v,mA,A.frame,r+.2,.022,4,56,X+s*.155,cy,0,0,Math.PI/2,0);
    qB(v,mA,s>0?[A.plaque,A.blackL,A.blackL,A.blackL,A.blackL,A.blackL]:[A.blackL,A.plaque,A.blackL,A.blackL,A.blackL,A.blackL],X+s*.17,2.9,0,.03,.4,1.3);
    for(const z of [-1,1]){ const zc=z*2.15; qB(v,mA,s>0?[A.splat,A.rose,A.rose,A.rose,A.rose,A.rose]:[A.rose,A.splat,A.rose,A.rose,A.rose,A.rose],X+s*.165,.12,zc,.03,.75,1.2);
      qB(v,mA,s>0?[A.art3,A.blackL,A.blackL,A.blackL,A.blackL,A.blackL]:[A.blackL,A.art2,A.blackL,A.blackL,A.blackL,A.blackL],X+s*.165,1.15,zc+z*.08,.03,1.0,.95); B(v,gold,X+s*.18,2.17,zc+z*.08,.03,.04,1.0); B(v,gold,X+s*.18,1.11,zc+z*.08,.03,.04,1.0); } }
  for(let k=0;k<32;k++){ const a=k/32*Math.PI*2, y=cy+Math.sin(a)*r; if(y<.05) continue; const n=B(g,gold,X,y-.05,Math.cos(a)*r,.34,.1,.3,0,-a); qHide(n); }
  for(const y of [.1,WH-.3]) B(g,gold,X,y,0,.34,.06,WZ*2);
  qNC(v);
};

/* trattoria and the capsule hotel need nothing more: the art set's room is the fight. */

/* the crews in each car, in this car's coordinates; ry -PI/2 faces the back of the car, where you come in */
function addCrewSpots(key){ const B_=-Math.PI/2, F_=Math.PI/2, P=Math.PI, add=(k,o)=>{ if(k===key) Object.assign(WG[k].spots,o); };
  add('casino',{king_c:{x:5.6,z:1.55,ry:B_},king_c2:{x:-5.8,z:-1.55,ry:B_},king_c3:{x:-11,z:1.3,ry:B_},king_c4:{x:7,z:-1.6,ry:P},king_c5:{x:-2.2,z:1.55,ry:B_},king_c6:{x:9.3,z:1.1,ry:B_},king_c7:{x:9.3,z:-1.1,ry:B_},king_c8:{x:2.4,z:.6,ry:B_}});
  add('pool',{tremor_c3:{x:-9.6,z:1.55,ry:B_},tremor_c4:{x:7.75,z:0,ry:B_,y:1.38,pose:'sit'},tremor_c5:{x:8.6,z:-1.9,ry:B_},tremor_c6:{x:-7.6,z:-1.9,ry:B_},tremor_c7:{x:-11.2,z:-1.4,ry:B_}});
  add('pub',{gaffer_c3:{x:-6.75,z:-.95,ry:P},gaffer_c4:{x:-9,z:.95,ry:B_},gaffer_c5:{x:-5.5,z:.95,ry:P},gaffer_c6:{x:-10.95,z:2.25,ry:F_,pose:'sit'},gaffer_c7:{x:10.6,z:.6,ry:B_},gaffer_c8:{x:.5,z:1.2,ry:B_}});
  add('trattoria',{nonna_c3:{x:-11.75,z:1.7,ry:F_,pose:'sit',y:-.04},nonna_c4:{x:-6.65,z:-1.7,ry:B_,pose:'sit',y:-.04},nonna_c5:{x:9,z:-1.05,ry:B_},nonna_c6:{x:5.6,z:1.1,ry:B_},nonna_c7:{x:-12.6,z:.8,ry:F_}});
  add('banya',{volkov_c2:{x:-9,z:1.65,ry:P,pose:'sit'},volkov_c3:{x:-4,z:-1.65,ry:0,pose:'sit'},volkov_c4:{x:-5.2,z:.3,ry:B_},volkov_c5:{x:5.2,z:-.85,ry:P},volkov_c6:{x:11.4,z:.6,ry:B_},volkov_c7:{x:2.2,z:1.5,ry:B_}});
  add('dimsum',{lau_c3:{x:-9.4,z:0,ry:B_},lau_c4:{x:-12.09,z:1.77,ry:1.9,pose:'sit'},lau_c5:{x:2.1,z:-1.06,ry:-1.87,pose:'sit'},lau_c6:{x:10.5,z:.6,ry:B_},lau_c7:{x:-4.2,z:-.3,ry:B_}});
  add('capsule',{ren_c3:{x:-10,z:-.8,ry:B_},ren_c4:{x:10,z:.8,ry:B_},ren_c5:{x:-1.6,z:1.5,ry:P,pose:'sit',y:-.08},ren_c6:{x:2.6,z:-1.4,ry:B_}});
  add('cab',{ren_c:{x:3.6,z:-1.2,ry:B_},ren_c2:{x:-7.5,z:1.2,ry:B_},ren_c3:{x:9.9,z:0,ry:B_}});
  add('aquarium',{nonna_c3:{x:-2.5,z:2.1,ry:Math.PI,pose:'sit'},nonna_c4:{x:4.4,z:-1.3,ry:B_},nonna_c5:{x:9.4,z:.7,ry:B_},nonna_c6:{x:11,z:-2.1,ry:0,pose:'sit'},nonna_c7:{x:-3.6,z:-.9,ry:B_}});
}
