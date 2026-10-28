/* =====================================================================================================
   CAST PAINT KIT: painted form light, folds, seams and trims for the cast's clothes (Img space, see garment() in
   10-engine.js). Torso 128x256 (front centre x=64, sides x=32/96, back at x=0), arms 64x128 and legs 64x128 (front x=32),
   shoes 64x32 (toe x=32, sole at the bottom). Only function declarations here: 45-cast.js paints with them at load,
   before this file's own lines have run.
   ===================================================================================================== */
/* a tapered stroke along a quadratic curve. mode 'mul': brightness x(1+amt); otherwise blend toward a colour */
function curvePaint(I,x0,y0,cx,cy,x1,y1,w,amt,col){
  const N=18,P=[]; for(let i=0;i<=N;i++){ const t=i/N,u=1-t; P.push([u*u*x0+2*u*t*cx+t*t*x1,u*u*y0+2*u*t*cy+t*t*y1,t]); }
  const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),C_=col&&F3(col);
  for(let y=Math.floor(Math.min(...ys)-w-1);y<=Math.max(...ys)+w+1;y++) for(let x=Math.floor(Math.min(...xs)-w-1);x<=Math.max(...xs)+w+1;x++){
    let best=1e9,bt=0; for(let i=0;i<N;i++){ const a=P[i],b=P[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy||1,s=Math.max(0,Math.min(1,((x+.5-a[0])*dx+(y+.5-a[1])*dy)/L2)),d=Math.hypot(x+.5-a[0]-dx*s,y+.5-a[1]-dy*s); if(d<best){ best=d; bt=a[2]+(b[2]-a[2])*s; } }
    const wd=w*Math.pow(Math.sin(Math.PI*Math.min(1,Math.max(0,bt))),.6)+.35, k=Math.max(0,1-best/wd); if(k<=0) continue; const f=k*k;
    if(C_) put(I,x,y,C_,amt*f); else mul(I,x,y,1+amt*f); } }
/* a fold: a soft shadowed trough with a lit ridge on one side */
function clFold(I,x0,y0,cx,cy,x1,y1,w=2,amt=.3,lit=.6){ const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L*w*1.5,ny=dx/L*w*1.5;
  curvePaint(I,x0,y0,cx,cy,x1,y1,w*1.8,-amt*.7); curvePaint(I,x0+nx,y0+ny,cx+nx,cy+ny,x1+nx,y1+ny,w*1.5,amt*lit*.8); }
/* the same on near-black cloth, where a multiply can't lift anything: blend toward a sheen colour */
function clFoldK(I,x0,y0,cx,cy,x1,y1,w,sheen,a=.35){ const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L*w*1.5,ny=dx/L*w*1.5;
  curvePaint(I,x0,y0,cx,cy,x1,y1,w*1.8,.32,'#000000'); curvePaint(I,x0+nx,y0+ny,cx+nx,cy+ny,x1+nx,y1+ny,w*1.5,a*.85,sheen); }
/* soft painted fill of a polygon (4x4 coverage per texel), blended toward col */
function polyI(I,pts,col,a=1){ const c=F3(col),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  const inside=(x,y)=>{ let o=false; for(let i=0,j=pts.length-1;i<pts.length;j=i++){ const [xi,yi]=pts[i],[xj,yj]=pts[j]; if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi) o=!o; } return o; };
  for(let y=Math.floor(Math.min(...ys));y<=Math.max(...ys);y++) for(let x=Math.floor(Math.min(...xs));x<=Math.max(...xs);x++){ let n=0; for(let sy=0;sy<4;sy++) for(let sx=0;sx<4;sx++) if(inside(x+(sx+.5)/4,y+(sy+.5)/4)) n++; if(n) put(I,x,y,c,a*n/16); } }
function polyMul(I,pts,m){ const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  const inside=(x,y)=>{ let o=false; for(let i=0,j=pts.length-1;i<pts.length;j=i++){ const [xi,yi]=pts[i],[xj,yj]=pts[j]; if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi) o=!o; } return o; };
  for(let y=Math.floor(Math.min(...ys));y<=Math.max(...ys);y++) for(let x=Math.floor(Math.min(...xs));x<=Math.max(...xs);x++){ let n=0; for(let sy=0;sy<2;sy++) for(let sx=0;sx<2;sx++) if(inside(x+(sx+.5)/2,y+(sy+.5)/2)) n++; if(n) mul(I,x,y,1+(m-1)*n/4); } }
