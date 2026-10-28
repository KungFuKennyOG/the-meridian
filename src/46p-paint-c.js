
/* =====================================================================================================
   STATION PAINT KIT. Painted atlases and dressing for the underground stations: one canvas holds many
   small painted pieces (benches, bins, clocks, signs, posters...), each box face or plane maps onto its
   cell, so a whole platform's props bake into a couple of draw calls. Light and shade are painted in:
   lighter tops, darker bottoms, bevel highlights, soft AO into corners. Brands are all invented.
   ===================================================================================================== */

/* ---------- painting primitives (work in painter units, P2 supersamples them) ---------- */
function scShadeOf(c,v){ return v>=0?mix(c,'#ffffff',v):mix(c,'#000000',-v); }
/* a painted panel: light top, darker foot, bevel highlight top/left, shadow bottom/right */
function scPPanel(g,x,y,w,h,c,o={}){ const b=o.bev??1; vfill(g,x,y,w,h,[[0,scShadeOf(c,o.hi??.14)],[.5,c],[1,scShadeOf(c,-(o.lo??.16))]]);
  if(b){ R(g,rgba('#ffffff',o.hl??.4),x,y,w,b*.5); R(g,rgba('#ffffff',(o.hl??.4)*.5),x,y,b*.5,h); R(g,rgba('#000000',o.sl??.32),x,y+h-b*.5,w,b*.5); R(g,rgba('#000000',(o.sl??.32)*.6),x+w-b*.5,y,b*.5,h); } }
/* glazed tiles: per-tile tone, a glint along the top, a soft shade at the foot, grout lines; bond: half-offset rows */
function scPTiles(g,x,y,w,h,tw,th,c,grout,seed,o={}){ const r=rng(seed), gw=o.gw??.5; R(g,grout,x,y,w,h);
  for(let ty=y,row=0;ty<y+h-.01;ty+=th,row++){ const off=o.bond?((row%2)*tw/2):0;
    for(let tx=x-off;tx<x+w-.01;tx+=tw){ const v=(r()-.5)*(o.var??.1), col=o.pick?o.pick(r,row):scShadeOf(c,v);
      const x0=Math.max(x,tx)+gw/2, x1=Math.min(x+w,tx+tw)-gw/2, y0=ty+gw/2, hh=Math.min(th,y+h-ty)-gw; if(x1<=x0||hh<=0) continue;
      vfill(g,x0,y0,x1-x0,hh,[[0,scShadeOf(col,o.gl??.12)],[.6,col],[1,scShadeOf(col,-(o.sh??.1))]]);
      if(o.glint!==false){ R(g,rgba('#ffffff',o.glint??.35),x0,y0,x1-x0,Math.min(.5,hh*.12)); R(g,rgba('#ffffff',(o.glint??.35)*.5),x0,y0,Math.min(.5,(x1-x0)*.1),hh); } } } }
/* painted light: lighter at the top of a surface, darker at the foot */
function scPLight(g,x,y,w,h,top=.18,bot=.22){ vfill(g,x,y,w,h,[[0,rgba('#ffffff',top)],[.45,rgba('#ffffff',0)],[.75,rgba('#000000',0)],[1,rgba('#000000',bot)]]); }
/* soft AO along one edge: 't','b','l','r' */
function scPAO(g,x,y,w,h,edge,d,a=.35){ const z=rgba('#000000',0),k=rgba('#000000',a);
  if(edge==='t') vfill(g,x,y,w,d,[[0,k],[1,z]]); else if(edge==='b') vfill(g,x,y+h-d,w,d,[[0,z],[1,k]]); else if(edge==='l') hfill(g,x,y,d,h,[[0,k],[1,z]]); else hfill(g,x+w-d,y,d,h,[[0,z],[1,k]]); }
/* a moulding: a horizontal band with a highlight ridge and a shadow groove */
function scPMould(g,x,y,w,h,c){ vfill(g,x,y,w,h,[[0,scShadeOf(c,.25)],[.35,scShadeOf(c,.05)],[.55,scShadeOf(c,-.3)],[.7,scShadeOf(c,.15)],[1,scShadeOf(c,-.25)]]); }
function scCtext(g,s,cx,y,col,sc=1){ text(g,s,Math.round(cx-textW(s,sc)/2),y,col,sc); }
/* text with a soft drop shadow, for painted signage */
function scStext(g,s,cx,y,col,sc=1,sh='#000000',a=.35){ scCtext(g,s,cx+sc*.5,y+sc*.5,rgba(sh,a),sc); scCtext(g,s,cx,y,col,sc); }
/* brushed metal: fine vertical streaks over a light-to-dark wash, bright bevel */
function scPSteel(g,x,y,w,h,c='#c8ccd2',seed=1,o={}){ vfill(g,x,y,w,h,[[0,scShadeOf(c,.22)],[.45,c],[.55,scShadeOf(c,-.08)],[1,scShadeOf(c,-.2)]]); const r=rng(seed);
  for(let i=0;i<w*1.5;i++) R(g,rgba(r()>.5?'#ffffff':'#000000',.04+r()*.05),x+r()*w,y,.3,h);
  if(o.streak!==false) hfill(g,x,y,w,h,[[0,rgba('#ffffff',0)],[.3,rgba('#ffffff',.18)],[.38,rgba('#ffffff',0)],[1,rgba('#ffffff',0)]]);
  if(o.bev!==false){ R(g,rgba('#ffffff',.5),x,y,w,.5); R(g,rgba('#000000',.3),x,y+h-.5,w,.5); } }
