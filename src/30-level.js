/* =====================================================================
   THE LEVEL: whatever you are standing in right now, one train car or one station platform, built on demand
   from the art set and turned into something you can play in:
   - bounds: the level is the box -RX..RX by -RZ..RZ, RH high (a car is 28 x 8.8 x 3.4; a platform is 64 x 10);
   - colliders: every prop you could walk into becomes an axis-aligned box, read off the built geometry;
   - a nav grid (0.5 m cells) for the people hunting you;
   - one mesh per texture: the hundreds of boxes a car is built from are baked into a few big meshes
     (colour goes per vertex), so the Quest draws a car in tens of calls instead of thousands.
     Anything that moves (fish, the roulette wheel, steam, the LED canopy) is found by running the
     level's animations once and left as it is.
   ===================================================================== */
let RX=14,RZ=4.4,RH=3.4,NX=57,NZ=36;
const cellX=i=>-RX+i*.5, cellZ=k=>-RZ+k*.5;
const BOXES=[];                       /* {x0,x1,z0,z1,y0,h,kind} axis-aligned, y from y0 to h */
const FLOOR={n:1,test:false,mode:'meridian',nav:null,space:null,units:[],doors:[],lights:[],start:{x:-12.6,z:0,yaw:-Math.PI/2},flick:null,bx:99,party:[],seats:[],beds:[],furn:[],stairUp:null};
let NAVD=new Int32Array(NX*NZ), BG_W=28, BG_H=9, boxGrid=null, boxGridDirty=true;
function setBounds(rx,rz,rh){ RX=rx; RZ=rz; RH=rh; NX=Math.round(rx*4)+1; NZ=Math.round(rz*4)+1; BG_W=Math.ceil(rx*2); BG_H=Math.ceil(rz*2); NAVD=new Int32Array(NX*NZ); boxGridDirty=true; navDirty=true; }
const tCrate=tex(16,16,'#7a5e3a',g=>{ for(let y=0;y<16;y+=4) R(g,'#5a4428',0,y,16,1); });

function addBox(x0,x1,z0,z1,y0,h,kind){ const b={x0:Math.min(x0,x1),x1:Math.max(x0,x1),z0:Math.min(z0,z1),z1:Math.max(z0,z1),y0,h,kind}; BOXES.push(b); boxGridDirty=true; return b; }
function removeBox(b){ const i=BOXES.indexOf(b); if(i>=0) BOXES.splice(i,1); boxGridDirty=true; }
/* boxes bucketed on a 1 m grid so a body, a blood drop or the player only tests the few boxes around it */
function buildBoxGrid(){ boxGrid=Array.from({length:BG_W*BG_H},()=>[]);
  for(const b of BOXES){ const i0=Math.max(0,Math.floor(b.x0-.3+RX)),i1=Math.min(BG_W-1,Math.floor(b.x1+.3+RX)),k0=Math.max(0,Math.floor(b.z0-.3+RZ)),k1=Math.min(BG_H-1,Math.floor(b.z1+.3+RZ));
    for(let k=k0;k<=k1;k++) for(let i=i0;i<=i1;i++) boxGrid[k*BG_W+i].push(b); }
  boxGridDirty=false; }
const NO_BOXES=[];
function boxesAt(x,z){ if(boxGridDirty) buildBoxGrid(); const i=Math.floor(x+RX),k=Math.floor(z+RZ); return i<0||k<0||i>=BG_W||k>=BG_H?NO_BOXES:boxGrid[k*BG_W+i]; }

/* ---------- doors: the train has none that swing; kept so the shared code can ask ---------- */
function setDoor(){ } function updateDoors(){ } function doorNear(){ return null; }

/* ---------- collision queries ---------- */
function solidFor(b,who){ /* what blocks whom: the player and walking people step over low things and ignore what is above their heads */
  if(who==='body') return true;
  if(b.kind==='step') return false;
  return b.y0<1.6&&b.h>.4; }