/* edge of a garment piece: a cast shadow on the cloth beneath, a lit lip on the edge itself */
function edgeI(I,x0,y0,x1,y1,side=1,sh=.35,hi=.2,hiCol='#ffffff'){ const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=-dy/L*side,ny=dx/L*side;
  softLine(I,x0+nx*1.3,y0+ny*1.3,x1+nx*1.3,y1+ny*1.3,'#000000',sh,1.8); softLine(I,x0-nx*.6,y0-ny*.6,x1-nx*.6,y1-ny*.6,hiCol,hi,1); }
function stitchI(I,x0,y0,x1,y1,col,a=.6,gap=3){ const n=Math.hypot(x1-x0,y1-y0)/gap|0; for(let i=0;i<=n;i++){ const t=i/Math.max(1,n),x=x0+(x1-x0)*t,y=y0+(y1-y0)*t; softLine(I,x,y,x+(x1-x0)/Math.max(1,n)*.5,y+(y1-y0)/Math.max(1,n)*.5,col,a,.8); } }
/* a sewn button: dark rim, lit dome, two holes */
function buttonP(I,x,y,r,col){ softEll(I,x+.4,y+.6,r+.5,r+.5,'#000000',.35,.5); softEll(I,x,y,r,r,col,1,.35); softEll(I,x-r*.3,y-r*.35,r*.45,r*.4,'#ffffff',.35,.6); if(r>1.5){ softEll(I,x-.6,y+.2,.45,.45,'#000000',.5,.5); softEll(I,x+.6,y+.2,.45,.45,'#000000',.5,.5); } }
/* body light painted into a torso: lit chest and shoulders, armpits and waist in shade, the seat and back blades */
function torsoForm(I,k=1,pants=true){ const n=T3.neck,s=T3.sh,c=T3.chest,b=T3.belt;
  for(const sx of [-1,1]){ blob(I,64+sx*20,c-24,15,20,.13*k); blob(I,64+sx*24,n+10,14,6,.1*k); blob(I,64+sx*21,c+8,16,4,-.1*k);
    blob(I,64+sx*32,s+22,5,22,-.32*k); blob(I,64+sx*32,b-24,7,26,-.14*k); blob(I,64+sx*50,s+18,9,22,.08*k); }
  blob(I,64,n+16,6,10,-.06*k); blob(I,64,b-8,26,6,-.06*k); for(let y=n+4;y<b-4;y++){ mul(I,0,y,.94); mul(I,127,y,.94); }
  if(pants){ blob(I,64,b+44,9,22,-.22*k); for(const sx of [-1,1]){ blob(I,sx<0?6:122,b+34,14,16,.1*k); blob(I,64+sx*18,b+28,10,12,.08*k); } blob(I,0,b+56,5,20,-.2*k); } }
/* waist creases where a shirt or jacket bunches above the belt, and drag folds from the armpits */
function torsoFolds(I,k=1,sheen){ const s=T3.sh,c=T3.chest,b=T3.belt,F_=sheen?(a,b_,c_,d,e,f,w)=>clFoldK(I,a,b_,c_,d,e,f,w,sheen,.3*k):(a,b_,c_,d,e,f,w)=>clFold(I,a,b_,c_,d,e,f,w,.3*k);
  for(const sx of [-1,1]){ F_(64+sx*30,s+14,64+sx*24,s+30,64+sx*14,s+44,2); F_(64+sx*31,s+26,64+sx*26,c,64+sx*18,c+12,1.6);
    F_(64+sx*28,b-26,64+sx*20,b-20,64+sx*8,b-16,1.6); F_(64+sx*24,b-12,64+sx*14,b-9,64+sx*4,b-10,1.3); F_(64+sx*44,b-20,64+sx*52,b-14,64+sx*58,b-16,1.4); } }
