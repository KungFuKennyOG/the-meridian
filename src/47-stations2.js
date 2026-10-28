
/* =====================================================================================================
   MORE STATIONS, each after a real one:
   Hong Kong   – an MTR platform: one bold tile colour on every wall, stainless columns, yellow signs.
   Lake Baikal – a Moscow-metro palace: a yellow mosaic barrel vault, marble arcades, bronze chandeliers.
   Rio         – a cavern blasted out of raw granite, like Cardeal Arcoverde, with a Selaron-style tiled stair.
   Las Vegas   – a casino concourse under a Fremont Street LED canopy.
   Tokyo gets colour (scLightbox ads, a kiosk) and the last-night katana in the ticket office.
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
let scHKT=null;
function scHkTex(){ if(scHKT) return scHKT; const red='#b8202a';
  const wall=P2(96,211,(g,w,h)=>{
    vfill(g,0,0,w,38,[[0,'#f6f6f2'],[.8,'#dcdcd8'],[1,'#c4c4c0']]); R(g,'#ffffff',0,24,w,3); R(g,rgba('#000000',.2),0,27,w,.8); for(let x=0;x<w;x+=48) R(g,rgba('#000000',.15),x,0,.6,38);
    scPSteel(g,0,38,w,5,'#c8ccd2',201);
    scPTiles(g,0,43,w,158,3,3,red,'#7a1018',202,{var:.16,gw:.45,glint:.25,gl:.16,sh:.12}); scPAO(g,0,43,w,158,'t',6,.25);
    vfill(g,0,201,w,10,[[0,'#3a3a3e'],[.15,'#5a5a60'],[1,'#1e1e22']]); const r=rng(203); for(let i=0;i<120;i++) R(g,rgba('#ffffff',.18),r()*w,201+r()*10,.5,.5);
    scPAO(g,0,43,w,158,'b',22,.22); scPLight(g,0,0,w,h,.06,.12); },3,200);
  const floor=P2(96,96,(g,w,h)=>{ const r=rng(204); R(g,'#8a8478',0,0,w,h);
    for(let ty=0;ty<4;ty++) for(let tx=0;tx<4;tx++){ const base=(tx+ty)%2?'#d8d2c6':'#c4bdb0', c=scShadeOf(base,(r()-.5)*.08), x=tx*24+.35, y=ty*24+.35; vfill(g,x,y,23.3,23.3,[[0,scShadeOf(c,.05)],[1,scShadeOf(c,-.06)]]);
      for(let i=0;i<60;i++) R(g,[rgba('#fffaf0',.5),rgba('#5a5048',.4),rgba('#a8988a',.5)][i%3],x+r()*23,y+r()*23,.5+r()*.5,.5+r()*.5); R(g,rgba('#ffffff',.3),x,y,23.3,.4); }
    hfill(g,0,0,w,h,[[0,rgba('#ffffff',0)],[.45,rgba('#ffffff',.08)],[.6,rgba('#ffffff',0)]]); },4,205);
  const ceil=P2(64,64,(g,w,h)=>{ for(let x=0;x<w;x+=16) scPSteel(g,x,0,16,h,'#d4d8dc',206+x,{streak:false}); for(let x=0;x<w;x+=16) R(g,'#7a7e84',x,0,.6,h); R(g,'#9a9ea4',0,h-.6,w,.6); },2,207);
  const poster=(bg,title,sub,art)=>(g,w,h)=>scPPoster(g,w,h,{bg,title,sub,art,sun:mix(bg[0],'#ffffff',.4)});
  const A=scAtlasP(128,[
    ['name',64,32,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#f4f4f0',{bev:1.2,hi:.05,lo:.08}); scHanziRow(g,10,2.5,3,11.5,red,9,false,.2); text(g,'MERIDIAN',(w-textW('MERIDIAN',1))/2|0,18,'#1a1a1e',1); text(g,'CENTRAL',(w-textW('CENTRAL',1))/2|0,25,'#1a1a1e',1); R(g,red,0,h-1.5,w,1.5); }],
    ['colBand',32,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,red,{bev:1,hi:.2,lo:.2}); R(g,'#ffffff',0,1.5,w,.6); R(g,'#ffffff',0,h-2,w,.6); scHanziRow(g,6,4,2,7.5,'#ffffff',12,false,.4); }],
    ['psdHead',64,8,(g,w,h)=>{ scPPanel(g,0,0,w,h,red,{bev:.6}); text(g,'MERIDIAN 24',3,1.5,'#ffffff',1); glyphs(g,48,1.5,3,5,'#ffffff',14,false); }],
    ['counterF',64,24,(g,w,h)=>{ scPWood(g,0,0,w,h,'#7a1a14','#4a0a0a',210,{plank:24}); for(let x=2;x<w-2;x+=15){ R(g,'#d4ad5a',x,3,13,1); R(g,'#d4ad5a',x,h-5,13,1); R(g,'#d4ad5a',x,3,1,h-7); R(g,'#d4ad5a',x+12,3,1,h-7); ell(g,x+6.5,h/2-.5,3,3,'#d4ad5a'); ell(g,x+6.5,h/2-.5,2,2,'#7a1a14'); glyphs(g,x+5,h/2-2,1,4,'#f2d27a',x,false); } R(g,'#2a0a08',0,h-1.5,w,1.5); }],
    ['lacq',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c8302a'],[1,'#7a1410']]); R(g,'#d4ad5a',0,0,w,1); R(g,'#d4ad5a',0,h-1,w,1); hfill(g,0,0,w,h,[[0,rgba('#ffffff',0)],[.3,rgba('#ffffff',.15)],[.4,rgba('#ffffff',0)]]); }],
    ['steamer',16,8,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#ecd49a'],[1,'#c0a060']]); for(let x=0;x<w;x+=1.5) R(g,rgba('#7a5a2a',.35),x,0,.4,h); R(g,'#a07a3a',0,0,w,1); R(g,'#a07a3a',0,h-1,w,1); }],
    ['news',64,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#2a6a3a',{bev:1.2}); const r=rng(220); for(let row=0;row<3;row++){ R(g,'#d8d8d0',2,14+row*11,w-4,1); for(let k=0;k<7;k++){ const x=3+k*8.5, y=4+row*11; scPPanel(g,x,y,7.5,10,['#f2f2ec','#e8463a','#f2c230','#2a6ad8','#f27ab0'][(r()*5)|0],{bev:.5}); R(g,'#1a1a1e',x+1,y+1,5.5,1.4); glyphs(g,x+1,y+4,2,3,rgba('#1a1a1e',.8),k+row*7,false); } } R(g,'#1a1a1e',0,h-4,w,4); }],
    ['newsSide',32,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#2a6a3a',{bev:1.2}); R(g,'#f2c230',0,6,w,5); text(g,'NEWS',4,6.5,'#1a1a1e',1); }],
    ['avm',32,64,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#f28a2a',{bev:1.2}); R(g,'#1a1a1e',4,6,24,16); vfill(g,5,7,22,14,[[0,'#3a8ad8'],[1,'#1a3a7a']]); text(g,'OCTA',8,9,'#ffffff',1); text(g,'ADD $',7,15,'#f2c230',1); R(g,'#2a2c30',6,26,20,10); ell(g,16,31,4,3,'#f2c230'); for(let i=0;i<3;i++) R(g,'#1a1a1e',8+i*6,40,4,3); R(g,'#1a1a1e',6,48,20,4); R(g,'#ffffff',0,h-10,w,3); glyphs(g,4,h-6,6,4,'#1a1a1e',33,false); scPAO(g,0,0,w,h,'b',10,.2); }],
    ['p0',32,48,poster(['#1a1a3a','#0a0a14'],'DRAGON','HARBOUR',(g,w,h)=>{ for(let k=0;k<6;k++) R(g,['#ff3fa4','#29e0e6','#f5c542'][k%3],3+k*4.5,22-k%3*3,3,18+k%3*3); R(g,'#0a0a14',0,36,w,4); ell(g,16,14,5,5,'#f2e8d0'); R(g,'#c8202a',11,18,10,12); })],
    ['p1',32,48,poster(['#f2c230','#c86a10'],'JADE','HOTPOT',(g,w,h)=>{ ell(g,16,30,12,5,'#2a2a2e'); ell(g,16,28,11,4,'#c8302a'); ell(g,12,27,2,1,'#f2e0b0'); ell(g,20,28,2,1.2,'#7ac040'); for(let k=0;k<3;k++){ g.strokeStyle=rgba('#ffffff',.7); g.lineWidth=.8; g.beginPath(); g.moveTo(10+k*6,22); g.quadraticCurveTo(8+k*6,17,11+k*6,12); g.stroke(); } })],
    ['p2',32,48,poster(['#2a5a8a','#0a1a3a'],'MERIDIAN','BANK',(g,w,h)=>{ for(let k=0;k<5;k++) R(g,mix('#c8dcf0','#2a5a8a',k/5),4+k*5,14+(k%2)*6,4,24-(k%2)*6); poly(g,[[4,14],[16,6],[28,14]],'#d4ad5a'); })]
  ],3,208);
  const neon=(seed,c,c2,n)=>(g,w,h)=>{ R(g,'#140a14',0,0,w,h); R(g,rgba(c,.5),0,0,w,1); R(g,rgba(c,.5),0,h-1,w,1); R(g,rgba(c,.5),0,0,1,h); R(g,rgba(c,.5),w-1,0,1,h);
    const s=(h-8)/n*.8; g.save(); g.filter='blur(1.2px)'; scHanziRow(g,3,4,n,s,c,seed,true); g.restore(); scHanziRow(g,3,4,n,s,c2,seed,true,.25); };
  const L=scAtlasP(128,[
    ['n0',16,64,neon(301,'#ff3fa4','#ffd0ea',4)],['n1',16,64,neon(302,'#29e0e6','#d8fbff',4)],['n2',16,64,neon(303,'#f5c542','#fff4c0',4)],['n3',16,64,neon(304,'#7cf06a','#e0ffd8',4)],
    ['nH',64,16,(g,w,h)=>{ R(g,'#140a14',0,0,w,h); g.save(); g.filter='blur(1px)'; text(g,'GOLDEN CRANE',8,5,'#ff3fa4',1); g.restore(); text(g,'GOLDEN CRANE',8,5,'#ffe0f0',1); R(g,'#29e0e6',2,2,w-4,.6); R(g,'#29e0e6',2,h-2.6,w-4,.6); }],
    ['menu',64,24,(g,w,h)=>{ R(g,'#1a0e0a',0,0,w,h); R(g,'#d4ad5a',0,0,w,.8); R(g,'#d4ad5a',0,h-.8,w,.8); const items=['HAR GOW','SIU MAI','CHAR SIU','LO MAI']; items.forEach((s,i)=>{ const x=(i%2)*32+2, y=2+(i>>1)*11; ell(g,x+3,y+3.5,2.6,2.2,'#f2e0b0'); ell(g,x+3,y+3,1.6,1.2,'#f6f0e0'); text(g,s,x+7,y+1,'#ffffff',.8); text(g,'$'+(18+i*4),x+7,y+6,'#f5c542',.8); }); }],
    ['ysign',64,16,(g,w,h)=>{ R(g,'#f2c230',0,0,w,h); R(g,'#1a1a1e',0,0,w,.8); R(g,'#1a1a1e',0,h-.8,w,.8); R(g,'#1a1a1e',2,2,12,12); text(g,'A',6.5,5.5,'#f2c230',1); text(g,'EXIT  A',18,2.5,'#1a1a1e',1); glyphs(g,18,9,7,4,'#1a1a1e',41,false); }],
    ['ysign2',64,16,(g,w,h)=>{ R(g,'#f2c230',0,0,w,h); R(g,'#1a1a1e',0,0,w,.8); R(g,'#1a1a1e',0,h-.8,w,.8); text(g,'TO TRAINS',4,2.5,'#1a1a1e',1); glyphs(g,4,9,6,4,'#1a1a1e',42,false); poly(g,[[52,4],[60,8],[52,12]],'#1a1a1e'); }],
    ['board',64,16,(g,w,h)=>{ R(g,'#0e0e12',0,0,w,h); text(g,'MERIDIAN 24',2,2,'#f5c542',1); text(g,'1 MIN',46,2,'#2ae08a',1); glyphs(g,2,9,5,4,'#f5c542',44,false); text(g,'PLAT 2',40,9,'#ffffff',1); }],
    ['lantern',16,16,(g,w,h)=>{ radial(g,8,8,9,[[0,'#ffd080'],[.5,'#ff4a30'],[1,'#a01810']]); for(let x=3;x<14;x+=3) R(g,rgba('#7a0a08',.35),x,0,.5,h); R(g,'#d4ad5a',0,0,w,1.5); R(g,'#d4ad5a',0,h-1.5,w,1.5); }]
  ],0,209);
  return scHKT={wall,floor,ceil,A,L}; }

STATION_BUILD.hongkong=function hongkongStation(){
  const red='#b8202a', T=scHkTex();
  const g=stationShell('hongkong',{floor:M(T.floor),floorTile:2.4,back:M(T.wall),wallTile:2,wallTV:4.4,ceil:M(T.ceil),ceilTile:1.6,H:4.4,pit:C('#3a3434'),
    meta:{name:'Meridian Central',city:'Hong Kong',num:'02',sw:[red,'#e8ecee','#f2c230','#c8ccd2','#2a2a30'],crew:['lau','lauc'],weapon:1,
      note:'Built like an MTR platform: every wall in one bold colour of tile (this one is lucky red), stainless columns, platform screen doors, bright fluorescent light and yellow signs with black lettering. A dim sum counter does takeaway on the platform under a cluster of old neon.',
      lamps:[lamp(-22,4.1,3,[1.2,1.2,1.25],13),lamp(-4,4.1,3,[1.2,1.2,1.25],13),lamp(12,4.1,3,[1.2,1.2,1.25],13),lamp(26,4.1,3,[1.1,1.1,1.15],11),lamp(0,3.5,-5,[.65,.65,.7],12),lamp(-12,2.6,6.4,[1.5,.85,.95],6)],amb:[.44,.42,.43],cam:{t:[-7,1.6,2.5],th:.38,ph:1.25,r:17}}});
  const st=ST.hongkong, K=st.K, BK=st.back, top=st.top, A=T.A.r, Lr=T.L.r, mA=M(T.A.t), mL=M(T.L.t,{unlit:true});
  /* relief on the wall: granite skirting, steel trim under the bulkhead */
  scRunBX(BK,K.mA,K.a.steelD,-SL/2,SL/2,4,0,SZ1-.025,.2,.05); scRunBX(BK,K.mA,K.a.steel,-SL/2,SL/2,4,3.47,SZ1-.03,.12,.07);
  /* white enamel name panels in raised steel frames, every 13 m as on the MTR */
  for(let x=-26;x<=26;x+=13){ if(x===-13) continue; scBX(BK,K.mA,K.a.steelD,x,1.55,SZ1-.03,2.75,1.45,.06); scFrameU(BK,K.mA,K.a.steel,x,1.55,SZ1-.07,2.8,1.45,.05,.04); scPX(BK,mA,A.name,x,2.275,SZ1-.065,2.66,1.33,0,Math.PI,0); }
  /* platform screen doors: full height glass, steel posts, a red header */
  for(let x=-30;x<30;x+=2){ if(Math.abs(((x+31)%31)-1)<1.5||Math.abs(x+.5)<1.6) continue;
    scBX(g,K.mA,K.a.steel,x+1,0,-1.45,.1,2.1,.12); scBX(g,K.mA,K.a.glass,x+1,.25,-1.45,1.9,1.7,.03); scBX(g,K.mA,K.a.steelD,x+1,.08,-1.45,1.9,.17,.06); scBX(g,mA,{s:K.a.steel,f:A.psdHead,b:A.psdHead},x+1,2.05,-1.45,2,.2,.12); }
  /* stainless columns with a red band */
  for(let x=-24;x<=24;x+=8){ scBX(g,K.mA,{s:K.a.steel,t:K.a.white},x,0,3,.6,4.4,.6); scBX(g,mA,A.colBand,x,1.75,3,.64,.5,.64); scBX(g,K.mA,K.a.steelD,x,0,3,.66,.15,.66); }
  /* yellow signs, the next-train board, clocks, light rows, speakers and cameras */
  [['ysign',-16],['ysign2',12],['ysign2',-28]].forEach(([s,x])=>{ scLightbox(g,K,mL,Lr[s],x,3.15,1,2.5,.6,.14,'steelD',0); scPX(g,mL,Lr[s],x,3.45,.922,2.43,.53,0,Math.PI,0); for(const dx of [-1,1]) scBX(top,K.mA,K.a.steelD,x+dx,3.75,1,.03,.65,.03); });
  scBX(g,K.mA,K.a.steelD,2,2.95,.3,2.2,.62,.18); scPX(g,mL,Lr.board,2,3.26,.395,2.05,.5); scPX(g,mL,Lr.board,2,3.26,.205,2.05,.5,0,Math.PI,0); scBX(top,K.mA,K.a.steelD,2,3.57,.3,.04,.85,.04);
  for(const x of [-4,20]) scStClock(top,K,x,3.3,1.0,0,'clockA',.3,4.4);
  for(const z of [.8,5.2]) for(let x=-30;x<=30;x+=3){ scBX(top,K.mA,K.a.steelD,x,4.3,z,2.5,.1,.22); scPX(top,K.mL,K.l.tube,x,4.295,z,2.4,.14,Math.PI/2); }
  for(const x of [-20,-2,16]) scStSpeaker(top,K,x,4.2,1.8,0); for(const x of [-14,8]) scStCam(top,K,x,4.4,.4,Math.PI*.9); scStTray(top,K,4.15,7.7);
  /* the dim sum takeaway counter: red lacquer and gold, steamers, a menu board, lanterns, and a neon cluster over it */
  scBX(g,mA,{s:A.lacq,b:A.counterF,t:A.lacq},-12,0,6.3,3.6,1.05,1.0); scBX(g,K.mA,{s:K.a.stone,t:K.a.stone},-12,1.05,6.25,3.75,.06,1.12); scBX(g,K.mA,K.a.walnut,-12,0,5.78,3.62,.1,.06);
  const bam=M(T.A.t); for(let k=0;k<12;k++) mk(scCylU(.17,.17,.12,12,A.steamer,A.steamer),scCM(bam,A.steamer,A.steamer),g,-13.4+(k%3)*.4,1.17+Math.floor(k/3)*.125,6.5+(k%2)*.05);
  for(let k=0;k<3;k++) mk(scCylU(.17,.17,.06,12,A.steamer,A.steamer),scCM(bam,A.steamer,A.steamer),g,-13.4+k*.4,1.17+4*.125-.03,6.5);
  mk(scCylU(.16,.18,.5,12,K.a.steel,K.a.steelD),scCM(K.mA,K.a.steel,K.a.steelD),g,-11,1.36,6.55); for(let k=0;k<5;k++) mk(cyl(.035,.03,.08,8),C('#f2ece0'),g,-11.9+k*.12,1.12,6.0);
  scBX(BK,K.mA,K.a.steelD,-12,1.9,SZ1-.05,3.4,1.3,.08); scPX(BK,mL,Lr.menu,-12,2.55,SZ1-.095,3.2,1.2,0,Math.PI,0);
  for(const x of [-13.6,-10.4]){ scBX(top,K.mA,K.a.steelD,x,2.9,6.0,.02,1.5,.02); mk(scLatheU([[0,.1,.1],[.08,.26,.26],[.36,.26,.26],[.44,.1,.1]],12,Lr.lantern),scMatFor(mL,Lr.lantern),g,x,2.45,6.0); }
  [['n0',-15.4,2.75],['n1',-14.2,2.5],['n2',-9.8,2.6],['n3',-8.6,2.85],['n1',14.6,2.7],['n0',15.8,2.45],['n2',21,2.8]].forEach(([c,x,y])=>{ const n=N(BK,x,y,SZ1-.62); scBX(n,K.mA,K.a.steelD,0,0,0,.12,1.45,.8); scPX(n,mL,Lr[c],.062,.725,0,.74,1.4,0,Math.PI/2,0); scPX(n,mL,Lr[c],-.062,.725,0,.74,1.4,0,-Math.PI/2,0); scBX(n,K.mA,K.a.steelD,0,1.2,.42,.04,.04,.4); });
  scBX(BK,K.mA,K.a.steelD,-12,3.35,SZ1-.06,3.4,.85,.1); scPX(BK,mL,Lr.nH,-12,3.775,SZ1-.115,3.3,.8,0,Math.PI,0);
  const box_=N(g,-10.5,1.1,6.0); B(box_,C('#f4f2ec'),0,0,0,.36,.18,.26); B(box_,C('#c8202a'),0,.18,0,.36,.02,.26); const p=N(box_,0,.24,0,0,.5,Math.PI/2); pDual(p);
  /* a news stand, an add-value machine, perch seats, bins, posters, fire and help points */
  scBX(g,mA,{s:A.newsSide,b:A.news,t:K.a.steelD},20,0,7.2,2.6,2.0,1.3); scBX(g,K.mA,K.a.steelD,20,2.0,6.9,2.9,.08,1.9); scBX(g,mA,A.colBand,20,2.08,5.97,2.9,.18,.06);
  for(let k=0;k<6;k++) B(g,C(['#f2f2ec','#e8463a','#f2c230'][k%3]),18.9+k*.42,.9,6.45,.34,.04,.28,(k-3)*.05);
  scBX(g,K.mA,K.a.white,18.95,0,6.45,2.5,.9,.1);
  scBX(BK,mA,{s:K.a.white,f:A.avm},29.6,0,SZ1-.3,.8,1.8,.55,Math.PI);
  for(const x of [-20,-4,4]){ scStBench(g,K,x,6.9,Math.PI,{len:2,seat:'steel',leg:'steelD',back:false}); }
  scStBins(g,K,-3.6,7.9,Math.PI); scStBins(g,K,7.6,7.9,Math.PI);
  [['p0',-19.5],['p1',6.5],['p2',-30]].forEach(([c,x])=>scPosterF(BK,K,mA,A[c],x,1.1,SZ1-.03,1.25,1.85));
  scStWallKit(BK,K,-22.6,SZ1); scStWallKit(BK,K,9.6,SZ1);
  /* big backlit adverts between the name panels */ [['p1',-23.5],['p2',16.5],['p0',22.5],['p1',3]].forEach(([c,x])=>scLightbox(BK,K,M(T.A.t,{unlit:true}),A[c],x,1.0,SZ1-.06,1.2,1.75,.12,'steel',Math.PI));
  ST.hongkong.drop=dropRing(N(g,-10.5,0,5.0));
  ST.hongkong.spots={lau:{x:3,z:.8,ry:Math.PI*.85},lauc:{x:1.2,z:-.4,ry:Math.PI*.75},lauc2:{x:5,z:-.2,ry:Math.PI*.95}};
};

