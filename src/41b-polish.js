
/* =====================================================================================================
   SCENERY POLISH. Denser near layers, a hills-or-skyline layer between mid and far, trackside props
   that scroll right past the windows, and richer verges. These override the first-pass painters.
   ===================================================================================================== */
/* power lines that wrap across the tile seam */
function wires(g,w,poles,top,sag,col){ g.strokeStyle=col; g.lineWidth=1; for(let k=0;k<3;k++){ const xs=poles.concat([poles[0]+w]); for(let i=0;i<xs.length-1;i++){ const a=xs[i],b=xs[i+1],y=top+k*3; g.beginPath(); g.moveTo(a,y); g.quadraticCurveTo((a+b)/2,y+sag,b,y); g.stroke(); g.beginPath(); g.moveTo(a-w,y); g.quadraticCurveTo((a+b)/2-w,y+sag,b-w,y); g.stroke(); } } }
function utilPole(g,x,base,top){ R(g,'#6a5a4a',x-1,top,3,base-top); for(const [y,wd] of [[top+3,16],[top+9,12]]) R(g,'#4a3e34',x-wd/2,y,wd,2); R(g,'#5a6068',x+3,top+14,5,7); R(g,'#3a3e44',x+3,top+14,5,1); }
function stall(g,x,base,wd,a,b,goods){ R(g,'#3a3a40',x,base-16,1,16); R(g,'#3a3a40',x+wd-1,base-16,1,16); for(let k=0;k<wd;k+=4) R(g,(k/4)%2?a:b,x+k,base-22,4,6); poly(g,[[x-2,base-16],[x+wd+2,base-16],[x+wd,base-22],[x,base-22]],rgba('#000000',.15));
  R(g,'#8a6a46',x,base-8,wd,2); for(let k=0;k<wd-2;k+=3) ell(g,x+2+k,base-10,1.4,1.4,goods[k%goods.length]); }
function phoneBox(g,x,base){ R(g,'#c8202a',x,base-24,9,24); R(g,'#a81a22',x,base-26,9,2); R(g,'#f2e8a0',x+2,base-22,5,1); for(let y=base-19;y<base-3;y+=4) R(g,'#5a7a9a',x+2,y,5,3); }
function cactus(g,x,base,ht){ R(g,'#3a6a3a',x-2,base-ht,4,ht); R(g,'#4a8a4a',x-1,base-ht,1,ht); R(g,'#3a6a3a',x-7,base-ht*.6,5,2); R(g,'#3a6a3a',x-7,base-ht*.85,2,ht*.27); R(g,'#3a6a3a',x+2,base-ht*.45,5,2); R(g,'#3a6a3a',x+5,base-ht*.75,2,ht*.32); }
function arrowSign(g,x,base,word,c){ R(g,'#2a2236',x,base-48,2,48); R(g,'#0e0a18',x-16,base-56,40,12); text(g,word,x-14,base-53,c,1); poly(g,[[x+24,base-56],[x+34,base-50],[x+24,base-44]],c); for(let k=0;k<8;k++) ell(g,x-14+k*5,base-58,1,1,'#f5c542'); radial(g,x+4,base-50,26,[[0,rgba(c,.3)],[1,rgba(c,0)]]); }
function kiosk(g,x,base){ R(g,'#f2ece0',x,base-12,22,12); R(g,'#2a9a5a',x,base-12,22,2); poly(g,[[x-4,base-12],[x+26,base-12],[x+11,base-22]],'#c8a060'); for(let k=0;k<4;k++) ell(g,x+4+k*5,base-6,1.8,1.8,'#5a8a3a'); }
function shed(g,x,base){ R(g,'#6a4a2e',x,base-14,20,14); for(let y=base-14;y<base;y+=3) R(g,'#4a3220',x,y,20,1); poly(g,[[x-3,base-14],[x+23,base-14],[x+10,base-22]],'#f2f4f8'); R(g,'#3a6ab0',x+7,base-10,5,5); }
function cypress(g,x,base,ht){ g.fillStyle='#2a4a2e'; g.beginPath(); g.ellipse(x,base-ht*.55,ht*.12,ht*.5,0,0,Math.PI*2); g.fill(); g.fillStyle='#3a5e3a'; g.beginPath(); g.ellipse(x-1,base-ht*.6,ht*.06,ht*.4,0,0,Math.PI*2); g.fill(); }
function bamboo(g,x,base,ht,r){ for(let k=0;k<7;k++){ const bx=x+k*3-9; R(g,k%2?'#6a9a4a':'#5a8a3e',bx,base-ht*(0.8+r()*.2),2,ht); for(let y=base-ht;y<base;y+=7) R(g,'#4a7a32',bx,y,2,1); } for(let k=0;k<12;k++) ell(g,x-12+r()*24,base-ht*(.6+r()*.4),4,1.5,'#4a8a3a'); }
function railArches(g,w,base,ht,col,lit){ R(g,col,0,base-ht,w,ht); for(let y=base-ht;y<base;y+=3) for(let x=((y/3|0)%2)*4;x<w;x+=8) R(g,mix(col,'#000000',.25),x,y,1,3); R(g,'#a8a49c',0,base-ht-2,w,2);
  for(let x=10;x<w;x+=48){ g.fillStyle=lit?'#2a1a10':'#3a2a22'; g.beginPath(); g.moveTo(x,base); g.lineTo(x,base-ht*.55); g.quadraticCurveTo(x+16,base-ht*.95,x+32,base-ht*.55); g.lineTo(x+32,base); g.fill(); if(lit){ R(g,'#ffd890',x+4,base-ht*.45,24,ht*.3); R(g,'#2a1a10',x+15,base-ht*.45,2,ht*.45); } } }

