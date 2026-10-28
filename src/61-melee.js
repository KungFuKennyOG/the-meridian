/* =====================================================================
   MELEE, the Saints & Sinners way (VR).
   - Blades sit in the hand the way you really hold them: the handle runs through the fist (the controller's
     grip pose), the blade comes out over the thumb with a slight forward lean, the edge faces your knuckles.
     A/X flips a knife or bottle into a reverse (ice-pick) grip and back.
   - Weight: the machete lags a little behind your hand and its tip sags.
   - Speed is damage. A lazy swing just bumps off him.
   - A hard thrust point-first sinks the blade and it STAYS IN. Your hand stays on the handle; he's pulled
     around by it. Work it and he screams and bleeds more. Pull hard to rip it out (the blood follows it).
     Let go and it stays in him until you take it back.
   - Guns are solid too: swing one and you pistol-whip or butt-stroke him.
   ===================================================================== */
const MEL={tilt:0,yaw:2}; /* Kenny's picks on the Quest: blade straight out of the fist, hands turned out 5° */
const MELEE_TILT=[0,.44,.79],MELEE_TILT_LBL=['0°','25°','45°'];        /* blade lean forward from the grip axis */
const HAND_YAW=[5,0,-5],HAND_YAW_LBL=['IN 5°','0°','OUT 5°'],HAND_DROP=.015; /* small correction to where the hands sit */
const WEIGHT={machete:16};    /* how fast the weapon catches up with your hand (1/s); missing = rigid */
const SAG={machete:.1};        /* radians the head droops when held one-handed */
const BURY={knife:.06,bottle:.04,machete:.09};
const STICKS={knife:1,machete:1};

/* ---------- quaternions for the weight lag ---------- */
function qFromCols(X,Y,Z){ const tr=X[0]+Y[1]+Z[2]; let x,y,z,w;
  if(tr>0){ const s=Math.sqrt(tr+1)*2; w=.25*s; x=(Y[2]-Z[1])/s; y=(Z[0]-X[2])/s; z=(X[1]-Y[0])/s; }
  else if(X[0]>Y[1]&&X[0]>Z[2]){ const s=Math.sqrt(1+X[0]-Y[1]-Z[2])*2; w=(Y[2]-Z[1])/s; x=.25*s; y=(Y[0]+X[1])/s; z=(Z[0]+X[2])/s; }
  else if(Y[1]>Z[2]){ const s=Math.sqrt(1+Y[1]-X[0]-Z[2])*2; w=(Z[0]-X[2])/s; x=(Y[0]+X[1])/s; y=.25*s; z=(Z[1]+Y[2])/s; }
  else { const s=Math.sqrt(1+Z[2]-X[0]-Y[1])*2; w=(X[1]-Y[0])/s; x=(Z[0]+X[2])/s; y=(Z[1]+Y[2])/s; z=.25*s; }
  return [x,y,z,w]; }
function qCols(q){ const [x,y,z,w]=q; return [[1-2*(y*y+z*z),2*(x*y+z*w),2*(x*z-y*w)],[2*(x*y-z*w),1-2*(x*x+z*z),2*(y*z+x*w)],[2*(x*z+y*w),2*(y*z-x*w),1-2*(x*x+y*y)]]; }
function qNlerp(a,b,t){ const d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],s=d<0?-1:1,q=a.map((v,i)=>v+(b[i]*s-v)*t),l=Math.hypot(...q)||1; return q.map(v=>v/l); }

