
/* =====================================================================================================
   JAPAN BY DAY (Tokyo to Hong Kong). Paddy side: flooded fields mirroring the sky, drying racks, herons, a
   shrine on the dike, farmhouses, the volcano on the horizon. Village side: a lane with vending machines and
   jizo, tiled farmhouses, bamboo groves, black pines, persimmon trees, forested hills and blue ranges.
   ===================================================================================================== */
/* farmhouse painters shared with the far cards */
function jHouse(g,x,base,w,h,o={}){ const roofH=h*.55, wallH=h-roofH*.55, r=rng(o.seed||3), wy=base-wallH;
  /* walls: dark timber below, white plaster above, posts */
  vfill(g,x,wy,w,wallH,[[0,'#f2ece0'],[.45,'#e2d8c6'],[.46,'#5a4232'],[1,'#3a2a20']]);
  for(let k=0;k<=w;k+=w/5) R(g,'#3a2a20',x+k-.3,wy,.6,wallH);
  if(o.shoji) for(let k=0;k<4;k++){ const sx=x+w*(.1+k*.2), sw=w*.16; R(g,'#e8e0c8',sx,wy+wallH*.55,sw,wallH*.38); for(let j=1;j<4;j++) R(g,'#8a7a5a',sx+j*sw/4,wy+wallH*.55,.25,wallH*.38); }
  /* hip-and-gable roof in dark glazed tile */
  const ov=w*.08, ry=base-h, ec=o.roof||'#3e4656';
  poly(g,[[x-ov,wy+.5],[x+w+ov,wy+.5],[x+w-w*.12,ry+roofH*.2],[x+w*.12,ry+roofH*.2]],ec);
  vfill(g,x-ov,ry+roofH*.2,w+ov*2,wy-ry-roofH*.2+.5,[[0,rgba('#ffffff',.18)],[1,rgba('#000000',.15)]]);
  for(let yy=ry+roofH*.25;yy<wy;yy+=1.1) R(g,rgba('#000000',.18),x-ov+(yy-ry)*.1,yy,w+ov*2-(yy-ry)*.2,.3);
  poly(g,[[x+w*.12,ry+roofH*.22],[x+w*.88,ry+roofH*.22],[x+w*.8,ry],[x+w*.2,ry]],mix(ec,'#000000',.15));
  R(g,mix(ec,'#ffffff',.25),x+w*.18,ry-.6,w*.64,1.1); R(g,rgba('#000000',.35),x-ov,wy+.5,w+ov*2,.7); }
function pagoda(g,cx,base,ht){ const tiers=5, th=ht*.78/tiers;
  for(let k=0;k<tiers;k++){ const y=base-k*th, ww=ht*.4-k*ht*.04;
    vfill(g,cx-ww*.34,y-th,ww*.68,th,[[0,'#8a3a2a'],[.5,'#b04a34'],[1,'#6a2a1e']]); for(let j=0;j<3;j++) R(g,'#e8dcc4',cx-ww*.3+j*ww*.22,y-th*.72,ww*.14,th*.42); R(g,'#4a1a14',cx-ww*.34,y-th*.3,ww*.68,.4);
    g.fillStyle=grad(g,0,y-th*1.1,0,y-th*.8,[[0,'#5a6474'],[1,'#2a3040']]); g.beginPath(); g.moveTo(cx-ww*.66,y-th*.78); g.quadraticCurveTo(cx-ww*.5,y-th*.9,cx-ww*.42,y-th*1.08); g.lineTo(cx+ww*.42,y-th*1.08); g.quadraticCurveTo(cx+ww*.5,y-th*.9,cx+ww*.66,y-th*.78); g.lineTo(cx+ww*.5,y-th*.84); g.lineTo(cx-ww*.5,y-th*.84); g.fill();
    R(g,rgba('#000000',.3),cx-ww*.5,y-th*.84,ww,.5); R(g,rgba('#ffffff',.25),cx-ww*.42,y-th*1.08,ww*.84,.35); }
  R(g,'#b89a3a',cx-.3,base-ht,.6,ht*.24); for(let k=0;k<7;k++) R(g,'#c9a23a',cx-.9+k*.04,base-ht+k*ht*.028+1.5,1.8-k*.1,.35); }