/* ---------- dense near layers (stand on the ground at the tile's bottom) ---------- */
function tokyoNear2(g,w,h,r,v){ const gb=h-2; const poles=[20,108,196];
  for(const p of poles) utilPole(g,p,gb-10,gb-78); wires(g,w,poles,gb-75,10,'#2a2a30');
  vfill(g,0,gb-14,w,14,[[0,'#a8aeb6'],[1,'#8a9098']]); for(let x=0;x<w;x+=16) R(g,'#6a7078',x,gb-14,1,14); R(g,'#d8dce0',0,gb-15,w,1);
  if(v===0){ sakuraTree(g,64,gb-12,60,r()*99|0); R(g,'#d63a2c',150,gb-36,10,22); glyphs(g,151,gb-34,4,5,'#fff0c8',3); R(g,'#2a2a30',154,gb-14,2,4); }
  else { sakuraTree(g,160,gb-12,56,r()*99|0); for(let k=0;k<3;k++){ const c=['#d63a2c','#2a6ad8','#f2f2ee'][k]; R(g,c,40+k*11,gb-34,10,20); R(g,'#e8f4ff',41+k*11,gb-32,8,8); } } }
function japanNear2(g,w,h,r,v){ const gb=h-2; for(let x=0;x<w;x+=20){ R(g,'#7a5a3a',x,gb-14,2,14); } R(g,'#7a5a3a',0,gb-11,w,1); R(g,'#7a5a3a',0,gb-6,w,1);
  sakuraTree(g,46+v*20,gb,78,r()*99|0); bamboo(g,150,gb,70,r); if(v===0){ sakuraTree(g,226,gb,58,r()*99|0,false); } else { const lx=220; R(g,'#9a948a',lx-2,gb-16,4,16); R(g,'#a8a296',lx-7,gb-21,14,5); R(g,'#fff0c0',lx-2,gb-20,4,3); poly(g,[[lx-9,gb-21],[lx+9,gb-21],[lx,gb-28]],'#8a847a'); }
  for(let i=0;i<20;i++) ell(g,r()*w,gb-1,2+r()*3,1.5,['#4a8a3a','#5a9a44','#f2c230'][i%3]); }
