/* =====================================================================
   PROTOTYPE 01: physical people
   Every enemy is a particle ragdoll (verlet, 18 points, distance + hinge limits) driven by muscles that pull
   it toward an animated pose. Standing = strong muscles anchored in the world. Hurt = weaker, relative to the
   body. Dead = no muscles. Damage is per body part: legs drop them, arms go limp, arteries spurt with the heartbeat.
   ===================================================================== */
const state={ps1:true,res:720,snap:true,affine:true,dither:true};
const XR={laser:false,wobble:0,on:false,session:null,space:null,origin:[0,0,3.2],yaw:0,head:null,hands:{},flash:0,snapHeld:false,btn:{},clearT:0,knifeTip:null,stabCd:0,res:1680,toast:'',toastT:0,resetHold:0,panelP:null};

const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.random()*a.length|0];

/* ---------- 3x3 rotations as [X,Y,Z] columns ---------- */
const I3=()=>[[1,0,0],[0,1,0],[0,0,1]];
const mv=(R,v)=>[R[0][0]*v[0]+R[1][0]*v[1]+R[2][0]*v[2],R[0][1]*v[0]+R[1][1]*v[1]+R[2][1]*v[2],R[0][2]*v[0]+R[1][2]*v[1]+R[2][2]*v[2]];
const mtv=(R,v)=>[v3.dot(R[0],v),v3.dot(R[1],v),v3.dot(R[2],v)];
const mm=(A,B)=>[mv(A,B[0]),mv(A,B[1]),mv(A,B[2])];
const mtm=(A,B)=>[mtv(A,B[0]),mtv(A,B[1]),mtv(A,B[2])];
function eul(R){ const X=R[0],Y=R[1],Z=R[2]; return [Math.atan2(-Z[1],Z[2]),Math.asin(clamp(Z[0],-1,1)),Math.atan2(-Y[0],X[0])]; }
function rodr(v,k,c,s){ const kv=v3.dot(k,v),kx=v3.cross(k,v); return [v[0]*c+kx[0]*s+k[0]*kv*(1-c),v[1]*c+kx[1]*s+k[1]*kv*(1-c),v[2]*c+kx[2]*s+k[2]*kv*(1-c)]; }
function fromTo(a,b){ let ax=v3.cross(a,b),s=Math.hypot(ax[0],ax[1],ax[2]),c=v3.dot(a,b);
  if(s<1e-6){ if(c>0) return I3(); const k=norm3(Math.abs(a[0])<.9?v3.cross(a,[1,0,0]):v3.cross(a,[0,1,0])); return [rodr([1,0,0],k,-1,0),rodr([0,1,0],k,-1,0),rodr([0,0,1],k,-1,0)]; }
  const k=v3.sc(ax,1/s); return [rodr([1,0,0],k,c,s),rodr([0,1,0],k,c,s),rodr([0,0,1],k,c,s)]; }
const swing=(P,bd,d)=>mm(fromTo(norm3(mv(P,bd)),d),P);
function frameFrom(xL,xR,base,up){ const X=norm3(v3.sub(xL,xR)); let Y=v3.sub(up,base); Y=norm3(v3.sub(Y,v3.sc(X,v3.dot(Y,X)))); return [X,Y,v3.cross(X,Y)]; }
const ryM=a=>[[Math.cos(a),0,-Math.sin(a)],[0,1,0],[Math.sin(a),0,Math.cos(a)]];
const dist2=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]);
function fkMats(J){ const M={};
  for(const b of BONES){ const n=J[b],l=m4.make(); m4.compose(l,n.p,n.r,n.s); const par=BONE_PARENT[b]; if(par){ const o=m4.make(); m4.mul(o,M[par],l); M[b]=o; } else M[b]=l; } return M; }

/* ---------- textures for gore ---------- */
function blobTex(w,h,seed,fn){ return tex(w,h,null,g=>fn(g,rng(seed))); }
function paintBlob(g,r,cx,cy,rad,cIn,cOut){ for(let y=Math.floor(cy-rad-2);y<cy+rad+2;y++) for(let x=Math.floor(cx-rad-2);x<cx+rad+2;x++){ const d=Math.hypot(x+.5-cx,y+.5-cy)/rad*(.85+.3*r()); if(d<1) R(g,d<.55?cIn:cOut,x,y,1,1); } }
const tSplat=blobTex(32,32,901,(g,r)=>{ paintBlob(g,r,16,16,7,'#3e0404','#5c0707'); for(let i=0;i<9;i++){ const a=r()*6.28,d=8+r()*7; paintBlob(g,r,16+Math.cos(a)*d,16+Math.sin(a)*d,1+r()*2.4,'#3e0404','#560606'); } for(let i=0;i<5;i++){ const a=r()*6.28; for(let k=5;k<14;k++) if(r()<.8) R(g,'#4e0505',16+Math.cos(a)*k|0,16+Math.sin(a)*k|0,1,1); } });
const tPoolB=blobTex(32,32,902,(g,r)=>{ for(let y=0;y<32;y++) for(let x=0;x<32;x++){ const d=Math.hypot((x-15.5)/15,(y-15.5)/14)*(1+.12*Math.sin(Math.atan2(y-16,x-16)*5+r())); if(d<1) R(g,d<.75?(((x+y)&3)?'#2a0202':'#320303'):'#3e0404',x,y,1,1); } for(let i=0;i<5;i++) R(g,'#5a1010',6+r()*20|0,6+r()*20|0,2,1); });
const tHole=blobTex(16,16,903,(g,r)=>{ paintBlob(g,r,8,8,4.5,'#1c1a18','#2e2a26'); paintBlob(g,r,8,8,2,'#050505','#0a0908'); for(let i=0;i<6;i++){ const a=r()*6.28; for(let k=3;k<7;k++) R(g,'#141210',8+Math.cos(a)*k|0,8+Math.sin(a)*k|0,1,1); } });
function woundTex(seed,slit){ return blobTex(16,32,seed,(g,r)=>{ const cy=7;
  for(const x of [6,8,10]) { let len=10+r()*14|0; for(let y=cy+2;y<cy+len;y++) R(g,y>cy+len-3?'#5a0707':'#3e0404',x+((y>cy+9)&&r()<.2?1:0),y,x===8?2:1,1); }
  if(slit){ R(g,'#4e0505',2,cy-2,12,5); R(g,'#160101',3,cy-1,10,2); R(g,'#2a0202',4,cy+1,8,1); }
  else { paintBlob(g,r,8,cy,4.6,'#4a0505','#5c0808'); paintBlob(g,r,8,cy,2.3,'#0e0101','#1e0202'); } }); }
const tWound=woundTex(904,false), tStab=woundTex(905,true);
const mWound=M(tWound,{cut:true,double:true}), mStab=M(tStab,{cut:true,double:true});
const tStump=blobTex(16,16,906,(g,r)=>{ paintBlob(g,r,8,8,7.6,'#7a0c0c','#3a0303'); for(let i=0;i<14;i++) R(g,r()<.5?'#a51a1a':'#5a0808',2+r()*12|0,2+r()*12|0,1,1); paintBlob(g,r,8.5,7.5,2.2,'#d8d0bc','#b8ae98'); R(g,'#8a7f6a',8,8,1,1); });
const mStump=M(tStump,{cut:true,double:true});
/* dismemberment: what comes off, which links break, which bones go with it */
const CUTS={
  armL:{piece:['elL','hdL'],pairs:[['shL','elL']],bones:['armL','elbowL','handL'],keep:'piece',stump:'spine',side:1},
  armR:{piece:['elR','hdR'],pairs:[['shR','elR']],bones:['armR','elbowR','handR'],keep:'piece',stump:'spine',side:-1},
  legL:{piece:['knL','anL','toeL'],pairs:[['hipL','knL']],bones:['thighL','kneeL','ankleL'],keep:'piece',stump:'hips',side:1},
  legR:{piece:['knR','anR','toeR'],pairs:[['hipR','knR']],bones:['thighR','kneeR','ankleR'],keep:'piece',stump:'hips',side:-1},
  head:{piece:['head'],pairs:[['neck','head'],['head','shL'],['head','shR'],['head','chest']],bones:['head'],keep:'body',stump:'neck',side:0} };

/* ---------- physical body ---------- */
const PD=[['pelvis','hips',o=>[0,0,0],.12,'core'],['hipL','thighL',o=>[0,0,0],.085,'legL'],['hipR','thighR',o=>[0,0,0],.085,'legR'],
  ['chest','spine',o=>[0,o.torso*.5,0],.15,'core'],['neck','neck',o=>[0,0,0],.07,'core'],['shL','armL',o=>[0,0,0],.07,'armL'],['shR','armR',o=>[0,0,0],.07,'armR'],
  ['head','head',o=>[0,.115,0],.11,'core'],['elL','elbowL',o=>[0,0,0],.05,'armL'],['elR','elbowR',o=>[0,0,0],.05,'armR'],['hdL','handL',o=>[0,0,0],.05,'armL'],['hdR','handR',o=>[0,0,0],.05,'armR'],
  ['knL','kneeL',o=>[0,0,0],.06,'legL'],['knR','kneeR',o=>[0,0,0],.06,'legR'],['anL','ankleL',o=>[0,0,0],.05,'legL'],['anR','ankleR',o=>[0,0,0],.05,'legR'],
  ['toeL','ankleL',o=>[0,-o.foot+.03,o.shoeL*.55],.04,'legL'],['toeR','ankleR',o=>[0,-o.foot+.03,o.shoeL*.55],.04,'legR']];
const PI_={}; PD.forEach((d,i)=>PI_[d[0]]=i);
const NP=PD.length;
/* hit capsules: a, b, radius, part, bone for the wound decal */
const SEGS=[['head','head',.115,'head','head'],['neck','head',.065,'neck','neck'],['chest','neck',.16,'chest','spine'],['pelvis','chest',.15,'belly','spine'],
  ['hipL','knL',.08,'thighL','thighL'],['knL','anL',.06,'shinL','kneeL'],['anL','toeL',.05,'footL','ankleL'],['hipR','knR',.08,'thighR','thighR'],['knR','anR',.06,'shinR','kneeR'],['anR','toeR',.05,'footR','ankleR'],
  ['shL','elL',.06,'uarmL','armL'],['elL','hdL',.05,'farmL','elbowL'],['shR','elR',.06,'uarmR','armR'],['elR','hdR',.05,'farmR','elbowR']].map(s=>[PI_[s[0]],PI_[s[1]],s[2],s[3],s[4]]);
function posePts(J,o,M){ return PD.map(d=>mulP(M[d[1]],d[2](o))); }
function buildBody(E){
  const J=E.J,o=E.o,saved=JOINTS.map(k=>J[k].r.slice()),hp=J.hips.p.slice();
  for(const k of JOINTS) J[k].r=[0,0,0]; J.hips.p=[0,E.C.hy0,0];
  const bind=posePts(J,o,fkMats(J));
  JOINTS.forEach((k,i)=>J[k].r=saved[i]); J.hips.p=hp;
  const d=(a,b)=>norm3(v3.sub(bind[PI_[b]],bind[PI_[a]]));
  const bdir={neck:d('neck','head')}; for(const s of ['L','R']){ bdir['arm'+s]=d('sh'+s,'el'+s); bdir['fore'+s]=d('el'+s,'hd'+s); bdir['thigh'+s]=d('hip'+s,'kn'+s); bdir['shin'+s]=d('kn'+s,'an'+s); bdir['foot'+s]=d('an'+s,'toe'+s); }
  const cons=[],add=(a,b,st=1)=>{ const i=PI_[a],j=PI_[b]; cons.push(i,j,Math.hypot(...v3.sub(bind[i],bind[j])),st); };
  const low=['pelvis','hipL','hipR'],up=['chest','neck','shL','shR'];
  for(let i=0;i<3;i++) for(let j=i+1;j<3;j++) add(low[i],low[j]);
  for(let i=0;i<4;i++) for(let j=i+1;j<4;j++) add(up[i],up[j]);
  for(const a of low) for(const b of up) add(a,b,.3);
  add('pelvis','chest',.9); add('neck','head'); add('head','shL',.2); add('head','shR',.2); add('head','chest',.15);
  for(const s of ['L','R']){ add('sh'+s,'el'+s); add('el'+s,'hd'+s); add('hip'+s,'kn'+s); add('kn'+s,'an'+s); add('an'+s,'toe'+s); add('kn'+s,'toe'+s,.7); }
  E.B={x:new Float32Array(NP*3),p:new Float32Array(NP*3),bind,bdir,cons:new Float32Array(cons),r:PD.map(d=>d[3]),ground:new Uint8Array(NP)};
  E.Lc=new Float32Array(NP*3); E.Wt=new Float32Array(NP*3); E.K=new Float32Array(NP); E.KD=new Float32Array(NP);
}
const X_=(B,i)=>[B.x[i*3],B.x[i*3+1],B.x[i*3+2]];
function setX(B,i,v){ B.x[i*3]=v[0]; B.x[i*3+1]=v[1]; B.x[i*3+2]=v[2]; }
function kickV(B,i,v,h){ for(let c=0;c<3;c++) B.p[i*3+c]-=v[c]*h; B.wake=1; }
const H=1/240;
/* tuning for bodies on the floor (see the stepBody/targetsFor comments) */
const PHYS={k:.016,cr:.0011,kd:.02,kdDown:.1,fric:.82,wr:1}; /* on the floor: softer muscles, a lower force cap and much more damping, so a hurt man moves like a heavy body instead of buzzing */

/* ---------- enemies ---------- */
const RANGED={gunman:1,doorman:1,enforcer:1,landlord:1};
/* how each kind fights. Guns: keep = distance he likes, dmg per hit, acc = chance a shot lands at mid range */
const KSTAT={corner:{melee:11,run:3.1},cutter:{melee:17,run:3.4},
  gunman:{keep:3.6,cd:[1.8,2.6],dmg:10,acc:.3,range:9},
  doorman:{keep:2.6,cd:[2.1,2.9],dmg:34,acc:.6,range:7,shotgun:true},
  enforcer:{keep:4.4,cd:[1.5,2.2],dmg:7,acc:.17,range:11,burst:5},
  landlord:{keep:5,cd:[1.3,1.9],dmg:24,acc:.42,range:13,tough:.6}};
const armed=E=>E.wpnHeld&&RANGED[E.kind];
const DMG={ head:{gun:{kill:1},knife:{bleed:2.6,stun:1,art:.3}},
  neck:{gun:{bleed:6,art:1,stun:.8},knife:{bleed:8,art:1,stun:1}},
  chest:{gun:{bleed:2.4,stun:.7,art:.15},knife:{bleed:3.4,stun:.8,art:.3}},
  belly:{gun:{bleed:2.0,stun:.6},knife:{bleed:3.1,stun:.75,art:.15}},
  thigh:{gun:{bleed:1.4,leg:.8,stun:.5,art:.45},knife:{bleed:2.1,leg:.6,stun:.6,art:.6}},
  shin:{gun:{bleed:.9,leg:.8,stun:.45},knife:{bleed:1.3,leg:.55,stun:.45}},
  foot:{gun:{bleed:.5,leg:.6,stun:.35},knife:{bleed:.6,leg:.4,stun:.3}},
  uarm:{gun:{bleed:1.1,arm:.6,stun:.35,art:.25},knife:{bleed:1.6,arm:.5,stun:.35,art:.3}},
  farm:{gun:{bleed:.8,arm:.65,stun:.3},knife:{bleed:1.2,arm:.45,stun:.3}} };
const LINES={
  alert:['Who the fuck—','Hey! HEY!','It\'s the cop!','He\'s still alive!','Get him!'],
  leg:['My leg! My leg!','Ahh— I can\'t stand—','Fuck— my knee—'],
  torso:['I\'m hit— I\'m hit!','Wait— wait!','Ahh— fuck—'],
  arm:['Agh! My arm!','My hand— I can\'t feel—'],
  neck:['*choking*','*gurgling*','—hhk—'],
  stab:['Hnn—!','No— no—','Get it out— get it out—'],
  beg:['Please. Please, man.','I\'m done, I\'m done!','Don\'t. Don\'t do this.','I didn\'t do nothing to you—','I just live here, man—'],
  crawl:['Somebody... help...','Don\'t— stay back—','I can\'t feel my legs—'],
  dying:['...cold... so cold...','Mom...','I don\'t wanna die...','...it\'s dark...'],
  friend:n=>[`${n}!`,`${n}! Get up!`,`You killed ${n}!`],
  call:n=>[`${n}! ${n}, help me!`,`${n}... please...`] };
const SPAWNS=[
  {maker:makeCorner,name:'Dani',x:-1.5,z:-2.3,hd:Math.PI*1.05,extra:'I got a daughter—'},
  {maker:makeCutter,name:'Marco',x:1.5,z:-2.6,hd:Math.PI*.8,extra:'I owe him— I owe him money, that\'s all—'},
  {maker:makeGunman,name:'Teo',x:2.8,z:-.1,hd:Math.PI*.55,extra:'I just moved in, man!'} ];
let enemies=[];
function spawnEnemy(sp){
  const holder=N(world); GEO_TEMP=true; const C=sp.maker(holder,'game'); GEO_TEMP=false; const kind=sp.kind||C.kind, wkey=sp.wkey||KIND_WPN[kind];
  C.pool.vis=false; C.blood.vis=false; if(C.dropped) C.dropped.vis=false;
  if(C.wpn&&RANGED[kind]){ GEO_TEMP=true; addSights(C.wpn,wkey); GEO_TEMP=false; } /* same sights as yours */
  /* long guns: the art-test hold is low-ready (barrel down). In a fight they bring it up level, so re-solve both arms to a level gun */
  /* standing about, the long gun hangs in his right hand by his side, muzzle at the floor. Fighting, it's shouldered and level:
     solved once here, and every frame both hands are put back on it (holdLongGun), so it never floats in front of him */
  let lowW=null,upW=null,lowJ=null;
  if(C.twoHand&&GUNS[C.gun]){ const G=GUNS[C.gun],d0=G.dir,arms=['armL','armR','elbowL','elbowR','handL','handR'];
    lowW={p:C.wpn.p.slice(),r:C.wpn.r.slice()};
    G.dir=C.gun==='shotgun'?[.16,-.03,.987]:[.12,0,.993]; applyPose(C,'fight'); upW={p:C.wpn.p.slice(),r:C.wpn.r.slice()}; G.dir=d0; }
  const J=C.J; J.root.p=[0,0,0]; J.root.r=[0,0,0];
  const E={C,J,o:C.o,holder,name:sp.name,extra:sp.extra,kind,wkey,crew:sp.crew||C.kind,lines:sp.lines||LINES,boss:!!sp.boss,tough:sp.tough||0,seated:!!sp.seated,st:'idle',aware:false,pos:[sp.x,sp.z],hd:sp.hd,hp:{legL:1,legR:1,armL:1,armR:1},
    blood:100,wounds:[],dead:false,headshot:false,stun:0,rise:1,knocked:false,lowT:0,downT:0,walkPh:0,walkAmt:0,atkT:-1,atkCd:rnd(1.2,2.2),
    cut:{},sev:{armL:0,armR:0,legL:0,legR:0,head:0},sevP:new Uint8Array(NP),segOff:new Set(),Rcut:{},barkT:0,barkCd:0,face:'',wpnHeld:!!C.wpn&&!!wkey,wpnHand:'R',heartPh:0,spurtT:0,deadT:0,t0:Math.random()*9,pools:[],lookYaw:0,silent:false,cons:1,downMode:'',hitT:0};
  E.fightJ={}; for(const k of JOINTS) E.fightJ[k]=J[k].r.slice(); E.fightY=J.hips.p[1]; E.gunLow=lowW; E.gunUp=upW; E.aimK=0; E.carry='up';
  E.fightJL={}; for(const k of JOINTS){ const m=k.endsWith('L')?k.slice(0,-1)+'R':k.endsWith('R')?k.slice(0,-1)+'L':k,r=E.fightJ[m]; E.fightJL[k]=[r[0],-r[1],-r[2]]; }
  buildBody(E);
  const el=document.createElement('div'); el.className='bark'; el.hidden=true; $('labels').append(el); E.barkEl=el;
  /* start in the idle pose, already standing where it spawned */
  targetsFor(E,0); for(let i=0;i<NP;i++) for(let c=0;c<3;c++) E.B.x[i*3+c]=E.B.p[i*3+c]=E.Wt[i*3+c];
  return E;
}

