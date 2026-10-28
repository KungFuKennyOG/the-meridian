
/* =====================================================================================================
   RIO AT SUNSET. Beach side: the black-and-white wave promenade, kiosks with thatch-coloured roofs, palms,
   a coconut stall, tall lamps coming on, a wide sand beach full of umbrellas, a lifeguard post and a
   volleyball net, surf, boats, kites, and Sugarloaf with its cable car black against the orange sky.
   City side: the avenue with yellow cabs and a bus, a mural wall, apartment towers with balconies, a
   hillside of painted and raw-brick houses lighting up, jungle peaks and the statue on top.
   ===================================================================================================== */
OK.rio={
  sky:()=>oSkyTex([[0,'#2a2a70'],[.42,'#9a5a9a'],[.7,'#ff8a5a'],[.9,'#ffc880'],[1,'#ffe0a0']],{clouds:12,cloudCol:'#ffc8a8',cloudShade:'#a85a7a',seed:73,glow:[.3,1,.45,'rgba(255,210,140,.65)'],cirrus:10,cirrusCol:'#ffd8b8'}),
  pos:{ midSpec:{yb:-.5}, backSpec:{yb:-.5}, groundK:.5,
    far(g,w,h,r){ const base=89;
      /* Sugarloaf and the smaller dome, rim-lit; the cable car between them */
      const dome=(x,cx,bw,ht)=>{ let d=((x-cx)%w+w)%w; if(d>w/2) d-=w; const t=d/(bw/2); return Math.abs(t)<1?ht*Math.pow(1-t*t,.55)*(1-.18*t):0; };
      const prof=x=>Math.max(dome(x,120,50,22),dome(x,190,40,46),dome(x,330,90,10),dome(x,420,60,16));
      oRange(g,w,h,base,prof,{shade:'#3a3a58',lit:'#6a5470',haze:'#d88a80',dark:'#2a2c48'},{seed:31,light:-1,hazeH:22,hazeA:.7,gullies:30});
      for(let x=0;x<w;x+=.5){ const p=prof(x), d=prof(x+1)-prof(x-1); if(p>2&&d<0) R(g,rgba('#ff9a6a',.85),x,base-p,.6,1.4); }
      g.strokeStyle='#14141c'; g.lineWidth=.35; g.beginPath(); g.moveTo(122,base-22); g.lineTo(187,base-45); g.stroke(); g.beginPath(); g.moveTo(122,base-21.4); g.lineTo(187,base-44.4); g.stroke(); R(g,'#c8202a',150,base-33,2.4,1.6); R(g,'#c8202a',170,base-40,2.4,1.6);
      for(let x=182;x<200;x+=3) R(g,'#ffd890',x,base-45+Math.abs(x-191)*.6,.6,.6);
      vfill(g,0,base,w,h-base,[[0,'#f2a070'],[.15,'#6a6a8a'],[1,'#2a3a5a']]); for(let i=0;i<160;i++){ const x=r()*w,y=base+1+r()*(h-base-1); ell(g,x,y,1+r()*3,.25,rgba(x>60&&x<200?'#ffc890':'#ffffff',.5)); } },
    back(g,w,h,r){ const wl=95;
      oRange(g,w,h,wl,x=>{ let d=((x-300)%w+w)%w; if(d>w/2) d-=w; return Math.abs(d)<60?10*Math.pow(1-Math.abs(d)/60,.8):0; },{shade:'#2a3a3e',lit:'#4a4a5a',haze:'#b07a80'},{seed:33,light:-1,hazeH:10,hazeA:.5});
      for(let i=0;i<8;i++){ const x=r()*w; poly(g,[[x-5,wl-1.4],[x+5,wl-1.4],[x+4,wl],[x-4,wl]],'#1a1a24'); if(r()<.5){ poly(g,[[x,wl-1.4],[x,wl-12],[x+5,wl-2]],'#f2d8c8'); } else R(g,'#f2d8c8',x-2,wl-3,4,1.6); }
      for(let i=0;i<60;i++) ell(g,r()*w,wl-.4,3+r()*6,.3,rgba('#ffb880',.55)); },
    mid(g,w,h,r){ const wl=96;
      /* surf breaking along the beach, surfers, a fishing boat */ for(let k=0;k<3;k++){ const y=wl-1-k*1.6; for(let x=0;x<w;x+=1) if(opn(x,w,700+k,7)>-.2) R(g,rgba('#fff2e0',.8-k*.2),x,y,1,.7); }
      for(let i=0;i<8;i++){ const x=r()*w; R(g,'#2a1e1a',x,wl-4.6,.8,2.2); ell(g,x+.4,wl-5,.5,.5,'#2a1e1a'); R(g,['#f2c230','#e0473a','#f2f2ec'][i%3],x-1.4,wl-2.4,3.6,.5); }
      poly(g,[[330,wl-3],[350,wl-3.4],[347,wl],[333,wl]],'#e8e0d0'); R(g,'#2a6ad8',332,wl-2.4,16,.8); R(g,'#3a3a3e',340,wl-10,.5,7);
      for(let k=0;k<4;k++){ const kx=60+k*120+r()*30, ky=12+r()*18, c=['#e0473a','#f2c230','#2a9a5a','#f27ab0'][k]; poly(g,[[kx,ky-4],[kx+3,ky],[kx,ky+4],[kx-3,ky]],c); g.strokeStyle=rgba('#2a2a2e',.6); g.lineWidth=.3; g.beginPath(); g.moveTo(kx,ky+4); g.quadraticCurveTo(kx+8,ky+30,kx-6,ky+60); g.stroke(); } },
    verge:()=>PX(256,56,4,(g,w,h)=>{ const r=rng(131);
      /* sand at the far edge, the wave promenade, the kerb and gravel */ vfill(g,0,0,w,14,[[0,'#f2d8a8'],[1,'#e6c890']]); for(let i=0;i<600;i++) R(g,r()<.5?'#f8e4b8':'#d8b880',r()*w,r()*14,.5,.5);
      R(g,'#f2ece0',0,14,w,26); for(let y=14;y<40;y+=.5) for(let x=0;x<w;x+=.5) if(Math.sin(x/w*Math.PI*32+Math.sin((y-14)/26*Math.PI*2)*2.4)>.45) R(g,'#2a2a2e',x,y,.5,.5);
      R(g,'#c8c4bc',0,40,w,2); vfill(g,0,42,w,h-42,[[0,'#8a8478'],[1,'#7a746a']]); for(let i=0;i<1800;i++) R(g,['#a8a294','#6a645a','#94907e','#5a564e'][i%4],r()*w,42+r()*(h-42),.6+r()*.6,.5+r()*.4); }),
    vergeW:7, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a5a7a'],[.5,'#34546e'],[1,'#3a5a7a']]); const r=rng(133); for(let i=0;i<260;i++){ const x=r()*w, y=r()*h, L=2+r()*6; ell(g,x,y,L,.35,rgba('#ffb888',.35)); ell(g,x+1,y+.8,L*.8,.3,rgba('#1a2a4a',.4)); } },0,133), groundTile:14 },
  neg:{
    far(g,w,h,r){ const base=91; const peak=x=>{ let d=((x-150)%w+w)%w; if(d>w/2) d-=w; return 30+opn(x,w,951,3,4)*9+Math.max(0,1-Math.abs(d)/70)*34; };
      oRange(g,w,h,base,peak,{shade:'#2a4a3e',lit:'#5a6a5a',haze:'#d89a8a',dark:'#1e3a30'},{seed:35,light:-1,hazeH:30,hazeA:.65,gullies:60});
      for(let x=0;x<w;x+=.5){ const p=peak(x), d=peak(x+1)-peak(x-1); if(d<0) R(g,rgba('#ff9a6a',.7),x,base-p,.6,1); }
      const sx=150, sy=base-peak(150); R(g,'#f2e8e0',sx-.8,sy-9,1.6,9); R(g,'#f2e8e0',sx-5,sy-7,10,1.2); radial(g,sx,sy-5,10,[[0,rgba('#ffe0c0',.5)],[1,rgba('#ffe0c0',0)]]); R(g,'#3a4a3e',0,base,w,h-base); },
    back(g,w,h,r){ const base=94; const top=x=>base-38-opn(x,w,961,2)*12-Math.sin(x/w*Math.PI*2)*8;
      g.fillStyle='#3a5a3a'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill();
      for(let row=0;row<14;row++){ let x=-r()*4; while(x<w){ const bw=3+r()*3.5, bh=2.6+r()*1.6, t=top(Math.min(w-1,Math.max(0,x+bw/2)))+3+row*2.8; if(t+bh>base) { x+=bw; continue; } const raw=r()<.4, c=raw?'#b8643a':RIO_PAINT[r()*RIO_PAINT.length|0];
        R(g,c,x,t,bw,bh); R(g,mix(c,'#000000',.3),x+bw-.5,t,.5,bh); R(g,mix(c,'#000000',.4),x,t,bw,.4); if(r()<.35) R(g,'#2a6ad8',x+.4,t-1,1.2,1); R(g,r()<.35?'#ffd890':'#2a2a30',x+.6,t+1,.6,1); x+=bw; } }
      oHaze(g,w,0,base,'#d89a8a',.25,.05); },
    mid(g,w,h,r){ const base=95; let x=0;
      while(x<w){ const bw=14+r()*12, bh=40+r()*40, top=base-bh, c=['#f2ece0','#e8dcc8','#f0d8c8','#d8e0e0','#e8e0b8'][r()*5|0];
        vfill(g,x,top,bw,bh,[[0,mix(c,'#ffc8a0',.25)],[1,mix(c,'#5a4a5a',.35)]]);
        for(let y=top+2;y<base-4;y+=3.2){ R(g,rgba('#3a3a4a',.35),x,y+2.2,bw,.6); for(let xx=x+1;xx<x+bw-2;xx+=3) R(g,r()<.3?'#ffd890':mix(c,'#2a3040',.5),xx,y,2,1.8); }
        hfill(g,x+bw*.85,top,bw*.15,bh,[[0,rgba('#000000',0)],[1,rgba('#000000',.25)]]); x+=bw+1+r()*3; } },
    verge:()=>PX(256,72,4,(g,w,h)=>{ const r=rng(137);
      R(g,'#c8c0b0',0,0,w,6); for(let x=0;x<w;x+=1) if(Math.sin(x/3)>.3) R(g,'#2a2a2e',x,1,1,4);
      vfill(g,0,6,w,40,[[0,'#46464a'],[.5,'#525256'],[1,'#46464a']]); for(let i=0;i<2400;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.07),r()*w,6+r()*40,.6,.4); R(g,'#f2f2ec',0,8,w,.5); R(g,'#f2c230',0,25.6,w,.5); R(g,'#f2c230',0,26.6,w,.5); R(g,'#f2f2ec',0,44,w,.5);
      R(g,'#b8b0a0',0,46,w,2); vfill(g,0,48,w,10,[[0,'#5a7a42'],[1,'#4a6a38']]); vfill(g,0,h-14,w,14,[[0,'#8a8478'],[1,'#7a746a']]); for(let i=0;i<1800;i++) R(g,['#a8a294','#6a645a','#94907e','#5a564e'][i%4],r()*w,h-14+r()*14,.6+r()*.6,.5+r()*.4); }),
    vergeW:9, vergeTile:32,
    ground:()=>P2(64,64,(g,w,h)=>{ R(g,'#46464a',0,0,w,h); const r=rng(139); for(let i=0;i<200;i++) R(g,rgba('#ffffff',.06),r()*w,r()*h,1,1); },6,139), groundTile:8 }
};
function rioApt(g,x,y,w,h,o){ const r=rng(o.seed), c=o.col; vfill(g,x,y,w,h,[[0,mix(c,'#ffc8a0',.2)],[1,mix(c,'#5a4a5a',.2)]]);
  for(let b=0;b<4;b++){ const bx=x+b*w/4+1, bw=w/4-2; vfill(g,bx,y+h*.12,bw,h*.6,r()<.3?[[0,'#ffe0a0'],[1,'#e8a050']]:[[0,'#8aa0b8'],[1,'#3a4a5a']]); R(g,mix(c,'#ffffff',.3),bx-.5,y+h*.68,bw+1,h*.1); for(let k=0;k<bw;k+=1.1) R(g,'#5a5a5e',bx+k,y+h*.5,.25,h*.2); R(g,'#5a5a5e',bx,y+h*.5,bw,.3); if(r()<.3) ell(g,bx+bw*.5,y+h*.62,1.2,1,'#3a8a3a'); }
  R(g,rgba('#000000',.2),x,y+h-.6,w,.6); }
