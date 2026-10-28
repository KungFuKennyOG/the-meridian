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

/* =====================================================================
   PAINTED WEAPONS. Every gun and blade is one merged mesh on one shared, hand-painted atlas (1024 px for 256 units):
   blued steel with lit bevels and edge wear, polymer stipple, chequered and grained wood, pearl, engraved gold,
   blades with their grind, edge and (for the swords) a hamon. One draw call per weapon (the shotgun's pump is a second,
   because it slides). Box sides are mapped so the painted left of a region is the front of the gun on both sides.
   ===================================================================== */
const WREG={ blued:[0,0,64,24],slide:[64,0,64,24],bluedT:[128,0,32,24],muzzle:[160,0,24,24],poly:[184,0,32,24],rubber:[216,0,40,24],
  grip:[0,24,24,48],walnutG:[24,24,24,48],pearl:[48,24,24,48],walnut:[72,24,96,24],pump:[168,24,64,24],bore:[232,24,24,24],
  recv:[72,48,96,24],cyl:[168,48,32,24],cylG:[200,48,32,24],chamb:[232,48,24,24],
  goldL:[0,72,128,24],shroud:[128,72,64,24],brass:[192,72,32,24],chambG:[224,72,24,24],
  od:[0,96,64,24],drum:[64,96,64,24],steel:[128,96,32,24],blackM:[160,96,48,24],mag:[208,96,48,24],
  knife:[0,120,128,24],machete:[128,120,128,24],cleaver:[0,144,96,56],katana:[96,144,160,20],waki:[96,164,160,20],yanagi:[96,184,160,16],
  tsukaR:[0,200,24,56],tsukaW:[24,200,24,56],tsuba:[48,200,32,32],drumC:[48,232,24,24],woodH:[80,200,24,56],hoWood:[104,200,24,56],blackH:[128,200,24,56],
  rim:[152,200,16,16],dark:[152,216,16,16],boreBig:[152,232,24,24],machH:[176,200,32,56],ammoBox:[208,200,32,56],goldBar:[240,200,16,56] };
function wpClip(g,r,fn){ g.save(); g.beginPath(); g.rect(r[0],r[1],r[2],r[3]); g.clip(); fn(r[0],r[1],r[2],r[3]); g.restore(); }
function wpBevel(g,x,y,w,h,hi,a=1){ g.fillStyle=rgba(hi,.7*a); g.fillRect(x,y,w,.5); g.fillStyle=rgba(hi,.28*a); g.fillRect(x,y+.5,w,.6); g.fillRect(x,y,.5,h);
  g.fillStyle=`rgba(0,0,0,${.55*a})`; g.fillRect(x,y+h-.6,w,.6); g.fillStyle=`rgba(0,0,0,${.3*a})`; g.fillRect(x+w-.5,y,.5,h); }
function wpMetal(g,x,y,w,h,top,mid,bot,hi,seed,o={}){ vfill(g,x,y,w,h,[[0,top],[o.midAt??.42,mid],[1,bot]]); const r=rng(seed);
  for(let i=0;i<w*h*.18;i++){ g.fillStyle=r()>.5?'rgba(255,255,255,.045)':'rgba(0,0,0,.07)'; g.fillRect(x+r()*w-8,y+r()*h,6+r()*w*.5,.25); } /* brushed */
  if(o.band!==false){ const by=y+h*(o.bandY??.26); vfill(g,x,by-h*.1,w,h*.2,[[0,rgba(hi,0)],[.5,rgba(hi,o.bandA??.2)],[1,rgba(hi,0)]]); }
  if(o.wear) for(let i=0;i<w*o.wear;i++){ const e=r(); g.fillStyle=rgba(hi,.25+r()*.45); g.fillRect(x+r()*w,e<.6?y+r()*1.2:e<.8?y+h-1.2+r():y+r()*h,.4+r()*1.8,.3); }
  if(o.bevel!==false) wpBevel(g,x,y,w,h,hi); }
function wpGrain(g,x,y,w,h,seed,dark,light,n=2.4){ const r=rng(seed);
  for(let i=0;i<h*n;i++){ let yy=y+r()*h; g.strokeStyle=r()>.35?rgba(dark,.18+r()*.22):rgba(light,.08+r()*.1); g.lineWidth=.2+r()*.45; g.beginPath(); g.moveTo(x-2,yy);
    for(let xx=0;xx<=w+4;xx+=1.5){ yy+=fbm((x+xx)*.04,i*.7,seed)*.45; g.lineTo(x+xx,yy); } g.stroke(); } }
function wpWood(g,x,y,w,h,a,b,seed,o={}){ vfill(g,x,y,w,h,[[0,a],[1,b]]); wpGrain(g,x,y,w,h,seed,'#1a0a02','#ffd8a0',o.n??2.4);
  const r=rng(seed+3); for(let i=0;i<(o.knots??1);i++){ const cx=x+r()*w,cy=y+r()*h; for(let k=4;k>0;k--){ g.strokeStyle=rgba('#1a0a02',.15); g.lineWidth=.3; g.beginPath(); g.ellipse(cx,cy,k*1.8,k*.6,0,0,Math.PI*2); g.stroke(); } }
  vfill(g,x,y+h*.12,w,h*.22,[[0,'rgba(255,236,200,0)'],[.5,'rgba(255,236,200,.2)'],[1,'rgba(255,236,200,0)']]); if(o.bevel!==false) wpBevel(g,x,y,w,h,'#ffe0b0',.7); }
function wpChecker(g,x,y,w,h,step,line,hi){ g.lineWidth=.35; for(let k=-h;k<w+h;k+=step){ g.strokeStyle=line; g.beginPath(); g.moveTo(x+k,y); g.lineTo(x+k+h,y+h); g.moveTo(x+k,y+h); g.lineTo(x+k+h,y); g.stroke();
  g.strokeStyle=hi; g.beginPath(); g.moveTo(x+k+.45,y); g.lineTo(x+k+h+.45,y+h); g.stroke(); } }
function wpScroll(g,x,y,w,h,seed,ink,hl){ const r=rng(seed); const n=Math.max(2,w*h/70|0);
  for(let i=0;i<n;i++){ const cx=x+3+r()*(w-6),cy=y+3+r()*(h-6),R=1.6+r()*2.6,dir=r()>.5?1:-1,a0=r()*6;
    for(const [col,off] of [[ink,0],[hl,.35]]){ g.strokeStyle=col; g.lineWidth=.32; g.beginPath(); for(let t=0;t<10;t+=.3){ const rr=R*(1-t/11); g.lineTo(cx+off+Math.cos(a0+t*dir)*rr,cy+off+Math.sin(a0+t*dir)*rr*.85); } g.stroke(); }
    for(let k=0;k<3;k++){ const a=a0+dir*(k*1.3+.5),lx=cx+Math.cos(a)*R*1.25,ly=cy+Math.sin(a)*R*1.05; g.fillStyle=ink; g.beginPath(); g.ellipse(lx,ly,1.1,.4,a+1.2,0,Math.PI*2); g.fill(); g.fillStyle=hl; g.beginPath(); g.ellipse(lx+.25,ly-.2,.6,.18,a+1.2,0,Math.PI*2); g.fill(); } } }
