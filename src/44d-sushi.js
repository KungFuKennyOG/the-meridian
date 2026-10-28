/* ---------- 03 · Sushi Bar Kaiten: the Pacific tunnel by night, Kagami-gumi sleepers behind the counter ----------
   You come in under an indigo noren into a stone genkan: a host stand with a lucky cat, the ticket machine, a
   bench. Ahead, a U of pale hinoki counter runs down the car under its own tiled roof, a conveyor carrying plates
   round it, the open end of the U facing you like a corridor into the chefs' well. Stools all round the outside,
   glass to the sea floor on both walls. At the far end: the live tank, the tuna on the block, the knives, the
   house shrine over the exit. Painters and the moving belt live in src/44s-sushi-paint.js. */
CAR_BUILD.sushi=function sushi(){
  const T=suTex(), atl=M(T.atl), atlU=M(T.atl,{unlit:true}), atlD=M(T.atl,{double:true});
  const mSlat=M(T.slat), mHin=M(T.hinoki), mSteel=M(T.steel), mDoors=M(T.doors), mFab=M(T.fab), mRoof=M(T.roof), mGlass=M(T.streak,{unlit:true,cut:true});
  const trimC=C('#2e2218'), dark=C('#1c1612'), sumi=C('#2a221c'), chrome=C('#d4d8dc'), black=C('#121010'), white=C('#dcd8d0'), lac=C('#14100e'), hinC=C('#dcc090'), copper=C('#b8743a'), red=C('#b81e24'), beltC=C('#dcd8d0');
  const wins=winsEvery(5,3.4,-10.2,6.8);
  const g=shell('sushi',{floor:M(T.floor),floorTile:1.2,ceil:M(T.ceil),ceilTile:1.2,dado:mSlat,upper:M(T.shoji,{emissive:0x3a3020}),pier:M(T.pier),end:M(T.pier),door:M(T.door),lo:.9,hi:2.62,wallTile:.9,wins,
    lamps:[lamp(-4.0,2.3,0,[2.3,1.72,1.15],8),lamp(2.4,2.3,0,[2.3,1.72,1.15],8),lamp(10.8,2.6,-.4,[2.0,1.6,1.2],6.5),lamp(-12.0,2.6,0,[2.1,1.6,1.1],6),lamp(11.5,1.4,2.45,[.35,.95,1.4],3.2),lamp(7.0,2.3,0,[2.0,1.5,1.05],5)],
    ambK:1.0,sunK:.2,minLamp:1.0});
  const W=WG.sushi, XM=-6.8, XB=6.0, ZO=1.65, ZI=.55, BY=.875, HP=Math.PI/2;
  /* an atlas box: face rects [+x,-x,+y,-y,+z,-z], unlisted faces take the plain rect */
  const abox=(par,mat,x,y,z,w,h,d,faces,ry=0,rx=0,rz=0,o)=>{ const pl=suAt('plain'), r=[0,1,2,3,4,5].map(i=>faces&&faces[i]?suAt(faces[i]):(faces&&faces.all?suAt(faces.all):pl)); return mk(suBox(w,h,d,r,o),mat,par,x,y,z,rx,ry,rz); };
  /* a framed picture on a wall: black lacquer frame strips in relief, the picture on a slightly inset board; faces local +z */
  const framed=(par,x,y,z,ry,w,h,rect,mat=atl,fr=lac)=>{ const n=N(par,x,y,z,0,ry,0); B(n,sumi,0,0,.01,w+.04,h+.04,.02); mk(suPlane(w,h,rect),mat,n,0,h/2+.02,.022);
    B(n,fr,0,-.01,.035,w+.08,.04,.03); B(n,fr,0,h+.01,.035,w+.08,.04,.03); B(n,fr,-w/2-.02,0,.035,.04,h+.06,.03); B(n,fr,w/2+.02,0,.035,.04,h+.06,.03); return n; };

  /* ---------- walls: modelled skirting, dado rail, sills, a nageshi rail and cornice, beams, menu tags on the piers ---------- */
  for(const s of [-1,1]){ const sg=W.side[s], zw=s*WZ, ry=s<0?0:Math.PI;
    B(sg,lac,0,0,zw-s*.02,WL,.12,.04); B(sg,hinC,0,.12,zw-s*.025,WL,.015,.05);
    B(sg,mHin,0,.86,zw-s*.03,WL,.04,.06); B(sg,mHin,0,2.62,zw-s*.04,WL,.09,.08); B(sg,sumi,0,3.3,zw-s*.05,WL,.1,.1); B(sg,hinC,0,3.28,zw-s*.04,WL,.02,.08);
    for(const [a,b] of wins){ const cx=(a+b)/2; B(sg,mHin,cx,.88,zw-s*.07,b-a+.12,.035,.14).noCollide=1; B(sg,trimC,cx,2.6,zw-s*.03,b-a+.1,.06,.08); for(const x of [a,b]) B(sg,trimC,x,.9,zw-s*.03,.06,1.72,.08); mk(plane(b-a-.06,1.66),M(T.streak,{unlit:true,cut:true,repeat:[(b-a)/3.4,1]}),sg,cx,.9+.86,zw-s*.008,0,ry,0); B(sg,C('#2e2218'),cx,.9,zw-s*.01,.05,1.72,.03); }
    for(let k=0;k<wins.length-1;k++){ const x=(wins[k][1]+wins[k+1][0])/2, n=N(sg,x,0,zw-s*.02,0,ry,0);
      B(n,mHin,0,1.5,.012,.62,.66,.025); B(n,lac,0,2.15,.03,.68,.03,.05); for(let t=0;t<6;t++) mk(suBox(.085,.5,.01,suSub('tags',(t+k*3)%8,8)),atl,n,-.25+t*.1,1.58,.03+(t%2)*.004);
      B(n,mHin,0,1.18,.07,.5,.03,.14).noCollide=1; mk(lathe([[0,.035,.035],[.06,.05,.05],[.14,.03,.03],[.2,.022,.022],[.22,.028,.028]],8),C('#7a9a8a'),n,0,1.21,.08);
      for(let b=0;b<3;b++){ B(n,C('#5a3a22'),.0,1.4,.08,.012,.35,.012,0,0,(b-1)*.35); mk(box(.05,.012,.03),C(['#f2f0f4','#e86a8a','#f2f0f4'][b]),n,(b-1)*.11,1.68+b*.04,.08); }
      for(const k of n.kids) k.noCollide=1; }
  }
  for(let x=-12.75;x<=12.8;x+=4.25) B(g,mHin,x,3.24,0,.14,.16,WZ*2);
  /* the ceiling cove lights along both walls */
  for(const s of [-1,1]){ B(g,hinC,0,3.12,s*(WZ-.32),WL-.6,.03,.14); B(g,U('#ffe8c0'),0,3.15,s*(WZ-.3),WL-.8,.02,.08); }

  /* ---------- the counter: a U of hinoki, the belt round its outside edge, the chefs' well inside ---------- */
  const L=XB-XM, cx=(XM+XB)/2;
  for(const s of [-1,1]){ const zc=(a,b)=>s*(a+b)/2;
    B(g,dark,cx,0,zc(ZI+.03,ZO-.07),L,.1,ZO-ZI-.1);                              /* kick recess */
    suBW(g,mSlat,cx,.1,zc(ZI+.03,ZO),L,.68,ZO-ZI-.03,.9,.68);                     /* slatted front */
    suBW(g,mDoors,cx,0,s*(ZI+.015),L,.8,.03,.6,.8);                               /* stainless doors on the chefs' side */
    suBW(g,mHin,cx,.78,zc(1.38,ZO+.045),L,.04,ZO+.045-1.38,1,.5);                 /* the customers' ledge, overhanging */
    B(g,U('#ffc878'),cx,.765,s*(ZO+.02),L,.008,.02);                               /* warm light strip under the overhang */
    suBW(g,mSteel,cx,.78,zc(1.10,1.40),L,.08,.30,.6,.3);                          /* belt housing */
    B(g,beltC,cx,.86,s*1.25,L,.015,.26);                                           /* belt bed */
    for(const zz of [1.104,1.396]) B(g,chrome,cx,.86,s*zz,L,.036,.012);           /* belt rails */
    suBW(g,mHin,cx,.78,zc(.92,1.10),L,.12,.18,1,.5);                              /* the shelf the neta cases stand on */
    B(g,white,cx,.78,zc(ZI+.03,.92),L,.06,.92-ZI-.03);                             /* chefs' worktop */
    B(g,chrome,cx,.84,s*(ZI+.02),L,.014,.035); }
  /* the round end */
  { const bn=N(g,XB,0,0), A0=-HP, A1=HP, S=24;
    mk(suRingWall(ZO-.07,0,.1,A0,A1,S,1),dark,bn); mk(suRingWall(ZO,.1,.78,A0,A1,S,1,.9,.68),mSlat,bn);
    mk(suRingWall(ZO+.045,.78,.82,A0,A1,S,1,1,.5),mHin,bn); mk(suRingWall(ZO+.03,.757,.773,A0,A1,S,1),U('#ffc878'),bn); mk(suRingTop(1.38,ZO+.045,.82,A0,A1,S,1),mHin,bn);
    mk(suRingWall(1.402,.82,.896,A0,A1,S,1),chrome,bn); mk(suRingTop(1.39,1.402,.896,A0,A1,S),chrome,bn); mk(suRingWall(1.39,.875,.896,A0,A1,S,-1),chrome,bn);
    mk(suRingTop(1.112,1.39,BY,A0,A1,S),beltC,bn);
    mk(suRingWall(1.112,.875,.896,A0,A1,S,1),chrome,bn); mk(suRingTop(1.098,1.112,.896,A0,A1,S),chrome,bn);
    mk(suRingTop(.92,1.098,.90,A0,A1,S,1),mHin,bn); mk(suRingWall(.92,.84,.90,A0,A1,S,-1,1,.5),mHin,bn);
    mk(suRingTop(ZI,.92,.84,A0,A1,S),white,bn); mk(suRingWall(ZI,0,.84,A0,A1,S,-1,.6,.8),mDoors,bn); }
  /* hinoki pilasters in relief down the counter front */
  for(const s of [-1,1]) for(let x=XM+.4;x<XB;x+=1.5) B(g,hinC,x,.1,s*(ZO+.008),.045,.67,.018);
  for(let a=-HP+.4;a<HP-.2;a+=.52) B(g,hinC,XB+(ZO+.008)*Math.cos(a),.1,(ZO+.008)*Math.sin(a),.018,.67,.045,-a);
  /* the duckboard floor of the well */
  suBW(g,M(T.duck),(XM+XB)/2+.1,0,0,L+.2,.025,ZI*2,.6,.6);

  /* ---------- the belt hoods at the mouth of the U: stainless towers the belt comes out of, signs facing the door, knives on the inside ---------- */
  const hx=XM-.3, knife=(par,x,y,z,face,len=.27)=>{ mk(suBox(len,.034,.004,suAt('blade')),atl,par,x+.017,y+len/2,z,0,0,HP); B(par,lac,x,y+len,z,.026,.028,.02); B(par,C('#e6d8b4'),x,y+len+.028,z,.024,.11,.018); };
  for(const s of [-1,1]){ const zc=(a,b)=>s*(a+b)/2;
    suBW(g,mSteel,hx,0,zc(ZI,ZO+.045),.64,1.5,ZO+.045-ZI,.6,.75); B(g,lac,hx,0,zc(ZI,ZO+.045),.66,.1,ZO+.065-ZI);
    /* raised panels and a hinoki band on the aisle face of the hood */
    for(const py of [.16,.86]) B(g,C('#a8aeb4'),hx,py,s*(ZO+.05),.5,.56,.015); B(g,mHin,hx,.78,s*(ZO+.055),.66,.045,.02); B(g,mHin,hx,1.42,zc(ZI,ZO+.06),.66,.035,ZO+.06-ZI);
    suBW(g,mHin,hx,1.5,zc(ZI-.03,ZO+.075),.72,.05,ZO+.105-ZI,1,.5);
    B(g,black,XM+.022,.86,s*1.25,.01,.14,.34); mk(suBox(.006,.12,.34,suSub('noren',s<0?1:2,4)),atl,g,XM+.032,.875,s*1.25);
    abox(g,atl,XM-.64,.92,zc(ZI+.12,ZO-.08),.03,.44,.92,{1:s<0?'sign':'price',all:'wood'});
    /* magnetic knife strip on the inside, facing the chefs */
    const zi=s*(ZI-.004); B(g,black,hx,1.14,zi-s*.01,.52,.035,.02); for(let k=0;k<4;k++) knife(g,hx-.2+k*.13,.88,zi-s*.024,s<0?0:Math.PI,k===3?.21:.27);
    /* posts up to the roof */
    B(g,hinC,hx,1.55,s*(ZI+.12),.13,1.3,.13); B(g,lac,hx,1.55,s*(ZI+.12),.15,.04,.15); }
  /* a beam and a short noren across the mouth */
  B(g,hinC,hx,2.42,0,.1,.1,(ZI+.2)*2); for(let k=0;k<3;k++) mk(suPlane(.34,.42,suSub('noren',k+.5,4)),atlD,g,hx+.05,2.21,(k-1)*.355,0,HP,0);

  /* ---------- the roof over the well: boarded underside, real rafters, a ridge beam, round tile ends along the eaves, red lanterns ---------- */
  { const X0=XM-.75, X1=XB+1.35, RL=X1-X0, RC=(X0+X1)/2, th=Math.atan2(.45,1.95), sl=Math.hypot(.45,1.95);
    for(const s of [-1,1]){ const zc=s*.975, yc=2.725, rn=N(g,RC,yc,zc,s*th,0,0);
      mk(suBoxW(RL,.05,sl+.06,1,1),mRoof,rn,0,0,0); mk(suBoxW(RL+.04,.03,sl+.1,1,1),C('#3a3a40'),rn,0,.05,0);
      for(let x=-RL/2+.12;x<RL/2;x+=.3) B(rn,hinC,x,-.055,0,.045,.055,sl);
      B(rn,sumi,0,-.11,s*(sl/2-.03),RL,.11,.06); B(rn,hinC,0,-.13,s*(sl/2-.03),RL,.02,.065);
      const te=suRemap(cyl(.052,.052,.04,10),suAt('crest',1.5)); for(let x=X0+.1;x<X1;x+=.18) mk(te,atl,g,x,2.47,s*1.99,s*HP,0,0);
      for(let k=0;k<5;k++){ const lx=-5.4+k*2.7, wh=k===2; B(g,black,lx,2.38,s*2.06,.008,.1,.008);
        mk(suRemap(lathe([[0,.07,.07],[.04,.13,.13],[.17,.15,.15],[.3,.13,.13],[.34,.07,.07]],12),suAt(wh?'lanW':'lanR')),atlU,g,lx,2.02,s*2.06);
        mk(cyl(.075,.075,.035,10),lac,g,lx,2.02,s*2.06); mk(cyl(.075,.075,.035,10),lac,g,lx,2.36,s*2.06); } }
    B(g,hinC,RC,2.86,0,RL,.13,.14); B(g,sumi,RC,2.84,0,RL+.02,.02,.16);
    for(let x=X0+.6;x<X1;x+=3.4){ B(g,black,x,2.99,0,.02,.41,.02); }
    /* a long paper light box under the ridge, over the chefs */
    B(g,hinC,RC,2.6,0,RL-1.6,.03,.3); B(g,U('#fff2dc'),RC,2.6,0,RL-1.7,.012,.26); for(let x=X0+1.4;x<X1-1;x+=1.6) B(g,hinC,x,2.62,0,.03,.23,.03);
    for(const z of [-.15,.15]) B(g,hinC,RC,2.63,z,RL-1.6,.2,.025); }

  /* ---------- stools round the outside of the U ---------- */
  const stools=[]; for(let x=XM+.45;x<XB;x+=.75) for(const s of [-1,1]) stools.push([x,s*1.9]);
  for(const a of [-1.08,-.38,.38,1.08]) stools.push([XB+1.9*Math.cos(a),1.9*Math.sin(a)]);
  for(const [x,z] of stools){ mk(cyl(.2,.22,.025,14),C('#2a2a2e'),g,x,.012,z); mk(cyl(.03,.03,.56,8),chrome,g,x,.3,z); mk(cyl(.07,.05,.06,10),C('#2a2a2e'),g,x,.55,z);
    mk(cyl(.185,.18,.045,16),mHin,g,x,.6,z); mk(cyl(.165,.17,.05,16),mFab,g,x,.645,z); mk(torus(.2,.012,4,16),chrome,g,x,.27,z,HP); }

  /* ---------- on the ledge: tea, taps, soy, ginger, chopsticks; every seat its cup ---------- */
  const cup=suRemap(cyl(.033,.028,.08,10,{open:true}),suAt('yunomi')), soy=lathe([[0,.022,.022],[.05,.024,.024],[.08,.016,.016],[.1,.008,.008],[.11,.009,.009]],8), soyM=C('#2a1810'), tin=suRemap(cyl(.03,.03,.09,10),suAt('tin'));
  for(const [x,z] of stools){ const s=Math.sign(z)||1, bend=x>XB+.05; if(bend) continue;
    mk(cup,atl,g,x+.13,.86,s*1.56); mk(cyl(.027,.027,.004,10),C('#7a9a3a'),g,x+.13,.885,s*1.56); mk(cyl(.026,.026,.01,10),C('#8a9a80'),g,x+.13,.825,s*1.56);
    B(g,mHin,x-.06,.82,s*1.6,.03,.008,.03); B(g,lac,x-.06,.828,s*1.6,.2,.006,.012,0.12);
    if(((x-XM)/.75|0)%2===0){ const cxp=x+.37;
      B(g,chrome,cxp,.822,s*1.418,.07,.05,.03); B(g,black,cxp,.85,s*1.432,.026,.014,.006); B(g,chrome,cxp,.83,s*1.44,.012,.01,.03);
      mk(soy,soyM,g,cxp-.07,.82,s*1.5); mk(cyl(.01,.01,.012,6),red,g,cxp-.07,.935,s*1.5);
      B(g,mHin,cxp+.07,.82,s*1.5,.09,.05,.07); B(g,hinC,cxp+.07,.87,s*1.5,.095,.01,.075); mk(tin,atl,g,cxp,.866,s*1.52);
      B(g,lac,cxp+.02,.82,s*1.62,.16,.05,.05); } }
  /* the hot water / tea urn station by the bench */

  /* ---------- the neta cases: fish on ice under glass, along both arms ---------- */
  const caseSegs=[]; for(let x=XM+.5;x<XB-.6;x+=2.6) caseSegs.push([x,Math.min(x+2.4,XB-.3)]);
  for(const s of [-1,1]) for(const [a,b] of caseSegs){ const len=b-a, cxs=(a+b)/2;
    B(g,mSteel,cxs,.9,s*1.01,len,.015,.18); mk(suBox(len,.02,.17,suAt('ice')),atl,g,cxs,.915,s*1.01);
    B(g,chrome,cxs,1.11,s*1.10,len,.012,.012); for(let px=a+.6;px<b-.3;px+=.6) B(g,chrome,px,.92,s*1.10,.008,.19,.008); B(g,chrome,cxs,1.11,s*.93,len,.012,.012); for(const x of [a,b]) B(g,chrome,x,.9,s*1.06,.012,.22,.012);
    
    B(g,U('#f4fbff'),cxs,1.09,s*.95,len-.04,.01,.015); }

  /* ---------- chefs' tools on the worktop ---------- */
  const boardM=C('#f0ece2');
  for(const s of [-1,1]) for(let x=XM+1.4;x<XB-.5;x+=3.1){ const z=s*.74;
    B(g,mHin,x,.84,z,.48,.03,.26); B(g,C('#c8a878'),x,.84,z,.5,.008,.27);
    { const n=N(g,x+.02,.873,z-s*.02,0,.15,0); mk(suBox(.27,.004,.035,suAt('blade')),atl,n,0,0,0); mk(suBox(.13,.022,.026,suAt('handle')),atl,n,-.2,-.004,0); }
    mk(cyl(.075,.07,.07,12,{open:true}),chrome,g,x+.4,.875,z); mk(cyl(.07,.07,.004,12),C('#8ab0c0'),g,x+.4,.89,z);
    B(g,C('#f4f4f0'),x-.38,.84,z,.14,.02,.1); B(g,C('#e8e8e4'),x-.38,.86,z,.12,.012,.08); }
  /* the head chef's station in the round end: rice tub, rice paddle */
  { const hx2=XB+.66; mk(cyl(.2,.2,.1,16),C('#d8b47c'),g,hx2,.89,0); for(const y of [.905,.965]) mk(torus(.202,.008,4,16),copper,g,hx2,y,0,HP); B(g,mHin,hx2+.02,.98,0,.04,.012,.25,.3);
    mk(cyl(.07,.07,.12,12),C('#8a6a4a'),g,XB+.62,.9,.62); mk(cyl(.072,.072,.012,12),hinC,g,XB+.62,.966,.62); }

  /* ---------- the genkan: noren, host stand and lucky cat, the ticket machine, a bench, bamboo ---------- */
  { const xn=-9.5; B(g,hinC,xn,3.0,0,.12,.12,WZ*2); for(let k=0;k<6;k++){ const z=-WZ+.5+k*(WZ*2-1)/5; mk(suPlane(.88,.52,suSub('noren',k%4,4)),atlD,g,xn+.07,2.76,z,0,HP,0); }
    B(g,mHin,xn,0,0,.14,.012,WZ*2-.1); }
  mk(suBoxW(1.8,.012,1.6,.6,.6),mFab,g,-12.7,0,0);
  /* a carved sea bream hanging over the genkan, lacquered red, on two chains */
  { const n=N(g,-10.5,2.45,0), body=C('#c8382a'), gold=C('#e8c048');
    mk(lathe([[0,.0,.0],[.05,.03,.07],[.16,.045,.15],[.36,.05,.16],[.52,.04,.1],[.62,.02,.04]],12),body,n,0,0,-.31,HP,0,0);
    for(const s of [-1,1]) mk(box(.012,.16,.12),C('#c8302a'),n,0,-.02+s*.07,.36,s*.5,0,0);
    mk(box(.01,.08,.18),C('#c8302a'),n,0,.13,.0,0,0,0); mk(box(.01,.05,.1),C('#c8302a'),n,0,-.17,.06,0,0,0);
    for(const s of [-1,1]){ mk(cyl(.022,.022,.01,10),gold,n,s*.04,.03,-.2,0,0,HP); mk(cyl(.01,.01,.012,8),black,n,s*.045,.03,-.2,0,0,HP); mk(box(.004,.07,.03),C('#a82418'),n,s*.045,-.02,-.13,0,0,0); }
    for(const z of [-.18,.2]){ B(g,black,-10.5,2.58,z,.012,.82,.012); } }
  { const sx=-11.6, sz=-2.42; suBW(g,mSlat,sx,.08,sz,.5,.92,.78,.9,.92); B(g,lac,sx,0,sz,.46,.08,.74); suBW(g,mHin,sx,1.0,sz,.58,.04,.86,1,.5);
    B(g,white,sx+.05,1.04,sz+.2,.18,.02,.24); B(g,lac,sx+.05,1.06,sz+.2,.12,.005,.006); B(g,red,sx+.12,1.04,sz-.22,.06,.04,.08);
    const c=N(g,sx-.02,1.04,sz-.06,0,-1.98,0), pl=suAt('plain');
    B(c,red,0,0,0,.2,.03,.2); for(const [dx,dz] of [[-.1,-.1],[.1,-.1],[-.1,.1],[.1,.1]]) B(c,C('#e8c040'),dx,.0,dz,.015,.035,.015);
    mk(suBox(.13,.14,.15,pl,{tw:.85,td:.85}),atl,c,0,.03,0); B(c,red,0,.15,0,.12,.02,.135); mk(cyl(.017,.017,.02,8),C('#e8c040'),c,.068,.14,0,0,0,HP);
    mk(suBox(.14,.12,.16,[suAt('catface'),pl,pl,pl,pl,pl],{tw:.92,td:.92}),atl,c,.005,.17,0);
    for(const s of [-1,1]){ mk(suBox(.045,.05,.035,pl,{tw:.2,td:.4}),atl,c,0,.285,s*.052,s*-.2,0,0); B(c,C('#f0a0b0'),.018,.29,s*.052,.004,.025,.018); }
    mk(suBox(.045,.1,.045,pl),atl,c,.02,.17,-.1,0,0,.2); B(c,C('#f0f0f0'),.02,.27,-.11,.05,.035,.05);
    mk(suBox(.012,.085,.065,[suAt('koban'),pl,pl,pl,pl,pl]),atl,c,.075,.04,.03); B(c,white,.07,.06,.065,.04,.06,.04); }
  { const kx=-13.45, kz=-2.25; B(g,C('#24262c'),kx,0,kz,.42,1.45,.56); B(g,C('#3a3c44'),kx,1.45,kz,.44,.04,.58); B(g,red,kx,1.49,kz,.3,.12,.5);
    mk(suPlane(.34,.34,suAt('screen')),atlU,g,kx+.215,1.1,kz,0,HP,0); B(g,black,kx+.215,.72,kz,.01,.04,.14); B(g,C('#3a3c44'),kx+.24,.5,kz,.06,.12,.32);
    mk(suPlane(.3,.14,suSub('noren',1,4)),atl,g,kx+.22,1.37,kz,0,HP,0); }
  { const bx=-12.45, bz=2.5; suBW(g,mHin,bx,.4,bz,1.7,.05,.42,1,.5); for(const dx of [-.75,.75]) for(const dz of [-.15,.15]) B(g,lac,bx+dx,0,bz+dz,.05,.4,.05); B(g,lac,bx,.15,bz,1.5,.03,.03);
    for(let k=0;k<3;k++) mk(suBoxW(.46,.06,.36,.4,.4),mFab,g,bx-.52+k*.52,.45,bz-.01); mk(cyl(.12,.1,.5,12),C('#6a8aa8'),g,-13.62,.25,2.55); mk(torus(.12,.01,4,12),C('#4a6a88'),g,-13.62,.5,2.55,HP); B(g,black,-13.6,.3,2.52,.015,.62,.015,0,0,.15); }
  { const px=-13.55, pz=1.45; mk(cyl(.2,.16,.42,12),C('#2a2a30'),g,px,.21,pz); mk(cyl(.19,.19,.02,12),C('#3a2a1e'),g,px,.42,pz);
    for(let k=0;k<5;k++){ const ang=k*1.3, ox=Math.cos(ang)*.08, oz=Math.sin(ang)*.08, h=1.4+k*.25; B(g,C('#6a8a3a'),px+ox,.42,pz+oz,.025,h,.025); for(let y=.6;y<h;y+=.25) B(g,C('#4a6a2a'),px+ox,.42+y,pz+oz,.03,.01,.03);
      for(let j=0;j<4;j++) mk(box(.2,.005,.035),C(j%2?'#5a8a3a':'#6a9a42'),g,px+ox+Math.cos(ang+j)*.1,.42+h-.15+j*.06,pz+oz+Math.sin(ang+j)*.1,.2,ang+j*1.6,-.4); } }
  /* end walls: slatted wainscot, the KAITEN board over the door, posters */
  for(const e of [-1,1]){ const x=e*(WL/2-.02), ry=e<0?HP:-HP;
    for(const z of [-1,1]){ const n=N(g,x,0,z*1.75,0,ry,0); mk(suBoxW(2.3,.9,.03,.9,.9),mSlat,n,0,0,0); B(n,lac,0,0,.02,2.3,.12,.03); B(n,mHin,0,.88,.025,2.34,.04,.05); } }
  framed(g,-13.97,2.38,0,HP,.95,.32,suAt('sign'));
  framed(g,-13.97,1.25,-1.65,HP,.7,1.05,suAt('poster')); framed(g,-13.97,1.4,1.75,HP,.86,.64,suAt('board'));

  /* ---------- the front: live tank, the tuna block, knives, the house shrine over the exit ---------- */
  { const x0=9.5, x1=13.55, tz0=2.1, tz1=2.86, txc=(x0+x1)/2, tl=x1-x0, y0=.76, y1=1.82;
    suBW(g,mSlat,txc,.1,(tz0+tz1)/2,tl+.1,.66,tz1-tz0+.06,.9,.66); B(g,lac,txc,0,(tz0+tz1)/2,tl+.06,.1,tz1-tz0); suBW(g,mHin,txc,y0-.04,(tz0+tz1)/2-.02,tl+.16,.04,tz1-tz0+.1,1,.5);
    for(let k=0;k<3;k++) mk(suPlane(tl/3,y1-y0,suAt('water')),atlU,g,x0+tl*(k+.5)/3,(y0+y1)/2,tz1-.02,0,Math.PI,0);
    for(const x of [x0,x1]) mk(suPlane(tz1-tz0,y1-y0,suAt('water')),atlU,g,x,(y0+y1)/2,(tz0+tz1)/2,0,x===x0?HP:-HP,0);
    B(g,C('#a89878'),txc,y0,(tz0+tz1)/2,tl,.05,tz1-tz0); for(let k=0;k<7;k++) mk(box(.18+k%3*.06,.12+k%2*.08,.14),C(['#5a5e66','#6a6e74','#4a4e56'][k%3]),g,x0+.3+k*.55,y0+.08,tz1-.18-(k%2)*.2,0,k*.7,.1);
    for(let k=0;k<9;k++){ const px=x0+.2+k*.44; for(let j=0;j<5;j++) B(g,C(j%2?'#2a7a3a':'#3a9a4a'),px+Math.sin(j+k)*.02,y0+.05+j*.09,tz1-.08,.025,.1,.012,0,0,Math.sin(j*1.3+k)*.3); }
    for(let j=0;j<12;j++) mk(box(.012,.012,.012),U('#e8faff'),g,x1-.25+Math.sin(j*2)*.02,y0+.12+j*.075,tz1-.25);
    for(let k=0;k<3;k++) mk(plane(tl/3-.02,y1-y0-.04),M(T.streak,{unlit:true,cut:true,repeat:[.8,1]}),g,x0+tl*(k+.5)/3,(y0+y1)/2,tz0-.005,0,Math.PI,0);
    for(const x of [x0,x0+tl/3,x0+tl*2/3,x1]) B(g,lac,x,y0,tz0-.01,.035,y1-y0,.035); B(g,lac,txc,y1,(tz0+tz1)/2,tl+.06,.06,tz1-tz0+.04); B(g,lac,txc,y0,tz0-.01,tl+.04,.04,.04);
    B(g,U('#e8f8ff'),txc,y1-.012,(tz0+tz1)/2,tl-.1,.012,.1);
    framed(g,13.97,1.92,1.75,-HP,.9,.66,suAt('board')); }
  { const x0=9.3, x1=13.62, sz=-2.53, sxc=(x0+x1)/2, sl=x1-x0;
    suBW(g,mDoors,sxc,.08,sz,sl,.8,.66,.6,.8); B(g,lac,sxc,0,sz+.02,sl-.04,.08,.62); suBW(g,mSteel,sxc,.88,sz-.01,sl+.04,.04,.72,.6,.6); B(g,chrome,sxc,.88,sz+.35,sl+.04,.06,.02);
    suBW(g,mSteel,sxc,.92,-WZ+.02,sl,.62,.03,.6,.6);
    /* knives on the wall */
    B(g,black,10.6,1.36,-WZ+.04,1.1,.04,.03); for(let k=0;k<7;k++) knife(g,10.15+k*.15,1.1,-WZ+.06,0,k===0?.33:k===6?.18:.27);
    /* shelf: sake, tea tins, lacquer bowls */
    suBW(g,mHin,11.5,1.82,-WZ+.15,3.4,.04,.28,1,.5); for(const x of [10.0,13.0]) B(g,lac,x,1.6,-WZ+.06,.03,.22,.2);
    const sake=suRemap(lathe([[0,.045,.045],[.18,.048,.048],[.24,.03,.03],[.3,.016,.016],[.34,.017,.017]],10),suAt('sake'));
    for(let k=0;k<6;k++) mk(sake,atl,g,10.1+k*.2,1.86,-WZ+.15); for(let k=0;k<3;k++) mk(tin,atl,g,11.45+k*.12,1.906,-WZ+.14);
    for(let k=0;k<4;k++) mk(cyl(.07,.05,.04,12),C(k%2?'#a81c1c':'#141010'),g,12.2+(k>>1)*.2,1.88+(k%2)*.042,-WZ+.15);
    for(let k=0;k<3;k++){ mk(cyl(.16,.16,.07,14),C('#d4b07a'),g,12.95,1.94+k*.075,-WZ+.15); mk(torus(.162,.006,4,14),copper,g,12.95,1.955+k*.075,-WZ+.15,HP); }
    /* the tuna on the block */
    suBW(g,mHin,11.1,.92,sz+.02,1.3,.07,.56,1,.5);
    const tuna=suRemap(lathe([[0,.0,.0],[.05,.09,.07],[.25,.17,.13],[.55,.19,.15],[.85,.15,.11],[1.05,.07,.05],[1.18,.03,.025]],12),suAt('tuna'));
    const tn=N(g,10.45,1.13,sz+.02,0,0,-HP); mk(tuna,atl,tn,0,0,0,0,HP,0);
    for(const s of [-1,1]) mk(box(.02,.18,.12),C('#1e2a44'),g,11.72,1.1+s*.09,sz+.02,0,0,s*.6);
    mk(box(.12,.06,.012),C('#c8ccd4'),g,10.62,1.08,sz+.02+.12,0,0,-.3); mk(box(.03,.012,.012),C('#101010'),g,10.5,1.13,sz+.02+.13);
    B(g,C('#c81a2c'),10.0,.99,sz+.02,.16,.06,.2); B(g,C('#e8707a'),10.0,1.05,sz+.02,.14,.005,.18);
    { const n=N(g,11.2,1.0,sz+.24,0,-.2,0); mk(suBox(.55,.004,.05,suAt('blade')),atl,n,0,0,0); mk(suBox(.18,.026,.03,suAt('handle')),atl,n,-.36,-.004,0); }
    /* rice cooker, tubs */
    mk(cyl(.17,.17,.26,14),C('#e8e8e2'),g,13.2,.92+.13,sz); mk(cyl(.16,.17,.04,14),chrome,g,13.2,1.2,sz); B(g,black,13.2,1.0,sz+.17,.06,.03,.01); mk(cyl(.025,.025,.02,8),black,g,13.2,1.23,sz);
    for(let k=0;k<2;k++){ mk(cyl(.24,.24,.09,16),C('#d8b47c'),g,9.75,.92+.045+k*.095,sz-.05); mk(torus(.242,.007,4,16),copper,g,9.75,.94+k*.095,sz-.05,HP); }
    /* fish crates */
    for(let k=0;k<3;k++){ const cy=k*.22; mk(suBox(.5,.2,.36,[suAt('crate'),suAt('crate'),suAt('plain'),suAt('plain'),suAt('crate'),suAt('crate')]),atl,g,13.25,cy,-1.55,0,(k%2)*.08,0); B(g,white,13.25,cy+.2,-1.55,.51,.02,.37,(k%2)*.08); } }
  /* the poster and the house shrine on the front wall */
  framed(g,13.97,1.3,-1.6,-HP,.7,1.05,suAt('poster'));
  { const n=N(g,13.85,2.52,0,0,-HP,0); suBW(n,mHin,0,0,.05,1.1,.04,.32,1,.5); for(const s of [-1,1]) B(n,hinC,s*.45,-.18,.0,.04,.18,.06);
    B(n,hinC,0,.04,.08,.42,.06,.24); B(n,C('#e8d8b0'),0,.1,.08,.34,.22,.2); B(n,C('#3a2a1e'),0,.12,.181,.12,.18,.004); mk(box(.5,.03,.18),sumi,n,0,.36,.04,.4); mk(box(.5,.03,.18),sumi,n,0,.36,.12,-.4); B(n,hinC,0,.38,.08,.5,.03,.03);
    for(const s of [-1,1]){ mk(cyl(.025,.022,.07,8),white,n,s*.36,.04+.035,.12); for(let j=0;j<4;j++) mk(box(.03,.07,.006),C('#2a5a2a'),n,s*.36+Math.sin(j*1.7)*.03,.12+j*.03,.12,0,j*.8,Math.sin(j)*.4); }
    mk(cyl(.025,.025,1.0,8),C('#d8c890'),n,0,.42,.16,0,0,HP); for(let j=0;j<3;j++) for(let q=0;q<3;q++) B(n,white,-.3+j*.3+(q%2)*.02,.24-q*.05,.165,.035,.05,.004); }

  /* ---------- the moving counter: plates of sushi on the chain, the fish in the tank, and every other piece of sushi in the car ---------- */
  suConveyor(g,T,{XS:XM-.3,XB,RB:1.25,BY,W:.25,stools,XM});

  /* small things standing on counters and shelves don't need colliders of their own (the counter under them has one) */
  (function nc(n,y){ for(const k of n.kids){ const yy=y+k.p[1]; if(k.mesh&&!k.mesh.geo.noCull&&yy>.45&&geoBounds(k.mesh.geo).r<.15) k.noCollide=1; nc(k,yy); } })(g,0);

  /* ---------- the crew: chefs down the well, one at the tuna, one pouring tea ---------- */
  W.spots={chefc_1:{x:5.2,z:0,ry:-HP},chefc_2:{x:1.6,z:0,ry:-HP},chefc_3:{x:-2.4,z:0,ry:-HP},chefc_4:{x:-5.6,z:0,ry:-HP},chefc_5:{x:10.4,z:-1.55,ry:-HP},chefc_6:{x:-.6,z:2.42,ry:-HP}};
};

