/* =====================================================================
   GRABBING PEOPLE. The Raid is grappling as much as hitting.
   An empty hand gripping near a body takes hold of the nearest point: collar (neck), head, shoulder, wrist,
   elbow or ankle. That point then follows your hand, so you can pull, shove, drag, throw, or slam him into a wall.
   - Yank a weapon wrist hard and the weapon comes loose.
   - Take the neck from behind and hold on: a quiet choke, he goes limp in about three seconds.
   - Hold him in front of you and his friends' bullets hit him, if they fire at all.
   - Alive and not hurt enough, he fights it and breaks free after a few seconds.
   Flat screen (testing): G grabs or lets go with the left hand, Q throws what the left hand holds.
   ===================================================================== */
const GRAB_PTS=['neck','head','shL','shR','hdL','hdR','elL','elR','chest','anL','anR'];
const GRABS=[];
function grabTarget(p,maxD){ let best=null,bd=maxD;
  for(const E of enemies){ if(Math.hypot(E.B.x[0]-p[0],E.B.x[2]-p[2])>2) continue;
    for(const n of GRAB_PTS){ const i=PI_[n]; if(E.sevP[i]) continue; const q=X_(E.B,i),d=Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2])*(n==='neck'?.8:n==='chest'?1.15:1); if(d<bd){ bd=d; best={E,i,name:n}; } } }
  return best; }
function startGrab(h,g){ const E=g.E,q=X_(E.B,g.i);
  /* from behind: his back is to you */
  const fw=[Math.sin(E.hd),Math.cos(E.hd)],toMe=norm3([PL.x-q[0],0,PL.z-q[2]]),behind=fw[0]*toMe[0]+fw[1]*toMe[2]<-.25;
  const G={E,i:g.i,name:g.name,h,tgt:mulP(h.M,FIST),off:v3.sub(q,mulP(h.M,FIST)),t:0,choke:g.name==='neck'&&behind&&!E.dead,prevTgt:null};
  if(Math.hypot(...G.off)>.08) G.off=v3.sc(norm3(G.off),.08);
  GRABS.push(G); h.grab=G; E.grabbed=(E.grabbed||0)+1; sfx('grab'); if(XR.on) buzz(h.hand,.7,60);
  if(!E.dead){ if(!G.choke) setAware(E,'grab'); E.stun=Math.min(1,E.stun+.25); if(G.choke&&E.barkCd<1.5) bark(E,'—hhk— gk—',1.6); else if(E.barkCd<1.2) bark(E,pick(['Get off me—','Let go!','Hey— HEY—']),1.4); } }
function endGrab(G,throwV){ const i=GRABS.indexOf(G); if(i>=0) GRABS.splice(i,1); G.h.grab=null; const E=G.E; E.grabbed=Math.max(0,(E.grabbed||0)-1);
  if(throwV){ const sp=Math.hypot(...throwV); for(const n of [G.i,PI_.chest,PI_.neck,PI_.pelvis]) kickV(E.B,n,v3.sc(throwV,n===G.i?1:.6),H); if(sp>2.5){ E.slamT=1.5; E.stun=Math.min(1,E.stun+.3); } }
  E.slamT=Math.max(E.slamT||0,.8); }
/* pull each held point toward the hand, every physics step: the rest of the body follows through its joints */
function applyGrabs(h){ for(const G of GRABS){ const B=G.E.B,o=G.i*3,t=v3.add(G.tgt,G.off),x=B.x,p=B.p,k=G.E.dead?.5:.32;
  for(let c=0;c<3;c++){ const d=(t[c]-x[o+c])*k; x[o+c]+=d; p[o+c]+=d*.7; } } }
