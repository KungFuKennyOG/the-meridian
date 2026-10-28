
/* =====================================================================================================
   SIBERIA, BY LAKE BAIKAL, IN SNOW. Lake side: snow fences and leaning telegraph poles, birches and reeds at
   the shore, upturned boats and a banya, the frozen lake with fishing huts, white ranges beyond. Forest side:
   a village road, log izbas with blue carved window frames and snow-laden roofs, picket fences, woodpiles,
   a parked car under snow, the onion-domed church, then taiga to the hills.
   ===================================================================================================== */
function sibIzba(g,x,base,w,h,o={}){ const r=rng(o.seed||1), wallH=h*.55, wy=base-wallH;
  for(let y=wy;y<base;y+=1.6) vfill(g,x,y,w,1.6,[[0,'#8a6440'],[.5,'#6a4a2e'],[1,'#3e2a1a']]);
  for(let k=0;k<3;k++){ const wx=x+w*(.14+k*.28), ww=w*.14; R(g,'#e8eef4',wx-1,wy+wallH*.18,ww+2,wallH*.62); R(g,'#2a6ab0',wx-.6,wy+wallH*.22,ww+1.2,wallH*.54); vfill(g,wx,wy+wallH*.26,ww,wallH*.42,[[0,o.lit?'#ffe0a0':'#c8d8e4'],[1,o.lit?'#e8b060':'#5a6a78']]); poly(g,[[wx-1.4,wy+wallH*.2],[wx+ww+1.4,wy+wallH*.2],[wx+ww/2,wy+wallH*.04]],'#2a6ab0'); }
  const ry=base-h; poly(g,[[x-2,wy+.4],[x+w+2,wy+.4],[x+w/2,ry]],'#eef2f6'); poly(g,[[x+w/2,ry],[x+w+2,wy+.4],[x+w*.8,wy+.4]],'#c8d4e2'); R(g,'#5a4a3a',x-2,wy+.2,w+4,.6);
  poly(g,[[x+w*.2,wy],[x+w*.8,wy],[x+w/2,ry+h*.12]],'#7a5434'); R(g,'#e8eef4',x+w/2-1,wy-wallH*.45,2,2.4); if(o.smoke){ for(let k=0;k<6;k++) ell(g,x+w*.7+k*1.4,ry-2-k*3,1.5+k*.6,1.2+k*.4,rgba('#e8ecf0',.5-k*.06)); R(g,'#6a4a3a',x+w*.68,ry+h*.1,1.4,4); } }
function sibChurch(g,cx,base,s){ R(g,'#f2ece0',cx-14*s,base-26*s,28*s,26*s); vfill(g,cx-14*s,base-26*s,28*s,26*s,[[0,'#fbf6ec'],[1,'#d8d0c0']]); for(let k=0;k<3;k++){ R(g,'#4a5a7a',cx-9*s+k*7*s,base-18*s,3*s,7*s); poly(g,[[cx-9*s+k*7*s,base-18*s],[cx-6*s+k*7*s,base-18*s],[cx-7.5*s+k*7*s,base-20*s]],'#4a5a7a'); }
  R(g,'#f2ece0',cx-5*s,base-40*s,10*s,14*s); poly(g,[[cx-16*s,base-26*s],[cx+16*s,base-26*s],[cx+12*s,base-29*s],[cx-12*s,base-29*s]],'#4a7a6a');
  for(const [dx,yy,sz] of [[0,-40,8],[-11,-29,4.5],[11,-29,4.5]]){ const X=cx+dx*s, Y=base+yy*s, S_=sz*s; g.fillStyle=grad(g,X-S_,0,X+S_,0,[[0,'#5a9ae0'],[.4,'#2a6ab0'],[1,'#1a4a80']]); g.beginPath(); g.moveTo(X-S_,Y); g.bezierCurveTo(X-S_*1.2,Y-S_*1.1,X-S_*.2,Y-S_*1.4,X,Y-S_*2); g.bezierCurveTo(X+S_*.2,Y-S_*1.4,X+S_*1.2,Y-S_*1.1,X+S_,Y); g.fill();
    for(let k=0;k<8;k++) ell(g,X-S_*.6+k*S_*.17,Y-S_*.7+Math.sin(k)*S_*.2,S_*.08,S_*.08,'#f2d260'); R(g,'#d4ad5a',X-.3*s,Y-S_*2.9,.6*s,S_*.9); R(g,'#d4ad5a',X-1*s,Y-S_*2.6,2*s,.4*s); } }

