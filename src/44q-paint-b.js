
/* =====================================================================================================
   PAINT KIT B · the dim sum, banya, pub, trattoria and aquarium cars. Painted surfaces (light and shade painted
   in, soft bevels, grain, weave, glaze) and one prop atlas per car, so a car full of small dressed things still
   costs one draw call for all of them. Box/cylinder/lathe UVs are remapped into an atlas cell; material colour
   tints per prop for free (it goes per vertex when the level is baked).
   ===================================================================================================== */
/* a painter with an explicit supersample (P2 drops to 1x above 200x200 units) */
function qPB(w,h,fn,S=2,gr=0,seed=1){ return tex(Math.round(w*S),Math.round(h*S),null,g=>{ g.scale(S,S); fn(g,w,h); g.setTransform(1,0,0,1,0,0); if(gr) grain(g,gr*.8,seed); }); }
/* atlas: items {k, fn(g,w,h), cw, ch} packed row by row into cells; returns {tex, r:{k:[u0,v0,u1,v1]}} */
function qAtlas(cell,cols,rows,items,S=2,gr=4,seed=7){ const W=cell*cols,H=cell*rows,place=[], occ=new Uint8Array(cols*rows);
  for(const it of items){ const cw=it.cw||1,ch=it.ch||1; let ok=false;
    for(let y=0;y+ch<=rows&&!ok;y++) for(let x=0;x+cw<=cols&&!ok;x++){ let free=true; for(let j=0;j<ch&&free;j++) for(let i=0;i<cw;i++) if(occ[(y+j)*cols+x+i]){ free=false; break; }
      if(free){ for(let j=0;j<ch;j++) for(let i=0;i<cw;i++) occ[(y+j)*cols+x+i]=1; place.push([it,x,y]); ok=true; } }
    if(!ok) console.warn('atlasB overflow',it.k); }
  const t=qPB(W,H,g=>{ for(const [it,x,y] of place){ const w=(it.cw||1)*cell,h=(it.ch||1)*cell; g.save(); g.translate(x*cell,y*cell); g.beginPath(); g.rect(0,0,w,h); g.clip(); it.fn(g,w,h); g.restore(); } },S,gr,seed);
  const r={}, eu=1.5/(W*S), ev=1.5/(H*S); for(const [it,x,y] of place){ const cw=it.cw||1,ch=it.ch||1; r[it.k]=[x/cols+eu,1-(y+ch)/rows+ev,(x+cw)/cols-eu,1-y/rows-ev]; }
  return {tex:t,r}; }
/* remap a geometry's 0..1 UVs into atlas rects: one rect, or one per group (box faces +x,-x,+y,-y,+z,-z; cylinder side,top,bottom) */
function qUV(geo,rc){ const done=new Uint8Array(geo.P.length/3), multi=Array.isArray(rc[0]);
  for(const gr of geo.groups){ const q=multi?(rc[gr.mi]||rc[0]):rc; for(let i=gr.start;i<gr.start+gr.count;i++){ const v=geo.I[i]; if(done[v]) continue; done[v]=1;
      const u=Math.min(1,Math.max(0,geo.T[v*2])),w=Math.min(1,Math.max(0,geo.T[v*2+1])); geo.T[v*2]=q[0]+(q[2]-q[0])*u; geo.T[v*2+1]=q[1]+(q[3]-q[1])*w; } }
  return geo; }
/* faces in box order from (side, front(+z), back(-z), top, bottom) */
const qF=(side,front=side,back=side,top=side,bottom=side)=>[side,side,top,bottom,front,back];
/* atlas box (base at y), atlas cylinder (centre at y), atlas lathe, atlas plane */
function qB(g,m,rc,x,y,z,w,h,d,ry=0,rx=0,rz=0){ return mk(qUV(box(w,h,d,{at:[0,h/2,0]}),rc),m,g,x,y,z,rx,ry,rz); }
function qC(g,m,rc,x,y,z,rt,rb,h,seg=12,rx=0,ry=0,rz=0,o={}){ return mk(qUV(cyl(rt,rb,h,seg,o),rc),m,g,x,y,z,rx,ry,rz); }
function qL(g,m,rc,rings,seg,x,y,z,rx=0,ry=0,rz=0,o={}){ return mk(qUV(lathe(rings,seg,o),rc),m,g,x,y,z,rx,ry,rz); }
function qPl(g,m,rc,x,y,z,w,h,rx=0,ry=0,rz=0){ return mk(qUV(plane(w,h),rc),m,g,x,y,z,rx,ry,rz); }
function qT(g,m,rc,R_,r,rs,ts,x,y,z,rx=0,ry=0,rz=0){ return mk(qUV(torus(R_,r,rs,ts),rc),m,g,x,y,z,rx,ry,rz); }
/* a long bar (rail, beam, cornice, strip) as one mesh of short boxes: the level baker cuts long faces finely and a 28 m box
   would come back as thousands of slivers; short pieces stay at 12 triangles each. Base at y; axis 'x' or 'z'; one node, one collider. */
function qBar(n,m,rc,x,y,z,len,h,d,axis='x',piece=.55){ const g=new Geo(), k=Math.max(1,Math.ceil(len/piece)), pl=len/k;
  for(let i=0;i<k;i++){ const b=qUV(axis==='x'?box(pl,h,d):box(d,h,pl),rc||[0,0,1,1]), base=g.P.length/3, off=-len/2+pl*(i+.5);
    for(let j=0;j<b.P.length;j+=3) g.P.push(b.P[j]+(axis==='x'?off:0),b.P[j+1]+h/2,b.P[j+2]+(axis==='z'?off:0)); g.Nm.push(...b.Nm); g.T.push(...b.T); for(const v of b.I) g.I.push(v+base); }
  g.groups.push({start:0,count:g.I.length,mi:0}); return mk(g,m,n,x,y,z); }
/* a run of half-round log along local x from x0 to x1, centre height y, flat side on the wall (z=0), bulging to +z.
   Cut into short pieces; the atlas cell rc spans `period` metres of log so the grain runs on across the pieces. */
function qLogGeo(x0,x1,y,rr,rc,seg=6,period=2.2){ const g=new Geo(), n=Math.max(1,Math.ceil((x1-x0)/(period/4)));
  for(let i=0;i<n;i++){ const xa=x0+i*period/4, xb=Math.min(x1,xa+period/4), u0=(i%4)/4, u1=u0+(xb-xa)/period, base=g.P.length/3;
    for(let j=0;j<=seg;j++){ const th=-Math.PI/2+j/seg*Math.PI, sy=Math.sin(th), cz=Math.cos(th), v=j/seg;
      for(const [xx,uu] of [[xa,u0],[xb,u1]]) g.v([xx,y+rr*sy,rr*cz],[0,sy,cz],[rc[0]+(rc[2]-rc[0])*uu,rc[1]+(rc[3]-rc[1])*v]); }
    for(let j=0;j<seg;j++){ const a=base+j*2; g.I.push(a,a+1,a+3,a,a+3,a+2); } }
  g.groups.push({start:0,count:g.I.length,mi:0}); return g; }
/* a puff of steam for a cut-out material: alpha is a smooth field (lumps minus noise) so the bilinear-filtered cut gives soft
   rounded blobs with holes through them, not a flat disc; light from above painted into the colour */
function qPuff(w,h,seed,dens=.5){ return tex(w,h,null,g=>{ const I=g.createImageData(w,h), q=rng(seed), L=[]; for(let i=0;i<6;i++) L.push([.3+q()*.4,.3+q()*.45,.12+q()*.14]);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const u=(x+.5)/w, v=(y+.5)/h; let f=0; for(const [cx,cy,r] of L){ const d=Math.hypot(u-cx,(v-cy)*.9)/r; f=Math.max(f,1-d*d); }
    const nz=.5+.5*fbm(u*9,v*9,seed,3), a=Math.max(0,Math.min(1,(f*(.45+dens)-nz*.7)*3+.32)), i=(y*w+x)*4, sh=Math.round(232-v*40+f*20);
    I.data[i]=sh; I.data[i+1]=sh; I.data[i+2]=Math.min(255,sh+6); I.data[i+3]=Math.round(a*255); }
  g.putImageData(I,0,0); }); }
/* development guard: report any geometry with NaN or far-off vertices (a mis-called helper) */
function qChk(g,key){ (function chk(n,path){ if(n.mesh){ const P=n.mesh.geo.P; let bad=0,mx=0; for(const v of P){ if(!isFinite(v)) bad++; else mx=Math.max(mx,Math.abs(v)); } if(bad||mx>20) console.warn('BADGEO',key,path,bad,mx,P.length); } if(!n.p.every(isFinite)||!n.r.every(isFinite)) console.warn('BADNODE',key,path); n.kids.forEach((k,i)=>chk(k,path+'/'+i)); })(g,'g'); }
/* dress an end door (e=-1 the way in, 1 the way out): two raised panels, a push plate and a handle on the side facing into the car */
function qDoor(g,m,rcP,rcH,e,top=true){ const n=N(g,e*WL/2,0,0,0,e<0?Math.PI/2:-Math.PI/2,0); qB(n,m,qF(rcP),0,.15,.09,.95,.95,.025); if(top) qB(n,m,qF(rcP),0,1.22,.09,.95,.92,.025);
  qB(n,m,rcH,.38,1.0,.105,.04,.3,.03); qB(n,m,rcH,.38,1.12,.13,.03,.03,.06); qB(n,m,rcH,0,0,.09,1.16,.12,.02); return qNC(n); }
/* turn a surface inside out (the inside of a bowl, a wok, a tub) */
function qFlip(geo){ for(let i=0;i<geo.I.length;i+=3){ const t=geo.I[i+1]; geo.I[i+1]=geo.I[i+2]; geo.I[i+2]=t; } for(let i=0;i<geo.Nm.length;i++) geo.Nm[i]=-geo.Nm[i]; return geo; }
/* a bowl: outside and inside from one profile [[y,r],...] bottom to top, wall thickness t */
function qBowl(g,m,rcOut,rcIn,prof,t,seg,x,y,z){ const n=N(g,x,y,z); mk(qUV(lathe(prof.map(([py,pr])=>[py,pr,pr]),seg,{capT:false}),rcOut),m,n); mk(qUV(qFlip(lathe(prof.map(([py,pr])=>[py+t,Math.max(.001,pr-t),Math.max(.001,pr-t)]),seg,{capT:false})),rcIn),m,n); return n; }
/* a slab with a round hole (a moon gate): in the local XY plane, x -hw..hw, y 0..H, hole centre (0,cy) radius r, depth d; UVs in metres */
function qHole(hw,H,cy,r,d,seg=48){ const g=new Geo(); const angs=[]; for(let i=0;i<seg;i++) angs.push(i/seg*Math.PI*2);
  for(const [cx,cy_] of [[hw,H],[-hw,H],[-hw,0],[hw,0]]) angs.push(Math.atan2(cy_-cy,cx)<0?Math.atan2(cy_-cy,cx)+Math.PI*2:Math.atan2(cy_-cy,cx)); angs.sort((a,b)=>a-b);
  const edge=a=>{ const dx=Math.cos(a),dy=Math.sin(a); let t=1e9; if(dx>1e-6) t=Math.min(t,hw/dx); if(dx<-1e-6) t=Math.min(t,-hw/dx); if(dy>1e-6) t=Math.min(t,(H-cy)/dy); if(dy<-1e-6) t=Math.min(t,-cy/dy); return [dx*t,cy+dy*t]; };
  for(const s of [1,-1]){ const z=s*d/2, base=g.P.length/3; angs.forEach(a=>{ const c=[Math.cos(a)*r,cy+Math.sin(a)*r], e=edge(a); g.v([c[0],c[1],z],[0,0,s],[c[0]*s,c[1]]); g.v([e[0],e[1],z],[0,0,s],[e[0]*s,e[1]]); });
    const n=angs.length; for(let i=0;i<n;i++){ const a=base+i*2,b=base+((i+1)%n)*2; if(s>0) g.I.push(a,b+1,b,a,a+1,b+1); else g.I.push(a,b,b+1,a,b+1,a+1); } }
  const base=g.P.length/3; for(let i=0;i<=seg;i++){ const a=i/seg*Math.PI*2, c=[Math.cos(a)*r,cy+Math.sin(a)*r], nn=[-Math.cos(a),-Math.sin(a),0]; g.v([c[0],c[1],d/2],nn,[i/seg*r*6.28,0]); g.v([c[0],c[1],-d/2],nn,[i/seg*r*6.28,d]); }
  for(let i=0;i<seg;i++){ const a=base+i*2,b=a+2; g.I.push(a,b,b+1,a,b+1,a+1); }
  g.groups.push({start:0,count:g.I.length,mi:0}); return g; }
/* decoration you walk past, not into: no collider (recursively) */
function qNC(n){ n.noCollide=1; for(const k of n.kids) qNC(k); return n; }
/* an invisible box that keeps a collider where a prop used to be one plain box (the visible model replaces it) */
/* collision only: the node keeps its vertices (so the level reads its box in place) but draws no triangles */
function qHide(n){ if(n.mesh){ n.mesh.geo.I=[]; n.mesh.geo.groups=[{start:0,count:0,mi:0}]; n.mesh.runs=null; } n.noShade=1; return n; }
function qHB(g,x,y,z,w,h,d,ry=0){ return qHide(B(g,C('#000000'),x,y,z,w,h,d,ry)); }
/* wall runs: the solid stretches of a long wall between windows (wins as given to shell), with a margin for the trim */
function qRuns(wins,x0=-WL/2,x1=WL/2,m=.1){ const out=[]; let x=x0; for(const [a,b] of wins.slice().sort((p,q)=>p[0]-q[0])){ if(a-m>x+.05) out.push([x,a-m]); x=Math.max(x,b+m); } if(x1>x+.05) out.push([x,x1]); return out; }
/* a node on wall s, local +z facing into the car, local x along the car (same direction as car x) */
function qWall(key,s,x=0){ const sg=WG[key].side[s]; return s<0?N(sg,x,0,-WZ,0,0,0):N(sg,-x,0,WZ,0,Math.PI,0); }
/* ---------- canvas painting ---------- */
/* a raised panel: light top, dark foot, a lit top/left bevel and a shaded bottom/right one */
function qBevel(g,x,y,w,h,base,k=.3,b=1){ vfill(g,x,y,w,h,[[0,mix(base,'#ffffff',k*.35)],[1,mix(base,'#000000',k*.45)]]);
  R(g,rgba('#ffffff',k*.9),x,y,w,b); R(g,rgba('#ffffff',k*.5),x,y,b,h); R(g,rgba('#000000',k*1.1),x,y+h-b,w,b); R(g,rgba('#000000',k*.7),x+w-b,y,b,h); }
/* a sunk panel: shade on the top/left inner edge, light on the bottom/right */
function qInset(g,x,y,w,h,base,k=.3,b=1){ vfill(g,x,y,w,h,[[0,mix(base,'#000000',k*.2)],[1,mix(base,'#ffffff',k*.12)]]);
  R(g,rgba('#000000',k*1.1),x,y,w,b); R(g,rgba('#000000',k*.7),x,y,b,h); R(g,rgba('#ffffff',k*.6),x,y+h-b,w,b); R(g,rgba('#ffffff',k*.4),x+w-b,y,b,h); }
