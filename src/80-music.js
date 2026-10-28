/* =====================================================================
   MUSIC. Every car has its own tune, every station its own air, and the train hums underneath.
   All of it is synthesized live with WebAudio: no samples, no files. One lookahead scheduler
   (25 ms timer, 0.15 s ahead) drives note patterns written out by hand per track.
   Layers: music (per car), ambience (per station), rumble (inside cars). Each has its own gain,
   a bullet-time low-pass and (music/ambience) a generated-impulse reverb; all three meet in one
   master gain and a safety compressor before the shared context's destination.
   Every voice builder takes the context (via its player P) as a parameter, so the same code
   renders offline for tests: MUSIC._renderOffline(kind,key,seconds).
   ===================================================================== */
const MUSIC=(()=>{
const NOTE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const midi=s=>{ const m=/^([A-G])(#|b)?(-?\d)$/.exec(s); if(!m) throw new Error('MUSIC: bad note '+s); return NOTE[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0)+12*(+m[3]+1); };
const hz=m=>440*Math.pow(2,(m-69)/12);
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[(Math.random()*a.length)|0];
const VOL={music:1,ambience:1,rumble:1};
let muted=false;
const SLOW_RATE=.6, SLOW_CENTS=-500, SLOW_RAMP=.4, CAP=22;

/* ---------- per-context rig: master, compressor, three layers ---------- */
const RIGS=new WeakMap();
function noiseBuf(ac){ const n=ac.sampleRate*4|0,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1; return b; }
function impulse(ac,secs,decay,damp,er){ /* stereo noise tail that darkens as it dies, plus early reflections */
  const sr=ac.sampleRate,n=sr*secs|0,b=ac.createBuffer(2,n,sr);
  for(let c=0;c<2;c++){ const d=b.getChannelData(c); let lp=0;
    for(let i=0;i<n;i++){ const x=i/n,k=Math.max(.04,1-damp*x); lp+=((Math.random()*2-1)-lp)*k; d[i]=lp*Math.pow(1-x,decay)*(i<sr*.004?i/(sr*.004):1); }
    for(let r=0;r<er;r++){ const at=(sr*rnd(.006,.11))|0; if(at<n) d[at]+=rnd(-.9,.9)*(1-r/er); } }
  return b; }
function rig(ac,offline){ let s=RIGS.get(ac); if(s) return s;
  const comp=ac.createDynamicsCompressor(); comp.threshold.value=-9; comp.knee.value=4; comp.ratio.value=10; comp.attack.value=.003; comp.release.value=.18;
  const master=ac.createGain(); master.gain.value=(muted&&!offline)?0:1; master.connect(comp); comp.connect(ac.destination);
  const L={};
  for(const k of ['music','ambience','rumble']){ const inp=ac.createGain(),lp=ac.createBiquadFilter(),vol=ac.createGain();
    lp.type='lowpass'; lp.frequency.value=20000; lp.Q.value=.6; vol.gain.value=offline?1:VOL[k];
    inp.connect(lp); lp.connect(vol); vol.connect(master);
    let rev=null; if(k!=='rumble'){ rev=ac.createConvolver(); rev.buffer=k==='music'?impulse(ac,1.6,3.2,.85,6):impulse(ac,3.2,2.1,.55,14); rev.connect(inp); }
    L[k]={inp,lp,vol,rev}; }
  s={ac,master,comp,L,noise:noiseBuf(ac),offline:!!offline,curves:{}}; RIGS.set(ac,s); return s; }
function curve(s,amt){ const k=amt.toFixed(2); if(s.curves[k]) return s.curves[k]; const n=1024,c=new Float32Array(n); for(let i=0;i<n;i++){ const x=i/(n-1)*2-1; c[i]=Math.tanh(x*amt)/Math.tanh(amt); } return s.curves[k]=c; }

/* ---------- bullet time: one shared state, read per player ---------- */
const SL={on:false,t:-1e9,from:0};
function slowAmt(P,t){ if(P.s.offline) return 0; const k=Math.min(1,Math.max(0,(t-SL.t)/SLOW_RAMP)); return SL.on?SL.from+(1-SL.from)*k:SL.from*(1-k); }
const rate=(P,t)=>1-(1-SLOW_RATE)*slowAmt(P,t);
const pitch=(P,t)=>Math.pow(2,SLOW_CENTS/1200*slowAmt(P,t));

/* ---------- node helpers ---------- */
const G=(ac,v)=>{ const g=ac.createGain(); g.gain.value=v; return g; };
const F=(ac,type,f,q)=>{ const b=ac.createBiquadFilter(); b.type=type; b.frequency.value=f; if(q!=null) b.Q.value=q; return b; };
const O=(ac,type,f)=>{ const o=ac.createOscillator(); o.type=type; o.frequency.value=f; return o; };
const NZ=P=>{ const b=P.ac.createBufferSource(); b.buffer=P.s.noise; b.loop=true; return b; };
const PAN=(ac,p)=>{ const n=ac.createStereoPanner(); n.pan.value=p; return n; };
function chain(...n){ for(let i=0;i<n.length-1;i++) n[i].connect(n[i+1]); return n[n.length-1]; }
/* register a voice: stops every source at `end`, disconnects everything when the first ends.
   Offline, every note is scheduled before rendering starts and onended never fires in time, so the
   live count is kept from the end times instead (P.ends), or the voice cap would drop every melody. */
function V(P,srcs,nodes,end){ const n=srcs.length+nodes.length; P.live++; P.nodes+=n; if(P.s.offline) P.ends.push(end);
  for(const o of srcs) o.stop(end);
  srcs[0].onended=()=>{ if(!P.s.offline) P.live--; P.nodes-=n; for(const x of srcs) x.disconnect(); for(const x of nodes) x.disconnect(); }; }
function startNoise(P,src,t,end){ src.start(t,Math.random()*3); }
/* percussive gain: 2 ms attack then exponential decay (tau = dec/5) */
function perc(g,t,peak,dec){ g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak,t+.002); g.gain.setTargetAtTime(0,t+.002,dec/5); }
/* continuous (bed) sources: their detune follows bullet time */
function cont(P,param){ if(!P.s.offline&&SL.on) param.value=SLOW_CENTS; P.cont.push(param); }
/* persistent per-player sources (LFOs, beds): stopped on dispose */
function keep(P,src,...nodes){ P.keepSrc.push(src); P.keep.push(...nodes); P.nodes+=1+nodes.length; return src; }

/* ---------- per-player buses: channels, chorus, echo, shared vibrato LFO ---------- */
function vibLFO(P){ if(!P.vib){ P.vib=O(P.ac,'sine',P.spec&&P.spec.vibHz||5.4); keep(P,P.vib); P.vib.start(P.ac.currentTime); } return P.vib; }
function chan(P,name){ const c=P.ch[name]; if(c) return c; const ac=P.ac,ps=(P.parts&&P.parts[name])||{};
  const g=G(ac,ps.g==null?.5:ps.g); g.connect(P.out); let inp=g; const nodes=[g];
  if(ps.pan){ const p=PAN(ac,ps.pan); p.connect(g); inp=p; nodes.push(p); }
  if(ps.chorus){ const i=G(ac,1),dl=ac.createDelay(.05),wet=G(ac,.7),lfo=O(ac,'sine',ps.chorus),dep=G(ac,.0032);
    dl.delayTime.value=.014; i.connect(inp); i.connect(dl); dl.connect(wet); wet.connect(inp); lfo.connect(dep); dep.connect(dl.delayTime); lfo.start(ac.currentTime);
    keep(P,lfo,dep); nodes.push(i,dl,wet); inp=i; }
  if(ps.rv&&P.rv){ const s=G(ac,ps.rv); g.connect(s); s.connect(P.rv); nodes.push(s); }
  if(ps.dl&&P.dly){ const s=G(ac,ps.dl); g.connect(s); s.connect(P.dly); nodes.push(s); }
  P.keep.push(...nodes); P.nodes+=nodes.length; return P.ch[name]=inp; }
function echoBus(P,time,fb,cut){ const ac=P.ac,i=G(ac,1),d=ac.createDelay(2),f=G(ac,fb),lp=F(ac,'lowpass',cut||2600,.5);
  d.delayTime.value=time; chain(i,d,lp,f,d); lp.connect(P.out); if(P.rv){ const s=G(ac,.35); lp.connect(s); s.connect(P.rv); P.keep.push(s); }
  P.keep.push(i,d,f,lp); P.nodes+=4; P.dly=i; }

/* ---------- melodic voices. Signature: (P, dst, t, freqHz, durSec, vel, opts, partName) ---------- */
const INST={
  /* generic subtractive voice: oscillator stack -> (drive) -> filter -> amp. Most instruments are presets of this. */
  sv(P,dst,t,f,d,v,o,part){ const ac=P.ac,w=o.w||[['sawtooth',1,0,1]],mix=G(ac,1),srcs=[],nodes=[mix];
    let f0=f; if(o.glide){ const pf=P.lastF[part]; if(pf&&P.lastT[part]>t-.6) f0=pf; } P.lastF[part]=f; P.lastT[part]=t+d;
    let vg=null; if(o.vib){ vg=G(ac,0); vg.gain.setValueAtTime(0,t); vg.gain.setValueAtTime(0,t+(o.vdel||.18)); vg.gain.linearRampToValueAtTime(o.vib,t+(o.vdel||.18)+.25); vibLFO(P).connect(vg); nodes.push(vg); }
    for(const [type,mul,det,g] of w){ const os=O(ac,type,f*mul),fp=os.frequency; if(det) os.detune.value=det;
      if(o.drop){ fp.setValueAtTime(f*mul*o.drop,t); fp.exponentialRampToValueAtTime(f*mul,t+(o.dropT||.05)); }
      else if(o.slide){ fp.setValueAtTime(f*mul*o.slide,t); fp.setTargetAtTime(f*mul,t,o.slideT||.035); }
      else if(f0!==f){ fp.setValueAtTime(f0*mul,t); fp.exponentialRampToValueAtTime(f*mul,t+o.glide); }
      if(o.bend){ fp.setValueAtTime(f*mul,t+d*.5); fp.exponentialRampToValueAtTime(f*mul*o.bend,t+d); }
      if(vg) vg.connect(os.detune);
      if(g===1) os.connect(mix); else { const gg=G(ac,g); os.connect(gg); gg.connect(mix); nodes.push(gg); } srcs.push(os); }
    if(o.nz){ const n=NZ(P),nf=F(ac,'bandpass',Math.min(f*(o.nzf||3),9000),.8),ng=G(ac,0); perc(ng,t,v*o.nz,o.nzd||.05); chain(n,nf,ng,mix); startNoise(P,n,t); srcs.push(n); nodes.push(nf,ng); }
    let x=mix; if(o.drive){ const sh=ac.createWaveShaper(); sh.curve=curve(P.s,o.drive); x.connect(sh); x=sh; nodes.push(sh); }
    if(o.cut){ const base=Math.min(o.cabs?o.cut:f*o.cut,15000),fl=F(ac,o.ft||'lowpass',base,o.q||.7);
      if(o.env){ fl.frequency.setValueAtTime(Math.min(base*o.env,15000),t); fl.frequency.setTargetAtTime(base,t+(o.fa||0),o.ftau||.08); }
      x.connect(fl); x=fl; nodes.push(fl); }
    const a=G(ac,0),A=o.a||.005,dec=o.dec||.3,sus=o.sus==null?.7:o.sus,r=o.r||.1,pk=v*(o.amp||.3);
    a.gain.setValueAtTime(0,t); a.gain.linearRampToValueAtTime(pk,t+A); a.gain.setTargetAtTime(pk*sus,t+A,dec);
    const end=sus>0?t+Math.max(d,A+.02):t+Math.min(Math.max(d+(o.ring||0),A+.02),A+dec*5);
    a.gain.setTargetAtTime(0,end,r/4); x.connect(a); a.connect(dst); nodes.push(a);
    if(o.trem&&d>(o.tmin||.2)){ const l=O(ac,'triangle',o.trem),tg=G(ac,0); tg.gain.setValueAtTime(pk*(o.td||.45),t+.06); tg.gain.setTargetAtTime(0,end,r/4); chain(l,tg,a.gain); srcs.push(l); nodes.push(tg); }
    for(const s of srcs) if(s.start&&s!==srcs.find(q=>q.buffer)) s.start(t);
    V(P,srcs,nodes,end+r); },
  /* 2-op FM electric piano: modulation index decays fast -> bark on attack, round tail */
  ep(P,dst,t,f,d,v,o){ const ac=P.ac,c=O(ac,'sine',f),m=O(ac,'sine',f*(o.ratio||1)),mg=G(ac,0),a=G(ac,0),t2=O(ac,'sine',f*(o.tine||14)),tg=G(ac,0);
    mg.gain.setValueAtTime(f*(o.idx||1.8)*v,t); mg.gain.setTargetAtTime(f*.18,t,o.itau||.22);
    chain(m,mg,c.frequency); chain(c,a,dst); chain(t2,tg,dst); perc(tg,t,v*(o.tg||.04),.12);
    const pk=v*(o.amp||.32),end=t+Math.max(d,.05),r=o.r||.25;
    a.gain.setValueAtTime(0,t); a.gain.linearRampToValueAtTime(pk,t+.004); a.gain.setTargetAtTime(pk*.35,t+.004,o.dec||.7); a.gain.setTargetAtTime(0,end,r/4);
    c.start(t); m.start(t); t2.start(t); V(P,[c,m,t2],[mg,a,tg],end+r); },
  /* FM bell / vibraphone / chime */
  bell(P,dst,t,f,d,v,o){ const ac=P.ac,c=O(ac,'sine',f),m=O(ac,'sine',f*(o.ratio||3.5)),mg=G(ac,0),a=G(ac,0),dec=o.dec||1.2;
    mg.gain.setValueAtTime(f*(o.idx||2.5)*v,t); mg.gain.setTargetAtTime(f*(o.idx2||.2),t,o.itau||.12);
    chain(m,mg,c.frequency); chain(c,a,dst); perc(a,t,v*(o.amp||.3),dec);
    if(o.trem){ const l=O(ac,'sine',o.trem),tg=G(ac,v*(o.amp||.3)*.3); chain(l,tg,a.gain); l.start(t); c.start(t); m.start(t); V(P,[c,m,l],[mg,a,tg],t+dec); return; }
    c.start(t); m.start(t); V(P,[c,m],[mg,a],t+dec); }
};

/* ---------- drums. Signature: (P, dst, t, vel, opts) ---------- */
function nzHit(P,dst,t,type,f,q,peak,dec,extra){ const ac=P.ac,n=NZ(P),fl=F(ac,type,f,q),g=G(ac,0); perc(g,t,peak,dec); chain(n,fl,g,dst); startNoise(P,n,t); return [n,fl,g]; }
const DR={
  kick(P,d,t,v,o){ const ac=P.ac,f=o.f||50,b=O(ac,'sine',f),g=G(ac,0),c=O(ac,'triangle',1400),cg=G(ac,0),dec=o.dec||.45,nodes=[g,cg];
    b.frequency.setValueAtTime(f*(o.sweep||3.6),t); b.frequency.exponentialRampToValueAtTime(f,t+(o.st||.055));
    c.frequency.setValueAtTime(1600,t); c.frequency.exponentialRampToValueAtTime(110,t+.022);
    perc(g,t,v,dec); perc(cg,t,v*(o.click==null?.4:o.click),.03);
    if(o.drive){ const sh=ac.createWaveShaper(); sh.curve=curve(P.s,o.drive); chain(b,sh,g); nodes.push(sh); } else b.connect(g);
    g.connect(d); chain(c,cg,d); b.start(t); c.start(t); V(P,[b,c],nodes,t+dec); },
  snare(P,d,t,v,o){ const ac=P.ac,[n,fl,g]=nzHit(P,d,t,'bandpass',o.f||1900,.7,v*.9,o.dec||.2),tn=O(ac,'triangle',o.tone||200),tg=G(ac,0);
    if(o.gate){ g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.003); g.gain.setTargetAtTime(v*.55,t+.003,.05); g.gain.setValueAtTime(v*.5,t+o.gate); g.gain.linearRampToValueAtTime(0,t+o.gate+.012); }
    tn.frequency.setValueAtTime((o.tone||200)*1.3,t); tn.frequency.exponentialRampToValueAtTime(o.tone||200,t+.03); perc(tg,t,v*.55,.1); chain(tn,tg,d);
    tn.start(t); V(P,[n,tn],[fl,g,tg],t+Math.max(o.dec||.2,(o.gate||0)+.02)); },
  clap(P,d,t,v,o){ const ac=P.ac,n=NZ(P),fl=F(ac,'bandpass',o.f||1200,1.1),g=G(ac,0);
    g.gain.setValueAtTime(0,t); for(let i=0;i<3;i++){ g.gain.linearRampToValueAtTime(v,t+i*.011+.001); g.gain.linearRampToValueAtTime(v*.15,t+i*.011+.009); }
    g.gain.linearRampToValueAtTime(v*.8,t+.035); g.gain.setTargetAtTime(0,t+.036,(o.dec||.16)/5); chain(n,fl,g,d); startNoise(P,n,t); V(P,[n],[fl,g],t+.04+(o.dec||.16)); },
  hat(P,d,t,v,o){ const [n,fl,g]=nzHit(P,d,t,'highpass',o.f||7500,.7,v*.7,o.dec||.05); V(P,[n],[fl,g],t+(o.dec||.05)); },
  metal(P,d,t,v,o){ const ac=P.ac,a=O(ac,'square',o.f||3150),b=O(ac,'square',(o.f||3150)*1.52),hp=F(ac,'highpass',6500,1.2),g=G(ac,0),dec=o.dec||.07;
    const [n,fl,ng]=nzHit(P,d,t,'highpass',8000,.7,v*.4,dec); a.connect(hp); b.connect(hp); chain(hp,g,d); perc(g,t,v*.35,dec);
    a.start(t); b.start(t); V(P,[a,b,n],[hp,g,fl,ng],t+dec); },
  shaker(P,d,t,v,o){ const ac=P.ac,n=NZ(P),fl=F(ac,'bandpass',o.f||6500,.9),g=G(ac,0); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v*.5,t+.018); g.gain.setTargetAtTime(0,t+.02,.02); chain(n,fl,g,d); startNoise(P,n,t); V(P,[n],[fl,g],t+.12); },
  brush(P,d,t,v,o){ const ac=P.ac,n=NZ(P),fl=F(ac,'bandpass',o.f||2800,.6),g=G(ac,0),dec=o.dec||.22; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v*.6,t+(o.a||.012)); g.gain.setTargetAtTime(0,t+(o.a||.012),dec/5); chain(n,fl,g,d); startNoise(P,n,t); V(P,[n],[fl,g],t+dec+.03); },
  tamb(P,d,t,v,o){ const ac=P.ac,n=NZ(P),hp=F(ac,'highpass',5200,.7),bp=F(ac,'peaking',9000,2),g=G(ac,0); bp.gain.value=8;
    g.gain.setValueAtTime(0,t); for(let i=0;i<3;i++){ g.gain.linearRampToValueAtTime(v*(.6-i*.15),t+i*.014+.002); g.gain.setTargetAtTime(v*.08,t+i*.014+.003,.006); } g.gain.setTargetAtTime(0,t+.045,(o.dec||.12)/5);
    chain(n,hp,bp,g,d); startNoise(P,n,t); V(P,[n],[hp,bp,g],t+.05+(o.dec||.12)); },
  rim(P,d,t,v,o){ const ac=P.ac,a=O(ac,'triangle',o.f||1700),g=G(ac,0); perc(g,t,v*.5,.035); chain(a,g,d); const [n,fl,ng]=nzHit(P,d,t,'bandpass',3200,1.5,v*.4,.02); a.start(t); V(P,[a,n],[g,fl,ng],t+.05); },
  wood(P,d,t,v,o){ const ac=P.ac,f=o.f||1000,a=O(ac,'sine',f),b=O(ac,'sine',f*2.76),g=G(ac,0),bg=G(ac,.25); perc(g,t,v*.55,o.dec||.08); a.connect(g); chain(b,bg,g); g.connect(d); a.start(t); b.start(t); V(P,[a,b],[g,bg],t+(o.dec||.08)); },
  tom(P,d,t,v,o){ const ac=P.ac,f=o.f||150,a=O(ac,'sine',f),h=O(ac,'triangle',f*1.6),g=G(ac,0),hg=G(ac,.25),dec=o.dec||.35;
    a.frequency.setValueAtTime(f*(o.sweep||1.5),t); a.frequency.exponentialRampToValueAtTime(f,t+(o.st||.06)); h.frequency.setValueAtTime(f*2.2,t); h.frequency.exponentialRampToValueAtTime(f*1.6,t+.05);
    perc(g,t,v*.85,dec); a.connect(g); chain(h,hg,g); g.connect(d); const nn=o.nz?nzHit(P,d,t,'bandpass',o.nzf||f*6,.8,v*o.nz,.05):null;
    a.start(t); h.start(t); V(P,nn?[a,h,nn[0]]:[a,h],nn?[g,hg,nn[1],nn[2]]:[g,hg],t+dec); },
  crash(P,d,t,v,o){ const ac=P.ac,dec=o.dec||1.6,[n,fl,g]=nzHit(P,d,t,'highpass',o.f||4800,.6,v*.5,dec),pk=F(ac,'peaking',7500,1.5); pk.gain.value=6; fl.disconnect(); chain(fl,pk,g); V(P,[n],[fl,pk,g],t+dec); },
  gong(P,d,t,v,o){ const ac=P.ac,f=o.f||78,c=O(ac,'sine',f),m=O(ac,'sine',f*1.414),mg=G(ac,0),a=G(ac,0),dec=o.dec||3.5;
    mg.gain.setValueAtTime(f*.4,t); mg.gain.linearRampToValueAtTime(f*2.2,t+.6); mg.gain.setTargetAtTime(f*.3,t+.6,.8);
    a.gain.setValueAtTime(0,t); a.gain.linearRampToValueAtTime(v*.5,t+.02); a.gain.setTargetAtTime(0,t+.05,dec/5); chain(m,mg,c.frequency); chain(c,a,d); c.start(t); m.start(t); V(P,[c,m],[mg,a],t+dec); },
  whistle(P,d,t,v,o){ const ac=P.ac,f=o.f||2650,a=O(ac,'sine',f),l=O(ac,'square',o.trill||22),lg=G(ac,f*.045),g=G(ac,0),len=v>.85?.32:.09;
    chain(l,lg,a.frequency); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v*.22,t+.01); g.gain.setValueAtTime(v*.22,t+len); g.gain.linearRampToValueAtTime(0,t+len+.02);
    const [n,fl,ng]=nzHit(P,d,t,'bandpass',f,2,v*.06,len); chain(a,g,d); a.start(t); l.start(t); V(P,[a,l,n],[lg,g,fl,ng],t+len+.03); },
  stomp(P,d,t,v,o){ DR.kick(P,d,t,v,{f:46,sweep:2.2,dec:.32,click:.15}); const [n,fl,g]=nzHit(P,d,t,'lowpass',420,.8,v*.7,.12); V(P,[n],[fl,g],t+.14); },
  cowbell(P,d,t,v,o){ const ac=P.ac,a=O(ac,'square',560),b=O(ac,'square',845),bp=F(ac,'bandpass',800,2.5),g=G(ac,0); a.connect(bp); b.connect(bp); chain(bp,g,d); perc(g,t,v*.4,o.dec||.22); a.start(t); b.start(t); V(P,[a,b],[bp,g],t+(o.dec||.22)); }
};