/* folds and light painted into an arm: shoulder cap lit, the elbow crease inside, bunching at the cuff */
function armForm(I,k=1,sheen,cuffY=118){ const F_=sheen?(a,b,c,d,e,f,w)=>clFoldK(I,a,b,c,d,e,f,w,sheen,.32*k):(a,b,c,d,e,f,w)=>clFold(I,a,b,c,d,e,f,w,.34*k);
  blob(I,32,6,22,9,.14*k); blob(I,48,40,8,30,.06*k); blob(I,12,40,7,30,-.1*k);
  F_(18,70,32,76,46,70,2.2); F_(22,80,32,84,42,79,1.6); F_(14,60,26,66,38,62,1.4);   F_(20,cuffY-12,32,cuffY-9,44,cuffY-13,1.3); }
/* legs: knee light and its folds, folds behind the knee, the break where the trouser sits on the shoe */
function legForm(I,k=1,sheen,hemY=124){ const F_=sheen?(a,b,c,d,e,f,w)=>clFoldK(I,a,b,c,d,e,f,w,sheen,.3*k):(a,b,c,d,e,f,w)=>clFold(I,a,b,c,d,e,f,w,.3*k);
  blob(I,32,62,10,7,.14*k); blob(I,32,30,14,22,.06*k); blob(I,32,100,10,20,.04*k); blob(I,0,8,12,10,-.12*k); blob(I,64,8,12,10,-.12*k);
  F_(22,56,32,52,42,56,1.6); F_(24,74,32,71,40,74,1.4); F_(-8,64,0,70,8,64,1.8); F_(56,64,64,70,72,64,1.8); F_(-6,74,0,78,6,74,1.3); F_(58,74,64,78,70,74,1.3);
  if(hemY<128){ F_(22,hemY-12,32,hemY-16,42,hemY-12,1.6); F_(14,hemY-6,24,hemY-2,34,hemY-6,1.4); F_(34,hemY-5,44,hemY-9,54,hemY-4,1.3); }
  F_(10,6,18,14,22,24,1.3); F_(54,6,46,14,42,24,1.3); }
/* jacket lapels: a lighter face with a lit roll edge, the notch, and the shadow they cast on the chest */
function lapelsI(I,top,bot,wTop,wMid,col,hi,o={}){ const nY=top+(o.notch??14);
  for(const sx of [-1,1]){ const X=d=>64+sx*d;
    const pts=[[X(wTop-1),top],[X(wTop+8),top+4],[X(wTop+12),nY],[X(wTop+5),nY+3],[X(wMid),nY+12],[X(.5),bot]];
    softLine(I,X(wMid+1)+sx*2,nY+12,X(5)+sx*2,bot,'#000000',.3,2.4);
    polyI(I,pts,col,1); softLine(I,X(wTop-1),top,X(.5),bot,col,.6,.8);
    softLine(I,X(wTop+5),nY+3,X(wMid),nY+12,'#000000',.35,1); softLine(I,X(wTop+12),nY,X(wTop+5),nY+3,'#000000',.3,1);
    softLine(I,X(wMid),nY+12,X(.5),bot,hi,.55,1.1); softLine(I,X(wTop+8),top+4,X(wTop+12),nY,hi,.4,1);
    if(o.stitch) stitchI(I,X(wMid-2),nY+13,X(6),bot-3,o.stitch,.35); } }
/* shirt collar points over a jacket or on their own */
function shirtCollar(I,w,drop,col,open){ for(const sx of [-1,1]){ const X=d=>64+sx*d, pts=open?[[X(2),T3.neck],[X(w),T3.neck-1],[X(w+4),T3.neck+drop],[X(4),T3.neck+drop*.6]]:[[X(1),T3.neck+2],[X(w),T3.neck-1],[X(w-2),T3.neck+drop],[X(1),T3.neck+drop*.45]];
  softLine(I,pts[2][0]+sx,pts[2][1]+1,pts[3][0],pts[3][1]+1,'#000000',.3,1.6); polyI(I,pts,col,1); softLine(I,pts[1][0],pts[1][1],pts[2][0],pts[2][1],'#ffffff',.25,.8); } }
