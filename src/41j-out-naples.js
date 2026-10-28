
/* =====================================================================================================
   NAPLES AND THE AMALFI COAST AT NOON. Sea side: the lungomare with a stucco sea wall, stone pines, oleanders,
   green lamps, a Vespa, a lemon stall; rocks and painted gozzi in the water; a lido of striped umbrellas,
   sails in the bay and the twin-humped volcano across it. Land side: dry-stone terraces with lemon pergolas,
   a little Fiat on the coast road, pastel villas with green shutters, cypresses, prickly pears, a town of
   stacked pastel houses round a majolica dome, and the mountains behind.
   ===================================================================================================== */
const NAP_PASTEL=['#f2c8a0','#f6e0a8','#f0b0a8','#f8ece0','#e8a888','#f2d4b8','#e8d890','#f0c0c8'];
function napHouseP(g,x,base,w,h,c,r){ vfill(g,x,base-h,w,h,[[0,mix(c,'#ffffff',.15)],[1,mix(c,'#000000',.15)]]); R(g,mix(c,'#ffffff',.35),x,base-h,w,.8);
  for(let fy=base-h+2;fy<base-2;fy+=3.6) for(let fx=x+1;fx<x+w-2;fx+=3){ R(g,'#2e6a4a',fx,fy,1.6,2.2); if(r()<.3) R(g,'#2a2a2e',fx+.4,fy+.3,.8,1.6); if(r()<.15) R(g,'#5a4a3a',fx-.3,fy+2.2,2.2,.3); }
  hfill(g,x+w-1.2,base-h,1.2,h,[[0,rgba('#000000',0)],[1,rgba('#000000',.25)]]); if(r()<.4){ R(g,'#c8643a',x-.3,base-h-.8,w+.6,.8); } }