/* pose library: joint rotations by name (world-anchored poses use hipsY) */
function setPose(E,name,t){
  const J=E.J,C=E.C; let c=E.cons; for(const k of JOINTS) J[k].r=[0,0,0];
  let hy=C.hy0,j={},rel=false;
  const s=Math.sin,ph=t+E.t0;
  switch(name){
    case 'fight': j=E.wpnHeld&&E.wpnHand==='L'?E.fightJL:E.fightJ; hy=E.fightY; break;
    case 'idle': if(E.seated&&C.poses.sit){ j=C.poses.sit.j; hy=C.poses.sit.hipsY; break; } j=C.poses.idle.j; break;
    case 'beg': j=C.poses.beg.j; hy=C.poses.beg.hipsY; break;
    case 'kneel': j=Object.assign({},C.poses.beg.j,{spine:[.5,0,.08],neck:[.15,0,0],head:[.25,0,0],armL:[-.3,0,.2],elbowL:[-1.4,0,0],armR:[-.3,0,-.2],elbowR:[-1.4,0,0]}); hy=C.poses.beg.hipsY; break;
    case 'writhe': rel=true; c*=PHYS.wr; j={spine:[.35+.18*s(ph*.9)*c,0,.25*s(ph*.6)*c],neck:[.2,0,0],head:[.25,.4*s(ph*.5)*c,0],
      thighL:[-.9-.45*s(ph*1.1)*c,0,.1],kneeL:[1.3+.35*s(ph*1.3)*c,0,0],thighR:[-.6-.55*s(ph*.8+1)*c,0,-.1],kneeR:[1.1+.45*s(ph*.9+2)*c,0,0],
      armL:[-.6,0,.4],elbowL:[-1.4,0,0],armR:[-.6,0,-.4],elbowR:[-1.4,0,0]}; break;
    case 'downbeg': rel=true; j={spine:[.3,0,0],neck:[.1,0,0],head:[-.2,0,0],thighL:[-.9,0,.15],kneeL:[1.4,0,0],thighR:[-.4,0,-.1],kneeR:[.9,0,0],
      armL:[-1.7+.05*s(ph*5),.2,.3],elbowL:[-.5,0,0],armR:[-1.1,0,-.3],elbowR:[-1.2,0,0]}; break;
    case 'crawl': { rel=true; const k=s(ph*2.4); j={spine:[-.15,0,.1*k],neck:[-.3,0,0],head:[-.45,0,0],armL:[-2.5+.75*k,0,.3],elbowL:[-.3-.7*Math.max(0,-k),0,0],armR:[-2.5-.75*k,0,-.3],elbowR:[-.3-.7*Math.max(0,k),0,0],
      thighL:[.1,0,.1],kneeL:[.25+.5*Math.max(0,k),0,0],thighR:[.1,0,-.1],kneeR:[.25+.5*Math.max(0,-k),0,0]}; break; }
    case 'scoot': { rel=true; const k=s(ph*2.6); j={spine:[.35,0,0],neck:[.3,0,0],head:[.35,0,0],armL:[.55,0,.45],elbowL:[-1.5,0,0],armR:[.55,0,-.45],elbowR:[-1.5,0,0],
      thighL:[-.7-.45*k,0,.12],kneeL:[1.2+.5*k,0,0],thighR:[-.7+.45*k,0,-.12],kneeR:[1.2-.5*k,0,0]}; break; }
  }
  for(const k in j) J[k].r=j[k].slice();
  J.hips.p=[0,hy,0]; J.hips.r=[0,0,0];
  return rel;
}
function clutch(E,M){ /* a free hand pressed on the worst wound, solved in pose space */
  const w=E.wounds.find(x=>x.part==='neck'&&!x.piece)||E.wounds.filter(x=>!x.piece).reduce((a,b)=>!a||b.rate>a.rate?b:a,null); if(!w) return false;
  const p=mulP(M[w.bone],w.lp),n=norm3(mv(rotOf(M[w.bone]),w.ln)),tgt=v3.add(p,v3.sc(n,.06));
  const sides=w.part==='neck'?['L','R']:[E.hp.armL>=E.hp.armR?'L':'R'];
  for(const s of sides){ if(E.hp['arm'+s]<.35) continue; if(s===E.wpnHand&&E.wpnHeld) continue; ikArm(E.J,s,v3.add(tgt,w.part==='neck'?[s==='L'?.045:-.045,-.015,-.01]:[s==='L'?.02:-.02,0,0])); }
  return true;
}
const rotOf=m=>[[m[0],m[1],m[2]],[m[4],m[5],m[6]],[m[8],m[9],m[10]]];

function targetsFor(E,t,dt=1){
  const J=E.J,B=E.B; let pose='idle';
  const st=E.st;
  const throat=!E.dead&&E.wounds.some(w=>w.part==='neck'&&!w.piece); /* a man holding his throat shut doesn't beg */
  if(st==='idle'||(st==='alert'&&E.seated)) pose='idle'; else if(st==='alert') pose='fight';
  else if(st==='kneel') pose=E.near&&!throat?'beg':'kneel';
  else if(st==='down'){ pose=E.fallT>0?'kneel':E.downMode||'writhe'; }
  else pose='writhe';
  const rel=setPose(E,pose,t);
  /* walking legs and attack swings, layered over the pose */
  if(st==='alert'&&E.walkAmt>.01){ const a=E.walkAmt,ph=E.walkPh,rn=E.runAmt||0,sw=.5+.4*rn;
    J.thighL.r[0]+=-Math.sin(ph)*sw*a-.15*rn; J.thighR.r[0]+=Math.sin(ph)*sw*a-.15*rn; J.kneeL.r[0]+=(.15+.25*rn+(.65+.75*rn)*Math.max(0,-Math.cos(ph)))*a; J.kneeR.r[0]+=(.15+.25*rn+(.65+.75*rn)*Math.max(0,Math.cos(ph)))*a;
    /* the free arm pumps; the weapon arm keeps the weapon up */
    for(const s of ['L','R']){ if(E.wpnHeld&&(E.wpnHand===s||RANGED[E.kind])||E.hp['arm'+s]<.45) continue; const sg=s==='L'?1:-1; J['arm'+s].r=[(s==='L'?1:-1)*0+Math.sin(ph)*sg*(.25+.45*rn)*a-.1*rn,0,(s==='L'?.12:-.12)]; if(rn>.05) J['elbow'+s].r=[lerp(-.4,-1.3,rn),0,0]; }
    if(rn>.05){ J.spine.r[0]+=.25*rn; J.hips.p[1]-=.04*rn; } }
  if(st==='alert'&&E.atkT>=0&&!RANGED[E.kind]){ const k=E.atkT; const wind=Math.min(1,k/.35),strike=clamp((k-.35)/.18,0,1);
    const h=E.wpnHand,sg=h==='R'?1:-1,A=J['arm'+h],El=J['elbow'+h],base=(h==='R'?E.fightJ:E.fightJL)['arm'+h][0];
    if(E.kind==='cutter'){ A.r=[lerp(lerp(base,-2.9,wind),-.5,strike),0,.25*sg]; El.r=[lerp(-1.2,-.2,strike),0,0]; J.spine.r[0]=lerp(-.1,.35,strike); }
    else { A.r=[lerp(lerp(base,-.6,wind),-1.55,strike),0,lerp(.4,.05,strike)*sg]; El.r=[lerp(-1.9,-.15,strike),0,0]; J.spine.r[1]=lerp(.35,-.3,strike)*sg; } }
  if(st==='alert') for(const s of ['L','R']) if(E.hp['arm'+s]<.45&&!(E.wpnHeld&&E.wpnHand===s)){ J['arm'+s].r=[.15,0,s==='L'?.12:-.12]; J['elbow'+s].r=[-.35,0,0]; }
  if(st==='alert'&&E.wpnHeld&&!E.oneHand&&E.aimPit) J.spine.r[0]-=E.aimPit;
  if(st==='alert'&&E.wpnHeld&&E.oneHand&&RANGED[E.kind]){ /* one-handed: the good arm reaches out toward you, pistol style, instead of a mirrored two-hand pose */
    const s=E.wpnHand,M0=fkMats(J),sh=mulP(M0['arm'+s],[0,0,0]),pt=mtv(ryM(E.hd),[PL.x-E.pos[0],1.42,PL.z-E.pos[1]]),a=norm3(v3.sub(pt,sh));
    ikArm(J,s,v3.add(sh,v3.add(v3.sc(a,.5),[s==='L'?-.05:.05,-.03,0]))); }
  if(st==='idle'){ J.spine.r[0]+=Math.sin(t*1.5+E.t0)*.02; J.head.r[1]+=Math.sin(t*.4+E.t0)*.3; }
  if(throat&&(st==='kneel'||st==='down'&&pose!=='crawl'&&pose!=='scoot')){ J.neck.r=[.5,0,0]; J.head.r=[.35,0,0]; J.spine.r[0]=Math.max(J.spine.r[0],.45); }
  let M=fkMats(J);
  E.handRot={L:J.handL.r.slice(),R:J.handR.r.slice()};
  if(!E.dead&&E.wounds.length&&(st==='kneel'&&(!E.near||throat)||throat&&st==='down'||st==='down'&&(pose==='writhe'||pose==='downbeg'))){ if(clutch(E,M)) M=fkMats(J); }
  const P=posePts(J,E.o,M);
  const Hp=frameFrom(P[PI_.hipL],P[PI_.hipR],P[PI_.pelvis],P[PI_.chest]),pel=P[PI_.pelvis],Ry=ryM(E.hd);
  /* poses blend over a few frames instead of snapping, so switching from writhing to crawling doesn't flip the body */
  const kb=Math.min(1,dt*(E.st==='down'?3:7)),kw=Math.min(1,dt*9);
  for(let i=0;i<NP;i++){ const l=mtv(Hp,v3.sub(P[i],pel)),w=v3.add([E.pos[0],0,E.pos[1]],mv(Ry,P[i])),o=i*3;
    for(let c=0;c<3;c++){ E.Lc[o+c]=lerp(E.Lc[o+c],l[c],kb); E.Wt[o+c]=lerp(E.Wt[o+c],w[c],kw); } }
  /* muscles */
  const c=E.cons,legs=Math.min(E.hp.legL,E.hp.legR);
  let sup=0; if(!E.dead&&(st==='idle'||st==='alert')) sup=1; else if(!E.dead&&st==='kneel') sup=.95; else if(!E.dead&&st==='down'&&E.fallT>0) sup=.85*E.fallT/.8;
  if(rel) sup=0;
  sup*=clamp(c*1.7,0,1)*(1-(st==='down'?Math.min(E.stun,.5):E.stun))*E.rise*(E.grabbed?.35:1); E.sup=sup; /* held: off balance */
  const twitch=E.dead?.008*Math.max(0,1-E.deadT/1.2):0;
  for(let i=0;i<NP;i++){ const limb=PD[i][4]; let s=E.dead?twitch:c;
    if(!E.dead){ if(limb==='legL') s*=.2+.8*E.hp.legL; else if(limb==='legR') s*=.2+.8*E.hp.legR; else if(limb==='armL') s*=.12+.88*clamp(E.hp.armL,0,1); else if(limb==='armR') s*=.12+.88*clamp(E.hp.armR,0,1); }
    E.K[i]=E.sevP[i]?0:(sup*.13+(1-sup)*PHYS.k)*s; E.KD[i]=E.sevP[i]?0:(sup>.5?PHYS.kd:PHYS.kdDown)*s+.002; }
  E.relMode=rel;
}

