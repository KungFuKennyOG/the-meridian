
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
  const kit=paKit('cab',paCabKit), A=kit.A, S=kit.S, mA=M(A.tex), mS=M(S.tex,{unlit:true});
  const panel=M(kit.walls.upper), gold=C('#d4ad5a');
  const g=shell('cab',{floor:M(kit.walls.floor),floorTile:.6,ceil:M(kit.walls.ceil),dado:M(kit.walls.dado),upper:panel,pier:panel,trim:gold,end:panel,door:M(paDoor('#c8ccd2','#d4ad5a','#bfe0ff')),
    wins:[[4,6.4],[7.2,9.6]],front:'windscreen',lamps:[lamp(11.5,1.6,0,[.3,.6,1.0],4),lamp(6,3,0,[.95,.95,1.05],7),lamp(-2,3,0,[.95,.95,1.05],7),lamp(-10,3,0,[.9,.9,1.0],7),lamp(12.5,3,0,[.9,.9,1.0],5)]});
  const bx=(n,r,x,y,z,w,h,d,ry=0,rx=0,rz=0)=>paBox(n,mA,A,r,x,y,z,w,h,d,ry,rx,rz), lit=(n,r,x,y,z,w,h,d,ry=0)=>paBox(n,mS,S,r,x,y,z,w,h,d,ry);
  const card=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mS,S,r,x,y,z,w,h,ry), pcard=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mA,A,r,x,y,z,w,h,ry);
  const rod=(n,r,rad,len,x,y,z,rx=0,ry=0,rz=0,seg=8)=>paGeo(n,mA,A,r,cyl(rad,rad,len,seg),x,y,z,rx,ry,rz), nc=paNC, hide=paHide;
  WG.cab.paint={bx,lit,card,pcard,rod};
  /* the flight deck: a horseshoe of consoles and two captain's chairs */
  bx(g,{nx:'cfront',top:paRot(A,'ctop',1),side:'navyP'},12.4,0,0,1.6,1.0,WZ*2-1.6); const desk=N(g,12.0,1.0,0,0,0,.3); bx(desk,{top:paRot(A,'ctop',1),side:'navyP'},0,0,0,1.4,.1,WZ*2-1.8);
  /* raised keys over the painted key bank, a padded edge for the driver's wrists */
  for(let k=0;k<10;k++) for(let j=0;j<3;j++) nc(bx(desk,'creamP',.7-(14.55+j*2.8)/24*1.4,.1,-2+(23.3+k*2.05)/64*4,.12,.022,.1)); nc(bx(desk,'cushion',-.68,.1,0,.1,.05,WZ*2-1.9));
  for(const s of [-1,1]){ bx(g,{top:paRot(A,'cside',s<0?0:2),side:'cfront'},10.8,0,s*2.0,2.6,1.0,1.2,s*.35); bx(g,{all:'gold'},10.8,1.0,s*2.0,2.64,.03,1.24,s*.35); }
  [[11.6,-1.4,'route'],[11.8,0,'speed'],[11.6,1.4,'track']].forEach(([x,z,r])=>{ const a=z>0?-.35:z<0?.35:0; card(g,r,x,1.62,z,1.1,.7,-Math.PI/2+a); bx(g,{all:'bezel'},x+.08,1.18,z,.1,.86,1.2,a); });
  for(let i=0;i<14;i++) nc(lit(g,i%4?(i%3?'ledG':'ledA'):'ledR',11.45+(i%2)*.1,1.1,-1.2+i*.18,.05,.025,.05));
  /* throttle levers, the captain's cap, a mug gone cold */
  for(const z of [-.3,.3]){ nc(rod(g,'chrome',.012,.3,11.55,1.25,z,0,0,.5)); nc(paGeo(g,mA,A,'gold',cyl(.035,.035,.05,8),11.48,1.38,z,0,0,.5)); }
  nc(paGeo(g,mA,A,'cap',cyl(.13,.12,.07,12),10.85,1.1,-1.95)); nc(bx(g,'rubber',10.72,1.065,-1.95,.12,.012,.2));
  nc(paGeo(g,mA,A,'mug',cyl(.04,.04,.09,10),10.9,1.06,2.05)); nc(paGeo(g,mA,A,'mug',cyl(.04,.04,.09,10),10.7,1.06,1.7));
  for(const z of [-.9,.9]){ rod(g,'chrome',.05,.42,10.2,.21,z); for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; nc(bx(g,'chrome',10.2+Math.cos(a)*.17,.02,z+Math.sin(a)*.17,.34,.04,.05,-a)); }
    bx(g,{top:'leather',side:'cushion'},10.2,.45,z,.7,.14,.7); bx(g,{px:'leather',side:'cushion'},9.85,.55,z,.14,1.0,.7,0,0,-.12); bx(g,{px:'leather',side:'cushion'},9.78,1.55,z,.12,.24,.42,0,0,-.12);
    for(const s of [-1,1]){ bx(g,'cushion',10.2,.6,z+s*.37,.6,.2,.08); nc(bx(g,'gold',10.2,.8,z+s*.37,.62,.02,.09)); } }
  /* the windscreen: a centre pillar, wipers, sun visors, the overhead switch panel */
  nc(bx(g,'navyP',13.92,1.2,0,.1,1.7,.14)); for(const z of [-1.4,1.4]) nc(bx(g,'rubber',13.9,1.22,z,.02,.9,.025,0,z>0?.55:-.55));
  for(const z of [-1.3,1.3]) nc(bx(g,'visor',13.55,2.7,z,.5,.03,1.5,0,0,.35)); bx(g,{bottom:'cside',side:'navyP'},13.4,2.95,0,1.2,.45,3.8);
  for(const s of [-1,1]) for(const x of [10.6,12.4]){ nc(rod(g,'chrome',.018,1.6,x,1.25,s*(WZ0-.08),0,0,Math.PI/2)); for(const dx of [-.75,.75]) nc(bx(g,'chrome',x+dx,1.23,s*(WZ0-.05),.03,.04,.07)); }
  /* the bulkhead behind the deck: a wall of route screens over it, a sign for the crew coming forward */
  K(bx(g,{side:'navyP',px:'cfront',nx:'cfront',top:'gold'},8.3,0,0,.1,1.1,WZ*2-1.8));
  ['route','cctv','cars','track'].forEach((r,k)=>{ const z=(k-1.5)*WZ*.41; K(card(g,r,8.4,1.6,z,1.1,.7,Math.PI/2)); K(nc(bx(g,{all:'bezel'},8.33,1.1,z,.06,.92,1.18))); });
  K(nc(card(g,'sign',8.27,2.25,0,1.8,.34,-Math.PI/2))); K(nc(bx(g,'navyP',8.3,2.06,0,.05,.4,1.9))); for(const z of [-.8,.8]) K(nc(bx(g,'chrome',8.3,2.46,z,.02,WH-2.46,.02)));
  nc(bx(g,'gold',8.0,0,0,.08,.006,WZ*2-.4));
  /* crew mess: lockers with caps and kit bags on top */
  for(let x=-13.4;x<-4;x+=.7){ bx(g,{front:'locker',side:'creamP',top:'creamP'},x,0,-2.55,.68,2.2,.62); nc(bx(g,'chrome',x+.2,.98,-2.225,.025,.14,.03)); nc(bx(g,'navyP',x,2.1,-2.235,.66,.05,.02)); }
  /* mouldings: a navy skirting, a gold chair rail on the dado, a cream cornice with a gold bead */
  for(const s of [-1,1]){ const sg=WG.cab.side[s], z=s*(WZ0-.03); nc(bx(sg,'navyP',0,0,z,WL,.12,.06)); nc(bx(sg,'gold',0,.975,z,WL,.05,.06)); nc(bx(sg,'creamP',0,WH-.14,z,WL,.14,.12)); nc(bx(sg,'gold',0,WH-.155,z,WL,.016,.13)); }
  for(const x of [-12.7,-10.6,-7.8,-5.7]) nc(bx(g,{side:'blanket',top:'blanket'},x,2.2,-2.6,.55,.28,.4,.2)); for(const x of [-11.9,-6.4]) nc(paGeo(g,mA,A,'cap',cyl(.13,.12,.07,12),x,2.24,-2.55));
  /* galley: cupboards, steel worktop, microwave, coffee machine, kettle, a sink, mugs; wall cupboards above */
  hide(bx(g,'creamP',2,0,-2.5,3.6,.95,.7)); for(let k=0;k<3;k++){ nc(bx(g,{front:'cupb',side:'creamP',top:'steel'},.8+k*1.2,0,-2.5,1.2,.95,.7)); nc(bx(g,{all:'steel'},.8+k*1.2,.95,-2.5,1.21,.04,.74)); }
  bx(g,{front:'micro',side:'navyP'},.65,.99,-2.62,.52,.32,.38); bx(g,{front:'coffee',side:'navyP'},1.35,.99,-2.64,.32,.44,.32);
  nc(paGeo(g,mA,A,'thermos',cyl(.07,.08,.2,10),1.9,1.09,-2.6)); nc(bx(g,'rubber',3.15,.995,-2.5,.56,.006,.4)); nc(rod(g,'chrome',.015,.28,3.15,1.13,-2.76)); nc(rod(g,'chrome',.012,.16,3.15,1.26,-2.69,Math.PI/2));
  for(let k=0;k<3;k++) nc(paGeo(g,mA,A,'mug',cyl(.04,.04,.09,10),2.3+k*.14,1.04,-2.3+(k%2)*.06));
  for(let k=0;k<3;k++) nc(bx(g,{front:'cupb',side:'creamP',bottom:'creamP',top:'creamP'},.8+k*1.2,1.65,-2.7,1.19,.6,.34)); nc(bx(g,'gold',2,1.64,-2.53,3.6,.015,.02));
  /* the mess table: plates, mugs, a thermos, the paper, a deck of cards */
  bx(g,'chrome',2,0,1.2,.1,.75,.1); nc(bx(g,'chrome',2,0,1.2,.5,.03,.5)); bx(g,{top:'tabletop',side:'gold'},2,.75,1.2,2.4,.05,1.1);
  for(const s of [-1,1]) K(bx(g,{top:'cushion',side:'navyP'},2,0,1.2+s*.85,2.4,.45,.45)); K(bx(g,{side:'cushion',top:'navyP'},2,.45,2.4,2.4,.55,.12));
  for(const [x,z] of [[1.3,.9],[2.6,1.5]]){ nc(paGeo(g,mA,A,'plate',cyl(.13,.1,.02,14),x,.81,z)); nc(paGeo(g,mA,A,'mug',cyl(.04,.04,.09,10),x+.25,.845,z-.08)); }
  nc(paGeo(g,mA,A,'thermos',cyl(.06,.06,.26,10),2.1,.93,1.25)); nc(bx(g,{top:paRot(A,'paper',1),side:'creamP'},1.7,.8,1.45,.32,.01,.44,.2)); nc(bx(g,{top:'mug',side:'creamP'},2.9,.8,.95,.09,.03,.06,.5));
  /* bunks: frames, posts, a ladder, made-up blankets and pillows, a curtain half drawn on the top bunk */
  for(const x of [-2.5,-8]){ for(const y of [.4,1.6]){ bx(g,{side:'creamP',top:'creamP'},x,y,2.3,2.2,.12,1.0); bx(g,{top:'blanket',side:'blanket'},x,y+.12,2.3,2.0,.14,.9); nc(bx(g,'pillow',x-.78,y+.26,2.3,.36,.1,.6)); }
    for(const dx of [-1.08,1.08]) nc(bx(g,'chrome',x+dx,0,1.83,.04,2.2,.04)); for(let k=0;k<5;k++) nc(bx(g,'chrome',x+1.12,.35+k*.35,1.82,.03,.025,.04)); nc(bx(g,'chrome',x+1.2,0,1.82,.03,2.0,.03));
    nc(bx(g,'curtain',x-.55,1.88,1.82,1.0,.62,.02)); nc(bx(g,'chrome',x,2.52,1.82,2.2,.02,.02)); nc(card(g,'night',x-.9,2.35,2.86,.16,.06,Math.PI)); }
  /* the walls: a route poster, a first-aid box, the clock, an intercom, extinguishers */
  const sN=WG.cab.side[-1], sP=WG.cab.side[1], zN=-(WZ0-.02), zP=WZ0-.02;
  pcard(sN,'poster',-2.1,1.7,zN,.9,.68); nc(bx(sN,{front:'aid',side:'creamP'},-.55,1.5,zN+.06,.34,.34,.12));
  pcard(sP,'poster',-11.6,1.7,zP,.9,.68,Math.PI); pcard(sP,'clock',-5.2,2.25,zP,.36,.36,Math.PI); pcard(sP,'intercom',-4.6,1.35,zP,.22,.22,Math.PI); pcard(sN,'intercom',9.9,1.35,zN,.22,.22);
  for(const [sg,x,z] of [[sN,-3.6,zN+.12],[sP,-12.9,zP-.12]]){ nc(paGeo(sg,mA,A,'ext',cyl(.08,.08,.5,10),x,.33,z)); nc(bx(sg,'rubber',x,.58,z,.06,.06,.06)); nc(bx(sg,'rubber',x,.55,z+(z>0?.04:-.04),.03,.03,.14)); }
  /* ceiling: light fittings in chrome frames */
  for(const x of [-10,-4,2]){ nc(bx(g,'chrome',x,WH-.05,0,3.1,.05,.3)); nc(lit(g,'lamp',x,WH-.07,0,3,.025,.22)); }
};

