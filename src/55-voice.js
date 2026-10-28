/* =====================================================================
   VOICES. Every man in the building breathes, grunts, screams, sobs, chokes and rattles, from his own
   mouth, in 3D. No recordings: each voice is built live from a glottal buzz (his own pitch, rasp and
   breathiness) shaped by vowel formants, with breath noise, pitch jitter and voice breaks layered on.
   It won't pass for an actor, but it's a person in pain, not a beep.
   What he sounds like follows his state: panting when hurt, groaning on the floor, straining as he
   crawls, sobbing when he begs, gurgling with an opened throat, a rattle at the end.
   ===================================================================== */
const VOICE_KIND={corner:{f0:132,rasp:.15,breath:.55},cutter:{f0:112,rasp:.35,breath:.4},gunman:{f0:106,rasp:.22,breath:.4},
  doorman:{f0:84,rasp:.45,breath:.32},enforcer:{f0:98,rasp:.28,breath:.35},landlord:{f0:94,rasp:.55,breath:.5}};
const VOWEL={a:[820,1220,2600],ae:[700,1650,2450],uh:[620,1190,2500],o:[520,870,2450],u:[360,720,2300],eh:[580,1750,2500],e:[440,2050,2650],i:[310,2250,2950],m:[260,1050,2200],h:[700,1500,2600]};
/* how each sound is made: duration, pitch curve (multiples of his f0), vowels in order, effort (rasp/loudness), breath share, priority */
const VOX={
  shout:  {dur:[.38,.5],f:[1.5,1.75,1.25],v:['h','eh','e'],eff:.85,br:.25,vol:.9,pri:2},
  grunt:  {dur:[.12,.22],f:[1.2,1.0,.8],v:['uh','uh'],eff:.7,br:.35,vol:.75,pri:2,att:.012},
  oof:    {dur:[.18,.28],f:[1.0,.85,.7],v:['h','uh','m'],eff:.55,br:.75,vol:.8,pri:2,att:.008},
  scream: {dur:[.75,1.3],f:[1.7,2.5,2.3,1.6],v:['ae','a','a','uh'],eff:1,br:.2,vol:1,pri:4,vib:.035,sub:.3},
  stabbed:{dur:[.5,.8],f:[2.0,2.6,1.4],v:['h','ae','uh'],eff:.95,br:.35,vol:.95,pri:4,sub:.25,att:.01},
  agony:  {dur:[.45,.85],f:[1.8,2.2,1.7],v:['eh','ae','eh'],eff:1,br:.45,vol:.9,pri:3,sub:.3,vib:.05},
  cry:    {dur:[1.4,2.1],f:[2.2,2.9,2.6,2.0,1.4],v:['a','a','ae','a','uh'],eff:1,br:.2,vol:1,pri:5,vib:.04,sub:.35},
  groan:  {dur:[1.0,1.9],f:[.95,.8,.72],v:['uh','o','m'],eff:.45,br:.45,vol:.55,pri:1,fry:.5},
  strain: {dur:[.22,.36],f:[1.25,1.4,1.1],v:['m','uh'],eff:.75,br:.3,vol:.55,pri:1,att:.02},
  sob:    {dur:[.14,.22],f:[1.9,1.6],v:['uh','m'],eff:.55,br:.5,vol:.6,pri:1,rep:[3,5],gap:.2},
  whimper:{dur:[.3,.5],f:[2.3,2.6,2.0],v:['m','i','m'],eff:.4,br:.55,vol:.45,pri:1},
  plead:  {dur:[.5,.8],f:[1.5,1.8,1.3],v:['eh','o','uh'],eff:.6,br:.45,vol:.65,pri:2},
  gasp:   {dur:[.2,.3],f:[1.8,2.1],v:['h','a'],eff:.3,br:.85,vol:.6,pri:2,inhale:true},
  gurgle: {dur:[.8,1.4],f:[.95,.85,.9],v:['o','uh','o'],eff:.35,br:.3,vol:.6,pri:3,bub:1},
  choke:  {dur:[.07,.12],f:[1.6,1.3],v:['h','uh'],eff:.6,br:.6,vol:.55,pri:3,rep:[3,4],gap:.14},
  rattle: {dur:[1.0,1.6],f:[.55,.42],v:['uh','o'],eff:.3,br:.6,vol:.5,pri:5,fry:1,bub:.5},
  breath: {dur:[.28,.4],f:[1,1],v:['h','h'],eff:0,br:1,vol:.28,pri:0,noVoice:true} };
