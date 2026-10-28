/* =====================================================================================================
   UNDER THE OCEANS. Two glass tubes on the sea floor, two different seas.
   SOUTH ATLANTIC (Naples to Rio): blue-green water, light coming down in shafts, pale rippled sand, coral
   heads, sea fans, kelp, a sunken ship in the blue, whales and shoals drifting past.
   PACIFIC (Las Vegas to Tokyo, by night): deep, cold and nearly black. Dark silt and basalt, glass sponges and
   white sea pens, tube worms round a vent glowing orange, kelp and rock ridges as silhouettes, jellyfish
   pulsing pink and cyan, shoals of lantern fish with lit photophores, a whale passing overhead in the dark.
   ===================================================================================================== */
const OUTK={}; /* per-scene outside definitions (sky, card layers, verge, ground, trackside kit), read by src/42-scenery.js */
SCENES.pacific=Object.assign({},SCENES.atlantic,{name:'Pacific tunnel',country:'Under the ocean',sub:'A glass tube from California to Japan',
  note:'Nine thousand kilometres of glass on the floor of the Pacific, run through the night. Deeper and darker than the Atlantic: jellyfish, lantern fish, and the lights of the train.',
  light:{amb:[.1,.16,.26],dir:[0,1,.2],dirCol:[.12,.24,.42]},horizon:'#06182e',top:'#020812',ground:{pos:'#14202a',neg:'#14202a'},particles:'mote',
  tube:{rib:'#5a6a7a',glow:'#7ab8ff'},swatch:['#020812','#06182e','#ff6ad0','#5af0ff','#ff8a3a']});
SCENES.atlantic.tube={rib:'#a8c0c8',glow:'#bfefff'};

/* ---------- shared undersea painters ---------- */
function seaCoral(g,x,y,w,h,kind,seed){ const r=rng(seed), cx=x+w/2, b=y+h;
  if(kind==='brain'){ ell(g,cx,b-h*.38,w*.46,h*.38,'#c87a5a'); for(let k=0;k<9;k++){ g.strokeStyle=rgba('#8a4a3a',.7); g.lineWidth=.5; g.beginPath(); g.ellipse(cx,b-h*.38,w*.42-k*w*.045,h*.34-k*h*.035,0,Math.PI*1.05,Math.PI*1.95); g.stroke(); } ell(g,cx-w*.15,b-h*.55,w*.18,h*.12,rgba('#f2c8a0',.6)); }
  else if(kind==='branch'){ const c=['#f27a8a','#ffa0b0','#c84a6a']; const br=(x0,y0,a,L,d)=>{ if(d>4||L<1) return; const x1=x0+Math.cos(a)*L, y1=y0+Math.sin(a)*L; g.strokeStyle=c[d%3]; g.lineCap='round'; g.lineWidth=Math.max(.6,2.2-d*.4); g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke(); br(x1,y1,a-.4-r()*.3,L*.75,d+1); br(x1,y1,a+.4+r()*.3,L*.75,d+1); if(d===4) ell(g,x1,y1,.7,.7,'#ffe0e8'); }; br(cx,b,-Math.PI/2,h*.32,0); }
  else if(kind==='fan'){ g.strokeStyle='#8a3a8a'; g.lineWidth=.8; g.beginPath(); g.moveTo(cx,b); g.lineTo(cx,b-h*.25); g.stroke(); for(let k=0;k<30;k++){ const a=-Math.PI*(.12+k/30*.76); g.strokeStyle=k%2?'#b05ab8':'#d87ad8'; g.lineWidth=.35; g.beginPath(); g.moveTo(cx,b-h*.2); g.quadraticCurveTo(cx+Math.cos(a)*w*.25,b-h*.2+Math.sin(a)*h*.4,cx+Math.cos(a)*w*.48,b-h*.2+Math.sin(a)*h*.78); g.stroke(); }
    for(let k=1;k<6;k++){ g.strokeStyle=rgba('#e8a0e8',.5); g.lineWidth=.3; g.beginPath(); g.ellipse(cx,b-h*.2,w*.09*k,h*.15*k,0,Math.PI,0); g.stroke(); } }
  else if(kind==='anemone'){ ell(g,cx,b-h*.15,w*.3,h*.15,'#6a3a5a'); for(let k=0;k<26;k++){ const a=-Math.PI*(.05+k/26*.9); g.strokeStyle=k%2?'#ff9ac8':'#f2e0ff'; g.lineWidth=.9; g.beginPath(); g.moveTo(cx,b-h*.25); g.quadraticCurveTo(cx+Math.cos(a)*w*.3,b-h*.3+Math.sin(a)*h*.4,cx+Math.cos(a)*w*.45+Math.sin(k)*1.5,b-h*.25+Math.sin(a)*h*.75); g.stroke(); } }
  else if(kind==='tube'){ for(let k=0;k<8;k++){ const tx=x+w*(.15+k*.1)+(r()-.5)*2, th=h*(.45+r()*.5); hfill(g,tx-1,b-th,2,th,[[0,'#c8c4b8'],[.5,'#f2ece0'],[1,'#9a968a']]); ell(g,tx,b-th,1.6,1.1,k%2?'#ff3a3a':'#e84a5a'); ell(g,tx,b-th-.8,1.3,.8,'#ff6a6a'); } }
  else if(kind==='sponge'){ for(let k=0;k<3;k++){ const sx=x+w*(.25+k*.25), sh=h*(.5+r()*.45); g.fillStyle=grad(g,sx-w*.1,0,sx+w*.1,0,[[0,'#b8c8c8'],[.4,'#e8f2f2'],[1,'#8a9a9c']]); g.beginPath(); g.moveTo(sx-w*.07,b); g.quadraticCurveTo(sx-w*.13,b-sh*.6,sx-w*.09,b-sh); g.lineTo(sx+w*.09,b-sh); g.quadraticCurveTo(sx+w*.13,b-sh*.6,sx+w*.07,b); g.fill(); for(let j=0;j<sh;j+=2) R(g,rgba('#6a7a7c',.3),sx-w*.08,b-j,w*.16,.25); ell(g,sx,b-sh,w*.09,.8,'#4a5a5c'); } }
  else if(kind==='pen'){ for(let k=0;k<4;k++){ const px=x+w*(.2+k*.2), ph=h*(.6+r()*.35); R(g,'#e8e0d8',px-.3,b-ph,.6,ph); for(let j=0;j<ph*.7;j+=1.2){ g.strokeStyle='#f6f2ee'; g.lineWidth=.3; g.beginPath(); g.moveTo(px,b-ph+j); g.lineTo(px-2,b-ph+j+1.4); g.moveTo(px,b-ph+j); g.lineTo(px+2,b-ph+j+1.4); g.stroke(); } } } }