/* ---------- physics ---------- */
function stepBody(E,h){
  const B=E.B,x=B.x,p=B.p,g=9.8*h*h;
  for(let i=0;i<NP*3;i+=3){ for(let c=0;c<3;c++){ const v=(x[i+c]-p[i+c])*.9985; p[i+c]=x[i+c]; x[i+c]+=v; } x[i+1]-=g; }
  /* muscles: blend of a world-anchored puppet (standing) and a pose held relative to the pelvis (hurt, on the ground).
     The relative part is internal force only: its net push is removed, so a body on the floor can curl up and kick but can't lift itself off it. */
  const s=E.sup; let Ha=null,pel=null;
  if(s<.999){ Ha=frameFrom(X_(B,PI_.hipL),X_(B,PI_.hipR),X_(B,PI_.pelvis),X_(B,PI_.chest)); pel=X_(B,PI_.pelvis); }
  /* particles of a blown-off limb are pinned inside the stump: they must not count, or the body's own muscles stop cancelling out and it floats away */
  const PN=E.pinM,na=NP-(E.pinN||0);
  const CR=E.CR||(E.CR=new Float32Array(NP*3)); let sx=0,sy=0,sz=0,vx=0,vy=0,vz=0;
  for(let i=0;i<NP;i++){ const k=E.K[i],o=i*3; CR[o]=CR[o+1]=CR[o+2]=0; if(PN&&PN[i]) continue; vx+=x[o]-p[o]; vy+=x[o+1]-p[o+1]; vz+=x[o+2]-p[o+2]; if(k<=0) continue;
    if(s>0) for(let c=0;c<3;c++) x[o+c]+=(E.Wt[o+c]-x[o+c])*k*s;
    if(Ha){ const r=v3.add(pel,mv(Ha,[E.Lc[o],E.Lc[o+1],E.Lc[o+2]])); r[1]=Math.max(r[1],B.r[i]+.004); /* never ask a limb to go through the floor: that would push the body up forever */
      for(let c=0;c<3;c++){ CR[o+c]=clamp((r[c]-x[o+c])*k*(1-s),-PHYS.cr,PHYS.cr); }
      if(B.ground[i]&&CR[o+1]<0) CR[o+1]=0; /* the floor would cancel a push into it; counting it would launch the rest of the body */
      sx+=CR[o]; sy+=CR[o+1]; sz+=CR[o+2]; } }
  sx/=na; sy/=na; sz/=na; vx/=na; vy/=na; vz/=na;
  /* remove the twist too: muscles may bend a body but not spin it. Then damp any spin a downed body has picked up. */
  { let cx=0,cy=0,cz=0; for(let i=0;i<NP;i++){ if(PN&&PN[i]) continue; cx+=x[i*3]; cy+=x[i*3+1]; cz+=x[i*3+2]; } cx/=na; cy/=na; cz/=na;
    let Lx=0,Ly=0,Lz=0,Wx=0,Wy=0,Wz=0,I=0;
    for(let i=0;i<NP;i++){ if(PN&&PN[i]) continue; const o=i*3,rx=x[o]-cx,ry=x[o+1]-cy,rz=x[o+2]-cz,c0=CR[o]-sx,c1=CR[o+1]-sy,c2=CR[o+2]-sz,v0=x[o]-p[o]-vx,v1=x[o+1]-p[o+1]-vy,v2=x[o+2]-p[o+2]-vz;
      Lx+=ry*c2-rz*c1; Ly+=rz*c0-rx*c2; Lz+=rx*c1-ry*c0; Wx+=ry*v2-rz*v1; Wy+=rz*v0-rx*v2; Wz+=rx*v1-ry*v0; I+=rx*rx+ry*ry+rz*rz; }
    /* bodies on the floor: muscles twisting against floor friction would spin them like a top, so yaw spin is bled off hard */
    if(I>1e-6){ Lx/=I; Ly/=I; Lz/=I; const st=E.settle>0,dmp=st?.06:s<.5?.03:.004,dy=st?.5:(s<.5&&!E.dead)?.4:s<.5?.16:.004; Wx*=dmp/I; Wy*=dy/I; Wz*=dmp/I;
      for(let i=0;i<NP;i++){ if(PN&&PN[i]) continue; const o=i*3,rx=x[o]-cx,ry=x[o+1]-cy,rz=x[o+2]-cz;
        if(Ha){ CR[o]-=Ly*rz-Lz*ry; CR[o+1]-=Lz*rx-Lx*rz; CR[o+2]-=Lx*ry-Ly*rx; }
        p[o]+=Wy*rz-Wz*ry; p[o+1]+=Wz*rx-Wx*rz; p[o+2]+=Wx*ry-Wy*rx; } } }
  for(let i=0;i<NP;i++){ if(PN&&PN[i]) continue; const o=i*3,kd=E.KD[i];
    if(Ha){ x[o]+=CR[o]-sx; x[o+1]+=CR[o+1]-sy; x[o+2]+=CR[o+2]-sz; }
    /* damping only against the body's own average motion, so falling still falls at full speed */
    p[o]+=((x[o]-p[o])-vx)*kd; p[o+1]+=((x[o+1]-p[o+1])-vy)*kd; p[o+2]+=((x[o+2]-p[o+2])-vz)*kd;
    for(let c=0;c<3;c++){ const d=x[o+c]-p[o+c]; if(d>.12) p[o+c]=x[o+c]-.12; else if(d<-.12) p[o+c]=x[o+c]+.12; } }
  /* crawling: drag the trunk toward a slow target speed (it pulls, it doesn't skate) */
  if(E.crawlF&&E.crawlF[2]>0){ const f=E.crawlF,vt=.55*f[2]; for(const i of [PI_.chest,PI_.pelvis,PI_.neck]){ const o=i*3,vx=(x[o]-p[o])/h,vz=(x[o+2]-p[o+2])/h; p[o]-=(f[0]*vt-vx)*.08*h; p[o+2]-=(f[1]*vt-vz)*.08*h; } }
}
function solveBody(E){
  const B=E.B,x=B.x,C=B.cons;
  for(let q=0;q<C.length;q+=4){ const a=C[q]*3,b=C[q+1]*3,L=C[q+2],st=C[q+3];
    const dx=x[b]-x[a],dy=x[b+1]-x[a+1],dz=x[b+2]-x[a+2],d=Math.sqrt(dx*dx+dy*dy+dz*dz)||1e-6,f=(d-L)/d*.5*st;
    x[a]+=dx*f; x[a+1]+=dy*f; x[a+2]+=dz*f; x[b]-=dx*f; x[b+1]-=dy*f; x[b+2]-=dz*f; }
}
function limitBody(E){ /* knees and elbows only bend one way, the head stays on the shoulders.
  Corrections are small and move the particle's history with it, so a limit never throws the body around. */
  const B=E.B,P=i=>X_(B,i);
  const nudge=(i,d)=>{ const l=Math.hypot(d[0],d[1],d[2]); if(l<1e-6) return; const k=Math.min(1,.006/l); for(let c=0;c<3;c++){ B.x[i*3+c]+=d[c]*k; B.p[i*3+c]+=d[c]*k; } };
  const Rh=frameFrom(P(PI_.hipL),P(PI_.hipR),P(PI_.pelvis),P(PI_.chest)),Rs=frameFrom(P(PI_.shL),P(PI_.shR),P(PI_.chest),P(PI_.neck));
  for(const s of ['L','R']){
    const hip=P(PI_['hip'+s]),kn=P(PI_['kn'+s]),an=P(PI_['an'+s]),t=norm3(v3.sub(kn,hip)),f=norm3(v3.sub(Rh[2],v3.sc(t,v3.dot(t,Rh[2])))),e=v3.dot(v3.sub(an,kn),f);
    if(e>.01&&!E.cut['leg'+s]){ nudge(PI_['an'+s],v3.sc(f,-(e-.01)*.8)); nudge(PI_['kn'+s],v3.sc(f,(e-.01)*.2)); }
    const sh=P(PI_['sh'+s]),el=P(PI_['el'+s]),hd=P(PI_['hd'+s]),u=norm3(v3.sub(el,sh)),fa=norm3(v3.sub(Rs[2],v3.sc(u,v3.dot(u,Rs[2])))),ea=v3.dot(v3.sub(hd,el),fa);
    if(ea<-.01&&!E.cut['arm'+s]) nudge(PI_['hd'+s],v3.sc(fa,(-ea-.01)*.8)); }
  const nk=P(PI_.neck),hd=P(PI_.head),d=v3.sub(hd,nk),L=Math.hypot(...d),dn=v3.sc(d,1/(L||1));
  if(!E.cut.head&&v3.dot(dn,Rs[1])<.3){ const tg=v3.add(nk,v3.sc(norm3(v3.add(dn,v3.sc(Rs[1],.5))),L)); nudge(PI_.head,v3.sc(v3.sub(tg,hd),.3)); }
}
function collideBody(E){
  const B=E.B,x=B.x,p=B.p;
  if(!B.imp){ B.imp=new Float32Array(NP); B.impDir=PD.map(()=>[0,-1,0]); }
  for(let i=0;i<NP;i++){ const o=i*3,r=B.r[i]; let gr=false; const v0x=x[o]-p[o],v0y=x[o+1]-p[o+1],v0z=x[o+2]-p[o+2];
    /* collisions are inelastic: the velocity into the surface is removed, otherwise muscles pushing into the floor would bounce the body up */
    if(x[o+1]<r){ x[o+1]=r; if(p[o+1]<r) p[o+1]=r; gr=true; } if(x[o+1]>RH-r){ x[o+1]=RH-r; p[o+1]=Math.min(p[o+1],RH-r); }
    if(x[o]<-RX+r){ x[o]=-RX+r; p[o]=Math.max(p[o],x[o]); } else if(x[o]>RX-r){ x[o]=RX-r; p[o]=Math.min(p[o],x[o]); }
    if(x[o+2]<-RZ+r){ x[o+2]=-RZ+r; p[o+2]=Math.max(p[o+2],x[o+2]); } else if(x[o+2]>RZ-r){ x[o+2]=RZ-r; p[o+2]=Math.min(p[o+2],x[o+2]); }
    for(const b of boxesAt(x[o],x[o+2])){ const px=x[o],py=x[o+1],pz=x[o+2];
      if(px>b.x0-r&&px<b.x1+r&&pz>b.z0-r&&pz<b.z1+r&&py<b.h+r&&py>b.y0-r){ const pens=[px-(b.x0-r),(b.x1+r)-px,pz-(b.z0-r),(b.z1+r)-pz,(b.h+r)-py,b.y0>0?py-(b.y0-r):1e9]; let m=0; for(let k=1;k<6;k++) if(pens[k]<pens[m]) m=k;
        if(m===0){ x[o]=b.x0-r; p[o]=Math.min(p[o],x[o]); } else if(m===1){ x[o]=b.x1+r; p[o]=Math.max(p[o],x[o]); } else if(m===2){ x[o+2]=b.z0-r; p[o+2]=Math.min(p[o+2],x[o+2]); } else if(m===3){ x[o+2]=b.z1+r; p[o+2]=Math.max(p[o+2],x[o+2]); }
        else if(m===4){ x[o+1]=b.h+r; p[o+1]=Math.max(p[o+1],x[o+1]); gr=true; } else { x[o+1]=b.y0-r; p[o+1]=Math.min(p[o+1],x[o+1]); } } }
    if(gr){ p[o]=x[o]-(x[o]-p[o])*PHYS.fric; p[o+2]=x[o+2]-(x[o+2]-p[o+2])*PHYS.fric; }
    B.ground[i]=gr?1:0;
    { const dvx=x[o]-p[o]-v0x,dvy=x[o+1]-p[o+1]-v0y,dvz=x[o+2]-p[o+2]-v0z,im=Math.hypot(dvx,dvy,dvz)/H; if(im>B.imp[i]){ B.imp[i]=im; const vl=Math.hypot(v0x,v0y,v0z)||1; B.impDir[i]=[v0x/vl,v0y/vl,v0z/vl]; } } /* how hard it just hit something */
    /* the player is a solid cylinder: walking into a body shoves it */
    if(x[o+1]<1.85){ const dx=x[o]-PL.x,dz=x[o+2]-PL.z,d=Math.hypot(dx,dz),m=.3+r; if(d<m&&d>1e-4){ x[o]=PL.x+dx/d*m; x[o+2]=PL.z+dz/d*m; } } }
}
function collidePair(A,Bd){
  const a=A.B.x,b=Bd.B.x; if(Math.hypot(a[0]-b[0],a[2]-b[2])>2.2) return;
  for(let i=0;i<NP;i++) for(let j=0;j<NP;j++){ const o=i*3,q=j*3,dx=b[q]-a[o],dy=b[q+1]-a[o+1],dz=b[q+2]-a[o+2],m=A.B.r[i]+Bd.B.r[j],d2=dx*dx+dy*dy+dz*dz;
    if(d2<m*m&&d2>1e-8){ /* push apart sideways only, and the body that is standing gives way less: nobody gets lifted onto someone else */
      const dh=Math.hypot(dx,dz); if(dh<1e-4) continue; const pen=m-Math.sqrt(d2),wa=A.sup>.5&&Bd.sup<=.5?.15:Bd.sup>.5&&A.sup<=.5?.85:.5;
      a[o]-=dx/dh*pen*wa; a[o+2]-=dz/dh*pen*wa; b[q]+=dx/dh*pen*(1-wa); b[q+2]+=dz/dh*pen*(1-wa); } }
}
/* a corpse that has come to rest goes to sleep: no physics, no skinning, until something touches it (a hit, a grab, you, another body) */
function wakeBody(E){ E.asleep=false; E.calm=0; E.B.wake=0; }
function physics(h){
  for(const E of enemies) if(E.asleep){ const q=E.B.x; if(E.B.wake||E.grabbed||Math.hypot(q[0]-PL.x,q[2]-PL.z)<.7||enemies.some(O=>O!==E&&!O.asleep&&Math.hypot(O.B.x[0]-q[0],O.B.x[2]-q[2])<1.1)) wakeBody(E); }
  const live=enemies.filter(E=>!E.asleep);
  for(const E of live) stepBody(E,h);
  applyGrabs(h);
  for(let it=0;it<5;it++){ for(const E of live){ solveBody(E); if(it===4) limitBody(E); } if(it===2) applyGrabs(h); }
  for(const E of live) collideBody(E);
  for(const E of live){ E.B.wake=0; if(!E.dead||E.deadT<2.5){ E.calm=0; continue; } let mv=0; const x=E.B.x,p=E.B.p; for(let i=0;i<NP*3;i++) mv=Math.max(mv,Math.abs(x[i]-p[i])); E.calm=mv<.0003?(E.calm||0)+h:0; if(E.calm>1) E.asleep=true; }
  for(const E of live) if(E.pins) for(const q of E.pins){ const a=q.a*3,i=q.i*3; for(let c=0;c<3;c++){ E.B.x[i+c]=E.B.x[a+c]+q.off[c]; E.B.p[i+c]=E.B.x[i+c]; } } /* a limb that no longer exists */
  for(let i=0;i<live.length;i++) for(let j=i+1;j<live.length;j++) collidePair(live[i],live[j]);
}
/* skeleton from particles */
function driveRig(E){
  const J=E.J,B=E.B,P=i=>X_(B,PI_[i]),bd=B.bdir;
  const pel=P('pelvis'),Rh=frameFrom(P('hipL'),P('hipR'),pel,P('chest'));
  J.hips.p=pel; J.hips.r=eul(Rh);
  const spJ=v3.add(pel,mv(Rh,J.spine.p)),Rs=frameFrom(P('shL'),P('shR'),spJ,P('neck'));
  J.spine.r=eul(mtm(Rh,Rs)); E.Rs=Rs;
  const Rn=swing(Rs,bd.neck,norm3(v3.sub(P('head'),P('neck')))); J.neck.r=eul(mtm(Rs,Rn));
  if(!E.cut.head) J.head.r=[E.lookPitch||0,E.lookYaw||0,0];
  const spM=fromCols(Rs[0],Rs[1],Rs[2],spJ),hpM=fromCols(Rh[0],Rh[1],Rh[2],pel);
  if(E.cut.head){ J.neck.r=[0,0,0]; const nl=m4.make(),nM=m4.make(); m4.compose(nl,J.neck.p,[0,0,0],[1,1,1]); m4.mul(nM,spM,nl);
    const w=E.headW,wl=Math.hypot(...w); let Rh_=E.Rcut.head||I3(); if(wl>1e-4){ const k=v3.sc(w,1/wl),a=wl/60; Rh_=[rodr(Rh_[0],k,Math.cos(a),Math.sin(a)),rodr(Rh_[1],k,Math.cos(a),Math.sin(a)),rodr(Rh_[2],k,Math.cos(a),Math.sin(a))]; }
    if(B.ground[PI_.head]) E.headW=v3.sc(w,.9); E.Rcut.head=Rh_;
    const hp_=P('head'); setLocal(J.head,nM,fromCols(Rh_[0],Rh_[1],Rh_[2],v3.sub(hp_,mv(Rh_,[0,.115,0])))); }
  for(const s of ['L','R']){
    if(E.cut['arm'+s]){ const el=P('el'+s),hd=P('hd'+s),fd=norm3(v3.sub(hd,el)),Ro=E.Rcut['arm'+s]||Rs,Ra=mm(fromTo(norm3(mv(Ro,bd['arm'+s])),fd),Ro); E.Rcut['arm'+s]=Ra;
      setLocal(J['arm'+s],spM,fromCols(Ra[0],Ra[1],Ra[2],v3.sub(el,v3.sc(fd,Math.hypot(...J['elbow'+s].p))))); J['elbow'+s].r=[0,0,0]; J['hand'+s].r=[0,0,0]; }
    if(E.cut['leg'+s]){ const kn=P('kn'+s),an=P('an'+s),sd=norm3(v3.sub(an,kn)),Ro=E.Rcut['leg'+s]||Rh,Rt=mm(fromTo(norm3(mv(Ro,bd['thigh'+s])),sd),Ro); E.Rcut['leg'+s]=Rt;
      setLocal(J['thigh'+s],hpM,fromCols(Rt[0],Rt[1],Rt[2],v3.sub(kn,v3.sc(sd,Math.hypot(...J['knee'+s].p)))));
      const Rk=swing(Rt,bd['shin'+s],sd); J['knee'+s].r=eul(mtm(Rt,Rk)); const Rf=swing(Rk,bd['foot'+s],norm3(v3.sub(P('toe'+s),an))); J['ankle'+s].r=eul(mtm(Rk,Rf)); }
  }
  for(const s of ['L','R']){
    if(!E.cut['arm'+s]){
    const Ra=swing(Rs,bd['arm'+s],norm3(v3.sub(P('el'+s),P('sh'+s)))); J['arm'+s].r=eul(mtm(Rs,Ra));
    const Re=swing(Ra,bd['fore'+s],norm3(v3.sub(P('hd'+s),P('el'+s)))); J['elbow'+s].r=eul(mtm(Ra,Re)); J['hand'+s].r=!E.dead&&E.handRot&&E.wpnHand==='R'&&!E.oneHand&&(s==='R'?E.wpnHeld:true)&&E.st==='alert'?E.handRot[s]:[0,0,0];
    if(!E.dead&&E.oneHand&&E.wpnHeld&&s===E.wpnHand&&E.st==='alert'&&RANGED[E.kind]){ /* wrist turns the gun onto you; it lags and wobbles because the arm is hurt */
      const hp=P('hd'+s),t=GAME.t+E.t0,tp=[PL.x+Math.sin(t*1.7)*.25,1.42+Math.sin(t*2.3)*.15,PL.z+Math.cos(t*1.3)*.25],Z=norm3(v3.sub(tp,hp)),X=norm3(v3.cross([0,1,0],Z)),Y=v3.cross(Z,X);
      const tmp=m4.make(); m4.compose(tmp,[0,0,0],E.C.wpn.r,[1,1,1]); const G=rotOf(tmp),Gt=[[G[0][0],G[1][0],G[2][0]],[G[0][1],G[1][1],G[2][1]],[G[0][2],G[1][2],G[2][2]]];
      J['hand'+s].r=eul(mtm(Re,mm([X,Y,Z],Gt))); } }
    if(!E.cut['leg'+s]){
    const Rt=swing(Rh,bd['thigh'+s],norm3(v3.sub(P('kn'+s),P('hip'+s)))); J['thigh'+s].r=eul(mtm(Rh,Rt));
    const Rk=swing(Rt,bd['shin'+s],norm3(v3.sub(P('an'+s),P('kn'+s)))); J['knee'+s].r=eul(mtm(Rt,Rk));
    const Rf=swing(Rk,bd['foot'+s],norm3(v3.sub(P('toe'+s),P('an'+s)))); J['ankle'+s].r=eul(mtm(Rk,Rf)); } }
  if(E.gunUp&&E.wpnHeld&&!E.oneHand&&!E.dead&&!E.cut.armL&&!E.cut.armR&&(E.st==='alert'||E.st==='idle')){ setCarry(E,E.st==='alert'?'up':'hang'); if(E.carry==='up') holdLongGun(E); }
  E.M=fkMats(J);
}
/* both hands on the long gun, every frame: the gun rides the chest (low ready <-> shouldered), the arms are solved onto its grip and fore-end */
function setCarry(E,c){ if(E.carry===c) return; E.carry=c; const w=E.C.wpn,J=E.J;
  if(c==='hang'){ setParent(w,J.handR); w.p=[0,-.08,.02]; w.r=[1.25,0,0]; setGrip(J,'L',false); } else { setParent(w,J.spine); setGrip(J,'L',true); } setGrip(J,'R',true); }
function holdLongGun(E){ const J=E.J,w=E.C.wpn,k=E.aimK||0,a=E.gunLow,b=E.gunUp,G=GUNS[E.C.gun];
  w.p=a.p.map((v,i)=>lerp(v,b.p[i],k)); w.r=a.r.map((v,i)=>lerp(v,b.r[i],k));
  const loc=m4.make(),gm=m4.make(); m4.compose(loc,w.p,w.r,w.s); m4.mul(gm,chainMat(J,'spine'),loc);
  const ax=norm3(colOf(gm,2)),cR=mulP(gm,[0,G.grip[1],G.grip[2]]),cL=mulP(gm,[0,G.grip[1],G.fore[2]]);
  for(const [L_,c] of [['R',cR],['L',cL]]){ let f=fistFrame(J,L_,ax); ikArm(J,L_,v3.sub(c,f.off)); f=fistFrame(J,L_,ax); setLocal(J['hand'+L_],chainMat(J,'elbow'+L_),fromCols(f.X,f.Y,f.Z,colOf(chainMat(J,'hand'+L_),3))); } }

/* ---------- blood ---------- */
const BP=[],DEC={splat:[],pool:[],hole:[]};
const dynN={};
function dynNode(key,mat){ const g=new Geo(); g.noCull=true; g.groups=[{start:0,count:0,mi:0}]; dynN[key]=mk(g,mat,world); }
function dynSet(key,A){ const n=dynN[key],g=n.mesh.geo; g.P=A.P; g.Nm=A.Nm; g.T=A.T; g.I=A.I;
  if(!A.I.length){ n.vis=false; return; } n.vis=true;
  if(!g.vao) upload(g); else { gl.bindVertexArray(g.vao); [A.P,A.Nm,A.T].forEach((a,i)=>{ gl.bindBuffer(gl.ARRAY_BUFFER,g.bufs[i]); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(a),gl.DYNAMIC_DRAW); });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,g.bufs[3]); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(A.I),gl.DYNAMIC_DRAW); gl.bindVertexArray(null); }
  g.groups[0].count=A.I.length; n.mesh.runs=null; }
const newA=()=>({P:[],Nm:[],T:[],I:[]});
function quad(A,c,n,s,rot=0,sy){ let X=Math.abs(n[1])>.9?[1,0,0]:norm3(v3.cross([0,1,0],n)); let Y=v3.cross(n,X);
  const cr=Math.cos(rot),sr=Math.sin(rot),X2=v3.add(v3.sc(X,cr),v3.sc(Y,sr)),Y2=v3.sub(v3.sc(Y,cr),v3.sc(X,sr)),b=A.P.length/3,syy=sy??s;
  for(const [u,v] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ const q=v3.add(c,v3.add(v3.sc(X2,u*s),v3.sc(Y2,v*syy))); A.P.push(q[0],q[1],q[2]); A.Nm.push(n[0],n[1],n[2]); A.T.push((u+1)/2,(v+1)/2); }
  A.I.push(b,b+1,b+2,b,b+2,b+3); }