let VOXN=0; const VOX_MAX=6;
function voiceOf(E){ return E.voice||(E.voice=Object.assign({},VOICE_KIND[E.kind]||VOICE_KIND.gunman,{f0:(VOICE_KIND[E.kind]||VOICE_KIND.gunman).f0*rnd(.92,1.08)})); }
let GLOT=null;
function glot(ac){ if(GLOT) return GLOT; const n=40,re=new Float32Array(n),im=new Float32Array(n); for(let k=1;k<n;k++) im[k]=-1/Math.pow(k,1.25); GLOT=ac.createPeriodicWave(re,im); return GLOT; }
const SHAPE={}; function shaper(ac,k){ const key=Math.round(k*10); if(SHAPE[key]) return SHAPE[key]; const c=new Float32Array(512); for(let i=0;i<512;i++){ const x=i/255.5-1; c[i]=Math.tanh(x*(1+k*4))/Math.tanh(1+k*4); } return SHAPE[key]=c; }
/* the listener is your head */
function voiceListener(){ if(!AC) return; const L=AC.listener,{f,u,eye}=camBasis(); if(!eye) return;
  try{ if(L.positionX){ L.positionX.value=eye[0]; L.positionY.value=eye[1]; L.positionZ.value=eye[2]; L.forwardX.value=f[0]; L.forwardY.value=f[1]; L.forwardZ.value=f[2]; L.upX.value=u[0]; L.upY.value=u[1]; L.upZ.value=u[2]; }
    else { L.setPosition(eye[0],eye[1],eye[2]); L.setOrientation(f[0],f[1],f[2],u[0],u[1],u[2]); } }catch(_){} }
function vox(E,type,vol=1){ const ac=AC; if(!ac||!E||!E.B) return; const D=VOX[type]; if(!D) return;
  const now=ac.currentTime; if(E.voxEnd>now&&D.pri<=(E.voxPri||0)) return; /* busy with something that matters as much */
  const hp=X_(E.B,PI_.head),dist=Math.hypot(hp[0]-PL.x,hp[2]-PL.z); if(dist>15) return;
  if(VOXN>=VOX_MAX&&D.pri<3) return;
  if(E.voxStop&&E.voxEnd>now) E.voxStop();
  const V=voiceOf(E),slow=GAME.slow?.62:1,fm=GAME.slow?.82:1,reps=D.rep?Math.round(rnd(D.rep[0],D.rep[1])):1;
  const pan=ac.createPanner(); pan.panningModel='HRTF'; pan.distanceModel='inverse'; pan.refDistance=1; pan.rolloffFactor=1.1; pan.maxDistance=30;
  if(pan.positionX){ pan.positionX.value=hp[0]; pan.positionY.value=hp[1]+.08; pan.positionZ.value=hp[2]; } else pan.setPosition(hp[0],hp[1]+.08,hp[2]);
  const master=ac.createGain(); master.gain.value=vol*D.vol*(.35+.65*clamp(E.cons??1,0,1))*(E.silent&&type!=='rattle'?.4:1)*1.6; master.connect(pan); pan.connect(ac.destination);
  const nodes=[]; let t=now+.005,end=t;
  for(let r=0;r<reps;r++){ const dur=rnd(D.dur[0],D.dur[1])/slow; utter(ac,D,V,t,dur,master,nodes,slow,fm); end=t+dur; t=end+(D.gap||0)*rnd(.7,1.3)/slow+(D.rep?rnd(.0,.05):0); }
  VOXN++; E.voxEnd=end; E.voxPri=D.pri; E.voxBusy=true;
  E.voxStop=()=>{ for(const n of nodes){ try{ n.stop(); }catch(_){} } };
  setTimeout(()=>{ VOXN=Math.max(0,VOXN-1); E.voxBusy=false; try{ pan.disconnect(); }catch(_){} },(end-now)*1000+120); }