function updateGrabs(dt){
  for(const G of GRABS.slice()){ const E=G.E,h=G.h; G.t+=dt; const tgt=mulP(h.M,FIST);
    const hv=G.prevTgt?v3.sc(v3.sub(tgt,G.prevTgt),1/Math.max(dt,1e-3)):[0,0,0]; G.prevTgt=G.tgt=tgt;
    if(E.dead) continue;
    /* hands pulled far from the body (or the arm came off): lost him */
    if(Math.hypot(...v3.sub(X_(E.B,G.i),v3.add(tgt,G.off)))>.75){ endGrab(G); continue; }
    if(G.choke){ E.stun=1; E.silent=true; E.chokeT=(E.chokeT||0)+dt; if(E.chokeT>3&&E.st!=='down'){ toDown(E,true); E.knocked=true; E.koT=45; bark(E,'',0); } if(E.chokeT>9){ die(E); endGrab(G); } continue; } /* held on long after he went limp */
    /* yank the weapon wrist */
    if(E.wpnHeld&&G.name==='hd'+E.wpnHand&&Math.hypot(...hv)>2.2){ dropWeapon(E); sfx('punch',.6); if(E.barkCd<1.2) bark(E,'My— shit—',1.4); }
    /* he fights it */
    const fight=E.stun<.35&&E.cons>.5&&E.st==='alert'; if(fight) G.fightT=(G.fightT||0)+dt; else G.fightT=Math.max(0,(G.fightT||0)-dt);
    if(G.fightT>2.6+(G.name==='neck'?1:0)){ endGrab(G); for(const n of [PI_.chest,PI_.neck]) kickV(E.B,n,v3.sc(norm3([E.B.x[n*3]-PL.x,0,E.B.x[n*3+2]-PL.z]),1.5),H); if(XR.on) buzz(h.hand,1,80); bark(E,'GET OFF—',1.2); } }
  /* slams: anything held, thrown or kicked that hits a wall, the floor or furniture hard enough gets hurt */
  for(const E of enemies){ if(E.slamT>0) E.slamT-=dt; const B=E.B; if(!B.imp) continue;
    E.slamCd=(E.slamCd||0)-dt;
    if((E.grabbed||E.slamT>0)&&!E.dead&&E.slamCd<=0){ for(const [n,si] of [['head',0],['chest',2],['pelvis',3]]){ const i=PI_[n],v=B.imp[i]; if(v<3.2) continue;
      const q=X_(B,i),dir=B.impDir[i]; hitBlunt(E,SEGS[si],q,dir,n==='head'?'head':n==='chest'?'chest':'belly',{power:clamp((v-2.2)/2.6,.4,1.8)}); sfx('kick',.8);
      if(n==='head'&&v>4.5){ addDecal(DEC.splat,v3.add(q,v3.sc(dir,.08)),norm3(v3.sc(dir,-1)),.14,260); if(!E.cut.head) addWound(E,SEGS[0],q,dir,{rate:.6,art:false,part:'head'}); }
      E.slamCd=.35; break; } }
    B.imp.fill(0); } }
/* is a body in the way of a shot from a to b? (shields, friends in the line of fire) */
function bodyInLine(a,b,skip){ const d=v3.sub(b,a),L=Math.hypot(...d); if(L<1e-3) return null; const dir=v3.sc(d,1/L); let best=null;
  for(const E of enemies){ if(E===skip) continue; for(let si=0;si<SEGS.length;si++){ if(E.segOff.has(si)) continue; const sg=SEGS[si],hh=raySeg(a,dir,X_(E.B,sg[0]),X_(E.B,sg[1]),sg[2]); if(hh&&hh.t<L-.2&&(!best||hh.t<best.t)) best={t:hh.t,E,seg:sg,p:v3.add(a,v3.sc(dir,hh.t)),dir}; } }
  return best; }
/* grip with an empty hand: weapon support first, then a body, then things lying around */
function tryGrabBody(h){ const p=mulP(h.M,FIST),g=grabTarget(p,.16); if(!g) return false; startGrab(h,g); return true; }
function flatGrab(){ const h=HANDS.L; if(h.grab){ endGrab(h.grab); return; } const {f,eye}=camBasis(); let best=null,bd=1.25;
  for(const E of enemies) for(const n of GRAB_PTS){ const i=PI_[n]; if(E.sevP[i]) continue; const q=X_(E.B,i),w=v3.sub(q,eye),t=v3.dot(w,f); if(t<.2||t>1.25) continue; const off=Math.hypot(...v3.sub(w,v3.sc(f,t))); const sc=t+off*3*(n==='neck'?.7:1); if(off<.3&&sc<bd){ bd=sc; best={E,i,name:n}; } }
  if(best){ if(h.item) equip(h,null); startGrab(h,best); } else sfx('swish',.4); }