function cube(A,c,s){ for(const n of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]) quad(A,v3.add(c,v3.sc(n,s)),n,s); }
function emit(pos,vel,size,kind,life=3){ if(BP.length>820) BP.splice(0,40); BP.push({x:pos.slice(),v:vel.slice(),s:size,k:kind,life}); }
function spray(pos,dir,n,speed,spread,kind='dark',size=.012){ n=Math.round(n*(GAME.bloodK||1)); for(let i=0;i<n;i++){ const v=v3.add(v3.sc(norm3(v3.add(dir,[rnd(-spread,spread),rnd(-spread,spread),rnd(-spread,spread)])),speed*rnd(.4,1.15)),[0,rnd(0,.6),0]); emit(pos,v,size*rnd(.6,1.6),kind); } }
function addDecal(list,c,n,s,max=220,sy){ if(list.length>max) list.shift(); list.push({c,n,s,rot:Math.random()*6.28,sy}); list.ver=(list.ver||0)+1; }
function updateBlood(dt){
  for(let i=BP.length-1;i>=0;i--){ const b=BP[i]; if(b.rest){ b.life-=dt; if(b.life<=0) BP.splice(i,1); continue; } b.v[1]-=9.8*dt; const dr=1-1.2*dt; b.v[0]*=dr; b.v[2]*=dr;
    b.x[0]+=b.v[0]*dt; b.x[1]+=b.v[1]*dt; b.x[2]+=b.v[2]*dt; b.life-=dt;
    let hit=null;
    if(b.x[1]<=.002) hit={c:[b.x[0],.003+Math.random()*.001,b.x[2]],n:[0,1,0]};
    else if(Math.abs(b.x[0])>=RX-.002) hit={c:[Math.sign(b.x[0])*(RX-.006),b.x[1],b.x[2]],n:[-Math.sign(b.x[0]),0,0]};
    else if(Math.abs(b.x[2])>=RZ-.002) hit={c:[b.x[0],b.x[1],Math.sign(b.x[2])*(RZ-.006)],n:[0,0,-Math.sign(b.x[2])]};
    else if(b.x[1]>=RH-.01) hit={c:[b.x[0],RH-.006,b.x[2]],n:[0,-1,0]};
    else for(const bx of boxesAt(b.x[0],b.x[2])){ if(b.x[0]>bx.x0&&b.x[0]<bx.x1&&b.x[2]>bx.z0&&b.x[2]<bx.z1&&b.x[1]<bx.h&&b.x[1]>bx.y0){
      /* which face did it come through? the splat goes on that face */
      const px=b.x[0]-b.v[0]*dt,py=b.x[1]-b.v[1]*dt,pz=b.x[2]-b.v[2]*dt;
      if(py>=bx.h) hit={c:[b.x[0],bx.h+.004,b.x[2]],n:[0,1,0]}; else if(py<=bx.y0) hit={c:[b.x[0],bx.y0-.004,b.x[2]],n:[0,-1,0]};
      else if(px<=bx.x0) hit={c:[bx.x0-.006,b.x[1],b.x[2]],n:[-1,0,0]}; else if(px>=bx.x1) hit={c:[bx.x1+.006,b.x[1],b.x[2]],n:[1,0,0]};
      else if(pz<=bx.z0) hit={c:[b.x[0],b.x[1],bx.z0-.006],n:[0,0,-1]}; else hit={c:[b.x[0],b.x[1],bx.z1+.006],n:[0,0,1]};
      break; } }
    if(hit&&(b.k==='gib'||b.k==='bone')){ /* chunks: smear, bounce, then lie there */
      if(b.k==='gib'&&Math.random()<.8) addDecal(DEC.splat,hit.c,hit.n,b.s*rnd(2,3.5),260,hit.n[1]===0?b.s*rnd(3,6):undefined);
      if(hit.n[1]>.9){ b.rest=true; b.x=[hit.c[0],hit.c[1]+b.s*.6,hit.c[2]]; b.life=Math.max(b.life,20); }
      else { const vn=v3.dot(b.v,hit.n); b.v=v3.sc(v3.sub(b.v,v3.sc(hit.n,2*vn)),.3); b.x=v3.add(hit.c,v3.sc(hit.n,b.s+.004)); } continue; }
    if(hit){ if(b.k!=='dust'&&Math.random()<.75){ const sp=Math.hypot(...b.v); addDecal(DEC.splat,hit.c,hit.n,b.s*rnd(2.5,4.5)+Math.min(.05,sp*.012),260, hit.n[1]===0?b.s*rnd(4,9):undefined); } BP.splice(i,1); }
    else if(b.life<=0) BP.splice(i,1); }
}
function buildBloodMeshes(){
  /* drops are single squares facing you (a sixth of the vertices of cubes); decals are only rebuilt when they change */
  const A={bright:newA(),dark:newA(),dust:newA(),gib:newA(),bone:newA()},nf=v3.sc(camBasis().f,-1);
  for(const b of BP) quad(A[b.k],b.x,nf,b.s*1.25);
  for(const k in A) dynSet(k,A[k]);
  const now=performance.now(); buildBloodMeshes.at=buildBloodMeshes.at||{};
  for(const key of ['splat','pool','hole']){ const L_=DEC[key],v=L_.ver||0,at=buildBloodMeshes.at; if(at[key]&&at[key].v===v) continue; if(key==='pool'&&at[key]&&now-at[key].t<200) continue; at[key]={v,t:now};
    const Q=newA(); DEC[key].forEach((d,i)=>{ const c=d.n[1]>.9?[d.c[0],d.c[1]+i*.00003,d.c[2]]:d.c; quad(Q,c,d.n,d.s,d.n[1]===0?0:d.rot,d.sy); }); dynSet(key,Q); }
}

/* ---------- wounds ---------- */
function addWound(E,seg,point,dir,o){
  const bone=seg[4],M=E.M[bone],R=rotOf(M),inv=v3.sub(point,[M[12],M[13],M[14]]);
  const a=X_(E.B,seg[0]),b=X_(E.B,seg[1]),u=v3.sub(b,a),uu=v3.dot(u,u),s=uu>1e-8?clamp(v3.dot(v3.sub(point,a),u)/uu,0,1):0,ax=v3.add(a,v3.sc(u,s));
  let n=v3.sub(point,ax); n=Math.hypot(...n)>1e-4?norm3(n):v3.sc(dir,-1);
  const lp=mtv(R,v3.add(inv,v3.sc(n,.004))),ln=mtv(R,n);
  /* decal on the bone: hole at the top of the texture, the drip running down the body */
  const upL=mtv(R,[0,1,0]); let Y=v3.sub(upL,v3.sc(ln,v3.dot(upL,ln))); Y=Math.hypot(...Y)>1e-3?norm3(Y):(Math.abs(ln[1])<.9?norm3(v3.cross(ln,[1,0,0])):[1,0,0]);
  const X=v3.cross(Y,ln),node=N(E.J[bone]); node.p=v3.sub(lp,v3.sc(Y,.032)); node.r=eul([X,Y,ln]);
  if(!o.noDecal) mk(plane(.05,.1),o.knife?mStab:mWound,node);
  E.wounds.push({bone,lp,ln,rate:o.rate,art:o.art,part:o.part,acc:0}); }
function bleedFx(E,dt){
  const pr=clamp((E.blood-8)/92,0,1);
  for(const w of E.wounds){ const M=E.M[w.bone],p=mulP(M,w.lp),n=norm3(mv(rotOf(M),w.ln));
    if(w.art&&!E.dead&&E.spurtT>0||w.part==='stump'&&E.dead&&E.deadT<4&&Math.random()<.3){ const cnt=Math.round(220*pr*dt*rnd(.7,1.3)); for(let i=0;i<cnt;i++) emit(p,v3.add(v3.sc(norm3(v3.add(n,[rnd(-.18,.18),rnd(-.1,.3),rnd(-.18,.18)])),(1.3+3.4*pr)*rnd(.75,1.1)),[0,.5,0]),rnd(.008,.016),'bright'); }
    const rate=w.piece?Math.max(0,w.rate*(1-(w.age=(w.age||0)+dt)/20)):E.dead?Math.max(0,.4*(1-E.deadT/25)):w.rate*(.25+.75*pr);
    w.acc+=rate*2.2*dt; while(w.acc>1){ w.acc-=1; emit(v3.add(p,v3.sc(n,.01)),[n[0]*.15+rnd(-.05,.05),rnd(-.2,.05),n[2]*.15+rnd(-.05,.05)],rnd(.007,.013),'dark'); } }
}
function poolFx(E,dt){
  if(!E.wounds.length||E.st==='idle'||E.st==='alert') return;
  E.poolT=(E.poolT||0)-dt; if(E.poolT>0) return; E.poolT=.12;
  const ws=E.wounds.filter(x=>!x.piece); if(!ws.length) return; const w=ws.reduce((a,b)=>b.rate>a.rate?b:a),M=E.M[w.bone],p=mulP(M,w.lp);
  const pel=X_(E.B,PI_.pelvis),c=[lerp(p[0],pel[0],.3),0,lerp(p[2],pel[2],.3)];
  const rate=E.dead?Math.max(0,.6*(1-E.deadT/30)):E.wounds.reduce((s,x)=>s+x.rate,0)*clamp(E.blood/100,.25,1);
  if(rate<=0) return;
  let P0=E.pool; if(!P0||dist2(P0.c,c)>.28){ P0={c:[c[0],.0025,c[2]],n:[0,1,0],s:.05,rot:Math.random()*6.28}; if(DEC.pool.length>70) DEC.pool.shift(); DEC.pool.push(P0); DEC.pool.ver=(DEC.pool.ver||0)+1; E.pool=P0; }
  const ns=Math.min(E.dead?1.0:.85,P0.s+rate*.0035); if(ns!==P0.s){ P0.s=ns; DEC.pool.ver=(DEC.pool.ver||0)+1; } }

/* ---------- player ---------- */
const PL={x:0,z:3.2,yaw:0,pitch:0,hp:100,hurtT:9,ammo:12,reload:0,stabT:-1,stabDone:false,stabCd:0,kickCd:0,rec:0,flashT:0,dead:false};
const KEYS={};
const GAME={started:false,ts:1,slow:false,acc:0,t:0,clear:false,barkGlobal:0};
function camBasis(){ if(XR.on&&XR.head) return XR.head; const cy=Math.cos(PL.yaw),sy=Math.sin(PL.yaw),cp=Math.cos(PL.pitch),sp=Math.sin(PL.pitch);
  const f=[-sy*cp,sp,-cy*cp],r=norm3(v3.cross(f,[0,1,0])),u=v3.cross(r,f); return {f,r,u,eye:[PL.x,1.62,PL.z]}; }
/* rays */
function raySeg(o,d,a,b,r){
  const u=v3.sub(b,a),w=v3.sub(o,a),bb=v3.dot(d,u),c=v3.dot(u,u),dd=v3.dot(d,w),e=v3.dot(u,w);
  let s; if(c<1e-9) s=0; else { const den=c-bb*bb; s=den>1e-9?clamp((e-bb*dd)/den,0,1):0; }
  const q=v3.add(a,v3.sc(u,s)),t=v3.dot(v3.sub(q,o),d); if(t<0) return null;
  const pp=v3.add(o,v3.sc(d,t)),dist=Math.hypot(...v3.sub(pp,q)); if(dist>r) return null;
  return {t:t-Math.sqrt(r*r-dist*dist)}; }
/* exact hits: bullets and blades land on the drawn skin, not on the fat physics capsules around it */
function meshTris(n,P,cb){ const W=n.world,I=n.mesh.geo.I,V=new Float32Array(P.length);
  for(let i=0;i<P.length;i+=3){ const x=P[i],y=P[i+1],z=P[i+2]; V[i]=W[0]*x+W[4]*y+W[8]*z+W[12]; V[i+1]=W[1]*x+W[5]*y+W[9]*z+W[13]; V[i+2]=W[2]*x+W[6]*y+W[10]*z+W[14]; }
  cb(V,I); }
function bodyMeshes(E){ const J=E.J,out=[[J.body,J.skin.P,J.skin]]; if(J.headMesh&&J.headMesh.vis!==false) out.push([J.headMesh,J.headMesh.mesh.geo.P,null]); return out; }
/* which body part a skin point belongs to: the bone that drives that bit of skin */
const BONE_SEG={hips:['belly'],spine:['chest','belly'],neck:['neck'],head:['head'],armL:['uarmL'],elbowL:['farmL'],handL:['farmL'],armR:['uarmR'],elbowR:['farmR'],handR:['farmR'],thighL:['thighL'],kneeL:['shinL'],ankleL:['footL'],thighR:['thighR'],kneeR:['shinR'],ankleR:['footR']};
function vBone(S,vs){ const w={}; for(const v of vs) for(let k=0;k<2;k++){ const b=S.bi[v*2+k],x=S.bw[v*2+k]; if(x>0) w[b]=(w[b]||0)+x; } let bb=-1,bw=-1; for(const b in w) if(w[b]>bw){ bw=w[b]; bb=+b; } return BONES[bb]; }
function segFor(E,bone,p){ const names=BONE_SEG[bone]; if(!names) return segAt(E,p); const c=SEGS.filter((sg,si)=>names.includes(sg[3])&&!E.segOff.has(si)); if(!c.length) return segAt(E,p); if(c.length===1) return c[0];
  let best=null,bd=1e9; for(const sg of c){ const a=X_(E.B,sg[0]),b=X_(E.B,sg[1]),u=v3.sub(b,a),uu=v3.dot(u,u),s=uu>1e-8?clamp(v3.dot(v3.sub(p,a),u)/uu,0,1):0,q=Math.hypot(...v3.sub(p,v3.add(a,v3.sc(u,s)))); if(q<bd){ bd=q; best=sg; } } return best; }
function rayMesh(E,o,d,t0,t1){ let best=null,hb=null;
  for(const [n,P,S] of bodyMeshes(E)) meshTris(n,P,(V,I)=>{ for(let k=0;k<I.length;k+=3){ const a=I[k]*3,b=I[k+1]*3,c=I[k+2]*3;
    const e1x=V[b]-V[a],e1y=V[b+1]-V[a+1],e1z=V[b+2]-V[a+2],e2x=V[c]-V[a],e2y=V[c+1]-V[a+1],e2z=V[c+2]-V[a+2];
    const px=d[1]*e2z-d[2]*e2y,py=d[2]*e2x-d[0]*e2z,pz=d[0]*e2y-d[1]*e2x,det=e1x*px+e1y*py+e1z*pz; if(Math.abs(det)<1e-9) continue; const id=1/det;
    const tx=o[0]-V[a],ty=o[1]-V[a+1],tz=o[2]-V[a+2],u=(tx*px+ty*py+tz*pz)*id; if(u<0||u>1) continue;
    const qx=ty*e1z-tz*e1y,qy=tz*e1x-tx*e1z,qz=tx*e1y-ty*e1x,v=(d[0]*qx+d[1]*qy+d[2]*qz)*id; if(v<0||u+v>1) continue;
    const t=(e2x*qx+e2y*qy+e2z*qz)*id; if(t>=t0&&t<=t1&&(best===null||t<best)){ best=t; hb=S?vBone(S,[I[k],I[k+1],I[k+2]]):'head'; } } });
  return best===null?null:{t:best,bone:hb}; }
function nearestSkin(E,p,maxD){ let best=null,bd=maxD*maxD;
  for(const [n,P,S] of bodyMeshes(E)) meshTris(n,P,V=>{ for(let i=0;i<V.length;i+=3){ const dx=V[i]-p[0],dy=V[i+1]-p[1],dz=V[i+2]-p[2],q=dx*dx+dy*dy+dz*dz; if(q<bd){ bd=q; best={p:[V[i],V[i+1],V[i+2]],bone:S?vBone(S,[i/3]):'head'}; } } });
  return best; }
function segAt(E,p){ let best=null,bd=1e9; SEGS.forEach((sg,si)=>{ if(E.segOff.has(si)) return; const a=X_(E.B,sg[0]),b=X_(E.B,sg[1]),u=v3.sub(b,a),uu=v3.dot(u,u),s=uu>1e-8?clamp(v3.dot(v3.sub(p,a),u)/uu,0,1):0,q=Math.hypot(...v3.sub(p,v3.add(a,v3.sc(u,s))))-sg[2]; if(q<bd){ bd=q; best=sg; } }); return best; }
/* first exact skin hit along a ray: capsules find who might be hit, the mesh decides where */
function rayEnemiesExact(o,d,maxT){ let best=null;
  for(const E of enemies){ let tc=null; for(let si=0;si<SEGS.length;si++){ if(E.segOff.has(si)) continue; const sg=SEGS[si],h=raySeg(o,d,X_(E.B,sg[0]),X_(E.B,sg[1]),sg[2]+.02); if(h&&h.t<maxT&&(tc===null||h.t<tc)) tc=h.t; }
    if(tc===null) continue; const h=rayMesh(E,o,d,Math.max(0,tc-.05),Math.min(maxT,tc+.7)); if(h&&(!best||h.t<best.t)) best={t:h.t,bone:h.bone,E}; }
  if(best){ best.p=v3.add(o,v3.sc(d,best.t)); best.seg=segFor(best.E,best.bone,best.p); } return best; }
function rayEnemies(o,d,maxT,pad=0){ let best=null;
  for(const E of enemies) for(let si=0;si<SEGS.length;si++){ if(E.segOff.has(si)) continue; const sg=SEGS[si],h=raySeg(o,d,X_(E.B,sg[0]),X_(E.B,sg[1]),sg[2]+pad); if(h&&h.t<maxT&&(!best||h.t<best.t)) best={t:h.t,E,seg:sg}; }
  return best; }

/* damage */
function bark(E,text,dur=2.6){ if(!text) return; E.barkEl.textContent=text; E.barkT=dur; E.barkCd=dur+rnd(.6,1.6); }
function setAware(E,why){ if(E.dead||E.aware||GAME.aiOff) return; E.aware=true; if(E.st==='idle') E.st='alert';
  if(GAME.barkGlobal<=0&&E.barkCd<=0){ bark(E,pick(E.lines.alert)); GAME.barkGlobal=1.2; if(why!=='hit') vox(E,'shout'); } }
function faceHold(E,f,t){ if(!E.dead) E.faceHold={f,t}; }
function alertAll(src){ for(const E of enemies) if(!E.dead&&!E.aware){ const d=src?Math.hypot(E.pos[0]-src[0],E.pos[1]-src[2]):0; setTimeout(()=>setAware(E,'noise'),180+d*90); } }
/* fists and anything blunt: no wound to speak of, but it stuns, and enough to the head puts him out cold */
const BLUNT={head:{stun:.75,daze:.42},neck:{stun:.85,daze:.22},chest:{stun:.4},belly:{stun:.62},thigh:{stun:.22},shin:{stun:.16},foot:{stun:.1},uarm:{stun:.15},farm:{stun:.12}};
function hitBlunt(E,seg,point,dir,key,o){ const pw=o.power||1,B=BLUNT[key];
  for(const i of [seg[0],seg[1]]) kickV(E.B,i,v3.sc(dir,1.9*pw),H); for(const i of [PI_.chest,PI_.neck,PI_.pelvis]) kickV(E.B,i,v3.sc(dir,.55*pw),H);
  if(key==='head') kickV(E.B,PI_.head,v3.add(v3.sc(dir,1.2*pw),[0,.4*pw,0]),H);
  E.stun=Math.min(1,E.stun+B.stun*pw); E.hitT=0; spray(point,v3.sc(dir,-1),3,1,.6,'dark',.008);
  if(key==='head'&&pw>.75&&!E.nose&&!E.dead){ E.nose=true; addWound(E,seg,point,dir,{rate:.35,art:false,part:'face',noDecal:true}); }
  E.daze=Math.min(1.5,(E.daze||0)+(B.daze||0)*pw); if(!E.dead){ vox(E,key==='belly'||key==='chest'?'oof':'grunt'); faceHold(E,'agony',.45+.3*pw); }
  if(E.daze>=1&&!E.dead&&E.st!=='down'){ E.daze=0; toDown(E,true); E.knocked=true; E.koT=rnd(5,9); }
  else if(E.barkCd<1.2&&!E.dead) bark(E,pick(['Hnf—','*grunts*','Agh— fuck—','Ow— OW—']),1.6);
  setAware(E,'hit'); for(const O of enemies) if(O!==E&&!O.dead&&Math.hypot(O.pos[0]-E.pos[0],O.pos[1]-E.pos[1])<7) setAware(O,'friend'); }