/* wood: planks with seams, grain and a painted sheen */
function scPWood(g,x,y,w,h,a,b,seed,o={}){ const r=rng(seed), pw=o.plank||h; for(let py=y;py<y+h-.01;py+=pw){ const v=(r()-.5)*.14, c0=scShadeOf(a,v), c1=scShadeOf(b,v);
    vfill(g,x,py,w,pw,[[0,c0],[1,c1]]); for(let i=0;i<pw*1.6;i++){ g.fillStyle=rgba('#000000',.06+r()*.1); const yy=py+r()*pw; g.fillRect(x,yy,w,.35); }
    for(let i=0;i<w/14;i++){ const kx=x+r()*w, ky=py+r()*pw; ell(g,kx,ky,2.2,.8,rgba('#000000',.12)); ell(g,kx,ky,1,.35,rgba('#000000',.18)); }
    R(g,rgba('#ffffff',.22),x,py,w,.4); R(g,rgba('#000000',.4),x,py+pw-.5,w,.5); }
  if(o.sheen!==false) hfill(g,x,y,w,h,[[0,rgba('#ffffff',0)],[.25,rgba('#ffffff',.1)],[.4,rgba('#ffffff',0)],[1,rgba('#ffffff',0)]]); }
/* marble: soft cloudy base and a few meandering veins */
function scPMarble(g,x,y,w,h,base,vein,seed,o={}){ const r=rng(seed); vfill(g,x,y,w,h,[[0,scShadeOf(base,.1)],[1,scShadeOf(base,-.08)]]);
  for(let i=0;i<(o.clouds??6);i++) ell(g,x+r()*w,y+r()*h,w*(.15+r()*.3),h*(.08+r()*.15),rgba(r()>.5?'#ffffff':vein,.08));
  for(let i=0;i<(o.veins??4);i++){ g.strokeStyle=rgba(vein,.25+r()*.35); g.lineWidth=.3+r()*.5; g.beginPath(); let px=x+r()*w, py=y; g.moveTo(px,py);
    for(let k=0;k<6;k++){ const nx=px+(r()-.5)*w*.5, ny=py+h/6; g.quadraticCurveTo((px+nx)/2+(r()-.5)*w*.3,(py+ny)/2,nx,ny); px=nx; py=ny; } g.stroke(); }
  if(o.sheen!==false) hfill(g,x,y,w,h,[[0,rgba('#ffffff',0)],[.3,rgba('#ffffff',.14)],[.42,rgba('#ffffff',0)],[1,rgba('#ffffff',0)]]); }
/* glass: a tinted wash with diagonal painted reflection streaks */
function scPGlass(g,x,y,w,h,c,o={}){ if(o.wash!==false) vfill(g,x,y,w,h,[[0,scShadeOf(c,.25)],[1,scShadeOf(c,-.2)]]); g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip();
  for(const [f,ww,a] of [[.15,.18,.35],[.42,.06,.3],[.7,.12,.18]]){ g.fillStyle=rgba('#ffffff',a*(o.k??1)); g.beginPath(); const sx=x+w*f; g.moveTo(sx,y+h); g.lineTo(sx+w*ww,y+h); g.lineTo(sx+w*ww+h*.6,y); g.lineTo(sx+h*.6,y); g.closePath(); g.fill(); } g.restore();
  R(g,rgba('#ffffff',.5),x,y,w,.4); }
/* dot blisters for tactile paving: each dot lit from the top left */
function scPDots(g,x,y,w,h,c,step,rad){ R(g,c,x,y,w,h); for(let yy=y+step/2;yy<y+h;yy+=step) for(let xx=x+step/2;xx<x+w;xx+=step){ ell(g,xx+.25,yy+.3,rad,rad,scShadeOf(c,-.3)); ell(g,xx,yy,rad,rad,scShadeOf(c,.12)); ell(g,xx-rad*.3,yy-rad*.3,rad*.4,rad*.4,scShadeOf(c,.45)); } }
/* a framed poster: invented brand, a painted motif, a headline */
function scPPoster(g,w,h,o){ const [a,b]=o.bg; vfill(g,0,0,w,h,[[0,a],[1,b]]);
  if(o.sun) radial(g,w*.5,h*.4,w*.45,[[0,rgba(o.sun,.9)],[.6,rgba(o.sun,.35)],[1,rgba(o.sun,0)]]);
  if(o.art) o.art(g,w,h);
  if(o.title) scStext(g,o.title,w/2,o.ty??3,o.tc||'#ffffff',o.ts||1);
  if(o.sub) scCtext(g,o.sub,w/2,o.sy??(h-8),o.sc||'#ffffff',1);
  R(g,rgba('#ffffff',.08),0,0,w,h*.45); }