/* the conveyor and every other sushi-atlas thing, built as one mesh. The moving part (chain slats, plates, fish)
   is the front of the vertex buffer and is rewritten each frame; the still part (neta, plate stacks) is written once. */
function suConveyor(g,T,o){ const {XS,XB,RB,BY}=o, L1=XB-XS, arc=Math.PI*RB, LEN=2*L1+arc, HP=Math.PI/2;
  const path=(s,out)=>{ s=((s%LEN)+LEN)%LEN; if(s<L1){ out[0]=XS+s; out[1]=RB; out[2]=0; } else if((s-=L1)<arc){ const th=s/RB; out[0]=XB+RB*Math.sin(th); out[1]=RB*Math.cos(th); out[2]=th; } else { s-=arc; out[0]=XB-s; out[1]=-RB; out[2]=Math.PI; } return out; };
  const S=suMB(), mov=[], put=(fn,x,y,z,a)=>{ const v0=S.P.length/3; fn(); const c=Math.cos(a),sn=Math.sin(a); for(let v=v0;v<S.P.length/3;v++){ const px=S.P[v*3],pz=S.P[v*3+2],nx=S.N[v*3],nz=S.N[v*3+2];
      S.P[v*3]=px*c+pz*sn+x; S.P[v*3+1]+=y; S.P[v*3+2]=-px*sn+pz*c+z; S.N[v*3]=nx*c+nz*sn; S.N[v*3+2]=-nx*sn+nz*c; } };
  const PLATE={white:[.96,.95,.92],blue:[.28,.46,.86],red:[.86,.2,.2],gold:[.95,.74,.24],black:[.14,.13,.15],green:[.3,.62,.36]};
  const MENU=[['tamago','white'],['maki','white'],['salmon','red'],['akami','red'],['gunkan','gold'],['ebi','blue'],['hamachi','red'],['chutoro','gold'],['ika','blue'],['unagi','black'],['uni','gold'],['salmon','blue'],['chutoro','black']];
  /* the chain: crescent slats */
  const nSeam=Math.round(LEN/.09), seam=suHalf(14,true), sc=[(seam[0]+seam[2])/2,(seam[1]+seam[3])/2], bw=o.W/2;
  for(let i=0;i<nSeam;i++){ const v0=S.P.length/3; for(const [z0,z1] of [[-bw,0],[0,bw]]){ const xa=z0===0?.022:0, xb=z0===0?0:.022; suQ(S,[[xa,.0012,z0],[xa+.007,.0012,z0],[xb+.007,.0012,z1],[xb,.0012,z1]],[0,1,0],[sc,sc,sc,sc],[1,1,1]); }
    mov.push({v0,v1:S.P.length/3,s0:i*LEN/nSeam}); }
  /* plates: a slot every ~0.45 m, most of them full */
  const nSlot=Math.round(LEN/.45), r=rng(1501);
  for(let i=0;i<nSlot;i++){ if(i%6===5) continue; const v0=S.P.length/3, [kind,pc]=MENU[(i*7+(r()*3|0))%MENU.length];
    suMPlate(S,PLATE[pc]); suMSushi(S,kind); if(r()<.25){ const v1=S.P.length/3; for(let v=v0;v<v1;v++){ const x=S.P[v*3],z=S.P[v*3+2]; S.P[v*3]=x*.7071+z*.7071; S.P[v*3+2]=-x*.7071+z*.7071; const nx=S.N[v*3],nz=S.N[v*3+2]; S.N[v*3]=nx*.7071+nz*.7071; S.N[v*3+2]=-nx*.7071+nz*.7071; } }
    mov.push({v0,v1:S.P.length/3,s0:i*LEN/nSlot,y:.0022}); }
  /* fish in the tank */
  const fishUV=[suHalf(15,false),suHalf(15,true)], fishV0=S.P.length/3;
  for(let k=0;k<7;k++){ const v0=S.P.length/3, f=fishUV[k%2], len=k%2?.16:.22, ht=len*.46; suQ(S,[[len/2,-ht/2,0],[-len/2,-ht/2,0],[-len/2,ht/2,0],[len/2,ht/2,0]],[0,0,1],[[f[0],f[1]],[f[2],f[1]],[f[2],f[3]],[f[0],f[3]]],[1,1,1]);
    mov.push({v0,v1:S.P.length/3,fish:k}); }
  const nMov=S.P.length/3;
  /* ---- the still part ---- */
  /* neta laid out on the ice in the cases */
  const NT=[4,5,6,7,10,11,9,4,5,6], rice=suCell(2);
  for(const s of [-1,1]) for(let x=o.XM+.6;x<XB-.5;x+=.32){ const c=NT[Math.abs(Math.round(x*3.1+s))%NT.length], nt=suCell(c);
    put(()=>{ suMBox(S,0,0,0,.22,.045,.09,[nt,nt,nt,nt,nt,nt],[1,1,1],.95,.92); },x,.935,s*1.01,s*.05); }
  for(const s of [-1,1]) for(let x=o.XM+1.9;x<XB-.5;x+=2.6) put(()=>{ suMCyl(S,0,0,0,.05,.03,10,suCell(3),suCell(12),[1,1,1]); },x,.935,s*1.015,0);
  /* on the ledge: stacks of empty plates, the odd full one taken off the belt */
  const cols=Object.keys(PLATE);
  o.stools.forEach(([x,z],i)=>{ const s=Math.sign(z)||1; if(x>XB+.05||i%3===2) return; const n=1+(i*7)%5, pc=PLATE[cols[(i*3)%5]];
    put(()=>{ for(let k=0;k<n;k++){ const v0=S.P.length/3; suMPlate(S,k===n-1?pc:PLATE[cols[(i+k)%5]]); for(let v=v0;v<S.P.length/3;v++) S.P[v*3+1]+=k*.019; } if(i%4===0) suMSushi(S,MENU[i%MENU.length][0],.017+(n-1)*.019); },x-.09,.82,s*1.52,i);
    if(i%5===1) put(()=>{ suMPlate(S,PLATE.red); suMSushi(S,'salmon'); },x+.1,.82,s*1.5,.4); });
  /* chefs' side: plates ready to go out, a geta board of nigiri in the round end */
  for(const s of [-1,1]) for(let x=o.XM+2.6;x<XB-.5;x+=3.1) put(()=>{ for(let k=0;k<6;k++){ const v0=S.P.length/3; suMPlate(S,PLATE[cols[k%5]]); for(let v=v0;v<S.P.length/3;v++) S.P[v*3+1]+=k*.019; } },x,.84,s*.74,0);
  for(const a of [-.85,.85]){ const gx=XB+.74*Math.cos(a), gz=.74*Math.sin(a);
    put(()=>{ suMBox(S,0,0,0,.3,.02,.14,suCell(2),[.85,.68,.45]); for(let k=0;k<4;k++) put0(k); },gx,.84,gz,-a); }
  function put0(k){ const v0=S.P.length/3; suMSushi(S,['akami','salmon','chutoro','ebi'][k],.02); for(let v=v0;v<S.P.length/3;v++){ S.P[v*3]=S.P[v*3]*.5+(k-1.5)*.07; } }
  /* the rice in the head chef's tub, plates on the back station */
  put(()=>{ suMCyl(S,0,0,0,.185,.02,14,rice,rice,[1,1,1]); },XB+.66,.925,0,0);
  put(()=>{ for(let k=0;k<8;k++){ const v0=S.P.length/3; suMPlate(S,PLATE[cols[k%5]]); for(let v=v0;v<S.P.length/3;v++) S.P[v*3+1]+=k*.019; } },12.4,.92,-2.45,0);

  /* ---- into one mesh ---- */
  const nV=S.P.length/3, LP=new Float32Array(S.P), LN=new Float32Array(S.N), P=new Float32Array(S.P), Nn=new Float32Array(S.N);
  const geo=new Geo(); geo.P=P; geo.Nm=Nn; geo.T=S.T; geo.C=S.C; geo.I=S.I; geo.noCull=true; geo.groups=[{start:0,count:S.I.length,mi:0}];
  const node=mk(geo,M(T.sushi,{cut:true,double:true}),g,0,0,0); node.noCollide=true;
  const tmp=[0,0,0], TK={x0:9.7,x1:13.35,y0:.95,y1:1.7,z0:2.25,z1:2.7};
  /* positions every frame (at most ~45 times a game-second); normals only for the fish, which turn a lot: a plate's normals keep
     their build orientation, which only shades a few rims differently in the bend */
  let last=-1;
  const update=t=>{ if(Math.abs(t-last)<.022) return; last=t; for(const it of mov){ let x,y,z,a;
      if(it.fish!==undefined){ const k=it.fish, sp=.18+(k%3)*.05, ph=k*1.9, cxk=(TK.x0+TK.x1)/2, rx=(TK.x1-TK.x0)/2-.15-(k%3)*.25, u=t*sp/rx*.8+ph;
        x=cxk+Math.cos(u)*rx; z=(TK.z0+TK.z1)/2+Math.sin(u)*.16; y=TK.y0+.1+(k%4)*.17+Math.sin(t*.7+ph)*.04; a=Math.atan2(Math.cos(u)*.16,Math.sin(u)*rx)+Math.PI; }
      else { path(it.s0+t*.11,tmp); x=tmp[0]; z=tmp[1]; a=tmp[2]; y=BY+(it.y||0); }
      const c=Math.cos(a),sn=Math.sin(a);
      for(let v=it.v0;v<it.v1;v++){ const i=v*3,px=LP[i],pz=LP[i+2],nx=LN[i],nz=LN[i+2]; P[i]=px*c+pz*sn+x; P[i+1]=LP[i+1]+y; P[i+2]=-px*sn+pz*c+z; if(v>=fishV0){ Nn[i]=nx*c+nz*sn; Nn[i+2]=-nx*sn+nz*c; } } }
    if(geo.vao){ gl.bindBuffer(gl.ARRAY_BUFFER,geo.bufs[0]); gl.bufferSubData(gl.ARRAY_BUFFER,0,P,0,nMov*3); gl.bindBuffer(gl.ARRAY_BUFFER,geo.bufs[1]); gl.bufferSubData(gl.ARRAY_BUFFER,fishV0*12,Nn,fishV0*3,(nMov-fishV0)*3); } };
  update(0); WG.sushi.anim.push(update);
  WG.sushi.conveyor={verts:nV,moving:nMov}; }
