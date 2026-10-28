
/* =====================================================================================================
   RIO AT SUNSET, rebuilt. Sea side: Sugarloaf and its cable car against the sunset, the bay bridge, a busy
   beach with umbrellas, a lifeguard tower, volleyball, kites. Land side: steep jungle peaks with the statue
   on top, a terraced hillside of painted and raw-brick houses with blue water tanks, lit windows, stairs and
   washing lines, and a mural wall along the street.
   ===================================================================================================== */
const RIO_PAINT=['#e0473a','#f2c230','#2a9a5a','#2a6ad8','#f27ab0','#f2ece0','#e88a3a','#7ac0d8','#b85ab0','#f2e0a0'];
function rioSeaFar3(g,w,h,r,v){ const hz=h*.84;
  vfill(g,0,hz,w,h-hz,[[0,'#f2a070'],[.12,'#5a6a8a'],[1,'#22385a']]);
  for(let i=0;i<70;i++){ const x=r()*w|0,y=(hz+2+r()*(h-hz-2))|0; R(g,rgba(i%3?'#ffb080':'#ffffff',.55),x,y,2+(r()*3|0),1); }
  if(v===0){ /* Sugarloaf and the smaller dome, the cable car between them */
    const dome=(cx,bw,ht)=>{ g.fillStyle='#2a3448'; g.beginPath(); g.moveTo(cx-bw/2,hz+.5); g.bezierCurveTo(cx-bw*.62,hz-ht*.9,cx-bw*.22,hz-ht*1.12,cx+bw*.05,hz-ht); g.bezierCurveTo(cx+bw*.4,hz-ht*.9,cx+bw*.62,hz-ht*.5,cx+bw/2,hz+.5); g.fill();
      g.strokeStyle=rgba('#ff9a6a',.85); g.lineWidth=1; g.beginPath(); g.moveTo(cx-bw/2+1,hz-2); g.bezierCurveTo(cx-bw*.6,hz-ht*.88,cx-bw*.22,hz-ht*1.1,cx+bw*.04,hz-ht+1); g.stroke(); };
    dome(104,40,22); dome(158,34,56); for(let k=0;k<3;k++) ell(g,130+k*10,hz-6+k,8,3,'#3a5a3e');
    g.strokeStyle='#14141c'; g.beginPath(); g.moveTo(104,hz-22); g.lineTo(160,hz-56); g.stroke(); R(g,'#c8202a',128,hz-39,3,2);
    for(let k=0;k<5;k++){ const sx=24+k*40+(r()*10|0),sy=hz+4+(r()*6|0); poly(g,[[sx,sy],[sx+3,sy],[sx+1.5,sy-6]],'#ffe8d8'); } }
  else { /* the long bay bridge across the horizon, hills beyond */ ridgeP(g,w,hz,hz-10,5,3,941,'#5a5a7a'); R(g,'#5a5a7a',0,hz-1,w,2); for(let x=8;x<w;x+=22) R(g,'#4a4a68',x,hz-5,2,6); R(g,'#3a3a58',96,hz-14,3,14); R(g,'#3a3a58',120,hz-14,3,14); R(g,'#3a3a58',96,hz-14,27,2); } }