OK.siberia={
  sky:()=>oSkyTex([[0,'#8a96aa'],[.5,'#b4bec8'],[.85,'#d8dee4'],[1,'#e8ecf0']],{clouds:22,cloudCol:'#e2e6ec',cloudShade:'#9aa4b4',seed:41,haze:'#e8ecf0'}),
  pos:{ groundK:.5,
    far(g,w,h,r){ const base=91;
      oRange(g,w,h,base,x=>16+opn(x,w,501,3)*8+Math.abs(opn(x,w,502,7))*6,{shade:'#9aaabc',lit:'#c8d2de',snow:'#eef2f6',snowShade:'#b8c4d4',haze:'#e2e8ee',dark:'#8a9aae'},{seed:15,snowLine:.25,hazeH:22,hazeA:.85,gullies:80});
      oRange(g,w,h,base,x=>5+opn(x,w,503,4)*3,{shade:'#4a5a5a',lit:'#6a7a78',haze:'#dfe6ec'},{seed:16,hazeH:6,hazeA:.7});
      vfill(g,0,base,w,h-base,[[0,'#cddbe6'],[1,'#e6eef4']]); for(let i=0;i<80;i++) ell(g,r()*w,base+1+r()*(h-base-1),3+r()*8,.3,rgba('#ffffff',.6)); },
    back(g,w,h,r){ const base=95; R(g,'#dde6ee',0,base-2,w,3);
      for(let i=0;i<14;i++){ const x=r()*w, c=['#c8402a','#2a6ab0','#4a7a3a','#d8a020','#7a5434'][i%5], hw=4+r()*3; vfill(g,x,base-hw*.9,hw,hw*.9,[[0,mix(c,'#ffffff',.15)],[1,mix(c,'#000000',.2)]]); poly(g,[[x-.6,base-hw*.9],[x+hw+.6,base-hw*.9],[x+hw/2,base-hw*1.35]],'#f2f6fa'); R(g,'#3a3a3e',x+hw*.4,base-hw*.5,hw*.25,hw*.5);
        for(let k=0;k<2;k++){ const px=x+hw+2+k*2.2; R(g,'#2a2a30',px,base-2.6,.8,2.2); ell(g,px+.4,base-3,.6,.6,'#c8a080'); } }
      for(let i=0;i<50;i++) ell(g,r()*w,base-1+r()*1.5,3+r()*6,.3,rgba('#b8c8d8',.6)); oHaze(g,w,base-14,base,'#e2e8ee',.0,.35); },
    mid(g,w,h,r){ const base=95;
      /* pressure ridges of blue ice, an old boat frozen in, a hut on the shore */
      for(let i=0;i<26;i++){ const x=r()*w, L=6+r()*14, H=2+r()*4; for(let k=0;k<L;k+=1.6){ const hh=H*(.5+r()*.6); poly(g,[[x+k,base-1],[x+k+1.8,base-1],[x+k+1.2,base-1-hh],[x+k+.3,base-1-hh*.8]],['#a8d0e8','#8ac0e0','#c8e4f4','#7ab0d4'][(k|0)%4]); R(g,rgba('#ffffff',.6),x+k+.3,base-1-hh*.8,.6,hh*.5); } }
      R(g,'#eef2f6',0,base-1.2,w,2); poly(g,[[200,base-2],[224,base-2.6],[220,base],[204,base]],'#5a4a3a'); R(g,'#eef2f6',204,base-2.8,16,.8);
      for(let i=0;i<40;i++) ell(g,r()*w,base-.5,2+r()*4,.4,rgba('#ffffff',.7)); },
    verge:()=>PX(256,96,4,(g,w,h)=>{ const r=rng(61);
      vfill(g,0,0,w,h,[[0,'#dfe8f0'],[.6,'#eef2f6'],[1,'#e2e8ee']]);
      for(let i=0;i<120;i++){ const x=r()*w, y=r()*h; ell(g,x,y,4+r()*10,1+r()*2,rgba('#b8c8dc',.35)); ell(g,x-1,y-.6,3+r()*6,.6+r()*1,rgba('#ffffff',.6)); }
      /* the shore: ice at the far edge, reeds through the snow, footprints */ vfill(g,0,0,w,12,[[0,'#b8d4e6'],[1,'#d8e6f0']]); for(let i=0;i<40;i++) ell(g,r()*w,r()*10,4+r()*8,.3,rgba('#ffffff',.6));
      for(let i=0;i<200;i++){ const x=r()*w, y=12+r()*20; R(g,['#8a7a5a','#a89a6a','#6a5a40'][i%3],x,y,.4,1.5+r()*2); }
      let x=0, y=60; for(let i=0;i<70;i++){ x+=3.4; y+=Math.sin(i*.4)*.8; ell(g,x%w,y+(i%2?1:-1),.8,.5,'#b8c8d8'); }
      vfill(g,0,h-15,w,15,[[0,'#a8a49e'],[1,'#8a8680']]); for(let i=0;i<2400;i++) R(g,['#c8c4be','#6a6660','#e8eef4','#5a5650'][i%4],r()*w,h-15+r()*15,.6+r()*.6,.5+r()*.4); for(let i=0;i<60;i++) ell(g,r()*w,h-15+r()*15,1+r()*3,.5,'#f2f6fa'); }),
    vergeW:12, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d4e2ec'],[.5,'#c8dae8'],[1,'#d4e2ec']]); const r=rng(67); for(let i=0;i<160;i++){ const x=r()*w,y=r()*h; ell(g,x,y,4+r()*14,.4+r()*.6,rgba(r()<.5?'#ffffff':'#a8c4d8',.5)); } for(let i=0;i<10;i++){ g.strokeStyle=rgba('#8ab0cc',.5); g.lineWidth=.5; g.beginPath(); let x=r()*w,y=r()*h; g.moveTo(x,y); for(let k=0;k<6;k++){ x+=(r()-.3)*14; y+=(r()-.5)*8; g.lineTo(x,y); } g.stroke(); } },0,67), groundTile:20 },
  neg:{
    far(g,w,h,r){ const base=91;
      oRange(g,w,h,base,x=>18+opn(x,w,511,2)*9+Math.abs(opn(x,w,512,6))*4,{shade:'#7a8a96',lit:'#a8b4c0',snow:'#e8eef4',snowShade:'#b4c0cc',haze:'#e2e8ee'},{seed:17,snowLine:.45,hazeH:24,hazeA:.8});
      oWoodedHills(g,w,h,base,x=>8+opn(x,w,513,3)*4,['#3a4a46','#46564e','#5a6a62','#e8eef2'],{seed:18,size:1.6,haze:'#e2e8ee',hazeH:12,hazeA:.6,fillBelow:'#dfe6ec'}); },
    back(g,w,h,r){ const base=94;
      /* taiga: ranks of dark spruce with snow on every tier */ R(g,'#e6ecf2',0,base-4,w,h); for(let row=0;row<3;row++) for(let i=0;i<120;i++){ const x=r()*w, ht=10+r()*12-row*2, y=base-row*1.5-pn(x,w,521,2)*6;
        oTree(g,x-ht*.25,y-ht,ht*.5,ht,'snowspruce',i+row*200,{pal:[mix('#24382e','#e2e8ee',row*.25),mix('#33493c','#e2e8ee',row*.25),mix('#4a6450','#e2e8ee',row*.25)],tiers:6}); }
      oHaze(g,w,0,base,'#e2e8ee',.35,.1); },
    mid(g,w,h,r){ const base=95; R(g,'#eef2f6',0,base-3,w,4);
      for(let i=0;i<40;i++){ const x=r()*w, ht=12+r()*10; oTree(g,x-ht*.25,base-3-ht,ht*.5,ht,'snowspruce',i+400,{tiers:7}); }
      for(let i=0;i<20;i++){ const x=r()*w, ht=14+r()*8; oTree(g,x-ht*.3,base-3-ht,ht*.6,ht,'birch',i+500,{bare:true}); }
      sibChurch(g,300,base-2,1.15);
      for(const [x,wd] of [[40,26],[90,22],[160,28],[400,24],[460,26]]){ sibIzba(g,x,base-2,wd,18,{seed:x,smoke:x%3===0,lit:x%2===0}); for(let k=0;k<wd+8;k+=1.6) R(g,'#7a5a3a',x-4+k,base-5,.6,3); R(g,'#7a5a3a',x-4,base-4.4,wd+8,.5); R(g,'#f2f6fa',x-4,base-5.2,wd+8,.5); } },
    verge:()=>PX(256,128,4,(g,w,h)=>{ const r=rng(71);
      vfill(g,0,0,w,h,[[0,'#e2eaf2'],[1,'#eef2f6']]); for(let i=0;i<140;i++){ const x=r()*w, y=r()*h; ell(g,x,y,4+r()*10,1+r()*2,rgba('#b8c8dc',.35)); ell(g,x-1,y-.6,3+r()*6,.6+r()*1,rgba('#ffffff',.6)); }
      /* the village road: packed snow, tyre ruts, a grey slush edge */ vfill(g,0,40,w,22,[[0,'#c8ccd0'],[.5,'#d8dce0'],[1,'#c4c8cc']]); for(const y of [45,50,53,58]){ R(g,'#a8aeb6',0,y,w,1.2); for(let x=0;x<w;x+=1) R(g,rgba('#8a9098',.4),x,y+.3+Math.sin(x*.3)*.3,.8,.5); }
      for(let i=0;i<300;i++) R(g,rgba('#6a6a6a',.15),r()*w,40+r()*22,.6,.4);
      for(let i=0;i<80;i++) R(g,['#8a7a5a','#a89a6a'][i%2],r()*w,64+r()*30,.4,1.5+r()*2);
      vfill(g,0,h-15,w,15,[[0,'#a8a49e'],[1,'#8a8680']]); for(let i=0;i<2400;i++) R(g,['#c8c4be','#6a6660','#e8eef4','#5a5650'][i%4],r()*w,h-15+r()*15,.6+r()*.6,.5+r()*.4); for(let i=0;i<60;i++) ell(g,r()*w,h-15+r()*15,1+r()*3,.5,'#f2f6fa'); }),
    vergeW:16, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e2eaf2'],[1,'#eaf0f6']]); const r=rng(73); for(let i=0;i<120;i++){ const x=r()*w,y=r()*h; ell(g,x,y,5+r()*12,1+r()*2,rgba('#b8c8dc',.3)); } },0,73), groundTile:24 }
};
OK.siberia.kit={S:4,
  cells:{izbaF:[0,0,72,32],izbaE:[72,0,40,32],roofSnow:[112,0,48,32],logs:[160,0,32,16],woodEnd:[192,0,16,16],picket:[208,0,48,16],
    snowfence:[0,32,64,16],birch:[64,32,40,64],spruce:[104,32,48,64],bareBirch:[152,32,40,64],reeds:[192,32,40,20],snowbush:[192,52,32,20],woodpole:[232,32,6,64],insul:[238,32,6,6],
    snowman:[0,96,24,32],lada:[24,96,48,16],ladaE:[72,96,16,16],snowT:[88,96,16,16],boat:[104,96,48,16],gable:[152,96,40,24],banyaF:[192,96,48,24],
    wire:[0,128,4,4],white:[4,128,4,4],dark:[8,128,4,4],stone:[12,128,16,16],post:[28,128,6,24],wood:[34,128,16,16],drygrass:[50,128,48,20],snowcap:[98,128,32,6]},
  paint:{
    izbaF:(g,x,y,w,h)=>{ for(let yy=y;yy<y+h;yy+=2.2){ vfill(g,x,yy,w,2.2,[[0,'#9a7048'],[.45,'#7a5434'],[1,'#3e2a1a']]); R(g,rgba('#2a1a10',.4),x,yy+2,w,.3); } const r=rng(3); for(let i=0;i<60;i++) R(g,rgba('#2a1a10',.15),x+r()*w,y+r()*h,2+r()*4,.3);
      for(let k=0;k<3;k++){ const wx=x+w*(.12+k*.3), ww=w*.16, wy=y+h*.22, wh=h*.46; R(g,'#e8eef4',wx-2,wy-1.6,ww+4,wh+3.6); R(g,'#2a6ab0',wx-1.2,wy-.8,ww+2.4,wh+2);
        poly(g,[[wx-2.6,wy-1.6],[wx+ww+2.6,wy-1.6],[wx+ww/2,wy-5]],'#2a6ab0'); poly(g,[[wx-1.4,wy-2],[wx+ww+1.4,wy-2],[wx+ww/2,wy-4.2]],'#e8eef4'); for(let j=0;j<5;j++) ell(g,wx-1+j*(ww+2)/4,wy+wh+1.6,.6,.6,'#e8eef4');
        vfill(g,wx,wy,ww,wh,[[0,k===1?'#ffe0a0':'#c8d8e4'],[1,k===1?'#e8b060':'#4a5a68']]); R(g,'#e8eef4',wx+ww/2-.3,wy,.6,wh); R(g,'#e8eef4',wx,wy+wh*.4,ww,.5); R(g,'#f6f8fa',wx-1.4,wy+wh+1.6,ww+2.8,1); } vfill(g,x,y+h-3,w,3,[[0,rgba('#ffffff',0)],[1,rgba('#e8eef4',.9)]]); },
    izbaE:(g,x,y,w,h)=>{ for(let yy=y;yy<y+h;yy+=2.2) vfill(g,x,yy,w,2.2,[[0,'#8a6440'],[.45,'#6a4a2e'],[1,'#3a2818']]); for(let yy=y;yy<y+h;yy+=2.2){ ell(g,x+1,yy+1.1,1.2,1.1,'#c89a6a'); ell(g,x+w-1,yy+1.1,1.2,1.1,'#c89a6a'); } vfill(g,x,y+h-3,w,3,[[0,rgba('#ffffff',0)],[1,rgba('#e8eef4',.9)]]); },
    gable:(g,x,y,w,h)=>{ oPlanks(g,x,y,w,h,'#6a4a2e',{vert:true,n:10}); R(g,'#2a6ab0',x+w*.4,y+h*.45,w*.2,h*.3); vfill(g,x+w*.42,y+h*.48,w*.16,h*.24,[[0,'#c8d8e4'],[1,'#4a5a68']]); for(let k=0;k<8;k++) ell(g,x+w*.1+k*w*.11,y+h*.92,w*.05,h*.06,'#e8eef4'); },
    roofSnow:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f6f8fb'],[.85,'#dde6ee'],[1,'#a8b4c4']]); const r=rng(5); for(let i=0;i<40;i++) ell(g,x+r()*w,y+r()*h*.8,2+r()*5,.6+r()*1,rgba('#c8d4e2',.5)); R(g,'#5a4a3a',x,y+h-1.2,w,1.2); for(let k=0;k<w;k+=2.5) poly(g,[[x+k,y+h-1.2],[x+k+1,y+h-1.2],[x+k+.5,y+h+.1]],'#e8f0f8'); },
    logs:(g,x,y,w,h)=>{ for(let yy=y;yy<y+h;yy+=2) vfill(g,x,yy,w,2,[[0,'#8a6440'],[.45,'#6a4a2e'],[1,'#3a2818']]); },
    woodEnd:(g,x,y,w,h)=>{ R(g,'#3a2818',x,y,w,h); const r=rng(7); for(let yy=y+1.2;yy<y+h;yy+=2.2) for(let xx=x+1.2+((yy-y)/2.2|0)%2;xx<x+w;xx+=2.3){ ell(g,xx,yy,1.05,1.05,'#c89a6a'); ell(g,xx,yy,.6,.6,'#a87a4a'); ell(g,xx,yy,.2,.2,'#6a4a2a'); } R(g,'#f2f6fa',x,y,w,1); },
    picket:(g,x,y,w,h)=>{ R(g,'#7a5a3a',x,y+h*.35,w,1); R(g,'#7a5a3a',x,y+h*.75,w,1); for(let k=0;k<w;k+=2.4){ vfill(g,x+k,y+2,1.6,h-2,[[0,'#a8845a'],[1,'#5a3e26']]); poly(g,[[x+k,y+2],[x+k+1.6,y+2],[x+k+.8,y]],'#a8845a'); ell(g,x+k+.8,y+1,.9,.7,'#f6f8fa'); } },
    snowfence:(g,x,y,w,h)=>{ R(g,'#5a4430',x,y+h*.3,w,1); R(g,'#5a4430',x,y+h*.7,w,1); for(let k=0;k<w;k+=2) vfill(g,x+k,y,1.2,h,[[0,'#8a6a4a'],[1,'#4a3424']]); for(let k=0;k<w;k+=8) R(g,'#4a3424',x+k,y,1.4,h); vfill(g,x,y+h*.75,w,h*.25,[[0,'#f2f6fa'],[1,'#dde6ee']]); },
    birch:(g,x,y,w,h)=>oTree(g,x,y,w,h,'birch',81,{bare:true}),
    bareBirch:(g,x,y,w,h)=>oTree(g,x,y,w,h,'birch',83,{bare:true}),
    spruce:(g,x,y,w,h)=>oTree(g,x,y,w,h,'snowspruce',85,{tiers:9}),
    reeds:(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',87,{pal:['#8a7a5a','#a89a6a','#c8b88a','#6a5a40']}),
    snowbush:(g,x,y,w,h)=>{ oTree(g,x,y,w,h,'shrub',89,{pal:['#3a4a3a','#4a5a46','#6a7a5a']}); const r=rng(91); for(let i=0;i<12;i++) ell(g,x+w*(.2+r()*.6),y+h*(.15+r()*.4),w*.12,h*.06,'#f2f6fa'); },
    insul:(g,x,y,w,h)=>{ R(g,'#3a3a3a',x+w/2-.3,y+h*.5,.6,h*.5); ell(g,x+w/2,y+h*.4,w*.35,h*.3,'#f2f2ee'); },
    snowman:(g,x,y,w,h)=>{ const cx=x+w/2; ell(g,cx,y+h*.78,w*.4,h*.2,'#eef2f6'); ell(g,cx-w*.1,y+h*.74,w*.25,h*.12,'#ffffff'); ell(g,cx,y+h*.48,w*.3,h*.15,'#eef2f6'); ell(g,cx,y+h*.24,w*.22,h*.11,'#f6f8fa'); R(g,'#2a2a2e',cx-w*.1,y+h*.22,1,1); R(g,'#2a2a2e',cx+w*.05,y+h*.22,1,1); poly(g,[[cx,y+h*.25],[cx+w*.22,y+h*.27],[cx,y+h*.28]],'#f28a3a');
      R(g,'#c8202a',cx-w*.24,y+h*.33,w*.48,h*.05); R(g,'#c8202a',cx+w*.1,y+h*.33,w*.08,h*.14); poly(g,[[cx-w*.16,y+h*.15],[cx+w*.16,y+h*.15],[cx+w*.1,y+h*.04],[cx-w*.1,y+h*.04]],'#3a3a40'); R(g,'#5a4430',x+1,y+h*.45,w*.25,.6); R(g,'#5a4430',x+w*.72,y+h*.43,w*.25,.6); },
    lada:(g,x,y,w,h)=>{ R(g,'#8a2a22',x+2,y+h*.4,w-4,h*.42); vfill(g,x+2,y+h*.4,w-4,h*.12,[[0,'#b84a3a'],[1,'#8a2a22']]); poly(g,[[x+w*.22,y+h*.4],[x+w*.28,y+h*.08],[x+w*.68,y+h*.08],[x+w*.76,y+h*.4]],'#8a2a22'); vfill(g,x+w*.3,y+h*.12,w*.17,h*.25,[[0,'#c8d8e4'],[1,'#5a6a78']]); vfill(g,x+w*.5,y+h*.12,w*.17,h*.25,[[0,'#c8d8e4'],[1,'#5a6a78']]);
      g.fillStyle='#f6f8fa'; g.beginPath(); g.moveTo(x+w*.26,y+h*.1); g.quadraticCurveTo(x+w*.48,y-h*.06,x+w*.72,y+h*.1); g.fill(); ell(g,x+w*.12,y+h*.4,w*.1,h*.06,'#f6f8fa'); ell(g,x+w*.86,y+h*.4,w*.1,h*.06,'#f6f8fa');
      for(const wx of [.2,.8]){ ell(g,x+w*wx,y+h*.84,h*.16,h*.16,'#1a1a1a'); ell(g,x+w*wx,y+h*.84,h*.07,h*.07,'#8a8a8a'); } R(g,'#c8c8c0',x+2,y+h*.62,w-4,.4); },
    ladaE:(g,x,y,w,h)=>{ R(g,'#8a2a22',x+1,y+h*.4,w-2,h*.42); vfill(g,x+2,y+h*.1,w-4,h*.28,[[0,'#c8d8e4'],[1,'#5a6a78']]); R(g,'#f6f8fa',x+1,y+h*.02,w-2,h*.1); R(g,'#f2f0d0',x+1.5,y+h*.5,2,1.5); R(g,'#f2f0d0',x+w-3.5,y+h*.5,2,1.5); R(g,'#2a2a2a',x+1,y+h*.84,w-2,h*.16); },
    snowT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#ffffff'],[1,'#e2e8f0']]),
    boat:(g,x,y,w,h)=>{ g.fillStyle=grad(g,0,y,0,y+h,[[0,'#3a5a7a'],[1,'#1a2a3a']]); g.beginPath(); g.moveTo(x+2,y+h); g.quadraticCurveTo(x+w/2,y-h*.3,x+w-2,y+h); g.fill(); g.fillStyle='#f6f8fa'; g.beginPath(); g.moveTo(x+6,y+h*.4); g.quadraticCurveTo(x+w/2,y-h*.1,x+w-6,y+h*.4); g.quadraticCurveTo(x+w/2,y+h*.2,x+6,y+h*.4); g.fill(); R(g,'#c8402a',x+4,y+h*.75,w-8,.6); },
    banyaF:(g,x,y,w,h)=>{ for(let yy=y;yy<y+h;yy+=2) vfill(g,x,yy,w,2,[[0,'#8a6440'],[.45,'#6a4a2e'],[1,'#3a2818']]); R(g,'#3a2414',x+w*.6,y+h*.3,w*.22,h*.7); R(g,'#2a6ab0',x+w*.2,y+h*.3,w*.16,h*.3); vfill(g,x+w*.22,y+h*.33,w*.12,h*.24,[[0,'#ffe0a0'],[1,'#e8a050']]); vfill(g,x,y+h-2,w,2,[[0,rgba('#ffffff',0)],[1,rgba('#e8eef4',.9)]]); },
    snowcap:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#ffffff'],[1,'#dde6ee']]); },
  },
  place(E,side,r,P){
    /* wooden telegraph poles every 45 m, two crossbars, insulators, four sagging wires */
    const pd=side==='pos'?5.6:5.2;
    for(let u=(side==='pos'?10:32);u<P;u+=45){ E.post(u,pd,.26,7.6,'woodpole',{top:true,ao:.85}); for(const [yy,L] of [[7.1,1.8],[6.4,1.4]]){ E.box(u,pd-L/2,.12,.14,L,'woodpole',{y:yy}); for(const dd of [-L/2+.1,L/2-.1]) E.card(u,pd+dd,.18,.24,'insul',{n:2,y:yy+.14}); } }
    for(let u=(side==='pos'?10:32)-45;u<P;u+=45) for(const [dd,yy] of [[-.8,7.5],[.8,7.5],[-.6,6.8],[.6,6.8]]) E.wire(u,u+45,pd+dd,yy,.7,'wire',.035);
    for(let i=0;i<40;i++){ const u=r()*P, d=4.3+r()*2.5; E.card(u,d,.8+r()*.6,.4+r()*.3,'drygrass',{n:2,sb:.8}); }
    for(let i=0;i<22;i++) E.card(r()*P,6+r()*6,1.4,.7,'snowbush',{n:3,sb:.85});
    if(side==='pos'){
      for(let u=0;u<P;u+=60) for(let k=0;k<5;k++){ const uu=u+k*4.2; E.card(uu+2,7.2,4,1.6,'snowfence',{n:1,sb:.85}); }
      for(let i=0;i<16;i++){ const u=r()*P, d=8+r()*7; E.card(u,d,3.6+r()*1.5,8+r()*3,r()<.5?'birch':'bareBirch',{n:3,sb:.75}); }
      for(let i=0;i<30;i++) E.card(r()*P,13+r()*2.5,1.6,1,'reeds',{n:2,sb:.8});
      for(const u of [44,150]){ E.card(u,13.4,4.2,1.3,'boat',{n:1}); E.card(u+5,14,3.8,1.2,'boat',{n:1}); }
      { const u=100, d=10.5; E.box(u,d,4.2,2.4,3.4,{f:'banyaF',e:'logs',t:null}); E.gable(u,d,4.2,3.4,2.4,1.4,'roofSnow',{ov:.4,gc:'gable'}); E.post(u+1.4,d+2.4,.25,1.4,'dark',{y:3.3}); E.box(u+3.2,d+.4,1.6,1.1,1,{f:'woodEnd',e:'woodEnd',t:'snowcap'}); }
      E.card(196,9,1.2,1.7,'snowman',{n:2}); }
    else {
      for(const [u,wd,dp] of [[14,8,7],[56,7.5,6.5],[104,8.5,7],[150,7,6],[204,8,7]]){ const d=14.2;
        E.box(u,d,wd,3,dp,{f:'izbaF',e:'izbaE',t:null}); E.gable(u,d,wd,dp,3,2.8,'roofSnow',{ov:.6,gc:'gable'});
        E.post(u+wd*.3,d+dp*.5,.5,1.4,'stone',{y:5.2}); E.box(u+wd*.3,d+dp*.5-.3,.6,.15,.6,{f:'snowcap',e:'snowcap',t:'snowcap'},{y:6.6});
        E.card(u,11.6,wd+4,1.2,'picket',{n:1,sb:.9}); E.box(u+wd/2+2.2,12.6,1.8,1.2,1,{f:'woodEnd',e:'logs',t:'snowcap'});
        E.card(u-wd/2-2.5,13.5,4,9,r()<.5?'spruce':'birch',{n:3,sb:.75}); }
      for(let i=0;i<10;i++) E.card(r()*P,18+r()*6,5,11,'spruce',{n:3,sb:.7});
      E.box(84,9.6,4.3,1.45,1.8,{f:'lada',e:'ladaE',t:'snowT'},{ao:.7}); E.card(130,10.8,1.2,1.7,'snowman',{n:2});
      for(let i=0;i<8;i++) E.card(r()*P,7+r()*1.5,3.6,8,'bareBirch',{n:3,sb:.75}); }
  } };
OK.siberia.kit.atlas=kitAtlas(OK.siberia.kit);