function hkNear2(g,w,h,r,v){ const gb=h-2; R(g,'#c8ccd0',0,gb-14,w,2); R(g,'#c8ccd0',0,gb-8,w,1); for(let x=4;x<w;x+=16) R(g,'#8a9098',x,gb-14,2,14);
  stall(g,20,gb,40,'#c8202a','#f2ece0',['#f28a3a','#7cb04a','#f2c230']); stall(g,150,gb,36,'#2a8a5a','#f2ece0',['#c8202a','#f2ece0','#e8a020']);
  for(const [x,c] of [[90,'#d63a2c'],[220,'#f2c230']]){ R(g,'#3a3a40',x,gb-74,2,60); R(g,'#3a3a40',x,gb-74,16,2); R(g,c,x+10,gb-72,9,34); glyphs(g,x+11,gb-70,6,5,c==='#f2c230'?'#c8202a':'#ffffff',x); }
  if(v===1){ R(g,'#c8202a',96,gb-12,30,9); R(g,'#c8ccd0',102,gb-16,18,4); R(g,'#1a1a1e',100,gb-4,5,4); R(g,'#1a1a1e',118,gb-4,5,4); R(g,'#fff0a0',124,gb-10,2,2); } }
function sibNear2(g,w,h,r,v){ const gb=h-2; for(let x=0;x<w;x+=16){ R(g,'#6a5a46',x,gb-12,2,12); R(g,'#f6f8fa',x-1,gb-13,4,1); } R(g,'#6a5a46',0,gb-8,w,1); R(g,'#f6f8fa',0,gb-9,w,1);
  for(let i=0;i<4;i++) birch(g,20+i*60+(r()*20|0),gb,70+r()*20,r); if(v===0) shed(g,170,gb); else for(let i=0;i<2;i++){ const x=110+i*90; pine(g,x,gb,70,32,['#2a4a40','#3a5a4c','#2a2420']); for(let k=0;k<4;k++) poly(g,[[x-12+k*3,gb-18-k*14],[x+12-k*3,gb-18-k*14],[x,gb-22-k*14]],'#f2f6fa'); }
  for(let i=0;i<14;i++) ell(g,r()*w,gb-1,3+r()*4,1.5,'#ffffff'); }
function naplesNear2(g,w,h,r,v){ const gb=h-2; R(g,'#efe6d4',0,gb-12,w,12); for(let x=0;x<w;x+=14) R(g,'#d8ccb4',x,gb-12,1,12); R(g,'#c8643a',0,gb-14,w,3);
  lemonTree(g,40,gb-12,46,r()*99|0); cypress(g,120,gb-12,72); lemonTree(g,200,gb-12,40,r()*99|0);
  for(const x of [80,160,236]){ poly(g,[[x-5,gb-12],[x+5,gb-12],[x+4,gb-20],[x-4,gb-20]],'#c8643a'); for(let k=0;k<5;k++) ell(g,x-3+k*1.5,gb-22-(k%2)*2,1.8,1.8,k%2?'#e0306a':'#3f7a36'); } }
function londonNear2(g,w,h,r,v){ const gb=h-2; railArches(g,w,gb,34,'#8a4a36',v===1);
  for(const lx of [36,168]){ R(g,'#1a1a1c',lx,gb-74,2,40); R(g,'#1a1a1c',lx-3,gb-78,8,4); R(g,'#ffe0a0',lx-2,gb-77,6,3); }
  if(v===0){ phoneBox(g,100,gb-34); } else { trunk(g,120,gb-34,gb-62,3,'#5a4a3a'); canopy(g,120,gb-70,20,['#4a6a3a','#6a8a4a'],r()*99|0); } }
function vegasNear2(g,w,h,r,v){ const gb=h-2; R(g,'#2a2236',0,gb-6,w,6); R(g,'#ff3fa4',0,gb-6,w,1);
  if(v===0){ arrowSign(g,60,gb,'MOTEL','#ff3fa4'); cactus(g,150,gb,30); cactus(g,210,gb,22); palm(g,110,gb,62,r()*99|0); }
  else { arrowSign(g,170,gb,'CHAPEL','#29e0e6'); palm(g,50,gb,66,r()*99|0); palm(g,90,gb,54,r()*99|0); cactus(g,230,gb,26); }
  for(let i=0;i<5;i++) ell(g,r()*w,gb-1,4,2,'#6a5a5a'); }