/* ---------- pattern language ----------
   Melodic part: whitespace tokens, '|' is a bar line (ignored). token = head[:steps]
     head: note 'C#5' | stack 'E4+G#4' | '.' rest | 'x' whole chord | chord tone '2', "0'" ('=+oct) |
           'r' bass root of chord, 'r7' root+7 semitones, 'r-2' ... ; suffix '!' accent, '_' soft.
     'x' notes are re-struck automatically where the chord changes under them.
   Drum part: one char per step. X accent, x normal, g ghost, '.' rest; spaces and '|' ignored.
   Chords per section: bars split by '|', a bar with two names splits evenly.
   Chord dictionary entries: 'G1|D4 G4 Bb4' = bass root | voicing.
   Section keys: bars, ch, p (parts), first / last (override the first / last bar), from (copy a
   section), mute (drop parts). A part key 'lead@1' plays only on odd loops, '@0' even loops. */
const WARN=[];
const toks=s=>s.replace(/\|/g,' ').trim().split(/\s+/).filter(Boolean);
function parseMel(s){ let at=0; const ev=[]; for(const tk of toks(s)){ const i=tk.lastIndexOf(':'),h=i>0?tk.slice(0,i):tk,len=i>0?+tk.slice(i+1):1; if(!(len>0)) throw new Error('MUSIC: bad token '+tk); if(h!=='.') ev.push({at,len,h}); at+=len; } return {ev,len:at}; }
const DV={X:1,x:.72,g:.38,o:.85};
function parseDr(s){ return s.replace(/[\s|]/g,'').split('').map(c=>DV[c]||0); }
function chordDict(spec){ const D={}; for(const [k,v] of Object.entries(spec.chords||{})){ const [b,n]=v.split('|'); D[k]={bass:midi(b.trim()),notes:toks(n).map(midi)}; } return D; }
function build(spec,key){ if(spec._b) return spec._b; const bs=spec.bar,CD=chordDict(spec),secs={};
  const W=m=>WARN.push(key+': '+m);
  for(const name of Object.keys(spec.sec)){ const s0=spec.sec[name],b=s0.from?spec.sec[s0.from]:{};
    const bars=s0.bars||b.bars,steps=bars*bs,chs=s0.ch||b.ch||'';
    const p=Object.assign({},b.p,s0.p),first=Object.assign({},b.first,s0.first),last=Object.assign({},b.last,s0.last);
    for(const m of s0.mute||[]){ delete p[m]; delete first[m]; delete last[m]; }
    /* chord per step */
    const cAt=new Array(steps).fill(null); const cb=chs?chs.split('|').map(x=>toks(x)):[];
    if(chs&&cb.length!==bars) W(`section ${name}: ${cb.length} chord bars for ${bars} bars`);
    cb.forEach((names,bi)=>{ names.forEach((n,j)=>{ if(!CD[n]) W(`unknown chord ${n}`); const a=bi*bs+Math.round(j*bs/names.length),e=bi*bs+Math.round((j+1)*bs/names.length); for(let q=a;q<e&&q<steps;q++) cAt[q]=CD[n]; }); });
    for(let q=1;q<steps;q++) if(!cAt[q]) cAt[q]=cAt[q-1];
    const ev=Array.from({length:steps},()=>[]);
    const resolve=(h,at)=>{ let v=1; if(h.endsWith('!')){ v=1.2; h=h.slice(0,-1); } else if(h.endsWith('_')){ v=.6; h=h.slice(0,-1); }
      const c=cAt[at]; if(h==='x') return {n:c?c.notes.slice():[],v,chord:true};
      if(/^\d/.test(h)){ if(!c) return {n:[],v}; const idx=parseInt(h,10),oc=(h.match(/'/g)||[]).length*12,L=c.notes.length; return {n:[c.notes[idx%L]+12*Math.floor(idx/L)+oc],v}; }
      if(h[0]==='r'){ if(!c) return {n:[],v}; return {n:[c.bass+(h.length>1?+h.slice(1):0)],v}; }
      return {n:h.split('+').map(midi),v}; };
    for(const pk of new Set([...Object.keys(p),...Object.keys(first),...Object.keys(last)])){
      const [pn,parS]=pk.split('@'),par=parS==null?-1:+parS,ps=spec.parts[pn]; if(!ps){ W('no part '+pn); continue; }
      if(ps.d){ let arr=p[pk]?parseDr(p[pk]):[]; if(arr.length&&(bs%arr.length)&&(arr.length%bs)) W(`${name}.${pk}: drum length ${arr.length} vs bar ${bs}`);
        const full=new Array(steps).fill(0); if(arr.length) for(let q=0;q<steps;q++) full[q]=arr[q%arr.length];
        if(first[pk]){ const f=parseDr(first[pk]); for(let q=0;q<bs;q++) full[q]=f[q]||0; }
        if(last[pk]){ const f=parseDr(last[pk]); if(f.length>bs&&f.length%bs===0){ const o=steps-f.length; for(let q=0;q<f.length;q++) full[o+q]=f[q]; } else for(let q=0;q<bs;q++) full[steps-bs+q]=f[q]||0; }
        full.forEach((v,q)=>{ if(v) ev[q].push({pn,par,v}); }); continue; }
      const put=(m,off,lim)=>{ for(let o=off;o<lim;o+=m.len){ for(const e of m.ev){ const at=o+e.at; if(at>=lim) break;
          let len=Math.min(e.len,steps-at); const r=resolve(e.h,at);
          if(r.chord){ let a=at; while(len>0){ let k=a+1; while(k<a+len&&cAt[k]===cAt[a]) k++; const seg=k-a; ev[a].push({pn,par,n:cAt[a]?cAt[a].notes:[],len:seg,v:r.v}); len-=seg; a=k; } }
          else ev[at].push({pn,par,n:r.n,len,v:r.v}); } if(m.len<=0) break; } };
      const clear=(a,e)=>{ for(let q=a;q<e;q++) ev[q]=ev[q].filter(x=>x.pn!==pn||x.par!==par); };
      if(p[pk]){ const m=parseMel(p[pk]); if((m.len%bs)&&(bs%m.len)) W(`${name}.${pk}: ${m.len} steps, bar is ${bs}`); else if(m.len>steps) W(`${name}.${pk}: ${m.len} steps > section ${steps}`); else if(m.len>bs&&steps%m.len) W(`${name}.${pk}: ${m.len} steps does not divide section ${steps}`); put(m,0,steps); }
      if(first[pk]){ const m=parseMel(first[pk]); clear(0,m.len); put(m,0,m.len); }
      if(last[pk]){ const m=parseMel(last[pk]); if(m.len%bs) W(`${name}.last.${pk}: ${m.len} steps`); clear(steps-m.len,steps); put(m,steps-m.len,steps); } }
    secs[name]={steps,ev}; }
  let loopSteps=0; for(const n of spec.loop){ if(!secs[n]) W('loop has unknown section '+n); else loopSteps+=secs[n].steps; }
  spec._b={secs,loopSec:loopSteps*60/spec.bpm/spec.spb}; return spec._b; }

/* ---------- players ---------- */
function newPlayer(s,kind,key,fade,lvl){ const ac=s.ac,Lr=s.L[kind],now=ac.currentTime;
  const P={ac,s,kind,key,live:0,nodes:0,keep:[],keepSrc:[],cont:[],ends:[],ch:{},lastF:{},lastT:{},ev:[],later:[],nt:now+.06,stopAt:Infinity,dead:false};
  P.out=G(ac,0); const lv=G(ac,lvl==null?1:lvl); chain(P.out,lv,Lr.inp); P.keep.push(lv); P.fades=[P.out.gain];
  if(Lr.rev){ P.rv=G(ac,0); const rl=G(ac,lvl==null?1:lvl); chain(P.rv,rl,Lr.rev); P.keep.push(rl); P.fades.push(P.rv.gain); }
  for(const g of P.fades){ g.setValueAtTime(0,now); g.linearRampToValueAtTime(1,now+Math.max(.01,fade)); }
  return P; }
function musicPlayer(s,key,fade){ const spec=TRACKS[key]; if(!spec) return null; const P=newPlayer(s,'music',key,fade,spec.vol||.5);
  build(spec,key); P.spec=spec; P.parts=spec.parts;
  P.sd=60/spec.bpm/spec.spb; P.seq=spec.intro&&spec.intro.length?spec.intro:spec.loop; P.si=0; P.st=0; P.loop=0;
  if(spec.echo) echoBus(P,spec.echo[0]*(spec.echo[2]?1:60/spec.bpm),spec.echo[1],spec.echo[3]);
  return P; }
function stepMusic(P,t){ const sp=P.spec,sec=P.spec._b.secs[P.seq[P.si]],evs=sec.ev[P.st];
  if(P.s.offline&&P.ends.length){ const k=P.ends.length; P.ends=P.ends.filter(e=>e>t); P.live-=k-P.ends.length; }
  if(evs.length){ const sd=P.sd/rate(P,t),pf=pitch(P,t);
    for(const e of evs){ if(e.par>=0&&e.par!==(P.loop&1)) continue; const ps=sp.parts[e.pn],dst=chan(P,e.pn);
      const vel=e.v*(ps.v||.8)*(1+rnd(-.07,.07));
      if(ps.d){ DR[ps.d](P,dst,t,Math.min(1.2,vel),ps.o||{}); continue; }
      if(P.live>=CAP&&!ps.pri) continue;
      const fn=INST[ps.i||'sv'],o=ps.o||{},tt=t+(ps.hum==null?.004:ps.hum)*Math.random(),dur=e.len*sd*(ps.leg||1)-(ps.gap||0);
      (ps.dbl?e.n.concat(e.n.map(m=>m+ps.dbl)):e.n).forEach((m,i)=>fn(P,dst,tt+(ps.strum||0)*i,hz(m+(ps.tr||0))*pf,dur,vel,o,e.pn)); } }
  if(++P.st>=sec.steps){ P.st=0; if(++P.si>=P.seq.length){ P.si=0; P.loop++; P.seq=sp.loop; } } }
function tickPlayer(P,hor){ if(P.dead) return;
  if(P.spec) while(P.nt<hor&&P.nt<P.stopAt){ stepMusic(P,P.nt); P.nt+=P.sd/rate(P,P.nt); }
  if(P.later.length){ const due=P.later.filter(x=>x.t<hor); if(due.length){ P.later=P.later.filter(x=>x.t>=hor); for(const x of due) if(x.t<P.stopAt+.05) try{ x.fn(P,Math.max(x.t,P.ac.currentTime)); }catch(err){ console.warn('MUSIC later',err); } } }
  for(const e of P.ev) while(e.next<hor&&e.next<P.stopAt){ try{ e.fn(P,e.next); }catch(err){ console.warn('MUSIC event',err); } e.next+=rnd(e.min,e.max)/rate(P,e.next); } }
/* random one-shot generator for ambience: first fire `first` seconds in, then every min..max s */
function every(P,first,min,max,fn){ P.ev.push({next:P.ac.currentTime+first,min,max,fn}); }

/* =====================================================================
   TRACKS. One per car. bpm, spb = steps per beat, bar = steps per bar.
   Melodies, harmony and bass lines are written out note by note.
   ===================================================================== */
const TRACKS={};
/* shared timbres */
const T_FLUTE={w:[['triangle',1,0,1],['sine',2,0,.16]],a:.045,dec:.5,sus:.82,r:.28,vib:16,vdel:.28,cut:6,amp:.34};
const T_ACC={w:[['sawtooth',1,-9,.45],['sawtooth',1,9,.45],['square',1,0,.22]],cut:4,q:1,a:.03,dec:.5,sus:.85,r:.1,trem:5.5,td:.1,tmin:.4,amp:.12};

/* ---- AQUARIUM: blue velvet lounge, D major, 80 bpm. FM e-piano 9ths through chorus, flute lead,
   bubble arpeggio through a dotted-8th echo, brushes. A = hook (question / answer), B = lift, T = turnaround. */
TRACKS.aquarium={bpm:80,spb:4,bar:16,vol:0.15,echo:[.75,.34,0,2400],
  chords:{'Dmaj9':'D2|F#3 A3 C#4 E4','Bm9':'B1|F#3 A3 C#4 D4','Gmaj9':'G2|F#3 A3 B3 D4','A7sus':'A1|G3 B3 D4 E4','A7':'A1|G3 B3 C#4 E4',
    'Em9':'E2|G3 B3 D4 F#4','A7b9':'A1|G3 Bb3 C#4 E4','F#m7':'F#2|F#3 A3 C#4 E4','F#7':'F#2|F#3 A#3 C#4 E4','Bm7':'B1|F#3 A3 B3 D4',
    'E9':'E2|G#3 B3 D4 F#4','D/F#':'F#2|F#3 A3 C#4 E4','Em7':'E2|G3 B3 D4 E4'},
  parts:{ ep:{i:'ep',g:.5,rv:.35,chorus:.65,v:.62,o:{idx:1.5,dec:.9,r:.35}},
    lead:{i:'sv',g:.46,rv:.42,dl:.26,v:.8,o:T_FLUTE},
    arp:{i:'bell',g:.15,rv:.5,dl:.5,pan:.3,v:.55,hum:0,o:{ratio:2,idx:1.1,dec:.55,amp:.25}},
    bass:{i:'sv',g:.62,rv:.04,v:.85,o:{w:[['sine',1,0,1],['triangle',2,0,.28]],a:.008,dec:.6,sus:.55,r:.08,amp:.5}},
    kick:{d:'kick',g:.5,o:{f:56,dec:.32,click:.15}}, brush:{d:'brush',g:.36,rv:.25,o:{dec:.26}},
    shk:{d:'shaker',g:.2,pan:-.3}, rim:{d:'rim',g:.22,rv:.35,pan:.2} },
  sec:{
    I:{bars:2,ch:'Dmaj9 | A7sus',p:{ep:'x:16',arp:".:2 0'' 1'' 2'' 3'' .:2 3'' 2'' .:2 1'' 2'' .:2",bass:'.:16 | .:12 A1:4'},last:{shk:'x.g.x.g.x.g.xgxg'}},
    A:{bars:8,ch:'Dmaj9 | Bm9 | Gmaj9 | A7sus A7 | Dmaj9 | Bm9 | Em9 | A7b9',
      p:{lead:'.:4 F#5:2 E5:2 C#5:6 A4:2 | B4:6 C#5:2 D5:4 E5:4 | F#5:6 E5:2 D5:4 B4:4 | E5:12 .:4 | .:4 F#5:2 E5:2 C#5:6 A4:2 | B4:6 C#5:2 D5:4 F#5:4 | G5:6 F#5:2 E5:4 D5:2 B4:2 | C#5:6 D5:2 E5:4 .:4',
        ep:'x:6 x:10',
        arp:".:2 0'' 1'' 2'' 3'' .:2 3'' 2'' .:2 1'' 2'' .:2",
        bass:'D2:6 A2:2 .:2 D3:2 C#3:4 | B1:6 F#2:2 .:2 B2:2 A2:4 | G2:6 D3:2 .:2 G2:2 F#2:4 | A1:6 E2:2 A2:4 G2:4 | D2:6 A2:2 .:2 D3:2 C#3:4 | B1:6 F#2:2 .:2 B2:2 A2:4 | E2:6 B2:2 .:2 E2:2 G2:4 | A1:6 E2:2 A2:4 A1:4',
        kick:'X.........x.....',brush:'....x.......x...',shk:'x.g.x.g.x.g.x.g.',rim:'.......x........'},
      last:{brush:'....x...x.xgx.xx',kick:'X.........x...x.'}},
    B:{bars:8,ch:'Gmaj9 | F#m7 | Em9 | D/F# | Gmaj9 | F#7 | Bm7 E9 | Em7 A7',
      p:{lead:'.:2 B4:2 D5:2 F#5:2 A5:6 F#5:2 | E5:6 F#5:2 C#5:8 | .:2 G4:2 B4:2 D5:2 F#5:6 E5:2 | D5:4 C#5:4 A4:8 | .:2 B4:2 D5:2 F#5:2 B5:6 A5:2 | F#5:6 E5:2 C#5:4 A#4:4 | D5:6 C#5:2 B4:4 G#4:4 | A4:8 B4:4 C#5:4',
        ep:'x:6 x:6 x:4',
        'arp@1':".:2 0'' 1'' 2'' 3'' .:2 3'' 2'' .:2 1'' 2'' .:2",
        bass:'G2:6 D3:2 .:2 G2:2 A2:4 | F#2:6 C#3:2 .:2 F#2:2 E2:4 | E2:6 B2:2 .:2 E2:2 C#2:4 | F#2:6 A2:2 .:2 D3:2 F#2:4 | G2:6 D3:2 .:2 B2:2 G2:4 | F#2:6 C#3:2 .:2 A#2:2 F#2:4 | B1:6 F#2:2 E2:6 B1:2 | E2:6 B1:2 A1:6 C#2:2',
        kick:'X.........x..x..',brush:'....x.......x...',shk:'x.gxx.g.x.gxx.g.',rim:'...x.......x....'},
      last:{brush:'....x...xgxgx.xx'}},
    T:{bars:2,ch:'Em9 | A7sus A7',
      p:{lead:'G5:6 F#5:2 E5:8 | .:12 A4:2 C#5:2',ep:'x:6 x:10',arp:".:2 0'' 1'' 2'' 3'' .:2 3'' 2'' .:2 1'' 2'' .:2",
        bass:'E2:6 B2:2 .:2 E2:2 F#2:4 | A1:6 E2:2 G2:4 A2:4',kick:'X.........x.....',brush:'....x.......x...',shk:'x.g.x.g.x.g.x.g.'},
      last:{brush:'....x..xx.xxxxxX'}}},
  intro:['I'],loop:['A','B','T']};

/* ---- CAPSULE: Tokyo city pop at midnight, A minor, 112 bpm. Royal-road changes (IVmaj7 V iii vi),
   octave-jumping synth bass, gated snare, bright FM keys, a lonely gliding lead, orchestra hits in the turnaround. */
TRACKS.capsule={bpm:112,spb:4,bar:16,vol:0.151,echo:[.75,.22,0,2600],
  chords:{'Fmaj9':'F2|A3 C4 E4 G4','G6':'G2|B3 D4 E4 G4','Em9':'E2|G3 B3 D4 F#4','Am9':'A2|G3 B3 C4 E4','Dm9':'D2|F3 A3 C4 E4','E7#9':'E2|G#3 D4 G4'},
  parts:{ lead:{i:'sv',g:.42,rv:.35,dl:.3,v:.82,o:{w:[['square',1,0,.55],['sawtooth',1,7,.5]],cut:5,env:2,ftau:.15,q:2,a:.012,dec:.5,sus:.75,r:.12,vib:18,vdel:.22,glide:.05,amp:.25}},
    keys:{i:'ep',g:.42,rv:.25,chorus:.9,v:.66,o:{idx:2.6,dec:.45,tg:.07,r:.15}},
    pad:{i:'sv',g:.32,rv:.45,v:.7,o:{w:[['sawtooth',1,-8,.5],['sawtooth',1,8,.5]],cut:2.5,a:.25,dec:.5,sus:.8,r:.4,amp:.15}},
    bass:{i:'sv',g:.62,v:.85,pri:1,o:{w:[['sawtooth',1,0,.7],['square',1,0,.45]],cut:2,env:9,ftau:.06,q:5,a:.003,dec:.18,sus:.35,r:.05,amp:.4}},
    orch:{i:'sv',g:.38,rv:.55,v:.9,o:{w:[['sawtooth',1,-10,.5],['sawtooth',1,10,.5],['square',.5,0,.4]],nz:.6,nzf:2,nzd:.12,cut:3,env:5,ftau:.12,a:.003,dec:.25,sus:0,r:.15,amp:.22}},
    kick:{d:'kick',g:.82,o:{f:52,dec:.4}}, snare:{d:'snare',g:.55,rv:.6,o:{gate:.17,f:1700,tone:190}},
    hat:{d:'hat',g:.2,pan:.25}, ohat:{d:'hat',g:.18,pan:.25,o:{dec:.28}}, tom:{d:'tom',g:.5,rv:.3,o:{f:120}}, tomh:{d:'tom',g:.45,rv:.3,o:{f:175}} },
  sec:{
    I:{bars:2,ch:'Am9 | E7#9',p:{bass:'A2:3 A2:1 A3:2 A2:2 .:2 G2:2 E2:2 G2:2 | E2:3 E2:1 E3:2 E2:2 .:2 E2:2 G#2:2 B2:2',kick:'X.....x...X.....',hat:'xgxgxgxgxgxgxgxg'},
      first:{orch:'A3+E4+A4+C5:4 .:12'},last:{snare:'....X.......X.XX',tomh:'........x.x.....'}},
    A:{bars:8,ch:'Fmaj9 | G6 | Em9 | Am9 | Fmaj9 | G6 | Em9 | Dm9 E7#9',
      p:{lead:'C5:2 E5:2 A5:3 G5:3 E5:2 G5:4 | .:4 D5:2 E5:2 G5:3 E5:3 D5:2 | B4:2 D5:2 G5:3 F#5:3 D5:2 E5:4 | E5:10 .:2 C5:2 D5:2 | C5:2 E5:2 A5:3 G5:3 E5:2 G5:4 | .:4 D5:2 E5:2 G5:3 A5:3 B5:2 | C6:3 B5:3 G5:2 E5:4 D5:4 | F5:6 E5:2 D5:4 B4:2 G#4:2',
        keys:'x:2 .:4 x:2 .:2 x:2 .:2 x:2',
        bass:'F2:3 F2:1 F3:2 F2:2 .:2 F2:2 E3:2 C3:2 | G2:3 G2:1 G3:2 G2:2 .:2 G2:2 D3:2 B2:2 | E2:3 E2:1 E3:2 E2:2 .:2 E2:2 B2:2 D3:2 | A2:3 A2:1 A3:2 A2:2 .:2 G2:2 E2:2 G2:2 | F2:3 F2:1 F3:2 F2:2 .:2 F2:2 E3:2 C3:2 | G2:3 G2:1 G3:2 G2:2 .:2 G2:2 D3:2 B2:2 | E2:3 E2:1 E3:2 E2:2 .:2 E2:2 B2:2 D3:2 | D2:3 D2:1 D3:2 D2:2 E2:3 E2:1 E3:2 G#2:2',
        kick:'X.....x...X..x..',snare:'....X.......X...',hat:'xgxgxgxgxgxgxgxg',ohat:'..............x.'},
      last:{snare:'....X.......X...',tom:'............x.x.',tomh:'..........x.x...'}},
    B:{bars:8,ch:'Dm9 | Em9 | Fmaj9 | G6 | Dm9 | Em9 | Fmaj9 | E7#9',
      p:{lead:'A4:4 C5:4 E5:6 F5:2 | G5:6 E5:2 D5:4 B4:4 | C5:4 E5:4 A5:6 G5:2 | G5:6 E5:2 D5:8 | A4:4 C5:4 E5:6 F5:2 | G5:4 A5:2 B5:2 D6:4 B5:4 | C6:6 B5:2 A5:4 G5:4 | B5:4 A5:2 G#5:6 E5:4',
        keys:'x:2 .:6 x:2 .:2 x:4', pad:'x:16',
        bass:'D2:3 D2:1 D3:2 D2:2 .:2 D2:2 A2:2 C3:2 | E2:3 E2:1 E3:2 E2:2 .:2 E2:2 B2:2 D3:2 | F2:3 F2:1 F3:2 F2:2 .:2 F2:2 E3:2 C3:2 | G2:3 G2:1 G3:2 G2:2 .:2 G2:2 D3:2 B2:2 | D2:3 D2:1 D3:2 D2:2 .:2 D2:2 A2:2 C3:2 | E2:3 E2:1 E3:2 E2:2 .:2 E2:2 B2:2 D3:2 | F2:3 F2:1 F3:2 F2:2 .:2 F2:2 E3:2 C3:2 | E2:3 E2:1 E3:2 E2:2 .:2 E2:2 G#2:2 B2:2',
        kick:'X.....x.X.....x.',snare:'....X.......X...',hat:'xgxgxgxgxgxgxgxg',ohat:'..x...x...x...x.'},
      last:{snare:'....X...x.x.XXXX',ohat:'..x...x.........'}},
    T:{bars:2,ch:'Am9 | E7#9',
      p:{lead:'A5:12 .:4 | .:16',keys:'x:2 .:4 x:2 .:2 x:2 .:2 x:2',bass:'A2:3 A2:1 A3:2 A2:2 .:2 G2:2 E2:2 G2:2 | E2:3 .:3 E2:3 .:7',
        kick:'X.....x...X.....',hat:'xgxgxgxgxgxgxgxg'},
      first:{orch:'A3+E4+A4+C5:3 .:13'},last:{orch:'G#3+D4+G4+B4:3 .:3 G#3+D4+G4+B4:3 .:7',kick:'X.....X.........',snare:'........XxXxXXXX',hat:'................'}}},
  intro:['I'],loop:['A','B','T']};

/* ---- DIM SUM: Hong Kong triad kitchen, D minor pentatonic, 96 bpm. Plucked zither leads A,
   bowed erhu sings B (and shadows A on odd loops), low strings hold the tension, taiko, woodblock clock, gong. */
const T_ZITHER={w:[['sawtooth',1,0,.6],['triangle',2,0,.4]],cut:3,env:5,ftau:.06,q:1.5,a:.002,dec:.35,sus:0,ring:.6,r:.15,nz:.25,nzf:4,nzd:.02,amp:.36};
TRACKS.dimsum={bpm:96,spb:4,bar:16,vol:0.162,echo:[.5,.28,0,2200],
  chords:{'Dm':'D2|D3 F3 A3','Bb':'Bb1|D3 F3 Bb3','C':'C2|E3 G3 C4','Gm':'G1|D3 G3 Bb3','A':'A1|C#3 E3 A3','A7':'A1|C#3 G3 A3'},
  parts:{ zither:{i:'sv',g:.46,rv:.45,dl:.2,pan:-.15,v:.85,o:T_ZITHER},
    zarp:{i:'sv',g:.28,rv:.45,dl:.3,pan:-.3,v:.7,hum:0,o:T_ZITHER},
    erhu:{i:'sv',g:.44,rv:.45,pan:.15,v:.8,o:{w:[['sawtooth',1,0,1]],ft:'bandpass',cut:2.2,q:.9,a:.09,dec:.4,sus:.85,r:.18,vib:32,vdel:.16,slide:.93,slideT:.06,glide:.09,amp:.4}},
    pad:{i:'sv',g:.3,rv:.4,v:.7,o:{w:[['sawtooth',1,-6,.5],['sawtooth',1,6,.5]],cut:2.2,a:.4,dec:.6,sus:.85,r:.6,amp:.14}},
    bass:{i:'sv',g:.6,v:.85,pri:1,o:{w:[['triangle',1,0,1],['sawtooth',1,0,.3]],cut:4,env:3,ftau:.08,a:.004,dec:.25,sus:.3,r:.08,amp:.48}},
    taiko:{d:'tom',g:.85,rv:.35,o:{f:64,sweep:1.6,dec:.8,nz:.5,nzf:350}}, shime:{d:'tom',g:.32,rv:.2,pan:.2,o:{f:330,dec:.12,nz:.3,nzf:2500}},
    wood:{d:'wood',g:.32,pan:.35,o:{f:1150}}, gong:{d:'gong',g:.5,rv:.6} },
  sec:{
    I:{bars:2,ch:'Dm | Dm',p:{pad:'x:32',taiko:'X.......X..x.X..'},first:{gong:'X'},last:{zither:'D4 F4 G4 A4 C5 D5 F5 G5 A5:8',wood:'..x...x...x...xx'}},
    A:{bars:8,ch:'Dm | Dm | Bb | C | Dm | Dm | Bb C | Dm',
      p:{zither:'D5:2 F5:2 G5:2 A5:6 G5:2 F5:2 | G5:2 A5:2 C6:2 A5:4 G5:2 F5:4 | D5:3 F5:3 G5:2 F5:4 D5:4 | C5:2 D5:2 F5:2 G5:4 A5:2 G5:2 F5:2 | D5:2 F5:2 G5:2 A5:6 C6:2 D6:2 | C6:2 A5:2 G5:2 A5:6 G5:2 F5:2 | D5:3 F5:3 G5:2 C5:3 D5:3 F5:2 | D5:8 .:4 A4:2 C5:2',
        'erhu@1':'A4:16 | C5:16 | D5:16 | E5:16 | A4:16 | C5:16 | D5:8 E5:8 | F5:16',
        pad:'x:16',bass:'r:2 .:2 r:2 r-5:2 r:2 .:2 r12:2 r-5:2',
        taiko:'X......x..x.X...',shime:'....x.......x...',wood:'..x...x...x...x.'},
      last:{taiko:'X.x.X.x.XxXxXXXX',shime:'x...............'}},
    B:{bars:8,ch:'Gm | Dm | Bb | A | Gm | Dm | Bb C | A7',
      p:{erhu:'D5:6 C5:2 A4:4 G4:4 | A4:12 C5:2 D5:2 | F5:6 D5:2 C5:4 D5:4 | E5:12 .:4 | G5:6 F5:2 D5:4 C5:4 | D5:6 F5:2 A5:8 | G5:4 F5:4 E5:4 G5:4 | A5:6 G5:2 E5:4 C#5:4',
        zarp:"0':2 1':2 2':2 1':2 0'':2 2':2 1':2 2':2",
        pad:'x:16',bass:'r:2 .:2 r:2 r-5:2 r:2 .:2 r12:2 r-5:2',
        taiko:'X..x..x.X..x..x.',shime:'....x.......x..x',wood:'..x...x...x...x.'},
      first:{gong:'X'},last:{taiko:'X..x..x.XxXxXXXX'}}},
  intro:['I'],loop:['A','B']};

/* ---- BANYA: Siberian sauna hard bass, G minor, 140 bpm. Four-on-the-floor, distorted offbeat bass,
   balalaika tremolo hook, accordion. B swings to harmonic minor, the breakdown builds on a snare roll. */
TRACKS.banya={bpm:140,spb:4,bar:16,vol:0.141,
  chords:{'Gm':'G1|D4 G4 Bb4','Eb':'Eb2|Eb4 G4 Bb4','Bb':'Bb1|D4 F4 Bb4','D':'D2|D4 F#4 A4','Cm':'C2|C4 Eb4 G4','D7':'D2|C4 F#4 A4'},
  parts:{ bala:{i:'sv',g:.42,rv:.25,pan:-.1,v:.85,o:{w:[['sawtooth',1,0,.7],['triangle',1,5,.4]],cut:5,env:2,ftau:.05,q:1.5,a:.003,dec:.15,sus:.55,r:.06,trem:15,td:.5,tmin:.15,nz:.2,nzf:4,nzd:.015,amp:.36}},
    acc:{i:'sv',g:.3,rv:.25,pan:.15,v:.75,o:T_ACC},
    bass:{i:'sv',g:.5,tr:12,v:.9,pri:1,o:{w:[['sawtooth',1,0,.6],['sawtooth',1,10,.5],['square',.5,0,.45]],drive:4,cut:5,env:3,ftau:.05,q:3,a:.003,dec:.08,sus:.6,r:.03,drop:1.25,dropT:.04,amp:.3}},
    kick:{d:'kick',g:.9,o:{f:48,dec:.38,drive:2.5,click:.5}}, clap:{d:'clap',g:.45,rv:.3},
    ohat:{d:'hat',g:.24,o:{dec:.18,f:8000}}, hat:{d:'hat',g:.14}, snr:{d:'snare',g:.38,rv:.2}, crash:{d:'crash',g:.3} },
  sec:{
    I:{bars:2,ch:'Gm | D',p:{acc:'x:16',kick:'X...X...X...X...'},last:{snr:'x.x.x.x.xxxxXXXX'}},
    A:{bars:8,ch:'Gm | Eb | Bb | D | Gm | Eb | Cm D | Gm',
      p:{bala:'D5:2 D5:2 G5:4 F5:2 Eb5:2 D5:4 | Eb5:2 D5:2 C5:2 Bb4:2 C5:4 G4:4 | D5:2 D5:2 F5:4 Eb5:2 D5:2 C5:4 | A4:4 F#4:2 G4:2 A4:8 | D5:2 D5:2 G5:4 F5:2 Eb5:2 D5:4 | Eb5:2 D5:2 C5:2 Bb4:2 C5:4 G4:4 | Eb5:2 Eb5:2 G5:4 F#5:4 A5:4 | G5:8 D5:2 Bb4:2 G4:4',
        acc:'x:16',bass:'.:2 r:2 .:2 r:2 .:2 r:2 .:1 r:1 r12:2',
        kick:'X...X...X...X...',clap:'....X.......X...',ohat:'..x...x...x...x.',hat:'x.x.x.x.x.x.x.x.'},
      first:{crash:'X'},last:{snr:'........x.x.xxxx'}},
    B:{bars:8,ch:'Cm | Gm | D7 | Gm | Cm | Gm | Eb D | Gm',
      p:{bala:'G5:4 Eb5:4 C5:4 Eb5:4 | D5:8 Bb4:4 G4:4 | F#5:4 A5:4 C6:4 A5:4 | Bb5:8 A5:4 G5:4 | G5:4 Eb5:2 F5:2 G5:4 C6:4 | Bb5:4 A5:2 G5:2 D5:8 | Eb5:4 G5:4 F#5:4 A5:4 | G5:8 .:8',
        acc:'.:2 x:2 .:2 x:2 .:2 x:2 .:2 x:2',bass:'.:2 r:2 .:2 r:2 .:2 r:2 .:2 r12:2',
        kick:'X...X...X...X...',clap:'....X.......X...',ohat:'..x...x...x...x.',hat:'xgxgxgxgxgxgxgxg'},
      first:{crash:'X'},last:{snr:'....x...x.x.xxxx'}},
    BR:{bars:4,ch:'Gm | Eb | Cm | D',
      p:{acc:'x:16',bala:'G4:16 | Bb4:16 | C5:8 Eb5:8 | D5:4 F#5:4 A5:4 D6:4',hat:'x.x.x.x.x.x.x.x.'},
      last:{snr:'x...x...x...x...x.x.x.x.xxxxXXXX'}},
    A2:{from:'A',p:{bass:'.:2 r:2 .:1 r:1 r:2 .:2 r:2 .:1 r:1 r12:2',hat:'xgxgxgxgxgxgxgxg'},first:{crash:'X'}}},
  intro:['I'],loop:['A','B','BR','A2']};

/* ---- TRATTORIA: Naples tarantella, 6/8 at 120 dotted-quarter (bar = two 6/8 bars, 12 eighths).
   A minor with mandolin tremolo, accordion oom-pa-pa, tambourine; B lifts to A major and gets cheeky. */
const TA_A='A4 C5 E5 A5:2 E5 C5 E5 A5 C6:3 | B5:2 A5 G#5:2 E5 D5 E5 F5 E5:3 | G#4 B4 D5 F5:2 E5 D5:2 C5 B4:3 | C5:2 B4 A4:2 G#4 A4:3 .:3 | E5 E5 E5 E5:2 F5 E5 D5 C5 B4:2 C5 | F5:2 E5 D5:2 A4 D5 F5 A5 D6:3 | C6 B5 A5 G#5:2 F5 E5 D5 C5 B4:3 | A4:2 C5 E5:2 C5 A4:3 .:3';
TRACKS.trattoria={bpm:120,spb:3,bar:12,vol:0.2,
  chords:{'Am':'A1|A3 C4 E4','E7':'E2|G#3 B3 D4','Dm':'D2|A3 D4 F4','A':'A1|A3 C#4 E4','A7':'A1|G3 C#4 E4','D':'D2|A3 D4 F#4'},
  parts:{ mand:{i:'sv',g:.42,rv:.3,pan:-.1,v:.85,o:{w:[['sawtooth',1,0,.5],['square',1,6,.35]],cut:6,env:1.8,ftau:.05,q:2,a:.002,dec:.12,sus:.5,r:.05,trem:13,td:.55,tmin:.3,nz:.25,nzf:5,nzd:.012,amp:.36}},
    mandhi:{i:'sv',g:.22,rv:.35,pan:.25,tr:12,v:.75,o:{w:[['sawtooth',1,0,.5],['square',1,-6,.35]],cut:5,env:1.8,ftau:.05,q:2,a:.002,dec:.12,sus:.5,r:.05,trem:13.5,td:.55,tmin:.3,amp:.3}},
    acc:{i:'sv',g:.3,rv:.2,pan:.15,v:.72,gap:.02,o:{w:[['sawtooth',1,-8,.45],['sawtooth',1,8,.45],['square',1,0,.2]],cut:4,q:1,a:.015,dec:.2,sus:.6,r:.06,amp:.13}},
    bass:{i:'sv',g:.55,tr:12,v:.85,pri:1,o:{w:[['sawtooth',1,0,.5],['square',1,0,.4],['sine',.5,0,.5]],cut:3,a:.01,dec:.15,sus:.5,r:.05,amp:.42}},
    tamb:{d:'tamb',g:.34,pan:.3}, drum:{d:'tom',g:.5,o:{f:95,dec:.25,nz:.3,nzf:600}} },
  sec:{
    I:{bars:2,ch:'Am | E7',p:{tamb:'XggxggXggxgg',drum:'X.....x.....',bass:'r:2 .:1 r-5:2 .:1 r:2 .:1 r-5:2 .:1',acc:'. x x . x x . x x . x x'}},
    A:{bars:8,ch:'Am | E7 | E7 | Am | Am | Dm | E7 | Am',
      p:{mand:TA_A,acc:'. x x . x x . x x . x x',bass:'r:2 .:1 r-5:2 .:1 r:2 .:1 r-5:2 .:1',tamb:'XggxggXggxgg',drum:'X.....x.....'}},
    B:{bars:8,ch:'A | E7 | E7 | A | A7 | D | E7 | A E7',
      p:{mand:'C#5 E5 A5 C#6:2 B5 A5:2 E5 C#5:3 | D6:2 B5 G#5:2 E5 D5 E5 F#5 G#5:3 | B5 A5 G#5 F#5:2 E5 D5:2 B4 G#4:3 | A4 C#5 E5 A5:2 G#5 A5:3 .:3 | G5 G5 G5 G5:2 F#5 E5 C#5 A4 G5:3 | F#5 F#5 F#5 F#5:2 E5 D5 F#5 A5 D6:3 | B5 C#6 D6 B5:2 G#5 E5 F#5 G#5 B5:3 | A5:3 .:1 C#5 E5 G#5:3 B5:3',
        acc:'. x x . x x . x x . x x',bass:'r:2 .:1 r-5:2 .:1 r:2 .:1 r-5:2 .:1',tamb:'XgxXgxXgxXgx',drum:'X..x..X..x..'},
      last:{tamb:'XgxXgxXxXxXX'}},
    A2:{from:'A',p:{mandhi:TA_A,acc:'x x x x x x x x x x x x',tamb:'XgxxgxXgxxgx'},last:{tamb:'XxXxXxXXXXXX',drum:'X.xX.xX.xXXX'}}},
  intro:['I'],loop:['A','B','A2']};

/* ---- PUB: London match day terrace stomp, E mixolydian, 128 bpm. Stomp-clap, chugging overdriven power
   chords (root+5th+octave in one voice), honky-tonk piano riff in octaves; B is the terrace chant on guitar. */
const PUB_RIFF='E5:2 E5:2 G#5:2 B5:4 G#5:2 E5:4 | F#5:2 F#5:2 A5:2 D6:4 A5:2 F#5:4 | E5:2 E5:2 C#5:2 A4:4 B4:2 C#5:4 | B4:4 D5:4 E5:8 | E5:2 E5:2 G#5:2 B5:4 G#5:2 E5:4 | F#5:2 F#5:2 A5:2 D6:4 A5:2 F#5:4 | A5:2 A5:2 E5:2 C#5:2 B4:2 D#5:2 F#5:4 | E5:6 .:2 G#4+E5:2 .:2 G#4+E5:4';
const PUB_LEAD={w:[['sawtooth',1,0,.6],['square',1,8,.4]],drive:3,cut:3000,cabs:1,q:1.5,a:.005,dec:.4,sus:.8,r:.1,vib:20,vdel:.25,glide:.04,amp:.2};
TRACKS.pub={bpm:128,spb:4,bar:16,vol:0.157,
  chords:{'E':'E2|E3 B3 E4 G#4','D':'D2|D3 A3 D4 F#4','A':'A1|E3 A3 C#4 E4','B':'B1|D#3 F#3 B3 D#4','C#m':'C#2|C#3 G#3 C#4 E4'},
  parts:{ piano:{i:'sv',g:.38,rv:.25,pan:.1,v:.85,dbl:-12,o:{w:[['triangle',1,-9,.55],['sawtooth',1,9,.25],['sine',2,0,.15]],cut:7,env:2,ftau:.12,a:.002,dec:.35,sus:0,ring:.4,r:.1,nz:.15,nzf:3,nzd:.01,amp:.36}},
    keys:{i:'sv',g:.28,rv:.25,pan:.2,v:.75,o:{w:[['triangle',1,-9,.55],['sawtooth',1,9,.25]],cut:6,env:2,ftau:.1,a:.002,dec:.25,sus:0,ring:.2,r:.08,amp:.3}},
    gtr:{i:'sv',g:.3,rv:.15,pan:-.2,tr:12,v:.85,pri:1,o:{w:[['sawtooth',1,0,.5],['sawtooth',1.4983,0,.45],['sawtooth',2,6,.3]],drive:6,cut:2400,cabs:1,q:1.2,a:.003,dec:.18,sus:.45,r:.05,amp:.22}},
    lead:{i:'sv',g:.34,rv:.3,v:.85,o:PUB_LEAD}, lead2:{i:'sv',g:.24,rv:.3,tr:-12,v:.8,o:PUB_LEAD},
    bass:{i:'sv',g:.52,tr:12,v:.85,pri:1,o:{w:[['sawtooth',1,0,.5],['square',1,0,.4]],drive:2,cut:3.5,env:2,ftau:.06,q:2,a:.003,dec:.15,sus:.55,r:.04,amp:.36}},
    stomp:{d:'stomp',g:.85}, clap:{d:'clap',g:.5,rv:.4}, snare:{d:'snare',g:.45,rv:.25}, hat:{d:'hat',g:.18}, crash:{d:'crash',g:.28} },
  sec:{
    I:{bars:2,ch:'E | E',p:{stomp:'X...X...X...X...',clap:'....X.......X...'},last:{gtr:'r:2 r:2 r:2 r:2 r:8',snare:'........x.x.XXXX'}},
    A:{bars:8,ch:'E | D | A | E | E | D | A B | E',
      p:{piano:PUB_RIFF,gtr:'r:2 r:2 r:2 r:2 r:2 r:2 r:2 r:2',bass:'r:2 r:2 r12:2 r:2 r:2 r:2 r12:2 r7:2',
        stomp:'X...X...X...X...',clap:'....X.......X...',hat:'x.x.x.x.x.x.x.x.'},
      first:{crash:'X'},last:{snare:'........x.x.XXXX'}},
    B:{bars:8,ch:'C#m | A | E | B | C#m | A | B | B',
      p:{lead:'G#4:4 G#4:4 C#5:6 B4:2 | A4:4 B4:4 C#5:8 | B4:4 G#4:4 E4:6 F#4:2 | F#4:12 .:4 | G#4:4 G#4:4 E5:6 D#5:2 | C#5:4 B4:4 A4:8 | B4:4 C#5:4 D#5:4 F#5:4 | F#5:8 .:8',
        keys:'.:2 x:2 .:2 x:2 .:2 x:2 .:2 x:2',gtr:'r:6 r:6 r:4',bass:'r:2 r:2 r:2 r:2 r:2 r:2 r:2 r:2',
        stomp:'X...X...X...X...',clap:'x...X...x...X...',hat:'x.x.x.x.x.x.x.x.'},
      first:{crash:'X'},last:{snare:'....x...x.x.XxXX'}},
    A2:{from:'A',p:{lead2:PUB_RIFF,hat:'xxx.xxx.xxx.xxx.'}}},
  intro:['I'],loop:['A','B','A2']};

/* ---- POOL: Rio deck party, baile funk, Bb minor, 130 bpm. Tamborzao drums (low atabaque + high tak),
   808 sub with pitch drop, syncopated brass stabs locked to the drums, square-lead hook, apito whistles. */
TRACKS.pool={bpm:130,spb:4,bar:16,vol:0.104,echo:[.75,.22,0,2600],
  chords:{'Bbm':'Bb1|Bb3 Db4 F4','Gb':'Gb1|Bb3 Db4 Gb4','Ab':'Ab1|C4 Eb4 Ab4','Ebm':'Eb2|Bb3 Eb4 Gb4','F':'F1|A3 C4 F4'},
  parts:{ stab:{i:'sv',g:.34,rv:.3,v:.85,o:{w:[['sawtooth',1,-12,.5],['sawtooth',1,12,.5]],nz:.3,nzf:2.5,nzd:.04,cut:3,env:4,ftau:.07,q:1.5,a:.003,dec:.12,sus:.2,r:.06,amp:.22}},
    lead:{i:'sv',g:.36,rv:.25,dl:.2,v:.85,o:{w:[['square',1,0,.6],['square',1,7,.4]],cut:6,env:2,ftau:.08,q:1,a:.003,dec:.12,sus:.45,r:.05,amp:.24}},
    sub:{i:'sv',g:.72,v:.9,pri:1,o:{w:[['sine',1,0,1],['triangle',2,0,.2]],drive:1.8,drop:1.6,dropT:.05,a:.003,dec:.6,sus:.6,r:.08,amp:.55}},
    kick:{d:'kick',g:.85,o:{f:48,dec:.5,click:.4}}, tum:{d:'tom',g:.55,o:{f:105,sweep:1.8,dec:.2,nz:.25,nzf:800}},
    tak:{d:'tom',g:.3,pan:.25,o:{f:420,sweep:1.3,dec:.08,nz:.3,nzf:3000}}, clap:{d:'clap',g:.5,rv:.25},
    hat:{d:'hat',g:.17,pan:-.2}, whistle:{d:'whistle',g:.34,rv:.3,pan:-.3}, crash:{d:'crash',g:.28} },
  sec:{
    I:{bars:2,ch:'Bbm | Bbm',p:{whistle:'X.......X...x.x.',tum:'X..x..X...X..x..'},last:{sub:'Bb1:6 .:10',stab:'x:2 .:2 x:2 .:2 x:2 .:6',clap:'........x.x.xxxx'}},
    A:{bars:8,ch:'Bbm | Bbm | Gb | Ab | Bbm | Bbm | Gb | Ab',
      p:{lead:'F5:2 .:1 F5:1 .:2 Db5:2 .:2 Eb5:2 F5:2 .:2 | Ab5:2 .:1 F5:1 .:2 Eb5:2 Db5:4 Bb4:4 | F5:2 .:1 F5:1 .:2 Db5:2 .:2 Eb5:2 Gb5:2 .:2 | F5:2 Eb5:2 C5:4 Ab4:4 .:4 | F5:2 .:1 F5:1 .:2 Db5:2 .:2 Eb5:2 F5:2 .:2 | Ab5:2 .:1 F5:1 .:2 Eb5:2 Db5:4 Bb4:4 | F5:2 .:1 F5:1 .:2 Db5:2 .:2 Eb5:2 Gb5:2 .:2 | F5:2 Eb5:2 C5:2 Eb5:2 F5:4 .:4',
        stab:'x:2 .:14',sub:'r:3 .:3 r:4 .:2 r:2 r12:2',
        kick:'X......xX.......',tum:'X..x..X...X..x..',tak:'..x..x...x..x..x',clap:'....X.......X...',hat:'x.x.x.x.x.x.x.x.',whistle:'..............x.'},
      first:{crash:'X'},last:{tum:'X.xX.xX.xXxXxXXX'}},
    B:{bars:8,ch:'Ebm | Bbm | Gb | F | Ebm | Bbm | Gb | F',
      p:{lead:'Bb5:3 Gb5:3 Eb5:2 .:2 Gb5:2 Bb5:4 | Ab5:3 F5:3 Db5:2 .:4 F5:4 | Bb5:3 Gb5:3 Db5:2 .:2 Eb5:2 Gb5:4 | A5:6 F5:2 C5:4 A4:4 | Bb5:3 Gb5:3 Eb5:2 .:2 Gb5:2 Bb5:4 | Ab5:3 F5:3 Db5:2 .:4 F5:4 | Bb5:3 Gb5:3 Db5:2 .:2 Eb5:2 Gb5:4 | A5:4 C6:4 A5:4 F5:4',
        stab:'x:1 .:2 x:1 .:2 x:1 .:3 x:1 .:2 x:1 .:2',sub:'r:3 .:3 r:4 .:2 r:2 r12:2',
        kick:'X......xX.......',tum:'X..x..X...X..x..',tak:'..x..x...x..x..x',clap:'....X.......X...',hat:'xxx.xxx.xxx.xxx.',whistle:'X...x.x.........'},
      first:{crash:'X'},last:{clap:'....X...x.x.XxXX'}},
    BR:{bars:4,ch:'Bbm | Bbm | Bbm | F',
      p:{sub:'r:3 .:3 r:4 .:6',tum:'X..x..X...X..x..',tak:'..x..x...x..x..x',hat:'x.x.x.x.x.x.x.x.',whistle:'X...x.x.X...x.x.'},
      first:{stab:'x:2 .:14'},last:{clap:'x.x.x.x.xxxxXXXX',stab:'.:12 x:1 .:1 x:1 .:1'}}},
  intro:['I'],loop:['A','B','BR']};

/* ---- CASINO: Vegas rockabilly / big-band swing, E, 160 bpm, written in triplet eighths (bar = 12).
   Walking upright bass, brush ride spang-a-lang, saw-brass stabs on the swung upbeats, twang guitar
   through slapback. A is a 12-bar blues with a I-VI-II-V turnaround, B is a rhythm-changes style bridge. */
TRACKS.casino={bpm:160,spb:3,bar:12,vol:0.26,echo:[.11,.16,1,3000],
  chords:{'E7':'E2|G#3 D4 F#4','A7':'A1|G3 C#4 F#4','C#7':'C#2|F3 B3 D#4','F#7':'F#2|E3 A#3 D#4','B7':'B1|D#3 A3 C#4','G#7':'G#1|C4 F#4 A#4'},
  parts:{ bass:{i:'sv',g:.66,v:.85,pri:1,gap:.02,o:{w:[['triangle',1,0,1],['sine',2,0,.25]],cut:5,env:2.5,ftau:.05,a:.004,dec:.22,sus:.35,r:.06,nz:.12,nzf:2,nzd:.02,amp:.52}},
    ride:{d:'brush',g:.26,pan:.2,o:{f:5200,dec:.25,a:.004}}, snare:{d:'snare',g:.4,rv:.3,o:{dec:.15}}, kick:{d:'kick',g:.45,o:{f:60,dec:.25,click:.2}},
    brass:{i:'sv',g:.4,rv:.35,v:.85,o:{w:[['sawtooth',1,-7,.5],['sawtooth',1,7,.5]],cut:1.6,env:4,fa:.015,ftau:.06,q:1.2,a:.018,dec:.15,sus:.6,r:.08,amp:.16}},
    gtr:{i:'sv',g:.4,rv:.2,dl:.5,pan:-.15,v:.85,o:{w:[['sawtooth',1,0,.5],['square',1,0,.4]],cut:4,env:3,ftau:.05,q:3,a:.002,dec:.25,sus:.35,r:.08,nz:.2,nzf:4,nzd:.01,amp:.3,vib:12,vdel:.3}} },
  sec:{
    I:{bars:2,ch:'B7 | B7',p:{bass:'B1:3 D#2:3 F#2:3 A2:3 | B2:3 A2:3 F#2:3 F2:3',ride:'X..x.xX..x.x',kick:'x.....x.....',brass:'x:2 .:4 x:2 .:4'},last:{snare:'...x.xx.xXxX'}},
    A:{bars:12,ch:'E7 | A7 | E7 | E7 | A7 | A7 | E7 | C#7 | F#7 | B7 | E7 C#7 | F#7 B7',
      p:{gtr:'E5:2 G5:1 G#5:3 E5:2 C#5:1 B4:3 | C#5:2 E5:1 G5:3 F#5:2 E5:1 C#5:3 | E5:2 G5:1 G#5:3 B5:2 G#5:1 E5:3 | G#4:6 .:3 B4:2 C#5:1 | E5:2 G5:1 A5:3 G5:2 E5:1 C#5:3 | A4:6 .:3 B4:2 C#5:1 | E5:3 G#5:3 B5:3 G#5:3 | B5:2 G#5:1 F5:3 E5:2 C#5:1 B4:3 | A#4:3 C#5:3 E5:2 F#5:1 A#5:3 | A5:2 F#5:1 D#5:3 B4:3 .:3 | E5:3 G#5:3 F5:3 G#5:3 | F#5:3 E5:2 C#5:1 D#5:3 B4:3',
        brass:'.:5 x:1 .:5 x:1',
        bass:'E2:3 G#2:3 B2:3 A#2:3 | A2:3 G2:3 F#2:3 F2:3 | E2:3 G#2:3 B2:3 C#3:3 | E3:3 D3:3 B2:3 G#2:3 | A2:3 C#3:3 E3:3 C#3:3 | A2:3 G2:3 F#2:3 F2:3 | E2:3 G#2:3 B2:3 C3:3 | C#3:3 G#2:3 F#2:3 G2:3 | F#2:3 A#2:3 C#3:3 C3:3 | B2:3 D#3:3 F#3:3 F3:3 | E3:3 B2:3 C#3:3 G#2:3 | F#2:3 C#3:3 B2:3 F2:3',
        ride:'X..x.xX..x.x',snare:'...x.....x..',kick:'x.....x.....'},
      last:{snare:'...x.xx.xXxX'}},
    B:{bars:8,ch:'G#7 | G#7 | C#7 | C#7 | F#7 | F#7 | B7 | B7',
      p:{gtr:'C5:3 D#5:3 F#5:3 G#5:3 | F#5:2 D#5:1 C5:6 .:3 | F5:3 G#5:3 B5:3 C#6:3 | B5:2 G#5:1 F5:6 .:3 | A#4:3 C#5:3 E5:3 F#5:3 | E5:2 C#5:1 A#4:6 .:3 | D#5:3 F#5:3 A5:3 B5:3 | A5:2 F#5:1 D#5:3 B4:3 .:3',
        brass:'x:2 .:1 x:2 .:4 x:2 .:1',
        bass:'G#2:3 C3:3 D#3:3 C3:3 | G#2:3 F#2:3 E2:3 D2:3 | C#2:3 F2:3 G#2:3 F2:3 | C#3:3 B2:3 G#2:3 G2:3 | F#2:3 A#2:3 C#3:3 A#2:3 | F#2:3 E2:3 C#2:3 C2:3 | B1:3 D#2:3 F#2:3 A2:3 | B2:3 A2:3 F#2:3 F2:3',
        ride:'X..x.xX..x.x',snare:'...x..x..x.x',kick:'x.....x.....'},
      last:{snare:'...x.xx.xXxX'}},
    A2:{from:'A',p:{brass:'.:2 x:1 .:2 x:1 .:2 x:1 .:2 x:1'}}},
  intro:['I'],loop:['A','B','A2']};

/* ---- CAB: the locomotive. Dark techno / industrial, C minor-phrygian, 132 bpm. Driven kick, metal hats,
   octave-pedal arpeggio, acid bass between the kicks, a siren pad that bends upward, a saw hook in B, breakdown. */
TRACKS.cab={bpm:132,spb:4,bar:16,vol:0.14,echo:[.75,.3,0,2000],
  chords:{'Cm':'C2|C3 G3 C4 Eb4','Db':'Db2|Db3 Ab3 Db4 F4','Bb':'Bb1|Bb2 F3 Bb3 D4','Ab':'Ab1|Ab2 Eb3 Ab3 C4','G':'G1|G2 D3 G3 B3'},
  parts:{ arp:{i:'sv',g:.3,rv:.2,dl:.25,pan:.15,tr:12,v:.8,hum:0,o:{w:[['sawtooth',1,0,.6],['square',1,5,.4]],cut:3,env:5,ftau:.05,q:6,a:.002,dec:.09,sus:.15,r:.04,amp:.26}},
    siren:{i:'sv',g:.24,rv:.45,v:.75,o:{w:[['sawtooth',1,-12,.5],['sawtooth',1,12,.5]],cut:2,q:2,a:1.2,dec:1,sus:.9,r:.8,bend:1.06,amp:.12}},
    bass:{i:'sv',g:.55,v:.9,pri:1,hum:0,o:{w:[['sawtooth',1,0,.7],['square',1,0,.4]],cut:1.5,env:8,ftau:.05,q:8,a:.002,dec:.1,sus:.35,r:.03,amp:.38}},
    lead:{i:'sv',g:.35,rv:.35,dl:.2,v:.85,o:{w:[['sawtooth',1,-6,.5],['sawtooth',1,6,.5],['square',.5,0,.3]],drive:2,cut:4,env:1.5,ftau:.2,q:2,a:.01,dec:.4,sus:.8,r:.15,vib:10,vdel:.3,amp:.22}},
    kick:{d:'kick',g:.92,o:{f:46,dec:.42,drive:3,click:.5}}, clang:{d:'clap',g:.42,rv:.35,o:{f:1600}}, mclang:{d:'metal',g:.22,rv:.3,o:{f:1800,dec:.12}},
    hat:{d:'metal',g:.16,pan:.2,o:{dec:.04}}, ohat:{d:'metal',g:.18,pan:-.15,o:{dec:.16,f:3600}}, snr:{d:'snare',g:.34,rv:.2}, crash:{d:'crash',g:.28} },
  sec:{
    I:{bars:2,ch:'Cm | Cm',p:{kick:'X...X...X...X...',ohat:'..x...x...x...x.',siren:'x:32'},last:{arp:"0 0' 2 0' 3 0' 2 1' 0 0' 2 0' 3 0' 3' 1'",snr:'........x.x.xxXX'}},
    A:{bars:8,ch:'Cm | Cm | Db | Cm | Cm | Cm | Db | Bb',
      p:{arp:"0 0' 2 0' 3 0' 2 1' 0 0' 2 0' 3 0' 3' 1'",siren:'x:32',
        bass:'.:1 r:1 r:1 r12:1 .:1 r:1 r7:1 r:1 .:1 r:1 r12:1 r:1 .:1 r7:1 r:1 r12:1',
        lead:'.:16 | .:16 | F5:4 .:2 F5:2 Ab5:4 F5:4 | G5:12 .:4 | .:16 | .:16 | F5:4 .:2 F5:2 Ab5:4 Db6:4 | D5:8 F5:4 Bb4:4',
        kick:'X...X...X...X...',clang:'....X.......X...',mclang:'....x.......x...',hat:'xgxgxgxgxgxgxgxg',ohat:'..x...x...x...x.'},
      first:{crash:'X'},last:{snr:'........x.x.xxXX'}},
    B:{bars:8,ch:'Ab | Bb | Cm | Cm | Ab | Bb | Db | G',
      p:{lead:'C5:4 .:2 C5:2 Eb5:4 C5:4 | D5:4 .:2 D5:2 F5:4 D5:4 | Eb5:6 D5:2 C5:4 G4:4 | C5:12 .:4 | C5:4 .:2 C5:2 Eb5:4 Ab5:4 | G5:4 .:2 F5:2 D5:4 Bb4:4 | Ab5:6 G5:2 F5:4 Db5:4 | B4:8 D5:4 F5:4',
        arp:"0 1 2 3 0' 1 2 3 0'' 3 2 1 0' 3 2 1",siren:'x:32',
        bass:'.:1 r:1 r:1 r12:1 .:1 r:1 r7:1 r:1 .:1 r:1 r12:1 r:1 .:1 r7:1 r:1 r12:1',
        kick:'X...X...X...X...',clang:'....X.......X...',mclang:'....x.......x...',hat:'xgxgxgxgxgxgxgxg',ohat:'..x...x...x...x.'},
      first:{crash:'X'},last:{kick:'X...X...X.X.XXXX'}},
    C:{bars:4,ch:'Cm | Db | Ab | G',
      p:{arp:"0 0' 2 0' 3 0' 2 1' 0 0' 2 0' 3 0' 3' 1'",siren:'x:16',hat:'xgxgxgxgxgxgxgxg',bass:'r:16'},
      last:{snr:'x...x...x...x...x.x.x.x.xxxxXXXX'}}},
  intro:['I'],loop:['A','B','C']};

/* ---- IZAKAYA: lantern-lit Tokyo izakaya by day, salaryman hitmen three rounds in. City-pop / enka crossover,
   E minor, 110 bpm shuffle (triplet eighths, bar = 12). Shamisen hook on the minor-pentatonic over an
   Autumn-Leaves cycle, walking upright bass, cross-stick kit, Rhodes pushes. B is the karaoke chorus:
   a wobbly detuned synth crooning over the J-pop IVmaj7-III7-vi-v-I7 changes, shamisen answering, koto rolling.
   A2 brings the hook back with the karaoke synth singing along an octave down. T turns around on IVmaj7-V7. */
const T_SHAMI={w:[['sawtooth',1,0,.55],['square',2,4,.2],['triangle',1,-6,.3]],cut:4,env:5,ftau:.035,q:3.5,a:.001,dec:.2,sus:0,ring:.3,r:.08,nz:.45,nzf:6,nzd:.012,slide:.985,slideT:.012,amp:.36};
const T_KARA={w:[['square',1,-15,.45],['sawtooth',1,13,.4],['triangle',2,0,.1]],cut:3.5,q:1.2,a:.025,dec:.6,sus:.8,r:.22,vib:34,vdel:.16,glide:.08,amp:.2};
const IZ_HOOK='E5:2 E5:1 G5:2 A5:1 B5:3 A5:2 G5:1 | A5:2 G5:1 E5:3 F#5:2 E5:1 D5:3 | B4:2 D5:1 G5:3 F#5:6 | E5:2 G5:1 B5:2 A5:1 G5:3 E5:3 | A5:2 A5:1 C6:2 A5:1 E5:3 F#5:3 | D#5:2 F#5:1 A5:3 C6:2 B5:1 A5:3 | G5:2 F#5:1 E5:3 B4:2 D5:1 E5:3 | E5:6 D#5:3 .:3';
const IZ_BASS='E2:3 G2:3 B2:2 B2:1 G#2:3 | A2:3 E2:3 D2:3 F#2:3 | G2:3 D2:3 G2:3 B2:3 | C3:3 B2:3 A2:3 G2:3 | F#2:3 A2:3 E2:3 C2:3 | B1:3 D#2:3 F#2:3 D#2:3 | E2:3 G2:3 B2:3 G2:3 | B1:3 E2:3 D#2:3 F#2:3';
TRACKS.izakaya={bpm:110,spb:3,bar:12,vol:0.18,echo:[.5,.2,0,2600],vibHz:4.8,
  chords:{'Em9':'E2|G3 B3 D4 F#4','Am9':'A1|G3 B3 C4 E4','D9':'D2|F#3 A3 C4 E4','Gmaj7':'G2|F#3 A3 B3 D4','Cmaj7':'C2|E3 G3 B3 D4',
    'F#m7b5':'F#2|E3 A3 C4','B7b9':'B1|D#3 A3 C4','B7sus':'B1|E3 F#3 A3 B3','B7':'B1|D#3 F#3 A3 B3','Em7':'E2|G3 B3 D4 E4',
    'Dm7':'D2|F3 A3 C4 E4','G7':'G1|F3 B3 D4 E4','A7':'A1|G3 C#4 E4','Am7':'A1|G3 C4 E4'},
  parts:{ shami:{i:'sv',g:.75,rv:.3,dl:.12,pan:-.15,v:.85,hum:.01,o:T_SHAMI},
    kara:{i:'sv',g:.55,rv:.4,dl:.25,chorus:.7,pan:.1,v:.8,o:T_KARA},
    karalo:{i:'sv',g:.32,rv:.4,dl:.2,chorus:.7,pan:.2,tr:-12,v:.75,o:T_KARA},
    koto:{i:'sv',g:.34,rv:.45,dl:.2,pan:.35,hum:0,v:.65,o:T_ZITHER},
    keys:{i:'ep',g:.42,rv:.3,chorus:.8,pan:-.05,v:.62,o:{idx:1.7,dec:.7,tg:.05,r:.25}},
    bass:{i:'sv',g:.66,v:.85,pri:1,gap:.02,o:{w:[['triangle',1,0,1],['sine',2,0,.25]],cut:5,env:2.5,ftau:.05,a:.004,dec:.22,sus:.35,r:.06,nz:.12,nzf:2,nzd:.02,amp:.52}},
    clink:{i:'bell',g:.12,rv:.4,pan:-.35,v:.7,hum:.02,o:{ratio:2.76,idx:.8,dec:.35,amp:.2}},
    kick:{d:'kick',g:.5,o:{f:58,dec:.28,click:.18}}, rim:{d:'rim',g:.3,rv:.3,pan:.15}, snare:{d:'snare',g:.38,rv:.3,o:{dec:.14,f:2100,tone:210}},
    hat:{d:'hat',g:.17,pan:.25,o:{dec:.04}}, tamb:{d:'tamb',g:.2,pan:-.3}, crash:{d:'crash',g:.2,o:{dec:1.2}} },
  sec:{
    I:{bars:2,ch:'Em9 | B7sus B7',p:{shami:'E5:1 E5:1 E5:1 B4:3 E5:1 E5:1 E5:1 G5:3 | E5:3 F#5:2 A5:1 D#5:3 F#5:2 D#5:1'},
      first:{clink:'B6:2 E7:10'},last:{bass:'B1:3 E2:3 D#2:3 F#2:3',hat:'x.gx.gx.gx.g',rim:'...x.....x.x'}},
    A:{bars:8,ch:'Em9 | Am9 D9 | Gmaj7 | Cmaj7 | F#m7b5 | B7b9 | Em9 | B7sus B7',
      p:{shami:IZ_HOOK,bass:IZ_BASS,keys:'x:2 .:3 x:7',
        kick:'X.....x....g',rim:'...x.....x..',hat:'x.gx.gx.gx.g'},
      last:{rim:'...x..x.xx.x',kick:'X.....x.....'}},
    B:{bars:8,ch:'Cmaj7 | B7 | Em7 | Dm7 G7 | Cmaj7 | B7 | Em7 A7 | Am7 B7',
      p:{kara:'G5:3 E5:2 D5:1 E5:6 | D#5:3 F#5:2 A5:1 B5:6 | G5:3 F#5:2 E5:1 D5:3 B4:3 | A4:2 C5:1 D5:3 F5:3 D5:2 B4:1 | C5:3 E5:2 G5:1 B5:6 | A5:3 F#5:2 D#5:1 F#5:6 | G5:3 E5:2 B4:1 C#5:3 E5:2 G5:1 | A5:3 G5:2 E5:1 F#5:3 D#5:3',
        shami:'.:6 B5:1 A5:1 G5:1 E5:3 | .:6 A5:1 F#5:1 D#5:1 B4:3 | .:12 | .:12 | .:6 D6:1 B5:1 G5:1 E5:3 | .:6 C6:1 A5:1 F#5:1 D#5:3 | .:12 | .:12',
        koto:"0':2 1':2 2':2 3':2 2':2 1':2",keys:'.:2 x:4 .:2 x:4',
        bass:'C2:3 G2:3 E2:3 C2:3 | B1:3 D#2:3 F#2:3 D#2:3 | E2:3 G2:3 E2:3 C#2:3 | D2:3 A2:3 G2:3 B1:3 | C2:3 E2:3 G2:3 C3:3 | B2:3 A2:3 F#2:3 D#2:3 | E2:3 D2:3 C#2:3 E2:3 | A1:3 C2:3 B1:3 D#2:3',
        kick:'X....gx....g',snare:'...x.....x..',hat:'x.xx.xx.xx.x',tamb:'...x.....x..'},
      first:{crash:'X'},last:{snare:'...x..x.xXxX'}},
    A2:{from:'A',p:{karalo:IZ_HOOK,koto:"0':1 1':1 2':1 3':1 2':1 1':1 0':1 1':1 2':1 3':1 0'':2",hat:'x.xx.gx.xx.g',tamb:'...x.....x..'},first:{crash:'X'}},
    T:{bars:2,ch:'Cmaj7 | B7b9',
      p:{shami:'G5:2 E5:1 B5:3 A5:2 G5:1 E5:3 | D#5:2 F#5:1 A5:3 C6:2 B5:1 .:3',kara:'E5:12 | D#5:6 .:6',keys:'x:2 .:3 x:7',
        bass:'C2:3 G2:3 E2:3 C2:3 | B1:3 D#2:3 F#2:3 D#2:3',kick:'X.....x.....',rim:'...x.....x..',hat:'x.gx.gx.gx.g'},
      last:{snare:'...x.xx.xXxX',hat:'x.gx.g......',clink:'.:9 B6:1 E7:2'}}},
  intro:['I'],loop:['A','B','A2','T']};

/* ---- SUSHI: the Kagami-gumi sushi bar under the Pacific at night. F minor, 88 bpm, cold and slow.
   Heartbeat sub pulse, a glassy bell ostinato through a long dotted-8th echo, breathy shakuhachi on long
   notes with scoops and fall-offs, dark pads, a sonar ping. A is hirajoshi (F G Ab C Db); B turns to in-sen
   (F Gb Bb C Eb) over an F pedal and the heartbeat doubles; C is the build: taiko, hyoshigi clappers, gong. */
const T_SHAKU={w:[['triangle',1,0,1],['sine',2,0,.12],['sine',3,0,.04]],cut:4,a:.12,dec:.6,sus:.8,r:.45,vib:22,vdel:.45,slide:.95,slideT:.09,bend:.985,nz:.8,nzf:1.2,nzd:.45,amp:.32};
const SU_O1='F4:2 C5:1 Ab5:1 G5:2 C5:2 F4:2 C5:1 Db5:1 C5:2 Ab4:2', SU_O2='F4:2 C5:1 Bb5:1 Gb5:2 C5:2 F4:2 C5:1 Eb5:1 C5:2 Bb4:2',
  SU_OGB='F4:2 Db5:1 Bb5:1 Gb5:2 Db5:2 F4:2 Db5:1 Eb5:1 Db5:2 Bb4:2', SU_OC='F4:2 C5:1 Bb5:1 G5:2 C5:2 F4:2 C5:1 Db5:1 C5:2 Bb4:2';
TRACKS.sushi={bpm:88,spb:4,bar:16,vol:0.2,echo:[.75,.42,0,1800],vibHz:4.6,
  chords:{'Fm9':'F1|Ab3 C4 Eb4 G4','Fm11':'F1|Ab3 Bb3 C4 Eb4','Dbmaj9':'Db2|F3 Ab3 C4 Eb4','Gbmaj7':'Gb1|F3 Bb3 Db4',
    'C7b9sus':'C2|F3 Bb3 Db4 G4','Gb/F':'F1|Gb3 Bb3 Db4 F4','Bbm9':'Bb1|Db3 F3 Ab3 C4'},
  parts:{ lead:{i:'sv',g:.44,rv:.55,dl:.32,pan:-.1,v:.8,hum:.01,o:T_SHAKU},
    ost:{i:'bell',g:.32,rv:.5,dl:.45,pan:.3,tr:12,v:.6,hum:0,o:{ratio:3.5,idx:1.2,idx2:.12,itau:.06,dec:.8,amp:.24}},
    pad:{i:'sv',g:.38,rv:.6,chorus:.25,v:.7,o:{w:[['sawtooth',1,-7,.5],['sawtooth',1,7,.5],['triangle',.5,0,.4]],cut:1.6,q:1.5,a:.9,dec:1,sus:.9,r:1.2,amp:.12}},
    bass:{i:'sv',g:.6,v:.9,pri:1,hum:0,o:{w:[['sine',1,0,.7],['sine',2,0,.6],['triangle',3,0,.08]],a:.012,dec:.45,sus:.35,r:.25,amp:.4}},
    ping:{i:'bell',g:.14,rv:.7,dl:.6,pan:-.35,v:.7,o:{ratio:1,idx:.35,idx2:.05,dec:3.2,amp:.2}},
    taiko:{d:'tom',g:.5,rv:.5,o:{f:66,sweep:1.7,dec:.9,nz:.55,nzf:280}}, shime:{d:'tom',g:.24,rv:.3,pan:.25,o:{f:340,dec:.1,nz:.35,nzf:2600}},
    hyo:{d:'wood',g:.26,rv:.5,pan:-.2,o:{f:2100,dec:.05}}, gong:{d:'gong',g:.42,rv:.7,o:{f:62,dec:5}} },
  sec:{
    I:{bars:2,ch:'Fm9 | Fm9',p:{pad:'x:32'},first:{gong:'X',ping:'C6:16'},last:{ost:SU_O1,bass:'r:2 r_:6 .:8'}},
    A:{bars:8,ch:'Fm9 | Fm9 | Dbmaj9 | Dbmaj9 | Fm9 | Fm9 | Gbmaj7 | C7b9sus',
      p:{lead:'.:4 C5:6 Db5:2 C5:4 | Ab4:12 G4:2 Ab4:2 | F4:8 Ab4:4 C5:4 | Db5:12 .:4 | .:4 F5:6 Db5:2 C5:4 | Ab5:8 G5:4 F5:4 | Gb5:8 F5:4 Db5:4 | C5:16',
        ost:[SU_O1,SU_O1,SU_O1,SU_O1,SU_O1,SU_O1,SU_OGB,SU_OC].join(' | '),pad:'x:16',bass:'r:2 r_:6 .:8',ping:'C6:16 .:48',
        taiko:'X...............|................'},
      last:{taiko:'X...............|X.......X..xX.x.'}},
    B:{bars:8,ch:'Fm11 | Gb/F | Fm11 | Gb/F | Dbmaj9 | Bbm9 | Gbmaj7 | C7b9sus',
      p:{lead:'C6:10 Bb5:2 C6:4 | Db6:8 C6:4 Bb5:4 | C6:12 Ab5:2 Bb5:2 | Gb5:16 | F5:4 Ab5:4 C6:8 | Db6:6 C6:2 Bb5:4 Ab5:4 | Bb5:8 Gb5:4 F5:4 | Db5:8 C5:8',
        ost:[SU_O2,SU_O2,SU_O2,SU_O2,SU_O1,SU_O2,SU_OGB,SU_OC].join(' | '),pad:'x:16',bass:'r:2 r_:6 r:2 r_:6',
        taiko:'X.......X..x....',shime:'....x.......x...'},
      last:{taiko:'X..x..X.X.xxXxXX'}},
    C:{bars:4,ch:'Fm11 | Gb/F | Dbmaj9 | C7b9sus',
      p:{lead:'.:16 | .:16 | .:8 Ab5:8 | C6:8 Db6:8',ost:[SU_O2,SU_O2,SU_O1,SU_OC].join(' | '),pad:'x:16',
        bass:'r:2 r_:2 r:2 r_:2 r:2 r_:2 r:2 r12_:2',taiko:'X..x..X.X..x..x.',shime:'..x...x...x...xx',hyo:'X.......X.......'},
      last:{taiko:'XxgXxgXxXxXxXXXX',hyo:'X...X...X.X.XXXX',gong:'X'}}},
  intro:['I'],loop:['A','B','C']};

/* =====================================================================
   AMBIENCE. Continuous beds plus random one-shots, placed in five fixed "positions"
   (near left/right, far left/right, far centre) that feed the big tiled-hall reverb.
   ===================================================================== */
function later(P,t,fn){ P.later.push({t,fn}); }
function positions(P,wet){ const ac=P.ac; P.pos=[];
  for(const [pan,dry,w,cut] of [[-.55,.75,.45,9000],[.55,.75,.45,9000],[-.85,.28,1,2400],[.85,.28,1,2400],[0,.16,1.1,1300]]){
    const i=F(ac,'lowpass',cut,.5),p=PAN(ac,pan),d=G(ac,dry),s=G(ac,w*wet); chain(i,p,d,P.out); p.connect(s); s.connect(P.rv); P.keep.push(i,p,d,s); P.nodes+=4; P.pos.push(i); } }
const near=P=>P.pos[Math.random()<.5?0:1], far=P=>P.pos[2+((Math.random()*3)|0)], anyPos=P=>Math.random()<.4?near(P):far(P);
/* looping filtered-noise bed; returns its gain so callers can modulate it */
function bed(P,dst,type,f,q,g){ const ac=P.ac,n=NZ(P),fl=F(ac,type,f,q),gg=G(ac,g); chain(n,fl,gg,dst); n.start(ac.currentTime,Math.random()*3); cont(P,n.detune); keep(P,n,fl,gg); return {g:gg,f:fl}; }
function hum(P,dst,type,f,g){ const ac=P.ac,o=O(ac,type,f),gg=G(ac,g); chain(o,gg,dst); o.start(ac.currentTime); cont(P,o.detune); keep(P,o,gg); return gg; }
function lfo(P,param,hz,depth){ const ac=P.ac,o=O(ac,'sine',hz),g=G(ac,depth); chain(o,g,param); o.start(ac.currentTime,0); keep(P,o,g); }
function blip(P,dst,t,type,f,dec,v,f2){ const ac=P.ac,pf=pitch(P,t),o=O(ac,type,f*pf),g=G(ac,0); if(f2){ o.frequency.setValueAtTime(f*pf,t); o.frequency.exponentialRampToValueAtTime(f2*pf,t+dec*.6); } perc(g,t,v,dec); chain(o,g,dst); o.start(t); V(P,[o],[g],t+dec); }
function toneOn(P,dst,t,type,f,len,v){ const ac=P.ac,o=O(ac,type,f*pitch(P,t)),g=G(ac,0); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.006); g.gain.setValueAtTime(v,t+len); g.gain.linearRampToValueAtTime(0,t+len+.012); chain(o,g,dst); o.start(t); V(P,[o],[g],t+len+.02); }
const VOWEL=[[730,1090],[530,1840],[270,2290],[570,840],[440,1020],[660,1720],[300,870]];
function syllable(P,dst,t,f0,dur,v){ const ac=P.ac,pf=pitch(P,t),o=O(ac,'sawtooth',f0*pf),a=pick(VOWEL),b=pick(VOWEL),f1=F(ac,'bandpass',a[0],6),f2=F(ac,'bandpass',a[1],8),g=G(ac,0),g2=G(ac,.6);
  o.frequency.setValueAtTime(f0*pf,t); o.frequency.linearRampToValueAtTime(f0*pf*rnd(.82,1.18),t+dur);
  f1.frequency.setValueAtTime(a[0],t); f1.frequency.linearRampToValueAtTime(b[0],t+dur); f2.frequency.setValueAtTime(a[1],t); f2.frequency.linearRampToValueAtTime(b[1],t+dur);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.03); g.gain.setValueAtTime(v,t+dur-.03); g.gain.linearRampToValueAtTime(0,t+dur);
  o.connect(f1); o.connect(f2); f1.connect(g); chain(f2,g2,g); g.connect(dst); o.start(t); V(P,[o],[f1,f2,g,g2],t+dur+.02); }
function utterance(P,t,v){ const dst=Math.random()<.25?near(P):far(P),f0=Math.random()<.5?rnd(95,140):rnd(180,250); let tt=t; const n=2+(Math.random()*5|0);
  for(let i=0;i<n;i++){ const d=rnd(.09,.22); later(P,tt,(P,t)=>syllable(P,dst,t,f0*rnd(.9,1.12),d,v*rnd(.6,1))); tt+=d+rnd(.015,.09); } }
function footstep(P,dst,t,v){ const [n,fl,g]=nzHit(P,dst,t,'bandpass',rnd(1700,2600),1.4,v,.045); blip(P,dst,t+.012,'sine',95,.06,v*.7,60); V(P,[n],[fl,g],t+.06); }
function walker(P,t,v){ const dst=anyPos(P),pace=rnd(.46,.6); for(let i=0,n=4+(Math.random()*8|0);i<n;i++) later(P,t+i*pace,(P,t)=>footstep(P,dst,t,v*(i%2?.85:1))); }
function distantTrain(P,t,dur,v){ const ac=P.ac,dst=P.pos[4],n=NZ(P),fl=F(ac,'lowpass',160,1),g=G(ac,0),o=O(ac,'sawtooth',42*pitch(P,t)),og=G(ac,0),of=F(ac,'lowpass',140,.7);
  fl.frequency.setValueAtTime(140,t); fl.frequency.linearRampToValueAtTime(650,t+dur*.5); fl.frequency.linearRampToValueAtTime(160,t+dur);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+dur*.5); g.gain.linearRampToValueAtTime(0,t+dur);
  og.gain.setValueAtTime(0,t); og.gain.linearRampToValueAtTime(v*.5,t+dur*.5); og.gain.linearRampToValueAtTime(0,t+dur);
  chain(n,fl,g,dst); chain(o,of,og,dst); n.start(t,Math.random()*3); o.start(t); V(P,[n,o],[fl,g,of,og],t+dur);
  for(let x=dur*.25;x<dur*.8;x+=rnd(.22,.3)) later(P,t+x,(P,tt)=>{ const k=1-Math.abs((tt-t)/dur-.5)*2; const [a,b,c]=nzHit(P,dst,tt,'bandpass',700,1.2,v*.5*k,.05); V(P,[a],[b,c],tt+.06); }); }
