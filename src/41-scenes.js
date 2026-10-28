
/* =====================================================================================================
   THE ROUTE: nine stretches around the world, each 256x96 painted tiles per layer and side
   (pos = the +z side of the track, neg = the -z side). Far tiles keep the horizon low; mid and near
   tiles stand on the ground at their bottom edge.
   ===================================================================================================== */
const LW=256, LH=96;
function verge2(kind){ return P2(128,64,(g,w,h)=>{ const r=rng(kind.length*13+7);
  if(kind==='snow'){ vfill(g,0,0,w,h,[[0,'#eef2f6'],[1,'#d8e0ea']]); for(let i=0;i<260;i++) R(g,r()>.5?'#ffffff':'#c4ceda',r()*w|0,r()*h|0,2,1); for(let i=0;i<18;i++) R(g,'#8a7a62',r()*w|0,r()*h|0,1,3); }
  else if(kind==='paddy'){ R(g,'#6a9a4a',0,0,w,h); for(let y=6;y<h;y+=20){ vfill(g,0,y,w,13,[[0,'#8ab8c8'],[1,'#6a9aa8']]); for(let x=0;x<w;x+=3) R(g,'#7ab04a',x,y+(r()*12|0),1,2); R(g,'#5a7a3a',0,y-1,w,1); } }
  else if(kind==='brick'){ R(g,'#5a5654',0,0,w,h); for(let i=0;i<200;i++) R(g,r()>.5?'#6a6664':'#4a4644',r()*w|0,r()*h|0,2,1); for(let i=0;i<10;i++){ const x=r()*w|0,y=r()*h|0; ell(g,x,y,6+r()*8,2,rgba('#9ab0c4',.35)); } }
  else if(kind==='seabed'){ vfill(g,0,0,w,h,[[0,'#3a6a7a'],[1,'#2a5262']]); for(let i=0;i<120;i++) R(g,r()>.5?'#4a7a8a':'#21414e',r()*w|0,r()*h|0,2,1); for(let i=0;i<10;i++){ const x=r()*w; for(let k=0;k<6;k++) R(g,'#2f7a4a',x+k%2,h-(r()*30|0),1,6); } }
  else if(kind==='desert'){ vfill(g,0,0,w,h,[[0,'#d8a878'],[1,'#c48e5e']]); for(let i=0;i<220;i++) R(g,r()>.5?'#e6bc8e':'#a87648',r()*w|0,r()*h|0,1,1); for(let i=0;i<8;i++){ const x=r()*w|0,y=r()*h|0; R(g,'#7a8a4a',x,y,2,3); } }
  else if(kind==='promenade'){ R(g,'#f2ece0',0,0,w,h); for(let y=0;y<h;y+=1) for(let x=0;x<w;x++) if(Math.sin(x/w*Math.PI*36+Math.sin(y/3)*2.2)>.6) R(g,'#4a4648',x,y,1,1); }
  else return vergeTex(kind).c&&null;
},kind==='promenade'?0:8,kind.length); }
const VERGE={}; function vergeFor(k){ return VERGE[k]||(VERGE[k]=['snow','paddy','brick','seabed','desert','promenade'].includes(k)?verge2(k):vergeTex(k)); }

/* ---------- Tokyo at dusk ---------- */
function tokyoFar(g,w,h,r,v){ const hz=h*.86;
  if(v===1){ /* the snow-capped volcano far behind the city */ const cx=170,top=hz-58; poly(g,[[cx-90,hz],[cx-10,top],[cx+10,top],[cx+90,hz]],'#6a5a8a'); poly(g,[[cx-24,top+20],[cx-10,top],[cx+10,top],[cx+24,top+20],[cx+12,top+16],[cx,top+22],[cx-12,top+16]],'#f2d8e0'); }
  let x=2,i=0; while(x<w-6){ const tw=5+(r()*12|0); if(x+tw>w-2) break; const th=14+(r()*44|0); const c=mix('#4a3a6a','#c87a8a',.15+r()*.3),top=hz-th;
    vfill(g,x,top,tw,th,[[0,mix(c,'#ffffff',.1)],[1,c]]); for(let y=top+2;y<hz;y+=3) for(let xx=x+1;xx<x+tw-1;xx+=2) if(r()<.18) R(g,'#ffd890',xx,y,1,1); x+=tw+(r()*3|0); i++; }
  if(v===0){ /* red-and-white lattice tower */ const cx=120,b=hz; for(let k=0;k<10;k++){ const y=b-k*7,ww=22-k*2; R(g,k%2?'#f2ece0':'#d63a2c',cx-ww/2,y-7,ww,7); for(let xx=cx-ww/2;xx<cx+ww/2;xx+=3) R(g,rgba('#000000',.25),xx,y-7,1,7); } R(g,'#d63a2c',cx-1,b-86,2,16); R(g,'#fff0c0',cx-1,b-60,2,2); }
  vfill(g,0,h*.55,w,h*.45,[[0,rgba('#f0a080',0)],[1,rgba('#f0a080',.55)]]); }
function tokyoMid(g,w,h,r,v){ const cols=['#e8e2d4','#c8c0b0','#9aa4b0','#d8b8a0','#b0a098','#e0d0c0','#7a8898']; let x=0,i=0;
  while(x<w-8){ const bw=14+(r()*22|0); if(x+bw>w) break; const bh=34+(r()*54|0),top=h-bh,c=cols[r()*cols.length|0];
    vfill(g,x,top,bw,bh,[[0,mix(c,'#ffd8c0',.2)],[1,mix(c,'#000000',.22)]]);
    for(let y=top+4;y<h-8;y+=4) for(let xx=x+2;xx<x+bw-2;xx+=3) R(g,r()<.3?'#ffe0a0':mix(c,'#2a2a40',.5),xx,y,2,2);
    const sc=['#d63a2c','#f2c230','#2ab0b8','#ff4fae','#ffffff','#3a6ad8'][(i+v)%6];
    if(i%2===0){ const sh=Math.min(40,bh-12); R(g,sc,x+bw-6,top+4,5,sh); glyphs(g,x+bw-5,top+6,(sh-4)/5|0,5,sc==='#ffffff'?'#d63a2c':'#ffffff',i*5+v); }
    else if(bw>20){ R(g,'#101018',x+2,top+6,bw-4,10); for(let k=0;k<(bw-8)/5;k++) R(g,['#ff4fae','#29e0e6','#f5c542'][(k+i)%3],x+4+k*5,top+8,4,6); }
    R(g,'#2a2a34',x,h-8,bw,8); R(g,['#d63a2c','#2a6ab0','#f2c230'][i%3],x+1,h-7,3,6); /* a vending machine at street level */
    x+=bw+(r()*2|0); i++; }
  /* an elevated expressway crossing the tile */ R(g,'#8a8a90',0,h-30,w,4); R(g,'#5a5a60',0,h-26,w,1); for(let k=10;k<w;k+=40) R(g,'#7a7a80',k,h-26,5,26); }