function rioNear2(g,w,h,r,v){ const gb=h-2; R(g,'#f2ece0',0,gb-10,w,10); for(let x=0;x<w;x++) if(Math.sin(x/5)>.35) R(g,'#2a2a2e',x,gb-8,1,6);
  palm(g,40,gb-10,64,r()*99|0); kiosk(g,100,gb-10); palm(g,170,gb-10,56,r()*99|0);
  if(v===1){ for(let k=0;k<4;k++){ const x=214+k*6; g.fillStyle=['#f2c230','#29e0e6','#ff4fae','#7cf06a'][k]; g.beginPath(); g.ellipse(x,gb-22,2.4,12,0,0,Math.PI*2); g.fill(); } R(g,'#5a4a3a',210,gb-12,26,2); } }

/* ---------- back layer: hills or a skyline, between the mid and far layers ---------- */
const backCity=(base,lit)=>(g,w,h,r,v)=>{ let x=0; while(x<w-4){ const tw=6+(r()*14|0); if(x+tw>w) break; const th=h*.25+r()*h*.55; R(g,base,x,h-th,tw,th); if(lit) for(let y=h-th+2;y<h;y+=3) for(let xx=x+1;xx<x+tw-1;xx+=2) if(r()<.22) R(g,lit,xx,y,1,1); x+=tw+(r()*2|0); } };
const backHills=(a,b)=>(g,w,h,r,v)=>{ ridgeP(g,w,h,h*.55,h*.22,2,900+v,a); ridgeP(g,w,h,h*.72,h*.12,3,910+v,b); };
const backForest=(a,b,snow)=>(g,w,h,r,v)=>{ ridgeP(g,w,h,h*.62,h*.15,2,920+v,a); for(let i=0;i<70;i++){ const x=r()*w,y=h*.62-pn(x,w,920+v,2)*h*.15+4; pine(g,x,y+r()*10,10+r()*8,6,[b,mix(b,'#ffffff',.1),b]); if(snow) R(g,'#f2f6fa',x-1,y-12,2,1); } };