function stationBase(P,o){ const ac=P.ac; positions(P,o.wet||1);
  bed(P,P.out,'lowpass',150,.7,.09*(o.room||1)); bed(P,P.pos[4],'bandpass',700,.6,.012*(o.room||1));
  if(o.crowd>0){ const m=bed(P,P.pos[4],'bandpass',520,1.4,.05*o.crowd); lfo(P,m.g.gain,.13,.02*o.crowd); lfo(P,m.f.frequency,.21,140);
    every(P,.2,.35/o.crowd,1.4/o.crowd,(P,t)=>utterance(P,t,.05)); }
  if(o.steps>0) every(P,.8,2/o.steps,7/o.steps,(P,t)=>walker(P,t,.09));
  every(P,o.trainFirst||6,o.train?o.train[0]:28,o.train?o.train[1]:50,(P,t)=>distantTrain(P,t,rnd(7,10),.35)); }
/* small note players for buskers and chimes: notes as [midi, startBeat, beats] */
function phrase(P,dst,t,bpm,notes,fn,o){ const b=60/bpm; for(const [m,s,l,v] of notes) later(P,t+s*b,(P,tt)=>INST[fn](P,dst,tt,hz(m)*pitch(P,tt),l*b,v||.8,o)); }
const M=s=>{ const out=[]; for(const x of toks(s)){ const [n,st,l,v]=x.split(':'); for(const k of n.split('+')) out.push([midi(k),+st,+l,v?+v:.8]); } return out; };
const T_PLUCK={w:[['triangle',1,0,.7],['sawtooth',1,0,.25]],cut:5,env:3,ftau:.07,a:.002,dec:.35,sus:0,ring:.8,r:.15,amp:.3};
const T_MAND={w:[['sawtooth',1,0,.5],['square',1,6,.35]],cut:5,env:1.8,ftau:.05,q:2,a:.002,dec:.12,sus:.5,r:.05,trem:13,td:.55,tmin:.3,amp:.3};