OK.japan={
  sky:()=>oSkyTex([[0,'#3f86d0'],[.55,'#9ccbee'],[.85,'#d8ecf6'],[1,'#f2f2ea']],{clouds:16,cloudShade:'#a8b8d0',seed:11,cirrus:6}),
  pos:{
    far(g,w,h,r){ const base=91;
      oRange(g,w,h,base,x=>14+opn(x,w,301,3)*7+Math.abs(opn(x,w,302,7))*5,{shade:'#8ea6c8',lit:'#b8cae2',haze:'#e8eef2'},{seed:4,hazeH:18,hazeA:.85,gullies:40});
      oRange(g,w,h,base,x=>6+opn(x,w,303,5)*4,{shade:'#6f9090',lit:'#8eaaa4',haze:'#e2eae8'},{seed:5,hazeH:10,hazeA:.6,gullies:30});
      R(g,'#a8bca4',0,base,w,h-base); },
    back(g,w,h,r){ const base=94;
      oWoodedHills(g,w,h,base,x=>10+opn(x,w,311,2)*7+opn(x,w,312,6)*3,['#3a6248','#4c7a52','#6e9a5c','#94b870'],{seed:6,size:2.4,haze:'#e4ecee',hazeH:14,hazeA:.35,fillBelow:'#6a8c5a'});
      for(let i=0;i<9;i++){ const x=20+i*56+r()*20; jHouse(g,x,base,10,7,{seed:i,roof:'#4a5262'}); }
      oHaze(g,w,0,base,'#e8eef2',.25,.05); },
    mid(g,w,h,r){ const base=95;
      /* tree line and a wooded knoll behind the fields */
      oWoodedHills(g,w,h,base-14,x=>4+opn(x,w,321,3)*4+Math.max(0,Math.sin((x/w)*Math.PI*2+1))*10,['#2e5638','#3e6c42','#5e8e4c','#86ae5e'],{seed:7,size:2.8,fillBelow:'#5e8a44'});
      /* paddies running away from the line: sky in the water, rows of seedlings, earth dikes */
      for(let y=base-14;y<base;y+=3.5){ vfill(g,0,y,w,2.6,[[0,'#b8daf0'],[1,'#8ab8d8']]); R(g,'#7a9a4a',0,y+2.6,w,.9); for(let x=(y*7)%3;x<w;x+=2.2) R(g,rgba('#4a8a3a',.7),x,y+.6,.5,1.2); }
      for(let x=30;x<w;x+=70) R(g,'#7a8a4a',x,base-14,1,14);
      /* farmhouses, a pagoda, sakura, drying racks */
      for(const [x,wd] of [[24,30],[150,26],[330,32],[430,24]]){ jHouse(g,x,base-12,wd,18,{seed:x,shoji:true}); oCrown(g,x-6,base-26,9,8,['#2e5a30','#40703a','#62904a'],x); }
      pagoda(g,250,base-12,46); oCrown(g,236,base-14,8,6,['#2e5a30','#40703a','#62904a'],5);
      for(const x of [100,205,290,380,480]) { oTrunk(g,x,base-12,base-22,1.4,.8,['#5a4434','#3a2c22','#2a2018']); oCrown(g,x,base-25,10,7,['#c86a8a','#ef9ab4','#ffcbd8','#fff2f6'],x); }
      for(const x of [60,200,360]){ for(let k=0;k<7;k++) R(g,'#6a4a2e',x+k*4,base-7,.6,5); R(g,'#6a4a2e',x,base-7,26,.6); for(let k=0;k<12;k++) R(g,k%2?'#c8a860':'#b89a50',x+.5+k*2.1,base-6.6,1.8,3); }
      /* poles along a farm road */ for(let x=12;x<w;x+=64){ R(g,'#8a8a88',x,base-30,.8,18); R(g,'#5a5a58',x-2.5,base-29,5.8,.6); } g.strokeStyle='#2a2a2a'; g.lineWidth=.25; for(let x=12;x<w;x+=64){ g.beginPath(); g.moveTo(x-2,base-28.6); g.quadraticCurveTo(x+30,base-26,x+62,base-28.6); g.stroke(); } },
    verge:()=>PX(256,160,4,(g,w,h)=>{ const r=rng(17);
      /* far edge (top) to the line (bottom): paddies, a grass dike, a concrete channel, the gravel shoulder */
      const dike=x=>[0,64,128,192].some(k=>Math.abs(((x-k)%256+256)%256)<3);
      /* water holding the sky: a soft gradient, cloud reflections, ripples */
      vfill(g,0,0,w,h-30,[[0,'#a8cce6'],[.6,'#94bede'],[1,'#7aa8c8']]);
      for(let i=0;i<18;i++){ const x=r()*w, y=r()*(h-40); ell(g,x,y,10+r()*16,2+r()*3,rgba('#ffffff',.35)); ell(g,x+3,y+1,8+r()*8,1.4,rgba('#ffffff',.25)); }
      for(let i=0;i<80;i++) ell(g,r()*w,r()*(h-32),2+r()*5,.25,rgba('#5a88aa',.35));
      /* seedlings in loose rows, each clump a few blades with a dark reflection under it */
      for(let y=2;y<h-32;y+=4.6) for(let x=1+(y*3)%2;x<w;x+=2.4){ if(dike(x)) continue; const jx=x+(r()-.5)*.9, jy=y+(r()-.5)*1.2, s=.8+r()*.5;
        R(g,rgba('#3a6a7a',.35),jx-.2,jy+1.4*s,1.2*s,.6); for(let k=0;k<3;k++) R(g,['#4a8a32','#6aaa42','#8ac458'][k],jx+k*.35*s,jy-(k===1?.4:0),.35*s,1.5*s); }
      for(let k of [0,64,128,192]) for(let y=0;y<h-30;y+=2) ell(g,k+(r()-.5)*7,y,1.4,.5,rgba('#6a5a3a',.25));
      for(const k of [0,64,128,192]){ vfill(g,k-3,0,6,h-30,[[0,'#8a8a52'],[1,'#7a7a48']]); for(let y=0;y<h-30;y+=1.5) R(g,r()<.5?'#6a8a3a':'#9aaa5a',k-3+r()*6,y,1,1.2); }
      vfill(g,0,h-30,w,7,[[0,'#7a9a48'],[1,'#5e7e36']]); for(let x=0;x<w;x+=.8) R(g,r()<.5?'#8aaa50':'#4e6e2e',x,h-30+r()*6,.5,1.5);
      vfill(g,0,h-23,w,8,[[0,'#a8a69e'],[.2,'#c8c6be'],[.3,'#6a7a7e'],[.8,'#5a6a6e'],[.9,'#c8c6be'],[1,'#8a8880']]); for(let x=0;x<w;x+=16) R(g,'#7a7870',x,h-23,.4,8);
      for(let i=0;i<20;i++) ell(g,r()*w,h-19+r()*2,2+r()*3,.3,rgba('#ffffff',.3));
      vfill(g,0,h-15,w,15,[[0,'#8a8478'],[1,'#7a746a']]); for(let i=0;i<2600;i++) R(g,['#a8a294','#6a645a','#94907e','#5a564e'][i%4],r()*w,h-15+r()*15,.6+r()*.6,.5+r()*.4); }),
    vergeW:20, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ const r=rng(23); R(g,'#7aa860',0,0,w,h); for(let y=0;y<h;y+=16) for(let x=0;x<w;x+=32){ const c=['#9ac4d8','#86b4cc','#7aa860','#8ab468','#a6c088'][r()*5|0]; vfill(g,x+1,y+1,30,14,[[0,mix(c,'#ffffff',.1)],[1,c]]); } for(let x=0;x<w;x+=32) R(g,'#6a8a48',x,0,1.2,h); for(let y=0;y<h;y+=16) R(g,'#6a8a48',0,y,w,1.2); },6,23), groundTile:48 },
  neg:{
    far(g,w,h,r){ const base=91, cx=150;
      oRange(g,w,h,base,x=>12+opn(x,w,331,3)*6+Math.abs(opn(x,w,332,8))*4,{shade:'#94aacb',lit:'#bccce4',haze:'#eaf0f4'},{seed:8,hazeH:16,hazeA:.85,gullies:30});
      /* the volcano: a long concave cone, snowfields running down the gullies */
      const vol=x=>{ const d=Math.abs(((x-cx)%w+w)%w>w/2?((x-cx)%w+w)%w-w:((x-cx)%w+w)%w)/110; return d<1?Math.max(0,40*Math.pow(1-d,1.6)-(d<.06?1.2:0)):0; };
      oRange(g,w,h,base,x=>vol(x),{shade:'#6c7ea8',lit:'#9cb0d4',snow:'#f8faff',snowShade:'#c4d0e6',haze:'#e8eef4',dark:'#5a6a94'},{seed:9,snowLine:.42,hazeH:14,hazeA:.7,gullies:60,light:1});
      oRange(g,w,h,base,x=>5+opn(x,w,333,5)*3.5,{shade:'#6a8c86',lit:'#88a8a0',haze:'#e2eae8'},{seed:10,hazeH:8,hazeA:.5});
      R(g,'#a4b8a0',0,base,w,h-base); },
    back(g,w,h,r){ const base=94;
      oWoodedHills(g,w,h,base,x=>12+opn(x,w,341,2)*9+opn(x,w,342,5)*3,['#36603e','#467448','#689656','#8eb46a'],{seed:12,size:2.4,haze:'#e4ecee',hazeH:16,hazeA:.4,fillBelow:'#5e8650'});
      /* a temple roof in the trees */ jHouse(g,300,base-12,22,12,{roof:'#3a3e48',seed:2}); R(g,'#c8402a',298,base-6,1,6); R(g,'#c8402a',322,base-6,1,6);
      oHaze(g,w,0,base,'#e8eef2',.22,.05); },
    mid(g,w,h,r){ const base=95;
      oWoodedHills(g,w,h,base-6,x=>10+opn(x,w,351,3)*6+opn(x,w,352,7)*2,['#2a5234','#3a663e','#5a8a4a','#82aa5a'],{seed:13,size:2.6,fillBelow:'#4e7a3e'});
      /* bamboo groves */ for(const x of [40,210,400]) for(let k=0;k<26;k++){ const bx=x+k*1.3+r()*.6, top=base-30-r()*8; R(g,k%3?'#6a9a46':'#88b45a',bx,top,.6,base-top-4); for(let j=0;j<6;j++) ell(g,bx+(r()-.5)*4,top+r()*16,2.2,.6,['#4a7a32','#6a9a42','#8ab858'][j%3]); }
      /* the village: houses along the lane, garden walls, persimmons */
      for(const [x,wd] of [[70,30],[120,24],[260,34],[310,26],[450,30]]){ jHouse(g,x,base-3,wd,20,{seed:x,shoji:true,roof:x%3?'#3e4656':'#5a4a40'}); }
      R(g,'#e8e2d4',0,base-4,w,3); R(g,'#5a5a62',0,base-4.4,w,.8); for(let x=0;x<w;x+=8) R(g,rgba('#000000',.08),x,base-4,.4,3);
      for(const x of [100,180,240,350,420,500]){ oTrunk(g,x,base-3,base-14,1.2,.7,['#5a4434','#3a2c22','#2a2018']); oCrown(g,x,base-17,7,6,['#2e5a2a','#4a7e36','#78a848'],x); for(let k=0;k<6;k++) ell(g,x+(r()-.5)*10,base-17+(r()-.5)*7,.7,.7,'#f0782a'); }
      for(const x of [160,380]){ R(g,'#c83a2a',x,base-14,1.2,11); R(g,'#c83a2a',x+9,base-14,1.2,11); R(g,'#2a2220',x-2,base-15.4,13.2,1.4); R(g,'#c83a2a',x-1,base-12.6,11,.8); }
      for(let x=30;x<w;x+=72){ R(g,'#8a8a88',x,base-30,.8,27); R(g,'#5a5a58',x-2.5,base-29,5.8,.6); } g.strokeStyle='#2a2a2a'; g.lineWidth=.25; for(let x=30;x<w;x+=72){ g.beginPath(); g.moveTo(x-2,base-28.6); g.quadraticCurveTo(x+36,base-25,x+72,base-28.6); g.stroke(); } },
    verge:()=>PX(256,160,4,(g,w,h)=>{ const r=rng(19);
      /* far edge: grass and garden plots; then the lane; grass with clover and flowers; the gravel shoulder */
      vfill(g,0,0,w,h-15,[[0,'#6a9a48'],[1,'#7aaa52']]);
      for(let i=0;i<5000;i++){ const x=r()*w, y=r()*(h-15); R(g,['#8ab858','#5a8a3a','#6e9e46','#98c068'][i%4],x,y,.5,1.1); }
      for(let i=0;i<60;i++){ const x=r()*w, y=40+r()*(h-60); ell(g,x,y,3+r()*4,1.5+r()*1.5,rgba('#4e7e34',.6)); ell(g,x-1,y-.6,2,1,rgba('#9ac868',.5)); }
      for(let i=0;i<260;i++) ell(g,r()*w,30+r()*(h-50),.45,.35,['#ffffff','#f2d23a','#e88aa8','#c8a0e8'][i%4]);
      /* vegetable plots at the far edge */ for(const x of [10,96,170]){ R(g,'#7a5a3a',x,4,60,22); for(let k=0;k<6;k++){ R(g,'#5a3e28',x,6+k*3.6,60,.8); for(let j=0;j<60;j+=2.4) ell(g,x+j+1,5.6+k*3.6,1,.8,['#4a8a3a','#6aaa4a'][j%2|0]); } }
      /* the lane (d 11-13.8) */ vfill(g,0,78,w,23,[[0,'#5a5a5c'],[.5,'#68686a'],[1,'#5a5a5c']]); for(let i=0;i<900;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.08),r()*w,78+r()*23,.7,.5); R(g,'#e8e6dc',0,80,w,.7); R(g,'#e8e6dc',0,98.5,w,.7); for(let i=0;i<8;i++){ const x=r()*w; ell(g,x,85+r()*10,4+r()*6,1.2,rgba('#3a3a3c',.35)); }
      R(g,'#8a8a82',0,101,w,2); R(g,'#9a9a92',0,76,w,2); vfill(g,0,62,w,14,[[0,'#6a8a48'],[1,'#7a9a52']]);
      vfill(g,0,h-15,w,15,[[0,'#8a8478'],[1,'#7a746a']]); for(let i=0;i<2600;i++) R(g,['#a8a294','#6a645a','#94907e','#5a564e'][i%4],r()*w,h-15+r()*15,.6+r()*.6,.5+r()*.4); }),
    vergeW:20, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ const r=rng(29); R(g,'#6e9a52',0,0,w,h); for(let y=0;y<h;y+=21) for(let x=0;x<w;x+=43){ const c=['#7aa85a','#8ab060','#a6b86a','#5e8a46','#9a9a5a'][r()*5|0]; vfill(g,x+1,y+1,41,19,[[0,mix(c,'#ffffff',.08)],[1,c]]); for(let k=y+3;k<y+20;k+=3) R(g,rgba('#000000',.06),x+1,k,41,.6); } },6,29), groundTile:56 }
};

