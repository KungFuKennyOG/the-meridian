
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
CAR_POST.pub=function(){ const g=WG.pub.g, oak=M(woodT('#5a3420','#3a2014',341,true)), brass=C('#d4ad5a');
  for(const x of [-9,-5.5,-2]){ mk(cyl(.06,.06,1.0,6),brass,g,x,.5,.25); mk(cyl(.3,.3,.04,10),C('#2a1408'),g,x,.02,.25); mk(cyl(.4,.4,.05,12),oak,g,x,1.03,.25);
    for(const dz of [-.15,.18]) mk(cyl(.05,.045,.16,8),G('#d8a040'),g,x+dz,1.14,.25+dz*.6); }
  const glass=M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8d8a8'],[1,'#c8b078']]); g.strokeStyle='#f8f0d8'; for(let y=4;y<h;y+=8){ g.beginPath(); g.arc(8,y,4,0,Math.PI*2); g.stroke(); } R(g,'#5a3420',0,0,w,1); }),{emissive:0x2a2010});
  const zs=NARROW?[[-2.4,-.8],[.8,2.4]]:[[-3.6,-.9],[.9,3.6]];
  for(const [z0,z1] of zs){ const zc=(z0+z1)/2, wd=z1-z0; B(g,oak,8.6,0,zc,.12,1.0,wd); B(g,glass,8.6,1.0,zc,.05,.9,wd-.1); B(g,oak,8.6,1.9,zc,.14,.08,wd+.04); for(const z of [z0,z1]) B(g,oak,8.6,0,z,.14,1.98,.14); }
};

/* banya: a cold plunge tub in the sauna, an ice bear on the ice side */
CAR_POST.banya=function(){ const g=WG.banya.g, wood=M(woodT('#a87a46','#8a5a30',361)), ice=U('#bfefff'), hoop=C('#3a2a1a');
  const tl=NARROW?2.4:3.2, tw=NARROW?1.1:1.8;
  B(g,wood,-7.5,0,0,tl,.9,tw); mk(wplane(tl-.2,tw-.2),U('#7ad0f0'),g,-7.5,.84,0,-Math.PI/2); for(const dx of [-tl*.38,0,tl*.38]) B(g,hoop,-7.5+dx,.2,0,.06,.06,tw+.04); B(g,hoop,-7.5,.66,0,tl+.04,.06,tw+.04);
  const bear=N(g,12.2,0,WZ-1.0,0,-.6,0); B(bear,ice,0,0,0,1.3,.45,.9); B(bear,ice,0,.45,0,.95,.75,.75); B(bear,ice,.52,.55,0,.48,.42,.56); B(bear,ice,.8,.68,0,.28,.2,.3); for(const s of [-1,1]) B(bear,ice,.48,.93,s*.19,.1,.12,.1);
};

/* dim sum: the moon gate, the only way through to the kitchen half */
CAR_POST.dimsum=function(){ const g=WG.dimsum.g, lac=C('#a81c1c'), gold=C('#d4ad5a'), r=1.4, cy=1.4, X=-5;
  for(let y=0;y<WH-.001;y+=.1){ const dy=y+.05-cy, hw=Math.abs(dy)<r?Math.sqrt(r*r-dy*dy):0; for(const s of [-1,1]) if(WZ-hw>.01) B(g,lac,X,y,s*(hw+WZ)/2,.3,.1,WZ-hw); }
  for(let k=0;k<32;k++){ const a=k/32*Math.PI*2, y=cy+Math.sin(a)*r; if(y<.05) continue; B(g,gold,X,y-.05,Math.cos(a)*r,.34,.1,.3,0,-a); }
  for(const y of [.1,WH-.3]) B(g,gold,X,y,0,.34,.06,WZ*2);
  const plaque=M(textTex(32,12,'#121014',[['GOLDEN CRANE','c',3,'#d4ad5a']]),{unlit:true}); for(const s of [-1,1]) mk(wplane(1.6,.5),plaque,g,X+s*.16,Math.min(WH-.5,cy+r+.35),0,0,s*Math.PI/2,0);
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