/* ---------- where the hand is ---------- */
/* grip pose -> our hand frame: hand +z = knuckles (grip -Y), hand +y = thumb (grip -Z), the fist centre on the grip origin */
const GRIP_C=(()=>{ const m=m4.make(); m.set([-1,0,0,0, 0,0,-1,0, 0,-1,0,0, 0,0,0,1]); const p=mulP(m,FIST); m[12]=-p[0]; m[13]=-p[1]; m[14]=-p[2]; return m; })();
function gripHand(gripM){ const o=m4.make(); m4.mul(o,gripM,GRIP_C); return o; }
function handTweak(h){ const a=HAND_YAW[MEL.yaw]*Math.PI/180*(h.side==='R'?1:-1),c=Math.cos(a),s=Math.sin(a),m=m4.make();
  m.set([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); const r=mulP(m,FIST); m[12]=FIST[0]-r[0]; m[13]=FIST[1]-r[1]-HAND_DROP; m[14]=FIST[2]-r[2]; return m; }
function meleeAngle(item){ return item.rev?Math.PI/2:-Math.PI/2+MELEE_TILT[MEL.tilt]; }
function reequipMelee(){ for(const h of [HANDS.L,HANDS.R]) if(h.item&&WPN[h.item.key].melee&&!h.stuck) equip(h,h.item); }
function flipGrip(h){ const it=h.item; if(!it||!(it.key==='knife'||it.key==='bottle')||h.stuck) return; it.rev=!it.rev; equip(h,it); sfx('swish',.3); buzz(h.hand,.4,25); }

/* ---------- every frame, per hand (VR) ---------- */
function meleeTick(h,dt){
  if(h.stuck){ stuckTick(h,dt); return; }
  h.bumpCd=(h.bumpCd||0)-dt;
  const it=h.item,w=it&&WPN[it.key];
  if(!w||!w.melee||!h.itemNode||h.support||h.supportOf){ h.melQ=null; return; }
  const wt=WEIGHT[it.key]; if(!wt){ h.melQ=null; if(h.itemW){ h.itemW=null; restoreItemNode(h); } return; }
  const T=m4.make(); m4.mul(T,h.M,h.itemL); let X=colOf(T,0),Y=colOf(T,1),Z=colOf(T,2);
  const sag=SAG[it.key]||0,ax=v3.cross(Z,[0,-1,0]),al=Math.hypot(...ax); /* the head droops toward the floor */
  if(sag&&al>1e-3){ const k=v3.sc(ax,1/al),a=sag*al,c=Math.cos(a),s=Math.sin(a); X=rodr(X,k,c,s); Y=rodr(Y,k,c,s); Z=rodr(Z,k,c,s); }
  const qt=qFromCols(X,Y,Z); h.melQ=h.melQ?qNlerp(h.melQ,qt,1-Math.exp(-wt*dt)):qt;
  const [Xc,Yc,Zc]=qCols(h.melQ),g=w.grip,G=mulP(T,g),O=v3.sub(G,v3.add(v3.sc(Xc,g[0]),v3.add(v3.sc(Yc,g[1]),v3.sc(Zc,g[2]))));
  h.itemW=fromCols(Xc,Yc,Zc,O); setLocal(h.itemNode,h.M,h.itemW); }
function restoreItemNode(h){ if(h.itemNode&&h.itemPR){ h.itemNode.p=h.itemPR.p.slice(); h.itemNode.r=h.itemPR.r.slice(); } }

/* ---------- stuck in him ---------- */
function startStuck(h,E,bone,seg,chop){
  const Mb=E.M&&E.M[bone]; if(!Mb||!h.itemNode) return false; const key=h.item.key;
  const Mi=new Float32Array(itemM(h)),Zb=chop?v3.sc(norm3(colOf(Mi,1)),-1):norm3(colOf(Mi,2)),b=(BURY[key]||.05)*(chop?.6:1); Mi[12]+=Zb[0]*b; Mi[13]+=Zb[1]*b; Mi[14]+=Zb[2]*b; /* a stab goes in point-first, a chop edge-first */
  const L=m4.make(); m4.mul(L,rigidInv(Mb),Mi);
  h.stuck={E,bone,seg,L,work:0,prevC:mulP(h.M,FIST),t:0,wound:E.wounds[E.wounds.length-1]};
  E.impaled=(E.impaled||0)+1; E.stun=Math.max(E.stun,.9); h.prevPts=null; h.melQ=null;
  if(!E.dead){ faceHold(E,'shock',.4); vox(E,key==='machete'&&Math.random()<.5?'scream':'stabbed'); }
  sfx('stick'); buzz(h.hand,1,130); return true; }
function stuckWorld(S){ const M=S.E.M&&S.E.M[S.bone]; if(!M) return null; const o=m4.make(); m4.mul(o,M,S.L); return o; }
function stuckTick(h,dt){
  const S=h.stuck,E=S.E; S.t+=dt;
  const Mi=enemies.includes(E)?stuckWorld(S):null; if(!Mi){ unstick(h); return; }
  /* your hand stays on the handle */
  const hw=m4.make(); m4.mul(hw,Mi,rigidInv(h.itemL)); setLocal(h.node,m4.make(),hw); restoreItemNode(h); h.itemW=Mi;
  const handle=mulP(hw,FIST),ctrl=mulP(h.M,FIST),d=v3.sub(ctrl,handle),dl=Math.hypot(...d);
  /* ...and he is dragged around by it */
  const pull=v3.sc(d,Math.min(1,dl/.12)*3.2); for(const i of [S.seg[0],S.seg[1]]) kickV(E.B,i,v3.sc(pull,dt*60),H); kickV(E.B,PI_.chest,v3.sc(pull,dt*20),H);
  if(!E.dead) E.stun=Math.max(E.stun,.85);
  S.hz=(S.hz||0)-dt; if(S.hz<=0){ S.hz=.12; buzz(h.hand,.12+Math.min(.5,dl*2),18); } /* you feel it in there */
  /* working the blade: every bit of hand travel opens it more */
  S.work+=Math.hypot(...v3.sub(ctrl,S.prevC)); S.prevC=ctrl;
  if(S.work>.09){ S.work=0; if(S.wound) S.wound.rate=Math.min(S.wound.rate+.45,9); const n=norm3(v3.sub(handle,colOf(Mi,3)));
    spray(handle,v3.sc(colOf(Mi,2),-1),8,1.4,.7,'bright',.011); buzz(h.hand,.6,40); if(!E.dead){ E.blood-=1.2; if(!E.voxBusy||Math.random()<.4) vox(E,'agony'); faceHold(E,'agony',1); } }
  /* a hard pull rips it out */
  if(dl>.24){ const Zb=norm3(colOf(Mi,2)); spray(v3.sub(handle,v3.sc(Zb,-.15)),v3.sc(Zb,-1),36,2.6,.5,'bright',.013); spray(handle,v3.sc(Zb,-1),14,1.2,.8,'dark',.014);
    if(S.wound){ S.wound.rate=Math.min(S.wound.rate*1.5+.6,10); S.wound.art=S.wound.art||Math.random()<.35; } E.spurtT=.5;
    sfx('rip'); buzz(h.hand,1,90); if(!E.dead){ vox(E,'scream'); faceHold(E,'agony',1.5); } unstick(h); h.cd=.35; } }
function unstick(h){ const S=h.stuck; if(!S) return; h.stuck=null; S.E.impaled=Math.max(0,(S.E.impaled||0)-1); h.itemW=null; h.melQ=null; restoreItemNode(h); h.prevPts=null; }

/* ---------- left in him ---------- */
const EMB=[];
function leaveEmbedded(h){ const S=h.stuck; if(!S) return; const item=h.item; unstick(h); S.E.impaled=(S.E.impaled||0)+1;
  const n=N(world); GEO_TEMP=true; WPN[item.key].build(n); GEO_TEMP=false; EMB.push({E:S.E,bone:S.bone,seg:S.seg,L:S.L,item,node:n,wound:S.wound});
  equip(h,null); updateEmbedded(); sfx('swish',.3); }
function updateEmbedded(){ for(const e of EMB.slice()){ const Mw=enemies.includes(e.E)?stuckWorld(e):null; if(!Mw){ removeEmbedded(e); continue; } setLocal(e.node,m4.make(),Mw); e.handle=mulP(Mw,WPN[e.item.key].grip); } }
function removeEmbedded(e){ const i=EMB.indexOf(e); if(i>=0) EMB.splice(i,1); e.E.impaled=Math.max(0,(e.E.impaled||0)-1); disposeTree(e.node); const k=world.kids.indexOf(e.node); if(k>=0) world.kids.splice(k,1); }
function takeEmbedded(h,e){ const {E,bone,seg,L,item,wound}=e; removeEmbedded(e); equip(h,item); if(!XR.on||!h.itemNode) return;
  h.stuck={E,bone,seg,L,work:0,prevC:mulP(h.M,FIST),t:0,wound}; E.impaled=(E.impaled||0)+1; buzz(h.hand,.7,60); }
/* a thrown blade that lands point-first stays in him */
function embedThrown(P,E,bone,seg,p,dir){ const M=E.M&&E.M[bone]; if(!M) return false;
  const Z=dir,X=norm3(Math.abs(Z[1])>.9?[1,0,0]:v3.cross([0,1,0],Z)),Y=v3.cross(Z,X),w=WPN[P.item.key],tip=w.pts[0][2]*.55;
  const Mw=fromCols(X,Y,Z,v3.sub(p,v3.sc(Z,tip))),L=m4.make(); m4.mul(L,rigidInv(M),Mw);
  const n=N(world); GEO_TEMP=true; w.build(n); GEO_TEMP=false; EMB.push({E,bone,seg,L,item:P.item,node:n,wound:E.wounds[E.wounds.length-1]}); E.impaled=(E.impaled||0)+1;
  removePickup(P); updateEmbedded(); return true; }
function meleeClear(){ for(const h of [HANDS.L,HANDS.R]) unstick(h); for(const e of EMB.slice()) removeEmbedded(e); for(const s of SHELLS.slice()) removeShell(s); }

/* ---------- spent shells out of the shotgun ---------- */
const SHELLS=[]; const mShellRed=M(null,{color:0x8e1a14}),mShellBrass=M(null,{color:0xb08a3a});
function ejectShell(h,spent){ if(!h.itemNode) return; const Mi=itemM(h),p=mulP(Mi,[.03,.02,.04]),X=colOf(Mi,0),Y=colOf(Mi,1);
  if(SHELLS.length>14) removeShell(SHELLS[0]);
  const n=N(world); GEO_TEMP=true; const r=N(n); mk(box(.016,.016,.05),spent?M(null,{color:0x5a1410}):mShellRed,r); mk(box(.018,.018,.012),mShellBrass,r,0,0,-.03); GEO_TEMP=false;
  n.p=p; SHELLS.push({n,r,v:v3.add(v3.add(v3.sc(X,-rnd(1.4,2.2)),v3.sc(Y,rnd(1,1.6))),h.vel?v3.sc(h.vel,.5):[0,0,0]),spin:[rnd(-14,14),rnd(-14,14),rnd(-14,14)],age:0,rest:false}); }
function removeShell(s){ const i=SHELLS.indexOf(s); if(i>=0) SHELLS.splice(i,1); disposeTree(s.n); const k=world.kids.indexOf(s.n); if(k>=0) world.kids.splice(k,1); }
function updateShells(dt){ for(const s of SHELLS.slice()){ s.age+=dt; if(s.age>25){ removeShell(s); continue; } if(s.rest) continue;
  s.v[1]-=9.8*dt; for(let c=0;c<3;c++){ s.n.p[c]+=s.v[c]*dt; s.r.r[c]+=s.spin[c]*dt; }
  if(s.n.p[1]<.01){ s.n.p[1]=.01; if(Math.abs(s.v[1])<.8){ s.rest=true; s.r.r=[0,s.r.r[1],Math.PI/2]; } else { if(s.v[1]<-1.2) sfx('shellhit',.5); s.v=[s.v[0]*.45,-s.v[1]*.35,s.v[2]*.45]; s.spin=s.spin.map(v=>v*.5); } }
  const q=[s.n.p[0],s.n.p[2]]; pushOutXZ(q,.02,'body'); if(q[0]!==s.n.p[0]||q[1]!==s.n.p[2]){ s.n.p[0]=q[0]; s.n.p[2]=q[1]; s.v[0]*=-.3; s.v[2]*=-.3; } } }

/* ---------- the pump ---------- */
const PUMP_STROKE=.14; /* a full-length rack: about 14 cm back */
function pumpTick(h,slide){ const it=h.item,s=h.support;
  if(it.pumpSt!=='back'&&slide>PUMP_STROKE*.82){ it.pumpSt='back'; sfx('pumpback'); buzz(h.hand,.4,30); if(s) buzz(s.hand,.8,45);
    if(it.spent||it.chambered){ ejectShell(h,it.spent); if(it.chambered&&!it.spent) it.ammo=Math.max(0,it.ammo-1); it.spent=false; it.chambered=false; } } /* rack a live one and you throw it away, like a real pump */
  else if(it.pumpSt==='back'&&slide<.018){ it.pumpSt='in'; sfx('pumpfwd'); buzz(h.hand,.5,35); if(s) buzz(s.hand,.9,50); if(it.ammo>0&&!it.chambered) it.chambered=true; h.ammoShown=-9; } }