function hitEnemy(E,seg,point,dir,weapon,o={}){
  const part=seg[3],key=part.replace(/[LR]$/,''),side=/[LR]$/.test(part)?part.slice(-1):'';
  if(weapon==='blunt'&&!(E.sevP[seg[0]]&&E.sevP[seg[1]])) return hitBlunt(E,seg,point,dir,key,o);
  const D=DMG[key][weapon==='blunt'?'gun':weapon],ob=(o.bleed||1)*(GAME.oneHit&&weapon!=='blunt'?40:1),os=(o.sever||1)*(GAME.severK??1),ost=o.stun||1,op=o.push||1;
  if(E.sevP[seg[0]]&&E.sevP[seg[1]]){ for(const i of [seg[0],seg[1]]) kickV(E.B,i,v3.sc(dir,weapon==='gun'?4:2),H); spray(point,dir,14,2.6,.5,'dark',.012); return; }
  const behind=weapon==='knife'&&!E.aware&&v3.dot([Math.sin(E.hd),0,Math.cos(E.hd)],norm3([dir[0],0,dir[2]]))>.3;
  /* shove the bones that were hit */
  const sp=(weapon==='gun'?(key==='head'?4.2:3.2):o.chop?2.6:1.6)*op;
  /* the hit bone takes most of it, the trunk moves as a whole so the body staggers instead of whipping round */
  const legHit=key==='thigh'||key==='shin'||key==='foot';
  if(legHit){ /* a leg hit shoves both hips the same amount: the knee buckles from the wound, not from a sideways push that would twist him round */
    for(const i of [seg[0],seg[1]]) kickV(E.B,i,v3.sc(dir,sp*.06),H); for(const i of [PI_.hipL,PI_.hipR,PI_.pelvis]) kickV(E.B,i,v3.sc(dir,sp*.05),H); E.settle=1.4; }
  else for(const i of [seg[0],seg[1]]) kickV(E.B,i,v3.sc(dir,sp*.45),H);
  const trunk=[PI_.pelvis,PI_.hipL,PI_.hipR,PI_.chest,PI_.neck,PI_.shL,PI_.shR];
  const share=key==='chest'||key==='belly'||key==='neck'?.45:legHit?0:.15; for(const i of trunk) kickV(E.B,i,v3.sc(dir,sp*share),H);
  /* the heart sits behind the sternum, a little to his left: a bullet or blade that passes within a few cm of it is fatal */
  let heart=false;
  if(key==='chest'||key==='belly'){ const B=E.B,ch=X_(B,PI_.chest),nk=X_(B,PI_.neck),Rs=frameFrom(X_(B,PI_.shL),X_(B,PI_.shR),ch,nk);
    const hp=v3.add(v3.add(ch,v3.sc(v3.sub(nk,ch),.3)),v3.add(v3.sc(Rs[0],.035),v3.sc(Rs[2],.02)));
    const reach=weapon==='gun'?.45:.14,tt=clamp(v3.dot(v3.sub(hp,point),dir),0,reach),cl=v3.add(point,v3.sc(dir,tt));
    heart=Math.hypot(...v3.sub(hp,cl))<(weapon==='gun'?.06:.075); }
  const fatal=heart?'heart':weapon==='knife'&&key==='head'?'brain':weapon==='knife'&&key==='neck'?'throat':null; /* blades: the skull, the throat; chops too */
  /* the wound */
  if(fatal==='brain'){ E.headshot=true; spray(point,v3.sc(dir,-1),40,2.4,.6,'bright',.013); addWound(E,seg,point,dir,{rate:5,art:true,part:key,knife:true}); E.spurtT=.4; }
  else if(fatal){ /* heart or opened throat: he drops where he stands and is gone in a second or two */
    addWound(E,seg,point,dir,{rate:fatal==='heart'?12:10,art:true,part:key,knife:weapon==='knife'}); E.spurtT=.5;
    spray(point,weapon==='gun'?dir:v3.sc(dir,-1),50,3.2,.5,'bright',.014);
    if(!E.dead&&E.st!=='down') toDown(E,fatal==='heart'); E.dieT=fatal==='heart'?rnd(.6,1.1):rnd(1.8,2.6); }
  else if(D.kill){ E.headshot=true; spray(point,dir,70,4.2,.55,'bright',.014); spray(point,v3.sc(dir,-1),18,1.6,.6,'dark',.012); addWound(E,seg,point,dir,{rate:5,art:true,part:key}); E.spurtT=.4; }
  else { const art=Math.random()<(D.art||0)*(behind?1.6:1)*(o.chop?1.6:1); addWound(E,seg,point,dir,{rate:D.bleed*ob*(art?2.3:1)*(behind?1.5:1),art,part:key,knife:weapon==='knife'});
    if(weapon==='gun'){ spray(point,dir,26,3.6,.4,'dark',.012); spray(point,v3.sc(dir,-1),8,1.4,.5,'bright',.01); }
    else { spray(point,v3.sc(dir,-1),22,2.2,.6,'bright',.012); }
    if(art) E.spurtT=.35; }
  if(key==='neck'&&weapon==='gun'&&!fatal&&!E.dead&&(E.st==='alert'||E.st==='idle')){ E.st='kneel'; E.aware=true; dropWeapon(E); } /* both hands go to his throat */
  if(D.leg) E.hp['leg'+side]=Math.max(0,E.hp['leg'+side]-D.leg);
  if(D.arm) E.hp['arm'+side]=Math.max(0,E.hp['arm'+side]-D.arm);
  E.stun=Math.min(1,E.stun+(D.stun||.3)*(behind?1.6:1)*ost); E.hitT=0;
  /* enough damage to one limb takes it off */
  const limb=key==='head'||key==='neck'?'head':key==='uarm'||key==='farm'?'arm'+side:key==='thigh'||key==='shin'||key==='foot'?'leg'+side:null;
  /* only a close shotgun blast or a heavy chop takes a limb off; pistol rounds and small knives don't */
  if(limb&&!E.cut[limb]&&(o.pellet||o.chop)){ const near=o.pellet?clamp((8-(o.dist??3))/4,0,1.5):1; /* buckshot only takes limbs up close */
    E.sev[limb]+=(weapon==='gun'?(limb==='head'?.55:key==='foot'?.25:.4):(limb==='head'?(key==='neck'?.36:.12):.3))*os*near; if(E.sev[limb]>=1) sever(E,limb,dir,!!o.pellet); }
  /* what he says */
  if(!E.headshot&&(!fatal||fatal==='throat')&&E.barkCd<1.2){ const L_=key==='neck'?E.lines.neck:weapon==='knife'?E.lines.stab:key==='thigh'||key==='shin'||key==='foot'?E.lines.leg:key==='uarm'||key==='farm'?E.lines.arm:E.lines.torso; bark(E,pick(L_),2.2); }
  /* the sound and the face of it */
  if(!E.dead&&!E.headshot){ if(fatal==='heart'){ vox(E,'gasp'); faceHold(E,'shock',3); }
    else if(key==='neck'){ vox(E,'choke'); faceHold(E,'choke',2.5); }
    else if(behind){ vox(E,'gasp',.6); faceHold(E,'shock',1.2); }
    else { vox(E,weapon==='knife'?(o.chop?'scream':'stabbed'):legHit||Math.random()<.55?'scream':'grunt'); faceHold(E,'agony',weapon==='gun'?.9:1.4); } }
  if(behind){ E.silent=true; if(!E.aware){ E.aware=true; E.st='kneel'; dropWeapon(E); } }
  else setAware(E,'hit');
  for(const O of enemies) if(O!==E&&!O.dead&&Math.hypot(O.pos[0]-E.pos[0],O.pos[1]-E.pos[1])<9&&!behind) setAware(O,'friend');
}
/* blast: a close shotgun load doesn't cut a limb off, it destroys it. Nothing flies away; it's just gone, in pieces, over the wall */
const PIN_AT={armL:'shL',armR:'shR',legL:'hipL',legR:'hipR',head:'neck'};
function sever(E,limb,dir,blast){
  const C_=CUTS[limb],B=E.B,J=E.J,S=J.skin; E.cut[limb]=true;
  const pieceIdx=new Set(C_.piece.map(n=>PI_[n])); for(const i of pieceIdx) E.sevP[i]=1;
  for(let q=0;q<B.cons.length;q+=4){ const a=B.cons[q],b=B.cons[q+1]; if(pieceIdx.has(a)!==pieceIdx.has(b)) B.cons[q+3]=0; }
  SEGS.forEach((sg,k)=>{ if(pieceIdx.has(sg[0])!==pieceIdx.has(sg[1])||blast&&pieceIdx.has(sg[0])) E.segOff.add(k); });
  /* skin: vertices shared across the cut go entirely to one side so nothing stretches; blasted, the piece's skin collapses into the stump */
  const pb=new Set(C_.bones.map(b=>BONES.indexOf(b))),si=BONES.indexOf(C_.stump);
  for(let v=0;v<S.bw.length/2;v++){ const b0=S.bi[v*2],b1=S.bi[v*2+1],w0=S.bw[v*2],w1=S.bw[v*2+1]; const in0=w0>0&&pb.has(b0),in1=w1>0&&pb.has(b1);
    if(in0!==in1&&w0>0&&w1>0){ const keepPiece=C_.keep==='piece'&&!blast,useFirst=keepPiece?in0:!in0; S.bi[v*2]=useFirst?b0:b1; S.bw[v*2]=1; S.bw[v*2+1]=0; }
    if(blast){ const c0=S.bi[v*2],x0=S.bw[v*2],x1=S.bw[v*2+1]; if(x0>0&&pb.has(c0)&&(x1===0||pb.has(S.bi[v*2+1]))){ S.bi[v*2]=si; S.bw[v*2]=1; S.bw[v*2+1]=0; S.bindP.set(S.bpos[si],v*3); } } }
  /* the stump on the body and the end of the piece */
  const stumpB=J[C_.stump]; let lp,rot;
  if(limb.startsWith('arm')){ lp=J[C_.bones[0]].p.slice(); lp[0]+=C_.side*.03; rot=[0,C_.side*Math.PI/2,0]; }
  else if(limb.startsWith('leg')){ lp=[J[C_.bones[0]].p[0],-.12,0]; rot=[Math.PI/2,0,C_.side*.4]; }
  else { lp=[0,.125,.006]; rot=[-Math.PI/2,0,0]; }
  const sn=N(stumpB,lp[0],lp[1],lp[2],rot[0],rot[1],rot[2]); mk(plane(limb==='head'?.12:.13,limb==='head'?.12:.13),mStump,sn);
  const nrm=limb.startsWith('arm')?[C_.side,0,0]:limb.startsWith('leg')?norm3([C_.side*.4,-1,0]):[0,1,0];
  const at=X_(B,C_.piece.map(n=>PI_[n])[0]);
  /* weapons: the hand that held it is gone; a two-handed grip becomes one hand */
  if(limb==='armR'||limb==='armL'){ E.hp[limb]=0; const sd=limb.slice(-1);
    if(E.wpnHeld){ if(E.wpnHand===sd){ if(blast) dropWeapon(E); else E.wpnHeld=false; } else if(E.C.twoHand&&!E.oneHand) switchHand(E,E.wpnHand); }
    if(!E.dead&&(E.st==='alert'||E.st==='idle')){ E.st='kneel'; E.aware=true; } }
  if(limb.startsWith('leg')) E.hp[limb]=0;
  if(blast){
    const boneN=new Set(BONES.map(b=>J[b])); for(const b of C_.bones) for(const k of J[b].kids) if(!boneN.has(k)) k.vis=false;
    E.wounds=E.wounds.filter(w=>!C_.bones.includes(w.bone));
    const a=PI_[PIN_AT[limb]]; E.pins=E.pins||[]; C_.piece.forEach((n,k)=>E.pins.push({i:PI_[n],a,off:limb==='head'?[0,.01*(k+1),0]:[0,-.012*(k+1),0]})); E.pinM=E.pinM||new Uint8Array(NP); for(const n of C_.piece){ if(!E.pinM[PI_[n]]){ E.pinM[PI_[n]]=1; E.pinN=(E.pinN||0)+1; } }
    E.wounds.push({bone:C_.stump,lp,ln:nrm,rate:limb==='head'?9:limb.startsWith('leg')?5:4.2,art:true,part:'stump',acc:0}); E.spurtT=.6; E.blood-=limb==='head'?40:12;
    goreBlast(at,dir,limb==='head'?1.6:limb.startsWith('leg')?1.2:1);
  } else {
    const pr=J[C_.bones[0]],pn=N(pr,0,limb==='head'?.0:.055,limb==='head'?.02:0,limb==='head'?Math.PI/2:-Math.PI/2,0,0); mk(plane(.11,.11),mStump,pn);
    E.wounds.push({bone:C_.stump,lp,ln:nrm,rate:limb==='head'?9:limb.startsWith('leg')?4.2:3.4,art:true,part:'stump',acc:0});
    E.wounds.push({bone:C_.bones[0],lp:[0,.05,0],ln:[0,1,0],rate:.5,art:false,part:'piece',acc:0,piece:true});
    spray(at,dir,50,3.4,.7,'bright',.013); spray(at,[0,1,0],24,2.4,.9,'dark',.022);
    for(const i of pieceIdx) kickV(B,i,v3.add(v3.sc(dir,limb==='head'?3.5:2.4),[0,1.6,0]),H); }
  /* rotation memory for driving the loose piece */
  if(E.M){ const Mr=E.M[C_.bones[0]]; E.Rcut[limb]=rotOf(Mr); }
  if(limb==='head'){ E.headW=[rnd(-9,9),rnd(-4,4),rnd(-9,9)]; E.headshot=true; }
  if(!E.dead&&limb!=='head'){ bark(E,pick(['AAAAH—','*screaming*','My— my arm— where\'s my—','No no no no—']),2.6); vox(E,'cry'); faceHold(E,'shock',1.6); setTimeout(()=>faceHold(E,'agony',4),1600); }
}
/* what a point-blank load does to a limb: a burst of meat and bone, a red mist, the wall behind painted */
function goreBlast(at,dir,k=1){
  spray(at,dir,Math.round(70*k),4.6,.55,'bright',.012); spray(at,v3.sc(dir,-1),Math.round(18*k),1.8,.9,'dark',.014);
  for(let i=0;i<Math.round(16*k);i++) emit(at,v3.add(v3.sc(norm3(v3.add(dir,[rnd(-.6,.6),rnd(-.3,.7),rnd(-.6,.6)])),rnd(1.5,5.5)),[0,rnd(.3,1.4),0]),rnd(.016,.038),'gib',20);
  for(let i=0;i<Math.round(7*k);i++) emit(at,v3.add(v3.sc(norm3(v3.add(dir,[rnd(-.8,.8),rnd(-.2,.8),rnd(-.8,.8)])),rnd(2,6)),[0,rnd(.5,1.5),0]),rnd(.007,.015),'bone',20);
  for(let i=0;i<Math.round(40*k);i++) emit(v3.add(at,[rnd(-.12,.12),rnd(-.12,.12),rnd(-.12,.12)]),[dir[0]*rnd(.2,1)+rnd(-.5,.5),rnd(-.2,.6),dir[2]*rnd(.2,1)+rnd(-.5,.5)],rnd(.004,.008),'bright',1.5); /* mist */
  const w=rayRoom(at,dir); if(w.t<4){ const c=v3.add(v3.add(at,v3.sc(dir,w.t)),v3.sc(w.n,.005)),up=w.n[1]===0;
    for(let i=0;i<3;i++){ const j=v3.add(c,up?[w.n[2]*rnd(-.3,.3),rnd(-.35,.25),-w.n[0]*rnd(-.3,.3)]:[rnd(-.3,.3),0,rnd(-.3,.3)]); addDecal(DEC.splat,j,w.n,rnd(.22,.45)*k,260,up?rnd(.4,.8)*k:undefined); } }
  addDecal(DEC.splat,[at[0]+dir[0]*.7,.003,at[2]+dir[2]*.7],[0,1,0],.45*k,260);
  sfx('gore'); if(XR.on){ buzz('right',1,160); buzz('left',.7,120); } }
function die(E){ if(E.dead) return; if(!E.headshot&&!E.cut.head) vox(E,'rattle'); E.dead=true; E.st='dead'; E.deadT=0; dropWeapon(E); E.face='sleep'; E.J.headMesh.mesh.mats[0]=E.C.faceM.sleep; E.J.headMesh.mesh.runs=null; E.barkT=0;
  for(const O of enemies) if(O!==E&&!O.dead&&!E.silent&&O.barkCd<=0&&Math.random()<.8){ bark(O,pick(O.lines.friend(E.name))); break; } }

/* weapons that fall out of hands */
function dropWeapon(E){ if(!E.wpnHeld||!E.C.wpn) return; E.wpnHeld=false; const w=E.C.wpn,J=E.J;
  const Wm=wpnMat(E); w.vis=false;
  const i=PI_['hd'+E.wpnHand]*3,v=[(E.B.x[i]-E.B.p[i])/H,(E.B.x[i+1]-E.B.p[i+1])/H,(E.B.x[i+2]-E.B.p[i+2])/H];
  const key=E.wkey,W=WPN[key]; addPickup(newItem(key,W.gun?Math.max(1,Math.round(W.mag*rnd(.25,.75))):undefined),Wm,v,[rnd(-4,4),rnd(-4,4),rnd(-4,4)]);
  setGrip(J,'R',false); setGrip(J,'L',false); }

