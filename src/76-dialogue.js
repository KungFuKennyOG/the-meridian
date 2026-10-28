/* =====================================================================
   DIALOGUE. Lines are spoken in the old way: a subtitle with the speaker's name, and a voice made of
   babble, a stream of formant syllables at the speaker's own pitch (think a 90s console RPG). The handler
   comes through an earpiece (band-limited, a little crackle), the station PA through a tannoy with a chime.
   In the headset the subtitle sits on a small panel that drifts in front of you, low, and never locks to
   your head; on a flat screen it's a caption at the bottom.
   say([[who,text],...],{at,key,prio}) queues lines; key makes a set play only once per run.
   ===================================================================== */
const DLG={q:[],cur:null,t:0,said:new Set(),gap:0,panelP:null};
function speakerOf(who){ const S=typeof STORY!=='undefined'?STORY:null;
  if(who==='nico') return {name:'NICO',col:'#3fae9a',v:(S&&S.nicoVoice)||{f0:100,rasp:.3,breath:.35}};
  if(who==='handler') return {name:((S&&S.handler&&(S.handler.short||S.handler.name))||'HANDLER').toUpperCase(),col:'#ffb020',v:(S&&S.handler&&S.handler.voice)||{f0:178,rasp:.15,breath:.4},radio:true};
  if(who==='pa') return {name:'STATION',col:'#29e0e6',v:{f0:196,rasp:.05,breath:.3},pa:true};
  if(who==='phone') return FIN.on?{name:'CAB RADIO · OLD KAGAMI',col:'#e8e0c8',v:{f0:95,rasp:.62,breath:.45},radio:true}:{name:'PAYPHONE',col:'#b8d0ff',v:{f0:150,rasp:0,breath:.2},radio:true};
  const R_=typeof ROSTER!=='undefined'&&ROSTER[who], C_=typeof CREW_OF!=='undefined'&&CREW_OF[who], K=C_&&CREWS[C_.crew];
  return {name:((R_&&R_.name)||who).toUpperCase(),col:(R_&&R_.color)||'#ff6a3a',v:Object.assign({f0:120,rasp:.25,breath:.4},K&&K.voice,C_&&C_.voice)}; }
function say(lines,o={}){ if(!lines||!lines.length) return false; if(o.key){ if(DLG.said.has(o.key)) return false; DLG.said.add(o.key); }
  if(o.cut){ DLG.q.length=0; if(DLG.cur){ DLG.cur=null; dlgShow(null); } }
  for(const l of lines){ const [who,text]=Array.isArray(l)?l:['nico',l]; if(text) DLG.q.push({who,text,at:o.at||null,dur:o.dur||clamp(1.1+text.length*.058,1.8,7)}); } return true; }
function sayOne(list,who,o){ if(!list||!list.length) return; const l=pick(list); say([Array.isArray(l)?l:[who||'nico',l]],o); }
function dlgTick(dt){ if(DLG.gap>0){ DLG.gap-=dt; return; }
  if(DLG.cur){ DLG.t+=dt; if(DLG.t>=DLG.cur.dur){ DLG.cur=null; dlgShow(null); DLG.gap=.25; } }
  if(!DLG.cur&&DLG.q.length){ DLG.cur=DLG.q.shift(); DLG.t=0; dlgShow(DLG.cur); babble(DLG.cur); }
  dlgPlace(dt); }
function dlgClear(){ DLG.q.length=0; DLG.cur=null; dlgShow(null); }

/* ---------- the caption ---------- */
(function(){ const d=document.createElement('div'); d.id='subs'; d.hidden=true; d.innerHTML='<b></b><span></span>'; document.body.append(d); })();
const SUBW=1024,SUBH=150, subTex=tex(SUBW,SUBH,null); subTex.dyn=true;
const subN=N(world); subN.vis=false; mk(plane(.86,.126),M(subTex,{unlit:true,cut:true,double:true}),subN,0,0,0);
function dlgShow(L){ const el=$('subs'); if(!L){ el.hidden=true; subN.vis=false; return; }
  const S=speakerOf(L.who); el.hidden=false; el.firstChild.textContent=S.name; el.firstChild.style.color=S.col; el.lastChild.textContent=L.text;
  const g=subTex.c.getContext('2d'); g.clearRect(0,0,SUBW,SUBH);
  g.fillStyle='rgba(8,12,26,.92)'; rr(g,4,4,SUBW-8,SUBH-8,18); g.fill(); g.fillStyle=S.col; g.fillRect(4,SUBH-10,SUBW-8,6);
  g.textBaseline='top'; g.textAlign='left'; g.fillStyle=S.col; g.font='700 30px "Zen Kaku Gothic New","IBM Plex Mono",sans-serif'; g.fillText(S.name,26,14);
  g.fillStyle='#f6f0e2'; g.font='600 38px "IBM Plex Mono",monospace'; const words=L.text.split(' '); let line='',y=54,lines=[];
  for(const w of words){ const t=line?line+' '+w:w; if(g.measureText(t).width>SUBW-52&&line){ lines.push(line); line=w; } else line=t; } lines.push(line);
  if(lines.length>2){ g.font='600 30px "IBM Plex Mono",monospace'; } for(const l of lines.slice(0,3)){ g.fillText(l,26,y); y+=lines.length>2?30:42; }
  if(subTex.glt){ gl.bindTexture(gl.TEXTURE_2D,subTex.glt); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,subTex.c); }
  subN.vis=XR.on; DLG.snap=true; }