/* ---------- Lake Baikal: an underground palace ---------- */
let scBKT=null;
function scBaikalTex(){ if(scBKT) return scBKT;
  /* icy-blue mosaic scenes: tesserae laid in rows, a gilt border */
  const tess=(g,w,h,fn,seed)=>{ const r=rng(seed); const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const q=cv.getContext('2d',{willReadFrequently:true}); fn(q,w,h);
    const d=q.getImageData(0,0,w,h).data; R(g,'#c8a050',0,0,w,h); R(g,'#e8d090',0,0,w,.8);
    for(let y=2;y<h-2;y+=1.5) for(let x=2+((y*2)%2)*.6;x<w-2;x+=1.5){ const i=((Math.min(h-1,y|0))*w+(Math.min(w-1,x|0)))*4; const c='#'+[d[i],d[i+1],d[i+2]].map(v=>Math.max(0,Math.min(255,v+((r()-.5)*30|0))).toString(16).padStart(2,'0')).join(''); R(g,c,x,y,1.25,1.25); R(g,rgba('#ffffff',.18),x,y,1.25,.3); } };
  const lake=(q,w,h)=>{ vfill(q,0,0,w,h*.55,[[0,'#bfe0f8'],[1,'#6aa8e0']]); poly(q,[[0,h*.55],[w*.25,h*.25],[w*.45,h*.5],[w*.7,h*.2],[w,h*.5],[w,h*.6],[0,h*.6]],'#4a6a9a'); poly(q,[[w*.18,h*.32],[w*.25,h*.25],[w*.32,h*.33]],'#f4fbff'); poly(q,[[w*.63,h*.28],[w*.7,h*.2],[w*.77,h*.29]],'#f4fbff'); vfill(q,0,h*.58,w,h*.42,[[0,'#2a6ab8'],[1,'#123a7a']]); for(let k=0;k<5;k++) R(q,'#bfe8ff',w*.1+k*w*.17,h*(.7+k%2*.1),w*.1,1); };
  const seal=(q,w,h)=>{ vfill(q,0,0,w,h,[[0,'#1a3a7a'],[.6,'#3a7ac8'],[1,'#d8f0ff']]); ell(q,w*.5,h*.82,w*.45,h*.14,'#e8f8ff'); ell(q,w*.5,h*.62,w*.22,h*.13,'#6a7a8a'); ell(q,w*.68,h*.55,w*.09,h*.08,'#7a8a9a'); ell(q,w*.72,h*.53,1,1,'#101820'); for(let k=0;k<12;k++) R(q,'#ffffff',(k*37)%w,(k*23)%(h*.5),1,1); };
  const fish=(q,w,h)=>{ vfill(q,0,0,w,h,[[0,'#3a8ad8'],[1,'#0e2a6a']]); for(let k=0;k<3;k++){ const x=w*(.25+k*.25), y=h*(.35+(k%2)*.25); ell(q,x,y,w*.12,h*.07,'#c8d8e8'); poly(q,[[x-w*.12,y],[x-w*.2,y-h*.07],[x-w*.2,y+h*.07]],'#a8b8c8'); ell(q,x+w*.07,y-1,1,1,'#101820'); } for(let k=0;k<4;k++){ q.strokeStyle='#8ad0ff'; q.lineWidth=1; q.beginPath(); for(let x=0;x<=w;x+=2) q.lineTo(x,h*(.15+k*.25)+Math.sin(x*.4+k)*1.5); q.stroke(); } };
  const pines=(q,w,h)=>{ vfill(q,0,0,w,h,[[0,'#0a1a4a'],[1,'#2a5a9a']]); ell(q,w*.75,h*.25,w*.1,w*.1,'#f4f0d0'); R(q,'#d8ecff',0,h*.8,w,h*.2); for(let k=0;k<7;k++){ const x=w*(.06+k*.15), b=h*.85, ht=h*(.35+(k%3)*.12); poly(q,[[x-w*.06,b],[x,b-ht],[x+w*.06,b]],k%2?'#1a4a3a':'#2a5a4a'); poly(q,[[x-w*.03,b-ht*.5],[x,b-ht],[x+w*.03,b-ht*.5]],'#e8f4ff'); } };
  const wall=P2(96,144,(g,w,h)=>{
    scPMould(g,0,0,w,4,'#e8c870'); scPMould(g,0,4,w,5.6,'#f2ece4');
    for(let x=0;x<w;x+=48) scPMarble(g,x+.3,9.6,47.4,76.6,'#f2ece4','#9a8a7a',301+x,{veins:5}); R(g,'#c8b8a4',47.8,9.6,.5,76.8);
    scPAO(g,0,9.6,w,76.8,'t',5,.2); scPAO(g,0,9.6,w,76.8,'b',8,.18);
    scPMould(g,0,86.4,w,4.8,'#c89a40');
    for(let x=0;x<w;x+=24){ scPWood(g,x,91.2,24,43.2,'#a8683a','#7a4422',305+x,{plank:43.2}); R(g,rgba('#000000',.4),x+23.5,91.2,.5,43.2); R(g,rgba('#000000',.25),x+3,95,18,.5); R(g,rgba('#ffffff',.15),x+3,95.5,18,.4); R(g,rgba('#000000',.25),x+3,130,18,.5); }
    vfill(g,0,134.4,w,9.6,[[0,'#8a2a2a'],[1,'#4a1414']]); R(g,rgba('#ffffff',.35),0,134.4,w,.6); const r=rng(306); for(let i=0;i<80;i++) R(g,rgba('#ffffff',.15),r()*w,134.4+r()*9.6,.5,.5);
    scPLight(g,0,0,w,h,.05,.12); },3,300);
  const vault=P2(64,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f6e2a0'],[1,'#e8c878']]);
    for(const [x,y] of [[16,16],[48,48]]){ ell(g,x+.6,y+.8,9,9,rgba('#a87a30',.35)); ell(g,x,y,9,9,'#fbf0cc'); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; ell(g,x+Math.cos(a)*5.5,y+Math.sin(a)*5.5,2.4,2.4,'#f0d898'); ell(g,x+Math.cos(a)*5.5-.4,y+Math.sin(a)*5.5-.4,1.4,1.4,'#fffaf0'); } ell(g,x,y,2.6,2.6,'#d4ad5a'); ell(g,x-.6,y-.6,1,1,'#fff4c0'); }
    for(const [x,y] of [[48,16],[16,48]]){ poly(g,[[x,y-6],[x+6,y],[x,y+6],[x-6,y]],'#f0d898'); poly(g,[[x,y-4],[x+4,y],[x,y+4],[x-4,y]],'#fbf0cc'); }
    g.strokeStyle='#d8b060'; g.lineWidth=1; g.beginPath(); for(let x=0;x<=w;x+=1) g.lineTo(x,32+Math.sin(x/w*Math.PI*4)*4); g.stroke(); R(g,'#c8a050',0,0,w,.8); },3,307);
  const floor=P2(96,96,(g,w,h)=>{ const r=rng(308); for(let ty=0;ty<4;ty++) for(let tx=0;tx<4;tx++){ const red=(tx+ty)%2, x=tx*24, y=ty*24; vfill(g,x,y,24,24,red?[[0,'#9a3230'],[1,'#6a1e1c']]:[[0,'#6a6a70'],[1,'#4a4a50']]);
      for(let i=0;i<90;i++) R(g,rgba(r()>.6?'#ffffff':r()>.5?'#1a1a1a':(red?'#d86a5a':'#a8a8b0'),.25),x+r()*24,y+r()*24,.5+r()*.6,.5+r()*.6); R(g,rgba('#ffffff',.25),x,y,24,.4); R(g,rgba('#000000',.3),x,y+23.6,24,.4); R(g,rgba('#000000',.3),x+23.6,y,.4,24); }
    hfill(g,0,0,w,h,[[0,rgba('#ffffff',0)],[.4,rgba('#ffffff',.1)],[.55,rgba('#ffffff',0)]]); },3,309);
  const poster=(bg,title,sub,art)=>(g,w,h)=>scPPoster(g,w,h,{bg,title,sub,art,sun:mix(bg[0],'#ffffff',.4)});
  const A=scAtlasP(128,[
    ['woodP',32,24,(g,w,h)=>{ scPWood(g,0,0,w,h,'#b8784a','#8a5230',311,{plank:h}); R(g,rgba('#ffffff',.3),0,0,w,.6); R(g,rgba('#000000',.35),0,h-.6,w,.6); g.strokeStyle=rgba('#4a2410',.5); g.lineWidth=.6; g.strokeRect(4,4,w-8,h-8); ell(g,w/2,h/2,4,4,rgba('#4a2410',.25)); ell(g,w/2-.5,h/2-.5,3,3,rgba('#ffd8a0',.2)); }],
    ['marble',32,64,(g,w,h)=>scPMarble(g,0,0,w,h,'#f4eee6','#9a8a7a',312,{veins:4})],
    ['medal0',48,40,(g,w,h)=>tess(g,w,h,lake,313)],['medal1',48,40,(g,w,h)=>tess(g,w,h,seal,314)],['medal2',48,40,(g,w,h)=>tess(g,w,h,fish,315)],['medal3',48,40,(g,w,h)=>tess(g,w,h,pines,316)],
    ['plaque',64,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#7a2222'],[1,'#3a0e0e']]); const r=rng(317); for(let i=0;i<60;i++) R(g,rgba('#ffffff',.15),r()*w,r()*h,.5,.5); R(g,'#d4ad5a',1,1,w-2,.6); R(g,'#d4ad5a',1,h-1.6,w-2,.6); scStext(g,'BAIKALSKAYA',w/2,5.5,'#f2d27a',1,'#000000',.6); }],
    ['kiosk',64,48,(g,w,h)=>{ scPWood(g,0,0,w,h,'#9a5a30','#6a3418',318,{plank:6}); R(g,'#1e3a6a',0,0,w,9); scStext(g,'GAZETA',w/2,2,'#f2d27a',1); scPGlass(g,6,13,52,20,'#a8c8e0'); R(g,'#5a3018',5,12,54,1); R(g,'#5a3018',5,33,54,1.5); const r=rng(319); for(let k=0;k<8;k++) scPPanel(g,8+k*6.2,24,5.4,8,['#f2f2ec','#c8302a','#2a5aa8','#f2c230'][k%4],{bev:.5}); R(g,'#4a2410',0,36,w,2); }],
    ['fur',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#8a6a4a'],[1,'#4a3220']]); const r=rng(320); for(let i=0;i<260;i++){ const x=r()*w,y=r()*h; R(g,rgba(r()>.5?'#c8a07a':'#2a1a0e',.5),x,y,.4,1.5+r()*2); } }],
    ['p0',32,48,poster(['#2a5aa8','#0e1e4a'],'OMUL','BAIKAL FISH',(g,w,h)=>{ ell(g,16,26,10,4,'#c8d8e8'); poly(g,[[6,26],[2,22],[2,30]],'#a8b8c8'); ell(g,22,25,1,1,'#101820'); R(g,'#8ad0ff',0,34,w,1); })],
    ['p1',32,48,poster(['#c8302a','#5a0e0e'],'IRKUT','TEA',(g,w,h)=>{ R(g,'#d4ad5a',11,18,10,16); R(g,'#f2e8d0',12,19,8,12); R(g,'#a8401a',12,22,8,9); g.strokeStyle='#d4ad5a'; g.lineWidth=1.2; g.beginPath(); g.arc(22,26,3,-1.4,1.4); g.stroke(); })],
    ['granite',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#9a3230'],[1,'#5a1a18']]); const r=rng(321); for(let i=0;i<120;i++) R(g,rgba(r()>.5?'#ffffff':'#1a1a1a',.2),r()*w,r()*h,.6,.6); R(g,rgba('#ffffff',.35),0,0,w,.6); }]
  ],3,310);
  const L=scAtlasP(64,[
    ['board',64,16,(g,w,h)=>{ R(g,'#0e0e12',0,0,w,h); text(g,'MERIDIAN 24',2,2,'#f2a020',1); text(g,'PLATFORM 1',2,9,'#f2a020',1); text(g,'-30C',46,9,'#8ad0ff',1); }],
    ['ice',16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f4fcff'],[1,'#8ac8ec']]); for(let k=0;k<4;k++) R(g,rgba('#ffffff',.6),k*4,0,.6,h); }]
  ],0,322);
  return scBKT={wall,vault,floor,A,L}; }

STATION_BUILD.baikal=function baikalStation(){
  const T=scBaikalTex();
  const g=stationShell('baikal',{floor:M(T.floor),floorTile:2.4,back:M(T.wall),wallTile:2,wallTV:3,H:3.0,pit:C('#3a3230'),
    meta:{name:'Baikalskaya',city:'Lake Baikal',num:'03',sw:['#f2d890','#2a5aa8','#f2ece4','#8a2a2a','#d4ad5a'],crew:['volkov','volkovc'],weapon:2,
      note:'An underground palace in the Moscow-metro manner: a yellow stucco barrel vault set with icy-blue mosaics of the lake, white marble arcades, carved larch wainscot, bronze chandeliers on chains and a red-and-grey granite floor. Freezing outside, warm and gold down here.',
      lamps:[lamp(-21,3.6,3,[1.45,1.15,.75],12),lamp(-7,3.8,3,[1.45,1.15,.75],12),lamp(7,3.8,3,[1.45,1.15,.75],12),lamp(21,3.6,3,[1.45,1.15,.75],12),lamp(0,4,-5,[.8,.65,.45],12),lamp(12,1.6,6,[.7,1.0,1.4],6)],amb:[.42,.36,.3],cam:{t:[-7,2,2.5],th:.4,ph:1.2,r:18}}});
  const st=ST.baikal, K=st.K, BK=st.back, A=T.A.r, Lr=T.L.r, mA=M(T.A.t), mL=M(T.L.t,{unlit:true}), gold=K.a.gold;
  st.H=12.4; const top=st.top; vaultArc(top,9.8+DW*.55,-.8-DW*.55,2.6,16,M(T.vault),null,0); scVaultCap(top,M(T.vault),9.8+DW*.55,-.8-DW*.55,2.6,16,1.6,SL/2-.02);
  /* gilt ribs across the vault */ { const R0=9.8+DW*.55-.06, zc=-.8-DW*.55; for(let x=-SL/2+4;x<SL/2;x+=8) for(let i=0;i<16;i++){ const a=-Math.PI/2+(i+.5)/16*Math.PI; if(Math.sin(a)>.1) continue; scBX(top,K.mA,gold,x,2.6+Math.cos(a)*R0-.12,zc+Math.sin(a)*R0,.3,.24,R0*Math.PI/16*1.03,0,a,0); } }
  /* mosaic panels set into the vault crown, in gilt frames */ for(let x=-28;x<=28;x+=8){ const n=N(top,x,2.6+9.68,-.8); scPX(n,mA,A['medal'+((x/8+4)&3)],0,0,0,3,2.4,Math.PI/2); for(const dz of [-1.25,1.25]) scBX(n,K.mA,gold,0,-.05,dz,3.2,.08,.12); for(const dx of [-1.55,1.55]) scBX(n,K.mA,gold,dx,-.05,0,.12,.08,2.6); }
  /* the back wall's relief: granite skirting, carved larch panels, a bronze rail, a gilt cornice */
  scRunBX(BK,K.mA,A.granite,-SL/2,SL/2,2,0,SZ1-.03,.2,.06); scRunBX(BK,K.mA,K.a.walnut,-SL/2,SL/2,4,1.08,SZ1-.04,.05,.08); scRunBX(BK,K.mA,gold,-SL/2,SL/2,4,1.14,SZ1-.025,.04,.05); scRunBX(BK,K.mA,gold,-SL/2,SL/2,4,2.8,SZ1-.06,.08,.12);
  for(let x=-31.5;x<32;x+=1){ if(Math.abs(x+7)<2.4) continue; scBX(BK,mA,A.woodP,x,.3,SZ1-.015,.78,.68,.03); }
  /* icy mosaics of the lake in raised gilt frames, and the station's name in gold on red granite */
  [[-25,0],[-14,1],[9,2],[22,3]].forEach(([x,i])=>{ scBX(BK,K.mA,K.a.steelD,x,1.3,SZ1-.02,1.7,1.36,.03); scFrameU(BK,K.mA,gold,x,1.28,SZ1-.06,1.8,1.42,.07,.06); scPX(BK,mA,A['medal'+i],x,1.99,SZ1-.05,1.66,1.28,0,Math.PI,0); });
  for(const x of [3,15.5]){ scBX(BK,K.mA,gold,x,1.55,SZ1-.03,2.7,.78,.04); scPX(BK,mA,A.plaque,x,1.94,SZ1-.055,2.6,.68,0,Math.PI,0); }
  /* marble pilasters with gilt capitals, each carrying a bronze sconce with frosted glass */ for(let x=-29;x<=29;x+=5.8){ if(Math.abs(x+7)<2.6) continue; scBX(BK,mA,{s:A.marble,t:A.marble},x,1.2,SZ1-.05,.42,1.6,.1); scBX(BK,K.mA,gold,x,2.62,SZ1-.07,.52,.16,.14); scBX(BK,K.mA,gold,x,1.18,SZ1-.07,.5,.08,.14); const n=N(BK,x,2.0,SZ1-.14); scBX(n,K.mA,gold,0,0,0,.12,.3,.08); mk(scLatheU([[0,.05,.05],[.1,.12,.12],[.28,.09,.09],[.32,.03,.03]],10,Lr.ice),scMatFor(mL,Lr.ice),n,0,.3,-.12); scBX(n,K.mA,gold,0,.25,-.06,.04,.04,.14); }
  /* marble arcade between platform and track: marble shafts, gilt capitals and bases, arches */
  for(let x=-28;x<=28;x+=4){ scBX(g,mA,{s:A.marble,t:A.marble},x,.3,-.6,.56,2.9,.56); scBX(g,K.mA,gold,x,3.2,-.6,.8,.25,.8); scBX(g,K.mA,gold,x,3.1,-.6,.66,.1,.66); scBX(g,mA,A.granite,x,0,-.6,.8,.3,.8); scBX(g,K.mA,gold,x,.3,-.6,.66,.06,.66); }
  for(let x=-26;x<=26;x+=4) for(let k=0;k<6;k++){ const a=Math.PI*(k+.5)/6, ax=x+Math.cos(a)*-1.7; scBX(g,mA,A.marble,ax,3.4+Math.sin(a)*1.2,-.6,.7,.2,.5,0,0,Math.PI/2-a); }
  /* bronze chandeliers on chains, with glowing globes */ const glass=M(scKitC().L.t,{unlit:true});
  for(const x of [-20,-10,0,10,20]){ scBX(top,K.mA,gold,x,4.6,2.2,.03,7,.03); const c=N(top,x,4.2,2.2); mk(torus(.7,.05,4,18),C('#c89a40'),c,0,0,0,Math.PI/2); mk(torus(.45,.04,4,14),C('#c89a40'),c,0,.35,0,Math.PI/2);
    for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; scBX(c,K.mA,gold,Math.cos(a)*.7,0,Math.sin(a)*.7,.04,.08,.04); mk(scLatheU([[0,.03,.03],[.06,.08,.08],[.18,.07,.07],[.22,.02,.02]],8,K.l.globe),scMatFor(glass,K.l.globe),c,Math.cos(a)*.7,.06,Math.sin(a)*.7); } mk(scLatheU([[0,.05,.05],[.2,.2,.2],[.5,.08,.08]],10,gold),scMatFor(K.mA,gold),c,0,-.4,0); }
  /* carved benches, a gazeta kiosk, a samovar stand, an ice seal on a plinth, bronze urns for litter, a clock */
  for(const x of [-18,-6,6,18]) scStBench(g,K,x,6.95,Math.PI,{len:2.2,seat:'walnut',leg:'gold'});
  scBX(g,mA,{s:K.a.walnut,b:A.kiosk,t:K.a.walnut},25,0,7.4,2.6,2.3,1.4); scBX(g,K.mA,K.a.walnut,25,2.3,7.3,2.9,.12,1.7); scBX(g,K.mA,gold,25,2.42,6.45,2.9,.06,.06);
  const sv=N(g,-11,0,7.6); scBX(sv,K.mA,K.a.walnut,0,0,0,1.2,.8,.6); scBX(sv,K.mA,K.a.oak,0,.8,0,1.3,.04,.7); mk(scLatheU([[0,.12,.12],[.1,.18,.18],[.35,.2,.2],[.45,.12,.12],[.55,.06,.06],[.62,.09,.09]],12,gold),scMatFor(K.mA,gold),sv,-.2,.84,0); for(let k=0;k<4;k++){ mk(scCylU(.035,.03,.11,8,gold,gold),scCM(K.mA,gold,gold),sv,.2+(k%2)*.14,.9,(k>>1)*.14-.07); }
  scPosterF(BK,K,mA,A.p0,-10.2,1.3,SZ1-.03,.9,1.3,'gold'); scPosterF(BK,K,mA,A.p1,-3.4+31,1.3,SZ1-.03,.9,1.3,'gold');
  const ic=N(g,12,0,6.2); scBX(ic,mA,{s:A.marble,t:A.marble},0,0,0,1.1,.7,.8); mk(scLatheU([[0,.35,.25],[.2,.42,.3],[.45,.3,.24],[.7,.14,.13],[.82,.1,.1],[.9,.02,.02]],12,Lr.ice),scMatFor(mL,Lr.ice),ic,0,.7,0,0,0,-.35); mk(scLatheU([[0,.12,.1],[.12,.16,.14],[.28,.1,.1],[.3,.02,.02]],10,Lr.ice),scMatFor(mL,Lr.ice),ic,.38,1.1,0,0,0,-1.1);
  for(const x of [-23,3.2]){ mk(scLatheU([[0,.16,.16],[.15,.22,.22],[.55,.2,.2],[.7,.16,.16],[.75,.2,.2]],12,gold),scMatFor(K.mA,gold),g,x,0,7.9); }
  scStClock(top,K,-14,3.1,1.6,0,'clockC',.36,12); scStClock(top,K,14,3.1,1.6,0,'clockC',.36,12);
  scBX(g,K.mA,K.a.walnut,3,2.6,1.4,2.2,.62,.18); scPX(g,mL,Lr.board,3,2.91,1.495,2.05,.5); scPX(g,mL,Lr.board,3,2.91,1.305,2.05,.5,0,Math.PI,0); scBX(top,K.mA,gold,3,3.22,1.4,.04,8.8,.04);
  scStWallKit(BK,K,-29.6,SZ1);
  /* the luggage trolley with a fur coat over the shotgun */
  const tr=N(g,-2,0,5.6,0,.3,0); scBX(tr,K.mA,K.a.steel,0,.3,0,1.6,.06,.7); for(const dx of [-.6,.6]) for(const dz of [-.3,.3]) mk(cyl(.1,.1,.05,8),C('#14141c'),tr,dx,.1,dz,Math.PI/2); scBX(tr,K.mA,K.a.steel,-.8,.3,0,.05,1.0,.7); scBX(tr,K.mA,K.a.rubber,-.8,1.28,0,.07,.06,.74);
  scBX(tr,mA,{s:K.a.walnut,t:K.a.walnut},.1,.36,0,.8,.5,.55); scBX(tr,K.mA,gold,.1,.6,0,.82,.04,.57); scBX(tr,mA,A.fur,.2,.86,0,1.1,.12,.7,0,0,.1); scBX(tr,mA,A.fur,.62,.4,0,.14,.5,.68,0,0,.12);
  const sg=N(tr,.0,.98,.0,0,1.2,0); pShotgun(sg); ST.baikal.drop=dropRing(N(g,-2,0,5.6));
  ST.baikal.spots={volkov:{x:4,z:.6,ry:Math.PI*.85},volkovc:{x:2.2,z:2.0,ry:Math.PI*.8},volkovc2:{x:6,z:1.8,ry:Math.PI*.95}};
};

/* ---------- Rio: a granite cavern and a tiled stair ---------- */
let scRIT=null;
function scRioTex(){ if(scRIT) return scRIT; const tileCols=['#e0473a','#f2c230','#2a9a5a','#2a6ad8','#f27ab0','#f2ece0','#e88a3a','#7ac0d8'];
  const rockP=(g,w,h,seed)=>{ const r=rng(seed); vfill(g,0,0,w,h,[[0,'#968e86'],[1,'#7a726a']]);
    for(let i=0;i<14;i++){ const y=r()*h, th=2+r()*6; g.fillStyle=rgba(r()>.5?'#b0a69a':'#5a524a',.25); g.beginPath(); g.moveTo(0,y); for(let x=0;x<=w;x+=4) g.lineTo(x,y+Math.sin(x*.08+i)*3+x*.15); g.lineTo(w,y+th+w*.15); g.lineTo(0,y+th); g.closePath(); g.fill(); }
    for(let i=0;i<30;i++) ell(g,r()*w,r()*h,3+r()*7,2+r()*4,rgba(r()>.5?'#b4aaa0':'#4e4640',.3));
    for(let i=0;i<500;i++) R(g,['rgba(240,226,214,.6)','rgba(30,26,24,.5)','rgba(200,150,130,.5)'][i%3],r()*w,r()*h,.5+r()*.5,.5+r()*.5);
    for(let i=0;i<7;i++){ let x=r()*w,y=r()*h; g.strokeStyle=rgba('#2a2420',.65); g.lineWidth=.6; g.beginPath(); g.moveTo(x,y); for(let k=0;k<5;k++){ x+=(r()-.5)*10; y+=r()*8; g.lineTo(x,y); } g.stroke(); } };
  const rock=P2(64,64,(g,w,h)=>rockP(g,w,h,601),4,601);
  const wall=P2(64,52,(g,w,h)=>{ rockP(g,w,h,602); vfill(g,0,0,w,h,[[0,rgba('#1a1410',.25)],[.5,rgba('#ffb060',0)],[.85,rgba('#ffb060',.18)],[1,rgba('#ffc070',.3)]]); },4,602);
  const floor=P2(96,96,(g,w,h)=>{ const r=rng(603); R(g,'#5a5650',0,0,w,h);
    for(let y=0;y<h;y+=1.6) for(let x=((y/1.6)%2)*.8;x<w;x+=1.6){ const v=Math.sin(x/w*Math.PI*4+Math.sin(y/h*Math.PI*2)*2.2); const black=v>.45; const c=black?scShadeOf('#2a2a2e',(r()-.5)*.3):scShadeOf('#e8e0d0',(r()-.5)*.14); R(g,c,x+.12,y+.12,1.36,1.36); R(g,rgba('#ffffff',.2),x+.12,y+.12,1.36,.3); }
    hfill(g,0,0,w,h,[[0,rgba('#ffffff',0)],[.45,rgba('#ffe0b0',.08)],[.6,rgba('#ffffff',0)]]); },0,604);
  const A=scAtlasP(128,[
    ['selaron',64,38,(g,w,h)=>{ const q=rng(611); R(g,'#f2ece0',0,0,w,h); for(let y=0;y<h;y+=4.75) for(let x=0;x<w;x+=4){ const c=tileCols[q()*tileCols.length|0]; vfill(g,x+.35,y+.35,3.3,4.05,[[0,scShadeOf(c,.18)],[1,scShadeOf(c,-.15)]]); const k=q(); if(k<.18) ell(g,x+2,y+2.4,1.1,1.1,tileCols[q()*8|0]); else if(k<.3){ poly(g,[[x+2,y+1],[x+3.2,y+2.4],[x+2,y+3.8],[x+.8,y+2.4]],tileCols[q()*8|0]); } else if(k<.36){ ell(g,x+1.5,y+2,.8,.8,'#e0473a'); ell(g,x+2.5,y+2,.8,.8,'#e0473a'); poly(g,[[x+.7,y+2.2],[x+3.3,y+2.2],[x+2,y+3.6]],'#e0473a'); } R(g,rgba('#ffffff',.4),x+.35,y+.35,3.3,.4); } R(g,'#f2ece0',0,0,w,1); R(g,'#f2ece0',0,h-1,w,1); }],
    ['azul',64,16,(g,w,h)=>{ R(g,'#f2f2ee',0,0,w,h); for(let x=0;x<w;x+=8){ R(g,'#c8ccd0',x,0,.4,h); } R(g,'#c8ccd0',0,8,w,.4); for(let x=4;x<w;x+=8) for(const y of [4,12]){ ell(g,x,y,2.4,2.4,'#2a4aa8'); ell(g,x,y,1.2,1.2,'#f2f2ee'); } R(g,'#1e3a8a',3,3,w-6,10); scStext(g,'MERIDIANO',w/2,3.8,'#ffffff',1); scCtext(g,'COPACABANA',w/2,9,'#f2c230',.8); }],
    ['juice',64,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#f2c230',{bev:1.2}); R(g,'#2a9a5a',0,0,w,9); scStext(g,'SUCOS DA PRAIA',w/2,2,'#ffffff',1); scPGlass(g,4,12,56,18,'#f4f8f0',{k:.6}); for(let k=0;k<7;k++){ const c=['#f2a020','#e0473a','#7ac040','#f27ab0','#f2d23a','#a85ad8','#f2a020'][k]; ell(g,9+k*7.5,24,3.2,3.2,c); ell(g,8+k*7.5,23,1,1,rgba('#ffffff',.6)); } for(let k=0;k<3;k++){ poly(g,[[12+k*18,17],[14+k*18,13],[16+k*18,17]],'#3a8a3a'); ell(g,14+k*18,19,2.4,3,'#e8b030'); } R(g,'#e0473a',0,34,w,2); for(let x=0;x<w;x+=6) R(g,'#ffffff',x,36,3,h-36); }],
    ['cart',32,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#2a9a5a',{bev:1}); R(g,'#f2ece0',2,4,w-4,7); scCtext(g,'COCO',w/2,4.5,'#2a9a5a',.9); scCtext(g,'GELADO',w/2,8.2,'#e0473a',.6); }],
    ['coco',16,16,(g,w,h)=>{ radial(g,6,6,10,[[0,'#a8d878'],[.6,'#5a8a3a'],[1,'#2a4a1a']]); }],
    ['cooler',32,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#2a6ad8',{bev:1,hi:.2}); R(g,'#f2ece0',0,0,w,3); scStext(g,'GELO',w/2,6,'#ffffff',1); R(g,'#1a4a9a',0,h-2,w,2); }],
    ['trunk',16,32,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#5a4030'],[.4,'#9a7a56'],[1,'#4a3424']]); for(let y=0;y<h;y+=2.4){ R(g,rgba('#2a1a10',.5),0,y,w,.6); R(g,rgba('#d8b890',.3),0,y+.6,w,.4); } }],
    ['p0',32,48,(g,w,h)=>scPPoster(g,w,h,{bg:['#ff6a3a','#a8205a'],title:'SAMBA',sub:'NOITE',sun:'#ffd060',art:(g,w,h)=>{ for(let k=0;k<5;k++){ g.strokeStyle=['#f2c230','#2ae0a0','#ffffff','#29e0e6','#ff3fa4'][k]; g.lineWidth=1; g.beginPath(); g.arc(16,30,4+k*2.4,Math.PI,0); g.stroke(); } R(g,'#1a0a14',0,36,w,4); }})],
    ['p1',32,48,(g,w,h)=>scPPoster(g,w,h,{bg:['#2a9a5a','#0e4a2a'],title:'GUARANITO',sub:'GELADO',ts:.8,art:(g,w,h)=>{ R(g,'#e0473a',12,16,8,18); R(g,'#e0473a',14,12,4,4); R(g,'#f2c230',12,22,8,5); ell(g,8,34,3,1.5,'#f2c230'); }})],
    ['p2',32,48,(g,w,h)=>scPPoster(g,w,h,{bg:['#7ac0e8','#2a7ab8'],title:'BONDINHO',sub:'PAO DE MEL',ts:.8,art:(g,w,h)=>{ poly(g,[[0,40],[8,22],[14,40]],'#3a5a3a'); poly(g,[[10,40],[22,14],[32,40]],'#2a4a2a'); g.strokeStyle='#1a1a1a'; g.lineWidth=.5; g.beginPath(); g.moveTo(8,22); g.lineTo(22,14); g.stroke(); R(g,'#e0473a',14,17,3,2); }})]
  ],3,610);
  return scRIT={rock,wall,floor,A}; }

STATION_BUILD.rio=function rioStation(){
  const T=scRioTex(), tileCols=['#e0473a','#f2c230','#2a9a5a','#2a6ad8','#f27ab0','#f2ece0','#e88a3a','#7ac0d8'];
  const g=stationShell('rio',{floor:M(T.floor),floorTile:2.4,back:M(T.wall),wallTile:3.2,wallTV:2.6,H:2.6,pit:C('#3a3632'),
    meta:{name:'Meridiano Copacabana',city:'Rio',num:'06',sw:['#8a8680','#d8d0c0','#e0473a','#f2c230','#2a9a5a'],crew:['tremor','tremorc'],weapon:5,
      note:'Blasted out of raw granite like Cardeal Arcoverde, with the rock left bare and lit warm from below. A staircase covered in hundreds of bright mismatched tiles comes down from the beach, a tiled dado runs along the rock, the platform floor has the wave mosaic of the promenade, and there are palms, ferns and a juice bar.',
      lamps:[lamp(-22,2.0,6.2,[1.6,1.15,.7],11),lamp(-8,2.0,6.2,[1.6,1.15,.7],11),lamp(8,2.0,6.2,[1.6,1.15,.7],11),lamp(22,2.0,6.2,[1.6,1.15,.7],11),lamp(0,5,-1,[1.0,.8,.65],16),lamp(-20,1.6,4.5,[1.4,.85,.5],6)],amb:[.38,.33,.3],cam:{t:[-7,2,2.5],th:.4,ph:1.2,r:18}}});
  const st=ST.rio, K=st.K, BK=st.back, A=T.A.r, mA=M(T.A.t), rock=M(T.rock);
  st.H=12.8; const top=st.top; vaultArc(top,10.2+DW*.55,-.9-DW*.55,2.6,12,M(T.rock,{repeat:[.5,.5]}),null,0); scVaultCap(top,M(T.rock,{repeat:[.5,.5]}),10.2+DW*.55,-.9-DW*.55,2.6,12,1.6,SL/2-.01);
  /* boulders bulging out of the back wall */ const r=rng(53); for(const x of [-30,-17,-4.5,11,20.5,27]){ mk(lathe([[0,.5,.3],[.4,.8,.5],[.9,.65,.42],[1.3,.15,.15]],7),rock,BK,x,1.35+r()*.3,SZ1-.25,0,r()*3,0); }
  /* a Selaron tiled dado along the rock, in raised runs with a white tile cap; warm uplights at its foot */
  for(let x=-31;x<31;x+=2){ if(Math.abs(x+1-15)<3) continue; scBX(BK,mA,{s:A.selaron,t:K.a.white},x+1,0,SZ1-.06,2,1.2,.1); scBX(BK,K.mA,K.a.white,x+1,1.2,SZ1-.08,2,.05,.14); }
  for(let x=-29;x<=29;x+=4){ if(Math.abs(x-15)<3) continue; scBX(g,K.mA,K.a.steelD,x,0,SZ1-.32,.3,.1,.16); scPX(g,K.mL,K.l.warm,x,.102,SZ1-.32,.26,.12,-Math.PI/2); }
  /* the tiled staircase down from the beach */
  for(let k=0;k<12;k++){ scBX(g,mA,A.selaron,24-k*.45,0,6.6,.46,(12-k)*.21,2.4); } scBX(g,mA,A.selaron,26,0,5.2,.3,2.6,.3); for(let k=0;k<3;k++) scBX(g,K.mA,K.a.white,24-k*2,2.6-k*.6,7.8,2,.06,.06);
  for(const z of [5.45,7.75]) scBX(g,K.mA,K.a.gold,21.6,2.3,z,5.2,.05,.05,0,0,.43);
  /* palms in terracotta planters, ferns, a coconut cart, a juice bar */
  const leafM=M(scKitC().A.t,{double:true});
  for(const x of [-24,-12,10]){ mk(scCylU(.42,.36,.65,12,K.a.terracotta,K.a.soil),scCM(K.mA,K.a.terracotta,K.a.soil),g,x,.325,5.8); const t=N(g,x,.6,5.8,0,0,.08); mk(scCylU(.1,.14,2.3,8,A.trunk,A.trunk),scCM(mA,A.trunk,A.trunk),t,0,1.15,0);
    for(let k=0;k<9;k++){ const f=N(t,0,2.3,0,0,k/9*Math.PI*2,0); scPX(f,leafM,K.a.leaf,0,-.1,.62,.42,1.4,-1.05-(k%2)*.3,0,0); } for(let k=0;k<3;k++) mk(scCylU(.07,.07,.12,6,A.coco,A.coco),scCM(mA,A.coco,A.coco),t,Math.cos(k*2)*.12,2.15,Math.sin(k*2)*.12); }
  for(const x of [-29.5,-11,-6.5,4.5,27.5]) scStPlant(g,K,x,7.75,1.1);
  const cart=N(g,-4,0,6.2); scBX(cart,mA,{s:A.cart,t:K.a.white},0,.3,0,1.4,.6,.8); for(const dx of [-.5,.5]) mk(scCylU(.25,.25,.08,12,K.a.rubber,K.a.steelD),scCM(K.mA,K.a.rubber,K.a.steelD),cart,dx,.25,-.42,Math.PI/2); scBX(cart,K.mA,K.a.steel,.85,.75,0,.4,.04,.04);
  for(let k=0;k<6;k++) mk(scLatheU([[0,.08,.08],[.1,.12,.12],[.2,.06,.06]],8,A.coco),scMatFor(mA,A.coco),cart,-.4+(k%3)*.35,.9,-.2+(k>2?.3:0));
  for(const dx of [-.6,.6]) scBX(cart,K.mA,K.a.steel,dx,.9,.35,.03,1.2,.03); scBX(cart,K.tA(0xe0473a),K.a.white,0,2.1,0,1.6,.04,1.0);
  scBX(g,mA,{s:K.a.oak,b:A.juice,t:K.a.oak},-17,0,7.3,3,2.2,1.4); for(const dx of [-1.52,1.52]) scBX(g,mA,{s:A.selaron,t:K.a.white},-17+dx,0,7.3,.04,1.2,1.4); scBX(g,K.mA,K.a.oak,-17,.95,6.48,3.1,.06,.3); scBX(g,mA,{s:A.selaron,t:K.a.white},-17,2.2,7.1,3.3,.12,1.9);
  /* bunting across the platform */ for(const x of [-20,-6,6,20]){ for(let k=0;k<22;k++){ const z=-.8+k*.4, y=2.42-Math.sin(k/21*Math.PI)*.3; B(st.top,C(tileCols[(k+x)&7]),x,y-.1,z,.015,.14,.14,0,Math.PI/4,0); } for(let k=0;k<21;k++){ const z0=-.8+k*.4, y0=2.42-Math.sin(k/21*Math.PI)*.3, y1=2.42-Math.sin((k+1)/21*Math.PI)*.3; B(st.top,C('#f2ece0'),x,(y0+y1)/2,z0+.2,.012,.012,.41,0,Math.atan2(y1-y0,.4),0); } }
  /* the station name on azulejo plaques, posters, benches, bins, a clock */
  for(const x of [-26,0]){ scBX(BK,K.mA,K.a.white,x,1.45,SZ1-.12,3.0,.85,.06); scPX(BK,mA,A.azul,x,1.875,SZ1-.155,2.9,.75,0,Math.PI,0); }
  [['p0',-9],['p1',7.5],['p2',-21.5]].forEach(([c,x])=>scPosterF(BK,K,mA,A[c],x,1.32,SZ1-.12,.9,1.25,'oak'));
  for(const x of [-14,-1.5]) scStBench(g,K,x,6.95,Math.PI,{len:2,seat:'oak'});
  scStBins(g,K,6,7.85,Math.PI); scStClock(top,K,-9,2.4,2.8,0,'clockA',.3,12); scStWallKit(BK,K,29,SZ1-.06);
  /* the cooler with the launcher in the ice */
  const cool=N(g,0,0,5.4,0,.2,0); scBX(cool,mA,{s:A.cooler,t:K.a.white},0,0,0,1.1,.6,.6); scBX(cool,K.mA,K.a.white,0,.6,0,1.12,.06,.62); B(cool,C('#e8f8ff'),0,.62,0,.9,.06,.4); scBX(cool,mA,{s:A.cooler,t:K.a.white},0,.66,-.36,1.1,.5,.06,0,-.7);
  const gl=N(cool,0,.78,0,0,1.3,0); pGL(gl);
  ST.rio.drop=dropRing(N(g,0,0,5.4));
  ST.rio.spots={tremor:{x:4,z:.8,ry:Math.PI*.85},tremorc:{x:2.2,z:2.2,ry:Math.PI*.75},tremorc2:{x:6.2,z:1.4,ry:Math.PI*.95}};
};

/* ---------- Las Vegas: the concourse under the canopy ---------- */
let scVGT=null;
function scVegasTex(){ if(scVGT) return scVGT; const PL_='#3a1448', GD='#d4ad5a';
  const wall=P2(96,312,(g,w,h)=>{
    scPMould(g,0,0,w,10,'#e8c060'); vfill(g,0,10,w,14,[[0,'#2a0e34'],[1,'#3a1448']]);
    for(let x=0;x<w;x+=48){ vfill(g,x,24,48,173,[[0,'#2a0c36'],[.5,'#3e1650'],[1,'#2a0c36']]);
      for(let k=0;k<11;k++){ const a=Math.PI*(k/10); g.strokeStyle=rgba(GD,.85); g.lineWidth=.8; g.beginPath(); g.moveTo(x+24,70); g.lineTo(x+24+Math.cos(a)*-20,70-Math.sin(a)*40); g.stroke(); }
      ell(g,x+24,70,6,6,GD); ell(g,x+24,70,4,4,'#f8e090'); R(g,GD,x+.5,24,1,173); R(g,GD,x+46.5,24,1,173); R(g,GD,x+5,80,38,.8); for(let y=86;y<190;y+=8) R(g,rgba(GD,.35),x+23.6,y,.8,5);
      R(g,rgba('#ffffff',.15),x+1.5,24,.6,173); }
    scPMould(g,0,197,w,8,'#e8c060');
    for(let y=205;y<303;y+=12) for(let x=-6+((y-205)/12%2)*6;x<w;x+=12){ poly(g,[[x+6,y],[x+12,y+6],[x+6,y+12],[x,y+6]],'#5a1a5a'); poly(g,[[x+6,y+1.5],[x+10.5,y+6],[x+6,y+10.5],[x+1.5,y+6]],'#7a2a6e'); radial(g,x+5,y+5,4,[[0,rgba('#ffffff',.25)],[1,rgba('#ffffff',0)]]); ell(g,x+6,y,1,1,GD); }
    scPAO(g,0,205,w,98,'b',14,.3); vfill(g,0,303,w,9,[[0,'#f8e090'],[.5,GD],[1,'#6a4818']]);
    scPLight(g,0,0,w,h,.04,.1); },3,700);
  const carpet=P2(64,64,(g,w,h)=>{ R(g,'#3a0e3a',0,0,w,h); const r=rng(701);
    for(let k=0;k<6;k++){ g.strokeStyle=['#7a1a5a','#a8285a','#5a1a6a'][k%3]; g.lineWidth=2.4; g.beginPath(); for(let x=-4;x<=w+4;x+=2) g.lineTo(x,k*11+Math.sin(x/w*Math.PI*2+k)*4); g.stroke(); }
    for(const [x,y,c] of [[16,16,'#f5c542'],[48,48,'#29e0e6'],[48,16,'#ff3fa4'],[16,48,'#7cf06a']]){ for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; poly(g,[[x,y],[x+Math.cos(a)*9,y+Math.sin(a)*9],[x+Math.cos(a+.3)*5,y+Math.sin(a+.3)*5]],c); } ell(g,x,y,3,3,'#3a0e3a'); ell(g,x,y,1.6,1.6,c); }
    for(let i=0;i<120;i++) R(g,rgba(r()>.5?'#ffffff':'#000000',.08),r()*w,r()*h,1,1); },6,702);
  const A=scAtlasP(128,[
    ['slot0',32,48,(g,w,h)=>scSlotP(g,w,h,'#c8202a',711)],['slot1',32,48,(g,w,h)=>scSlotP(g,w,h,'#2a4ad8',712)],['slot2',32,48,(g,w,h)=>scSlotP(g,w,h,'#7a2a9a',713)],['slot3',32,48,(g,w,h)=>scSlotP(g,w,h,'#1a8a6a',714)],
    ['chapel',64,48,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#f6f0f2',{bev:1.2,hi:.05}); R(g,'#f2a0b8',0,0,w,3); g.fillStyle='#3a2a3a'; g.beginPath(); g.moveTo(22,h); g.lineTo(22,24); g.arc(32,24,10,Math.PI,0); g.lineTo(42,h); g.closePath(); g.fill(); g.strokeStyle=GD; g.lineWidth=1.2; g.beginPath(); g.moveTo(21,h); g.lineTo(21,24); g.arc(32,24,11,Math.PI,0); g.lineTo(43,h); g.stroke();
      for(const x of [10,54]){ ell(g,x-1.5,16,2.6,2.6,'#f27ab0'); ell(g,x+1.5,16,2.6,2.6,'#f27ab0'); poly(g,[[x-4,17],[x+4,17],[x,22]],'#f27ab0'); } scCtext(g,'LITTLE CHAPEL',w/2,5,'#c8487a',.9); for(let k=0;k<6;k++) ell(g,6+k*10.4,h-4,2,1.6,'#f2d0dc'); }],
    ['felt',64,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a8a4a'],[1,'#1a6a3a']]); g.strokeStyle='#f2ece0'; g.lineWidth=.5; for(let c=0;c<12;c++) for(let rr=0;rr<3;rr++){ const x=14+c*4, y=6+rr*6; g.strokeRect(x,y,4,6); g.fillStyle=(c*3+rr)%2?'#c8202a':'#1a1a1a'; ell(g,x+2,y+3,1.3,1.3,g.fillStyle); } g.strokeRect(6,6,8,18); ell(g,10,15,2,2,'#2a8a4a'); text(g,'0',9,13,'#ffffff',.8); for(let k=0;k<3;k++) g.strokeRect(14+k*16,24,16,4); }],
    ['wheel',32,32,(g,w,h)=>{ ell(g,16,16,16,16,'#5a2a14'); for(let k=0;k<37;k++){ const a=k/37*Math.PI*2; g.fillStyle=k===0?'#2a8a4a':k%2?'#c8202a':'#1a1a1a'; g.beginPath(); g.moveTo(16,16); g.arc(16,16,14,a,a+Math.PI*2/37); g.closePath(); g.fill(); } ell(g,16,16,9,9,'#8a5a2a'); ell(g,16,16,5,5,GD); ell(g,15,15,2,2,'#f8e8a0'); for(let k=0;k<4;k++){ const a=k/4*Math.PI*2; R(g,GD,16+Math.cos(a)*6-.5,16+Math.sin(a)*6-.5,1,1); } }],
    ['velvet',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#6a1a6a'],[1,'#3a0a3a']]); for(let y=0;y<h;y+=8) for(let x=((y/8)%2)*4;x<w;x+=8){ ell(g,x,y,1,1,GD); radial(g,x+4,y+4,4,[[0,rgba('#ffffff',.12)],[1,rgba('#ffffff',0)]]); } }],
    ['mirror',32,32,(g,w,h)=>{ scPGlass(g,0,0,w,h,'#c8b8d8',{k:1}); R(g,GD,0,0,w,1); R(g,GD,0,h-1,w,1); }],
    ['p0',32,48,(g,w,h)=>scPPoster(g,w,h,{bg:['#1a0a2a','#3a0a3a'],title:'DAZZLE',sub:'REVUE',tc:'#f5c542',sc:'#ff3fa4',art:(g,w,h)=>{ for(let k=0;k<3;k++){ const x=8+k*8; ell(g,x,18,2.4,2.6,'#f2d0b0'); for(let j=0;j<5;j++) poly(g,[[x,14],[x-5+j*2.5,6],[x-4+j*2.5,7]],['#ff3fa4','#29e0e6','#f5c542'][k]); R(g,['#ff3fa4','#29e0e6','#f5c542'][k],x-2.4,21,4.8,8); R(g,'#f2d0b0',x-2,29,1.2,7); R(g,'#f2d0b0',x+.8,29,1.2,7); } }})],
    ['p1',32,48,(g,w,h)=>scPPoster(g,w,h,{bg:['#f5c542','#c86a10'],title:'LUCKY 7',sub:'BUFFET',tc:'#c8202a',sc:'#1a1a1a',art:(g,w,h)=>{ scStext(g,'7',16,14,'#c8202a',3); ell(g,16,36,10,2.5,'#f2f2ee'); }})],
    ['p2',32,48,(g,w,h)=>scPPoster(g,w,h,{bg:['#0a1a3a','#1a0a2a'],title:'CRYSTAL',sub:'KING LIVE',tc:'#29e0e6',sc:'#f5c542',art:(g,w,h)=>{ radial(g,16,26,10,[[0,'#ffffff'],[1,rgba('#29e0e6',0)]]); R(g,'#1a1a1a',12,22,8,14); R(g,'#f2f2ee',13,24,6,8); ell(g,16,19,3,3.4,'#e0b090'); R(g,'#1a1a1a',13,15,6,2.6); }})],
    ['cash',64,32,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#5a1a3a',{bev:1}); R(g,GD,0,0,w,6); scStext(g,'CASHIER',w/2,.8,'#3a1448',1); for(let x=6;x<w-4;x+=4) R(g,GD,x,8,.8,16); scPGlass(g,4,8,56,16,'#c8b8d8',{k:.5,wash:false}); R(g,'#2a0a1a',4,24,56,2); R(g,GD,0,26,w,1); }]
  ],3,710);
  const L=scAtlasP(128,[
    ['scr0',16,16,(g,w,h)=>scReelP(g,w,h,721)],['scr1',16,16,(g,w,h)=>scReelP(g,w,h,722)],['scr2',16,16,(g,w,h)=>scReelP(g,w,h,723)],['scr3',16,16,(g,w,h)=>scReelP(g,w,h,724)],
    ['top0',32,8,(g,w,h)=>{ R(g,'#1a0a2a',0,0,w,h); g.save(); g.filter='blur(.8px)'; scCtext(g,'JACKPOT',w/2,1.5,'#ff3fa4',1); g.restore(); scCtext(g,'JACKPOT',w/2,1.5,'#ffe0f0',1); }],
    ['top1',32,8,(g,w,h)=>{ R(g,'#1a0a2a',0,0,w,h); g.save(); g.filter='blur(.8px)'; scCtext(g,'777',w/2,1.5,'#f5c542',1); g.restore(); scCtext(g,'777',w/2,1.5,'#fff4c0',1); }],
    ...[['JACKPOT','#f5c542'],['MERIDIAN','#29e0e6'],['SLOTS','#ff3fa4'],['CHAPEL','#f2a0b8']].map(([s,c],i)=>['neon'+i,64,16,(g,w,h)=>{ R(g,'#0a0814',0,0,w,h); for(let x=1;x<w;x+=3){ ell(g,x+.5,1.2,.7,.7,'#ffe8a0'); ell(g,x+.5,h-1.2,.7,.7,'#ffe8a0'); } g.save(); g.filter='blur(1.4px)'; scCtext(g,s,w/2,4,c,1.6); g.restore(); scCtext(g,s,w/2,4,mix(c,'#ffffff',.6),1.6); }])
  ],0,720);
  return scVGT={wall,carpet,A,L}; }
function scSlotP(g,w,h,c,seed){ scPPanel(g,0,0,w,h,c,{bev:1.2,hi:.25}); R(g,'#d4ad5a',1,1,w-2,.8); R(g,'#1a0a1a',3,4,26,14); R(g,'#d4ad5a',2.5,3.5,27,.6); R(g,'#d4ad5a',2.5,18,27,.6);
  for(let k=0;k<5;k++){ ell(g,6+k*5,23,1.6,1.6,['#e0473a','#f2c230','#2ae08a','#29e0e6','#ff3fa4'][k]); ell(g,5.6+k*5,22.6,.6,.6,'#ffffff'); } R(g,'#1a1a1a',5,27,22,3); R(g,'#2a2a2e',8,34,16,8); R(g,'#d4ad5a',8,34,16,.8); R(g,'#c8ccd2',10,37,12,4); R(g,rgba('#000000',.25),0,h-6,w,6); }
function scReelP(g,w,h,seed){ const r=rng(seed); vfill(g,0,0,w,h,[[0,'#ffffff'],[.5,'#f2ece0'],[1,'#c8c0b0']]); for(let k=0;k<3;k++){ R(g,'#a89a8a',k*5.33,0,.4,h); const s=['7','$','#','!'][r()*4|0]; text(g,s,k*5.33+1.2,5.5,['#c8202a','#2a9a5a','#d4ad5a','#2a4ad8'][r()*4|0],1); } R(g,rgba('#c8202a',.8),0,h/2-.3,w,.6); vfill(g,0,0,w,3,[[0,rgba('#000000',.4)],[1,rgba('#000000',0)]]); vfill(g,0,h-3,w,3,[[0,rgba('#000000',0)],[1,rgba('#000000',.4)]]); }

STATION_BUILD.vegas=function vegasStation(){
  const T=scVegasTex();
  const g=stationShell('vegas',{floor:M(T.carpet),floorTile:1.8,back:M(T.wall),wallTile:2,wallTV:6.5,H:6.5,pit:C('#1a0c1a'),
    meta:{name:'Meridian Strip',city:'Las Vegas',num:'07',sw:['#3a0e3a','#ff3fa4','#29e0e6','#f5c542','#2a1438'],crew:['king','kingc'],weapon:6,
      note:'A casino concourse more than a station, under a canopy of LEDs like Fremont Street that never stops changing. Casino carpet, art-deco walls of plum velvet and gold sunbursts ringed in marquee bulbs, mirrored columns, slot machines along the back wall, a drive-in wedding chapel booth and a roulette table on the platform.',
      lamps:[lamp(-20,5,2.5,[1.5,.7,1.2],13),lamp(-6,5,2.5,[.75,1.25,1.4],13),lamp(8,5,2.5,[1.5,1.2,.6],13),lamp(22,5,2.5,[1.5,.7,1.2],13),lamp(0,4,-5,[.6,.4,.7],14),lamp(-8,2.4,5.4,[1.6,1.3,.75],6)],amb:[.36,.3,.4],minLamp:1,cam:{t:[-7,2.4,2.5],th:.4,ph:1.4,r:16}}});
  const st=ST.vegas, K=st.K, BK=st.back, A=T.A.r, Lr=T.L.r, mA=M(T.A.t), mL=M(T.L.t,{unlit:true}), gold=K.a.gold, bulb=K.l.bulb;
  /* the LED canopy: three painted frames swapped in turn */
  const frames=[0,1,2].map(f=>P2(64,32,(g,w,h)=>{ const cols=['#ff3fa4','#29e0e6','#f5c542','#7cf06a','#b07aff']; for(let y=0;y<h;y+=2) for(let x=0;x<w;x+=2){ const v=Math.sin(x*.18+f*2.1)+Math.sin(y*.3+x*.05-f*1.4); R(g,v>1.1?cols[(f+((x>>3)%5))%5]:v>.3?mix(cols[(f+2)%5],'#1a0c26',.55):'#1a0c26',x,y,2,2); } text(g,['MERIDIAN','JACKPOT','WELCOME'][f],10,12,'#ffffff',1); }));
  const canopyM=M(frames[0],{unlit:true}); mk(wplane(SL,SZ1-SZ0+2,16,8),canopyM,st.top,0,6.4,(SZ1+SZ0)/2,Math.PI/2); let fi=0; st.anim.push(t=>{ const k=Math.floor(t*2.5)%3; if(k!==fi){ fi=k; canopyM.tex=frames[k]; } });
  for(let x=-30;x<=30;x+=6){ scBX(st.top,K.mA,K.a.steelD,x,6.1,(SZ1+SZ0)/2,.3,.3,SZ1-SZ0); }
  /* the wall's relief: a gold skirting, the gold rail and cornice with rows of marquee bulbs, gold pilasters */
  scRunBX(BK,K.mA,gold,-SL/2,SL/2,4,0,SZ1-.03,.2,.06); scRunBX(BK,K.mA,gold,-SL/2,SL/2,4,2.36,SZ1-.04,.1,.08); scRunBX(BK,K.mA,gold,-SL/2,SL/2,4,6.05,SZ1-.06,.18,.12);
  for(let x=-31.875;x<32;x+=.25){ scPX(BK,mL,bulb,x,2.41,SZ1-.085,.07,.07,0,Math.PI,0); scPX(BK,mL,bulb,x,6.14,SZ1-.125,.08,.08,0,Math.PI,0); }
  for(let x=-30;x<=30;x+=4){ if(Math.abs(x+7)<2.6) continue; scBX(BK,K.mA,gold,x,.2,SZ1-.06,.3,5.85,.12); scBX(BK,K.mA,gold,x,5.6,SZ1-.1,.5,.45,.2); }
  /* slot machines along the back, each with a stool; none in front of the route map */
  for(let i=0;i<16;i++){ const x=-28+i*3.6; if(Math.abs(x+7)<2.6) continue; const n=N(BK,x,0,7.85,0,Math.PI,0), j=i%4;
    scBX(n,mA,{s:K.a.steelD,f:A['slot'+j],t:K.a.steelD},0,0,0,.9,1.25,.7); scBX(n,K.mA,K.a.steelD,0,1.25,-.05,.9,.75,.6); scPX(n,mL,Lr['scr'+j],0,1.62,.252,.74,.5); scBX(n,K.mA,gold,0,1.25,.24,.92,.05,.06); scBX(n,K.mA,gold,0,1.95,-.05,.92,.04,.62);
    scBX(n,K.mA,K.a.steelD,0,2.0,-.05,.9,.28,.5); scPX(n,mL,Lr['top'+(i%2)],0,2.14,.202,.86,.24); scBX(n,K.mA,K.a.steel,.48,1.0,.1,.04,.5,.04,0,0,.2); mk(cyl(.04,.04,.06,8),C('#e0302a'),n,.52,1.52,.1);
    mk(scCylU(.2,.2,.08,12,K.a.steelD,A.velvet),scCM(mA,K.a.steelD,A.velvet),g,x,.68,7.0); mk(scCylU(.03,.03,.64,6,K.a.gold,K.a.gold),scCM(K.mA,K.a.gold,K.a.gold),g,x,.32,7.0); mk(scCylU(.2,.2,.02,12,K.a.gold,K.a.gold),scCM(K.mA,K.a.gold,K.a.gold),g,x,.01,7.0); }
  /* neon signs in bulb-ringed frames */
  [['neon0',-20],['neon1',0],['neon2',20]].forEach(([c,x])=>{ scBX(BK,K.mA,gold,x,3.55,SZ1-.06,5.2,1.4,.1); scPX(BK,mL,Lr[c],x,4.25,SZ1-.115,5,1.25,0,Math.PI,0); });
  /* mirrored columns with gold capitals holding up the canopy */
  for(const x of [-24,-14,12,24]){ scBX(g,mA,{s:A.mirror,t:A.mirror},x,.15,3,.7,5.7,.7); scBX(g,K.mA,gold,x,0,3,.86,.15,.86); scBX(g,K.mA,gold,x,5.85,3,.9,.25,.9); for(let y=.6;y<5.6;y+=.5) for(const [dx,dz] of [[.36,0],[-.36,0],[0,.36],[0,-.36]]) scPX(g,mL,bulb,x+dx,y,3+dz,.06,.06,0,dx>0?Math.PI/2:dx<0?-Math.PI/2:dz>0?0:Math.PI,0); }
  /* crystal chandeliers under the canopy */ for(const x of [-6,6]){ const c=N(st.top,x,5.2,2.5); scBX(c,K.mA,gold,0,.3,0,.03,.9,.03); mk(torus(.6,.04,4,16),C('#d4ad5a'),c,0,0,0,Math.PI/2); for(let k=0;k<16;k++){ const a=k/16*Math.PI*2; scPX(c,mL,bulb,Math.cos(a)*.6,-.1,Math.sin(a)*.6,.1,.24,0,-a+Math.PI/2,0); scPX(c,mL,bulb,Math.cos(a)*.35,-.35,Math.sin(a)*.35,.08,.2,0,-a+Math.PI/2,0); } }
  /* the wedding chapel booth */ const ch=N(g,18,0,6.2); scBX(ch,mA,{s:K.a.white,b:A.chapel,t:K.a.white},0,0,0,3,2.6,1.8); scBX(ch,K.tA(0xf2a0b8),K.a.white,0,2.6,0,3.2,.15,2); scBX(ch,K.mA,gold,0,2.75,0,.1,.8,.1); scBX(ch,K.mA,gold,0,3.2,0,.5,.1,.1);
  scBX(ch,K.mA,K.a.steelD,0,2.95,-.95,2.6,.6,.08); scPX(ch,mL,Lr.neon3,0,3.25,-.995,2.5,.55,0,Math.PI,0); for(let k=0;k<12;k++) scPX(ch,mL,bulb,-1.45+k*.2645,2.66,-1.005,.08,.08,0,Math.PI,0);
  /* a cashier's cage, posters, velvet ropes, bins */
  scBX(g,mA,{s:A.velvet,b:A.cash,t:K.a.steelD},26.5,0,7.5,3,2.2,1.2); scBX(g,K.mA,gold,26.5,.95,6.85,3.1,.05,.2);
  [['p0',-26],['p1',-9.7],['p2',10.3]].forEach(([c,x])=>scPosterF(BK,K,mA,A[c],x,3.2,SZ1-.06,.9,1.35,'gold'));
  for(const [x,z] of [[16.4,4.8],[17.5,4.8],[18.5,4.8],[19.6,4.8]]){ mk(scCylU(.025,.025,.95,6,gold,gold),scCM(K.mA,gold,gold),g,x,.475,z); mk(scLatheU([[0,.05,.05],[.06,.07,.07],[.12,.02,.02]],8,gold),scMatFor(K.mA,gold),g,x,.95,z); mk(scCylU(.14,.16,.04,10,gold,gold),scCM(K.mA,gold,gold),g,x,.02,z); }
  for(const x0 of [16.4,18.5]) scBX(g,K.tA(0xc8202a),K.a.rope,x0+.55,.8,4.8,1.1,.05,.05);
  scStBins(g,K,-1.6,7.9,Math.PI);
  /* the roulette table with the gold machine gun and a bow on it */
  const rt=N(g,-8,0,5.4); scBX(rt,mA,{s:K.a.walnut,t:A.felt},0,0,0,3.2,.85,1.6); scBX(rt,K.mA,K.a.walnut,0,.85,0,3.3,.05,1.7); scBX(rt,mA,{s:A.felt,t:A.felt},.15,.9,0,2.9,.012,1.3); mk(scCylU(.42,.42,.1,24,K.a.walnut,A.wheel),scCM(mA,K.a.walnut,A.wheel),rt,-1.1,.94,0); mk(scCylU(.03,.05,.12,8,gold,gold),scCM(K.mA,gold,gold),rt,-1.1,1.04,0);
  for(let k=0;k<6;k++){ const cx=.4+(k%3)*.25, cz=(k>2?.45:-.45); for(let j=0;j<3+k%3;j++) mk(cyl(.035,.035,.012,10),C(['#c8202a','#2a4ad8','#f2f2ee','#1a1a1a','#2a9a5a','#f5c542'][k]),rt,cx,.918+j*.013,cz); }
  const mg=N(rt,.4,.98,0,0,1.4,0); pMG(mg); B(rt,C('#d63a2c'),.4,1.05,0,.06,.04,.5); B(rt,C('#d63a2c'),.4,1.1,0,.2,.12,.06,0,0,.6); B(rt,C('#d63a2c'),.4,1.1,0,.2,.12,.06,0,0,-.6);
  scStWallKit(BK,K,-29.8,SZ1);
  ST.vegas.drop=dropRing(N(g,-8,0,4.4));
  ST.vegas.spots={king:{x:3.5,z:.8,ry:Math.PI*.85},kingc:{x:1.6,z:2.2,ry:Math.PI*.75},kingc2:{x:5.6,z:1.6,ry:Math.PI*.95}};
};

/* ---------- Tokyo: colour, and the katana for the last night ---------- */
STATION_POST.tokyo=function tokyoPolish(){
  const st=ST.tokyo, g=st.g, BK=st.back, K=st.K, T=scTokyoTex(), A=T.A.r, Lr=T.L.r, mA=M(T.A.t), mL=M(T.L.t,{unlit:true}), night=scStNight();
  /* backlit adverts in raised steel frames (none behind the vending machines) */
  for(let k=0;k<9;k++){ const x=-26+k*6.5; if(Math.abs(x-13)<1||(x>-14&&x<3)) continue; scLightbox(BK,K,mL,Lr['ad'+(k%5)],x,1.0,SZ1-.06,1.3,1.95,.12,'steel',Math.PI); }
  if(night){ for(let k=0;k<9;k++){ const x=-26+k*6.5; if(Math.abs(x-13)<1||(x>-14&&x<3)) continue; B(BK,U(k%2?'#29e0e6':'#ff3fa4'),x,3.05,SZ1-.08,1.4,.04,.04); }
    B(g,U('#29e0e6'),14.5,1.98,7.5,3.8,.04,.04); }
  /* the convenience kiosk: shelves of snacks, a glowing drinks fridge, a counter, an awning and its sign */
  scBX(g,mA,{s:A.kioskSide,b:A.kiosk,t:K.a.steelD},22,0,6.5,3,2.2,1.6); scPX(g,mL,T.L.r.fridge,20.488,1.2,6.5,1.2,1.4,0,-Math.PI/2,0);
  scBX(g,K.mA,{s:K.a.steel,t:K.a.white},22,.9,5.55,3.1,.06,.36); scBX(g,K.mA,K.a.white,22,0,5.62,2.6,.9,.12);
  scBX(g,K.mA,K.a.steelD,22,2.2,6.45,3.2,.06,1.75); scBX(g,mA,A.band,22,2.26,5.6,3.2,.14,.08); scBX(g,K.mA,K.a.steelD,22,2.4,5.85,3.1,.42,.1); scPX(g,mL,Lr.kioskSign,22,2.61,5.795,3,.38,0,Math.PI,0);
  const r=rng(77); for(let k=0;k<8;k++) B(g,C(['#d63a2c','#2a6ad8','#f2c230','#f2f2ee'][k%4]),20.9+k*.3,.96,5.5+(r()-.5)*.1,.22,.03+r()*.04,.3,r()*.3);
  /* a tactile guide path along the platform */
  scStripU(g,K.mA,K.a.tactile,-30,30,2,.007,1.7,.3);
  /* the ticket office, with the katana wrapped in silk on the counter */
  const off=N(g,-20,0,6.4); scBX(off,mA,{s:K.a.white,b:A.office,t:K.a.steelD},0,0,0,3.2,2.4,2); scBX(off,mA,A.band,0,2.4,-.02,3.3,.25,2.1);
  scBX(off,K.mA,K.a.steelD,0,2.66,-1.0,2.6,.36,.1); scPX(off,mL,Lr.officeSign,0,2.84,-1.052,2.5,.32,0,Math.PI,0); scBX(off,K.mA,{s:K.a.steel,t:K.a.steel},0,1.0,-1.1,2.8,.06,.3);
  const silk=N(g,-20,1.08,5.25,0,.15,0); B(silk,C('#c8202a'),0,0,0,1.1,.05,.18); const kt=N(silk,0,.12,0,0,Math.PI/2,0); pKatana(kt);
  ST.tokyo.drop2=dropRing(N(g,-20,0,4.6)); ST.tokyo.drop2.ring.mesh.mats[0]=M(tRing,{unlit:true,cut:true,color:0xff4a4a});
};
STATION_ORDER.splice(0,STATION_ORDER.length,'tokyo','hongkong','baikal','london','naples','rio','vegas');