/* ---------- enemy brain ---------- */
function think(E,dt,t){
  const B=E.B,pel=X_(B,PI_.pelvis),toP=[PL.x-pel[0],PL.z-pel[2]],dist=Math.hypot(toP[0],toP[1]);
  E.settle=Math.max(0,(E.settle||0)-dt); E.barkT-=dt; E.barkCd-=dt; E.stun=Math.max(0,E.stun-dt*(E.dead?0:.9)); E.hitT+=dt; E.near=E.near?dist<3.9:dist<3.1;
  if(E.dead){ E.deadT+=dt; return; }
  if(E.koT&&E.st==='down'&&E.downT<E.koT) E.stun=1; /* out cold */
  /* blood and the heart */
  const bleed=E.wounds.reduce((s,w)=>s+(w.piece?0:w.rate),0)*(.3+.7*E.blood/100);
  E.blood=Math.max(0,E.blood-bleed*dt*(E.tough||(KSTAT[E.kind]&&KSTAT[E.kind].tough)||1)*(GAME.bleedK||1)); E.cons=clamp((E.blood-12)/46,0,1);
  const hr=1.15+(1-E.blood/100)*1.9+(E.aware?.4:0); E.heartPh+=dt*hr; if(E.heartPh>=1){ E.heartPh-=1; if(E.wounds.some(w=>w.art)) E.spurtT=.13; }
  E.spurtT-=dt;
  if(E.dieT!=null) E.dieT-=dt;
  if(E.blood<=11||E.headshot||E.dieT!=null&&E.dieT<=0){ die(E); return; }
  /* awareness by sight */
  E.sightT=(E.sightT||0)-dt; if(E.sightT<=0){ E.sightT=.2; E.canSee=sightClear(X_(B,PI_.head),[PL.x,1.55,PL.z]); }
  if(!E.aware&&GAME.started){ const fwd=[Math.sin(E.hd),Math.cos(E.hd)],facing=(toP[0]*fwd[0]+toP[1]*fwd[1])/(dist||1); if(E.canSee&&(dist<1.1&&facing>-.2||dist<.45||(dist<6&&facing>.45))) setAware(E,'see'); } /* you can get right behind someone */
  const legs=Math.min(E.hp.legL,E.hp.legR);
  /* state changes */
  if(E.st==='idle'||E.st==='alert'){
    if(legs<.5){ toDown(E); if(E.barkCd<=0) bark(E,pick(E.lines.leg)); }
    else if(E.blood<58){ E.st='kneel'; dropWeapon(E); }
    else { if(pel[1]<E.fightY*.62) E.lowT+=dt; else E.lowT=0; if(E.lowT>.35){ toDown(E,true); E.knocked=true; } } }
  else if(E.st==='kneel'){ if(E.blood<36||legs<.3) toDown(E); else if(pel[1]<.25) E.lowT+=dt; }
  else if(E.st==='down'){ E.downT+=dt; E.fallT=Math.max(0,(E.fallT||0)-dt);
    if(E.knocked&&legs>=.5&&E.blood>60&&E.downT>(E.koT||2.4)){ E.koT=0; E.st='alert'; E.rise=0; E.knocked=false; E.pos=[pel[0],pel[2]]; E.hd=Math.atan2(toP[0],toP[1]); } }
  if(E.wpnHeld&&E.hp['arm'+E.wpnHand]<.45){ const o=E.wpnHand==='R'?'L':'R';
    if(E.hp['arm'+o]>=.45&&!E.cut['arm'+o]) switchHand(E,o); else dropWeapon(E); }
  E.rise=Math.min(1,E.rise+dt/1.3);
  /* moving */
  E.crawlF=null; E.walkAmt=lerp(E.walkAmt,0,Math.min(1,dt*6));
  if(E.st==='alert'||E.st==='idle'||E.st==='kneel'){
    const k=Math.min(1,dt*(E.grabbed?6:E.st==='alert'?1:2.5)); E.pos[0]=lerp(E.pos[0],pel[0],k); E.pos[1]=lerp(E.pos[1],pel[2],k);
    if(E.st==='kneel'){ const want=Math.atan2(toP[0],toP[1]); let dh=want-E.hd; while(dh>Math.PI) dh-=Math.PI*2; while(dh<-Math.PI) dh+=Math.PI*2; E.hd+=clamp(dh,-dt,dt); } }
  if(E.st==='alert'){
    if(armed(E)&&!E.oneHand&&E.M){ /* line the gun up on you: blade the body and lean until the barrel, not the chest, points at you */
      const g=gunRay(E),tp=norm3(v3.sub([PL.x,1.45,PL.z],g.mz)); let ye=Math.atan2(tp[0],tp[2])-Math.atan2(g.d[0],g.d[2]); ye=Math.atan2(Math.sin(ye),Math.cos(ye));
      const k=Math.min(1,dt*2.5); E.aimYaw=clamp((E.aimYaw||0)+ye*k,-.7,.7); E.aimPit=clamp((E.aimPit||0)+(Math.asin(tp[1])-Math.asin(g.d[1]))*k,-.35,.35); }
    const want=(!E.canSee&&E.moveDir&&dist>2?Math.atan2(E.moveDir[0],E.moveDir[2]):Math.atan2(toP[0],toP[1]))+(E.wpnHeld&&!E.oneHand&&E.canSee?E.aimYaw||0:0); let dh=want-E.hd; while(dh>Math.PI) dh-=Math.PI*2; while(dh<-Math.PI) dh+=Math.PI*2; const tr=E.stun>.3?0:2*(1-E.stun); E.hd+=clamp(dh,-tr*dt,tr*dt);
    const KS=KSTAT[E.kind]||{},keep=armed(E)?KS.keep:1.25;
    if(!E.seated&&!GAME.aiOff&&(dist>keep+.15||!E.canSee)&&E.atkT<0&&E.stun<.4&&!E.grabbed){ const melee=!armed(E),sp=(melee?lerp(1.2,KS.run||2.6,clamp((dist-1.7)/2.2,0,1)):!E.canSee&&dist>6?1.6:.85)*(.55+.45*legs)*E.rise; /* blades charge at you; they ease off in the last couple of metres so they arrive swinging, not sliding */
      E.runAmt=lerp(E.runAmt||0,clamp((sp-1.3)/1.6,0,1),Math.min(1,dt*5)); const dir=navDir(E.pos[0],E.pos[1],PL.x,PL.z); E.moveDir=dir;
      { const D=doorNear(E.pos[0],E.pos[1],.9); if(D&&D.state==='closed'){ setDoor(D,'open'); sfx('door',.5); } } /* people who live here just open doors */
      E.pos[0]+=dir[0]*sp*dt; E.pos[1]+=dir[2]*sp*dt; E.walkAmt=lerp(E.walkAmt,1,Math.min(1,dt*8)); E.walkPh+=dt*(sp<1.3?sp*6.2:7.2+sp*.9); }
    else E.runAmt=lerp(E.runAmt||0,0,Math.min(1,dt*6));
    pushOutXZ(E.pos,.28,'walker');
    for(const O of enemies) if(O!==E){ const op=O.st==='alert'||O.st==='idle'?O.pos:[O.B.x[0],O.B.x[2]],R=O.st==='alert'||O.st==='idle'?.7:.95,dx=E.pos[0]-op[0],dz=E.pos[1]-op[1],d=Math.hypot(dx,dz); if(d<R&&d>1e-3){ E.pos[0]+=dx/d*(R-d)*.5; E.pos[1]+=dz/d*(R-d)*.5; } }
    /* attacks */
    E.atkCd-=dt;
    if(armed(E)){ if(E.burstN>0){ E.burstT-=dt; if(E.burstT<=0){ E.burstN--; E.burstT=.085; enemyShoot(E,true); } }
      else if(E.canSee&&!E.grabbed&&E.atkCd<=0&&E.stun<.3&&dist<KS.range){ E.atkCd=rnd(KS.cd[0],KS.cd[1]); if(enemyShoot(E)===false) E.atkCd=.25; else if(KS.burst){ E.burstN=KS.burst-1; E.burstT=.085; } } }
    else if(E.atkT<0&&E.atkCd<=0&&dist<keep+.35&&E.stun<.3){ E.atkT=0; }
    if(E.atkT>=0){ const before=E.atkT; E.atkT+=dt; if(before<.44&&E.atkT>=.44){ const f=[Math.sin(E.hd),Math.cos(E.hd)]; if(dist<1.75&&(toP[0]*f[0]+toP[1]*f[1])/(dist||1)>.5) hurtPlayer(E.wpnHeld?(KSTAT[E.kind].melee||9):7); }
      if(E.atkT>.7){ E.atkT=-1; E.atkCd=rnd(1.4,2.4); } } }
  else E.atkT=-1;
  if(E.st==='down'){ E.modeT=(E.modeT||0)-dt; const prevMode=E.downMode;
    const Rh=frameFrom(X_(B,PI_.hipL),X_(B,PI_.hipR),pel,X_(B,PI_.chest)),up=Rh[2][1];
    const canMove=E.cons>.35&&Math.max(E.hp.armL,E.hp.armR)>.35&&!E.wounds.some(w=>w.part==='neck');
    if(E.knocked||E.downT<1.3) E.downMode='writhe'; /* first lie there and hurt, then start dragging */
    else if(dist<2.2&&E.cons>.3&&!E.wounds.some(w=>w.part==='neck'&&!w.piece)) E.downMode='downbeg';
    else if(canMove&&dist<6){ E.downMode=up>(E.downMode==='crawl'?.45:.2)?'scoot':up<(E.downMode==='scoot'?-.45:-.2)?'crawl':(E.downMode==='scoot'||E.downMode==='crawl'?E.downMode:'writhe');
      if(E.downMode!=='writhe'){ const away=norm3([-toP[0],0,-toP[1]]),k=Math.sin((t+E.t0)*2.4); E.crawlF=[away[0],away[2],Math.max(0,E.downMode==='crawl'?Math.abs(k):Math.abs(Math.sin((t+E.t0)*2.6)))*.55*E.cons]; } }
    else E.downMode='writhe';
    if(prevMode&&E.downMode!==prevMode){ if(E.modeT>0) E.downMode=prevMode; else E.modeT=1.6; }
    if(E.downMode==='writhe'||E.downMode==='downbeg') E.crawlF=null; }
  /* looking at the player */
  if(E.Rs&&(E.st==='alert'||E.st==='kneel'||E.st==='down')){ const l=mtv(E.Rs,norm3([toP[0],0,toP[1]])); E.lookYaw=lerp(E.lookYaw,clamp(Math.atan2(l[0],l[2]),-1,1),Math.min(1,dt*5)); }
  else E.lookYaw=lerp(E.lookYaw,0,Math.min(1,dt*3));
  /* talking */
  if(E.barkCd<=0&&GAME.barkGlobal<=0){
    const neck=E.wounds.some(w=>w.part==='neck');
    if(neck&&E.wounds.length) bark(E,pick(E.lines.neck));
    else if(E.cons<.4&&E.wounds.length) bark(E,pick(E.lines.dying),3.2);
    else if((E.st==='kneel'||E.st==='down')&&E.wounds.some(w=>w.part==='neck'&&!w.piece)) bark(E,pick(E.lines.neck));
    else if((E.st==='kneel'||E.st==='down')&&E.near) bark(E,Math.random()<.35?E.extra:pick(E.lines.beg));
    else if(E.st==='down'&&E.downMode!=='writhe'){ const f=enemies.filter(o=>o!==E); bark(E,Math.random()<.5&&f.length?pick(E.lines.call(pick(f).name)):pick(E.lines.crawl)); }
    if(E.barkT>0) GAME.barkGlobal=.8; }
  E.aimK=lerp(E.aimK||0,(E.st==='alert'?1:0)*(1-Math.min(E.stun,.8)*.7),Math.min(1,dt*3.5)); /* bring the long gun up when fighting, drop it when rocked */
  voiceTick(E,dt,dist);
  /* face */
  let face=E.st==='kneel'&&E.near&&!E.wounds.some(w=>w.part==='neck')||E.downMode==='downbeg'&&E.st==='down'?'beg':(E.wounds.length||E.stun>.35)?'hurt':'fight';
  if(E.faceHold&&E.faceHold.t>0){ E.faceHold.t-=dt; face=E.faceHold.f; }
  else if(E.impaled>0) face='agony';
  else if(E.grabbed&&E.chokeT>0||E.wounds.some(w=>w.part==='neck'&&!w.piece)) face='choke';
  else if(E.cons<.35&&E.wounds.length) face='shock';
  if(face!==E.face){ E.face=face; E.J.headMesh.mesh.mats[0]=E.C.faceM[face]; E.J.headMesh.mesh.runs=null; }
}
function switchHand(E,s){ /* the good hand takes the weapon; a two-handed grip becomes one-handed */
  const w=E.C.wpn,J=E.J; setParent(w,J['hand'+s]); const f=E.C.twoHand?{p:[.036,-.214,.04],r:[Math.PI/2,0,0]}:E.C.wFight; w.p=[-f.p[0],f.p[1],f.p[2]]; w.r=[f.r[0],-f.r[1],-f.r[2]];
  E.wpnHand=s; E.oneHand=true; setGrip(J,s,true); setGrip(J,s==='R'?'L':'R',false); E.atkCd=Math.max(E.atkCd,1.2);
  if(E.barkCd<=0) bark(E,pick(['*grunts* —fuck—','I can still shoot you—','Hnn— other hand—']),2); }
function toDown(E,hard){ /* unless knocked flat, they buckle: held up on the way down to a knee, then let go */
  E.st='down'; E.downT=0; E.settle=Math.max(E.settle||0,1.4); dropWeapon(E);
  const B=E.B,Rh=frameFrom(X_(B,PI_.hipL),X_(B,PI_.hipR),X_(B,PI_.pelvis),X_(B,PI_.chest)),fw=Rh[2];
  E.pos=[B.x[0],B.x[2]]; if(Math.hypot(fw[0],fw[2])>.3){ /* keep the heading he had unless his hips really turned: snapping to a noisy hip frame yanks the whole body round */
    const h2=Math.atan2(fw[0],fw[2]),d=Math.atan2(Math.sin(h2-E.hd),Math.cos(h2-E.hd)); if(Math.abs(d)>.7) E.hd+=d*.5; } E.fallT=hard?0:.8; }
/* the weapon's world matrix: pistols ride in the hand, long guns are braced on the chest (two-handed hold) */
function wpnMat(E){ const w=E.C.wpn,loc=m4.make(),Wm=m4.make(); m4.compose(loc,w.p,w.r,w.s); const pb=BONES.find(b=>E.J[b]===w.par)||('hand'+E.wpnHand); m4.mul(Wm,E.M[pb],loc); return Wm; }
function gunRay(E){ const Wm=wpnMat(E),W=WPN[E.wkey]; const mz=mulP(Wm,W.muzzle); return {mz,d:norm3(v3.sub(mz,mulP(Wm,[0,W.axisY,0])))}; }
function enemyShoot(E,inBurst){
  const g=gunRay(E),mz=g.mz,KS=KSTAT[E.kind],W=WPN[E.wkey];
  if(!inBurst&&v3.dot(g.d,norm3(v3.sub([PL.x,1.45,PL.z],mz)))<Math.cos(.6)) return false; /* not on target yet: hold fire instead of shooting the ceiling */
  if(!inBurst){ const blk=bodyInLine(mz,[PL.x,1.4,PL.z],E); if(blk&&!blk.E.dead&&Math.random()<.75){ if(E.barkCd<=0) bark(E,blk.E.grabbed?pick([`Let ${blk.E.name} go!`,'Let him go, man!','I can\'t get a shot—']):'Move!',1.6); return false; } } /* friends in the way: mostly hold fire */
  GAME.eShots=(GAME.eShots||0)+1; muzzle(mz); sfx(W.snd||'gun',.5);
  const toPl=Math.hypot(...v3.sub([PL.x,1.45,PL.z],mz)),n=KS.shotgun?6:1,hurtArm=Math.min(E.hp.armL,E.hp.armR)>=.45?1:.55;
  /* how likely a shot finds you: better close, worse far, worse with a hurt arm, worse while you're in bullet time? no: bullet time is yours */
  const pHit=clamp(KS.acc*(GAME.accK||1)*hurtArm*(KS.shotgun?clamp(1.6-toPl/5,0,1.4):clamp(1.35-toPl/14,.4,1.2)),0,.95);
  let dmg=0;
  for(let k=0;k<n;k++){ const tgt=[PL.x+rnd(-.35,.35),1.45+rnd(-.3,.25),PL.z+rnd(-.35,.35)],d=norm3(v3.add(norm3(v3.sub(tgt,mz)),KS.shotgun?[rnd(-.06,.06),rnd(-.05,.05),rnd(-.06,.06)]:[0,0,0]));
    const bl=rayBoxes(mz,d,toPl); if(bl){ addDecal(DEC.hole,v3.add(v3.add(mz,v3.sc(d,bl.t)),v3.sc(bl.n,.004)),bl.n,.025,140); continue; }
    const bb=bodyInLine(mz,v3.add(mz,v3.sc(d,toPl)),E); if(bb){ hitEnemy(bb.E,bb.seg,bb.p,bb.dir,'gun',{bleed:KS.shotgun?.5:1,sever:KS.shotgun?.7:1,pellet:!!KS.shotgun}); continue; } /* the body in front takes it */
    if(Math.random()<pHit) dmg+=KS.shotgun?KS.dmg/n*clamp(1.4-toPl/7,.25,1.4):KS.dmg;
    else { const r=rayRoom(mz,d); addDecal(DEC.hole,v3.add(v3.add(mz,v3.sc(d,r.t)),v3.sc(r.n,.004)),r.n,.025,140); } }
  if(dmg>0) hurtPlayer(Math.round(dmg));
  return true; }
let flash={t:0,pos:[0,0,0]};
function muzzle(p){ flash={t:.06,pos:p,big:false}; }
/* a close load hits like a car: he's driven back off his feet, straight back (no spin, no hop) */
function shotgunShove(E,d,n,t){ if(n<3||t>5.5) return; const fl=norm3([d[0],0,d[2]]),k=clamp((5.5-t)/3.5,0,1.2)*(.9+.22*n);
  for(let i=0;i<NP;i++){ const nm=PD[i][0],w=/^(toe|an)/.test(nm)?.25:/^kn/.test(nm)?.6:1; kickV(E.B,i,v3.sc(fl,k*w*1.5),H); }
  E.settle=Math.max(E.settle||0,1.2); if(!E.dead){ E.stun=Math.min(1,E.stun+.35*k); if(n>=6&&t<2.6&&(E.st==='alert'||E.st==='idle')){ toDown(E,true); E.knocked=true; E.koT=rnd(2.5,4); } } }

/* ---------- player actions ---------- */
function shoot(){ useRight(); }
function reload(){ reloadHand(HANDS.R); }
function stab(){ flatSwing(HANDS.L); }
function kick(){ if(!GAME.started||PL.dead||PL.kickCd>0) return; PL.kickCd=.8; const {f,eye}=camBasis(); const fl=norm3([f[0],0,f[2]]);
  let best=null; for(const E of enemies){ const pel=X_(E.B,PI_.pelvis),d=Math.hypot(pel[0]-PL.x,pel[2]-PL.z),dir=norm3([pel[0]-PL.x,0,pel[2]-PL.z]); if(d<1.45&&v3.dot(dir,fl)>.55&&(!best||d<best.d)) best={E,d}; }
  if(!best){ const D=doorNear(PL.x+fl[0]*.7,PL.z+fl[2]*.7,.95); if(D&&D.state==='closed'){ kickDoor(D); return; } sfx('swish'); return; } const E=best.E; sfx('kick');
  for(const i of [PI_.pelvis,PI_.chest,PI_.hipL,PI_.hipR,PI_.neck]) kickV(E.B,i,v3.add(v3.sc(fl,5.5),[0,.6,0]),H);
  E.stun=Math.min(1,E.stun+1.1); setAware(E,'kick'); if(E.st==='kneel'){ toDown(E); } }
function hurtPlayer(d){ if(PL.dead||GAME.god) return; d*=GAME.dmgK||1; PL.hp-=d; PL.hurtT=0; XR.flash=.35; if(XR.on){ buzz('left',1,120); buzz('right',1,120); } $('flash').classList.remove('on'); void $('flash').offsetWidth; $('flash').classList.add('on'); screenBlood(2); sfx('hurt');
  if(PL.hp<=0){ PL.hp=0; PL.dead=true; showMsg('YOU DIED','Reset to try the floor again.'); } }

/* ---------- screen + sound ---------- */
function screenBlood(n){ const box=$('sblood'); for(let i=0;i<n;i++){ const g=document.createElement('b'); const cx=rnd(4,92),cy=rnd(4,80);
  g.style.cssText=`left:${cx}%;top:${cy}%`; const k=3+(Math.random()*6|0);
  for(let j=0;j<k;j++){ const s=document.createElement('i'),sz=j===0?rnd(10,26):rnd(3,9),a=Math.random()*6.28,d=j===0?0:rnd(8,34);
    s.style.cssText=`left:${Math.cos(a)*d}px;top:${Math.sin(a)*d}px;width:${sz}px;height:${sz*rnd(.8,1.5)}px`; g.append(s); }
  box.append(g); setTimeout(()=>g.remove(),5000); } }