function tokyoNear(g,w,h,r,v){ const bt=h-22; vfill(g,0,bt,w,22,[[0,'#9aa0a8'],[1,'#7a8088']]); R(g,'#c8ccd0',0,bt-2,w,2); for(let x=0;x<w;x+=20) R(g,'#5a6068',x,bt,1,22);
  for(const lx of [50,180]){ R(g,'#2a2c33',lx,bt-56,2,56); R(g,'#2a2c33',lx-8,bt-56,10,2); R(g,'#fff2c8',lx-8,bt-55,4,2); }
  if(v===1){ sakuraTree(g,120,bt+2,58,4,false); } }
/* ---------- Japan countryside: rice paddies, a pagoda, the volcano ---------- */
function japanFar(g,w,h,r,v){ const hz=h*.86; ridgeP(g,w,h,hz-22,12,2,301+v,'#8aa2c4',5);
  if(v===0){ const cx=110,top=hz-64; poly(g,[[cx-86,hz],[cx-9,top],[cx+9,top],[cx+86,hz]],'#7a90b8'); poly(g,[[cx-26,top+22],[cx-9,top],[cx+9,top],[cx+26,top+22],[cx+15,top+18],[cx+6,top+25],[cx-4,top+18],[cx-14,top+24]],'#f6f8fc'); }
  ridgeP(g,w,h,hz-6,7,3,303+v,'#6e9a8a',4); R(g,'#6e9a8a',0,hz,w,h-hz); vfill(g,0,h*.45,w,h*.55,[[0,rgba('#f4f0e8',0)],[1,rgba('#f4f0e8',.5)]]); }
function japanMid(g,w,h,r,v){ const hill=x=>h-18-pn(x,w,311+v,2)*12;
  g.fillStyle='#7aa85a'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,hill(x)); g.lineTo(w,h); g.fill();
  for(let y=h-14;y<h;y+=5){ R(g,'#8ac0c8',0,y,w,3); R(g,'#6a9a4a',0,y+3,w,1); }
  for(let i=0;i<40;i++){ const x=r()*w; pine(g,x,hill(x)+4,10+r()*8,7,['#3a6a4a','#4a7a52','#3a2a1e']); }
  for(let i=0;i<6;i++){ const x=r()*w|0; canopy(g,x,hill(x)+4,6+r()*4,['#e98aa6','#ffc4d4'],i+v); }
  if(v===0){ /* five-storey pagoda */ const cx=150,b=hill(150)+4; for(let k=0;k<5;k++){ const y=b-k*9,ww=26-k*3.5; R(g,'#c84a3a',cx-ww/2+3,y-8,ww-6,8); poly(g,[[cx-ww/2-4,y-8],[cx+ww/2+4,y-8],[cx+ww/2-1,y-12],[cx-ww/2+1,y-12]],'#2a2a30'); } R(g,'#c9a23a',cx-.5,b-58,1,12); }
  else for(let k=0;k<4;k++){ const hx=30+k*56+(r()*10|0),hb=hill(hx)+6; R(g,'#e8dcc4',hx,hb-8,16,8); poly(g,[[hx-4,hb-8],[hx+20,hb-8],[hx+14,hb-16],[hx+2,hb-16]],'#8a7a5a'); R(g,'#5a4a3a',hx+6,hb-6,3,6); }
  if(v===1){ const gx=200,gy=h-4; R(g,'#d63a2c',gx-9,gy-18,2,18); R(g,'#d63a2c',gx+7,gy-18,2,18); R(g,'#d63a2c',gx-12,gy-15,24,2); poly(g,[[gx-14,gy-19],[gx+14,gy-19],[gx+12,gy-17],[gx-12,gy-17]],'#2a2220'); } }
function japanNear(g,w,h,r,v){ const gb=h-2; for(let x=0;x<w;x+=22) R(g,'#7a5a3a',x,gb-12,2,12); R(g,'#7a5a3a',0,gb-9,w,1);
  sakuraTree(g,70+v*80,gb,70,v*7+3); if(v===0){ const lx=200; R(g,'#9a948a',lx-2,gb-14,4,14); R(g,'#a8a296',lx-6,gb-18,12,4); R(g,'#fff0c0',lx-2,gb-17,4,2); poly(g,[[lx-8,gb-18],[lx+8,gb-18],[lx,gb-24]],'#8a847a'); } }
/* ---------- Hong Kong: the harbour and the hill towers ---------- */
function hkFar(g,w,h,r,v){ const hz=h*.86; const hill=x=>hz-26-pn(x,w,401+v,2)*18;
  g.fillStyle='#3f6a52'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,hill(x)); g.lineTo(w,h); g.fill();
  let x=2; while(x<w-5){ const tw=4+(r()*7|0); if(x+tw>w-2) break; const th=20+(r()*44|0)+(Math.abs(x-w/2)<50?16:0),top=hz-th; vfill(g,x,top,tw,th,[[0,'#c8d4e0'],[1,'#7a8ca0']]); for(let y=top+2;y<hz;y+=3) R(g,rgba('#2a3a5a',.4),x,y,tw,1); if(r()<.2) poly(g,[[x,top],[x+tw,top],[x+tw/2,top-8]],'#a8b8c8'); x+=tw+(r()*2|0); }
  vfill(g,0,hz,w,h-hz,[[0,'#6a9ab0'],[1,'#3a6a86']]); vfill(g,0,h*.5,w,h*.5,[[0,rgba('#e8e0d8',0)],[1,rgba('#e8e0d8',.4)]]); }
