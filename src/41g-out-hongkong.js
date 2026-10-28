
/* =====================================================================================================
   HONG KONG AT MIDDAY. Harbour side: a granite promenade with railings, lamps, banyans and benches, sampans
   and a green-and-white ferry at the quay, a junk with red sails and container ships out in the harbour,
   the island's towers under the Peak. City side: a tram street, red taxis, tenements stacked floor on floor
   with AC units, laundry and cage balconies, neon signs hanging out over the road, towers climbing the hills.
   ===================================================================================================== */
const HK_SIGN=[['#d63a2c','#ffe8a0'],['#f2c230','#a81c14'],['#1a8a5a','#f2f2e0'],['#2a5ad8','#ffffff'],['#ff4fae','#ffffff'],['#f2f2ee','#c8202a']];
function hkSign(g,x,y,w,h,k,vert=true){ const [bg,fg]=HK_SIGN[k%HK_SIGN.length];
  R(g,'#2a2a2e',x,y,w,h); vfill(g,x+.6,y+.6,w-1.2,h-1.2,[[0,mix(bg,'#ffffff',.2)],[.5,bg],[1,mix(bg,'#000000',.25)]]); R(g,mix(bg,'#ffffff',.5),x+.6,y+.6,w-1.2,.5);
  if(vert) glyphs(g,x+w/2-2.5,y+3,Math.max(2,(h-5)/6|0),6,fg,k*7+3,true); else glyphs(g,x+3,y+h/2-2.5,Math.max(2,(w-5)/6|0),6,fg,k*7+5,false);
  for(let i=0;i<(vert?h:w)/3;i++){ const t=i*3; if(vert){ ell(g,x+.3,y+1+t,.35,.35,'#fff6d0'); ell(g,x+w-.3,y+1+t,.35,.35,'#fff6d0'); } else { ell(g,x+1+t,y+.3,.35,.35,'#fff6d0'); ell(g,x+1+t,y+h-.3,.35,.35,'#fff6d0'); } } }
function hkFloor(g,x,y,w,h,o){ const r=rng(o.seed), c=o.col;
  vfill(g,x,y,w,h,[[0,mix(c,'#ffffff',.08)],[.8,c],[1,mix(c,'#000000',.2)]]);
  if(o.tile) for(let yy=y;yy<y+h;yy+=1.2) for(let xx=x+((yy-y)/1.2|0)%2*.6;xx<x+w;xx+=1.2) R(g,rgba('#000000',.05),xx,yy,1.1,1.1);
  for(let i=0;i<w*h*.03;i++) R(g,rgba('#3a3020',.06+r()*.06),x+r()*w,y+r()*h,.3,1+r()*4); /* rain streaks */
  const bays=o.bays||4, bw=w/bays;
  for(let b=0;b<bays;b++){ const wx=x+b*bw+bw*.12, ww=bw*.76, wy=y+h*.18, wh=h*.56, k=r();
    if(o.cage&&k<.4){ R(g,'#3a3e44',wx-.5,wy-.5,ww+1,wh+2); vfill(g,wx,wy,ww,wh,[[0,'#2a3038'],[1,'#4a5058']]); for(let xx=wx;xx<wx+ww;xx+=1.1) R(g,'#8a9098',xx,wy,.25,wh+1); R(g,'#8a9098',wx,wy+wh*.5,ww,.3); if(r()<.5) for(let j=0;j<5;j++) ell(g,wx+1+j*ww/5,wy+wh*.7,.6,.8,['#4a8a3a','#5a9a44','#c84a4a'][j%3]); }
    else { R(g,'#e8e8e2',wx-.4,wy-.4,ww+.8,wh+.8); vfill(g,wx,wy,ww,wh,k<.15?[[0,'#ffe0a0'],[1,'#e0b060']]:[[0,'#a8c4d8'],[.5,'#5a7088'],[1,'#3a4a5a']]); R(g,'#e8e8e2',wx+ww/2-.2,wy,.4,wh); poly(g,[[wx+ww*.1,wy+wh],[wx+ww*.3,wy+wh],[wx+ww*.5,wy],[wx+ww*.3,wy]],rgba('#ffffff',.15)); }
    if(r()<o.ac){ const ax=wx+ww*(r()<.5?.05:.5), ay=wy+wh+.8; vfill(g,ax,ay,bw*.34,h*.22,[[0,'#f2f2ee'],[1,'#b8b8b4']]); for(let k2=0;k2<4;k2++) R(g,'#8a8a88',ax+.4,ay+.6+k2*.8,bw*.34-.8,.3); R(g,rgba('#000000',.25),ax,ay+h*.22,bw*.34,.6); R(g,rgba('#4a3a2a',.25),ax+1,ay+h*.22,.4,h*.2); }
    if(r()<o.laundry){ R(g,'#5a5a5a',wx-1,wy+wh*.12,ww+2,.25); for(let k2=0;k2<5;k2++) vfill(g,wx+k2*ww/5,wy+wh*.14,ww/6,wh*.36,[[0,['#f2f2ee','#c84a4a','#4a7ac8','#f2c230','#5aa85a'][(k2+b)%5]],[1,mix(['#f2f2ee','#c84a4a','#4a7ac8','#f2c230','#5aa85a'][(k2+b)%5],'#000000',.25)]]); }
    if(r()<.12){ R(g,'#3a6a3a',wx+ww*.2,wy+wh-1,ww*.6,1); for(let k2=0;k2<4;k2++) ell(g,wx+ww*.25+k2*ww*.17,wy+wh-1.6,.8,.9,'#4a8a3a'); } }
  R(g,mix(c,'#ffffff',.25),x,y+h-1.2,w,.6); R(g,rgba('#000000',.2),x,y+h-.6,w,.6); }