const AMB={
  tokyo(P){ stationBase(P,{crowd:.9,steps:1});
    const chime=M('E5:0:1 B5:.75:1 A5:1.5:1 E6:2.25:1.5 D6:3.25:2');
    every(P,2,24,36,(P,t)=>phrase(P,P.pos[0],t,150,chime,'bell',{ratio:3.5,idx:2,dec:1.6,amp:.16}));
    const esc=hum(P,P.pos[1],'sawtooth',50,.02); hum(P,P.pos[1],'triangle',100,.012); lfo(P,esc.gain,.7,.006);
    every(P,.4,.85,.95,(P,t)=>{ const [n,f,g]=nzHit(P,P.pos[1],t,'bandpass',1200,2,.02,.03); V(P,[n],[f,g],t+.04); });
    every(P,5,14,24,(P,t)=>{ for(let i=0;i<7;i++){ const d=P.pos[3],tt=t+i*.55; later(P,tt,(P,x)=>{ blip(P,d,x,'sine',2300,.08,.07,3500); blip(P,d,x+.12,'sine',3300,.05,.05,2700); blip(P,d,x+.2,'sine',3300,.05,.04,2700); }); } });
    every(P,1,1.5,4,(P,t)=>{ const d=anyPos(P); if(Math.random()<.8) toneOn(P,d,t,'square',2400,.07,.025); else { toneOn(P,d,t,'square',3000,.06,.025); toneOn(P,d,t+.1,'square',3000,.06,.025); } }); },
  tokyonight(P){ stationBase(P,{crowd:.12,steps:.25,room:1.2,train:[45,70],trainFirst:9});
    const b=hum(P,P.pos[0],'sawtooth',120,.0045); const bf=F(P.ac,'bandpass',2600,3); b.disconnect(); chain(b,bf,P.pos[0]); P.keep.push(bf); hum(P,P.pos[0],'sine',120,.012);
    every(P,3,4,9,(P,t)=>{ for(let i=0,n=1+(Math.random()*4|0);i<n;i++){ const tt=t+i*rnd(.04,.12); toneOn(P,P.pos[0],tt,'sawtooth',120,rnd(.02,.06),.02); } });
    const chime=M('E5:0:1 B5:.75:1 A5:1.5:1 E6:2.25:1.5 D6:3.25:2');
    every(P,4,30,45,(P,t)=>phrase(P,P.pos[4],t,150,chime,'bell',{ratio:3.5,idx:2,dec:2,amp:.2})); },
  hongkong(P){ stationBase(P,{crowd:1.6,steps:1.4});
    every(P,3,18,30,(P,t)=>{ const d=P.pos[1]; for(let i=0;i<5;i++) toneOn(P,d,t+i*.26,'square',1180,.12,.02); toneOn(P,d,t+5*.26,'square',880,.4,.02); });
    every(P,1,4,8,(P,t)=>{ const d=far(P),n=6+(Math.random()*12|0); let tt=t; for(let i=0;i<n;i++){ tt+=rnd(.03,.16); later(P,tt,(P,x)=>{ const [a,b,c]=nzHit(P,d,x,'bandpass',rnd(3000,4200),3,.12,.025); V(P,[a],[b,c],x+.03); blip(P,d,x,'sine',rnd(2100,2800),.02,.05); }); } }); },
  baikal(P){ stationBase(P,{crowd:.5,steps:.6,wet:1.6,room:1.1});
    for(const [f,hz1,hz2] of [[480,.07,.11],[820,.05,.09]]){ const w=bed(P,P.pos[2+(f>600?1:0)],'bandpass',f,5,.05); lfo(P,w.f.frequency,hz1,f*.45); lfo(P,w.g.gain,hz2,.035); }
    const ph=[M('A4:0:1 D5:1:1 E5:2:.5 F5:2.5:.5 E5:3:1 D5:4:1 C5:5:.5 A4:5.5:2.5 D3+A3:0:4:.4 D3+A3:4:4:.4'),
              M('F5:0:1 E5:1:.5 D5:1.5:.5 C5:2:1 A4:3:1 Bb4:4:.5 A4:4.5:.5 G4:5:1 A4:6:2 Bb2+F3:0:4:.4 A2+E3:4:4:.4')];
    every(P,2,13,20,(P,t)=>{ phrase(P,P.pos[3],t,66,pick(ph),'sv',T_ACC); }); },
  london(P){ stationBase(P,{crowd:.7,steps:.8,train:[16,28],trainFirst:4});
    const rumble=bed(P,P.pos[4],'lowpass',70,.8,.12); lfo(P,rumble.g.gain,.05,.06);
    bed(P,P.pos[2],'highpass',3500,.5,.006);
    every(P,.1,.08,.5,(P,t)=>blip(P,anyPos(P),t,'sine',rnd(900,2400),.05,rnd(.02,.06),rnd(2400,3800)));
    const ch=[['E3','B3','E4','G4','B4'],['C3','G3','C4','E4','G4'],['G2','D3','G3','B3','D4'],['D3','A3','D4','F#4','A4']].map(c=>c.map(midi));
    every(P,1.5,22,32,(P,t)=>{ const d=P.pos[3],b=60/92; ch.forEach((c,ci)=>[0,1,1.5,2.5,3].forEach((s,k)=>later(P,t+(ci*4+s)*b,(P,x)=>{ const up=k%2===1,ns=up?c.slice().reverse():c; ns.forEach((m,i)=>INST.sv(P,d,x+i*.016,hz(m)*pitch(P,x),.45,up?.5:.75,T_PLUCK)); }))); });
    every(P,7,25,40,(P,t)=>{ INST.bell(P,P.pos[4],t,hz(79)*pitch(P,t),1,.8,{ratio:2,idx:1.2,dec:1.8,amp:.18}); INST.bell(P,P.pos[4],t+.55,hz(75)*pitch(P,t),1,.8,{ratio:2,idx:1.2,dec:2.2,amp:.18}); }); },
  naples(P){ stationBase(P,{crowd:.8,steps:.7});
    for(const [hz1,c] of [[.09,700],[.13,1100]]){ const w=bed(P,P.pos[2+(c>900?1:0)],'lowpass',c,.6,.05); lfo(P,w.g.gain,hz1,.045); lfo(P,w.f.frequency,hz1,c*.4); }
    every(P,3,6,14,(P,t)=>{ const ac=P.ac,dur=rnd(2.5,4),pf=pitch(P,t),o=O(ac,'sawtooth',70*pf),am=O(ac,'square',35*pf),ag=G(ac,.5),bp=F(ac,'bandpass',900,1),g=G(ac,0),pn=PAN(ac,-1),f0=rnd(65,85)*pf;
      o.frequency.setValueAtTime(f0,t); o.frequency.linearRampToValueAtTime(f0*1.8,t+dur*.45); o.frequency.linearRampToValueAtTime(f0*1.3,t+dur);
      am.frequency.setValueAtTime(f0/2,t); am.frequency.linearRampToValueAtTime(f0*.9,t+dur*.45); am.frequency.linearRampToValueAtTime(f0*.65,t+dur);
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.05,t+dur*.4); g.gain.linearRampToValueAtTime(0,t+dur);
      const s=Math.random()<.5?1:-1; pn.pan.setValueAtTime(-s,t); pn.pan.linearRampToValueAtTime(s,t+dur);
      chain(am,ag,g.gain); chain(o,bp,g,pn,P.pos[4]); o.start(t); am.start(t); V(P,[o,am],[ag,bp,g,pn],t+dur); });
    const ph=[M('E5:0:1 F5:1:.5 E5:1.5:.5 D5:2:1 G5:3:2 F5:5:1 E5:6:.5 D5:6.5:.5 C5:7:2'),M('C5:0:.5 E5:.5:.5 G5:1:1.5 A5:2.5:.5 G5:3:1 F5:4:1 E5:5:1 D5:6:1 E5:7:2')];
    every(P,5,16,24,(P,t)=>phrase(P,P.pos[2],t,84,pick(ph),'sv',T_MAND)); },
  rio(P){ stationBase(P,{crowd:.6,steps:.5});
    const w=bed(P,P.pos[2],'lowpass',800,.6,.06); lfo(P,w.g.gain,.08,.05); lfo(P,w.f.frequency,.08,400);
    every(P,4,5,12,(P,t)=>{ const d=P.pos[3]; for(let i=0,n=2+(Math.random()*3|0);i<n;i++) later(P,t+i*rnd(.35,.5),(P,x)=>{ const ac=P.ac,pf=pitch(P,x),o=O(ac,'sawtooth',1300*pf),bp=F(ac,'bandpass',1800,4),g=G(ac,0);
      o.frequency.setValueAtTime(1250*pf,x); o.frequency.linearRampToValueAtTime(2100*pf,x+.08); o.frequency.linearRampToValueAtTime(1150*pf,x+.32);
      g.gain.setValueAtTime(0,x); g.gain.linearRampToValueAtTime(.05,x+.04); g.gain.linearRampToValueAtTime(0,x+.33); chain(o,bp,g,d); o.start(x); V(P,[o],[bp,g],x+.34); }); });
    const TB=parseDr('x.xx.x.xx.x.x.xx');
    every(P,1,18,26,(P,t)=>{ const d=P.pos[2],s=60/100/4; for(let i=0;i<16*8;i++) later(P,t+i*s,(P,x)=>{ const q=i%16;
      if(q===8) DR.tom(P,d,x,.8,{f:68,dec:.6,sweep:1.3}); else if(q===0) DR.tom(P,d,x,.35,{f:68,dec:.15,sweep:1.2});
      if(TB[q]) DR.tom(P,d,x,.35,{f:640,dec:.05,sweep:1.1,nz:.3,nzf:4000}); DR.shaker(P,d,x,q%4===2?.5:.25,{}); }); }); },
  vegas(P){ stationBase(P,{crowd:1.1,steps:.8});
    const h=hum(P,P.pos[4],'sawtooth',120,.006); const hf=F(P.ac,'bandpass',360,2); h.disconnect(); chain(h,hf,P.pos[4]); P.keep.push(hf);
    every(P,1.5,3,7,(P,t)=>{ const d=anyPos(P),root=72+(Math.random()*7|0),iv=[0,4,7,12,16,19,24,19,24,28]; for(let i=0;i<iv.length;i++) toneOn(P,d,t+i*.055,'square',hz(root+iv[i]),.045,.012); });
    every(P,6,6,14,(P,t)=>{ const d=anyPos(P); let tt=t; for(let i=0,n=12+(Math.random()*18|0);i<n;i++){ tt+=rnd(.02,.08); later(P,tt,(P,x)=>INST.bell(P,d,x,rnd(2800,5600)*pitch(P,x),.1,.7,{ratio:2.7,idx:1,dec:.1,amp:.05})); } });
    const lounge=M('F3+Ab3+C4+Eb4:0:2:.5 G4:0:1 Ab4:1:1 Bb4:1.5:.5 D3+Ab3+C4+F4:2:2:.5 C5:2:1.5 Bb4:3.5:.5 G3+Bb3+D4+F4:4:4:.5 G4:4:1 F4:5:1 D4:6:2');
    every(P,2,16,24,(P,t)=>phrase(P,P.pos[3],t,80,lounge,'ep',{idx:1.4,dec:.8,amp:.28})); }
};

