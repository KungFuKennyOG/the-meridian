
/* =====================================================================================================
   SCENERY SYSTEM (super-gauge). The Meridian runs on 3 m track with cars 6.2 m wide, so everything
   outside sits further out than on the Halcyra set. The train never moves: the world scrolls along -x.
   Every outside surface faces the track and is single-sided, so a camera outside it sees straight through.
   ===================================================================================================== */
const OUT=N(world);
/* DW: how much wider than a real bullet train each side of the Meridian is (it is 9.2 m across) */
const GROUND_Y=-1.4, RAIL_Y=-1.1, DW=1.5, GAUGE=2.3;
const scrollers=[];
let travel=0;
function planeUV(w,h,flipU){ const g=plane(w,h,1,1); if(flipU) for(let i=0;i<g.T.length;i+=2) g.T[i]=1-g.T[i]; return g; }
function wrapX(v,L){ return ((v+L/2)%L+L)%L-L/2; }
function addScroll(n,base,L,k,scene){ n.p[0]=base; scrollers.push({n,base,L,k,scene}); return n; }

const TRACK=N(OUT);
(function buildTrack(){
  const mRail=M(null,{color:0x8c9096}), mBase=M(null,{color:0x4a4642});
  for(const z of [-GAUGE,GAUGE]){ mk(box(360,.16,.09),mRail,TRACK,0,RAIL_Y-.08,z); mk(box(360,.07,.18),mBase,TRACK,0,RAIL_Y-.18,z); }
  const sl=M(sleeperTex(),{unlit:true,color:[.85,.85,.85]}), g=planeUV(12,6.6);
  for(let i=0;i<30;i++){ const n=mk(g,sl,TRACK,0,RAIL_Y-.22,0,-Math.PI/2); addScroll(n,(i-15)*12,360,1,'*'); }
})();
const POLES=N(OUT), POLE_ARMS=[];
(function buildPoles(){
  const m=M(null,{color:0x5a5e62}), mw=M(null,{color:0x2a2c2e});
  for(let i=0;i<10;i++){ const side=i%2?1:-1, n=N(POLES,0,0,0); addScroll(n,(i-5)*36,360,1,'poles');
    mk(box(.3,10.6,.3),m,n,0,GROUND_Y+5.3,side*(4.9+DW)); const arm=N(n); POLE_ARMS.push(arm);
    mk(box(.16,.16,5.0+DW),m,arm,0,GROUND_Y+10.0,side*(2.45+DW/2)); mk(box(.08,.6,.08),m,arm,0,GROUND_Y+9.7,0); }
  const wire=mk(box(360,.04,.04),mw,POLES,0,GROUND_Y+9.35,0); POLE_ARMS.push(wire);
})();

const SCN={};
function waterTex(){ return P2(128,128,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#03101c'],[.55,'#0a3a56'],[1,'#126a86']]);
  const r=rng(7); for(let i=0;i<14;i++){ const x=r()*w, wd=3+r()*7; for(const dx of [-w,0,w]) vfill(g,x+dx,0,wd,h*.75,[[0,rgba('#8ad8f0',.22)],[1,rgba('#8ad8f0',0)]]); }
  for(let i=0;i<80;i++) R(g,rgba('#bfefff',.25),r()*w|0,(h*.5+r()*h*.5)|0,2,1); },3,7); }
function fishTex(kind){ return P2(kind==='whale'?128:64,kind==='whale'?48:32,(g,w,h)=>{ const r=rng(kind.length);
  if(kind==='whale'){ g.fillStyle='#1e3e58'; g.beginPath(); g.moveTo(8,26); g.quadraticCurveTo(30,6,90,14); g.quadraticCurveTo(110,18,118,8); g.lineTo(124,4); g.lineTo(120,20); g.lineTo(126,34); g.lineTo(112,26); g.quadraticCurveTo(90,40,30,38); g.quadraticCurveTo(10,36,8,26); g.fill();
    g.fillStyle='#4a7a92'; g.beginPath(); g.moveTo(14,30); g.quadraticCurveTo(50,40,96,30); g.quadraticCurveTo(60,34,14,30); g.fill(); for(let k=0;k<6;k++) R(g,'#14304a',22+k*5,33,1,4); ell(g,22,24,1.5,1.5,'#0a1a28'); poly(g,[[44,34],[58,46],[62,36]],'#1e3e58'); }
  else for(let i=0;i<22;i++){ const x=6+r()*(w-14),y=4+r()*(h-8),c=kind==='gold'?['#f2c230','#f28a3a'][i%2]:['#9ad8e8','#c8e8f0'][i%2]; ell(g,x,y,3,1.4,c); poly(g,[[x-3,y],[x-6,y-2],[x-6,y+2]],c); } }); }
