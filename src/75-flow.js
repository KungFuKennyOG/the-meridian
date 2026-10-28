/* =====================================================================
   THE ROUTE: the whole game, one level after another.
   You walk onto platform 0 in Tokyo, take the pistol from the locker and board into the izakaya car, where Tanaka's salarymen are already drinking.
   Then it alternates: a car, taken over by the crew that boarded at the last stop, and the next underground
   station, where you get off, fight whoever is waiting on the platform, and pick up the weapon left for you.
   Between Naples and Rio the train runs under the South Atlantic: the Espositos who are left fall back into the
   glass observation car, with whales going past the windows.
   Between Vegas and Tokyo the train runs under the Pacific, and the sushi chefs turn out to be Kagami-gumi.
   Every car's far door stays shut until nobody in it can still fight. Back in Tokyo at night, the
   Kagami-gumi hold the capsule hotel, and after that there is only the locomotive.
   Progress saves when you reach a station.
   ===================================================================== */
const ROUTE=[
  {kind:'station',key:'tokyo',amb:'tokyo',title:'Tokyo · B5',sub:'Platform 0 · board the Meridian 24',first:true},
  {kind:'car',key:'izakaya',scene:'japan',title:'Izakaya Hanami',sub:'Leaving Tokyo · Section Chief Tanaka'},
  {kind:'station',key:'hongkong',amb:'hongkong',title:'Hong Kong',sub:'Meridian Central'},
  {kind:'car',key:'dimsum',scene:'hongkong',title:'Golden Crane Dim Sum',sub:'Madam Lau'},
  {kind:'station',key:'baikal',amb:'baikal',title:'Lake Baikal',sub:'Baikalskaya'},
  {kind:'car',key:'banya',scene:'siberia',title:'Banya & Ice Bar',sub:'Grigor Volkov'},
  {kind:'station',key:'london',amb:'london',title:'London',sub:'Kings Meridian'},
  {kind:'car',key:'pub',scene:'london',title:'The Rusty Anchor',sub:'The Gaffer'},
  {kind:'station',key:'naples',amb:'naples',title:'Naples',sub:'Napoli Meridiana'},
  {kind:'car',key:'trattoria',scene:'naples',title:'Trattoria Assunta',sub:'Nonna'},
  {kind:'car',key:'aquarium',scene:'atlantic',title:'Aquarium Lounge',sub:'Under the South Atlantic · what is left of the Espositos'},
  {kind:'station',key:'rio',amb:'rio',title:'Rio de Janeiro',sub:'Meridiano Copacabana'},
  {kind:'car',key:'pool',scene:'rio',title:'Copacabana Pool Deck',sub:'DJ Tremor'},
  {kind:'station',key:'vegas',amb:'vegas',title:'Las Vegas',sub:'Meridian Strip'},
  {kind:'car',key:'casino',scene:'vegas',title:'The King\'s Casino',sub:'"The King"'},
  {kind:'car',key:'sushi',scene:'pacific',title:'Sushi Bar Kaiten',sub:'Under the Pacific · the chefs are Kagami-gumi'},
  {kind:'station',key:'tokyo',amb:'tokyonight',night:true,title:'Tokyo by night',sub:'Back where it started'},
  {kind:'car',key:'capsule',scene:'tokyonight',title:'Capsule Hotel',sub:'Ren Kagami'},
  {kind:'car',key:'cab',scene:'tokyonight',title:'The Locomotive',sub:'The end of the line',last:true}];
const FLOW={leg:0,exitOpen:false,gift:null,giftKey:null,marker:null,lamp:null,cleared:false,trans:0,transTo:-1,boardX:3,speed:42,enemyK:1,startT:0,done:false};
GAME.fade=1;
/* what the crews hold on each platform: the boss stays on the train, his people wait for you */
const STATION_CREW={tokyo:null,hongkong:'lauc',baikal:'volkovc',london:'gafferc',naples:'nonnac',rio:'tremorc',vegas:'kingc'};

function legOf(i){ return ROUTE[clamp(i,0,ROUTE.length-1)]; }
function saveProgress(){ try{ localStorage.setItem('meridian.save',JSON.stringify({leg:FLOW.leg,R:HANDS.R.item&&HANDS.R.item.key,L:HANDS.L.item&&HANDS.L.item.key})); }catch(_){} }
function loadProgress(){ try{ return JSON.parse(localStorage.getItem('meridian.save')||'null'); }catch(_){ return null; } }