function hkShop(g,x,y,w,h,o){ const r=rng(o.seed); vfill(g,x,y,w,h,[[0,'#6a6660'],[1,'#3a3834']]);
  for(let k=0;k<3;k++){ const sx=x+1+k*w/3, sw=w/3-2; vfill(g,sx,y+h*.3,sw,h*.7,[[0,'#f8e8b8'],[.5,'#e8c888'],[1,'#a88848']]);
    for(let j=0;j<3;j++) R(g,rgba('#5a3a2a',.5),sx+1,y+h*(.48+j*.16),sw-2,.5); for(let j=0;j<10;j++) ell(g,sx+1.5+(j%5)*sw/5,y+h*(.44+(j>4?.16:0)),sw*.07,h*.05,['#c84a3a','#f2c230','#4a8a4a','#e8e0d0','#8a5a3a'][(j+k+o.seed)%5]);
    R(g,'#2a2a2e',sx,y+h*.3,sw,.5); for(let j=0;j<sw;j+=1.5) R(g,rgba('#3a3a3e',.5),sx+j,y+h*.3,.3,h*.12); }
  hkSign(g,x+w*.12,y+1,w*.76,h*.2,o.sign+o.seed,false); vfill(g,x,y+h-2,w,2,[[0,rgba('#000000',0)],[1,rgba('#000000',.4)]]); }