function pushOutXZ(p,r,who){ /* push a circle (x,z) out of the boxes around it */
  for(let pass=0;pass<2;pass++) for(const b of boxesAt(p[0],p[1])){ if(!solidFor(b,who)) continue;
    if(p[0]>b.x0-r&&p[0]<b.x1+r&&p[1]>b.z0-r&&p[1]<b.z1+r){ const pens=[p[0]-(b.x0-r),(b.x1+r)-p[0],p[1]-(b.z0-r),(b.z1+r)-p[1]],m=pens.indexOf(Math.min(...pens));
      if(m===0) p[0]=b.x0-r; else if(m===1) p[0]=b.x1+r; else if(m===2) p[1]=b.z0-r; else p[1]=b.z1+r; } }
  p[0]=clamp(p[0],-RX+r,RX-r); p[1]=clamp(p[1],-RZ+r,RZ-r); }
function rayBoxes(o,d,maxT,filter){ let best=null; if(boxGridDirty) buildBoxGrid();
  for(const b of BOXES){ if(filter&&!filter(b)) continue; let t0=0,t1=best?best.t:maxT; const lo=[b.x0,b.y0,b.z0],hi=[b.x1,b.h,b.z1]; let nrm=null,ok=true;
    for(let k=0;k<3;k++){ if(Math.abs(d[k])<1e-9){ if(o[k]<lo[k]||o[k]>hi[k]){ ok=false; break; } continue; }
      let ta=(lo[k]-o[k])/d[k],tb=(hi[k]-o[k])/d[k],sg=-1; if(ta>tb){ [ta,tb]=[tb,ta]; sg=1; }
      if(ta>t0){ t0=ta; nrm=[0,0,0]; nrm[k]=sg; } if(tb<t1) t1=tb; if(t0>t1){ ok=false; break; } }
    if(ok&&nrm&&(!best||t0<best.t)) best={t:t0,n:nrm,b}; }
  return best; }
function rayRoom(o,d){ let best={t:1e9,n:[0,1,0]};
  const tryP=(k,v,n)=>{ if(Math.abs(d[k])<1e-9) return; const t=(v-o[k])/d[k]; if(t>0&&t<best.t) best={t,n}; };
  tryP(0,-RX,[1,0,0]); tryP(0,RX,[-1,0,0]); tryP(2,-RZ,[0,0,1]); tryP(2,RZ,[0,0,-1]); tryP(1,0,[0,1,0]); tryP(1,RH,[0,-1,0]);
  const bx=rayBoxes(o,d,best.t); return bx&&bx.t<best.t?bx:best; }
/* can a see b? tall things block sight, furniture below chest height doesn't */
function sightClear(a,b){ const d=v3.sub(b,a),L=Math.hypot(...d); if(L<1e-3) return true; const h=rayBoxes(a,v3.sc(d,1/L),L,x=>x.kind==='wall'||x.h>1.5); return !h; }

/* ---------- navigation: one distance field from the player, shared by everyone hunting him ---------- */
let navDirty=true,navT=0;
const navCell=(x,z)=>{ const i=Math.round((x+RX)*2),k=Math.round((z+RZ)*2); return (i<0||k<0||i>=NX||k>=NZ)?-1:k*NX+i; };
function navUpdate(dt,tx,tz){ navT-=dt; if(navT>0&&!navDirty) return; navT=.25; navDirty=false; const nav=FLOOR.nav; if(!nav) return;
  NAVD.fill(1e9); let src=navCell(tx,tz); if(src<0) return;
  if(nav[src]){ let bd=1e9,bs=-1; for(let k=-2;k<=2;k++) for(let i=-2;i<=2;i++){ const c=src+k*NX+i; if(c>=0&&c<nav.length&&!nav[c]&&i*i+k*k<bd){ bd=i*i+k*k; bs=c; } } if(bs<0) return; src=bs; }
  const buckets=[[src]]; NAVD[src]=0;
  for(let dd=0;dd<buckets.length;dd++){ const q=buckets[dd]; if(!q) continue;
    for(const c of q){ if(NAVD[c]!==dd) continue; const ci=c%NX,ck=(c-ci)/NX;
      for(let k=-1;k<=1;k++) for(let i=-1;i<=1;i++){ if(!i&&!k) continue; const ni=ci+i,nk=ck+k; if(ni<0||nk<0||ni>=NX||nk>=NZ) continue; const nc=nk*NX+ni; if(nav[nc]) continue;
        if(i&&k&&(nav[ck*NX+ni]||nav[nk*NX+ci])) continue; const nd=dd+(i&&k?14:10); if(nd<NAVD[nc]){ NAVD[nc]=nd; (buckets[nd]||(buckets[nd]=[])).push(nc); } } } } }