function rioBeachMid3(g,w,h,r,v){ const sb=h-12; vfill(g,0,sb,w,12,[[0,'#f6d8a8'],[1,'#e2b880']]); R(g,'#ffffff',0,sb-1,w,1); for(let x=0;x<w;x+=2) if(r()<.5) R(g,rgba('#ffffff',.7),x,sb-2,2,1);
  /* lifeguard tower */ const lx=40+v*120; R(g,'#e8e4dc',lx,sb-16,2,16); R(g,'#e8e4dc',lx+8,sb-16,2,16); R(g,'#c8202a',lx-1,sb-22,12,7); R(g,'#f2ece0',lx-1,sb-19,12,1); R(g,'#f2c230',lx+4,sb-30,1,8); poly(g,[[lx+5,sb-30],[lx+11,sb-28],[lx+5,sb-26]],'#f2c230');
  /* volleyball net */ const nx=150-v*80; R(g,'#4a3a2a',nx,sb-12,1,12); R(g,'#4a3a2a',nx+30,sb-12,1,12); for(let k=0;k<30;k+=2) R(g,'#e8e4dc',nx+k,sb-12,1,4); R(g,'#e8e4dc',nx,sb-12,30,1); ell(g,nx+12,sb-20,1.5,1.5,'#f2c230');
  /* umbrellas and people */ for(let i=0;i<14;i++){ const x=6+i*18+(r()*8|0),c=RIO_PAINT[i%RIO_PAINT.length],y=sb+2+(r()*4|0); if(Math.abs(x-lx-5)<10||Math.abs(x-nx-15)<18) continue; R(g,'#5a4a3a',x,y-12,1,12); poly(g,[[x-7,y-10],[x+8,y-10],[x,y-15]],c); poly(g,[[x-2,y-10],[x+2,y-10],[x,y-15]],mix(c,'#ffffff',.4)); }
  for(let i=0;i<26;i++){ const x=r()*w|0,y=sb+1+(r()*7|0),sk=['#8a5a3c','#c49070','#6a4430','#e0b090'][i%4]; R(g,sk,x,y-5,2,5); R(g,RIO_PAINT[(i*3)%RIO_PAINT.length],x,y-3,2,2); }
  /* kites */ for(let k=0;k<3;k++){ const kx=40+k*80+(r()*20|0),ky=10+(r()*20|0),c=RIO_PAINT[(k*2+v)%RIO_PAINT.length]; poly(g,[[kx,ky-4],[kx+3,ky],[kx,ky+4],[kx-3,ky]],c); g.strokeStyle=rgba('#2a2a2e',.5); g.beginPath(); g.moveTo(kx,ky+4); g.quadraticCurveTo(kx+6,ky+20,kx-4,ky+32); g.stroke(); } }
function rioLandFar3(g,w,h,r,v){ const hz=h*.86; const peak=x=>hz-30-Math.pow(Math.max(0,1-Math.abs((x-(v?190:90))/50)),1.6)*46-pn(x,w,951+v,3,4)*12;
  g.fillStyle='#2a4a3e'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,peak(x)); g.lineTo(w,h); g.fill();
  for(let x=0;x<w;x++){ const y=peak(x); if(pn(x,w,953,9)>.15) for(let k=0;k<10;k++) R(g,mix('#6a6e78','#ff9a6a',.25),x,y+2+k*2,1,1); R(g,rgba('#ff9a6a',.6),x,y,1,1); }
  if(v===0){ const cx=90,top=peak(90); R(g,'#f2e8e0',cx-1,top-8,2,8); R(g,'#f2e8e0',cx-4,top-6,8,1); radial(g,cx,top-4,8,[[0,rgba('#ffe0c0',.5)],[1,rgba('#ffe0c0',0)]]); }
  ridgeP(g,w,h,hz-4,4,4,955+v,'#1f3a30'); R(g,'#1f3a30',0,hz,w,h-hz); vfill(g,0,h*.45,w,h*.55,[[0,rgba('#ffb080',0)],[1,rgba('#ffb080',.35)]]); }