function hitMarker(){ const x=$('xhair'); x.classList.remove('hit'); void x.offsetWidth; x.classList.add('hit'); }
function showMsg(h,p){ $('msgH').textContent=h; $('msgP').textContent=p; $('msg').hidden=false; }
let AC=null,NOISE=null;
function audio(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); const b=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; NOISE=b; }catch(e){ AC=null; } } if(AC&&AC.state==='suspended') AC.resume().catch(()=>{}); return AC; }
function sfx(type,vol=1){ const ac=audio(); if(!ac) return; const t=ac.currentTime,out=ac.createGain(); out.gain.value=vol*(GAME.slow?.8:1); out.connect(ac.destination);
  const noise=(f0,f1,dur,g,q=.7,kind='lowpass')=>{ const s=ac.createBufferSource(); s.buffer=NOISE; s.playbackRate.value=GAME.slow?.6:1; const fl=ac.createBiquadFilter(); fl.type=kind; fl.Q.value=q; fl.frequency.setValueAtTime(f0,t); fl.frequency.exponentialRampToValueAtTime(f1,t+dur); const gg=ac.createGain(); gg.gain.setValueAtTime(g,t); gg.gain.exponentialRampToValueAtTime(.001,t+dur); s.connect(fl); fl.connect(gg); gg.connect(out); s.start(t); s.stop(t+dur+.02); };
  const tone=(f0,f1,dur,g)=>{ const o=ac.createOscillator(); o.frequency.setValueAtTime(f0*(GAME.slow?.6:1),t); o.frequency.exponentialRampToValueAtTime(f1,t+dur); const gg=ac.createGain(); gg.gain.setValueAtTime(g,t); gg.gain.exponentialRampToValueAtTime(.001,t+dur); o.connect(gg); gg.connect(out); o.start(t); o.stop(t+dur+.02); };
  if(type==='gun'){ noise(5000,280,.32,.9); tone(120,38,.18,.9); }
  else if(type==='stab'){ noise(1400,200,.16,.7,3,'bandpass'); tone(110,50,.12,.6); }
  else if(type==='kick'){ tone(80,40,.16,.9); noise(600,120,.12,.6); }
  else if(type==='swish'){ noise(3000,900,.14,.25,2,'bandpass'); }
  else if(type==='click'){ tone(2200,1800,.03,.3); }
  else if(type==='reload'){ tone(1500,1200,.04,.25); setTimeout(()=>sfx('click'),900); }
  else if(type==='slowin'){ tone(220,55,.7,.5); noise(900,90,.7,.35); }
  else if(type==='slowout'){ tone(60,240,.35,.35); noise(150,1200,.3,.25); }
  else if(type==='heart'){ tone(58,40,.14,.55); setTimeout(()=>{ if(GAME.slow) tone2(); },180); function tone2(){ const a=audio(); if(!a) return; const o=a.createOscillator(),gg=a.createGain(),t2=a.currentTime; o.frequency.setValueAtTime(52,t2); o.frequency.exponentialRampToValueAtTime(36,t2+.12); gg.gain.setValueAtTime(.4,t2); gg.gain.exponentialRampToValueAtTime(.001,t2+.12); o.connect(gg); gg.connect(a.destination); o.start(t2); o.stop(t2+.14); } }
  else if(type==='revolver'){ noise(4200,220,.4,1); tone(95,32,.24,1); }
  else if(type==='shotgun'){ noise(3400,110,.75,1.4); tone(64,24,.55,1.5); tone(120,40,.2,1); noise(9000,2500,.06,.7,1,'highpass'); setTimeout(()=>sfx('echo',.55),85); setTimeout(()=>sfx('echo',.3),190); setTimeout(()=>sfx('echo',.14),330); }
  else if(type==='echo'){ noise(1400,120,.45,.55); tone(55,30,.3,.35); } /* the corridor answers */
  else if(type==='pumpback'){ noise(2600,900,.07,.6,3,'bandpass'); tone(900,650,.045,.45); }
  else if(type==='pumpfwd'){ noise(1800,700,.08,.7,3,'bandpass'); tone(620,480,.05,.55); setTimeout(()=>sfx('click',.9),40); }
  else if(type==='shellhit'){ tone(2600,2350,.05,.25); tone(3500,3300,.04,.15); }
  else if(type==='stick'){ noise(900,140,.2,1,2,'bandpass'); tone(70,38,.16,.9); noise(300,80,.25,.5); }
  else if(type==='rip'){ noise(2400,260,.38,.9,1.5,'bandpass'); noise(600,90,.35,.7); tone(90,50,.12,.4); }
  else if(type==='bump'){ tone(130,85,.06,.35); }
  else if(type==='bash'){ tone(78,34,.15,1); noise(1100,150,.13,.85); tone(430,260,.05,.35); }
  else if(type==='gore'){ tone(52,26,.4,1.2); noise(1300,130,.55,1.1,1); noise(420,70,.7,.9); setTimeout(()=>{ const a=audio(); if(a) sfx('splat',.7); },110); }
  else if(type==='splat'){ noise(800,120,.25,.8,1.2); }
  else if(type==='smg'){ noise(6000,500,.12,.6); tone(150,60,.08,.5); }
  else if(type==='punch'){ tone(90,45,.1,.9); noise(500,140,.08,.7); }
  else if(type==='chop'){ noise(1100,160,.2,.9,2,'bandpass'); tone(85,40,.16,.8); }
  else if(type==='glass'){ noise(7000,2500,.3,.6,1.5,'highpass'); tone(2400,1900,.08,.2); }
  else if(type==='shell'){ tone(1700,1300,.05,.3); }
  else if(type==='pump'){ noise(1500,500,.1,.5,2,'bandpass'); setTimeout(()=>{ const a=audio(); if(a) sfx('click',.8); },120); }
  else if(type==='grab'){ noise(700,200,.12,.5,1.2); tone(140,90,.08,.3); }
  else if(type==='door'){ noise(400,120,.35,.35,1.5); tone(90,60,.3,.25); }
  else if(type==='doorkick'){ tone(70,35,.25,1); noise(900,90,.4,.9); }
  else if(type==='hurt'){ tone(160,60,.25,.5); noise(800,100,.2,.4); } }

/* ---------- viewmodel ---------- */
function placeVM(node,pos,f,u,r,pitch){ const c=Math.cos(pitch),s=Math.sin(pitch),F=v3.add(v3.sc(f,c),v3.sc(u,s)),U=v3.sub(v3.sc(u,c),v3.sc(f,s)); node.p=pos; node.r=eul([v3.cross(U,F),U,F]); }

/* ---------- game setup ---------- */
function resetGame(){ restartLevel(); }
/* ---------- input ---------- */
const isTouch=matchMedia('(pointer: coarse)').matches;
document.body.classList.toggle('touch',isTouch);
addEventListener('keydown',e=>{ KEYS[e.code]=true; if(!GAME.started) return;
  if(e.code==='KeyF') stab(); else if(e.code==='KeyE') kick(); else if(e.code==='KeyR') reload(); else if(e.code==='KeyT') toggleSlow();
  else if(/^Digit[1-8]$/.test(e.code)){ const k=WPN_KEYS[+e.code.slice(5)-1]; equip(HANDS.R,k==='fists'?null:newItem(k)); }
  else if(e.code==='KeyG'){ if(!flatPickup()) flatGrab(); }
  else if(e.code==='KeyQ'&&HANDS.L.grab){ endGrab(HANDS.L.grab,v3.add(v3.sc(camBasis().f,6),[0,1,0])); }
  else if(e.code==='KeyQ'&&HANDS.R.item){ HANDS.R.vel=v3.sc(camBasis().f,4); grabOrDrop(HANDS.R); } });
addEventListener('mousedown',e=>{ if(e.button===0) KEYS.Mouse0=true; }); addEventListener('mouseup',e=>{ if(e.button===0) KEYS.Mouse0=false; });
addEventListener('keyup',e=>{ KEYS[e.code]=false; });
function toggleSlow(){ GAME.slow=!GAME.slow; sfx(GAME.slow?'slowin':'slowout'); if(typeof MUSIC!=='undefined') try{ MUSIC.setSlow(GAME.slow); }catch(_){} $('bSlow').setAttribute('aria-pressed',String(GAME.slow)); $('bSlowT').setAttribute('aria-pressed',String(GAME.slow)); }
let drag=null;
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{ if(!GAME.started) return; audio();
  if(e.pointerType==='mouse'){ if(!document.pointerLockElement){ try{ const p=cv.requestPointerLock(); if(p&&p.catch) p.catch(()=>{}); }catch(_){} }
    if(document.pointerLockElement){ if(e.button===0) shoot(); else if(e.button===2) stab(); return; }
    if(e.button===2){ stab(); return; } drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:0,mouse:true}; cv.setPointerCapture(e.pointerId); return; }
  if(e.clientX<innerWidth*.42&&!stick.id){ stick.id=e.pointerId; stick.x0=e.clientX; stick.y0=e.clientY; stick.dx=0; stick.dy=0; $('stick').style.cssText=`left:${e.clientX-55}px;top:${e.clientY-55}px`; $('stick').hidden=false; }
  else drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:0}; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove',e=>{
  if(document.pointerLockElement&&e.pointerType==='mouse'){ PL.yaw-=e.movementX*.0023; PL.pitch=clamp(PL.pitch-e.movementY*.0023,-1.35,1.35); return; }
  if(stick.id===e.pointerId){ stick.dx=clamp((e.clientX-stick.x0)/50,-1,1); stick.dy=clamp((e.clientY-stick.y0)/50,-1,1); $('nub').style.transform=`translate(${stick.dx*34}px,${stick.dy*34}px)`; return; }
  if(drag&&drag.id===e.pointerId){ const dx=e.clientX-drag.x,dy=e.clientY-drag.y; drag.x=e.clientX; drag.y=e.clientY; drag.moved+=Math.abs(dx)+Math.abs(dy); const k=drag.mouse?.004:.0055; PL.yaw-=dx*k; PL.pitch=clamp(PL.pitch-dy*k,-1.35,1.35); } });
const endP=e=>{ if(stick.id===e.pointerId){ stick.id=null; stick.dx=stick.dy=0; $('stick').hidden=true; $('nub').style.transform=''; }
  if(drag&&drag.id===e.pointerId){ if(drag.mouse&&drag.moved<6) shoot(); drag=null; } };
cv.addEventListener('pointerup',endP); cv.addEventListener('pointercancel',endP);
const stick={id:null,x0:0,y0:0,dx:0,dy:0};
const bind=(id,fn)=>$(id).addEventListener('pointerdown',e=>{ e.preventDefault(); e.stopPropagation(); audio(); fn(); });
bind('bShoot',shoot); bind('bStab',stab); bind('bKick',kick); bind('bReload',reload); bind('bSlow',toggleSlow); bind('bSlowT',toggleSlow);
bind('bResetT',resetGame); bind('msgReset',resetGame);
$('start').addEventListener('click',()=>{ audio(); startRun(false); GAME.started=true; $('intro').hidden=true; document.body.classList.add('playing');
  if(!isTouch){ try{ const p=cv.requestPointerLock(); if(p&&p.catch) p.catch(()=>{}); }catch(_){} } });
document.addEventListener('pointerlockchange',()=>{ $('lockHint').hidden=!!document.pointerLockElement||isTouch||!GAME.started; });

/* ---------- loop ---------- */
function resize(){ const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(innerWidth*dpr)),h=Math.max(1,Math.round(innerHeight*dpr)); if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; } }
const clip=(p)=>{ const v=mulP(view,p),c=[proj[0]*v[0]+proj[4]*v[1]+proj[8]*v[2]+proj[12],proj[1]*v[0]+proj[5]*v[1]+proj[9]*v[2]+proj[13],proj[3]*v[0]+proj[7]*v[1]+proj[11]*v[2]+proj[15]]; return c; };
function update(dt,now){
  if(MENU.open&&MENU.pause){ menuTick(dt); return; }
  GAME.ts=lerp(GAME.ts,(GAME.slow?.22:1)*(GAME.tsBase||1),Math.min(1,dt*6)); const gdt=dt*GAME.ts; GAME.t+=gdt; GAME.barkGlobal-=gdt;
  if(GAME.started&&!PL.dead&&!XR.on){ let mx=(KEYS.KeyD||KEYS.ArrowRight?1:0)-(KEYS.KeyA||KEYS.ArrowLeft?1:0)+stick.dx,mz=(KEYS.KeyW||KEYS.ArrowUp?1:0)-(KEYS.KeyS||KEYS.ArrowDown?1:0)-stick.dy;
    const l=Math.hypot(mx,mz); if(l>1){ mx/=l; mz/=l; } const sp=2.6*(XR.moveK||1)*dt*Math.max(GAME.ts,.3),fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw),rx=Math.cos(PL.yaw),rz=-Math.sin(PL.yaw);
    PL.x+=(fx*mz+rx*mx)*sp; PL.z+=(fz*mz+rz*mx)*sp; collidePlayer(); }
  if(GAME.started&&!PL.dead){ PL.hurtT+=dt; if(PL.hurtT>3.5) PL.hp=Math.min(100,PL.hp+9*dt); }
  PL.kickCd-=dt; XR.flash=Math.max(0,XR.flash-dt);
  for(const h of [HANDS.L,HANDS.R]){ tickItem(h,dt); if(h.swingT>=0){ const hv=h.item&&WPN[h.item.key].heavy; h.swingT+=dt/(hv?.55:.34); if(!h.swingDone&&h.swingT>.42){ h.swingDone=true; flatSwingHit(h); } if(h.swingT>=1) h.swingT=-1; } }
  if(!XR.on&&KEYS.Mouse0&&document.pointerLockElement&&HANDS.R.item&&WPN[HANDS.R.item.key].auto) useRight();
  updateGrabs(gdt);
  for(const E of enemies) think(E,gdt,GAME.t);
  for(const E of enemies) if(!E.asleep) targetsFor(E,GAME.t,gdt);
  GAME.acc+=gdt; let n=0; while(GAME.acc>=H&&n<14){ physics(H); GAME.acc-=H; n++; } if(n>=14) GAME.acc=0;
  for(const E of enemies){ if(!E.asleep){ driveRig(E); skinUpdate(E.C); } bleedFx(E,gdt); poolFx(E,gdt); }
  updateBlood(gdt); updatePickups(gdt); updateEmbedded(); updateShells(gdt); updateGrenades(gdt); buildBloodMeshes(); voiceListener(); flowTick(dt,gdt); menuTick(dt);
  if(FLOOR.flick){ const on=(Math.sin(GAME.t*23)+Math.sin(GAME.t*7.3)>-.7)||Math.sin(GAME.t*1.3)>.1,fk=on?1:.15,c=FLOOR.lights[0][1]; L.plCol.set([c[0]*fk,c[1]*fk,c[2]*fk],0); FLOOR.flick.mat.color=on?[1,1,1]:[.3,.3,.32]; }
  flash.t-=dt; if(flash.t>0){ L.plPos.set(flash.pos,21); L.plCol.set(flash.big?[5.5,3.6,1.6]:[2.6,1.8,.9],21); L.plDist[7]=flash.big?9:6; } else { L.plCol.set([0,0,0],21); }
  updateDoors(gdt); navUpdate(gdt,PL.x,PL.z);
  if(GAME.slow){ GAME.beatT=(GAME.beatT||0)-dt; if(GAME.beatT<=0){ GAME.beatT=1.05; sfx('heart'); } } else GAME.beatT=0;
}
function collidePlayer(){ const p=[PL.x,PL.z]; pushOutXZ(p,.3,'player'); PL.x=p[0]; PL.z=p[1]; }
/* draw the scene with the current view/proj into the low-res target, then put it on screen with the PS1 post pass */
function renderWith(w,h,noUpd){
  if(!noUpd) updateWorld(world,null); gl.viewport(0,0,w,h); gl.clearColor(L.fog[0],L.fog[1],L.fog[2],1); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); gl.useProgram(MAIN.p); curCull=null; curMat=null; curTex=null; gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,null); const u=MAIN.loc; /* never leave the post pass's target bound while drawing into it */
  { const v=view; setCull([-(v[0]*v[12]+v[1]*v[13]+v[2]*v[14]),-(v[4]*v[12]+v[5]*v[13]+v[6]*v[14]),-(v[8]*v[12]+v[9]*v[13]+v[10]*v[14])],L.fogFar+1.5); } /* skip what this eye can't see or the fog has swallowed */
  gl.uniformMatrix4fv(u.viewMatrix,false,view); gl.uniformMatrix4fv(u.projectionMatrix,false,proj);
  const wob=XR.on?0:2; gl.uniform1f(u.uSnap,wob===2?1:wob===1?2.5:0); gl.uniform1f(u.uAffine,wob===2?1:wob===1?.15:0); gl.uniform2f(u.uRes,w,h); /* in a headset there is no vertex wobble and no texture warp, ever: both swim between the eyes. The PS1 look in VR is the low-res textures, the dither and the palette */
  gl.uniform3fv(u.uAmb,L.amb); gl.uniform3fv(u.uDirDir,L.dirDir); gl.uniform3fv(u.uDirCol,L.dirCol);
  gl.uniform3fv(u.uPLPos,L.plPos); gl.uniform3fv(u.uPLCol,L.plCol); gl.uniform1fv(u.uPLDist,L.plDist);
  gl.uniform3fv(u.uFogCol,L.fog); gl.uniform1f(u.uFogNear,L.fogNear); gl.uniform1f(u.uFogFar,L.fogFar); gl.uniform1i(u.map,0);
  drawTree(world); gl.bindVertexArray(null); }
const POST2=program(PVS,`#version 300 es
precision highp float;
uniform sampler2D tScene; uniform vec2 uRes; uniform float uFlash; uniform float uSmooth; uniform float uSlow; uniform float uFade; uniform float uDither; uniform float uVivid;
in vec2 vUv; out vec4 outColor;
float bayer2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
void main(){
  vec2 px = floor(vUv * uRes);
  vec3 c = texture(tScene, uSmooth > 0.5 ? vUv : (px + 0.5) / uRes).rgb;
  /* bullet time: the world goes washed-out and warm like old film, and the blacks lift instead of crushing, so it gets
     brighter, not darker. Blood keeps its colour and pops. No vignette, no text. */
  /* the Meridian's look: colours pushed like a 90s game box, a gentle S-curve so the lacquer reds and pool blues pop */
  float l0 = dot(c, vec3(0.3, 0.59, 0.11)); c = max(mix(vec3(l0), c, 1.0 + 0.4 * uVivid), 0.0); c = mix(c, c * c * (3.0 - 2.0 * c), 0.22 * uVivid); c *= 1.0 + 0.05 * uVivid;
  float lum = dot(c, vec3(0.3, 0.59, 0.11));
  float red = clamp((c.r - max(c.g, c.b)) * 4.0, 0.0, 1.0);
  c = mix(c, vec3(lum) * vec3(1.1, 1.0, 0.84), uSlow * 0.55 * (1.0 - red));
  c += uSlow * (vec3(0.055, 0.048, 0.036) + c * 0.24);
  c = mix(c, c * vec3(1.3, 0.82, 0.78), red * uSlow * 0.5);
  c = mix(c, vec3(0.5, 0.0, 0.0), uFlash);
  if(uDither > 0.5){ float L = 31.0; c += (bayer4(px) - 0.5) / L; c = floor(c * L + 0.5) / L; }
  c *= 1.0 - uFade; /* between levels: a plain fade to black, nothing at the edges */
  outColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}`);
