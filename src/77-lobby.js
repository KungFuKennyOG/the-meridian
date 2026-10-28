/* =====================================================================
   THE LOBBY: platform 0 of the Tokyo Meridian Terminal is where the game begins. No title screen: you
   stand on the platform with the train waiting. The ticket machine starts a new run, continues an old one
   or opens the settings; the payphone rings with your briefing; the tannoy announces; a vending machine
   takes a punch for a can of coffee; bottles on a bench take a bullet. Board the train when you're ready.
   Also here: the gold watch on your left wrist (it shows the next stop), drinking, the story beats on the
   route, and the finale's horn cord.
   ===================================================================== */
const LOBBY={on:false,ring:0,ringT:0,answered:false,paT:14,nagT:50,vendCd:0,targets:[],hits:0,useI:[],ticket:null,root:null};
/* where things stand on platform 0 (station coordinates after centring; the start is at x=-8, z=RZ-1.6, facing the train at -z) */
const LOBBY_AT={kiosk:[-6.4,3.4],phone:[-11.2,0],vend:[-13.0,0],bench:[1.6,0],sign:[-3,0]}; /* [x, distance in from the back wall] (kiosk free-standing, facing the start) */
const mKioskBody=()=>M(P2(32,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#24345e'],[.5,'#14203a'],[1,'#0c1426']]); R(g,BRAND.gold,0,0,w,1); R(g,BRAND.gold,0,h-1,w,1); R(g,'rgba(255,255,255,.12)',1,1,1,h-2); },3,77));

/* interactables: a box in the world that a fist can poke (VR) or the crosshair + G can use (flat screen) */
function addUse(node,half,act,label){ const u={node,half,act,label,held:{}}; LOBBY.useI.push(u); return u; }
function useBox(u){ const w=u.node.world; return {c:[w[12],w[13],w[14]],h:u.half}; }
function pokeUse(p,h){ if(!LOBBY.useI.length) return; for(const u of LOBBY.useI){ const b=useBox(u),inside=Math.abs(p[0]-b.c[0])<b.h[0]+.03&&Math.abs(p[1]-b.c[1])<b.h[1]+.03&&Math.abs(p[2]-b.c[2])<b.h[2]+.03;
    if(inside&&!u.held[h.side]){ u.held[h.side]=true; u.act(h); buzz(h.hand,.6,35); } else if(!inside) u.held[h.side]=false; } }
function flatUse(){ const {eye,f}=camBasis(); let best=null,bt=2.2; for(const u of LOBBY.useI){ const b=useBox(u); const t=rayAABB(eye,f,v3.sub(b.c,b.h.map(v=>v+.05)),v3.add(b.c,b.h.map(v=>v+.05))); if(t!==null&&t<bt){ bt=t; best=u; } }
  if(best){ best.act(null); return true; } return false; }
function rayAABB(o,d,mn,mx){ let t0=0,t1=1e9; for(let i=0;i<3;i++){ const inv=1/(d[i]||1e-9); let a=(mn[i]-o[i])*inv,b=(mx[i]-o[i])*inv; if(a>b){ const s=a; a=b; b=s; } t0=Math.max(t0,a); t1=Math.min(t1,b); if(t1<t0) return null; } return t0; }

/* ---------- build the lobby into Tokyo station by day ---------- */
function buildLobby(){ LOBBY.useI.length=0; LOBBY.targets.length=0; const root=N(LEVEL.root); LOBBY.root=root; LOBBY.on=true; LOBBY.answered=DLG.said.has('briefing'); LOBBY.ring=0; LOBBY.hits=0;
  const zB=RZ-.05, gold=M(null,{color:0xd4ad5a}), dark=M(null,{color:0x0a0f1c}), steel=M(null,{color:0xb8bcc4}), cream=M(null,{color:0xf2ece0});
  /* the ticket machine: a navy-and-gold kiosk with a lit screen and three big buttons */
  { const [x,dz]=LOBBY_AT.kiosk, z=zB-dz, k=N(root,x,0,z); LOBBY.kiosk=k;
    mk(box(1.1,1.95,.7,{at:[0,.975,0]}),mKioskBody(),k); mk(box(1.16,.08,.76),gold,k,0,1.99,0); mk(box(1.16,.12,.76),dark,k,0,.06,0);
    const scr=brandTex(512,384,(g,w,h)=>{ g.fillStyle='#070b16'; g.fillRect(0,0,w,h); logoLockup(g,18,16,w-36,150);
      const sv=loadProgress(), K=(typeof STORY!=='undefined'&&STORY.lobby&&STORY.lobby.kiosk)||{};
      g.fillStyle=BRAND.gold; g.fillRect(18,186,w-36,3); g.textAlign='left'; g.textBaseline='top';
      g.fillStyle=BRAND.cream; g.font=`700 30px ${BRAND.jp}`; g.fillText(K.title||'WORLD LOOP · ONE DAY · ONE SEAT',22,204);
      g.font=`600 24px ${BRAND.mono}`; g.fillStyle='#b8d0ff'; g.fillText(sv&&sv.leg>0?'Saved at: '+ROUTE[sv.leg].title.replace(' · B5',''):'No journey saved.',22,250);
      const labs=[K.newRun||'NEW RUN',K.cont||'CONTINUE',K.settings||'SETTINGS'], cols=['#7cf06a',sv&&sv.leg>0?BRAND.gold2:'#4a5468','#29e0e6'];
      labs.forEach((s,i)=>{ const bx=22+i*((w-44)/3); g.fillStyle=cols[i]; g.font=`700 24px ${BRAND.jp}`; g.fillText(s,bx+6,312); g.fillRect(bx+6,344,(w-44)/3-24,6); }); });
    LOBBY.kioskTex=scr; mk(box(.9,.68,.02),M(scr,{unlit:true}),k,0,1.48,.351); mk(box(.98,.76,.03),gold,k,0,1.48,.34);
    mk(box(1.02,.1,.3),dark,k,0,1.05,.42,-.5); /* the button shelf */
    const bm=[G('#7cf06a'),G('#f2d27a'),G('#29e0e6')], acts=[()=>kioskNew(),()=>kioskCont(),()=>{ sfx('click'); openMenu(); }];
    for(let i=0;i<3;i++){ const b=mk(cyl(.07,.07,.05,14),bm[i],k,-.3+i*.3,1.11,.46,Math.PI/2-.5); addUse(b,[.075,.06,.07],h=>{ b.p[2]=.44; setTimeout(()=>b.p[2]=.46,160); acts[i](); }); }
    const slot=mk(box(.3,.03,.05),dark,k,.25,.62,.36); LOBBY.slot=slot; }
  /* the payphone: wall-hung, receiver on the hook, rings until you pick up */
  { const [x]=LOBBY_AT.phone, z=zB-.12, p=N(root,x,0,z,0,Math.PI,0);
    mk(box(.5,.8,.22,{at:[0,.4,0]}),M(P2(16,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a9a6a'],[1,'#1e6a44']]); R(g,'#0e3a24',2,4,w-4,10); for(let k=0;k<12;k++) R(g,'#d8e0d8',3+(k%3)*4,17+(k/3|0)*3.4,3,2); R(g,'rgba(255,255,255,.15)',1,1,1,h-2); },2,78)),p,0,1.05,0);
    mk(box(.62,.06,.3),cream,p,0,1.98,0); mk(box(.6,.5,.03),M(brandTex(128,96,(g,w,h)=>{ g.fillStyle='#0a1226'; g.fillRect(0,0,w,h); roundel(g,22,48,18); g.fillStyle=BRAND.cream; g.font=`700 22px ${BRAND.jp}`; g.textAlign='left'; g.textBaseline='middle'; g.fillText('PHONE',46,36); g.font=`700 16px ${BRAND.jp}`; g.fillStyle=BRAND.gold; g.fillText('電話 · TELEFONO',46,62); }),{unlit:true}),p,0,2.3,-.05);
    const rec=N(p,-.19,1.32,.14); mk(box(.07,.3,.07),M(null,{color:0x1a1a1e}),rec); mk(box(.09,.08,.1),M(null,{color:0x1a1a1e}),rec,0,.15,.01); mk(box(.09,.08,.1),M(null,{color:0x1a1a1e}),rec,0,-.15,.01);
    LOBBY.receiver=rec; LOBBY.phoneAt=[p.p[0],1.5,z-.15]; addUse(rec,[.08,.2,.08],()=>answerPhone()); }
  /* the vending machine: punch it */
  { const [x]=LOBBY_AT.vend, z=zB-.4, v=N(root,x,0,z,0,Math.PI,0); LOBBY.vend=v;
    mk(box(1.0,1.9,.7,{at:[0,.95,0]}),F(M(null,{color:0xd63a2c}),M(P2(32,64,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e84a3a'],[1,'#b82a1e']]); vfill(g,3,4,w-6,28,[[0,'#f2f8ff'],[1,'#c8d8e8']]); const r=rng(31);
      for(let y=0;y<3;y++) for(let k=0;k<5;k++){ const c=['#d63a2c','#2a6ad8','#f2c230','#2a9a5a','#8a5a2a'][(k+y*2)%5]; vfill(g,5+k*5,6+y*9,3,7,[[0,mix(c,'#ffffff',.3)],[1,c]]); R(g,'#3a3a40',5+k*5,13+y*9,3,1); }
      R(g,'#1a1a20',4,36,w-8,3); R(g,'#2a2a30',4,42,w-8,8); R(g,'#0e0e12',8,53,16,7); R(g,'#f2c230',w-8,44,3,4); },2,79),{emissive:0x2a2a2a})),v);
    addUse(v,[.5,.95,.36],h=>vendPunch(h)); LOBBY.vendTray=[v.p[0],.45,z-.5]; }
  /* the practice bench: five bottles to shoot */
  { const [x]=LOBBY_AT.bench, z=zB-.5, b=N(root,x,0,z,0,Math.PI,0); const wood=M(P2(16,16,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b88a5a'],[1,'#8a5e36']]); for(let y=0;y<h;y+=4) R(g,'#6a4428',0,y,w,1); },4,7));
    mk(box(2.2,.06,.5),wood,b,0,.46,0); for(const dx of [-1,1]) mk(box(.06,.46,.45),steel,b,dx,.23,0);
    for(let i=0;i<5;i++){ const n=N(b,-.8+i*.4,.49,0); pBottleWhole(n,i); LOBBY.targets.push({n,alive:true,r:.06}); } LOBBY.bench=b; }
  /* the house sign, hung over the platform: the lockup, both faces */
  { const [x]=LOBBY_AT.sign, s=N(root,x,3.35,0); const t=brandTex(1024,256,(g,w,h)=>{ g.fillStyle=BRAND.navy; g.fillRect(0,0,w,h); g.strokeStyle=BRAND.gold; g.lineWidth=6; g.strokeRect(10,10,w-20,h-20); logoLockup(g,40,28,w-80,h-56); });
    mk(box(4.4,1.1,.08),F(dark,M(t,{unlit:true}),M(t,{unlit:true})),s); mk(box(4.5,.06,.12),gold,s,0,.58,0); mk(box(4.5,.06,.12),gold,s,0,-.58,0); for(const dx of [-2,2]) mk(box(.03,1.6,.03),gold,s,dx,1.4,0); }
  updateWorld(world,null); }
function pBottleWhole(n,i){ const c=['#2a6a3a','#6a3a1a','#2a4a8a','#3a6a2a','#8a6a1a'][i%5], m=M(null,{color:hexInt(c),emissive:hexInt(mix(c,'#000000',.6))});
  mk(cyl(.035,.035,.16,8),m,n,0,.08,0); mk(cyl(.014,.033,.06,8,{open:true}),m,n,0,.19,0); mk(cyl(.014,.014,.05,6),m,n,0,.245,0); mk(box(.05,.05,.002),M(null,{color:0xf2ece0}),n,0,.08,.036); }

/* ---------- what the lobby does ---------- */
function lobbyStart(){ if(!LOBBY.on) return; LOBBY.ring=LOBBY.answered?0:1; LOBBY.ringT=2.5; LOBBY.paT=6; LOBBY.nagT=55; if(typeof STORY!=='undefined'&&!LOBBY.answered) say([['phone',STORY.lobby.phoneRing||'The payphone is ringing.']],{at:LOBBY.phoneAt}); }
function lobbyTick(dt){ if(!LOBBY.on||!GAME.started) return; LOBBY.vendCd-=dt;
  if(LOBBY.ring){ LOBBY.ringT-=dt; if(LOBBY.ringT<=0){ LOBBY.ringT=3; ringTone(); } LOBBY.receiver.p[0]=-.19+Math.sin(GAME.t*60)*.004; }
  LOBBY.paT-=dt; if(LOBBY.paT<=0){ LOBBY.paT=rnd(28,42); if(!DLG.cur&&typeof STORY!=='undefined') say([['pa',pick(STORY.lobby.pa)]]); }
  if(LOBBY.answered){ LOBBY.nagT-=dt; if(LOBBY.nagT<=0){ LOBBY.nagT=rnd(45,70); if(!DLG.cur&&typeof STORY!=='undefined') sayOne(STORY.lobby.idle,'handler'); } }
  if(LOBBY.ticket){ const T=LOBBY.ticket; T.t+=dt; T.n.p[2]=Math.min(.12,T.t*.3)+.37; if(T.t>6){ const i=T.n.par.kids.indexOf(T.n); if(i>=0) T.n.par.kids.splice(i,1); LOBBY.ticket=null; } } }
function answerPhone(){ if(!LOBBY.on) return; LOBBY.ring=0; LOBBY.receiver.p=[-.19,1.62,.22]; sfx('click',.8);
  if(typeof STORY==='undefined') return; if(!say(STORY.lobby.briefing,{key:'briefing',cut:true,at:LOBBY.phoneAt})) say([['handler',pick(STORY.lobby.idle)[1]||'Get on the train, Nico.']],{at:LOBBY.phoneAt}); LOBBY.answered=true;
  setTimeout(()=>{ if(LOBBY.receiver) LOBBY.receiver.p=[-.19,1.32,.14]; },60000); }
function ringTone(){ const ac=audio(); if(!ac||ac.state!=='running') return; const t=ac.currentTime, P=LOBBY.phoneAt, d=Math.hypot(P[0]-PL.x,P[2]-PL.z), v=.16/Math.max(1,d*.35);
  for(let k=0;k<2;k++){ const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(); o.type=o2.type='square'; o.frequency.value=440; o2.frequency.value=480; g.gain.setValueAtTime(0,t+k*.5); g.gain.linearRampToValueAtTime(v,t+k*.5+.01); g.gain.setValueAtTime(v,t+k*.5+.38); g.gain.linearRampToValueAtTime(0,t+k*.5+.4);
    const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2200; o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(ac.destination); o.start(t+k*.5); o2.start(t+k*.5); o.stop(t+k*.5+.42); o2.stop(t+k*.5+.42); } }
function kioskNew(){ sfx('click'); try{ localStorage.removeItem('meridian.save'); }catch(_){} LOBBY.kioskTex.paint(); GAME.stats={kills:0,deaths:0,start:GAME.t};
  const K=(typeof STORY!=='undefined'&&STORY.lobby&&STORY.lobby.kiosk)||{}; vrToast(K.thanks||'TICKET PRINTED · PLATFORM 0',2.2); printTicket(); }
function kioskCont(){ const sv=loadProgress(); if(!sv||!(sv.leg>0)){ sfx('bump',.5); return; } sfx('click'); startRun(true); }
function printTicket(){ if(LOBBY.ticket||!LOBBY.kiosk) return; const tt=brandTex(128,48,(g,w,h)=>{ g.fillStyle='#f6efe0'; g.fillRect(0,0,w,h); g.fillStyle=BRAND.navy; g.fillRect(0,0,w,10); roundel(g,16,28,12); g.fillStyle=BRAND.navy; g.font=`700 12px ${BRAND.jp}`; g.textAlign='left'; g.textBaseline='middle'; g.fillText('TOKYO ⟶ TOKYO',32,22); g.font=`600 10px ${BRAND.mono}`; g.fillText('1 ADULT · WORLD LOOP · CAR ANY',32,36); for(let x=0;x<w;x+=6) g.fillRect(x,h-3,3,3); });
  const n=mk(box(.2,.004,.075),F(M(null,{color:0xf6efe0}),M(null,{color:0xf6efe0}),M(tt),M(tt)),LOBBY.kiosk,.25,.62,.37); LOBBY.ticket={n,t:0}; sfx('click',.5); }
function vendPunch(h){ if(LOBBY.vendCd>0) return; LOBBY.vendCd=1.2; sfx('punch',.9); sfx('bump',.7);
  if(h&&XR.on){ const s=h.vel?Math.hypot(...h.vel):3; if(s<1.2) return; }
  setTimeout(()=>{ sfx('bash',.5); const T=LOBBY.vendTray, Mw=m4.make(); m4.compose(Mw,[T[0]+rnd(-.15,.15),T[1]+.1,T[2]],[0,rnd(0,3),0],[1,1,1]); const P=addPickup(newItem('can'),Mw,[rnd(-.3,.3),.6,-1.1],[rnd(-3,3),rnd(-3,3),0]);
    if(typeof STORY!=='undefined'&&Math.random()<.5) sayOne(STORY.lobby.vending,'nico'); },350); }
/* the practice bottles: bullets test them before the walls */
function shotTargets(o,d,tmax){ if(!LOBBY.on) return false; for(const T of LOBBY.targets){ if(!T.alive) continue; const w=T.n.world, c=[w[12],w[13]+.12,w[14]], oc=v3.sub(c,o), t=v3.dot(oc,d); if(t<0||t>tmax) continue; const q=v3.sub(oc,v3.sc(d,t));
    if(v3.dot(q,q)<T.r*T.r){ T.alive=false; T.n.vis=false; sfx('glass',.9); for(let i=0;i<12;i++) emit(c,[rnd(-1.5,1.5),rnd(.5,2.5),rnd(-1.5,1.5)],rnd(.008,.018),'dust',1.2); LOBBY.hits++;
      if(LOBBY.targets.every(T=>!T.alive)){ if(typeof STORY!=='undefined') sayOne(STORY.lobby.practice,'nico'); setTimeout(()=>{ for(const T of LOBBY.targets){ T.alive=true; T.n.vis=true; } },4000); } return true; } } return false; }

/* ---------- the canned coffee, and drinking anything you hold up to your mouth ---------- */
function pCan(g){ const body=M(P2(32,16,(c,w,h)=>{ vfill(c,0,0,w,h,[[0,'#3a2418'],[1,'#1e120c']]); R(c,'#f2c230',0,3,w,2); R(c,'#f2ece0',0,h-5,w,2); c.fillStyle='#f2ece0'; c.font='bold 6px monospace'; c.fillText('BLACK',3,10); },2,91)), top=M(null,{color:0xc8ccd2});
  mk(cyl(.033,.033,.115,12),[body,top,top],g,0,0,.02,Math.PI/2); return g; }
WPN.can={label:'Canned coffee',build:pCan,grip:[0,0,0],melee:'blunt',reach:1.0,pts:[[0,0,.06]],speed:1.4,drink:true};
function tryDrink(h){ const it=h.item; if(!it||it.drunk) return; const w=WPN[it.key]; if(!(w.drink||it.key==='bottle')) return; if(!XR.on||!XR.head) return;
  const {eye,u,f}=XR.head, mouth=v3.add(v3.add(eye,v3.sc(u,-.085)),v3.sc(f,.06)), Mi=h.node.world, p=[Mi[12],Mi[13],Mi[14]];
  if(Math.hypot(p[0]-mouth[0],p[1]-mouth[1],p[2]-mouth[2])<.13) drink(it,h); }
function drink(it,h){ it.drunk=true; glug(); PL.hp=Math.min(100,PL.hp+(it.key==='can'?35:20)); if(h) buzz(h.hand,.3,200); if(typeof STORY!=='undefined'&&Math.random()<.6) setTimeout(()=>sayOne(STORY.lobby.vending,'nico'),900); }
function flatDrink(){ const it=HANDS.R.item; if(!it||it.drunk) return false; const w=WPN[it.key]; if(!(w.drink||it.key==='bottle')) return false; drink(it,null); return true; }
function glug(){ const ac=audio(); if(!ac) return; const t=ac.currentTime; for(let k=0;k<4;k++){ const o=ac.createOscillator(),g=ac.createGain(); o.type='sine'; o.frequency.setValueAtTime(180+k*12,t+k*.22); o.frequency.exponentialRampToValueAtTime(90,t+k*.22+.15); g.gain.setValueAtTime(0,t+k*.22); g.gain.linearRampToValueAtTime(.18,t+k*.22+.02); g.gain.exponentialRampToValueAtTime(.001,t+k*.22+.18); o.connect(g); g.connect(ac.destination); o.start(t+k*.22); o.stop(t+k*.22+.2); } }

/* ---------- the gold watch on your left wrist: where the train goes next ---------- */
const watchTex=brandTex(128,128,(g,w,h)=>{ const R_=legOf(FLOW.leg); let nxt=null; for(let i=FLOW.leg+1;i<ROUTE.length;i++) if(ROUTE[i].kind==='station'){ nxt=ROUTE[i]; break; }
  const W_=(typeof STORY!=='undefined'&&STORY.watch)||{}; g.fillStyle='#0a1226'; g.beginPath(); g.arc(64,64,62,0,7); g.fill(); g.strokeStyle=BRAND.gold; g.lineWidth=6; g.beginPath(); g.arc(64,64,59,0,7); g.stroke();
  for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; g.fillStyle=BRAND.gold; g.fillRect(64+Math.sin(a)*50-2,64-Math.cos(a)*50-2,4,4); }
  g.textAlign='center'; g.textBaseline='middle'; g.fillStyle=BRAND.gold; g.font=`700 15px ${BRAND.jp}`; g.fillText(nxt?(W_.label||'NEXT'):(W_.end||'END OF THE LINE'),64,40);
  const name=nxt?nxt.title.replace(' · B5','').toUpperCase():''; let fs=22; g.font=`400 ${fs}px ${BRAND.word}`; while(g.measureText(name).width>100&&fs>10){ fs--; g.font=`400 ${fs}px ${BRAND.word}`; } g.fillStyle=BRAND.cream; g.fillText(name,64,68);
  g.fillStyle=BRAND.hot; g.font=`700 12px ${BRAND.mono}`; g.fillText(String(FLOW.leg+1).padStart(2,'0')+' / '+ROUTE.length,64,94); }); watchTex.dyn=true;
const watchN=N(HANDS.L.armN,-.052,0,-.03,0,-Math.PI/2,0); mk(cyl(.021,.021,.008,16),M(null,{color:0xd4ad5a}),watchN,0,0,0,Math.PI/2); mk(plane(.036,.036),M(watchTex,{unlit:true}),watchN,0,0,.0045);
let watchLeg=-1; function watchTick(){ watchN.vis=XR.on; if(watchLeg!==FLOW.leg){ watchLeg=FLOW.leg; watchTex.paint(); } }

/* ---------- the story along the route ---------- */
function storyEnter(i,R_){ if(typeof STORY==='undefined') return; const S=STORY;
  const city=R_.kind==='station'?(R_.night?'tokyonight':R_.key):null;
  if(R_.first&&!R_.night){ showCard('TOKYO','Platform 0 · Tokyo Meridian Terminal'); return; }
  showCard(R_.title.replace(' · B5','').toUpperCase(),R_.sub);
  if(city&&S.stations[city]) setTimeout(()=>{ if(FLOW.leg===i) say(S.stations[city],{key:'st'+i}); },2200);
  if(R_.kind==='car'&&S.cars[R_.key]) setTimeout(()=>{ if(FLOW.leg===i) say(S.cars[R_.key].enter,{key:'car'+i}); },1600); }
function storyCleared(i,R_){ if(typeof STORY==='undefined'||R_.kind!=='car') return; const c=STORY.cars[R_.key]; if(c&&!R_.last) setTimeout(()=>say(c.clear,{key:'clr'+i}),900); }
function storyKill(E){ if(typeof STORY==='undefined') return; GAME.stats=GAME.stats||{kills:0,deaths:0}; GAME.stats.kills++;
  if(E.boss&&STORY.bossDown[E.id]) setTimeout(()=>say(STORY.bossDown[E.id],{key:'boss'+E.id}),1200);
  else if(Math.random()<.07&&!DLG.cur&&!DLG.q.length) setTimeout(()=>sayOne(STORY.kills,'nico'),700); }
function storyPickup(key){ if(typeof STORY==='undefined') return; const l=STORY.pickup[key]; if(l) say([['nico',l]],{key:'pk'+key}); }
function storyDeath(){ if(typeof STORY==='undefined') return; GAME.stats=GAME.stats||{kills:0,deaths:0}; GAME.stats.deaths++; dlgClear(); setTimeout(()=>sayOne(STORY.death,'handler'),1400); }

/* ---------- the finale: Ren is down, take the controls, pull the horn ---------- */
const FIN={on:false,t:0,cord:null,pulled:false};
function finaleArm(){ if(FIN.on) return; FIN.on=true; FIN.t=0; FIN.pulled=false; const root=LEVEL.root, red=M(null,{color:0xc8202a,emissive:0x400808});
  const c=N(root,10.6,2.0,0); mk(cyl(.006,.006,.9,5),M(null,{color:0xd8d0b8}),c,0,.45,0); const hdl=mk(cyl(.03,.03,.16,10),red,c,0,-.02,0); FIN.cord=c; FIN.handle=hdl;
  LOBBY.useI.length=0; addUse(hdl,[.06,.1,.06],()=>pullHorn());
  if(typeof STORY!=='undefined') say(STORY.ending.lines.slice(0,Math.max(1,STORY.ending.lines.length-3)),{key:'ending1',cut:true}); vrToast('Pull the horn',3); }
function pullHorn(){ if(FIN.pulled) return; FIN.pulled=true; FIN.cord.p[1]=1.8; horn(); if(typeof STORY!=='undefined') say(STORY.ending.lines.slice(Math.max(1,STORY.ending.lines.length-3)),{key:'ending2',cut:true});
  setTimeout(()=>showEndCard(),3500); }
function horn(){ const ac=audio(); if(!ac) return; const t=ac.currentTime; for(const f of [277,349,415]){ const o=ac.createOscillator(),g=ac.createGain(),lp=ac.createBiquadFilter(); o.type='sawtooth'; o.frequency.value=f; lp.type='lowpass'; lp.frequency.value=1400; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.09,t+.08); g.gain.setValueAtTime(.09,t+2.4); g.gain.linearRampToValueAtTime(0,t+3.2); o.connect(lp); lp.connect(g); g.connect(ac.destination); o.start(t); o.stop(t+3.3); } }
const endTex=brandTex(1024,640,(g,w,h)=>{ g.fillStyle='#070b16'; g.fillRect(0,0,w,h); g.strokeStyle=BRAND.gold; g.lineWidth=6; g.strokeRect(14,14,w-28,h-28); logoLockup(g,60,40,w-120,190);
  const card=(typeof STORY!=='undefined'&&STORY.ending&&STORY.ending.card)||['END OF THE LINE']; const st=GAME.stats||{kills:0,deaths:0};
  g.textAlign='center'; g.textBaseline='top'; let y=270; card.forEach((l,i)=>{ g.fillStyle=i?BRAND.cream:BRAND.gold2; g.font=i?`600 26px ${BRAND.mono}`:`400 46px ${BRAND.word}`; g.fillText(l,w/2,y,w-120); y+=i?40:62; });
  g.fillStyle=BRAND.teal; g.font=`700 26px ${BRAND.jp}`; g.fillText(`${st.kills} DOWN  ·  ${st.deaths} RESTARTS  ·  ONE DAY  ·  ONE TRAIN`,w/2,h-90); }); endTex.dyn=true;
const endN=N(world); endN.vis=false; mk(plane(2.4,1.5),M(endTex,{unlit:true}),endN,0,0,0);
function showEndCard(){ endTex.paint(); const {eye,f}=camBasis(), fl=norm3([f[0],0,f[2]]); endN.p=[eye[0]+fl[0]*2.6,eye[1]+.1,eye[2]+fl[2]*2.6]; endN.r=[0,Math.atan2(-fl[0],-fl[2]),0]; endN.vis=true;
  showMsg('END OF THE LINE',((typeof STORY!=='undefined'&&STORY.ending.card)||[]).slice(1).join(' '));
  setTimeout(()=>{ endN.vis=false; $('msg').hidden=true; FIN.on=false; DLG.said.clear(); equip(HANDS.R,null); equip(HANDS.L,null); goLeg(0); },16000); }
