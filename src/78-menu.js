/* =====================================================================
   THE MENU: everything you might want to play with, on a panel that floats in front of you.
   Opening it in VR: hold the left stick down (click and hold, about half a second; a quick click is still
   bullet time), or poke the MENU plate on your left wrist with your right hand. The Quest browser keeps the
   controller's own menu button for itself, so those are the ways in. Poke a button with either fist.
   On a flat screen: Esc or M.
   Pages: ROUTE (jump to any level), ARSENAL (any weapon), CREWS (spawn anyone), CHEATS, GORE, VIDEO, AUDIO, COMFORT.
   ===================================================================== */
const MENU={open:false,pause:true,page:0,node:null,held:{},lit:{},stickT:0,stickFired:false,leftHand:false,hunt:true,dirty:true};
const PAGES=['ROUTE','ARSENAL','CREWS','CHEATS','GORE','VIDEO','AUDIO','COMFORT'];
const cyc=(v,list)=>list[(list.indexOf(v)+1)%list.length];
const onoff=v=>v?'ON':'OFF';
const OPTS=[];
const opt=(page,label,act)=>OPTS.push({page:PAGES.indexOf(page),label,act});
/* ROUTE */
ROUTE.forEach((R_,i)=>opt('ROUTE',()=>(i===FLOW.leg?'> ':'')+String(i+1).padStart(2,'0')+' '+R_.title.replace(' · B5','').toUpperCase(),()=>{ closeMenu(); goLeg(i); }));
opt('ROUTE','RESTART THIS LEVEL',()=>{ closeMenu(); restartLevel(); });
/* ARSENAL */
for(const k of WPN_KEYS) if(k!=='fists') opt('ARSENAL',()=>WPN[k].label.toUpperCase(),()=>{ equip(MENU.leftHand?HANDS.L:HANDS.R,newItem(k)); sfx('click'); });
opt('ARSENAL',()=>'INTO: '+(MENU.leftHand?'LEFT HAND':'RIGHT HAND'),()=>{ MENU.leftHand=!MENU.leftHand; });
opt('ARSENAL','EMPTY BOTH HANDS',()=>{ equip(HANDS.R,null); equip(HANDS.L,null); });
opt('ARSENAL','REFILL AMMO',()=>{ for(const h of [HANDS.L,HANDS.R]) if(h.item&&WPN[h.item.key].gun){ h.item.ammo=WPN[h.item.key].mag; h.item.chambered=true; } sfx('reload'); });
/* CREWS */
const CREW_IDS=['kingc','tremorc','gafferc','nonnac','volkovc','lauc','renc'], BOSS_IDS=['king','tremor','gaffer','nonna','volkov','lau','ren'];
CREW_IDS.forEach(id=>opt('CREWS',()=>'+ '+CREWS[CREW_OF[id].crew].label.toUpperCase(),()=>spawnNear(id)));
BOSS_IDS.forEach(id=>opt('CREWS',()=>'+ '+CREW_OF[id].name.toUpperCase(),()=>spawnNear(id)));
opt('CREWS',()=>'NEW ONES HUNT: '+onoff(MENU.hunt),()=>{ MENU.hunt=!MENU.hunt; });
opt('CREWS',()=>'CREW SIZE: x'+FLOW.enemyK,()=>{ FLOW.enemyK=cyc(FLOW.enemyK,[1,2,3]); vrToast('Applies when a level starts',1.6); });
opt('CREWS','REMOVE EVERYONE',()=>{ clearEnemies(); });
opt('CREWS','KILL EVERYONE',()=>{ for(const E of enemies) if(!E.dead){ E.headshot=true; die(E); } });
/* CHEATS */
opt('CHEATS',()=>'GOD MODE: '+onoff(GAME.god),()=>{ GAME.god=!GAME.god; });
opt('CHEATS',()=>'INFINITE AMMO: '+onoff(GAME.infAmmo),()=>{ GAME.infAmmo=!GAME.infAmmo; });
opt('CHEATS',()=>'ONE-HIT KILLS: '+onoff(GAME.oneHit),()=>{ GAME.oneHit=!GAME.oneHit; });
opt('CHEATS',()=>'BULLET TIME: '+onoff(GAME.slow),()=>toggleSlow());
opt('CHEATS',()=>'WORLD SPEED: '+Math.round((GAME.tsBase||1)*100)+'%',()=>{ GAME.tsBase=cyc(GAME.tsBase||1,[1,.6,.35]); });
opt('CHEATS',()=>'ALL DOORS OPEN: '+onoff(GAME.unlockAll),()=>{ GAME.unlockAll=!GAME.unlockAll; });
opt('CHEATS',()=>'DAMAGE TAKEN: x'+(GAME.dmgK||1),()=>{ GAME.dmgK=cyc(GAME.dmgK||1,[1,.5,.25,2]); });
opt('CHEATS',()=>'ENEMY AIM: '+((GAME.accK||1)<1?'POOR':(GAME.accK||1)>1?'DEADLY':'NORMAL'),()=>{ GAME.accK=cyc(GAME.accK||1,[1,.5,1.6]); });
opt('CHEATS',()=>'ENEMIES FROZEN: '+onoff(GAME.aiOff),()=>{ GAME.aiOff=!GAME.aiOff; if(GAME.aiOff) for(const E of enemies) if(!E.dead&&E.st==='alert'){ E.st='idle'; E.aware=false; } });
opt('CHEATS',()=>'TRAIN SPEED: '+({0:'STOPPED',1:'NORMAL',3:'ABSURD'}[GAME.trainK??1]),()=>{ GAME.trainK=cyc(GAME.trainK??1,[1,3,0]); });
opt('CHEATS','FULL HEALTH',()=>{ PL.hp=100; });
/* GORE */
opt('GORE',()=>'BLOOD: x'+(GAME.bloodK||1),()=>{ GAME.bloodK=cyc(GAME.bloodK||1,[1,2,4,.5]); });
opt('GORE',()=>'LIMBS: '+({1:'NORMAL',6:'COME OFF EASY',0:'NEVER'}[GAME.severK??1]),()=>{ GAME.severK=cyc(GAME.severK??1,[1,6,0]); });
opt('GORE',()=>'BLEEDING OUT: '+({1:'NORMAL',2:'FAST',.5:'SLOW'}[GAME.bleedK||1]),()=>{ GAME.bleedK=cyc(GAME.bleedK||1,[1,2,.5]); });
opt('GORE','MOP UP THE BLOOD',()=>{ BP.length=0; for(const k in DEC){ DEC[k].length=0; DEC[k].ver=(DEC[k].ver||0)+1; } });
/* VIDEO */
opt('VIDEO',()=>'VR SHARPNESS: '+({1080:'LOW',1440:'MEDIUM',1680:'HIGH',2064:'NATIVE'}[XR.res]),()=>{ XR.res=cyc(XR.res,[1680,2064,1080,1440]); });
opt('VIDEO',()=>'TEXTURES: '+(texFilter===gl.LINEAR?'SMOOTH':'PIXEL'),()=>{ texFilter=texFilter===gl.LINEAR?gl.NEAREST:gl.LINEAR; });
opt('VIDEO',()=>'SCREEN RES: '+state.res+'P',()=>{ state.res=cyc(state.res,[720,1080,480]); });
opt('VIDEO',()=>'SCENERY: '+onoff(GAME.scenery!==false),()=>{ GAME.scenery=GAME.scenery===false; OUT.vis=GAME.scenery&&LEVEL.kind==='car'; });
opt('VIDEO',()=>'FOG: '+({0:'NORMAL',1:'THICK'}[GAME.fogMode||0]),()=>{ GAME.fogMode=(GAME.fogMode||0)?0:1; GAME.fogNear=GAME.fogMode?6:0; GAME.fogFar=GAME.fogMode?26:0; applyLevelLight(legOf(FLOW.leg)); });
opt('VIDEO',()=>'LASER SIGHTS: '+onoff(XR.laser),()=>{ XR.laser=!XR.laser; });
opt('VIDEO',()=>'SUBTITLES: '+onoff(GAME.subs!==false),()=>{ GAME.subs=GAME.subs===false; });
opt('VIDEO',()=>'FPS ON WRIST: '+onoff(GAME.fps!==false),()=>{ GAME.fps=GAME.fps===false; fpsN.vis=GAME.fps&&XR.on; });
opt('VIDEO',()=>'COLOUR: '+(GAME.vivid===false?'NATURAL':'VIVID'),()=>{ GAME.vivid=GAME.vivid===false; });
opt('VIDEO',()=>'DITHER: '+onoff(GAME.dither!==false),()=>{ GAME.dither=GAME.dither===false; });
/* AUDIO */
const VOL=[0,.35,.7,1], volL=v=>({0:'OFF',.35:'LOW',.7:'MEDIUM',1:'HIGH'}[v]);
GAME.vol={music:.7,ambience:.7,rumble:.7};
const setVol=()=>{ if(typeof MUSIC!=='undefined') try{ MUSIC.setVolumes(GAME.vol); }catch(_){} };
for(const k of ['music','ambience','rumble']) opt('AUDIO',()=>k.toUpperCase()+': '+volL(GAME.vol[k]),()=>{ GAME.vol[k]=cyc(GAME.vol[k],VOL); setVol(); });
opt('AUDIO',()=>'VOICES: '+onoff(GAME.voices!==false),()=>{ GAME.voices=GAME.voices===false; });
opt('AUDIO',()=>'EVERYTHING: '+(GAME.muted?'MUTED':'ON'),()=>{ GAME.muted=!GAME.muted; if(AC){ GAME.muted?AC.suspend():AC.resume(); } });
opt('AUDIO',()=>'NOW PLAYING: '+((typeof MUSIC!=='undefined'&&MUSIC.stats().track)||(typeof MUSIC!=='undefined'&&MUSIC.stats().ambience)||'-').toUpperCase(),()=>levelAudio());
/* COMFORT */
opt('COMFORT',()=>'TURNING: '+(XR.smoothTurn?'SMOOTH':'SNAP '+Math.round((XR.snapA||Math.PI/6)*57.3)+'°'),()=>{ if(XR.smoothTurn){ XR.smoothTurn=false; XR.snapA=Math.PI/6; } else if((XR.snapA||Math.PI/6)<.6) XR.snapA=Math.PI/4; else if(XR.snapA<1) XR.snapA=Math.PI/2; else XR.smoothTurn=true; });
opt('COMFORT',()=>'WALK SPEED: '+({1:'NORMAL',.75:'SLOW',1.3:'FAST',1.6:'FASTEST'}[XR.moveK||1]),()=>{ XR.moveK=cyc(XR.moveK||1,[1,1.3,1.6,.75]); });
opt('COMFORT',()=>'HEIGHT: '+((XR.hOff||0)>0?'+':'')+Math.round((XR.hOff||0)*100)+' CM',()=>{ const n=cyc(Math.round((XR.hOff||0)*100),[0,10,20,-10]); XR.origin[1]+= -(n/100-(XR.hOff||0)); XR.hOff=n/100; });
opt('COMFORT','FACE FORWARD',()=>{ closeMenu(); vrRecenter(); });
opt('COMFORT',()=>'PAUSE IN MENU: '+onoff(MENU.pause),()=>{ MENU.pause=!MENU.pause; });