function rr(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
/* the panel drifts to a spot a metre ahead and a little low, so you can read it without it riding your head */
function dlgPlace(dt){ if(!subN.vis||!XR.on||!XR.head) return; const {eye,f}=XR.head, fl=norm3([f[0],0,f[2]]);
  let tgt=[eye[0]+fl[0]*1.05,eye[1]-.34,eye[2]+fl[2]*1.05];
  const at=DLG.cur&&DLG.cur.at; if(at&&Math.hypot(at[0]-eye[0],at[2]-eye[2])<4.5) tgt=[at[0],at[1]+.42,at[2]];
  const k=DLG.snap?1:1-Math.exp(-dt*2.2); DLG.snap=false; subN.p=subN.p.map((v,i)=>v+(tgt[i]-v)*k);
  const dx=eye[0]-subN.p[0],dz=eye[2]-subN.p[2]; subN.r=[0,Math.atan2(dx,dz),0]; }

/* ---------- babble: syllables of buzz through two formants ---------- */
const BAB_V=['a','e','i','o','u','ae','eh','uh'];
function babble(L){ if(GAME.voices===false) return; const ac=audio(); if(!ac||ac.state!=='running') return; const S=speakerOf(L.who),v=S.v;
  const t0=ac.currentTime+.04, n=Math.max(2,Math.min(26,Math.round(L.text.replace(/[^a-zA-Z0-9]/g,'').length/2.6))), span=Math.min(L.dur-.35,n*.13);
  const bus=ac.createGain(); bus.gain.value=.5*(GAME.vol&&typeof GAME.vol.voice==='number'?GAME.vol.voice:1);
  let out=bus;
  if(S.radio||S.pa){ const hp=ac.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=S.pa?320:520; const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=S.pa?3600:2800; bus.connect(hp); hp.connect(lp); out=lp; }
  if(S.pa){ const dl=ac.createDelay(.5); dl.delayTime.value=.17; const fb=ac.createGain(); fb.gain.value=.32; out.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(ac.destination); chime(ac,t0-.02); }
  out.connect(ac.destination);
  const r=rng((L.text.length*131+L.text.charCodeAt(0))|0); let t=t0+(S.pa?.7:0); const ques=/\?\s*$/.test(L.text), excl=/!\s*$/.test(L.text);
  for(let i=0;i<n;i++){ const d=span/n*(.75+r()*.5), last=i===n-1; if(r()<.12&&!last){ t+=d*.6; continue; }
    const vo=VOWEL[BAB_V[(r()*BAB_V.length)|0]], f=v.f0*(1+.08*Math.sin(i*1.7))*(last?(ques?1.25:excl?1.12:.86):1)*(1+(r()-.5)*.1);
    const o=ac.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(f,t); o.frequency.linearRampToValueAtTime(f*(last&&!ques?.9:1.03),t+d);
    const g=ac.createGain(), pk=.11*(excl?1.25:1); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(pk,t+.018); g.gain.setTargetAtTime(pk*.55,t+.03,d*.35); g.gain.linearRampToValueAtTime(0,t+d*.95);
    const b1=ac.createBiquadFilter(); b1.type='bandpass'; b1.frequency.value=vo[0]*(v.f0>150?1.12:1); b1.Q.value=5; const b2=ac.createBiquadFilter(); b2.type='bandpass'; b2.frequency.value=vo[1]*(v.f0>150?1.1:1); b2.Q.value=7;
    o.connect(b1); o.connect(b2); b1.connect(g); b2.connect(g); g.connect(bus); o.start(t); o.stop(t+d+.02); t+=d; }
  setTimeout(()=>{ try{ bus.disconnect(); }catch(_){} },(t-ac.currentTime+1.5)*1000); }
/* the station chime: three soft bells, falling */
function chime(ac,t){ [988,784,659].forEach((f,i)=>{ const o=ac.createOscillator(),g=ac.createGain(); o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,t+i*.2); g.gain.linearRampToValueAtTime(.09,t+i*.2+.01); g.gain.exponentialRampToValueAtTime(.0005,t+i*.2+.9); o.connect(g); g.connect(ac.destination); o.start(t+i*.2); o.stop(t+i*.2+1); }); }