/* ---------- trackside props: [painter, width m, height m], scattered close to the line ---------- */
const SPR=(w,h,fn)=>[P2(w,h,(g,W_,H_)=>fn(g,W_,H_,rng(w*7+h)),0,1),w/12,h/12];
const PROPS={
  tokyo:[SPR(32,96,(g,w,h)=>{ utilPole(g,16,h,4); }),SPR(32,40,(g,w,h)=>{ R(g,'#d63a2c',4,4,24,36); R(g,'#e8f4ff',6,6,20,14); for(let k=0;k<4;k++) R(g,['#2a6ad8','#f2c230','#2a9a5a','#f28a3a'][k],7+k*5,8,3,9); R(g,'#2a2a30',8,24,16,4); }),SPR(48,64,(g,w,h)=>sakuraTree(g,24,h,60,4,false))],
  japan:[SPR(48,72,(g,w,h)=>sakuraTree(g,24,h,70,7)),SPR(40,72,(g,w,h,r)=>bamboo(g,20,h,70,r)),SPR(32,96,(g,w,h)=>utilPole(g,16,h,4))],
  hongkong:[SPR(48,32,(g,w,h)=>stall(g,4,h,40,'#c8202a','#f2ece0',['#f28a3a','#7cb04a'])),SPR(32,72,(g,w,h)=>{ R(g,'#3a3a40',4,10,2,62); R(g,'#3a3a40',4,10,14,2); R(g,'#f2c230',12,12,10,30); glyphs(g,13,14,5,5,'#c8202a',4); })],
  siberia:[SPR(40,96,(g,w,h,r)=>birch(g,20,h,90,r)),SPR(48,80,(g,w,h)=>{ pine(g,24,h,78,40,['#2a4a40','#3a5a4c','#2a2420']); for(let k=0;k<4;k++) poly(g,[[12+k*3,h-20-k*16],[36-k*3,h-20-k*16],[24,h-25-k*16]],'#f2f6fa'); }),SPR(32,32,(g,w,h)=>{ ell(g,16,h-8,9,8,'#f6f8fa'); ell(g,16,h-20,6,6,'#f6f8fa'); R(g,'#2a2a2e',13,h-22,1,1); R(g,'#2a2a2e',18,h-22,1,1); R(g,'#f28a3a',15,h-20,3,1); R(g,'#c8202a',10,h-15,12,2); })],
  naples:[SPR(40,96,(g,w,h)=>cypress(g,20,h,92)),SPR(48,56,(g,w,h,r)=>lemonTree(g,24,h,52,9)),SPR(32,24,(g,w,h)=>{ const red='#4aa8a0'; ell(g,7,h-4,4,4,'#1a1a1e'); ell(g,25,h-4,4,4,'#1a1a1e'); ell(g,15,h-10,10,5,red); R(g,red,22,h-20,3,10); R(g,'#c8ccd2',20,h-21,8,2); R(g,'#5a3a22',8,h-14,9,2); })],
  london:[SPR(16,40,(g,w,h)=>phoneBox(g,3,h)),SPR(16,64,(g,w,h)=>{ R(g,'#1a1a1c',7,8,2,56); R(g,'#1a1a1c',4,4,8,4); R(g,'#ffe0a0',5,5,6,3); }),SPR(80,56,(g,w,h)=>{ R(g,'#c8202a',4,8,72,44); R(g,'#a81a22',4,28,72,2); for(let k=0;k<8;k++){ R(g,'#5a7a9a',8+k*8.5,12,7,12); R(g,'#5a7a9a',8+k*8.5,32,7,10); } ell(g,16,h-4,5,5,'#1a1a1e'); ell(g,62,h-4,5,5,'#1a1a1e'); R(g,'#f2e8a0',70,12,4,4); })],
  vegas:[SPR(32,48,(g,w,h)=>cactus(g,16,h,44)),SPR(64,32,(g,w,h)=>{ R(g,'#ff7ab0',6,h-14,52,8); R(g,'#ff9ac4',14,h-20,30,6); R(g,'#2a2a36',20,h-19,16,4); ell(g,16,h-4,5,5,'#1a1a1e'); ell(g,48,h-4,5,5,'#1a1a1e'); R(g,'#c8ccd2',4,h-10,56,1); }),SPR(48,80,(g,w,h,r)=>palm(g,24,h,78,5))],
  rio:[SPR(48,80,(g,w,h,r)=>palm(g,24,h,78,8)),SPR(40,32,(g,w,h)=>kiosk(g,8,h)),SPR(32,40,(g,w,h)=>{ for(let k=0;k<4;k++){ g.fillStyle=['#f2c230','#29e0e6','#ff4fae','#7cf06a'][k]; g.beginPath(); g.ellipse(6+k*7,h-18,3,16,0,0,Math.PI*2); g.fill(); } R(g,'#5a4a3a',2,h-6,28,2); })],
  atlantic:[SPR(32,96,(g,w,h,r)=>{ for(let k=0;k<5;k++){ g.strokeStyle=k%2?'#2f7a4a':'#3f9a5a'; g.lineWidth=2; g.beginPath(); g.moveTo(8+k*4,h); for(let y=h;y>8;y-=8) g.lineTo(8+k*4+Math.sin(y*.1+k)*4,y); g.stroke(); } }),SPR(48,32,(g,w,h,r)=>{ ell(g,24,h-8,20,9,'#4a5a62'); for(let k=0;k<10;k++) ell(g,8+r()*32,h-12-r()*10,3,3,['#ff7a8a','#f2c230','#ff9a4a','#c87aff'][k%4]); })]
};