function lineClearNav(x0,z0,x1,z1){ const L=Math.hypot(x1-x0,z1-z0),n=Math.ceil(L/.2); for(let s=1;s<n;s++){ const c=navCell(x0+(x1-x0)*s/n,z0+(z1-z0)*s/n); if(c<0||FLOOR.nav[c]) return false; } return true; }
function navDir(x,z,tx,tz){
  if(!FLOOR.nav||lineClearNav(x,z,tx,tz)) return norm3([tx-x,0,tz-z]);
  let c=navCell(x,z); if(c<0) return norm3([tx-x,0,tz-z]);
  if(NAVD[c]>=1e9){ let bd=1e9; for(let k=-1;k<=1;k++) for(let i=-1;i<=1;i++){ const q=c+k*NX+i; if(q>=0&&q<NAVD.length&&NAVD[q]<bd){ bd=NAVD[q]; c=q; } } if(bd>=1e9) return norm3([tx-x,0,tz-z]); }
  let cur=c,aim=null; for(let step=0;step<6;step++){ const ci=cur%NX,ck=(cur-ci)/NX; let best=cur,bd=NAVD[cur];
    for(let k=-1;k<=1;k++) for(let i=-1;i<=1;i++){ const ni=ci+i,nk=ck+k; if(ni<0||nk<0||ni>=NX||nk>=NZ) continue; const q=nk*NX+ni; if(NAVD[q]<bd){ bd=NAVD[q]; best=q; } }
    if(best===cur) break; cur=best; const bxp=cellX(cur%NX),bzp=cellZ((cur-cur%NX)/NX); if(lineClearNav(x,z,bxp,bzp)) aim=[bxp,bzp]; else if(aim) break; else { aim=[bxp,bzp]; break; } }
  if(!aim) return norm3([tx-x,0,tz-z]); const d=norm3([aim[0]-x,0,aim[1]-z]); return Math.hypot(d[0],d[2])>1e-4?d:norm3([tx-x,0,tz-z]); }
/* a free spot (open cells all round), at least minD from the player, that pred(x,z) likes */
function freeSpot(pred,minD=4){ if(!FLOOR.nav) return null; for(let tries=0;tries<500;tries++){ const i=Math.random()*NX|0,k=Math.random()*NZ|0,id=k*NX+i; if(FLOOR.nav[id]) continue;
    const x=cellX(i),z=cellZ(k); let ok=true; for(let a=-1;a<=1&&ok;a++) for(let b=-1;b<=1;b++){ const q=id+a*NX+b; if(q<0||q>=FLOOR.nav.length||FLOOR.nav[q]){ ok=false; break; } }
    if(!ok||Math.hypot(x-PL.x,z-PL.z)<minD||!pred(x,z,0)) continue; if(enemies.some(E=>Math.hypot(E.pos[0]-x,E.pos[1]-z)<.9)) continue; return {x,z}; } return null; }

/* ---------- reading a built level ---------- */
const LEVEL={kind:null,key:null,root:null,anim:[],texs:new Set(),stats:{}};
function walkMeshes(n,cb){ if(n.mesh) cb(n); for(const k of n.kids) walkMeshes(k,cb); }
function worldAABB(n){ const b=geoBounds(n.mesh.geo); if(!n.mesh.geo.aabb){ const P=n.mesh.geo.P; let lo=[1e9,1e9,1e9],hi=[-1e9,-1e9,-1e9]; for(let i=0;i<P.length;i+=3) for(let c=0;c<3;c++){ if(P[i+c]<lo[c]) lo[c]=P[i+c]; if(P[i+c]>hi[c]) hi[c]=P[i+c]; } n.mesh.geo.aabb=[lo,hi]; }
  const [lo,hi]=n.mesh.geo.aabb,W=n.world,a=[1e9,1e9,1e9],z=[-1e9,-1e9,-1e9];
  for(let c=0;c<8;c++){ const p=[c&1?hi[0]:lo[0],c&2?hi[1]:lo[1],c&4?hi[2]:lo[2]],q=mulP(W,p); for(let k=0;k<3;k++){ if(q[k]<a[k]) a[k]=q[k]; if(q[k]>z[k]) z[k]=q[k]; } }
  return [a,z]; }