function wpGold(g,x,y,w,h,seed,engr=true){ wpMetal(g,x,y,w,h,'#fff0b8','#d8b058','#7a5216','#fffbe6',seed,{bandA:.4,wear:0});
  if(engr){ wpScroll(g,x+1,y+1,w-2,h-2,seed+1,'rgba(74,44,8,.7)','rgba(255,250,220,.55)'); g.strokeStyle='rgba(74,44,8,.6)'; g.lineWidth=.35; g.strokeRect(x+1.4,y+1.4,w-2.8,h-2.8); g.strokeStyle='rgba(255,250,220,.4)'; g.strokeRect(x+1.8,y+1.8,w-2.8,h-2.8); }
  wpBevel(g,x,y,w,h,'#fffbe6'); }
/* a blade, painted on (u: heel to tip, v: edge at the bottom to spine at the top) */
function wpBlade(g,x,y,w,h,seed,o={}){ const r=rng(seed),eb=o.edgeBand??.32;
  vfill(g,x,y,w,h,[[0,o.spine||'#5a626c'],[.12,o.body||'#9aa3ac'],[.55,o.body2||'#b8c0c8'],[1-eb-.01,o.body2||'#b8c0c8'],[1-eb,'#e6ecf2'],[.9,'#cfd7de'],[.97,'#f8fbff'],[1,'#6a727a']]);
  g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(x,y+h*(1-eb)-.3,w,.35); g.fillStyle='rgba(255,255,255,.5)'; g.fillRect(x,y+h*(1-eb),w,.3); /* the grind line */
  for(let i=0;i<w*h*.25;i++){ g.fillStyle=r()>.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.06)'; g.fillRect(x+r()*w-6,y+r()*h,4+r()*14,.22); } /* polish streaks */
  for(let i=0;i<w*.25;i++){ g.strokeStyle='rgba(255,255,255,.18)'; g.lineWidth=.2; const sx=x+r()*w,sy=y+r()*h; g.beginPath(); g.moveTo(sx,sy); g.lineTo(sx+2+r()*6,sy+(r()-.5)*2); g.stroke(); } /* scratches */
  vfill(g,x,y+h*.18,w,h*.14,[[0,'rgba(255,255,255,0)'],[.5,'rgba(255,255,255,.22)'],[1,'rgba(255,255,255,0)']]);
  if(o.hamon){ const hy=t=>y+h*(.56+.06*Math.sin(t*.9+seed)+.04*Math.sin(t*2.3)+.02*Math.sin(t*5.1));
    vfill(g,x,y,w,h*.5,[[0,'rgba(40,52,66,0)'],[1,'rgba(40,52,66,.18)']]);
    g.fillStyle='rgba(236,242,250,.62)'; g.beginPath(); g.moveTo(x,y+h); for(let t=0;t<=w;t+=.5) g.lineTo(x+t,hy(t)); g.lineTo(x+w,y+h); g.closePath(); g.fill();
    for(let t=0;t<w;t+=.4){ g.fillStyle=`rgba(255,255,255,${.12+r()*.22})`; g.fillRect(x+t,hy(t)-.8-r()*1.2,.35,.6+r()*.8); } /* nie: the misty boundary */
    g.fillStyle='rgba(200,214,228,.5)'; g.fillRect(x,y+h*.97,w,h*.03);
    if(o.hi){ g.fillStyle='rgba(30,36,44,.55)'; g.fillRect(x,y+h*.14,w*.82,h*.08); g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(x,y+h*.22,w*.82,.3); } } /* bo-hi groove */
  if(o.blood) for(let i=0;i<o.blood;i++){ const bx=x+w*(.35+r()*.6),by=y+h*(.3+r()*.6); g.fillStyle=rgba(r()>.5?'#5e0a0a':'#3e0606',.6+r()*.35); g.beginPath(); g.ellipse(bx,by,1+r()*4,.6+r()*1.6,(r()-.5)*.6,0,Math.PI*2); g.fill(); if(r()<.4) g.fillRect(bx,by,.5,2+r()*4); }
  if(o.mark) glyphs(g,x+3,y+h*.35,3,2.6,'rgba(30,30,34,.6)',seed+7,true);
  g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(x,y,w,.5); }