/* go to a leg of the route: fade out, build it, put you at its start, fade in */
function goLeg(i,instant){ i=clamp(i,0,ROUTE.length-1); if(instant){ enterLeg(i); GAME.fade=0; return; } if(FLOW.transTo>=0) return; FLOW.transTo=i; FLOW.trans=0; sfx('door',.6); }
function enterLeg(i){ FLOW.leg=i; const R_=legOf(i); LOBBY.on=false; LOBBY.useI.length=0; FIN.on=false; endN.vis=false;
  clearEnemies(); for(const P of LOOSE.slice()) removePickup(P); for(const G of NADES.slice()) removeNade(G);
  BP.length=0; for(const k in DEC){ DEC[k].length=0; DEC[k].ver=(DEC[k].ver||0)+1; }
  buildLevel(R_.kind,R_.key);
  FLOW.exitOpen=false; FLOW.cleared=false; FLOW.gift=null; FLOW.giftKey=null; FLOW.done=false; FLOW.startT=GAME.t;
  const isCar=R_.kind==='car';
  /* start point and the way out */
  if(isCar){ FLOOR.start={x:-RX+2.4,z:0,yaw:-Math.PI/2}; }
  else if(R_.first){ FLOOR.start={x:-8,z:RZ-1.6,yaw:0}; }
  else { FLOOR.start={x:-2,z:-RZ+1.1,yaw:Math.PI}; }
  FLOOR.start=openSpotNear(FLOOR.start);
  buildExitMarker(R_);
  /* the outside: only through a car's windows */
  OUT.vis=isCar&&GAME.scenery!==false; if(isCar) setScene(R_.scene);
  applyLevelLight(R_);
  /* the people */
  spawnLevelCrew(R_);
  /* the weapon left for you */
  if(!isCar){ const key=R_.night?'katana':ARSENAL_KEYS[R_.key]; const dropN=R_.night?ST.tokyo.drop2:ST[R_.key].drop; if(key&&dropN&&LEVEL.drops) placeGift(key,LEVEL.drops[R_.night?1:0]); }
  if(R_.first&&!R_.night) buildLobby();
  respawnPlayer();
  if(GAME.started){ levelAudio(); storyEnter(i,R_); if(LOBBY.on) lobbyStart(); }
  if(!isCar) saveProgress();
  $('floorTag').textContent=R_.title+' · '+R_.sub;
  if(XR.on){ vrRecenter(); vrToast(R_.title,2.4); }
  if(window.__onLeg) window.__onLeg(i); }
/* each car has its own theme, each station its city; nothing plays until you have clicked or entered VR (browsers insist) */
function levelAudio(){ if(typeof MUSIC==='undefined') return; const R_=legOf(FLOW.leg); try{ if(R_.kind==='car'){ MUSIC.ambience(null); MUSIC.play(R_.key); MUSIC.rumble(true); } else { MUSIC.play(null); MUSIC.rumble(false); MUSIC.ambience(R_.amb); } MUSIC.setVolumes(GAME.vol); }catch(_){} }
function respawnPlayer(){ Object.assign(PL,{x:FLOOR.start.x,z:FLOOR.start.z,yaw:FLOOR.start.yaw,pitch:0,hp:100,hurtT:9,kickCd:0,dead:false}); GAME.clear=false; $('msg').hidden=true; $('sblood').innerHTML=''; if(XR.on) vrRecenter(); }
/* restart the level you are in (after dying, or from the menu): same level, same arsenal you came in with */
function restartLevel(){ const keep=FLOW.armed||{}, wasDead=PL.dead; enterLeg(FLOW.leg); if(wasDead) storyDeath(); if(keep.R) equip(HANDS.R,newItem(keep.R)); if(keep.L) equip(HANDS.L,newItem(keep.L)); }
function rememberArms(){ FLOW.armed={R:HANDS.R.item&&HANDS.R.item.key,L:HANDS.L.item&&HANDS.L.item.key}; }

function applyLevelLight(R_){
  if(R_.kind==='car'){ const W=WG[R_.key],S=SCENES[R_.scene],L0=S.light,k=Math.max(S.lamp,W.minLamp||0);
    setLights({amb:L0.amb.map(v=>v*W.ambK),dir:L0.dir,dirCol:L0.dirCol.map(v=>v*W.sunK),fog:F3(S.horizon),fogNear:GAME.fogNear||110,fogFar:GAME.fogFar||220,pl:W.lamps.slice(0,6).map(([p,c,d])=>[p,c.map(v=>v*k),d])}); }
  else { const st=ST[R_.key],z=LEVEL.zShift,night=R_.night?.62:1;
    setLights({amb:st.amb.map(v=>v*night),dir:[0,1,.3],dirCol:[.12,.12,.14],fog:R_.night?[.01,.01,.02]:[.03,.03,.04],fogNear:GAME.fogNear||70,fogFar:GAME.fogFar||160,pl:st.lamps.slice(0,6).map(([p,c,d])=>[[p[0],p[1],p[2]+z],c.map(v=>v*night),d])}); } }

