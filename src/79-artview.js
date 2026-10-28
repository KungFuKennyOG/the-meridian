/* =====================================================================
   THE ART SET. The same build, opened as art.html, becomes a viewer for everything in the game: the whole
   train running through the countryside, every car and station as the game builds them, the crews lined up
   on platform 0, and the story. Nothing fights back: AI off, no HUD. Drag to orbit, scroll to zoom,
   right-drag to pan; or walk it in first person.
   ===================================================================== */
const ART={on:!!window.MERIDIAN_ART,view:'train',sel:0,yaw:.9,pitch:.32,r:26,tgt:[0,2,0],tgtTo:null,rTo:null,walk:false,drag:null,trainRoot:null,speed:30,cast:[]};
function artCam(){ const cp=Math.cos(ART.pitch),f=[-Math.sin(ART.yaw)*cp,-Math.sin(ART.pitch),-Math.cos(ART.yaw)*cp];
  const eye=[ART.tgt[0]-f[0]*ART.r,ART.tgt[1]-f[1]*ART.r,ART.tgt[2]-f[2]*ART.r], r=norm3(v3.cross(f,[0,1,0])), u=v3.cross(r,f); return {f,r,u,eye}; }
const ART_TABS=[['train','The train'],['cars','Cars'],['stations','Stations'],['crews','Bounty hunters'],['story','The story']];
function artItems(view){ if(view==='cars') return ROUTE.map((R_,i)=>({R_,i})).filter(o=>o.R_.kind==='car').map(o=>{ const W=WAGONS.find(w=>w.key===o.R_.key)||{}; return {title:W.name||o.R_.title,sub:(W.sub||o.R_.sub),note:W.note||'',sw:W.sw,leg:o.i}; });
  if(view==='stations') return ROUTE.map((R_,i)=>({R_,i})).filter(o=>o.R_.kind==='station').map(o=>({title:o.R_.title.replace(' · B5',''),sub:o.R_.sub,note:(SCENES[o.R_.night?'tokyonight':o.R_.key==='tokyo'?'japan':o.R_.key==='baikal'?'siberia':o.R_.key]||{}).note||'',leg:o.i}));
  if(view==='crews') return ART_CAST.map(id=>{ const R_=ROSTER[id]; return {title:R_.name,sub:R_.role+' · '+R_.stop,note:R_.note,id}; });
  return []; }
const ART_CAST=['tanaka','tanakac','lau','lauc','volkov','volkovc','gaffer','gafferc','nonna','nonnac','tremor','tremorc','king','kingc','chefc','ren','renc'];

/* ---------- views ---------- */
function artClear(){ clearEnemies(); if(ART.trainRoot){ const i=world.kids.indexOf(ART.trainRoot); if(i>=0) world.kids.splice(i,1); disposeTree(ART.trainRoot); ART.trainRoot=null; } }
function artShowTrain(){ artClear(); unloadLevel(); OUT.vis=true; setScene('japan'); const S=SCENES.japan;
  setLights({amb:S.light.amb,dir:S.light.dir,dirCol:S.light.dirCol,fog:F3(S.horizon),fogNear:90,fogFar:240,pl:[]});
  const root=N(world); ART.trainRoot=root; GEO_TEMP=true; const n=WAGONS.length;
  WAGONS.forEach((W,i)=>{ const c=buildCarExt(root,W,(n/2-i-.5)*CAR_PITCH-CAR_PITCH*1.5); c.glow.vis=true; }); GEO_TEMP=false;
  ART.tgtTo=[0,2,0]; ART.rTo=30; ART.pitch=.28; }
function artShowLeg(i){ artClear(); GAME.aiOff=true; enterLeg(i); GAME.fade=0; const R_=legOf(i);
  ART.tgtTo=[0,1.3,R_.kind==='car'?0:0]; ART.rTo=R_.kind==='car'?11:14; ART.pitch=.42; ART.yaw=R_.kind==='car'?.7:.55; }
function artShowCrews(){ artClear(); GAME.aiOff=true; enterLeg(0); GAME.fade=0; clearEnemies(); ART.cast=[];
  const n=ART_CAST.length; ART_CAST.forEach((id,k)=>{ const x=-12+k*(24/(n-1)), z=-1.2; const E=spawnCrew(id,x,z,0); if(E){ E.aware=false; ART.cast.push({id,E,x,z}); } });
  if(LOBBY.root) LOBBY.root.vis=false; ART.tgtTo=[0,1.1,-1.2]; ART.rTo=9.5; ART.pitch=.1; ART.yaw=0; }
