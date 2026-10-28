
/* =====================================================================================================
   TOKYO BY NIGHT. Both sides close and dense: concrete poles strung with a dozen wires and transformers,
   narrow buildings floor on floor with lit windows, vertical signs in every colour hanging out over the
   street, an izakaya under red lanterns and a noren, a konbini glowing white, ramen and pachinko, vending
   machines humming, bicycles, a dark taxi; neon towers beyond, red aircraft lights, the lattice tower lit
   orange on the skyline.
   ===================================================================================================== */
const TN_NEON=['#ff3fa4','#29e0e6','#f5c542','#7cf06a','#ff5a3a','#ffffff','#b06aff'];
function tnSign(g,x,y,w,h,k,vert=true){ const c=TN_NEON[k%TN_NEON.length], bg=k%3===0?'#0e0c18':mix(c,'#000000',.15), fg=k%3===0?c:'#1a1420';
  R(g,'#2a2836',x,y,w,h); vfill(g,x+.6,y+.6,w-1.2,h-1.2,[[0,mix(bg,'#ffffff',.2)],[.5,bg],[1,mix(bg,'#000000',.25)]]);
  if(vert) glyphs(g,x+w/2-2.5,y+3,Math.max(2,(h-5)/6|0),6,fg,k*11+5,true); else glyphs(g,x+3,y+h/2-2.5,Math.max(2,(w-5)/6|0),6,fg,k*11+7,false);
  g.strokeStyle=rgba(c,.9); g.lineWidth=.4; g.strokeRect(x+.4,y+.4,w-.8,h-.8); }
function tnFloor(g,x,y,w,h,o){ const r=rng(o.seed), c=o.col; vfill(g,x,y,w,h,[[0,mix(c,'#ffffff',.06)],[1,mix(c,'#000000',.2)]]);
  const bays=o.bays||4, bw=w/bays;
  for(let b=0;b<bays;b++){ const wx=x+b*bw+bw*.1, ww=bw*.8, wy=y+h*.18, wh=h*.58, lit=r()<o.lit, tint=['#fff0c8','#e8f4ff','#ffe0a0','#c8f0ff'][r()*4|0];
    R(g,'#14121c',wx-.4,wy-.4,ww+.8,wh+.8); vfill(g,wx,wy,ww,wh,lit?[[0,tint],[1,mix(tint,'#c08040',.35)]]:[[0,'#2a2a3a'],[1,'#1a1a26']]);
    if(lit&&r()<.5){ R(g,rgba('#3a3040',.6),wx,wy,ww*.3,wh); } if(lit&&r()<.3) for(let k=0;k<3;k++) R(g,rgba('#000000',.25),wx,wy+k*wh/3,ww,.3);
    if(o.ac&&r()<o.ac){ vfill(g,wx+ww*.6,wy+wh+.8,bw*.3,h*.18,[[0,'#8a8a8e'],[1,'#5a5a5e']]); } }
  R(g,mix(c,'#ffffff',.15),x,y+h-1,w,.5); R(g,rgba('#000000',.3),x,y+h-.5,w,.5); }