/* a tie: knot, blade widening down, a sheen line, diagonal stripes optional; pulled loose hangs it lower and askew */
function tieI(I,y0,len,col,o={}){ const dx=o.skew||0,k=F3(col),dark='#000000';
  polyI(I,[[61+dx*.2,y0],[67+dx*.2,y0],[66+dx*.4,y0+6],[62+dx*.4,y0+6]],col,1); softLine(I,62+dx*.3,y0+5.5,66+dx*.3,y0+5.5,dark,.4,.8);
  const tip=[64+dx,y0+len]; polyI(I,[[62+dx*.4,y0+6],[66+dx*.4,y0+6],[tip[0]+4,tip[1]-4],tip,[tip[0]-4,tip[1]-4]],col,1);
  softLine(I,63+dx*.4,y0+7,tip[0]-1,tip[1]-6,'#ffffff',.18,.8); softLine(I,tip[0]+4.6,tip[1]-4,tip[0]+.4,tip[1]+.6,dark,.3,1);
  if(o.stripe) for(let y=y0+9;y<y0+len-5;y+=6) softLine(I,62+dx*(y-y0)/len,y,67+dx*(y-y0)/len,y-3,o.stripe,.7,.7);
  softLine(I,60+dx*.2,y0+1,61+dx*.4,y0+6,dark,.3,1); }
/* breast welt pocket, flap pocket, patch pocket */
function weltP(I,x,y,w,col){ softLine(I,x,y+1.5,x+w,y+.5,'#000000',.4,1.2); softLine(I,x,y,x+w,y-1,col||'#ffffff',.3,1); }
function flapP(I,x,y,w,h,col,hi){ softRect(I,x,y+h,w,1.4,'#000000',.38,1); if(col) softRect(I,x,y,w,h,col,1,.6); softLine(I,x,y,x+w,y,hi||'#ffffff',.28,.9); softLine(I,x,y+h-.5,x+w,y+h-.5,'#000000',.25,.8); }
function patchP(I,x,y,w,h,st,flap){ softLine(I,x,y,x,y+h,'#000000',.3,1); softLine(I,x+w,y,x+w,y+h,'#000000',.3,1); softLine(I,x,y+h,x+w,y+h,'#000000',.35,1.2); softLine(I,x+.8,y,x+.8,y+h,'#ffffff',.12,.8);
  if(st){ stitchI(I,x+1.6,y+1,x+1.6,y+h-1.6,st,.5); stitchI(I,x+w-1.6,y+1,x+w-1.6,y+h-1.6,st,.5); stitchI(I,x+1.6,y+h-1.6,x+w-1.6,y+h-1.6,st,.5); }
  if(flap) flapP(I,x-.5,y-1,w+1,flap); }
/* a belt with a lit top edge, loops, a buckle with a highlight and its shadow */
function beltP(I,col,buckle,o={}){ const y=T3.belt-3,h=o.h||7; softRect(I,0,y+h,128,1.5,'#000000',.35,1); softRect(I,0,y,128,h,col,1,.5); softLine(I,0,y+.4,128,y+.4,'#ffffff',.2,.8); softLine(I,0,y+h-.6,128,y+h-.6,'#000000',.3,.8);
  stitchI(I,0,y+1.6,128,y+1.6,mix(col,'#ffffff',.25),.25,2.5); stitchI(I,0,y+h-1.8,128,y+h-1.8,mix(col,'#ffffff',.25),.25,2.5);
  for(const x of [40,88,14,114]){ softRect(I,x,y-1.5,3,h+3,col,1,.4); softLine(I,x,y-1.5,x,y+h+1.5,'#000000',.3,.8); softLine(I,x+3,y-1.5,x+3,y+h+1.5,'#ffffff',.15,.8); }
  if(buckle){ const bx=o.bx||59; softRect(I,bx+1,y-1+.8,10,h+2,'#000000',.4,.8); softRect(I,bx,y-1,10,h+2,buckle,1,.4); softRect(I,bx+2,y+1,6,h-2,col,1,.3); softLine(I,bx,y-1,bx+10,y-1,'#ffffff',.55,.8); softLine(I,bx,y-1,bx,y+h+1,'#ffffff',.3,.8); softLine(I,bx+2,y+h/2,bx+9,y+h/2,buckle,1,.6); softEll(I,bx+2.5,y,1.2,.8,'#ffffff',.5,.6); }
  for(const x of [72,76,80]) softEll(I,x,y+h/2,.7,.7,'#000000',.45,.5); }