/* crews: from the art set's spots, scaled by the menu's enemy count, plus a few extra hunters on platforms */
function spawnLevelCrew(R_){ nameUseReset();
  if(R_.kind==='car'){ const sp=WG[R_.key].spots; for(const name in sp){ const s=sp[name],id=crewIdOf(name); if(!id) continue; spawnCrew(id,s.x,s.z,s.ry,{pose:s.pose,y:s.y}); }
    extraCrew(R_.key==='cab'?'renc':dominantCrew()); }
  else { const id=R_.night?'renc':STATION_CREW[R_.key]; if(!id) return; const sp=ST[R_.key].spots||{}, z=LEVEL.zShift;
    for(const name in sp){ const s=sp[name]; if(CREW_OF[name]&&CREW_OF[name].boss) continue; spawnCrew(id,s.x,s.z+z,s.ry); }
    const n=2+(R_.night?2:0); for(let k=0;k<n;k++){ const f=freeSpot(()=>true,6); if(f) spawnCrew(id,f.x,f.z,rnd(0,6.28)); } extraCrew(id,true); } }
function dominantCrew(){ const c={}; for(const E of enemies) if(!E.boss) c[E.id]=(c[E.id]||0)+1; let best=null,bn=0; for(const k in c) if(c[k]>bn){ bn=c[k]; best=k; } return best; }
function extraCrew(id,station){ if(!id||FLOW.enemyK<=1) return; const base=enemies.length, add=Math.round(base*(FLOW.enemyK-1));
  for(let k=0;k<add;k++){ const f=freeSpot(()=>true,station?6:5); if(f) spawnCrew(id,f.x,f.z,rnd(0,6.28)); } }
function nameUseReset(){ for(const k in nameUse) nameUse[k]=0; }

/* the way out: a light over a car's front door (red until it is safe, green after), a ring on the platform at the train door */
const mExitRed=M(null,{color:0xff3a2a,unlit:true}),mExitGreen=M(null,{color:0x4aff6a,unlit:true}),mBoard=M(null,{color:0x5ae0ff,unlit:true,cut:true});
function buildExitMarker(R_){ const root=LEVEL.root;
  if(R_.kind==='car'){ FLOW.lamp=mk(box(.08,.12,1.0),mExitRed,root,RX-.06,2.45,0); FLOW.marker=null; }
  else { const x=FLOW.boardX,z=-RZ+.75, n=N(root,x,0,z); mk(plane(1.4,1.4),M(tRing,{unlit:true,cut:true,color:0x5ae0ff}),n,0,.015,0,-Math.PI/2);
    const sign=M(textTex(64,16,'#0a1226',[['BOARD','c',2,'#5ae0ff'],['MERIDIAN 24','c',9,'#e8f2ff']]),{unlit:true}); mk(plane(1.1,.28),sign,n,0,2.3,0); mk(plane(1.1,.28),sign,n,0,2.3,0,0,Math.PI,0); mk(cyl(.02,.02,2.2,6),C('#c8ccd2'),n,0,1.1,0);
    FLOW.marker=n; FLOW.lamp=null; } }
/* the station's weapon: floating over its case, turning slowly, until you take it */
function placeGift(key,pos){ if(!pos) return; const Mw=m4.make(); m4.compose(Mw,[pos[0],pos[1]+1.2,pos[2]-.7],[0,0,0],[1,1,1]); /* hanging in front of its case, toward where you come in */
  const P=addPickup(newItem(key),Mw,[0,0,0],[0,0,0]); P.rest=true; P.gift=true; FLOW.gift=P; FLOW.giftKey=key; }

/* each frame: open the door when it is safe, check the exits, turn the gift, run the train, fade between levels */
/* contact shadows: the nearest dozen people (you included) darken the floor under them */
const SH_TMP=[];
function updateShadows(){ const L_=L; SH_TMP.length=0; SH_TMP.push([PL.x,PL.z,.3,0]);
  for(const E of enemies){ const x=E.B.x,a=PI_.pelvis*3,c=PI_.chest*3,h=PI_.head*3,mx=(x[a]+x[c])/2,mz=(x[a+2]+x[c+2])/2,lying=x[h+1]<.7;
    const sp=Math.hypot(x[h]-x[a],x[h+2]-x[a+2]); SH_TMP.push([lying?(x[a]+x[h])/2:mx,lying?(x[a+2]+x[h+2])/2:mz,lying?.35+sp*.5:.4,(mx-PL.x)**2+(mz-PL.z)**2]); }
  SH_TMP.sort((p,q)=>p[3]-q[3]); const n=Math.min(12,SH_TMP.length);
  for(let i=0;i<n;i++){ const q=SH_TMP[i]; L_.sh[i*4]=q[0]; L_.sh[i*4+1]=0; L_.sh[i*4+2]=q[1]; L_.sh[i*4+3]=q[2]; } L_.shN=n; }