/* ---------- rumble: interior bed, sway hum, double clack over rail joints ---------- */
function rumblePlayer(s,fade){ const P=newPlayer(s,'rumble','rumble',fade,.26),ac=s.ac,t0=ac.currentTime;
  const n=NZ(P),l1=F(ac,'lowpass',85,.9),g1=G(ac,.5),l2=F(ac,'bandpass',190,.8),g2=G(ac,.07); n.connect(l1); chain(l1,g1,P.out); n.connect(l2); chain(l2,g2,P.out); n.start(t0,Math.random()*3); keep(P,n,l1,g1,l2,g2);
  const h=O(ac,'sine',46),hg=G(ac,.05),h2=O(ac,'triangle',92),h2g=G(ac,.012); chain(h,hg,P.out); chain(h2,h2g,P.out); h.start(t0); h2.start(t0); keep(P,h,hg); keep(P,h2,h2g);
  lfo(P,hg.gain,.23,.03); lfo(P,g1.gain,.17,.15);
  const clack=(P,t,v)=>{ const [a,b,c]=nzHit(P,P.out,t,'bandpass',900,1.2,v,.045); V(P,[a],[b,c],t+.05); blip(P,P.out,t,'sine',75,.07,v*1.1,52); };
  every(P,.4,1.6,1.9,(P,t)=>{ for(const [dt,v] of [[0,.16],[.1,.13],[.48,.15],[.58,.12]]) clack(P,t+dt+rnd(0,.006),v); });
  return P; }