function tnShop(g,x,y,w,h,kind){ const r=rng(kind*7+3);
  if(kind===0){ /* izakaya: dark wood, warm light, red lanterns, a noren */ vfill(g,x,y,w,h,[[0,'#3a2418'],[1,'#1e120c']]); vfill(g,x+2,y+h*.35,w-4,h*.65,[[0,'#ffd8a0'],[1,'#c8783a']]); for(let k=0;k<w-4;k+=2) R(g,'#5a3a20',x+2+k,y+h*.35,.4,h*.65);
    for(let k=0;k<5;k++) vfill(g,x+4+k*(w-8)/5,y+h*.35,(w-8)/5-.6,h*.3,[[0,'#2a2a4a'],[1,'#1a1a3a']]); text(g,'IZAKAYA',x+w/2-textW('IZAKAYA',.6)/2,y+h*.4,'#f2ece0',.6);
    R(g,'#1a0e08',x,y,w,h*.28); glyphs(g,x+4,y+h*.06,Math.max(2,(w-8)/6|0),6,'#ffe0a0',kind+5,false); for(const k of [.1,.9]){ ell(g,x+w*k,y+h*.42,2.6,3.4,'#ff4a2a'); R(g,'#1a0e08',x+w*k-2.2,y+h*.42-3.4,4.4,.6); R(g,'#1a0e08',x+w*k-2.2,y+h*.42+3,4.4,.6); ell(g,x+w*k-.8,y+h*.4,.8,1.6,'#ffb080'); } }
  else if(kind===1){ /* konbini: white glow, coloured stripes */ vfill(g,x,y,w,h,[[0,'#f2f6fa'],[1,'#c8d0d8']]); R(g,'#2a8a5a',x,y+h*.12,w,h*.06); R(g,'#2a5ad8',x,y+h*.18,w,h*.06); R(g,'#f2c230',x,y+h*.24,w,h*.04); text(g,'24 MART',x+3,y+h*.02,'#2a5ad8',.6);
    vfill(g,x+1,y+h*.32,w-2,h*.68,[[0,'#ffffff'],[1,'#e2eaf2']]); for(let k=0;k<4;k++) for(let j=0;j<3;j++) R(g,['#e04a3a','#f2c230','#2a8a5a','#2a5ad8','#f28ab0'][(k+j)%5],x+3+k*(w-6)/4,y+h*(.45+j*.15),(w-6)/4-1,h*.08); }
  else if(kind===2){ /* ramen: a red front, steam window, big bowl sign */ vfill(g,x,y,w,h,[[0,'#a81c1c'],[1,'#5a0e0e']]); vfill(g,x+2,y+h*.4,w-4,h*.6,[[0,'#ffe8b0'],[1,'#d89050']]); ell(g,x+w/2,y+h*.18,w*.18,h*.12,'#f2ece0'); ell(g,x+w/2,y+h*.16,w*.14,h*.06,'#e8a050'); text(g,'RAMEN',x+3,y+h*.06,'#ffe0a0',.6);
    for(let k=0;k<4;k++) R(g,'#1a1a1a',x+3+k*(w-6)/4,y+h*.4,(w-6)/4-1,h*.28); }
  else { /* pachinko: gold and chrome, chasing bulbs */ vfill(g,x,y,w,h,[[0,'#3a1a4a'],[1,'#1a0a24']]); for(let k=0;k<w;k+=1.6) ell(g,x+k+.8,y+1,.5,.5,TN_NEON[(k/1.6|0)%6]); text(g,'PACHINKO',x+w/2-textW('PACHINKO',.6)/2,y+h*.1,'#f5c542',.6);
    vfill(g,x+2,y+h*.32,w-4,h*.68,[[0,'#fff2c8'],[1,'#e0a040']]); for(let k=0;k<6;k++) R(g,'#c8a040',x+3+k*(w-6)/6,y+h*.32,.5,h*.68); }
  vfill(g,x,y+h-2,w,2,[[0,rgba('#000000',0)],[1,rgba('#000000',.4)]]); }