function buildScene(key){
  const S=SCENES[key], root=N(OUT), seed=key.length*131+key.charCodeAt(0);
  const sc={key,root,S,parts:[],swim:[]};
  if(S.sun){ const [col]=S.sun; sc.sunN=mk(plane(16,16),M(P2(32,32,(g,w,h)=>{ radial(g,16,16,16,[[0,'#ffffff'],[.28,col],[.42,rgba(col,.9)],[.6,rgba(col,.0)]]); }),{unlit:true,cut:true}),root,0,0,0); }
  if(!S.undersea){ const [stops,o]=S.sky(); sc.sky=mk(cyl(104,104,124,28,{open:true}),M(skyTex(stops,o),{unlit:true,double:true,repeat:[4,1]}),root,0,45,0); sc.sky.mesh.geo.noCull=true;
    sc.cap=mk(plane(230,230),M(null,{unlit:true,color:hexInt(S.top)}),root,0,100,0,Math.PI/2); }
  else { sc.sky=mk(cyl(104,104,124,28,{open:true}),M(waterTex(),{unlit:true,double:true,repeat:[5,1]}),root,0,45,0); sc.sky.mesh.geo.noCull=true;
    sc.cap=mk(plane(230,230),M(null,{unlit:true,color:hexInt(S.top)}),root,0,100,0,Math.PI/2); }
  for(const side of ['pos','neg']){ const s=side==='pos'?1:-1, y=(S.groundY&&S.groundY[side])??GROUND_Y-.02;
    const col=S.ground[side], water=y<GROUND_Y-.1;
    const t=water?P2(64,64,(g,w,h)=>{ R(g,col,0,0,w,h); const r=rng(5); for(let i=0;i<70;i++) R(g,rgba('#ffffff',.18+r()*.2),r()*w|0,r()*h|0,3+(r()*5|0),1); },6,5):flatTex(col,seed+s);
    mk(plane(460,230),M(t,{unlit:true,repeat:[70,35]}),root,0,y,s*115,-Math.PI/2); }
  for(const side of ['pos','neg']){ const s=side==='pos'?1:-1, vt=M(vergeFor(S.verge[side]),{unlit:true}), g=planeUV(24,7.2,s>0);
    for(let i=0;i<14;i++){ const n=mk(g,vt,root,0,GROUND_Y+.01,s*(7.2+DW),-Math.PI/2); addScroll(n,(i-7)*24,336,1,key); }
    const bt=M(sleeperTex(),{unlit:true,color:[.7,.7,.7]}), gb=planeUV(12,1.5);
    for(let i=0;i<28;i++){ const n=mk(gb,bt,root,0,GROUND_Y+.02,s*3.0,-Math.PI/2); addScroll(n,(i-14)*12,336,1,key); } }
  if(S.undersea) buildUndersea(sc);
  else {
    const spec=[[64,42,104,4,.06,0],[44,30,80,5,.16,3],[26,20,52,6,.4,1],[10.6,11,26,12,1,2]];
    for(const side of ['pos','neg']){ const s=side==='pos'?1:-1;
      spec.forEach(([z,h,tw,count,k,li])=>{
        const painter=li===3?S.back:S.layers[side][li]; if(!painter) return; const mats=[0,1].map(v=>M(P2(LW,LH,(g,w,h_)=>painter(g,w,h_,rng(seed+li*17+v*5+(s>0?100:0)),v),0,1),{unlit:true,cut:true}));
        const g=planeUV(tw,h,s>0), yb=li===0?GROUND_Y-1.6:GROUND_Y;
        for(let i=0;i<count;i++){ const n=mk(g,mats[(i+(s>0?1:0))%2],root,0,yb+h/2,s*z,0,s>0?Math.PI:0,0); addScroll(n,(i-count/2)*tw+(s>0?tw*.37:0),tw*count,k,key); } }); }
  }
  if(S.props){ const r=rng(seed+77); for(const side of ['pos','neg']){ const s=side==='pos'?1:-1;
    for(let i=0;i<16;i++){ const [t,pw,ph]=S.props[(r()*S.props.length)|0], z=s*(5.2+DW+r()*4.4);
      const n=mk(planeUV(pw,ph,s>0),M(t,{unlit:true,cut:true}),root,0,GROUND_Y+ph/2,z,0,s>0?Math.PI:0,0); addScroll(n,(i/16)*336-168+r()*12,336,1,key); } } }
  /* weather: petals drift, snow falls, rain streaks, bubbles rise */
  const P=S.particles||(S.undersea?'bubble':null);
  if(P){ const spec={petal:[.08,.06,0xffc8d8,90],snow:[.09,.09,0xffffff,160],rain:[.018,.55,0xa8b8c8,180],bubble:[.06,.06,0xbfefff,80]}[P];
    const pm=M(null,{unlit:true,double:true,color:spec[2]}), pg=plane(spec[0],spec[1]), r=rng(41);
    for(let i=0;i<spec[3];i++){ const n=mk(pg,pm,root,0,0,0); sc.parts.push({n,x:(r()-.5)*90,y:r()*12,z:(r()-.5)*36,ph:r()*6.28,sp:.7+r()*.6,type:P}); } }
  root.vis=false; SCN[key]=sc; return sc;
}
function buildUndersea(sc){ const root=sc.root, rib=M(null,{color:0xa8c0c8}), glow=M(null,{unlit:true,color:0xbfefff});
  const UR=5.6+DW, ring=torus(UR,.12,4,24);
  for(let i=0;i<36;i++){ const n=N(root,0,0,0); addScroll(n,(i-18)*10,360,1,sc.key); mk(ring,rib,n,0,GROUND_Y+3.6,0,0,Math.PI/2,0); mk(box(.5,.08,.08),glow,n,0,GROUND_Y+9.15,0); }
  for(let k=0;k<7;k++){ const a=Math.PI*(.15+k*.7/6)*1.0+Math.PI*.35; const y=GROUND_Y+3.6+Math.sin(a)*UR,z=Math.cos(a)*UR; for(const s of [1,-1]) mk(box(360,.05,.05),rib,root,0,y,s*z); }
  const tex={whale:fishTex('whale'),shoal:fishTex('shoal'),gold:fishTex('gold')}, r=rng(91);
  for(let i=0;i<10;i++){ const kind=i<2?'whale':i%2?'shoal':'gold', s=i%2?1:-1, z=s*(16+r()*28), sz=kind==='whale'?[14,5.2]:[5,2.5];
    const n=mk(planeUV(sz[0],sz[1],s>0),M(tex[kind],{unlit:true,cut:true}),root,0,GROUND_Y+3+r()*12,z,0,s>0?Math.PI:0,0);
    sc.swim.push({n,x:(r()-.5)*200,y0:n.p[1],ph:r()*6,k:kind==='whale'?.12:.25,own:kind==='whale'?-1.2:(r()-.5)*3}); } }