/* run the level's animations a few times and see what they move or re-colour: that stays live, the rest gets baked */
function findDynamic(root,anims){ const snapN=new Map(),snapM=new Map(),key=n=>n.p.join()+'|'+n.r.join()+'|'+n.s.join()+'|'+n.vis;
  const all=[]; (function w(n){ all.push(n); for(const k of n.kids) w(k); })(root);
  for(const n of all){ snapN.set(n,key(n)); if(n.mesh) for(const m of n.mesh.mats) if(!snapM.has(m)) snapM.set(m,[m.tex,m.rep.join(),m.color.join(),m.emis.join()].join('|')); }
  for(const t of [.37,1.91,5.3,9.7]) for(const f of anims){ try{ f(t); }catch(_){} }
  const dyn=new Set(), dynMat=new Set(); for(const [m,s] of snapM) if([m.tex,m.rep.join(),m.color.join(),m.emis.join()].join('|')!==s) dynMat.add(m);
  const mark=n=>{ dyn.add(n); for(const k of n.kids) mark(k); };
  for(const n of all){ if(dyn.has(n)) continue; if(snapN.get(n)!==key(n)||(n.mesh&&n.mesh.mats.some(m=>dynMat.has(m)))) mark(n); }
  return dyn; }
/* every static prop you could walk into, as a box */
function collidersFrom(root,dyn,area){ let n0=0;
  walkMeshes(root,n=>{ if(dyn.has(n)||n.noCollide) return; const [a,z]=worldAABB(n); let sx=z[0]-a[0],sy=z[1]-a[1],sz=z[2]-a[2];
    if(z[1]<.12||a[1]>1.85) return;                     /* on the floor (rugs, strips) or overhead */
    if(sx<.07&&sz<.07) return;                           /* thin poles */
    if(sy<.025) return;                                  /* flat: floors, ceilings, rugs */
    if(sx*sz>area*.4) return;                            /* something the size of the room */
    let x0=a[0],x1=z[0],z0=a[2],z1=z[2];
    if(sx<.05){ x0-=.05; x1+=.05; } if(sz<.05){ z0-=.05; z1+=.05; } /* a hanging panel or partition: give it thickness */
    if(Math.max(Math.abs(x0),Math.abs(x1))>RX+.2&&Math.min(Math.abs(x0),Math.abs(x1))>RX-.15) return; /* the level's own end walls */
    if(Math.max(Math.abs(z0),Math.abs(z1))>RZ+.2&&Math.min(Math.abs(z0),Math.abs(z1))>RZ-.15) return;
    const low=z[1]<.5&&a[1]<.06&&(x1-x0)*(z1-z0)>1.5; /* a stage, a pool basin: low and wide, you step onto it */
    addBox(x0,x1,z0,z1,Math.max(0,a[1]),z[1],low?'step':z[1]>1.5?'wall':'furn'); n0++; });
  return n0; }
/* ---------- the painted look: PS1 games baked their light into the vertices of finely cut geometry. Big flat faces
   are cut into ~0.6 m pieces (only along edges that are long, so neighbours always agree and nothing cracks), then
   every vertex gets a painted shade: dark where things meet the floor, soft shadows under tables and booths, darker
   corners and floor edges, lighter tops. The real lamps still light it per vertex, so now they make pools. ---------- */