function hkHarbourMid(g,w,h,r,v){ vfill(g,0,h-8,w,8,[[0,'#3a6a86'],[1,'#2a5a76']]); for(let i=0;i<30;i++) R(g,rgba('#ffffff',.4),r()*w|0,h-7+(r()*6|0),3,1);
  /* junk boat with red sails, and a ferry */ const jx=60+v*90, jy=h-8; poly(g,[[jx-20,jy],[jx+20,jy],[jx+24,jy-6],[jx-24,jy-6]],'#5a3a22');
  for(const [dx,ht] of [[-10,26],[4,34],[16,20]]){ R(g,'#3a2a1a',jx+dx,jy-6-ht,1,ht); poly(g,[[jx+dx+1,jy-6-ht],[jx+dx+12,jy-6-ht+4],[jx+dx+11,jy-8],[jx+dx+1,jy-8]],'#c8402a'); for(let k=1;k<5;k++) R(g,'#8a2a1a',jx+dx+1,jy-6-ht+k*ht/5,11,1); }
  const fx=200-v*120; R(g,'#f2ece0',fx-18,jy-10,36,6); R(g,'#2a6a4a',fx-18,jy-6,36,4); R(g,'#2a6a4a',fx-8,jy-15,16,5); R(g,'#5a7aa0',fx-6,jy-14,12,2); }
function hkTowersMid(g,w,h,r,v){ const cols=['#d8d0c0','#c8b8a8','#b8c4c8','#e0d4b8','#a8b0a8']; let x=0,i=0;
  while(x<w-6){ const bw=12+(r()*14|0); if(x+bw>w) break; const bh=50+(r()*44|0),top=h-bh,c=cols[r()*cols.length|0];
    vfill(g,x,top,bw,bh,[[0,c],[1,mix(c,'#3a3a40',.3)]]);
    for(let y=top+3;y<h-6;y+=4){ for(let xx=x+1;xx<x+bw-1;xx+=3) R(g,r()<.15?'#ffe0a0':mix(c,'#2a3040',.45),xx,y,2,2); if(r()<.18) R(g,['#d63a2c','#2a6ab0','#f2c230','#e8e8e8'][r()*4|0],x+r()*bw|0,y+2,3,1); }
    if(i%2){ const sx=x+bw-2,sy=top+20+(r()*20|0),sc=['#d63a2c','#f2c230','#29e0e6','#ff4fae'][(i+v)%4]; R(g,'#4a4a50',sx,sy+2,8,1); R(g,sc,sx+6,sy-6,6,24); glyphs(g,sx+7,sy-4,4,5,'#ffffff',i+v*3); }
    x+=bw+1; i++; } R(g,'#2a2a30',0,h-6,w,6); }
function hkNear(g,w,h,r,v){ const gb=h-2; R(g,'#c8ccd0',0,gb-12,w,2); R(g,'#c8ccd0',0,gb-6,w,1); for(let x=4;x<w;x+=16) R(g,'#8a9098',x,gb-12,2,12);
  if(v===0){ R(g,'#2a2c33',100,gb-64,2,64); R(g,'#2a2c33',100,gb-64,22,2); R(g,'#d63a2c',112,gb-62,10,30); glyphs(g,113,gb-60,5,5,'#fff2c8',8); } }
/* ---------- Siberia: snow, birches, a frozen lake, an onion dome ---------- */
function birch(g,x,base,ht,r){ R(g,'#efece4',x-1,base-ht,3,ht); for(let k=0;k<ht;k+=4) if(r()<.5) R(g,'#2a2a2a',x-1+(r()*2|0),base-k,2,1); for(let k=0;k<5;k++){ const y=base-ht*.55-r()*ht*.4; R(g,'#5a4a3a',x,y,(r()<.5?-1:1)*(4+r()*5)|0,1); }
  g.strokeStyle=rgba('#4a3a2e',.8); g.lineWidth=1; for(let k=0;k<6;k++){ const y=base-ht*(.7+r()*.3),dx=(r()<.5?-1:1)*(3+r()*6); g.beginPath(); g.moveTo(x,y); g.lineTo(x+dx,y-3-r()*4); g.stroke(); } R(g,'#f6f8fa',x-1,base-ht,3,1); }
function sibFar(g,w,h,r,v){ const hz=h*.86; ridgeP(g,w,h,hz-12,8,2,501+v,'#c8d0dc',4); ridgeP(g,w,h,hz-4,4,6,502+v,'#3a4a44',5); R(g,'#e6ecf2',0,hz,w,h-hz); vfill(g,0,h*.35,w,h*.65,[[0,rgba('#dfe6ee',0)],[1,rgba('#dfe6ee',.65)]]); }
function sibForestMid(g,w,h,r,v){ vfill(g,0,h-10,w,10,[[0,'#f2f4f8'],[1,'#dde4ec']]); for(let i=0;i<46;i++){ const x=r()*w; pine(g,x,h-6-r()*4,16+r()*12,9,['#2f4a44','#3a5a50','#2a2420']); }
  for(let i=0;i<20;i++) birch(g,r()*w,h-6,26+r()*20,r);
  if(v===0){ /* wooden houses with blue window frames */ for(let k=0;k<3;k++){ const hx=40+k*70,b=h-6; R(g,'#7a5434',hx,b-12,20,12); for(let y=b-12;y<b;y+=3) R(g,'#5a3a22',hx,y,20,1); poly(g,[[hx-3,b-12],[hx+23,b-12],[hx+10,b-20]],'#eef2f6'); R(g,'#3a6ab0',hx+4,b-9,4,5); R(g,'#3a6ab0',hx+12,b-9,4,5); R(g,'#fff0c0',hx+5,b-8,2,3); } }
  else { /* onion-domed church */ const cx=150,b=h-6; R(g,'#f2ece0',cx-14,b-26,28,26); R(g,'#f2ece0',cx-4,b-40,8,14); for(const [dx,yy,s] of [[0,-40,7],[-11,-26,4],[11,-26,4]]){ ell(g,cx+dx,b+yy-s*.6,s,s*.9,'#2a6ab0'); poly(g,[[cx+dx-1,b+yy-s*1.4],[cx+dx+1,b+yy-s*1.4],[cx+dx,b+yy-s*2.2]],'#d4ad5a'); } R(g,'#3a4a6a',cx-3,b-14,6,8); } }