/* a clock face */
function scPClock(g,w,h,o){ const cx=w/2,cy=h/2,r0=Math.min(w,h)/2; ell(g,cx,cy,r0,r0,o.rim||'#1a1a1c'); ell(g,cx,cy,r0*.86,r0*.86,o.face||'#f6efe0');
  radial(g,cx-r0*.3,cy-r0*.3,r0*.8,[[0,rgba('#ffffff',.35)],[1,rgba('#ffffff',0)]]);
  for(let k=0;k<12;k++){ const a=k/12*Math.PI*2, big=k%3===0; g.strokeStyle=o.ink||'#14141c'; g.lineWidth=big?1.4:.7; g.beginPath(); g.moveTo(cx+Math.sin(a)*r0*.62,cy-Math.cos(a)*r0*.62); g.lineTo(cx+Math.sin(a)*r0*(big?.8:.76),cy-Math.cos(a)*r0*(big?.8:.76)); g.stroke(); }
  g.strokeStyle=o.ink||'#14141c'; g.lineCap='round'; g.lineWidth=1.6; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.sin(o.hA??5.1)*r0*.38,cy-Math.cos(o.hA??5.1)*r0*.38); g.stroke();
  g.lineWidth=1; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.sin(o.mA??.3)*r0*.62,cy-Math.cos(o.mA??.3)*r0*.62); g.stroke();
  g.strokeStyle=o.sec||'#c8202a'; g.lineWidth=.5; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.sin(2.4)*r0*.66,cy-Math.cos(2.4)*r0*.66); g.stroke(); g.lineCap='butt'; ell(g,cx,cy,1,1,o.ink||'#14141c'); }

/* a made-up CJK-style character: two radicals of boxes, bars, hooks and sweeps (reads as script, means nothing) */
function scHanzi(g,x,y,s,col,seed,lw){ const r=rng(seed), t=lw||Math.max(.5,s*.11); g.fillStyle=col; g.strokeStyle=col; g.lineWidth=t; g.lineCap='square';
  const ln=(a,b,c,d)=>{ g.beginPath(); g.moveTo(a,b); g.lineTo(c,d); g.stroke(); };
  const part=(px,py,pw,ph)=>{ const k=r()*6|0;
    if(k===0){ R(g,col,px,py,pw,t); R(g,col,px,py+ph-t,pw,t); R(g,col,px,py,t,ph); R(g,col,px+pw-t,py,t,ph); R(g,col,px,py+ph/2-t/2,pw,t); }
    else if(k===1){ for(let i=0;i<3;i++) R(g,col,px+(i===1?pw*.1:0),py+i*(ph-t)/2,pw*(i===1?.8:1),t); R(g,col,px+pw/2-t/2,py,t,ph); }
    else if(k===2){ R(g,col,px,py+ph*.28,pw,t); R(g,col,px+pw/2-t/2,py,t,ph*.55); ln(px+pw/2,py+ph*.5,px+pw*.05,py+ph); ln(px+pw/2,py+ph*.5,px+pw*.95,py+ph); }
    else if(k===3){ for(let i=0;i<3;i++) ell(g,px+pw*.2,py+ph*(.18+i*.3),t*.8,t*.7,col); R(g,col,px+pw*.45,py,t,ph); R(g,col,px+pw*.45,py+ph*.4,pw*.55,t); R(g,col,px+pw-t,py+ph*.4,t,ph*.6); }
    else if(k===4){ R(g,col,px+pw/2-t/2,py,t,ph*.2); R(g,col,px,py+ph*.18,pw,t); R(g,col,px,py+ph*.18,t,ph*.25); R(g,col,px+pw-t,py+ph*.18,t,ph*.25); R(g,col,px+pw*.2,py+ph*.55,pw*.6,t); R(g,col,px+pw*.2,py+ph-t,pw*.6,t); R(g,col,px+pw*.2,py+ph*.55,t,ph*.45); R(g,col,px+pw*.8-t,py+ph*.55,t,ph*.45); }
    else { R(g,col,px,py+ph*.15,pw,t); ln(px+pw*.55,py,px+pw*.1,py+ph); R(g,col,px+pw*.35,py+ph*.55,pw*.6,t); ln(px+pw*.6,py+ph*.55,px+pw,py+ph); } };
  if(r()<.55){ part(x,y,s*.36,s); part(x+s*.46,y,s*.54,s); } else { part(x,y,s,s*.4); part(x+s*.05,y+s*.5,s*.9,s*.5); } g.lineCap='butt'; }
