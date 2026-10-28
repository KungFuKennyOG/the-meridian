/* =====================================================================
   THE BRAND. The Meridian 24 has its own face: a gold roundel (the world loop, cut by the meridian, the
   train a bead running round it, 24 at the heart), a deco wordmark, and the katakana underneath, navy and
   gold like the livery. Painted with the page's own fonts (Limelight for the name, Zen Kaku Gothic New for
   the Japanese and small caps, IBM Plex Mono for the timetable), repainted once the fonts arrive.
   ===================================================================== */
const BRAND={navy:'#0e1628',navy2:'#14203a',gold:'#d4ad5a',gold2:'#f2d27a',cream:'#f2ece0',hot:'#ff6a3a',teal:'#29e0e6',
  word:'"Limelight","Bungee",Georgia,serif', jp:'"Zen Kaku Gothic New","Hiragino Sans",sans-serif', mono:'"IBM Plex Mono",monospace', kana:'メリディアン24'};
const BRAND_TEX=[];
/* a texture painted with real fonts; it repaints itself when the web fonts finish loading */
function brandTex(w,h,fn){ const t=tex(w,h,null); t.paint=()=>{ const g=t.c.getContext('2d'); g.clearRect(0,0,w,h); g.save(); fn(g,w,h); g.restore();
    if(t.glt){ gl.bindTexture(gl.TEXTURE_2D,t.glt); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,t.c); if(gl.generateMipmap&&!t.dyn) try{ gl.generateMipmap(gl.TEXTURE_2D); }catch(_){} } };
  t.paint(); BRAND_TEX.push(t); return t; }
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ for(const t of BRAND_TEX) t.paint(); });
['400 40px Limelight','700 40px "Zen Kaku Gothic New"','600 40px "IBM Plex Mono"'].forEach(f=>{ try{ document.fonts&&document.fonts.load(f).then(()=>{ for(const t of BRAND_TEX) t.paint(); }); }catch(_){} });

/* the roundel: centre cx,cy, radius r */
function roundel(g,cx,cy,r,o={}){ const gold=o.gold||BRAND.gold;
  const q=g.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r*1.05); q.addColorStop(0,BRAND.navy2); q.addColorStop(1,'#070b16'); g.fillStyle=q; g.beginPath(); g.arc(cx,cy,r,0,7); g.fill();
  g.lineWidth=r*.1; const gg=g.createLinearGradient(cx,cy-r,cx,cy+r); gg.addColorStop(0,BRAND.gold2); gg.addColorStop(.5,gold); gg.addColorStop(1,'#8a6a2a'); g.strokeStyle=gg;
  g.beginPath(); g.arc(cx,cy,r*.93,0,7); g.stroke();
  g.lineWidth=r*.035; g.beginPath(); g.ellipse(cx,cy,r*.72,r*.26,-.32,0,7); g.stroke();       /* the loop round the world */
  g.beginPath(); g.moveTo(cx,cy-r*.86); g.lineTo(cx,cy+r*.86); g.stroke();                    /* the meridian */
  const a=-.32, bx=cx+Math.cos(2.2)*r*.72*Math.cos(a)-Math.sin(2.2)*r*.26*Math.sin(a), by=cy+Math.cos(2.2)*r*.72*Math.sin(a)+Math.sin(2.2)*r*.26*Math.cos(a);
  g.fillStyle=BRAND.hot; g.beginPath(); g.arc(bx,by,r*.075,0,7); g.fill();                     /* the train, a bead on the loop */
  g.fillStyle=BRAND.cream; g.textAlign='center'; g.textBaseline='middle'; g.font=`400 ${r*.62|0}px ${BRAND.word}`; g.fillText('24',cx+r*.02,cy+r*.05); }
/* the full lockup: roundel left, THE / MERIDIAN / katakana right. o.dark=false for a light background */
function logoLockup(g,x,y,w,h,o={}){ const r=h*.46, cx=x+r+h*.04, cy=y+h/2; roundel(g,cx,cy,r,o);
  const tx=cx+r+h*.12, tw=x+w-tx; g.textAlign='left'; g.textBaseline='alphabetic';
  g.fillStyle=o.ink||BRAND.gold; g.font=`700 ${h*.15|0}px ${BRAND.jp}`; g.fillText('T H E',tx+2,cy-h*.2);
  let fs=h*.38; g.font=`400 ${fs|0}px ${BRAND.word}`; const mw=g.measureText('MERIDIAN').width; if(mw>tw){ fs*=tw/mw; g.font=`400 ${fs|0}px ${BRAND.word}`; }
  const gr=g.createLinearGradient(0,cy-fs*.8,0,cy+fs*.2); gr.addColorStop(0,o.ink2||BRAND.gold2); gr.addColorStop(1,o.ink||BRAND.gold); g.fillStyle=gr; g.fillText('MERIDIAN',tx,cy+fs*.32);
  g.fillStyle=o.sub||BRAND.cream; g.font=`700 ${h*.13|0}px ${BRAND.jp}`; g.fillText(BRAND.kana+'  ·  SEE THE WORLD IN 24 HOURS',tx+2,cy+h*.34); }
/* a destination card: the city in the wordmark face, its line underneath, a gold rule */
function cityCard(g,w,h,title,sub,col){ g.fillStyle='rgba(8,12,26,.94)'; rr(g,6,6,w-12,h-12,22); g.fill(); g.strokeStyle=BRAND.gold; g.lineWidth=4; rr(g,14,14,w-28,h-28,16); g.stroke();
  roundel(g,h*.5,h*.5,h*.3); g.textAlign='left'; g.textBaseline='alphabetic'; let fs=h*.34; g.font=`400 ${fs|0}px ${BRAND.word}`; const tw=w-h*.95; const mw=g.measureText(title).width; if(mw>tw){ fs*=tw/mw; g.font=`400 ${fs|0}px ${BRAND.word}`; }
  g.fillStyle=col||BRAND.gold2; g.fillText(title,h*.9,h*.55); g.fillStyle=BRAND.cream; g.font=`600 ${h*.12|0}px ${BRAND.mono}`; g.fillText(sub||'',h*.9+3,h*.78); }

/* ---------- the arrival card: floats ahead of you for a few seconds when you reach a new place ---------- */
const CARD={t:0,on:false};
const cardTex=brandTex(1024,256,(g,w,h)=>cityCard(g,w,h,CARD.title||'THE MERIDIAN 24',CARD.sub||'',CARD.col)); cardTex.dyn=true;
const cardN=N(world); cardN.vis=false; mk(plane(1.1,.275),M(cardTex,{unlit:true,cut:true,double:true}),cardN,0,0,0);
function showCard(title,sub,col){ CARD.title=title; CARD.sub=sub; CARD.col=col; CARD.t=0; CARD.on=true; cardTex.paint(); CARD.place=true; }
function cardTick(dt){ if(!CARD.on){ cardN.vis=false; return; } CARD.t+=dt; if(CARD.t>4.2){ CARD.on=false; cardN.vis=false; return; }
  if(!XR.on||!XR.head){ cardN.vis=false; return; } cardN.vis=true;
  if(CARD.place){ CARD.place=false; const {eye,f}=XR.head,fl=norm3([f[0],0,f[2]]); cardN.p=[eye[0]+fl[0]*2.2,eye[1]+.18,eye[2]+fl[2]*2.2]; cardN.r=[0,Math.atan2(-fl[0],-fl[2]),0]; }
  const k=CARD.t<.35?CARD.t/.35:CARD.t>3.7?(4.2-CARD.t)/.5:1; cardN.s=[k,k,k]; }
