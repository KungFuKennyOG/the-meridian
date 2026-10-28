
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
  const K=scKitM(); scStEdge(g,K,o);
  B(g,o.edge||C('#5a5654'),0,-1.4,-1.62,SL,1.4,.3);
  mk(wplane(SL,SZ1-SZ0,2,2),M(sleeperTex(),{color:[.55,.55,.55]}),g,0,-1.25,(SZ1+SZ0)/2-6,-Math.PI/2);
  for(const z of [TZS-GAUGE,TZS+GAUGE]) B(g,C('#8c9096'),0,-1.1,z,SL,.16,.09);
  /* walls: o.wallTV lets one painted texture run the full wall height (skirting to cornice, light painted in) */
  const tu=o.wallTile||1, tv=o.wallTV||tu, pit=o.pit||C('#3a3836');
  mk(wplane(SL,o.H,tu,tv),o.back,g,0,o.H/2,SZ1,0,Math.PI,0);
  mk(wplane(SL,o.H,tu,tv),o.far||o.back,g,0,o.H/2,SZ0,0,0,0); mk(wplane(SL,1.4,4,4),pit,g,0,-.7,SZ0,0,0,0);
  for(const e of [-1,1]){ mk(wplane(SZ1-SZ0,o.H,tu,tv),o.end||o.back,g,e*SL/2,o.H/2,(SZ1+SZ0)/2,0,e<0?Math.PI/2:-Math.PI/2,0); mk(wplane(SZ1-SZ0,1.4,4,4),pit,g,e*SL/2,-.7,(SZ1+SZ0)/2,0,e<0?Math.PI/2:-Math.PI/2,0); }
  if(o.ceil) mk(wplane(SL,SZ1-SZ0,o.ceilTile||1.5,o.ceilTile||1.5),o.ceil,g,0,o.H,(SZ1+SZ0)/2,Math.PI/2);
  [WAGONS[7],WAGONS[8]].forEach((W,i)=>{ const c=buildCarExt(g,W,(.5-i)*CAR_PITCH); c.p[2]=TZS; c.glow.vis=true; if(c.tail) c.tail.vis=false; });
  ST[key]=Object.assign({g,side,anim:[],back:N(g),top:N(g),H:o.H,H0:o.H,K},o.meta); return g; }
/* is this build the last-night Tokyo? (the flow sets the leg before it builds) */
function scStNight(){ try{ return !!(ROUTE[FLOW.leg]&&ROUTE[FLOW.leg].night); }catch(_){ return false; } }
/* a weapon left for you: an open case, the gun inside, a soft light and a glint ring on the floor */
function weaponDrop(g,x,z,kind,caseCol){
  const n=N(g,x,0,z); const ring=mk(plane(1.6,1.6),M(tRing,{unlit:true,cut:true,color:0xf5c542}),n,0,.012,0,-Math.PI/2);
  const glow=U('#fff2c0');
  if(kind==='locker'){ const T=scTokyoTex(), K=scKitM(), lk=c=>M(T.A.t,{color:hexInt(c)}), face=c=>({s:K.a.white,f:T.A.r.locker,b:K.a.white}), cols=['#e8ecf0','#c8d4e0','#a8c8e0'];
    for(let r=0;r<4;r++) for(let c=0;c<3;c++){ const x=c*.5-.5, y=r*.45, col=cols[(r+c)%3]; if(r===1&&c===1){ scBX(n,K.mA,K.a.steelD,x,y,-.2,.46,.41,.06); scBX(n,lk(col),K.a.white,x,y,.02,.48,.02,.46); scBX(n,lk(col),face(col),x-.24,y,.35,.03,.41,.46,.6); } else scBX(n,lk(col),face(col),x,y,0,.48,.43,.5); }
    /* the tall locker beside them, door open: Nico's golf bag inside */
    scBX(n,K.mA,K.a.steelD,1.0,0,-.22,.5,1.8,.04); for(const dx of [-.24,.24]) scBX(n,lk('#c8d4e0'),K.a.white,1.0+dx,0,0,.02,1.8,.5); scBX(n,lk('#c8d4e0'),K.a.white,1.0,1.78,0,.5,.02,.5); scBX(n,lk('#c8d4e0'),K.a.white,1.0,0,0,.5,.05,.5);
    scBX(n,lk('#e8ecf0'),face(),1.29,.02,.48,.46,1.76,.03,-1.4);
    const gb=N(n,1.0,.05,-.02,-.1,0,.06); mk(cyl(.125,.115,.95,12),C('#1e3a6a'),gb,0,.475,0); mk(cyl(.135,.135,.09,12),C('#e8e8e4'),gb,0,.9,0); mk(cyl(.13,.13,.06,12),C('#14141c'),gb,0,.03,0); B(gb,C('#14141c'),0,.25,.125,.06,.6,.02); B(gb,C('#c8202a'),0,.55,.12,.16,.2,.03);
    for(let k=0;k<4;k++){ const a=k/4*Math.PI*2, cx=Math.cos(a)*.06, cz=Math.sin(a)*.06; mk(cyl(.007,.007,.3,5),C('#c8ccd2'),gb,cx,1.05,cz); if(k%2) mk(lathe([[0,.035,.035],[.1,.05,.05],[.16,.03,.03]],8),C(k===1?'#c8202a':'#2a6a3a'),gb,cx,1.18,cz); else B(gb,C('#c8ccd2'),cx+.02,1.2,cz,.07,.05,.03); }
    const p=N(n,0,.62,0,0,Math.PI/2,0); pPistol(p); mk(cyl(.018,.018,.16,6),M(tBlued,{double:true}),p,0,.045,.23,Math.PI/2); B(n,glow,0,.86,.1,.3,.02,.3); }
  else if(kind==='briefcase'){ const K=scKitM(), lea=K.a.walnut, au=K.a.gold; scBX(n,K.mA,lea,0,.44,0,.9,.03,.4); for(const dz of [-.185,.185]) scBX(n,K.mA,lea,0,.47,dz,.9,.09,.03); for(const dx of [-.435,.435]) scBX(n,K.mA,lea,dx,.47,0,.03,.09,.34); B(n,C('#7a1a1a'),0,.47,0,.84,.03,.34);
    const lid=N(n,0,.56,-.2,-.55,0,0); scBX(lid,K.mA,lea,0,0,-.02,.9,.4,.03); B(lid,C('#7a1a1a'),0,.02,.0,.84,.36,.01); for(const dx of [-.3,.3]) scBX(n,K.mA,au,dx,.5,.205,.07,.04,.02); scBX(n,K.mA,K.a.rubber,0,.5,.23,.22,.03,.05); const p=N(n,0,.56,0,0,Math.PI/2,0); pSMG(p); B(n,C('#e8e2d0'),.6,.46,0,.3,.02,.22); }
  else if(kind==='cello'){ const c=N(n,0,0,0,0,0,-.18); mk(lathe([[0,.06,.04],[.15,.2,.12],[.45,.22,.13],[.6,.15,.1],[.75,.2,.12],[1.1,.18,.1],[1.25,.07,.05]],12),C(caseCol||'#141416'),c,0,0,0); B(c,C('#2a1a12'),0,.2,.14,.3,.9,.02);
    const p=N(n,.35,.9,.2,0,Math.PI/2,-.6); pRifleM(p); }
  n.ring=ring; return n; }
function pRifleM(g){ const wood=M(woodT('#5a3a24','#3a2416',303)); mk(box(.045,.07,.26),mBlack,g,0,0,.02); mk(cyl(.011,.011,.42,6),M(tBlued,{double:true}),g,0,.02,.36,Math.PI/2); mk(box(.04,.05,.2),mBlack,g,0,-.02,.22); mk(box(.035,.16,.05),mBlack,g,0,-.1,.08,-.3); mk(box(.04,.1,.24,{td:.7}),wood,g,0,-.03,-.2,.1); mk(box(.012,.04,.012),mBlack,g,0,.06,.0); return g; }