function seaRocks(g,x,y,w,h,pal,seed){ const r=rng(seed); const b=y+h; g.fillStyle=pal[0]; g.beginPath(); g.moveTo(x,b); for(let k=0;k<=12;k++){ const t=k/12; g.lineTo(x+w*t,b-h*(.35+.6*Math.sin(t*Math.PI))*(.75+r()*.3)); } g.lineTo(x+w,b); g.fill();
  for(let i=0;i<16;i++) ell(g,x+w*(.15+r()*.7),b-h*(.2+r()*.5),w*(.06+r()*.08),h*(.05+r()*.06),pal[1+i%2]); ell(g,x+w*.4,b-h*.75,w*.15,h*.06,pal[3]||pal[2]); }
function seaKelp(g,x,y,w,h,pal,seed){ const r=rng(seed); for(let k=0;k<4;k++){ const bx=x+w*(.2+k*.2), sway=(r()-.5)*w*.4; g.strokeStyle=pal[k%2]; g.lineWidth=1.2; g.beginPath(); g.moveTo(bx,y+h); g.bezierCurveTo(bx+sway,y+h*.6,bx-sway,y+h*.3,bx+sway*.5,y+2); g.stroke();
    for(let j=0;j<14;j++){ const t=j/14, px=bx+sway*Math.sin(t*3)*.6, py=y+h-t*(h-4); g.fillStyle=pal[2]; g.save(); g.translate(px,py); g.rotate((j%2?.6:-.6)+(r()-.5)*.3); g.beginPath(); g.ellipse(j%2?2.4:-2.4,0,2.6,.9,0,0,6.28); g.fill(); g.restore(); if(pal[3]&&j%4===0) ell(g,px,py,.7,.7,pal[3]); } } }
/* an underwater sky: gradient, shafts or nothing, drifting motes */
function seaWater(o){ return outPX(256,128,3,(g,w,h)=>{ vfill(g,0,0,w,h,o.stops); const r=rng(o.seed||7);
  for(let i=0;i<(o.shafts||0);i++){ const x=r()*w, wd=4+r()*12, sl=(r()-.5)*20; for(const dx of [-w,0,w]){ g.fillStyle=grad(g,0,0,0,h*.85,[[0,rgba(o.shaft,.28)],[1,rgba(o.shaft,0)]]); g.beginPath(); g.moveTo(x+dx,0); g.lineTo(x+dx+wd,0); g.lineTo(x+dx+wd+sl,h*.85); g.lineTo(x+dx+sl-wd*.4,h*.85); g.fill(); } }
  if(o.caustic) for(let i=0;i<60;i++) ell(g,r()*w,r()*h*.25,3+r()*6,.6,rgba(o.caustic,.2));
  for(let i=0;i<(o.motes||0);i++) R(g,rgba(o.mote,.2+r()*.3),r()*w,h*.3+r()*h*.7,.6,.6);
  if(o.silhouettes) for(let i=0;i<o.silhouettes;i++){ const x=r()*w, y=h*(.78+r()*.1), sw=10+r()*30; for(const dx of [-w,0,w]) ell(g,x+dx,y,sw,3+r()*4,rgba(o.silCol,.5)); } }); }
/* swimmers: cards that drift and pulse past the windows */
function swimCard(sc,tex,cells,AW,AH,cell,w,h,n,o){ const gb=new OutGB(), E=outKit(gb,o.s||1,cells,AW,AH); E.card(0,0,w,h,cell,{n,y:-GROUND_Y-h/2,sb:1,st:1});
  const node=mk(gb.done(),M(tex,{unlit:true,cut:true}),sc.root,0,o.y,o.z); const f=Object.assign({n:node,x:o.x,y0:o.y,ph:o.ph||0},o); sc.swim.push(f); return f; }

/* ===================================== SOUTH ATLANTIC ===================================== */
OUTK.atlantic={
  sky:()=>seaWater({stops:[[0,'#06223a'],[.45,'#0e4a66'],[.8,'#1a7a90'],[1,'#2a8a98']],shafts:16,shaft:'#9ae8f8',caustic:'#bff4ff',motes:120,mote:'#bfefff',silhouettes:10,silCol:'#0e3a50',seed:7}),
  pos:{}, neg:{} };