/* a zip: tape, teeth, a pull */
function zipI(I,x,y0,y1,col='#a8acb0'){ softLine(I,x,y0,x,y1,'#000000',.35,2); for(let y=y0;y<y1;y+=1.6) softLine(I,x-1,y,x+1,y+.8,col,.7,.6); softRect(I,x-1.5,y0+2,3,7,col,1,.4); softLine(I,x-1.5,y0+2,x+1.5,y0+2,'#ffffff',.5,.6); softRect(I,x-1,y0+9,2,4,mix(col,'#000000',.3),1,.3); }
/* ribbed knit band (cuffs, hems, collars) */
function ribI(I,x0,y0,w,h,col,a=1){ softRect(I,x0,y0,w,h,col,a,.5); for(let x=x0;x<x0+w;x+=2) softLine(I,x,y0,x,y0+h,'#000000',.22,.6); softLine(I,x0,y0,x0+w,y0,'#ffffff',.18,.8); softLine(I,x0,y0+h,x0+w,y0+h,'#000000',.25,1); }
/* a gold chain with each link lit */
function chainP(I,col='#d4ad5a',drop=16,wd=16){ for(let x=64-wd;x<=64+wd;x+=2.2){ const t=(x-64)/wd,y=T3.neck+4+drop*(1-t*t); softEll(I,x+.4,y+.7,1.3,1,'#000000',.35,.5); softEll(I,x,y,1.3,1,col,1,.4); softEll(I,x-.3,y-.3,.5,.4,'#fff4c8',.8,.5); } }
/* a glossy shoe: polished vamp and toe cap highlight, welt and stitched sole edge, laces optional */
function shoeP(seed,col,o={}){ return garment(64,32,seed,(x,y)=>o.zone?o.zone(x,y)||[col,'leather',.15]:[col,'leather',.15],{folds:2,grime:o.grime??.03,decor:I=>{
  const sole=o.sole||mix(col,'#000000',.55); softRect(I,0,23,64,9,sole,1,.6); softLine(I,0,23,64,23,mix(sole,'#ffffff',.25),.8,.7); softLine(I,0,24.6,64,24.6,'#000000',.35,.8);
  if(o.stitch!==false) stitchI(I,0,21.5,64,21.5,mix(col,'#ffffff',.35),.3,2);
  blob(I,32,14,7,3.6,.55*(o.shine??1)); blob(I,30,12,3,1.6,.6*(o.shine??1)); blob(I,0,12,6,4,.35*(o.shine??1)); blob(I,64,12,6,4,.35*(o.shine??1)); blob(I,16,15,5,7,-.2); blob(I,48,15,5,7,-.2);
  if(o.cap) softLine(I,22,13,42,13,'#000000',.3,1); if(o.vamp!==false){ softLine(I,24,4,24,18,'#000000',.22,.9); softLine(I,40,4,40,18,'#000000',.22,.9); }
  if(o.lace) { softRect(I,26,1,12,10,mix(col,'#000000',.4),1,.6); for(let y=2;y<10;y+=2.6) softLine(I,26,y,38,y+1,o.lace,.85,.8); for(const x of [25,39]) for(let y=2;y<10;y+=2.6) softEll(I,x,y,.7,.7,'#c8c0a8',.7,.5); }
  if(o.decor) o.decor(I); }}); }
/* hair painted thicker on the crown for heads whose style leaves it thin (sheen and strands read as hair from across a car) */
/* the cast's clothes are painted the first time a texture is uploaded (when that crew first boards), not at load */
function lazyTex(paint){ let cv=null; return {glt:null,f:-1,get c(){ return cv||(cv=paint().c); }}; }
function torsoL(...a){ return lazyTex(()=>torsoP(...a)); }
function armL(...a){ return lazyTex(()=>armP(...a)); }
function legL(...a){ return lazyTex(()=>legP(...a)); }
function shoeL(...a){ return lazyTex(()=>shoeP(...a)); }
function flatL(...a){ return lazyTex(()=>flat(...a)); }
/* smooth the stair-stepped edge of a V-neck painted by a zone function, in the garment's own colour */
function vEdge(I,w0,drop,col,a=.85){ for(const sx of [-1,1]) softLine(I,64+sx*w0,T3.neck,64,T3.neck+drop,col,a,1); }