OK.rio.kit={S:4, ah:288,
  cells:{aG2:[0,200,64,24],a1:[0,0,64,16],a2:[0,16,64,16],a3:[0,32,64,16],aG:[0,48,64,24],aE:[64,0,32,32],aT:[64,32,16,16],mural:[96,0,96,24],kioskF:[192,0,48,24],thatch:[192,24,48,16],
    palm:[64,72,48,64],palm2:[112,72,48,64],umb1:[160,40,32,24],umb2:[192,40,32,24],umb3:[224,40,32,24],net:[160,64,48,16],lifeT:[208,64,32,24],chair:[240,64,16,12],coco:[160,80,32,20],
    taxiY:[0,72,40,14],taxiYE:[40,72,16,14],taxiT:[40,86,16,8],bus:[0,96,64,24],busE:[0,120,24,24],busT:[24,120,16,16],lampR:[192,88,16,32],sand:[208,88,48,32],surf:[0,144,48,16],flag:[48,144,16,16],banca:[64,144,40,24],
    wire:[104,144,4,4],dark:[108,144,4,4],white:[112,144,4,4],concrete:[116,144,16,16],blackmetal:[132,144,6,24],steel:[138,144,6,24],wood:[144,144,16,16],shrub:[160,120,32,24],tufts:[192,120,48,20],rock:[104,168,32,24]},
  paint:{
    a1:(g,x,y,w,h)=>rioApt(g,x,y,w,h,{seed:1,col:'#f2ece0'}), a2:(g,x,y,w,h)=>rioApt(g,x,y,w,h,{seed:2,col:'#e8d8c0'}), a3:(g,x,y,w,h)=>rioApt(g,x,y,w,h,{seed:3,col:'#d8e4e4'}),
    aG:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#4a4a50'],[1,'#2a2a30']]); for(let k=0;k<3;k++){ vfill(g,x+2+k*21,y+h*.3,18,h*.7,[[0,'#ffe8b0'],[1,'#c89050']]); } for(let k=0;k<w;k+=3) R(g,k/3%2?'#2a9a5a':'#f2c230',x+k,y,3,h*.22); text(g,'FARMACIA',x+18,y+1,'#1a1a1a',.6); },
    aG2:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#3a3a40'],[1,'#22222a']]); for(let k=0;k<2;k++) vfill(g,x+3+k*31,y+h*.32,27,h*.68,[[0,'#ffd8a0'],[1,'#b8783a']]); for(let k=0;k<w;k+=4) R(g,k/4%2?'#e0473a':'#f2ece0',x+k,y,4,h*.24); R(g,'#1a1a1a',x+w*.3,y+h*.03,w*.4,h*.16); text(g,'SUCOS',x+w*.36,y+h*.05,'#f2c230',.7); for(let k=0;k<10;k++) ell(g,x+6+k*5.5,y+h*.5,1.4,1.6,['#f2c230','#e0473a','#5a8a3a','#f27ab0'][k%4]); },
    aE:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#e8dcc8'],[1,'#a89888']]); for(let k=0;k<h;k+=4) R(g,rgba('#000000',.1),x,y+k,w,.5); },
    aT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#a8a09a'],[1,'#8a827c']]),
    mural:(g,x,y,w,h)=>{ R(g,'#f2ece0',x,y,w,h); const r=rng(141); for(let i=0;i<10;i++){ const c=RIO_PAINT[i%RIO_PAINT.length]; ell(g,x+i*10+5,y+h*.5,8,h*.4,c); ell(g,x+i*10+3,y+h*.4,3,3,mix(c,'#ffffff',.4)); } text(g,'RIO',x+30,y+4,'#14141c',4); for(let i=0;i<20;i++) R(g,'#14141c',x+r()*w,y+r()*h,2+r()*3,.4); vfill(g,x,y+h-3,w,3,[[0,rgba('#000000',0)],[1,rgba('#000000',.3)]]); },
    kioskF:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f2ece0'],[1,'#c8c0b0']]); vfill(g,x+3,y+h*.2,w-6,h*.45,[[0,'#ffe8b0'],[1,'#d89a50']]); for(let k=0;k<8;k++) ell(g,x+6+k*5,y+h*.45,1.6,1.8,['#5a8a3a','#f2c230','#e0473a'][k%3]); R(g,'#2a9a5a',x,y+h*.65,w,h*.08); text(g,'AGUA DE COCO',x+6,y+h*.76,'#2a6a4a',.55); },
    thatch:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#d8b870'],[1,'#a8884a']]); const r=rng(143); for(let i=0;i<120;i++) R(g,rgba(r()<.5?'#6a4a2a':'#f2e0a0',.4),x+r()*w,y+r()*h,.3,2+r()*3); },
    palm:(g,x,y,w,h)=>oTree(g,x,y,w,h,'palm',145,{lean:.25,pal:['#1e3e26','#2e5a30','#5a7a3a']}), palm2:(g,x,y,w,h)=>oTree(g,x,y,w,h,'palm',147,{lean:-.35,pal:['#1e3e26','#2e5a30','#5a7a3a']}),
    umb1:(g,x,y,w,h)=>rioUmb(g,x,y,w,h,['#e0473a','#f2ece0']), umb2:(g,x,y,w,h)=>rioUmb(g,x,y,w,h,['#2a6ad8','#f2c230']), umb3:(g,x,y,w,h)=>rioUmb(g,x,y,w,h,['#2a9a5a','#f2ece0']),
    net:(g,x,y,w,h)=>{ R(g,'#5a4a3a',x+1,y,1,h); R(g,'#5a4a3a',x+w-2,y,1,h); R(g,'#f2ece0',x+1,y+1,w-2,.8); for(let k=2;k<w-2;k+=1.4) R(g,rgba('#2a2a2e',.7),x+k,y+1.8,.2,h*.4); for(let k=0;k<4;k++) R(g,rgba('#2a2a2e',.7),x+2,y+2+k*1.6,w-4,.2); },
    lifeT:(g,x,y,w,h)=>{ R(g,'#e8e4dc',x+4,y+h*.4,1.4,h*.6); R(g,'#e8e4dc',x+w-6,y+h*.4,1.4,h*.6); vfill(g,x+2,y+h*.12,w-4,h*.3,[[0,'#f26a2a'],[1,'#c84a1a']]); R(g,'#f2f2ec',x+2,y+h*.22,w-4,1); poly(g,[[x,y+h*.14],[x+w,y+h*.14],[x+w/2,y]],'#f2f2ec'); R(g,'#2a2a2e',x+6,y+h*.6,w-12,1); },
    chair:(g,x,y,w,h)=>{ for(let k=0;k<4;k++) R(g,k%2?'#2a6ad8':'#f2f2ec',x+2+k*3,y+2,3,h*.5); R(g,'#c8c8c4',x+1,y+h*.6,w-2,.8); R(g,'#c8c8c4',x+2,y+h*.6,.6,h*.4); R(g,'#c8c8c4',x+w-3,y+h*.6,.6,h*.4); },
    coco:(g,x,y,w,h)=>{ R(g,'#2a9a5a',x+2,y+h*.4,w-4,h*.6); for(let k=0;k<9;k++) ell(g,x+5+(k%5)*5,y+h*.35-(k>4?2:0),2,2,'#5a8a3a'); R(g,'#f2c230',x+2,y+h*.6,w-4,1.4); },
    taxiY:(g,x,y,w,h)=>{ R(g,'#f2c230',x+1,y+h*.4,w-2,h*.42); vfill(g,x+1,y+h*.4,w-2,h*.12,[[0,'#ffe060'],[1,'#f2c230']]); poly(g,[[x+w*.22,y+h*.4],[x+w*.3,y+h*.08],[x+w*.7,y+h*.08],[x+w*.78,y+h*.4]],'#f2c230');
      vfill(g,x+w*.32,y+h*.12,w*.17,h*.25,[[0,'#ffd0a0'],[1,'#3a3a4a']]); vfill(g,x+w*.51,y+h*.12,w*.17,h*.25,[[0,'#ffd0a0'],[1,'#3a3a4a']]); R(g,'#2a6ad8',x+2,y+h*.58,w-4,1); for(const wx of [.2,.8]){ ell(g,x+w*wx,y+h*.84,h*.16,h*.16,'#1a1a1a'); ell(g,x+w*wx,y+h*.84,h*.07,h*.07,'#9a9a9a'); } },
    taxiYE:(g,x,y,w,h)=>{ R(g,'#f2c230',x+1,y+h*.35,w-2,h*.5); vfill(g,x+2,y+h*.08,w-4,h*.26,[[0,'#ffd0a0'],[1,'#3a3a4a']]); ell(g,x+2.5,y+h*.55,1.2,1.2,'#fff2c0'); ell(g,x+w-2.5,y+h*.55,1.2,1.2,'#fff2c0'); },
    taxiT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#ffd040'],[1,'#e2b020']]),
    bus:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f2f2ec'],[.5,'#2a6ad8'],[1,'#1a4a9a']]); for(let k=0;k<6;k++) vfill(g,x+3+k*10,y+h*.12,8.6,h*.38,[[0,'#ffd0a0'],[1,'#3a3a4a']]); R(g,'#f2c230',x,y+h*.58,w,h*.06); text(g,'ORLA',x+4,y+h*.7,'#f2f2ec',.7); for(const wx of [.16,.82]){ ell(g,x+w*wx,y+h*.9,3,3,'#1a1a1a'); ell(g,x+w*wx,y+h*.9,1.3,1.3,'#9a9a9a'); } },
    busE:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f2f2ec'],[.5,'#2a6ad8'],[1,'#1a4a9a']]); vfill(g,x+2,y+h*.08,w-4,h*.4,[[0,'#ffd0a0'],[1,'#3a3a4a']]); R(g,'#1a1a1a',x+3,y+h*.02,w-6,h*.06); text(g,'474',x+w/2-5,y+h*.025,'#f2c230',.5); },
    busT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#e8e8e4'],[1,'#c8c8c4']]),
    lampR:(g,x,y,w,h)=>{ const cx=x+w/2; R(g,'#4a4a50',cx-.5,y+h*.2,1,h*.8); for(const dx of [-1,1]){ g.strokeStyle='#4a4a50'; g.lineWidth=.6; g.beginPath(); g.moveTo(cx,y+h*.22); g.quadraticCurveTo(cx+dx*5,y+h*.16,cx+dx*6,y+h*.1); g.stroke(); ell(g,cx+dx*6,y+h*.1,2.2,1.2,'#ffe8b0'); radial(g,cx+dx*6,y+h*.12,4,[[0,rgba('#ffd890',.6)],[1,rgba('#ffd890',0)]]); } },
    sand:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f2d8a8'],[1,'#e8c890']]); const r=rng(149); for(let i=0;i<500;i++) R(g,r()<.5?'#f8e8c0':'#d8b480',x+r()*w,y+r()*h,.5,.5); for(let i=0;i<20;i++) ell(g,x+r()*w,y+r()*h,1.2,.5,rgba('#c8a070',.5)); },
    surf:(g,x,y,w,h)=>{ R(g,'#f2c230',x+2,y+h*.4,w-4,h*.3); poly(g,[[x+2,y+h*.4],[x,y+h*.55],[x+2,y+h*.7]],'#f2c230'); R(g,'#e0473a',x+4,y+h*.5,w-8,.6); },
    flag:(g,x,y,w,h)=>{ R(g,'#2a9a5a',x,y,w,h*.7); poly(g,[[x+w/2,y+1],[x+w-1,y+h*.35],[x+w/2,y+h*.7-1],[x+1,y+h*.35]],'#f2c230'); ell(g,x+w/2,y+h*.35,3,3,'#2a3a8a'); },
    banca:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#2a6a4a'],[1,'#1a4a30']]); for(let k=0;k<6;k++) for(let j=0;j<3;j++) R(g,['#e0473a','#f2c230','#2a6ad8','#f2f2ec'][(k+j)%4],x+3+k*6,y+5+j*5,5,4); R(g,'#f2c230',x,y,w,3); text(g,'BANCA',x+12,y+.3,'#1a4a30',.6); },
  },
  place(E,side,r,P){
    if(side==='pos'){
      /* the wide beach: sand laid over the water out to 24 m */ for(let u=0;u<P;u+=12) E.flat(u+6,10.6,12.2,13.6,'sand',{y:.01});
      for(let u=0;u<P;u+=20){ E.post(u,10.4,.16,7.5,'blackmetal',{top:true}); E.card(u,10.4,3.2,2.2,'lampR',{n:1,y:6}); }
      for(let u=10;u<P;u+=48){ E.box(u,9,3.4,2.3,2.4,{f:'kioskF',e:'kioskF',t:null}); E.gable(u,9,3.4,2.4,2.3,1.3,'thatch',{ov:.6}); for(let k=0;k<3;k++) E.box(u-1.6+k*1.6,7.6,.6,.45,.6,{f:'chair',e:'chair',t:'chair'}); }
      for(let i=0;i<14;i++){ const u=r()*P; E.card(u,8+r()*1.6,4.4,8+r()*2,r()<.5?'palm':'palm2',{n:3,sb:.7}); }
      for(let i=0;i<40;i++){ const u=r()*P, d=13+r()*10; E.card(u,d,2.6,2.2,['umb1','umb2','umb3'][i%3],{n:2,sb:.85}); if(r()<.6) E.box(u+.8,d+.3,.6,.4,1.6,{f:'chair',e:'chair',t:'chair'}); }
      { const u=70; E.post(u-1,18,.12,2,'white',{top:true}); E.post(u+1,18,.12,2,'white',{top:true}); E.card(u,18,3.4,2.6,'lifeT',{n:1,y:1.4}); E.card(u,18.4,1,1,'flag',{n:1,y:4.4}); }
      E.card(160,19,7,1.8,'net',{n:1}); E.card(120,9.6,2.6,1.6,'coco',{n:1}); for(let i=0;i<6;i++) E.card(r()*P,20+r()*3,1.6,.5,'surf',{n:1,y:.02}); }
    else {
      E.box(P/2,10.2,P,.18,1.2,{f:'concrete',e:'concrete',t:'concrete'});
      for(let u=0;u<P;u+=28){ E.post(u,10.6,.16,7,'blackmetal',{top:true}); E.card(u,10.6,3.2,2.2,'lampR',{n:1,y:5.6}); }
      for(let i=0;i<10;i++) E.card(r()*P,4.9+r()*.4,4.2,8.5,r()<.5?'palm':'palm2',{n:3,sb:.7});
      E.box(60,6.8,11,3,2.5,{f:'bus',e:'busE',t:'busT'},{y:.1,ao:.7});
      for(const [u,d] of [[20,9.2],[100,7],[140,9.6],[200,7.2]]) E.box(u,d,4.4,1.5,1.8,{f:'taxiY',e:'taxiYE',t:'taxiT'},{ao:.6});
      E.card(170,11.6,3.4,2,'banca',{n:1}); E.box(170,11.9,3.4,.2,1,{f:'dark',e:'dark',t:'dark'},{y:2});
      let u=0, i=0; while(u<P-8){ const w=14+r()*8, d=13.8, fl=6+(r()*5|0), cu=u+w/2;
        if(i%3===1){ E.box(cu,d-.4,w,2.4,.4,{f:'mural',e:'aE',t:'aT'}); u+=w+2; i++; continue; }
        towerKit(E,cu,d,w,10,fl,{g:i%2?'aG2':'aG',f:['a1','a2','a3'],p:'aE',e:'aE',t:'aT'},{r,fh:3,gh:4}); u+=w+1.5; i++; }
      for(let k=0;k<16;k++) E.card(r()*P,5.4+r()*.6,1.4,1,'shrub',{n:2,sb:.75}); }
  } };
function rioUmb(g,x,y,w,h,c){ const cx=x+w/2; R(g,'#e8e4dc',cx-.4,y+h*.3,.8,h*.7); for(let k=0;k<8;k++){ const a0=Math.PI+k*Math.PI/8, a1=a0+Math.PI/8; poly(g,[[cx,y+2],[cx+Math.cos(a0)*w*.48,y+h*.38],[cx+Math.cos(a1)*w*.48,y+h*.38]],k%2?c[0]:c[1]); } vfill(g,x+1,y+h*.3,w-2,h*.08,[[0,rgba('#000000',.2)],[1,rgba('#000000',0)]]); }
OK.rio.kit.atlas=kitAtlas(OK.rio.kit);