function post(targetFB,vx,vy,vw,vh,w,h){
  gl.bindFramebuffer(gl.FRAMEBUFFER,targetFB); gl.viewport(vx,vy,vw,vh); gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); curCull=null;
  gl.useProgram(POST2.p); gl.bindVertexArray(emptyVAO); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,fbTex);
  gl.uniform1i(POST2.loc.tScene,0); gl.uniform2f(POST2.loc.uRes,w,h); gl.uniform1f(POST2.loc.uFlash,XR.on?XR.flash*1.2:0); gl.uniform1f(POST2.loc.uSmooth,XR.on?1:0); gl.uniform1f(POST2.loc.uSlow,clamp((1-GAME.ts/(GAME.tsBase||1))/.78,0,1)); gl.uniform1f(POST2.loc.uFade,GAME.fade||0); gl.uniform1f(POST2.loc.uDither,GAME.dither===false?0:1); gl.uniform1f(POST2.loc.uVivid,GAME.vivid===false?0:1);
  for(const k of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D,k,XR.on?gl.LINEAR:gl.NEAREST); gl.drawArrays(gl.TRIANGLES,0,3); gl.bindVertexArray(null); }

/* ---------- flat screen ---------- */
let last=performance.now();
function frame(now){
  if(XR.on) return;
  const dt=Math.min(.05,(now-last)/1000); last=now;
  update(dt,now);
  resize(); const {f,r,u,eye}=camBasis();
  const bob=GAME.started?Math.sin(now*.008)*.004*Math.min(1,Math.hypot(stick.dx,stick.dy)+(KEYS.KeyW||KEYS.KeyS||KEYS.KeyA||KEYS.KeyD?1:0)):0;
  for(const h of [HANDS.R,HANDS.L]){ const sR=h.side==='R'?1:-1,sw=h.swingT>=0?Math.sin(Math.PI*clamp(h.swingT,0,1)):0,it=h.item,w=it&&WPN[it.key],gun=w&&w.gun,rl=it&&it.reload>0?-.12:0,hv=w&&w.heavy;
    const side=sR*(gun?.19:.2)-sR*sw*(hv?.2:.08),up=(gun?-.2:-.22)+bob+rl+sw*(hv?.16:.07),fw=(gun?.42:.36)-h.rec*.06+sw*(hv?.25:.34),pitch=h.rec*.3+(rl?-.6:0)+(gun?0:-.1+sw*(hv?-.9:.1));
    if(h.grab) placeVM(h.node,v3.add(eye,v3.add(v3.sc(r,-.12),v3.add(v3.sc(u,-.18),v3.sc(f,.5)))),f,u,r,0); else if(window.__ads&&h.side==='R') { const S=SIGHTS[it&&it.key]||{y:.06,h:0},gy=FIST[1]-(w&&w.grip?w.grip[1]:0); placeVM(h.node,v3.add(eye,v3.add(v3.sc(u,-(gy+S.y+S.h-.003)),v3.sc(f,.24))),f,u,r,0); } else /* debug: look down the sights */
    placeVM(h.node,v3.add(eye,v3.add(v3.sc(r,side),v3.add(v3.sc(u,up),v3.sc(f,fw)))),f,u,r,pitch); m4.compose(h.M,h.node.p,h.node.r,[1,1,1]); h.node.vis=!PL.dead; updateAmmoLabel(h); }
  updateArms(f,u,eye);
  for(const E of enemies) E.label.vis=false; panelN.vis=false;
  m4.persp(proj,50*Math.PI/180,cv.width/cv.height,0.05,120); m4.lookAt(view,eye,v3.add(eye,f),[0,1,0]);
  const h=state.res,w=Math.max(1,Math.round(h*cv.width/cv.height)); ensureFB(w,h); gl.bindFramebuffer(gl.FRAMEBUFFER,fb); renderWith(w,h); post(null,0,0,cv.width,cv.height,w,h);
  for(const E of enemies){ const el=E.barkEl; if(E.barkT>0&&!E.dead){ const hp=X_(E.B,PI_.head),c=clip(v3.add(hp,[0,.32,0])); if(c[2]>.1){ el.hidden=false; el.style.transform=`translate(${(c[0]/c[2]*.5+.5)*innerWidth}px,${(.5-c[1]/c[2]*.5)*innerHeight}px) translate(-50%,-100%)`; el.style.opacity=Math.min(1,E.barkT*2); } else el.hidden=true; } else el.hidden=true; }
  { const it=HANDS.R.item,w=it&&WPN[it.key]; $('ammo').textContent=!w?'FISTS':!w.gun?w.label.toUpperCase():it.reload>0?'RELOADING':`${it.ammo} / ${w.mag}`; } $('hp').style.width=`${PL.hp}%`;
  $('slowTag').hidden=true;
  requestAnimationFrame(frame);
}

/* ---------- VR (WebXR, Quest browser) ----------
   Right hand: pistol (trigger fires, A reloads). Left hand: knife, stab by actually thrusting it into someone.
   Left stick moves where you look, right stick snap-turns 30 degrees, B or Y kicks, X toggles bullet time. */
function buzz(hand,v,ms){ const h=XR.hands[hand]; try{ h&&h.src.gamepad&&h.src.gamepad.hapticActuators&&h.src.gamepad.hapticActuators[0].pulse(v,ms); }catch(_){} }
const worldFromLocal=()=>{ const c=Math.cos(XR.yaw),s=Math.sin(XR.yaw),m=m4.make(); m.set([c,0,-s,0, 0,1,0,0, s,0,c,0, XR.origin[0],XR.origin[1],XR.origin[2],1]); return m; };
function labelTex(){ const c=document.createElement('canvas'); c.width=256; c.height=48; return {c,glt:null,f:-1,text:'',dyn:true}; }
function setLabel(E,text){ const t=E.labelTex; if(t.text===text) return; t.text=text; const g=t.c.getContext('2d'); g.clearRect(0,0,256,48);
  g.font='600 17px "IBM Plex Mono",monospace'; const w=Math.min(250,g.measureText(text).width+16); g.fillStyle='rgba(12,20,42,.86)'; g.fillRect(128-w/2,8,w,32); g.fillStyle='#ff6a3a'; g.fillRect(128-w/2,8,3,32);
  g.fillStyle='#f2ede2'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(text,128,25,240);
  if(t.glt){ gl.bindTexture(gl.TEXTURE_2D,t.glt); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,t.c); } }
/* a floating panel in VR for 'you died', 'floor clear', the reset countdown and setting changes */
const panelTex={c:(()=>{ const c=document.createElement('canvas'); c.width=512; c.height=160; return c; })(),glt:null,f:-1,text:'',dyn:true};
const panelN=mk(plane(.72,.225),M(panelTex,{unlit:true,cut:true,double:true}),world); panelN.vis=false;
function vrToast(t,sec){ XR.toast=t; XR.toastT=sec; }
function drawPanel(h,p,bar){ const key=h+'|'+p+'|'+(bar<0?-1:Math.round(bar*40)); if(panelTex.text===key) return; panelTex.text=key; const g=panelTex.c.getContext('2d');
  g.clearRect(0,0,512,160); g.fillStyle='rgba(12,20,42,.92)'; g.fillRect(0,0,512,160); g.fillStyle='#d4ad5a'; g.fillRect(0,0,512,4); g.fillStyle='#ff6a3a'; g.fillRect(0,156,512,4);
  g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#f2ede2'; g.font='400 38px Bungee,"Arial Black",sans-serif'; g.fillText(h.toUpperCase(),256,p||bar>=0?58:80,480);
  if(p){ g.fillStyle='#c4bfb3'; g.font='600 20px "IBM Plex Mono",monospace'; g.fillText(p,256,112,480); }
  if(bar>=0){ g.fillStyle='#2e4a90'; g.fillRect(56,132,400,8); g.fillStyle='#d4ad5a'; g.fillRect(56,132,400*clamp(bar,0,1),8); }
  if(panelTex.glt){ gl.bindTexture(gl.TEXTURE_2D,panelTex.glt); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,panelTex.c); } }
function vrRecenter(){ /* put your head back at the floor's start, facing into the room */
  if(!XR.on||!XR.head) return; const e=XR.head.eye,f=XR.head.f,a=FLOOR.start.yaw-Math.atan2(-f[0],-f[2]),c=Math.cos(a),s=Math.sin(a),dx=XR.origin[0]-e[0],dz=XR.origin[2]-e[2];
  XR.origin[0]=e[0]+dx*c+dz*s; XR.origin[2]=e[2]-dx*s+dz*c; XR.yaw+=a; XR.origin[0]+=FLOOR.start.x-e[0]; XR.origin[2]+=FLOOR.start.z-e[2]; PL.x=FLOOR.start.x; PL.z=FLOOR.start.z; PL.yaw=FLOOR.start.yaw; }
function attachLabels(){ for(const E of enemies) if(!E.label){ E.labelTex=labelTex(); E.label=mk(plane(.62,.116),M(E.labelTex,{unlit:true,cut:true,double:true}),world); E.label.vis=false; } }
async function enterVR(){
  if(!navigator.xr){ return; }
  try{
    audio(); GAME.started=true; $('intro').hidden=true; document.body.classList.add('playing');
    const session=await navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor']});
    await gl.makeXRCompatible();
    session.updateRenderState({baseLayer:new XRWebGLLayer(session,gl,{antialias:false,depth:false}),depthNear:.04,depthFar:300});
    let space; try{ space=await session.requestReferenceSpace('local-floor'); XR.floor=true; }catch(_){ space=await session.requestReferenceSpace('local'); XR.floor=false; }
    XR.session=session; XR.space=space; XR.on=true; equip(HANDS.R,null); equip(HANDS.L,null); startRun(true); XR.origin=[PL.x,XR.floor?0:1.62,PL.z]; XR.yaw=PL.yaw; XR.last=0;
    session.addEventListener('end',()=>{ XR.on=false; XR.session=null; XR.head=null; closeMenu(); for(const E of enemies) E.label.vis=false; last=performance.now(); requestAnimationFrame(frame); });
    session.requestAnimationFrame(xrFrame);
  }catch(err){ fail('Could not start VR: '+(err&&err.message||err)+'. Open this page in the Quest browser and try again.'); }
}
function poseMat(pose){ const m=new Float32Array(16); m.set(pose.transform.matrix); const o=m4.make(); m4.mul(o,worldFromLocal(),m); return o; }
const rotY180=(()=>{ const m=m4.make(); m.set([-1,0,0,0, 0,1,0,0, 0,0,-1,0, 0,0,0,1]); return m; })();
function handModel(rayM){ /* gun and knife are built along +z; the controller ray points along -z */
  const m=m4.make(),t=m4.make(); t.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,-.035,.06,1]); m4.mul(m,rayM,rotY180); const o=m4.make(); m4.mul(o,m,t); return o; }
function xrFrame(t,xf){
  const session=xf.session; session.requestAnimationFrame(xrFrame);
  const dt=Math.min(.05,XR.last?(t-XR.last)/1000:1/72); XR.last=t;
  const vp=xf.getViewerPose(XR.space); if(!vp) return;
  /* head */
  const Hm=poseMat(vp); const eye=colOf(Hm,3),f=norm3(v3.sc(colOf(Hm,2),-1)),u=norm3(colOf(Hm,1)),r=norm3(colOf(Hm,0)); XR.head={f,r,u,eye};
  PL.x=eye[0]; PL.z=eye[2]; PL.yaw=Math.atan2(-f[0],-f[2]);
  /* hands and buttons */
  for(const src of session.inputSources){ const hand=src.handedness; if(hand!=='left'&&hand!=='right') continue;
    const h=hand==='right'?HANDS.R:HANDS.L; h.src=src; XR.hands[hand]=h; const rp=src.targetRaySpace&&xf.getPose(src.targetRaySpace,XR.space); if(!rp) continue;
    const gpo=src.gripSpace&&xf.getPose(src.gripSpace,XR.space),gunIn=h.item&&WPN[h.item.key].gun,ray=poseMat(rp),base=m4.make(); /* guns aim down the controller ray; empty hands and blades sit in the grip pose like a real fist */
    m4.mul(base,gpo&&!gunIn?gripHand(poseMat(gpo)):handModel(ray),handTweak(h)); const k=h.rec,rec=m4.make(); rec.set([1,0,0,0, 0,Math.cos(k*.4),Math.sin(k*.4),0, 0,-Math.sin(k*.4),Math.cos(k*.4),0, 0,k*.01,-k*.04,1]); m4.mul(h.M,base,rec);
    setLocal(h.node,m4.make(),h.M); h.node.vis=!PL.dead;
    const fp=mulP(h.M,FIST); if(h.prevPos) h.vel=v3.add(v3.sc(h.vel,.5),v3.sc(v3.sub(fp,h.prevPos),.5/Math.max(dt,1e-3))); h.prevPos=fp;
    const gp=src.gamepad; if(!gp) continue; const ax=gp.axes,b=gp.buttons,pressed=i=>!!(b[i]&&b[i].pressed),edge=i=>{ const kk=hand+i,p=pressed(i),was=XR.btn[kk]; XR.btn[kk]=p; return p&&!was; };
    const trig=edge(0),grip=edge(1),stickC=edge(3),ab=edge(4),by=edge(5); h.trigHeld=pressed(0);
    menuButtons(hand,b,dt); if(MENU.open){ pokeMenu(fp,h,dt); updateAmmoLabel(h); continue; } /* the menu takes both hands while it is up */
    if(PL.dead){ if(trig){ resetGame(); vrRecenter(); } continue; }
    if(grip) grabOrDrop(h);
    if(h.item&&WPN[h.item.key].gun){ if(trig||(WPN[h.item.key].auto&&pressed(0))) fireHand(h); }
    if(ab){ if(h.item&&WPN[h.item.key].melee) flipGrip(h); else reloadHand(h); } if(by) kick();
    if(hand==='left'){ const sx=ax[2]||0,sz=ax[3]||0; if(GAME.started&&Math.hypot(sx,sz)>.15){ const fl=norm3([f[0],0,f[2]]),rl=[-fl[2],0,fl[0]],sp=2.2*(XR.moveK||1)*dt*Math.max(GAME.ts,.3); /* bullet time slows you too */
        const before=[PL.x,PL.z]; PL.x+=(rl[0]*sx-fl[0]*sz)*sp; PL.z+=(rl[2]*sx-fl[2]*sz)*sp; collidePlayer(); XR.origin[0]+=PL.x-before[0]; XR.origin[2]+=PL.z-before[1]; }
      menuStick(pressed(3),dt); }
    else { const sx=ax[2]||0; if(XR.smoothTurn){ if(Math.abs(sx)>.2) turnBy(-sx*2.4*dt,eye); } else if(Math.abs(sx)>.7&&!XR.snapHeld){ XR.snapHeld=true; const a=-Math.sign(sx)*(XR.snapA||Math.PI/6),c=Math.cos(a),s=Math.sin(a),dx=XR.origin[0]-eye[0],dz=XR.origin[2]-eye[2];
        XR.origin[0]=eye[0]+dx*c+dz*s; XR.origin[2]=eye[2]-dx*s+dz*c; XR.yaw+=a; } else if(Math.abs(sx)<.3) XR.snapHeld=false;
      if(stickC){ const L=[1080,1440,1680,2064],i=(L.indexOf(XR.res)+1)%L.length; XR.res=L[i]; vrToast(['Sharpness: low','Sharpness: medium','Sharpness: high','Sharpness: native'][i],1.6); } }
    meleeTick(h,dt); if(!h.supportOf) vrMelee(h,dt); else h.prevPts=null; pokeWrist(fp,h,dt); updateAmmoLabel(h); }
  applySupport(HANDS.R); applySupport(HANDS.L); updateArms(f,u,eye); updateSights(eye);
  /* keep the head out of walls and furniture by sliding the play space */
  { const bx=PL.x,bz=PL.z; collidePlayer(); XR.origin[0]+=PL.x-bx; XR.origin[2]+=PL.z-bz; }
  /* climbing out: walk onto the flight up */
  update(dt,t);
  /* the FPS on your left wrist, so you can see what the Quest is doing */
  XR.fpsAcc=(XR.fpsAcc||0)+dt; XR.fpsN=(XR.fpsN||0)+1; if(XR.fpsAcc>=.5){ XR.fps=Math.round(XR.fpsN/XR.fpsAcc); XR.fpsAcc=0; XR.fpsN=0; drawFps(XR.fps); }
  /* subtitles float over heads, facing you */
  for(const E of enemies){ const on=E.barkT>0&&!E.dead&&GAME.subs!==false; E.label.vis=on; if(on){ setLabel(E,E.barkEl.textContent); const hp=X_(E.B,PI_.head),p=v3.add(hp,[0,.36,0]); E.label.p=p; E.label.r=[0,Math.atan2(eye[0]-p[0],eye[2]-p[2]),0]; } }
  /* the panel: follows your gaze lazily, never glued to your face */
  { let ph='',pp='',bar=-1;
    if(XR.resetHold>0){ ph='Resetting the floor'; pp='keep holding both grips'; bar=XR.resetHold/1.2; }
    else if(!$('msg').hidden){ ph=$('msgH').textContent; pp='Hold both grips to reset the floor'; }
    else if(XR.toastT>0) ph=XR.toast;
    XR.toastT-=dt; const was=panelN.vis; panelN.vis=!!ph;
    if(ph){ drawPanel(ph,pp,bar); const fl=norm3([f[0],0,f[2]]),tg=v3.add(eye,v3.add(v3.sc(fl,.85),[0,-.1,0]));
      XR.panelP=!was||!XR.panelP?tg:v3.add(XR.panelP,v3.sc(v3.sub(tg,XR.panelP),Math.min(1,dt*2.5))); const p=XR.panelP; panelN.p=p.slice(); panelN.r=[0,Math.atan2(eye[0]-p[0],eye[2]-p[2]),0]; } }
  /* render both eyes */
  const layer=session.renderState.baseLayer,hres=XR.res; updateWorld(world,null); /* once for both eyes */
  for(const v of vp.views){ const vpt=layer.getViewport(v);
    proj.set(v.projectionMatrix); const em=new Float32Array(16); em.set(v.transform.matrix); const wm=m4.make(); m4.mul(wm,worldFromLocal(),em); view.set(rigidInv(wm));
    const w=Math.max(1,Math.round(hres*vpt.width/vpt.height)); ensureFB(w,hres); gl.bindFramebuffer(gl.FRAMEBUFFER,fb); renderWith(w,hres,true);
    post(layer.framebuffer,vpt.x,vpt.y,vpt.width,vpt.height,w,hres); }
}
(async()=>{ if(navigator.xr&&navigator.xr.isSessionSupported){ try{ if(await navigator.xr.isSessionSupported('immersive-vr')){ for(const id of ['vrBtn','vrBtnT']) $(id).hidden=false; } }catch(_){} } })();
$('vrBtn').addEventListener('click',enterVR); $('vrBtnT').addEventListener('click',enterVR);
attachLabels();