function tessellate(ch,maxE){ const m2=maxE*maxE, P=ch.P,Nm=ch.Nm,T=ch.T,C=ch.C; let I=ch.I;
  for(let pass=0;pass<7;pass++){ const cache=new Map(), out=[]; let any=false;
    const sp=(a,b)=>{ const dx=P[a*3]-P[b*3],dy=P[a*3+1]-P[b*3+1],dz=P[a*3+2]-P[b*3+2]; if(dx*dx+dy*dy+dz*dz<=m2) return -1;
      const key=a<b?a*4194304+b:b*4194304+a; let m=cache.get(key); if(m!==undefined) return m; m=P.length/3;
      for(let k=0;k<3;k++) P.push((P[a*3+k]+P[b*3+k])/2); const n=norm3([Nm[a*3]+Nm[b*3],Nm[a*3+1]+Nm[b*3+1],Nm[a*3+2]+Nm[b*3+2]]); Nm.push(n[0],n[1],n[2]);
      T.push((T[a*2]+T[b*2])/2,(T[a*2+1]+T[b*2+1])/2); for(let k=0;k<3;k++) C.push((C[a*3+k]+C[b*3+k])/2); cache.set(key,m); any=true; return m; };
    for(let i=0;i<I.length;i+=3){ let a=I[i],b=I[i+1],c=I[i+2]; let ab=sp(a,b),bc=sp(b,c),ca=sp(c,a); const n=(ab>=0)+(bc>=0)+(ca>=0);
      if(n===0){ out.push(a,b,c); continue; }
      if(n===3){ out.push(a,ab,ca, ab,b,bc, ca,bc,c, ab,bc,ca); continue; }
      /* rotate so the split pattern starts at edge a-b */
      for(let r=0;r<3&&!(ab>=0&&(n===1||bc>=0));r++){ [a,b,c]=[b,c,a]; [ab,bc,ca]=[bc,ca,ab]; }
      if(n===1) out.push(a,ab,c, ab,b,c);
      else out.push(ab,b,bc, a,ab,bc, a,bc,c); }
    I=out; if(!any) break; }
  ch.I=I; ch.n=P.length/3; }
function bakeShade(ch,boxes,paint){ const P=ch.P,Nm=ch.Nm,C=ch.C,n=P.length/3, ss=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
  for(let v=0;v<n;v++){ const x=P[v*3],y=P[v*3+1],z=P[v*3+2],ny=Nm[v*3+1]; let ao=paint?1.1:1;
    const dWall=Math.min(RZ-Math.abs(z),RX-Math.abs(x));
    if(ny>.6){ /* floors and tops: shadow under anything standing on or over them, darker toward the walls */
      let sh=0; for(const b of boxes){ if(b.h<y+.08||b.y0>y+1.4) continue; const dx=Math.max(b.x0-x,0,x-b.x1),dz=Math.max(b.z0-z,0,z-b.z1),d=Math.hypot(dx,dz),r=.18+(b.y0-y)*.35,k=(1-ss(0,1.5,b.y0-y))*.5+.12;
        if(d<r) sh=Math.max(sh,k*(1-ss(0,r,d))); }
      ao*=1-Math.min(.55,sh); if(y<.3) ao*=.72+.28*ss(0,.9,dWall); }
    else if(ny<-.6){ ao*=.62+.25*ss(0,1.2,y); } /* undersides: tables, shelves, the ceiling a little */
    else { ao*=.66+.34*ss(0,.85,y); ao*=1-.16*ss(RH-.7,RH,y); ao*=.86+.14*ss(0,.5,RX-Math.abs(x)); }
    C[v*3]*=ao; C[v*3+1]*=ao; C[v*3+2]*=ao; } }
/* one greyscale paint layer for everything that was a flat colour: light from above, soft dark bevels at the edges, a breath of brush grain */
const PAINT=tex(64,64,null,g=>{ const I=g.createImageData(64,64),r=rng(4242);
  for(let y=0;y<64;y++) for(let x=0;x<64;x++){ const e=Math.min(x,63-x,y,63-y)/64; let v=.9+.1*(1-y/63);
    if(e<.07) v*=.8+.2*(e/.07); if(y<2) v=Math.min(1,v*1.06); v+=(r()-.5)*.035+(Math.sin(x*.4+y*.13)*.008);
    const c=Math.round(Math.min(1,Math.max(0,v))*255),i=(y*64+x)*4; I.data[i]=I.data[i+1]=I.data[i+2]=c; I.data[i+3]=255; }
  g.putImageData(I,0,0); });