OUTK.hongkong={
  sky:()=>oSkyTex([[0,'#5a8ac2'],[.5,'#a8c8e2'],[.85,'#dce6ec'],[1,'#ece8e0']],{clouds:12,cloudShade:'#a0aac0',seed:31,haze:'#e8e4dc',cirrus:8}),
  pos:{ midSpec:{yb:-.5}, backSpec:{yb:-.5}, groundK:.5,
    far(g,w,h,r){ const base=90;
      /* the Peak and its ridges */ oRange(g,w,h,base,x=>22+outPN(x,w,401,2)*10+Math.abs(outPN(x,w,402,6))*6,{shade:'#5e7e72',lit:'#86a294',haze:'#dce4e4',dark:'#4a6a60'},{seed:11,hazeH:30,hazeA:.75,gullies:60});
      /* the island's towers along the shore */ let x=0; while(x<w){ const tw=3+r()*6, th=8+r()*20+(Math.sin(x/w*Math.PI*4)>.3?12:0), c=['#c8d4dc','#a8b8c4','#d8d0c4','#8a9cac','#b8c8d0'][r()*5|0];
        vfill(g,x,base-th,tw,th,[[0,mix(c,'#ffffff',.2)],[1,mix(c,'#5a6a7a',.3)]]); for(let y=base-th+1;y<base;y+=1.2) R(g,rgba('#2a3a4a',.25),x,y,tw,.4); R(g,rgba('#ffffff',.25),x,base-th,.5,th);
        if(r()<.15){ poly(g,[[x,base-th],[x+tw,base-th],[x+tw/2,base-th-5]],c); R(g,'#8a9aa8',x+tw/2-.15,base-th-9,.3,4); } x+=tw+r()*1.2; }
      /* one tall faceted tower */ const tx=300; poly(g,[[tx-5,base],[tx+5,base],[tx+3,base-48],[tx,base-54],[tx-3,base-48]],'#b8c8d4'); poly(g,[[tx,base],[tx+5,base],[tx+3,base-48],[tx,base-54]],'#8ea2b4'); for(let k=0;k<12;k++) R(g,rgba('#ffffff',.25),tx-4+k*.1,base-46+k*4,8-k*.3,.4);
      oHaze(g,w,base-30,base,'#e4e4e0',.0,.5); R(g,'#8a9098',0,base,w,1.5); vfill(g,0,base+1.5,w,h-base,[[0,'#7aa2b4'],[1,'#4a7a96']]); for(let i=0;i<120;i++) ell(g,r()*w,base+3+r()*(h-base-3),1+r()*2,.25,rgba('#ffffff',.35)); },
    back(g,w,h,r){ const wl=95;
      /* a container ship, a cruise ferry, a tug */ const ship=(x,L,H,cols)=>{ poly(g,[[x,wl-H*.3],[x+L,wl-H*.3],[x+L-3,wl],[x+4,wl]],'#2a3240'); R(g,'#a82a1c',x+3,wl-1.4,L-6,1.4); R(g,'#e8e8e4',x+L-14,wl-H,9,H*.7); for(let k=0;k<3;k++) R(g,'#3a4a5a',x+L-13,wl-H+2+k*2.5,7,1);
        for(let c=0;c<(L-22)/4.2;c++) for(let k=0;k<3;k++) vfill(g,x+5+c*4.2,wl-H*.3-(k+1)*3,4,3,[[0,mix(cols[(c*3+k)%cols.length],'#ffffff',.15)],[1,cols[(c*3+k)%cols.length]]]); };
      ship(40,110,16,['#c8402a','#2a6aa8','#e8a020','#3a8a5a','#8a8a8a','#d8d0c0']); ship(330,80,14,['#2a6aa8','#c8402a','#8a8a8a','#e8a020']);
      R(g,'#f2f2ee',200,wl-9,50,6); R(g,'#2a6a4a',200,wl-3,50,3); R(g,'#f2f2ee',212,wl-14,26,5); for(let k=0;k<10;k++) R(g,'#3a4a5a',202+k*4.6,wl-7.6,2.6,1.8);
      for(let i=0;i<40;i++) ell(g,r()*w,wl-.3,2+r()*4,.3,rgba('#ffffff',.5)); },
    mid(g,w,h,r){ const wl=96;
      /* the junk with red battened sails */ const junk=(x,s)=>{ poly(g,[[x-22*s,wl-6*s],[x+22*s,wl-8*s],[x+18*s,wl],[x-18*s,wl]],'#5a3a22'); R(g,'#3a2414',x-20*s,wl-6*s,40*s,1);
        for(const [dx,ht,sw] of [[-12,30,14],[2,38,16],[14,24,11]]){ R(g,'#3a2a1a',x+dx*s,wl-6*s-ht*s,.8,ht*s); poly(g,[[x+(dx+.8)*s,wl-6*s-ht*s],[x+(dx+sw)*s,wl-6*s-ht*s+3*s],[x+(dx+sw-1)*s,wl-8*s],[x+(dx+.8)*s,wl-8*s]],'#c8402a');
          for(let k=1;k<6;k++){ const yy=wl-6*s-ht*s+k*(ht*s-2*s)/6; R(g,'#6a1a10',x+(dx+.8)*s,yy,(sw-1)*s,.5); } vfill(g,x+(dx+.8)*s,wl-6*s-ht*s,(sw-1)*s,ht*s*.4,[[0,rgba('#ffffff',.15)],[1,rgba('#ffffff',0)]]); } };
      junk(140,1); junk(420,.7);
      /* a sampan and a harbour buoy */ poly(g,[[300,wl-3],[330,wl-3.6],[326,wl],[304,wl]],'#6a4a2e'); poly(g,[[306,wl-3],[320,wl-3],[318,wl-7],[308,wl-7]],'#3a5a3a'); ell(g,40,wl-2,2,2.4,'#e04a2a'); R(g,'#e04a2a',39.6,wl-7,.8,5);
      for(let i=0;i<60;i++) ell(g,r()*w,wl-.6,2+r()*5,.35,rgba('#ffffff',.45)); },
    verge:()=>outPX(256,72,4,(g,w,h)=>{ const r=rng(43);
      /* granite slabs, a tactile strip near the railing, a drain line */ for(let y=0;y<h;y+=6) for(let x=((y/6)%2)*6;x<w;x+=12){ const c=mix('#b8b0a4','#a49c90',r()); vfill(g,x+.2,y+.2,11.6,5.6,[[0,mix(c,'#ffffff',.08)],[1,c]]); for(let i=0;i<14;i++) R(g,rgba(r()<.5?'#000000':'#ffffff',.08),x+r()*12,y+r()*6,.4,.4); }
      R(g,'#d8c070',0,4,w,3); for(let x=0;x<w;x+=1.2) for(let y=4.4;y<7;y+=1.2) ell(g,x+.6,y,.3,.3,'#b8a050'); R(g,'#6a6a6a',0,h-17,w,1.2); for(let x=0;x<w;x+=2) R(g,'#3a3a3a',x,h-17,1,1.2);
      vfill(g,0,h-15,w,15,[[0,'#8a8478'],[1,'#7a746a']]); for(let i=0;i<2400;i++) R(g,['#a8a294','#6a645a','#94907e','#5a564e'][i%4],r()*w,h-15+r()*15,.6+r()*.6,.5+r()*.4); }),
    vergeW:9, vergeTile:32,
    ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3e7290'],[.5,'#346886'],[1,'#3e7290']]); const r=rng(47); for(let i=0;i<260;i++){ const x=r()*w, y=r()*h, L=2+r()*6; ell(g,x,y,L,.35,rgba('#9ad0e8',.35)); ell(g,x+1,y+.8,L*.8,.3,rgba('#1a4a66',.4)); } },0,47), groundTile:14 },
  neg:{
    far(g,w,h,r){ const base=91; oRange(g,w,h,base,x=>18+outPN(x,w,411,2)*10+Math.abs(outPN(x,w,412,5))*8,{shade:'#5a7a6a',lit:'#7e9a86',haze:'#dce2e0',dark:'#46645a'},{seed:13,hazeH:28,hazeA:.7,gullies:50});
      let x=0; while(x<w){ const tw=3+r()*5, th=10+r()*24, c=['#d8d4cc','#c8ccd0','#e0d8cc','#b8c0c4'][r()*4|0]; vfill(g,x,base-th,tw,th,[[0,c],[1,mix(c,'#6a7078',.3)]]); for(let y=base-th+1;y<base;y+=1.1) R(g,rgba('#3a4a5a',.2),x,y,tw,.35); x+=tw+r()*3; }
      oHaze(g,w,base-34,base,'#e4e4e0',.0,.6); R(g,'#8a908c',0,base,w,h-base); },
    back(g,w,h,r){ const base=94;
      oWoodedHills(g,w,h,base,x=>28+outPN(x,w,421,2)*12,['#3a5e48','#4a6e52','#6a8a62','#8aa874'],{seed:14,size:2.6,haze:'#dfe4e2',hazeH:30,hazeA:.5,fillBelow:'#6a7068'});
      /* residential slabs climbing the slope: pale, gridded, a red or green crown */ let x=0; while(x<w){ const tw=7+r()*9, th=30+r()*40, c=['#e4dccc','#d4dcd8','#e8d8d0','#ccd4dc','#dce4cc'][r()*5|0];
        vfill(g,x,base-th,tw,th,[[0,mix(c,'#ffffff',.15)],[1,mix(c,'#5a6068',.25)]]); for(let y=base-th+2;y<base;y+=1.5){ R(g,rgba('#3a4a5a',.35),x+.6,y,tw-1.2,.6); } for(let k=1;k<tw/2.2;k++) R(g,rgba('#000000',.08),x+k*2.2,base-th,.3,th);
        R(g,['#c8402a','#2a8a5a','#e8e4dc','#2a5aa8'][r()*4|0],x,base-th-1.5,tw,1.5); hfill(g,x+tw*.8,base-th,tw*.2,th,[[0,rgba('#000000',0)],[1,rgba('#000000',.2)]]); x+=tw+2+r()*8; }
      oHaze(g,w,0,base,'#e4e4e0',.25,.15); },
    mid(g,w,h,r){ const base=95; let x=0, i=0;
      while(x<w){ const bw=12+r()*14, bh=34+r()*50, top=base-bh, c=['#d8ccb8','#c8d0c8','#e0c8c0','#b8c4cc','#d8d0a8','#e8e0d4'][r()*6|0];
        vfill(g,x,top,bw,bh,[[0,mix(c,'#ffffff',.1)],[1,mix(c,'#3a3a40',.3)]]);
        for(let y=top+2;y<base-6;y+=3.4) for(let xx=x+1;xx<x+bw-2;xx+=3){ R(g,r()<.15?'#ffe0a0':mix(c,'#2a3040',.5),xx,y,2,1.8); if(r()<.2) R(g,'#e8e8e4',xx,y+2,1.6,.9); }
        if(i%2===0){ const sx=x+bw-2, sy=top+8+r()*14; R(g,'#4a4a50',sx-3,sy+1,6,.5); hkSign(g,sx+1,sy-4,5,18,i+3); } if(i%3===1) hkSign(g,x+2,top+bh*.5,bw*.7,5,i,false);
        R(g,'#2a2a30',x,base-6,bw,6); vfill(g,x+1,base-5,bw-2,4,[[0,'#f2d8a0'],[1,'#a88848']]); x+=bw+.5; i++; } },
    verge:()=>outPX(256,88,4,(g,w,h)=>{ const r=rng(53);
      /* the far pavement, the tram street (rails, yellow kerb lines), a gravel shoulder */
      for(let y=0;y<10;y+=3) for(let x=(y/3%2)*3;x<w;x+=6) vfill(g,x+.15,y+.15,5.7,2.7,[[0,'#c8bca8'],[1,'#b0a490']]); R(g,'#8a8a86',0,10,w,1.5);
      vfill(g,0,11.5,w,58,[[0,'#4a4a4e'],[.5,'#56565a'],[1,'#4a4a4e']]); for(let i=0;i<3000;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.07),r()*w,11.5+r()*58,.6,.4);
      R(g,'#f2c230',0,13,w,.6); R(g,'#f2c230',0,14.2,w,.6); R(g,'#f2c230',0,66,w,.6); R(g,'#f2c230',0,67.2,w,.6); for(let x=0;x<w;x+=10) R(g,'#e8e8e0',x,39,5,.6);
      for(const y of [26,32]){ R(g,'#2a2a2c',y===26?0:0,y-.4,w,1.6); R(g,'#a8a8a4',0,y,w,.5); } for(let i=0;i<10;i++){ const x=r()*w; ell(g,x,20+r()*40,4+r()*6,1,rgba('#2a2a2c',.35)); }
      R(g,'#9a9a92',0,69.5,w,2); vfill(g,0,h-16,w,16,[[0,'#8a8478'],[1,'#7a746a']]); for(let i=0;i<2400;i++) R(g,['#a8a294','#6a645a','#94907e','#5a564e'][i%4],r()*w,h-16+r()*16,.6+r()*.6,.5+r()*.4); }),
    rail:{cab:false},
    vergeW:11, vergeTile:32,
    ground:()=>P2(64,64,(g,w,h)=>{ R(g,'#3a3a3e',0,0,w,h); const r=rng(59); for(let i=0;i<200;i++) R(g,rgba('#ffffff',.06),r()*w,r()*h,1,1); },6,59), groundTile:8 }
};
OUTK.hongkong.kit={S:4, ah:320,
  cells:{f1:[0,0,64,16],f2:[0,16,64,16],f3:[0,32,64,16],f4:[0,48,64,16],g1:[0,64,64,24],par:[0,88,64,8],
    f5:[64,0,64,16],f6:[64,16,64,16],g2:[64,32,64,24],side:[64,56,32,32],roofT:[96,56,16,16],seawall:[64,88,64,8],
    s1:[128,0,16,48],s2:[144,0,16,48],s3:[160,0,16,48],s4:[176,0,16,48],s5:[192,0,16,48],sh1:[208,0,48,16],sh2:[208,16,48,16],lampH:[208,32,16,16],bollard:[224,32,8,12],taxiE:[232,32,16,14],
    bench:[128,48,24,10],stall:[152,48,48,24],awn:[200,48,32,16],taxi:[128,72,40,14],taxiT:[168,72,16,14],
    tram:[0,96,96,40],tramE:[96,96,24,40],ferryH:[120,96,128,16],ferryD:[120,112,128,20],ferryR:[120,132,32,8],sampan:[152,132,64,24],
    banyan:[0,160,64,64],palm:[64,160,48,64],scaff:[112,160,48,64],
    wire:[216,132,4,4],blackmetal:[220,132,6,24],steel:[226,132,6,24],concrete:[232,132,16,16],white:[248,132,4,4],tufts:[160,160,48,20],shrub:[208,160,32,24],dark:[248,136,4,4],planter:[160,180,32,12],tramT:[192,184,32,16],g3:[0,224,64,24],g4:[64,224,64,24]},
  paint:{
    f1:(g,x,y,w,h)=>hkFloor(g,x,y,w,h,{seed:1,col:'#e2d8c2',tile:true,ac:.5,laundry:.3,cage:true}),
    f2:(g,x,y,w,h)=>hkFloor(g,x,y,w,h,{seed:2,col:'#c8d8cc',ac:.6,laundry:.25,cage:true}),
    f3:(g,x,y,w,h)=>hkFloor(g,x,y,w,h,{seed:3,col:'#e8cfc4',tile:true,ac:.4,laundry:.35}),
    f4:(g,x,y,w,h)=>hkFloor(g,x,y,w,h,{seed:4,col:'#d4d8dc',ac:.55,laundry:.2,cage:true}),
    f5:(g,x,y,w,h)=>hkFloor(g,x,y,w,h,{seed:5,col:'#e4dca8',tile:true,ac:.5,laundry:.3}),
    f6:(g,x,y,w,h)=>hkFloor(g,x,y,w,h,{seed:6,col:'#bcc8d4',ac:.45,laundry:.3,cage:true,bays:5}),
    g1:(g,x,y,w,h)=>hkShop(g,x,y,w,h,{seed:7,sign:0}), g2:(g,x,y,w,h)=>hkShop(g,x,y,w,h,{seed:8,sign:1}), g3:(g,x,y,w,h)=>hkShop(g,x,y,w,h,{seed:9,sign:3}), g4:(g,x,y,w,h)=>hkShop(g,x,y,w,h,{seed:10,sign:5}),
    par:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#d8d4cc'],[1,'#a8a49c']]); R(g,'#8a8680',x,y+h-1,w,1); for(let k=0;k<w;k+=8) R(g,rgba('#000000',.1),x+k,y,.3,h); },
    side:(g,x,y,w,h)=>{ const r=rng(9); vfill(g,x,y,w,h,[[0,'#c8c2b4'],[1,'#8a8478']]); for(let i=0;i<60;i++) R(g,rgba('#3a3020',.1),x+r()*w,y+r()*h,.4,2+r()*6); for(let k=0;k<4;k++) R(g,'#5a5a5a',x+w*.7,y+k*8,.6,8); },
    roofT:(g,x,y,w,h)=>oStone(g,x,y,w,h,'#8a8a84'),
    seawall:(g,x,y,w,h)=>oStone(g,x,y,w,h,'#6a6a62',{blocks:4}),
    s1:(g,x,y,w,h)=>hkSign(g,x+1,y+1,w-2,h-2,0), s2:(g,x,y,w,h)=>hkSign(g,x+1,y+1,w-2,h-2,1), s3:(g,x,y,w,h)=>hkSign(g,x+1,y+1,w-2,h-2,2), s4:(g,x,y,w,h)=>hkSign(g,x+1,y+1,w-2,h-2,4), s5:(g,x,y,w,h)=>hkSign(g,x+1,y+1,w-2,h-2,5),
    sh1:(g,x,y,w,h)=>hkSign(g,x+1,y+1,w-2,h-2,3,false), sh2:(g,x,y,w,h)=>hkSign(g,x+1,y+1,w-2,h-2,0,false),
    lampH:(g,x,y,w,h)=>{ R(g,'#2a2a2e',x+w*.2,y+h*.3,w*.6,h*.2); vfill(g,x+w*.25,y+h*.5,w*.5,h*.2,[[0,'#f8f0d0'],[1,'#d8c890']]); R(g,'#2a2a2e',x+w/2-.4,y+h*.7,.8,h*.3); },
    bollard:(g,x,y,w,h)=>{ hfill(g,x+1,y+3,w-2,h-3,[[0,'#2a2a2e'],[.4,'#5a5a60'],[1,'#1a1a1e']]); ell(g,x+w/2,y+3,w/2-.5,2,'#3a3a40'); },
    taxiE:(g,x,y,w,h)=>{ R(g,'#c8202a',x,y+h*.4,w,h*.45); vfill(g,x+1,y+h*.05,w-2,h*.38,[[0,'#8ab0c8'],[1,'#3a4a5a']]); R(g,'#f2f2e0',x+1,y+h*.55,2,1.5); R(g,'#f2f2e0',x+w-3,y+h*.55,2,1.5); R(g,'#1a1a1a',x+1,y+h*.85,w-2,h*.15); },
    bench:(g,x,y,w,h)=>{ oPlanks(g,x,y,w,h*.6,'#8a6a46',{n:3}); R(g,'#2a2a2e',x+1,y+h*.6,1,h*.4); R(g,'#2a2a2e',x+w-2,y+h*.6,1,h*.4); },
    stall:(g,x,y,w,h)=>{ R(g,'#5a5048',x,y,w,h); for(let k=0;k<4;k++) for(let j=0;j<6;j++) ell(g,x+3+j*7.5,y+h*.3+k*4.5,2.4,1.8,['#f28a3a','#7cb04a','#f2c230','#c8302a','#e8e0c8'][(k+j)%5]); R(g,'#8a6a46',x,y+h*.72,w,h*.28); },
    awn:(g,x,y,w,h)=>{ for(let k=0;k<w;k+=4) vfill(g,x+k,y,4,h,[[0,(k/4)%2?'#c8202a':'#f2ece0'],[1,mix((k/4)%2?'#c8202a':'#f2ece0','#000000',.25)]]); },
    taxi:(g,x,y,w,h)=>{ /* red taxi, silver roof */ R(g,'#b81c24',x,y+h*.42,w,h*.42); vfill(g,x,y+h*.42,w,h*.2,[[0,'#e84a4a'],[1,'#b81c24']]); poly(g,[[x+w*.22,y+h*.42],[x+w*.3,y+h*.06],[x+w*.72,y+h*.06],[x+w*.8,y+h*.42]],'#c8c8c4');
      vfill(g,x+w*.33,y+h*.12,w*.18,h*.28,[[0,'#a8c8d8'],[1,'#3a4a5a']]); vfill(g,x+w*.53,y+h*.12,w*.18,h*.28,[[0,'#a8c8d8'],[1,'#3a4a5a']]); R(g,'#f2f2e0',x+w*.47,y,w*.08,h*.08);
      for(const wx of [.2,.8]){ ell(g,x+w*wx,y+h*.84,h*.17,h*.17,'#1a1a1a'); ell(g,x+w*wx,y+h*.84,h*.08,h*.08,'#9a9a9a'); } R(g,'#f2f0d0',x+w-1.5,y+h*.5,1.5,1); },
    taxiT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#d8d8d4'],[1,'#a8a8a4']]),
    tram:(g,x,y,w,h)=>{ /* double-decker tram side: green livery, cream band, two decks of windows, an advert */
      vfill(g,x,y,w,h,[[0,'#3a8a5a'],[.5,'#2a7a4a'],[1,'#1a5a36']]); R(g,'#e8e4d0',x,y+h*.47,w,h*.06); R(g,'#e8e4d0',x,y+h*.05,w,h*.04);
      for(let k=0;k<9;k++){ vfill(g,x+3+k*10.2,y+h*.12,8.6,h*.26,[[0,'#b8d4e0'],[.6,'#5a7488'],[1,'#3a4a5a']]); vfill(g,x+3+k*10.2,y+h*.58,8.6,h*.24,[[0,'#a8c4d0'],[.6,'#4a6478'],[1,'#2a3a4a']]); R(g,rgba('#ffffff',.2),x+4+k*10.2,y+h*.13,2,h*.24); }
      R(g,'#f2c230',x+20,y+h*.4,50,h*.06); text(g,'DING DING',x+30,y+h*.405,'#1a3a2a',.6); R(g,'#1a1a1a',x,y+h*.9,w,h*.1); for(const wx of [.15,.85]){ ell(g,x+w*wx,y+h*.95,3,2,'#2a2a2a'); } R(g,'#2a2a2e',x+w*.48,y+h*.58,6,h*.32); },
    tramE:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#3a8a5a'],[1,'#1a5a36']]); vfill(g,x+2,y+h*.1,w-4,h*.25,[[0,'#b8d4e0'],[1,'#3a4a5a']]); vfill(g,x+2,y+h*.55,w-4,h*.25,[[0,'#b8d4e0'],[1,'#3a4a5a']]); R(g,'#1a1a1a',x+4,y+h*.02,w-8,h*.06); text(g,'26',x+w/2-3,y+h*.025,'#f2f2e0',.5); R(g,'#e8e4d0',x,y+h*.47,w,h*.06); R(g,'#f2f0c0',x+2,y+h*.86,2,1.4); R(g,'#f2f0c0',x+w-4,y+h*.86,2,1.4); },
    tramT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#d8d8d0'],[1,'#a8a8a0']]),
    ferryH:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#3a8a5a'],[.6,'#2a6a46'],[1,'#1a4a30']]); R(g,'#f2f2ec',x,y,w,h*.18); for(let k=0;k<w;k+=7) R(g,'#c8c8c0',x+k,y+h*.3,3,1.2); R(g,'#c8402a',x,y+h-2,w,2); },
    ferryD:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f6f6f0'],[1,'#d8d8d0']]); for(let k=0;k<14;k++) vfill(g,x+3+k*8.9,y+h*.2,6.8,h*.42,[[0,'#a8c8d8'],[1,'#3a5060']]); R(g,'#2a7a4a',x,y+h*.78,w,h*.22); text(g,'MERIDIAN STAR',x+40,y+h*.82,'#f2f2ec',.6); },
    ferryR:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#2a7a4a'],[1,'#1a5a36']]),
    sampan:(g,x,y,w,h)=>{ poly(g,[[x+2,y+h*.55],[x+w-2,y+h*.45],[x+w-8,y+h],[x+8,y+h]],'#6a4a2e'); R(g,'#4a3020',x+4,y+h*.55,w-8,1); vfill(g,x+18,y+h*.15,26,h*.42,[[0,'#3a5a3a'],[1,'#2a4a2a']]); for(let k=0;k<6;k++) R(g,'#4a6a40',x+18,y+h*.18+k*h*.07,26,.4); R(g,'#e8e0d0',x+46,y+h*.3,6,h*.25); poly(g,[[x+w-2,y+h*.45],[x+w,y+h*.3],[x+w-4,y+h*.5]],'#6a4a2e'); },
    banyan:(g,x,y,w,h)=>{ oTree(g,x,y,w,h,'round',71,{pal:['#2a4a26','#3a6430','#5a8a40','#86ae5a'],n:40,bark:['#6a6052','#4a4238','#3a342c']}); const r=rng(73); g.strokeStyle='#5a5246'; g.lineWidth=.35; for(let i=0;i<24;i++){ const ax=x+w*(.15+r()*.7); g.beginPath(); g.moveTo(ax,y+h*.5); g.lineTo(ax+(r()-.5)*2,y+h*(.75+r()*.22)); g.stroke(); } },
    palm:(g,x,y,w,h)=>oTree(g,x,y,w,h,'palm',75,{lean:.3}),
    scaff:(g,x,y,w,h)=>{ const r=rng(77); for(let k=0;k<=w;k+=5) R(g,'#c8a868',x+k,y,.7,h); for(let k=0;k<h;k+=6) R(g,'#b89858',x,y+k,w,.6); for(let i=0;i<12;i++){ const a=x+r()*w, b=y+r()*h; g.strokeStyle='#a88848'; g.lineWidth=.5; g.beginPath(); g.moveTo(a,b); g.lineTo(a+8,b+8); g.stroke(); } vfill(g,x,y+h*.1,w*.4,h*.5,[[0,rgba('#2a6a3a',.85)],[1,rgba('#1a5a2a',.85)]]); },
    planter:(g,x,y,w,h)=>{ oStone(g,x,y,w,h,'#b8b2a6',{seed:4}); R(g,'#d8d2c6',x,y,w,1.4); },
  },
  place(E,side,r,P){
    if(side==='pos'){
      /* the sea wall and the promenade railing */ E.rail(0,P,12.6,-.32,.32,'seawall'); E.box(P/2,12.45,P,.12,.2,{f:'concrete',e:null,t:'concrete'},{y:0});
      for(let u=0;u<P;u+=2) E.post(u,12.25,.06,1.1,'steel',{top:true}); E.rail(0,P,12.22,1.04,.07,'steel'); E.rail(0,P,12.22,.55,.04,'steel');
      for(let u=10;u<P;u+=20){ E.post(u,11.6,.16,4.6,'blackmetal',{top:true}); E.box(u,11.35,.1,.1,.5,'blackmetal',{y:4.5}); E.card(u,11.1,.7,.7,'lampH',{n:2,y:4.0}); }
      for(let u=4;u<P;u+=26){ E.box(u,10.2,1.8,.45,.5,{f:'bench',e:'bench',t:'bench'}); E.box(u,10.65,1.8,.5,.08,{f:'bench',e:'bench',t:null},{y:.45}); }
      for(let u=17;u<P;u+=30){ E.box(u,7.6,1.8,.6,1.8,{f:'planter',e:'planter',t:'tufts'}); E.card(u,8.5,r()<.5?7:5,r()<.5?7.5:8,r()<.6?'banyan':'palm',{n:3,y:.6,sb:.7}); }
      for(let u=0;u<P;u+=9) E.post(u,12.4,.22,.55,'bollard',{top:true});
      /* the quay: a ferry alongside and sampans */
      { const u=70, d=14; E.box(u,d,34,1.8,6.5,{f:'ferryH',e:'ferryH',t:'concrete'},{y:-.6,ao:.85}); E.box(u,d+.4,28,2.3,5.7,{f:'ferryD',e:'ferryD',t:null},{y:1.2}); E.box(u,d+.2,30,.25,6.1,{f:'ferryR',e:'ferryR',t:'ferryR'},{y:3.5});
        E.box(u-10,d+1.8,4,1.6,2.6,{f:'ferryD',e:'ferryD',t:'ferryR'},{y:3.75}); E.post(u-10,d+3,.25,3,'dark',{y:5}); }
      for(const [u,d] of [[150,15],[176,17.5],[205,14.5]]) E.card(u,d,8,3,'sampan',{n:1,y:-.75,sb:.9});
      E.card(130,14.2,1,1.2,'bollard',{n:2}); }
    else {
      /* a low wall along the line, then the tram street */ E.box(P/2,4.5,P,.9,.25,{f:'concrete',e:null,t:'concrete'},{ao:.6});
      for(let u=0;u<P;u+=34){ E.post(u,12.8,.18,6.4,'blackmetal',{top:true}); E.box(u,11.6,.1,.1,1.3,'blackmetal',{y:6.3}); E.card(u,11.2,.8,.8,'lampH',{n:2,y:5.8}); }
      for(let u=-20;u<P;u+=40) E.wire(u,u+40,8.1,6.4,.2,'wire',.03);
      { const u=110, d=6.9; E.box(u,d,12,3.9,2.4,{f:'tram',e:'tramE',t:'tramT'},{y:.25,ao:.8}); E.post(u+2,d+1.2,.06,2.3,'dark',{y:4.1}); }
      for(const [u,d] of [[30,9.3],[64,6.4],[180,9.6],[214,6.6]]) E.box(u,d,4.6,1.5,1.8,{f:'taxi',e:'taxiE',t:'taxiT'},{ao:.6});
      /* the tenements, floor by floor, signs hanging out over the street */
      let u=0, i=0; const fl=['f1','f2','f3','f4','f5','f6'];
      while(u<P-6){ const w=8+r()*6, fls=4+(r()*6|0), dp=10, d=14.2, cu=u+w/2, F=[fl[i%6],fl[(i+2)%6]];
        const top=outTower(E,cu,d,w,dp,fls,{g:['g1','g2','g3','g4'][i%4],f:F,p:'par',e:'side',t:'roofT'},{r,fh:3,gh:4.2});
        for(let k=0;k<1+(r()*2|0);k++){ const sy=5+r()*Math.max(1,top-11), sk=['s1','s2','s3','s4','s5'][(i+k)%5]; E.card(cu+(k?-1:1)*w*.3,d-1.25,2.4,4,sk,{n:1,a0:Math.PI/2,y:sy,sb:1}); E.box(cu+(k?-1:1)*w*.3,d-2.5,.08,.08,2.5,'blackmetal',{y:sy+4}); }
        if(r()<.45){ const sy=5.5+r()*4; E.card(cu,d-2.2,4.4,1.4,r()<.5?'sh1':'sh2',{n:1,a0:Math.PI/2,y:sy}); }
        if(r()<.2) E.card(cu,d-.3,w*.8,Math.min(top,14),'scaff',{n:1,y:2}); if(r()<.35) E.box(cu-w*.25,d,1.6,1.4,1.2,{f:'side',e:'side',t:'roofT'},{y:top});
        if(r()<.5){ E.box(cu,d-1.2,w*.7,.15,1.2,{f:'awn',e:'awn',t:'awn'},{y:2.7}); E.box(cu,d-.8,w*.6,1.1,.7,{f:'stall',e:'stall',t:'stall'}); }
        u+=w; i++; }
      for(let k=0;k<12;k++) E.card(r()*P,5.1+r()*.5,.8,.4,'tufts',{n:2,sb:.7}); }
  } };
OUTK.hongkong.kit.atlas=outKitAtlas(OUTK.hongkong.kit);
