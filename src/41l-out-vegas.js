
/* =====================================================================================================
   LAS VEGAS AT DUSK. Desert side: creosote, yucca and Joshua trees against a burning horizon, leaning
   telegraph poles, a billboard for the King's casino, a pink convertible, a roadside motel under its neon
   arrow, a wedding chapel, and purple mountains. Strip side: the boulevard with lit palms, neon pylons,
   a stretch limo and cabs, and the casinos: the black pyramid and its beam, the glowing orb, towers of
   lit windows, signs in every colour.
   ===================================================================================================== */
const VNEON=['#ff3fa4','#29e0e6','#f5c542','#7cf06a','#ff7a3a','#b06aff'];
function vNeonText(g,s,x,y,c,sc){ for(const [dx,dy,a] of [[-.5,0,.35],[.5,0,.35],[0,-.5,.35],[0,.5,.35]]){ g.globalAlpha=a; text(g,s,x+dx,y+dy,c,sc); } g.globalAlpha=1; text(g,s,x,y,mix(c,'#ffffff',.55),sc); }
function vGlow(g,x,y,r,c,a=.45){ radial(g,x,y,r,[[0,rgba(c,a)],[1,rgba(c,0)]]); }
OK.vegas={
  sky:()=>oSkyTex([[0,'#0a0820'],[.4,'#2a1a4e'],[.7,'#8a3a6a'],[.88,'#e86a5a'],[1,'#f8b070']],{stars:260,seed:81,glow:[.25,1,.55,'rgba(255,170,100,.55)'],cirrus:8,cirrusCol:'#ff9a8a'}),
  pos:{
    far(g,w,h,r){ const base=91; oRange(g,w,h,base,x=>14+opn(x,w,701,3)*8+Math.abs(opn(x,w,702,7))*6,{shade:'#3a2450',lit:'#6a3a6a',haze:'#c86a7a',dark:'#2a1a40'},{seed:41,light:-1,hazeH:16,hazeA:.55,gullies:50});
      for(let x=0;x<w;x+=.5){ R(g,rgba('#ff9a7a',.0),x,0,.5,1); }
      oRange(g,w,h,base,x=>6+opn(x,w,703,5)*4,{shade:'#2a1a3a',lit:'#4a2a4a',haze:'#8a4a6a'},{seed:42,light:-1,hazeH:6,hazeA:.4}); R(g,'#3a2434',0,base,w,h-base); },
    back(g,w,h,r){ const base=94; R(g,'#3a2836',0,base-2,w,h);
      /* pylons marching across the flats, a far town's lights */ for(let x=20;x<w;x+=90){ poly(g,[[x-3,base],[x+3,base],[x+1,base-24],[x-1,base-24]],'#1a1224'); R(g,'#1a1224',x-6,base-22,12,.8); R(g,'#1a1224',x-4,base-18,8,.6); }
      g.strokeStyle='#1a1224'; g.lineWidth=.3; for(let x=20;x<w;x+=90) for(const dy of [-22,-18]){ g.beginPath(); g.moveTo(x-6,base+dy); g.quadraticCurveTo(x+39,base+dy+4,x+84,base+dy); g.stroke(); }
      for(let i=0;i<140;i++){ const x=r()*w; R(g,['#ffd890','#ff9a5a','#fff2c8'][i%3],x,base-2+r()*2,.6,.5); } for(let i=0;i<6;i++){ const x=r()*w; vGlow(g,x,base-3,8,'#ff9a5a',.3); } },
    mid(g,w,h,r){ const base=95; R(g,'#4a3040',0,base-3,w,4);
      /* the motel, its neon arrow; the chapel */ const mx=60; vfill(g,mx,base-14,90,11,[[0,'#d8c8b8'],[1,'#8a7a78']]); R(g,'#2a8a9a',mx,base-15,90,1.6); for(let k=0;k<10;k++){ R(g,'#3a2a3a',mx+3+k*8.8,base-11,4,8); vfill(g,mx+3.6+k*8.8,base-10.4,2.8,3,k%3?[[0,'#ffd890'],[1,'#e8a050']]:[[0,'#3a3a4a'],[1,'#2a2a3a']]); }
      R(g,'#1a1220',mx+96,base-46,1.4,43); vGlow(g,mx+105,base-40,22,'#ff3fa4',.4); R(g,'#0e0a14',mx+92,base-50,26,12); vNeonText(g,'MOTEL',mx+95,base-47,'#ff3fa4',1.2); poly(g,[[mx+92,base-36],[mx+114,base-36],[mx+120,base-32],[mx+114,base-28],[mx+92,base-28]],'#0e0a14'); vNeonText(g,'VACANCY',mx+94,base-34,'#29e0e6',.7);
      const cx=330; vfill(g,cx-14,base-20,28,17,[[0,'#f6eef2'],[1,'#b8a8b8']]); poly(g,[[cx-16,base-20],[cx+16,base-20],[cx,base-31]],'#f2a0b8'); R(g,'#f6eef2',cx-2.4,base-42,4.8,11); R(g,'#f5c542',cx-.6,base-49,1.2,7); R(g,'#f5c542',cx-3,base-47,6,1);
      vGlow(g,cx,base-25,18,'#ff7ab0',.35); R(g,'#0e0a14',cx-26,base-35,52,10); vNeonText(g,'CHAPEL',cx-13,base-32,'#ff7ab0',1.2); vfill(g,cx-4,base-12,8,9,[[0,'#ffe0a0'],[1,'#e09050']]);
      for(let i=0;i<14;i++){ const x=r()*w; if(Math.abs(x-cx)<30||(x>mx-10&&x<mx+125)) continue; oTree(g,x-5,base-3-16,10,16,'joshua',i+50); } },
    verge:()=>PX(256,96,4,(g,w,h)=>{ const r=rng(151);
      vfill(g,0,0,w,h,[[0,'#8a5a4e'],[1,'#a06a56']]); for(let i=0;i<4000;i++) R(g,['#b07a62','#7a4a40','#c8906e','#6a4038'][i%4],r()*w,r()*h,.5+r()*.5,.4+r()*.4);
      for(let i=0;i<50;i++){ const x=r()*w, y=r()*h; ell(g,x,y,2+r()*3,1,rgba('#5a3a36',.5)); ell(g,x-.4,y-.5,1.6,.7,rgba('#7a8a5a',.6)); }
      /* a dirt track, tyre ruts */ vfill(g,0,30,w,16,[[0,'#a87a5e'],[1,'#b8886a']]); for(const y of [33,42]){ R(g,'#8a5e4a',0,y,w,1.4); }
      vfill(g,0,h-15,w,15,[[0,'#6a5a56'],[1,'#5a4a46']]); for(let i=0;i<2400;i++) R(g,['#8a7a72','#4a3a36','#7a6a62','#3a2a26'][i%4],r()*w,h-15+r()*15,.6+r()*.6,.5+r()*.4); }),
    vergeW:12, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#7a4e46'],[1,'#86584c']]); const r=rng(153); for(let i=0;i<500;i++) R(g,['#9a6a56','#6a4038','#a87a62'][i%3],r()*w,r()*h,1,1); for(let i=0;i<30;i++) ell(g,r()*w,r()*h,1.6,.8,'#4a4a36'); },6,153), groundTile:16 },
  neg:{
    far(g,w,h,r){ const base=91; let x=0; while(x<w){ const tw=3+r()*6, th=8+r()*30; vfill(g,x,base-th,tw,th,[[0,'#2a1e40'],[1,'#1a1428']]); for(let y=base-th+1;y<base;y+=1.2) for(let xx=x+.5;xx<x+tw-.5;xx+=1) if(r()<.35) R(g,['#ffd890','#ffb0d0','#9ae8f0'][r()*3|0],xx,y,.5,.5); x+=tw+r()*4; }
      vGlow(g,w*.3,base-10,80,'#ff7ab0',.3); vGlow(g,w*.75,base-6,70,'#f5c542',.25); R(g,'#2a1a34',0,base,w,h-base); },
    back(g,w,h,r){ const base=94;
      /* hotel towers: curved slabs, gold glass, a needle tower */ let x=0; while(x<w){ const tw=10+r()*16, th=30+r()*50, gold=r()<.3; vfill(g,x,base-th,tw,th,gold?[[0,'#a8803a'],[1,'#5a4020']]:[[0,'#3a2e50'],[1,'#1e1830']]);
        for(let y=base-th+2;y<base;y+=1.6) for(let xx=x+1;xx<x+tw-1;xx+=1.4) if(r()<(gold?.25:.45)) R(g,gold?'#ffe8a0':['#ffd890','#fff2c8','#ffb0d0'][r()*3|0],xx,y,.8,.7);
        hfill(g,x,base-th,tw,th,[[0,rgba('#ff9ac0',.12)],[.5,rgba('#000000',0)],[1,rgba('#000000',.3)]]); R(g,VNEON[r()*6|0],x,base-th,tw,.8); x+=tw+2+r()*10; }
      const nx=300; R(g,'#2a2236',nx-1.4,base-80,2.8,80); ell(g,nx,base-80,6,3,'#3a2e4a'); R(g,'#ff3a3a',nx-.4,base-92,.8,10); R(g,'#29e0e6',nx-6,base-80,12,.6); vGlow(g,nx,base-80,14,'#29e0e6',.3); },
    mid(g,w,h,r){ const base=95;
      /* the black pyramid and its beam, the orb, casino fronts with signs */ poly(g,[[20,base],[120,base],[70,base-66]],'#14101e'); poly(g,[[70,base],[120,base],[70,base-66]],'#1e1828'); for(let k=0;k<14;k++) R(g,rgba('#f5c542',.5),36+k*3.6,base-4-k*4.4,68-k*7.2>0?68-k*7.2:1,.4); R(g,'#fff6d8',69,0,2,base-66); vGlow(g,70,base-66,16,'#fff6d8',.5);
      ell(g,190,base-34,26,26,'#2a1a4a'); for(let k=0;k<8;k++){ g.strokeStyle=rgba(VNEON[k%6],.7); g.lineWidth=.8; g.beginPath(); g.ellipse(190,base-34,24-k*2.8,24-k*2.8,0,0,6.28); g.stroke(); } vGlow(g,190,base-34,34,'#b06aff',.35); ell(g,190,base-40,8,5,'#ffd890');
      let x=240, i=0; while(x<w-30){ const bw=40+r()*24, bh=30+r()*30, top=base-bh, c=VNEON[i%6]; vfill(g,x,top,bw,bh,[[0,'#2a1e3e'],[1,'#141022']]); for(let y=top+3;y<base-12;y+=3) for(let xx=x+2;xx<x+bw-2;xx+=2.4) if(r()<.4) R(g,'#ffd890',xx,y,1.2,1.4);
        const s=['CASINO','HOTEL','SLOTS','BUFFET','SHOWS','POKER'][(i+2)%6]; vGlow(g,x+bw/2,top-2,30,c,.4); R(g,'#0a0814',x+bw/2-textW(s,1.4)/2-3,top-8,textW(s,1.4)+6,11); vNeonText(g,s,x+bw/2-textW(s,1.4)/2,top-5,c,1.4);
        for(let k=0;k<12;k++) ell(g,x+3+k*(bw-6)/11,base-11,.8,.8,k%2?'#f5c542':'#fff6d8'); R(g,c,x,base-9,bw,1); x+=bw+6; i++; } },
    verge:()=>PX(256,96,4,(g,w,h)=>{ const r=rng(157);
      /* the boulevard: far pavement, six lanes, a planted median, near pavement, gravel */ R(g,'#3a3440',0,0,w,8); for(let i=0;i<300;i++) R(g,rgba('#ffffff',.06),r()*w,r()*8,.6,.6);
      vfill(g,0,8,w,64,[[0,'#24222c'],[.5,'#2c2a34'],[1,'#24222c']]); for(let i=0;i<3000;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.06),r()*w,8+r()*64,.6,.4);
      for(const y of [18,28,52,62]) for(let x=0;x<w;x+=10) R(g,'#c8c4d0',x,y,5,.5); vfill(g,0,36,w,8,[[0,'#3a4a32'],[1,'#2a3a26']]); R(g,'#c8c4b8',0,36,w,.6); R(g,'#c8c4b8',0,43.4,w,.6);
      for(let i=0;i<40;i++){ const x=r()*w, y=8+r()*64; ell(g,x,y,3+r()*5,.6,rgba(VNEON[i%6],.18)); }
      R(g,'#4a4450',0,72,w,8); vfill(g,0,h-16,w,16,[[0,'#4a4246'],[1,'#3a3236']]); for(let i=0;i<2400;i++) R(g,['#6a6266','#2a2226','#5a5256','#1a1216'][i%4],r()*w,h-16+r()*16,.6+r()*.6,.5+r()*.4); }),
    vergeW:12, vergeTile:32,
    ground:()=>P2(64,64,(g,w,h)=>{ R(g,'#22202a',0,0,w,h); const r=rng(159); for(let i=0;i<60;i++) R(g,rgba(VNEON[i%6],.25),r()*w,r()*h,1,1); },6,159), groundTile:8 }
};
OK.vegas.kit={S:4, ah:288,
  cells:{joshua:[0,0,48,64],creosote:[48,0,32,20],yucca:[80,0,24,24],barrel:[104,0,16,16],tumble:[120,0,16,16],billboard:[136,0,96,32],speed:[232,0,12,20],
    caddy:[48,24,48,14],caddyE:[96,24,16,14],caddyT:[112,24,16,8],motelF:[0,64,96,24],motelE:[96,64,24,24],flatroof:[120,64,16,16],motelSign:[136,32,32,64],chapelF:[168,32,48,40],chapelSign:[216,32,32,32],
    pyl1:[0,88,24,96],pyl2:[24,88,24,96],palmV:[48,88,48,64],limo:[96,88,64,14],limoE:[160,88,16,14],limoT:[176,88,16,8],lampV:[192,88,16,24],arrow:[208,88,48,24],cab:[96,104,40,14],cabE:[136,104,16,14],cabT:[152,104,16,8],
    neonband:[48,152,64,8],pylBase:[112,152,16,16],
    wire:[0,184,4,4],woodpole:[4,184,6,64],blackmetal:[10,184,6,24],dark:[16,184,4,4],white:[20,184,4,4],rock:[24,184,32,24],concrete:[56,184,16,16],drygrass:[72,184,48,20],steel:[120,184,6,24]},
  paint:{
    joshua:(g,x,y,w,h)=>{ oTree(g,x,y,w,h,'joshua',161); g.globalCompositeOperation='source-atop'; vfill(g,x,y,w,h,[[0,rgba('#ff9a7a',.25)],[.4,rgba('#2a1a3a',0)],[1,rgba('#2a1a3a',.35)]]); g.globalCompositeOperation='source-over'; },
    creosote:(g,x,y,w,h)=>oTree(g,x,y,w,h,'shrub',163,{pal:['#3a3a2a','#4a5a36','#6a7a46','#8a8a5a']}),
    yucca:(g,x,y,w,h)=>{ for(let k=0;k<16;k++){ const a=-Math.PI+k*Math.PI/15; g.strokeStyle=k%2?'#5a6a4a':'#7a8a5a'; g.lineWidth=.7; g.beginPath(); g.moveTo(x+w/2,y+h*.8); g.lineTo(x+w/2+Math.cos(a)*w*.45,y+h*.8-Math.abs(Math.sin(a))*h*.75); g.stroke(); } R(g,'#5a4a3a',x+w/2-1,y+h*.8,2,h*.2); },
    barrel:(g,x,y,w,h)=>{ ell(g,x+w/2,y+h*.6,w*.4,h*.38,'#4a6a3a'); for(let k=-2;k<=2;k++) R(g,'#2a4a2a',x+w/2+k*1.4,y+h*.3,.3,h*.6); ell(g,x+w/2,y+h*.25,w*.2,h*.08,'#e8c040'); },
    tumble:(g,x,y,w,h)=>{ const r=rng(165); g.strokeStyle='#8a6a4a'; g.lineWidth=.3; for(let i=0;i<40;i++){ const a=r()*6.28, b=r()*6.28; g.beginPath(); g.moveTo(x+w/2+Math.cos(a)*w*.4,y+h/2+Math.sin(a)*h*.4); g.lineTo(x+w/2+Math.cos(b)*w*.4,y+h/2+Math.sin(b)*h*.4); g.stroke(); } },
    billboard:(g,x,y,w,h)=>{ R(g,'#1a1220',x,y,w,h); vfill(g,x+1,y+1,w-2,h-2,[[0,'#3a1a5a'],[1,'#1a0a2a']]); for(let k=0;k<20;k++) ell(g,x+3+k*4.6,y+2,.8,.8,'#f5c542'); ell(g,x+20,y+h*.55,10,10,'#f5c542'); text(g,'K',x+16,y+h*.38,'#3a1a5a',2.4);
      text(g,"THE KING'S",x+38,y+6,'#f5c542',1.2); text(g,'CASINO',x+42,y+14,'#ff3fa4',1.6); text(g,'LOOSE SLOTS 24H',x+36,y+25,'#29e0e6',.7); },
    speed:(g,x,y,w,h)=>{ R(g,'#3a3a3a',x+w/2-.4,y+h*.5,.8,h*.5); R(g,'#e8e8e4',x+1,y+1,w-2,h*.5); R(g,'#1a1a1a',x+1.5,y+1.5,w-3,h*.5-1); R(g,'#e8e8e4',x+2,y+2,w-4,h*.5-2); text(g,'55',x+2.6,y+5,'#1a1a1a',.8); },
    caddy:(g,x,y,w,h)=>{ const c='#f28ab0'; R(g,c,x+1,y+h*.35,w-2,h*.45); vfill(g,x+1,y+h*.35,w-2,h*.12,[[0,'#ffb8d0'],[1,c]]); poly(g,[[x+w-6,y+h*.35],[x+w-1,y+h*.3],[x+w-1,y+h*.5]],c); R(g,'#e8e8e8',x+1,y+h*.6,w-2,.6); R(g,'#c8d8e8',x+w*.3,y+h*.1,1,h*.25); R(g,'#f2f2ec',x+w*.36,y+h*.22,w*.3,h*.13);
      for(const wx of [.2,.78]){ ell(g,x+w*wx,y+h*.82,h*.17,h*.17,'#1a1a1a'); ell(g,x+w*wx,y+h*.82,h*.1,h*.1,'#e8e8e8'); } },
    caddyE:(g,x,y,w,h)=>{ R(g,'#f28ab0',x+1,y+h*.35,w-2,h*.45); R(g,'#e8e8e8',x+1,y+h*.55,w-2,h*.1); ell(g,x+2.5,y+h*.45,1.2,1.2,'#fff2c0'); ell(g,x+w-2.5,y+h*.45,1.2,1.2,'#fff2c0'); },
    caddyT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#f6ecd8'],[1,'#d8c8b8']]),
    motelF:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#d8c8b8'],[1,'#7a6a6a']]); R(g,'#2a8a9a',x,y,w,2); R(g,'#ff3fa4',x,y+2,w,.5);
      for(let k=0;k<8;k++){ const dx=x+3+k*11.6; R(g,'#3a2a3a',dx,y+h*.3,4.4,h*.7); text(g,String(k+1),dx+1.2,y+h*.38,'#f5c542',.5); vfill(g,dx+5.4,y+h*.35,4.6,h*.35,k%3?[[0,'#ffd890'],[1,'#e8a050']]:[[0,'#3a3a4a'],[1,'#2a2a3a']]); R(g,'#f2ece0',dx+5.4,y+h*.35+h*.17,4.6,.4); } R(g,'#5a4a4a',x,y+h-1.5,w,1.5); },
    motelE:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#d8c8b8'],[1,'#7a6a6a']]); R(g,'#2a8a9a',x,y,w,2); },
    flatroof:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#6a5a5a'],[1,'#4a3a3a']]),
    motelSign:(g,x,y,w,h)=>{ R(g,'#1a1220',x+w/2-1,y+h*.5,2,h*.5); vGlow(g,x+w/2,y+h*.25,w*.6,'#ff3fa4',.35); R(g,'#0e0a14',x+2,y+2,w-4,h*.24); vNeonText(g,'MOTEL',x+4.4,y+4.6,'#ff3fa4',1.0); poly(g,[[x+2,y+h*.3],[x+w-8,y+h*.3],[x+w-1,y+h*.38],[x+w-8,y+h*.46],[x+2,y+h*.46]],'#0e0a14'); vNeonText(g,'VACANCY',x+3.4,y+h*.35,'#29e0e6',.55); for(let k=0;k<6;k++) ell(g,x+4+k*4.4,y+1.4,.7,.7,'#f5c542'); },
    chapelF:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f6eef2'],[1,'#b8a8b8']]); for(let k=0;k<2;k++){ vfill(g,x+6+k*28,y+h*.3,8,h*.4,[[0,'#ffe0b0'],[1,'#e09060']]); ell(g,x+10+k*28,y+h*.3,4,3,'#ffe0b0'); } vfill(g,x+w/2-4,y+h*.45,8,h*.55,[[0,'#ffe0a0'],[1,'#c87040']]); ell(g,x+w/2,y+h*.45,4,3,'#ffe0a0'); vGlow(g,x+w/2,y+h*.2,10,'#ff7ab0',.4); ell(g,x+w/2-2,y+h*.18,2.4,2.4,'#ff7ab0'); ell(g,x+w/2+2,y+h*.18,2.4,2.4,'#ff7ab0'); poly(g,[[x+w/2-4.4,y+h*.2],[x+w/2+4.4,y+h*.2],[x+w/2,y+h*.32]],'#ff7ab0'); },
    chapelSign:(g,x,y,w,h)=>{ vGlow(g,x+w/2,y+h/2,w*.6,'#ff7ab0',.3); R(g,'#0e0a14',x+1,y+h*.3,w-2,h*.36); vNeonText(g,'CHAPEL',x+3.4,y+h*.38,'#ff7ab0',.75); for(let k=0;k<7;k++) ell(g,x+3+k*4.3,y+h*.28,.6,.6,'#f5c542'); },
    pyl1:(g,x,y,w,h)=>vPylon(g,x,y,w,h,0), pyl2:(g,x,y,w,h)=>vPylon(g,x,y,w,h,1),
    palmV:(g,x,y,w,h)=>{ oTree(g,x,y,w,h,'palm',167,{lean:.15,pal:['#14281e','#1e3a28','#3a5a3a']}); g.globalCompositeOperation='source-atop'; vfill(g,x+w*.4,y+h*.3,w*.2,h*.7,[[0,rgba('#ffd890',.0)],[1,rgba('#ffd890',.35)]]); g.globalCompositeOperation='source-over'; },
    limo:(g,x,y,w,h)=>{ R(g,'#f2f2ee',x+1,y+h*.38,w-2,h*.44); vfill(g,x+1,y+h*.38,w-2,h*.12,[[0,'#ffffff'],[1,'#e2e2de']]); R(g,'#e8e8e4',x+w*.15,y+h*.1,w*.65,h*.3); for(let k=0;k<6;k++) vfill(g,x+w*.17+k*w*.1,y+h*.14,w*.08,h*.2,[[0,'#3a3a4a'],[1,'#1a1a2a']]); for(const wx of [.12,.85]){ ell(g,x+w*wx,y+h*.82,h*.17,h*.17,'#1a1a1a'); ell(g,x+w*wx,y+h*.82,h*.09,h*.09,'#d8d8d8'); } },
    limoE:(g,x,y,w,h)=>{ R(g,'#f2f2ee',x+1,y+h*.35,w-2,h*.5); vfill(g,x+2,y+h*.08,w-4,h*.26,[[0,'#3a3a4a'],[1,'#1a1a2a']]); ell(g,x+2.5,y+h*.55,1.2,1.2,'#fff2c0'); ell(g,x+w-2.5,y+h*.55,1.2,1.2,'#fff2c0'); },
    limoT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#f2f2ee'],[1,'#d8d8d4']]),
    lampV:(g,x,y,w,h)=>{ const cx=x+w/2; R(g,'#3a3a40',cx-.5,y+h*.3,1,h*.7); g.strokeStyle='#3a3a40'; g.lineWidth=.6; g.beginPath(); g.moveTo(cx,y+h*.32); g.quadraticCurveTo(cx+4,y+h*.2,cx+6,y+h*.14); g.stroke(); ell(g,cx+6,y+h*.15,2.6,1.2,'#fff2d0'); vGlow(g,cx+6,y+h*.2,6,'#ffd890',.5); },
    arrow:(g,x,y,w,h)=>{ vGlow(g,x+w/2,y+h/2,w*.5,'#29e0e6',.3); poly(g,[[x+2,y+h*.25],[x+w-12,y+h*.25],[x+w-12,y+h*.08],[x+w-1,y+h*.5],[x+w-12,y+h*.92],[x+w-12,y+h*.75],[x+2,y+h*.75]],'#0e0a14'); for(let k=0;k<12;k++) ell(g,x+4+k*3,y+h*.32,.6,.6,'#f5c542'); vNeonText(g,'WEDDINGS',x+5,y+h*.42,'#29e0e6',.75); },
    cab:(g,x,y,w,h)=>{ R(g,'#f2c230',x+1,y+h*.4,w-2,h*.42); poly(g,[[x+w*.22,y+h*.4],[x+w*.3,y+h*.08],[x+w*.7,y+h*.08],[x+w*.78,y+h*.4]],'#f2c230'); vfill(g,x+w*.32,y+h*.12,w*.36,h*.25,[[0,'#3a3a4a'],[1,'#1a1a2a']]); R(g,'#1a1a1a',x+2,y+h*.56,w-4,1); R(g,'#ffffff',x+w*.45,y,w*.1,h*.08); for(const wx of [.2,.8]){ ell(g,x+w*wx,y+h*.84,h*.16,h*.16,'#1a1a1a'); ell(g,x+w*wx,y+h*.84,h*.07,h*.07,'#9a9a9a'); } },
    cabE:(g,x,y,w,h)=>{ R(g,'#f2c230',x+1,y+h*.35,w-2,h*.5); vfill(g,x+2,y+h*.08,w-4,h*.26,[[0,'#3a3a4a'],[1,'#1a1a2a']]); ell(g,x+2.5,y+h*.55,1.2,1.2,'#fff2c0'); ell(g,x+w-2.5,y+h*.55,1.2,1.2,'#fff2c0'); },
    cabT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#ffd040'],[1,'#e2b020']]),
    neonband:(g,x,y,w,h)=>{ R(g,'#0e0a14',x,y,w,h); for(let k=0;k<w;k+=2) ell(g,x+k+1,y+h/2,.7,.7,VNEON[(k/2|0)%6]); },
    pylBase:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#3a2e4a'],[1,'#1e1828']]); for(let k=0;k<h;k+=3) R(g,'#f5c542',x,y+k,w,.4); },
  },
  place(E,side,r,P){
    if(side==='pos'){
      for(let u=14;u<P;u+=48){ E.post(u,6,.24,7.4,'woodpole',{top:true}); E.box(u,5.2,.12,.12,1.6,'woodpole',{y:6.9}); }
      for(let u=14-48;u<P;u+=48) for(const dd of [-.7,0,.7]) E.wire(u,u+48,6+dd,7.05,.9,'wire',.035);
      for(let u=0;u<P;u+=3) E.post(u,4.4,.08,1.1,'woodpole'); for(const yy of [1.0,.6]) E.rail(0,P,4.38,yy,.02,'wire');
      for(let i=0;i<34;i++) E.card(r()*P,5+r()*9,1.8+r(),1.1+r()*.5,'creosote',{n:3,sb:.7});
      for(let i=0;i<12;i++) E.card(r()*P,7+r()*8,3.6,5.4+r()*1.4,'joshua',{n:3,sb:.7});
      for(let i=0;i<14;i++) E.card(r()*P,5+r()*7,1.2,1.2,r()<.5?'yucca':'barrel',{n:2,sb:.8});
      for(let i=0;i<16;i++) E.card(r()*P,6+r()*10,1.6+r()*2,1+r()*1.2,'rock',{n:2,sb:.75});
      for(let i=0;i<6;i++) E.card(r()*P,6+r()*6,.9,.9,'tumble',{n:2});
      { const u=60, d=12; for(const dx of [-3,3]) E.post(u+dx,d+.2,.24,4.6,'woodpole',{top:true}); E.card(u,d,8,2.7,'billboard',{n:1,y:4.2}); E.box(u,d+.3,8.4,.12,.4,'dark',{y:4.1}); }
      E.card(30,6.4,.7,1.5,'speed',{n:1}); E.box(110,10.6,5,1.25,2,{f:'caddy',e:'caddyE',t:'caddyT'},{ao:.6});
      { const u=170, d=15; E.box(u,d,22,3,6,{f:'motelF',e:'motelE',t:'flatroof'}); E.box(u,d-.4,22.6,.4,6.8,{f:'neonband',e:'neonband',t:'flatroof'},{y:3}); E.post(u+13,d-1,.3,6,'blackmetal',{top:true}); E.card(u+13,d-1.2,3,6,'motelSign',{n:2,y:4.6}); E.box(u-6,d-3,4.6,1.3,1.9,{f:'caddy',e:'caddyE',t:'caddyT'},{ao:.6}); }
      { const u=230, d=14; E.box(u,d,5,3.6,6,{f:'chapelF',e:'motelE',t:null}); E.gable(u,d,5,6,3.6,2.2,'white',{ov:.3,gc:'white'}); E.card(u-4,d-1.4,3.2,3.2,'chapelSign',{n:1,y:2}); E.card(u+5,d-1.2,4.4,2.2,'arrow',{n:1,y:2.4}); } }
    else {
      for(let u=0;u<P;u+=16){ E.card(u+8,13.6,4.6,9.5,'palmV',{n:3,sb:.85}); E.card(u,7.9,4.2,8.5,'palmV',{n:3,sb:.85}); }
      for(let u=0;u<P;u+=32){ E.post(u+4,13,.2,8,'blackmetal',{top:true}); E.card(u+4,12.6,1.8,2.6,'lampV',{n:2,y:6.4}); }
      for(let u=20;u<P;u+=60){ E.box(u,15.4,1.6,10,1.6,{f:'pylBase',e:'pylBase',t:'dark'}); E.card(u,15.2,2.4,9.6,(u/60|0)%2?'pyl1':'pyl2',{n:2,y:9}); }
      E.box(90,9.2,9,1.5,1.9,{f:'limo',e:'limoE',t:'limoT'},{ao:.6});
      for(const [u,d] of [[30,10.4],[140,7.6],[200,10.6]]) E.box(u,d,4.4,1.5,1.8,{f:'cab',e:'cabE',t:'cabT'},{ao:.6});
      for(let k=0;k<20;k++) E.card(r()*P,4.6+r()*.6,.9,.4,'drygrass',{n:2,sb:.6}); }
  } };
function vPylon(g,x,y,w,h,k){ R(g,'#141020',x,y,w,h); const c=VNEON[k?1:0], c2=VNEON[k?2:4]; vGlow(g,x+w/2,y+h*.2,w,c,.35); R(g,c,x+1,y+1,w-2,.6); R(g,c,x+1,y+h-1.6,w-2,.6);
  const word=k?'SLOTS':'KING'; for(let i=0;i<word.length;i++) vNeonText(g,word[i],x+w/2-2.2,y+4+i*8,c,1.6); for(let i=0;i<10;i++) ell(g,x+2,y+3+i*(h-6)/9,.6,.6,c2), ell(g,x+w-2,y+3+i*(h-6)/9,.6,.6,c2);
  R(g,'#0a0814',x+2,y+h*.62,w-4,h*.3); vNeonText(g,k?'24H':'LIVE',x+3.4,y+h*.68,c2,.9); for(let j=0;j<3;j++) R(g,VNEON[(j+k)%6],x+3,y+h*.8+j*2.4,w-6,.8); }
OK.vegas.kit.atlas=kitAtlas(OK.vegas.kit);