/* ---------- richer verges ---------- */
function verge3(kind){ return P2(128,64,(g,w,h)=>{ const r=rng(kind.length*31+5);
  if(kind==='city'){ R(g,'#8a8884',0,0,w,h); for(let y=0;y<h;y+=8) for(let x=((y>>3)%2)*8;x<w;x+=16) R(g,'#9a9894',x,y,16,8); for(let k=0;k<w;k+=16) R(g,'#7a7874',k,0,1,h); for(let y=0;y<h;y+=8) R(g,'#7a7874',0,y,w,1);
    for(const x of [20,84]){ R(g,'#6a4a32',x,24,18,14); R(g,'#4a7a3a',x+1,22,16,4); for(let k=0;k<5;k++) ell(g,x+3+k*3,22,2,2,k%2?'#e0306a':'#5a9a4a'); } ell(g,60,48,5,5,'#5a5854'); R(g,'#c8c4bc',0,h-4,w,4); }
  else if(kind==='grass'){ vfill(g,0,0,w,h,[[0,'#7aa84e'],[1,'#5e8a3c']]); for(let i=0;i<500;i++) R(g,r()>.5?'#8cb85a':'#4f7a34',r()*w|0,r()*h|0,1,2); for(let i=0;i<14;i++){ const x=r()*w,y=r()*h; ell(g,x,y,5,3,'#4a7a32'); ell(g,x-1,y-1,3,2,'#6a9a44'); } for(let i=0;i<60;i++) R(g,['#f2f2f2','#f2d23a','#e0306a'][i%3],r()*w|0,r()*h|0,1,1); }
  else if(kind==='snow'){ vfill(g,0,0,w,h,[[0,'#f2f6fa'],[1,'#dde6ee']]); for(let i=0;i<200;i++) R(g,r()>.5?'#ffffff':'#c8d2de',r()*w|0,r()*h|0,2,1); for(let x=0;x<w;x+=6){ R(g,'#c8d2de',x,20,3,1); R(g,'#c8d2de',x+3,23,3,1); } for(let i=0;i<10;i++){ const x=r()*w,y=r()*h; ell(g,x,y,5,3,'#e8eef4'); R(g,'#4a3a2a',x,y-2,1,3); } }
  else if(kind==='brick'){ R(g,'#5a5654',0,0,w,h); for(let y=0;y<h;y+=4) for(let x=((y>>2)%2)*4;x<w;x+=8) vfill(g,x,y,7,3,[[0,'#6e6a66'],[1,'#56524e']]); for(let i=0;i<14;i++){ const x=r()*w|0,y=r()*h|0; ell(g,x,y,8+r()*10,2,rgba('#9ab0c4',.45)); } }
  else if(kind==='desert'){ vfill(g,0,0,w,h,[[0,'#d8a878'],[1,'#c48e5e']]); for(let i=0;i<220;i++) R(g,r()>.5?'#e6bc8e':'#a87648',r()*w|0,r()*h|0,1,1); for(let i=0;i<12;i++){ const x=r()*w,y=r()*h; ell(g,x,y,4,2,'#8a7a4a'); ell(g,x+2,y-1,2,1,'#6a8a4a'); } for(let i=0;i<6;i++) ell(g,r()*w,r()*h,3,2,'#a88a6a'); }
  else if(kind==='sand'){ vfill(g,0,0,w,h,[[0,'#ecd8a8'],[1,'#d8be86']]); for(let i=0;i<300;i++) R(g,r()>.5?'#f6e6c0':'#c8aa70',r()*w|0,r()*h|0,1,1); for(let i=0;i<20;i++){ const x=r()*w,y=r()*h; ell(g,x,y,1.5,1,'#f2ece0'); } for(let x=0;x<w;x++) if(pn(x,w,3,4)>.25) R(g,'#8aa85a',x,0,1,4+(pn(x,w,4,8)*6|0)); }
  else if(kind==='night'){ R(g,'#1a1822',0,0,w,h); for(let i=0;i<60;i++){ const x=r()*w|0; R(g,['#ff3fa4','#29e0e6','#f5c542'][r()*3|0],x,r()*h|0,1,4+(r()*10|0)); } for(let x=0;x<w;x+=16) R(g,'#3a3644',x,30,8,2); }
},kind==='city'?4:8,kind.length+3); }
const _vergeFor=vergeFor; vergeFor=function(k){ const key='v3:'+k; return VERGE[key]||(VERGE[key]=['city','grass','snow','brick','desert','sand','night'].includes(k)?verge3(k):_vergeFor(k)); };