/* bake the static meshes: one geometry per (texture, emissive, unlit, cut, two-sided), colour per vertex, UV repeat baked in */
const texIds=new WeakMap(); let texIdN=1; const texId=t=>{ if(!t) return 0; if(!texIds.has(t)) texIds.set(t,texIdN++); return texIds.get(t); };
function mergeStatic(root,dyn,out){ const groups=new Map(); let merged=0;
  walkMeshes(root,n=>{ if(dyn.has(n)||n.noMerge||n.mesh.geo.noCull||!n.vis||!visibleUp(n)) return; const g=n.mesh.geo,W=n.world;
    const [a,z]=worldAABB(n); if(z[1]<-.02&&LEVEL.kind==='car') { n.mesh=null; return; } /* under the floor: bogies, underframe */
    const nm=[W[0],W[1],W[2],W[4],W[5],W[6],W[8],W[9],W[10]];
    for(const run of runsOf(n.mesh)){ const m=run.m,paint=!m.tex&&!m.unlit&&GAME.paint!==false,k=texId(paint?PAINT:m.tex)+'|'+m.emis.join()+'|'+m.unlit+'|'+m.cut+'|'+m.dbl;
      let G=groups.get(k); if(!G){ G={m,chunks:[],paint}; groups.set(k,G); }
      let ch=G.chunks[G.chunks.length-1]; if(!ch||ch.n>40000){ ch={P:[],Nm:[],T:[],C:[],I:[],n:0}; G.chunks.push(ch); }
      const map=new Map(),col=m.color; let rep=m.rep;
      if(paint){ let um=0,vm=0; for(let i=run.start;i<run.start+run.count;i++){ const v=g.I[i]; um=Math.max(um,Math.abs(g.T[v*2])); vm=Math.max(vm,Math.abs(g.T[v*2+1])); } rep=[um>1.01?1/um:1,vm>1.01?1/vm:1]; } /* a flat colour gets one painted panel per surface, never a tile grid */
      for(let i=run.start;i<run.start+run.count;i++){ const v=g.I[i]; let o=map.get(v);
        if(o===undefined){ o=ch.n++; map.set(v,o); const x=g.P[v*3],y=g.P[v*3+1],zz=g.P[v*3+2];
          ch.P.push(W[0]*x+W[4]*y+W[8]*zz+W[12],W[1]*x+W[5]*y+W[9]*zz+W[13],W[2]*x+W[6]*y+W[10]*zz+W[14]);
          const nx=g.Nm[v*3],ny=g.Nm[v*3+1],nz=g.Nm[v*3+2],q=norm3([nm[0]*nx+nm[3]*ny+nm[6]*nz,nm[1]*nx+nm[4]*ny+nm[7]*nz,nm[2]*nx+nm[5]*ny+nm[8]*nz]);
          ch.Nm.push(q[0],q[1],q[2]); ch.T.push(g.T[v*2]*rep[0],g.T[v*2+1]*rep[1]); ch.C.push(col[0],col[1],col[2]); }
        ch.I.push(o); } }
    n.mesh=null; merged++; });
  let calls=0;
  const shadeBoxes=BOXES.filter(b=>b.kind!=="wall"||b.h-b.y0<2.2), lit=G=>!G.m.unlit&&!(G.m.emis[0]+G.m.emis[1]+G.m.emis[2]>.6)&&GAME.bake!==false;
  for(const G of groups.values()) for(const ch of G.chunks){ if(!ch.I.length) continue; if(lit(G)){ tessellate(ch,GAME.tessE||.6); bakeShade(ch,shadeBoxes,G.paint); } const geo=new Geo(); geo.P=ch.P; geo.Nm=ch.Nm; geo.T=ch.T; geo.C=ch.C; geo.I=ch.I; geo.temp=true; geo.groups=[{start:0,count:ch.I.length,mi:0}];
    const m=G.m; mk(geo,M(G.paint?PAINT:m.tex,{color:0xffffff,emissive:0,unlit:m.unlit,cut:m.cut,double:m.dbl}),out).mesh.mats[0].emis=m.emis.slice(); calls++; }
  return {merged,calls}; }
function visibleUp(n){ for(let p=n;p;p=p.par) if(!p.vis) return false; return true; }
function pruneEmpty(n){ n.kids=n.kids.filter(k=>pruneEmpty(k)); return !!n.mesh||n.kids.length>0||n.keepNode; }
function texturesOf(root,set){ walkMeshes(root,n=>{ for(const m of n.mesh.mats) if(m.tex) set.add(m.tex); }); }