function artFocusCast(k){ const c=ART.cast[k]; if(!c) return; ART.tgtTo=[c.x,1.15,c.z]; ART.rTo=2.4; ART.pitch=.05; ART.yaw=0; }
function artSelect(view,k){ ART.view=view; ART.sel=k; ART.walk=false; const it=artItems(view)[k];
  if(view==='train') artShowTrain(); else if(view==='crews'){ if(!ART.cast.length||LEVEL.key!=='tokyo'||FLOW.leg!==0) artShowCrews(); if(k>=0) artFocusCast(k); }
  else if(view==='story'){ if(!ART.trainRoot) artShowTrain(); }
  else if(it) artShowLeg(it.leg);
  artCard(); }

/* ---------- each frame ---------- */
function artTick(dt){ if(!ART.on) return;
  for(const h of [HANDS.R,HANDS.L]){ h.node.vis=false; if(h.armN) h.armN.vis=false; }
  if(ART.tgtTo){ const k=1-Math.exp(-dt*4); ART.tgt=ART.tgt.map((v,i)=>v+(ART.tgtTo[i]-v)*k); if(Math.hypot(...ART.tgt.map((v,i)=>v-ART.tgtTo[i]))<.01) ART.tgtTo=null; }
  if(ART.rTo){ const k=1-Math.exp(-dt*4); ART.r+=(ART.rTo-ART.r)*k; if(Math.abs(ART.r-ART.rTo)<.01) ART.rTo=null; }
  if(!ART.walk&&!ART.drag&&ART.view==='train') ART.yaw+=dt*.04;
  const {eye}=camBasis(); if(OUT.vis) updateOut(dt,ART.speed*GAME.ts,eye,eye[0]);
  for(const f of LEVEL.anim) f(GAME.t);
  for(const c of ART.cast){ if(c.E&&!c.E.dead){ c.E.st='idle'; c.E.aware=false; } } }

/* ---------- the page around it ---------- */
function artUI(){ document.body.classList.add('artmode'); for(const id of ['intro','tl','br']){ const e=$(id); if(e) e.hidden=true; }
  const hud=document.querySelector('.topbtns'); if(hud) hud.hidden=true;
  const P=document.createElement('div'); P.id='art'; P.innerHTML=`<header class="abrand"><p class="akick">Art set 03 · <b>world loop</b> · as the game builds it</p>
    <h1 aria-label="The Meridian 24">${document.querySelector('.card h1 svg').outerHTML}<span class="the">THE</span><span class="name">MERIDIAN</span><span class="kana">メリディアン24 · SEE THE WORLD IN 24 HOURS</span></h1>
    <nav class="atabs" aria-label="Views">${ART_TABS.map(([k,l])=>`<button type="button" data-v="${k}">${l}</button>`).join('')}</nav></header>
    <details class="alook"><summary>Look</summary><div class="alookb">
      <label><input type="checkbox" id="aWob"> PS1 wobble &amp; warp (flat screen only)</label>
      <label><input type="checkbox" id="aDith" checked> 15-bit colour, dithered</label>
      <p class="aseg-l">Render height</p><div class="aseg" id="aRes">${[360,480,720,960].map(v=>`<button type="button" data-v="${v}">${v}</button>`).join('')}</div>
      <p class="aseg-l">Train speed</p><div class="aseg" id="aSpd">${[[0,'Stop'],[30,'Cruise'],[90,'Full']].map(([v,l])=>`<button type="button" data-v="${v}">${l}</button>`).join('')}</div>
      <button type="button" class="awalk" id="aWalk">Walk it (WASD + drag)</button></div></details>
    <section class="acard" id="acard" aria-live="polite"></section>
    <p class="ahint">Drag to orbit · scroll or pinch to zoom · right-drag to pan</p>`;
  document.body.append(P);
  P.querySelectorAll('.atabs button').forEach(b=>b.addEventListener('click',()=>artSelect(b.dataset.v,b.dataset.v==='crews'?-1:0)));
  $('aWob').checked=!!GAME.ps1Wob; $('aWob').addEventListener('change',e=>{ GAME.ps1Wob=e.target.checked; });
  $('aDith').addEventListener('change',e=>{ GAME.dither=e.target.checked; });
  const seg=(id,get,set)=>{ const el=$(id); const sync=()=>el.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.v===get()))); el.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ set(+b.dataset.v); sync(); })); sync(); };
  seg('aRes',()=>state.res,v=>{ state.res=v; }); seg('aSpd',()=>ART.speed,v=>{ ART.speed=v; });
  $('aWalk').addEventListener('click',()=>{ ART.walk=!ART.walk; if(ART.walk){ const R_=legOf(FLOW.leg); Object.assign(PL,{x:FLOOR.start.x,z:FLOOR.start.z,yaw:FLOOR.start.yaw,pitch:0}); GAME.started=true; } else GAME.started=false; $('aWalk').setAttribute('aria-pressed',String(ART.walk)); });
  /* orbit */
  cv.addEventListener('pointerdown',e=>{ if(ART.walk) return; ART.drag={x:e.clientX,y:e.clientY,b:e.button,pan:e.button===2||e.shiftKey}; cv.setPointerCapture(e.pointerId); e.stopImmediatePropagation(); },true);
  cv.addEventListener('pointermove',e=>{ if(!ART.drag||ART.walk) return; const dx=e.clientX-ART.drag.x,dy=e.clientY-ART.drag.y; ART.drag.x=e.clientX; ART.drag.y=e.clientY; ART.tgtTo=null;
    if(ART.drag.pan){ const {r,u}=artCam(),k=ART.r*.0016; ART.tgt=v3.add(ART.tgt,v3.add(v3.sc(r,-dx*k),v3.sc(u,dy*k))); }
    else { ART.yaw-=dx*.006; ART.pitch=clamp(ART.pitch+dy*.005,-.6,1.45); } e.stopImmediatePropagation(); },true);
  addEventListener('pointerup',()=>{ ART.drag=null; },true);
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('wheel',e=>{ if(ART.walk) return; e.preventDefault(); ART.rTo=null; ART.r=clamp(ART.r*Math.exp(e.deltaY*.0012),1.2,90); },{passive:false});
  addEventListener('keydown',e=>{ if(ART.walk) return; const k={ArrowLeft:[.08,0],ArrowRight:[-.08,0],ArrowUp:[0,-.05],ArrowDown:[0,.05]}[e.code]; if(k){ ART.yaw+=k[0]; ART.pitch=clamp(ART.pitch+k[1],-.6,1.45); e.preventDefault(); } });
  artSelect('train',0); }