/* ---------- Tokyo: B5, white tile, screen doors, ticket gates, vending machines ---------- */
let scTKT=null;
function scTokyoTex(){ if(scTKT) return scTKT; const GR='#2a9a5a', WH_='#eef0ee';
  const wall=P2(96,220,(g,w,h)=>{
    vfill(g,0,0,w,34,[[0,'#f4f6f6'],[.7,'#d8dcde'],[1,'#b8bcc0']]); R(g,'#ffffff',0,22,w,3); R(g,rgba('#000000',.25),0,25,w,.8); scPMould(g,0,31,w,3,'#d8dcde');
    for(let x=0;x<w;x+=24){ const c=scShadeOf(WH_,((x*7)%5-2)*.012); scPPanel(g,x+.4,34.5,23.2,46,c,{bev:1.2,hi:.1,lo:.06}); scPPanel(g,x+.4,81,23.2,50,c,{bev:1.2,hi:.04,lo:.12}); hfill(g,x+.4,34.5,23.2,96.5,[[0,rgba('#ffffff',0)],[.3,rgba('#ffffff',.18)],[.42,rgba('#ffffff',0)],[1,rgba('#000000',.05)]]); for(const y of [37,77,84,128]) for(const xx of [x+2.4,x+21.6]) { ell(g,xx,y,.5,.5,'#a8acb0'); ell(g,xx-.15,y-.15,.2,.2,'#ffffff'); } } scPAO(g,0,34,w,12,'t',10,.2);
    scPPanel(g,0,131,w,15,GR,{bev:1,hi:.2,lo:.2}); R(g,'#ffffff',0,133,w,1.2); R(g,'#ffffff',0,142.5,w,1.2);
    scPTiles(g,0,146,w,67,12,6,'#f2f4f2','#c4c8c6',101,{bond:true,var:.07,gw:.7});
    scPSteel(g,0,213,w,7,'#b8bcc2',102); scPAO(g,0,146,w,67,'b',16,.18); scPLight(g,0,0,w,h,.06,.16); },3,100);
  const floor=P2(96,96,(g,w,h)=>{ const r=rng(103); R(g,'#6e7074',0,0,w,h);
    for(let ty=0;ty<4;ty++) for(let tx=0;tx<4;tx++){ const v=(r()-.5)*.1, c=scShadeOf('#a2a4a8',v), x=tx*24+.4, y=ty*24+.4; vfill(g,x,y,23.2,23.2,[[0,scShadeOf(c,.06)],[1,scShadeOf(c,-.06)]]);
      for(let i=0;i<70;i++) R(g,[rgba('#f2f2ee',.55),rgba('#3a3a40',.45),rgba('#c8bca8',.5)][i%3],x+r()*23,y+r()*23,.5+r()*.6,.5+r()*.6);
      R(g,rgba('#ffffff',.25),x,y,23.2,.4); R(g,rgba('#000000',.18),x,y+22.8,23.2,.4); }
    hfill(g,0,0,w,h,[[0,rgba('#ffffff',0)],[.4,rgba('#ffffff',.07)],[.6,rgba('#ffffff',0)]]); },4,104);
  const ceil=P2(64,64,(g,w,h)=>{ for(let y=0;y<h;y+=8){ vfill(g,0,y,w,8,[[0,'#f4f6f6'],[.8,'#dfe2e4'],[1,'#c8ccd0']]); R(g,'#9a9ea4',0,y+7.3,w,.7); } R(g,'#8a8e94',w-1,0,1,h); R(g,rgba('#ffffff',.6),0,0,.5,h); },2,105);
  const ad=(bg,title,sub,art)=>(g,w,h)=>scPPoster(g,w,h,{bg,title,sub,art,sun:mix(bg[0],'#ffffff',.5),ty:3,sy:h-7,ts:1});
  const A=scAtlasP(128,[
    ['col',32,128,(g,w,h)=>{ R(g,'#ffffff',0,0,w,h); scPPanel(g,0,0,w,62,WH_,{bev:1,hi:.08,lo:.08}); R(g,rgba('#000000',.15),0,61,w,1); scPPanel(g,0,62,w,8,GR,{bev:.8}); R(g,'#ffffff',0,63,w,.8); R(g,'#ffffff',0,68,w,.8);
      scPTiles(g,0,70,w,54,8,4,'#f2f4f2','#c4c8c6',106,{bond:true,gw:.6}); scPSteel(g,0,124,w,4,'#b8bcc2',107); scPSteel(g,0,0,2,124,'#c8ccd2',108,{bev:false}); scPSteel(g,w-2,0,2,124,'#c8ccd2',109,{bev:false}); scPLight(g,0,0,w,h,.05,.15); }],
    ['band',32,8,(g,w,h)=>{ scPPanel(g,0,0,w,h,GR,{bev:.8,hi:.22,lo:.2}); R(g,'#ffffff',0,1.2,w,.6); R(g,'#ffffff',0,h-1.8,w,.6); }],
    ['psdHead',64,8,(g,w,h)=>{ scPPanel(g,0,0,w,h,GR,{bev:.6}); text(g,'MERIDIAN 24',3,1.5,'#ffffff',1); ell(g,56,4,2.6,2.6,'#ffffff'); scCtext(g,'G',56,1.6,GR,1); }],
    ['locker',16,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#f2f4f6',{bev:1}); for(let y=3;y<6;y+=1) R(g,rgba('#000000',.25),3,y,10,.4); R(g,'#2a2c30',11,8,2.5,3.5); ell(g,12.2,9.6,.7,.7,'#d4ad5a'); R(g,'#f2c230',2.5,8,6,3); text(g,'27',3,8.5,'#1a1a1e',.6); }],
    ['gate',32,32,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#e4e8ea',{bev:1.2}); R(g,'#2a2c30',3,4,26,9); R(g,'#2ae08a',5,6,10,5); poly(g,[[20,6],[26,8.5],[20,11]],'#2ae08a'); ell(g,8,22,5,5,'#2a2c30'); ell(g,8,22,4,4,'#f2c230'); scCtext(g,'IC',8,20,'#1a1a1e',.8); R(g,'#2a2c30',17,18,10,2); R(g,'#1a1a1e',17,24,10,1); scPAO(g,0,0,w,h,'b',8,.2); }],
    ['office',64,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#e8ecee',{bev:1.4}); R(g,GR,0,0,w,4); scPGlass(g,6,10,52,22,'#a8c8d8'); R(g,'#c8ccd2',5,9,54,1); R(g,'#c8ccd2',5,32,54,1.5); for(const x of [24,40]) R(g,'#c8ccd2',x,10,1,22); ell(g,32,26,3,1.6,'#2a2c30'); for(let y=36;y<46;y+=2) R(g,rgba('#000000',.1),2,y,w-4,.5); }],
    ['kiosk',64,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#f2f2ee',{bev:1.2}); const r=rng(110); for(let row=0;row<3;row++){ R(g,'#c8ccd2',3,6+row*12,58,1); for(let k=0;k<9;k++){ const c=['#d63a2c','#2a6ad8','#f2c230','#f28a3a','#2a9a5a','#f27ab0'][(r()*6)|0]; scPPanel(g,4+k*6.4,7+row*12,5.6,10,c,{bev:.6}); R(g,'#ffffff',5+k*6.4,9+row*12,3.6,2); glyphs(g,5+k*6.4,12+row*12,2,2,'#1a1a1e',k+row*9,false); } } R(g,GR,0,h-5,w,5); }],
    ['kioskSide',32,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,GR,{bev:1.2}); R(g,'#ffffff',0,8,w,1); scPTiles(g,2,12,w-4,30,4,4,'#f2f2ee','#c8ccd2',111,{gw:.5}); }],
    ['floorQ',32,32,(g,w,h)=>{ R(g,'#a2a4a8',0,0,w,h); R(g,'#ffffff',1,1,w-2,1.2); R(g,'#ffffff',1,1,1.2,h-2); R(g,'#ffffff',w-2.2,1,1.2,h-2); for(const x of [9,23]) poly(g,[[x-4,22],[x,12],[x+4,22]],'#2a9a5a'); scCtext(g,'3',16,24,'#f28a3a',1.4); scCtext(g,'DOOR',16,5,'#1a1a1e',.8); }],
    ['plate',16,16,(g,w,h)=>{ R(g,'#ffffff',0,0,w,h); ell(g,8,8,7.2,7.2,GR); ell(g,8,8,5.6,5.6,'#ffffff'); scCtext(g,'G',8,3.4,GR,1); scCtext(g,'05',8,9,'#1a1a1e',.9); }],
    ['escSide',64,16,(g,w,h)=>{ scPSteel(g,0,0,w,h,'#d8dce0',112); for(let x=8;x<w;x+=16) R(g,rgba('#000000',.25),x,0,.5,h); R(g,'#1a1a1e',0,0,w,2); }],
    ['escStep',32,16,(g,w,h)=>{ R(g,'#3a3c40',0,0,w,h); for(let x=1;x<w;x+=1.5) R(g,'#5a5e64',x,0,.7,h); R(g,'#f2c230',0,0,w,2); R(g,'#f2c230',0,h-2,w,2); }]
  ],3,113);
  const L=scAtlasP(128,[
    ['ad0',32,48,ad(['#e8463a','#8a1a1a'],'KIRA','COLA',(g,w,h)=>{ ell(g,16,28,5,10,'#3a0a0a'); R(g,'#3a0a0a',14,14,4,6); R(g,'#ffffff',13,26,6,3); for(let i=0;i<8;i++) ell(g,6+i*3,40-i*2.5,.8,.8,rgba('#ffffff',.7)); })],
    ['ad1',32,48,ad(['#5ac8a0','#1a5a4a'],'AOZORA','TEA',(g,w,h)=>{ ell(g,16,32,9,4,'#f2f2ee'); R(g,'#f2f2ee',8,24,16,8); ell(g,16,24,8,2.5,'#7ac080'); g.strokeStyle='#f2f2ee'; g.lineWidth=1; g.beginPath(); g.arc(25,28,3,-1.2,1.2); g.stroke(); for(let k=0;k<3;k++){ g.strokeStyle=rgba('#ffffff',.6); g.beginPath(); g.moveTo(12+k*4,20); g.quadraticCurveTo(10+k*4,16,13+k*4,12); g.stroke(); } })],
    ['ad2',32,48,ad(['#f2a03a','#a83a10'],'NEO','RAMEN',(g,w,h)=>{ ell(g,16,30,11,6,'#f2f2ee'); ell(g,16,28,10,3.5,'#e8b040'); for(let k=0;k<4;k++) R(g,'#f6e0a0',9+k*4,26,1,4); ell(g,11,27,2.4,2,'#f6f0e0'); ell(g,11,27,1,1,'#f2a020'); g.strokeStyle='#3a2410'; g.lineWidth=1; g.beginPath(); g.moveTo(20,10); g.lineTo(14,26); g.moveTo(24,11); g.lineTo(17,26); g.stroke(); })],
    ['ad3',32,48,ad(['#8a6aff','#2a1a6a'],'HIKARI','9',(g,w,h)=>{ R(g,'#1a1a2e',10,13,12,23); R(g,'#29e0e6',11,15,10,18); radial(g,16,22,8,[[0,rgba('#ffffff',.6)],[1,rgba('#ffffff',0)]]); R(g,'#3a3a5e',14,34,4,1); })],
    ['ad4',32,48,ad(['#ffa0c8','#c8487a'],'SAKURA','AIR',(g,w,h)=>{ poly(g,[[4,26],[28,20],[30,22],[8,30]],'#ffffff'); poly(g,[[14,24],[20,14],[22,15],[18,24]],'#ffffff'); poly(g,[[14,27],[18,34],[20,33],[18,27]],'#f2f2f8'); const r=rng(7); for(let i=0;i<10;i++){ const x=r()*w,y=12+r()*26; for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; ell(g,x+Math.cos(a),y+Math.sin(a),.8,.8,'#fff0f6'); } } })],
    ...['#d63a2c','#2a6ad8','#f2f2ee','#2a9a5a'].map((c,i)=>['vm'+i,32,64,(g,w,h)=>{ const r=rng(120+i); scPPanel(g,0,0,w,h,c,{bev:1.2});
      R(g,'#1a1e24',2,3,w-4,33); vfill(g,2.5,3.5,w-5,32,[[0,'#f4faff'],[1,'#c8dcf0']]);
      for(let y=0;y<3;y++){ R(g,'#a8b0bc',3,13+y*10,w-6,.8); for(let k=0;k<5;k++){ const cc=['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#f28a3a','#1a1a1e','#f27ab0'][(r()*7)|0]; vfill(g,4.4+k*5,5+y*10,3.6,7.6,[[0,scShadeOf(cc,.3)],[.5,cc],[1,scShadeOf(cc,-.3)]]); R(g,rgba('#ffffff',.6),5,5.4+y*10,.7,7); R(g,'#ffffff',4.4+k*5,8+y*10,3.6,1.6); R(g,'#2a2c30',4.6+k*5,14.2+y*10,3,1.2); ell(g,6.2+k*5,16.6+y*10,.7,.7,'#ff4030'); } }
      scPGlass(g,2,3,w-4,33,'#ffffff',{k:.35,wash:false}); R(g,'#1a1e24',3,38,w-6,6); scCtext(g,['KIRA','AOZORA','MIZU','GENKI'][i],w/2,39.5,'#ffffff',.8); R(g,'#2a2c30',22,46,6,8); R(g,'#5ae0ff',23,47,4,1.5); R(g,'#1a1a1e',24,51,2,.6); R(g,'#1a1a1e',4,54,16,6); R(g,'#3a3c40',5,55,14,4); scPAO(g,0,0,w,h,'b',10,.2); }]),
    ['sign',96,16,(g,w,h)=>{ R(g,'#1a1a1e',0,0,w,h); ell(g,8,8,6,6,GR); ell(g,8,8,4.6,4.6,'#ffffff'); scCtext(g,'G',8,3.2,GR,1); scCtext(g,'05',8,8.6,'#1a1a1e',.8); scHanziRow(g,18,1.6,5,5.2,'#ffffff',51,false,.3); text(g,'MERIDIAN TOKYO',18,9.5,'#ffffff',1); poly(g,[[86,4],[92,8],[86,12]],'#2ae08a'); R(g,'#2a2c30',0,h-1,w,1); }],
    ['exitY',64,16,(g,w,h)=>{ R(g,'#f2c230',0,0,w,h); R(g,'#1a1a1e',0,0,w,.8); R(g,'#1a1a1e',0,h-.8,w,.8); R(g,'#1a1a1e',2,2,12,12); poly(g,[[8,4],[12,9],[9.5,9],[9.5,12],[6.5,12],[6.5,9],[4,9]],'#f2c230'); text(g,'EXIT A2',18,2.5,'#1a1a1e',1); glyphs(g,18,9,6,4,'#1a1a1e',61,false); }],
    ['board',64,16,(g,w,h)=>{ R(g,'#0e0e12',0,0,w,h); text(g,'06:00',2,2,'#f2a020',1); text(g,'MERIDIAN 24',24,2,'#f2a020',1); text(g,'ON TIME',2,9,'#2ae08a',1); text(g,'B5 PLAT 0',30,9,'#f2a020',1); }],
    ['boardN',64,16,(g,w,h)=>{ R(g,'#0e0e12',0,0,w,h); text(g,'23:58',2,2,'#ff4a4a',1); text(g,'MERIDIAN 24',24,2,'#f2a020',1); text(g,'LAST TRAIN',2,9,'#ff4a4a',1); text(g,'PLAT 0',42,9,'#f2a020',1); }],
    ['fridge',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f4faff'],[1,'#c8dcf0']]); const r=rng(130); for(let y=0;y<3;y++){ R(g,'#a8b0bc',0,9+y*10,w,.8); for(let k=0;k<7;k++){ const cc=['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#ffffff'][(r()*5)|0]; vfill(g,1+k*4.4,2+y*10,3.2,7,[[0,scShadeOf(cc,.3)],[1,scShadeOf(cc,-.25)]]); } } scPGlass(g,0,0,w,h,'#ffffff',{k:.4,wash:false}); }],
    ['kioskSign',64,8,(g,w,h)=>{ R(g,GR,0,0,w,h); R(g,'#f28a3a',0,h-1.4,w,1.4); text(g,'MERI-MART',4,1.4,'#ffffff',1); glyphs(g,44,1.5,4,4,'#ffffff',71,false); }],
    ['officeSign',64,8,(g,w,h)=>{ R(g,'#1a1a1e',0,0,w,h); text(g,'TICKETS',4,1.5,'#ffffff',1); glyphs(g,34,1.5,4,4,'#ffffff',81,false); ell(g,58,4,2.6,2.6,GR); }],
    ['neonA',32,8,(g,w,h)=>{ R(g,'#120818',0,0,w,h); for(const [c,a] of [['#ff3fa4',.35],['#ffd0e8',1]]) text(g,'BAR',3,1.5,rgba(c,a),1); glyphs(g,17,1.5,3,4,'#29e0e6',91,false); }]
  ],0,114);
  return scTKT={wall,floor,ceil,A,L}; }

STATION_BUILD.tokyo=function tokyoStation(){
  const T=scTokyoTex(), night=scStNight();
  const g=stationShell('tokyo',{floor:M(T.floor),floorTile:2.4,back:M(T.wall),wallTile:2,wallTV:4.6,ceil:M(T.ceil),ceilTile:1.6,H:4.6,pit:C('#3a3c40'),
    meta:{name:'Tokyo · B5',city:'Tokyo',num:'01',sw:['#eef0ee','#2a9a5a','#9a9c9e','#d63a2c','#f2c230'],crew:['ren','renc'],weapon:0,
      note:'Five floors under the city: white tile, a green line colour, platform screen doors, ticket gates and a row of vending machines. You walk in here with nothing but a golf bag and board at the back of the train; when the loop comes back round to Tokyo, the Kagami-gumi are waiting.',
      lamps:night?[lamp(-18,4.2,3,[1.2,1.25,1.5],12),lamp(0,4.2,3,[1.2,1.25,1.5],12),lamp(18,4.2,3,[1.2,1.25,1.5],12),lamp(-12,2.6,7.2,[2.2,.7,1.6],7),lamp(14,2.2,6.8,[.7,1.8,2.0],7),lamp(22,2.4,5,[2.0,1.5,.9],6)]
        :[lamp(-20,4.2,3,[1.25,1.25,1.3],13),lamp(-6,4.2,3,[1.25,1.25,1.3],13),lamp(8,4.2,3,[1.25,1.25,1.3],13),lamp(22,4.2,3,[1.25,1.25,1.3],13),lamp(0,3.5,-5,[.7,.72,.76],12),lamp(14,2.4,6.4,[1.3,1.15,.9],6)],
      amb:night?[.42,.4,.5]:[.44,.45,.47],cam:{t:[-7,1.6,2.5],th:.35,ph:1.25,r:17}}});
  const st=ST.tokyo, K=st.K, A=T.A.r, Lr=T.L.r, mA=M(T.A.t), mL=M(T.L.t,{unlit:true}), BK=st.back, top=st.top;
  /* the wall's relief: a steel skirting, the raised green band, a cornice and steel pilaster strips */
  scRunBX(BK,K.mA,K.a.steel,-SL/2,SL/2,4,0,SZ1-.025,.15,.05); scRunBX(BK,mA,A.band,-SL/2,SL/2,2,1.55,SZ1-.02,.3,.04); scRunBX(BK,K.mA,K.a.white,-SL/2,SL/2,4,3.86,SZ1-.06,.1,.12);
  for(let x=-30;x<=30;x+=4){ if(Math.abs(x+3.25)<2.6||Math.abs(((x+26)%6.5+6.5)%6.5-3.25)>2.4) continue; scBX(BK,K.mA,K.a.steel,x,.15,SZ1-.02,.06,3.71,.04); }
  /* platform screen doors: steel posts, painted glass, a green header with the line mark */
  for(let x=-30;x<30;x+=2){ const door=Math.abs(((x+31)%31)-1)<1.5||Math.abs(x-(-.5))<1.6; if(door) continue;
    scBX(g,K.mA,K.a.steel,x+1,0,-1.45,.1,1.6,.12); scBX(g,K.mA,K.a.glass,x+1,.25,-1.45,1.9,1.15,.03); scBX(g,K.mA,K.a.steelD,x+1,.1,-1.45,1.9,.15,.06); scBX(g,mA,{s:K.a.steel,f:A.psdHead,b:A.psdHead},x+1,1.42,-1.45,2,.16,.12); }
  /* square columns, clad: tile, green band, steel corner guards, station plates */
  for(let x=-24;x<=24;x+=12){ scBX(g,mA,{s:A.col,t:K.a.white,u:K.a.white},x,0,3,.7,4.6,.7); scBX(g,K.mA,K.a.steel,x,0,3,.76,.12,.76); for(const z of [3.36,2.64]) scPX(g,mA,A.plate,x,2.6,z+(z>3?.012:-.012),.4,.4,0,z>3?0:Math.PI,0); }
  /* hanging name signs and yellow exit signs */
  for(const x of [-14,14]){ scLightbox(g,K,mL,Lr.sign,x,3.2,1,3.2,.55,.16,'steel',0); scPX(g,mL,Lr.sign,x,3.475,.912,3.13,.48,0,Math.PI,0); for(const dx of [-1.4,1.4]) scBX(top,K.mA,K.a.steelD,x+dx,3.75,1,.03,.85,.03); }
  for(const x of [-26,11]){ scLightbox(g,K,mL,Lr.exitY,x,3.3,1.2,1.9,.45,.12,'steelD',0); scPX(g,mL,Lr.exitY,x,3.525,1.132,1.83,.4,0,Math.PI,0); scBX(top,K.mA,K.a.steelD,x,3.75,1.2,.03,.85,.03); }
  /* the departure board over the boarding point, clocks, speakers, cameras, light rows, cable tray */
  const bd=night?Lr.boardN:Lr.board, bx=5.2; scBX(g,K.mA,K.a.steelD,bx,2.95,.3,2.2,.62,.18); scPX(g,mL,bd,bx,3.26,.395,2.05,.5); scPX(g,mL,bd,bx,3.26,.205,2.05,.5,0,Math.PI,0); scBX(top,K.mA,K.a.steelD,bx,3.57,.3,.04,1.05,.04);
  for(const x of [-8,18]) scStClock(top,K,x,3.35,1.0,0,'clockA',.32,4.6);
  for(const x of [-20,-4,12,26]) scStSpeaker(top,K,x,4.42,1.6,0); for(const x of [-16,10]) scStCam(top,K,x,4.6,.4,Math.PI*.9);
  const lit=night?(x)=>((x/4|0)%2===0):()=>true;
  for(const z of [.6,5.4]) for(let x=-29;x<=29;x+=4){ scBX(top,K.mA,K.a.steelD,x,4.52,z,3.4,.08,.42); if(lit(x)) scPX(top,K.mL,K.l.panel,x,4.515,z,3.3,.34,Math.PI/2); else scPX(top,K.mA,K.a.white,x,4.515,z,3.3,.34,Math.PI/2); }
  scStTray(top,K,4.3,7.6);
  /* ticket gates along the back */
  for(let k=0;k<6;k++){ const x=4+k*1.6; scBX(g,mA,{s:K.a.white,px:A.gate,nx:A.gate,t:K.a.steel},x,0,7.2,.25,1.0,1.4); scBX(g,K.mA,K.a.steelD,x,1.0,7.2,.27,.04,1.42); B(g,G('#2ae08a'),x,1.04,6.6,.2,.02,.12); B(g,C('#d63a2c'),x+.8,.7,7.2,.6,.06,.06); }
  /* vending machines: painted backlit fronts, white bodies */
  [13,14,15,16].forEach((x,i)=>{ const n=N(g,x,0,7.9,0,Math.PI,0); scBX(n,K.mA,{s:K.tA?K.a.white:K.a.white,t:K.a.steelD},0,0,0,.9,1.9,.7); scPX(n,mL,Lr['vm'+i],0,.95,.352,.86,1.86); scBX(n,K.mA,K.a.steelD,0,1.9,0,.92,.06,.72); });
  scStBins(g,K,17.2,7.9,Math.PI);
  /* benches: back to back between the columns */
  for(const x of [-18,-6,6,18]){ scStBench(g,K,x,3.45,0,{len:1.9}); scStBench(g,K,x,2.55,Math.PI,{len:1.9}); }
  /* floor: door marks at the screen door gap */
  for(const x of [-2.6,1.6]) scPX(g,mA,A.floorQ,x,.008,-.1,.9,.9,-Math.PI/2);
  /* wall furniture */
  scStWallKit(BK,K,-23.6,SZ1); scStWallKit(BK,K,27.5,SZ1);
  /* the escalator up to the concourse */
  for(let k=0;k<2;k++){ const ez=7.6-k*1.2; const n=N(g,-27,0,ez,0,0,.42); scBX(n,mA,A.escSide,3.5,0,0,8,.5,1.0); scBX(n,mA,A.escStep,3.5,.5,0,8,.04,.8); scBX(n,mA,{s:A.escSide,t:K.a.rubber},3.5,.5,.42,8,.9,.06); scBX(n,K.mA,K.a.rubber,3.5,1.4,.42,8,.06,.1); scBX(n,mA,{s:A.escSide,t:K.a.rubber},3.5,.5,-.42,8,.9,.06); }
  /* the locker with the pistol */
  const drop=weaponDrop(g,-10,5.8,'locker'); drop.r[1]=Math.PI; ST.tokyo.drop=drop;
  ST.tokyo.spots={nico:{x:-8.2,z:4.6,ry:Math.PI*.85},ren:{x:3,z:.6,ry:Math.PI*.8},renc:{x:1.2,z:-.6,ry:Math.PI*.7},renc2:{x:5,z:-.4,ry:Math.PI*.9}};
};

/* ---------- Naples: the sea cave, blue mosaic, a light well spiralling up ---------- */
let scNPT=null;
function scNaplesTex(){ if(scNPT) return scNPT;
  const wall=P2(96,312,(g,w,h)=>{
    scPMosaic(g,w,240,(q,W,H)=>{ vfill(q,0,0,W,H,[[0,'#06183a'],[.5,'#0e3a7a'],[1,'#2a6ac8']]); for(let k=0;k<7;k++){ q.strokeStyle=k%2?'#7ad8ff':'#bfefff'; q.lineWidth=2; q.beginPath(); for(let x=0;x<=W;x+=2) q.lineTo(x,30+k*30+Math.sin(x/W*Math.PI*2+k*1.3)*6); q.stroke(); } for(let i=0;i<40;i++){ q.fillStyle='#e8f8ff'; q.fillRect((i*53)%W,(i*97)%H*.6,2,2); } },501,{border:0,grout:'#081a3a',step:2,jit:26});
    scPAO(g,0,0,w,240,'b',30,.25);
    g.save(); g.translate(0,240); scPMosaic(g,w,14,(q,W,H)=>{ vfill(q,0,0,W,H,[[0,'#f8e090'],[1,'#b88a34']]); },502,{border:0,grout:'#6a4818',step:1.6,jit:40}); g.restore();
    for(let x=0;x<w;x+=48) scPMarble(g,x+.3,254,47.4,48,'#f4f0ea','#8a8a90',503+x,{veins:5});
    R(g,rgba('#000000',.3),47.8,254,.5,48); scPMould(g,0,254,w,3,'#e8e2d8');
    vfill(g,0,302,w,10,[[0,'#2a2a30'],[1,'#121216']]); R(g,rgba('#ffffff',.3),0,302,w,.6);
    scPLight(g,0,0,w,h,.04,.1); },3,500);
  const ceil=P2(64,64,(g,w,h)=>scPMosaic(g,w,h,(q,W,H)=>{ vfill(q,0,0,W,H,[[0,'#0a2a5a'],[1,'#123e80']]); for(let i=0;i<14;i++){ q.fillStyle=i%3?'#bfefff':'#f2d27a'; q.fillRect((i*29)%W,(i*41)%H,2,2); } },504,{border:0,grout:'#061a3a',step:2}),2,505);
  const floor=P2(96,96,(g,w,h)=>{ R(g,'#b8b0a2',0,0,w,h); const r=rng(506);
    for(let ty=0;ty<2;ty++) for(let tx=0;tx<2;tx++){ const x=tx*48+.8, y=ty*48+.8; vfill(g,x,y,46.4,46.4,[[0,'#3a3a42'],[1,'#22222a']]); for(let i=0;i<160;i++) R(g,rgba(r()>.5?'#6a6a78':'#0e0e12',.5),x+r()*46,y+r()*46,.6,.6); R(g,rgba('#ffffff',.18),x,y,46.4,.5);
      poly(g,[[x+23.2,y+15],[x+31.4,y+23.2],[x+23.2,y+31.4],[x+15,y+23.2]],'#d8d0c0'); poly(g,[[x+23.2,y+18],[x+28.4,y+23.2],[x+23.2,y+28.4],[x+18,y+23.2]],'#7a2424'); R(g,rgba('#ffffff',.25),x+20,y+19,4,.5); }
    hfill(g,0,0,w,h,[[0,rgba('#ffffff',0)],[.45,rgba('#ffffff',.1)],[.6,rgba('#ffffff',0)]]); },3,507);
  const ip=(bg,title,sub,art,tc)=>(g,w,h)=>scPPoster(g,w,h,{bg,title,sub,art,tc,sc:tc});
  const A=scAtlasP(128,[
    ['medal0',48,40,(g,w,h)=>scPMosaic(g,w,h,(q,W,H)=>{ vfill(q,0,0,W,H*.6,[[0,'#f2a060'],[1,'#f2d8a0']]); poly(q,[[0,H*.62],[W*.3,H*.3],[W*.42,H*.25],[W*.55,H*.32],[W*.9,H*.62]],'#5a4a5a'); ell(q,W*.48,H*.2,W*.12,H*.08,'#c8c8d0'); vfill(q,0,H*.62,W,H*.38,[[0,'#2a7ac8'],[1,'#0e3a7a']]); },511)],
    ['medal1',48,40,(g,w,h)=>scPMosaic(g,w,h,(q,W,H)=>{ vfill(q,0,0,W,H,[[0,'#2a6ac8'],[1,'#0e2a6a']]); ell(q,W/2,H*.35,W*.16,H*.18,'#e0603a'); for(let k=0;k<6;k++){ q.strokeStyle='#e0603a'; q.lineWidth=2.5; q.beginPath(); q.moveTo(W/2+(k-2.5)*3,H*.45); q.quadraticCurveTo(W/2+(k-2.5)*8,H*.7,W/2+(k-2.5)*6+((k%2)*2-1)*5,H*.9); q.stroke(); } ell(q,W*.44,H*.32,1.5,1.5,'#ffffff'); ell(q,W*.56,H*.32,1.5,1.5,'#ffffff'); },512)],
    ['medal2',48,40,(g,w,h)=>scPMosaic(g,w,h,(q,W,H)=>{ vfill(q,0,0,W,H,[[0,'#1a4a9a'],[1,'#0e2a6a']]); q.strokeStyle='#3a6a2a'; q.lineWidth=2; q.beginPath(); q.moveTo(4,H*.3); q.quadraticCurveTo(W/2,H*.1,W-4,H*.4); q.stroke(); for(let k=0;k<4;k++){ ell(q,10+k*9,H*(.45+(k%2)*.15),5,3.5,'#f2d23a'); ell(q,9+k*9,H*(.43+(k%2)*.15),2,1.2,'#fff4a0'); ell(q,14+k*9,H*(.28+(k%2)*.08),4,2,'#4a8a3a'); } },513)],
    ['p0',32,48,ip(['#7a1a24','#2a0a10'],'TOSCA','TEATRO',(g,w,h)=>{ radial(g,16,24,12,[[0,'#f2d27a'],[1,rgba('#f2d27a',0)]]); ell(g,16,22,4,4.5,'#f2e0c8'); R(g,'#1a1a1a',12,26,8,12); R(g,'#c82a2a',10,28,12,3); },'#f2d27a')],
    ['p1',32,48,ip(['#f2e65a','#e8a020'],'LIMONELLA','DEL GOLFO',(g,w,h)=>{ R(g,'#f2f6d0',12,14,8,22); R(g,'#e8f0c8',14,10,4,4); R(g,'#f2d23a',12,22,8,8); ell(g,24,32,4,3,'#f2d23a'); ell(g,22,30,2,1,'#4a8a3a'); },'#2a5a1a')],
    ['p2',32,48,ip(['#5ac0e0','#2a7aa8'],'VESPINA','',(g,w,h)=>{ ell(g,9,34,4,4,'#1a1a1a'); ell(g,23,34,4,4,'#1a1a1a'); ell(g,9,34,2,2,'#c8ccd2'); ell(g,23,34,2,2,'#c8ccd2'); poly(g,[[8,32],[12,22],[18,24],[26,24],[26,32]],'#e8463a'); R(g,'#c8ccd2',11,15,2,8); R(g,'#1a1a1a',9,15,6,1.5); },'#ffffff')],
    ['p3',32,48,ip(['#f2ece0','#d8c8a8'],'CONCETTA','PIZZA',(g,w,h)=>{ ell(g,16,27,11,11,'#d8a050'); ell(g,16,27,9,9,'#c8302a'); for(let k=0;k<5;k++) ell(g,11+k*2.5,24+(k%2)*5,2,2,'#f6f0e0'); ell(g,18,30,1.5,1,'#3a8a3a'); },'#1a5a2a')],
    ['barF',64,24,(g,w,h)=>{ scPWood(g,0,0,w,h,'#5a3020','#3a1c10',521,{plank:24}); for(let x=2;x<w-2;x+=15.5){ scPPanel(g,x,3,13,h-7,'#6a3a24',{bev:.8}); scPMarble(g,x+2,5,9,h-11,'#f4f0ea','#8a8a90',522+x,{veins:2,sheen:false}); } R(g,'#d4ad5a',0,h-3,w,1); }],
    ['machine',32,24,(g,w,h)=>{ scPSteel(g,0,0,w,h,'#d8dce0',523); R(g,'#c8302a',0,0,w,4); scCtext(g,'GAGGIA',w/2,.5,'#ffffff',.6); for(const x of [7,16,25]){ ell(g,x,10,2.6,2.6,'#2a2a2e'); ell(g,x,10,1.6,1.6,'#c8ccd2'); R(g,'#1a1a1e',x-2.5,15,5,2.4); } ell(g,4,18,1.5,1.5,'#f2c230'); R(g,'#1a1a1e',0,h-2,w,2); }],
    ['vitrine',32,16,(g,w,h)=>{ R(g,'#f4ece0',0,0,w,h); for(let k=0;k<5;k++){ ell(g,4+k*6,10,2.6,2,'#d8a050'); ell(g,4+k*6,9.4,2,1.2,'#f2c070'); for(let j=0;j<3;j++) R(g,rgba('#8a5a20',.6),2.6+k*6+j*1.1,8.6,.4,2.5); } for(let k=0;k<4;k++){ ell(g,7+k*6,4,2.2,1.6,'#5a2a14'); ell(g,7+k*6,3.6,1.2,.6,'#f2e0c8'); } scPGlass(g,0,0,w,h,'#ffffff',{k:.4,wash:false}); }],
    ['kiosk',64,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#2a5a3a',{bev:1.2}); R(g,'#f2ece0',0,0,w,9); scStext(g,'GIORNALI',w/2,2,'#2a5a3a',1); const r=rng(524); for(let row=0;row<3;row++) for(let k=0;k<7;k++){ const x=3+k*8.5, y=12+row*11; scPPanel(g,x,y,7.5,10,['#f2f2ec','#e8463a','#f2c230','#2a6ad8','#f27ab0'][(r()*5)|0],{bev:.5}); R(g,'#1a1a1e',x+1,y+1,5.5,1.4); } }],
    ['crate',32,16,(g,w,h)=>{ scPWood(g,0,0,w,h,'#c8955a','#a06a36',525,{plank:5.3}); R(g,'#2a6ad8',8,5,16,6); scCtext(g,'AMALFI',16,5.6,'#f2d23a',.7); R(g,rgba('#000000',.4),0,0,1,h); R(g,rgba('#000000',.4),w-1,0,1,h); }],
    ['marbleW',32,16,(g,w,h)=>{ scPMarble(g,0,0,w,h,'#f4f0ea','#8a8a90',528,{veins:3}); R(g,rgba('#ffffff',.4),0,0,w,.5); R(g,rgba('#000000',.3),0,h-.5,w,.5); }],
    ['marbleV',16,64,(g,w,h)=>{ scPMarble(g,0,0,w,h,'#f4f0ea','#8a8a90',529,{veins:3}); R(g,rgba('#ffffff',.35),0,0,.6,h); R(g,rgba('#000000',.25),w-.6,0,.6,h); }],
    ['nameP',96,16,(g,w,h)=>{ scPMarble(g,0,0,w,h,'#f4f0ea','#8a8a90',526,{veins:3}); R(g,'#d4ad5a',1,1,w-2,.8); R(g,'#d4ad5a',1,h-1.8,w-2,.8); scStext(g,'NAPOLI MERIDIANA',w/2,5.5,'#0e3a7a',1,'#000000',.25); }],
    ['chalk',32,24,(g,w,h)=>{ R(g,'#5a3a24',0,0,w,h); R(g,'#1e2622',1.5,1.5,w-3,h-3); const it=[['CAFFE','1.20'],['CORNETTO','1.50'],['SFOGLIA','2.00']]; it.forEach(([a,b],i)=>{ text(g,a,3,3+i*6.5,'#f2ece0',.7); text(g,b,22,3+i*6.5,'#f2d27a',.7); }); }]
  ],3,510);
  const L=scAtlasP(64,[
    ['barSign',64,16,(g,w,h)=>{ R(g,'#1a0e1a',0,0,w,h); g.save(); g.filter='blur(1px)'; scCtext(g,'BAR MERIDIANA',w/2,5.5,'#ff6a40',1); g.restore(); scCtext(g,'BAR MERIDIANA',w/2,5.5,'#ffe0c8',1); R(g,'#f2d27a',2,2,w-4,.5); R(g,'#f2d27a',2,h-2.5,w-4,.5); }]
  ],0,527);
  return scNPT={wall,ceil,floor,A,L}; }

STATION_BUILD.naples=function naplesStation(){
  const T=scNaplesTex();
  const g=stationShell('naples',{floor:M(T.floor),floorTile:2.4,back:M(T.wall,{emissive:0x0c1830}),wallTile:2,wallTV:6.5,ceil:M(T.ceil,{emissive:0x0a1428}),ceilTile:1.6,H:6.5,pit:C('#14141c'),
    meta:{name:'Napoli Meridiana',city:'Naples',num:'05',sw:['#0e3a7a','#2a6ac8','#bfefff','#c89a3a','#1e1e24'],crew:['nonna','nonnac'],weapon:4,
      note:'Built to look like the inside of a sea cave: walls and vault in deep blue mosaic with wave lines of light, a gold mosaic band over a white marble dado, black lava stone inlaid with marble underfoot and a light well spiralling up through the ceiling. There is an espresso bar on the platform.',
      lamps:[lamp(-18,4.5,2.5,[.6,.9,1.5],13),lamp(0,5.5,2.5,[.75,1.05,1.6],13),lamp(18,4.5,2.5,[.6,.9,1.5],13),lamp(-6,2.2,5.6,[1.6,1.2,.7],7),lamp(20,2.4,5.5,[1.4,1.1,.65],6),lamp(0,3,-5,[.35,.5,.8],12)],amb:[.3,.34,.44],cam:{t:[-7,2.2,1.5],th:.5,ph:1.2,r:18}}});
  const st=ST.naples, K=st.K, BK=st.back, A=T.A.r, Lr=T.L.r, mA=M(T.A.t), mL=M(T.L.t,{unlit:true}), gold=K.a.gold, marble=A.marbleW;
  /* the wall's relief: a dark skirting, raised marble dado panels, the gold band proud of the mosaic, marble pilasters */
  scRunBX(BK,K.mA,K.a.rubber,-SL/2,SL/2,4,0,SZ1-.03,.2,.06); scRunBX(BK,K.mA,gold,-SL/2,SL/2,4,1.2,SZ1-.03,.06,.07); scRunBX(BK,K.mA,gold,-SL/2,SL/2,4,1.5,SZ1-.03,.04,.06);
  for(let x=-31;x<32;x+=2){ if(Math.abs(x+7)<2.4) continue; scBX(BK,mA,A.marbleW,x,.3,SZ1-.015,1.7,.8,.03); }
  for(let x=-30;x<=30;x+=6){ if(Math.abs(x+7)<2.6) continue; scBX(BK,mA,{s:A.marbleV,t:K.a.white},x,0,SZ1-.12,.5,6.5,.24); scBX(BK,K.mA,gold,x,1.18,SZ1-.12,.56,.1,.28); scBX(BK,K.mA,gold,x,6.2,SZ1-.14,.6,.3,.3); }
  /* mosaic medallions of the gulf in marble frames, the name in blue on marble */
  [[-27,0],[-15,1],[3,2],[15,0],[27,1]].forEach(([x,i])=>{ scBX(BK,K.mA,K.a.steelD,x,2.3,SZ1-.02,2.4,2.0,.03); scFrameU(BK,K.mA,gold,x,2.27,SZ1-.06,2.5,2.08,.08,.06); scPX(BK,mA,A['medal'+i],x,3.3,SZ1-.05,2.36,1.96,0,Math.PI,0); });
  for(const x of [-21,9,21]){ scBX(BK,K.mA,gold,x,4.6,SZ1-.03,4.3,.8,.05); scPX(BK,mA,A.nameP,x,5.0,SZ1-.062,4.2,.7,0,Math.PI,0); }
  /* wave lines of LED high on the back wall */ for(let k=0;k<2;k++) for(let x=-31;x<31;x+=1){ B(BK,U('#7ad8ff'),x+.5,5.6+k*.4+Math.sin(x*.25+k)*.15,SZ1-.05,1.02,.04,.03); }
  /* the light well: a spiralling cone going up through the vault */
  const cone=M(P2(16,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8f8ff'],[.3,'#6ab8f0'],[1,'#0e3a7a']]); for(let y=0;y<h;y+=6) R(g,'#bfefff',0,y,w,1); }),{unlit:true,double:true});
  mk(lathe([[0,4.5,4.5],[1.5,3,3],[3,1.6,1.6],[4.5,.6,.6]],20,{capB:false,capT:false}),cone,st.top,0,6.5,3);
  for(let k=0;k<24;k++){ const a=k/24*Math.PI*6, rr=4.2-k*.15; B(st.top,U('#e8f8ff'),Math.cos(a)*rr,6.6+k*.17,3+Math.sin(a)*rr,.3,.05,.3); }
  mk(torus(4.55,.12,6,32),C('#c89a40'),st.top,0,6.45,3,Math.PI/2);
  /* the espresso bar: walnut and marble front, a marble top, a brass foot rail, the machine, cups, a pastry case, stools */
  scBX(g,mA,{s:K.a.walnut,b:A.barF,t:K.a.walnut},-6,0,6.4,4,1.05,.9); scBX(g,mA,{s:marble,t:marble},-6,1.05,6.38,4.15,.06,1.02); scBX(g,K.mA,gold,-6,.2,5.82,4,.04,.04);
  scBX(g,mA,{s:K.a.steel,b:A.machine,t:K.a.steel},-7.2,1.11,6.6,.75,.5,.42); for(const dx of [-.22,.22]) mk(scCylU(.05,.05,.2,8,K.a.steel,K.a.steel),scCM(K.mA,K.a.steel,K.a.steel),g,-7.2+dx,1.71,6.6); mk(scCylU(.07,.07,.08,10,K.a.gold,K.a.gold),scCM(K.mA,K.a.gold,K.a.gold),g,-7.2,1.66,6.55);
  for(let k=0;k<6;k++){ mk(cyl(.07,.07,.01,10),C('#f2ece0'),g,-5.6+k*.28,1.115,6.1); mk(cyl(.035,.028,.06,8),C('#f2ece0'),g,-5.6+k*.28,1.15,6.1); }
  scBX(g,mA,{s:K.a.glass,b:A.vitrine,f:A.vitrine},-4.6,1.11,6.55,.8,.38,.45);
  for(let k=0;k<4;k++){ const x=-7.4+k*1; mk(scCylU(.19,.19,.07,12,K.a.walnut,A.barF),scCM(mA,K.a.walnut,A.barF),g,x,.78,5.55); mk(scCylU(.025,.025,.75,6,K.a.steel,K.a.steel),scCM(K.mA,K.a.steel,K.a.steel),g,x,.38,5.55); mk(torus(.13,.012,4,12),C('#c8ccd2'),g,x,.3,5.55,Math.PI/2); mk(scCylU(.18,.18,.02,12,K.a.steel,K.a.steel),scCM(K.mA,K.a.steel,K.a.steel),g,x,.01,5.55); }
  scBX(g,K.mA,K.a.steelD,-6,2.35,6.4,3.2,.7,.12); scPX(g,mL,Lr.barSign,-6,2.7,6.338,3.1,.66,0,Math.PI,0); scPX(g,mL,Lr.barSign,-6,2.7,6.462,3.1,.66); for(const dx of [-1.3,1.3]) scBX(st.top,K.mA,K.a.steelD,-6+dx,3.05,6.4,.03,3.45,.03);
  scPosterF(BK,K,mA,A.chalk,-3.4,1.65,SZ1-.03,1.1,.82,'walnut');
  /* marble benches, posters, a newsstand, lemon crates, bins and a clock */
  for(const x of [-20,14,22]){ scBX(g,mA,{s:marble,t:marble},x,0,5.5,2.4,.42,.6); scBX(g,K.mA,gold,x,.42,5.5,2.46,.04,.66); }
  [['p0',-21],['p1',9],['p2',21],['p3',-33]].filter(q=>q[1]>-32).forEach(([c,x])=>scPosterF(BK,K,mA,A[c],x,1.75,SZ1-.03,1.0,1.45,'gold'));
  scBX(g,mA,{s:K.a.white,b:A.kiosk,t:K.a.steelD},26,0,7.3,2.6,2.1,1.3); scBX(g,K.mA,K.a.steelD,26,2.1,7.1,3.0,.08,1.8);
  for(let k=0;k<5;k++){ scBX(g,mA,{s:A.crate,t:A.crate},18+(k%3)*.7,Math.floor(k/3)*.45,2.2,.6,.45,.45); for(let j=0;j<6;j++) mk(lathe([[0,.02,.02],[.04,.06,.05],[.08,.02,.02]],6),C('#f2d23a'),g,17.8+(k%3)*.7+(j%3)*.15,Math.floor(k/3)*.45+.43,2.1+(j>2?.15:0)); }
  scStBins(g,K,-1.2,7.9,Math.PI); scStBins(g,K,11.2,7.9,Math.PI); scStClock(st.top,K,-12,3.6,1.6,0,'clockC',.36,6.5); scStClock(st.top,K,12,3.6,1.6,0,'clockC',.36,6.5);
  scStWallKit(BK,K,-29.8,SZ1); scStCam(st.top,K,-2,6.5,.4,Math.PI*.9);
  const drop=weaponDrop(g,-3.2,5.8,'cello','#2a1a12'); drop.r[1]=Math.PI*.9; ST.naples.drop=drop;
  ST.naples.spots={nonna:{x:2,z:1.4,ry:Math.PI*.85,seat:true},nonnac:{x:.6,z:.3,ry:Math.PI*.8},nonnac2:{x:3.6,z:.2,ry:Math.PI*.95}};
};

/* ---------- London: a vaulted tiled tunnel, posters, a clock, wet floors ---------- */
let scLDT=null;
function scLondonTex(){ if(scLDT) return scLDT; const CR='#ece2c8', GN='#2a4a3a', MR='#8a2a2a';
  const wall=P2(96,115,(g,w,h)=>{
    scPTiles(g,0,0,w,65,8,4,CR,'#c8bca0',401,{bond:true,var:.08,gw:.6,glint:.45});
    scPPanel(g,0,65,w,2,GN,{bev:.4}); scPPanel(g,0,67,w,3,MR,{bev:.5,hi:.2}); scPPanel(g,0,70,w,2,GN,{bev:.4});
    scPTiles(g,0,72,w,37,8,4,'#2e5a44','#1a2a22',402,{bond:true,var:.12,gw:.6,glint:.5,gl:.2});
    vfill(g,0,109,w,6,[[0,'#2a2826'],[1,'#121110']]); R(g,rgba('#ffffff',.25),0,109,w,.5);
    scPAO(g,0,72,w,37,'b',10,.2); scPLight(g,0,0,w,h,.08,.15); },3,400);
  const vault=P2(64,64,(g,w,h)=>{ scPTiles(g,0,0,w,h,8,4,CR,'#c4b89c',403,{bond:true,var:.08,gw:.6,glint:.4}); const r=rng(404); for(let i=0;i<5;i++) ell(g,r()*w,r()*h,4+r()*6,2+r()*3,rgba('#8a7a5a',.08)); },2,405);
  const floor=P2(96,96,(g,w,h)=>{ R(g,'#2a2826',0,0,w,h); const r=rng(406);
    for(let y=0;y<h;y+=24) for(let x=((y/24)%2)*24;x<w+24;x+=48){ for(const [xx,ww] of [[x,48]]){ const c=scShadeOf('#625c56',(r()-.5)*.12); vfill(g,xx+.4,y+.4,ww-.8,23.2,[[0,scShadeOf(c,.06)],[1,scShadeOf(c,-.08)]]); for(let i=0;i<90;i++) R(g,rgba(r()>.5?'#8a8680':'#1a1816',.35),xx+r()*ww,y+r()*24,.6,.6); R(g,rgba('#ffffff',.12),xx,y,ww,.5); } }
    for(let i=0;i<4;i++){ const x=10+r()*(w-20),y=6+r()*(h-12),rx=6+r()*8,ry=2+r()*2; ell(g,x,y,rx,ry,rgba('#3a4048',.35)); ell(g,x-rx*.15,y-ry*.2,rx*.7,ry*.5,rgba('#a8b8c8',.22)); R(g,rgba('#ffe8c0',.45),x-rx*.5,y-.3,rx*.5,.5); R(g,rgba('#ffffff',.3),x+rx*.1,y+.4,rx*.3,.4); } },4,407);
  const vp=(bg,title,sub,art,tc)=>(g,w,h)=>{ scPPoster(g,w,h,{bg,title,sub,art,tc,sc:tc}); R(g,rgba('#3a2a1a',.12),0,0,w,h); };
  const A=scAtlasP(128,[
    ['post0',32,48,vp(['#f2e2b0','#d8b878'],'PEMBERTON','TEA',(g,w,h)=>{ ell(g,16,28,8,7,'#ffffff'); ell(g,16,28,6.5,5.5,'#2a6a4a'); R(g,'#ffffff',14,18,4,3); g.strokeStyle='#ffffff'; g.lineWidth=1.2; g.beginPath(); g.arc(24,28,3,-1.2,1.2); g.stroke(); },'#5a1a14')],
    ['post1',32,48,vp(['#1a1a2a','#3a1a2a'],'GALA','HAMLET',(g,w,h)=>{ radial(g,16,26,12,[[0,'#f2d27a'],[1,rgba('#f2d27a',0)]]); ell(g,16,24,4,4.5,'#f2e8d8'); ell(g,14.5,23.5,.8,.8,'#1a1a1a'); ell(g,17.5,23.5,.8,.8,'#1a1a1a'); R(g,'#1a1a1a',11,30,10,8); R(g,MR,4,40,24,1); },'#f2d27a')],
    ['post2',32,48,vp(['#7ac0e0','#f2d8a0'],'BRIGHTWATER','BY RAIL',(g,w,h)=>{ R(g,'#2a6ab8',0,28,w,8); R(g,'#f2e0a8',0,36,w,12); for(let k=0;k<4;k++) poly(g,[[4+k*7,36],[7+k*7,26],[10+k*7,36]],['#e0473a','#ffffff','#2a9a5a','#f2c230'][k]); ell(g,24,12,4,4,'#fff6c8'); },'#1a2a5a')],
    ['post3',32,48,vp(['#c8302a','#7a1410'],'SWIFT','BOOTS',(g,w,h)=>{ poly(g,[[8,34],[8,18],[14,18],[14,28],[24,30],[25,34]],'#1a1a1a'); R(g,'#5a3a2a',8,34,17,1.5); R(g,rgba('#ffffff',.4),9,19,1,10); },'#ffffff')],
    ['post4',32,48,vp(['#f2f2e8','#c8c8b8'],'ROYAL','SOAP',(g,w,h)=>{ ell(g,16,28,9,5,'#f27ab0'); ell(g,16,27,7,3.5,'#ffb0d0'); for(let k=0;k<8;k++) ell(g,6+k*3,18-(k%3)*2,1.4,1.4,rgba('#7ac0e0',.7)); },'#2a4a8a')],
    ['post5',32,48,vp(['#2a4a3a','#0e1e16'],'CITY','DRY GIN',(g,w,h)=>{ R(g,'#c8e0d8',12,16,8,18); R(g,'#c8e0d8',14.5,12,3,4); R(g,'#f2ece0',12,22,8,6); R(g,MR,12,24,8,1.5); },'#f2ece0')],
    ['name',64,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,CR,{bev:.8,hi:.06}); R(g,MR,1,1,w-2,1); R(g,MR,1,h-2,w-2,1); scPPanel(g,3,4,w-6,8,'#1a2a6a',{bev:.6,hi:.2}); scStext(g,'KINGS MERIDIAN',w/2,5.5,'#ffffff',1); }],
    ['wayout',64,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#1a2a6a',{bev:.8,hi:.2}); R(g,'#f2ece0',1,1,w-2,.6); R(g,'#f2ece0',1,h-1.6,w-2,.6); scStext(g,'WAY OUT',26,5.5,'#ffffff',1); poly(g,[[48,4.5],[56,8],[48,11.5]],'#f2c230'); R(g,'#f2c230',43,7,6,2); }],
    ['choc',32,64,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#a8201a',{bev:1.2}); R(g,'#d4ad5a',2,2,w-4,1); scStext(g,'DUNMORE',w/2,4,'#f2d27a',1); scCtext(g,'CHOCOLATE',w/2,10.5,'#f2ece0',.8); scPGlass(g,4,16,24,14,'#c8d8e0'); R(g,'#d4ad5a',3,15,26,1); for(let k=0;k<4;k++){ scPPanel(g,4,34+k*6,24,5,'#d4ad5a',{bev:.5}); R(g,'#3a2410',14,35.5+k*6,4,1.4); scCtext(g,'1D',8,35+k*6,'#3a2410',.6); } scPAO(g,0,0,w,h,'b',8,.25); }],
    ['iron',16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a5a4a'],[1,'#1a2a22']]); R(g,rgba('#ffffff',.3),0,0,w,.5); for(let y=3;y<h;y+=5) ell(g,w/2,y,2,1.2,rgba('#000000',.25)); }],
    ['bucket',16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e0302a'],[1,'#8a1410']]); scCtext(g,'FIRE',w/2,6,'#ffffff',.8); R(g,rgba('#ffffff',.35),0,0,w,.6); }]
  ],3,408);
  const L=scAtlasP(64,[
    ['dot',64,16,(g,w,h)=>{ R(g,'#0a0a0c',0,0,w,h); const t=(s,x,y)=>{ text(g,s,x,y,'#ffa020',1); }; t('1 MERIDIAN 24',2,2); t('DUE',50,2); t('STAND BACK',2,9); for(let y=0;y<h;y+=1) R(g,rgba('#000000',.25),0,y+.7,w,.3); }]
  ],0,409);
  return scLDT={wall,vault,floor,A,L}; }

STATION_BUILD.london=function londonStation(){
  const T=scLondonTex();
  const g=stationShell('london',{floor:M(T.floor),floorTile:2.4,back:M(T.wall),wallTile:2,wallTV:2.4,H:2.4,pit:C('#2a2826'),
    meta:{name:'Kings Meridian',city:'London',num:'04',sw:['#ece2c8','#2a4a3a','#8a2a2a','#3a3634','#f2c230'],crew:['gaffer','gafferc'],weapon:3,
      note:'A Victorian tube hall dug out to fit the Meridian: one long barrel vault of cream bevelled tile over both tracks, a green-and-maroon band over a bottle-green dado, framed posters, a big platform clock and puddles that never dry. The firm come down the stairs singing.',
      lamps:[lamp(-22,3.6,3.2,[1.5,1.22,.86],12),lamp(-8,3.6,3.2,[1.5,1.22,.86],12),lamp(8,3.6,3.2,[1.5,1.22,.86],12),lamp(22,3.6,3.2,[1.5,1.22,.86],12),lamp(0,4,-5,[.85,.72,.55],12),lamp(24,2.4,6.5,[1.3,1.0,.6],6)],amb:[.44,.4,.34],cam:{t:[-7,2,1],th:.5,ph:1.18,r:18}}});
  const st=ST.london, K=st.K, BK=st.back, A=T.A.r, Lr=T.L.r, mA=M(T.A.t), mL=M(T.L.t,{unlit:true});
  /* the barrel vault over both tracks and the platform, steel ribs every 6 m */
  const R0=9.6+DW*.55, zc=-1.0-DW*.55, yc=2.4, segs=14; vaultArc(g,R0,zc,yc,segs,M(T.vault),null,0); scVaultCap(g,M(T.vault),R0,zc,yc,segs);
  for(let x=-30;x<=30;x+=6){ for(let i=0;i<segs;i++){ const a=-Math.PI/2+(i+.5)/segs*Math.PI; if(Math.sin(a)>.1) continue; scBX(g,mA,A.iron,x,yc+Math.cos(a)*(R0-.05)-.1,zc+Math.sin(a)*(R0-.05),.25,.2,R0*Math.PI/segs*1.02,0,a,0); } }
  /* cables and a conduit running along the vault on the track side, a steel batten of lights along the crown */
  for(let k=0;k<3;k++){ const a=-.95+k*.05; scBX(g,K.mA,K.a.rubber,0,yc+Math.cos(a)*(R0-.12),zc+Math.sin(a)*(R0-.12),SL,.05,.05); }
  for(let x=-29;x<=29;x+=3.6){ const a=.6; const y=yc+Math.cos(a)*(R0-.25), z=zc+Math.sin(a)*(R0-.25); scBX(g,K.mA,K.a.steelD,x,y-.08,z,2.6,.08,.22); scPX(g,K.mL,K.l.tube,x,y-.085,z,2.5,.14,Math.PI/2); }
  /* the wall's relief: a black skirting, the raised band, poster frames, name boards */
  scRunBX(BK,K.mA,K.a.rubber,-SL/2,SL/2,4,0,SZ1-.025,.12,.05); scRunBX(BK,mA,A.iron,-SL/2,SL/2,4,.95,SZ1-.02,.1,.04);
  for(let k=0;k<8;k++){ const x=-26+k*7.4; if(Math.abs(x+7.5)<2.6||Math.abs(x+15)<2.4||Math.abs(x-14.7)<2.4||x>22) continue; scPosterF(BK,K,mA,A['post'+(k%6)],x,1.1,SZ1-.035,1.15,1.65,'walnut'); }
  for(const x of [-15,14.7]){ scBX(BK,K.mA,K.a.walnut,x,1.72,SZ1-.03,3.5,.82,.05); scPX(BK,mA,A.name,x,2.13,SZ1-.062,3.4,.75,0,Math.PI,0); }
  /* pendant opal globes along the platform */ const glass=M(scKitC().L.t,{unlit:true});
  for(let x=-27;x<=27;x+=6){ const z=3.2, y=2.9, top=yc+Math.sqrt(R0*R0-(z-zc)**2); scBX(g,K.mA,K.a.steelD,x,y+.3,z,.02,top-y-.3,.02); mk(scLatheU([[0,.05,.05],[.06,.18,.18],[.25,.2,.2],[.4,.14,.14],[.45,.05,.05]],12,K.l.globe),scMatFor(glass,K.l.globe),g,x,y-.15,z); mk(scLatheU([[0,.06,.06],[.1,.08,.08],[.16,.03,.03]],8,K.a.steelD),scMatFor(K.mA,K.a.steelD),g,x,y+.2,z); }
  /* the platform clock and the dot-matrix indicator */
  const ct=yc+Math.sqrt(R0*R0-(2.4-zc)**2); scStClock(g,K,2,4.6,2.4,0,'clockB',.6,ct);
  { const z=1.0, top=yc+Math.sqrt(R0*R0-(z-zc)**2); scBX(g,K.mA,K.a.steelD,5,2.85,z,2.3,.62,.2); scPX(g,mL,Lr.dot,5,3.16,z+.102,2.15,.5); scPX(g,mL,Lr.dot,5,3.16,z-.102,2.15,.5,0,Math.PI,0); for(const dx of [-.9,.9]) scBX(g,K.mA,K.a.steelD,5+dx,3.47,z,.03,top-3.47,.03); }
  /* benches: oak slats on green cast-iron ends */ for(const x of [-18,-4,10,17.5]) scStBench(g,K,x,x===-4?6.25:6.95,Math.PI,{len:2.2,seat:'oak',leg:'steelD'});
  mk(wplane(SL,.5),M(textTex(64,8,'#d8b020',[['MIND THE GAP','c',2,'#14141c']]),{repeat:[8,1]}),g,0,.009,-.42,-Math.PI/2);
  /* stairs coming down at the back corner, with brass nosings and a handrail; a way-out sign over them */
  for(let k=0;k<10;k++){ B(g,C('#4a4642'),26-k*.4,0,7.2,.4,(10-k)*.18,1.8); scBX(g,K.mA,K.a.gold,26-k*.4-.17,(10-k)*.18-.02,7.2,.06,.03,1.8); }
  for(const z of [6.25,8.15]) scBX(g,K.mA,K.a.gold,24.2,1.95,z,4.4,.05,.05,0,0,.42);
  scBX(g,K.mA,K.a.steelD,21.6,2.0,6.0,2.0,.5,.12); scPX(g,mA,A.wayout,21.6,2.25,5.937,1.9,.44,0,Math.PI,0); scPX(g,mA,A.wayout,21.6,2.25,6.063,1.9,.44); for(const dx of [-.8,.8]) scBX(g,K.mA,K.a.steelD,21.6+dx,2.5,6.0,.03,6,.03);
  /* a chocolate machine, fire buckets, litter bins, fire and help points */
  scBX(BK,mA,{s:K.a.walnut,f:A.choc},-22.3,0,SZ1-.3,.8,1.7,.5,Math.PI); scBX(BK,K.mA,K.a.gold,-22.3,1.7,SZ1-.3,.84,.05,.54,Math.PI);
  const bk=N(BK,13.5,1.0,SZ1-.12); scBX(bk,mA,A.iron,0,.5,0,1.1,.06,.2); for(let k=0;k<3;k++) mk(scCylU(.13,.1,.28,10,A.bucket,A.bucket),scCM(mA,A.bucket,A.bucket),bk,-.36+k*.36,.38,0);
  for(const x of [-.2,7.3]){ mk(scCylU(.24,.24,.85,12,A.iron,K.a.rubber),scCM(mA,A.iron,K.a.rubber),g,x,.425,7.95); mk(scCylU(.26,.26,.05,12,K.a.gold,K.a.gold),scCM(K.mA,K.a.gold,K.a.gold),g,x,.86,7.95); }
  scStWallKit(BK,K,-29.5,SZ1,-.15); scStSpeaker(g,K,-10,2.25,SZ1-.12,Math.PI); scStSpeaker(g,K,18,2.25,SZ1-.12,Math.PI);
  const drop=weaponDrop(g,-4,6.2,'briefcase'); drop.r[1]=Math.PI; ST.london.drop=drop;
  ST.london.spots={gaffer:{x:4,z:1.2,ry:Math.PI*.85},gafferc:{x:2.4,z:2.6,ry:Math.PI*.75},gafferc2:{x:6,z:.4,ry:Math.PI*.95}};
};
const STATION_ORDER=['tokyo','london','naples'];