const AMB_LVL={tokyo:.93,tokyonight:1,hongkong:1.6,baikal:.68,london:.5,naples:.66,rio:.65,vegas:.5};
function ambiencePlayer(s,key,fade){ const fn=AMB[key]; if(!fn) return null; const P=newPlayer(s,'ambience',key,fade,.8*(AMB_LVL[key]||1)); fn(P); return P; }
function make(s,kind,key,fade){ if(kind==='music') return musicPlayer(s,key,fade); if(kind==='ambience') return ambiencePlayer(s,key,fade); if(kind==='rumble') return rumblePlayer(s,fade); return null; }

/* ---------- realtime control ---------- */
let R=null,timer=0; const cur={music:null,ambience:null,rumble:null},fading=new Set();
function getRig(){ const ac=typeof audio==='function'?audio():null; if(!ac) return null; if(!R||R.ac!==ac) R=rig(ac); return R; }
function dispose(P){ if(P.dead) return; P.dead=true; fading.delete(P); for(const o of P.keepSrc){ try{ o.stop(); }catch(e){} try{ o.disconnect(); }catch(e){} } for(const n of P.keep){ try{ n.disconnect(); }catch(e){} } try{ P.out.disconnect(); P.rv&&P.rv.disconnect(); }catch(e){} P.later=[]; P.ev=[]; }
function fadeOut(P,dur){ const now=P.ac.currentTime; for(const g of P.fades){ g.cancelScheduledValues(now); g.setValueAtTime(g.value,now); g.linearRampToValueAtTime(0,now+dur); } P.stopAt=now+dur; fading.add(P); setTimeout(()=>dispose(P),(dur+5)*1000); }
function tickAll(){ if(!R) return; const now=R.ac.currentTime,hor=now+.15; let any=false;
  for(const P of [cur.music,cur.ambience,cur.rumble,...fading]){ if(!P||P.dead) continue; any=true; if(P.spec&&P.nt<now-.1) P.nt=now+.02; try{ tickPlayer(P,hor); }catch(e){ console.warn('MUSIC tick',e); } }
  if(!any){ clearInterval(timer); timer=0; } }
