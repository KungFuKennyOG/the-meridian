
/* =====================================================================================================
   LONDON IN THE RAIN. River side: the wet embankment walk, a granite parapet with dolphin lamps, plane trees,
   benches, a tour boat and a barge moored below, the bascule bridge, the clock tower, the dome and the glass
   shard over the far bank. Street side: a brick wall, a road with a red double-decker and a black cab, pillar
   and phone boxes, iron railings, and terraced houses with bay windows, coloured doors and chimney pots.
   ===================================================================================================== */
function lonHouse(g,x,y,w,h,o){ const r=rng(o.seed), brick=o.brick, top=y+h*.06;
  oFacade(g,x,y,w,h,{col:brick,brick:true,floors:3,bays:2,roofH:h*.08,shop:false,winW:.48,winH:.62,glass:'#3a4a58',glassTop:'#8aa0b4',frame:'#f2efe6',seed:o.seed,lit:.25,cornice:false});
  R(g,'#e8e2d4',x,y,w,h*.06); R(g,rgba('#000000',.2),x,y+h*.06,w,.6); /* the cornice */
  /* ground floor: a bay window and a front door with a fanlight, white stucco base */
  vfill(g,x,y+h*.62,w,h*.38,[[0,'#f2ede2'],[1,'#c8c0b0']]); const bx=x+w*.06, bw=w*.46, by=y+h*.66, bh=h*.26;
  R(g,'#e8e4dc',bx-.6,by-1,bw+1.2,bh+2); for(let k=0;k<3;k++) vfill(g,bx+k*bw/3+.4,by,bw/3-.8,bh,[[0,o.lit?'#ffe0a0':'#8aa0b4'],[.5,o.lit?'#e8b060':'#3a4a58'],[1,'#2a3440']]); R(g,'#d8d2c4',bx-1,by+bh,bw+2,1.2);
  const dx=x+w*.62, dw=w*.26, dy=y+h*.68, dh=h*.32; R(g,'#e8e4dc',dx-1,dy-4,dw+2,dh+4); ell(g,dx+dw/2,dy-.5,dw/2,3,'#e8e4dc'); ell(g,dx+dw/2,dy-.5,dw/2-1,2.2,'#3a4a58');
  vfill(g,dx,dy,dw,dh,[[0,mix(o.door,'#ffffff',.15)],[1,mix(o.door,'#000000',.3)]]); R(g,rgba('#000000',.25),dx+dw*.15,dy+dh*.12,dw*.7,dh*.32); R(g,rgba('#000000',.25),dx+dw*.15,dy+dh*.52,dw*.7,dh*.32); ell(g,dx+dw*.8,dy+dh*.5,.5,.5,'#d4ad5a'); R(g,'#d4ad5a',dx+dw*.4,dy+dh*.3,dw*.2,.5);
  R(g,'#a8a49c',dx-1.5,y+h-1.5,dw+3,1.5); R(g,'#b8b4ac',dx-1,y+h-2.6,dw+2,1.2);
  vfill(g,x,y+h-3,w,3,[[0,rgba('#000000',0)],[1,rgba('#000000',.35)]]); hfill(g,x+w-1,y,1,h,[[0,rgba('#000000',0)],[1,rgba('#000000',.3)]]); }