function scHanziRow(g,x,y,n,s,col,seed,vertical=false,gap=.25){ for(let i=0;i<n;i++) scHanzi(g,vertical?x:x+i*s*(1+gap),vertical?y+i*s*(1+gap):y,s,col,seed*31+i); }

/* a mosaic: paint a scene on a scratch canvas, then lay it in tesserae with per-stone tone and a glint */
function scPMosaic(g,w,h,fn,seed,o={}){ const r=rng(seed), cv=document.createElement('canvas'); cv.width=w; cv.height=h; const q=cv.getContext('2d',{willReadFrequently:true}); fn(q,w,h);
  const d=q.getImageData(0,0,w,h).data, b=o.border??2, st=o.step||1.5; R(g,o.grout||'#c8a050',0,0,w,h); if(b) R(g,'#e8d090',0,0,w,.8);
  for(let y=b;y<h-b;y+=st) for(let x=b+((y/st)%2)*st*.4;x<w-b;x+=st){ const i=((Math.min(h-1,y|0))*w+(Math.min(w-1,x|0)))*4; const c='#'+[d[i],d[i+1],d[i+2]].map(v=>Math.max(0,Math.min(255,v+((r()-.5)*(o.jit??30)|0))).toString(16).padStart(2,'0')).join(''); R(g,c,x,y,st*.84,st*.84); R(g,rgba('#ffffff',.18),x,y,st*.84,st*.2); } }

/* close the ends of a barrel vault above the end walls: a half-disc at each end, tiled per metre */
function scVaultCap(p,m,R0,zc,yc,segs,tile=1.6,x0=SL/2){ for(const e of [-1,1]){ const g=new Geo(), pts=[];
    for(let i=0;i<=segs;i++){ const a=-Math.PI/2+i/segs*Math.PI, z=zc+Math.sin(a)*R0, y=yc+Math.cos(a)*R0; pts.push([e<0?-z:z,y]); }
    const cx=e<0?-zc:zc, c=g.v([cx,yc,0],[0,0,1],[cx/tile,yc/tile]); for(const [lx,ly] of pts) g.v([lx,ly,0],[0,0,1],[lx/tile,ly/tile]);
    for(let i=0;i<segs;i++){ const a=c+1+i,b=c+2+i, A_=pts[i],B_=pts[i+1], cr=(A_[0]-cx)*(B_[1]-yc)-(A_[1]-yc)*(B_[0]-cx); if(cr>0) g.I.push(c,a,b); else g.I.push(c,b,a); }
    g.groups.push({start:0,count:g.I.length,mi:0}); mk(g,m,p,e*x0,0,0,0,e<0?Math.PI/2:-Math.PI/2,0); } }

/* ---------- atlases: a shelf-packed canvas of painted cells; each cell knows its UV rect ---------- */
/* list: [[name,w,h,painter(g,w,h)],...]; returns {t, r:{name:[u0,v0,u1,v1]}} */
function scAtlasP(W,list,gr=3,seed=1){ let x=0,y=0,rowH=0; const pos=[];
  for(const [n,w,h,fn] of list){ if(x+w>W){ x=0; y+=rowH; rowH=0; } pos.push([n,x,y,w,h,fn]); x+=w; rowH=Math.max(rowH,h); }
  const H=Math.ceil((y+rowH)/16)*16, r={};
  const t=P2(W,H,(g)=>{ for(const [n,x,y,w,h,fn] of pos){ g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip(); g.translate(x,y); fn(g,w,h); g.restore(); } },gr,seed);
  for(const [n,x,y,w,h] of pos){ r[n]=[(x+.3)/W,1-(y+h-.3)/H,(x+w-.3)/W,1-(y+.3)/H]; r[n].t=t; }
  return {t,r,W,H}; }
