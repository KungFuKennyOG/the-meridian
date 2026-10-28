/* ---------- boot ---------- */
for(const k of ['bright','dark','dust']) dynNode(k,M(null,{color:k==='bright'?0x8e0c0c:k==='dark'?0x4c0606:0x7a7570,double:true})); dynNode('gib',M(null,{color:0x6a1414,double:true})); dynNode('bone',M(null,{color:0xd6cdb4,double:true}));
dynNode('pool',M(tPoolB,{cut:true,double:true})); dynNode('splat',M(tSplat,{cut:true,double:true})); dynNode('hole',M(tHole,{cut:true,double:true}));
const SAVE=loadProgress();
if(SAVE&&SAVE.leg>0){ $('cont').hidden=false; $('cont').textContent='Continue · '+String(SAVE.leg+1).padStart(2,'0')+' '+ROUTE[SAVE.leg].title.replace(' · B5',''); }
/* the run starts on platform 0 with nothing in your hands (the pistol is in the locker); continue picks up at your last station */
function startRun(cont){ if(GAME.started&&!cont) return; const sv=cont?loadProgress():null;
  if(sv&&sv.leg>0){ enterLeg(sv.leg); if(sv.R) equip(HANDS.R,newItem(sv.R)); if(sv.L) equip(HANDS.L,newItem(sv.L)); }
  else { if(!cont) try{ localStorage.removeItem('meridian.save'); }catch(_){} if(FLOW.leg!==0||!LEVEL.root) enterLeg(0); equip(HANDS.R,null); equip(HANDS.L,null); }
  rememberArms(); GAME.fade=1; GAME.started=true; levelAudio(); if(LOBBY.on) lobbyStart(); }
$('cont').addEventListener('click',()=>{ audio(); startRun(true); GAME.started=true; $('intro').hidden=true; document.body.classList.add('playing'); if(!isTouch){ try{ const p=cv.requestPointerLock(); if(p&&p.catch) p.catch(()=>{}); }catch(_){} } });
enterLeg(0); GAME.fade=0;
window.__game={GAME,PL,XR,FLOW,LEVEL,ROUTE,enemies:()=>enemies,goLeg,enterLeg,restartLevel,HANDS,equip,newItem,WPN,WPN_KEYS,spawnCrew,spawnNear,openMenu,closeMenu,menuAct,MENU,OPTS,PAGES,fireHand,shoot,stab,kick,camBasis,BOXES,FLOOR,LOOSE,hitEnemy,SEGS,X_,PI_,die,clearEnemies,state,L,CREWS,CREW_OF,explode,launchGrenade,toggleSlow,useRight,updateOut};
window.__eval=s=>eval(s); /* test hook: headless smoke tests reach the game's internals */
requestAnimationFrame(frame);
})();