/* the trackside kit: one atlas, 3D posts and boxes and crossed cards */
OK.japan.kit={S:4,
  cells:{pole:[0,0,6,96],arm:[6,0,6,24],xfmr:[12,0,14,20],wire:[26,0,4,4],sakura:[32,0,64,64],bamboo:[96,0,40,64],persim:[136,0,48,56],bpine:[184,0,48,56],shrub:[232,0,24,20],grass:[232,20,24,14],
    houseF:[0,96,72,40],houseE:[72,96,40,40],roof:[112,96,48,32],tin:[160,96,32,32],shedF:[192,96,48,32],
    stone:[0,136,16,16],red:[16,136,8,16],black:[24,136,8,16],jizo:[32,136,16,24],vend:[48,136,20,36],vendS:[68,136,10,36],hasa:[80,136,64,28],heron:[144,136,16,16],kakashi:[160,136,16,28],post:[176,136,6,24],wood:[182,136,16,16],plaster:[198,136,16,16],xsign:[214,136,24,40],stripe:[238,136,8,32],
    wall:[0,176,64,16],cap:[64,176,32,8],tufts:[96,176,48,20],reeds:[144,176,48,24],flowers:[192,176,48,16]},
  atlas(g,W,H){ const C=this.cells, cl=(k,fn)=>oCell(g,C[k],fn);
    cl('pole',(g,x,y,w,h)=>{ hfill(g,x,y,w,h,[[0,'#8a8a86'],[.3,'#c8c8c2'],[.6,'#a2a29c'],[1,'#6a6a66']]); for(let k=0;k<8;k++) R(g,rgba('#000000',.06),x,y+k*12+3,w,.4); for(let k=0;k<5;k++) R(g,k%2?'#1a1a1a':'#f2d23a',x,y+h-14+k*2.4,w,2.4); R(g,'#e8e4d8',x+.8,y+46,w-1.6,6); R(g,'#c83a2a',x+1.2,y+47,w-2.4,1); });
    cl('arm',(g,x,y,w,h)=>oMetal(g,x,y,w,h,'#7a7e84'));
    cl('xfmr',(g,x,y,w,h)=>{ oMetal(g,x+1,y+3,w-2,h-4,'#9aa0a6',{bands:4}); R(g,'#6a6e74',x,y+2,w,1.4); R(g,'#3a3a3e',x+3,y,2,3); R(g,'#3a3a3e',x+w-5,y,2,3); });
    cl('wire',(g,x,y,w,h)=>R(g,'#1e1e22',x,y,w,h));
    cl('sakura',(g,x,y,w,h)=>oTree(g,x,y,w,h,'blossom',31,{n:34}));
    cl('bamboo',(g,x,y,w,h)=>oTree(g,x,y,w,h,'bamboo',33));
    cl('persim',(g,x,y,w,h)=>oTree(g,x,y,w,h,'persimmon',35,{pal:['#3a5a2a','#5a7e34','#8aa848','#c8c060']}));
    cl('bpine',(g,x,y,w,h)=>{ const r=rng(37); oTrunk(g,x+w*.45,y+h,y+h*.45,w*.08,w*.05,['#4a3a30','#2a2018','#1e1610'],{lean:w*.1}); oBranch(g,x+w*.5,y+h*.5,x+w*.15,y+h*.3,w*.04,'#3a2a20'); oBranch(g,x+w*.52,y+h*.45,x+w*.85,y+h*.25,w*.04,'#3a2a20');
      for(const [cx,cy,rx] of [[.15,.25,.16],[.85,.22,.15],[.55,.12,.18],[.4,.38,.14]]){ const px=x+cx*w, py=y+cy*h; ell(g,px,py+1.5,rx*w*1.05,rx*w*.42,'#1a3020'); oCrown(g,px,py,rx*w,rx*w*.38,['#1e3a28','#2e5236','#4a7048','#6a8a58'],cx*99,{n:14}); } });
    cl('shrub',(g,x,y,w,h)=>oTree(g,x,y,w,h,'shrub',39,{pal:['#2a4a26','#3e6a30','#6a9a44','#9ac060']}));
    cl('grass',(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',41,{flowers:['#ffffff','#f2d23a']}));
    cl('houseF',(g,x,y,w,h)=>{ /* front: plaster above, timber below, sliding doors, shoji, a porch light */
      vfill(g,x,y,w,h,[[0,'#f6f0e4'],[.5,'#e2d8c4'],[.52,'#6a4e38'],[1,'#3e2c20']]); for(let k=0;k<=w;k+=w/6) R(g,'#3a2a20',x+k-.4,y,.8,h);
      R(g,'#3a2a20',x,y+h*.5,w,.8); for(let k=0;k<3;k++){ const sx=x+w*(.08+k*.31), sw=w*.22; R(g,'#4a3628',sx-.4,y+h*.08,sw+.8,h*.32); vfill(g,sx,y+h*.1,sw,h*.28,[[0,'#f2ead2'],[1,'#d8ccae']]); for(let j=1;j<5;j++) R(g,'#8a7656',sx+j*sw/5,y+h*.1,.3,h*.28); for(let j=1;j<4;j++) R(g,'#8a7656',sx,y+h*.1+j*h*.07,sw,.3); }
      for(let k=0;k<4;k++){ const dx=x+w*(.12+k*.2), dw=w*.18; vfill(g,dx,y+h*.56,dw,h*.44,[[0,'#7a6248'],[1,'#4a3628']]); for(let j=0;j<6;j++) R(g,rgba('#000000',.25),dx,y+h*.56+j*h*.073,dw,.3); R(g,'#c8b896',dx+dw-.8,y+h*.72,.4,2); }
      R(g,'#ffe8a8',x+w*.5,y+h*.5,1.4,1.4); vfill(g,x,y+h-3,w,3,[[0,rgba('#000000',0)],[1,rgba('#000000',.35)]]); });
    cl('houseE',(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#ece4d2'],[.55,'#d8ccb4'],[.57,'#5a4232'],[1,'#3a2a20']]); for(let k=0;k<=w;k+=w/3) R(g,'#3a2a20',x+k-.4,y,.8,h); R(g,'#3a2a20',x,y+h*.55,w,.8); R(g,'#4a3628',x+w*.35,y+h*.18,w*.3,h*.22); vfill(g,x+w*.37,y+h*.2,w*.26,h*.18,[[0,'#f2ead2'],[1,'#d8ccae']]); });
    cl('roof',(g,x,y,w,h)=>oRoofTiles(g,x,y,w,h,'#4a5466',{rows:12,pitch:1.6}));
    cl('tin',(g,x,y,w,h)=>{ oRoofTiles(g,x,y,w,h,'#9a6a4a',{rows:3,pitch:1.2}); const r=rng(5); for(let i=0;i<40;i++) ell(g,x+r()*w,y+r()*h,1+r()*3,.5+r()*1,rgba('#6a3a20',.35)); });
    cl('shedF',(g,x,y,w,h)=>{ oPlanks(g,x,y,w,h,'#6a5038',{vert:true,n:16}); R(g,'#2a1e16',x+w*.35,y+h*.3,w*.3,h*.7); R(g,'#3a2a1e',x+w*.36,y+h*.32,w*.28,h*.66); });
    cl('stone',(g,x,y,w,h)=>oStone(g,x,y,w,h,'#9a968a',{seed:3}));
    cl('red',(g,x,y,w,h)=>hfill(g,x,y,w,h,[[0,'#a82a1c'],[.35,'#e04a30'],[1,'#8a2014']]));
    cl('black',(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#4a4440'],[1,'#1a1614']]));
    cl('jizo',(g,x,y,w,h)=>{ const cx=x+w/2; ell(g,cx,y+h*.82,w*.42,h*.2,'#8a867a'); vfill(g,cx-w*.3,y+h*.3,w*.6,h*.55,[[0,'#a8a498'],[1,'#7a766a']]); ell(g,cx,y+h*.24,w*.24,h*.13,'#aeaa9e'); ell(g,cx-w*.06,y+h*.2,w*.1,h*.06,'#c8c4b8');
      poly(g,[[cx-w*.32,y+h*.38],[cx+w*.32,y+h*.38],[cx,y+h*.62]],'#d8302a'); poly(g,[[cx-w*.28,y+h*.39],[cx,y+h*.39],[cx,y+h*.55]],'#f04a3a'); R(g,'#5a564a',x+2,y+h-2,w-4,2); });
    cl('vend',(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f2f2ee'],[1,'#c8c8c4']]); R(g,'#c83a2a',x,y,w,4); text(g,'DRINK',x+3,y+1,'#ffffff',.5);
      R(g,'#1a2a3a',x+1.5,y+5,w-3,h*.42); for(let r_=0;r_<3;r_++) for(let k=0;k<5;k++){ const cx=x+3+k*3, cy=y+7+r_*5; vfill(g,cx,cy,2,3.4,[[0,['#f2c230','#2a8a5a','#e04a30','#2a6ad8','#f2f2f2'][(k+r_)%5]],[1,'#3a3a3a']]); R(g,'#ffffff',cx+.4,cy+.4,.5,2); }
      for(let k=0;k<5;k++) R(g,'#e04a3a',x+3+k*3,y+21.4,1.6,.8); R(g,'#3a3a40',x+3,y+h*.62,w-6,h*.1); R(g,'#2a2a30',x+3,y+h*.82,w-6,h*.1); R(g,'#8a8a90',x+w-6,y+h*.55,3,4); radial(g,x+w/2,y+h*.3,w*.6,[[0,rgba('#e8f4ff',.25)],[1,rgba('#e8f4ff',0)]]); });
    cl('vendS',(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#dcdcd8'],[1,'#a8a8a4']]); R(g,'#a82a1c',x,y,w,4); });
    cl('hasa',(g,x,y,w,h)=>{ const r=rng(43); for(let k=0;k<6;k++){ const px=x+2+k*12; R(g,'#5a4430',px,y+2,1.2,h-2); } R(g,'#6a5038',x,y+4,w,1.2);
      for(let i=0;i<34;i++){ const bx=x+1+i*1.85+(r()-.5)*.4; vfill(g,bx,y+4.6,1.7,h*.62,[[0,'#d8bc6a'],[.6,'#b89a4a'],[1,'#8a7036']]); R(g,'#e8d488',bx+.3,y+5,.4,h*.5); R(g,'#6a5a30',bx,y+5.4,1.7,.4); } });
    cl('heron',(g,x,y,w,h)=>{ const cx=x+w*.5; R(g,'#3a3a3a',cx-1,y+h*.65,.4,h*.35); R(g,'#3a3a3a',cx+1,y+h*.65,.4,h*.35); ell(g,cx,y+h*.55,w*.24,h*.14,'#f6f6f2'); ell(g,cx+w*.04,y+h*.6,w*.18,h*.08,'#d8dcdc');
      g.strokeStyle='#f6f6f2'; g.lineWidth=1.3; g.beginPath(); g.moveTo(cx-w*.15,y+h*.5); g.quadraticCurveTo(cx-w*.3,y+h*.32,cx-w*.2,y+h*.18); g.stroke(); ell(g,cx-w*.22,y+h*.17,w*.08,h*.05,'#f6f6f2'); poly(g,[[cx-w*.28,y+h*.16],[cx-w*.46,y+h*.19],[cx-w*.28,y+h*.19]],'#e8b030'); });
    cl('kakashi',(g,x,y,w,h)=>{ const cx=x+w/2; R(g,'#6a5038',cx-.4,y+h*.25,.8,h*.75); R(g,'#6a5038',x+1,y+h*.36,w-2,.8); poly(g,[[cx-w*.38,y+h*.36],[cx+w*.38,y+h*.36],[cx+w*.28,y+h*.66],[cx-w*.28,y+h*.66]],'#3a5a8a'); for(let k=0;k<5;k++) R(g,'#2a4a7a',cx-w*.3+k*w*.15,y+h*.4,.3,h*.25);
      ell(g,cx,y+h*.24,w*.17,h*.08,'#e8e0c8'); poly(g,[[cx-w*.42,y+h*.2],[cx+w*.42,y+h*.2],[cx,y+h*.06]],'#d8b860'); R(g,'#2a2a2a',cx-1.2,y+h*.23,.6,.6); R(g,'#2a2a2a',cx+.8,y+h*.23,.6,.6); });
    cl('post',(g,x,y,w,h)=>hfill(g,x,y,w,h,[[0,'#8a8a84'],[.4,'#c8c6be'],[1,'#6a6a64']]));
    cl('wood',(g,x,y,w,h)=>oPlanks(g,x,y,w,h,'#5a4232',{vert:true,n:4}));
    cl('plaster',(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#f2ece0'],[1,'#d2c8b2']]));
    cl('xsign',(g,x,y,w,h)=>{ R(g,'#2a2a2a',x+w/2-.6,y+12,1.2,h-12); g.save(); g.translate(x+w/2,y+7); for(const a of [.6,-.6]){ g.save(); g.rotate(a); for(let k=-5;k<5;k++) R(g,k%2?'#1a1a1a':'#f2d23a',k*2,-1.4,2,2.8); g.restore(); } g.restore(); for(const dx of [-5,5]){ ell(g,x+w/2+dx,y+16,2.4,2.4,'#1a1a1a'); ell(g,x+w/2+dx,y+16,1.6,1.6,'#c8202a'); } });
    cl('stripe',(g,x,y,w,h)=>{ for(let k=0;k<h;k+=4) R(g,(k/4)%2?'#1a1a1a':'#f2d23a',x,y+k,w,4); });
    cl('wall',(g,x,y,w,h)=>{ oStone(g,x,y,w,h*.55,'#a8a49a',{blocks:3.5,seed:9}); vfill(g,x,y+h*.55,w,h*.45,[[0,'#8a8478'],[1,'#6a6458']]); });
    cl('cap',(g,x,y,w,h)=>oRoofTiles(g,x,y,w,h,'#4a5466',{rows:2,pitch:1.4}));
    cl('tufts',(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',47,{pal:['#3e6a2a','#5a8a3a','#8ab050','#b8c870']}));
    cl('reeds',(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',49,{pal:['#5a7a3a','#7a9a4a','#a8b860','#c8c080']}));
    cl('flowers',(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',51,{pal:['#4a7a32','#5a8a3a','#7aa848','#8ab858'],flowers:['#f2d23a','#ffffff','#e88aa8']})); },
  place(E,side,r,P){ const s=E.s;
    /* a low fence of concrete posts and two wires right beside the line */
    for(let u=0;u<P;u+=2.5) E.post(u,4.25,.1,1.1,'post',{top:true}); E.rail(0,P,4.2,.95,.04,'wire'); E.rail(0,P,4.2,.55,.04,'wire');
    /* grass and flower tufts along the shoulder and in the grass */
    for(let i=0;i<70;i++){ const u=r()*P, d=4.6+r()*(side==='pos'?1.5:3.5); E.card(u,d,.7+r()*.6,.3+r()*.25,['tufts','flowers','grass'][i%3],{n:2,sb:.7}); }
    /* concrete poles every 40 m with crossarms, transformers and three sagging wires */
    const pd=side==='pos'?6.2:5.6;
    for(let u=(side==='pos'?6:26);u<P;u+=40){ E.post(u,pd,.28,9.2,'pole',{top:true,ao:1}); E.box(u,pd-.9,.1,.1,2.0,'arm',{y:8.4}); E.box(u,pd-.6,.08,.08,1.4,'arm',{y:7.6});
      if((u/40|0)%2===0) E.box(u+.25,pd-.18,.36,.7,.36,{f:'xfmr',e:'xfmr',t:'arm'},{y:6.6}); }
    for(let u=(side==='pos'?6:26)-40;u<P;u+=40) for(const [dd,yy] of [[-.85,8.5],[0,8.5],[.85,8.5],[-.5,7.7],[.4,7.7]]) E.wire(u,u+40,pd+dd,yy,.45,'wire',.035);
    if(side==='pos'){
      /* paddies: drying racks, herons, a scarecrow, sakura on the dikes, a shrine with its torii */
      for(const u of [30,118,190]){ E.card(u,11+r()*5,7,2.4,'hasa',{n:1,sb:.85}); }
      for(let i=0;i<7;i++) E.card(r()*P,8+r()*10,.9,.9,'heron',{n:2,sb:.9});
      E.card(70,13,1.2,2.1,'kakashi',{n:2}); E.card(160,15,1.2,2.1,'kakashi',{n:2});
      for(const [u,d] of [[52,9.5],[96,17],[142,10],[214,14],[232,21]]){ E.card(u,d,6.5,6.5,'sakura',{n:3,sb:.7}); E.post(u,d,.3,2.6,'wood'); }
      for(const u of [168]){ const d=19; E.box(u,d,1.6,1.4,1.4,{f:'wood',e:'wood',t:null},{y:.3}); E.gable(u,d,1.6,1.4,1.7,.7,'cap',{ov:.25}); E.box(u,d-.3,1.8,.3,2,{f:'stone',e:'stone',t:'stone'});
        for(const dx of [-1.4,1.4]) E.post(u+dx,d-2.6,.22,3.2,'red',{top:true}); E.box(u,d-2.72,4.2,.25,.3,{f:'black',e:'black',t:'black'},{y:3.2}); E.box(u,d-2.68,3.4,.18,.2,{f:'red',e:'red',t:'red'},{y:2.6});
        for(const dx of [-2.6,2.6]){ E.box(u+dx,d-1.4,.5,.6,.5,'stone'); E.box(u+dx,d-1.32,.3,.5,.3,'stone',{y:.6}); E.box(u+dx,d-1.5,.7,.25,.7,'stone',{y:1.1}); } }
      /* a farmhouse at the far edge of the paddies, a shed */
      E.box(84,18.4,12,.6,8,{f:'wall',e:'wall',t:'stone'}); E.box(84,19,9,3.2,6,{f:'houseF',e:'houseE',t:null},{y:.6}); E.gable(84,19,9,6,3.8,2.4,'roof',{ov:.7,gc:'houseE'}); E.card(78.5,18.8,4,4.5,'persim',{n:3,y:.6});
      E.box(222,18.1,5,.6,4.4,{f:'wall',e:'wall',t:'stone'}); E.box(222,18.5,4,2.6,3.5,{f:'shedF',e:'shedF',t:null},{y:.6}); E.gable(222,18.5,4,3.5,3.2,1.1,'tin',{ov:.3});
      for(let i=0;i<14;i++) E.card(r()*P,10+r()*10,1.6,.8,'reeds',{n:2,sb:.75}); }
    else {
      /* the lane side: houses with walls and gardens, vending machines, jizo, bamboo, pines, a level-crossing sign */
      for(const [u,wd,dp] of [[18,9,6],[64,8,6],[132,10,7],[196,8.5,6]]){ const d=15.6;
        E.box(u,d,wd,3.4,dp,{f:'houseF',e:'houseE',t:null}); E.gable(u,d,wd,dp,3.4,2.5,'roof',{ov:.7,gc:'houseE'});
        E.box(u,d-1.4,wd+3,1.2,.3,{f:'wall',e:'wall',t:'cap'}); E.box(u,d-1.46,wd+3.3,.12,.42,{f:'cap',e:'cap',t:'cap'},{y:1.2});
        E.card(u+wd/2+1.6,d-.6,3.4,4.2,r()<.5?'persim':'bpine',{n:3}); }
      for(const u of [40,170]){ E.box(u,9.9,1.1,1.85,.75,{f:'vend',e:'vendS',t:'vendS'}); E.box(u+1.2,9.9,1.1,1.85,.75,{f:'vend',e:'vendS',t:'vendS'}); }
      for(const u of [100,226]){ for(let k=0;k<3;k++) E.card(u+k*.7,9.9,.55,.8,'jizo',{n:2,sb:.9}); E.box(u+.7,10.3,2.6,1.6,.5,{f:'wood',e:'wood',t:null}); E.gable(u+.7,10.25,2.6,.6,1.6,.4,'cap',{ov:.2}); }
      for(const u of [86,150,236]) for(let k=0;k<4;k++) E.card(u+k*1.8+r(),16+r()*5,3.2,7+r()*1.5,'bamboo',{n:3,sb:.7});
      for(let i=0;i<10;i++) E.card(r()*P,7+r()*1.6,1.6,1.1,'shrub',{n:3,sb:.7});
      E.card(118,7.2,1.6,2.6,'xsign',{n:1}); }
  } };