for(const side of ['pos','neg']) Object.assign(OUTK.atlantic[side],{
  far(g,w,h,r){ const base=92; oRange(g,w,h,base,x=>12+outPN(x,w,side==='pos'?801:811,2)*8+Math.abs(outPN(x,w,802,6))*4,{shade:'#164a5e',lit:'#1e5a6e',haze:'#1a6a80'},{seed:51,hazeH:30,hazeA:.85,gullies:20}); R(g,'#1a6a80',0,base,w,h-base); oHaze(g,w,0,h,'#1a6a80',.35,.35); },
  back(g,w,h,r){ const base=95; for(let i=0;i<10;i++){ const x=r()*w, sw=20+r()*40, sh=6+r()*14; seaRocks(g,x-sw/2,base-sh,sw,sh,['#1e5a6a','#286a7a','#1a5060','#3a7a88'],i+side.length); }
    for(let i=0;i<14;i++){ const x=r()*w; seaKelp(g,x-4,base-30-r()*14,8,34,['#1e5a4a','#2a6a52','#2e6e4e'],i+30); }
    if(side==='neg'){ /* the wreck: a broken hull on its side, masts, a gun port row */ const wx=300, wb=base-2; poly(g,[[wx-50,wb],[wx+40,wb],[wx+52,wb-12],[wx+30,wb-20],[wx-36,wb-18],[wx-56,wb-6]],'#1e4a56'); for(let k=0;k<8;k++) R(g,'#14363e',wx-38+k*9,wb-12,3,2.4);
      R(g,'#1a4048',wx-10,wb-44,1.6,26); g.save(); g.translate(wx+20,wb-18); g.rotate(.5); R(g,'#1a4048',0,-30,1.4,30); g.restore(); R(g,'#1a4048',wx-20,wb-38,22,1); for(let k=0;k<5;k++){ g.strokeStyle=rgba('#2a5a66',.6); g.lineWidth=.3; g.beginPath(); g.moveTo(wx-10,wb-44); g.lineTo(wx-46+k*8,wb-14); g.stroke(); } }
    oHaze(g,w,0,h,'#1a6a80',.3,.25); },
  mid(g,w,h,r){ const base=95; for(let i=0;i<12;i++){ const x=r()*w, sw=14+r()*24, sh=4+r()*10; seaRocks(g,x-sw/2,base-sh,sw,sh,['#2a6a72','#3a7a80','#226068','#5a9a98'],i+60); }
    for(let i=0;i<11;i++){ const x=r()*w, kh=22+r()*26; seaKelp(g,x-4,base-kh,9,kh+4,['#1e5a4e','#28684e','#3a7a56'],i+80); }
    for(let i=0;i<16;i++){ const x=r()*w; seaCoral(g,x-5,base-10,10,10,['brain','branch','fan','anemone'][i%4],i+90); }
    for(let i=0;i<6;i++){ const x=r()*w, y=20+r()*40; for(let k=0;k<16;k++){ const fx=x+(r()-.5)*24, fy=y+(r()-.5)*8; ell(g,fx,fy,1.2,.5,'#bfe8f2'); poly(g,[[fx-1.2,fy],[fx-2.2,fy-.6],[fx-2.2,fy+.6]],'#bfe8f2'); } }
    oHaze(g,w,0,h,'#1a6a80',.3,.18); },
  verge:()=>outPX(256,96,4,(g,w,h)=>{ const r=rng(181); vfill(g,0,0,w,h,[[0,'#3a7a86'],[1,'#5a9aa0']]);
    for(let y=0;y<h;y+=2.4) for(let x=0;x<w;x+=1){ const k=Math.sin(x*.21+y*.9+Math.sin(x*.05)*2); if(k>.6) R(g,rgba('#9ad0d0',.45),x,y,1,.7); else if(k<-.7) R(g,rgba('#1e5a66',.35),x,y+.6,1,.6); }
    for(let i=0;i<40;i++) ell(g,r()*w,r()*h,.8,.5,['#f2e8d8','#e8c8a8','#c8a0c8'][i%3]); for(let i=0;i<10;i++){ const x=r()*w, y=r()*h; for(let k=0;k<5;k++){ const a=k*1.2566-1.57; g.strokeStyle='#e86a4a'; g.lineWidth=.6; g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*1.6,y+Math.sin(a)*1.6); g.stroke(); } }
    for(let i=0;i<60;i++) ell(g,r()*w,r()*h,2+r()*4,1,rgba('#9ae8f8',.18)); }),
  vergeW:12, vergeTile:32,
  ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a7a86'],[1,'#3a7a86']]); for(let y=0;y<h;y+=3) for(let x=0;x<w;x++) if(Math.sin(x*.18+y*.7+Math.sin(x*.06)*2)>.55) R(g,rgba('#7ab8bc',.4),x,y,1,.8); },0,183), groundTile:16 });
OUTK.atlantic.kit={S:4,
  cells:{kelp:[0,0,32,96],kelp2:[32,0,32,96],fan:[64,0,48,48],branch:[112,0,40,40],brain:[152,0,40,32],anemone:[192,0,32,32],sponge:[224,0,32,40],rockS:[64,48,64,40],rockB:[128,48,64,40],seagrass:[192,48,48,24],
    star:[0,96,16,16],shells:[16,96,32,16],anchor:[48,96,24,32],amph:[72,96,16,24],plinth:[88,96,32,16],wire:[120,96,4,4],dark:[124,96,4,4]},
  paint:{
    kelp:(g,x,y,w,h)=>seaKelp(g,x,y,w,h,['#2a7a4a','#3a8a52','#5aa85a'],1), kelp2:(g,x,y,w,h)=>seaKelp(g,x,y,w,h,['#3a6a3a','#4a7a42','#7a9a4a','#c8d06a'],2),
    fan:(g,x,y,w,h)=>seaCoral(g,x,y,w,h,'fan',3), branch:(g,x,y,w,h)=>seaCoral(g,x,y,w,h,'branch',4), brain:(g,x,y,w,h)=>seaCoral(g,x,y,w,h,'brain',5), anemone:(g,x,y,w,h)=>seaCoral(g,x,y,w,h,'anemone',6), sponge:(g,x,y,w,h)=>{ seaCoral(g,x,y,w,h,'sponge',7); g.globalCompositeOperation='source-atop'; R(g,rgba('#e8a040',.45),x,y,w,h); g.globalCompositeOperation='source-over'; },
    rockS:(g,x,y,w,h)=>{ seaRocks(g,x,y,w,h,['#4a6a6e','#5a7a7c','#3a5a5e','#8aa8a0'],8); const r=rng(9); for(let i=0;i<12;i++) ell(g,x+w*(.2+r()*.6),y+h*(.3+r()*.4),1.2,.8,['#e86a8a','#f2c230','#9a6ad8'][i%3]); },
    rockB:(g,x,y,w,h)=>seaRocks(g,x,y,w,h,['#3a5a60','#4a6a6e','#2e4e54','#7a9a94'],10),
    seagrass:(g,x,y,w,h)=>oTree(g,x,y,w,h,'grass',11,{pal:['#2a6a4a','#3a7a52','#5a9a5a','#7ab86a']}),
    star:(g,x,y,w,h)=>{ for(let k=0;k<5;k++){ const a=k*1.2566-1.57; poly(g,[[x+w/2,y+h/2],[x+w/2+Math.cos(a-.3)*w*.15,y+h/2+Math.sin(a-.3)*h*.15],[x+w/2+Math.cos(a)*w*.48,y+h/2+Math.sin(a)*h*.48],[x+w/2+Math.cos(a+.3)*w*.15,y+h/2+Math.sin(a+.3)*h*.15]],'#e8743a'); } },
    shells:(g,x,y,w,h)=>{ const r=rng(13); for(let i=0;i<10;i++) ell(g,x+r()*w,y+h*.4+r()*h*.5,1.4,1,['#f2e8d8','#e8c0a0','#d8a0b8'][i%3]); },
    anchor:(g,x,y,w,h)=>{ const cx=x+w/2; R(g,'#4a3a32',cx-1,y+3,2,h-8); R(g,'#4a3a32',cx-7,y+6,14,1.6); g.strokeStyle='#4a3a32'; g.lineWidth=2; g.beginPath(); g.arc(cx,y+h-10,8,.2,Math.PI-.2); g.stroke(); g.strokeStyle='#6a4a3a'; g.lineWidth=1; g.beginPath(); g.arc(cx,y+3,2,0,6.28); g.stroke(); ell(g,cx+3,y+h-6,2,1,'#3a7a52'); },
    amph:(g,x,y,w,h)=>{ const cx=x+w/2; g.fillStyle=grad(g,x,0,x+w,0,[[0,'#8a4a2a'],[.4,'#c8784a'],[1,'#6a3a20']]); g.beginPath(); g.moveTo(cx-1.5,y+2); g.quadraticCurveTo(cx-7,y+h*.4,cx,y+h); g.quadraticCurveTo(cx+7,y+h*.4,cx+1.5,y+2); g.fill(); R(g,'#8a4a2a',cx-2,y+1,4,2); },
    plinth:(g,x,y,w,h)=>oStone(g,x,y,w,h,'#6a8088',{blocks:5}),
  },
  place(E,side,r,P){
    for(let u=0;u<P;u+=10) E.box(u,5.5,.8,.35,.8,{f:'plinth',e:'plinth',t:'plinth'});
    for(let i=0;i<30;i++){ const u=r()*P, d=7+r()*14; E.card(u,d,1.6+r()*.8,5+r()*4,r()<.5?'kelp':'kelp2',{n:2,sb:.6}); }
    for(let i=0;i<34;i++){ const u=r()*P, d=6.2+r()*10; E.card(u,d,1.4+r(),1.2+r()*.8,['fan','branch','brain','anemone','sponge'][i%5],{n:2,sb:.8}); }
    for(let i=0;i<16;i++){ const u=r()*P, d=7+r()*12; E.card(u,d,3+r()*3,1.6+r()*1.6,r()<.5?'rockS':'rockB',{n:2,sb:.75}); }
    for(let i=0;i<30;i++) E.card(r()*P,6+r()*8,1.6,.7,'seagrass',{n:2,sb:.75});
    for(let i=0;i<12;i++) E.flat(r()*P,6+r()*6,.6,.6,'star',{y:.03}); for(let i=0;i<14;i++) E.flat(r()*P,6+r()*8,1.4,.7,'shells',{y:.03});
    if(side==='neg'){ E.card(80,11,1.4,1.8,'anchor',{n:2}); for(let k=0;k<4;k++) E.card(150+k*.9,10+k*.3,.8,1.1,'amph',{n:2}); }
  } };
OUTK.atlantic.kit.atlas=outKitAtlas(OUTK.atlantic.kit);
SCENES.atlantic.swimmers=sc=>{ const C={whale:[0,0,256,96],shoal:[0,96,128,48],gold:[128,96,128,48],manta:[0,144,96,48],turtle:[96,144,64,48]}, AW=256, AH=192;
  const t=outPX(AW,AH,3,(g)=>{ oCell(g,C.whale,(g,x,y,w,h)=>seaWhale(g,x,y,w,h,['#1e3e58','#2e5470','#7a9ab0','#a8c4d4'])); oCell(g,C.shoal,(g,x,y,w,h)=>seaShoal(g,x,y,w,h,['#9ad8e8','#c8eef4','#5a9ab0'],40,1));
    oCell(g,C.gold,(g,x,y,w,h)=>seaShoal(g,x,y,w,h,['#f2c230','#f28a3a','#fff0a0'],26,2)); oCell(g,C.manta,(g,x,y,w,h)=>seaManta(g,x,y,w,h)); oCell(g,C.turtle,(g,x,y,w,h)=>seaTurtle(g,x,y,w,h)); }); sc.texs.push(t);
  const r=rng(91), mv=(f,tt,tr,camX)=>{ f.n.p[0]=camX+wrapX(f.x-tr*f.k+tt*f.own-camX,f.kind==='whale'?220:110); f.n.p[1]=f.y0+Math.sin(tt*.4+f.ph)*f.bob; };
  for(let i=0;i<12;i++){ const s=i%2?1:-1, kind=i<2?'whale':i<4?'manta':i===4?'turtle':i%2?'shoal':'gold', sz={whale:[16,6],manta:[5,2],turtle:[2.4,1.6],shoal:[7,2.6],gold:[6,2.2]}[kind];
    swimCard(sc,t,C,AW,AH,kind,sz[0],sz[1],1,{s,kind,x:(r()-.5)*(kind==='whale'?220:110),y:GROUND_Y+3+r()*(kind==='whale'?8:10)+(kind==='whale'?6:0),z:s*(kind==='whale'?28+r()*10:9+r()*18),k:kind==='whale'?.12:.3,own:kind==='whale'?-1.2:(r()-.5)*3,bob:kind==='whale'?.6:.8,ph:r()*6,upd:mv}); } };
function seaWhale(g,x,y,w,h,c){ g.fillStyle=grad(g,0,y,0,y+h,[[0,c[1]],[.5,c[0]],[1,c[0]]]); g.beginPath(); g.moveTo(x+w*.03,y+h*.52); g.quadraticCurveTo(x+w*.2,y+h*.1,x+w*.6,y+h*.26); g.quadraticCurveTo(x+w*.8,y+h*.34,x+w*.9,y+h*.24); g.lineTo(x+w*.98,y+h*.1); g.lineTo(x+w*.95,y+h*.38); g.lineTo(x+w*.99,y+h*.64); g.lineTo(x+w*.88,y+h*.46); g.quadraticCurveTo(x+w*.65,y+h*.76,x+w*.22,y+h*.76); g.quadraticCurveTo(x+w*.05,y+h*.72,x+w*.03,y+h*.52); g.fill();
  g.fillStyle=c[2]; g.beginPath(); g.moveTo(x+w*.08,y+h*.6); g.quadraticCurveTo(x+w*.35,y+h*.8,x+w*.72,y+h*.58); g.quadraticCurveTo(x+w*.4,y+h*.68,x+w*.08,y+h*.6); g.fill(); for(let k=0;k<12;k++) R(g,rgba(c[0],.7),x+w*(.12+k*.035),y+h*.62,.6,h*.1);
  poly(g,[[x+w*.3,y+h*.7],[x+w*.42,y+h*.98],[x+w*.45,y+h*.72]],c[0]); ell(g,x+w*.1,y+h*.5,1.2,1.2,'#0a1018'); g.strokeStyle=rgba(c[3],.6); g.lineWidth=.6; g.beginPath(); g.moveTo(x+w*.12,y+h*.3); g.quadraticCurveTo(x+w*.4,y+h*.14,x+w*.7,y+h*.3); g.stroke(); }
function seaShoal(g,x,y,w,h,c,n,seed,glow){ const r=rng(seed); for(let i=0;i<n;i++){ const fx=x+4+r()*(w-10), fy=y+3+r()*(h-6), s=.8+r()*.6; ell(g,fx,fy,2.6*s,1*s,c[i%2]); poly(g,[[fx-2.4*s,fy],[fx-4*s,fy-1*s],[fx-4*s,fy+1*s]],c[i%2]); R(g,rgba(c[2],.8),fx-1.6*s,fy+.3*s,3.4*s,.3); ell(g,fx+1.6*s,fy-.2*s,.35,.35,'#0a0a10');
    if(glow) for(let k=0;k<4;k++) ell(g,fx-1.6*s+k*1*s,fy+.7*s,.35,.35,glow); } }
function seaManta(g,x,y,w,h){ g.fillStyle=grad(g,0,y,0,y+h,[[0,'#2a3a48'],[1,'#141e28']]); g.beginPath(); g.moveTo(x+w*.5,y+h*.3); g.quadraticCurveTo(x+w*.2,y+h*.2,x+w*.02,y+h*.45); g.quadraticCurveTo(x+w*.3,y+h*.55,x+w*.45,y+h*.75); g.lineTo(x+w*.5,y+h*.98); g.lineTo(x+w*.55,y+h*.75); g.quadraticCurveTo(x+w*.7,y+h*.55,x+w*.98,y+h*.45); g.quadraticCurveTo(x+w*.8,y+h*.2,x+w*.5,y+h*.3); g.fill(); ell(g,x+w*.5,y+h*.38,w*.08,h*.08,'#3a4a58'); }
function seaTurtle(g,x,y,w,h){ ell(g,x+w*.5,y+h*.5,w*.3,h*.28,'#5a6a3a'); for(let k=0;k<5;k++) ell(g,x+w*(.35+k*.07),y+h*(.42+(k%2)*.12),w*.05,h*.06,'#7a8a4a'); ell(g,x+w*.86,y+h*.48,w*.08,h*.1,'#8a9a6a'); for(const [dx,dy] of [[.3,.2],[.62,.2],[.3,.8],[.62,.8]]) ell(g,x+w*dx,y+h*dy,w*.1,h*.08,'#8a9a6a'); ell(g,x+w*.9,y+h*.45,.6,.6,'#0a0a0a'); }

/* ===================================== PACIFIC ===================================== */
OUTK.pacific={
  sky:()=>seaWater({stops:[[0,'#000208'],[.5,'#020a18'],[.82,'#06182c'],[1,'#0a2236']],shafts:0,motes:260,mote:'#6a8aa8',silhouettes:16,silCol:'#000610',seed:9}),
  pos:{}, neg:{} };
for(const side of ['pos','neg']) Object.assign(OUTK.pacific[side],{
  far(g,w,h,r){ const base=92; oRange(g,w,h,base,x=>16+outPN(x,w,side==='pos'?821:831,2)*10+Math.abs(outPN(x,w,822,7))*6,{shade:'#04101c',lit:'#061826',haze:'#06182c'},{seed:61,hazeH:30,hazeA:.7,gullies:0}); R(g,'#06182c',0,base,w,h-base);
    for(let i=0;i<20;i++) R(g,rgba('#4af0ff',.5),r()*w,base-r()*20,.5,.5); },
  back(g,w,h,r){ const base=95; for(let i=0;i<12;i++){ const x=r()*w, sw=24+r()*40, sh=10+r()*20; seaRocks(g,x-sw/2,base-sh,sw,sh,['#06121c','#0a1a26','#040e18','#122a38'],i+side.length*3); }
    for(let i=0;i<10;i++){ const x=r()*w; seaKelp(g,x-4,base-40-r()*16,8,44,['#071c18','#0a2420','#0c2a24'],i+130); }
    if(side==='pos'){ /* a vent field: black chimneys glowing at the mouth */ for(let k=0;k<4;k++){ const vx=160+k*14+r()*6, vh=14+r()*16; poly(g,[[vx-4,base],[vx+4,base],[vx+1.6,base-vh],[vx-1.6,base-vh]],'#0a0c10'); vGlow(g,vx,base-vh,8,'#ff7a2a',.45); ell(g,vx,base-vh,1.4,.6,'#ffb060'); for(let j=0;j<4;j++) ell(g,vx+(r()-.5)*3,base-vh-4-j*5,2+j,1.4+j*.5,rgba('#2a2a34',.5)); } }
    oHaze(g,w,0,h,'#06182c',.35,.3); },
  mid(g,w,h,r){ const base=95; for(let i=0;i<14;i++){ const x=r()*w, sw=14+r()*28, sh=6+r()*14; seaRocks(g,x-sw/2,base-sh,sw,sh,['#0e1e2a','#14283a','#0a1824','#2a4458'],i+160); }
    for(let i=0;i<16;i++){ const x=r()*w; seaKelp(g,x-4,base-44-r()*14,9,48,['#0a2a24','#0e322a','#123a30'],i+180); }
    for(let i=0;i<14;i++){ const x=r()*w; seaCoral(g,x-5,base-12,10,12,['sponge','pen','tube'][i%3],i+200); }
    for(let i=0;i<40;i++){ const x=r()*w, y=base-r()*30; ell(g,x,y,.4,.4,['#5af0ff','#ff6ad0','#9aff8a'][i%3]); }
    oHaze(g,w,0,h,'#06182c',.2,.12); },
  verge:()=>outPX(256,96,4,(g,w,h)=>{ const r=rng(191); vfill(g,0,0,w,h,[[0,'#16222c'],[1,'#22303a']]);
    for(let i=0;i<4000;i++) R(g,['#2a3a44','#0e1820','#34444e','#1a2630'][i%4],r()*w,r()*h,.5+r()*.6,.4+r()*.4);
    for(let i=0;i<70;i++){ const x=r()*w, y=r()*h; ell(g,x,y,1+r()*3,.6+r(),'#0a1218'); ell(g,x-.3,y-.3,.6+r()*1.4,.3+r()*.5,'#3a4a54'); }
    for(let i=0;i<24;i++){ const x=r()*w, y=r()*h; ell(g,x,y,.5,.5,['#5af0ff','#ff6ad0','#9aff8a'][i%3]); ell(g,x,y,1.2,1.2,rgba(['#5af0ff','#ff6ad0','#9aff8a'][i%3],.25)); }
    for(let i=0;i<14;i++){ const x=r()*w, y=r()*h; g.strokeStyle='#e8e0d8'; g.lineWidth=.3; g.beginPath(); g.arc(x,y,1.4,0,6.28); g.stroke(); } }),
  vergeW:14, vergeTile:32,
  ground:()=>P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#121e28'],[1,'#121e28']]); const r=rng(193); for(let i=0;i<500;i++) R(g,['#1a2832','#0a141c','#22303a'][i%3],r()*w,r()*h,1,1); },0,193), groundTile:16 });
OUTK.pacific.kit={S:4,
  cells:{basalt:[0,0,64,40],basalt2:[64,0,64,40],pillow:[128,0,48,32],sponge:[176,0,40,48],pen:[216,0,40,48],tube:[0,40,48,40],kelpD:[48,40,32,96],kelpD2:[80,40,32,96],vent:[112,40,32,64],ventB:[144,40,32,32],
    whelk:[176,48,24,16],crab:[200,48,32,20],brittle:[176,64,24,24],glowpatch:[200,72,48,24],bones:[0,80,48,24],plinth:[112,104,32,16],wire:[144,104,4,4],dark:[148,104,4,4]},
  paint:{
    basalt:(g,x,y,w,h)=>{ seaRocks(g,x,y,w,h,['#0c161e','#14222c','#08121a','#2a3a46'],21); const r=rng(22); for(let i=0;i<6;i++) ell(g,x+w*(.2+r()*.6),y+h*(.3+r()*.5),.5,.5,'#5af0ff'); },
    basalt2:(g,x,y,w,h)=>seaRocks(g,x,y,w,h,['#101a24','#18262e','#0a141c','#34444e'],23),
    pillow:(g,x,y,w,h)=>{ const r=rng(24); for(let i=0;i<9;i++){ const px=x+w*(.12+r()*.76), py=y+h*(.45+r()*.4), pr=w*(.1+r()*.08); ell(g,px,py,pr,pr*.7,'#0e1820'); ell(g,px-pr*.3,py-pr*.3,pr*.5,pr*.3,'#22323e'); } },
    sponge:(g,x,y,w,h)=>seaCoral(g,x,y,w,h,'sponge',25), pen:(g,x,y,w,h)=>seaCoral(g,x,y,w,h,'pen',26), tube:(g,x,y,w,h)=>seaCoral(g,x,y,w,h,'tube',27),
    kelpD:(g,x,y,w,h)=>seaKelp(g,x,y,w,h,['#0e2e28','#123630','#1a463a'],28), kelpD2:(g,x,y,w,h)=>seaKelp(g,x,y,w,h,['#122a22','#16322a','#1e3e32','#5af0ff'],29),
    vent:(g,x,y,w,h)=>{ const cx=x+w/2; g.fillStyle=grad(g,x,0,x+w,0,[[0,'#06080c'],[.4,'#1e222a'],[1,'#04060a']]); g.beginPath(); g.moveTo(cx-w*.4,y+h); g.lineTo(cx-w*.2,y+h*.5); g.lineTo(cx-w*.14,y+h*.12); g.lineTo(cx+w*.14,y+h*.12); g.lineTo(cx+w*.22,y+h*.55); g.lineTo(cx+w*.42,y+h); g.fill();
      vGlow(g,cx,y+h*.12,w*.4,'#ff7a2a',.7); ell(g,cx,y+h*.12,w*.12,h*.025,'#ffd080'); for(let k=0;k<6;k++) R(g,rgba('#ff6a2a',.6),cx-w*.18+outHash(k)*w*.36,y+h*(.3+outHash(k+3)*.6),.6,1.6); },
    ventB:(g,x,y,w,h)=>{ seaCoral(g,x,y,w,h,'tube',30); },
    whelk:(g,x,y,w,h)=>{ ell(g,x+w/2,y+h*.6,w*.35,h*.35,'#c8b8a8'); for(let k=0;k<4;k++){ g.strokeStyle='#8a7a6a'; g.lineWidth=.4; g.beginPath(); g.arc(x+w/2,y+h*.6,w*.1+k*w*.06,0,Math.PI*1.5); g.stroke(); } },
    crab:(g,x,y,w,h)=>{ ell(g,x+w/2,y+h*.6,w*.22,h*.18,'#c84a3a'); for(let k=0;k<4;k++){ g.strokeStyle='#a83a2a'; g.lineWidth=.6; for(const s of [-1,1]){ g.beginPath(); g.moveTo(x+w/2+s*w*.15,y+h*.62); g.lineTo(x+w/2+s*w*(.3+k*.05),y+h*(.5+k*.12)); g.lineTo(x+w/2+s*w*(.38+k*.04),y+h); g.stroke(); } } ell(g,x+w*.3,y+h*.4,w*.08,h*.08,'#e85a4a'); ell(g,x+w*.7,y+h*.4,w*.08,h*.08,'#e85a4a'); },
    brittle:(g,x,y,w,h)=>{ for(let k=0;k<5;k++){ const a=k*1.2566; g.strokeStyle='#d8c8e0'; g.lineWidth=.5; g.beginPath(); g.moveTo(x+w/2,y+h/2); g.quadraticCurveTo(x+w/2+Math.cos(a)*w*.3,y+h/2+Math.sin(a)*h*.2,x+w/2+Math.cos(a+.5)*w*.48,y+h/2+Math.sin(a+.5)*h*.48); g.stroke(); } ell(g,x+w/2,y+h/2,1.2,1.2,'#e8d8f0'); },
    glowpatch:(g,x,y,w,h)=>{ const r=rng(31); for(let i=0;i<40;i++){ const c=['#5af0ff','#9aff8a','#ff6ad0'][i%3], px=x+r()*w, py=y+h*.5+r()*h*.45; ell(g,px,py,.5,.5,c); } },
    bones:(g,x,y,w,h)=>{ /* the ribs of a whale fall, bleached, in the silt */ for(let k=0;k<6;k++){ g.strokeStyle='#d8d0c0'; g.lineWidth=1.2; g.beginPath(); g.moveTo(x+6+k*6.5,y+h); g.quadraticCurveTo(x+2+k*6.5,y+h*.3,x+10+k*6.5,y+h*.15); g.stroke(); } R(g,'#c8c0b0',x+2,y+h-2,w-4,2); },
    plinth:(g,x,y,w,h)=>oStone(g,x,y,w,h,'#2a3640',{blocks:5}),
  },
  place(E,side,r,P){
    for(let u=0;u<P;u+=10) E.box(u,5.5,.8,.35,.8,{f:'plinth',e:'plinth',t:'plinth'});
    for(let i=0;i<20;i++){ const u=r()*P, d=8+r()*14; E.card(u,d,3+r()*4,2+r()*2.4,r()<.5?'basalt':'basalt2',{n:2,sb:.7}); }
    for(let i=0;i<14;i++) E.card(r()*P,6.5+r()*8,2.6,1.4,'pillow',{n:2,sb:.75});
    for(let i=0;i<24;i++){ const u=r()*P, d=9+r()*12; E.card(u,d,1.6,6+r()*4,r()<.5?'kelpD':'kelpD2',{n:2,sb:.6}); }
    for(let i=0;i<30;i++) E.card(r()*P,6+r()*10,1.2+r()*.6,1.4+r(),['sponge','pen','tube'][i%3],{n:2,sb:.8});
    for(let i=0;i<10;i++) E.card(r()*P,6+r()*6,.7,.45,r()<.5?'whelk':'crab',{n:2}); for(let i=0;i<12;i++) E.flat(r()*P,6+r()*8,.8,.8,'brittle',{y:.03});
    for(let i=0;i<10;i++) E.card(r()*P,7+r()*8,2.6,1.2,'glowpatch',{n:1,sb:1});
    if(side==='pos'){ for(let k=0;k<3;k++){ const u=100+k*3.4; E.card(u,13+k,1.6,3.6+k,'vent',{n:2,sb:1}); E.card(u+1.4,12.6+k,1.6,1.4,'ventB',{n:2}); } }
    else E.card(140,12,5,2.4,'bones',{n:2,sb:.9});
  } };
OUTK.pacific.kit.atlas=outKitAtlas(OUTK.pacific.kit);
function outHash(k){ return (Math.sin(k*12.9898)*43758.5453)%1+(Math.sin(k*12.9898)*43758.5453<0?1:0); }
SCENES.pacific.swimmers=sc=>{ const C={jelly1:[0,0,64,96],jelly2:[64,0,64,96],jelly3:[128,0,64,96],lantern:[0,96,128,48],whale:[0,144,256,96],squid:[192,0,64,96],hatchet:[128,96,128,48]}, AW=256, AH=240;
  const t=outPX(AW,AH,3,(g)=>{ oCell(g,C.jelly1,(g,x,y,w,h)=>seaJelly(g,x,y,w,h,'#ff6ad0',1)); oCell(g,C.jelly2,(g,x,y,w,h)=>seaJelly(g,x,y,w,h,'#5af0ff',2)); oCell(g,C.jelly3,(g,x,y,w,h)=>seaJelly(g,x,y,w,h,'#c8a0ff',3));
    oCell(g,C.lantern,(g,x,y,w,h)=>seaShoal(g,x,y,w,h,['#2a3a4a','#34485a','#4a6a80'],34,4,'#7af0ff')); oCell(g,C.hatchet,(g,x,y,w,h)=>seaShoal(g,x,y,w,h,['#8a9aa8','#a8b8c4','#5a6a78'],22,5,'#9aff8a'));
    oCell(g,C.whale,(g,x,y,w,h)=>seaWhale(g,x,y,w,h,['#06101a','#0c1a26','#1a2a38','#2a3a4a'])); oCell(g,C.squid,(g,x,y,w,h)=>seaSquid(g,x,y,w,h)); }); sc.texs.push(t);
  const r=rng(97);
  const drift=(f,tt,tr,camX)=>{ f.n.p[0]=camX+wrapX(f.x-tr*f.k+tt*f.own-camX,f.L||200); f.n.p[1]=f.y0+Math.sin(tt*.25+f.ph)*f.bob; if(f.pulse){ const p=1+Math.sin(tt*1.8+f.ph)*.09; f.n.s=[1/p,p,1/p]; } };
  for(let i=0;i<12;i++){ const s=i%2?1:-1; swimCard(sc,t,C,AW,AH,['jelly1','jelly2','jelly3'][i%3],1.4+r()*.8,2.4+r(),2,{s,L:72,x:(r()-.5)*72,y:GROUND_Y+2.4+r()*6,z:s*(7.5+r()*14),k:.18+r()*.1,own:(r()-.5)*.6,bob:1.4,ph:r()*6,pulse:true,upd:drift}); }
  for(let i=0;i<5;i++){ const s=i%2?1:-1; swimCard(sc,t,C,AW,AH,i%2?'lantern':'hatchet',6,2.2,1,{s,L:110,x:(r()-.5)*110,y:GROUND_Y+2.5+r()*8,z:s*(9+r()*14),k:.3,own:(r()-.5)*3,bob:.6,ph:r()*6,upd:drift}); }
  swimCard(sc,t,C,AW,AH,'whale',22,8,1,{s:1,x:0,y:GROUND_Y+16,z:30,k:.08,own:-1.6,bob:.8,ph:0,upd:drift});
  swimCard(sc,t,C,AW,AH,'squid',2.4,4.2,2,{s:-1,x:60,y:GROUND_Y+6,z:-16,k:.15,own:.4,bob:1.2,ph:2,upd:drift}); };
function seaJelly(g,x,y,w,h,c,seed){ const r=rng(seed), cx=x+w/2, by=y+h*.28;
  vGlow(g,cx,by,w*.5,c,.45); for(let k=0;k<9;k++){ const tx=cx-w*.3+k*w*.075; g.strokeStyle=rgba(mix(c,'#ffffff',.3),.85); g.lineWidth=.45; g.beginPath(); g.moveTo(tx,by+2); g.bezierCurveTo(tx+(r()-.5)*8,by+h*.25,tx+(r()-.5)*10,by+h*.45,tx+(r()-.5)*6,y+h*(.75+r()*.22)); g.stroke(); }
  for(let k=0;k<4;k++){ g.strokeStyle=rgba(c,.9); g.lineWidth=1.2; g.beginPath(); g.moveTo(cx-w*.1+k*w*.07,by+2); g.bezierCurveTo(cx-w*.15+k*w*.1,by+h*.2,cx+(r()-.5)*w*.2,by+h*.3,cx-w*.1+k*w*.08,by+h*.42); g.stroke(); }
  g.fillStyle=grad(g,0,by-h*.2,0,by+3,[[0,rgba(mix(c,'#ffffff',.6),.95)],[.6,rgba(c,.9)],[1,rgba(mix(c,'#000000',.2),.85)]]); g.beginPath(); g.ellipse(cx,by,w*.36,h*.2,0,Math.PI,0); g.quadraticCurveTo(cx+w*.2,by+3,cx,by+1.6); g.quadraticCurveTo(cx-w*.2,by+3,cx-w*.36,by); g.fill();
  for(let k=0;k<4;k++) ell(g,cx-w*.15+k*w*.1,by-h*.06,w*.04,h*.04,rgba('#ffffff',.8)); ell(g,cx-w*.1,by-h*.12,w*.1,h*.03,rgba('#ffffff',.6)); }
function seaSquid(g,x,y,w,h){ const cx=x+w/2; g.fillStyle=grad(g,x,0,x+w,0,[[0,'#3a0e1a'],[.5,'#7a1e2a'],[1,'#3a0e1a']]); g.beginPath(); g.moveTo(cx,y+2); g.quadraticCurveTo(cx+w*.2,y+h*.25,cx+w*.12,y+h*.48); g.lineTo(cx-w*.12,y+h*.48); g.quadraticCurveTo(cx-w*.2,y+h*.25,cx,y+2); g.fill();
  ell(g,cx-w*.06,y+h*.44,1.4,1.4,'#f2e8d0'); ell(g,cx+w*.06,y+h*.44,1.4,1.4,'#f2e8d0'); for(let k=0;k<8;k++){ g.strokeStyle='#6a1a24'; g.lineWidth=.8; g.beginPath(); g.moveTo(cx-w*.1+k*w*.028,y+h*.48); g.quadraticCurveTo(cx-w*.2+k*w*.06,y+h*.7,cx-w*.15+k*w*.045,y+h*.98); g.stroke(); } for(let k=0;k<10;k++) ell(g,cx+(k%3-1)*w*.06,y+h*(.12+k*.03),.4,.4,'#7af0ff'); }