function sibLakeMid(g,w,h,r,v){ vfill(g,0,h-12,w,12,[[0,'#c8dae8'],[1,'#e6eef4']]); for(let i=0;i<30;i++) R(g,rgba('#ffffff',.7),r()*w|0,h-12+(r()*10|0),6+(r()*10|0),1);
  for(let k=0;k<4;k++){ const hx=20+k*64+(r()*20|0),b=h-6; R(g,['#c8402a','#3a6ab0','#4a7a3a','#d8a020'][k],hx,b-6,7,6); poly(g,[[hx-1,b-6],[hx+8,b-6],[hx+3.5,b-9]],'#eef2f6'); R(g,'#3a3a3a',hx+9,b-1,1,1); } }
function sibNear(g,w,h,r,v){ const gb=h-2; for(let x=0;x<w;x+=18){ R(g,'#6a5a46',x,gb-10,2,10); R(g,'#f6f8fa',x-1,gb-11,4,1); } R(g,'#6a5a46',0,gb-7,w,1); R(g,'#f6f8fa',0,gb-8,w,1);
  for(let i=0;i<(v?3:1);i++) birch(g,40+i*80+(r()*20|0),gb,70+r()*14,r); }
/* ---------- Naples and the Amalfi coast ---------- */
function naplesSeaFar(g,w,h,r,v){ const hz=h*.84; vfill(g,0,hz,w,h-hz,[[0,'#8ac8d8'],[.3,'#2a8ab0'],[1,'#1a6a96']]); for(let i=0;i<50;i++) R(g,rgba('#ffffff',.5),r()*w|0,(hz+2+r()*(h-hz-2))|0,2+(r()*3|0),1);
  if(v===0){ /* the twin-humped volcano across the bay */ const cx=130; g.fillStyle='#7a8aa0'; g.beginPath(); g.moveTo(cx-90,hz+.5); g.quadraticCurveTo(cx-40,hz-36,cx-14,hz-40); g.lineTo(cx-6,hz-34); g.lineTo(cx+4,hz-44); g.quadraticCurveTo(cx+40,hz-38,cx+90,hz+.5); g.fill(); ell(g,cx+4,hz-50,8,4,rgba('#f2ece6',.5)); }
  else { poly(g,[[60,hz+.5],[80,hz-14],[96,hz-10],[120,hz+.5]],'#8aa0a8'); } }
function naplesTownMid(g,w,h,r,v){ const top=x=>h-34-pn(x,w,601+v,2)*14-Math.sin(x/w*Math.PI)*22;
  g.fillStyle='#a8906a'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill();
  for(let x=0;x<w;x++) R(g,'#6a8a3e',x,top(x),1,3);
  const pastel=['#f2c8a0','#f6e0a8','#f0b0a8','#f8ece0','#e8a888','#f2d4b8'];
  for(let i=0;i<44;i++){ const x=6+r()*(w-20)|0,t=top(x),y=t+3+r()*(h-t-14),bw=7+(r()*6|0),bh=6+(r()*4|0); R(g,pastel[r()*pastel.length|0],x,y,bw,bh); R(g,'#c8643a',x-1,y-2,bw+2,2); R(g,'#3a5a7a',x+2,y+2,1,2); if(bw>9) R(g,'#3a5a7a',x+bw-3,y+2,1,2); }
  if(v===1){ /* a church with a majolica-tiled dome */ const cx=180,b=top(180)+18; R(g,'#f6ead8',cx-10,b-18,20,18); ell(g,cx,b-20,9,7,'#2a8a6a'); for(let k=-8;k<=8;k+=3) R(g,'#e8c840',cx+k,b-22+Math.abs(k)*.3,1,3); R(g,'#f6ead8',cx+10,b-34,5,34); poly(g,[[cx+9,b-34],[cx+16,b-34],[cx+12.5,b-40]],'#c8643a'); } }
function lemonTree(g,x,base,ht,seed){ trunk(g,x,base,base-ht*.45,2,'#5a4430'); canopy(g,x,base-ht*.62,ht*.34,['#3f7a36','#5a9a44','#7ab05a'],seed); const r=rng(seed+1); for(let i=0;i<12;i++) ell(g,x+(r()-.5)*ht*.5,base-ht*.62+(r()-.5)*ht*.4,1.6,1.3,'#f2d23a'); }
function naplesNear(g,w,h,r,v){ const gb=h-2; R(g,'#e8dcc4',0,gb-10,w,10); for(let x=0;x<w;x+=12) R(g,'#c8b89a',x,gb-10,1,10); R(g,'#c8643a',0,gb-11,w,2);
  /* pergola with vines */ R(g,'#6a4a2e',0,gb-48,w,2); for(let x=8;x<w;x+=40) R(g,'#6a4a2e',x,gb-48,2,38); for(let x=0;x<w;x+=2) if(pn(x,w,7,8)>-.2) R(g,'#4a8a3a',x,gb-50+(pn(x,w,8,12)*3|0),2,3);
  lemonTree(g,60+v*90,gb-10,40,v+5); }