function wpBore(g,x,y,w,h,rim,inner){ g.fillStyle=rim; g.fillRect(x,y,w,h); radial(g,x+w/2,y+h/2,w/2,[[0,'#020203'],[.42,'#08090b'],[.5,inner||'#3a3e44'],[.8,rim],[1,'#000000']]); g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.arc(x+w/2,y+h/2,w*.32,3.6,4.6); g.lineTo(x+w/2,y+h/2); g.fill(); }
function wpAtlas(){ if(wpAtlas.t) return wpAtlas.t; const S=4; wpAtlas.t=tex(256*S,256*S,'#202226',g=>{ g.scale(S,S); const Rg=k=>WREG[k];
  const polyP=(x,y,w,h,s)=>{ vfill(g,x,y,w,h,[[0,'#34363b'],[.5,'#222327'],[1,'#141517']]); const r=rng(s); for(let i=0;i<w*h*1.6;i++){ g.fillStyle=r()>.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.18)'; g.fillRect(x+r()*w,y+r()*h,.3,.3); } wpBevel(g,x,y,w,h,'#8a909a',.8); };
  wpClip(g,Rg('blued'),(x,y,w,h)=>wpMetal(g,x,y,w,h,'#4e5664','#272b33','#121417','#a8b4c8',11,{wear:.8}));
  wpClip(g,Rg('slide'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#4e5664','#272b33','#121417','#a8b4c8',12,{wear:.6});
    for(let k=0;k<9;k++){ const sx=x+w*.7+k*1.9; g.fillStyle='rgba(0,0,0,.6)'; g.fillRect(sx,y+3,.8,h-6); g.fillStyle='rgba(170,184,204,.35)'; g.fillRect(sx+.8,y+3,.4,h-6); } /* rear serrations */
    g.fillStyle='#08090a'; g.fillRect(x+w*.34,y+1.2,w*.2,h*.36); g.fillStyle='rgba(170,184,204,.5)'; g.fillRect(x+w*.34,y+1.2+h*.36,w*.2,.4); g.fillStyle='#8a6a2a'; g.fillRect(x+w*.38,y+2.6,w*.08,h*.18); /* port, a brass case in it */
    g.fillStyle='rgba(0,0,0,.45)'; g.fillRect(x,y+h*.62,w,.4); g.fillStyle='rgba(170,184,204,.25)'; g.fillRect(x,y+h*.62+.4,w,.3); });
  wpClip(g,Rg('bluedT'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#3a404a','#2a2e36','#1a1c20','#a8b4c8',13,{band:false}); for(let k=1;k<h;k+=2.2){ g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(x,y+k,w,.3); } });
  wpClip(g,Rg('muzzle'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#3a404a','#2a2e36','#1a1c20','#a8b4c8',14,{band:false}); radial(g,x+w/2,y+h*.42,w*.24,[[0,'#000'],[.55,'#050506'],[.7,'#5a6270'],[1,'rgba(0,0,0,0)']]); });
  wpClip(g,Rg('poly'),(x,y,w,h)=>polyP(x,y,w,h,15));
  wpClip(g,Rg('rubber'),(x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#2a2a2c'],[1,'#0e0e10']]); for(let k=2;k<w;k+=3){ g.fillStyle='rgba(0,0,0,.5)'; g.fillRect(x+k,y,1,h); g.fillStyle='rgba(255,255,255,.08)'; g.fillRect(x+k+1,y,.4,h); } wpBevel(g,x,y,w,h,'#6a6a70',.6); });
  wpClip(g,Rg('grip'),(x,y,w,h)=>{ polyP(x,y,w,h,16); g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(x+3,y+4,w-6,h-8); wpChecker(g,x+3,y+4,w-6,h-8,1.6,'rgba(0,0,0,.6)','rgba(150,156,168,.22)');
    g.strokeStyle='rgba(150,156,168,.35)'; g.lineWidth=.4; g.strokeRect(x+3,y+4,w-6,h-8); for(const yy of [y+6,y+h-6]){ radial(g,x+w/2,yy,1.4,[[0,'#9aa2ae'],[.7,'#4a4e56'],[1,'#141416']]); g.fillStyle='#141416'; g.fillRect(x+w/2-1,yy-.15,2,.3); } });
  wpClip(g,Rg('walnutG'),(x,y,w,h)=>{ wpWood(g,x,y,w,h,'#7a4a26','#3e2210',17,{knots:0}); g.save(); g.beginPath(); g.ellipse(x+w/2,y+h/2,w/2-2.5,h/2-4,0,0,Math.PI*2); g.clip(); wpChecker(g,x,y,w,h,1.5,'rgba(30,12,2,.65)','rgba(255,214,160,.2)'); g.restore();
    g.strokeStyle='rgba(30,12,2,.5)'; g.lineWidth=.4; g.beginPath(); g.ellipse(x+w/2,y+h/2,w/2-2.5,h/2-4,0,0,Math.PI*2); g.stroke(); radial(g,x+w/2,y+h/2,2.2,[[0,'#e8dcc0'],[.6,'#a89a78'],[1,'#3a2a14']]); });
  wpClip(g,Rg('pearl'),(x,y,w,h)=>{ vfill(g,x,y,w,h,[[0,'#fbf6ec'],[1,'#d8cfc0']]); const r=rng(18); for(let i=0;i<26;i++){ const c=['#f6c8d6','#c8e8dc','#c8d4f6','#fff4d0'][i%4]; radial(g,x+r()*w,y+r()*h,3+r()*7,[[0,rgba(c,.55)],[1,rgba(c,0)]]); }
    for(let i=0;i<30;i++){ g.strokeStyle='rgba(255,255,255,.4)'; g.lineWidth=.25; g.beginPath(); const sx=x+r()*w,sy=y+r()*h; g.moveTo(sx,sy); g.quadraticCurveTo(sx+3,sy+r()*4,sx+r()*6,sy+5); g.stroke(); }
    g.strokeStyle='#c89a3a'; g.lineWidth=1; g.strokeRect(x+1,y+1,w-2,h-2); g.strokeStyle='#fff0b0'; g.lineWidth=.3; g.strokeRect(x+1.4,y+1.4,w-2.8,h-2.8);
    radial(g,x+w/2,y+h*.45,4,[[0,'#fff6c8'],[.5,'#d8a840'],[.85,'#8a6018'],[1,'rgba(0,0,0,0)']]); g.fillStyle='#8a2020'; g.beginPath(); g.moveTo(x+w/2,y+h*.45-2.2); g.lineTo(x+w/2+1.6,y+h*.45); g.lineTo(x+w/2,y+h*.45+2.2); g.lineTo(x+w/2-1.6,y+h*.45); g.fill(); g.fillStyle='rgba(255,255,255,.6)'; g.fillRect(x+w/2-.8,y+h*.45-1,.6,.6); });
  wpClip(g,Rg('walnut'),(x,y,w,h)=>wpWood(g,x,y,w,h,'#8a542a','#3a200e',19,{knots:2}));
  wpClip(g,Rg('pump'),(x,y,w,h)=>{ wpWood(g,x,y,w,h,'#7e4c26','#3a200e',20,{bevel:false}); for(let k=3;k<w-2;k+=3.2){ g.fillStyle='rgba(20,8,2,.65)'; g.fillRect(x+k,y,1.1,h); g.fillStyle='rgba(255,220,170,.22)'; g.fillRect(x+k+1.1,y,.5,h); } wpBevel(g,x,y,w,h,'#ffe0b0',.7); });
  wpClip(g,Rg('bore'),(x,y,w,h)=>wpBore(g,x,y,w,h,'#2a2e36'));
  wpClip(g,Rg('recv'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#4e5664','#272b33','#121417','#a8b4c8',21,{wear:.6}); g.strokeStyle='rgba(168,180,200,.35)'; g.lineWidth=.3; g.strokeRect(x+2.5,y+3,w-5,h-6);
    g.fillStyle='#060607'; g.fillRect(x+w*.3,y+2,w*.32,h*.34); g.fillStyle='rgba(168,180,200,.45)'; g.fillRect(x+w*.3,y+2+h*.34,w*.32,.4); for(const xx of [x+w*.12,x+w*.82]) radial(g,xx,y+h*.62,1.3,[[0,'#b8c0cc'],[.7,'#3a3e46'],[1,'#101114']]); });
  const flutes=(x,y,w,h,seed,gold)=>{ gold?wpMetal(g,x,y,w,h,'#fff0b8','#d8b058','#7a5216','#fffbe6',seed,{band:false,bevel:false}):wpMetal(g,x,y,w,h,'#4e5664','#2a2e36','#181a1e','#a8b4c8',seed,{band:false,bevel:false,wear:.5});
    for(let k=0;k<6;k++){ const fx=x+(k+.5)*w/6; hfill(g,fx-w/16,y+h*.18,w/8,h*.64,[[0,'rgba(0,0,0,.05)'],[.45,'rgba(0,0,0,.55)'],[.6,gold?'rgba(255,250,220,.5)':'rgba(170,184,204,.45)'],[1,'rgba(0,0,0,0)']]); }
    g.fillStyle='rgba(0,0,0,.4)'; g.fillRect(x,y,w,.8); g.fillRect(x,y+h-.8,w,.8); if(gold) wpScroll(g,x,y+h*.82,w,h*.18,seed+2,'rgba(74,44,8,.6)','rgba(255,250,220,.4)'); };
  wpClip(g,Rg('cyl'),(x,y,w,h)=>flutes(x,y,w,h,22,false)); wpClip(g,Rg('cylG'),(x,y,w,h)=>flutes(x,y,w,h,23,true));
  const chambers=(x,y,w,h,gold,n=6,rr=.2)=>{ gold?wpGold(g,x,y,w,h,24,false):wpMetal(g,x,y,w,h,'#4e5664','#2a2e36','#181a1e','#a8b4c8',24,{band:false}); radial(g,x+w/2,y+h/2,w/2,[[.85,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.6)']]);
    for(let k=0;k<n;k++){ const a=k/n*Math.PI*2,cx=x+w/2+Math.cos(a)*w*.27,cy=y+h/2+Math.sin(a)*h*.27; radial(g,cx,cy,w*rr*.6,[[0,'#c89a40'],[.45,'#8a6420'],[.62,'#1a1206'],[.8,gold?'#6a4a14':'#0c0d0f'],[1,'rgba(0,0,0,0)']]); g.fillStyle='#2a1a08'; g.beginPath(); g.arc(cx,cy,w*.03,0,7); g.fill(); }
    radial(g,x+w/2,y+h/2,w*.08,[[0,gold?'#fff4c0':'#c8d0da'],[1,gold?'#8a6420':'#2a2e36']]); };
  wpClip(g,Rg('chamb'),(x,y,w,h)=>chambers(x,y,w,h,false)); wpClip(g,Rg('chambG'),(x,y,w,h)=>chambers(x,y,w,h,true));
  wpClip(g,Rg('goldL'),(x,y,w,h)=>wpGold(g,x,y,w,h,25));
  wpClip(g,Rg('shroud'),(x,y,w,h)=>{ wpGold(g,x,y,w,h,26,false); for(let j=0;j<4;j++) for(let k=0;k<8;k++){ const cx=x+(k+.5)*w/8,cy=y+4+j*(h-8)/3; radial(g,cx,cy,2.2,[[0,'#0a0804'],[.6,'#1a1206'],[.75,'#7a5216'],[.9,'#fff0b8'],[1,'rgba(0,0,0,0)']]); } });
  wpClip(g,Rg('brass'),(x,y,w,h)=>{ hfill(g,x,y,w,h,[[0,'#6a4a14'],[.35,'#f0d080'],[.55,'#c89a40'],[1,'#5a3a0e']]); g.fillStyle='rgba(120,60,30,.9)'; g.fillRect(x,y,w,h*.3); hfill(g,x,y,w,h*.3,[[0,'rgba(0,0,0,.4)'],[.35,'rgba(255,200,170,.35)'],[1,'rgba(0,0,0,.4)']]); g.fillStyle='rgba(0,0,0,.5)'; g.fillRect(x,y+h*.85,w,.6); });
  wpClip(g,Rg('od'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#6a6e4e','#4a4e34','#2a2c1c','#c8c8a0',27,{wear:1.2,bandA:.12}); const r=rng(28); for(let i=0;i<w*h*.5;i++){ g.fillStyle=r()>.5?'rgba(255,255,230,.05)':'rgba(0,0,0,.07)'; g.fillRect(x+r()*w,y+r()*h,.4,.4); }
    g.fillStyle='rgba(230,226,200,.35)'; g.fillRect(x+w*.55,y+h*.5,w*.2,h*.08); g.fillRect(x+w*.55,y+h*.62,w*.12,h*.06); });
  wpClip(g,Rg('drum'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#5a5e44','#3e4230','#22241a','#c8c8a0',29,{band:false,bevel:false,wear:.6}); for(let k=0;k<6;k++){ const fx=x+(k+.5)*w/6; hfill(g,fx-w/12,y,w/6,h,[[0,'rgba(0,0,0,.45)'],[.35,'rgba(255,255,230,.12)'],[.65,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.45)']]); } g.fillStyle='rgba(0,0,0,.5)'; g.fillRect(x,y,w,1); g.fillRect(x,y+h-1,w,1); });
  wpClip(g,Rg('drumC'),(x,y,w,h)=>chambers(x,y,w,h,false,6,.34));
  wpClip(g,Rg('steel'),(x,y,w,h)=>wpMetal(g,x,y,w,h,'#e8eef4','#9aa4ae','#4a525a','#ffffff',30,{bandA:.35}));
  wpClip(g,Rg('blackM'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#3a3c40','#222428','#141518','#9aa0aa',31,{wear:.5,bandA:.1}); for(let k=0;k<5;k++){ const vx=x+w*.55+k*2.4; g.fillStyle='#050506'; g.fillRect(vx,y+4,1.2,h*.35); g.fillStyle='rgba(154,160,170,.35)'; g.fillRect(vx,y+4+h*.35,1.2,.3); }
    g.fillStyle='rgba(0,0,0,.55)'; g.fillRect(x+2,y+h*.7,w-4,.35); g.fillStyle='rgba(154,160,170,.25)'; g.fillRect(x+2,y+h*.7+.4,w-4,.3);
    radial(g,x+w*.2,y+h*.45,1.2,[[0,'#9aa0aa'],[1,'#141518']]); g.strokeStyle='rgba(200,200,200,.3)'; g.lineWidth=.3; g.strokeRect(x+w*.06,y+h*.14,w*.16,h*.16); });
  wpClip(g,Rg('mag'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#3e4248','#24262a','#121316','#9aa0aa',32,{wear:.4}); for(let k=6;k<w-4;k+=5){ g.fillStyle='rgba(0,0,0,.45)'; g.fillRect(x+k,y+3,.8,h-6); g.fillStyle='rgba(154,160,170,.3)'; g.fillRect(x+k+.8,y+3,.4,h-6); } });
  wpClip(g,Rg('knife'),(x,y,w,h)=>wpBlade(g,x,y,w,h,33,{edgeBand:.38,mark:true}));
  wpClip(g,Rg('machete'),(x,y,w,h)=>{ wpBlade(g,x,y,w,h,34,{edgeBand:.3,spine:'#3a3a38',body:'#6a6c6a',body2:'#8a8c88',blood:16}); const r=rng(35); for(let i=0;i<40;i++){ g.fillStyle=rgba('#5a3a1a',.18+r()*.2); g.beginPath(); g.ellipse(x+r()*w,y+r()*h*.6,1+r()*3,.5+r(),0,0,7); g.fill(); } });
  wpClip(g,Rg('cleaver'),(x,y,w,h)=>{ wpBlade(g,x,y,w,h,36,{edgeBand:.2,spine:'#4a4c4e',body:'#7a7e82',body2:'#9aa0a4'}); const r=rng(37);
    for(let i=0;i<70;i++){ g.fillStyle=rgba(r()>.5?'#3a3020':'#20242a',.08+r()*.12); g.beginPath(); g.ellipse(x+r()*w,y+r()*h*.75,1+r()*5,.6+r()*2.5,r(),0,7); g.fill(); } /* patina */
    for(let i=0;i<9;i++){ const nx=x+r()*w; g.fillStyle='rgba(60,64,70,.8)'; g.beginPath(); g.moveTo(nx,y+h); g.lineTo(nx+.8+r(),y+h-1-r()*1.6); g.lineTo(nx+2,y+h); g.fill(); } /* nicks in the worn edge */
    radial(g,x+w*.86,y+h*.18,3.4,[[0,'#050505'],[.7,'#0a0a0a'],[.82,'#c8ced4'],[1,'rgba(0,0,0,0)']]); /* the hanging hole */
    for(let i=0;i<5;i++){ g.fillStyle=rgba('#4a0606',.5+r()*.3); g.beginPath(); g.ellipse(x+w*(.3+r()*.6),y+h*(.6+r()*.3),2+r()*5,.8+r()*1.5,(r()-.5)*.4,0,7); g.fill(); }
    glyphs(g,x+6,y+h*.3,3,3,'rgba(30,30,34,.55)',38,true); });
  wpClip(g,Rg('katana'),(x,y,w,h)=>wpBlade(g,x,y,w,h,39,{hamon:true,hi:true,edgeBand:.42,spine:'#4a525c',body:'#7e8894',body2:'#9aa4b0'}));
  wpClip(g,Rg('waki'),(x,y,w,h)=>wpBlade(g,x,y,w,h,40,{hamon:true,edgeBand:.42,spine:'#4a525c',body:'#7e8894',body2:'#9aa4b0'}));
  wpClip(g,Rg('yanagi'),(x,y,w,h)=>{ wpBlade(g,x,y,w,h,41,{edgeBand:.36,spine:'#6a7078',body:'#c0c8d0',body2:'#d8dee4'}); glyphs(g,x+4,y+h*.25,3,2.4,'rgba(30,30,34,.7)',42,true); });
  const ito=(x,y,w,h,silk,skin,seed)=>{ g.fillStyle=skin; g.fillRect(x,y,w,h); const r=rng(seed); for(let i=0;i<w*h*.8;i++){ g.fillStyle=`rgba(255,255,255,${r()*.25})`; g.fillRect(x+r()*w,y+r()*h,.35,.35); }
    const p=w/2,q=6.2; for(let row=-1;row<h/q+1;row++) for(let col=0;col<2;col++){ const cx=x+col*p+p/2,cy=y+row*q+q/2;
      g.fillStyle=silk; g.beginPath(); g.moveTo(cx-p/2,cy-q/2); g.lineTo(cx-p/2+2.2,cy-q/2); g.lineTo(cx+p/2,cy+q/2-2.2); g.lineTo(cx+p/2,cy+q/2); g.lineTo(cx+p/2-2.2,cy+q/2); g.lineTo(cx-p/2,cy-q/2+2.2); g.fill();
      g.beginPath(); g.moveTo(cx+p/2,cy-q/2); g.lineTo(cx+p/2,cy-q/2+2.2); g.lineTo(cx-p/2+2.2,cy+q/2); g.lineTo(cx-p/2,cy+q/2); g.lineTo(cx-p/2,cy+q/2-2.2); g.lineTo(cx+p/2-2.2,cy-q/2); g.fill();
      g.fillStyle='rgba(255,255,255,.18)'; g.fillRect(cx-1.2,cy-1.4,2.4,.5); g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(cx-1.6,cy+.4,3.2,.5); }
    hfill(g,x,y,w,h,[[0,'rgba(0,0,0,.45)'],[.3,'rgba(0,0,0,0)'],[.5,'rgba(255,255,255,.08)'],[.7,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.45)']]);
    radial(g,x+w*.5,y+h*.42,4,[[0,'#fff0b0'],[.5,'#c89a3a'],[.9,'#6a4a14'],[1,'rgba(0,0,0,0)']]); }; /* a menuki under the wrap */
  wpClip(g,Rg('tsukaR'),(x,y,w,h)=>ito(x,y,w,h,'#141012','#b02028',43)); wpClip(g,Rg('tsukaW'),(x,y,w,h)=>ito(x,y,w,h,'#141214','#e8e2d4',44));
  wpClip(g,Rg('tsuba'),(x,y,w,h)=>{ radial(g,x+w/2,y+h/2,w/2,[[0,'#3a3634'],[.82,'#24201e'],[.88,'#e8c060'],[.95,'#8a6018'],[1,'#3a2a10']]); const r=rng(45); for(let i=0;i<200;i++){ g.fillStyle=`rgba(${r()>.5?'255,240,220':'0,0,0'},.12)`; g.fillRect(x+r()*w,y+r()*h,.4,.4); }
    for(let k=0;k<4;k++){ const a=k*Math.PI/2+.78; g.fillStyle='#050505'; g.beginPath(); g.ellipse(x+w/2+Math.cos(a)*w*.27,y+h/2+Math.sin(a)*h*.27,w*.08,w*.045,a,0,7); g.fill(); g.strokeStyle='#d8b058'; g.lineWidth=.35; g.stroke(); }
    g.fillStyle='#0a0a0a'; g.beginPath(); g.ellipse(x+w/2,y+h/2,w*.1,w*.04,0,0,7); g.fill(); g.strokeStyle='#e8c060'; g.lineWidth=.6; g.stroke(); });
  wpClip(g,Rg('woodH'),(x,y,w,h)=>{ g.save(); g.translate(x+w,y); g.rotate(Math.PI/2); wpWood(g,0,0,h,w,'#6a4022','#2e180a',46,{bevel:false,n:3}); g.restore(); hfill(g,x,y,w,h,[[0,'rgba(0,0,0,.35)'],[.5,'rgba(255,230,200,.1)'],[1,'rgba(0,0,0,.35)']]); g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(x,y,w,h*.08); });
  wpClip(g,Rg('hoWood'),(x,y,w,h)=>{ g.save(); g.translate(x+w,y); g.rotate(Math.PI/2); wpWood(g,0,0,h,w,'#d8c098','#a88a5e',47,{bevel:false,n:2,knots:0}); g.restore(); for(let k=0;k<8;k++){ g.fillStyle='rgba(60,40,20,.25)'; g.fillRect(x+k*w/8,y,.35,h); } });
  const rivets=(x,y,w,h,c)=>{ for(const xx of [x+w*.25,x+w*.75]) for(const yy of [y+h*.2,y+h*.5,y+h*.8]) radial(g,xx,yy,2,[[0,c[0]],[.45,c[1]],[.8,c[2]],[1,'rgba(0,0,0,0)']]); }; /* round handles: u .25 and .75 are the two flats */
  wpClip(g,Rg('blackH'),(x,y,w,h)=>{ polyP(x,y,w,h,48); hfill(g,x,y,w,h,[[0,'rgba(0,0,0,.3)'],[.5,'rgba(255,255,255,.06)'],[1,'rgba(0,0,0,.3)']]); rivets(x,y,w,h,['#f2f6fa','#9aa4ae','#3a3e44']); });
  wpClip(g,Rg('rim'),(x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#e8eef4'],[1,'#7a828a']]));
  wpClip(g,Rg('dark'),(x,y,w,h)=>vfill(g,x,y,w,h,[[0,'#2a2826'],[1,'#0c0b0a']]));
  wpClip(g,Rg('boreBig'),(x,y,w,h)=>wpBore(g,x,y,w,h,'#4a4e34','#2a2c1c'));
  wpClip(g,Rg('machH'),(x,y,w,h)=>{ g.save(); g.translate(x+w,y); g.rotate(Math.PI/2); wpWood(g,0,0,h,w,'#6a3a1c','#2a160a',49,{bevel:false,n:3}); g.restore(); hfill(g,x,y,w,h,[[0,'rgba(0,0,0,.35)'],[.5,'rgba(255,230,200,.1)'],[1,'rgba(0,0,0,.35)']]); rivets(x,y,w,h,['#fff0c0','#c8983a','#5a3a10']); });
  wpClip(g,Rg('ammoBox'),(x,y,w,h)=>{ wpMetal(g,x,y,w,h,'#4a5040','#30342a','#1a1c16','#c8c8a0',50,{wear:1}); g.strokeStyle='#d8b058'; g.lineWidth=.8; g.strokeRect(x+1.5,y+1.5,w-3,h-3); for(let k=0;k<3;k++){ g.fillStyle='rgba(230,226,200,.45)'; g.fillRect(x+w*.22,y+h*(.36+k*.07),w*.56*(1-k*.25),h*.035); } });
  wpClip(g,Rg('goldBar'),(x,y,w,h)=>wpMetal(g,x,y,w,h,'#fff0b8','#d8b058','#7a5216','#fffbe6',51,{bandA:.45}));
  }); return wpAtlas.t; }
function wpMat(){ return wpMat.m||(wpMat.m=M(wpAtlas())); }
/* a part list -> one mesh. Each part: [geo, x,y,z, rx,ry,rz, uv]. uv is a region name, [name,u0,u1] for part of one,
   or {s:sides, t:top/bottom, f:front end, b:back end} (boxes) / {s:round side, c:caps} (cylinders) / {s:faces, e:rims} (blades) */
function wpBox(w,h,d,o){ const g=box(w,h,d,o); g.kind='box'; return g; }
function wpCyl(r1,r2,h,seg,o){ const g=cyl(r1,r2,h,seg,o); g.kind='cyl'; return g; }
function wpRegUV(spec,u,v){ let nm=spec,a=0,b=1; if(Array.isArray(spec)) [nm,a,b]=spec; const R=WREG[nm]||WREG.dark,i=.3;
  const x0=(R[0]+i)/256,x1=(R[0]+R[2]-i)/256,yT=1-(R[1]+i)/256,yB=1-(R[1]+R[3]-i)/256,uu=a+(b-a)*u; return [x0+(x1-x0)*uu,yB+(yT-yB)*v]; }
function wpMerge(parts){ const G=new Geo(),m=m4.make();
  for(const [geo,x,y,z,rx=0,ry=0,rz=0,uv='dark'] of parts){ m4.compose(m,[x,y,z],[rx,ry,rz],[1,1,1]); const base=G.P.length/3,nv=geo.P.length/3,vmi=new Int8Array(nv);
    for(const gr of geo.groups) for(let k=gr.start;k<gr.start+gr.count;k++) vmi[geo.I[k]]=gr.mi;
    const pick=mi=>{ if(typeof uv==='string'||Array.isArray(uv)) return uv; if(geo.kind==='box') return mi<2?uv.s:mi<4?(uv.t||uv.s):mi===4?(uv.f||uv.e||uv.s):(uv.b||uv.e||uv.s); if(geo.kind==='cyl') return mi===0?uv.s:(uv.c||uv.s); return mi===0?uv.s:(uv.e||uv.s); };
    for(let i=0;i<nv;i++){ const p=mulP(m,[geo.P[i*3],geo.P[i*3+1],geo.P[i*3+2]]),a=geo.Nm[i*3],b=geo.Nm[i*3+1],c=geo.Nm[i*3+2],n=norm3([m[0]*a+m[4]*b+m[8]*c,m[1]*a+m[5]*b+m[9]*c,m[2]*a+m[6]*b+m[10]*c]);
      let u=geo.T[i*2]; const v=geo.T[i*2+1]; if(geo.kind==='box'&&vmi[i]===1) u=1-u; G.v(p,n,wpRegUV(pick(vmi[i]),u,v)); }
    for(const ix of geo.I) G.I.push(ix+base); }
  G.groups=[{start:0,count:G.I.length,mi:0}]; return G; }
function wpMesh(parent,parts,x=0,y=0,z=0){ return mk(wpMerge(parts),wpMat(),parent,x,y,z); }
/* a blade from paired spine and edge points ([z,y], heel to tip): flat faces from the spine down to a ground bevel, thin at the edge.
   UVs run heel to tip and edge (v=0) to spine (v=1), so the painted grind and hamon follow the real edge. */
function wpBladeGeo(sp,ed,th,o={}){ const g=new Geo(); g.kind='blade'; const n=sp.length,mid=o.mid??.35,te=th*(o.edgeK??.12),tm=th*(o.midK??.8);
  const P=(i,f)=>{ const s=sp[i],e=ed[i]; return [e[0]+(s[0]-e[0])*f,e[1]+(s[1]-e[1])*f]; }, rows=[[0,te],[mid,tm],[1,th]];
  const quad=(a,b,c,d,ta,tb,tc,td,mi)=>{ const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2]; let nn=[uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx];
    if(Math.hypot(...nn)<1e-12){ const wx=c[0]-a[0],wy=c[1]-a[1],wz=c[2]-a[2]; nn=[uy*wz-uz*wy,uz*wx-ux*wz,ux*wy-uy*wx]; } nn=norm3(nn); const st=g.I.length,bi=g.P.length/3;
    g.v(a,nn,ta); g.v(b,nn,tb); g.v(c,nn,tc); g.v(d,nn,td); g.I.push(bi,bi+1,bi+2,bi,bi+2,bi+3); g.groups.push({start:st,count:6,mi}); };
  const kt=i=>(i===n-1&&o.point)?.2:1;
  for(const s of [1,-1]) for(let i=0;i<n-1;i++) for(let r=0;r<2;r++){ const [f0,t0]=rows[r],[f1,t1]=rows[r+1],ua=i/(n-1),ub=(i+1)/(n-1),ka=kt(i),kb=kt(i+1);
    const A=P(i,f0),B=P(i+1,f0),C_=P(i+1,f1),D=P(i,f1);
    const pa=[s*t0/2*ka,A[1],A[0]],pb=[s*t0/2*kb,B[1],B[0]],pc=[s*t1/2*kb,C_[1],C_[0]],pd=[s*t1/2*ka,D[1],D[0]];
    if(s<0) quad(pa,pb,pc,pd,[ua,f0],[ub,f0],[ub,f1],[ua,f1],0); else quad(pb,pa,pd,pc,[ub,f0],[ua,f0],[ua,f1],[ub,f1],0); }
  for(let i=0;i<n-1;i++){ const a=sp[i],b=sp[i+1],ka=kt(i),kb=kt(i+1); quad([th/2*ka,a[1],a[0]],[-th/2*ka,a[1],a[0]],[-th/2*kb,b[1],b[0]],[th/2*kb,b[1],b[0]],[0,0],[1,0],[1,1],[0,1],1);
    const c=ed[i],d=ed[i+1]; quad([-te/2*ka,c[1],c[0]],[te/2*ka,c[1],c[0]],[te/2*kb,d[1],d[0]],[-te/2*kb,d[1],d[0]],[0,0],[1,0],[1,1],[0,1],1); }
  for(const [i,sg] of [[0,-1],[n-1,1]]){ const e=ed[i],s=sp[i],m_=P(i,mid),k=kt(i),V=q=>[q[0],q[1][1],q[1][0]], pts=[[te/2*k,e],[tm/2*k,m_],[th/2*k,s],[-th/2*k,s],[-tm/2*k,m_],[-te/2*k,e]];
    for(let j=1;j<5;j++){ const a=V(pts[0]),b=V(pts[j]),c=V(pts[j+1]); if(sg>0) quad(a,b,c,c,[0,0],[1,0],[1,1],[1,1],1); else quad(a,c,b,b,[0,0],[1,0],[1,1],[1,1],1); } }
  return g; }
function wpLine(z0,z1,n,f){ const a=[]; for(let i=0;i<n;i++){ const t=i/(n-1); a.push([z0+(z1-z0)*t,f(t)]); } return a; }
/* ---------- the builds (same sizes, grips, muzzles and sight lines as before) ---------- */
const PI2=Math.PI/2;
function pPistolP(g){ wpMesh(g,[
  [wpBox(.03,.035,.19),0,.045,.06,0,0,0,{s:'slide',t:'bluedT',f:'muzzle',b:'bluedT'}],
  [wpBox(.028,.02,.16),0,.02,.05,0,0,0,{s:'poly',t:'poly'}],
  [wpBox(.028,.11,.045),0,-.035,-.005,.28,0,0,{s:'grip',t:'poly',e:'poly'}],
  [wpBox(.031,.008,.05),0,-.09,-.021,.28,0,0,'poly'],
  [wpBox(.008,.004,.042),0,-.007,.041,0,0,0,'poly'], [wpBox(.008,.019,.004),0,.002,.062,-.2,0,0,'poly'],
  [wpBox(.005,.016,.005),0,.003,.032,.3,0,0,'steel'], [wpBox(.009,.012,.01),0,.062,-.036,-.35,0,0,'blued'],
  [wpBox(.004,.005,.03),.016,.03,.035,0,0,0,'blued']]); return g; }
function pRevolverP(g,gold){ const M_=gold?'goldBar':'blued';
  wpMesh(g,[
  [wpBox(.026,.085,.035),0,-.035,-.015,.3,0,0,{s:gold?'pearl':'walnutG',t:gold?'goldBar':'walnut',e:gold?'goldBar':'walnut'}],
  [wpBox(.028,.045,.085),0,.025,.03,0,0,0,{s:gold?['goldL',0,.42]:'blued',t:gold?'goldBar':'bluedT',e:M_}],
  [wpCyl(.021,.021,.042,6),0,.028,.045,PI2,0,0,{s:gold?'cylG':'cyl',c:gold?'chambG':'chamb'}],
  [wpCyl(.009,.009,.07,8),0,.036,.11,PI2,0,0,{s:M_,c:'bore'}],
  [wpCyl(.0045,.0045,.052,6),0,.0195,.1,PI2,0,0,M_], [wpBox(.006,.004,.064),0,.0455,.113,0,0,0,gold?'goldBar':'bluedT'],
  [wpBox(.008,.016,.012),0,.052,-.013,-.45,0,0,M_], [wpBox(.007,.004,.032),0,-.005,.036,0,0,0,M_], [wpBox(.007,.014,.004),0,.001,.052,-.25,0,0,M_],
  [wpBox(.005,.014,.005),0,.005,.03,.3,0,0,'steel']]); return g; }
function pShotgunP(g){ wpMesh(g,[
  [wpBox(.05,.07,.2),0,0,0,0,0,0,{s:'recv',t:'bluedT',f:'blued',b:'blued'}],
  [wpCyl(.012,.012,.5,8),0,.02,.35,PI2,0,0,{s:'blued',c:'bore'}],
  [wpCyl(.012,.012,.38,8),0,-.016,.3,PI2,0,0,{s:'blued',c:'bluedT'}], [wpCyl(.0135,.0135,.016,8),0,-.016,.493,PI2,0,0,{s:'steel',c:'bluedT'}],
  [wpBox(.045,.1,.25,{td:.7}),0,-.04,-.2,.12,0,0,{s:'walnut',t:'walnut',f:'walnut',b:'rubber'}],
  [wpBox(.012,.004,.05),0,-.043,-.05,0,0,0,'blued'], [wpBox(.006,.02,.006),0,-.03,-.05,.25,0,0,'steel']]);
  g.pump=mk(wpMerge([[wpBox(.046,.046,.17),0,0,0,0,0,0,{s:'pump',t:'pump',e:'walnut'}]]),wpMat(),g,0,-.018,.21); /* the fore-end slides: rack it */
  return g; }
function pSMGP(g){ wpMesh(g,[
  [wpBox(.045,.07,.24),0,0,.02,0,0,0,{s:'blackM',t:'bluedT',f:'poly',b:'poly'}],
  [wpCyl(.01,.01,.09,8),0,.012,.18,PI2,0,0,{s:'blued',c:'bore'}],
  [wpBox(.03,.17,.04),0,-.11,.04,0,0,0,{s:'blued',t:'poly',e:'blued'}],
  [wpBox(.035,.1,.04),0,-.07,-.07,.25,0,0,{s:'grip',t:'poly',e:'poly'}],
  [wpBox(.01,.01,.22),.02,.02,-.12,0,0,0,'steel'], [wpBox(.01,.01,.22),-.02,.02,-.12,0,0,0,'steel'],
  [wpBox(.05,.045,.008),0,.004,-.233,0,0,0,{s:'steel',f:'rubber',b:'rubber'}],
  [wpBox(.01,.012,.016),-.027,.022,.07,0,0,0,'steel'], [wpBox(.01,.004,.04),0,-.04,-.035,0,0,0,'poly']]); return g; }
function pKnifeP(g){ const sp=wpLine(.064,.235,12,t=>t<.62?.012:.012-.017*((t-.62)/.38)**1.4), ed=wpLine(.064,.235,12,t=>t<.5?-.021:-.021+.016*((t-.5)/.5)**2.2);
  wpMesh(g,[[wpCyl(.012,.013,.11,8),0,0,0,PI2,0,0,{s:'blackH',c:'poly'}],[wpBox(.026,.032,.012),0,-.002,.058,0,0,0,'steel'],[wpBladeGeo(sp,ed,.004,{point:true}),0,0,0,0,0,0,{s:'knife',e:'rim'}]]); return g; }
function pMacheteP(g){ const sp=wpLine(.062,.43,12,t=>.02-(t>.8?.03*((t-.8)/.2)**1.5:0)), ed=wpLine(.062,.43,12,t=>-.045-.01*Math.sin(t*Math.PI*.8)+(t>.85?.025*((t-.85)/.15)**2:0));
  wpMesh(g,[[wpCyl(.015,.016,.12,8),0,0,0,PI2,0,0,{s:'machH',c:'dark'}],[wpBox(.03,.042,.006),0,-.012,.06,0,0,0,'blued'],[wpBladeGeo(sp,ed,.006,{point:true,mid:.3}),0,0,0,0,0,0,{s:'machete',e:'rim'}]]); return g; }
function pCleaverP(g){ const sp=wpLine(.065,.285,8,()=>.012), ed=wpLine(.065,.285,8,t=>-.108-.004*Math.sin(t*Math.PI));
  wpMesh(g,[[wpCyl(.0145,.0135,.12,8),0,0,-.005,PI2,0,0,{s:'woodH',c:'dark'}],[wpCyl(.016,.016,.016,8),0,0,.062,PI2,0,0,'steel'],[wpBladeGeo(sp,ed,.006,{mid:.22,edgeK:.15}),0,0,0,0,0,0,{s:'cleaver',e:'rim'}]]); return g; }
/* a Japanese sword: wrapped tsuka, gold fittings, round tsuba, curved blade with a hamon */
function wpSword(g,z1,hz,hl,wrap,blade,sori,wd,tsR){ const n=22,kis=.92,f=t=>sori*t*t,tz=hz+hl/2+.009,z0=tz+.006;
  const sp=wpLine(z0,z1,n,t=>wd*.47+f(t)), ed=wpLine(z0,z1,n,t=>-wd*.53+f(t)+(t>kis?wd*((t-kis)/(1-kis))**1.6:0));
  wpMesh(g,[[wpCyl(.0145,.0145,hl,8),0,0,hz,PI2,0,0,{s:wrap,c:'goldBar'}],[wpCyl(.0158,.0158,.012,8),0,0,hz-hl/2-.004,PI2,0,0,'goldBar'],[wpCyl(.0158,.0158,.012,8),0,0,hz+hl/2-.004,PI2,0,0,'goldBar'],
    [wpCyl(tsR,tsR,.008,14),0,-.002,tz,PI2,0,0,{s:'goldBar',c:'tsuba'}],[wpBox(.009,wd*1.05,.022),0,-.001,tz+.015,0,0,0,'goldBar'],
    [wpBladeGeo(sp,ed,.0065,{point:true,mid:.32,edgeK:.12}),0,0,0,0,0,0,{s:blade,e:'rim'}]]); return g; }
function pKatanaP(g){ return wpSword(g,.88,-.005,.27,'tsukaR','katana',.028,.031,.042); }
function pWakiP(g){ return wpSword(g,.57,.02,.2,'tsukaW','waki',.014,.028,.032); }
function pYanagibaP(g){ const sp=wpLine(.086,.37,14,t=>t<.82?.012:.012-.024*((t-.82)/.18)**1.3), ed=wpLine(.086,.37,14,t=>t<.88?-.018:-.018+.006*((t-.88)/.12)**2);
  wpMesh(g,[[wpCyl(.012,.0125,.13,8),0,0,0,PI2,0,0,{s:'hoWood',c:'hoWood'}],[wpCyl(.0128,.0128,.02,8),0,0,.074,PI2,0,0,'dark'],[wpBladeGeo(sp,ed,.004,{point:true,mid:.3,midK:.95,edgeK:.1}),0,0,0,0,0,0,{s:'yanagi',e:'rim'}]]); return g; }
function pGLP(g){ wpMesh(g,[
  [wpCyl(.045,.045,.34,10),0,.03,.2,PI2,0,0,{s:'od',c:'boreBig'}], [wpCyl(.048,.048,.02,10),0,.03,.045,PI2,0,0,'blackM'], [wpCyl(.048,.048,.016,10),0,.03,.362,PI2,0,0,{s:'blackM',c:'boreBig'}],
  [wpCyl(.07,.07,.12,10),0,-.02,0,PI2,0,0,{s:'drum',c:'drumC'}], [wpCyl(.012,.012,.15,6),0,-.02,0,PI2,0,0,'steel'],
  [wpBox(.03,.12,.04),0,-.08,-.1,.3,0,0,{s:'grip',t:'poly',e:'poly'}], [wpBox(.04,.08,.22),0,-.02,-.2,0,0,0,{s:'od',b:'rubber'}],
  [wpBox(.03,.012,.15),0,.056,-.03,0,0,0,'blackM'], [wpBox(.01,.004,.05),0,-.05,-.075,0,0,0,'blackM']]); return g; }
function pMGP(g){ const P_=[
  [wpBox(.06,.1,.36),0,0,0,0,0,0,{s:'goldL',t:['goldL',0,.5],f:'goldBar',b:'goldBar'}],
  [wpCyl(.018,.018,.7,8),0,.02,.52,PI2,0,0,{s:'goldBar',c:'bore'}], [wpCyl(.028,.028,.3,10),0,.02,.34,PI2,0,0,{s:'shroud',c:'goldBar'}],
  [wpBox(.08,.1,.12),.06,-.02,.06,0,0,0,'ammoBox'],
  [wpBox(.05,.12,.24,{td:.7}),0,-.03,-.28,.08,0,0,{s:['goldL',.5,1],t:'goldBar',f:'goldBar',b:'rubber'}],
  [wpBox(.032,.1,.045),0,-.095,-.05,.25,0,0,{s:'pearl',t:'goldBar',e:'goldBar'}], [wpBox(.012,.004,.05),0,-.064,0,0,0,0,'goldBar']];
  for(let k=0;k<8;k++) P_.push([wpBox(.012,.04,.012),.11+k*.02,-.06-k*.012,.06,0,0,0,'brass']);
  wpMesh(g,P_); return g; }
/* the painted builds stand in for the plain ones wherever the old names are still called (stations' cases, the art-test cast) */
pPistol=pPistolP; pRevolver=g=>pRevolverP(g,false); pShotgun=pShotgunP; pSMG=pSMGP; pKnife=pKnifeP; pMachete=pMacheteP; pKatana=pKatanaP; pGL=pGLP; pMG=pMGP;
Object.assign(WPN.katana,{build:pKatanaP}); Object.assign(WPN.gl,{build:pGLP}); Object.assign(WPN.goldmg,{build:pMGP});
