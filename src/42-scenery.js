
/* =====================================================================================================
   SCENERY SYSTEM. The train never moves: the world scrolls along -x. Everything outside is merged into a
   handful of long strips, one draw call each, that slide by whole periods:
     ground and verge (k=1) · a 3D trackside kit: boxes, gables, posts and crossed cards from one painted atlas
     per scene (k=1) · painted card layers at 27, 45 and 68 m (k<1, parallax) · sky cylinder, sun, weather.
   A scene costs ~20 draw calls. Its textures are freed when the train leaves it.
   ===================================================================================================== */
const OUT=N(world);
/* DW: how much wider than a real bullet train each side of the Meridian is (it went back to a real bullet train's width) */
const GROUND_Y=-1.4, RAIL_Y=-1.1, DW=0, GAUGE=1.5+DW*.53;
let travel=0;
const SCROLL=[]; /* {n,P,k,scene,o}: node x = o - (travel*k mod P) */
function scroller(n,P,k,scene,o=0){ SCROLL.push({n,P,k,scene,o}); return n; }
function planeUV(w,h,flipU){ const g=plane(w,h,1,1); if(flipU) for(let i=0;i<g.T.length;i+=2) g.T[i]=1-g.T[i]; return g; }
function wrapX(v,L){ return ((v+L/2)%L+L)%L-L/2; }
/* a painted canvas texture at an explicit supersampling (the painter works in its own w x h units) */
function PX(w,h,S,fn){ return tex(Math.round(w*S),Math.round(h*S),null,g=>{ g.scale(S,S); fn(g,w,h); g.setTransform(1,0,0,1,0,0); }); }

/* ---------- a geometry accumulator: quads with atlas UVs and a baked per-vertex shade ---------- */
class GB{ constructor(){ this.g=new Geo(); this.g.C=[]; this.g.temp=true; }
  /* corners as seen from the front: bottom-left, bottom-right, top-right, top-left; uv=[u0,v0,u1,v1]; sh=[bottom,top] shade or [r,g,b] pairs */
  q(a,b,c,d,uv,sb=1,st=sb,two=false,nx=1,ny=1){ const g=this.g, n=norm3(cross3(sub3(b,a),sub3(d,a)));
    /* split into nx x ny pieces: the PS1 affine texture pass warps big polygons */
    const L=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t], at=(sx,ty)=>L(L(a,b,sx),L(d,c,sx),ty), sh=t=>Array.isArray(sb)?[0,1,2].map(k=>sb[k]+(st[k]-sb[k])*t):sb+(st-sb)*t;
    const base=g.P.length/3;
    for(let j=0;j<=ny;j++) for(let i=0;i<=nx;i++){ const sx=i/nx, ty=j/ny; g.v(at(sx,ty),n,[uv[0]+(uv[2]-uv[0])*sx,uv[1]+(uv[3]-uv[1])*ty]); const c=sh(ty); if(Array.isArray(c)) g.C.push(c[0],c[1],c[2]); else g.C.push(c,c,c); }
    for(let j=0;j<ny;j++) for(let i=0;i<nx;i++){ const k=base+j*(nx+1)+i, k1=k+1, k2=k+nx+2, k3=k+nx+1; g.I.push(k,k1,k2,k,k2,k3); if(two) g.I.push(k,k2,k1,k,k3,k2); } }
  /* the same, but turned to face direction 'want' whichever order the corners came in */
  qn(a,b,c,d,uv,sb,st,want,nx=1,ny=1){ const n=cross3(sub3(b,a),sub3(d,a)); if(n[0]*want[0]+n[1]*want[1]+n[2]*want[2]<0) this.q(b,a,d,c,[uv[2],uv[1],uv[0],uv[3]],sb,st,false,nx,ny); else this.q(a,b,c,d,uv,sb,st,false,nx,ny); }
  /* copy everything emitted so far n times along x (for wrapping strips) */
  repeatX(offs){ const g=this.g, nv=g.P.length/3, P0=g.P.slice(), N0=g.Nm.slice(), T0=g.T.slice(), C0=g.C.slice(), I0=g.I.slice(); g.P=[]; g.Nm=[]; g.T=[]; g.C=[]; g.I=[];
    offs.forEach((ox,k)=>{ for(let i=0;i<P0.length;i+=3) g.P.push(P0[i]+ox,P0[i+1],P0[i+2]); g.Nm.push(...N0); g.T.push(...T0); g.C.push(...C0); for(const ix of I0) g.I.push(ix+k*nv); }); return this; }
  done(){ this.g.groups=[{start:0,count:this.g.I.length,mi:0}]; return this.g; } }
const sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], cross3=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const shk=(s,k)=>Array.isArray(s)?s.map(v=>v*k):s*k;
/* copies of a period so that a strip slid by up to one period still covers +-cover metres round the car */
const copiesFor=(P,cover)=>{ const n=Math.ceil(cover/P), o=[]; for(let i=-n;i<=n;i++) o.push(i*P); return o; };

/* ---------- the trackside kit emitter. u = along the track (x), d = distance out from the track centre ---------- */
function kitEmitter(gb,s,cells,AW,AH,seg=2.2,segY=seg){
  const W=(u,y,d)=>[u,y,s*d], NX=l=>Math.max(1,Math.ceil(Math.abs(l)/seg)), NY=l=>Math.max(1,Math.ceil(Math.abs(l)/segY));
  const uvOf=c=>{ if(!c) return [0,0,0,0]; const [x,y,w,h]=c, e=.35; return [(x+e)/AW,1-(y+h-e)/AH,(x+w-e)/AW,1-(y+e)/AH]; };
  const cell=k=>typeof k==='string'?cells[k]:k;
  const flipU=uv=>[uv[2],uv[1],uv[0],uv[3]];
  /* a quad facing the track: spans u0..u1 (u0<u1) at distance d; the painting reads left to right for someone looking out */
  function face(u0,u1,y0,y1,d,c,sb=1,st=sb,two=false){ const uv=uvOf(cell(c)), nx=NX(u1-u0), ny=NY(y1-y0);
    if(s>0) gb.q(W(u1,y0,d),W(u0,y0,d),W(u0,y1,d),W(u1,y1,d),uv,sb,st,two,nx,ny); else gb.q(W(u0,y0,d),W(u1,y0,d),W(u1,y1,d),W(u0,y1,d),uv,sb,st,two,nx,ny); }
  const E={s,cells,
    face,
    /* a card standing on the ground, crossed n times round its vertical axis (1 = flat, facing the track) */
    card(u,d,w,h,c,o={}){ const y0=GROUND_Y+(o.y||0), n=o.n||1, sb=o.sb??.82, st=o.st??1, uv=uvOf(cell(c)), a0=o.a0||0;
      for(let i=0;i<n;i++){ const a=a0+i*Math.PI/n, cx=Math.cos(a)*w/2, cz=Math.sin(a)*w/2, sh=i===0?1:.9;
        const L=[u+(s>0?cx:-cx),d-cz], Rr=[u-(s>0?cx:-cx),d+cz]; /* left and right as the viewer sees them */
        gb.q(W(L[0],y0,L[1]),W(Rr[0],y0,Rr[1]),W(Rr[0],y0+h,Rr[1]),W(L[0],y0+h,L[1]),uv,shk(sb,sh),shk(st,sh),true,NX(w),NY(h)); } },
    /* an axis-aligned box: w along the track, dp outward, front face at distance d. cells: f front, e ends, t top, b back */
    box(u,d,w,h,dp,c,o={}){ const y0=GROUND_Y+(o.y||0), y1=y0+h, u0=u-w/2, u1=u+w/2, d1=d+dp, cs=typeof c==='object'&&!Array.isArray(c)?c:{f:c,e:c,t:c};
      const ao=o.ao??.72, fs=o.fs??1, es=o.es??.74, ts=o.ts??1.08;
      face(u0,u1,y0,y1,d,cs.f,shk(o.sb??ao,fs),shk(o.st??1,fs));
      if(cs.t) gb.qn(W(u0,y1,d),W(u1,y1,d),W(u1,y1,d1),W(u0,y1,d1),uvOf(cell(cs.t)),ts,ts,[0,1,0],NX(w),NX(dp));
      if(cs.e){ const uv=uvOf(cell(cs.e)); /* the two ends, seen from up and down the line */
        gb.qn(W(u1,y0,d),W(u1,y0,d1),W(u1,y1,d1),W(u1,y1,d),uv,shk(ao,es),shk(1,es),[1,0,0],NX(dp),NY(h));
        gb.qn(W(u0,y0,d1),W(u0,y0,d),W(u0,y1,d),W(u0,y1,d1),uv,shk(ao,es*.86),shk(1,es*.86),[-1,0,0],NX(dp),NY(h)); }
      if(cs.b) face(u0,u1,y0,y1,d1,cs.b,shk(ao,.7),.7,true); },
    /* a pitched roof on top of a box (ridge along the track); overhang ov */
    gable(u,d,w,dp,y,rh,c,o={}){ const y0=GROUND_Y+y, ov=o.ov??.3, u0=u-w/2-ov, u1=u+w/2+ov, dn=d-ov, df=d+dp+ov, dm=d+dp/2, uv=uvOf(cell(c)), gc=o.gc?uvOf(cell(o.gc)):null;
      const ts=o.ts??1;
      gb.qn(W(u0,y0,dn),W(u1,y0,dn),W(u1,y0+rh,dm),W(u0,y0+rh,dm),uv,ts,ts*1.04,[0,1,-s],NX(w),NY(dp));
      gb.qn(W(u1,y0,df),W(u0,y0,df),W(u0,y0+rh,dm),W(u1,y0+rh,dm),uv,ts*.8,ts*.84,[0,1,s],NX(w),NY(dp));
      if(gc) for(const [uu,dir] of [[u-w/2,-1],[u+w/2,1]]){ const a=W(uu,y0,d),b=W(uu,y0,d+dp),t=W(uu,y0+rh*.94,dm); gb.qn(a,b,t,t,gc,.72,.8,[dir,0,0],NX(dp),NY(rh)); } },
    /* a thin upright post (4 sides) */
    post(u,d,w,h,c,o={}){ E.box(u,d-w/2,w,h,w,{f:c,e:c,t:o.top?c:null},o); },
    /* a horizontal bar (rail, beam) along the track */
    rail(u0,u1,d,y,th,c,o={}){ const y0=GROUND_Y+y; face(u0,u1,y0,y0+th,d,c,o.sh??.9,o.sh??.9,true); },
    /* a flat patch on the ground (paths, puddles, shadows) */
    flat(u,d,w,dp,c,o={}){ const y=GROUND_Y+(o.y??.02), u0=u-w/2, u1=u+w/2, uv=uvOf(cell(c)), sh=o.sh??1;
      const two=!!o.two; if(s>0) gb.q(W(u1,y,d),W(u0,y,d),W(u0,y,d+dp),W(u1,y,d+dp),uv,sh,sh,two,NX(w),NX(dp)); else gb.q(W(u0,y,d),W(u1,y,d),W(u1,y,d+dp),W(u0,y,d+dp),uv,sh,sh,two,NX(w),NX(dp)); },
    /* a sagging wire between two points along the track */
    wire(u0,u1,d,y,sag,c,th=.05){ const n=8, y0=GROUND_Y+y, uv=uvOf(cell(c)), Y=t=>y0-sag*4*t*(1-t);
      for(let i=0;i<n;i++){ const a=u0+(u1-u0)*i/n, b=u0+(u1-u0)*(i+1)/n, ya=Y(i/n), yb=Y((i+1)/n); gb.q(W(a,ya,d),W(b,yb,d),W(b,yb+th,d),W(a,ya+th,d),uv,1,1,true); } } };
  return E; }