function swap(kind,key){ const s=getRig(); if(!s) return; const old=cur[kind]; if(old&&!old.dead&&old.key===key) return;
  if(old){ fadeOut(old,1.5); cur[kind]=null; }
  if(key!=null){ const P=make(s,kind,key,1.5); if(!P) console.warn('MUSIC: unknown '+kind+' key',key); cur[kind]=P; if(P&&!s.offline&&SL.on) applySlowTo(P,true,s.ac.currentTime); }
  if(!timer){ timer=setInterval(tickAll,25); } tickAll(); }
function applySlowTo(P,on,now){ for(const p of P.cont){ p.cancelScheduledValues(now); p.setValueAtTime(p.value,now); p.linearRampToValueAtTime(on?SLOW_CENTS:0,now+SLOW_RAMP); } }
function setSlow(on){ on=!!on; const s=getRig(); if(!s){ SL.on=on; return; } const now=s.ac.currentTime; if(on===SL.on) return;
  SL.from=curAmt(now); SL.on=on; SL.t=now;
  for(const k of ['music','ambience']){ const f=s.L[k].lp.frequency; f.cancelScheduledValues(now); f.setValueAtTime(Math.max(40,f.value),now); f.exponentialRampToValueAtTime(on?(k==='music'?1100:1500):20000,now+SLOW_RAMP); }
  for(const P of [cur.music,cur.ambience,...fading]) if(P&&P.kind!=='rumble') applySlowTo(P,on,now); }