/* remap the UVs of vertices i0..i1 into a cell rect; flip: mirror u */
function scUvInto(g,rc,i0,i1,o={}){ for(let i=i0;i<i1;i++){ let u=g.T[i*2],v=g.T[i*2+1]; if(o.fu) u=1-u; if(o.rot){ const t=u; u=v; v=1-t; } g.T[i*2]=rc[0]+(rc[2]-rc[0])*u; g.T[i*2+1]=rc[1]+(rc[3]-rc[1])*v; } }
/* a box (base at y=0) whose faces map onto atlas cells: faces is a rect, or {s,f,b,t,u,px,nx} (s = default) */
const scFACE_KEYS=['px','nx','t','u','f','b'];
function scBoxU(w,h,d,faces){ const g=box(w,h,d,{at:[0,h/2,0]}); for(let fi=0;fi<6;fi++){ const rc=Array.isArray(faces)?faces:(faces[scFACE_KEYS[fi]]||faces.s); if(rc) scUvInto(g,rc,fi*4,fi*4+4); } return g; }
/* a cell remembers its atlas: a face mapped onto another atlas gets the same material with that atlas swapped in */
function scMatFor(m,rc){ if(!rc||!rc.t||m.tex===rc.t) return m; if(!m._alt) m._alt=new Map(); let a=m._alt.get(rc.t); if(!a){ a=Object.assign({},m,{tex:rc.t,_alt:null}); m._alt.set(rc.t,a); } return a; }
function scBX(p,m,faces,x,y,z,w,h,d,ry=0,rx=0,rz=0){ let mats=m; if(!Array.isArray(faces)){ const ms=scFACE_KEYS.map(k=>scMatFor(m,faces[k]||faces.s)); if(ms.some(q=>q!==ms[0])) mats=ms; else mats=ms[0]; } else mats=scMatFor(m,faces); return mk(scBoxU(w,h,d,faces),mats,p,x,y,z,rx,ry,rz); }
function scPlaneU(w,h,rc,sx=1,sy=1){ const g=plane(w,h,sx,sy); scUvInto(g,rc,0,g.T.length/2); return g; }
function scPX(p,m,rc,x,y,z,w,h,rx=0,ry=0,rz=0){ return mk(scPlaneU(w,h,rc),scMatFor(m,rc),p,x,y,z,rx,ry,rz); }
/* mesh helpers for cylinders and lathes whose cells may live in different atlases */
function scCU(p,m,rt,rb,h,seg,rc,cap,x,y,z,rx=0,ry=0,rz=0){ const a=scMatFor(m,rc), b=scMatFor(m,cap||rc); return mk(scCylU(rt,rb,h,seg,rc,cap),scCM(a===b?a:[a,b,b],rc,cap),p,x,y,z,rx,ry,rz); }
function scCM(m,rc,cap){ const a=scMatFor(m,rc), b=scMatFor(m,cap||rc); return a===b?a:[a,b,b]; }
function scCylU(rt,rb,h,seg,rc,cap){ const g=cyl(rt,rb,h,seg); const n=(seg+1)*2; scUvInto(g,rc,0,n); scUvInto(g,cap||rc,n,g.T.length/2); return g; }
function scLatheU(rings,seg,rc,o){ const g=lathe(rings,seg,o); scUvInto(g,rc,0,g.T.length/2); return g; }
/* a printed poster on a backing board inside a raised frame */
function scPosterF(p,K,m,rc,x,y,z,w,h,frame='steel',ry=Math.PI){ const n=N(p,x,y,z,0,ry,0); scBX(n,K.mA,K.a.steelD,0,0,0,w,h,.03); scFrameU(n,K.mA,K.a[frame],0,0,.03,w+.04,h,.045,.04,0); scPX(n,m,rc,0,h/2,.025,w-.07,h-.07); return n; }
/* a long strip made of pieces, each mapped to the whole cell: the cell repeats every 'step' metres */
function scStripU(p,m,rc,x0,x1,step,y,z,h,rx=-Math.PI/2,ry=0){ m=scMatFor(m,rc); for(let x=x0;x<x1-.01;x+=step){ const w=Math.min(step,x1-x); mk(scPlaneU(w,h,[rc[0],rc[1],rc[0]+(rc[2]-rc[0])*w/step,rc[3]]),m,p,x+w/2,y,z,rx,ry,0); } }

/* a long run of boxes along x (skirting, rails, bands): one box per step so the cell keeps its scale */
function scRunBX(p,m,faces,x0,x1,step,y,z,h,d,skip){ for(let x=x0;x<x1-.01;x+=step){ const w=Math.min(step,x1-x), cx=x+w/2; if(skip&&skip(cx)) continue; scBX(p,m,faces,cx,y,z,w,h,d); } }
/* a raised frame round a picture: four bars standing proud of the wall, the picture set back inside */
function scFrameU(p,m,rc,x,y,z,w,h,t=.05,d=.05,ry=Math.PI){ const n=N(p,x,y,z,0,ry,0); scBX(n,m,rc,0,0,0,w,t,d); scBX(n,m,rc,0,h-t,0,w,t,d); scBX(n,m,rc,-w/2+t/2,t,0,t,h-2*t,d); scBX(n,m,rc,w/2-t/2,t,0,t,h-2*t,d); return n; }
/* a glowing scLightbox: a box body, a raised frame, the picture just inside it */
function scLightbox(p,K,mL,rc,x,y,z,w,h,d=.1,frame='steel',ry=Math.PI){ const n=N(p,x,y,z,0,ry,0); scBX(n,K.mA,K.a.steelD,0,0,0,w,h,d*.8); scFrameU(n,K.mA,K.a[frame],0,0,d*.4,w+.04,h,.045,.05,0); scPX(n,mL,rc,0,h/2,d*.4+.012,w-.07,h-.07); return n; }