/* ballast beside the line: grey stones with painted light and shade */
function ballastTex(){ return P2(64,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#6a6660'],[1,'#57534e']]); const r=rng(37); for(let i=0;i<260;i++){ const x=r()*w, y=r()*h, s=.5+r()*.9, c=['#8a857c','#76716a','#9a958a','#625e58'][i%4]; ell(g,x,y,s,s*.75,c); ell(g,x-s*.25,y-s*.25,s*.45,s*.3,mix(c,'#ffffff',.25)); } vfill(g,0,0,w,2,[[0,rgba('#000000',.25)],[1,rgba('#000000',0)]]); },0,37); }
/* ---------- track: rails, ballast and sleepers (shared by every scene) ---------- */
const TRACK=N(OUT);
(function buildTrack(){
  const mRail=M(null,{color:0x8c9096}), mBase=M(null,{color:0x4a4642}), R2=[], B2=[];
  for(const z of [-GAUGE,GAUGE]){ R2.push([0,RAIL_Y-.08,z,520,.16,.09]); B2.push([0,RAIL_Y-.18,z,520,.07,.18]); }
  mk(mergeBoxes(R2),mRail,TRACK); mk(mergeBoxes(B2),mBase,TRACK);
  const sl=M(sleeperTex(),{unlit:true,color:[.85,.85,.85],repeat:[44,1]});
  scroller(mk(plane(528,6.6,132,2),sl,TRACK,0,RAIL_Y-.22,0,-Math.PI/2),12,1,'*');
})();
/* catenary masts on alternate sides every 36 m, one draw call, and the contact wire */
const POLES=N(OUT);
(function buildPoles(){
  const t=P2(16,64,(g,w,h)=>{ hfill(g,0,0,w,h,[[0,'#7a8086'],[.35,'#a4aab0'],[.5,'#6a7076'],[1,'#4a4e54']]); for(let y=0;y<h;y+=8) R(g,rgba('#000000',.12),0,y,w,1); R(g,'#3a3e44',0,h-6,w,6); }), list=[];
  for(const ox of copiesFor(72,230)) for(const [x,side] of [[0,-1],[36,1]]){ const z=side*(4.9+DW);
    list.push([ox+x,GROUND_Y+5.3,z,.3,10.6,.3],[ox+x,GROUND_Y+10.0,side*(2.45+DW/2),.16,.16,5.0+DW],[ox+x,GROUND_Y+9.7,0,.08,.6,.08],[ox+x,GROUND_Y+.25,z,.7,.5,.7]); }
  scroller(mk(mergeBoxes(list),M(t,{unlit:true}),POLES),72,1,'poles');
  mk(box(520,.04,.04),M(null,{color:0x2a2c2e}),POLES,0,GROUND_Y+9.35,0);
})();

/* ---------- undersea pieces shared by both tunnels ---------- */
function waterTex(o={}){ const c=o.cols||['#03101c','#0a3a56','#126a86'], sh=o.shafts??14; return P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,c[0]],[.55,c[1]],[1,c[2]]]);
  const r=rng(o.seed||7); for(let i=0;i<sh;i++){ const x=r()*w, wd=3+r()*7; for(const dx of [-w,0,w]) vfill(g,x+dx,0,wd,h*.75,[[0,rgba(o.shaft||'#8ad8f0',.22)],[1,rgba(o.shaft||'#8ad8f0',0)]]); }
  for(let i=0;i<(o.motes??80);i++) R(g,rgba(o.mote||'#bfefff',.25),r()*w|0,(h*.5+r()*h*.5)|0,2,1); if(o.extra) o.extra(g,w,h,r); },3,o.seed||7); }
