/* ---------- 11 · Izakaya Hanami: leaving Tokyo by day, Tanaka & Associates ----------
   A lantern-lit izakaya with the sakura and paddies sliding past. You come in through a navy noren by the shoe
   lockers, the register and its lucky cat. The -z side is a long cedar counter with red stools, a robata grill
   glowing under a copper hood, bottles and menu plaques on the back wall. The +z side is four raised tatami
   booths (sunken leg pits under the tables) behind shoji partitions, with bamboo blinds half rolled. The front
   end is a standing bar: sake-barrel tables, a drinks fridge, crates, a gold sakura screen, stacked komodaru
   either side of the exit door. Painted from IZ (src/44r-izakaya-paint.js): three atlases, a handful of calls. */
CAR_BUILD.izakaya=function izakaya(){
  const T=izPaint(), A=T.A, GA=T.GA, KA=T.KA, PI=Math.PI;
  /* sub-slots: single plaques, strips, dishes and noren tails out of their sheets */
  const sub=(at,name,n,w,h,pre)=>{ const r=at.rects[name]; for(let k=0;k<n;k++) at.rects[pre+k]=[r[0]+k*w,r[1],w,h||r[3]]; };
  sub(A,'plaques',8,8,0,'plq'); sub(A,'strips',8,8,0,'str'); sub(A,'food',6,16,0,'dish'); sub(A,'norenN',3,16,0,'nN'); sub(A,'norenR',3,16,0,'nR');
  { const c=A.rects.catFace; A.rects.white=[c[0]+.1,c[1]+.1,2.4,2.4]; const b=A.rects.catBody; A.rects.koban=[b[0]+3,b[1]+10,10,8]; A.rects.catBib=[b[0],b[1]+1,16,2.4]; }
  const mA=M(A.tex), mG=M(GA.tex,{unlit:true}), mK=M(KA.tex,{cut:true,double:true});
  const tA={}, tint=hex=>tA[hex]||(tA[hex]=M(A.tex,{color:hexInt(hex)}));
  /* atlas boxes (base at y), cylinders and lathes */
  const ab=(p,s,x,y,z,w,h,d,ry=0,m=mA,rx=0,rz=0)=>mk(izUV(box(w,h,d,{at:[0,h/2,0]}),A,izFaces(s)),m,p,x,y,z,rx,ry,rz);
  const gb=(p,s,x,y,z,w,h,d,ry=0,rx=0,rz=0)=>mk(izUV(box(w,h,d,{at:[0,h/2,0]}),GA,izFaces(s)),mG,p,x,y,z,rx,ry,rz);
  const ac=(p,s,rt,rb,h,seg,x,y,z,m=mA,rx=0,ry=0,rz=0)=>mk(izUV(cyl(rt,rb,h,seg,{at:[0,h/2,0]}),A,typeof s==='string'?[s,s,s]:s),m,p,x,y,z,rx,ry,rz);
  const al=(p,s,rings,seg,x,y,z,m=mA,ry=0)=>mk(izUV(lathe(rings,seg),A,s),m,p,x,y,z,0,ry,0);
  const dark=C('#2a1c12'), black=C('#141010'), white=C('#f2eee4'), gold=C('#d4ad5a'), chrome=C('#c8ccd0');
  const nc=n=>{ (function w(q){ q.noCollide=1; for(const k of q.kids) w(k); })(n); return n; };

  /* ---------- the shell: dark slate floor, woven ceiling, plaster over cedar wainscot ---------- */
  const BC=[-6.75,-3.45,-.15,3.15], BX0=-8.4, BX1=4.8, BW=3.3;
  const winPos=BC.map(c=>[c-1.05,c+1.05]).concat([[7.4,9.6]]), winNeg=[[7.4,9.6]];
  const g=shell('izakaya',{floor:M(T.floor),floorTile:1,ceil:M(T.ceil),ceilTile:1.2,dado:M(T.dado),upper:M(T.plaster),pier:M(T.plaster),trim:dark,end:M(T.plaster),door:C('#3a2416'),lo:.95,hi:2.5,
    winsBySide:{pos:winPos,neg:winNeg},
    lamps:[lamp(-10.4,2.3,.15,[1.25,.9,.62],5.5),lamp(-5.4,2.25,-.7,[1.2,.88,.6],6),lamp(0,1.55,-1.75,[1.6,.75,.36],3.6),lamp(-3.4,2.3,1.9,[1.15,.88,.64],6),lamp(3.2,2.3,.3,[1.2,.88,.6],6),lamp(10.2,2.3,0,[1.25,.9,.62],6.5)],
    ambK:.66,sunK:.45,minLamp:.95});
  const W=WG.izakaya, S={'-1':W.side[-1],'1':W.side[1]};
  const P=N(g); /* small things on tables and shelves: no colliders */
  const Q=N(g); /* trims inside something that already collides: no colliders of their own (fewer boxes, faster bake) */

  /* structure: posts, a wainscot cap rail and the nageshi beam on both walls, in short runs so the grain never smears */
  const run=(p,s,x0,x1,y,z,h,d,seg=2)=>{ const n=Math.max(1,Math.ceil((x1-x0)/seg)), L=(x1-x0)/n; for(let i=0;i<n;i++) ab(p,s,x0+L*(i+.5),y,z,L,h,d); };
  for(const s of [-1,1]){ const zw=s*(WZ-.04), sg=S[s];
    run(sg,'timber',-WL/2,WL/2,.93,s*(WZ-.03),.07,.06); run(sg,'timber',-WL/2,WL/2,2.5,s*(WZ-.05),.12,.1);
    run(sg,'timber',-WL/2,WL/2,0,s*(WZ-.02),.1,.04); /* skirting */
    for(const x of (s>0?[-13.95,-12.5,BX0,-5.1,-1.8,1.5,BX1,7.1,9.85,13.95]:[-13.95,-10.2,-8.6,-4.6,4.6,7.1,9.85,13.95])) ab(sg,'timberV',x,0,s*(WZ-.06),.14,WH,.12); }
  /* end walls: wainscot, a door frame, posts */
  for(const e of [-1,1]){ const x=e*(WL/2-.02);
    for(const z0 of [-WZ,.62]){ const z1=z0<0?-.62:WZ, n=Math.round(z1-z0), L=(z1-z0)/n; for(let i=0;i<n;i++) ab(g,{s:'timber',px:'cedarFront',nx:'cedarFront'},x,0,z0+L*(i+.5),.04,.95,L-.01); ab(g,'timber',x-e*.02,.93,(z0+z1)/2,.07,.07,z1-z0); }
    for(const z of [-.67,.67]) ab(g,'timberV',x-e*.03,0,z,.1,2.42,.12); ab(g,'timber',x-e*.03,2.3,0,.12,.14,1.46); }
  /* ceiling: dark beams across, two runners along, a deeper beam over the aisle edge of the booths */
  for(let k=0;k<20;k++){ const x=-13.3+k*1.4; for(let j=0;j<3;j++) ab(g,'timber',x,WH-.2,-WZ+(j+.5)*WZ*2/3,.14,.2,WZ*2/3); }
  for(const z of [-1.3,1.3]) run(g,'timber',-WL/2,WL/2,WH-.26,z,.08,.2,2.4);
  run(g,'timber',BX0-.05,BX1+.05,2.6,1.3,.12,.1,2.2);

  /* ---------- the lanterns: ribbed paper chochin, painted glyphs, black lacquer rims ---------- */
  const lantern=(x,top,z,R,H,slot,ry=0)=>{ const n=N(g,x,top,z,0,ry,0), K=18, rings=[];
    for(let i=0;i<=K;i++){ const t=i/K, s=Math.sin(PI*(.08+.84*t)), rr=R*(.5+.5*s)*(i%2?.955:1); rings.push([-H+t*H,rr,rr]); }
    mk(izUV(lathe(rings,14,{capB:false,capT:false}),GA,slot),mG,n);
    for(const y of [-H-.035,-.005]){ mk(izUV(cyl(R*.55,R*.55,.04,12,{at:[0,.02,0]}),GA,['lanCap','lanCap','lanCap']),mG,n,0,y,0); mk(torus(R*.55,.008,3,12),gold,n,0,y+(y<-.1?.04:0),0,PI/2); }
    B(n,black,0,0,0,.012,WH-top,.012); B(n,C('#b8241c'),0,-H-.2,0,.02,.16,.02); mk(cyl(.012,.03,.06,6),C('#c8a040'),n,0,-H-.07,0); return n; };
  lantern(-11.4,2.95,.15,.3,.72,'lanR'); lantern(-12.9,2.85,-.3,.2,.48,'lanW');
  [-7.6,-4.4,-1.3,1.7,4.8,7.9,11.0].forEach((x,i)=>lantern(x,3.0,.15,.21,.52,i%3===2?'lanW':i%2?'lanR2':'lanR',i*.7));
  for(const x of [-7.2,-4.1,2.6]) lantern(x,3.05,-1.3,.15,.38,'lanR',x);
  BC.forEach((c,i)=>lantern(c,3.0,2.15,.18,.44,'lanW',i));
  lantern(12.4,3.0,1.9,.17,.42,'lanR'); lantern(12.4,3.0,-1.9,.17,.42,'lanR2');
  /* sakura sprays strung along the runners, for hanami */
  for(const z of [-1.3,1.3]) for(let x=-13;x<13.5;x+=1.65){ const n=mk(plane(1.6,.4),mK,g,x+.8,WH-.42,z+(Math.sin(x*3)*.04),Math.sin(x)*.12,0,0); izUV(n.mesh.geo,KA,'spray'); }
  for(const x of [-12.2,-10.4,-8.6,6.4,8.2,10.0,11.8]){ const n=mk(plane(1.6,.4),mK,g,x,WH-.38,-.6+(x%2)*.3,0,PI/2*.15,0); izUV(n.mesh.geo,KA,'spray'); }

  /* ---------- the entry: navy noren over the door, shoe lockers, the register and its lucky cat, coats ---------- */
  const noren=(p,x,z,ry,wd,y0,y1,pre)=>{ const n=N(p,x,0,z,0,ry,0), sw=wd/3;
    ab(n,'timber',0,y1,0,wd+.16,.05,.05); for(const s of [-1,1]) mk(cyl(.02,.02,.06,6),gold,n,s*(wd/2+.1),y1+.025,0,0,0,PI/2);
    for(let k=0;k<3;k++) ab(n,{s:pre+k,b:pre+k,f:pre+k},(k-1)*sw,y0,.0,sw-.025,y1-y0,.012,0,mA,(k-1)*.03,0);
    return nc(n); };
  noren(g,-13.82,0,PI/2,1.2,1.35,2.27,'nN'); noren(g,13.82,0,-PI/2,1.2,1.5,2.27,'nR');
  /* a kamidana shelf over the door with two daruma */
  { const n=N(g,-13.7,2.52,0); ab(n,'hinoki',0,0,0,.36,.04,1.0); for(const s of [-1,1]) ab(n,'midwood',.06,-.12,s*.42,.2,.12,.04); ab(n,'hinoki',0,.04,0,.3,.05,.5);
    for(const [z,sc] of [[-.25,1],[.22,.8]]){ const d=al(n,'daruma',[[0,.05*sc,.05*sc],[.04*sc,.075*sc,.07*sc],[.1*sc,.07*sc,.065*sc],[.15*sc,.045*sc,.04*sc],[.17*sc,0,0]],10,0,.04,z,mA,PI/2); } }
  /* shoe lockers */
  for(const k of [0,1]){ const x=-13.6+k*.72; ab(g,{s:'midwood',f:'getabako',t:'hinoki'},x,0,WZ-.22,.7,1.3,.42,PI); }
  ab(g,'hinoki',-13.24,1.3,WZ-.22,1.48,.04,.46);
  { const v=al(g,'tokkuri',[[0,.06,.06],[.1,.08,.08],[.2,.06,.06],[.26,.03,.03],[.3,.035,.035]],10,-13.6,1.34,WZ-.2); for(let k=0;k<3;k++){ const n=mk(plane(.55,.3),mK,g,-13.6+(k-1)*.05,1.72,WZ-.2,0,k*1.05,0); izUV(n.mesh.geo,KA,'branch'); } }
  /* register counter */
  { const x0=-11.3,x1=-9.9,zc=WZ-.28,d=.56; for(let k=0;k<2;k++) ab(g,{s:'cedarFront',t:'hinoki'},x0+.35+k*.7,0,zc,.7,1.0,d);
    ab(g,{s:'timber',t:'cedarTop'},(x0+x1)/2,1.0,zc-.02,x1-x0+.1,.05,d+.1); ab(g,'timber',(x0+x1)/2,0,zc-d/2-.01,x1-x0,.08,.02);
    /* the till */ const t=N(g,-10.95,1.05,zc,0,PI*.92,0), rg=A.rects.register; A.rects.regDisp=[rg[0]+1,rg[1]+1,14,6]; A.rects.regKeys=[rg[0]+.5,rg[1]+7,15,8.5]; const ct=tint('#c8c4b8');
    ab(t,'white',0,0,0,.36,.07,.34,0,C('#8a8680')); ab(t,{s:'white',t:'regKeys'},0,.07,.02,.34,.06,.28,0,ct,.25); ab(t,{s:'white',f:'regDisp'},0,.07,-.12,.3,.2,.08,0,ct,-.1); ab(t,'white',0,.27,-.12,.32,.02,.1,0,C('#8a8680'));
    /* the lucky cat: blocky, white, red collar, gold bell, a koban, one paw up */ const c=N(g,-10.25,1.05,zc-.05,0,PI*1.15,0), cw=tint('#f6f2ea');
    ab(c,{s:'zabuR'},0,0,0,.24,.04,.22); al(c,'white',[[0,.1,.085],[.03,.11,.095],[.13,.1,.085],[.2,.085,.07],[.24,.06,.05]],12,0,.04,0,cw);
    mk(torus(.072,.014,4,14),C('#c8302a'),c,0,.27,.004,PI/2); al(c,'white',[[0,.015,.015],[.02,.024,.024],[.04,.015,.015]],8,0,.235,.08,gold);
    ab(c,{s:'white',f:'catFace'},0,.265,.005,.18,.15,.15,0,cw); for(const s of [-1,1]){ ab(c,'white',s*.065,.42,0,.05,.05,.03,0,cw,0,s*.35); ab(c,'white',s*.062,.425,.016,.024,.03,.004,0,C('#f2a0b0'),0,s*.35); }
    ab(c,'koban',-.02,.09,.095,.11,.13,.015,0,mA); ab(c,'white',.075,.1,.07,.05,.07,.05,0,cw); /* paw on the coin */
    ab(c,'white',-.115,.2,.02,.05,.17,.05,0,cw,0,.15); ab(c,'white',-.125,.36,.02,.06,.05,.055,0,cw); ab(c,'white',-.127,.375,.048,.03,.025,.004,0,C('#f2a0b0'));
    /* a dish of sweets, a pen, a small vase */ ac(P,'white',.07,.05,.025,10,-10.55,1.05,zc-.12); for(let k=0;k<6;k++) mk(cyl(.012,.012,.02,6),C(['#e84a3a','#f2c230','#2a9a5a'][k%3]),P,-10.55+Math.cos(k)*.035,1.075,zc-.12+Math.sin(k)*.035,PI/2,k,0);
    ac(P,'white',.03,.03,.02,8,-9.98,1.05,zc+.12,C('#3a5a7a'));
    ab(S[1],'calendar',-10.6,1.45,WZ-.02,.36,.48,.012); }
  /* coats on pegs, a bench with briefcases, an umbrella stand */
  { run(S[-1],'timber',-13.7,-10.6,1.78,-WZ+.04,.12,.05,3.1);
    [[-13.3,'jacketA',.04],[-12.62,'jacketB',-.05],[-11.95,'jacketC',.02],[-11.25,'jacketA',-.03]].forEach(([x,s,rz],i)=>{ mk(cyl(.014,.014,.1,6),gold,S[-1],x,1.83,-WZ+.11,PI/2);
      const j=N(S[-1],x,1.86,-WZ+.13,0,0,rz); ab(j,'white',0,-.04,0,.44,.05,.08,0,C('#2a2420')); ab(j,{s:'white',f:s,b:s},0,-.8,0,.5,.76,.07,0,tint(i%2?'#d8dcea':'#ffffff')); ab(j,{s:s},0,-.08,.035,.36,.06,.04,0,mA,-.4); for(const sd of [-1,1]) ab(j,s,sd*.22,-.78,0,.07,.7,.09,0,mA,0,sd*.03); });
    { const x=-12.6, z=-WZ+.24; ab(g,'midwood',x,.38,z,1.6,.05,.36); for(const dx of [-.7,.7]) ab(g,'timber',x+dx,0,z,.06,.38,.3); ab(g,'timber',x,.12,z,1.4,.05,.04);
      ab(g,{s:'brief',t:'white'},x-.4,.43,z,.42,.3,.1,PI,tint('#ffffff'),0,0); ab(g,'white',x-.4,.73,z,.12,.03,.02,PI,black);
      ab(g,{s:'brief'},x+.25,.43,z+.04,.42,.3,.1,PI+.08,tint('#8a8a8a')); ab(g,{s:'brief'},-11.3,0,-WZ+.16,.44,.32,.11,.2,tint('#c8b0a0')); }
    { const x=-10.75,z=-WZ+.3; ac(g,{0:'copper',1:'steel',2:'steel'},.13,.12,.5,12,x,0,z); for(let k=0;k<3;k++){ const n=N(g,x+(k-1)*.05,.15,z+(k%2)*.04,0,0,(k-1)*.08); B(n,C(['#1a2a4a','#2a2a2a','#7a1a14'][k]),0,0,0,.05,.82,.05); mk(torus(.04,.01,4,8),C('#3a2418'),n,.035,.86,0); } } }

  /* ---------- the counter: cedar front in boards, a thick cedar top, a raised serving ledge, stools ---------- */
  const CX0=-8.6, CX1=4.6, CZF=-1.05, CZB=-1.62;
  { const n=Math.round((CX1-CX0)/1.1), L=(CX1-CX0)/n;
    for(let i=0;i<n;i++){ const x=CX0+L*(i+.5); ab(g,{s:'cedarFront',t:'timber',b:'timber'},x,.1,(CZF+CZB)/2,L-.012,.84,CZF-CZB); ab(g,'timberV',CX0+L*i,.1,CZF+.005,.05,.84,.03); }
    ab(g,'timberV',CX1,.1,CZF+.005,.05,.84,.03); run(Q,'timber',CX0,CX1,0,(CZF-.05+CZB)/2,.1,CZF-.05-CZB,2.2); run(Q,'timber',CX0,CX1,.88,CZF+.01,.06,.04,2.2);
    run(Q,{s:'timber',t:'cedarTop',u:'timber'},CX0-.05,CX1+.05,.94,(CZF+CZB)/2+.05,.06,.76,1.1); mk(izUV(cyl(.032,.032,CX1-CX0+.1,8),A,['timber','timber','timber']),mA,g,(CX0+CX1)/2,.968,CZF+.13,0,0,PI/2);
    for(const [a,b] of [[CX0,-1.75],[1.75,CX1]]){ run(g,{s:'cedarFront',t:'hinoki'},a,b,1.0,-1.73,.2,.2,2.2); run(g,{s:'timber',t:'hinoki'},a,b,1.2,-1.75,.04,.28,2.2); }
    ab(g,{s:'timber',t:'hinoki'},0,1.0,-1.72,3.5,.05,.12);
    for(const x of [CX0-.03,CX1+.03]) ab(g,{s:'cedarFront',t:'timber'},x,0,-1.97,.06,1.24,1.86); }
  /* the kitchen behind: a steel bench, the robata, a copper hood, a draft tap, pots */
  run(g,{s:'steel',t:'steel'},CX0,CX1,0,-2.22,.9,.64,2.2);
  { const n=N(g,0,0,0), FZ=-2.08; ab(n,{s:'timber',t:'steel'},0,.9,FZ,3.0,.1,.56); gb(n,'embers',0,1.0,FZ,2.86,.04,.44);
    for(const s of [-1,1]){ ab(n,{s:'steel'},0,.9,FZ+s*.25,3.0,s<0?.24:.15,.05); ab(n,{s:'steel'},s*1.47,.9,FZ,.05,.24,.56); }
    for(let k=0;k<29;k++) ab(n,'steel',-1.4+k*.1,1.12,FZ,.012,.012,.5);
    for(let k=0;k<14;k++){ const x=-1.3+k*.2, z=FZ, s=N(n,x,1.14,z,0,(k%3-1)*.05,0); ab(s,'hinoki',0,0,0,.008,.008,.4);
      for(let j=0;j<4;j++){ const c=k%4===1?['#3a6a2a','#a85a24','#3a6a2a','#a85a24'][j]:k%4===3?['#e8d8b0','#d8a050','#e8d8b0','#d8a050'][j]:['#8a4a1a','#a85a24','#9a5020','#8a4a1a'][j]; B(s,C(c),0,0,-.12+j*.075,.032,.03,.055); } }
    ab(n,'copper',0,2.42,-2.4,3.6,.38,1.0,0,mA); mk(izUV(box(3.6,.3,1.0,{tw:.86,td:.7,at:[0,.15,0]}),A,'copper'),mA,n,0,2.8,-2.45); ab(n,'copper',0,3.1,-2.6,.8,.3,.5); ab(n,'timber',0,2.38,-1.89,3.64,.05,.06);
    for(let i=0;i<5;i++) for(let j=0;j<2;j++) ab(n,'tiles',-1.46+i*.73,1.0+j*.71,-WZ+.03,.73,.71,.02); ab(n,'timber',0,2.42,-WZ+.04,3.7,.04,.05);
    /* a paddle, a tray of skewers waiting */ ab(n,'hinoki',1.75,1.0,-2.0,.12,.02,.9,.3,mA,.0,.0); for(let k=0;k<8;k++) ab(P,'hinoki',-2.2+k*.03,1.24,-1.68,.008,.008,.24,.1,mA);
    /* baskets on the ledge either side of the grill */ for(const x of [-2.4,2.7]) ab(P,{s:'midwood',t:'basket'},x,1.24,-1.74,.62,.07,.3,0,tint('#ffffff'));
    /* draft beer tap */ ab(n,'steel',3.6,.9,-2.2,.36,.5,.38); ab(n,'steel',3.6,1.4,-2.1,.1,.24,.1); ab(n,'white',3.6,1.56,-1.98,.03,.03,.16,0,chrome); ab(n,'white',3.6,1.45,-1.9,.025,.12,.025,0,black);
    /* pots, a cutting board, knives */ for(const [x,r,h] of [[-3.6,.2,.32],[-3.1,.16,.24],[2.6,.18,.28]]){ ac(n,{0:'steel',1:'steel'},r,r,h,14,x,.9,-2.3); mk(torus(r,.012,3,14),chrome,n,x,.9+h,-2.3,PI/2); }
    ab(n,'hinoki',-5.5,.9,-2.1,.6,.04,.36);
    /* stacks of plates and bowls, a rice cooker, a sake warmer */ for(const [x,k] of [[-4.6,7],[-4.25,5],[3.1,6],[-7.6,4]]) for(let j=0;j<k;j++) ac(P,'white',.1,.08,.022,12,x,.9+j*.024,-2.0,white);
    for(let j=0;j<4;j++) ac(P,'white',.07,.05,.045,10,-3.9,.9+j*.047,-2.0,C('#2a3a5a')); { const rc=N(n,-6.6,.9,-2.3); ac(rc,'white',.16,.15,.24,14,0,0,0,white); ac(rc,'steel',.15,.16,.06,14,0,.24,0); ac(rc,'white',.03,.03,.03,8,0,.3,0,black); ab(rc,'white',0,.14,.16,.08,.05,.02,0,C('#e84a3a')); }
    { const sw=N(n,4.1,.9,-2.05); ab(sw,'steel',0,0,0,.32,.26,.3); for(let k=0;k<3;k++) al(sw,'tokkuri',[[0,.03,.03],[.05,.042,.042],[.09,.034,.034],[.12,.016,.016],[.15,.02,.02]],8,-.09+k*.09,.26,0,mA); } for(let k=0;k<2;k++){ ab(P,'steel',-5.6+k*.18,.94,-2.0,.03,.006,.26); ab(P,'timber',-5.6+k*.18,.94,-1.84,.03,.02,.12); }
    for(let k=0;k<5;k++) ac(P,'white',.09,.07,.04,10,-6.6+k*.22,.9,-2.3,white); }
  /* the back wall: two shelves of isshobin and beer, menu plaques on a rail, the kanban */
  { const bot=(p,x,y,z,s,hh=.4,r=.052)=>al(p,s,[[0,r*.9,r*.9],[.02,r,r],[hh*.62,r,r],[hh*.74,r*.62,r*.62],[hh*.86,r*.34,r*.34],[hh,r*.34,r*.34]],10,x,y,z,mA,PI/2);
    for(const [x0,x1] of [[CX0+.1,-2.0],[2.0,CX1-.1]]){ for(const y of [1.45,1.92]){ run(S[-1],{s:'timber',t:'midwood'},x0,x1,y,-WZ+.15,.035,.28,2.2); for(let x=x0+.18;x<x1-.1;x+=.21) for(const dz of [0]){ const k=Math.round(x*7+y*3); bot(P,x,y+.035,-WZ+.14,['bottleSake','bottleSake2','bottleSake','bottleBeer'][(k%4+4)%4],y>1.6?.38:.42); } }
      for(const x of [x0,x1]) ab(S[-1],'timberV',x,1.4,-WZ+.15,.04,.6,.3); }
    for(const [x0,x1] of [[CX0+.05,-1.95],[1.95,CX1]]){ run(S[-1],'timber',x0,x1,2.48,-WZ+.06,.03,.04); let k=0; for(let x=x0+.06;x<x1-.04;x+=.11,k++) ab(S[-1],{s:'hinoki',f:'plq'+(k%8)},x,2.06,-WZ+.03,.09,.42,.016,0,mA,-.04); }
    const kb=N(S[-1],-5.3,2.64,-WZ+.05); ab(kb,{s:'timber',f:'kanban'},0,0,0,2.4,.6,.06); ab(kb,'timber',0,-.03,0,2.52,.04,.09); ab(kb,'timber',0,.6,0,2.52,.04,.09); for(const s of [-1,1]) ab(kb,'timberV',s*1.24,-.03,0,.05,.67,.09); }
  /* stools */
  const STX=[]; for(let k=0;k<14;k++) STX.push(CX0+.5+k*.92);
  STX.forEach((x,k)=>{ const z=-.68+((k*37)%5-2)*.012, n=N(g,x,0,z,0,(k*1.3)%1.2,0);
    for(const [dx,dz] of [[-.12,-.12],[.12,-.12],[-.12,.12],[.12,.12]]) nc(ab(n,'timberV',dx,0,dz,.035,.62,.035,0,mA,dz*.12,0,-dx*.12));
    for(const a of [0,PI/2]) nc(ab(n,'timber',0,.2,0,.27,.025,.025,a)); ac(n,'midwood',.19,.19,.05,14,0,.6,0); ac(Q,['stoolTop','stoolTop','stoolTop'],.18,.185,.06,14,x,.65,z); });
  /* the counter set for a night of drinking */
  const plate=(p,x,y,z,k,r=.09)=>{ ac(p,['white','dish'+(k%6),'white'],r,r*.7,.022,14,x,y,z,mA); };
  const mug=(p,x,y,z,ry=0)=>{ const n=N(p,x,y,z,0,ry,0); al(n,'beerMug',[[0,.042,.042],[.01,.045,.045],[.15,.048,.048],[.16,.05,.05]],10,0,0,0,mA); ab(n,'white',.06,.03,0,.015,.1,.02,0,C('#e8e4c0')); return n; };
  const chop=(p,x,y,z,ry)=>{ const n=N(p,x,y,z,0,ry,0); ab(n,'hinoki',0,.012,.0,.02,.012,.03,0,C('#c8302a')); for(const s of [-1,1]) ab(n,'hinoki',s*.008,.018,.03,.006,.006,.22,0,mA); };
  const tok=(p,x,y,z)=>{ al(p,'tokkuri',[[0,.035,.035],[.05,.048,.048],[.1,.04,.04],[.14,.018,.018],[.17,.022,.022]],10,x,y,z,mA); ac(p,'white',.024,.018,.03,8,x+.08,y,z+.03,white); };
  const bottle=(p,x,y,z,s='bottleBeer',ry=0)=>al(p,s,[[0,.034,.034],[.15,.036,.036],[.18,.022,.022],[.24,.013,.013],[.27,.014,.014]],10,x,y,z,mA,ry);
  const ash=(p,x,y,z)=>{ ac(p,['steel','ashtray','steel'],.055,.05,.02,12,x,y,z,mA); };
  const towel=(p,x,y,z,ry)=>{ mk(cyl(.02,.02,.14,8),white,p,x,y+.02,z,0,ry,PI/2); ab(p,'white',x,y,z,.16,.006,.06,ry,C('#3a4a2a')); };
  STX.forEach((x,k)=>{ const y=1.0, z=-1.18;
    if(k===4||k===9) return;
    if(k%3===0){ mug(P,x+.12,y,z-.02,k); plate(P,x-.08,y,z-.12,k); chop(P,x-.1,y,z+.04,PI/2+.1); }
    else if(k%3===1){ tok(P,x+.1,y,z-.1); plate(P,x-.1,y,z-.05,k+2); towel(P,x+.05,y,z+.06,.3); }
    else { bottle(P,x+.14,y,z-.14); ac(P,'glassTea',.03,.026,.11,10,x+.04,y,z-.02); ash(P,x-.14,y,z-.04); } });
  /* on the ledge: big platters of the day's dishes, shichimi and soy, a menu stand */
  [-7.6,-6.2,-4.6,-3.2,2.0,3.4].forEach((x,i)=>{ ac(P,[i%2?'zabuB':'white','dish'+((i+3)%6),'white'],.17,.12,.05,16,x,1.24,-1.74,mA); });
  for(const x of [-7.0,-3.9,2.8]){ ac(P,'white',.022,.022,.08,8,x,1.24,-1.66,C('#c8302a')); ac(P,'white',.024,.024,.09,8,x+.07,1.24,-1.66,C('#3a2418')); ac(P,'white',.024,.024,.02,8,x+.07,1.33,-1.66,C('#e84a3a')); }
  for(const x of [-5.6,1.0]){ const n=N(P,x,1.24,-1.66); ab(n,{s:'hinoki',f:'str3'},0,0,0,.12,.2,.015,0,mA,-.2); }

  /* ---------- the booths: raised tatami, sunken leg pits, shoji partitions, bamboo blinds ---------- */
  const BZ0=1.3, BZ1=WZ, PH=.38;
  ab(g,{s:'timber',t:'white',f:'timber'},(BX0+BX1)/2,0,(BZ0+BZ1)/2,BX1-BX0,PH,BZ1-BZ0,0,C('#3a2a1c'));
  run(g,{s:'timber',t:'midwood'},BX0,BX1,PH-.06,BZ0+.03,.08,.08,2.2); /* the kamachi edge */
  BC.forEach((c,b)=>{ const x0=c-BW/2;
    for(let k=0;k<4;k++){ const n=ab(g,'tatami',x0+.41+k*.825,PH,(BZ0+BZ1)/2+.02,1.54,.02,.81,PI/2); }
    /* the stone step with shoes lined up on it */ ab(g,{s:'white',t:'white'},c-.6,0,BZ0-.2,.9,.14,.32,0,C('#8a8278'));
    for(let k=0;k<(b%2?3:4);k++){ const n=N(P,c-.92+k*.22,.14,BZ0-.2,0,PI*.5+((k*31)%7-3)*.06,0); ab(n,'white',0,0,0,.1,.07,.27,0,C(k%3?'#1a1412':'#3a2416')); ab(n,'white',0,.07,-.06,.08,.012,.12,0,C('#0a0806')); }
    /* the pit, its frame, the low table */
    ab(g,'white',c,PH+.005,2.12,1.4,.02,.56,0,C('#120c08')); for(const s of [-1,1]){ ab(g,'timber',c+s*.72,PH+.01,2.12,.05,.02,.62); ab(g,'timber',c,PH+.01,2.12+s*.3,1.48,.02,.05); }
    ab(g,{s:'midwood',t:'lacquer'},c,.7,2.12,1.5,.045,.78); ab(Q,'timber',c,.64,2.12,1.4,.06,.68); for(const [dx,dz] of [[-.66,-.3],[.66,-.3],[-.66,.3],[.66,.3]]) ab(g,'timberV',c+dx,.3,2.12+dz,.06,.34,.06);
    /* cushions, legless chairs on the wall side */
    for(const dx of [-.42,.42]){ for(const [z,back] of [[1.6,0],[2.66,1]]){ const n=N(g,c+dx,PH+.02,z,0,back?PI:0,0); ab(n,{s:'zabuB',t:b%2?'zabuR':'zabuB'},0,0,0,.48,.07,.48,0,mA); if(back){ nc(ab(n,'lacquer',0,.07,-.24,.44,.04,.04)); nc(ab(n,{s:'lacquer',f:'zabuR'},0,.1,-.23,.42,.42,.05,0,mA,-.22)); } } }
    /* the table, mid-session */
    const y=.745, z=2.12, r=rng(b*11+3);
    for(let k=0;k<4;k++) plate(P,c-.5+k*.33,y,z+(k%2?.14:-.12),b+k*2,.1);
    mug(P,c-.25,y,z+.28,b); mug(P,c+.36,y,z-.28,b+1); if(b!==2) mug(P,c+.6,y,z+.22,2);
    bottle(P,c-.05,y,z+.02,'bottleBeer'); bottle(P,c+.12,y,z-.05,b%2?'bottleSake2':'bottleBeer'); tok(P,c-.62,y,z-.25); ash(P,c+.5,y,z+.02);
    chop(P,c-.42,y,z+.3,.1); chop(P,c+.42,y,z-.3,PI+.1); towel(P,c-.2,y,z-.32,0);
    if(b===1){ ab(P,{s:'white',t:'newspaper'},c+.2,y,z+.18,.4,.008,.3,.3); ab(P,'white',c-.32,y,z-.05,.07,.008,.14,.4,C('#1a1a1e')); }
    if(b===3){ ab(P,'white',c+.05,y,z+.25,.14,.012,.05,.2,C('#1a1a1e')); for(const s of [-1,1]) mk(torus(.022,.004,3,8),C('#1a1a1e'),P,c+.05+s*.03,y+.012,z+.25,PI/2); }
    /* empties along the wall */ for(let k=0;k<3+(b%2);k++) bottle(P,c-1.4+k*.09,PH+.02,BZ1-.12,'bottleBeer');
    if(b===0||b===2) ab(g,{s:'brief'},c+1.3,PH+.02,BZ1-.18,.42,.3,.1,PI+.1,tint(b?'#ffffff':'#9a9a9a'));
    /* shoji panels slid aside at the window, paper glowing with daylight */
    for(const s of [-1,1]) gb(S[1],{s:'shojiLit'},c+s*.83,.96,WZ-.07,.42,1.52,.025);
    /* strips of the day's menu pinned above the window */ for(let k=0;k<12;k++) ab(S[1],{s:'white',f:'str'+((k+b*3)%8)},c-.77+k*.14,2.66,WZ-.03,.1,.4,.006,PI,mA,0,((k*13)%5-2)*.012);
    /* the blind over the aisle side, half rolled */ nc(ab(g,{s:'sudare'},c,2.25,BZ0,BW-.3,.35,.012,0,mA)); nc(mk(izUV(cyl(.045,.045,BW-.3,10,{}),A,['sudare','timber','timber']),mA,g,c,2.25,BZ0,0,0,PI/2)); for(const s of [-1,1]) nc(B(g,C('#c8302a'),c+s*1.1,2.2,BZ0+.05,.015,.4,.015));
  });
  /* partitions: timber frames with shoji, a tall post at the aisle corner */
  for(const x of [BX0,-5.1,-1.8,1.5,BX1]){ const n=N(g,x,0,0);
    for(const [z0,z1] of [[BZ0+.08,BZ1-.04]]){ const zc=(z0+z1)/2, L=z1-z0;
      for(let k=0;k<2;k++) ab(n,{s:'shoji',b:'shoji'},0,PH+.08,z0+L*(k+.5)/2,.03,1.0,L/2-.02,0,mA);
      nc(ab(n,'timber',0,PH,zc,.08,.08,L)); nc(ab(n,'timber',0,PH+1.08,zc,.08,.07,L+.04)); ab(n,'timberV',0,PH,zc,.05,1.15,.05); }
    ab(n,'timberV',0,0,BZ0+.02,.12,WH,.12); }
  /* a loosened tie over a partition */
  { const n=N(g,-1.8,PH+1.15,1.95); ab(n,'jacketTie',0,-.36,.05,.012,.38,.07,0,mA); ab(n,'jacketTie',0,-.3,-.05,.012,.3,.06,0,mA); ab(n,'jacketTie',0,0,0,.09,.012,.08); }

  /* ---------- the front: kitchen door, crates, a drinks fridge, barrel tables, the gold screen, komodaru ---------- */
  { const x=5.7, zw=-WZ+.02; ab(S[-1],'white',x,0,zw+.01,1.0,2.06,.02,0,C('#0e0a08')); for(const s of [-1,1]) ab(S[-1],'timberV',x+s*.56,0,zw+.05,.12,2.16,.1); ab(S[-1],'timber',x,2.06,zw+.05,1.24,.12,.12);
    ab(S[-1],'timber',x,0,zw+.06,1.0,.04,.12); noren(S[-1],x,zw+.14,0,.96,1.2,2.04,'nR'); }
  { const fr=N(g,10.45,0,-WZ+.36); ab(fr,{s:'steel'},0,0,0,.9,1.95,.66,0,tint('#e8ecee')); gb(fr,'fridge',0,.12,.332,.74,1.66,.01); for(const s of [-1,1]) ab(fr,'steel',s*.39,.08,.34,.06,1.76,.03); ab(fr,'steel',0,.06,.34,.84,.06,.03); ab(fr,'steel',0,1.78,.34,.84,.06,.03); ab(fr,'white',.34,.7,.36,.025,.4,.03,0,chrome); ab(fr,'white',0,0,0,.92,.08,.68,0,black); }
  { const crate=(x,y,z,s,ry)=>{ const n=N(g,x,y,z,0,ry,0); ab(n,{s:s,t:'crateTop'},0,0,0,.46,.3,.36); return n; };
    [[7.9,0,-2.5,'crateSide',.05],[7.9,.3,-2.5,'crateSideR',-.04],[7.9,.6,-2.5,'crateSide',.1],[8.45,0,-2.52,'crateSideR',-.1],[8.45,.3,-2.5,'crateSide',0],[9.1,0,-2.45,'crateSide',.3]].forEach(a=>crate(...a));
    for(let k=0;k<6;k++) bottle(P,9.0+(k%3)*.07,.3,-2.5+(k>>1&1)*.08,'bottleBeer'); }
  ab(S[-1],{s:'timber',f:'posterBeer'},6.75,1.25,-WZ+.02,.52,.78,.025); ab(S[-1],'timber',6.75,1.22,-WZ+.03,.58,.03,.04); ab(S[-1],'timber',6.75,2.03,-WZ+.03,.58,.03,.04);
  ab(S[1],{s:'timber',f:'posterSake'},6.1,1.25,WZ-.02,.52,.78,.025,PI); ab(S[1],'timber',6.1,1.22,WZ-.03,.58,.03,.04); ab(S[1],'timber',6.1,2.03,WZ-.03,.58,.03,.04);
  /* sake-barrel standing tables */
  const taru=(p,x,z,r,h,ry,s='taruSide')=>{ const n=N(p,x,0,z,0,ry,0); ac(n,[s,'taruTop','taruTop'],r,r*.97,h,16,0,0,0); for(const y of [h*.12,h*.88]) mk(torus(r*1.005,.016,4,16),C('#5a3a1e'),n,0,y,0,PI/2); return n; };
  for(const [x,z,ry] of [[7.6,.55,.4],[9.9,-.85,2.2]]){ const n=taru(g,x,z,.3,.86,ry); ac(n,{0:'midwood',1:'taruTop',2:'midwood'},.42,.42,.045,18,0,.86,0);
    mug(P,x+.15,.9,z+.1,1); bottle(P,x-.12,.9,z-.12); ash(P,x+.05,.9,z-.2); plate(P,x-.15,.9,z+.18,x>8?1:4,.1); }
  /* the gold screen on a low dais, sakura in a tall vase in front of it */
  { const x0=9.9,x1=12.4, z=WZ-.25; ab(g,{s:'lacquer',t:'lacquer'},(x0+x1)/2,0,z-.05,x1-x0+.1,.22,.62);
    for(let k=0;k<4;k++){ const w=(x1-x0)/4, x=x0+w*(k+.5), a=(k%2?1:-1)*.25; const n=N(g,x,.22,z,0,PI+a,0); const r=A.rects.byobu; A.rects['byo'+k]=[r[0]+k*24,r[1],24,40];
      ab(n,{s:'lacquer',f:'byo'+k,b:'lacquer'},0,0,0,w/Math.cos(a)-.02,1.06,.03); ab(n,'lacquer',0,1.06,0,w/Math.cos(a),.04,.05); }
    const v=al(g,'white',[[0,.08,.08],[.05,.12,.12],[.3,.14,.14],[.45,.1,.1],[.55,.06,.06],[.62,.075,.075]],12,12.0,.22,z-.18,C('#2a3a4a'));
    for(let k=0;k<4;k++){ const n=mk(plane(1.0,.55),mK,g,12.0+(k-1.5)*.04,1.05,z-.2,0,k*.8,(k%2?.2:-.2)); izUV(n.mesh.geo,KA,'branch'); } }
  /* stacked komodaru either side of the exit door */
  { const r=.27,h=.56, stack=(sz)=>{ const zs=sz<0?[-2.58,-2.02,-1.46]:[2.58,2.02,1.46];
      zs.forEach((z,i)=>taru(g,13.6,z,r,h,.3+i*.9)); taru(g,12.98,zs[0],r,h,2.4); taru(g,12.98,zs[1],r,h,1.1);
      ab(g,'midwood',13.6,h,(zs[0]+zs[2])/2,.62,.03,1.7); taru(g,13.6,(zs[0]+zs[1])/2,r,h,.2).p[1]=h+.03; taru(g,13.6,(zs[1]+zs[2])/2,r,h,1.7).p[1]=h+.03;
      ab(g,'midwood',13.6,h*2+.03,(zs[0]+zs[1])/2+sz*-.28,.62,.03,1.1); taru(g,13.6,zs[1],r,h,.9).p[1]=h*2+.06; };
    stack(-1); stack(1); }
  /* a sugidama, the cedar ball that says the new sake is in, by the exit; scrolls either side of the way in */
  { const n=N(g,13.5,2.45,1.15); B(n,black,0,0,0,.012,WH-2.45,.012); mk(izUV(lathe([[-.4,.02,.02],[-.36,.18,.18],[-.26,.26,.26],[-.14,.28,.28],[-.02,.24,.24],[.05,.14,.14],[.08,.03,.03]],14),A,'sugi'),mA,n,0,-.08,0); ab(n,'timber',0,-.03,0,.08,.05,.08); }
  for(const z of [-1.7,1.7]){ ab(g,{s:'timber',px:'scroll'},-WL/2+.02,1.0,z,.01,1.35,.45); ab(g,'timber',-WL/2+.04,2.33,z,.04,.04,.52); mk(cyl(.02,.02,.52,8),dark,g,-WL/2+.06,1.0,z,PI/2); }
  /* the TV in the corner, on a bracket */
  { const n=N(g,13.45,2.35,-1.85,0,-PI/2+.55,0); ab(n,'white',0,0,0,.8,.52,.1,0,C('#1a1a1c')); gb(n,'tv',0,.04,.051,.72,.44,.004); ab(n,'white',0,.52,-.02,.06,WH-2.87,.06,0,black); }

  /* the crew: drinking at the counter, in the booths, waiting at the standing tables; the Section Chief at the front */
  W.spots={tanaka:{x:11.3,z:.25,ry:-PI/2},
    tanakac_1:{x:STX[4],z:-.68,ry:PI,pose:'sit',y:.26}, tanakac_2:{x:-.57,z:2.6,ry:PI,pose:'sit',y:.05}, tanakac_3:{x:-1.2,z:.35,ry:-PI/2}, tanakac_4:{x:6.4,z:-.2,ry:-PI/2},
    tanakab_1:{x:-6.6,z:.55,ry:-PI/2}, tanakab_2:{x:-3.03,z:1.62,ry:0,pose:'sit',y:.05}, tanakab_3:{x:8.7,z:.15,ry:-PI/2}};
  nc(P); nc(Q); nc(S[-1]); nc(S[1]);
};