/* ---------- London: rain, brick, a clock tower, a bascule bridge ---------- */
function londonFar(g,w,h,r,v){ const hz=h*.86; let x=2; while(x<w-6){ const tw=6+(r()*14|0); if(x+tw>w-2) break; const th=8+(r()*24|0),top=hz-th; R(g,'#6a6e78',x,top,tw,th); x+=tw+(r()*3|0); }
  if(v===0){ /* gothic clock tower */ const cx=90,b=hz; R(g,'#8a7a5a',cx-6,b-60,12,60); for(let y=b-58;y<b;y+=4) R(g,'#7a6a4a',cx-6,y,12,1); R(g,'#8a7a5a',cx-8,b-68,16,10); ell(g,cx,b-63,4,4,'#f2ead0'); R(g,'#2a2a2a',cx,b-66,1,3); poly(g,[[cx-8,b-68],[cx+8,b-68],[cx,b-86]],'#5a5a5a'); /* a dome */ ell(g,170,b-30,12,10,'#7a7e88'); R(g,'#7a7e88',158,b-30,24,30); R(g,'#7a7e88',169,b-46,2,8); }
  else { /* glass shard and a rounded glass tower */ poly(g,[[110,hz],[150,hz],[132,hz-74]],'#8a9ab0'); for(let k=0;k<8;k++) R(g,rgba('#ffffff',.2),118+k*2,hz-k*9-6,20-k*2,1); ell(g,200,hz-26,9,26,'#5a7a80'); for(let k=0;k<10;k++) R(g,rgba('#2a3a40',.6),191,hz-48+k*5,18,1); }
  vfill(g,0,h*.4,w,h*.6,[[0,rgba('#a8acb4',0)],[1,rgba('#a8acb4',.7)]]); }
function londonTerraceMid(g,w,h,r,v){ let x=0,i=0; while(x<w-10){ const bw=16+(r()*10|0); if(x+bw>w) break; const bh=34+(r()*14|0),top=h-bh,c=['#8a4a36','#9a5a40','#7a4232','#a8603e'][r()*4|0];
    R(g,c,x,top,bw,bh); for(let y=top;y<h;y+=3) R(g,rgba('#000000',.12),x,y,bw,1); poly(g,[[x-1,top],[x+bw+1,top],[x+bw-2,top-8],[x+2,top-8]],'#4a4e58');
    for(const cx of [x+3,x+bw-6]){ R(g,'#7a4232',cx,top-13,4,6); R(g,'#c8643a',cx+1,top-15,1,2); R(g,'#c8643a',cx+2,top-15,1,2); }
    for(let y=top+5;y<h-10;y+=10) for(const xx of [x+3,x+bw-7]){ R(g,'#f2ece0',xx-1,y-1,6,9); R(g,r()<.4?'#ffd890':'#3a4a5a',xx,y,4,7); }
    R(g,['#1a2a5a','#2a5a3a','#8a1a2a','#1a1a1a'][r()*4|0],x+bw/2-2,h-10,5,10);
    x+=bw; i++; }
  if(v===1){ R(g,'#c8202a',200,h-14,6,14); R(g,'#e8d880',201,h-12,4,3); } }
function thamesMid(g,w,h,r,v){ vfill(g,0,h-10,w,10,[[0,'#6a7a80'],[1,'#4a5a62']]); for(let i=0;i<20;i++) R(g,rgba('#c8d0d8',.5),r()*w|0,h-9+(r()*8|0),5,1);
  if(v===0){ /* twin-towered bascule bridge */ const L_=50,R2=170,deck=h-18; for(const tx of [L_,R2]){ R(g,'#a8a090',tx-8,deck-36,16,46); poly(g,[[tx-9,deck-36],[tx+9,deck-36],[tx+6,deck-44],[tx+3,deck-50],[tx,deck-44],[tx-3,deck-50],[tx-6,deck-44]],'#4a5a6a'); R(g,'#5a6a8a',tx-3,deck-28,6,8); }
    R(g,'#4a6a8a',0,deck,w,3); R(g,'#5a7a9a',L_,deck-30,R2-L_,3); for(let x=L_+8;x<R2-8;x+=6) R(g,'#5a7a9a',x,deck-28,1,28); }
  else { R(g,'#c8202a',120,h-16,30,6); R(g,'#f2ece0',122,h-20,26,4); R(g,'#1a1a1a',126,h-24,6,4); } }
function londonNear(g,w,h,r,v){ const gb=h-2; for(let x=0;x<w;x++){ vfill(g,x,gb-16,1,16,[[0,'#8a4a36'],[1,'#6a3a2a']]); } for(let y=gb-16;y<gb;y+=3) for(let x=((y/3|0)%2)*4;x<w;x+=8) R(g,'#5a3022',x,y,1,3); R(g,'#a8a49c',0,gb-17,w,2);
  for(const lx of v?[60,190]:[120]){ R(g,'#1a1a1c',lx,gb-62,2,46); R(g,'#1a1a1c',lx-3,gb-66,8,4); R(g,'#ffe0a0',lx-2,gb-65,6,3); } }
/* ---------- Las Vegas: desert dusk, the strip, a chapel and a motel ---------- */
function vegasFar(g,w,h,r,v){ const hz=h*.86; ridgeP(g,w,h,hz-14,10,2,701+v,'#5a3a6a',4); ridgeP(g,w,h,hz-5,4,4,702+v,'#3a2a4a',3); R(g,'#3a2a4a',0,hz,w,h-hz);
  if(v===0){ let x=60; while(x<200){ const tw=4+(r()*6|0),th=10+(r()*30|0); R(g,'#1e1a30',x,hz-th,tw,th); for(let y=hz-th+2;y<hz;y+=2) if(r()<.5) R(g,['#ffd890','#ff4fae','#29e0e6'][r()*3|0],x+(r()*tw|0),y,1,1); x+=tw+1; } radial(g,130,hz-10,60,[[0,rgba('#ff7ab0',.35)],[1,rgba('#ff7ab0',0)]]); R(g,'#fff6d8',134,0,1,hz-36); } }