function curAmt(now){ const k=Math.min(1,Math.max(0,(now-SL.t)/SLOW_RAMP)); return SL.on?SL.from+(1-SL.from)*k:SL.from*(1-k); }

return {
  play:key=>swap('music',key),
  ambience:key=>swap('ambience',key),
  rumble:on=>swap('rumble',on?'rumble':null),
  setVolumes(v){ v=v||{}; for(const k of ['music','ambience','rumble']) if(typeof v[k]==='number'){ VOL[k]=Math.max(0,Math.min(1,v[k])); if(R) R.L[k].vol.gain.setTargetAtTime(VOL[k],R.ac.currentTime,.05); } },
  mute(m){ muted=!!m; if(R) R.master.gain.setTargetAtTime(muted?0:1,R.ac.currentTime,.05); },
  setSlow,
  stats(){ let voices=0,nodes=0; const ps=[cur.music,cur.ambience,cur.rumble,...fading].filter(p=>p&&!p.dead); for(const p of ps){ voices+=p.live; nodes+=p.nodes; }
    return {voices,nodes,track:cur.music?cur.music.key:null,ambience:cur.ambience?cur.ambience.key:null,rumble:!!cur.rumble,slow:SL.on}; },
  tracks:()=>Object.keys(TRACKS), stations:()=>Object.keys(AMB),
  _renderOffline(kind,key,seconds=12){ const sr=44100,ac=new OfflineAudioContext(2,Math.ceil(sr*seconds),sr),s=rig(ac,true),P=make(s,kind,key,.02);
    if(!P) return Promise.reject(new Error('MUSIC: unknown '+kind+' '+key));
    /* walk the same scheduler in 0.5 s chunks so the later-queue fires in order */
    for(let t=0;t<seconds;t+=.5) tickPlayer(P,Math.min(seconds,t+.5));
    return ac.startRendering().then(buf=>{ buf._voicesPeakHint=P.live; return buf; }); },
  _lint(){ for(const k of Object.keys(TRACKS)) build(TRACKS[k],k); return {warnings:WARN.slice(),loops:Object.fromEntries(Object.keys(TRACKS).map(k=>[k,+TRACKS[k]._b.loopSec.toFixed(1)]))}; }
};
})();