let curScene=null;
function setScene(key){ const sc=SCN[key]||buildScene(key); if(curScene) curScene.root.vis=false; sc.root.vis=true; curScene=sc; POLES.vis=!sc.S.undersea; return sc; }
function updateOut(dt,speed,eye,camX){
  travel+=dt*speed;
  for(const s of scrollers){ if(s.scene!=='*'&&s.scene!=='poles'&&(!curScene||s.scene!==curScene.key)) continue; s.n.p[0]=wrapX(s.base-travel*s.k,s.L); }
  if(!curScene) return; const sc=curScene, t=performance.now()/1000;
  sc.sky.p[0]=eye[0]; sc.sky.p[2]=eye[2]; sc.cap.p[0]=eye[0]; sc.cap.p[2]=eye[2];
  if(sc.sunN){ const [,az,el]=sc.S.sun, d=[Math.sin(az)*Math.cos(el),Math.sin(el),-Math.cos(az)*Math.cos(el)]; sc.sunN.p=[eye[0]+d[0]*90,eye[1]+d[1]*90,eye[2]+d[2]*90]; sc.sunN.r=[0,Math.atan2(-d[0],-d[2]),0]; }
  for(const f of sc.swim){ f.n.p[0]=camX+wrapX(f.x-travel*f.k+t*f.own-camX,200); f.n.p[1]=f.y0+Math.sin(t*.4+f.ph)*.8; }
  for(const p of sc.parts){ let x,y,z=p.z;
    if(p.type==='petal'){ x=p.x-travel*.9+Math.sin(t*p.sp+p.ph)*.6; y=GROUND_Y+1+(p.y*.6+Math.sin(t*1.3*p.sp+p.ph)*.4); p.n.r=[t*2.1*p.sp+p.ph,t*1.7+p.ph,t*.9]; }
    else if(p.type==='snow'){ x=p.x-travel*.95+Math.sin(t*.7*p.sp+p.ph)*.5; y=GROUND_Y+((p.y-t*.9*p.sp)%12+12)%12; p.n.r=[t+p.ph,t*.8,0]; }
    else if(p.type==='rain'){ x=p.x-travel; y=GROUND_Y+((p.y-t*9*p.sp)%12+12)%12; p.n.r=[0,Math.PI/2,Math.min(.9,speed*.012)]; }
    else { x=p.x-travel*.6; y=GROUND_Y+((p.y+t*.8*p.sp)%12+12)%12; z=p.z+Math.sin(t+p.ph)*.3; }
    p.n.p[0]=camX+wrapX(x-camX,90); p.n.p[1]=y; p.n.p[2]=z; }
}