/* ---------- the shared kit: one lit atlas and one glowing atlas used by every station ---------- */
let scKITC=null;
function scKitC(){ if(scKITC) return scKITC;
  const A=scAtlasP(128,[
    ['steel',32,32,(g,w,h)=>scPSteel(g,0,0,w,h,'#c8ccd2',3)],
    ['steelD',32,32,(g,w,h)=>scPSteel(g,0,0,w,h,'#5a5e66',4)],
    ['oak',32,32,(g,w,h)=>scPWood(g,0,0,w,h,'#c8955a','#a8743e',5,{plank:8})],
    ['walnut',32,32,(g,w,h)=>scPWood(g,0,0,w,h,'#7a4a2a','#5a3218',6,{plank:8})],
    ['tactile',64,16,(g,w,h)=>{ scPDots(g,0,0,w,h,'#e8c020',2,.62); R(g,rgba('#000000',.25),0,h-.6,w,.6); }],
    ['edge',64,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8d4cc'],[1,'#a8a49c']]); const r=rng(8); for(let i=0;i<160;i++) R(g,rgba(r()>.5?'#ffffff':'#3a3a3a',.18),r()*w,r()*h,.6,.6); R(g,'#f6f4ee',0,1,w,3); R(g,rgba('#000000',.3),0,4,w,.5); R(g,rgba('#000000',.45),0,h-1,w,1); }],
    ['ext',16,32,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#c8202a',{bev:1.2}); scPGlass(g,2,6,w-4,18,'#e8a8a0',{k:.8}); R(g,'#a01818',5,9,6,13); R(g,'#2a2a2a',6,7,4,3); scCtext(g,'FIRE',w/2,1.5,'#ffffff',.8); scCtext(g,'110',w/2,26.5,'#ffffff',.8); }],
    ['help',16,32,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#1e4a8a',{bev:1}); R(g,'#f2f2ee',2,2,w-4,6); scCtext(g,'HELP',w/2,2.5,'#1e4a8a',1); for(let y=12;y<20;y+=2) R(g,'#10203a',4,y,w-8,1); ell(g,w/2,24,3,3,'#e8b020'); ell(g,w/2-.6,23.4,1.2,1.2,'#fff0a0'); ell(g,w/2,29.5,1.6,1.2,'#2ae08a'); }],
    ['speaker',16,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#e8e8e4',{bev:1}); ell(g,8,8,6,6,'#5a5a5e'); for(let y=3;y<14;y+=1.5) for(let x=3;x<14;x+=1.5) if((x-8)**2+(y-8)**2<30) ell(g,x,y,.4,.4,'#1a1a1c'); }],
    ['binWaste',16,24,(g,w,h)=>{ scPSteel(g,0,0,w,h,'#9aa0a8',9); R(g,'#1a1a1c',2,3,w-4,5); R(g,'#5a5e66',2,10,w-4,6); scCtext(g,'WASTE',w/2,11,'#ffffff',.7); }],
    ['binCans',16,24,(g,w,h)=>{ scPSteel(g,0,0,w,h,'#9aa0a8',10); ell(g,w/2,5.5,4,2.4,'#1a1a1c'); R(g,'#2a6ad8',2,10,w-4,6); scCtext(g,'CANS',w/2,11,'#ffffff',.7); }],
    ['binPaper',16,24,(g,w,h)=>{ scPSteel(g,0,0,w,h,'#9aa0a8',11); R(g,'#1a1a1c',2,4,w-4,2); R(g,'#2a9a5a',2,10,w-4,6); scCtext(g,'PAPER',w/2,11,'#ffffff',.7); }],
    ['grille',32,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#3a3c40',{bev:1}); for(let x=2;x<w-1;x+=2) R(g,'#14141a',x,2,1,h-4); }],
    ['rubber',16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a3a3e'],[1,'#1a1a1e']]); R(g,rgba('#ffffff',.2),0,0,w,.5); }],
    ['white',32,32,(g,w,h)=>scPPanel(g,0,0,w,h,'#eeeeea',{bev:1.4})],
    ['glass',32,32,(g,w,h)=>scPGlass(g,0,0,w,h,'#9ab8c8')],
    ['clockA',32,32,(g,w,h)=>scPClock(g,w,h,{rim:'#2a2c30',face:'#ffffff',ink:'#1a1a1e'})],
    ['clockB',32,32,(g,w,h)=>scPClock(g,w,h,{rim:'#14141c',face:'#f4ecd8',ink:'#14141c',hA:4.6,mA:1.1})],
    ['clockC',32,32,(g,w,h)=>{ scPClock(g,w,h,{rim:'#a87a2a',face:'#f6efd8',ink:'#3a2410',sec:'#3a2410',hA:3.9,mA:5.6}); g.strokeStyle='#e8c060'; g.lineWidth=.8; g.beginPath(); g.arc(w/2,h/2,w/2-.6,0,Math.PI*2); g.stroke(); }],
    ['cam',16,16,(g,w,h)=>{ scPPanel(g,0,0,w,h,'#e8e8e4',{bev:1}); ell(g,8,8,5,5,'#1a1a1e'); ell(g,7,7,2,2,'#3a5a8a'); ell(g,6.4,6.4,.8,.8,'#c8e0ff'); }],
    ['stone',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b8b4ac'],[1,'#8a867e']]); const r=rng(12); for(let i=0;i<200;i++) R(g,rgba(r()>.5?'#ffffff':'#2a2a2a',.12),r()*w,r()*h,.7,.7); R(g,rgba('#ffffff',.35),0,0,w,.6); R(g,rgba('#000000',.3),0,h-.6,w,.6); }],
    ['gold',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f8e090'],[.35,'#d4ad5a'],[.6,'#8a6424'],[.8,'#c89a40'],[1,'#6a4818']]); R(g,rgba('#ffffff',.55),0,0,w,.6); }],
    ['rope',16,8,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e84858'],[.5,'#a01828'],[1,'#5a0a14']]); for(let x=0;x<w;x+=2) R(g,rgba('#000000',.2),x,0,.6,h); }],
    ['leaf',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#5aa04a'],[1,'#2a6a2a']]); R(g,'#a8d878',w/2-.5,0,1,h); for(let y=2;y<h;y+=3){ g.strokeStyle=rgba('#1a4a1a',.6); g.lineWidth=.5; g.beginPath(); g.moveTo(w/2,y); g.lineTo(2,y+4); g.moveTo(w/2,y); g.lineTo(w-2,y+4); g.stroke(); } }],
    ['soil',16,16,(g,w,h)=>{ R(g,'#3a2a1e',0,0,w,h); const r=rng(14); for(let i=0;i<60;i++) R(g,rgba(r()>.5?'#6a5038':'#1a120a',.6),r()*w,r()*h,.8,.8); }],
    ['terracotta',32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e08a5a'],[.5,'#c8643a'],[1,'#8a3a1e']]); R(g,'#f0a070',0,0,w,2); R(g,rgba('#000000',.25),0,2,w,.6); }]
  ],3,881);
  const L=scAtlasP(128,[
    ['panel',32,16,(g,w,h)=>{ R(g,'#c8ccd0',0,0,w,h); vfill(g,1,1,w-2,h-2,[[0,'#ffffff'],[.5,'#f4f8ff'],[1,'#dce6f2']]); for(let x=8;x<w-1;x+=8) R(g,rgba('#a8b0bc',.5),x,1,.4,h-2); }],
    ['tube',32,8,(g,w,h)=>{ R(g,'#8a9096',0,0,w,h); vfill(g,0,1.5,w,h-3,[[0,'#ffffff'],[.5,'#f2f8ff'],[1,'#c8d8e8']]); }],
    ['warm',32,16,(g,w,h)=>{ R(g,'#8a6a3a',0,0,w,h); vfill(g,1,1,w-2,h-2,[[0,'#fff8e0'],[.5,'#ffe8b0'],[1,'#f2c870']]); }],
    ['bulb',16,16,(g,w,h)=>{ radial(g,8,8,8,[[0,'#ffffff'],[.35,'#fff2c0'],[.7,'#f2b040'],[1,'#8a4a10']]); }],
    ['globe',16,16,(g,w,h)=>{ radial(g,6,6,11,[[0,'#ffffff'],[.4,'#fff6dc'],[1,'#e8c890']]); }],
    ['exit',32,16,(g,w,h)=>{ R(g,'#1a8a4a',0,0,w,h); R(g,'#f2fff4',1,1,w-2,h-2); R(g,'#1a8a4a',2,2,w-4,h-4); scCtext(g,'EXIT',w/2+4,5.5,'#ffffff',1); poly(g,[[4,8],[8,4.5],[8,6.5],[12,6.5],[12,9.5],[8,9.5],[8,11.5]],'#ffffff'); }]
  ],0,882);
  scKITC={A,L,mA:M(A.t),mL:M(L.t,{unlit:true})}; return scKITC; }
/* reset per build: materials are cheap; the canvases stay cached */
function scKitM(){ const k=scKitC(); return {a:k.A.r,l:k.L.r,mA:M(k.A.t),mL:M(k.L.t,{unlit:true}),tA:(c)=>M(k.A.t,{color:c})}; }

/* ---------- props (local space: front faces +z; rotate ry=PI for things on the back wall) ---------- */
/* a platform bench: legs, seat slats, a back; o.seat / o.leg / o.back are cell names, o.mat tints */
function scStBench(p,K,x,z,ry,o={}){ const n=N(p,x,0,z,0,ry,0), L=o.len||1.8, seat=K.a[o.seat||'oak'], leg=K.a[o.leg||'steelD'], m=o.mat||K.mA;
  for(const dx of [-L/2+.12,L/2-.12]){ scBX(n,m,leg,dx,0,0,.06,.42,.42); if(o.back!==false) scBX(n,m,leg,dx,.38,-.22,.05,.5,.05,0,-.12); }
  for(let k=0;k<4;k++) scBX(n,m,seat,0,.42,-.15+k*.1,L,.035,.085);
  if(o.back!==false) for(let k=0;k<3;k++) scBX(n,m,seat,0,.55+k*.13,-.24-k*.015,L,.1,.03,0,-.12);
  scBX(n,m,leg,0,.38,0,L-.1,.04,.36); return n; }
/* a three-way bin: cans, paper, waste */
function scStBins(p,K,x,z,ry){ const n=N(p,x,0,z,0,ry,0); ['binCans','binPaper','binWaste'].forEach((c,i)=>{ scBX(n,K.mA,{s:K.a.steel,f:K.a[c],t:K.a.rubber},(i-1)*.36,0,0,.34,.85,.34); }); scBX(n,K.mA,K.a.steelD,0,.85,0,1.1,.03,.38); return n; }
/* a clock hanging from the ceiling on a rod, two faces */
function scStClock(p,K,x,y,z,ry,face='clockA',r=.32,top){ const n=N(p,x,y,z,0,ry,0); mk(scCylU(r,r,.1,18,K.a.steelD,K.a[face]),scCM(K.mA,K.a.steelD,K.a[face]),n,0,0,0,-Math.PI/2); if(top) scBX(n,K.mA,K.a.steelD,0,r,0,.03,top-y-r,.03); return n; }
/* wall furniture: a fire point, a help point, a speaker and a camera on the back wall */
function scStWallKit(BK,K,x,z,y=0){ scBX(BK,K.mA,{s:K.a.white,f:K.a.ext},x,1.0+y,z-.08,.42,.8,.16,Math.PI); scBX(BK,K.mA,{s:K.a.white,f:K.a.help},x+.7,1.0+y,z-.06,.32,.62,.12,Math.PI); }
function scStSpeaker(p,K,x,y,z,ry){ scBX(p,K.mA,{s:K.a.white,f:K.a.speaker},x,y,z,.28,.28,.18,ry,-.3); }
function scStCam(p,K,x,y,z,ry){ const n=N(p,x,y,z,0,ry,0); scBX(n,K.mA,K.a.steelD,0,-.1,0,.04,.12,.04); scBX(n,K.mA,{s:K.a.white,f:K.a.cam},0,-.28,.05,.14,.16,.3,0,.25); return n; }
/* the platform edge: coping with its white line, the tactile strip, and the face down to the track */
function scStEdge(g,K,o={}){ scStripU(g,K.mA,K.a.edge,-SL/2,SL/2,2,.006,-1.42,.3); scStripU(g,K.mA,K.a.tactile,-SL/2,SL/2,2,.007,-.95,.5);
  if(o.line) scStripU(g,M(null,{color:hexInt(o.line),unlit:true}),[0,0,1,1],-SL/2,SL/2,8,.006,-.62,.05); }
/* lights in the ceiling: a row of glowing panels along x at depth z */
function scStLightRow(p,K,y,z,x0,x1,step,w=1.2,d=.35,cell='panel'){ for(let x=x0;x<=x1+.01;x+=step){ scBX(p,K.mA,K.a.steelD,x,y-.06,z,w+.08,.06,d+.08); scPX(p,K.mL,K.l[cell],x,y-.065,z,w,d,Math.PI/2); } }
/* a cable tray running the length of the ceiling */
function scStTray(p,K,y,z){ scBX(p,K.mA,K.a.steelD,0,y,z,SL,.08,.3); scBX(p,K.mA,K.a.grille,0,y+.08,z,SL,.02,.3); }
/* a planter with a leafy plant: pot, soil, fronds */
function scStPlant(p,K,x,z,s=1,pot='terracotta'){ const n=N(p,x,0,z); mk(scCylU(.32*s,.26*s,.55*s,12,K.a[pot],K.a.soil),scCM(K.mA,K.a[pot],K.a.soil),n,0,.275*s,0); const r=rng((x*13+z*7)|0);
  for(let k=0;k<9;k++){ const a=k/9*Math.PI*2+r(), t=.5+r()*.5; const f=N(n,0,.55*s,0,0,a,0); scPX(f,M(scKitC().A.t,{double:true}),K.a.leaf,0,.35*s*t,.35*s,.22*s,.9*s*t,-.9+r()*.4,0,0); } return n; }