/* ---------- 02 · the King's casino ---------- */
CAR_BUILD.casino=function casino(){
  const kit=paKit('casino',paCasinoKit), A=kit.A, S=kit.S, mA=M(A.tex), mS=M(S.tex,{unlit:true}), gold=C('#d4ad5a'), wood=M(kit.walls.dado), damask=M(kit.walls.damask);
  const g=shell('casino',{floor:M(kit.walls.carpet),floorTile:1.2,ceil:M(kit.walls.ceil,{emissive:0x14100c}),ceilTile:1.2,dado:wood,upper:damask,pier:damask,trim:gold,end:wood,door:M(paDoor('#4a2416','#d4ad5a','#ffd890')),rail:gold,
    wins:winsEvery(5,1.6),lamps:[lamp(-9,2.8,0,[1.3,.95,.6],7),lamp(-2,2.8,0,[1.3,.95,.6],7),lamp(5,2.8,0,[1.3,.95,.6],7),lamp(11.5,2.6,0,[1.6,.6,1.0],5),lamp(12.5,1.4,-1.5,[1.4,1.1,.5],3.5),lamp(-12.5,1.8,0,[1.0,.7,.4],4)],minLamp:.7,ambK:.7});
  const bx=(n,r,x,y,z,w,h,d,ry=0,rx=0,rz=0)=>paBox(n,mA,A,r,x,y,z,w,h,d,ry,rx,rz), lit=(n,r,x,y,z,w,h,d,ry=0)=>paBox(n,mS,S,r,x,y,z,w,h,d,ry);
  const card=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mS,S,r,x,y,z,w,h,ry), pcard=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mA,A,r,x,y,z,w,h,ry), nc=paNC;
  const geoA=(n,r,geo,x,y,z,rx=0,ry=0,rz=0)=>paGeo(n,mA,A,r,geo,x,y,z,rx,ry,rz), cylA=(n,o,rt,rb,h,seg,x,y,z,rx=0,ry=0,rz=0)=>paCyl(n,mA,A,o,rt,rb,h,seg,x,y,z,rx,ry,rz);
  WG.casino.paint={bx,lit,card,pcard,geoA,cylA,A,S,mA,mS};
  /* slot machines along both walls: lacquered cabinets, a button deck, chrome-framed reels, a lit belly and a topper */
  const lacs=['lacR','lacP','lacB'];
  for(const s of [-1,1]) for(let i=0;i<9;i++){ const x=-10.5+i*2.4,z=s*2.4,n=N(WG.casino.side[s],x,0,z,0,s<0?0:Math.PI,0), L=lacs[i%3], v=(i+(s>0?1:0))%3;
    bx(n,{side:L,front:'door',top:'dark'},0,0,0,.8,.92,.62); nc(card(n,'belly',0,.62,.312,.42,.42)); nc(bx(n,'chrome',0,.36,.33,.5,.05,.05));
    nc(bx(n,{top:'deck',side:L,front:'dark'},0,.92,.1,.84,.07,.5)); bx(n,{side:L,front:'dark',top:'dark'},0,.99,-.02,.8,.78,.58);
    nc(card(n,'reel'+v,0,1.4,.276,.58,.44)); for(const [dy,hh] of [[1.17,.04],[1.62,.04]]) nc(bx(n,'chrome',0,dy,.285,.66,hh,.03)); for(const dx of [-.31,.31]) nc(bx(n,'chrome',dx,1.17,.285,.04,.49,.03));
    nc(bx(n,{side:L,front:'dark',top:'chrome'},0,1.77,0,.8,.34,.56)); nc(card(n,'top'+v,0,1.94,.282,.76,.3)); nc(bx(n,'chrome',0,2.11,0,.84,.03,.6));
    nc(geoA(n,'chrome',cyl(.018,.018,.42,6),.45,1.2,.05,0,0,-.25)); nc(cylA(n,{side:'lacR'},.05,.05,.07,10,.5,1.42,.05)); nc(bx(n,'chrome',.41,.95,.05,.04,.12,.12)); }
  /* the wall: a gold-framed frieze of panels above the windows, sconces between the windows, a dark skirting */
  for(const s of [-1,1]){ const sg=WG.casino.side[s], z=s*(WZ0-.03), ry=s<0?0:Math.PI;
    for(let k=0;k<8;k++){ const x0=-WL/2+k*WL/8+.12, x1=-WL/2+(k+1)*WL/8-.12; for(const y of [2.72,3.16]) nc(bx(sg,'gold',(x0+x1)/2,y,z,x1-x0,.035,.04)); for(const xx of [x0,x1]) nc(bx(sg,'gold',xx,2.72,z,.035,.475,.04)); }
    nc(bx(sg,'gold',0,WH-.16,z,WL,.05,.08)); nc(bx(sg,'dark',0,WH-.11,z,WL,.11,.12)); nc(bx(sg,'dark',0,0,z,WL,.1,.05));
    for(const x of [-9.3,-3.1,3.1,9.3]){ nc(bx(sg,'gold',x,2.15,z,.12,.28,.04)); nc(bx(sg,'gold',x,2.22,z-s*.08,.03,.03,.16)); nc(paGeo(sg,mS,S,'shade',cyl(.07,.12,.18,10,{open:true}),x,2.33,z-s*.16)); nc(lit(sg,'bulb',x,2.22,z-s*.16,.05,.06,.05)); } }
  /* coffered ceiling: gold beams across, chandeliers of gold rings and crystal drops between them */
  for(const x of [-12.6,-9.8,-7,-4.2,-1.4,1.4,4.2,7,9.8,12.6]) nc(bx(g,'gold',x,WH-.1,0,.1,.1,WZ*2));
  for(const z of [-1.5,1.5]) K(nc(bx(g,'gold',0,WH-.08,z,WL,.08,.08)));
  for(const x of [-9,-2,5]){ nc(cylA(g,{side:'gold'},.18,.22,.06,14,x,WH-.03,0)); nc(geoA(g,'gold',cyl(.015,.015,.4,6),x,WH-.25,0));
    for(const [r,y,n] of [[.5,2.95,16],[.32,2.75,11]]){ nc(geoA(g,'gold',torus(r,.025,4,18),x,y,0,Math.PI/2)); for(let k=0;k<n;k++){ const a=k/n*Math.PI*2; nc(lit(g,'crystal',x+Math.cos(a)*r,y-.2,Math.sin(a)*r,.045,.18,.045,a)); } }
    for(let k=0;k<6;k++){ const a=k/6*Math.PI*2; nc(bx(g,'gold',x+Math.cos(a)*.25,2.94,Math.sin(a)*.25,.5,.02,.02,-a)); nc(paGeo(g,mS,S,'bulb',cyl(.03,.02,.07,6),x+Math.cos(a)*.5,3.0,Math.sin(a)*.5)); }
    nc(lit(g,'crystal',x,2.42,0,.1,.3,.1,.78)); }
  /* the roulette wheel: numbered pockets, gold frets, a turret */
  const wheel=M(P2(64,64,(g,w,h)=>{ ell(g,32,32,32,32,'#4a2410'); const reds=[32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];
    for(let k=0;k<37;k++){ const a=k/37*Math.PI*2,a2=(k+1)/37*Math.PI*2; poly(g,[[32+Math.cos(a)*18,32+Math.sin(a)*18],[32+Math.cos(a)*29,32+Math.sin(a)*29],[32+Math.cos(a2)*29,32+Math.sin(a2)*29],[32+Math.cos(a2)*18,32+Math.sin(a2)*18]],k===0?'#2a9a5a':k%2?'#c8202a':'#121014');
      g.strokeStyle='#d4ad5a'; g.lineWidth=.5; g.beginPath(); g.moveTo(32+Math.cos(a)*18,32+Math.sin(a)*18); g.lineTo(32+Math.cos(a)*29,32+Math.sin(a)*29); g.stroke(); }
    g.strokeStyle='#d4ad5a'; g.lineWidth=1; g.beginPath(); g.arc(32,32,29.5,0,7); g.stroke(); g.beginPath(); g.arc(32,32,24,0,7); g.lineWidth=.4; g.stroke();
    radial(g,30,30,18,[[0,'#a8603a'],[1,'#5a2a14']]); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; R(g,'#d4ad5a',32+Math.cos(a)*12-.6,32+Math.sin(a)*12-.6,1.2,1.2); } ell(g,32,32,5,5,'#d4ad5a'); ell(g,31,31,2,2,'#fff0b8');
    for(let k=0;k<4;k++){ const a=k/4*Math.PI*2+.4; g.strokeStyle='#e8c870'; g.lineWidth=1.2; g.beginPath(); g.moveTo(32,32); g.lineTo(32+Math.cos(a)*10,32+Math.sin(a)*10); g.stroke(); } ell(g,32+Math.cos(1)*26,32+Math.sin(1)*26,1.2,1.2,'#ffffff'); },0,11));
  WG.casino.wheel=wheel;
  /* the stage: boards in a lit frame, footlights, pleated velvet curtains under a scalloped valance, the marquee, speakers, a lighting truss */
  const boards=M(paTex(32,32,(g,w,h)=>{ for(let k=0;k<8;k++) vfill(g,0,k*4,w,4,[[0,['#6a3a1e','#5a3018','#7a4426','#623418'][k%4]],[.85,'#3a1e0e'],[1,'#1a0a04']]); for(let k=0;k<8;k++) R(g,'#1a0a04',(k*13)%w,k*4,.5,4); for(let k=0;k<20;k++) R(g,rgba('#000000',.1),(k*7)%w,(k*5)%h,3,.3); },3,807));
  for(let k=0;k<4;k++){ const zc=-WZ+WZ*2*(k+.5)/4; bx(g,{nx:'stageF',side:'dark',top:'dark'},12.3,0,zc,3.2,.45,WZ*2/4); }
  nc(mk(wplane(3.2,WZ*2,.8,.8),boards,g,12.3,.452,0,-Math.PI/2)); nc(bx(g,'gold',10.72,.42,0,.06,.05,WZ*2));
  for(let k=0;k<11;k++) nc(lit(g,'foot',10.76,.45,-2.5+k*.5,.08,.06,.14));
  for(const s of [-1,1]) for(let k=0;k<5;k++){ const zc=s*(.95+k*.4); nc(bx(g,'velvet',13.6+(k%2)*.08,.45,zc,.1,2.9,.42,0)); }
  for(let k=0;k<9;k++){ const zc=-WZ+.32+k*(WZ*2-.64)/8; nc(bx(g,'velvet',13.5,2.85,zc,.14,.55-(k%2)*.12,.72)); } nc(bx(g,'gold',13.42,3.3,0,.1,.06,WZ*2));
  nc(mk(wplane(1.8,2.4),C('#120a0a'),g,13.94,1.65,0,0,-Math.PI/2,0)); nc(card(g,'marquee',13.9,2.3,0,1.5,.38,-Math.PI/2));
  geoA(g,'chrome',cyl(.015,.015,1.5,6),11.9,1.2,0); nc(geoA(g,'chrome',cyl(.12,.14,.03,12),11.9,.47,0)); nc(cylA(g,{side:'dark',top:'chrome'},.03,.025,.12,8,11.9,1.98,0,0,0,.3));
  for(const s of [-1,1]){ bx(g,{nx:'speaker',side:'dark'},13.2,.45,s*2.45,.5,.75,.5); nc(bx(g,{nx:'speaker',side:'dark'},13.2,1.2,s*2.45,.42,.45,.42)); }
  nc(bx(g,'chrome',11.2,3.15,0,.08,.08,WZ*2)); for(const z of [-1.8,-.6,.6,1.8]){ nc(cylA(g,{side:'dark',bottom:'foot'},.08,.1,.22,10,11.2,3.0,z,0,0,-.4)); }
  /* the bar at the back: mahogany panels, a padded rail and a brass foot rail, the back bar of bottles on lit shelves */
  for(let k=0;k<6;k++){ const zc=-2.1+.35+k*.7; bx(g,{px:'mahog',side:'dark',top:'woodTop'},-12.5,0,zc,.7,1.1,.7); }
  for(let k=0;k<6;k++) nc(bx(g,{top:paRot(A,'woodTop',1),side:'woodTop'},-12.45,1.1,-(WZ-.75)+(WZ*2-1.5)*(k+.5)/6,.86,.05,(WZ*2-1.5)/6)); nc(bx(g,'rail',-12.08,1.1,0,.1,.07,WZ*2-1.5)); nc(geoA(g,'brass',cyl(.025,.025,WZ*2-1.6,8),-12.0,.18,0,Math.PI/2));
  for(const z of [-1.6,-.6,.4,1.4]) nc(bx(g,'brass',-12.05,0,z,.03,.18,.03));
  for(const [z0,z1] of [[-WZ+.15,-.75],[.75,WZ-.15]]){ const zc=(z0+z1)/2, wd=z1-z0; K(nc(card(g,'backbar',-13.96,1.75,zc,wd,1.1,Math.PI/2)));
    for(const y of [1.25,1.7,2.15]) K(nc(bx(g,'woodTop',-13.82,y,zc,.28,.04,wd))); for(let k=0;k<Math.floor(wd/.16);k++) for(const y of [1.29,1.74]){ const b='b'+((k+(y>1.5?1:0))%4); K(nc(paGeo(g,mA,A,b,lathe([[0,.035,.035],[.16,.04,.04],[.2,.015,.015],[.28,.012,.012]],8),-13.82,y,z0+.1+k*.16))); } }
  K(nc(card(g,'cashier',-13.9,2.6,0,1.6,.4,Math.PI/2)));
  for(let k=0;k<5;k++) nc(paGeo(g,mA,A,'glass',cyl(.035,.03,.1,8),-12.35,1.2,-1.5+k*.7)); for(const z of [-.3,.3]){ nc(geoA(g,'brass',cyl(.02,.02,.4,6),-12.6,1.35,z)); nc(bx(g,'brass',-12.55,1.5,z,.12,.02,.02)); }
  WG.casino.spots={king:{x:12.0,z:-.4,ry:-Math.PI/2,y:.45},king_c:{x:4.2,z:1.3,ry:-Math.PI/2},king_c2:{x:-6.8,z:-1.6,ry:Math.PI/2}};
};