function unloadLevel(){ const r=LEVEL.root; if(!r) return; const i=world.kids.indexOf(r); if(i>=0) world.kids.splice(i,1); disposeTree(r);
  for(const t of LEVEL.texs){ if(t.glt){ gl.deleteTexture(t.glt); t.glt=null; } } LEVEL.texs.clear();
  LEVEL.root=null; LEVEL.anim=[]; BOXES.length=0; boxGridDirty=true; FLOOR.nav=null; }
/* build a car or a station into the world as the level, with its bounds, colliders, nav grid and light */
function buildLevel(kind,key){ unloadLevel(); const t0=performance.now();
  GEO_TEMP=true; let src,anims,lamps,amb,zShift=0;
  if(kind==='car'){ CAR_BUILD[key](); widenCar(key); if(CAR_POST[key]) CAR_POST[key](); addCrewSpots(key); const W=WG[key]; src=W.g; anims=W.anim; setBounds(WL/2,WZ,WH); }
  else { STATION_BUILD[key](); if(STATION_POST[key]) STATION_POST[key](); addWallMap(key); const st=ST[key]; src=st.g; anims=st.anim; zShift=-(SZ1+PLAT_Z0)/2; setBounds(SL/2,(SZ1-PLAT_Z0)/2,Math.max(st.H0||4,4)); }
  GEO_TEMP=false;
  const i=world.kids.indexOf(src); if(i>=0) world.kids.splice(i,1);
  const root=N(world); root.add(src); src.par=root; src.vis=true; src.p[2]+=zShift; LEVEL.zShift=zShift; LEVEL.kind=kind; LEVEL.key=key; LEVEL.root=root; LEVEL.anim=anims||[];
  /* the art page hides each wall's dressing when the orbit camera is behind it; inside, you see every wall */
  (function showAll(n){ if(n!==src&&n.vis===false&&!n.keepHidden) n.vis=true; for(const k of n.kids) showAll(k); })(src);
  if(kind==='station'){ for(const c of src.kids) if(c.glow) c.glow.vis=true; }
  updateWorld(world,null);
  const dyn=findDynamic(src,LEVEL.anim); updateWorld(world,null);
  LEVEL.drops=kind==='station'?[ST[key].drop,ST[key].drop2].map(n=>n?[n.world[12],n.world[13],n.world[14]]:null):[];
  BOXES.length=0; const nCol=collidersFrom(src,dyn,(2*RX)*(2*RZ));
  texturesOf(src,LEVEL.texs);
  const baked=N(root); const st=mergeStatic(src,dyn,baked); pruneEmpty(src); texturesOf(baked,LEVEL.texs);
  /* nav: a cell is blocked if a solid box (with a little clearance) covers it */
  const nav=new Uint8Array(NX*NZ);
  for(const b of BOXES){ if(!(b.y0<1.5&&b.h>.3)||b.kind==='step') continue; const i0=Math.max(0,Math.ceil((b.x0-.22+RX)*2)),i1=Math.min(NX-1,Math.floor((b.x1+.22+RX)*2)),k0=Math.max(0,Math.ceil((b.z0-.22+RZ)*2)),k1=Math.min(NZ-1,Math.floor((b.z1+.22+RZ)*2));
    for(let k=k0;k<=k1;k++) for(let i=i0;i<=i1;i++) nav[k*NX+i]=1; }
  for(let k=0;k<NZ;k++) for(let i=0;i<NX;i++) if(Math.abs(cellX(i))>RX-.3||Math.abs(cellZ(k))>RZ-.3) nav[k*NX+i]=1;
  FLOOR.nav=nav; FLOOR.space=new Int16Array(NX*NZ); boxGridDirty=true; navDirty=true;
  LEVEL.stats={colliders:nCol,merged:st.merged,calls:st.calls,dynamic:dyn.size,ms:Math.round(performance.now()-t0)};
  return LEVEL; }
const PLAT_Z0=-1.55; /* the platform edge in station coordinates; the track side is off limits */