function rioFavelaMid3(g,w,h,r,v){ const top=x=>h-62-pn(x,w,961+v,2)*14-Math.sin(x/w*Math.PI)*16;
  g.fillStyle='#3a5a3a'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill();
  for(let x=0;x<w;x++) if(pn(x,w,962,6)>.2) R(g,'#4a7a42',x,top(x),1,4+(pn(x,w,963,9)*4|0));
  const base=v===1?h-16:h;
  /* terraces of houses following the slope, top row first so lower rows overlap */
  for(let row=0;row<14;row++){ let x=-(r()*6|0);
    while(x<w){ const bw=5+(r()*5|0),bh=6+(r()*3|0); const t=top(Math.max(0,Math.min(w-1,x+bw/2)))+3+row*6.2; const y=Math.round(t); if(y+bh>base){ x+=bw; continue; }
      const raw=r()<.4, c=raw?'#b8643a':RIO_PAINT[(r()*RIO_PAINT.length)|0];
      R(g,c,x,y,bw,bh); if(raw) for(let yy=y+1;yy<y+bh;yy+=2) R(g,'#9a4e2a',x,yy,bw,1); R(g,mix(c,'#000000',.3),x+bw-1,y,1,bh); R(g,mix(c,'#000000',.4),x,y,bw,1);
      if(r()<.35){ R(g,'#2a6ad8',x+1,y-2,2,2); R(g,'#5a8ae8',x+1,y-2,2,1); }
      const lit=r()<.3; R(g,lit?'#ffd890':'#2a2a30',x+1,y+2,1,2); if(bw>6) R(g,r()<.3?'#ffd890':'#2a2a30',x+bw-3,y+2,1,2);
      if(r()<.12){ for(let k=0;k<4;k++) R(g,RIO_PAINT[(k+row)%RIO_PAINT.length],x+bw+k,y+1,1,1); }
      x+=bw; } }
  /* stairs and wires */ g.strokeStyle=rgba('#e8e0d0',.7); g.lineWidth=1; for(let k=0;k<3;k++){ let x=30+k*90; g.beginPath(); g.moveTo(x,base); for(let y=base;y>top(x)+6;y-=6){ x+=(r()<.5?-3:3); g.lineTo(x,y); } g.stroke(); }
  g.strokeStyle=rgba('#1a1a1e',.6); for(let k=0;k<5;k++){ const y=top(0)+20+k*14; g.beginPath(); g.moveTo(0,y); g.quadraticCurveTo(w/2,y+8,w,y); g.stroke(); }
  if(v===1){ /* the mural wall along the street */ R(g,'#f2ece0',0,h-16,w,16); const blocks=[[0,'#f2c230'],[30,'#2a9a5a'],[64,'#e0473a'],[96,'#2a6ad8'],[130,'#f27ab0'],[170,'#7ac0d8'],[204,'#e88a3a'],[236,'#b85ab0']];
    for(const [x,c] of blocks){ ell(g,x+14,h-8,14,9,c); ell(g,x+8,h-10,5,5,mix(c,'#ffffff',.35)); } text(g,'RIO',100,h-14,'#14141c',3); for(let k=0;k<10;k++) R(g,'#14141c',r()*w|0,h-16+(r()*14|0),3,1); } }
function rioNearSea(g,w,h,r,v){ const gb=h-2; R(g,'#f2ece0',0,gb-10,w,10); for(let x=0;x<w;x++) if(Math.sin(x/4)>.35) R(g,'#2a2a2e',x,gb-8,1,6);
  palm(g,30,gb-10,70,r()*99|0); kiosk(g,72,gb-10); palm(g,140,gb-10,62,r()*99|0);
  for(let k=0;k<5;k++){ const x=180+k*6; g.fillStyle=RIO_PAINT[(k*2+v)%RIO_PAINT.length]; g.beginPath(); g.ellipse(x,gb-24,2.4,13,0,0,Math.PI*2); g.fill(); } R(g,'#5a4a3a',176,gb-12,32,2);
  palm(g,232,gb-10,58,r()*99|0); }