/* ---------- 03 · Copacabana pool deck ---------- */
CAR_BUILD.pool=function pool(){
  const kit=paKit('pool',paPoolKit), A=kit.A, S=kit.S, mA=M(A.tex), mS=M(S.tex,{unlit:true}), mCut=M(A.tex,{cut:true,double:true}), white=C('#f4f2ec');
  const water=M(P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#38d0e0'],[1,'#22aacc']]); const r=rng(22);
    for(let i=0;i<46;i++){ const x=r()*w,y=r()*h,s=3+r()*5; g.strokeStyle=rgba('#e8ffff',.35+r()*.3); g.lineWidth=.5+r()*.6; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+s*.5,y-s*.4,x+s,y+r()*1.5-.5); g.quadraticCurveTo(x+s*1.4,y+s*.3,x+s*1.9,y-.2); g.stroke(); }
    for(let i=0;i<18;i++) ell(g,r()*w,r()*h,2+r()*3,1,rgba('#1a8ab0',.25)); for(let i=0;i<30;i++) R(g,rgba('#ffffff',.6),r()*w,r()*h,1.2,.4); },0),{unlit:true,color:[.92,.98,1]});
  const g=shell('pool',{floor:M(kit.walls.deck),floorTile:1.2,dado:M(kit.walls.wall),upper:white,pier:white,trim:C('#2a9a5a'),end:M(kit.walls.end),door:M(paDoor('#2a9a5a','#f2c230','#fff4d8')),lo:.9,hi:3.2,noTop:true,
    wins:[[-13.6,13.6]],lamps:[lamp(-10,2.5,0,[1.0,.8,.6],6),lamp(11.5,2.2,0,[1.4,.4,1.0],5),lamp(0,1.0,0,[.3,.9,1.0],6)],sunK:1.15,ambK:1.1});
  const bx=(n,r,x,y,z,w,h,d,ry=0,rx=0,rz=0)=>paBox(n,mA,A,r,x,y,z,w,h,d,ry,rx,rz), lit=(n,r,x,y,z,w,h,d,ry=0)=>paBox(n,mS,S,r,x,y,z,w,h,d,ry);
  const card=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mS,S,r,x,y,z,w,h,ry), pcard=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mA,A,r,x,y,z,w,h,ry), nc=paNC, hide=paHide;
  const geoA=(n,r,geo,x,y,z,rx=0,ry=0,rz=0)=>paGeo(n,mA,A,r,geo,x,y,z,rx,ry,rz), cylA=(n,o,rt,rb,h,seg,x,y,z,rx=0,ry=0,rz=0)=>paCyl(n,mA,A,o,rt,rb,h,seg,x,y,z,rx,ry,rz);
  WG.pool.paint={bx,lit,card,pcard,geoA,cylA,A,S,mA,mS,mCut};
  /* the low wall: a green coping and a chrome rail on posts, open to the sky above */
  for(const s of [-1,1]){ const sg=WG.pool.side[s], z=s*(WZ0-.06); nc(bx(sg,{top:'green',side:'green'},0,.9,z,WL-.8,.06,.2)); for(let k=0;k<8;k++) nc(geoA(sg,paRot(A,'chrome',1),cyl(.025,.025,(WL-.8)/8,8),-(WL-.8)/2+(WL-.8)*(k+.5)/8,1.32,z,0,0,Math.PI/2));
    for(let x=-13.2;x<13.3;x+=1.65) nc(geoA(sg,'chrome',cyl(.02,.02,.42,6),x,1.12,z)); }
  /* the pool, raised in a tiled rim with travertine coping, a mosaic band at the waterline, a chrome ladder */
  for(const s of [-1,1]){ hide(B(g,white,0,0,s*1.5,14,.55,.2)); hide(B(g,white,s*6.9,0,0,.2,.55,3.2)); }
  for(const s of [-1,1]){ for(let k=0;k<14;k++){ nc(bx(g,{side:'tileW',top:'coping'},-6.5+k,0,s*1.5,1,.55,.2)); nc(bx(g,{top:'coping',side:'coping'},-6.5+k,.55,s*1.53,1.0,.05,.3)); } for(let k=0;k<14;k++) nc(bx(g,'mosaic',-6.3+k*.97,.42,s*1.395,.97,.13,.01));
    for(let k=0;k<3;k++){ const zc=-1.07+k*1.07; nc(bx(g,{side:'tileW',top:'coping'},s*6.9,0,zc,.2,.55,1.07)); nc(bx(g,'coping',s*6.93,.55,zc,.3,.05,1.07)); } nc(bx(g,'mosaic',s*6.795,.42,0,.01,.13,2.8)); }
  mk(wplane(13.6,2.8,1.6,1.6),water,g,0,.45,0,-Math.PI/2); B(g,C('#2a90a8'),0,0,0,13.6,.44,2.8); WG.pool.anim.push(t=>{ water.rep=[1+Math.sin(t*.7)*.02,1]; });
  for(const z of [-1.0,-.6]){ nc(geoA(g,'chrome',cyl(.022,.022,.85,8),-6.62,.6,z)); nc(geoA(g,'chrome',cyl(.022,.022,.3,8),-6.77,1.02,z,0,0,Math.PI/2)); nc(geoA(g,'chrome',cyl(.022,.022,.3,8),-6.92,.88,z)); }
  for(const y of [.15,.32]) nc(bx(g,'chrome',-6.58,y,-.8,.08,.025,.4));
  /* loungers: aluminium frames, slatted beds, striped cushions, a rolled towel at the head */
  for(const s of [-1,1]) for(let i=0;i<5;i++){ const x=-6+i*3,z=s*2.3,n=N(g,x,0,z,0,s<0?.0:Math.PI,0), cu=i%2?'cushT':'cushY';
    hide(B(n,white,0,0,0,1.6,.28,.6)); for(const dx of [-.72,.72]) for(const dz of [-.26,.26]) nc(bx(n,'white',dx,0,dz,.05,.24,.05)); for(const dz of [-.28,.28]) nc(bx(n,'white',0,.2,dz,1.6,.05,.04));
    nc(bx(n,{top:'slats',side:'white'},.1,.22,0,1.3,.03,.56)); nc(bx(n,{top:cu,side:cu},.12,.25,0,1.25,.07,.54)); nc(bx(n,{top:'slats',side:'white'},-.68,.3,0,.55,.03,.56,0,0,.7)); nc(bx(n,{top:cu,side:cu},-.66,.33,0,.5,.07,.54,0,0,.7));
    nc(geoA(n,i%2?'towel2':'towel',cyl(.07,.07,.5,10),-.42,.36,0,Math.PI/2)); if(i%2===0) nc(bx(n,{top:i%4?'towel2':'towel',side:'towel'},.5,.32,0,.42,.03,.36,.2)); }
  /* umbrellas with tables round the poles: drinks with straws, a magazine, a cooler */
  const canopy=[[0,1.05,1.05],[.18,.7,.7],[.38,.08,.08],[.42,.02,.02]];
  [[-4.5,'umbR'],[1.5,'umbY'],[7.5,'umbR']].forEach(([x,u])=>{ for(const s of [-1,1]){ if(x===1.5&&s>0) continue; const z=s*2.4;
    geoA(g,'chrome',cyl(.025,.025,2.3,6),x,1.15,z); nc(paGeo(g,mCut,A,u,lathe(canopy,16,{capB:false}),x,2.05,z)); nc(geoA(g,'chrome',cyl(.035,.035,.1,8),x,2.5,z)); nc(bx(g,'chrome',x,1.4,z,.06,.05,.06));
    nc(cylA(g,{side:'white',top:'white'},.28,.28,.03,16,x,.55,z)); nc(geoA(g,'white',cyl(.03,.03,.55,6),x,.27,z)); nc(geoA(g,'white',cyl(.2,.22,.03,10),x,.015,z));
    nc(geoA(g,'glass',cyl(.035,.025,.12,8),x+.15,.63,z-s*.08)); nc(geoA(g,'glass2',cyl(.035,.025,.12,8),x-.12,.63,z-s*.14)); nc(bx(g,'red',x+.16,.66,z-s*.08,.006,.14,.006,0,0,.3)); nc(bx(g,{top:'mag',side:'white'},x+.02,.57,z+s*.12,.2,.006,.15,.4)); } });
  nc(bx(g,{side:'cooler',top:'white'},4.4,0,2.55,.5,.35,.32)); nc(geoA(g,'ball',lathe([[0,.01,.01],[.05,.14,.14],[.15,.16,.16],[.25,.14,.14],[.3,.01,.01]],10),-1.5,0,2.0));
  for(const [x,z] of [[-6.4,1.95],[3.2,-1.95],[6,1.95]]) for(const dz of [-.06,.06]) nc(bx(g,dz<0?'red':'cushT',x,0,z+dz,.24,.015,.09,.1));
  /* palms in painted pots: ringed trunks, arching fronds */
  for(const x of [-8.5,8.5]) for(const s of [-1,1]){ const z=s*2.4; cylA(g,{side:'pot',top:'trunk'},.3,.24,.6,12,x,.3,z); nc(geoA(g,'pot',torus(.31,.04,4,14),x,.6,z,Math.PI/2));
    nc(geoA(g,'trunk',cyl(.08,.1,1.0,8),x+.03,1.1,z,0,0,.06)); nc(geoA(g,'trunk',cyl(.07,.08,.9,8),x+.1,2.0,z,0,0,.12)); hide(B(g,C('#7a5a3e'),x,.6,z,.12,1.8,.12,0,0,.1));
    for(let k=0;k<9;k++){ const a=k/9*Math.PI*2+s; nc(paGeo(g,mCut,A,'frond',paFrond(1.3+(k%3)*.15,.55,.9),x+.15,2.42,z,0,a,0)); } }
  /* tiki bar under a fringed thatch: bamboo front, carved masks on the posts, bottles, coconuts, a pineapple, the sign */
  for(let k=0;k<5;k++){ const zc=-(WZ-.9)+(WZ*2-1.8)*(k+.5)/5; bx(g,{px:'bamboo',side:'woodTop',top:'woodTop'},-12.4,0,zc,.8,1.1,(WZ*2-1.8)/5); }
  for(let k=0;k<5;k++) nc(bx(g,{top:paRot(A,'woodTop',1),side:'woodTop'},-12.35,1.1,-(WZ-.85)+(WZ*2-1.7)*(k+.5)/5,.95,.05,(WZ*2-1.7)/5)); nc(bx(g,'green',-11.88,1.06,0,.06,.06,WZ*2-1.7));
  for(let k=0;k<5;k++) nc(bx(g,{top:'thatch',side:'thatch',bottom:'thatch'},-12.8,2.6,-(WZ-.2)+(WZ*2-.4)*(k+.5)/5,2.2,.15,(WZ*2-.4)/5,0,0,-.25)); for(let k=0;k<5;k++){ const zc=-(WZ-.2)+(WZ*2-.4)*(k+.5)/5; nc(paCard(g,mCut,A,'fringe',-11.76,2.5,zc,(WZ*2-.4)/5+.02,.35,Math.PI/2)); }
  for(const z of [-1.9,1.9]){ geoA(g,'bamboo',cyl(.07,.07,2.6,8),-12.4,1.3,z); nc(pcard(g,'mask',-12.32,1.45,z,.22,.34,Math.PI/2)); }
  nc(pcard(g,'sign',-11.72,2.12,0,1.6,.4,Math.PI/2));
  for(let k=0;k<6;k++) K(nc(paGeo(g,mA,A,'bt'+(k%4),lathe([[0,.04,.04],[.18,.045,.045],[.23,.016,.016],[.3,.014,.014]],8),-12.5,1.15,(WZ-1.4)*(k/2.5-1))));
  for(const [z,r] of [[-1.25,'coco'],[-.95,'coco'],[.85,'pine'],[1.4,'coco']]) nc(geoA(g,r,lathe([[0,.02,.02],[.04,.07,.07],[.1,.07,.07],[.14,.03,.03]],8),-12.15,1.15,z));
  for(let k=0;k<3;k++) nc(geoA(g,k%2?'glass2':'glass',cyl(.035,.025,.12,8),-12.1,1.21,-.3+k*.25));
  for(const z of [-WZ+.6,WZ-.6]){ K(nc(bx(g,'woodTop',-13.8,1.5,z,.3,.04,.9))); for(let k=0;k<4;k++) K(nc(paGeo(g,mA,A,'bt'+k,lathe([[0,.035,.035],[.16,.04,.04],[.21,.015,.015],[.27,.012,.012]],8),-13.8,1.54,z-.33+k*.22))); }
  /* the DJ booth: decks, a mixer, a laptop; speaker stacks with chrome cone rings; surfboards against the front wall */
  bx(g,{nx:'dark',side:'dark',top:'dark'},12,0,0,1.0,1.1,2.4); nc(card(g,'tremor',11.49,.55,0,1.7,.42,-Math.PI/2)); nc(bx(g,'chrome',11.49,1.08,0,.04,.03,2.44));
  for(const z of [-.6,.6]){ nc(bx(g,'dark',12,1.1,z,.5,.05,.5)); nc(cylA(g,{side:'dark',top:'vinyl'},.21,.21,.02,20,12,1.16,z)); nc(bx(g,'chrome',12.15,1.16,z+.18,.25,.015,.02,.5)); }
  nc(bx(g,{top:paRot(A,'mixer',1),side:'dark'},12,1.1,0,.42,.07,.5)); nc(bx(g,'dark',12.25,1.1,-.05,.3,.02,.38,0,0,0)); nc(card(g,'screen',12.38,1.25,-.05,.36,.24,-Math.PI/2));
  for(const s of [-1,1]) for(let k=0;k<3;k++){ bx(g,{nx:'speaker',side:'dark',top:'dark'},13.3,k*.9,s*2.1,.9,.9,.9); nc(geoA(g,'chrome',torus(.28,.025,4,16),12.84,k*.9+.45,s*2.1,0,Math.PI/2)); }
  for(const [z,r] of [[1.25,'surf1'],[-1.3,'surf2']]) nc(bx(g,{side:r,front:r,back:r},13.62,0,z,.06,2.1,.5,0,0,-.1));
  /* strings of party lights over the deck */
  for(let k=0;k<30;k++){ const x=-13+k*.9, y=3.05+Math.sin(k*.6)*.12; nc(paGeo(g,mS,S,'bulb'+(k%4),lathe([[0,.02,.02],[.04,.05,.05],[.09,.04,.04],[.12,.01,.01]],8),x,y-.06,0)); } nc(B(g,C('#2a2a2e'),0,3.1,0,26,.02,.02));
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
  for(const x of [-11,-7,-3,1,5]) for(const s of [-1,1]){ const t=K(N(g,x,0,s*(WZ-1.5))); mk(cyl(.85,.85,.06,16),cloth,t,0,.74,0); mk(cyl(.86,.8,.3,16,{open:true}),M(null,{color:0xf2ece0,double:true}),t,0,.58,0); mk(cyl(.36,.36,.04,14),gold,t,0,.8,0);
    for(let k=0;k<3;k++) mk(cyl(.12,.12,.08,10),bamboo,t,Math.cos(k*2.1)*.22,.86+(k%2)*.08,Math.sin(k*2.1)*.22);
    for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+.3, cx=Math.cos(a)*1.15, cz=Math.sin(a)*1.15; B(t,dark,cx,0,cz,.4,.45,.4); B(t,M(fabT('#b82020',65)),cx,.45,cz,.42,.06,.42); } }
  /* trolleys */
  for(const x of [-9,3]){ B(g,C('#c8ccd2'),x,0,0,.9,.85,.6); for(let k=0;k<6;k++) mk(cyl(.15,.15,.09,10),bamboo,g,x-.25+(k%3)*.25,.9+(k>>1&1)*.1+(k>2?.0:0),-.12+(k>2?.24:0)); }
  /* red lanterns */
  const lan=U('#ff4030'); for(let k=0;k<9;k++){ const x=-12+k*2.4; for(const z of [-(WZ-1.7),WZ-1.7]){ K(mk(lathe([[0,.08,.08],[.08,.24,.24],[.34,.24,.24],[.42,.08,.08]],10),lan,g,x,2.5,z)); K(B(g,gold,x,2.5,z,.2,.03,.2)); K(B(g,gold,x,2.92,z,.03,.48,.03)); K(B(g,U('#f2c230'),x,2.38,z,.03,.14,.03)); } }
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
  const kit=paKit('capsule',paCapsuleKit), A=kit.A, S=kit.S, mA=M(A.tex), mS=M(S.tex,{unlit:true}), white=M(kit.walls.wall);
  const g=shell('capsule',{floor:M(kit.walls.floor),floorTile:.6,ceil:M(kit.walls.ceil),dado:white,upper:white,pier:white,trim:C('#29e0e6'),end:white,door:M(paDoor('#2a2a34','#29e0e6','#e8f4ff')),
    wins:[[-1.8,-.4],[.4,1.8]],lamps:[lamp(-10,2.8,0,[.85,.95,1.1],6),lamp(-4,2.8,0,[.85,.95,1.1],6),lamp(0,2.6,0,[1.2,.5,1.0],5),lamp(4,2.8,0,[.85,.95,1.1],6),lamp(10,2.8,0,[.85,.95,1.1],6)]});
  const bx=(n,r,x,y,z,w,h,d,ry=0,rx=0,rz=0)=>paBox(n,mA,A,r,x,y,z,w,h,d,ry,rx,rz), lit=(n,r,x,y,z,w,h,d,ry=0)=>paBox(n,mS,S,r,x,y,z,w,h,d,ry);
  const card=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mS,S,r,x,y,z,w,h,ry), pcard=(n,r,x,y,z,w,h,ry=0)=>paCard(n,mA,A,r,x,y,z,w,h,ry), nc=paNC;
  const geoA=(n,r,geo,x,y,z,rx=0,ry=0,rz=0)=>paGeo(n,mA,A,r,geo,x,y,z,rx,ry,rz);
  /* two storeys of pods down both walls, the middle left open as a lounge. Each pod is a moulded shell with a raised
     rim round a recessed, lit opening: some lit warm, some cool, some dark, some with the blind down */
  const PODX=[...Array(9)].map((_,i)=>-12.8+i*1.15).concat([...Array(9)].map((_,i)=>3.6+i*1.15));
  for(const s of [-1,1]) PODX.forEach((x,i)=>{ const side=WG.capsule.side[s], ry=s>0?Math.PI:0;
    for(let lv=0;lv<2;lv++){ const y=lv*1.25, n=N(side,x,y,s*2.25), f=-s*.625, hsh=(i*7+lv*3+(s>0?5:0))%9, t='wcwdwcwdc'[hsh], zc=-s*.265;
      const solid=bx(n,'podside',0,0,0,1.1,1.2,1.25); solid.vis=false; solid.keepHidden=1; /* the pod as the colliders know it; what you see is hollow */
      nc(bx(n,{side:'podside',top:'podside',bottom:'podside'},0,0,s*.3,1.1,1.2,.65)); nc(bx(n,'podside',0,1.0,zc,1.1,.2,.48)); nc(bx(n,'podside',0,0,zc,1.1,.2,.48)); for(const dx of [-.49,.49]) nc(bx(n,'podside',dx,.2,zc,.12,.8,.48));
      nc(bx(n,'rimH',0,1.0,f+s*.06,1.1,.2,.12)); nc(bx(n,'rimH',0,0,f+s*.06,1.1,.2,.12)); for(const dx of [-.49,.49]) nc(bx(n,'rimV',dx,.2,f+s*.06,.12,.8,.12));
      /* inside: lit back wall with a little screen, a glowing ceiling, the side walls, a made bed */
      nc(card(n,'pB'+t,0,.6,-s*.026,.86,.8,ry)); nc(paCard(n,mS,S,'pC'+t,0,.998,zc,.86,.48,0,Math.PI/2)); for(const dx of [-.429,.429]) nc(card(n,'pS'+t,dx,.6,zc,.48,.8,dx<0?Math.PI/2:-Math.PI/2));
      nc(lit(n,{top:'pM'+t,side:'pM'+t},0,.2,zc,.86,.12,.48)); nc(lit(n,'pP'+t,.22,.32,-s*.12,.32,.08,.2,.1)); nc(lit(n,'pK'+t,-.15,.32,-s*.36,.5,.05,.26,-.08));
      if(hsh===4||hsh===8) nc(card(n,'blind',0,.66,f+s*.11,.86,.68,ry));
      nc(pcard(n,'n'+(100*(lv+1)+i+(s>0?20:0)),.3,1.1,f-s*.003,.2,.12,ry)); nc(bx(n,'steel',-.25,.19,f-s*.02,.4,.025,.05));
      if(lv===0&&hsh%3===0) for(const dx of [-.1,.1]) nc(bx(side,'slip',x+dx,0,s*1.42,.1,.035,.26,0)); }
    bx(side,'steel',x+.575,0,s*1.6,.04,2.5,.04);
    if(i%2===0) for(let k=0;k<3;k++) nc(bx(side,'steel',x+.575,.38+k*.36,s*1.585,.035,.025,.12)); });
  /* along the top of the pods: a cyan cove light, signs for the pod numbers above */
  for(const s of [-1,1]){ const side=WG.capsule.side[s], ry=s>0?Math.PI:0, z=s*(WZ0-.02);
    for(const [x0,x1] of [[-13.4,-3.0],[3.0,13.4]]){ nc(lit(side,'led',(x0+x1)/2,2.47,s*1.63,x1-x0,.025,.03)); nc(bx(side,'white',(x0+x1)/2,2.45,s*1.75,x1-x0,.05,.3)); }
    [[-10.5,s<0?'sign1':'sign3'],[-5.5,s<0?'sign1':'sign3'],[5.5,s<0?'sign2':'sign4'],[10.5,s<0?'sign2':'sign4']].forEach(([x,r])=>nc(pcard(side,r,x,2.85,z,1.6,.4,ry)));
    nc(bx(side,'white',0,WH-.12,z,WL,.12,.1)); nc(lit(side,'led',0,WH-.13,s*(WZ0-.09),WL,.012,.02)); nc(bx(side,'dark',0,0,z,WL,.1,.05)); }
  /* lounge: a neon sign on a dark panel, vending machines, sofas with cushions, a coffee table, a manga shelf, a floor lamp, plants */
  nc(bx(g,'dark',0,2.5,-2.86,3.2,.82,.06)); nc(card(g,'neon',0,2.91,-2.825,3.0,.72)); nc(lit(g,'led',0,2.5,-2.82,3.2,.02,.02));
  const vm=(x,r)=>{ bx(g,{front:'dark',side:'vmside',top:'dark'},x,0,-2.4,.9,1.9,.7); nc(card(g,r,x,1.0,-2.045,.84,1.76)); nc(bx(g,'dark',x,1.9,-2.38,.94,.08,.74)); nc(bx(g,'steel',x,.3,-2.02,.7,.04,.06)); nc(bx(g,'dark',x+.38,.1,-2.07,.04,1.82,.06)); nc(bx(g,'dark',x-.38,.1,-2.07,.04,1.82,.06)); };
  vm(2.5,'vmR'); vm(-2.5,'vmB'); nc(bx(g,'cab',-1.65,0,-2.62,.5,.6,.5)); nc(geoA(g,'cup',cyl(.035,.03,.1,8),-1.55,.65,-2.55));
  for(const s of [-1,1]){ K(bx(g,{side:'sofa',top:'sofa'},-1.2,0,s*1.6,2.2,.3,.8)); K(bx(g,'sofa',-1.2,.42,s*1.95,2.2,.5,.16));
    for(const dx of [-.53,.53]) K(nc(bx(g,'sofa',-1.2+dx,.3,s*1.55,1.04,.14,.68))); for(const dx of [-1.15,1.15]) K(bx(g,'sofa',-1.2+dx,0,s*1.62,.14,.62,.84));
    for(const [dx,r,a] of [[-.7,'pillowC',.2],[.75,'pillowP',-.25]]) K(nc(bx(g,r,-1.2+dx,.44,s*1.78,.4,.36,.12,a,s*.25))); }
  nc(bx(g,'rug',-1.2,0,0,2.6,.006,2.0)); geoA(g,'tabletop',cyl(.42,.42,.04,16),-1.2,.45,0); geoA(g,'steel',cyl(.04,.04,.45,8),-1.2,.22,0); nc(geoA(g,'steel',cyl(.22,.22,.02,12),-1.2,.01,0));
  nc(bx(g,{top:'mag',side:'white'},-1.35,.47,.1,.34,.012,.24,.3)); nc(bx(g,{top:'mag',side:'white'},-1.3,.482,.06,.34,.012,.24,-.2));
  for(const [dx,dz] of [[.15,-.18],[.25,.12]]) nc(geoA(g,'cup',cyl(.035,.03,.1,8),-1.2+dx,.52,dz));
  /* the manga shelf: a carcass full of spines, real shelf boards across it */
  bx(g,{front:'spines',side:'white',top:'white'},2.55,0,2.45,.9,2.2,.4); for(let k=0;k<6;k++) nc(bx(g,'shelf',2.55,.04+k*.42,2.24,.9,.03,.06)); for(const dx of [-.44,.44]) nc(bx(g,'white',2.55+dx,0,2.24,.03,2.2,.05));
  nc(geoA(g,'steel',cyl(.015,.015,1.6,6),-2.6,.8,2.4)); nc(geoA(g,'steel',cyl(.18,.18,.02,12),-2.6,.01,2.4)); nc(paGeo(g,mS,S,'shade',cyl(.16,.22,.3,12,{open:true}),-2.6,1.7,2.4));
  for(const [x,z] of [[2.7,-1.25],[-2.7,1.5]]){ nc(geoA(g,'pot',cyl(.2,.15,.4,10),x,.2,z)); for(let k=0;k<7;k++){ const a=k/7*Math.PI*2; nc(bx(g,'leaf',x+Math.cos(a)*.12,.38,z+Math.sin(a)*.12,.1,.02,.55,-a+Math.PI/2,.0,0)).r=[.7,-a+Math.PI/2,0]; } }
  /* ceiling downlights in steel rings, cyan LED dashes on the floor, the exit sign */
  for(let x=-12;x<=12;x+=2){ nc(geoA(g,'steel',cyl(.12,.12,.02,12),x,WH-.01,0)); nc(paGeo(g,mS,S,'down',cyl(.09,.09,.01,12),x,WH-.022,0)); }
  for(let x=-13;x<13.5;x+=2) nc(lit(g,'led',x,.005,0,1.2,.01,.04));
  nc(card(g,'exit',WL/2-.04,2.45,0,.6,.22,-Math.PI/2));
  /* lockers at the back, numbered, with keypads */
  for(let k=0;k<6;k++) bx(g,{px:'locker',side:'white',top:'white'},-13.4,0,-1.5+k*.62,.6,1.9,.6).keep=1;
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
  B(g,C('#14203a'),13,0,0,.8,1.05,WZ*2-2.8); B(g,gold,12.65,1.05,0,.1,.04,WZ*2-2.8); for(let k=0;k<5;k++) K(mk(cyl(.04,.05,.24,6),G(['#29e0e6','#f5c542','#ff3fa4'][k%3]),g,13.2,1.2,(WZ-1.9)*(k/2-1)));
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