OUTK.tokyonight={
  sky:()=>oSkyTex([[0,'#04061a'],[.5,'#141436'],[.8,'#3a1e5a'],[.94,'#6a2a6a'],[1,'#8a3a70']],{stars:120,seed:91,clouds:5,cloudCol:'#4a2a5a',cloudShade:'#1a1030'}),
  pos:{
    far(g,w,h,r){ const base=91; let x=0; while(x<w){ const tw=3+r()*7, th=10+r()*32; vfill(g,x,base-th,tw,th,[[0,'#1a1830'],[1,'#100e20']]); for(let y=base-th+1;y<base;y+=1.2) for(let xx=x+.4;xx<x+tw-.4;xx+=1) if(r()<.32) R(g,r()<.8?'#ffd890':'#9ae8f0',xx,y,.5,.5); if(r()<.4) R(g,'#ff3a3a',x+tw/2,base-th-1,.6,.6); x+=tw+r()*2; }
      /* the lattice tower, lit orange */ const cx=200; for(let k=0;k<26;k++){ const y=base-k*3.6, ww=26*(1-k/26)**1.6+1.2; g.strokeStyle='#ff9a3a'; g.lineWidth=.35; g.beginPath(); g.moveTo(cx-ww/2,y); g.lineTo(cx+ww/2,y-3.6); g.moveTo(cx+ww/2,y); g.lineTo(cx-ww/2,y-3.6); g.stroke(); R(g,'#ffb060',cx-ww/2,y-.3,.5,.4); R(g,'#ffb060',cx+ww/2-.5,y-.3,.5,.4); }
      g.strokeStyle='#ffb060'; g.lineWidth=.5; g.beginPath(); g.moveTo(cx-13,base); g.quadraticCurveTo(cx-3,base-50,cx-.5,base-94); g.moveTo(cx+13,base); g.quadraticCurveTo(cx+3,base-50,cx+.5,base-94); g.stroke(); R(g,'#ffd8a0',cx-3,base-58,6,2); R(g,'#ffd8a0',cx-2,base-82,4,1.4); R(g,'#ff3a3a',cx-.3,base-96,.6,2); vGlow(g,cx,base-50,40,'#ff9a3a',.25);
      R(g,'#100e1e',0,base,w,h-base); vfill(g,0,base-30,w,30,[[0,rgba('#6a2a6a',0)],[1,rgba('#8a3a7a',.35)]]); },
    back(g,w,h,r){ const base=94; let x=0; while(x<w){ const tw=8+r()*14, th=24+r()*56; vfill(g,x,base-th,tw,th,[[0,'#24223a'],[1,'#141224']]);
        for(let y=base-th+2;y<base;y+=1.8) for(let xx=x+1;xx<x+tw-1;xx+=1.5) if(r()<.4) R(g,['#ffd890','#e8f4ff','#ffe8c0'][r()*3|0],xx,y,.9,.8); R(g,'#ff2a2a',x+tw/2-.4,base-th-1.2,.8,.8); vGlow(g,x+tw/2,base-th-1,3,'#ff2a2a',.4);
        if(r()<.3){ const c=TN_NEON[r()*7|0]; R(g,'#0e0c18',x+1,base-th+4,tw-2,5); R(g,c,x+1.6,base-th+5,tw-3.2,3); } x+=tw+1+r()*6; } },
    mid(g,w,h,r){ const base=95; let x=0, i=0;
      while(x<w){ const bw=12+r()*16, bh=36+r()*44, top=base-bh; vfill(g,x,top,bw,bh,[[0,'#201e32'],[1,'#121020']]);
        for(let y=top+3;y<base-10;y+=3.4) for(let xx=x+1.5;xx<x+bw-2;xx+=2.6) R(g,r()<.35?'#ffcf80':r()<.12?'#7ae8f0':'#24223a',xx,y,1.8,1.8);
        const c=TN_NEON[(i+3)%7]; if(i%2===0){ const sx=x+bw-5, sh=Math.min(36,bh-12); vGlow(g,sx+2.5,top+6+sh/2,sh*.6,c,.35); tnSign(g,sx,top+5,5,sh,i+1); }
        else if(bw>18){ vGlow(g,x+bw/2,top+10,bw*.7,c,.35); tnSign(g,x+2,top+5,bw-4,8,i+2,false); }
        R(g,'#0a0912',x,base-9,bw,9); vfill(g,x+1,base-8,bw-2,7,[[0,['#ffd8a0','#f2f6fa','#ffe0a0'][i%3]],[1,'#a86a3a']]); x+=bw+r()*2; i++; }
      R(g,'#2a2836',0,base-32,w,3); R(g,'#ff3fa4',0,base-29,w,.6); for(let k=10;k<w;k+=50) R(g,'#22202e',k,base-29,4,29); },
    verge:()=>outPX(256,88,4,(g,w,h)=>{ const r=rng(171);
      /* the street at night: wet asphalt full of neon reflections, white lines, a narrow pavement, gravel */
      vfill(g,0,0,w,10,[[0,'#3a3844'],[1,'#2e2c38']]); for(let x=0;x<w;x+=4) R(g,'#24222c',x,0,.4,10);
      vfill(g,0,10,w,58,[[0,'#1a1a22'],[.5,'#22222a'],[1,'#1a1a22']]); for(let i=0;i<2400;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.05),r()*w,10+r()*58,.6,.4);
      for(let i=0;i<26;i++){ const x=r()*w, y=12+r()*48, c=TN_NEON[i%7], ww=2+r()*5; vfill(g,x,y,ww,6+r()*8,[[0,rgba(c,.22)],[1,rgba(c,0)]]); }
      R(g,'#e8e8e0',0,12,w,.6); R(g,'#e8e8e0',0,66,w,.6); for(let x=0;x<w;x+=12) R(g,'#c8c8c0',x,39,6,.5); for(let x=40;x<60;x+=2.4) R(g,'#d8d8d0',x,14,1.4,24);
      R(g,'#3a3644',0,68,w,4); vfill(g,0,h-16,w,16,[[0,'#3a3640'],[1,'#2a2630']]); for(let i=0;i<2400;i++) R(g,['#5a5660','#1a1620','#4a4650','#24202a'][i%4],r()*w,h-16+r()*16,.6+r()*.6,.5+r()*.4); }),
    vergeW:11, vergeTile:32,
    ground:()=>P2(64,64,(g,w,h)=>{ R(g,'#16141e',0,0,w,h); const r=rng(173); for(let i=0;i<60;i++) R(g,rgba(TN_NEON[i%7],.2),r()*w,r()*h,1,1); },6,173), groundTile:8 }
};
OUTK.tokyonight.neg=Object.assign({},OUTK.tokyonight.pos,{ far(g,w,h,r){ const base=91; let x=0; while(x<w){ const tw=4+r()*9, th=14+r()*46; vfill(g,x,base-th,tw,th,[[0,'#1a1830'],[1,'#100e20']]); for(let y=base-th+1;y<base;y+=1.2) for(let xx=x+.4;xx<x+tw-.4;xx+=1) if(r()<.3) R(g,r()<.8?'#ffd890':'#9ae8f0',xx,y,.5,.5); if(r()<.5){ R(g,'#ff3a3a',x+tw/2,base-th-1,.6,.6); vGlow(g,x+tw/2,base-th-1,3,'#ff3a3a',.35); } x+=tw+r()*2; }
  R(g,'#100e1e',0,base,w,h-base); vfill(g,0,base-30,w,30,[[0,rgba('#6a2a6a',0)],[1,rgba('#8a3a7a',.35)]]); } });