/* soft painted occlusion into the edges of a rect (inside corners) */
function qAO(g,x,y,w,h,k=.3,r=4){ for(let i=0;i<r;i++){ const a=k*(1-i/r)*(1-i/r)*.6; g.fillStyle=rgba('#000000',a); g.fillRect(x+i,y+i,w-2*i,1); g.fillRect(x+i,y+h-1-i,w-2*i,1); g.fillRect(x+i,y+i,1,h-2*i); g.fillRect(x+w-1-i,y+i,1,h-2*i); } }
/* a soft diagonal reflection band (glass, lacquer, metal) */
function qSheen(g,x,y,w,h,a=.2,pos=.3,wd=.18,col='#ffffff'){ g.save(); g.beginPath(); g.rect(x,y,w,h); g.clip(); const c0=x+w*pos; g.fillStyle=grad(g,c0-w*wd,y,c0+w*wd,y+h*.25,[[0,rgba(col,0)],[.5,rgba(col,a)],[1,rgba(col,0)]]);
  g.beginPath(); g.moveTo(c0-w*wd,y+h); g.lineTo(c0-w*wd+h*.5,y); g.lineTo(c0+w*wd+h*.5,y); g.lineTo(c0+w*wd,y+h); g.closePath(); g.fill(); g.restore(); }
/* painted wood: planks, wavy grain, the odd knot, a soft sheen from above */
function qWood(g,x,y,w,h,a,b,seed,o={}){ const r=rng(seed), vert=!!o.vert, pl=o.plank||0;
  vfill(g,x,y,w,h,[[0,a],[1,b]]);
  const L=vert?h:w, Wd=vert?w:h, n=o.lines??Math.round(Wd*.9);
  for(let i=0;i<n;i++){ const p=r()*Wd, amp=.4+r()*1.4, f=.05+r()*.1, ph=r()*6, dark=r()<.6; g.strokeStyle=rgba(dark?'#000000':'#ffffff',dark?.07+r()*.09:.05+r()*.05); g.lineWidth=.4+r()*.6; g.beginPath();
    for(let t=0;t<=L;t+=2){ const q=p+Math.sin(t*f+ph)*amp; if(vert) (t?g.lineTo(x+q,y+t):g.moveTo(x+q,y+t)); else (t?g.lineTo(x+t,y+q):g.moveTo(x+t,y+q)); } g.stroke(); }
  for(let i=0;i<(o.knots??Math.round(w*h/900));i++){ const kx=x+r()*w,ky=y+r()*h; ell(g,kx,ky,vert?1:2.4,vert?2.4:1,rgba('#000000',.18)); ell(g,kx,ky,vert?.5:1.1,vert?1.1:.5,rgba('#000000',.2)); }
  if(pl){ for(let p=pl;p<Wd;p+=pl){ if(vert){ R(g,rgba('#000000',.35),x+p-.5,y,1,h); R(g,rgba('#ffffff',.12),x+p+.5,y,.6,h); } else { R(g,rgba('#000000',.35),x,y+p-.5,w,1); R(g,rgba('#ffffff',.12),x,y+p+.5,w,.6); } }
    if(o.ends) for(let p=0;p<Wd;p+=pl){ const e=(r()*.6+.2)*L; if(vert) R(g,rgba('#000000',.3),x+p,y+e,pl,.8); else R(g,rgba('#000000',.3),x+e,y+p,.8,pl); } }
  if(o.sheen!==false) g.fillStyle=grad(g,x,y,x,y+h,[[0,rgba('#ffffff',.1)],[.35,rgba('#ffffff',0)],[1,rgba('#000000',.12)]]), g.fillRect(x,y,w,h); }
/* glazed tiles: per-tile tone, a painted glaze highlight, grout lines */
function qTiles(g,x,y,w,h,tw,th,base,grout,seed,o={}){ const r=rng(seed); R(g,grout,x,y,w,h); const gw=o.gw??.8, vary=o.vary??.08;
  for(let ty=0,row=0;ty<h-.01;ty+=th,row++) for(let tx=(o.brick&&row%2?-tw/2:0);tx<w-.01;tx+=tw){ const c=mix(base,r()<.5?'#000000':'#ffffff',r()*vary), X=x+tx+gw/2,Y=y+ty+gw/2,W_=tw-gw,H_=th-gw;
    vfill(g,X,Y,W_,H_,[[0,mix(c,'#ffffff',.14)],[.5,c],[1,mix(c,'#000000',.16)]]); R(g,rgba('#ffffff',o.hi??.35),X+W_*.12,Y+H_*.12,W_*.35,Math.max(.5,H_*.08)); R(g,rgba('#000000',.18),X,Y+H_-.6,W_,.6); if(o.dot) o.dot(g,X,Y,W_,H_,r); } }
/* fabric: a fine weave over a soft top-light gradient */
function qWeave(g,x,y,w,h,col,step=1,k=.07){ vfill(g,x,y,w,h,[[0,mix(col,'#ffffff',.08)],[1,mix(col,'#000000',.15)]]); for(let i=0;i<w;i+=step*2) R(g,rgba('#000000',k),x+i,y,step*.6,h); for(let j=0;j<h;j+=step*2) R(g,rgba('#ffffff',k*.7),x,y+j,w,step*.6); }
/* metal bar painted round: dark edges, a bright band (brass, steel, gold) */
function qMetal(g,x,y,w,h,base,vert=false){ const st=[[0,mix(base,'#000000',.45)],[.3,mix(base,'#ffffff',.45)],[.45,mix(base,'#ffffff',.15)],[.75,base],[1,mix(base,'#000000',.5)]]; if(vert) hfill(g,x,y,w,h,st); else vfill(g,x,y,w,h,st); }
/* a lathe/cylinder body texture: lit band down one side, dark the other (u wraps around), v up */
function qRound(g,x,y,w,h,base,k=.3){ hfill(g,x,y,w,h,[[0,mix(base,'#000000',k*.8)],[.3,mix(base,'#ffffff',k*.7)],[.42,mix(base,'#ffffff',k*.25)],[.75,mix(base,'#000000',k*.5)],[1,mix(base,'#000000',k*.8)]]); }
/* a painted gold key-fret (meander) band */
function qFret(g,x,y,w,h,bg,fg,u=2){ R(g,bg,x,y,w,h); const p=u*5; for(let i=0;i<w;i+=p){ R(g,fg,x+i,y+u,u,h-2*u); R(g,fg,x+i,y+u,p-u,u); R(g,fg,x+i+p-2*u,y+u,u,h*.6); R(g,fg,x+i+u*2,y+h*.5,p-3*u,u); R(g,fg,x+i+u*2,y+h*.5,u,h*.5-u); R(g,fg,x+i,y+h-2*u,p,u); } }
/* ---------- small shared painters ---------- */
function qCrane(g,cx,cy,s,body,wing,crown){ /* a crane in flight, wings up */
  g.fillStyle=wing; g.beginPath(); g.moveTo(cx-2*s,cy); g.quadraticCurveTo(cx-9*s,cy-9*s,cx-16*s,cy-12*s); g.quadraticCurveTo(cx-10*s,cy-4*s,cx-3*s,cy+1.5*s); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(cx+1*s,cy); g.quadraticCurveTo(cx+6*s,cy-10*s,cx+12*s,cy-14*s); g.quadraticCurveTo(cx+9*s,cy-5*s,cx+3*s,cy+1.5*s); g.closePath(); g.fill();
  for(let k=0;k<4;k++){ R(g,rgba('#000000',.55),cx-16*s+k*2.2*s,cy-12*s+k*2.6*s,1.4*s,.8*s); R(g,rgba('#000000',.55),cx+12*s-k*2.4*s,cy-14*s+k*3.2*s,1.4*s,.8*s); }
  ell(g,cx,cy+1*s,4.5*s,2*s,body); g.strokeStyle=body; g.lineWidth=1.1*s; g.beginPath(); g.moveTo(cx+4*s,cy+.5*s); g.quadraticCurveTo(cx+8*s,cy-1*s,cx+11*s,cy-3*s); g.stroke();
  ell(g,cx+11.5*s,cy-3.2*s,1.4*s,1.1*s,body); R(g,crown,cx+11*s,cy-4.5*s,1.2*s,1*s); g.strokeStyle='#e8c050'; g.lineWidth=.6*s; g.beginPath(); g.moveTo(cx+12.6*s,cy-3*s); g.lineTo(cx+15*s,cy-2.4*s); g.stroke();
  g.strokeStyle='#1a1410'; g.lineWidth=.6*s; g.beginPath(); g.moveTo(cx-4*s,cy+2*s); g.lineTo(cx-10*s,cy+5*s); g.moveTo(cx-4*s,cy+2.4*s); g.lineTo(cx-10*s,cy+6*s); g.stroke(); ell(g,cx-4.5*s,cy+1.6*s,2*s,1.3*s,'#1a1410'); }
function qCloud(g,x,y,s,col,lw=1){ g.strokeStyle=col; g.lineWidth=lw; g.beginPath(); g.arc(x,y,3*s,Math.PI,Math.PI*2); g.arc(x+4*s,y,2*s,Math.PI,Math.PI*2.2); g.stroke(); g.beginPath(); g.arc(x+1.5*s,y+.5*s,1.4*s,0,Math.PI*1.5); g.stroke(); g.beginPath(); g.moveTo(x-6*s,y+1.5*s); g.lineTo(x+8*s,y+1.5*s); g.stroke(); }
function qPeony(g,x,y,s,a,b,c){ for(let k=0;k<7;k++){ const an=k/7*Math.PI*2; ell(g,x+Math.cos(an)*2.6*s,y+Math.sin(an)*2*s,3*s,2.4*s,a); } for(let k=0;k<5;k++){ const an=k/5*Math.PI*2+.4; ell(g,x+Math.cos(an)*1.4*s,y+Math.sin(an)*1.1*s,2*s,1.6*s,b); } ell(g,x,y,1.3*s,1.1*s,c); for(let k=0;k<6;k++) R(g,'#f2d060',x-1*s+(k%3)*.8*s,y-.6*s+(k>>1&1)*.8*s,.5*s,.5*s); }
function qLeaf(g,x,y,len,ang,col){ g.save(); g.translate(x,y); g.rotate(ang); g.fillStyle=col; g.beginPath(); g.moveTo(0,0); g.quadraticCurveTo(len*.5,-len*.22,len,0); g.quadraticCurveTo(len*.5,len*.22,0,0); g.fill(); g.restore(); }
function qLacq(g,w,h,gold='#c8a040'){ vfill(g,0,0,w,h,[[0,'#2c1612'],[.6,'#1a0c0a'],[1,'#120807']]); R(g,gold,2,2,w-4,.7); R(g,gold,2,h-2.7,w-4,.7); R(g,gold,2,2,.7,h-4); R(g,gold,w-2.7,2,.7,h-4); }