function fishTex(kind){ return P2(kind==='whale'?128:64,kind==='whale'?48:32,(g,w,h)=>{ const r=rng(kind.length);
  if(kind==='whale'){ g.fillStyle='#1e3e58'; g.beginPath(); g.moveTo(8,26); g.quadraticCurveTo(30,6,90,14); g.quadraticCurveTo(110,18,118,8); g.lineTo(124,4); g.lineTo(120,20); g.lineTo(126,34); g.lineTo(112,26); g.quadraticCurveTo(90,40,30,38); g.quadraticCurveTo(10,36,8,26); g.fill();
    g.fillStyle='#4a7a92'; g.beginPath(); g.moveTo(14,30); g.quadraticCurveTo(50,40,96,30); g.quadraticCurveTo(60,34,14,30); g.fill(); for(let k=0;k<6;k++) R(g,'#14304a',22+k*5,33,1,4); ell(g,22,24,1.5,1.5,'#0a1a28'); poly(g,[[44,34],[58,46],[62,36]],'#1e3e58'); }
  else for(let i=0;i<22;i++){ const x=6+r()*(w-14),y=4+r()*(h-8),c=kind==='gold'?['#f2c230','#f28a3a'][i%2]:['#9ad8e8','#c8e8f0'][i%2]; ell(g,x,y,3,1.4,c); poly(g,[[x-3,y],[x-6,y-2],[x-6,y+2]],c); } }); }