/* apply: near layers, back layers, props */
const NEAR2={tokyo:tokyoNear2,japan:japanNear2,hongkong:hkNear2,siberia:sibNear2,naples:naplesNear2,london:londonNear2,vegas:vegasNear2,rio:rioNear2};
for(const k in NEAR2){ SCENES[k].layers.pos[2]=NEAR2[k]; SCENES[k].layers.neg[2]=NEAR2[k]; }
const BACK={tokyo:backCity('#5a4a7a','#ffd890'),japan:backHills('#7e9ab8','#6a92a0'),hongkong:backHills('#4a7a5e','#3f6a52'),siberia:backForest('#c8d2de','#3a5048',true),naples:backHills('#8a9a9a','#7a9a6a'),london:backCity('#7a7e88',null),vegas:backHills('#4a2e5e','#3a2450'),rio:backHills('#3f6a4a','#4a7a52')};
for(const k in BACK) SCENES[k].back=BACK[k];
for(const k in PROPS) SCENES[k].props=PROPS[k];
const SUNS={tokyo:['#ffd0a0',-.9,.12],japan:['#fff6d8',.6,.55],hongkong:['#fff6d8',-.4,.6],siberia:['#f6f2e8',.8,.22],naples:['#fff6d8',.3,.62],rio:['#fff6d8',-.6,.68],vegas:['#ff9a5a',-.95,.04]};
for(const k in SUNS) SCENES[k].sun=SUNS[k];

/* =====================================================================================================
   TOKYO BY NIGHT: the last stop. The loop leaves Tokyo at dawn and comes home to it on day 12 at night,
   and the Kagami-gumi are the last crew to board.
   ===================================================================================================== */
function tokyoNightFar(g,w,h,r,v){ const hz=h*.86; let x=1,i=0;
  while(x<w-6){ const tw=5+(r()*12|0); if(x+tw>w-1) break; const th=16+(r()*56|0),top=hz-th; R(g,'#14142a',x,top,tw,hz-top);
    for(let y=top+2;y<hz;y+=3) for(let xx=x+1;xx<x+tw-1;xx+=2) if(r()<.34) R(g,r()<.8?'#ffd890':'#9ae8f0',xx,y,1,1);
    if(r()<.35) R(g,'#ff3a3a',x+tw/2|0,top-1,1,1); x+=tw+(r()*2|0); i++; }
  if(v===0){ const cx=120,b=hz; for(let k=0;k<11;k++){ const y=b-k*7,ww=22-k*1.9; R(g,'#2a1a14',cx-ww/2,y-7,ww,7); for(let xx=cx-ww/2;xx<cx+ww/2;xx+=3) R(g,'#ff9a3a',xx|0,y-7,1,7); R(g,'#ffc070',cx-ww/2,y-1,ww,1); } R(g,'#ff9a3a',cx-1,b-96,2,20); radial(g,cx,b-50,40,[[0,rgba('#ff9a3a',.25)],[1,rgba('#ff9a3a',0)]]); }
  R(g,'#100f1e',0,hz,w,h-hz); vfill(g,0,h*.5,w,h*.4,[[0,rgba('#5a2a6e',0)],[1,rgba('#8a3a7e',.5)]]); }
function tokyoNightMid(g,w,h,r,v){ const cols=['#ff3fa4','#29e0e6','#f5c542','#7cf06a','#ff5a3a','#ffffff']; let x=0,i=0;
  while(x<w-8){ const bw=14+(r()*22|0); if(x+bw>w) break; const bh=36+(r()*54|0),top=h-bh;
    vfill(g,x,top,bw,bh,[[0,'#1e1c30'],[1,'#121020']]);
    for(let y=top+4;y<h-10;y+=4) for(let xx=x+2;xx<x+bw-2;xx+=3) R(g,r()<.3?'#ffcf80':r()<.12?'#7ae8f0':'#24223a',xx,y,2,2);
    const c=cols[(i+v)%cols.length];
    if(i%2===0){ const sx=x+bw-7,sh=Math.min(44,bh-12); radial(g,sx+3,top+6+sh/2,sh*.7,[[0,rgba(c,.35)],[1,rgba(c,0)]]); R(g,c,sx,top+5,6,sh); R(g,mix(c,'#ffffff',.55),sx+1,top+6,4,sh-2); glyphs(g,sx+1,top+7,Math.max(2,(sh-4)/5|0),5,mix(c,'#000000',.6),i*7+v); }
    else if(bw>20){ radial(g,x+bw/2,top+10,bw*.8,[[0,rgba(c,.35)],[1,rgba(c,0)]]); R(g,'#0a0814',x+2,top+5,bw-4,11); for(let k=0;k<(bw-8)/5;k++) R(g,cols[(k+i)%cols.length],x+4+k*5,top+7,4,7); }
    R(g,'#0a0912',x,h-10,bw,10); R(g,cols[(i+2)%cols.length],x+1,h-9,bw-2,1); R(g,['#d63a2c','#2a6ad8','#f2f2ee'][i%3],x+2,h-8,3,7); R(g,'#e8f4ff',x+2,h-8,3,2);
    x+=bw+(r()*2|0); i++; }
  R(g,'#2a2836',0,h-34,w,4); R(g,'#ff3fa4',0,h-30,w,1); for(let k=10;k<w;k+=40) R(g,'#22202e',k,h-30,5,30); }