function spawnNear(id){ let f=null; for(let t=0;t<40&&!f;t++){ const a=rnd(-.6,.6)+Math.atan2(-camBasis().f[0],-camBasis().f[2]),d=rnd(3.5,6),x=PL.x-Math.sin(a)*d,z=PL.z-Math.cos(a)*d,c=navCell(x,z); if(c>=0&&!FLOOR.nav[c]) f={x,z}; }
  if(!f) f=freeSpot(()=>true,3); if(!f) return; const E=spawnCrew(id,f.x,f.z,Math.atan2(PL.x-f.x,PL.z-f.z)); if(E&&MENU.hunt&&!GAME.aiOff){ E.aware=true; E.st='alert'; } FLOW.cleared=false; }

/* ---------- the panel ---------- */
const MW=1024,MH=704,PW=.84,PH=PW*MH/MW,COLS=3,ROWS=6;
const menuTex={c:(()=>{ const c=document.createElement('canvas'); c.width=MW; c.height=MH; return c; })(),glt:null,f:-1,dyn:true};
function pageOpts(){ return OPTS.filter(o=>o.page===MENU.page); }
function btnRect(i){ const c=i%COLS,r=Math.floor(i/COLS); return [12+c*336,86+r*102,326,92]; }
function tabRect(i){ return [8+i*126,8,120,62]; }
function drawMenu(){ const g=menuTex.c.getContext('2d'); g.fillStyle='#0a1226'; g.fillRect(0,0,MW,MH); g.fillStyle='#d4ad5a'; g.fillRect(0,MH-4,MW,4);
  g.textAlign='center'; g.textBaseline='middle';
  PAGES.forEach((p,i)=>{ const [x,y,w,h]=tabRect(i),on=i===MENU.page; g.fillStyle=on?'#d4ad5a':'#16224a'; g.fillRect(x,y,w,h); g.fillStyle=on?'#0a1226':'#b8d0ff'; g.font='400 19px Bungee,"Arial Black",sans-serif'; g.fillText(p,x+w/2,y+h/2,w-8); });
  pageOpts().forEach((o,i)=>{ if(i>=COLS*ROWS) return; const [x,y,w,h]=btnRect(i),lit=MENU.lit[i]>0; g.fillStyle=lit?'#ff6a3a':'#1c2c5e'; g.fillRect(x,y,w,h); g.fillStyle='#2e4a90'; g.fillRect(x,y,w,3);
    g.fillStyle=lit?'#0a1226':'#f2ede2'; g.font='700 23px "IBM Plex Mono",monospace'; g.fillText(typeof o.label==='function'?o.label():o.label,x+w/2,y+h/2,w-14); });
  if(menuTex.glt){ gl.bindTexture(gl.TEXTURE_2D,menuTex.glt); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,menuTex.c); } MENU.dirty=false; }