function artCard(){ const C=$('acard'); if(!C) return; document.querySelectorAll('.atabs button').forEach(b=>b.setAttribute('aria-current',b.dataset.v===ART.view?'page':'false'));
  const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  if(ART.view==='train'){ C.innerHTML=`<p class="asub">The Meridian 24 · eleven cars</p><h2>The train</h2><p class="abody">The biggest bullet train ever built, on a special run: westward from Tokyo at dawn, round the world, and home to Tokyo by night. <b>See the world in 24 hours.</b> Navy and gold, a gold line along the skirt with a dot for every stop.</p>
      <ul class="alist">${WAGONS.map(W=>`<li><span class="num">${W.num}</span><span><b>${esc(W.name)}</b><span class="who">${esc(W.sub)}</span></span></li>`).join('')}</ul>`; return; }
  if(ART.view==='story'){ const S=typeof STORY!=='undefined'?STORY:null, H=S&&S.handler;
    C.innerHTML=`<p class="asub">A hitman on holiday</p><h2>The story</h2><p class="abody"><b>Nico Varga</b> boards the Meridian 24 on platform 0 in Tokyo for his first holiday in eleven years. Somebody has put a price on his head. At every underground station a new crew boards and takes over a car, and somebody has left him a better weapon on the platform.</p>
      <p class="abody">${H?`On the earpiece: <b>${esc(H.name)}</b>, his fixer, who booked the trip. `:''}Seven crews, two tunnels under the sea, and the locomotive at the end of the line.</p>
      <ul class="alist">${ROUTE.map((R_,i)=>`<li><span class="num">${String(i+1).padStart(2,'0')}</span><span><b>${esc(R_.title.replace(' · B5',''))}</b><span class="who">${esc(R_.sub)}</span></span></li>`).join('')}</ul>`; return; }
  const items=artItems(ART.view);
  C.innerHTML=`<p class="asub">${ART.view==='cars'?'Front of the train at +x · walk-through order':ART.view==='stations'?'Underground, one per city':'Who boards where'}</p><h2>${esc(ART_TABS.find(t=>t[0]===ART.view)[1])}</h2>
    <ul class="alist sel">${items.map((it,k)=>`<li><button type="button" data-k="${k}" aria-pressed="${k===ART.sel}"><span class="num">${String(k+1).padStart(2,'0')}</span><span><b>${esc(it.title)}</b><span class="who">${esc(it.sub)}</span><small>${esc(it.note)}</small></span>${it.sw?`<span class="sw">${it.sw.map(c=>`<i style="background:${c}"></i>`).join('')}</span>`:'<span></span>'}</button></li>`).join('')}</ul>`;
  C.querySelectorAll('button[data-k]').forEach(b=>b.addEventListener('click',()=>artSelect(ART.view,+b.dataset.k))); }