function rioNearLand(g,w,h,r,v){ const gb=h-2; R(g,'#e8e2d6',0,gb-22,w,22); for(let k=0;k<8;k++){ const x=k*32+(v*16),c=RIO_PAINT[(k+v)%RIO_PAINT.length]; poly(g,[[x,gb],[x+18,gb-22],[x+34,gb-22],[x+16,gb]],c); ell(g,x+20,gb-12,5,5,mix(c,'#ffffff',.4)); }
  for(let k=0;k<12;k++) R(g,'#14141c',r()*w|0,gb-22+(r()*20|0),4,1); R(g,'#c8c4bc',0,gb-23,w,1);
  palm(g,60,gb-22,60,r()*99|0); palm(g,200,gb-22,54,r()*99|0); R(g,'#1a1a1c',130,gb-70,2,48); R(g,'#1a1a1c',128,gb-72,10,2); R(g,'#ffe0a0',134,gb-71,4,2); }
Object.assign(SCENES.rio,{time:'Day 8 · 17:40',sub:'Sunset over the bay · Sugarloaf · the hills',
  note:'Sunset over the bay: Sugarloaf and its cable car black against an orange sky, the bridge on the horizon, a beach full of umbrellas, volleyball and kites. On the other side, jungle peaks with the statue on top and a hillside of painted and raw-brick houses lighting up for the night.',
  sky:()=>[[[0,'#2e2e78'],[.45,'#a85a9a'],[.75,'#ff8a5a'],[1,'#ffd28a']],{clouds:9,cloudCol:'#ffc0a0',cloudShade:'#b86a8a',seed:73,glow:[.3,1,.5,'rgba(255,200,130,.6)']}],
  light:{amb:[.5,.42,.46],dir:[-.7,.35,.6],dirCol:[1.15,.68,.48]},lamp:.6,horizon:'#ffd28a',top:'#2e2e78',
  ground:{pos:'#2a4a6a',neg:'#4a5a42'},groundY:{pos:-1.7},verge:{pos:'promenade',neg:'city'},
  layers:{pos:[rioSeaFar3,rioBeachMid3,rioNearSea],neg:[rioLandFar3,rioFavelaMid3,rioNearLand]},back:backHills('#3a3a5a','#2e4a40'),
  sun:['#ffd8a0',-.9,.07],swatch:['#2e2e78','#ff8a5a','#2a2a48','#e0473a','#f2c230']});
SCENES.rio.props.push(SPR(48,24,(g,w,h)=>{ R(g,'#f2c230',4,h-14,40,9); R(g,'#2a6ad8',4,h-9,40,2); R(g,'#f2d860',12,h-19,22,5); R(g,'#2a2a36',14,h-18,18,3); ell(g,12,h-4,4,4,'#1a1a1e'); ell(g,36,h-4,4,4,'#1a1a1e'); }),
  SPR(32,40,(g,w,h)=>{ R(g,'#5a4a3a',15,8,1,32); poly(g,[[2,12],[30,12],[16,4]],'#e0473a'); poly(g,[[10,12],[22,12],[16,4]],'#f2ece0'); R(g,'#2a9a5a',8,h-10,16,8); for(let k=0;k<4;k++) ell(g,10+k*4,h-12,2,2,'#5a8a3a'); }));

/* =====================================================================================================
   A ROUTE THAT ADDS UP. Westward from Tokyo at dawn: Japan, Hong Kong, north to Lake Baikal, across Russia
   to London, down through Europe to Naples, under the South Atlantic to Brazil, up through the Americas to
   Las Vegas, under the Pacific and home to Tokyo by night. It is the Meridian 24, "see the world in 24
   hours": the whole loop in one frantic day. No clock on screen, just where you are.
   ===================================================================================================== */
Object.assign(SCENES.atlantic,{name:'South Atlantic tunnel',country:'Under the ocean',sub:'A glass tube from Gibraltar to Brazil',note:'Five and a half thousand kilometres of glass tunnel on the sea floor between Gibraltar and Brazil, run overnight. Whales and shoals drift past in the blue and the cars run on their own lamps. The same kind of tube takes the train under the Pacific on the way home.'});
SCENES.tokyo.time='Day 1 · 06:10';
SCENE_ORDER.splice(0,SCENE_ORDER.length,'japan','hongkong','siberia','london','naples','atlantic','rio','vegas','tokyonight');