const menuN=N(world); menuN.vis=false; mk(box(PW+.03,PH+.03,.012),M(null,{color:0x05080f}),menuN,0,0,-.008); mk(plane(PW,PH),M(menuTex,{unlit:true}),menuN,0,0,0);
function openMenu(){ if(MENU.open) return; MENU.open=true; MENU.dirty=true; sfx('click');
  if(XR.on&&XR.head){ const {eye,f}=XR.head,fl=norm3([f[0],0,f[2]]); menuN.p=[eye[0]+fl[0]*.46,eye[1]-.2,eye[2]+fl[2]*.46]; menuN.r=[-.25,Math.atan2(-fl[0],-fl[2]),0]; menuN.vis=true; drawMenu(); }
  else { document.exitPointerLock&&document.exitPointerLock(); renderHtmlMenu(); $('menu').hidden=false; } }
function closeMenu(){ if(!MENU.open) return; MENU.open=false; menuN.vis=false; $('menu').hidden=true; sfx('click',.6); }
function toggleMenu(){ MENU.open?closeMenu():openMenu(); }
function menuAct(i){ const o=pageOpts()[i]; if(!o) return; MENU.lit[i]=.25; o.act(); MENU.dirty=true; if(!XR.on&&MENU.open) renderHtmlMenu(); }
/* poke: the fist point in the panel's frame */
function pokeMenu(p,h,dt){ if(!menuN.vis) return; for(const k in MENU.lit) if(MENU.lit[k]>0){ MENU.lit[k]-=dt/2; MENU.dirty=true; }
  const a=menuN.r[0],b=menuN.r[1],d=v3.sub(p,menuN.p),R_=[Math.cos(b),0,-Math.sin(b)];
  const lx=v3.dot(d,R_), fwd=[Math.sin(b),0,Math.cos(b)], up=[0,1,0], U=v3.add(v3.sc(up,Math.cos(a)),v3.sc(fwd,-Math.sin(a))), Nn=v3.add(v3.sc(fwd,Math.cos(a)),v3.sc(up,Math.sin(a)));
  const ly=v3.dot(d,U), lz=v3.dot(d,Nn), key=h.side;
  const inside=Math.abs(lx)<PW/2&&Math.abs(ly)<PH/2&&lz<.05&&lz>-.06;
  if(inside&&!MENU.held[key]){ MENU.held[key]=true; const u=(lx/PW+.5)*MW,v=(.5-ly/PH)*MH;
    for(let i=0;i<PAGES.length;i++){ const [x,y,w,hh]=tabRect(i); if(u>=x&&u<=x+w&&v>=y&&v<=y+hh){ MENU.page=i; MENU.dirty=true; sfx('click',.7); buzz(h.hand,.5,25); } }
    pageOpts().forEach((o,i)=>{ const [x,y,w,hh]=btnRect(i); if(u>=x&&u<=x+w&&v>=y&&v<=y+hh){ menuAct(i); sfx('click',.8); buzz(h.hand,.6,30); } }); }
  else if(!inside) MENU.held[key]=false;
  if(MENU.dirty) drawMenu(); }