OK.naples={
  sky:()=>oSkyTex([[0,'#2276c4'],[.55,'#7cc0ea'],[.85,'#c8e4f2'],[1,'#eef4ee']],{clouds:8,seed:51,cloudShade:'#a8c0d8'}),
  pos:{ midSpec:{yb:-.5}, backSpec:{yb:-.5}, groundK:.5,
    far(g,w,h,r){ const base=89;
      /* the volcano across the bay: a broad cone, the old rim beside it, a wisp of cloud */ const cx=170;
      const vol=x=>{ let d=((x-cx)%w+w)%w; if(d>w/2) d-=w; const a=Math.abs(d); return Math.max(0,(a<120?30*Math.pow(1-a/120,1.3):0)+(d>-60&&d<-10?6*Math.sin((d+60)/50*Math.PI):0)-(a<5?2:0)); };
      oRange(g,w,h,base,vol,{shade:'#7a86a4',lit:'#a4b0c8',haze:'#dde8ee',dark:'#6a7694'},{seed:21,hazeH:20,hazeA:.85,gullies:70});
      ell(g,cx+6,base-34,10,2.4,rgba('#ffffff',.6)); ell(g,cx+14,base-36,8,1.8,rgba('#ffffff',.45));
      /* Capri off to the side */ oRange(g,w,h,base,x=>{ let d=((x-420)%w+w)%w; if(d>w/2) d-=w; return Math.abs(d)<40?14*Math.pow(1-Math.abs(d)/40,.7)*(1+.3*Math.sin(d*.2)):0; },{shade:'#8a98a8',lit:'#a8b4c0',haze:'#e2ecf0'},{seed:22,hazeH:12,hazeA:.8});
      for(let x=0;x<w;x+=2) if(vol(x)>3&&r()<.5) R(g,rgba('#f2ece0',.5),x,base-1.4,1.4,1);
      vfill(g,0,base,w,h-base,[[0,'#7ac0dc'],[.25,'#2a8ab4'],[1,'#1a6a9a']]); for(let i=0;i<120;i++) ell(g,r()*w,base+2+r()*(h-base-2),1+r()*2,.25,rgba('#ffffff',.5)); },
    back(g,w,h,r){ const wl=95;
      for(let i=0;i<9;i++){ const x=r()*w, s=.7+r()*.6; poly(g,[[x-6*s,wl-1.6*s],[x+7*s,wl-1.6*s],[x+5*s,wl],[x-4*s,wl]],['#f2f2ec','#2a5aa8','#c8402a'][i%3]); poly(g,[[x,wl-1.6*s],[x,wl-16*s],[x+7*s,wl-2.4*s]],'#f8f8f2'); poly(g,[[x-.4,wl-1.6*s],[x-.4,wl-12*s],[x-5*s,wl-2.4*s]],'#e8e8e2'); R(g,'#5a5a5a',x-.2,wl-17*s,.4,15.5*s); }
      R(g,'#f2f2ec',300,wl-6,26,4); R(g,'#2a5aa8',300,wl-2.5,26,2.5); R(g,'#f2f2ec',306,wl-9,12,3); for(let k=0;k<6;k++) R(g,'#3a4a5a',302+k*4,wl-5,2,1.2);
      for(let i=0;i<50;i++) ell(g,r()*w,wl-.4,3+r()*6,.3,rgba('#ffffff',.55)); },
    mid(g,w,h,r){ const sb=95;
      /* the lido: sand, rows of striped umbrellas and sunbeds, painted boats pulled up */ vfill(g,0,sb-6,w,7,[[0,'#f2e2b8'],[1,'#e2c890']]); R(g,'#ffffff',0,sb-6.4,w,.6);
      for(let row=0;row<2;row++) for(let x=6+row*8;x<w;x+=16){ const c=[['#2a5aa8','#f2f2ec'],['#e2802a','#f2f2ec'],['#2a8a6a','#f6e8c8']][(x/16|0)%3], y=sb-2-row*2.4;
        R(g,'#5a4a3a',x,y-9,.5,9); for(let k=0;k<6;k++) poly(g,[[x,y-12],[x-6+k*2,y-9],[x-4+k*2,y-9]],k%2?c[0]:c[1]); R(g,c[0],x-5,y-1.4,4,1); R(g,'#f2f2ec',x+1,y-1.4,4,1); }
      for(const [x,c] of [[40,'#2a5aa8'],[200,'#c8402a'],[360,'#2a8a6a'],[470,'#f2c230']]){ poly(g,[[x,sb-4],[x+12,sb-4.6],[x+10,sb-1],[x+2,sb-1]],c); R(g,'#f2f2ec',x+1,sb-4.4,10,.6); } },
    verge:()=>PX(256,64,4,(g,w,h)=>{ const r=rng(101);
      /* the lungomare: a basalt-paved walk, a pale stone kerb, then the road edge and gravel */
      for(let y=0;y<26;y+=3.2) for(let x=((y/3.2)%2)*3;x<w;x+=6){ const c=mix('#6a6a6e','#5a5a60',r()); vfill(g,x+.15,y+.15,5.7,2.9,[[0,mix(c,'#ffffff',.08)],[1,c]]); }
      R(g,'#d8d2c4',0,26,w,2); vfill(g,0,28,w,22,[[0,'#5a5a5e'],[1,'#4e4e52']]); for(let i=0;i<1600;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.07),r()*w,28+r()*22,.6,.4); R(g,'#f2f2ec',0,30,w,.5); for(let x=0;x<w;x+=12) R(g,'#f2f2ec',x,39,6,.5);
      vfill(g,0,h-14,w,14,[[0,'#8a8478'],[1,'#7a746a']]); for(let i=0;i<2400;i++) R(g,['#a8a294','#6a645a','#94907e','#5a564e'][i%4],r()*w,h-14+r()*14,.6+r()*.6,.5+r()*.4); }),
    vergeW:8, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a86b0'],[.5,'#2280aa'],[1,'#2a86b0']]); const r=rng(103); for(let i=0;i<280;i++){ const x=r()*w, y=r()*h, L=2+r()*6; ell(g,x,y,L,.35,rgba('#bfeaf8',.4)); ell(g,x+1,y+.8,L*.8,.3,rgba('#145a80',.4)); } },0,103), groundTile:14 },
  neg:{
    far(g,w,h,r){ const base=91; oRange(g,w,h,base,x=>24+opn(x,w,601,2)*12+Math.abs(opn(x,w,602,6))*7,{shade:'#7a9088',lit:'#a8b8a4',haze:'#e2ece8',dark:'#687e76'},{seed:23,hazeH:30,hazeA:.75,gullies:80});
      for(let i=0;i<40;i++){ const x=r()*w, y=base-6-r()*10; R(g,rgba(NAP_PASTEL[i%8],.8),x,y,1.6,1.2); } R(g,'#9aaa8a',0,base,w,h-base); },
    back(g,w,h,r){ const base=94; const top=x=>base-22-opn(x,w,611,2)*10-Math.sin(x/w*Math.PI*2)*6;
      g.fillStyle='#6a8a5a'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill();
      for(let y=0;y<30;y+=2.4) for(let x=0;x<w;x+=1){ const t=top(x); if(t+y<base) R(g,y%4.8<2.4?'#7a9a5a':'#5a7a46',x,t+y,1,.6); }
      for(let i=0;i<70;i++){ const x=r()*w, t=top(x), y=t+2+r()*(base-t-4); napHouseP(g,x,y,3+r()*3,2+r()*2,NAP_PASTEL[r()*8|0],r); }
      for(let i=0;i<30;i++){ const x=r()*w; oTree(g,x-1,top(x)-6+r()*10,2,7,'cypress',i); } oHaze(g,w,0,base,'#e2ece8',.3,.1); },
    mid(g,w,h,r){ const base=95; const top=x=>base-40-opn(x,w,621,2)*10-Math.sin(x/w*Math.PI*2+1)*8;
      g.fillStyle='#a8906a'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill(); for(let x=0;x<w;x++) R(g,'#5a8a3a',x,top(x),1,2+opn(x,w,622,9)*2);
      /* houses stacked up the cliff, each row overlapping the one above */ for(let row=0;row<9;row++){ let x=-r()*6; while(x<w){ const bw=6+r()*7, t=top(Math.min(w-1,Math.max(0,x+bw/2)))+4+row*4.2, bh=6+r()*3; if(t+bh<base-1) napHouseP(g,x,t+bh,bw,bh,NAP_PASTEL[r()*8|0],r); x+=bw+(r()<.2?3:0); } }
      /* the church and its majolica dome, a bell tower */ const cx=330, b=base-12; vfill(g,cx-14,b-22,28,22,[[0,'#fbf2e2'],[1,'#d8ccb4']]); g.fillStyle=grad(g,cx-11,0,cx+11,0,[[0,'#2a8a6a'],[.4,'#4ab08a'],[1,'#1a5a46']]); g.beginPath(); g.ellipse(cx,b-22,11,10,0,Math.PI,0); g.fill();
      for(let k=-9;k<=9;k+=2.4) for(let j=0;j<4;j++) R(g,'#f2d23a',cx+k*(1-j*.18),b-24-j*2.2,.8,1); R(g,'#fbf2e2',cx-1.5,b-36,3,4); R(g,'#fbf2e2',cx+16,b-40,7,40); R(g,'#3a3a3e',cx+18,b-36,3,4); poly(g,[[cx+15,b-40],[cx+24,b-40],[cx+19.5,b-46]],'#c8643a');
      for(let i=0;i<14;i++){ const x=r()*w; oTree(g,x-2,top(x)+r()*20,4,14,'cypress',i+30); }
      R(g,'#efe6d4',0,base-4,w,4); R(g,'#c8643a',0,base-4.6,w,.8); },
    verge:()=>PX(256,56,4,(g,w,h)=>{ const r=rng(107);
      /* the coast road: asphalt, a white edge line, a stone gutter, gravel */ R(g,'#b8a88a',0,0,w,4); vfill(g,0,4,w,30,[[0,'#56565a'],[1,'#4a4a4e']]); for(let i=0;i<1800;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.07),r()*w,4+r()*30,.6,.4); R(g,'#f2f2ec',0,6,w,.5); R(g,'#f2f2ec',0,31,w,.5); for(let x=0;x<w;x+=12) R(g,'#f2f2ec',x,18.5,6,.5);
      vfill(g,0,34,w,6,[[0,'#c8bea8'],[1,'#a89e88']]); vfill(g,0,h-16,w,16,[[0,'#9a8e78'],[1,'#8a7e6a']]); for(let i=0;i<2400;i++) R(g,['#b8ac94','#7a6e5a','#a89c84','#6a5e4a'][i%4],r()*w,h-16+r()*16,.6+r()*.6,.5+r()*.4); for(let i=0;i<40;i++) ell(g,r()*w,h-16+r()*16,1.4,.6,'#7a9a4a'); }),
    vergeW:7, vergeTile:32,
    ground:()=>P2(64,64,(g,w,h)=>{ R(g,'#7a8a52',0,0,w,h); const r=rng(109); for(let i=0;i<300;i++) R(g,['#6a7a46','#8a9a5a','#a89a6a'][i%3],r()*w,r()*h,1,1); },6,109), groundTile:8 }
};
OK.naples.kit={S:4, ah:256,
  cells:{villaY:[0,0,64,40],villaP:[64,0,64,40],villaE:[128,0,32,40],cotto:[160,0,32,16],coping:[160,16,32,6],stucco:[192,0,16,16],stoneWall:[192,16,64,16],soil:[208,0,48,16],
    pine:[0,40,64,48],cypress:[64,40,24,64],lemon:[88,40,48,48],oleander:[136,40,32,24],opuntia:[168,40,32,32],agave:[200,40,24,16],palmC:[200,56,48,48],
    vine:[0,88,64,16],vespa:[64,104,24,16],fiat:[88,104,32,14],fiatE:[120,104,12,12],fiatT:[132,104,12,8],stallN:[136,64,48,24],lampN:[144,104,16,32],pots:[160,104,24,12],edicola:[184,104,16,24],gozzo:[0,104,64,16],
    wire:[0,124,4,4],wood:[4,124,16,16],dark:[20,124,4,4],white:[24,124,4,4],rock:[28,124,32,24],concrete:[60,124,16,16],tufts:[76,124,48,20],drygrass:[124,124,48,20],steel:[172,124,6,24]},
  paint:{
    villaY:(g,x,y,w,h)=>oFacade(g,x,y,w,h,{col:'#f2d48a',floors:2,bays:3,roofH:3,shutters:'#2e6a4a',winW:.36,winH:.6,glass:'#3a4a58',frame:'#f8f0e0',balcony:.6,rail:'#2a2a2a',seed:21,lit:0}),
    villaP:(g,x,y,w,h)=>oFacade(g,x,y,w,h,{col:'#f0b8a8',floors:2,bays:3,roofH:3,shutters:'#3a6a8a',winW:.36,winH:.6,glass:'#3a4a58',frame:'#f8f0e0',balcony:.5,rail:'#2a2a2a',seed:22,lit:0}),
    villaE:(g,x,y,w,h)=>oFacade(g,x,y,w,h,{col:'#f2d0a8',floors:2,bays:1,roofH:3,shutters:'#2e6a4a',winW:.4,winH:.6,glass:'#3a4a58',frame:'#f8f0e0',seed:23}),
    cotto:(g,x,y,w,h)=>oRoofTiles(g,x,y,w,h,'#c86a3a',{rows:6,pitch:1.6}),
    coping:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#d8784a'],[1,'#9a4a28']]),
    stucco:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#f6ecd8'],[1,'#d8c8ac']]),
    stoneWall:(g,x,y,w,h)=>{ R(g,'#7a6e5e',x,y,w,h); const r=rng(31); for(let yy=y;yy<y+h;yy+=2.6) for(let xx=x-r()*3;xx<x+w;){ const sw=2.4+r()*3; vfill(g,xx+.2,yy+.2,sw-.4,2.2,[[0,mix('#b8aa90','#9a8c74',r())],[1,mix('#8a7c64','#6a5e4a',r())]]); xx+=sw; } for(let i=0;i<14;i++) ell(g,x+r()*w,y+r()*h,1.2,.8,'#5a7a3a'); },
    soil:(g,x,y,w,h)=>{ R(g,'#7a6a46',x,y,w,h); const r=rng(33); for(let i=0;i<200;i++) R(g,['#6a8a3a','#8a7a52','#5a7a32'][i%3],x+r()*w,y+r()*h,.8,.8); },
    pine:(g,x,y,w,h)=>oTree(g,x,y,w,h,'umbrella',111),
    cypress:(g,x,y,w,h)=>oTree(g,x,y,w,h,'cypress',113),
    lemon:(g,x,y,w,h)=>oTree(g,x,y,w,h,'lemon',115,{pal:['#2a5a26','#3e7a32','#62a044','#8ac05a'],n:30}),
    oleander:(g,x,y,w,h)=>{ oTree(g,x,y,w,h,'shrub',117,{pal:['#2a4a26','#3e6a30','#5a8a40']}); const r=rng(119); for(let i=0;i<30;i++) ell(g,x+w*(.1+r()*.8),y+h*(.15+r()*.55),1,.8,['#f070a0','#ff9ac0','#ffffff'][i%3]); },
    opuntia:(g,x,y,w,h)=>{ const r=rng(121); const pad=(px,py,s)=>{ ell(g,px,py,s*.7,s,'#5a8a4a'); ell(g,px-s*.2,py-s*.2,s*.4,s*.6,'#7aaa5a'); for(let k=0;k<5;k++) R(g,'#e8e0a0',px+(r()-.5)*s,py+(r()-.5)*s*1.4,.3,.3); };
      pad(x+w/2,y+h*.75,4); pad(x+w/2-4,y+h*.5,3.4); pad(x+w/2+4,y+h*.48,3.4); pad(x+w/2-6,y+h*.25,2.8); pad(x+w/2+2,y+h*.22,3); pad(x+w/2+7,y+h*.2,2.6); for(let k=0;k<6;k++) ell(g,x+w/2+(r()-.5)*14,y+h*(.1+r()*.3),.8,1,'#d84a6a'); },
    agave:(g,x,y,w,h)=>{ for(let k=0;k<11;k++){ const a=-Math.PI+k*Math.PI/10; g.strokeStyle=k%2?'#6a8a7a':'#8aa898'; g.lineWidth=1.4; g.beginPath(); g.moveTo(x+w/2,y+h); g.quadraticCurveTo(x+w/2+Math.cos(a)*w*.25,y+h-h*.5,x+w/2+Math.cos(a)*w*.48,y+h-Math.abs(Math.sin(a))*h*.95); g.stroke(); } },
    palmC:(g,x,y,w,h)=>oTree(g,x,y,w,h,'palm',123,{lean:-.1,pal:['#2a5a2a','#3e7a36','#6aa04a']}),
    vine:(g,x,y,w,h)=>{ const r=rng(125); for(let k=0;k<w;k+=4) R(g,'#6a4a2e',x+k,y,.7,h); for(let i=0;i<420;i++){ const lx=x+r()*w, ly=y+r()*h; ell(g,lx,ly,1.3,.9,['#3a6a2a','#5a8a3a','#7aaa4a'][i%3]); } for(let i=0;i<30;i++) ell(g,x+r()*w,y+r()*h,.8,.7,'#f2d23a'); },
    vespa:(g,x,y,w,h)=>{ const c='#8ac8c0'; ell(g,x+5,y+h-3,3,3,'#1a1a1a'); ell(g,x+w-5,y+h-3,3,3,'#1a1a1a'); ell(g,x+5,y+h-3,1.2,1.2,'#9a9a9a'); ell(g,x+w-5,y+h-3,1.2,1.2,'#9a9a9a');
      g.fillStyle=c; g.beginPath(); g.moveTo(x+w-8,y+h-4); g.quadraticCurveTo(x+w-6,y+h-11,x+w-12,y+h-10); g.lineTo(x+4,y+h-8); g.quadraticCurveTo(x+1,y+h-4,x+4,y+h-3); g.fill(); R(g,'#5a3a2a',x+7,y+h-11,8,1.6); R(g,c,x+3,y+2,1.4,h-8); R(g,'#2a2a2a',x+1,y+1,5,.8); ell(g,x+3.6,y+4,1.2,1.2,'#f2f2e0'); },
    fiat:(g,x,y,w,h)=>{ const c='#d8382a'; g.fillStyle=c; g.beginPath(); g.moveTo(x+2,y+h*.82); g.lineTo(x+2,y+h*.45); g.quadraticCurveTo(x+w*.3,y,x+w*.6,y+h*.05); g.quadraticCurveTo(x+w-2,y+h*.15,x+w-1,y+h*.55); g.lineTo(x+w-1,y+h*.82); g.fill();
      vfill(g,x+w*.3,y+h*.14,w*.16,h*.26,[[0,'#c8d8e4'],[1,'#4a5a68']]); vfill(g,x+w*.5,y+h*.14,w*.18,h*.26,[[0,'#c8d8e4'],[1,'#4a5a68']]); R(g,rgba('#ffffff',.3),x+3,y+h*.5,w-6,.4); for(const wx of [.22,.78]){ ell(g,x+w*wx,y+h*.82,h*.16,h*.16,'#1a1a1a'); ell(g,x+w*wx,y+h*.82,h*.08,h*.08,'#c8c8c8'); } },
    fiatE:(g,x,y,w,h)=>{ R(g,'#d8382a',x+1,y+h*.35,w-2,h*.5); vfill(g,x+2,y+h*.08,w-4,h*.28,[[0,'#c8d8e4'],[1,'#4a5a68']]); ell(g,x+2.5,y+h*.6,1,1,'#f2f2e0'); ell(g,x+w-2.5,y+h*.6,1,1,'#f2f2e0'); },
    fiatT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#e84a3a'],[1,'#b82a1e']]),
    stallN:(g,x,y,w,h)=>{ for(let k=0;k<w;k+=4) R(g,(k/4)%2?'#f2d23a':'#f2f2ec',x+k,y,4,h*.25); R(g,'#6a4a2e',x+2,y+h*.25,1,h*.75); R(g,'#6a4a2e',x+w-3,y+h*.25,1,h*.75); R(g,'#8a6a46',x,y+h*.6,w,h*.4); const r=rng(127); for(let i=0;i<40;i++) ell(g,x+3+r()*(w-6),y+h*(.5+r()*.12),1.3,1.1,'#f2d23a'); for(let i=0;i<8;i++) ell(g,x+3+r()*(w-6),y+h*.55,1.2,1,'#f28a3a'); },
    lampN:(g,x,y,w,h)=>{ const cx=x+w/2; R(g,'#2a4a3a',cx-.6,y+h*.25,1.2,h*.75); g.strokeStyle='#2a4a3a'; g.lineWidth=.8; g.beginPath(); g.moveTo(cx,y+h*.3); g.quadraticCurveTo(cx+5,y+h*.25,cx+5,y+h*.14); g.stroke(); poly(g,[[cx+2.6,y+h*.14],[cx+7.4,y+h*.14],[cx+6.4,y+h*.05],[cx+3.6,y+h*.05]],'#2a4a3a'); ell(g,cx+5,y+h*.16,2,1.2,'#fff2c8'); },
    pots:(g,x,y,w,h)=>{ for(let k=0;k<3;k++){ poly(g,[[x+1+k*8,y+h*.5],[x+7+k*8,y+h*.5],[x+6+k*8,y+h],[x+2+k*8,y+h]],'#c8643a'); for(let j=0;j<5;j++) ell(g,x+2+k*8+j*1.1,y+h*.4-(j%2),1,1,j%2?'#d82a3a':'#3a7a32'); } },
    edicola:(g,x,y,w,h)=>{ vfill(g,x+2,y+3,w-4,h-6,[[0,'#f6ecd8'],[1,'#d8c8ac']]); poly(g,[[x+1,y+4],[x+w-1,y+4],[x+w/2,y]],'#c86a3a'); vfill(g,x+4,y+6,w-8,h*.45,[[0,'#2a5aa8'],[1,'#1a3a6a']]); ell(g,x+w/2,y+9,1.4,1.6,'#f2d8b8'); R(g,'#f2f2ec',x+w/2-1.4,y+10.4,2.8,3.6); for(let k=0;k<3;k++) ell(g,x+5+k*3,y+h-5,1,1,['#d82a3a','#f2f2ec','#f2d23a'][k]); },
    gozzo:(g,x,y,w,h)=>{ poly(g,[[x+2,y+h*.35],[x+w-2,y+h*.25],[x+w-8,y+h],[x+8,y+h]],'#f2f2ec'); R(g,'#2a5aa8',x+6,y+h*.45,w-14,h*.2); R(g,'#c8402a',x+8,y+h*.7,w-18,h*.12); poly(g,[[x+w-2,y+h*.25],[x+w,y],[x+w-4,y+h*.3]],'#f2f2ec'); text(g,'ASSUNTA',x+20,y+h*.47,'#f2f2ec',.5); },
  },
  place(E,side,r,P){
    if(side==='pos'){
      /* the sea wall with its terracotta coping; the water below; rocks and boats */
      E.rail(0,P,11.6,-.32,.32,'stoneWall'); E.box(P/2,11.1,P,.9,.5,{f:'stucco',e:'stucco',t:'coping'},{ao:.7}); E.box(P/2,11.06,P,.1,.58,{f:'coping',e:'coping',t:'coping'},{y:.9});
      for(let i=0;i<14;i++) E.card(r()*P,12.2+r()*3,1.6+r()*1.6,.9+r()*.8,'rock',{n:2,y:-.55,sb:.8});
      for(const [u,d] of [[40,15],[66,17],[150,14.5],[200,16.5]]) E.card(u,d,5.5,1.4,'gozzo',{n:1,y:-.5});
      for(let u=6;u<P;u+=32){ E.card(u,9.2,10,8.5,'pine',{n:3,sb:.7}); }
      for(let u=0;u<P;u+=24) E.card(u+12,10.9,1.2,4.2,'lampN',{n:2,y:.9});
      for(let i=0;i<20;i++) E.card(r()*P,10.5,2.2,1.6,'oleander',{n:3,sb:.8});
      for(let i=0;i<4;i++) E.card(r()*P,9.8,4.2,6.5,'palmC',{n:3,sb:.75});
      E.card(84,9.4,1.6,1.1,'vespa',{n:1}); E.card(180,9.6,1.6,1.1,'vespa',{n:1}); E.card(132,9.7,3.4,1.9,'stallN',{n:1}); E.box(132,10.1,2.6,.9,.6,{f:'wood',e:'wood',t:'soil'});
      E.card(214,10.6,.9,1.4,'edicola',{n:1,y:.95}); }
    else {
      /* two dry-stone terraces: lemon pergolas on the first, pastel villas on the second */
      E.box(P/2,10.6,P,1.4,5,{f:'stoneWall',e:'stoneWall',t:'soil'},{ao:.7}); E.box(P/2,15.6,P,2.9,8,{f:'stoneWall',e:'stoneWall',t:'soil'},{ao:.7});
      for(let u=0;u<P;u+=3.2) for(const d of [11.2,13.2,15.2]) E.post(u,d,.12,2.3,'wood',{y:1.4,top:true});
      for(let u=0;u<P;u+=16) E.flat(u+8,10.9,16.4,4.6,'vine',{y:3.72,two:true,sh:.8});
      for(let u=0;u<P;u+=3.2) E.card(u+1.6,12.2,2.4,2.2,'lemon',{n:2,y:1.4,sb:.75});
      for(const [u,wd,c] of [[18,10,'villaY'],[64,9,'villaP'],[112,11,'villaY'],[170,9.5,'villaP'],[216,10,'villaY']]){ const d=17.2;
        E.box(u,d,wd,6.4,7,{f:c,e:'villaE',t:'stucco'},{y:2.9}); E.box(u,d-.05,wd+.3,.6,7.1,{f:'coping',e:'coping',t:'cotto'},{y:9.3}); E.card(u+wd*.3,d-.3,2.4,.6,'pots',{n:1,y:2.9+3.2}); }
      for(let i=0;i<10;i++) E.card(r()*P,16+r()*2,2.2,9,'cypress',{n:3,y:2.9,sb:.75});
      for(let i=0;i<8;i++) E.card(r()*P,4.8+r()*.4,2,2,'opuntia',{n:3,sb:.8});
      for(let i=0;i<10;i++) E.card(r()*P,9.8,1.6,1,'agave',{n:2,sb:.85});
      for(let i=0;i<30;i++) E.card(r()*P,4.4+r()*1,.8,.45,'drygrass',{n:2,sb:.75});
      E.box(60,7,3,1.35,1.4,{f:'fiat',e:'fiatE',t:'fiatT'},{ao:.6}); E.card(150,8.6,1.6,1.1,'vespa',{n:1}); }
  } };
OK.naples.kit.atlas=kitAtlas(OK.naples.kit);
