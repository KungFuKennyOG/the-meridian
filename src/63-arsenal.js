/* =====================================================================
   THE MERIDIAN'S ARSENAL: what you pick up along the route and what the crews carry, added to the shared
   weapons (fists, bottle, knife, machete, .38, 9mm, pump shotgun, SMG).
   Cleaver (the Golden Crane), short sword (Ren), katana (the end of the line), assault rifle (Naples),
   grenade launcher (Rio), gold machine gun (Las Vegas). All built along +z like the rest.
   ===================================================================== */
Object.assign(WPN,{
  cleaver: {label:'Cleaver',build:pCleaver,grip:[0,0,0],melee:'knife',bleed:1.25,sever:1.25,stun:1.1,push:1.15,chop:true,reach:1.3,pts:[[0,-.05,.26],[0,-.05,.13]],speed:1.6},
  waki:    {label:'Short sword',build:pWaki,grip:[0,0,0],melee:'knife',bleed:1.3,sever:1.0,reach:1.5,pts:[[0,0,.56],[0,0,.38],[0,0,.22]],speed:1.4},
  katana:  {label:'Katana',build:pKatana,grip:[0,0,.04],melee:'knife',bleed:1.7,sever:2.4,stun:1.3,push:1.2,chop:true,reach:1.9,pts:[[0,0,.86],[0,0,.64],[0,0,.42],[0,0,.24]],speed:1.7},
  rifle:   {label:'Assault rifle',build:pRifleM,grip:[0,-.09,.07],fore:[0,-.02,.24],gun:true,bash:{pts:[[0,.02,.57],[0,-.03,-.3]],power:1.1},mag:30,rof:.1,auto:true,muzzle:[0,.02,.57],axisY:.02,spread:.01,bleed:1.35,sever:.35,push:1.25,snd:'smg'},
  gl:      {label:'Grenade launcher',build:pGL,grip:[0,-.08,-.1],fore:[0,.03,.16],gun:true,gl:true,bash:{pts:[[0,.03,.37],[0,-.02,-.3]],power:1.2},mag:6,rof:.75,muzzle:[0,.03,.38],axisY:.03,loadOne:true,snd:'shotgun'},
  goldmg:  {label:'Gold machine gun',build:pMG,grip:[0,-.06,-.05],fore:[0,.02,.3],gun:true,bash:{pts:[[0,.02,.87],[0,-.03,-.38]],power:1.4},mag:120,rof:.055,auto:true,muzzle:[0,.02,.87],axisY:.02,spread:.022,bleed:1.25,sever:.5,push:1.4,snd:'smg'}
});
WPN_KEYS.push('cleaver','waki','katana','rifle','gl','goldmg');
Object.assign(SIGHTS,{rifle:{y:.035,front:.5,rear:-.06,h:.012,hood:true},goldmg:{y:.06,front:.8,rear:-.1,h:.012,hood:true},gl:{y:.08,front:.3,rear:-.05,h:.01}});
Object.assign(STICKS,{cleaver:1,waki:1,katana:1});
/* the route's arsenal: one per station, in order */
const ARSENAL_KEYS={tokyo:'pistol',hongkong:'pistol',baikal:'shotgun',london:'smg',naples:'rifle',rio:'gl',vegas:'goldmg',tokyonight:'katana'};

/* ---------- grenades: a fat round that arcs, bounces once off a wall, and goes off on the second touch or after 2.2 s ---------- */
const NADES=[]; const mNade=M(null,{color:0x4a4a3a});
function launchGrenade(at,dir){ const n=mk(cyl(.022,.022,.06,8),mNade,world,at[0],at[1],at[2],Math.PI/2,0,0); NADES.push({n,v:v3.sc(dir,19),t:0,hits:0}); }
function updateGrenades(dt){ for(const G of NADES.slice()){ G.t+=dt; G.v[1]-=9.8*dt; const o=G.n.p.slice(),d=v3.sc(G.v,dt),L=Math.hypot(...d),dir=v3.sc(d,1/(L||1));
    const hitE=L>0&&rayEnemiesExact(o,dir,L), wall=L>0?rayRoom(o,dir):{t:1e9};
    if(hitE&&hitE.t<=L){ explode(v3.add(o,v3.sc(dir,hitE.t))); removeNade(G); continue; }
    if(wall.t<=L){ G.hits++; const p=v3.add(o,v3.sc(dir,wall.t*.98)); if(G.hits>=2||G.t>.45){ explode(v3.add(p,v3.sc(wall.n,.05))); removeNade(G); continue; }
      const n=wall.n,vn=v3.dot(G.v,n); G.v=v3.sc(v3.sub(G.v,v3.sc(n,2*vn)),.45); G.n.p=p; sfx('shellhit'); continue; }
    G.n.p=v3.add(o,d); G.n.r[1]+=dt*9; if(G.t>2.2){ explode(G.n.p); removeNade(G); } } }
function removeNade(G){ const i=NADES.indexOf(G); if(i>=0) NADES.splice(i,1); disposeTree(G.n); const k=world.kids.indexOf(G.n); if(k>=0) world.kids.splice(k,1); }
function explode(at){ flash={t:.18,pos:at,big:true}; alertAll(at); sfx('shotgun',1.6); sfx('gore',.8); if(XR.on){ buzz('right',1,220); buzz('left',1,220); }
  for(let i=0;i<60;i++) emit(at,[rnd(-4,4),rnd(1,6),rnd(-4,4)],rnd(.02,.05),'dust',1.4);
  addDecal(DEC.hole,[at[0],.004,at[2]],[0,1,0],.5,140);
  for(const E of enemies){ const pel=X_(E.B,PI_.pelvis),d=Math.hypot(pel[0]-at[0],pel[1]-at[1],pel[2]-at[2]); if(d>4.2) continue; const k=clamp(1-d/4.2,0,1),dir=norm3(v3.sub(pel,at));
    if(!E.dead){ const segs=SEGS.filter((s,i)=>!E.segOff.has(i)); const seg=pick(segs.filter(s=>s[3]==='chest'||s[3]==='belly'||s[3].startsWith('thigh')))||segs[0];
      hitEnemy(E,seg,v3.add(pel,[0,.3,0]),dir,'gun',{bleed:1+3*k,sever:k>.55?3:1,push:1+3*k,pellet:true,dist:d});
      if(k>.55){ for(const limb of ['legL','legR','armL','armR']) if(Math.random()<k*.7&&!E.sev[limb]) sever(E,limb,dir,true); goreBlast(pel,dir,k); }
      if(k>.82&&!E.dead) die(E); }
    for(let i=0;i<NP;i++){ const p=X_(E.B,i),q=norm3(v3.add(v3.sub(p,at),[0,.6,0])); kickV(E.B,i,v3.sc(q,(2+6*k)*(1+Math.random()*.3)),H); } wakeBody(E); }
  const pd=Math.hypot(PL.x-at[0],1.2-at[1],PL.z-at[2]); if(pd<4.5) hurtPlayer(Math.round(70*clamp(1-pd/4.5,0,1)));
  for(const P of LOOSE){ const q=P.node.p,d=Math.hypot(q[0]-at[0],q[1]-at[1],q[2]-at[2]); if(d<3.5){ P.rest=false; P.v=v3.add(P.v,v3.sc(norm3(v3.add(v3.sub(q,at),[0,.8,0])),(3.5-d)*2.5)); } } }