function vegasStripMid(g,w,h,r,v){ /* casinos: a pyramid with a beam, a glowing orb, a tower, neon everywhere */
  const neon=['#ff3fa4','#29e0e6','#f5c542','#7cf06a','#ff7a3a'];
  if(v===0){ poly(g,[[20,h],[110,h],[65,h-60]],'#1a1a2a'); for(let k=0;k<12;k++) R(g,rgba('#f5c542',.5),40+k*4,h-4-k*4,50-k*8>0?50-k*8:2,1); R(g,'#fff6d8',64,0,2,h-60);
    ell(g,170,h-32,26,26,'#2a1a4a'); for(let k=0;k<6;k++) ell(g,170,h-32,24-k*3,24-k*3,rgba(neon[k%5],.35)); ell(g,170,h-36,9,6,'#ffd890');
    R(g,'#1a1a28',214,h-70,10,70); for(let y=h-66;y<h-4;y+=4) R(g,'#ff3fa4',214,y,10,1); R(g,'#f5c542',211,h-74,16,4); }
  else { let x=4,i=0; while(x<w-30){ const bw=34+(r()*20|0); if(x+bw>w-2) break; const bh=40+(r()*40|0),top=h-bh; vfill(g,x,top,bw,bh,[[0,'#2a1e3e'],[1,'#141022']]);
      for(let y=top+4;y<h-12;y+=4) for(let xx=x+2;xx<x+bw-2;xx+=3) if(r()<.35) R(g,'#ffd890',xx,y,1,2);
      const s=['CASINO','HOTEL','SLOTS','BUFFET','24H','SHOWS'][(i+v)%6],c=neon[i%5]; radial(g,x+bw/2,top-2,24,[[0,rgba(c,.4)],[1,rgba(c,0)]]); R(g,'#0a0814',x+bw/2-textW(s)/2-2,top-6,textW(s)+4,9); text(g,s,x+bw/2-textW(s)/2|0,top-4,c,1);
      for(let k=0;k<8;k++) ell(g,x+3+k*(bw-6)/7,h-11,1.2,1.2,k%2?'#f5c542':'#fff6d8'); x+=bw+4; i++; } } }
function vegasDesertMid(g,w,h,r,v){ vfill(g,0,h-10,w,10,[[0,'#8a5a5a'],[1,'#a86a5a']]); for(let i=0;i<8;i++){ const x=r()*w|0,ht=10+r()*14; R(g,'#3a5a3a',x,h-8-ht,3,ht); R(g,'#3a5a3a',x-4,h-8-ht*.7,4,2); R(g,'#3a5a3a',x-4,h-8-ht*.95,2,ht*.3); R(g,'#3a5a3a',x+3,h-8-ht*.55,4,2); R(g,'#3a5a3a',x+6,h-8-ht*.8,2,ht*.3); }
  if(v===0){ const mx=60,b=h-6; R(g,'#e8d8c0',mx,b-14,60,14); R(g,'#2a6a8a',mx,b-15,60,2); for(let k=0;k<6;k++){ R(g,'#3a3a4a',mx+4+k*9,b-10,5,8); R(g,'#ffd890',mx+5+k*9,b-9,3,3); } R(g,'#1a1a28',mx+64,b-40,3,40); R(g,'#0e0c18',mx+58,b-50,30,11); text(g,'MOTEL',mx+60,b-47,'#ff3fa4',1); radial(g,mx+73,b-45,18,[[0,rgba('#ff3fa4',.35)],[1,rgba('#ff3fa4',0)]]); }
  else { const cx=150,b=h-6; R(g,'#f6f0f2',cx-12,b-18,24,18); poly(g,[[cx-14,b-18],[cx+14,b-18],[cx,b-28]],'#f2a0b8'); R(g,'#f6f0f2',cx-2,b-36,4,10); R(g,'#f5c542',cx-1,b-42,2,6); R(g,'#f5c542',cx-3,b-40,6,1); R(g,'#0e0c18',cx-22,b-30,44,9); text(g,'CHAPEL',cx-11,b-28,'#f2a0b8',1); } }
function vegasNear(g,w,h,r,v){ const gb=h-2; for(const px of v?[50,180]:[110]){ g.strokeStyle='#4a3a2a'; g.lineWidth=2; g.beginPath(); g.moveTo(px,gb); g.lineTo(px+2,gb-56); g.stroke(); palm(g,px+2,gb-56+56,56,px); radial(g,px,gb-4,12,[[0,rgba('#f5c542',.5)],[1,rgba('#f5c542',0)]]); }
  R(g,'#2a2236',0,gb-6,w,6); R(g,'#ff3fa4',0,gb-6,w,1); }
/* ---------- Rio: Sugarloaf, the beach promenade, a hillside of painted houses ---------- */
function rioSeaFar(g,w,h,r,v){ const hz=h*.84; vfill(g,0,hz,w,h-hz,[[0,'#8ad0d8'],[.3,'#2a9ab8'],[1,'#1a7a9a']]); for(let i=0;i<40;i++) R(g,rgba('#ffffff',.5),r()*w|0,(hz+2+r()*(h-hz-2))|0,3,1);
  const dome=(cx,bw,ht,c)=>{ g.fillStyle=c; g.beginPath(); g.moveTo(cx-bw/2,hz+.5); g.bezierCurveTo(cx-bw/2,hz-ht*1.2,cx+bw/2,hz-ht*1.2,cx+bw/2,hz+.5); g.fill(); };
  if(v===0){ dome(80,24,40,'#4a6a5a'); dome(130,34,28,'#5a7a62'); g.strokeStyle='#2a2a2a'; g.lineWidth=1; g.beginPath(); g.moveTo(80,hz-30); g.lineTo(130,hz-20); g.stroke(); R(g,'#d63a2c',104,hz-26,3,2); }
  else { dome(180,40,22,'#5a7a62'); } }
function rioBeachMid(g,w,h,r,v){ vfill(g,0,h-10,w,10,[[0,'#f2e2b0'],[1,'#e6d098']]); for(let i=0;i<9;i++){ const x=10+i*28+(r()*10|0),c=['#f2c230','#2a9a5a','#2a6ad8','#f27ab0','#e0473a'][i%5]; R(g,'#6a5a4a',x,h-20,1,12); poly(g,[[x-8,h-18],[x+9,h-18],[x,h-24]],c); }
  for(let i=0;i<6;i++){ const x=r()*w|0; R(g,['#e0473a','#2a6ad8','#f2c230'][i%3],x,h-6,4,2); } }
function rioFavelaMid(g,w,h,r,v){ const top=x=>h-44-pn(x,w,801+v,2)*20-Math.sin(x/w*Math.PI)*18;
  g.fillStyle='#4a7a3a'; g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x++) g.lineTo(x,top(x)); g.lineTo(w,h); g.fill();
  const cols=['#e0473a','#f2c230','#2a9a5a','#2a6ad8','#f27ab0','#f2ece0','#e88a3a','#7ac0d8','#b85ab0'];
  for(let i=0;i<120;i++){ const x=r()*(w-8)|0,t=top(x),y=t+4+r()*(h-t-10),bw=5+(r()*5|0),bh=4+(r()*4|0); R(g,cols[r()*cols.length|0],x,y,bw,bh); R(g,'#2a2a2e',x+1,y+1,1,1); if(r()<.3) R(g,'#2a6ab0',x+1,y-2,3,2); }
  for(let i=0;i<8;i++){ const x=r()*w|0; pine(g,x,top(x)+4,12,8,['#3a6a3a','#4a7a42','#3a2a1e']); } }