OK.london={
  sky:()=>oSkyTex([[0,'#5a6070'],[.5,'#848a96'],[.85,'#a8acb2'],[1,'#b8bcc0']],{clouds:26,cloudCol:'#a4a8b2',cloudShade:'#6a707c',seed:61,haze:'#b4b8bc'}),
  pos:{ midSpec:{yb:-.5}, backSpec:{yb:-.5}, groundK:.5,
    far(g,w,h,r){ const base=89;
      let x=0; while(x<w){ const tw=4+r()*9, th=4+r()*12, c=['#7a7e86','#8a8e94','#6e727a'][r()*3|0]; vfill(g,x,base-th,tw,th,[[0,c],[1,mix(c,'#5a5e66',.4)]]); for(let y=base-th+1;y<base;y+=1.4) if(r()<.5) R(g,rgba('#ffe8b0',.35),x+r()*tw,y,.6,.5); x+=tw+r()*2; }
      /* the clock tower and the long gothic front */ const cx=120; vfill(g,cx-50,base-14,48,14,[[0,'#a89a7a'],[1,'#7a6e58']]); for(let k=0;k<48;k+=2) R(g,rgba('#5a4e3a',.6),cx-50+k,base-14,.4,14); for(let k=0;k<12;k++) poly(g,[[cx-50+k*4,base-14],[cx-48+k*4,base-14],[cx-49+k*4,base-17]],'#8a7e62');
      vfill(g,cx-4,base-44,8,44,[[0,'#b8a684'],[1,'#7e705a']]); for(let y=base-42;y<base;y+=3) R(g,rgba('#5a4e3a',.5),cx-4,y,8,.4); R(g,'#8a7e62',cx-5,base-52,10,8); ell(g,cx,base-48,3,3,'#f2ead0'); R(g,'#2a2a2a',cx-.15,base-50,.3,2); R(g,'#2a2a2a',cx,base-48.2,1.4,.3);
      poly(g,[[cx-5,base-52],[cx+5,base-52],[cx+1,base-66],[cx-1,base-66]],'#5a5e66'); R(g,'#c8b88a',cx-.2,base-70,.4,4);
      /* the dome */ const dx=330; vfill(g,dx-14,base-18,28,18,[[0,'#a8a8a4'],[1,'#7a7a78']]); for(let k=0;k<8;k++) R(g,'#6a6a68',dx-13+k*3.6,base-16,1,12); g.fillStyle=grad(g,dx-12,0,dx+12,0,[[0,'#9aa0a4'],[.35,'#c0c4c4'],[1,'#6a6e72']]); g.beginPath(); g.ellipse(dx,base-18,12,13,0,Math.PI,0); g.fill(); R(g,'#8a8e92',dx-1.5,base-34,3,4); poly(g,[[dx-1.5,base-34],[dx+1.5,base-34],[dx,base-39]],'#c8b88a');
      /* the glass shard and two cranes */ const sx=430; poly(g,[[sx-9,base],[sx+9,base],[sx+1,base-62],[sx-1,base-58]],'#8e9eae'); poly(g,[[sx,base],[sx+9,base],[sx+1,base-62]],'#6e7e90'); for(let k=0;k<14;k++) R(g,rgba('#ffffff',.18),sx-8+k*.55,base-4-k*4,15-k*1.05,.4);
      for(const kx of [210,270]){ R(g,'#c8a030',kx,base-40,.8,40); R(g,'#c8a030',kx-14,base-40,26,.8); R(g,'#3a3a3a',kx+8,base-40,.3,12); }
      oHaze(g,w,base-40,base,'#b4b8bc',.2,.7); R(g,'#6a6e72',0,base,w,2); vfill(g,0,base+2,w,h-base,[[0,'#7a8484'],[1,'#5a6668']]); },
    back(g,w,h,r){ const wl=95;
      /* the twin-towered bascule bridge: approaches on piers, suspension chains to the shore, the high walkway between the towers */
      const L=180, R2=330, deck=wl-12, x0=L-110, x1=R2+110;
      for(const [a,b] of [[x0,L],[R2,x1]]){ R(g,'#4a6a8a',a,deck,b-a,2.2); for(let x=a+12;x<b;x+=26){ vfill(g,x-3,deck+2,6,wl-deck-2,[[0,'#a89e8a'],[1,'#6a6252']]); } }
      R(g,'#4a6a8a',L,deck,R2-L,2.2); R(g,'#3a5a7a',L+(R2-L)/2-.4,deck-1,.8,3.2);
      for(const tx of [L,R2]){ vfill(g,tx-10,deck-38,20,wl-deck+38,[[0,'#cfc4ac'],[1,'#8a8270']]); for(let y=deck-36;y<wl;y+=3) R(g,rgba('#6a6050',.35),tx-10,y,20,.4); poly(g,[[tx-11,deck-38],[tx+11,deck-38],[tx+8,deck-44],[tx+4,deck-50],[tx,deck-45],[tx-4,deck-50],[tx-8,deck-44]],'#5a6a7a');
        for(const dx of [-6,6]){ R(g,'#4a5a6e',tx+dx-1.4,deck-31,2.8,6); ell(g,tx+dx,deck-31,1.4,1.4,'#4a5a6e'); R(g,'#5a6a7e',tx+dx-1.6,deck-44,3.2,6); poly(g,[[tx+dx-2,deck-44],[tx+dx+2,deck-44],[tx+dx,deck-49]],'#5a6a7a'); } R(g,'#3a4a5e',tx-3,deck-12,6,9); vfill(g,tx-11,wl-6,22,6,[[0,'#8a8270'],[1,'#5a5444']]); }
      g.strokeStyle='#4a6a8a'; g.lineWidth=1.2; for(const [ax,bx] of [[L-10,x0+8],[R2+10,x1-8]]){ g.beginPath(); g.moveTo(ax,deck-30); g.quadraticCurveTo((ax+bx)/2,deck-2,bx,deck-4); g.stroke(); for(let k=1;k<8;k++){ const t=k/8, cx=ax+(bx-ax)*t, cy=(1-t)*(1-t)*(deck-30)+2*t*(1-t)*(deck-2)+t*t*(deck-4); R(g,'#4a6a8a',cx-.2,cy,.4,deck-cy); } }
      R(g,'#4a6a8a',L+10,deck-30,R2-L-20,2); R(g,'#4a6a8a',L+10,deck-25,R2-L-20,1.2); g.strokeStyle='#5a7a9a'; g.lineWidth=.4; for(let x=L+10;x<R2-10;x+=5){ g.beginPath(); g.moveTo(x,deck-28); g.lineTo(x+5,deck-25); g.moveTo(x+5,deck-28); g.lineTo(x,deck-25); g.stroke(); }
      R(g,'#c8202a',240,deck-4,9,4); R(g,'#f2ece0',241,deck-3.6,7,1); R(g,'#1a1a1a',275,deck-2.4,4,2.4);
      for(let i=0;i<30;i++) ell(g,r()*w,wl-.5,3+r()*6,.3,rgba('#c8d0d8',.4)); oHaze(g,w,0,wl,'#b4b8bc',.35,.15); },
    mid(g,w,h,r){ const wl=96;
      /* a red lightship, a police launch, a buoy */ poly(g,[[60,wl-5],[110,wl-5],[106,wl],[64,wl]],'#c8202a'); text(g,'NORE',76,wl-4,'#f2f2ec',.7); R(g,'#e8e4dc',80,wl-9,14,4); R(g,'#3a3a3a',86,wl-24,.8,15); ell(g,86.4,wl-24,2.4,2.4,'#c8202a');
      poly(g,[[300,wl-3],[330,wl-3],[334,wl-5],[300,wl-5]],'#1a2a4a'); R(g,'#f2f2ec',306,wl-8,14,3); R(g,'#2a5ad8',300,wl-4.5,34,.6); R(g,'#3a6af8',312,wl-9.2,2,1.2);
      ell(g,200,wl-1.5,1.8,2,'#e8b020'); for(let i=0;i<50;i++) ell(g,r()*w,wl-.4,2+r()*5,.3,rgba('#c8d0d8',.45)); },
    verge:()=>PX(256,64,4,(g,w,h)=>{ const r=rng(83);
      /* wet york-stone flags with sky in the puddles */ for(let y=0;y<h-15;y+=7) for(let x=((y/7)%2)*5;x<w;x+=10){ const c=mix('#8a8680','#6e6a66',r()); vfill(g,x+.2,y+.2,9.6,6.6,[[0,mix(c,'#ffffff',.06)],[1,c]]); }
      for(let i=0;i<30;i++){ const x=r()*w, y=r()*(h-18); ell(g,x,y,3+r()*6,.8+r()*1.4,rgba('#a8b0bc',.55)); ell(g,x-1,y-.3,2+r()*3,.4,rgba('#d8dce0',.5)); }
      vfill(g,0,h-15,w,15,[[0,'#6a6660'],[1,'#5a5650']]); for(let i=0;i<2400;i++) R(g,['#8a867e','#4a4640','#7a766e','#3a3630'][i%4],r()*w,h-15+r()*15,.6+r()*.6,.5+r()*.4); }),
    vergeW:8, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#5a6a6a'],[.5,'#526262'],[1,'#5a6a6a']]); const r=rng(85); for(let i=0;i<240;i++){ const x=r()*w, y=r()*h, L=2+r()*6; ell(g,x,y,L,.35,rgba('#a8b4b8',.35)); ell(g,x+1,y+.8,L*.8,.3,rgba('#2a3a3a',.4)); } },0,85), groundTile:14 },
  neg:{
    far(g,w,h,r){ const base=91; let x=0; while(x<w){ const tw=4+r()*10, th=6+r()*20, c=['#7a7e88','#8a8e96','#6a6e78','#9498a0'][r()*4|0]; vfill(g,x,base-th,tw,th,[[0,c],[1,mix(c,'#4a4e58',.3)]]); for(let y=base-th+1;y<base;y+=1.4) R(g,rgba('#3a3e48',.25),x,y,tw,.4); x+=tw+r()*3; }
      for(const kx of [100,380]){ R(g,'#b89a30',kx,base-36,.8,36); R(g,'#b89a30',kx-16,base-36,28,.8); } oHaze(g,w,base-30,base,'#b4b8bc',.2,.65); R(g,'#7a7e84',0,base,w,h-base); },
    back(g,w,h,r){ const base=94; let x=0; while(x<w){ const tw=8+r()*16, th=14+r()*36, c=['#8a8e96','#9a9ea4','#7a7e88','#a8a49c'][r()*4|0];
        vfill(g,x,base-th,tw,th,[[0,mix(c,'#ffffff',.08)],[1,mix(c,'#3a3e48',.3)]]); for(let y=base-th+2;y<base;y+=2) for(let xx=x+1;xx<x+tw-1;xx+=2) R(g,r()<.12?'#ffe0a0':rgba('#2a2e38',.45),xx,y,1.2,1); x+=tw+1+r()*4; }
      /* a church spire and a gasholder frame */ poly(g,[[200,base-30],[206,base-30],[203,base-58]],'#6a6e78'); R(g,'#7a7e88',198,base-30,10,30);
      for(let k=0;k<6;k++) R(g,'#5a6068',340+k*6,base-22,.8,22); for(const y of [base-22,base-14,base-7]) R(g,'#5a6068',340,y,30,.8); oHaze(g,w,0,base,'#b4b8bc',.35,.15); },
    mid(g,w,h,r){ const base=95; let x=0, i=0;
      while(x<w){ const bw=9+r()*4, bh=26+r()*4, top=base-bh, br=['#8a4a36','#9a5a40','#7a4232','#a8603e','#6a3a2a'][r()*5|0];
        vfill(g,x,top,bw,bh,[[0,mix(br,'#ffffff',.08)],[1,mix(br,'#000000',.25)]]); for(let y=top;y<base;y+=1.2) R(g,rgba('#000000',.08),x,y,bw,.3);
        poly(g,[[x-.5,top],[x+bw+.5,top],[x+bw-2,top-5],[x+2,top-5]],'#4a4e58'); R(g,'#7a4232',x+1,top-8,3,4); for(let k=0;k<3;k++) R(g,'#c8643a',x+1.2+k,top-9,.6,1.2);
        for(const [yy,lit] of [[top+5,.3],[top+13,.3]]) for(const xx of [x+1.5,x+bw-4.5]){ R(g,'#f2ece0',xx-.5,yy-.5,4,6); vfill(g,xx,yy,3,5,r()<lit?[[0,'#ffe0a0'],[1,'#e0a050']]:[[0,'#8a9aa8'],[1,'#3a4a58']]); }
        R(g,'#f2ece0',x,top+bh*.66,bw,bh*.34); R(g,['#1a2a5a','#2a5a3a','#8a1a2a','#1a1a1a','#f2c230'][r()*5|0],x+bw*.6,base-7,2.6,7); x+=bw; i++; } },
    verge:()=>PX(256,88,4,(g,w,h)=>{ const r=rng(89);
      /* far pavement, the road (wet, with a bus lane in red), near pavement, a grass strip, the ballast */
      for(let y=0;y<10;y+=4) for(let x=(y/4%2)*4;x<w;x+=8) vfill(g,x+.2,y+.2,7.6,3.6,[[0,'#9a968e'],[1,'#86827a']]); R(g,'#b8b4aa',0,10,w,1.2);
      vfill(g,0,11.2,w,34,[[0,'#3e3e42'],[.5,'#4a4a4e'],[1,'#3e3e42']]); vfill(g,0,11.2,w,12,[[0,'#7a3a34'],[1,'#6a3430']]); for(let i=0;i<2600;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.07),r()*w,11.2+r()*34,.6,.4);
      R(g,'#e8e4d4',0,23,w,.6); for(let x=0;x<w;x+=12) R(g,'#e8e4d4',x,34,6,.6); R(g,'#f2c230',0,44,w,.5); R(g,'#f2c230',0,44.9,w,.5);
      for(let i=0;i<24;i++){ const x=r()*w, y=12+r()*32; ell(g,x,y,3+r()*7,.8+r()*1.2,rgba('#8a96a4',.45)); }
      R(g,'#b8b4aa',0,45.4,w,1.2); for(let y=46.6;y<58;y+=4) for(let x=(y%8<4?0:4);x<w;x+=8) vfill(g,x+.2,y+.2,7.6,3.6,[[0,'#9a968e'],[1,'#86827a']]);
      vfill(g,0,58,w,14,[[0,'#5a7a42'],[1,'#4a6a38']]); for(let i=0;i<900;i++) R(g,['#6a8a4a','#3e5e2e','#7a9a52'][i%3],r()*w,58+r()*14,.5,1);
      vfill(g,0,h-16,w,16,[[0,'#6a6660'],[1,'#5a5650']]); for(let i=0;i<2400;i++) R(g,['#8a867e','#4a4640','#7a766e','#3a3630'][i%4],r()*w,h-16+r()*16,.6+r()*.6,.5+r()*.4); }),
    rail:{cab:false},
    vergeW:11, vergeTile:32,
    ground:()=>P2(64,64,(g,w,h)=>{ R(g,'#4a4a4e',0,0,w,h); const r=rng(91); for(let i=0;i<200;i++) R(g,rgba('#ffffff',.06),r()*w,r()*h,1,1); },6,91), groundTile:8 }
};
OK.london.kit={S:4, ah:320,
  cells:{hA:[0,0,40,52],hB:[40,0,40,52],hC:[80,0,40,52],hD:[120,0,40,52],slate:[160,0,32,32],brick:[192,0,32,32],chim:[224,0,16,16],pots:[240,0,16,8],pub:[160,32,64,40],stucco:[224,16,16,16],
    bus:[0,52,96,40],busE:[96,52,24,40],busT:[120,52,16,16],cab:[0,92,40,16],cabE:[40,92,16,16],cabT:[56,92,16,8],phone:[136,52,16,40],phoneT:[152,52,8,8],pillar:[152,60,12,20],lampL:[164,72,16,24],lampD:[180,72,16,24],
    plane:[0,108,64,64],parapet:[64,108,64,12],bench:[64,120,24,10],railing:[88,120,48,12],poster:[136,96,48,24],coping:[184,96,32,8],granite:[216,96,32,16],
    tourH:[64,132,128,16],tourD:[64,148,128,20],barge:[192,120,64,16],
    wire:[0,176,4,4],blackmetal:[4,176,6,24],dark:[10,176,4,4],white:[14,176,4,4],concrete:[18,176,16,16],shrub:[34,176,32,24],tufts:[66,176,48,20],steel:[114,176,6,24]},
  paint:{
    hA:(g,x,y,w,h)=>lonHouse(g,x,y,w,h,{seed:1,brick:'#8a4a36',door:'#1a2a5a',lit:true}),
    hB:(g,x,y,w,h)=>lonHouse(g,x,y,w,h,{seed:2,brick:'#a06a48',door:'#8a1a2a'}),
    hC:(g,x,y,w,h)=>lonHouse(g,x,y,w,h,{seed:3,brick:'#7a4a3a',door:'#2a5a3a',lit:true}),
    hD:(g,x,y,w,h)=>lonHouse(g,x,y,w,h,{seed:4,brick:'#b8a284',door:'#f2c230'}),
    slate:(g,x,y,w,h)=>{ oRoofTiles(g,x,y,w,h,'#4a4e5a',{rows:10,pitch:2.4}); const r=rng(9); for(let i=0;i<30;i++) ell(g,x+r()*w,y+r()*h,1+r()*3,.3,rgba('#a8b0c0',.3)); },
    brick:(g,x,y,w,h)=>oFacade(g,x,y,w,h,{col:'#8a4a36',brick:true,floors:0,bays:1,cornice:false}),
    chim:(g,x,y,w,h)=>{ oFacade(g,x,y,w,h,{col:'#7a4232',brick:true,floors:0,bays:1,cornice:false}); R(g,'#d8d2c4',x,y,w,1.5); },
    pots:(g,x,y,w,h)=>{ for(let k=0;k<4;k++){ hfill(g,x+1+k*3.8,y+1,2.6,h-1,[[0,'#8a3a1a'],[.4,'#d86a3a'],[1,'#7a2a10']]); R(g,'#5a2a1a',x+.8+k*3.8,y+1,3,.8); } },
    stucco:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#f2ede2'],[1,'#c8c0b0']]),
    pub:(g,x,y,w,h)=>{ oFacade(g,x,y,w,h,{col:'#8a4a36',brick:true,floors:1,bays:3,roofH:3,shop:true,shopH:.45,shopCol:'#1e3a2a',shopGlow:'#f2c880',sign:['THE ANCHOR','#1e3a2a','#d4ad5a'],signS:.7,glass:'#3a4a58',frame:'#f2efe6',seed:5,lit:.5}); for(let k=0;k<4;k++) R(g,'#d4ad5a',x+2+k*w/4,y+h*.56,.6,h*.44); for(const k of [.2,.8]){ R(g,'#2a2a2a',x+w*k,y+h*.48,.4,2); ell(g,x+w*k,y+h*.48+3,2.4,1.6,'#c8402a'); ell(g,x+w*k,y+h*.48+2.4,1.6,1,'#5aa83a'); } },
    bus:(g,x,y,w,h)=>{ /* red double-decker */ vfill(g,x,y,w,h,[[0,'#d82a24'],[.5,'#c01e1a'],[1,'#8a1410']]); R(g,'#f2ece0',x,y+h*.47,w,h*.04);
      for(let k=0;k<8;k++){ vfill(g,x+4+k*11.3,y+h*.1,9.6,h*.28,[[0,'#a8bccc'],[.6,'#4a5a6a'],[1,'#2a3440']]); vfill(g,x+4+k*11.3,y+h*.55,9.6,h*.24,[[0,'#a8bccc'],[.6,'#4a5a6a'],[1,'#2a3440']]); R(g,rgba('#ffffff',.18),x+5+k*11.3,y+h*.11,2,h*.26); }
      R(g,'#f2ece0',x+30,y+h*.4,40,h*.06); text(g,'MERIDIAN TOURS',x+33,y+h*.405,'#c01e1a',.55); R(g,'#2a2a2e',x+8,y+h*.55,8,h*.35); R(g,'#1a1a1a',x,y+h*.88,w,h*.12);
      for(const wx of [.14,.8]){ ell(g,x+w*wx,y+h*.92,4,4,'#1a1a1a'); ell(g,x+w*wx,y+h*.92,1.8,1.8,'#8a8a8a'); } },
    busE:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#d82a24'],[1,'#8a1410']]); vfill(g,x+2,y+h*.08,w-4,h*.28,[[0,'#a8bccc'],[1,'#2a3440']]); vfill(g,x+2,y+h*.54,w-4,h*.26,[[0,'#a8bccc'],[1,'#2a3440']]); R(g,'#1a1a1a',x+3,y+h*.42,w-6,h*.08); text(g,'24',x+w/2-3,y+h*.43,'#f2c230',.6); R(g,'#f2f0d0',x+2,y+h*.84,3,2); R(g,'#f2f0d0',x+w-5,y+h*.84,3,2); },
    busT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#c01e1a'],[1,'#a81a16']]),
    cab:(g,x,y,w,h)=>{ R(g,'#1a1a1e',x+1,y+h*.4,w-2,h*.42); vfill(g,x+1,y+h*.4,w-2,h*.12,[[0,'#4a4a50'],[1,'#1a1a1e']]); g.fillStyle='#1a1a1e'; g.beginPath(); g.moveTo(x+w*.18,y+h*.42); g.quadraticCurveTo(x+w*.24,y+h*.02,x+w*.5,y+h*.02); g.lineTo(x+w*.78,y+h*.04); g.lineTo(x+w*.82,y+h*.42); g.fill();
      vfill(g,x+w*.28,y+h*.1,w*.2,h*.28,[[0,'#8aa0b4'],[1,'#2a3440']]); vfill(g,x+w*.52,y+h*.1,w*.24,h*.28,[[0,'#8aa0b4'],[1,'#2a3440']]); R(g,'#f2c230',x+w*.5,y,w*.1,h*.06); R(g,rgba('#ffffff',.25),x+2,y+h*.45,w-4,.4);
      for(const wx of [.2,.8]){ ell(g,x+w*wx,y+h*.84,h*.16,h*.16,'#0a0a0a'); ell(g,x+w*wx,y+h*.84,h*.07,h*.07,'#9a9a9a'); } },
    cabE:(g,x,y,w,h)=>{ R(g,'#1a1a1e',x+1,y+h*.35,w-2,h*.5); vfill(g,x+2,y+h*.08,w-4,h*.26,[[0,'#8aa0b4'],[1,'#2a3440']]); R(g,'#c8c8c4',x+3,y+h*.55,w-6,h*.12); ell(g,x+2.5,y+h*.5,1.2,1.2,'#f2f0d0'); ell(g,x+w-2.5,y+h*.5,1.2,1.2,'#f2f0d0'); },
    cabT:(g,x,y,w,h)=>R(g,'#1e1e22',x,y,w,h),
    phone:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#e02a24'],[1,'#a01a16']]); R(g,'#c01e1a',x,y,w,3); R(g,'#1a1a1a',x+2,y+3.5,w-4,2); text(g,'PHONE',x+2.3,y+3.8,'#f2f2ec',.4);
      for(let r_=0;r_<6;r_++) for(let c=0;c<3;c++) vfill(g,x+2+c*4,y+7+r_*4.6,3.4,4,[[0,'#c8d8e0'],[1,'#5a6a78']]); R(g,'#a01a16',x+1,y+h-3,w-2,3); },
    phoneT:(g,x,y,w,h)=>R(g,'#c01e1a',x,y,w,h),
    pillar:(g,x,y,w,h)=>{ hfill(g,x+2,y+4,w-4,h-5,[[0,'#a01a16'],[.4,'#e02a24'],[1,'#8a1410']]); ell(g,x+w/2,y+4,w/2-1.5,3,'#c01e1a'); R(g,'#1a1a1a',x+3.5,y+7,w-7,1); R(g,'#f2c230',x+4,y+9.5,w-8,.6); R(g,'#1a1a1a',x+1.5,y+h-1.5,w-3,1.5); },
    lampL:(g,x,y,w,h)=>{ const cx=x+w/2; R(g,'#1a1a1c',cx-.5,y+h*.5,1,h*.5); for(const dx of [-1,1]){ g.strokeStyle='#1a1a1c'; g.lineWidth=.7; g.beginPath(); g.moveTo(cx,y+h*.55); g.quadraticCurveTo(cx+dx*5,y+h*.5,cx+dx*5,y+h*.36); g.stroke(); ell(g,cx+dx*5,y+h*.28,2.6,3,'#fff2c8'); ell(g,cx+dx*5,y+h*.28,1.6,2,'#ffffff'); R(g,'#1a1a1c',cx+dx*5-1.6,y+h*.17,3.2,1); } R(g,'#d4ad5a',cx-.5,y+h*.1,1,2); },
    lampD:(g,x,y,w,h)=>{ const cx=x+w/2; R(g,'#1a1a1c',cx-.6,y+h*.3,1.2,h*.7); ell(g,cx,y+h*.92,2.4,1.4,'#1a1a1c'); for(let k=0;k<5;k++) R(g,'#2a2a2e',cx-1+k*.5,y+h*.6,.3,h*.3); vfill(g,cx-2.6,y+h*.06,5.2,h*.2,[[0,'#fff6d8'],[1,'#e8c880']]); R(g,'#1a1a1c',cx-3.2,y+h*.04,6.4,1.2); R(g,'#1a1a1c',cx-2.6,y+h*.26,5.2,1); },
    plane:(g,x,y,w,h)=>{ oTree(g,x,y,w,h,'round',93,{pal:['#2e4a26','#46663a','#6a8a4a','#90aa66'],n:38,bark:['#a8a090','#6a6658','#5a5448']}); const r=rng(95); for(let i=0;i<10;i++) ell(g,x+w/2+(r()-.5)*w*.08,y+h*.72+r()*h*.25,w*.02,h*.02,'#d8d0b8'); },
    parapet:(g,x,y,w,h)=>{ oStone(g,x,y,w,h,'#a8a49a',{blocks:4,seed:11}); R(g,'#c8c4ba',x,y,w,1.5); },
    coping:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#c8c4ba'],[1,'#8a8680']]),
    granite:(g,x,y,w,h)=>oStone(g,x,y,w,h,'#7a7670',{blocks:5,seed:13}),
    bench:(g,x,y,w,h)=>{ oPlanks(g,x,y,w,h*.6,'#6a4a2e',{n:3}); R(g,'#1a1a1c',x+1,y+h*.6,1.4,h*.4); R(g,'#1a1a1c',x+w-2.4,y+h*.6,1.4,h*.4); },
    railing:(g,x,y,w,h)=>{ R(g,'#1a1a1c',x,y+1.5,w,.8); R(g,'#1a1a1c',x,y+h-2,w,.8); for(let k=0;k<w;k+=1.6){ R(g,'#1a1a1c',x+k,y+1,.5,h-1); poly(g,[[x+k-.4,y+1.2],[x+k+.9,y+1.2],[x+k+.25,y]],'#d4ad5a'); } },
    poster:(g,x,y,w,h)=>{ R(g,'#2a2a2e',x,y,w,h); vfill(g,x+1,y+1,w-2,h-2,[[0,'#2a5a9a'],[1,'#1a3a6a']]); text(g,'SEE THE WORLD',x+4,y+4,'#f2c230',.8); text(g,'IN 24 HOURS',x+6,y+10,'#ffffff',.8); ell(g,x+w-8,y+h*.5,5,5,'#f2c230'); },
    tourH:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#1a2a4a'],[1,'#0e1a30']]); R(g,'#f2f2ec',x,y,w,2); R(g,'#c8202a',x,y+h-3,w,1.2); for(let k=6;k<w-6;k+=8) ell(g,x+k,y+h*.45,1,1,'#c8d0d8'); },
    tourD:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f6f6f0'],[1,'#d8d8d0']]); for(let k=0;k<14;k++) vfill(g,x+3+k*8.9,y+h*.15,7.4,h*.55,[[0,'#a8c4d4'],[1,'#3a4a58']]); text(g,'RIVER MERIDIAN',x+42,y+h*.78,'#1a2a4a',.6); },
    barge:(g,x,y,w,h)=>{ poly(g,[[x+2,y+h*.3],[x+w-2,y+h*.3],[x+w-6,y+h],[x+6,y+h]],'#2a2a2e'); R(g,'#c8402a',x+2,y+h*.3,w-4,1.2); for(let k=0;k<4;k++){ poly(g,[[x+8+k*12,y+h*.3],[x+18+k*12,y+h*.3],[x+15+k*12,y],[x+11+k*12,y]],'#5a5048'); } R(g,'#f2f2ec',x+w-10,y,6,h*.3); },
  },
  place(E,side,r,P){
    if(side==='pos'){
      /* the embankment: granite wall into the river, parapet, dolphin lamps, plane trees, benches */
      E.rail(0,P,11.8,-.32,.32,'granite'); E.box(P/2,11.2,P,1.05,.6,{f:'parapet',e:'parapet',t:'coping'},{ao:.65});
      for(let u=8;u<P;u+=16){ E.box(u,11.1,.8,1.3,.8,{f:'granite',e:'granite',t:'coping'}); E.card(u,11.5,1.2,3.6,'lampD',{n:2,y:1.3}); }
      for(let u=0;u<P;u+=22){ E.card(u+11,7.6,6,8.4,'plane',{n:3,sb:.7}); E.box(u+11,7.15,1.4,.12,1.4,{f:'railing',e:'railing',t:'concrete'}); }
      for(let u=4;u<P;u+=33){ E.box(u,9.9,1.8,.45,.5,{f:'bench',e:'bench',t:'bench'}); E.box(u,10.35,1.8,.5,.08,{f:'bench',e:'bench',t:null},{y:.45}); }
      E.box(60,8.6,1,2.6,1,{f:'phone',e:'phone',t:'phoneT'}); E.card(140,8.3,.6,1.1,'pillar',{n:2});
      { const u=110, d=14.5; E.box(u,d,30,1.6,5.6,{f:'tourH',e:'tourH',t:'concrete'},{y:-.6,ao:.85}); E.box(u+2,d+.5,22,2,4.6,{f:'tourD',e:'tourD',t:'white'},{y:1}); }
      E.card(190,16,12,2.6,'barge',{n:1,y:-.6}); E.card(30,17,10,2.2,'barge',{n:1,y:-.6}); }
    else {
      E.box(P/2,4.5,P,1,.3,{f:'brick',e:null,t:'coping'},{ao:.6});
      for(let u=0;u<P;u+=30){ E.post(u,7.1,.14,5,'blackmetal',{top:true}); E.card(u,7.1,1.2,2.4,'lampL',{n:2,y:3.4}); }
      E.box(70,8.6,11,4.3,2.5,{f:'bus',e:'busE',t:'busT'},{y:.1,ao:.7}); E.box(170,11.2,10.5,4.3,2.5,{f:'bus',e:'busE',t:'busT'},{y:.1,ao:.7});
      for(const [u,d] of [[30,10.4],[124,8.4],[210,10.6]]) E.box(u,d,4.4,1.7,1.8,{f:'cab',e:'cabE',t:'cabT'},{ao:.6});
      E.box(96,12.5,1,2.6,1,{f:'phone',e:'phone',t:'phoneT'}); E.card(150,12.6,.6,1.1,'pillar',{n:2}); E.card(40,12.7,4,2,'poster',{n:1,y:.3});
      for(let u=0;u<P;u+=40) E.card(u+18,6.9,6,8.5,'plane',{n:3,sb:.7});
      /* the terraces: railings, houses in a row, slate roofs, chimney stacks; a pub on the corner */
      E.card(P/2,13.4,P,.9,'railing',{n:1});
      let u=0, i=0; const H=['hA','hB','hC','hD'];
      while(u<P-5){ if(i%9===8){ u+=6; i++; continue; } /* a side street */
        const pub=i%9===0, w=pub?8:5, d=14.4, cu=u+w/2;
        E.box(cu,d,w,pub?6.5:7.6,9,{f:pub?'pub':H[(r()*4)|0],e:'brick',t:null}); E.gable(cu,d,w,9,pub?6.5:7.6,2.4,'slate',{ov:.15,gc:'brick'});
        if(i%2===0){ E.box(cu+w/2,d+3.5,1,1.6,1.6,{f:'chim',e:'chim',t:'chim'},{y:8.6}); E.card(cu+w/2,d+4.3,1,.5,'pots',{n:2,y:10.2}); }
        u+=w; i++; }
      for(let k=0;k<20;k++) E.card(r()*P,5.2+r()*.6,.8,.4,'tufts',{n:2,sb:.7}); }
  } };
OK.london.kit.atlas=kitAtlas(OK.london.kit);