function flowTick(dt,gdt){ updateShadows(); dlgTick(dt); cardTick(dt); lobbyTick(dt); watchTick();
  /* fading between levels */
  if(FLOW.transTo>=0){ FLOW.trans+=dt; GAME.fade=clamp(FLOW.trans/.45,0,1); if(FLOW.trans>=.5){ rememberArms(); const keepR=HANDS.R.item,keepL=HANDS.L.item; enterLeg(FLOW.transTo); equip(HANDS.R,keepR); equip(HANDS.L,keepL); rememberArms(); FLOW.transTo=-1; FLOW.trans=0; } return; }
  GAME.fade=Math.max(0,GAME.fade-dt/.5);
  if(!GAME.started||PL.dead) return;
  const R_=legOf(FLOW.leg);
  /* the crews' extra life: idle talk, bosses taunting, people sitting down stand up to fight */
  crewChatter(dt); for(const E of enemies) if(E.seated&&E.aware&&E.kind!=='seated'){ E.seated=false; }
  /* the gift spins until taken */
  if(FLOW.gift){ if(!LOOSE.includes(FLOW.gift)){ FLOW.gift=null; vrToast(WPN[FLOW.giftKey].label,1.8); storyPickup(FLOW.giftKey); } else FLOW.gift.node.r[1]+=dt*1.2; }
  /* safe to move on? nobody left who can still fight */
  const threat=enemies.some(E=>!E.dead&&(E.st==='alert'||E.st==='idle')&&E.kind!=='seated');
  if(!threat&&!FLOW.cleared){ FLOW.cleared=true; if(R_.kind==='car'&&enemies.length){ if(R_.last) finaleArm(); else { vrToast('The door is open',2.2); storyCleared(FLOW.leg,R_); } sfx('click',.8); } }
  FLOW.exitOpen=FLOW.cleared||GAME.unlockAll;
  if(FLOW.lamp) FLOW.lamp.mesh.mats[0]=FLOW.exitOpen?mExitGreen:mExitRed;
  if(R_.kind==='car'){ if(FLOW.exitOpen&&(R_.last?PL.x>9.2&&Math.abs(PL.z)<1.8:PL.x>RX-1.1&&Math.abs(PL.z)<1.3)){ if(!R_.last) goLeg(FLOW.leg+1); } }
  else if(FLOW.marker){ FLOW.marker.r[1]+=dt*.4; if(Math.abs(PL.x-FLOW.boardX)<.9&&PL.z<-RZ+1.6&&GAME.t-FLOW.startT>1.5) goLeg(FLOW.leg+1); }
  /* the train runs: scenery scrolls past the windows */
  if(R_.kind==='car'&&OUT.vis){ const {eye}=camBasis(); updateOut(dt,FLOW.speed*(GAME.trainK??1)*GAME.ts,eye||[PL.x,1.6,PL.z],PL.x); }
  for(const f of LEVEL.anim) f(GAME.t); }
function endOfLine(){ if(FLOW.done) return; FLOW.done=true; try{ localStorage.removeItem('meridian.save'); }catch(_){}
  showMsg('END OF THE LINE','Twenty-four hours, nine cars, seven crews. The Meridian 24 is yours. Pull the brake, or go round again.'); if(XR.on) XR.clearT=8; }
/* the nearest open floor to where a level wants you to start (a bar or a pod island may be in the way) */
function openSpotNear(st){ const c0=navCell(st.x,st.z); if(c0>=0&&!FLOOR.nav[c0]) return st; let best=null,bd=1e9;
  for(let k=0;k<NZ;k++) for(let i=0;i<NX;i++){ const id=k*NX+i; if(FLOOR.nav[id]) continue; const x=cellX(i),z=cellZ(k),d=Math.hypot(x-st.x,(z-st.z)*1.3)+(LEVEL.kind==='car'&&x<st.x?1.5:0); if(d<bd){ bd=d; best={x,z,yaw:st.yaw}; } }
  return best||st; }
/* flat screen: G takes the nearest weapon lying within reach into your right hand */
function flatPickup(){ let best=null,bd=1.7; for(const P of LOOSE){ const q=P.node.p,d=Math.hypot(q[0]-PL.x,q[2]-PL.z); if(d<bd){ bd=d; best=P; } }
  if(!best) return false; equip(HANDS.R,best.item); removePickup(best); sfx('click',.6); return true; }