OUTK.tokyonight.kit={S:4, ah:288,
  cells:{f1:[0,0,64,16],f2:[0,16,64,16],f3:[0,32,64,16],f4:[0,48,64,16],gI:[0,64,64,24],gK:[64,64,64,24],gR:[128,64,64,24],gP:[192,64,64,24],side:[64,0,32,32],par:[64,32,64,8],roofT:[96,0,16,16],bill:[128,0,64,24],
    v1:[192,0,16,48],v2:[208,0,16,48],v3:[224,0,16,48],v4:[240,0,16,48],h1:[128,24,48,16],h2:[176,24,48,16],lantern:[224,48,12,16],vend:[64,40,20,36],vendS:[84,40,10,36],
    bike:[0,88,24,14],taxi:[24,88,40,14],taxiE:[64,88,16,14],taxiT:[80,88,16,8],xfmr:[96,88,14,20],noren:[112,88,32,12],sign2:[144,88,16,24],cone:[160,88,8,12],
    wire:[0,112,4,4],pole:[4,112,6,96],steel:[10,112,6,24],dark:[16,112,4,4],white:[20,112,4,4],concrete:[24,112,16,16],blackmetal:[40,112,6,24],shrub:[46,112,32,24]},
  paint:{
    f1:(g,x,y,w,h)=>tnFloor(g,x,y,w,h,{seed:1,col:'#3a3644',lit:.55,ac:.3}), f2:(g,x,y,w,h)=>tnFloor(g,x,y,w,h,{seed:2,col:'#4a4450',lit:.45,ac:.4,bays:5}),
    f3:(g,x,y,w,h)=>tnFloor(g,x,y,w,h,{seed:3,col:'#2e3040',lit:.65,bays:3}), f4:(g,x,y,w,h)=>tnFloor(g,x,y,w,h,{seed:4,col:'#544a48',lit:.4,ac:.5}),
    gI:(g,x,y,w,h)=>tnShop(g,x,y,w,h,0), gK:(g,x,y,w,h)=>tnShop(g,x,y,w,h,1), gR:(g,x,y,w,h)=>tnShop(g,x,y,w,h,2), gP:(g,x,y,w,h)=>tnShop(g,x,y,w,h,3),
    side:(g,x,y,w,h)=>{ const r=rng(5); vfill(g,x,y,w,h,[[0,'#34303c'],[1,'#1e1c26']]); for(let i=0;i<10;i++) R(g,r()<.5?'#ffd890':'#2a2836',x+r()*w,y+r()*h,1.4,1.4); for(let k=0;k<4;k++) R(g,'#5a5660',x+w*.8,y+k*8,.5,8); },
    par:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#4a4654'],[1,'#2a2834']]); },
    roofT:(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#3a3644'],[1,'#2a2834']]),
    bill:(g,x,y,w,h)=>{ R(g,'#1a1824',x,y,w,h); vfill(g,x+1,y+1,w-2,h-2,[[0,'#f2f6fa'],[1,'#c8d8e8']]); ell(g,x+16,y+h/2,9,9,'#e04a3a'); text(g,'MERIDIAN',x+28,y+5,'#1a2a4a',.9); text(g,'BEER',x+32,y+13,'#e04a3a',1.1); for(let k=0;k<w;k+=3) ell(g,x+k+1.5,y+h-.6,.5,.5,'#fff6d8'); },
    v1:(g,x,y,w,h)=>tnSign(g,x+1,y+1,w-2,h-2,0), v2:(g,x,y,w,h)=>tnSign(g,x+1,y+1,w-2,h-2,1), v3:(g,x,y,w,h)=>tnSign(g,x+1,y+1,w-2,h-2,2), v4:(g,x,y,w,h)=>tnSign(g,x+1,y+1,w-2,h-2,4),
    h1:(g,x,y,w,h)=>tnSign(g,x+1,y+1,w-2,h-2,3,false), h2:(g,x,y,w,h)=>tnSign(g,x+1,y+1,w-2,h-2,6,false),
    lantern:(g,x,y,w,h)=>{ R(g,'#1a0e08',x+w/2-.4,y,.8,2); ell(g,x+w/2,y+h*.55,w*.45,h*.4,'#ff4a2a'); vGlow(g,x+w/2,y+h*.55,w*.5,'#ffb080',.6); for(let k=0;k<4;k++) R(g,rgba('#8a1a0a',.6),x+1,y+h*.3+k*h*.12,w-2,.3); R(g,'#1a0e08',x+w*.2,y+h*.15,w*.6,1); R(g,'#1a0e08',x+w*.2,y+h*.92,w*.6,1); glyphs(g,x+w/2-2.5,y+h*.4,1,5,'#1a0e08',3,true); },
    vend:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#f2f6fa'],[1,'#c8d0d8']]); R(g,'#2a5ad8',x,y,w,4); R(g,'#1a2a3a',x+1.5,y+5,w-3,h*.42); for(let outHash=0;outHash<3;outHash++) for(let k=0;k<5;k++){ const cx=x+3+k*3, cy=y+7+outHash*5; vfill(g,cx,cy,2,3.4,[[0,['#f2c230','#2a8a5a','#e04a30','#2a6ad8','#f2f2f2'][(k+outHash)%5]],[1,'#3a3a3a']]); }
      radial(g,x+w/2,y+h*.3,w*.8,[[0,rgba('#e8f4ff',.4)],[1,rgba('#e8f4ff',0)]]); R(g,'#3a3a40',x+3,y+h*.62,w-6,h*.1); R(g,'#2a2a30',x+3,y+h*.82,w-6,h*.1); },
    vendS:(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#dcdcd8'],[1,'#a8a8a4']]); R(g,'#2a5ad8',x,y,w,4); },
    bike:(g,x,y,w,h)=>{ g.strokeStyle='#1a1a1e'; g.lineWidth=.6; for(const cx of [x+5,x+w-5]){ g.beginPath(); g.arc(cx,y+h-4.5,4,0,6.28); g.stroke(); } g.strokeStyle='#c8c8cc'; g.beginPath(); g.moveTo(x+5,y+h-4.5); g.lineTo(x+11,y+h-9); g.lineTo(x+w-5,y+h-4.5); g.moveTo(x+11,y+h-9); g.lineTo(x+10,y+h-12); g.moveTo(x+w-7,y+h-11); g.lineTo(x+w-5,y+h-4.5); g.stroke(); R(g,'#1a1a1e',x+8.6,y+h-12.6,3,1); R(g,'#c8c8cc',x+w-9,y+h-11.4,4,.6); },
    taxi:(g,x,y,w,h)=>{ R(g,'#1a2a24',x+1,y+h*.4,w-2,h*.42); vfill(g,x+1,y+h*.4,w-2,h*.12,[[0,'#3a5a4a'],[1,'#1a2a24']]); poly(g,[[x+w*.22,y+h*.4],[x+w*.3,y+h*.1],[x+w*.7,y+h*.1],[x+w*.78,y+h*.4]],'#1a2a24'); vfill(g,x+w*.32,y+h*.14,w*.36,h*.24,[[0,'#ffd8a0'],[1,'#3a3a4a']]); R(g,'#f2c230',x+w*.45,y,w*.1,h*.1); R(g,'#e8e0c8',x+2,y+h*.56,w-4,.6); for(const wx of [.2,.8]){ ell(g,x+w*wx,y+h*.84,h*.16,h*.16,'#0a0a0a'); ell(g,x+w*wx,y+h*.84,h*.07,h*.07,'#8a8a8a'); } },
    taxiE:(g,x,y,w,h)=>{ R(g,'#1a2a24',x+1,y+h*.35,w-2,h*.5); vfill(g,x+2,y+h*.08,w-4,h*.26,[[0,'#ffd8a0'],[1,'#3a3a4a']]); ell(g,x+2.5,y+h*.55,1.3,1.3,'#fff6d8'); ell(g,x+w-2.5,y+h*.55,1.3,1.3,'#fff6d8'); },
    taxiT:(g,x,y,w,h)=>R(g,'#1e2e28',x,y,w,h),
    xfmr:(g,x,y,w,h)=>{ oMetal(g,x+1,y+3,w-2,h-4,'#6a6e74',{bands:4}); R(g,'#4a4e54',x,y+2,w,1.4); },
    noren:(g,x,y,w,h)=>{ for(let k=0;k<5;k++) vfill(g,x+k*w/5+.3,y,w/5-.6,h,[[0,'#2a2a5a'],[1,'#1a1a3a']]); glyphs(g,x+w/2-6,y+3,2,6,'#f2ece0',9,false); },
    sign2:(g,x,y,w,h)=>tnSign(g,x+1,y+1,w-2,h-2,5),
    cone:(g,x,y,w,h)=>{ poly(g,[[x+1,y+h],[x+w-1,y+h],[x+w/2,y]],'#f26a2a'); R(g,'#f2f2ec',x+2,y+h*.45,w-4,1.2); },
    pole:OUT_STDCELL.pole,
  },
  place(E,side,r,P){
    /* concrete poles every 30 m, a mess of wires and transformers */
    const pd=4.7; for(let u=(side==='pos'?6:21);u<P;u+=30){ E.post(u,pd,.3,9,'pole',{top:true,ao:1}); E.box(u,pd-.9,.1,.1,2,'steel',{y:8.2}); E.box(u,pd-.6,.08,.08,1.4,'steel',{y:7.4}); if(r()<.6) E.box(u+.25,pd-.18,.36,.7,.36,{f:'xfmr',e:'xfmr',t:'steel'},{y:6.4}); }
    for(let u=(side==='pos'?6:21)-30;u<P;u+=30) for(const [dd,yy,sg] of [[-.85,8.3,.4],[0,8.3,.45],[.85,8.3,.4],[-.5,7.5,.6],[.4,7.5,.55],[0,6.2,.8],[.5,5.8,1]]) E.wire(u,u+30,pd+dd,yy,sg,'wire',.035);
    /* the buildings, floor by floor, shops at the bottom, signs out over the street */
    let u=0, i=0; const F=['f1','f2','f3','f4'], G=['gI','gK','gR','gP'], V=['v1','v2','v3','v4'];
    while(u<P-5){ const w=6+r()*6, fl=3+(r()*6|0), d=15.4, cu=u+w/2;
      const top=outTower(E,cu,d,w,9,fl,{g:G[(i+(side==='pos'?0:2))%4],f:[F[i%4],F[(i+1)%4]],p:'par',e:'side',t:'roofT'},{r,fh:3,gh:3.6});
      E.card(cu+(r()<.5?-1:1)*w*.32,d-1.1,2.2,Math.min(top-4,5+r()*3),V[(i+r()*4|0)%4],{n:1,a0:Math.PI/2,y:3.8+r()*2,sb:1});
      if(r()<.5) E.card(cu,d-2,3.8,1.3,r()<.5?'h1':'h2',{n:1,a0:Math.PI/2,y:4.5+r()*3});
      if(r()<.35) E.box(cu,d+2,Math.min(w-1,7),2.6,.3,{f:'bill',e:'dark',t:'dark'},{y:top});
      if(G[(i+(side==='pos'?0:2))%4]==='gI'){ for(const dx of [-w*.35,w*.35]) E.card(cu+dx,d-.4,.5,.7,'lantern',{n:2,y:2.2}); E.card(cu,d-.08,w*.5,.8,'noren',{n:1,y:2.3}); }
      u+=w+(r()<.15?2.5:0); i++; }
    for(let k=0;k<6;k++){ const uu=r()*P; E.box(uu,14.3,1,1.85,.7,{f:'vend',e:'vendS',t:'vendS'}); E.box(uu+1.1,14.3,1,1.85,.7,{f:'vend',e:'vendS',t:'vendS'}); }
    for(let k=0;k<12;k++){ const uu=r()*P; for(let j=0;j<3;j++) E.card(uu+j*.6,14.4,1.6,.95,'bike',{n:1,a0:Math.PI/2+.25}); }
    for(let k=0;k<2;k++) E.box(r()*P,side==='pos'?9.4:7.6,4.4,1.5,1.8,{f:'taxi',e:'taxiE',t:'taxiT'},{ao:.6});
    for(let k=0;k<6;k++) E.card(r()*P,13.2,.5,.7,'cone',{n:2});
  } };
OUTK.tokyonight.kit.atlas=outKitAtlas(OUTK.tokyonight.kit);