/* the left stick: a quick click is bullet time, holding it opens or closes the menu */
function menuButtons(hand,b,dt){ if(hand!=='left') return; const p=!!(b[3]&&b[3].pressed);
  if(p){ MENU.stickT+=dt; if(MENU.stickT>=.55&&!MENU.stickFired){ MENU.stickFired=true; toggleMenu(); buzz('left',.6,40); } }
  else { if(MENU.stickT>0&&!MENU.stickFired&&!MENU.open) toggleSlow(); MENU.stickT=0; MENU.stickFired=false; }
  for(let i=6;i<b.length;i++){ const k='m'+hand+i,pr=!!(b[i]&&b[i].pressed); if(pr&&!MENU.held[k]&&i>6) toggleMenu(); MENU.held[k]=pr; } } /* if the browser ever passes the menu button through, it opens the menu too */
function menuStick(){ }
/* the MENU plate on your left wrist, poked with the right hand */
const wristTex=tex(32,12,'#0a1226',g=>{ text(g,'MENU',(32-textW('MENU'))>>1,3,'#d4ad5a'); });
const wristN=mk(plane(.05,.019),M(wristTex,{unlit:true}),HANDS.L.armN,.046,0,-.11,0,Math.PI/2,0);
function pokeWrist(p,h,dt){ wristN.vis=XR.on; if(h.side!=='R'||!XR.on) return; const w=wristN.world,d=Math.hypot(p[0]-w[12],p[1]-w[13],p[2]-w[14]),k='wrist';
  if(d<.05&&!MENU.held[k]){ MENU.held[k]=true; toggleMenu(); buzz('right',.6,40); buzz('left',.6,40); } else if(d>.08) MENU.held[k]=false; }