/* ---------- lineside furniture shared by every land scene: cable troughs, km posts, signals, relay cabinets ---------- */
const RAILKIT={cells:{trough:[0,0,64,8],troughTop:[0,8,64,8],km:[64,0,16,12],white:[80,0,4,4],steel:[84,0,6,24],signal:[90,0,16,24],cabinet:[106,0,24,32],cabTop:[106,32,16,8],speed:[64,12,16,16],dark:[80,4,4,4]},tex:null};
function railKitTex(){ if(RAILKIT.tex) return RAILKIT.tex; const C=RAILKIT.cells; return RAILKIT.tex=PX(128,48,4,g=>{
  oCell(g,C.trough,(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#b8b4aa'],[1,'#7a766e']]); for(let k=0;k<w;k+=8) R(g,rgba('#000000',.18),x+k,y,.4,h); });
  oCell(g,C.troughTop,(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#c8c4ba'],[1,'#a8a49a']]); for(let k=0;k<w;k+=4) R(g,rgba('#000000',.22),x+k,y,.35,h); });
  oCell(g,C.km,(g,x,y,w,h)=>{ R(g,'#f2f2ec',x,y,w,h); R(g,'#1a1a1a',x+.5,y+.5,w-1,h-1); R(g,'#f2f2ec',x+1,y+1,w-2,h-2); text(g,'24',x+3,y+3,'#1a1a1a',1.2); });
  oCell(g,C.white,STDCELL.white); oCell(g,C.dark,STDCELL.dark); oCell(g,C.steel,STDCELL.steel);
  oCell(g,C.signal,(g,x,y,w,h)=>{ R(g,'#1a1a1c',x+3,y+1,w-6,h-6); for(let k=0;k<3;k++){ ell(g,x+w/2,y+5+k*6,2.2,2.2,'#0a0a0a'); ell(g,x+w/2,y+5+k*6,1.6,1.6,['#3a1010','#3a3010','#4af07a'][k]); } R(g,'#f2f2ec',x+2,y+1,w-4,.8); R(g,'#5a5a5e',x+w/2-.6,y+h-5,1.2,5); });
  oCell(g,C.cabinet,(g,x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#a8aca8'],[1,'#6a6e6a']]); R(g,rgba('#000000',.3),x+w/2-.2,y+2,.4,h-4); for(let k=0;k<4;k++) R(g,rgba('#000000',.15),x+2,y+4+k*2,w/2-4,.4); R(g,'#f2d23a',x+w*.62,y+5,5,4); poly(g,[[x+w*.62+2.5,y+5.4],[x+w*.62+4.6,y+8.6],[x+w*.62+.4,y+8.6]],'#1a1a1a'); });
  oCell(g,C.cabTop,(g,x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#8a8e8a'],[1,'#6a6e6a']]));
  oCell(g,C.speed,(g,x,y,w,h)=>{ R(g,'#f2f2ec',x+1,y+1,w-2,h-2); R(g,'#1a1a1a',x+1,y+1,w-2,1); R(g,'#1a1a1a',x+1,y+h-2,w-2,1); text(g,'16',x+3,y+5,'#1a1a1a',1.3); }); }); }
function railside(E,side,r,P,o={}){ E.box(P/2,3.72,P,.3,.42,{f:'trough',e:'trough',t:'troughTop'},{ao:.75});
  for(let u=(side==='pos'?30:150);u<P;u+=120){ E.post(u,4.25,.1,.9,'white',{top:true}); E.card(u,4.22,.42,.32,'km',{n:1,y:.62}); }
  for(let u=(side==='pos'?84:200);u<P;u+=240){ E.post(u,4.5,.16,4.4,'steel',{top:true}); E.card(u,4.4,.55,.85,'signal',{n:1,y:3.5}); E.box(u,4.36,.5,.06,.2,'dark',{y:4.4}); }
  if(o.cab!==false) for(let u=(side==='pos'?140:40);u<P;u+=160){ E.box(u,4.6,1.1,1.45,.6,{f:'cabinet',e:'cabinet',t:'cabTop'},{ao:.8}); E.box(u+1.3,4.7,.7,1.0,.45,{f:'cabinet',e:'cabinet',t:'cabTop'},{ao:.8}); }
  for(let u=(side==='pos'?190:96);u<P;u+=240){ E.post(u,4.3,.08,1.6,'steel'); E.card(u,4.28,.5,.5,'speed',{n:1,y:1.3}); } }

/* ---------- building a scene ---------- */
const SCN={};
const LAYER_SPEC={ far:{z:68,h:44,tw:208,k:.07,S:3,yb:-2.4}, back:{z:45,h:30,tw:160,k:.15,S:3,yb:-.6}, mid:{z:27,h:20,tw:104,k:.36,S:4,yb:-.2} };
function buildScene(key){
  const S=SCENES[key], root=N(OUT), seed=key.length*131+key.charCodeAt(0);
  const sc={key,root,S,parts:[],swim:[],texs:[]}, T=t=>{ sc.texs.push(t); return t; };
  const O=OK[key]||S.out||{}, KIT=O.kit||S.kit;
  /* sky */
  if(S.sun){ const [col]=S.sun; sc.sunN=mk(plane(16,16),M(T(P2(32,32,(g,w,h)=>{ radial(g,16,16,16,[[0,'#ffffff'],[.28,col],[.42,rgba(col,.9)],[.6,rgba(col,.0)]]); })),{unlit:true,cut:true}),root,0,0,0); }
  const skyT=T(O.sky?O.sky():S.undersea?waterTex(S.water||{}):skyTex(...S.sky()));
  sc.sky=mk(cyl(104,104,124,28,{open:true}),M(skyT,{unlit:true,double:true,repeat:[O.skyRep||(S.undersea?5:4),1]}),root,0,45,0); sc.sky.mesh.geo.noCull=true;
  sc.cap=mk(plane(230,230),M(null,{unlit:true,color:hexInt(S.top)}),root,0,100,0,Math.PI/2);
  for(const side of ['pos','neg']){ const s=side==='pos'?1:-1, o=O[side]||{};
    /* the ground out to the horizon */
    const y=(S.groundY&&S.groundY[side])??GROUND_Y-.02, col=S.ground[side], water=y<GROUND_Y-.1;
    const gt=T(o.ground?o.ground():water?P2(64,64,(g,w,h)=>{ R(g,col,0,0,w,h); const r=rng(5); for(let i=0;i<70;i++) R(g,rgba('#ffffff',.18+r()*.2),r()*w|0,r()*h|0,3+(r()*5|0),1); },6,5):flatTex(col,seed+s));
    const GT=o.groundTile||6.6; scroller(mk(plane(560,240,70,30),M(gt,{unlit:true,repeat:[560/GT,240/GT]}),root,0,y,s*123,-Math.PI/2),GT,o.groundK??(water?.5:.6),key);
    /* the verge beside the line */
    const VW=o.vergeW||7.2, VT=o.vergeTile||24, vt=T(o.verge?o.verge():vergeFor(S.verge[side]));
    const vg=plane(528,VW,264,Math.ceil(VW/2)); if(s>0) for(let i=1;i<vg.T.length;i+=2) vg.T[i]=1-vg.T[i];
    scroller(mk(vg,M(vt,{unlit:true,repeat:[528/VT,1]}),root,0,GROUND_Y+.01,s*(3.6+VW/2),-Math.PI/2),VT,1,key);
    const bt=M(ballastTex(),{unlit:true,repeat:[88,1]});
    scroller(mk(plane(528,1.5,176,1),bt,root,0,GROUND_Y+.02,s*3.0,-Math.PI/2),12,1,key); }
  if(S.undersea) buildUndersea(sc);
  /* painted card layers: far, back, mid. New painters paint one continuous strip (o.far etc.); old ones paint two 256-unit variants */
  for(const side of ['pos','neg']){ const s=side==='pos'?1:-1, o=O[side]||{};
    for(const li of ['far','back','mid']){ const L=Object.assign({},LAYER_SPEC[li],o[li+'Spec']||{});
      let painter=o[li], legacy=false; if(!painter){ legacy=true; painter=li==='far'?S.layers&&S.layers[side][0]:li==='back'?S.back:S.layers&&S.layers[side][1]; } if(!painter) continue;
      const UW=L.uw||512, UH=L.uh||96, t=T(legacy?PX(512,96,L.S,(g,w,h)=>{ for(const v of [0,1]){ g.save(); g.beginPath(); g.rect(v*256,0,256,96); g.clip(); g.translate(v*256,0); painter(g,256,96,rng(seed+(li==='far'?0:li==='back'?3:1)*17+v*5+(s>0?100:0)),v); g.restore(); } })
        :PX(UW,UH,L.S,(g,w,h)=>painter(g,w,h,rng(seed+li.length*17+(s>0?100:0)))));
      const gb=new GB(), E=kitEmitter(gb,s,{},UW,UH,4,L.h/4), yb=GROUND_Y+L.yb;
      E.face(0,L.tw,yb,yb+L.h,L.z,[0,0,UW,UH],L.sb??1,L.st??1); gb.repeatX(copiesFor(L.tw,240));
      scroller(mk(gb.done(),M(t,{unlit:true,cut:true}),root),L.tw,L.k,key,s>0?L.tw*.37:0); } }
  /* the 3D trackside kit (k=1): new scenes give S.kit; old ones get their prop cards */
  const KP=O.kitP||240;
  if(KIT){ const K=KIT, AW=K.aw||256, AH=K.ah||256, at=T(PX(AW,AH,K.S||4,(g,w,h)=>K.atlas(g,w,h))), gb=new GB();
    for(const side of ['pos','neg']){ const s=side==='pos'?1:-1; K.place(kitEmitter(gb,s,K.cells,AW,AH),side,rng(seed+(s>0?7:3)),KP); }
    gb.repeatX(copiesFor(KP,230)); scroller(mk(gb.done(),M(at,{unlit:true,cut:true}),root),KP,1,key); }
  if(!S.undersea&&!O.noRail){ const gb=new GB(), k=O.railShade??(S.night?.42:1);
    for(const side of ['pos','neg']){ const s=side==='pos'?1:-1, e=kitEmitter(gb,s,RAILKIT.cells,128,48); railside(e,side,rng(seed+(s>0?11:13)),KP,(O[side]||{}).rail); }
    for(let i=0;i<gb.g.C.length;i++) gb.g.C[i]*=k; gb.repeatX(copiesFor(KP,230)); scroller(mk(gb.done(),M(railKitTex(),{unlit:true,cut:true}),root),KP,1,key); }
  if(!KIT&&S.props){ const r=rng(seed+77), gb=new GB(), n=S.props.length;
    /* legacy: pack the prop cards side by side into one atlas */ const cw=64, AW=cw*n, AH=128, at=T(PX(AW,AH,2,(g)=>{ S.props.forEach(([t],i)=>{ g.drawImage(t.c,i*cw,0,cw,AH); }); }));
    for(const side of ['pos','neg']){ const s=side==='pos'?1:-1, E=kitEmitter(gb,s,{},AW,AH);
      for(let i=0;i<16;i++){ const pi=(r()*n)|0, [,pw,ph]=S.props[pi], d=5.2+DW+r()*4.4; E.card((i/16)*KP+r()*12,d,pw,ph,[pi*cw,0,cw,AH],{n:1,sb:1}); } }
    gb.repeatX(copiesFor(KP,230)); scroller(mk(gb.done(),M(at,{unlit:true,cut:true}),root),KP,1,key); }
  /* weather: one merged cloud of petals, flakes, streaks or bubbles that slides and falls through a wrapped box */
  const P=S.particles||(S.undersea?'bubble':null);
  if(P){ const spec={petal:[.09,.07,'#ffc8d8',220,.9,-.45],snow:[.08,.08,'#ffffff',420,.95,-.9],rain:[.016,.6,'#a8b8c8',520,1,-9],bubble:[.07,.07,'#bfefff',160,.6,.8],mote:[.05,.05,'#9ab8c8',380,.25,-.12]}[P];
    const [pw,ph,pc,n,k,fall]=spec, BX=48, BY=12, gb=new GB(), r=rng(41), E=[kitEmitter(gb,1,{},1,1),kitEmitter(gb,-1,{},1,1)];
    for(let i=0;i<n;i++){ const s=i%2?1:-1, e=E[i%2], u=r()*BX, d=3.6+r()*(S.undersea?12:16)+(S.undersea?2.4:0), yy=r()*BY, sh=.8+r()*.25;
      if(P==='petal'){ const a=r()*6.28, ca=Math.cos(a), sa=Math.sin(a), z=s*d, C_=(x,y)=>[u+x*ca-y*sa,yy+x*sa+y*ca,z+x*.04]; gb.q(C_(-pw,-ph),C_(pw,-ph),C_(pw,ph),C_(-pw,ph),[0,0,1,1],sh,sh,true); }
      else if(P==='rain'){ gb.q([u,yy,s*d],[u+.05,yy,s*d],[u+.05+.12,yy+ph,s*d],[u+.12,yy+ph,s*d],[0,0,1,1],sh,sh,true); }
      else gb.q([u,yy,s*d],[u+pw,yy,s*d],[u+pw,yy+ph,s*d],[u,yy+ph,s*d],[0,0,1,1],sh,sh,true); }
    const offs=[]; for(const ox of [-2,-1,0,1,2]) for(const oy of [0,1]) offs.push([ox*BX,oy*BY]);
    const nv=gb.g.P.length/3, P0=gb.g.P.slice(); gb.repeatX(offs.map(o=>o[0])); for(let c=0;c<offs.length;c++) for(let i=0;i<nv;i++) gb.g.P[(c*nv+i)*3+1]+=offs[c][1];
    sc.weather={n:mk(gb.done(),M(null,{unlit:true,color:hexInt(pc)}),root,0,0,0),BX,BY,k,fall,P}; }
  (function own(n){ if(n.mesh){ n.mesh.geo.temp=true; for(const m of n.mesh.mats) if(m.tex&&m.tex!==RAILKIT.tex&&!sc.texs.includes(m.tex)) sc.texs.push(m.tex); } for(const k of n.kids) own(k); })(root); /* everything here belongs to the scene */
  root.vis=false; SCN[key]=sc; return sc;
}
/* the glass tube on the sea floor: ribs every 10 m, glowing roof strips and long rails, three draw calls */
function buildUndersea(sc){ const root=sc.root, S=sc.S, U=S.tube||{};
  const UR=5.6+DW, ring=torus(UR,.12,4,24), ribs=new Geo(), glows=[], P=10;
  /* the torus lies in xy; stand it across the track: (x,y,z) -> (z, y, -x) */
  for(const ox of copiesFor(P,230)){ const base=ribs.P.length/3;
    for(let i=0;i<ring.P.length;i+=3){ ribs.P.push(ox+ring.P[i+2],GROUND_Y+3.6+ring.P[i+1],-ring.P[i]); ribs.Nm.push(ring.Nm[i+2],ring.Nm[i+1],-ring.Nm[i]); }
    ribs.T.push(...ring.T); for(const ix of ring.I) ribs.I.push(ix+base); glows.push([ox,GROUND_Y+9.15,0,.5,.08,.08]); }
  ribs.groups=[{start:0,count:ribs.I.length,mi:0}]; ribs.temp=true;
  scroller(mk(ribs,M(null,{color:hexInt(U.rib||'#a8c0c8')}),root),P,1,sc.key);
  const rails=[]; for(let k=0;k<7;k++){ const a=Math.PI*(.15+k*.7/6)+Math.PI*.35; const y=GROUND_Y+3.6+Math.sin(a)*UR,z=Math.cos(a)*UR; for(const s of [1,-1]) rails.push([0,y,s*z,520,.05,.05]); }
  const rg=mergeBoxes(rails); rg.temp=true; mk(rg,M(null,{color:hexInt(U.rib||'#a8c0c8')}),root);
  const gg=mergeBoxes(glows); gg.temp=true; scroller(mk(gg,M(null,{unlit:true,color:hexInt(U.glow||'#bfefff')}),root),P,1,sc.key);
  if(S.swimmers) S.swimmers(sc); else {
    const tex={whale:fishTex('whale'),shoal:fishTex('shoal'),gold:fishTex('gold')}, r=rng(91); for(const k in tex) sc.texs.push(tex[k]);
    for(let i=0;i<10;i++){ const kind=i<2?'whale':i%2?'shoal':'gold', s=i%2?1:-1, z=s*(16+r()*28), sz=kind==='whale'?[14,5.2]:[5,2.5];
      const n=mk(planeUV(sz[0],sz[1],s>0),M(tex[kind],{unlit:true,cut:true}),root,0,GROUND_Y+3+r()*12,z,0,s>0?Math.PI:0,0);
      sc.swim.push({n,x:(r()-.5)*200,y0:n.p[1],ph:r()*6,k:kind==='whale'?.12:.25,own:kind==='whale'?-1.2:(r()-.5)*3}); } } }
/* leaving a scene frees its GPU textures and buffers; coming back paints it again */
function disposeScene(sc){ disposeTree(sc.root); for(const t of sc.texs) if(t&&t.glt){ gl.deleteTexture(t.glt); t.glt=null; }
  const i=OUT.kids.indexOf(sc.root); if(i>=0) OUT.kids.splice(i,1); for(let k=SCROLL.length-1;k>=0;k--) if(SCROLL[k].scene===sc.key) SCROLL.splice(k,1); delete SCN[sc.key]; }
let curScene=null;
function setScene(key){ if(curScene&&curScene.key!==key){ disposeScene(curScene); curScene=null; } const sc=SCN[key]||buildScene(key); sc.root.vis=true; curScene=sc; POLES.vis=!sc.S.undersea; return sc; }
function updateOut(dt,speed,eye,camX){
  travel+=dt*speed;
  for(const s of SCROLL){ if(s.scene!=='*'&&s.scene!=='poles'&&(!curScene||s.scene!==curScene.key)) continue; const m=((travel*s.k)%s.P+s.P)%s.P; s.n.p[0]=s.o-m; }
  if(!curScene) return; const sc=curScene, t=performance.now()/1000;
  sc.sky.p[0]=eye[0]; sc.sky.p[2]=eye[2]; sc.cap.p[0]=eye[0]; sc.cap.p[2]=eye[2];
  if(sc.sunN){ const [,az,el]=sc.S.sun, d=[Math.sin(az)*Math.cos(el),Math.sin(el),-Math.cos(az)*Math.cos(el)]; sc.sunN.p=[eye[0]+d[0]*90,eye[1]+d[1]*90,eye[2]+d[2]*90]; sc.sunN.r=[0,Math.atan2(-d[0],-d[2]),0]; }
  for(const f of sc.swim) f.upd?f.upd(f,t,travel,camX):(f.n.p[0]=camX+wrapX(f.x-travel*f.k+t*f.own-camX,200), f.n.p[1]=f.y0+Math.sin(t*.4+f.ph)*.8);
  const W=sc.weather; if(W){ const sway=W.P==='petal'||W.P==='snow'?Math.sin(t*.7)*.6:0;
    W.n.p[0]=-((((travel*W.k+sway)%W.BX)+W.BX)%W.BX); W.n.p[1]=GROUND_Y-W.BY+((((t*W.fall)%W.BY)+W.BY)%W.BY); }
}