function rioNear(g,w,h,r,v){ const gb=h-2; R(g,'#f2ece0',0,gb-10,w,10); for(let x=0;x<w;x+=1) if(Math.sin(x/8)>.4) R(g,'#2a2a2e',x,gb-8,1,6);
  if(v===0){ palm(g,60,gb-10,56,12); palm(g,190,gb-10,48,13); } else { const mx=80; for(let k=0;k<10;k++) R(g,['#e0473a','#f2c230','#2a9a5a','#2a6ad8','#f27ab0'][k%5],mx+k*10,gb-26,10,16); R(g,'#2a2a2e',mx,gb-27,100,1); palm(g,210,gb-10,52,14); } }

/* ---------- the stops, in order round the world ---------- */
const SCENES={
  tokyo:{name:'Tokyo',country:'Japan',time:'Day 1 · 18:10',km:0,boss:'ren',crew:'Kagami-gumi',sub:'Departure · the yakuza get on',note:'Neon coming on at dusk over a city that never ends: vertical signs, an expressway, vending machines on every corner and a red lattice tower. The volcano sits on the horizon.',
    sky:()=>[[[0,'#2a2a5a'],[.5,'#8a5a8a'],[.82,'#f08a6a'],[1,'#ffc890']],{clouds:6,cloudCol:'#ffc8b0',cloudShade:'#a86a8a',seed:21}],light:{amb:[.42,.36,.46],dir:[-.6,.4,.5],dirCol:[1.0,.6,.5]},lamp:.7,horizon:'#ffc890',top:'#2a2a5a',
    ground:{pos:'#6a6870',neg:'#6a6870'},verge:{pos:'city',neg:'city'},layers:{pos:[tokyoFar,tokyoMid,tokyoNear],neg:[tokyoFar,tokyoMid,tokyoNear]},swatch:['#2a2a5a','#8a5a8a','#f08a6a','#d63a2c','#29e0e6']},
  japan:{name:'Japan countryside',country:'Japan',time:'Day 2 · 07:40',km:410,sub:'Rice paddies · a pagoda · the volcano',note:'Flooded paddies mirroring the sky, a red five-storey pagoda, farmhouses, a torii at the field edge and cherry blossom blowing past the windows.',
    sky:()=>[[[0,'#4f92d6'],[.6,'#b8dcf2'],[1,'#f6f2ea']],{clouds:8,seed:11}],light:{amb:[.54,.54,.56],dir:[-.2,.8,.6],dirCol:[1.0,.96,.9]},lamp:.3,horizon:'#f6f2ea',top:'#4f92d6',particles:'petal',
    ground:{pos:'#7aa85a',neg:'#7aa85a'},verge:{pos:'paddy',neg:'grass'},layers:{pos:[japanFar,japanMid,japanNear],neg:[japanFar,japanMid,japanNear]},swatch:['#4f92d6','#8ac0c8','#c84a3a','#e98aa6','#7aa85a']},
  hongkong:{name:'Hong Kong',country:'China',time:'Day 3 · 12:15',km:2950,boss:'lau',crew:'the Golden Crane triad',sub:'The harbour · towers on the hills',note:'Towers stacked up green hills, laundry poles and neon signs hanging off every block. On the water side a junk with red sails crosses the harbour in front of the ferries.',
    sky:()=>[[[0,'#5a8ac0'],[.6,'#b8d0e0'],[1,'#ece4dc']],{clouds:10,seed:31,cloudShade:'#a8b0c0'}],light:{amb:[.52,.52,.54],dir:[.3,.7,.5],dirCol:[1.0,.94,.86]},lamp:.35,horizon:'#ece4dc',top:'#5a8ac0',
    ground:{pos:'#3a6a86',neg:'#6a6a70'},groundY:{pos:-1.7},verge:{pos:'city',neg:'city'},layers:{pos:[hkFar,hkHarbourMid,hkNear],neg:[hkFar,hkTowersMid,hkNear]},swatch:['#5a8ac0','#c8402a','#3f6a52','#f2c230','#d8d0c0']},
  siberia:{name:'Siberia',country:'Russia',time:'Day 5 · 10:30',km:7820,boss:'volkov',crew:'the Volkov brotherhood',sub:'Snow · birch forest · a frozen lake',note:'Days of white. Birch and pine to the horizon, log houses with blue window frames, a church with onion domes, ice-fishing huts on the frozen lake. It snows the whole way.',
    sky:()=>[[[0,'#8a9ab0'],[.6,'#c8d2de'],[1,'#e8eef4']],{clouds:14,seed:41,cloudCol:'#eef2f6',cloudShade:'#a8b4c4'}],light:{amb:[.6,.62,.68],dir:[.2,.5,.8],dirCol:[.7,.72,.8]},lamp:.5,horizon:'#e8eef4',top:'#8a9ab0',particles:'snow',
    ground:{pos:'#e2e8ee',neg:'#e2e8ee'},verge:{pos:'snow',neg:'snow'},layers:{pos:[sibFar,sibLakeMid,sibNear],neg:[sibFar,sibForestMid,sibNear]},swatch:['#c8d2de','#efece4','#2a6ab0','#2f4a44','#d4ad5a']},
  naples:{name:'Naples & Amalfi',country:'Italy',time:'Day 8 · 13:00',km:14100,boss:'nonna',crew:'the Esposito family',sub:'The bay · lemon groves · pastel cliffs',note:'The volcano across the bay, pastel houses stacked up the cliffs, a church with a green-and-yellow tiled dome, and lemon trees under vine pergolas beside the line.',
    sky:()=>[[[0,'#2a7ac8'],[.6,'#8ac8ec'],[1,'#f0f4ee']],{clouds:5,seed:51}],light:{amb:[.58,.56,.54],dir:[.4,.8,.4],dirCol:[1.08,1.0,.86]},lamp:.3,horizon:'#f0f4ee',top:'#2a7ac8',
    ground:{pos:'#2a8ab0',neg:'#8aa05a'},groundY:{pos:-1.7},verge:{pos:'sand',neg:'grass'},layers:{pos:[naplesSeaFar,coastBeachMid2,naplesNear],neg:[coastLandFar2,naplesTownMid,naplesNear]},swatch:['#2a7ac8','#f2c8a0','#c8643a','#f2d23a','#2a8a6a']},
  london:{name:'London',country:'United Kingdom',time:'Day 9 · 16:45',km:16050,boss:'gaffer',crew:'the Southside firm',sub:'Rain · brick arches · the river',note:'Wet brick, terraced houses with chimney pots, the clock tower and the dome over the rooftops, a twin-towered bridge on the river. It is, of course, raining.',
    sky:()=>[[[0,'#6a707c'],[.6,'#9aa0a8'],[1,'#c4c6c8']],{clouds:16,seed:61,cloudCol:'#b8bcc4',cloudShade:'#7a808a'}],light:{amb:[.46,.47,.5],dir:[.1,.8,.4],dirCol:[.5,.52,.56]},lamp:.7,horizon:'#c4c6c8',top:'#6a707c',particles:'rain',
    ground:{pos:'#5a6268',neg:'#4e4c4c'},groundY:{pos:-1.7},verge:{pos:'brick',neg:'brick'},layers:{pos:[londonFar,thamesMid,londonNear],neg:[londonFar,londonTerraceMid,londonNear]},swatch:['#6a707c','#8a4a36','#c8202a','#1a2a5a','#a8a090']},
  atlantic:{name:'Atlantic tunnel',country:'Under the ocean',time:'Day 10 · 02:00',km:17200,sub:'A glass tube on the sea floor',note:'Four thousand kilometres of glass tunnel across the sea floor. Whales and shoals drift past in the blue, light comes down in shafts, and the cars run on their own lamps. The quietest leg of the trip.',
    undersea:true,light:{amb:[.16,.3,.38],dir:[0,1,.2],dirCol:[.2,.5,.6]},lamp:.9,horizon:'#0e3a52',top:'#04121e',
    ground:{pos:'#2a5262',neg:'#2a5262'},verge:{pos:'seabed',neg:'seabed'},swatch:['#04121e','#0e3a52','#3a8aa8','#e8f4ff','#2f7a4a']},
  vegas:{name:'Las Vegas',country:'United States',time:'Day 12 · 20:30',km:21400,boss:'king',crew:'the Kings',sub:'Desert dusk · the strip',note:'Purple desert mountains and the strip lit up at dusk: a black pyramid firing a beam into the sky, a glowing orb, casino signs, a roadside motel and a wedding chapel among the cacti.',
    sky:()=>[[[0,'#0e0a26'],[.5,'#3a1e5a'],[.8,'#c84a6a'],[1,'#f2a060']],{stars:true,night:true,glow:[.5,1,.5,'rgba(242,160,96,.6)']}],light:{amb:[.2,.14,.24],dir:[0,.4,1],dirCol:[.5,.26,.36]},lamp:1.0,horizon:'#f2a060',top:'#0e0a26',night:true,
    ground:{pos:'#6a4a4a',neg:'#3a2a3a'},verge:{pos:'desert',neg:'night'},layers:{pos:[vegasFar,vegasDesertMid,vegasNear],neg:[vegasFar,vegasStripMid,vegasNear]},swatch:['#0e0a26','#3a1e5a','#ff3fa4','#f5c542','#29e0e6']},
  rio:{name:'Rio de Janeiro',country:'Brazil',time:'Day 15 · 11:00',km:27900,boss:'tremor',crew:'Tremor\'s crew',sub:'Sugarloaf · the beach · the hills',note:'Granite domes in the bay with a cable car between them, the wave-patterned promenade, striped umbrellas on the sand, and a hillside of painted houses with blue water tanks.',
    sky:()=>[[[0,'#1a7ac8'],[.6,'#7ccaf0'],[1,'#eaf6f2']],{clouds:7,seed:71}],light:{amb:[.6,.6,.58],dir:[.3,.9,.3],dirCol:[1.1,1.02,.88]},lamp:.3,horizon:'#eaf6f2',top:'#1a7ac8',
    ground:{pos:'#1a8ab0',neg:'#5a8a4a'},groundY:{pos:-1.7},verge:{pos:'promenade',neg:'grass'},layers:{pos:[rioSeaFar,rioBeachMid,rioNear],neg:[coastLandFar2,rioFavelaMid,rioNear]},swatch:['#1a7ac8','#f2e2b0','#2a9a5a','#f2c230','#e0473a']}
};
function coastBeachMid2(g,w,h,r,v){ vfill(g,0,h-10,w,10,[[0,'#ecd8a8'],[1,'#d8c08a']]); for(let i=0;i<5;i++){ const x=20+i*48+(r()*20|0),c=['#2a6ad8','#f2f2f2','#2a6ad8','#f2c230'][i%4]; R(g,'#5a4a3a',x,h-22,1,13); poly(g,[[x-9,h-20],[x+10,h-20],[x,h-27]],c); }
  for(let i=0;i<3;i++){ const x=40+i*80+(r()*20|0); poly(g,[[x-10,h-8],[x+10,h-8],[x+7,h-4],[x-7,h-4]],['#f2ece0','#2a6ad8','#d63a2c'][i]); R(g,'#5a4a3a',x,h-18,1,10); } }
function coastLandFar2(g,w,h,r,v){ const hz=h*.86; ridgeP(g,w,h,hz-20,14,2,861+v,'#6a8a7a'); ridgeP(g,w,h,hz-6,6,4,862+v,'#5a7a52'); R(g,'#5a7a52',0,hz,w,h-hz); vfill(g,0,h*.5,w,h*.5,[[0,rgba('#eef4f0',0)],[1,rgba('#eef4f0',.5)]]); }
const SCENE_ORDER=['tokyo','japan','hongkong','siberia','naples','london','atlantic','vegas','rio'];