function menuTick(dt){ if(MENU.open&&XR.on&&MENU.dirty) drawMenu(); }
function turnBy(a,eye){ const c=Math.cos(a),s=Math.sin(a),dx=XR.origin[0]-eye[0],dz=XR.origin[2]-eye[2]; XR.origin[0]=eye[0]+dx*c+dz*s; XR.origin[2]=eye[2]-dx*s+dz*c; XR.yaw+=a; }

/* ---------- the same menu on a flat screen ---------- */
(function(){ const P=document.createElement('section'); P.id='menu'; P.hidden=true; P.setAttribute('aria-label','Menu'); document.body.append(P);
  P.addEventListener('pointerdown',e=>e.stopPropagation()); })();
function renderHtmlMenu(){ const P=$('menu'); P.innerHTML='';
  const tabs=document.createElement('div'); tabs.className='mtabs'; PAGES.forEach((p,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='btn'; b.textContent=p; b.setAttribute('aria-pressed',String(i===MENU.page)); b.addEventListener('click',()=>{ MENU.page=i; renderHtmlMenu(); }); tabs.append(b); });
  const grid=document.createElement('div'); grid.className='mgrid'; pageOpts().forEach((o,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='btn'; b.textContent=typeof o.label==='function'?o.label():o.label; b.addEventListener('click',()=>menuAct(i)); grid.append(b); });
  const close=document.createElement('button'); close.type='button'; close.className='btn mclose'; close.textContent='Close (Esc)'; close.addEventListener('click',closeMenu);
  P.append(tabs,grid,close); }
addEventListener('keydown',e=>{ if(!GAME.started) return; if(e.code==='Escape'||e.code==='KeyM'){ e.preventDefault(); toggleMenu(); } });