if(ART.on){ const st=document.createElement('style'); st.textContent=`
  body.artmode #intro,body.artmode #msg,body.artmode #subs,body.artmode #xhair,body.artmode #lockHint{display:none!important}
  #art{position:fixed;inset:0;pointer-events:none;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto minmax(0,1fr) auto;gap:12px;padding:calc(16px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(16px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
  #art>*{pointer-events:auto;box-sizing:border-box;min-width:0}
  .abrand{grid-column:1;grid-row:1;display:grid;gap:10px;justify-self:start}
  .akick{margin:0;font:600 11px/1.3 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--ink2);text-shadow:0 0 8px #000}.akick b{color:var(--sodium)}
  .abrand h1{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 14px;align-items:center;font-weight:400;text-shadow:0 2px 12px rgba(0,0,0,.7)}
  .abrand h1 svg{grid-row:span 3;width:clamp(58px,8vw,84px);height:auto}
  .abrand .the{font:900 12px/1 var(--display);letter-spacing:.6em;color:var(--sodium)}
  .abrand .name{font:400 clamp(32px,5.4vw,60px)/.9 var(--word);letter-spacing:.04em;color:#e8c46a}
  .abrand .kana{font:700 11px/1.2 var(--display);letter-spacing:.16em;color:var(--ink2)}
  .atabs{display:flex;gap:4px;flex-wrap:wrap}
  .atabs button,.aseg button,.awalk{font:600 11.5px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink);background:var(--panel);border:1px solid var(--line);padding:10px 13px;cursor:pointer}
  .atabs button:hover,.aseg button:hover{border-color:var(--sodium)}
  .atabs button[aria-current="page"],.aseg button[aria-pressed="true"],.awalk[aria-pressed="true"]{background:var(--sodium);color:#14100a;border-color:var(--sodium)}
  .alook{grid-column:2;grid-row:1;align-self:start;background:var(--panel);border:1px solid var(--line);width:250px;max-width:100%}
  .alook summary{cursor:pointer;padding:11px 14px;font:600 12px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;list-style:none}
  .alookb{display:grid;gap:9px;padding:2px 14px 14px;font:500 12.5px/1.4 var(--display);color:var(--ink2)}
  .alookb label{display:flex;gap:8px;align-items:center;cursor:pointer}.alookb input{accent-color:var(--sodium)}
  .aseg-l{margin:4px 0 0;font:600 10.5px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
  .aseg{display:flex;flex-wrap:wrap}.aseg button{flex:1;padding:8px 6px;margin:0 -1px -1px 0}
  .acard{grid-column:1;grid-row:3;align-self:end;justify-self:start;width:min(480px,100%);max-height:56vh;overflow:auto;background:var(--panel);border:1px solid var(--line);border-top:3px solid var(--sodium);padding:15px 18px 12px;display:grid;gap:10px}
  .acard h2{margin:0;font:400 28px/1 var(--word);letter-spacing:.03em;color:#e8c46a}
  .asub{margin:0;font:600 10.5px/1.3 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--hot)}
  .abody{margin:0;font:500 13.5px/1.6 var(--display);color:var(--ink2)}.abody b{color:var(--ink)}
  .alist{list-style:none;margin:0;padding:0;display:grid;font:500 13px/1.4 var(--display)}
  .alist li{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;padding:7px 2px;border-top:1px solid var(--line)}
  .alist.sel li{display:block;padding:0}
  .alist button{display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:8px;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--line);color:var(--ink);font:inherit;padding:9px 2px;cursor:pointer}
  .alist .num{font:600 11px/1.6 var(--mono);color:var(--muted)}.alist button[aria-pressed="true"] .num,.alist button[aria-pressed="true"] b{color:#e8c46a}
  .alist .who{display:block;color:var(--muted);font-size:12px}.alist small{display:none;color:var(--ink2);font-size:12.5px;line-height:1.5;margin-top:4px}.alist button[aria-pressed="true"] small{display:block}
  .alist .sw{display:flex;gap:2px;align-self:center}.alist .sw i{display:block;width:7px;height:14px}
  .ahint{grid-column:2;grid-row:3;align-self:end;margin:0;font:500 12px/1.5 var(--display);color:var(--muted);text-shadow:0 0 6px #000;text-align:right}
  @media (max-width:760px){ #art{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr) auto} .alook{grid-column:1;grid-row:2;width:100%} .acard{grid-row:4;max-height:44vh;width:100%} .ahint{display:none} }`;
  document.head.append(st); }