function tokyoNightNear(g,w,h,r,v){ const gb=h-2; const poles=[20,108,196];
  for(const p of poles){ R(g,'#1a1614',p-1,gb-78,3,68); for(const [y,wd] of [[gb-75,16],[gb-69,12]]) R(g,'#14100e',p-wd/2,y,wd,2); R(g,'#22262c',p+3,gb-64,5,7); } wires(g,w,poles,gb-75,10,'#0a0a0e');
  vfill(g,0,gb-14,w,14,[[0,'#2a2e3a'],[1,'#1e222c']]); R(g,'#29e0e6',0,gb-15,w,1);
  for(const [x,c] of v?[[44,'#d63a2c'],[55,'#2a6ad8'],[170,'#f2f2ee']]:[[70,'#2a6ad8'],[150,'#d63a2c'],[161,'#f2c230']]){ radial(g,x+5,gb-24,16,[[0,rgba('#e8f4ff',.35)],[1,rgba('#e8f4ff',0)]]); R(g,c,x,gb-34,10,20); R(g,'#f4fbff',x+1,gb-32,8,9); for(let k=0;k<3;k++) R(g,cols3[k],x+2+k*2,gb-30,1,5); }
  for(const lx of [64,140,230]){ radial(g,lx,gb-50,10,[[0,rgba('#ff5a3a',.7)],[1,rgba('#ff5a3a',0)]]); ell(g,lx,gb-50,4,5,'#ff5a3a'); R(g,'#2a1a14',lx-1,gb-56,2,2); } }
const cols3=['#ff3fa4','#f5c542','#7cf06a'];
SCENES.tokyonight={name:'Tokyo by night',country:'Japan',time:'Day 18 · 23:10',km:40075,boss:'ren',crew:'the Kagami-gumi',sub:'The last stop · home in the neon',note:'Back where the loop began, at night: towers lit to the horizon, vertical signs in every colour, red lanterns, the lattice tower glowing orange, vending machines humming under the power lines. The Kagami-gumi have been waiting all twelve days.',
  sky:()=>[[[0,'#06071a'],[.55,'#1e1640'],[.85,'#4a2260'],[1,'#7a3270']],{stars:true,night:true}],light:{amb:[.14,.12,.2],dir:[0,.6,1],dirCol:[.32,.18,.4]},lamp:1.0,horizon:'#7a3270',top:'#06071a',night:true,
  ground:{pos:'#16141e',neg:'#16141e'},verge:{pos:'night',neg:'night'},layers:{pos:[tokyoNightFar,tokyoNightMid,tokyoNightNear],neg:[tokyoNightFar,tokyoNightMid,tokyoNightNear]},
  back:backCity('#1a1a30','#ffd890'),props:[SPR(32,40,(g,w,h)=>{ radial(g,16,20,20,[[0,rgba('#e8f4ff',.4)],[1,rgba('#e8f4ff',0)]]); R(g,'#d63a2c',4,4,24,36); R(g,'#f4fbff',6,6,20,14); for(let k=0;k<4;k++) R(g,['#2a6ad8','#f2c230','#2a9a5a','#f28a3a'][k],7+k*5,8,3,9); }),SPR(16,32,(g,w,h)=>{ R(g,'#1a1614',7,0,2,8); ell(g,8,16,6,8,'#ff4a2a'); R(g,'#2a1a14',2,10,12,1); R(g,'#2a1a14',2,22,12,1); })],
  swatch:['#06071a','#1e1640','#ff3fa4','#29e0e6','#ff9a3a']};
SCENE_ORDER.splice(0,SCENE_ORDER.length,'japan','hongkong','siberia','naples','london','atlantic','vegas','rio','tokyonight');
SCENES.tokyo.boss=null;