function curve(n,fn){ const a=new Float32Array(n); for(let i=0;i<n;i++) a[i]=fn(i/(n-1)); return a; }
function seq(arr,x){ const p=x*(arr.length-1),i=Math.min(arr.length-2,Math.floor(p)),k=p-i; return arr.length<2?arr[0]:arr[i]+(arr[i+1]-arr[i])*(k*k*(3-2*k)); }
function utter(ac,D,V,t,dur,out,nodes,slow,fm){
  const f0=V.f0*slow,eff=D.eff,N=64,jit=.012+eff*.03+(D.fry||0)*.04,sh=[...Array(8)].map(()=>rnd(-1,1));
  const fc=curve(N,x=>{ const base=seq(D.f,x),wob=(D.vib?Math.sin(x*dur*6.2*Math.PI*2)*D.vib:0)+(Math.sin(x*23.1+sh[0]*3)*.5+Math.sin(x*61.7+sh[1]*5)*.5)*jit,brk=eff>.9&&x>.55&&x<.62&&sh[2]>.2?.82:1;
    return Math.max(25,f0*base*(1+wob)*brk*((D.fry||0)>.6&&x>.5?.55:1)); });
  const att=D.att||.04,amp=curve(N,x=>{ const tt=x*dur,e=Math.min(1,tt/att)*Math.min(1,(dur-tt)/(dur*.35+.02)); return Math.max(0,e)*(1+((D.fry||0)*.5+eff*.12)*Math.sin(x*dur*(D.fry?38:13)*6.28+sh[3])); });
  const mix=ac.createGain(); mix.gain.value=1; mix.connect(out);
  /* the buzz from the throat */
  if(!D.noVoice){ const o=ac.createOscillator(); o.setPeriodicWave(glot(ac)); o.frequency.setValueCurveAtTime(fc,t,dur);
    const g=ac.createGain(); g.gain.value=0; g.gain.setValueCurveAtTime(curve(N,x=>amp[Math.round(x*(N-1))]*(1-D.br*.6)),t,dur);
    const ws=ac.createWaveShaper(); ws.curve=shaper(ac,V.rasp*.6+eff*.55); o.connect(g); g.connect(ws); formants(ac,ws,D,dur,t,mix,fm,1); nodes.push(o); o.start(t); o.stop(t+dur+.02);
    if(D.sub){ const s2=ac.createOscillator(); s2.setPeriodicWave(glot(ac)); s2.frequency.setValueCurveAtTime(curve(N,x=>fc[Math.round(x*(N-1))]*.5),t,dur); const g2=ac.createGain(); g2.gain.value=0; g2.gain.setValueCurveAtTime(curve(N,x=>amp[Math.round(x*(N-1))]*D.sub*(.4+.6*Math.abs(Math.sin(x*29+sh[4])))),t,dur); s2.connect(g2); g2.connect(ws); nodes.push(s2); s2.start(t); s2.stop(t+dur+.02); } }
  /* breath through the same mouth */
  const nz=ac.createBufferSource(); nz.buffer=NOISE; nz.loop=true; nz.playbackRate.value=slow; const hp=ac.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=D.inhale?900:350;
  const gb=ac.createGain(); gb.gain.value=0; gb.gain.setValueCurveAtTime(curve(N,x=>amp[Math.round(x*(N-1))]*(D.br*(.5+V.breath*.6))*(D.inhale?1.4:1)*(D.noVoice?1:.55)),t,dur);
  nz.connect(hp); hp.connect(gb); formants(ac,gb,D,dur,t,mix,fm,.7); nodes.push(nz); nz.start(t,Math.random()*.5); nz.stop(t+dur+.02);
  /* blood in the throat: bubbles */
  if(D.bub){ const b=ac.createBufferSource(); b.buffer=NOISE; b.loop=true; const lp=ac.createBiquadFilter(); lp.type='bandpass'; lp.frequency.value=380*fm; lp.Q.value=2.2;
    const gg=ac.createGain(); gg.gain.value=0; const rate=rnd(9,16); gg.gain.setValueCurveAtTime(curve(128,x=>{ const ph=(x*dur*rate)%1,k=Math.floor(x*dur*rate); return D.bub*1.6*(ph<.25?Math.sin(ph/.25*Math.PI):0)*(.4+.6*Math.abs(Math.sin(k*12.9898)))*Math.min(1,(1-x)*4); }),t,dur);
    b.connect(lp); lp.connect(gg); gg.connect(mix); nodes.push(b); b.start(t,Math.random()*.5); b.stop(t+dur+.02); } }