/* ---------- the Golden Crane: one atlas for every small dressed thing in the car ---------- */
function qAtlasDimsum(){ const gold='#e0b850';
  return qAtlas(32,8,9,[
  {k:'cloth',cw:2,ch:2,fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.72,[[0,'#fcfaf4'],[.6,'#f2ece0'],[.72,'#e4dccb'],[1,'#d8ceb8']]);
    g.fillStyle=grad(g,w/2-3,0,w/2+3,0,[[0,rgba('#000000',0)],[.5,rgba('#000000',.05)],[1,rgba('#ffffff',.06)]]); g.fillRect(w/2-3,0,6,h); g.fillStyle=grad(g,0,h/2-3,0,h/2+3,[[0,rgba('#000000',0)],[.5,rgba('#000000',.05)],[1,rgba('#ffffff',.06)]]); g.fillRect(0,h/2-3,w,6);
    g.lineWidth=1.1; g.strokeStyle='#c8a040'; g.beginPath(); g.arc(w/2,h/2,w*.405,0,Math.PI*2); g.stroke(); g.lineWidth=.7; g.strokeStyle='#b82020'; g.beginPath(); g.arc(w/2,h/2,w*.44,0,Math.PI*2); g.stroke(); g.beginPath(); g.arc(w/2,h/2,w*.37,0,Math.PI*2); g.stroke();
    for(let k=0;k<16;k++){ const a=k/16*Math.PI*2, x=w/2+Math.cos(a)*w*.405, y=h/2+Math.sin(a)*w*.405; ell(g,x,y,1.4,1.4,k%2?'#b82020':'#c8a040'); ell(g,x,y,.5,.5,'#fcfaf4'); } }},
  {k:'art1',cw:2,ch:2,fn:(g,w,h)=>{ qLacq(g,w,h); radial(g,w*.72,h*.3,9,[[0,'#d84a2a'],[.85,'#b8301c'],[1,rgba('#b8301c',0)]]);
    for(let i=0;i<3;i++){ g.fillStyle=grad(g,0,h*.6+i*5,0,h,[[0,rgba('#b8902a',.55-i*.12)],[1,rgba('#5a3a10',.2)]]); g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x+=2) g.lineTo(x,h*.62+i*6-Math.sin(x*.09+i*2)*4-Math.sin(x*.23+i)*2); g.lineTo(w,h); g.fill(); }
    qCloud(g,12,18,1,rgba(gold,.8),.8); qCloud(g,44,46,.8,rgba(gold,.7),.7); qCrane(g,30,32,1.05,'#f4efe4','#efe8da','#d82020'); qCrane(g,50,14,.45,'#f4efe4','#e8e0d0','#d82020'); qSheen(g,0,0,w,h,.07,.25,.12); }},
  {k:'art2',cw:2,ch:2,fn:(g,w,h)=>{ qLacq(g,w,h); g.strokeStyle='#6a4a2a'; g.lineWidth=1.6; g.beginPath(); g.moveTo(8,h-3); g.quadraticCurveTo(20,40,30,30); g.quadraticCurveTo(40,22,54,18); g.stroke(); g.lineWidth=1; g.beginPath(); g.moveTo(30,30); g.quadraticCurveTo(26,20,20,14); g.stroke();
    for(const [x,y,a] of [[16,44,-.6],[38,28,.4],[24,22,-1.4],[50,22,.9],[12,52,-2.2],[44,36,1.6]]){ qLeaf(g,x,y,8,a,'#2e6a34'); qLeaf(g,x+1,y-1,6,a+.3,'#4a8a40'); }
    qPeony(g,22,36,1.15,'#e0607e','#f4a0b4','#c8304e'); qPeony(g,44,24,1,'#f0f0e8','#ffffff','#e8b0b8'); qPeony(g,20,15,.7,'#e0607e','#f4a0b4','#c8304e');
    ell(g,52,44,2.2,1.6,'#3a6aa8'); ell(g,54,43,1.1,1,'#3a6aa8'); R(g,'#e8c050',55.5,43,1.5,.6); qSheen(g,0,0,w,h,.07,.6,.1); }},
  {k:'art3',cw:2,ch:2,fn:(g,w,h)=>{ qLacq(g,w,h); radial(g,44,16,10,[[0,'#f2e2a8'],[.9,'#d8c070'],[1,rgba('#d8c070',0)]]);
    for(const [x,wd,c] of [[14,3.2,'#8aa04a'],[24,2.6,'#6a8a3a'],[36,3,'#9ab050']]){ for(let y=3;y<h-3;y+=9){ hfill(g,x-wd/2,y,wd,8,[[0,mix(c,'#000000',.25)],[.35,mix(c,'#ffffff',.25)],[1,mix(c,'#000000',.2)]]); R(g,'#e8d890',x-wd/2-.4,y+8,wd+.8,1); } }
    for(const [x,y,a] of [[16,12,-.3],[16,12,.5],[26,24,2.6],[26,24,2.0],[38,40,-.4],[38,40,.4],[38,40,.9],[14,44,2.8],[24,52,-.5],[36,18,2.7]]) qLeaf(g,x,y,10,a,a>1.5?'#2e5a2e':'#4a7a3a');
    qSheen(g,0,0,w,h,.07,.3,.1); }},
  {k:'mural',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b82424'],[1,'#7a1010']]); qFret(g,0,0,w,4,'#7a1010',gold,1); qFret(g,0,h-4,w,4,'#7a1010',gold,1); radial(g,46,16,9,[[0,'#f2d060'],[.8,'#e0b040'],[1,rgba('#e0b040',0)]]);
    qCloud(g,10,14,1.1,gold,1); qCloud(g,40,52,1,gold,1); qCrane(g,28,34,1.25,gold,'#f2cc60','#ffffff'); glyphs(g,56,10,5,6,rgba(gold,.9),31,true); qSheen(g,0,0,w,h,.08,.4,.15); }},
  {k:'runner',cw:2,ch:2,fn:(g,w,h)=>{ R(g,'#5a0c12',0,0,w,h); radial(g,w/2,h/2,26,[[0,'#8a1820'],[1,'#5a0c12']]);
    for(const y of [0,h-9]){ R(g,'#c89a3a',0,y+1,w,1); R(g,'#2a0608',0,y+2,w,5); for(let x=0;x<w;x+=6){ R(g,'#c89a3a',x+1,y+3,3,1); R(g,'#c89a3a',x+3,y+3,1,3); } R(g,'#c89a3a',0,y+7,w,1); }
    poly(g,[[w/2,h/2-16],[w/2+20,h/2],[w/2,h/2+16],[w/2-20,h/2]],'#c89a3a'); poly(g,[[w/2,h/2-14],[w/2+17,h/2],[w/2,h/2+14],[w/2-17,h/2]],'#7a1018'); ell(g,w/2,h/2,6,5,'#c89a3a'); ell(g,w/2,h/2,4,3.4,'#2a5a6a'); ell(g,w/2,h/2,1.6,1.4,'#e8c860');
    for(const [x,y] of [[6,18],[w-6,18],[6,h-18],[w-6,h-18]]){ ell(g,x,y,2.4,2.4,'#c89a3a'); ell(g,x,y,1,1,'#5a0c12'); }
    const r=rng(9); for(let i=0;i<500;i++) R(g,rgba(r()<.5?'#000000':'#ffffff',.06),r()*w,r()*h,.6,.6); }},
  {k:'fret',cw:4,ch:1,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b82020'],[1,'#7a1010']]); R(g,gold,0,2,w,1.2); R(g,gold,0,h-3.2,w,1.2); qFret(g,0,6,w,h-12,'#8a1414',gold,2); g.fillStyle=grad(g,0,0,0,h,[[0,rgba('#ffffff',.12)],[.5,rgba('#ffffff',0)],[1,rgba('#000000',.25)]]); g.fillRect(0,0,w,h); }},
  {k:'skirt',cw:2,ch:1,fn:(g,w,h)=>{ for(let x=0;x<w;x++){ const v=.5+.5*Math.sin(x/w*Math.PI*2*10); R(g,mix('#e2d8c4','#fcfaf2',v),x,0,1,h); }
    g.fillStyle=grad(g,0,0,0,h,[[0,rgba('#ffffff',.15)],[.4,rgba('#ffffff',0)],[1,rgba('#000000',.18)]]); g.fillRect(0,0,w,h); R(g,'#c8a040',0,3,w,.8); R(g,'#b82020',0,4.2,w,2); for(let x=1;x<w;x+=4) ell(g,x,5.2,.7,.7,'#e8c050'); R(g,'#c8a040',0,6.8,w,.8); R(g,rgba('#000000',.15),0,h-2.5,w,1); R(g,rgba('#ffffff',.3),0,h-1.5,w,.6); }},
  {k:'menu',cw:2,ch:1,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b81c1c'],[1,'#8a1010']]); R(g,gold,1,1,w-2,.8); R(g,gold,1,h-1.8,w-2,.8); for(let k=0;k<7;k++){ glyphs(g,4+k*8.4,4,3,5,'#f2d060',k*13+3,true); R(g,'#f4efe4',4+k*8.4,21,4,4); text(g,String(18+k*6),4.4+k*8.4,26,'#f2d060',.8); } }},
  {k:'valance',cw:2,ch:1,fn:(g,w,h)=>{ for(let x=0;x<w;x++){ const v=.5+.5*Math.sin(x/w*Math.PI*2*7); R(g,mix('#6a0a0a','#c82424',v),x,0,1,h); } R(g,gold,0,0,w,3); qFret(g,0,.5,w,2,'#7a1010',gold,.5);
    for(let x=0;x<w;x+=w/7){ g.fillStyle=rgba('#000000',.25); g.beginPath(); g.ellipse(x+w/14,h-8,w/14,5,0,0,Math.PI); g.fill(); }
    for(let x=0;x<w;x+=1.2) R(g,(x|0)%2?'#e8c050':'#b8902a',x,h-6,.7,6); R(g,'#c8a040',0,h-6.5,w,1); }},
  {k:'beam',cw:2,ch:1,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b82424'],[1,'#741010']]); R(g,gold,0,2,w,1); R(g,gold,0,h-3,w,1); ell(g,w/2,h/2,11,6,gold); ell(g,w/2,h/2,10,5,'#2a5a6a'); ell(g,w/2,h/2,6,3,'#e8c050'); ell(g,w/2,h/2,4.6,2,'#b82424');
    for(const s of [-1,1]) qCloud(g,w/2+s*20-4,h/2+1,.7,gold,.8); qSheen(g,0,0,w,h,.1,.3,.2); }},
  {k:'shrine',cw:2,ch:1,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c02424'],[1,'#801010']]); R(g,gold,1,1,w-2,1); R(g,gold,1,h-2,w-2,1); qBevel(g,w/2-8,4,16,h-8,'#1a0c0a',.3,1); glyphs(g,w/2-3,6,4,6,gold,77,true);
    for(const x of [5,w-13]){ qBevel(g,x,4,8,h-8,'#d8b860',.25,.8); glyphs(g,x+1.5,6,4,5.5,'#8a1010',x*3,true); } }},
  {k:'plaque',cw:2,ch:1,fn:(g,w,h)=>{ qBevel(g,0,0,w,h,'#1a0e0c',.35,1.4); R(g,gold,2.5,2.5,w-5,.8); R(g,gold,2.5,h-3.3,w-5,.8); R(g,gold,2.5,2.5,.8,h-5); R(g,gold,w-3.3,2.5,.8,h-5); text(g,'GOLDEN',(w-textW('GOLDEN',1.4))/2,6,'#f2d060',1.4); text(g,'CRANE',(w-textW('CRANE',1.4))/2,16,'#f2d060',1.4); qSheen(g,0,0,w,h,.12,.3,.15); }},
  {k:'steamS',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#ecd29a'],[1,'#b8945a']]); for(let x=0;x<w;x+=2) R(g,rgba('#7a5a2a',.18),x,0,.6,h); for(const y of [4,h-9]){ vfill(g,0,y,w,4,[[0,'#c09a5a'],[1,'#8a6a34']]); R(g,rgba('#ffffff',.25),0,y,w,.6); for(let x=0;x<w;x+=3) R(g,rgba('#000000',.2),x,y+1,1.6,.6); } R(g,'#f2e2b0',0,0,w,1.4); R(g,rgba('#000000',.3),0,h-1,w,1); }},
  {k:'steamT',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.55,[[0,'#e8cc8e'],[.8,'#c8a466'],[1,'#a08048']]); g.save(); g.beginPath(); g.arc(w/2,h/2,w*.42,0,Math.PI*2); g.clip(); g.lineWidth=.6;
    for(let i=-w;i<w*2;i+=2.4){ g.strokeStyle=rgba('#7a5a2a',.35); g.beginPath(); g.moveTo(i,0); g.lineTo(i+h,h); g.stroke(); g.strokeStyle=rgba('#fff4d0',.25); g.beginPath(); g.moveTo(i,h); g.lineTo(i+h,0); g.stroke(); } g.restore(); g.strokeStyle='#8a6a34'; g.lineWidth=1.4; g.beginPath(); g.arc(w/2,h/2,w*.44,0,Math.PI*2); g.stroke(); }},
  {k:'glass',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#4a2c1c'],[.85,'#2a160e'],[1,'#c8a040']]); qSheen(g,0,0,w,h,.22,.35,.08); qSheen(g,0,0,w,h,.12,.6,.04); }},
  {k:'plate',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#ffffff'],[.6,'#f4f4f0'],[1,'#d8d8d4']]); g.strokeStyle='#2a4a9a'; g.lineWidth=1.6; g.beginPath(); g.arc(w/2,h/2,w*.43,0,Math.PI*2); g.stroke(); g.lineWidth=.5; g.beginPath(); g.arc(w/2,h/2,w*.36,0,Math.PI*2); g.stroke(); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; ell(g,w/2+Math.cos(a)*w*.43,h/2+Math.sin(a)*w*.43,1.3,1.3,'#f4f4f0'); } ell(g,w/2,h/2,3,3,rgba('#2a4a9a',.6)); }},
  {k:'porc',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f4f4ee',.25); R(g,'#2a4a9a',0,h*.2,w,1); R(g,'#2a4a9a',0,h*.78,w,1); for(let x=2;x<w;x+=8){ ell(g,x,h*.5,2.2,2.6,'#3a5aa8'); ell(g,x,h*.5,1,1.2,'#f4f4ee'); qLeaf(g,x+2,h*.5+1,4,.6,'#3a5aa8'); } }},
  {k:'rose',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#5a2a1e','#2e120a',61,{vert:true}); }},
  {k:'splat',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#5a2a1e','#2e120a',62,{vert:true}); for(const [x,y,ww,hh] of [[5,4,9,7],[18,4,9,7],[5,21,9,7],[18,21,9,7],[5,13,4,6],[23,13,4,6]]) qInset(g,x,y,ww,hh,'#1a0806',.4,.8); ell(g,w/2,h/2,4.5,4.5,'#c8a040'); ell(g,w/2,h/2,3,3,'#8a1414'); ell(g,w/2,h/2,1.2,1.2,'#e8c050'); }},
  {k:'cush',fn:(g,w,h)=>{ qWeave(g,0,0,w,h,'#b02020',1,.06); radial(g,w/2,h/2,w*.6,[[0,rgba('#ffffff',.12)],[1,rgba('#000000',.2)]]); for(let y=4;y<h;y+=8) for(let x=4+(y/8%2)*4;x<w;x+=8){ ell(g,x,y,1.6,1.6,'#d8a840'); ell(g,x,y,.7,.7,'#8a1414'); } R(g,'#e0b850',0,0,w,1); R(g,'#e0b850',0,h-1,w,1); }},
  {k:'frame',fn:(g,w,h)=>{ qMetal(g,0,0,w,h,'#d4ad5a'); for(let x=1.5;x<w;x+=3) ell(g,x,h*.5,1,1,rgba('#fff2c0',.6)); }},
  {k:'blackL',fn:(g,w,h)=>{ qLacq(g,w,h); qSheen(g,0,0,w,h,.1,.3,.2); }},
  {k:'lantern',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8301c'],[.5,'#ff8a50'],[1,'#d8301c']]); for(let x=0;x<w;x+=4) R(g,rgba('#6a0a00',.35),x,0,.8,h); R(g,'#e8c050',0,0,w,3); R(g,'#e8c050',0,h-3,w,3); for(const cx of [w*.25,w*.75]){ ell(g,cx,h/2,5,5,'#ffd070'); glyphs(g,cx-3,h/2-3,1,7,'#a81808',(cx|0)+5,false); } }},
  {k:'dump',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f6eee4',.2); ell(g,w*.35,h*.55,5,4,rgba('#f09a80',.35)); ell(g,w*.8,h*.55,5,4,rgba('#f09a80',.3)); for(let x=0;x<w;x+=2.5){ g.strokeStyle=rgba('#c8b8a0',.6); g.lineWidth=.5; g.beginPath(); g.moveTo(x,0); g.lineTo(x+2,h*.35); g.stroke(); } }},
  {k:'steel',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d4d8dc'],[1,'#9aa0a6']]); const r=rng(19); for(let i=0;i<40;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.08),0,r()*h,w,.4); qBevel(g,0,0,w,h,'#9aa0a6',.0,1); R(g,rgba('#ffffff',.3),0,0,w,1); R(g,rgba('#000000',.3),0,h-1,w,1); for(const [x,y] of [[2,2],[w-3,2],[2,h-3],[w-3,h-3]]) ell(g,x+.5,y+.5,.7,.7,'#6a7076'); }},
  {k:'cab',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d4d8dc'],[1,'#a0a6ac']]); const r=rng(21); for(let i=0;i<30;i++) R(g,rgba(r()<.5?'#ffffff':'#000000',.07),0,r()*h,w,.4); qInset(g,2,2,w/2-3,h-4,'#c0c6cc',.3,.7); qInset(g,w/2+1,2,w/2-3,h-4,'#c0c6cc',.3,.7); qMetal(g,w/2-3,5,1.2,8,'#e0e4e8',true); qMetal(g,w/2+2,5,1.2,8,'#e0e4e8',true); for(let y=h-9;y<h-4;y+=1.6) R(g,'#5a6066',5,y,8,.7); }},
  {k:'filter',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b8bec4'],[1,'#7a8086']]); for(let y=2;y<h-2;y+=2.5){ R(g,'#4a5056',2,y,w-4,1.1); R(g,rgba('#ffffff',.35),2,y+1.1,w-4,.4); } R(g,rgba('#ffffff',.3),0,0,w,1); R(g,rgba('#000000',.35),0,h-1,w,1); }},
  {k:'tile',fn:(g,w,h)=>{ qTiles(g,0,0,w,h,8,8,'#f0f0ea','#b0aca2',23); }},
  {k:'qtile',fn:(g,w,h)=>{ qTiles(g,0,0,w,h,16,16,'#7e3820','#3a1c10',24,{vary:.14,hi:.1}); const r=rng(25); for(let i=0;i<60;i++) R(g,rgba('#000000',.08),r()*w,r()*h,1,1); }},
  {k:'duck',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#8a3414',.35); const r=rng(26); for(let i=0;i<40;i++) ell(g,r()*w,r()*h,.8,.6,rgba('#4a1406',.4)); hfill(g,w*.25,0,w*.1,h,[[0,rgba('#ffd0a0',0)],[.5,rgba('#ffd0a0',.45)],[1,rgba('#ffd0a0',0)]]); }},
  {k:'orange',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f08a1c',.3); const r=rng(27); for(let i=0;i<50;i++) R(g,rgba('#a84a00',.25),r()*w,r()*h,.6,.6); R(g,'#3a6a2a',0,0,w,2); }},
  {k:'wok',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#2a2826',.4); R(g,'#8a8682',0,0,w,1.2); R(g,rgba('#000000',.4),0,1.2,w,.8); }},
  {k:'wokIn',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#5a5652'],[.3,'#2a2826'],[1,'#141210']]); R(g,'#9a9690',0,0,w,1); const r=rng(28); for(let i=0;i<20;i++) R(g,rgba('#ffffff',.06),r()*w,r()*h,2,.5); }},
  {k:'flame',fn:(g,w,h)=>{ R(g,'#1a0a04',0,0,w,h); for(let x=0;x<w;x+=3){ const t=6+Math.sin(x*1.3)*4+(x%2)*3; g.fillStyle=grad(g,0,h,0,h-t-14,[[0,'#3a6aff'],[.25,'#ffe080'],[.7,'#ff8a20'],[1,'#c83a08']]); g.beginPath(); g.moveTo(x-1,h); g.quadraticCurveTo(x+1.5,h-t,x+1.5,h-t-12); g.quadraticCurveTo(x+2,h-t,x+4,h); g.fill(); } }},
  {k:'sauce',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#f4f4f0'],[1,'#d8d8d4']]); radial(g,w/2,h/2,w*.32,[[0,'#5a2a10'],[.9,'#2a1006'],[1,'#f4f4f0']]); ell(g,w*.42,h*.4,2,1,rgba('#ffffff',.5)); }},
  {k:'chop',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.55,[[0,'#d8b07a'],[1,'#8a6a40']]); g.strokeStyle=rgba('#6a4a2a',.45); g.lineWidth=.5; for(let r=2;r<w*.5;r+=2){ g.beginPath(); g.arc(w/2+.5,h/2-.5,r,0,Math.PI*2); g.stroke(); } const q=rng(29); for(let i=0;i<14;i++){ g.strokeStyle=rgba('#3a2010',.3); g.beginPath(); const x=q()*w,y=q()*h; g.moveTo(x,y); g.lineTo(x+q()*6-3,y+q()*6-3); g.stroke(); } }},
  {k:'tank',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#6ad0e8'],[1,'#1a6a8a']]); R(g,'#c8b88a',0,h-4,w,4); for(const [x,y,c] of [[9,12,'#e87a3a'],[22,18,'#8a9aa8'],[14,22,'#d8a040']]){ ell(g,x,y,4,2,c); poly(g,[[x+3.5,y],[x+6.5,y-2],[x+6.5,y+2]],c); ell(g,x-2.5,y-.4,.5,.5,'#121014'); }
    ell(g,24,h-5,3,1.6,'#b8301c'); for(const s of [-1,1]) R(g,'#b8301c',24+s*3,h-8,1,3); const r=rng(30); for(let i=0;i<14;i++) ell(g,r()*w,r()*h*.8,.6,.6,rgba('#ffffff',.6)); qSheen(g,0,0,w,h,.18,.3,.08); }}
  ],4,3,71); }

/* ---------- the banya and the ice bar ---------- */
function qLogPaint(g,w,h,a,b,seed){ vfill(g,0,0,w,h,[[0,mix(a,'#ffffff',.18)],[.22,a],[.6,mix(a,b,.55)],[1,b]]); const r=rng(seed);
  for(let i=0;i<22;i++){ const y=2+r()*(h-4), amp=.4+r()*1.2, f=.03+r()*.06, ph=r()*6; g.strokeStyle=rgba(r()<.65?'#5a3010':'#fff0d0',.1+r()*.12); g.lineWidth=.4+r()*.5; g.beginPath(); for(let x=0;x<=w;x+=2){ const yy=y+Math.sin(x*f+ph)*amp; x?g.lineTo(x,yy):g.moveTo(x,yy); } g.stroke(); }
  for(let i=0;i<4;i++){ const x=r()*w,y=5+r()*(h-10); ell(g,x,y,2.6,1.6,rgba('#5a3010',.35)); ell(g,x,y,1.2,.8,rgba('#3a1a08',.5)); }
  const cy=h*(.35+r()*.2); g.strokeStyle=rgba('#3a1a08',.4); g.lineWidth=.6; g.beginPath(); g.moveTo(r()*w*.3,cy); for(let x=0;x<w*.6;x+=3) g.lineTo(w*.2+x,cy+Math.sin(x*.4)*.6); g.stroke();
  for(let x=0;x<w;x+=1.5){ R(g,rgba('#4a3a2a',.55+r()*.3),x,h-1.6-r()*1.4,1,2); R(g,rgba('#6a5a40',.4),x,0,1,1+r()*1.2); } }
function qAtlasBanya(){ return qAtlas(32,8,7,[
  {k:'log',cw:4,fn:(g,w,h)=>qLogPaint(g,w,h,'#e2b47a','#7a4a24',81)},
  {k:'log2',cw:4,fn:(g,w,h)=>qLogPaint(g,w,h,'#d8a868','#704020',82)},
  {k:'slat',cw:2,fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#f0d4a0','#d4ac74',83,{lines:9,knots:1}); R(g,rgba('#ffffff',.35),0,0,w,1.2); R(g,rgba('#000000',.25),0,h-1.5,w,1.5); }},
  {k:'plank',cw:2,fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#dcb27a','#b4864e',84,{lines:10,knots:2}); R(g,rgba('#ffffff',.25),0,0,w,1); R(g,rgba('#000000',.3),0,h-1.2,w,1.2); }},
  {k:'nal',cw:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a6ab0'],[1,'#24488a']]); R(g,'#f2f0ea',0,h-4,w,2); poly(g,[[0,h-4],[w/2,4],[w,h-4]],'#f2f0ea'); poly(g,[[4,h-5],[w/2,7],[w-4,h-5]],'#3a6ab0');
    for(let k=0;k<7;k++){ const x=8+k*8; ell(g,x,h-2,2.4,2.4,'#f2f0ea'); ell(g,x,h-2,1,1,'#24488a'); } ell(g,w/2,14,4,4,'#f2f0ea'); ell(g,w/2,14,2.4,2.4,'#c83a2a'); for(const s of [-1,1]) qLeaf(g,w/2+s*5,15,9,s<0?Math.PI*.9:.1,'#f2f0ea'); }},
  {k:'signB',cw:2,fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#c8945a','#9a6a3a',85,{lines:8}); qBevel(g,0,0,w,h,'#000000',0,1); R(g,rgba('#000000',.3),0,h-1,w,1); text(g,'BANYA',(w-textW('BANYA',2))/2+1,9,rgba('#ffffff',.25),2); text(g,'BANYA',(w-textW('BANYA',2))/2,8,'#3a1a08',2);
    for(const s of [-1,1]){ qLeaf(g,w/2+s*24,h/2,7,s<0?Math.PI:0,'#4a7a32'); qLeaf(g,w/2+s*24,h/2,5,s<0?Math.PI*.8:.3,'#6a9a40'); } }},
  {k:'signI',cw:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#0c2a4a'],[1,'#06182e']]); R(g,'#5ae0ff',1,1,w-2,.6); R(g,'#5ae0ff',1,h-1.6,w-2,.6); for(const [o,c] of [[.8,'#2a8ac8'],[0,'#c8f8ff']]){ text(g,'LYOD',(w-textW('LYOD',2.4))/2+o,4+o,c,2.4); text(g,'ICE BAR',(w-textW('ICE BAR',1))/2+o*.5,22+o*.5,c,1); } }},
  {k:'logEnd',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#e8c890'],[.85,'#c8945a'],[1,'#6a4020']]); g.strokeStyle=rgba('#8a5a30',.5); g.lineWidth=.5; for(let k=2;k<15;k+=2){ g.beginPath(); g.arc(w/2+.4,h/2,k,0,Math.PI*2); g.stroke(); } g.strokeStyle=rgba('#4a2a10',.6); g.beginPath(); g.moveTo(w/2,h/2); g.lineTo(w*.9,h*.3); g.stroke(); }},
  {k:'stove',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3e3a36'],[1,'#1e1c1a']]); for(const y of [2,h-5]){ qMetal(g,0,y,w,3,'#4a4642'); for(let x=2;x<w;x+=4) ell(g,x,y+1.5,.7,.7,'#8a8680'); } const r=rng(86); for(let i=0;i<30;i++) R(g,rgba('#000000',.2),r()*w,r()*h,1.5,1.5); }},
  {k:'sdoor',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a3632'],[1,'#1e1c1a']]); qBevel(g,5,6,22,20,'#2e2a28',.4,1.2); for(let k=0;k<3;k++) R(g,'#ff8a30',9,10+k*4,14,1.6); R(g,'#ffd070',9,10.3,14,.5); qMetal(g,22,14,4,3,'#8a8680'); }},
  {k:'stone',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#8a8680'],[1,'#4a4642']]); const r=rng(87); for(let i=0;i<120;i++) R(g,['#a8a49e','#3a3632','#6a6660','#c8c0b4'][r()*4|0],r()*w,r()*h,1,1); }},
  {k:'bucket',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#b07a40',.25); for(let x=0;x<w;x+=4) R(g,rgba('#4a2a10',.35),x,0,.6,h); for(const y of [h*.18,h*.72]){ qMetal(g,0,y,w,3,'#c8a050'); } R(g,'#e0b880',0,0,w,1.2); }},
  {k:'tub',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#c08a50'],[1,'#7a4e28']]); for(let x=0;x<w;x+=5){ R(g,rgba('#3a1a08',.4),x,0,.7,h); R(g,rgba('#ffffff',.12),x+.7,0,.5,h); } for(const y of [4,h-8]) qMetal(g,0,y,w,3.2,'#3e3a36'); }},
  {k:'water',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.7,[[0,'#3aa8c0'],[1,'#145a72']]); g.strokeStyle=rgba('#d8f8ff',.45); g.lineWidth=.6; for(let k=1;k<4;k++){ g.beginPath(); g.ellipse(w*.45,h*.55,k*4,k*2.6,0,0,Math.PI*2); g.stroke(); } qSheen(g,0,0,w,h,.25,.6,.06); }},
  {k:'felt',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e2dace'],[1,'#b8ae9e']]); const r=rng(88); for(let i=0;i<200;i++) R(g,rgba(r()<.5?'#ffffff':'#6a6050',.18),r()*w,r()*h,.6,.6); R(g,'#a82a22',0,h-7,w,3); for(let x=1;x<w;x+=3) ell(g,x,h-5.5,.8,.8,'#f2e2b0'); }},
  {k:'venik',fn:(g,w,h)=>{ R(g,'#2a4a1a',0,0,w,h); const r=rng(89); for(let i=0;i<70;i++){ const x=r()*w,y=r()*h*.78; qLeaf(g,x,y,3+r()*3,r()*6.28,['#4a7a32','#6a9a40','#2e5a22','#8aa848'][r()*4|0]); }
    for(let k=0;k<7;k++){ g.strokeStyle='#5a3a1e'; g.lineWidth=.7; g.beginPath(); g.moveTo(w/2-6+k*2,h*.72); g.lineTo(w/2-1+k*.3,h); g.stroke(); } R(g,'#d8c8a0',w/2-4,h*.84,8,1.5); }},
  {k:'towel',fn:(g,w,h)=>{ qWeave(g,0,0,w,h,'#f4f0e6',1,.06); for(const x of [3,7,w-9,w-5]) R(g,'#b82a22',x,0,2,h); R(g,rgba('#000000',.12),0,h-2,w,2); }},
  {k:'ice',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8f4ff'],[.5,'#a8dcf2'],[1,'#7abfe0']]); const r=rng(90); for(let i=0;i<5;i++){ g.strokeStyle=rgba('#ffffff',.45); g.lineWidth=.4; g.beginPath(); let x=r()*w,y=r()*h; g.moveTo(x,y); for(let k=0;k<4;k++){ x+=r()*8-4; y+=r()*8-4; g.lineTo(x,y); } g.stroke(); }
    for(let i=0;i<14;i++) ell(g,r()*w,r()*h,.5,.5,rgba('#ffffff',.6)); R(g,'#f4fcff',0,0,w,1.6); R(g,'#e8f8ff',0,0,1.4,h); R(g,rgba('#2a6a9a',.5),0,h-1.4,w,1.4); R(g,rgba('#2a6a9a',.35),w-1.2,0,1.2,h); }},
  {k:'iceTop',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#eefaff'],[1,'#c8eaf8']]); const r=rng(91); for(let i=0;i<30;i++){ R(g,rgba('#ffffff',.5),r()*w,r()*h,2+r()*5,.4); } for(let i=0;i<40;i++) R(g,rgba('#6aa8d0',.2),r()*w,r()*h,.6,.6); }},
  {k:'frost',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8eef8'],[1,'#b0d4e8']]); const r=rng(92); for(let i=0;i<200;i++) R(g,rgba(r()<.6?'#ffffff':'#7ab0d0',.25),r()*w,r()*h,.6,.6); R(g,rgba('#ffffff',.3),0,0,w,1); R(g,rgba('#2a5a8a',.25),0,h-1,w,1); }},
  {k:'fur',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f2ede4'],[1,'#d0c6b6']]); const r=rng(93); for(let i=0;i<260;i++){ const x=r()*w,y=r()*h; g.strokeStyle=rgba(r()<.5?'#ffffff':'#a89c88',.45); g.lineWidth=.5; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+1,y+1.5,x+r()*2-1,y+3); g.stroke(); } }},
  {k:'furG',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#9a9084'],[1,'#5e564c']]); const r=rng(94); for(let i=0;i<260;i++){ const x=r()*w,y=r()*h; g.strokeStyle=rgba(r()<.4?'#e8e0d0':'#2a241e',.45); g.lineWidth=.5; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+1,y+1.5,x+r()*2-1,y+3.4); g.stroke(); } }},
  {k:'bottle',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c8e2ec',.3); R(g,'#f4f2ea',0,h*.4,w,h*.32); R(g,'#b82a22',0,h*.4,w,1.4); R(g,'#b82a22',0,h*.72-1.4,w,1.4); text(g,'ZIMA',3,h*.5,'#1a2a4a',1); text(g,'ZIMA',w/2+3,h*.5,'#1a2a4a',1); R(g,'#c8a040',0,0,w,h*.12); qSheen(g,0,0,w,h,.3,.25,.05); }},
  {k:'jar',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c8d8a0',.25); const r=rng(95); for(let i=0;i<10;i++) ell(g,r()*w,h*.25+r()*h*.6,2.4,1.2,'#4a7a2a'); R(g,'#c8a040',0,0,w,h*.14); qSheen(g,0,0,w,h,.3,.3,.05); }},
  {k:'samovar',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#d8a848',.4); for(const y of [h*.2,h*.5,h*.8]){ R(g,rgba('#6a4a10',.5),0,y,w,.7); R(g,rgba('#fff0b0',.5),0,y+.7,w,.4); } for(let x=4;x<w;x+=8) ell(g,x,h*.35,1.6,1.6,'#b88a30'); }},
  {k:'thermo',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#e8c890'],[1,'#a87a46']]); ell(g,w/2,h/2,10,10,'#f4f0e4'); for(let k=0;k<24;k++){ const a=k/24*Math.PI*2; R(g,'#2a2420',w/2+Math.cos(a)*8.5-.3,h/2+Math.sin(a)*8.5-.3,.6,.6); } g.strokeStyle='#b82a22'; g.lineWidth=.8; g.beginPath(); g.moveTo(w/2,h/2); g.lineTo(w/2+5,h/2-5); g.stroke(); text(g,'110',w/2-5,h/2+3,'#2a2420',1); }},
  {k:'bread',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#5a3418',.35); const r=rng(96); for(let i=0;i<40;i++) R(g,rgba('#e8d8b8',.35),r()*w,r()*h*.5,1,.5); for(let x=4;x<w;x+=6) R(g,rgba('#2a1406',.5),x,0,1,h*.4); }},
  {k:'caviar',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#e8c060'],[1,'#a87a2a']]); ell(g,w/2,h/2,10,10,'#1e3a6a'); ell(g,w/2,h/2,8,5,'#e8c060'); poly(g,[[w/2-6,h/2],[w/2+4,h/2-2.5],[w/2+7,h/2],[w/2+4,h/2+2.5]],'#1e3a6a'); }},
  {k:'iron',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#4e4a46'],[1,'#26241f']]); R(g,rgba('#ffffff',.2),0,0,w,1); R(g,rgba('#000000',.3),0,h-1,w,1); }},
  {k:'birch',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f6f2e8'],[1,'#d0c8b8']]); const r=rng(97); for(let i=0;i<26;i++) R(g,'#2a2420',r()*w,r()*h,2+r()*5,.7+r()*.6); for(let i=0;i<4;i++) ell(g,r()*w,r()*h,1.6,2.4,'#3a2a20'); }},
  {k:'wood',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#d8b07a','#b08050',98,{lines:8,knots:1}); }},
  {k:'lampCage',fn:(g,w,h)=>{ R(g,'#ffd8a0',0,0,w,h); for(let x=0;x<w;x+=4) hfill(g,x,0,2.4,h,[[0,'#5a3418'],[.5,'#8a5a30'],[1,'#5a3418']]); R(g,'#4a2a10',0,0,w,2); R(g,'#4a2a10',0,h-2,w,2); }},
  {k:'iceGlow',fn:(g,w,h)=>{ radial(g,w/2,h*.55,w*.75,[[0,'#e8fcff'],[.6,'#9ae0f8'],[1,'#4aa8d8']]); R(g,'#ffffff',0,0,w,1.2); R(g,'#2a7ab0',0,h-1.2,w,1.2); R(g,'#c8f4ff',0,0,1,h); const r=rng(99); for(let i=0;i<10;i++) ell(g,r()*w,r()*h,.6,.6,'#ffffff'); }},
  {k:'venikC',fn:(g,w,h)=>{ const r=rng(189); for(let k=0;k<7;k++){ g.strokeStyle='#5a3a1e'; g.lineWidth=.6; g.beginPath(); g.moveTo(w/2-1+k*.3,h); g.quadraticCurveTo(w/2-5+k*1.6,h*.6,w/2-10+k*3.3,h*.12); g.stroke(); }
    for(let i=0;i<120;i++){ const t=r(), x=w/2+(r()-.5)*w*.8*(1-t*.55), y=h*.06+t*h*.62; qLeaf(g,x,y,2.6+r()*2.4,r()*6.28,['#4a7a32','#6a9a40','#2e5a22','#8aa848','#3a6a2a'][r()*5|0]); }
    R(g,'#d8c8a0',w/2-2.5,h*.82,5,1.6); R(g,'#5a3a1e',w/2-1.5,h*.83,3,h*.17); }},
  {k:'fishIce',fn:(g,w,h)=>{ radial(g,w/2,h*.55,w*.75,[[0,'#d8f8ff'],[.7,'#8ad4f0'],[1,'#4aa8d8']]); ell(g,w/2,h/2,11,4,'#6a7a80'); poly(g,[[w/2+10,h/2],[w/2+15,h/2-4],[w/2+15,h/2+4]],'#6a7a80'); for(let x=-8;x<9;x+=3) R(g,'#c8d0d4',w/2+x,h/2-3.4,1.4,1); ell(g,w/2-8,h/2-1,.8,.8,'#121014');
    for(let k=0;k<8;k++) R(g,rgba('#ffffff',.45),k*4,0,1,h); R(g,'#ffffff',0,0,w,1.2); }}
  ],4,4,72); }

/* ---------- The Rusty Anchor ---------- */
function qGilt(g,w,h,b=3){ for(let i=0;i<b;i++){ const c=mix('#e8c860','#7a5a1a',i/b); g.strokeStyle=c; g.lineWidth=1; g.strokeRect(i+.5,i+.5,w-1-2*i,h-1-2*i); } }
function qTufted(g,w,h,base,step=8){ vfill(g,0,0,w,h,[[0,mix(base,'#ffffff',.1)],[1,mix(base,'#000000',.25)]]);
  for(let y=-step/2,row=0;y<h+step;y+=step/2,row++) for(let x=(row%2?step/2:0)-step;x<w+step;x+=step){ radial(g,x,y,step*.62,[[0,rgba('#ffffff',.14)],[.7,rgba('#ffffff',0)],[1,rgba('#000000',0)]]); }
  g.strokeStyle=rgba('#000000',.35); g.lineWidth=.6; for(let y=-step/2,row=0;y<h+step;y+=step/2,row++) for(let x=(row%2?step/2:0)-step;x<w+step;x+=step){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+step/2,y+step/2); g.moveTo(x,y); g.lineTo(x-step/2,y+step/2); g.stroke(); ell(g,x,y,.9,.9,mix(base,'#000000',.55)); ell(g,x-.3,y-.3,.4,.4,rgba('#ffffff',.4)); } }
function qAtlasPub(){ const oak='#5a3420', oakD='#2e180c', brass='#d4ad5a', gold='#e0b850';
  return qAtlas(32,8,9,[
  {k:'mirror2',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#4a4a42'],[.5,'#2a2a26'],[1,'#3a3832']]); qSheen(g,0,0,w,h,.16,.25,.1); qSheen(g,0,0,w,h,.08,.7,.05); qGilt(g,w,h,3);
    for(const [x,y,sx,sy] of [[6,6,1,1],[w-6,6,-1,1],[6,h-6,1,-1],[w-6,h-6,-1,-1]]){ g.strokeStyle=rgba(gold,.8); g.lineWidth=.8; g.beginPath(); g.moveTo(x,y+sy*10); g.quadraticCurveTo(x,y,x+sx*10,y); g.stroke(); g.beginPath(); g.arc(x+sx*4,y+sy*4,2.4,0,Math.PI*2); g.stroke(); }
    g.strokeStyle=rgba(gold,.6); g.lineWidth=.6; g.beginPath(); g.ellipse(w/2,h/2,10,6,0,0,Math.PI*2); g.stroke(); qLeaf(g,w/2-9,h/2,8,Math.PI,rgba(gold,.6)); qLeaf(g,w/2+9,h/2,8,0,rgba(gold,.6)); }},
  {k:'mirror',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#4a4a42'],[.5,'#2a2a26'],[1,'#3a3832']]); qSheen(g,0,0,w,h,.18,.3,.1); qSheen(g,0,0,w,h,.1,.65,.05); qGilt(g,w,h,3);
    text(g,'THE',(w-textW('THE',.8))/2,14,gold,.8); text(g,'RUSTY',(w-textW('RUSTY',1.2))/2,20,gold,1.2); text(g,'ANCHOR',(w-textW('ANCHOR',1.2))/2,28,gold,1.2); for(const s of [-1,1]){ R(g,gold,w/2+s*12-4,37,8,.5); } text(g,'EST 1888',(w-textW('EST 1888',.8))/2,41,rgba(gold,.85),.8); qFan(g,w/2,h-8,8,8,rgba(gold,.6),.5); }},
  {k:'ship',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h*.55,[[0,'#d8c8a0'],[1,'#a8b0a0']]); vfill(g,0,h*.55,w,h*.45,[[0,'#3a5a62'],[1,'#1e3036']]); for(let i=0;i<10;i++) R(g,rgba('#e8e0c8',.4),(i*13)%w,h*.6+(i*7)%20,6,.6);
    poly(g,[[14,h*.6],[50,h*.6],[46,h*.68],[18,h*.68]],'#3a2414'); for(const [x,t] of [[24,14],[34,10],[43,18]]){ R(g,'#2a1a10',x,t,1,h*.6-t); poly(g,[[x-7,t+4],[x+7,t+4],[x+6,t+14],[x-6,t+14]],'#f2ead6'); poly(g,[[x-6,t+16],[x+6,t+16],[x+5,t+24],[x-5,t+24]],'#e8dec8'); }
    for(let k=0;k<6;k++) ell(g,8+k*9,10+(k%2)*3,5,2,rgba('#ffffff',.4)); qGilt(g,w,h,4); }},
  {k:'chalk',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2e3430'],[1,'#1e2420']]); const r=rng(301); for(let i=0;i<80;i++) R(g,rgba('#ffffff',.04),r()*w,r()*h,3+r()*6,.6); qGilt(g,w,h,0); g.strokeStyle='#6a4a2a'; g.lineWidth=3; g.strokeRect(1.5,1.5,w-3,h-3);
    const L=[['TODAY','#f2e8b0',1.4],['PIE AND MASH  6.50','#f4f4ee',.8],['FISH CHIPS  8.00','#f4f4ee',.8],['SCOTCH EGG  3.00','#f4f4ee',.8],['PLOUGHMANS  7.00','#f4f4ee',.8],['SUN ROAST  12.00','#f4f4ee',.8],['QUIZ THURS 8PM','#f2b0b0',.8]];
    let y=6; for(const [t,c,s] of L){ text(g,t,(w-textW(t,s))/2,y,c,s); y+=s>1?11:7; } }},
  {k:'etched',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8dcc0'],[1,'#c8b890']]); const r=rng(302); for(let i=0;i<400;i++) R(g,rgba('#ffffff',.2),r()*w,r()*h,.6,.6);
    g.strokeStyle='#8a7a58'; g.lineWidth=1.4; g.strokeRect(4,4,w-8,h-8); for(const [x,y] of [[8,8],[w-8,8],[8,h-8],[w-8,h-8]]){ g.beginPath(); g.arc(x,y,5,0,Math.PI*2); g.stroke(); }
    g.lineWidth=1; for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; g.beginPath(); g.ellipse(w/2+Math.cos(a)*7,h/2-4+Math.sin(a)*7,5,2,a,0,Math.PI*2); g.stroke(); } text(g,'SNUG',(w-textW('SNUG',2))/2,h-20,'#7a6a48',2); qSheen(g,0,0,w,h,.25,.3,.08); }},
  {k:'scarf',cw:2,fn:(g,w,h)=>{ for(let x=0;x<w;x+=8){ R(g,'#b81c22',x,0,4,h-6); R(g,'#f2ece0',x+4,0,4,h-6); } for(let y=0;y<h-6;y+=2) R(g,rgba('#000000',.08),0,y,w,.7); for(let x=0;x<w;x+=1.4) R(g,(x/8|0)%2?'#f2ece0':'#b81c22',x,h-6,.8,6); R(g,'#3a1a10',0,h-6.5,w,.5); }},
  {k:'tv',cw:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#1a3a6a'],[.25,'#2a4a3a'],[.3,'#3a9a48'],[1,'#26782e']]); for(let x=0;x<w;x+=8) R(g,rgba('#ffffff',.06),x,h*.3,4,h); const r=rng(303); for(let i=0;i<120;i++) R(g,['#c8c0b0','#b82a22','#2a3a8a','#e8e0d0'][r()*4|0],r()*w,r()*h*.25,.6,.6);
    g.strokeStyle=rgba('#ffffff',.7); g.lineWidth=.5; g.beginPath(); g.moveTo(w*.62,h*.3); g.lineTo(w*.5,h); g.stroke(); g.beginPath(); g.ellipse(w*.56,h*.65,6,3,0,0,Math.PI*2); g.stroke();
    for(let k=0;k<8;k++){ const x=10+k*6+(k%3)*2, y=h*.45+(k*5)%12, c=k<4?'#b81c22':'#2a4ab8'; R(g,c,x,y,1.4,2.6); R(g,'#f4d8b8',x+.2,y-1,1,1); R(g,'#121214',x,y+2.6,.6,1.2); R(g,'#121214',x+.8,y+2.6,.6,1.2); } ell(g,34,h*.62,.8,.8,'#ffffff');
    R(g,rgba('#0a0a14',.85),2,2,30,6); text(g,'ANC 2-1 HBR',3,3,'#f4f4ee',.8); R(g,'#e8c040',24,2,8,6); text(g,'71',25.5,3,'#121214',.8); }},
  {k:'sign',cw:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#1e2a3a'],[1,'#121a26']]); qGilt(g,w,h,2); const a=w*.2; R(g,gold,a-.6,6,1.2,16); g.strokeStyle=gold; g.lineWidth=1.2; g.beginPath(); g.arc(a,16,6,.2,Math.PI-.2); g.stroke(); R(g,gold,a-4,9,8,1); ell(g,a,6,1.6,1.6,gold);
    text(g,'THE RUSTY',w*.36,7,gold,1); text(g,'ANCHOR',w*.36,15,gold,1.4); }},
  {k:'barPanel',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#6a3c22',oakD,311,{vert:true,lines:12}); qBevel(g,5,5,w-10,h-10,'#7a4628',.35,1.2); qInset(g,8,8,w-16,h-16,'#5a3018',.3,.8); qSheen(g,8,8,w-16,h-16,.08,.3,.2); }},
  {k:'oak',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#6a3c22',oakD,312,{lines:14}); }},
  {k:'oakV',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#6a3c22',oakD,313,{vert:true,lines:14}); }},
  {k:'mahog',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#5a2216','#2a0e08',314,{lines:12}); qSheen(g,0,0,w,h,.18,.35,.12); }},
  {k:'brass',fn:(g,w,h)=>{ qMetal(g,0,0,w,h,brass); }},
  {k:'tufted',fn:(g,w,h)=>{ qTufted(g,w,h,'#7a1a18',8); }},
  {k:'chesL',fn:(g,w,h)=>{ qTufted(g,w,h,'#5a2a18',8); }},
  {k:'leather',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#8a2420'],[1,'#5a1210']]); radial(g,w/2,h/2,w*.6,[[0,rgba('#ffffff',.14)],[1,rgba('#000000',.15)]]); R(g,'#3a0a08',0,0,w,1); R(g,'#3a0a08',0,h-1,w,1); for(let x=1;x<w;x+=2.5) ell(g,x,1.8,.4,.4,brass); }},
  {k:'felt',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.75,[[0,'#2a8a48'],[1,'#1a5a30']]); const r=rng(315); for(let i=0;i<150;i++) R(g,rgba(r()<.5?'#000000':'#ffffff',.05),r()*w,r()*h,.6,.6); }},
  {k:'ball',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f4f2ea',.3); ell(g,w*.3,h/2,5,5,'#f4f2ea'); text(g,'8',w*.3-1.5,h/2-2.5,'#121214',1); ell(g,w*.8,h/2,5,5,'#f4f2ea'); }},
  {k:'pocket',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#050404'],[.7,'#1a1410'],[1,'#3a2a1a']]); }},
  {k:'dart',fn:(g,w,h)=>{ R(g,'#121214',0,0,w,h); const cx=w/2,cy=h/2; const seg=(r0,r1,ca,cb)=>{ for(let k=0;k<20;k++){ const a=(k-.5)/20*Math.PI*2,a2=(k+.5)/20*Math.PI*2; g.fillStyle=k%2?ca:cb; g.beginPath(); g.arc(cx,cy,r1,a,a2); g.arc(cx,cy,r0,a2,a,true); g.fill(); } };
    seg(0,15,'#f2e2b8','#1a1a1a'); seg(13,14.4,'#2a8a3a','#c8202a'); seg(8,9.3,'#2a8a3a','#c8202a'); ell(g,cx,cy,1.8,1.8,'#2a8a3a'); ell(g,cx,cy,.8,.8,'#c8202a'); g.strokeStyle='#c8c8c8'; g.lineWidth=.3; for(let k=0;k<20;k++){ const a=(k-.5)/20*Math.PI*2; g.beginPath(); g.moveTo(cx+Math.cos(a)*1.8,cy+Math.sin(a)*1.8); g.lineTo(cx+Math.cos(a)*14.4,cy+Math.sin(a)*14.4); g.stroke(); } }},
  {k:'pint',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c87a20',.35); R(g,'#f4ead0',0,0,w,h*.16); R(g,rgba('#ffffff',.5),0,h*.16,w,.8); for(let i=0;i<10;i++) ell(g,(i*7)%w,h*.3+(i*5)%(h*.6),.4,.4,rgba('#fff0c0',.6)); qSheen(g,0,0,w,h,.25,.3,.06); }},
  {k:'stout',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#1a0e08',.2); R(g,'#f0e2c0',0,0,w,h*.14); R(g,rgba('#c8a060',.6),0,h*.14,w,1); qSheen(g,0,0,w,h,.2,.3,.06); }},
  {k:'mat1',fn:(g,w,h)=>{ ell(g,w/2,h/2,w/2,h/2,'#f2ece0'); ell(g,w/2,h/2,w/2-2,h/2-2,'#b81c22'); text(g,'OLD',w/2-5.5,h/2-6,'#f2ece0',1.2); text(g,'ANCHOR',w/2-11,h/2+1,'#f2ece0',.9); }},
  {k:'mat2',fn:(g,w,h)=>{ R(g,'#1a3a6a',0,0,w,h); R(g,'#e8c040',1,1,w-2,1); R(g,'#e8c040',1,h-2,w-2,1); text(g,'BOSUNS',3,10,'#e8c040',1); text(g,'BITTER',3,17,'#f4f4ee',1); }},
  {k:'clip1',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#b81c22'],[1,'#7a1014']]); qGilt(g,w,h,1.5); text(g,'OLD',w/2-5.5,6,'#f2e2b0',1.2); text(g,'ANCHOR',w/2-11,14,'#f2e2b0',.9); text(g,'4.2',w/2-5,22,'#ffffff',1); }},
  {k:'clip2',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#1a3a6a'],[1,'#0e2244']]); qGilt(g,w,h,1.5); text(g,'BOSUNS',w/2-11.5,6,'#e8c040',1); text(g,'BITTER',w/2-11.5,13,'#f4f4ee',1); text(g,'3.8',w/2-5,22,'#e8c040',1); }},
  {k:'clip3',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8c040'],[1,'#b88a20']]); qGilt(g,w,h,1.5); text(g,'HARBOUR',w/2-13.5,6,'#2a1a10',.9); text(g,'GOLD',w/2-7.5,13,'#2a1a10',1.2); text(g,'4.5',w/2-5,22,'#7a1014',1); }},
  {k:'handle',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f4f0e6',.3); for(const y of [h*.15,h*.5,h*.85]) R(g,'#1a1a1a',0,y,w,2); R(g,'#c8a050',0,h-4,w,4); }},
  {k:'bottleS',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#d8c8a0',.35); R(g,'#f2ece0',0,h*.35,w,h*.3); R(g,'#2a1a10',0,h*.35+3,w,1.2); text(g,'XO',3,h*.45,'#7a1014',1); text(g,'XO',w/2+3,h*.45,'#7a1014',1); R(g,'#2a2a2a',0,0,w,h*.1); qSheen(g,0,0,w,h,.3,.25,.05); }},
  {k:'optic',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#d8dcde',.4); R(g,rgba('#ffffff',.3),0,h*.2,w,h*.5); qMetal(g,0,h*.75,w,h*.25,brass); }},
  {k:'tileG',fn:(g,w,h)=>{ qTiles(g,0,0,w,h,16,8,'#2a6a4a','#1a2a20',316,{hi:.4}); }},
  {k:'iron',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a3836'],[1,'#1a1918']]); R(g,rgba('#ffffff',.18),0,0,w,1); for(let x=4;x<w;x+=8) ell(g,x,h/2,2,2,rgba('#000000',.3)); }},
  {k:'fire',fn:(g,w,h)=>{ R(g,'#120604',0,0,w,h); for(let x=-2;x<w;x+=4){ const t=8+Math.sin(x*1.7)*5; g.fillStyle=grad(g,0,h,0,h-t-14,[[0,'#ffe080'],[.4,'#ff9a20'],[1,'#a02a08']]); g.beginPath(); g.moveTo(x-2,h); g.quadraticCurveTo(x+1,h-t,x+2,h-t-12); g.quadraticCurveTo(x+3,h-t,x+6,h); g.fill(); } }},
  {k:'coal',fn:(g,w,h)=>{ R(g,'#141210',0,0,w,h); const r=rng(317); for(let i=0;i<30;i++){ ell(g,r()*w,r()*h,2+r()*2,1.5+r()*1.5,r()<.35?'#ff6a10':'#2a2624'); } }},
  {k:'clockF',fn:(g,w,h)=>{ radial(g,w/2,h/2,w/2,[[0,'#f4ecd8'],[.85,'#e0d4b4'],[.9,brass],[1,'#7a5a1a']]); for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; R(g,'#1a1a1a',w/2+Math.cos(a)*11-.5,h/2+Math.sin(a)*11-.5,1,1); } g.strokeStyle='#1a1a1a'; g.lineWidth=1; g.beginPath(); g.moveTo(w/2,h/2); g.lineTo(w/2+5,h/2-4); g.moveTo(w/2,h/2); g.lineTo(w/2-1,h/2-9); g.stroke(); }},
  {k:'gilt',fn:(g,w,h)=>{ qMetal(g,0,0,w,h,'#c8a048'); for(let x=1.5;x<w;x+=3) ell(g,x,h/2,.9,.9,rgba('#fff0b0',.5)); }},
  {k:'shade',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#2a6a3a',.35); R(g,'#f2ece0',0,h-2,w,2); R(g,brass,0,0,w,2); }},
  {k:'shadeIn',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#fff4d8'],[1,'#c8c0a8']]); }},
  {k:'sconce',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f4e8c8',.15); for(let x=0;x<w;x+=4) R(g,rgba('#c8a060',.3),x,0,1,h); R(g,brass,0,h-2,w,2); }},
  {k:'crisps',fn:(g,w,h)=>{ R(g,'#2a5ab8',0,0,w/2,h); R(g,'#c82a22',w/2,0,w/2,h); for(const x of [0,w/2]){ ell(g,x+w/4,h*.55,5,4,'#f2c040'); text(g,'CRISP',x+2,4,'#ffffff',.8); } }},
  {k:'till',fn:(g,w,h)=>{ qMetal(g,0,0,w,h,'#b89048'); for(let y=8;y<h-4;y+=5) for(let x=3;x<w-3;x+=5){ ell(g,x+1.5,y,1.6,1.6,'#f4f0e6'); ell(g,x+1.5,y,1.6,.6,rgba('#000000',.2)); } R(g,'#1a1a1a',4,1,w-8,5); text(g,'3.80',6,2,'#f4f4ee',.8); }},
  {k:'newsp',fn:(g,w,h)=>{ R(g,'#e8e2d2',0,0,w,h); text(g,'THE DAILY',3,2,'#1a1a1a',1); R(g,'#1a1a1a',2,8,w-4,.6); for(let y=10;y<h-2;y+=2) R(g,rgba('#3a3a3a',.5),2+(y%6),y,w/2-4,.6); R(g,'#8a8a8a',w/2+1,11,w/2-3,10); for(let y=23;y<h-2;y+=2) R(g,rgba('#3a3a3a',.5),w/2+1,y,w/2-3,.6); }},
  {k:'scoreB',fn:(g,w,h)=>{ R(g,'#1e2420',0,0,w,h); g.strokeStyle='#6a4a2a'; g.lineWidth=2; g.strokeRect(1,1,w-2,h-2); text(g,'501',4,3,'#f4f4ee',1.2); R(g,'#f4f4ee',w/2-.3,10,.6,h-12); text(g,'341',3,12,'#f4f4ee',.8); text(g,'280',w/2+2,12,'#f4f4ee',.8); text(g,'201',3,19,'#c8c8c0',.8); }},
  {k:'buoy',fn:(g,w,h)=>{ for(let x=0;x<w;x+=8){ R(g,'#e8e0d0',x,0,4,h); R(g,'#c82a22',x+4,0,4,h); } vfill(g,0,0,w,h,[[0,rgba('#ffffff',.2)],[.5,rgba('#ffffff',0)],[1,rgba('#000000',.3)]]); }},
  {k:'curtain',fn:(g,w,h)=>{ for(let x=0;x<w;x++){ const v=.5+.5*Math.sin(x/w*Math.PI*2*5); R(g,mix('#4a0a0e','#9a1a22',v),x,0,1,h); } R(g,gold,0,h-2,w,2); for(let x=0;x<w;x+=2) R(g,gold,x,h-3.5,1,1.5); }},
  {k:'map',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8d8b0'],[1,'#c8b088']]); g.fillStyle='#b89a6a'; g.beginPath(); g.moveTo(4,6); g.quadraticCurveTo(14,4,16,12); g.quadraticCurveTo(12,20,6,24); g.lineTo(4,24); g.fill(); g.beginPath(); g.ellipse(24,18,5,8,.3,0,Math.PI*2); g.fill(); g.strokeStyle=rgba('#6a4a2a',.5); g.lineWidth=.4; for(let k=0;k<6;k++){ g.beginPath(); g.moveTo(w/2,h/2); g.lineTo(w/2+Math.cos(k)*16,h/2+Math.sin(k)*16); g.stroke(); } ell(g,w/2,h/2,2,2,'#7a1014'); qGilt(g,w,h,2); }},
  {k:'photo',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#d8c8a0'],[1,'#8a7a5a']]); for(let k=0;k<5;k++){ const x=5+k*5.5; ell(g,x,12,1.8,2.2,'#4a3a28'); R(g,'#3a2a1a',x-2.2,14,4.4,10); } R(g,'#2a1a10',2,24,w-4,4); qGilt(g,w,h,2); }}
  ],4,3,73); }

/* ---------- Trattoria Assunta ---------- */
function qLemon(g,x,y,s,a=0){ g.save(); g.translate(x,y); g.rotate(a); ell(g,0,0,3.2*s,2.3*s,'#e8b818'); ell(g,-.6*s,-.6*s,2*s,1.3*s,'#f8dc48'); ell(g,-1*s,-1*s,.7*s,.4*s,'#fff4a0'); ell(g,3.2*s,0,.6*s,.5*s,'#c89a10'); g.restore(); }
function qMajolica(g,x,y,s,seed){ R(g,'#f4ecd8',x,y,s,s); const c=x+s/2,cy=y+s/2; g.strokeStyle='#2a4a9a'; g.lineWidth=s*.06; g.strokeRect(x+s*.06,y+s*.06,s*.88,s*.88);
  for(const [dx,dy] of [[0,0],[s,0],[0,s],[s,s]]){ g.fillStyle='#2a4a9a'; g.beginPath(); g.arc(x+dx,y+dy,s*.22,0,Math.PI*2); g.fill(); g.fillStyle='#e8b818'; g.beginPath(); g.arc(x+dx,y+dy,s*.11,0,Math.PI*2); g.fill(); }
  for(let k=0;k<4;k++){ const a=k*Math.PI/2+Math.PI/4; qLeaf(g,c,cy,s*.32,a,'#3a8a3a'); } qLemon(g,c,cy,s*.09,seed%2?.4:-.5); }
function qAtlasTrattoria(){ const red='#c8302a', cream='#f4efe6';
  const gingham=(g,w,h,cell)=>{ R(g,cream,0,0,w,h); for(let x=0;x<w;x+=cell*2) R(g,rgba(red,.55),x,0,cell,h); for(let y=0;y<h;y+=cell*2) R(g,rgba(red,.55),0,y,w,cell); for(let y=0;y<h;y+=.8) R(g,rgba('#000000',.04),0,y,w,.35); };
  return qAtlas(32,8,9,[
  {k:'madonna',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a6ab0'],[1,'#1e3a70']]); radial(g,w/2,h*.38,22,[[0,'#f8e090'],[.6,'#e0b040'],[1,rgba('#e0b040',0)]]); poly(g,[[w/2,h*.28],[w/2+14,h*.95],[w/2-14,h*.95]],'#2a4ab0'); poly(g,[[w/2,h*.34],[w/2+8,h*.95],[w/2-8,h*.95]],'#c8303a');
    ell(g,w/2,h*.3,5,6,'#f0c8a0'); g.strokeStyle='#f8e070'; g.lineWidth=1.2; g.beginPath(); g.arc(w/2,h*.3,9,0,Math.PI*2); g.stroke(); for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; ell(g,w/2+Math.cos(a)*13,h*.3+Math.sin(a)*13,.8,.8,'#f8e070'); }
    for(const s of [-1,1]) for(let k=0;k<4;k++) qPeony(g,w/2+s*(20+k%2*3),h*.55+k*7,.45,'#f0f0e8','#ffffff','#e8c050'); qGilt(g,w,h,4); }},
  {k:'vesuvio',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h*.6,[[0,'#f0a860'],[1,'#f8e0b0']]); poly(g,[[6,h*.6],[26,h*.22],[36,h*.26],[56,h*.6]],'#6a5a7a'); poly(g,[[22,h*.3],[26,h*.22],[36,h*.26],[40,h*.32]],'#5a4a6a'); for(let k=0;k<4;k++) ell(g,32+k*4,h*.17-k*3,4+k,2.5+k*.5,rgba('#e8e0d8',.8-k*.12));
    vfill(g,0,h*.6,w,h*.4,[[0,'#3a7ab0'],[1,'#1e4a80']]); for(let i=0;i<14;i++) R(g,rgba('#ffffff',.5),(i*11)%w,h*.64+(i*5)%20,5,.6); for(let k=0;k<5;k++) R(g,['#f4e0c0','#e8b880','#f0d0a0'][k%3],2+k*5,h*.5,4,h*.1); poly(g,[[40,h*.8],[52,h*.8],[50,h*.85],[42,h*.85]],'#f4efe6'); R(g,'#c8302a',46,h*.7,1,h*.1); qGilt(g,w,h,4); }},
  {k:'chalk',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2e3430'],[1,'#1e2420']]); const r=rng(401); for(let i=0;i<80;i++) R(g,rgba('#ffffff',.04),r()*w,r()*h,3+r()*6,.6); g.strokeStyle='#7a4a2a'; g.lineWidth=3; g.strokeRect(1.5,1.5,w-3,h-3);
    let y=6; for(const [t,c,s] of [['OGGI','#f2e8b0',1.4],['MARGHERITA  7','#f4f4ee',.8],['MARINARA  6','#f4f4ee',.8],['GENOVESE  12','#f4f4ee',.8],['FRITTATINA  4','#f4f4ee',.8],['BABA  4','#f4f4ee',.8],['CAFFE  1','#f2b0b0',.8]]){ text(g,t,(w-textW(t,s))/2,y,c,s); y+=s>1?11:7; } qLemon(g,10,h-8,1); qLemon(g,w-10,h-8,1,2); }},
  {k:'shutter',ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a7a4a'],[1,'#2a5a36']]); for(let y=6;y<h-6;y+=3){ R(g,'#1e3e26',4,y,w-8,1.2); R(g,rgba('#ffffff',.25),4,y+1.2,w-8,.6); } qBevel(g,0,0,w,h,'#3a7a4a',.0,1); R(g,'#2a5a36',0,0,3,h); R(g,'#2a5a36',w-3,0,3,h); R(g,'#2a5a36',0,h/2-1.5,w,3); R(g,'#2a5a36',0,0,w,4); R(g,'#2a5a36',0,h-4,w,4); const r=rng(402); for(let i=0;i<30;i++) R(g,rgba('#e8e0c8',.25),r()*w,r()*h,1+r()*2,.6); }},
  {k:'signT',cw:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a5a36'],[1,'#1e4428']]); qGilt(g,w,h,2); text(g,'TRATTORIA',(w-textW('TRATTORIA',1))/2,5,'#f2e8c0',1); text(g,'ASSUNTA',(w-textW('ASSUNTA',1.6))/2,14,'#f8d848',1.6); qLemon(g,6,h/2,1); qLemon(g,w-6,h/2,1,2.5); }},
  {k:'glassCase',cw:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e0eef0'],[1,'#b8d0d4']]); R(g,'#f4f4ee',0,h-6,w,6); for(let k=0;k<5;k++) ell(g,6+k*4.5,h-8,2.2,2,'#fbfaf2'); for(let k=0;k<4;k++){ ell(g,30+k*5,h-8,2.6,2.6,'#a8302a'); ell(g,30+k*5,h-8,1.8,1.8,'#d86a5a'); for(let j=0;j<5;j++) ell(g,30+k*5+(j%3-1),h-8+(j>>1)-1,.3,.3,'#f4e0d0'); }
    for(let k=0;k<8;k++) ell(g,52+(k%4)*2.4,h-7-(k>>2)*2,1,1,k%2?'#3a4a1a':'#6a7a2a'); qSheen(g,0,0,w,h,.35,.25,.08); qSheen(g,0,0,w,h,.2,.7,.04); R(g,'#c8c8c0',0,0,w,1); }},
  {k:'check',fn:(g,w,h)=>gingham(g,w,h,4)},
  {k:'checkS',fn:(g,w,h)=>{ gingham(g,w,h,4); for(let x=0;x<w;x++){ const v=Math.sin(x/w*Math.PI*6); R(g,rgba(v>0?'#ffffff':'#000000',Math.abs(v)*.15),x,0,1,h); } g.fillStyle=grad(g,0,0,0,h,[[0,rgba('#ffffff',.1)],[1,rgba('#000000',.2)]]); g.fillRect(0,0,w,h); R(g,rgba('#000000',.2),0,h-2,w,1); }},
  {k:'runner',fn:(g,w,h)=>{ R(g,'#fbf8f0',0,0,w,h); const r=rng(403); for(let i=0;i<100;i++) R(g,rgba('#d8d0c0',.4),r()*w,r()*h,.6,.6); g.strokeStyle='#e0d8c4'; g.lineWidth=.6; g.strokeRect(2,2,w-4,h-4); for(let x=1;x<w;x+=3){ ell(g,x,1,1,1,'#ece4d4'); ell(g,x,h-1,1,1,'#ece4d4'); ell(g,1,x,1,1,'#ece4d4'); ell(g,w-1,x,1,1,'#ece4d4'); } }},
  {k:'plate',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#ffffff'],[.65,'#f6f2ea'],[1,'#dcd6ca']]); g.strokeStyle='#2a7a4a'; g.lineWidth=1.2; g.beginPath(); g.arc(w/2,h/2,w*.44,0,Math.PI*2); g.stroke(); g.strokeStyle=red; g.lineWidth=.5; g.beginPath(); g.arc(w/2,h/2,w*.4,0,Math.PI*2); g.stroke(); }},
  {k:'pasta',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#ffffff'],[.7,'#f4f0e8'],[1,'#d8d2c4']]); ell(g,w/2,h/2,9,8,'#e8c068'); g.strokeStyle='#f4d890'; g.lineWidth=.8; for(let k=0;k<12;k++){ g.beginPath(); g.arc(w/2+(k%3-1)*2,h/2+(k%4-1.5)*1.6,3+k%3,k,k+2.5); g.stroke(); } for(let k=0;k<7;k++) ell(g,w/2+Math.cos(k)*5,h/2+Math.sin(k*1.7)*4,1.6,1.4,'#c83020'); ell(g,w/2+2,h/2-2,1.6,1,'#3a8a3a'); }},
  {k:'glass',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#e8f0f0',.25); qSheen(g,0,0,w,h,.4,.25,.05); R(g,rgba('#ffffff',.5),0,0,w,1); }},
  {k:'wine',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#e8f0f0',.2); R(g,'#6a0a1a',0,h*.45,w,h*.55); R(g,'#9a1a2a',0,h*.45,w,1); qSheen(g,0,0,w,h,.35,.25,.05); }},
  {k:'fiasco',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#3a6a2a',.3); for(let y=h*.45;y<h;y+=1.6){ R(g,'#d8b868',0,y,w,1.1); for(let x=(y|0)%3;x<w;x+=3) R(g,'#a8883a',x,y,1,1.1); } R(g,'#a8883a',0,h*.43,w,1.5); for(let k=0;k<6;k++){ const x=k*5.5+1; R(g,'#f4f0e0',x,0,1.6,4+(k*3)%9); ell(g,x+.8,4+(k*3)%9,1.1,1.4,'#f4f0e0'); } qSheen(g,0,0,w,h*.45,.3,.3,.06); }},
  {k:'bread',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#d8a050',.35); for(let x=3;x<w;x+=7) R(g,rgba('#7a4a18',.5),x,0,1.4,h*.5); const r=rng(404); for(let i=0;i<30;i++) R(g,rgba('#f8e8c8',.4),r()*w,r()*h,.8,.6); }},
  {k:'basket',fn:(g,w,h)=>{ R(g,'#b88a48',0,0,w,h); for(let y=0;y<h;y+=2) for(let x=(y/2%2)*2;x<w;x+=4){ R(g,'#d8aa60',x,y,2,1.4); R(g,rgba('#000000',.2),x,y+1.4,2,.6); } }},
  {k:'rush',fn:(g,w,h)=>{ R(g,'#b8a060',0,0,w,h); g.lineWidth=1.2; for(let i=-h;i<w;i+=2.2){ g.strokeStyle=(i/2.2|0)%2?'#d8c078':'#a08848'; g.beginPath(); g.moveTo(i,0); g.lineTo(i+h,h); g.stroke(); g.beginPath(); g.moveTo(i+h,0); g.lineTo(i,h); g.stroke(); } g.strokeStyle=rgba('#5a4a20',.5); g.lineWidth=.6; g.beginPath(); g.moveTo(0,0); g.lineTo(w,h); g.moveTo(w,0); g.lineTo(0,h); g.stroke(); }},
  {k:'walnut',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#8a5a34','#5a3418',405,{lines:12}); }},
  {k:'walnutV',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#8a5a34','#5a3418',406,{vert:true,lines:12}); }},
  {k:'ladder',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#8a5a34','#5a3418',407,{vert:true,lines:8}); for(const y of [5,13,21]){ R(g,rgba('#000000',.5),3,y+5,w-6,2.2); } qBevel(g,0,0,w,h,'#000000',0,1); }},
  {k:'ham',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#a85a38',.35); R(g,'#f0e0c8',0,h*.82,w,h*.18); for(let x=0;x<w;x+=4) R(g,rgba('#3a2010',.35),x,0,.6,h); for(let y=0;y<h;y+=4) R(g,rgba('#3a2010',.35),0,y,w,.6); R(g,'#e8dcc0',0,0,w,2); }},
  {k:'salami',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#7a3a2a',.3); const r=rng(408); for(let i=0;i<40;i++) ell(g,r()*w,r()*h,.8,.6,rgba('#f0e8d8',.6)); for(let y=2;y<h;y+=5) R(g,rgba('#e8e0c8',.5),0,y,w,.5); }},
  {k:'provolone',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#e8c060',.3); for(let x=0;x<w;x+=6){ R(g,rgba('#7a5a2a',.5),x,0,.8,h); } for(let y=4;y<h;y+=7) R(g,rgba('#7a5a2a',.5),0,y,w,.8); }},
  {k:'garlic',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f2ece0',.25); for(let x=0;x<w;x+=5) R(g,rgba('#a89a8a',.4),x,0,.6,h); R(g,'#a89a7a',0,0,w,3); }},
  {k:'chilli',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c8201a',.4); R(g,'#3a7a2a',0,0,w,4); }},
  {k:'marble',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f2f0ea'],[1,'#dcd8ce']]); const r=rng(409); g.lineWidth=.5; for(let i=0;i<6;i++){ g.strokeStyle=rgba('#8a8a90',.35); g.beginPath(); let x=r()*w,y=r()*h; g.moveTo(x,y); for(let k=0;k<5;k++){ x+=r()*10-3; y+=r()*8-4; g.lineTo(x,y); } g.stroke(); } qSheen(g,0,0,w,h,.12,.4,.15); }},
  {k:'cheese',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#e0b058',.25); for(let x=2;x<w;x+=5){ for(let y=h*.3;y<h*.7;y+=2.4) ell(g,x,y,.6,.6,rgba('#8a5a1a',.5)); } }},
  {k:'cheeseTop',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#f0d488'],[.85,'#e8c070'],[1,'#b8803a']]); const r=rng(410); for(let i=0;i<30;i++) R(g,rgba('#c89a48',.4),r()*w,r()*h,.6,.6); }},
  {k:'tomCan',fn:(g,w,h)=>{ R(g,'#c8302a',0,0,w,h); R(g,'#c8ccd0',0,0,w,2); R(g,'#c8ccd0',0,h-2,w,2); for(const x of [3,w/2+3]){ ell(g,x+5,h/2+2,4,3.4,'#e83a2a'); R(g,'#3a8a3a',x+4,h/2-2,2,1.6); } text(g,'ASSUNTA',2,4,'#f8e8a0',.7); text(g,'ASSUNTA',w/2+2,4,'#f8e8a0',.7); }},
  {k:'oilTin',fn:(g,w,h)=>{ R(g,'#2a6a3a',0,0,w,h); R(g,'#e8c040',0,h*.3,w,h*.4); for(let x=4;x<w;x+=16){ qLeaf(g,x,h*.5,6,0,'#3a7a2a'); ell(g,x+7,h*.5,1.6,1.2,'#5a7a1a'); } R(g,'#c8a040',0,0,w,2); }},
  {k:'packet',fn:(g,w,h)=>{ R(g,'#2a4a9a',0,0,w,h); R(g,'#f4efe6',3,h*.3,w-6,h*.45); for(let k=0;k<5;k++) R(g,'#e8c068',6+k*4,h*.4,2.4,h*.25); R(g,'#c8302a',0,0,w,3); }},
  {k:'jar',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#d8e0d0',.25); const r=rng(411); for(let i=0;i<14;i++) ell(g,r()*w,h*.2+r()*h*.65,2,1.4,r()<.5?'#c8302a':'#e8a020'); R(g,'#c8a040',0,0,w,h*.12); qSheen(g,0,0,w,h,.3,.3,.05); }},
  {k:'wineB',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#1e3a1a',.35); R(g,'#f4ecd8',0,h*.3,w,h*.3); R(g,'#8a1a1a',0,h*.3,w,1.2); text(g,'VINO',2,h*.4,'#5a1a1a',.8); text(g,'VINO',w/2+2,h*.4,'#5a1a1a',.8); R(g,'#8a1a1a',0,0,w,h*.1); qSheen(g,0,0,w,h,.3,.25,.05); }},
  {k:'pot',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c8643a',.3); R(g,'#d87a4a',0,0,w,4); R(g,rgba('#000000',.2),0,4,w,1); }},
  {k:'basil',fn:(g,w,h)=>{ R(g,'#2a5a1e',0,0,w,h); const r=rng(412); for(let i=0;i<60;i++) qLeaf(g,r()*w,r()*h,3+r()*3,r()*6.28,['#3a8a2a','#5aa83a','#2a6a1e'][r()*3|0]); }},
  {k:'lemon',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#f0c818',.3); const r=rng(413); for(let i=0;i<50;i++) R(g,rgba('#b88a00',.25),r()*w,r()*h,.6,.6); }},
  {k:'copper',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c8703a',.45); R(g,'#e8a070',0,0,w,1.5); }},
  {k:'copperIn',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8a070'],[1,'#7a3a18']]); }},
  {k:'logEnd',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#e0c088'],[.85,'#b88a50'],[1,'#5a3a1a']]); g.strokeStyle=rgba('#7a5a30',.5); g.lineWidth=.5; for(let k=2;k<15;k+=2.4){ g.beginPath(); g.arc(w/2,h/2,k,0,Math.PI*2); g.stroke(); } }},
  {k:'bark',fn:(g,w,h)=>{ R(g,'#5a4030',0,0,w,h); const r=rng(414); for(let i=0;i<30;i++) R(g,rgba(r()<.5?'#2a1a10':'#8a7060',.6),r()*w,r()*h,.8,3+r()*5); }},
  {k:'majol',fn:(g,w,h)=>{ qMajolica(g,0,0,16,1); qMajolica(g,16,0,16,2); qMajolica(g,0,16,16,3); qMajolica(g,16,16,16,4); for(let k=0;k<=32;k+=16){ R(g,'#b8b0a0',k-.4,0,.8,h); R(g,'#b8b0a0',0,k-.4,w,.8); } }},
  {k:'photo1',fn:(g,w,h)=>{ R(g,'#2a1a10',0,0,w,h); vfill(g,2,2,w-4,h-4,[[0,'#e0d0a8'],[1,'#a8946c']]); ell(g,w/2,12,4,5,'#6a5a40'); R(g,'#5a4a30',w/2-6,17,12,13); ell(g,w/2-1.4,11,.6,.6,'#2a1a10'); ell(g,w/2+1.4,11,.6,.6,'#2a1a10'); }},
  {k:'photo2',fn:(g,w,h)=>{ R(g,'#2a1a10',0,0,w,h); vfill(g,2,2,w-4,h-4,[[0,'#d8c8a0'],[1,'#9a8a62']]); for(let k=0;k<3;k++){ const x=8+k*8; ell(g,x,13,2.4,3,'#5a4a30'); R(g,'#4a3a22',x-3,16,6,12); } ell(g,24,13,2.6,2.6,'#e8e0d0'); }},
  {k:'photo3',fn:(g,w,h)=>{ R(g,'#2a1a10',0,0,w,h); vfill(g,2,2,w-4,h-4,[[0,'#c8d0d8'],[1,'#8a9098']]); ell(g,12,14,3,3.6,'#4a4038'); R(g,'#3a3028',8,18,8,10); ell(g,21,15,2.6,3.2,'#4a4038'); poly(g,[[17,30],[25,30],[23,18],[19,18]],'#f4f0e8'); }},
  {k:'milk',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#fff8e8'],[1,'#f0e0c0']]); R(g,'#2a7a4a',0,h-2,w,2); }},
  {k:'red',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c8201a',.45); qSheen(g,0,0,w,h,.25,.3,.06); }},
  {k:'chrome',fn:(g,w,h)=>{ qMetal(g,0,0,w,h,'#c8ccd0'); }},
  {k:'steel',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e0e4e8'],[1,'#9aa0a6']]); }},
  {k:'fire',fn:(g,w,h)=>{ R(g,'#140604',0,0,w,h); for(let x=-2;x<w;x+=4){ const t=6+Math.sin(x*1.7)*5; g.fillStyle=grad(g,0,h,0,h-t-14,[[0,'#ffe080'],[.4,'#ff9a20'],[1,'#a02a08']]); g.beginPath(); g.moveTo(x-2,h); g.quadraticCurveTo(x+1,h-t,x+2,h-t-12); g.quadraticCurveTo(x+3,h-t,x+6,h); g.fill(); } const r=rng(415); for(let i=0;i<20;i++) ell(g,r()*w,h-2-r()*4,1.4,1,r()<.5?'#ff6a10':'#3a1a0a'); }},
  {k:'soot',fn:(g,w,h)=>{ radial(g,w/2,h,w,[[0,'#ff8a30'],[.3,'#5a1a08'],[1,'#120806']]); }},
  {k:'lace',fn:(g,w,h)=>{ R(g,'#f4f0e6',0,0,w,h); for(let y=2;y<h;y+=5) for(let x=2+(y/5%2)*2.5;x<w;x+=5){ g.strokeStyle=rgba('#c8c0b0',.7); g.lineWidth=.5; g.beginPath(); g.arc(x,y,1.6,0,Math.PI*2); g.stroke(); } for(let x=0;x<w;x+=3){ g.fillStyle='#f4f0e6'; g.beginPath(); g.arc(x+1.5,h-1,1.5,0,Math.PI); g.fill(); } }},
  {k:'napkin',fn:(g,w,h)=>{ qWeave(g,0,0,w,h,'#fbf6ec',1,.05); R(g,red,0,h-3,w,1); R(g,red,0,2,w,1); }},
  {k:'mozz',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#fbfaf2',.15); }},
  {k:'frame',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#4a2a16','#2a1408',416,{lines:6}); R(g,'#c8a040',0,h/2-.5,w,1); }},
  {k:'oakV',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#5a3a20','#3a2212',417,{vert:true,lines:10}); }},
  {k:'peel',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#d8b07a','#a87c48',418,{vert:true,lines:8}); R(g,rgba('#2a1a0a',.35),0,0,w,4); }}
  ],4,3,74); }

/* ---------- the Aquarium Lounge: an ocean-liner observation lounge in navy, walnut and gold ---------- */
function qFan(g,cx,cy,r,n,col,lw=.8){ g.strokeStyle=col; g.lineWidth=lw; for(let k=0;k<=n;k++){ const a=Math.PI+k/n*Math.PI; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); g.stroke(); } g.beginPath(); g.arc(cx,cy,r,Math.PI,0); g.stroke(); g.beginPath(); g.arc(cx,cy,r*.4,Math.PI,0); g.stroke(); }
function qAtlasAquarium(){ const gold='#f0b050', navy='#14203a';
  return qAtlas(32,8,7,[
  {k:'tank',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3ab8d8'],[.5,'#1a7aa8'],[1,'#0e4a70']]); for(let k=0;k<5;k++){ const x=k*13+4; g.fillStyle=grad(g,x,0,x+6,0,[[0,rgba('#c8f8ff',0)],[.5,rgba('#c8f8ff',.2)],[1,rgba('#c8f8ff',0)]]); g.fillRect(x,0,6,h*.7); }
    for(let k=0;k<9;k++){ const x=3+k*7.2, ht=18+(k*7)%22; g.strokeStyle=k%2?'#2a7a3a':'#3a9a48'; g.lineWidth=1.6; g.beginPath(); g.moveTo(x,h); for(let y=0;y<ht;y+=3) g.lineTo(x+Math.sin(y*.3+k)*1.6,h-y); g.stroke(); }
    for(let k=0;k<7;k++){ ell(g,k*9+5,h-2,5,4,['#d86a5a','#e8a050','#c84a7a','#f0c8a0'][k%4]); for(let j=0;j<4;j++) ell(g,k*9+3+j*1.5,h-5-j%2*2,1,2.4,['#f08a7a','#f8c070'][j%2]); } R(g,'#d8c890',0,h-1.5,w,1.5);
    const r=rng(501); for(let i=0;i<40;i++) ell(g,r()*w,r()*h*.85,.5+r()*.5,.5+r()*.5,rgba('#e8fcff',.6)); }},
  {k:'chart',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#e8dcb8'],[1,'#c8b890']]); g.fillStyle='#b8a878'; g.beginPath(); g.moveTo(40,4); g.quadraticCurveTo(52,16,48,28); g.quadraticCurveTo(44,40,52,60); g.lineTo(64,60); g.lineTo(64,4); g.fill(); g.beginPath(); g.moveTo(0,8); g.quadraticCurveTo(14,14,10,28); g.quadraticCurveTo(18,40,22,58); g.lineTo(0,58); g.fill();
    g.strokeStyle=rgba('#6a5a3a',.3); g.lineWidth=.4; for(let x=0;x<w;x+=8){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,h); g.stroke(); } for(let y=0;y<h;y+=8){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); }
    g.strokeStyle='#b82a22'; g.lineWidth=1; g.setLineDash([2,1.5]); g.beginPath(); g.moveTo(44,14); g.quadraticCurveTo(30,30,20,48); g.stroke(); g.setLineDash([]); ell(g,44,14,1.4,1.4,'#b82a22'); ell(g,20,48,1.4,1.4,'#b82a22'); text(g,'ATLANTIC',18,30,'#4a3a2a',.8); qFan(g,56,54,6,8,'#6a5a3a',.4); qGilt(g,w,h,3); }},
  {k:'decoMirror',cw:2,ch:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#3a4a5a'],[.5,'#1e2a38'],[1,'#2a3644']]); qSheen(g,0,0,w,h,.18,.3,.1); qSheen(g,0,0,w,h,.08,.7,.05); qFan(g,w/2,h-6,26,14,rgba(gold,.55),.6); qFan(g,w/2,h-6,14,8,rgba(gold,.7),.6); qGilt(g,w,h,3); }},
  {k:'kelpC',ch:2,fn:(g,w,h)=>{ for(let k=0;k<4;k++){ const x=5+k*7; g.strokeStyle=k%2?'#2a7a3a':'#4aa04a'; g.lineWidth=2.2; g.beginPath(); g.moveTo(x,h); for(let y=0;y<h-4-k*6;y+=2) g.lineTo(x+Math.sin(y*.15+k)*2.4,h-y); g.stroke(); for(let y=8;y<h-8-k*6;y+=7) qLeaf(g,x+Math.sin(y*.15+k)*2.4,h-y,5,(y%14?-.6:Math.PI+.6),k%2?'#3a8a3a':'#5ab04a'); } }},
  {k:'palmC',ch:2,fn:(g,w,h)=>{ for(let k=0;k<7;k++){ const a=-Math.PI/2+(k-3)*.32; g.strokeStyle='#4a6a2a'; g.lineWidth=.7; const ex=w/2+Math.cos(a)*w*.48, ey=h-4+Math.sin(a)*h*.9; g.beginPath(); g.moveTo(w/2,h-2); g.quadraticCurveTo(w/2+Math.cos(a)*6,ey+h*.3,ex,ey); g.stroke();
    for(let j=1;j<12;j++){ const t=j/12, px=w/2+(ex-w/2)*t, py=(h-2)+(ey-h+2)*t-Math.sin(t*Math.PI)*6; for(const sd of [-1,1]) qLeaf(g,px,py,6*(1-t*.5),a+sd*1.1+Math.PI*(sd<0?0:0),t>.7?'#5a9a3a':'#3a7a2a'); } } }},
  {k:'sign',cw:2,fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#121a2a'],[1,'#0a101c']]); qGilt(g,w,h,2); text(g,'MERIDIAN',(w-textW('MERIDIAN',1.4))/2,6,gold,1.4); R(g,gold,10,15,w-20,.6); text(g,'LOUNGE',(w-textW('LOUNGE',1))/2,19,'#f2e2b0',1); qFan(g,6,h-4,4,5,gold,.4); qFan(g,w-6,h-4,4,5,gold,.4); }},
  {k:'velvetCh',fn:(g,w,h)=>{ for(let x=0;x<w;x+=8){ hfill(g,x,0,8,h,[[0,'#0e2a5a'],[.35,'#2a5aa8'],[.6,'#1e4a8e'],[1,'#0c2450']]); } g.fillStyle=grad(g,0,0,0,h,[[0,rgba('#ffffff',.1)],[1,rgba('#000000',.25)]]); g.fillRect(0,0,w,h); const r=rng(502); for(let i=0;i<120;i++) R(g,rgba('#7aa8e8',.12),r()*w,r()*h,.6,.6); }},
  {k:'velvet',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.7,[[0,'#2a5aa8'],[1,'#12306a']]); const r=rng(503); for(let i=0;i<120;i++) R(g,rgba('#7aa8e8',.12),r()*w,r()*h,.6,.6); R(g,gold,0,0,w,1); R(g,gold,0,h-1,w,1); }},
  {k:'walnut',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#6a4228','#3a2010',504,{lines:12}); qSheen(g,0,0,w,h,.12,.35,.15); }},
  {k:'walnutV',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#6a4228','#3a2010',505,{vert:true,lines:12}); qSheen(g,0,0,w,h,.1,.35,.15); }},
  {k:'gold',fn:(g,w,h)=>{ qMetal(g,0,0,w,h,'#e8a048'); }},
  {k:'goldV',fn:(g,w,h)=>{ qMetal(g,0,0,w,h,'#e8a048',true); }},
  {k:'black',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a2a30'],[1,'#0e0e12']]); qSheen(g,0,0,w,h,.12,.3,.15); }},
  {k:'marbleB',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#2a2a2e'],[1,'#141416']]); const r=rng(506); g.lineWidth=.5; for(let i=0;i<5;i++){ g.strokeStyle=rgba('#c8c0b0',.35); g.beginPath(); let x=r()*w,y=r()*h; g.moveTo(x,y); for(let k=0;k<5;k++){ x+=r()*10-3; y+=r()*8-4; g.lineTo(x,y); } g.stroke(); } qSheen(g,0,0,w,h,.15,.4,.12); }},
  {k:'deco',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#6a4228','#3a2010',507,{vert:true,lines:10}); qFan(g,w/2,h-3,13,10,gold,.7); R(g,gold,2,2,w-4,.6); R(g,gold,2,h-2.6,w-4,.6); R(g,gold,2,2,.6,h-4); R(g,gold,w-2.6,2,.6,h-4); }},
  {k:'pilaster',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#1e2c4c'],[1,'#101a30']]); for(let x=3;x<w-2;x+=5){ hfill(g,x,0,4,h,[[0,'#0a1222'],[.4,'#2a3e66'],[1,'#121c34']]); R(g,rgba(gold,.6),x+3.6,0,.5,h); } }},
  {k:'sconce',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#fff6e0'],[1,'#f0d8a8']]); qFan(g,w/2,h,w*.48,9,rgba('#c8a060',.6),.6); }},
  {k:'shade',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#fff0d0',.12); for(let y=4;y<h;y+=6) R(g,rgba('#d8b880',.4),0,y,w,1); }},
  {k:'glassC',fn:(g,w,h)=>{ for(const [x,wd] of [[w*.2,.22],[w*.215,.1],[w*.66,.14]]) R(g,'#d8f4fc',x,h*.05,wd,h*.9); R(g,'#9ad0e0',0,0,w,1.2); R(g,'#9ad0e0',0,h-1.2,w,1.2); }},
  {k:'coral',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#d86a5a',.3); const r=rng(508); for(let i=0;i<60;i++) ell(g,r()*w,r()*h,.7,.7,rgba('#f8c0a0',.6)); }},
  {k:'rock',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#8a8070',.3); const r=rng(509); for(let i=0;i<60;i++) R(g,rgba(r()<.5?'#5a5040':'#b8b0a0',.4),r()*w,r()*h,1,1); }},
  {k:'martini',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#e8f4f4',.2); R(g,rgba('#d8e8c8',.7),0,h*.72,w,h*.2); qSheen(g,0,0,w,h,.4,.25,.05); }},
  {k:'champ',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#1e3a26',.35); R(g,'#e0b850',0,h*.78,w,h*.22); R(g,'#f4ecd8',0,h*.35,w,h*.2); R(g,'#e0b850',0,h*.35,w,1); qSheen(g,0,0,w,h,.3,.25,.05); }},
  {k:'bottle',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#c8a868',.35); R(g,'#14203a',0,h*.35,w,h*.25); R(g,gold,0,h*.35,w,1); R(g,gold,0,h*.6-1,w,1); R(g,'#2a1a10',0,0,w,h*.1); qSheen(g,0,0,w,h,.3,.25,.05); }},
  {k:'menu',fn:(g,w,h)=>{ R(g,'#f4ecd8',0,0,w,h); qGilt(g,w,h,1.5); text(g,'COCKTAILS',3,4,'#14203a',.7); for(let y=10;y<h-3;y+=3.4) R(g,rgba('#3a3a4a',.5),4,y,w-8,.6); qFan(g,w/2,h-2,4,5,gold,.4); }},
  {k:'gauge',fn:(g,w,h)=>{ radial(g,w/2,h/2,w*.5,[[0,'#f4ecd8'],[.8,'#e0d4b4'],[.86,'#d4ad5a'],[1,'#6a4a1a']]); for(let k=0;k<11;k++){ const a=Math.PI*.75+k/10*Math.PI*1.5; R(g,'#1a1a1a',w/2+Math.cos(a)*10.5-.4,h/2+Math.sin(a)*10.5-.4,.8,.8); } g.strokeStyle='#b82a22'; g.lineWidth=.9; g.beginPath(); g.moveTo(w/2,h/2); g.lineTo(w/2+7,h/2+3); g.stroke(); text(g,'DEPTH',w/2-9.5,h/2+5,'#1a1a1a',.8); text(g,'212M',w/2-7.5,h/2+10,'#1a1a1a',.8); }},
  {k:'radio',fn:(g,w,h)=>{ qWood(g,0,0,w,h,'#6a4228','#3a2010',510,{lines:8}); qFan(g,w/2,h*.7,11,12,'#c8a868',1.2); R(g,'#2a1a10',4,h*.75,w-8,4); R(g,'#e8d8a8',6,h*.76,w-12,2.6); for(const x of [8,w-8]) ell(g,x,h-3,2,2,gold); }},
  {k:'pot',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#d4ad5a',.4); for(const y of [4,h-5]) R(g,'#7a5a1a',0,y,w,1); qFan(g,w*.25,h*.7,6,6,'#7a5a1a',.5); qFan(g,w*.75,h*.7,6,6,'#7a5a1a',.5); }},
  {k:'soil',fn:(g,w,h)=>{ R(g,'#2a1a10',0,0,w,h); const r=rng(511); for(let i=0;i<40;i++) R(g,'#4a3020',r()*w,r()*h,1,1); }},
  {k:'cove',fn:(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#fff4d8'],[1,'#e8c890']]); }},
  {k:'olive',fn:(g,w,h)=>{ qRound(g,0,0,w,h,'#6a8a2a',.3); ell(g,w*.3,h/2,3,3,'#c8302a'); }}
  ],4,3,75); }