function formants(ac,src,D,dur,t,out,fm,k){ const vs=D.v.map(n=>VOWEL[n]);
  [[0,1,10],[1,.5,13],[2,.22,20]].forEach(([i,g,q])=>{ const bp=ac.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=q*(D.inhale?.5:1);
    bp.frequency.setValueAtTime(vs[0][i]*fm,t); vs.forEach((v,j)=>{ if(j) bp.frequency.linearRampToValueAtTime(v[i]*fm,t+dur*j/(vs.length-1)); });
    const gg=ac.createGain(); gg.gain.value=g*k*(i===0?2.2:3.2); src.connect(bp); bp.connect(gg); gg.connect(out); }); }

/* what each man sounds like from moment to moment: called from think() */
function voiceTick(E,dt,dist){ if(GAME.voices===false) return;
  if(!AC||E.dead||dist>14) return; E.voxT=(E.voxT??rnd(.3,1.5))-dt; if(E.voxT>0) return;
  const neck=E.wounds.some(w=>w.part==='neck'&&!w.piece),hurt=E.wounds.length>0||E.stun>.4,choked=E.grabbed&&E.chokeT>0;
  let type=null,next=rnd(1.6,3);
  if(choked){ type='choke'; next=rnd(.6,1.1); }
  else if(E.impaled>0){ type=Math.random()<.6?'agony':'whimper'; next=rnd(.7,1.4); }
  else if(neck){ type=Math.random()<.65?'gurgle':'choke'; next=rnd(1.2,2.2); }
  else if(E.st==='down'&&E.knocked&&E.stun>.9){ type='breath'; next=rnd(2.6,3.4); }               /* out cold: slow breathing */
  else if(E.cons<.4&&hurt){ type=Math.random()<.5?'groan':'breath'; next=rnd(1.8,3); }              /* fading */
  else if(E.st==='down'&&(E.downMode==='crawl'||E.downMode==='scoot')){ type=Math.random()<.7?'strain':'breath'; next=rnd(.5,.9); }
  else if(E.st==='down'&&E.downMode==='downbeg'||E.st==='kneel'&&E.near){ type=pick(['sob','sob','whimper','plead']); next=rnd(1.4,2.6); }
  else if(E.st==='down'||E.st==='kneel'){ type=Math.random()<.6?'groan':'breath'; next=rnd(1.6,3.2); }
  else if(E.st==='alert'&&hurt){ type='breath'; next=rnd(.45,.75); }                                  /* hurt and fighting: hard breathing */
  else if(E.st==='alert'&&(E.runAmt||0)>.3){ type='breath'; next=rnd(.5,.8); }
  else if(!E.aware&&dist<2.6){ type='breath'; next=rnd(2.4,3.6); }                                     /* right next to him in the dark: you hear him breathe */
  E.voxT=next/(GAME.slow?.6:1); if(type) vox(E,type,type==='breath'?(E.aware?1.1:.6):1); }
