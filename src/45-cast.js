
/* =====================================================================================================
   THE CAST on the Stairwell rig: a hitman on vacation, and the seven crews who board to collect the bounty
   on him. New heads go through paintHead(), new clothes through torsoL()/armL()/legL()/garment().
   ===================================================================================================== */
Object.assign(HEADS,{
  nico:{seed:501,skin:'#c08a64',skinD:'#8e5a40',hair:'slick',hairC:'#1a1410',hairFront:14,sideburn:38,shadow:true,brow:'#1a1410',browT:2,iris:'#3a2a1c',lip:'#8a4c3c',beard:'stubble',beardC:'#2a1c14'},
  ren:{seed:511,skin:'#e2c0a0',skinD:'#b48e70',hair:'slick',hairC:'#0e0c0c',hairFront:12,sideburn:42,behind:50,brow:'#0e0c0c',iris:'#2a1a12',lip:'#a0604e'},
  renc:{seed:512,skin:'#d4b08e',skinD:'#a8846a',hair:'buzz',hairC:'#141210',hairFront:15,brow:'#141210',browT:2,iris:'#2a1a12',lip:'#94564a',scar:true},
  lau:{seed:521,skin:'#e8c8aa',skinD:'#bc9a7e',hair:'long',hairC:'#0e0c10',hairFront:13,sideburn:44,behind:54,nape:56,brow:'#1a1214',iris:'#2a1a12',lip:'#b0202e',age:true},
  lauc:{seed:522,skin:'#d8b490',skinD:'#a88466',hair:'bleach',hairC:'#c8b078',hairFront:15,brow:'#2a1e14',iris:'#2a1a12',lip:'#9a5a4a'},
  volkov:{seed:531,skin:'#e0b8a0',skinD:'#b08872',hair:'buzz',hairC:'#4a4644',hairFront:15,brow:'#3a3634',browT:2,iris:'#5a7a9a',lip:'#a0605a',beard:'full',beardC:'#5a5654',scar:true},
  volkovc:{seed:532,skin:'#e8c0a8',skinD:'#b89078',hair:'buzz',hairC:'#c8a878',hairFront:15,brow:'#a8885a',iris:'#5a7a8a',lip:'#a86a5a',gold:true,acne:true},
  nonna:{seed:541,skin:'#e2c0a4',skinD:'#b49278',hair:'long',hairC:'#ece8e2',hairFront:14,sideburn:42,behind:52,nape:54,brow:'#d8d4cc',iris:'#3a2a1a',lip:'#a87068',age:true,spots:true,glasses:'#2a2a2a'},
  nonnac:{seed:542,skin:'#cc9e7a',skinD:'#9e7254',hair:'slick',hairC:'#141010',hairFront:13,sideburn:40,brow:'#141010',browT:2,iris:'#2a1a10',lip:'#8a4a3c',beard:'stubble',beardC:'#1a1210'},
  gaffer:{seed:551,skin:'#e8b8a0',skinD:'#bc8a72',hair:'buzz',hairC:'#6a4a32',hairFront:15,brow:'#6a4a32',browT:2,iris:'#4a6a8a',lip:'#b06a5a',beard:'stubble',beardC:'#6a4a32',cut:true},
  gafferc:{seed:552,skin:'#f0c8b0',skinD:'#c49a82',hair:'bleach',hairC:'#e0c890',hairFront:15,brow:'#a8885a',iris:'#4a6a8a',lip:'#b8706a',acne:true},
  king:{seed:561,skin:'#d8a882',skinD:'#a87a5a',hair:'slick',hairC:'#08080a',hairFront:11,sideburn:46,brow:'#08080a',browT:2,iris:'#2a1a10',lip:'#9a5a4a'},
  kingc:{seed:562,skin:'#b88460',skinD:'#8a5a40',hair:'slick',hairC:'#0a0a0c',hairFront:12,sideburn:44,brow:'#0a0a0c',iris:'#2a1a10',lip:'#8a4a3a'},
  tremor:{seed:571,skin:'#7a4e34',skinD:'#4e301e',hair:'buzz',hairC:'#0e0a08',hairFront:15,brow:'#0e0a08',browT:2,iris:'#1a0e08',lip:'#5e3424',beard:'goatee',beardC:'#0e0a08',gold:true},
  tremorc:{seed:572,skin:'#a87050',skinD:'#784a34',hair:'buzz',hairC:'#141010',hairFront:15,brow:'#141010',iris:'#2a1a10',lip:'#7a4232'}
});
for(const k of ['nico','ren','renc','lau','lauc','volkov','volkovc','nonna','nonnac','gaffer','gafferc','king','kingc','tremor','tremorc']) FACE[k]=lazyFace(k);

/* ---------- props ---------- */
const mGold=M(null,{color:0xd4ad5a});
function pWaki(g){ return pWakiP(g); }
function pCleaver(g){ return pCleaverP(g); }
function pRevGold(g){ return pRevolverP(g,true); } /* engraved gold, pearl grips (63-arsenal.js) */

/* ---------- painted outfits ---------- */
const vNeck=(x,y,w0,drop)=>y<T3.neck+drop&&Math.abs(x-64)<w0*(1-(y-T3.neck)/drop);
const buttons=(I,xs,y0,y1,step,col)=>{ for(const x of xs) for(let y=y0;y<y1;y+=step){ softEll(I,x,y,1.8,1.8,col,1,.4); softEll(I,x-.5,y-.5,.7,.7,'#ffffff',.4,.4); } };
const chain=(I,col='#d4ad5a')=>{ for(let x=48;x<=80;x+=2){ const y=T3.neck+6+Math.pow((x-64)/16,2)*-8+8; softEll(I,x,y,1.2,1,col,1,.4); } };
/* shared tailoring (paint kit in 45p-cast-paint.js): a suit jacket's form light, folds, lapels, collar, tie, pockets, buttons and hem */
const suitI=(I,o)=>{ const n=T3.neck,b=T3.belt,bot=n+o.drop,s=o.sheen,hi=o.hi;
  torsoForm(I,o.form??1); torsoFolds(I,o.fold??1,s);
  sideSeams(I,n+8,232); softLine(I,.6,n+4,.6,232,'#000000',.22,1.2); softLine(I,127.4,n+4,127.4,232,'#000000',.22,1.2);
  softLine(I,0,232,128,232,'#000000',.42,1.8); softLine(I,0,230.6,128,230.6,hi,.18,.8); /* the jacket's hem over the seat */
  const lb=o.btnY[o.btnY.length-1]; for(const sx of [-1,1]){ curvePaint(I,64+sx*1.5,lb+3,64+sx*3,222,64+sx*15,231,1.3,.5,'#000000'); curvePaint(I,64+sx*.3,lb+3,64+sx*1.6,221,64+sx*13.6,230,.9,.2,hi); }
  flapP(I,25,b+6,20,6,null,hi); flapP(I,83,b+6,20,6,null,hi); weltP(I,73,T3.chest-12,15,hi);
  if(o.square) polyI(I,[[75,T3.chest-12],[77,T3.chest-17],[80,T3.chest-13.5],[83,T3.chest-18],[86,T3.chest-12.5]],o.square,1);
  if(o.vest) o.vest(I);
  if(o.tie) tieI(I,n+(o.knot??3),o.drop-(o.knot??3)-3,o.tie,{skew:o.skew||0,stripe:o.stripe});
  if(o.shirt) shirtCollar(I,o.cw??8,o.cd??9,o.shirt,o.open);
  lapelsI(I,n,bot,o.w0,o.w0+7,o.lapel,hi,{stitch:o.stitch,notch:o.notch});
  for(const y of o.btnY) buttonP(I,66,y,1.8,o.btn);
  if(o.chain) chainP(I,o.chain,o.chainDrop??14,o.chainW??13); };
const suitArm=(seed,cloth,cuff,o={})=>{ const cy=o.cuffY??118; return armL(seed,(x,y)=>y>cy?[cuff,'cotton',.2]:[cloth,o.fab||'wool'],{decor:I=>{ armForm(I,1,o.sheen,cy);
  softLine(I,0,3,64,3,'#000000',.25,1.4); softLine(I,0,4.6,64,4.6,o.hi||'#ffffff',.15,.8); softLine(I,50,8,49,cy-2,'#000000',.16,1);
  softRect(I,0,cy+.5,64,1.6,'#000000',.4,1); softLine(I,0,cy+2.4,64,cy+2.4,'#ffffff',.25,.7);
  if(o.btns!==false) for(let i=0;i<3;i++) buttonP(I,46+i*3.4,cy-6,1.1,o.btn||'#141416');
  if(o.link) softEll(I,46,cy+5,1.6,1.2,o.link,1,.4); if(o.decor) o.decor(I); }}); };
const suitLeg=(seed,cloth,o={})=>legL(seed,()=>[cloth,o.fab||'wool'],{decor:I=>{ legForm(I,1,o.sheen); seam(I,16,0,16,124); seam(I,48,0,48,124);
  softLine(I,32,2,32,122,o.hi||'#ffffff',.3,1); softLine(I,33.3,2,33.3,122,'#000000',.14,1); softRect(I,0,125,64,3,'#000000',.3,1); if(o.decor) o.decor(I); }});
const tOxford=shoeL(349,'#17171a',{lace:'#2e2e34',cap:true});
/* Nico: cream camp shirt with a palm-leaf print, shoulder holster, tan shorts */
const palmLeaf=(I,x,y,a,len,c1,c2)=>{ const dx=Math.cos(a),dy=Math.sin(a); curvePaint(I,x,y,x+dx*len*.5-dy*2,y+dy*len*.5+dx*2,x+dx*len,y+dy*len,.7,.9,c2);
  for(let k=1;k<=6;k++){ const t=k/7,px=x+dx*len*t,py=y+dy*len*t,L=len*.42*(1-t*.55); for(const s of [-1,1]){ const b=a+s*1.05; curvePaint(I,px,py,px+Math.cos(b)*L*.5+dx*2,py+Math.sin(b)*L*.5+dy*2,px+Math.cos(b)*L+dx*3,py+Math.sin(b)*L+dy*3,1.5,.92,k%2?c1:c2); } } };
const leafPrint=(I,x0,y0,w,h,seed)=>{ const r=rng(seed); for(let i=0;i<w*h/260;i++){ const x=x0+r()*w,y=y0+r()*h; palmLeaf(I,x,y,r()*6.28,10+r()*7,'#4a8a46','#2f6a34'); }
  for(let i=0;i<w*h/700;i++) softEll(I,x0+r()*w,y0+r()*h,1.6,1.6,'#e8a040',.7,.5); };
const sk=k=>[HEADS[k].skin,'skin',0];
const tNicoTorso=torsoL('nico',601,(x,y)=>{ if(vNeck(x,y,13,30)) return sk('nico'); return y>T3.belt+2?['#c8b07a','twill',.6]:['#efe6d2','cotton']; },{decor:I=>{ neckShadow(I); vEdge(I,13,30,'#efe6d2'); torsoForm(I); leafPrint(I,0,T3.neck+4,128,T3.belt-T3.neck-6,602); torsoFolds(I,.8);
  shirtCollar(I,14,12,'#efe6d2',true); softLine(I,64,T3.neck+30,64,T3.belt-2,'#000000',.18,1); for(let y=T3.neck+38;y<T3.belt;y+=20) buttonP(I,65.5,y,1.5,'#e8dcc4');
  patchP(I,72,T3.chest-18,13,15,'#c8bca4'); softRect(I,0,T3.belt-1,128,3,'#000000',.3,1.6); beltP(I,'#5a3a22','#d4ad5a',{h:6}); seam(I,64,T3.belt+6,64,T3.belt+36,'#a8905a');
  chainP(I);
  const SR='#3a2416',SH='#7a5232'; for(const s of [-1,1]){ softLine(I,64+s*22,T3.sh-8,64+s*30,T3.chest+30,'#000000',.3,3.2); softLine(I,64+s*22,T3.sh-8,64+s*30,T3.chest+30,SR,.97,2.4); softLine(I,64+s*21.4,T3.sh-8,64+s*29.4,T3.chest+30,SH,.6,.7); stitchI(I,64+s*22.6,T3.sh-6,64+s*30.6,T3.chest+28,'#c8a070',.4); }
  softRect(I,29,T3.chest+9,14,32,'#000000',.3,2); softRect(I,30,T3.chest+10,12,30,'#4a2a18',.97,1); softLine(I,30,T3.chest+10.5,42,T3.chest+10.5,SH,.6,.8); stitchI(I,31.5,T3.chest+12,31.5,T3.chest+38,'#c8a070',.45);
  softRect(I,32,T3.chest+12,8,9,'#26262a',.95,.6); softLine(I,32,T3.chest+12.5,40,T3.chest+12.5,'#6a6a74',.6,.6); buttonP(I,36,T3.chest+26,1.3,'#b89a5a'); }});
const tNicoArm=armL(603,(x,y)=>y<46?['#efe6d2','cotton']:[HEADS.nico.skin,'skin',0],{decor:I=>{ leafPrint(I,0,0,64,40,604); blob(I,32,8,22,9,.12); clFold(I,18,24,30,30,44,26,2,.3); clFold(I,6,34,18,38,28,35,1.6,.25);
  softRect(I,0,40,64,6,'#e4d8c0',.9,.6); softLine(I,0,40,64,40,'#000000',.25,1); softLine(I,0,45.5,64,45.5,'#000000',.3,1); blob(I,32,50,30,3,-.22); blob(I,32,80,10,5,.06); blob(I,8,90,6,30,-.08); softRect(I,24,108,14,5,'#d4ad5a',.95,.5); }});
const tNicoLeg=legL(605,(x,y)=>y<60?['#c8b07a','twill']:[HEADS.nico.skin,'skin',0],{decor:I=>{ blob(I,32,22,12,16,.08); clFold(I,14,8,22,14,26,26,1.4,.3); clFold(I,50,8,42,14,38,26,1.4,.3); clFold(I,22,46,32,43,42,47,1.4,.25);
  seam(I,48,0,48,58,'#a8905a'); seam(I,16,0,16,58,'#a8905a'); curvePaint(I,40,2,46,10,50,18,1,.35,'#000000'); softRect(I,0,54,64,6,'#b8a06a',.9,.6); softLine(I,0,54,64,54,'#000000',.25,1); softLine(I,0,60,64,60,'#000000',.3,1); blob(I,32,64,30,3,-.2); blob(I,32,72,7,5,.1); }});
const tLoafer=shoeL(607,'#6a3a22',{zone:(x,y)=>y<9?[HEADS.nico.skin,'skin',0]:null,vamp:true,decor:I=>{ softRect(I,24,10,16,3,'#4a2614',1,.5); softRect(I,29,10.6,6,1.6,'#2a1408',1,.4); softEll(I,32,11.4,1.2,.6,'#d4ad5a',.8,.4); }});
/* Ren: ivory suit, red shirt open at the neck, gold buttons, a red pocket square */
const tRenTorso=torsoL('ren',611,(x,y)=>{ if(vNeck(x,y,14,40)) return Math.abs(x-64)<6.5-(y-T3.neck)*.18?sk('ren'):['#c8202a','cotton',.5]; return ['#efe8da','wool']; },{decor:I=>{ neckShadow(I);
  suitI(I,{drop:40,w0:14,lapel:'#f4eee2',hi:'#ffffff',shirt:'#b81c26',open:true,cw:13,cd:12,btn:'#d4ad5a',btnY:[T3.neck+54,T3.neck+76],chain:'#d4ad5a',chainDrop:18,form:1.3,fold:1.3,stitch:'#d8d0c0'}); }});
const tRenArm=suitArm(613,'#efe8da','#c8202a',{btn:'#d4ad5a',link:'#d4ad5a'});
const tRenLeg=suitLeg(615,'#efe8da');
const tWhiteShoe=shoeL(617,'#f2ece0',{sole:'#c8c0b0',lace:'#e0d8c8',shine:.6});
/* Kagami-gumi soldiers: black suits, white shirts, black ties */
const tRencTorso=torsoL('renc',621,(x,y)=>{ if(vNeck(x,y,10,32)) return ['#f2f0ea','cotton',.4]; return ['#1a1a1e','wool']; },{decor:I=>{ neckShadow(I);
  suitI(I,{drop:32,w0:10,lapel:'#222228',hi:'#6a6a78',sheen:'#4e4e5a',shirt:'#f2f0ea',tie:'#141416',stripe:'#2a2a32',cw:7,cd:8,btn:'#0a0a0c',btnY:[T3.neck+44],square:'#f2f0ea'}); }});
const tRencArm=suitArm(623,'#1a1a1e','#f2f0ea',{sheen:'#4a4a56',hi:'#6a6a78',btn:'#0a0a0c',link:'#c8c8d0'});
const tRencLeg=suitLeg(625,'#1a1a1e',{sheen:'#48485a',hi:'#5a5a6a'});
/* Madam Lau: jade silk high-collar long jacket, tonal brocade, gold frogging and piping, embroidered cranes */
const JADE='#1f6a5a';
const craneI=(I,cx,cy,s,f)=>{ const W='#f2eedc',G='#e8c060'; softEll(I,cx,cy,7*s,3.2*s,W,.95,.5); curvePaint(I,cx+5*s*f,cy-1,cx+8*s*f,cy-8*s,cx+11*s*f,cy-11*s,1.1*s,.95,W); softEll(I,cx+12*s*f,cy-11.5*s,1.8*s,1.3*s,W,1,.4); softEll(I,cx+12.4*s*f,cy-12.6*s,1*s,.8*s,'#c8202a',1,.4); softLine(I,cx+13.5*s*f,cy-11.5*s,cx+17*s*f,cy-10.5*s,G,.9,.6);
  for(let k=0;k<5;k++){ const a=-2.2+k*.28; curvePaint(I,cx-2*s*f,cy-1,cx+(-6+k)*s*f,cy-9*s,cx+Math.cos(a)*16*s*f,cy+Math.sin(a)*13*s,1.3*s,.92,k>2?'#1a1a1a':W); }
  for(const d of [-1.5,1.5]) softLine(I,cx-6*s*f,cy+1,cx-12*s*f,cy+3+d,'#1a1a1a',.8,.7); softLine(I,cx+1*s*f,cy+3*s,cx+2*s*f,cy+9*s,G,.8,.5); };
const brocade=(I,y0,y1,dk,lt,seed)=>{ for(let y=y0+6,j=0;y<y1;y+=16,j++) for(let x=(j%2)*16;x<128+16;x+=32){ softEll(I,x,y,6,6,dk,.35,.6); softEll(I,x,y,3.5,3.5,lt,.18,.6); for(let k=0;k<4;k++){ const a=k*Math.PI/2; softLine(I,x+Math.cos(a)*3,y+Math.sin(a)*3,x+Math.cos(a)*8,y+Math.sin(a)*8,dk,.3,.8); } } };
const lauFrog=(I,x,y,G)=>{ for(const s of [-1,1]){ softEll(I,x+s*4,y,3.2,1.6,G,.95,.4); softEll(I,x+s*4,y,1.6,.6,'#14524a',.9,.4); softEll(I,x+s*4-.8,y-.7,1,.4,'#fff4c8',.6,.5); } softEll(I,x,y,1.6,1.6,G,1,.4); softEll(I,x-.5,y-.5,.6,.6,'#fff4c8',.8,.5); };
const tLauTorso=torsoL('lau',631,(x,y)=>[JADE,'cotton',.5],{decor:I=>{ neckShadow(I); brocade(I,T3.neck+12,256,'#14524a','#3a8a76',632); torsoForm(I,1.2); torsoFolds(I,1.1,'#5ab09a');
  softRect(I,0,T3.neck,128,9,'#14524a',1,.6); softLine(I,0,T3.neck+9,128,T3.neck+9,'#d4ad5a',.95,1); softLine(I,0,T3.neck+10.4,128,T3.neck+10.4,'#000000',.3,1);
  softLine(I,64.8,T3.neck+10,85,T3.chest-9,'#000000',.35,1.8); softLine(I,64,T3.neck+9,84,T3.chest-10,'#d4ad5a',.95,1.3); softLine(I,64,T3.neck+8.4,84,T3.chest-10.6,'#fff0b0',.5,.5); softLine(I,84,T3.chest-10,84,256,'#000000',.25,1.4); softLine(I,83.3,T3.chest-10,83.3,256,'#d4ad5a',.9,.9);
  for(let y=T3.neck+18,i=0;y<T3.belt+20;y+=i<3?10:22,i++) lauFrog(I,i<3?70+i*5:84,y,'#d4ad5a');
  craneI(I,34,T3.chest+22,1,1); craneI(I,100,T3.chest+46,.9,-1); craneI(I,6,T3.belt+18,.8,1);
  for(const x of [32,96]){ softLine(I,x,214,x,256,'#0a2a24',.8,1.2); softLine(I,x+1.2,214,x+1.2,256,'#d4ad5a',.85,.7); softEll(I,x,214,1.4,1.4,'#d4ad5a',1,.4); } }});
const tLauArm=armL(633,()=>[JADE,'cotton',.5],{decor:I=>{ brocade(I,0,110,'#14524a','#3a8a76',634); armForm(I,1.1,'#5ab09a',112); softRect(I,0,111,64,6,'#d4ad5a',.95,.6); softLine(I,0,111,64,111,'#fff0b0',.5,.6); softLine(I,0,117,64,117,'#6a4a14',.6,.8); softRect(I,0,117,64,11,'#14524a',.95,.6); }});
const tLauLeg=legL(635,(x,y)=>y<70?[JADE,'cotton',.5]:['#141214','cotton',.5],{decor:I=>{ brocade(I,0,68,'#14524a','#3a8a76',636); legForm(I,1,'#4a4a56');
  softLine(I,0,70,64,70,'#d4ad5a',.95,1.2); softLine(I,0,71.6,64,71.6,'#000000',.4,1.2); for(const x of [22,42]) clFold(I,x,74,x+2,98,x-1,122,1.4,.3,1.2); }});
/* Golden Crane triad: black shirts, sleeves rolled, gold chains, tattooed forearms */
const tLaucTorso=torsoL('lauc',641,(x,y)=>{ if(vNeck(x,y,11,24)) return sk('lauc'); return y>T3.belt+2?['#2a2a30','wool',.6]:['#16161a','cotton']; },{decor:I=>{ neckShadow(I); vEdge(I,11,24,'#16161a'); torsoForm(I,1.2); torsoFolds(I,1,'#4a4a56');
  shirtCollar(I,12,11,'#1c1c22',true); softLine(I,64,T3.neck+24,64,T3.belt-2,'#000000',.4,1); softLine(I,65.5,T3.neck+24,65.5,T3.belt-2,'#3a3a44',.5,.6); for(let y=T3.neck+30;y<T3.belt;y+=18) buttonP(I,66.5,y,1.4,'#3a3a42');
  for(const x of [40,76]) patchP(I,x,T3.chest-20,13,14,'#3a3a44',3);
  chainP(I,'#e0b850',16,14); chainP(I,'#d4ad5a',22,16); softEll(I,64,T3.neck+39,2.4,3,'#d4ad5a',1,.4); softEll(I,63.4,T3.neck+38,.8,1,'#fff4c8',.8,.4);
  beltP(I,'#0a0a0c','#d4ad5a'); seam(I,64,T3.belt+6,64,T3.belt+40); }});
const tatDragon=(I,x0,y0,len,ink,red)=>{ for(let i=0;i<len;i+=1.5){ const t=i/len,x=x0+Math.sin(t*9)*10,y=y0+i; softEll(I,x,y,5-t*2.6,1.8,ink,.72,.6); if(i%3<1.5){ softLine(I,x-3,y,x,y+1.4,'#14243a',.5,.6); softLine(I,x,y+1.4,x+3,y,'#14243a',.5,.6); } if(i%9<1.5) softLine(I,x+4-t*2,y,x+8,y-3,ink,.6,.7); }
  softEll(I,x0+2,y0-3,4,3,ink,.6,.5); softEll(I,x0+3,y0-3.6,1,1,red,.8,.4); for(const [dx,dy] of [[-4,8],[8,16],[-8,26]]) softEll(I,x0+dx,y0+dy,2.6,1.6,red,.45,.5); };
const tLaucArm=armL(643,(x,y)=>y<58?['#16161a','cotton']:sk('lauc'),{decor:I=>{ blob(I,32,8,22,8,.15); clFold(I,14,30,28,36,44,30,1.8,.3); clFold(I,30,44,40,48,52,44,1.6,.25);
  softRect(I,0,49,64,11,'#22222a',.97,1); for(const y of [51,54.5,58]){ softLine(I,0,y,64,y+((y*7)%3-1),'#000000',.45,.9); softLine(I,0,y-1.2,64,y-1.2,'#4a4a56',.4,.6); } blob(I,32,62,30,3,-.25);
  tatDragon(I,32,66,46,'#2a4a6a','#c8202a'); for(let k=0;k<5;k++) softLine(I,6+k*2,70+k*6,10+k*2,74+k*6,'#2a4a6a',.35,1); blob(I,32,92,8,6,.06); }});
const tLaucLeg=suitLeg(645,'#2a2a30',{sheen:'#50505e',hi:'#5a5a68'});
/* Volkov: fur coat, black roll-neck */
const furI=(I,x0,y0,w,h,seed,skip,k=1)=>{ const r=rng(seed); for(let i=0;i<w*h*.07*k;i++){ const x=x0+r()*w,y=y0+r()*h; if(skip&&skip(x,y)) continue; blob(I,x,y,3+r()*3,2.2+r()*2,r()>.5?.14:-.18); }
  for(let i=0;i<w*h*.4*k;i++){ const x=x0+r()*w,y=y0+r()*h; if(skip&&skip(x,y)) continue; const L=2.5+r()*3.5,dx=(r()-.5)*1.6; softLine(I,x,y,x+dx,y+L,r()>.45?'#9a7a56':'#2e2014',.32,.9); if(r()<.3) softLine(I,x+dx,y+L-1,x+dx*1.2,y+L,'#c8a882',.4,.6); } };
const tFurCoat=(seed,base)=>torsoL('volkov',seed,(x,y)=>{ const open=Math.abs(x-64)<12-Math.max(0,(y-T3.belt)*.02); if(y<T3.neck+14&&open) return ['#121214','knit',.2]; if(open&&y<T3.belt-10) return ['#121214','knit',.4]; return [base,'wool',.4]; },{folds:10,decor:I=>{ neckShadow(I);
  const opn=(x,y)=>Math.abs(x-64)<12&&y<T3.belt-10; for(let x=53;x<76;x+=2.2){ softLine(I,x,T3.neck,x,T3.belt-10,'#000000',.4,.7); softLine(I,x+1.1,T3.neck,x+1.1,T3.belt-10,'#4a4a56',.5,.6); } ribI(I,52,T3.neck,24,13,'#1a1a1e',.6);
  torsoForm(I,1.1); furI(I,0,T3.neck,128,256-T3.neck,seed+1,opn); for(const s of [-1,1]){ curvePaint(I,64+s*13,T3.neck+6,64+s*15,T3.chest,64+s*12,T3.belt-8,3,.5,'#000000'); curvePaint(I,64+s*16,T3.neck+4,64+s*19,T3.chest,64+s*16,T3.belt-8,4,.22,'#a8865e'); }
  softRect(I,0,T3.neck,128,16,'#6a4a32',.6,3); furI(I,0,T3.neck-2,128,20,seed+2,opn,1.6); for(const y of [T3.chest+10,T3.chest+46]) { softRect(I,72,y,12,3,'#2a1a10',.9,.6); softEll(I,86,y+1.5,2.4,2.4,'#c8b090',1,.4); } }});
const tVolkTorso=tFurCoat(651,'#5a3e28');
const tVolkArm=armL(653,()=>['#5a3e28','wool',.4],{decor:I=>{ armForm(I,.9,null,108); furI(I,0,0,64,108,654); softRect(I,0,106,64,22,'#7a5a3e',.8,2); furI(I,0,104,64,24,655,null,1.8); blob(I,32,106,30,2,-.3); }});
const tVolkLeg=legL(655,(x,y)=>y<64?['#5a3e28','wool',.4]:['#1a1a1e','wool'],{decor:I=>{ furI(I,0,0,64,62,656); legForm(I,1,'#4a4a56'); softRect(I,0,58,64,6,'#7a5a3e',.7,2); furI(I,0,56,64,9,657,null,2); softLine(I,0,64.5,64,64.5,'#000000',.5,2); }});
/* Volkov brotherhood: shiny navy tracksuits with white stripes */
const TRK='#1d2a5a';
const trkStripes=(I,xs,y0,y1)=>{ for(const x of xs){ softLine(I,x,y0,x,y1,'#f2ece0',.97,1.1); softLine(I,x-1.3,y0,x-1.3,y1,'#000000',.2,.6); } };
const tVolkcTorso=torsoL('volkovc',661,(x,y)=>[TRK,'poly',y>T3.belt+2?.6:1],{decor:I=>{ neckShadow(I); torsoForm(I,1.3); torsoFolds(I,1.2,'#5a6aa8');
  ribI(I,0,T3.neck,128,8,'#f2ece0',.95); for(let x=0;x<128;x+=2) softLine(I,x,T3.neck+1,x,T3.neck+7,'#c8c0b0',.3,.5); softLine(I,0,T3.neck+8.5,128,T3.neck+8.5,TRK,.6,.8);
  zipI(I,64,T3.neck+1,T3.belt-12,'#c8ccd2'); trkStripes(I,[25,29,99,103],T3.neck+2,256); ribI(I,0,T3.belt-12,128,8,'#1a2550',.95);
  for(const x of [40,88]){ softLine(I,x,T3.belt-34,x-4,T3.belt-16,'#000000',.45,1.2); softLine(I,x+.8,T3.belt-34,x-3.2,T3.belt-16,'#c8ccd2',.6,.5); }
  softRect(I,0,T3.belt+2,128,5,'#000000',.25,2); for(let x=0;x<128;x+=3) softLine(I,x,T3.belt+1,x+1,T3.belt+7,'#000000',.2,.6); softEll(I,60,T3.belt+10,1,3,'#f2ece0',.9,.4); softEll(I,68,T3.belt+10,1,3,'#f2ece0',.9,.4);
  chainP(I,'#d4ad5a',8,9); softRect(I,80,T3.chest-24,10,8,'#f2ece0',.8,.5); softLine(I,82,T3.chest-21,88,T3.chest-21,TRK,.8,.6); }});
const tVolkcArm=armL(663,(x,y)=>y>116?[TRK,'knit',.2,.85]:[TRK,'poly'],{decor:I=>{ armForm(I,1.3,'#5a6aa8',116); trkStripes(I,[44,48,52],0,116); ribI(I,0,116,64,12,'#18234c',.9); }});
const tVolkcLeg=legL(665,(x,y)=>y>118?[TRK,'knit',.2,.85]:[TRK,'poly'],{decor:I=>{ legForm(I,1.3,'#5a6aa8',118); trkStripes(I,[12,16,20,44,48,52],0,118); ribI(I,0,118,64,10,'#18234c',.9); zipI(I,32,106,118,'#c8ccd2'); }});
const tTrainer=shoeL(667,'#f2f0ea',{sole:'#d8d4cc',lace:'#e8e4dc',shine:.5,grime:.08,decor:I=>{ for(const x of [22,28,34,40]) softLine(I,x,7,x+5,19,TRK,.95,1.4); softRect(I,0,23,64,2,'#1d2a5a',.9,.4); for(let x=0;x<64;x+=3) softLine(I,x,28,x+1.5,31,'#000000',.15,.6); }});
/* Nonna: black dress, lace shawl, gold cameo brooch */
const laceI=(I,y0,y1,seed)=>{ const r=rng(seed); for(let y=y0;y<y1;y+=3.2) for(let x=((y/3.2|0)%2)*1.6;x<128;x+=3.2) softEll(I,x,y,.9,.9,'#4a4652',.55,.5);
  for(let i=0;i<34;i++){ const x=r()*128,y=y0+4+r()*(y1-y0-8); for(let k=0;k<6;k++){ const a=k/6*Math.PI*2; softEll(I,x+Math.cos(a)*2.6,y+Math.sin(a)*2.6,1.4,1.4,'#6a6672',.8,.5); } softEll(I,x,y,1.2,1.2,'#8a8692',.9,.4); }
  for(let x=0;x<128;x+=4){ softEll(I,x,y1+1.5,2,2.2,'#5a5662',.85,.5); softEll(I,x,y1+1,.8,.8,'#18161a',.9,.4); } softLine(I,0,y1+3.6,128,y1+3.6,'#000000',.35,1.2); };
const tNonnaTorso=torsoL('nonna',671,(x,y)=>['#18161a','knit',.6],{decor:I=>{ neckShadow(I); torsoForm(I,1.4); torsoFolds(I,1,'#4a4652'); laceI(I,T3.neck,T3.chest,672);
  for(let y=T3.chest+12;y<T3.belt-4;y+=14) buttonP(I,64,y,1.4,'#2a2830'); softRect(I,0,T3.belt-2,128,4,'#0e0c10',.8,1); for(let x=4;x<128;x+=9) clFold(I,x,T3.belt+6,x+1,T3.belt+30,x-1,256,1.6,.3,1.2);
  softEll(I,64,T3.neck+18,4.2,5.2,'#d4ad5a',1,.4); softEll(I,64,T3.neck+18,3,4,'#e8dcc8',1,.4); softEll(I,64.6,T3.neck+18.5,1.3,2.2,'#b8a890',.9,.5); softEll(I,62.6,T3.neck+15.6,1,.8,'#ffffff',.6,.5); }});
const tNonnaArm=armL(673,()=>['#18161a','knit',.6],{decor:I=>{ armForm(I,1.2,'#4a4652'); for(let y=4;y<40;y+=3.2) for(let x=((y/3.2|0)%2)*1.6;x<64;x+=3.2) softEll(I,x,y,.9,.9,'#4a4652',.5,.5); softLine(I,0,40,64,40,'#5a5662',.8,1.2); ribI(I,0,120,64,8,'#100e12',.8); }});
const tNonnaLeg=legL(675,(x,y)=>y<88?['#18161a','knit',.5]:['#3a3036','knit',.2],{decor:I=>{ for(const x of [4,14,24,34,44,54]) clFold(I,x,0,x+1,44,x-1,86,1.5,.32,1.1); softLine(I,0,87,64,87,'#0a080a',.9,1.6);
  blob(I,32,100,6,14,.18); blob(I,16,110,4,16,-.12); blob(I,48,110,4,16,-.12); softLine(I,32,90,32,128,'#000000',.15,1.2); }});
/* the Esposito grandsons: tight navy suits, open white shirts, gold chains */
const tNoncTorso=torsoL('nonnac',681,(x,y)=>{ if(vNeck(x,y,12,34)) return Math.abs(x-64)<7-(y-T3.neck)*.18?sk('nonnac'):['#f2f0ea','cotton',.4]; return ['#1d2a4a','wool']; },{decor:I=>{ neckShadow(I);
  suitI(I,{drop:34,w0:12,lapel:'#22304f',hi:'#6a7aa0',sheen:'#4a5a86',shirt:'#f2f0ea',open:true,cw:10,cd:10,btn:'#0a0e1a',btnY:[T3.neck+48],chain:'#d4ad5a',chainDrop:16,chainW:10,fold:1.2}); }});
const tNoncArm=suitArm(683,'#1d2a4a','#f2f0ea',{sheen:'#4a5a86',hi:'#6a7aa0',cuffY:120,btn:'#0a0e1a',link:'#d4ad5a'});
const tNoncLeg=suitLeg(685,'#1d2a4a',{sheen:'#4a5a86',hi:'#6a7aa0'});
/* the Gaffer: amber-and-black hooped club shirt, polo collar, crest, jeans */
const hoop=(y)=>(Math.floor((y-T3.neck)/14)%2)?'#121214':'#e8a020';
const jeansI=(I,o={})=>{ const b=T3.belt; seam(I,64,b+6,64,b+34,'#c89a4a'); curvePaint(I,60,b+6,59,b+28,64,b+34,1,.5,'#c89a4a');
  for(const s of [-1,1]){ curvePaint(I,64+s*24,b+4,64+s*26,b+14,64+s*36,b+18,1.2,.45,'#000000'); stitchI(I,64+s*25,b+5,64+s*35,b+17,'#c89a4a',.5); softEll(I,64+s*36,b+18,.9,.9,'#c87a3a',1,.4);
    patchP(I,s<0?6:110,b+12,13,16,'#c89a4a'); curvePaint(I,64+s*6,b+14,64+s*10,b+30,64+s*14,b+44,6,.12,'#a8b8d8'); for(let k=0;k<4;k++) curvePaint(I,64+s*3,b+20+k*4,64+s*8,b+21+k*4,64+s*14,b+18+k*5,1,.22,'#c8d4ec'); } };
const tGafTorso=torsoL('gaffer',691,(x,y)=>y>T3.belt+2?['#2a3a5a','denim',.7]:[hoop(y),'poly'],{decor:I=>{ neckShadow(I); torsoForm(I,1.3); torsoFolds(I,1.1,'#ffc860');
  shirtCollar(I,13,10,'#f2ece0',false); softRect(I,60,T3.neck+4,8,16,'#e8a020',.95,.5); softLine(I,60,T3.neck+4,60,T3.neck+20,'#000000',.3,.8); for(const y of [T3.neck+9,T3.neck+16]) buttonP(I,64,y,1.3,'#f2ece0');
  softEll(I,84,T3.sh+24,7,8.2,'#000000',.3,.6); polyI(I,[[77,T3.sh+16],[91,T3.sh+16],[91,T3.sh+26],[84,T3.sh+33],[77,T3.sh+26]],'#f2ece0',1); polyI(I,[[79,T3.sh+18],[89,T3.sh+18],[89,T3.sh+25.5],[84,T3.sh+31],[79,T3.sh+25.5]],'#121214',1);
  polyI(I,[[80,T3.sh+19],[84,T3.sh+19],[84,T3.sh+30],[80,T3.sh+25]],'#e8a020',1); textI(I,'S',83.5,T3.sh+20,'#f2ece0',1); softLine(I,77,T3.sh+16,91,T3.sh+16,'#ffffff',.5,.6);
  textI(I,'SSFC',49,T3.chest+4,'#f2ece0',2,.95); textI(I,'7',-6,T3.sh+10,'#f2ece0',4,.95); softRect(I,0,T3.belt-3,128,4,'#000000',.3,1.5);
  beltP(I,'#2a1a10','#a8a49c'); jeansI(I); }});
const tGafArm=armL(693,(x,y)=>y<44?[(Math.floor(y/14)%2)?'#121214':'#e8a020','poly']:sk('gaffer'),{decor:I=>{ blob(I,32,8,22,8,.16); clFold(I,16,24,30,30,46,25,1.8,.3); softRect(I,0,40,64,4,'#f2ece0',.95,.5); softLine(I,0,44,64,44,'#000000',.3,1); blob(I,32,48,30,3,-.22);
  curvePaint(I,22,70,34,78,40,90,1.6,.6,'#2a4a6a'); softEll(I,30,96,5,4,'#2a4a6a',.6,.4); softEll(I,30,96,3,2.4,'#c8202a',.45,.4); textI(I,'1998',22,80,'#2a4a6a',1,.55); blob(I,32,82,8,5,.06); }});
const tGafLeg=legL(695,()=>['#2a3a5a','denim'],{decor:I=>{ legForm(I,1); seam(I,48,0,48,124,'#c89a4a'); seam(I,16,0,16,124,'#c89a4a'); blob(I,32,40,9,20,.12,'#6a7a9a'); blob(I,32,64,8,6,.22,'#8a9ab8');
  for(let k=0;k<3;k++) curvePaint(I,22,58+k*3,32,56+k*3,42,58+k*3,1,.25,'#a8b8d8'); for(let k=0;k<4;k++) clFold(I,18+k*8,114,22+k*8,118,26+k*8,114,1.4,.35); softRect(I,0,124,64,4,'#c89a4a',.35,.6); }});
/* the firm: grey marl hoodies, club scarves, jeans */
const marlI=(I,seed)=>{ const r=rng(seed); for(let i=0;i<I.w*I.h*.25;i++){ const x=r()*I.w,y=r()*I.h; softLine(I,x,y,x+1.5,y,r()>.5?'#b0b2b6':'#5a5c60',.25,.5); } };
const tGafcTorso=torsoL('gafferc',701,(x,y)=>y>T3.belt+2?['#3a4a6a','denim',.7]:y>T3.belt-12?['#7e8084','knit',.2,.9]:['#8a8c90','knit',.7],{decor:I=>{ neckShadow(I); marlI(I,702); torsoForm(I,1.3); torsoFolds(I,1.2);
  for(const s of [-1,1]){ curvePaint(I,64+s*20,T3.neck-2,64+s*30,T3.neck+20,64+s*42,T3.neck+24,3.5,.25,'#000000'); }
  for(const x0 of [-2,128-2]) { polyMul(I,[[x0-26,T3.neck],[x0+30,T3.neck],[x0+24,T3.neck+44],[x0+2,T3.neck+56],[x0-20,T3.neck+44]],.88); curvePaint(I,x0-20,T3.neck+44,x0+2,T3.neck+60,x0+24,T3.neck+44,1.6,.45,'#000000'); }
  polyMul(I,[[46,T3.chest+28],[82,T3.chest+28],[88,T3.belt-14],[40,T3.belt-14]],.92); for(const [a,b,c,d] of [[46,T3.chest+28,82,T3.chest+28],[46,T3.chest+28,40,T3.belt-14],[82,T3.chest+28,88,T3.belt-14]]) { softLine(I,a,b+1,c,d+1,'#000000',.35,1.2); stitchI(I,a,b+2,c,d+2,'#c8c8cc',.3); }
  for(const s of [-1,1]){ curvePaint(I,46+(s>0?36:0),T3.chest+28,40+(s>0?44:4),T3.chest+40,44+(s>0?40:0),T3.chest+54,1.4,.4,'#000000'); }
  for(const x of [59,69]){ softLine(I,x,T3.neck+4,x+(x<64?-1:1),T3.chest+8,'#f2ece0',.95,1); softLine(I,x+.8,T3.neck+4,x+.8+(x<64?-1:1),T3.chest+8,'#000000',.25,.6); softRect(I,x+(x<64?-1:1)-1,T3.chest+8,2,5,'#c8c8cc',1,.3); }
  ribI(I,0,T3.belt-12,128,12,'#7a7c80',.9); jeansI(I); beltP(I,'#1a1a1e','#a8a49c',{h:5}); }});
const tGafcArm=armL(703,(x,y)=>y>114?['#7e8084','knit',.2,.9]:['#8a8c90','knit',.7],{decor:I=>{ marlI(I,704); armForm(I,1.3,null,114); ribI(I,0,114,64,14,'#7a7c80',.95); }});
const tGafcLeg=legL(705,()=>['#3a4a6a','denim'],{decor:I=>{ legForm(I,1); seam(I,48,0,48,124,'#c89a4a'); seam(I,16,0,16,124,'#c89a4a'); blob(I,32,70,8,6,.2,'#8a9ab8'); for(let k=0;k<3;k++) curvePaint(I,22,58+k*3,32,56+k*3,42,58+k*3,1,.25,'#a8b8d8');
  for(let k=0;k<4;k++) clFold(I,18+k*8,114,22+k*8,118,26+k*8,114,1.4,.35); softRect(I,0,124,64,4,'#c89a4a',.3,.6); }});
const tScarfClub=flatL(64,16,707,'#e8a020','knit',{decor:I=>{ for(let x=0;x<64;x+=8){ softRect(I,x,0,4,16,'#121214',.95,.5); } for(let x=0;x<64;x+=1.6) softLine(I,x,0,x,16,'#000000',.15,.5); softLine(I,0,1,64,1,'#ffffff',.2,.8); softLine(I,0,15,64,15,'#000000',.35,1); textI(I,'SOUTHSIDE',2,5,'#f2ece0',1,.85); }});
/* the King: white jumpsuit, gold studs, red-jewelled gold belt, high collar */
const studI=(I,x,y,r=1.6,col='#d4ad5a')=>{ softEll(I,x+.4,y+.5,r+.4,r+.4,'#000000',.3,.5); softEll(I,x,y,r,r,col,1,.35); softEll(I,x-r*.35,y-r*.35,r*.45,r*.45,'#fff8d8',.9,.5); };
const seqI=(I,seed,n,y0,y1)=>{ const r=rng(seed); for(let i=0;i<n;i++){ const x=r()*I.w,y=y0+r()*(y1-y0); softEll(I,x,y,.7,.7,'#ffffff',.8,.5); if(r()<.2){ softLine(I,x-2,y,x+2,y,'#ffffff',.5,.4); softLine(I,x,y-2,x,y+2,'#ffffff',.5,.4); } } };
const tKingTorso=torsoL('king',711,(x,y)=>{ if(vNeck(x,y,10,46)) return sk('king'); return ['#f6f2ea','poly']; },{decor:I=>{ neckShadow(I); vEdge(I,10,46,'#f6f2ea'); torsoForm(I,1.4); torsoFolds(I,1.4);
  for(const s of [-1,1]){ softLine(I,64+s*10,T3.neck,64,T3.neck+46,'#000000',.25,1.4); for(let k=0;k<7;k++) studI(I,64+s*(12.5-k*1.4),T3.neck+6+k*6); }
  for(const [cx,cy] of [[34,T3.chest+16],[94,T3.chest+16]]){ for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; studI(I,cx+Math.cos(a)*9,cy+Math.sin(a)*9,1.3); } softEll(I,cx,cy,3,3,'#c8202a',1,.4); softEll(I,cx-1,cy-1,1,1,'#ffb0b0',.8,.5); }
  for(let k=0;k<9;k++) studI(I,4+k*2,T3.sh+20+k*7,1.2); for(let k=0;k<9;k++) studI(I,124-k*2,T3.sh+20+k*7,1.2); seqI(I,712,90,T3.neck,256);
  softRect(I,0,T3.belt-5,128,14,'#000000',.3,2); softRect(I,0,T3.belt-7,128,12,'#d4ad5a',1,.5); softLine(I,0,T3.belt-6.4,128,T3.belt-6.4,'#fff4c8',.8,.7); softLine(I,0,T3.belt+4.4,128,T3.belt+4.4,'#6a4a14',.8,.8);
  for(let x=4;x<128;x+=10){ softEll(I,x,T3.belt-1,2.2,2.2,'#6a4a14',.8,.4); softEll(I,x,T3.belt-1,1.6,1.6,'#c8202a',1,.4); softEll(I,x-.5,T3.belt-1.6,.6,.6,'#ffd0d0',.9,.5); }
  softRect(I,55,T3.belt-10,18,18,'#000000',.35,1.5); softRect(I,54,T3.belt-11,18,18,'#e8c050',1,.5); softRect(I,57,T3.belt-8,12,12,'#b88a28',1,.5); softEll(I,63,T3.belt-2,4,4,'#c8202a',1,.4); softEll(I,62,T3.belt-3,1.4,1.4,'#ffd0d0',.9,.5); softLine(I,54,T3.belt-11,72,T3.belt-11,'#fff8d8',.9,.7); }});
const tKingArm=armL(713,()=>['#f6f2ea','poly'],{decor:I=>{ armForm(I,1.4,null,114); for(let y=10;y<112;y+=11) studI(I,32,y,1.3); seqI(I,714,40,0,128); softRect(I,0,112,64,16,'#f6f2ea',.9,1); for(let x=4;x<64;x+=8) studI(I,x,120,1.1); softLine(I,0,112,64,112,'#000000',.3,1); }});
const tKingLeg=legL(715,(x,y)=>['#f6f2ea','poly'],{decor:I=>{ legForm(I,1.3,null,128); for(const x of [15,49]) for(let y=6;y<124;y+=9) studI(I,x,y,1.2); seqI(I,716,40,0,128);
  softRect(I,0,96,64,32,'#f2ede4',.8,2); for(const x of [8,24,40,56]) clFold(I,x,96,x+3,112,x+5,128,2,.3); polyI(I,[[26,128],[32,100],[38,128]],'#c8202a',.95); softLine(I,26,128,32,100,'#d4ad5a',.9,.7); softLine(I,38,128,32,100,'#d4ad5a',.9,.7); }});
const tGoldBoot=shoeL(717,'#f6f2ea',{sole:'#b88a28',shine:.5,decor:I=>{ softRect(I,0,21,64,2,'#d4ad5a',1,.4); for(let x=6;x<64;x+=10) studI(I,x,10,1.1); }});
/* the Kings: gold lame jackets over black shirts, black jeans */
const lameI=(I,seed,skip)=>{ const r=rng(seed); for(let i=0;i<I.w*I.h*.05;i++){ const x=r()*I.w,y=r()*I.h; if(skip&&skip(x,y)) continue; const a=r()*Math.PI,L=2+r()*5; softLine(I,x,y,x+Math.cos(a)*L,y+Math.sin(a)*L,r()>.5?'#fff0a8':'#6a4a10',.35+r()*.3,.6+r()*.6); }
  for(let i=0;i<I.w*I.h*.012;i++){ const x=r()*I.w,y=r()*I.h; if(skip&&skip(x,y)) continue; softEll(I,x,y,.6,.6,'#ffffff',.9,.5); } };
const tKingcTorso=torsoL('kingc',721,(x,y)=>{ const open=Math.abs(x-64)<12-Math.max(0,y-T3.chest)*.08; if(y>T3.belt+2) return ['#141416','denim',.6]; return open?['#141416','cotton',.5]:['#c8a040','poly',.8,1.1]; },{decor:I=>{ neckShadow(I);
  const opn=(x,y)=>y>T3.belt+2||Math.abs(x-64)<12-Math.max(0,y-T3.chest)*.08; lameI(I,722,opn); torsoForm(I,1.4); torsoFolds(I,1.4,'#fff0a8');
  shirtCollar(I,11,10,'#1c1c20',true); for(let y=T3.neck+26;y<T3.belt;y+=16) buttonP(I,64,y,1.2,'#2a2a30');
  for(const s of [-1,1]){ polyI(I,[[64+s*12,T3.neck],[64+s*20,T3.neck+2],[64+s*22,T3.chest-6],[64+s*12,T3.chest+10]],'#e8c460',1); softLine(I,64+s*12,T3.neck,64+s*12,T3.chest+10,'#fff8d0',.7,.8); softLine(I,64+s*22,T3.chest-6,64+s*12,T3.chest+10,'#4a3008',.6,1); softLine(I,64+s*13.5,T3.chest+10,64+s*(12-(T3.belt-T3.chest)*.08)+s*1.5,T3.belt,'#000000',.4,1.6); }
  beltP(I,'#0a0a0c','#d4ad5a',{h:6}); seam(I,64,T3.belt+6,64,T3.belt+36,'#3a3a40'); }});
const tKingcArm=armL(723,()=>['#c8a040','poly',.8,1.1],{decor:I=>{ lameI(I,724); armForm(I,1.4,'#fff0a8',118); softRect(I,0,118,64,10,'#141416',.95,.6); }});
const tKingcLeg=suitLeg(725,'#141416',{fab:'denim',sheen:'#4a4a56',hi:'#3a3a44'});
/* Tremor: hot-pink shirt with a lime hibiscus print over a white ribbed vest, olive cargo shorts */
const hibiscus=(I,x,y,s,petal,mid)=>{ for(let k=0;k<5;k++){ const a=k/5*Math.PI*2+.3; softEll(I,x+Math.cos(a)*3.6*s,y+Math.sin(a)*3.6*s,3*s,2.6*s,petal,.92,.5); softLine(I,x,y,x+Math.cos(a)*5*s,y+Math.sin(a)*5*s,'#3a8a2a',.4,.6); } softEll(I,x,y,1.4*s,1.4*s,mid,1,.4); softLine(I,x,y,x+3*s,y-4*s,'#ffe860',.9,.5); };
const tTremTorso=torsoL('tremor',731,(x,y)=>{ const open=Math.abs(x-64)<14; if(y>T3.belt+2) return ['#6a6a4a','twill',.6]; return open?['#f2f0ea','knit',.4]:['#ff4fae','cotton']; },{decor:I=>{ neckShadow(I); torsoForm(I,1.2);
  for(let x=51;x<78;x+=2) softLine(I,x,T3.neck+4,x,T3.belt,'#000000',.12,.6); const r=rng(732); for(let i=0;i<30;i++){ const x=r()*128,y=T3.neck+6+r()*(T3.belt-T3.neck-10); if(Math.abs(x-64)<17) continue; hibiscus(I,x,y,.9+r()*.5,'#7cf06a','#ff4fae'); if(r()<.5) palmLeaf(I,x+4,y+3,r()*6.28,9,'#3aa848','#2a7a34'); }
  torsoFolds(I,1.1,'#ffb0dc'); for(const s of [-1,1]){ softLine(I,64+s*14.5,T3.neck,64+s*14.5,T3.belt,'#000000',.4,1.6); softLine(I,64+s*13.8,T3.neck,64+s*13.8,T3.belt,'#ffb0dc',.5,.6); } shirtCollar(I,17,13,'#ff4fae',true);
  for(let y=T3.neck+40;y<T3.belt;y+=20) buttonP(I,79,y,1.4,'#f2ece0'); softRect(I,0,T3.belt-2,128,4,'#000000',.3,1.5); beltP(I,'#3a3a2a','#a8a49c',{h:5}); chainP(I,'#d4ad5a',14,12); chainP(I,'#e8c050',22,14); softEll(I,64,T3.neck+40,3,3.6,'#e8c050',1,.4); }});
const tTremArm=armL(733,(x,y)=>y<40?['#ff4fae','cotton']:sk('tremor'),{decor:I=>{ const r=rng(734); for(let i=0;i<9;i++) hibiscus(I,r()*64,4+r()*30,.9,'#7cf06a','#ff4fae'); blob(I,32,8,22,8,.12); clFold(I,16,22,30,28,46,23,1.8,.3);
  softRect(I,0,35,64,5,'#ff3a9e',.9,.5); softLine(I,0,40,64,40,'#000000',.3,1); blob(I,32,44,30,3,-.22); blob(I,32,80,10,5,.08); softRect(I,24,106,14,6,'#d4ad5a',.95,.5); softLine(I,24,106.5,38,106.5,'#fff4c8',.8,.5); }});
const tTremLeg=legL(735,(x,y)=>y<64?['#6a6a4a','twill']:sk('tremor'),{decor:I=>{ blob(I,32,20,12,14,.08); clFold(I,12,6,20,14,24,26,1.4,.3); clFold(I,52,6,44,14,40,26,1.4,.3); seam(I,16,0,16,62,'#4a4a30'); seam(I,48,0,48,62,'#4a4a30');
  for(const x of [3,43]){ softRect(I,x,28,18,18,'#000000',.25,1.5); softRect(I,x,27,18,18,'#5e5e40',.95,.6); stitchI(I,x+1,28,x+1,44,'#8a8a60',.5); stitchI(I,x+17,28,x+17,44,'#8a8a60',.5); flapP(I,x-.5,25,19,6,'#6e6e4c','#8a8a66'); buttonP(I,x+9,29,1.2,'#3a3a2a'); }
  softRect(I,0,59,64,5,'#5a5a3e',.9,.5); softLine(I,0,64,64,64,'#000000',.4,1.4); blob(I,32,68,30,3,-.22); blob(I,32,76,7,5,.12); }});
const tHighTop=shoeL(737,'#f2f0ea',{sole:'#29e0e6',lace:'#f2f0ea',shine:.5,grime:.06,decor:I=>{ softRect(I,20,3,24,6,'#ff4fae',.9,.6); softLine(I,20,3,44,3,'#ffffff',.4,.6); softEll(I,10,12,4,4,'#ff4fae',.9,.5); softEll(I,54,12,4,4,'#ff4fae',.9,.5); for(let x=0;x<64;x+=3) softLine(I,x,28,x+1.5,31,'#0a8a90',.4,.6); }});
/* Tremor's crew: teal numbered jerseys, orange bandanas, black shorts */
const tTremcTorso=torsoL('tremorc',741,(x,y)=>{ if(y>T3.belt+2) return ['#141416','poly',.6]; return Math.abs(x-64)>40&&y<T3.chest?sk('tremorc'):['#1aa8a0','poly']; },{decor:I=>{ neckShadow(I); torsoForm(I,1.3); torsoFolds(I,1.1,'#7ae8e0');
  for(let y=T3.neck;y<T3.chest+40;y+=1.6) for(let x=(y*3%2);x<128;x+=1.6) softEll(I,x,y,.35,.35,'#000000',.18,.5);
  for(const s of [-1,1]){ softLine(I,64+s*12,T3.neck,64,T3.neck+14,'#f2c230',.95,1.3); softLine(I,64+s*24,T3.neck,64+s*24,T3.chest,'#f2c230',.9,1); softLine(I,64+s*40,T3.neck+8,64+s*40,T3.chest,'#f2c230',.9,1); }
  textI(I,'10',53,T3.chest-10,'#000000',3,.3); textI(I,'10',52,T3.chest-11,'#f2ece0',3,.97); textI(I,'10',-17.5,T3.sh+8,'#f2ece0',5,.97); textI(I,'TREMOR',-11.5,T3.sh-1,'#f2c230',1,.9);
  for(const s of [-1,1]) softLine(I,64+s*32,T3.chest,64+s*32,T3.belt,'#f2c230',.85,1.6); softLine(I,0,T3.belt-1,128,T3.belt-1,'#000000',.4,1.6); ribI(I,0,T3.belt+1,128,5,'#141416',.9); }});
const tTremcArm=armL(743,()=>sk('tremorc'),{decor:I=>{ softRect(I,0,0,64,8,'#1aa8a0',.95,.8); softLine(I,0,8,64,8,'#f2c230',.9,1); softLine(I,0,9.6,64,9.6,'#000000',.3,1); blob(I,32,30,24,10,.05); blob(I,32,80,10,5,.08); blob(I,8,90,6,30,-.08); }});
const tTremcLeg=legL(745,(x,y)=>y<58?['#141416','poly']:sk('tremorc'),{decor:I=>{ blob(I,32,20,12,14,.08); clFold(I,12,6,20,14,24,26,1.4,.3); clFold(I,52,6,44,14,40,26,1.4,.3); for(const x of [15,49]){ softLine(I,x,0,x,58,'#f2c230',.95,1.2); softLine(I,x+1.6,0,x+1.6,58,'#000000',.3,.7); } softLine(I,0,58,64,58,'#0a0a0c',.9,1.6); blob(I,32,62,30,3,-.22); blob(I,32,70,7,5,.12); }});
const tVolkBoot=shoeL(339,'#1d1d1f',{lace:'#3a3a3c',shine:.7,decor:I=>{ softRect(I,0,0,64,3,'#2e2e30',.8,.6); }});

/* ---------- hats, glasses, hair pieces ---------- */
function crown(J,rings,m,cz=-.008){ return mk(lathe(rings.map(([y,rx,rz])=>[y,rx,rz,cz]),10),m,J.head); }
function shades(J,lens,frame){ for(const s of [-1,1]) mk(box(.056,.03,.012),lens,J.head,s*.032,.126,.094); mk(box(.02,.006,.01),frame,J.head,0,.132,.096); for(const s of [-1,1]) mk(box(.006,.006,.09),frame,J.head,s*.064,.13,.05); }
/* painted hair for the solid pieces (buns, quiffs): strands running up, a sheen band, darker roots */
const HAIRT={}; function hairTex(col){ return HAIRT[col]||(HAIRT[col]=P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,mix(col,'#ffffff',.12)],[.6,col],[1,mix(col,'#000000',.45)]]); const r=rng(col.length*7+3);
  for(let i=0;i<160;i++){ const x=r()*w,y=r()*h; g.fillStyle=r()>.5?rgba(mix(col,'#ffffff',.35),.35):'rgba(0,0,0,.35)'; g.fillRect(x,y,.6,3+r()*6); }
  vfill(g,0,h*.25,w,h*.18,[[0,'rgba(255,255,255,0)'],[.5,'rgba(255,255,255,.28)'],[1,'rgba(255,255,255,0)']]); },6,col.length)); }
/* caps: six panels with seams and topstitching, a button, wool or tweed */
function capTex(col,o={}){ return P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,mix(col,'#ffffff',.14)],[1,mix(col,'#000000',.3)]]); const r=rng(o.seed||5);
  if(o.tweed) for(let y=0;y<h;y+=1) for(let x=0;x<w;x+=2){ g.fillStyle=((x>>1)+y)%4<2?'rgba(255,255,255,.08)':'rgba(0,0,0,.12)'; g.fillRect(x+((y>>2)%2),y,1,1); }
  for(let i=0;i<90;i++){ g.fillStyle=r()>.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.1)'; g.fillRect(r()*w,r()*h,.6,.6); }
  for(let k=0;k<6;k++){ const x=k*w/6; g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(x,0,.6,h); g.fillStyle='rgba(255,255,255,.12)'; g.fillRect(x+.6,0,.4,h); for(let y=1;y<h;y+=2){ g.fillStyle='rgba(255,255,255,.18)'; g.fillRect(x+1.4,y,.4,.9); g.fillRect(x-1.4,y,.4,.9); } }
  g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(0,h-2,w,2); if(o.logo){ ell(g,w*.5,h*.55,4.5,4,o.logo[0]); text(g,o.logo[1],w*.5-5.5,h*.55-2.5,o.logo[2]||'#ffffff',1); }
  if(o.eyelet) for(let k=0;k<6;k++){ ell(g,(k+.5)*w/6,h*.3,.9,.9,'rgba(0,0,0,.6)'); } },0); }
function bun(J,col,pins){ mk(lathe([[0,.012,.012],[.03,.05,.05],[.07,.052,.052],[.1,.012,.012]],8),M(hairTex(col)),J.head,0,.15,-.085,-1.2); if(pins) for(const s of [-1,1]){ mk(box(.006,.006,.14),mGold,J.head,s*.03,.2,-.1,.4,s*.4,0); mk(box(.016,.016,.016),M(null,{color:0x2a8a6a}),J.head,s*.052,.218,-.07,.4,s*.4,0); } }
function pompadour(J,col){ mk(lathe([[0,.07,.06],[.04,.08,.075],[.08,.06,.06],[.1,.02,.02]],10),M(hairTex(col)),J.head,0,.205,.025,.55,0,0); }
function ushanka(J){ const fur=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#6a5038'],[1,'#3e2c1c']]); const r=rng(9); for(let i=0;i<420;i++){ const x=r()*w,y=r()*h; g.fillStyle=r()>.5?'rgba(170,138,100,.55)':'rgba(30,20,10,.55)'; g.fillRect(x,y,.6,1.5+r()*2.5); } for(let i=0;i<14;i++) ell(g,r()*w,r()*h,2+r()*3,1.5+r()*2,'rgba(0,0,0,.18)'); },6,9));
  crown(J,[[.13,.09,.11],[.2,.095,.115],[.27,.09,.11],[.3,.0,.0]],fur); for(const s of [-1,1]) mk(box(.03,.12,.09),fur,J.head,s*.088,.12,-.01); mk(box(.17,.05,.03),fur,J.head,0,.23,.1); }
function flatCap(J,col){ const m=M(capTex(col,{tweed:true,seed:11})); crown(J,[[.18,.088,.108],[.22,.095,.115],[.25,.07,.09],[.26,0,0]],m,.0); mk(box(.15,.012,.08),m,J.head,0,.2,.1,.2); }
function backCap(J,col,brim){ const m=M(capTex(col,{seed:12,eyelet:true,logo:[brim,'RIO','#ffffff']})); crown(J,[[.17,.086,.106],[.24,.088,.106],[.27,.06,.08],[.28,0,0]],m); mk(box(.14,.012,.08),M(capTex(brim,{seed:13})),J.head,0,.18,-.12,-.25); }
function headphones(J){ mk(torus(.085,.012,4,14),M(null,{color:0x1a1a1e}),J.neck,0,.04,.0,Math.PI/2); for(const s of [-1,1]) mk(cyl(.035,.035,.03,10),M(null,{color:0x29e0e6}),J.neck,s*.085,.04,.03,0,0,Math.PI/2); }
function bandana(J,col){ const m=M(P2(32,32,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,mix(col,'#ffffff',.12)],[1,mix(col,'#000000',.2)]]); const r=rng(17);
    for(let i=0;i<14;i++){ const x=r()*w,y=r()*h,a=r()*6.28; g.save(); g.translate(x,y); g.rotate(a); ell(g,0,0,3,1.8,'#f2ece0'); ell(g,2.4,-1,1.4,.9,'#f2ece0'); ell(g,0,0,1.8,1,'#2a1a10'); ell(g,0,0,.8,.5,col); g.restore(); }
    for(let y=2;y<h;y+=5) for(let x=(y%2)*2;x<w;x+=5) ell(g,x+1,y,.7,.7,'#2a1a10');
    g.strokeStyle='#f2ece0'; g.lineWidth=.8; g.strokeRect(1.5,1.5,w-3,h-3); g.strokeStyle='#2a1a10'; g.lineWidth=.4; g.strokeRect(2.6,2.6,w-5.2,h-5.2);
    for(let i=0;i<5;i++){ g.fillStyle='rgba(0,0,0,.15)'; g.fillRect(0,r()*h,w,1.2); } },6,7));
  mk(lathe([[.012,.06,.074,.026],[.05,.07,.088,.016],[.098,.077,.098,.006]],12,{capB:false,capT:false}),m,J.head); mk(box(.11,.06,.012,{at:[0,-.03,0]}),m,J.head,0,.02,.1,.25); }
/* collars (the lathe wraps the texture round the neck: front in the middle) */
const tLauCollar=flatL(64,16,636,'#14524a','cotton',{decor:I=>{ brocade(I,0,16,'#0e3e36','#2a7a66',637); softLine(I,0,1,64,1,'#d4ad5a',.95,1); softLine(I,0,14.5,64,14.5,'#d4ad5a',.95,1); lauFrog(I,32,8,'#d4ad5a'); softLine(I,32,0,32,16,'#000000',.4,.8); }});
const tNonnaCollar=flatL(64,16,676,'#2a2630','knit',{decor:I=>{ for(let y=2;y<16;y+=3.2) for(let x=((y/3.2|0)%2)*1.6;x<64;x+=3.2) softEll(I,x,y,.9,.9,'#5a5662',.6,.5); for(let x=0;x<64;x+=4) softEll(I,x,1.5,1.8,1.6,'#6a6672',.8,.5); }});
const tKingCollar=flatL(64,16,716,'#f6f2ea','poly',{decor:I=>{ for(let x=3;x<64;x+=5) studI(I,x,8,1.2); softLine(I,0,1,64,1,'#d4ad5a',.95,1); softLine(I,0,15,64,15,'#000000',.3,1); seqI(I,718,10,0,16); }});
function wheelchair(parent){ const n=N(parent,0,0,0,0,-Math.PI/2,0), steel=M(null,{color:0x9aa0a6}), black=M(null,{color:0x18181a}), seat=M(null,{color:0x2a1a3a});
  for(const s of [-1,1]){ mk(torus(.3,.02,4,18),black,n,-.05,.3,s*.3,0,0,0); mk(cyl(.07,.07,.03,8),black,n,.35,.07,s*.24,Math.PI/2); mk(box(.5,.03,.03),steel,n,.1,.42,s*.24); mk(box(.03,.6,.03),steel,n,-.2,.72,s*.24,0,0,-.1); }
  mk(box(.46,.05,.46),seat,n,.05,.46,0); mk(box(.05,.42,.44),seat,n,-.2,.72,0,0,0,-.1); return n; }

/* ---------- the roster ---------- */
const FEM={hf:.95,w:.88,depth:.92,lg:.86,ag:.84,belly:.95,shoeW:.085};
const ONE_HAND={armR:[-2.0,0,.25],elbowR:[-1.1,0,0],armL:[-.7,0,-.35],elbowL:[-.9,0,0],spine:[.15,-.25,0],head:[0,.25,0],thighL:[-.25,0,.06],kneeL:[.3,0,0],thighR:[.15,0,-.05],kneeR:[.1,0,0]};
const AIM_ONE={spine:[.1,0,0],neck:[-.06,0,0],armR:[-1.42,0,.05],elbowR:[-.05,0,0],armL:[.05,0,.12],elbowL:[-.25,0,0],head:[-.02,0,0],thighL:[-.12,0,.05],thighR:[.06,0,-.04]};
const AIM_TWO={spine:[.06,0,0],armR:[-1.45,0,.12],elbowR:[-.05,0,0],armL:[-1.45,0,-.12],elbowL:[-.05,0,0],head:[-.02,0,0],thighL:[-.22,0,.12],kneeL:[.2,0,0],thighR:[.1,0,-.12],kneeR:[.15,0,0]};
const GUARD={spine:[.06,.3,0],head:[.1,-.3,0],armL:[-.95,0,-.22],elbowL:[-1.95,0,0],armR:[-.85,0,.25],elbowR:[-2.0,0,0],thighL:[-.18,0,.06],kneeL:[.28,0,0],thighR:[.16,0,-.05],kneeR:[.18,0,0],ankleL:[-.1,0,0]};
const PISTOL={prop:pPistolP,support:true,gripHand:true,wFight:{p:[.036,-.139,.035],r:[Math.PI/2,0,0]}};
const BLADE=(p)=>({prop:p,gripHand:true,wFight:{p:[0,-.075,0],r:[1.57,0,0]},fight:ONE_HAND});
const TWO=(p,gun)=>({prop:p,twoHand:true,gripHand:true,gun,wFight:{p:[0,0,0],r:[0,0,0]},fight:TWO_HAND_ARMS,two:true});
const ROSTER={
  nico:Object.assign({name:'Nico Varga',role:'You · "the Tourist"',stop:'Walks onto platform 0 in Tokyo',color:'#3fae9a',note:'A hitman on his first holiday in eleven years. Somebody put a price on his head the day he boarded, and every crew on the route wants it. He brought a pistol in his golf bag, just in case.',
    o:{hf:1.0,w:1.02,depth:1.0,lg:1.02,ag:1.04,jacket:.004,pants:.008},torso:tNicoTorso,arm:tNicoArm,leg:tNicoLeg,foot:tLoafer,
    extra:J=>shades(J,M(null,{color:0x1a2a3a,emissive:0x0a1a2a}),M(null,{color:0xd4ad5a}))},PISTOL,{fight:null}),
  ren:Object.assign({name:'Ren Kagami',role:'Boss · Kagami-gumi',stop:'Boards in Tokyo, at the end of the line',color:'#ff4fae',crew:'renc',note:'The yakuza boss\'s spoiled son, in a white suit he will not let you bleed on. Short sword in one hand. When he is losing he starts offering money.',
    o:{hf:.99,w:.96,depth:.96,lg:.96,ag:.96,jacket:.01,pants:.008},torso:tRenTorso,arm:tRenArm,leg:tRenLeg,foot:tWhiteShoe},BLADE(pWaki)),
  renc:Object.assign({name:'Kagami-gumi',role:'Crew · Tokyo',stop:'Boards in Tokyo, at the end of the line',color:'#2a2a34',note:'Black suits, white shirts, black ties, dark glasses. They fight in disciplined pairs and never run.',
    o:{hf:1.0,w:1.02,depth:1.0,lg:1.0,ag:1.02,jacket:.008,pants:.008},torso:tRencTorso,arm:tRencArm,leg:tRencLeg,foot:tOxford,extra:J=>shades(J,M(null,{color:0x0a0a0c}),M(null,{color:0x0a0a0c}))},PISTOL),
  lau:Object.assign({name:'Madam Lau',role:'Boss · Golden Crane triad',stop:'Boards in Hong Kong',color:'#1f6a5a',crew:'lauc',note:'Runs the dim sum car like she runs the harbour. Jade silk, gold cranes, hair pinned with gold, and a cleaver she throws better than you shoot.',
    o:Object.assign({jacket:.014,pants:.012},FEM,{hf:.93}),torso:tLauTorso,arm:tLauArm,leg:tLauLeg,foot:tOxford,extra:(J,o)=>{ collar(J,o,M(tLauCollar,{double:true}),.06,.012); bun(J,'#0e0c10',true); }},BLADE(pCleaver)),
  lauc:Object.assign({name:'Golden Crane',role:'Crew · Hong Kong',stop:'Boards in Hong Kong',color:'#c8302a',note:'Black shirts, rolled sleeves, tattooed forearms, gold chains. Cleavers from the kitchen. They come at you all at once.',
    o:{hf:.98,w:.96,depth:.96,lg:.95,ag:.98,jacket:.006,pants:.008},torso:tLaucTorso,arm:tLaucArm,leg:tLaucLeg,foot:tOxford},BLADE(pCleaver)),
  volkov:Object.assign({name:'Grigor "The Stove" Volkov',role:'Boss · Volkov brotherhood',stop:'Boards in Siberia',color:'#5aa8d8',crew:'volkovc',note:'Two metres of fur coat and beard. Takes his shotgun into the sauna. He does not feel pain and does not beg, so he keeps coming after he loses things.',
    o:{hf:1.08,w:1.24,depth:1.18,belly:1.14,lg:1.2,ag:1.24,jacket:.03,pants:.016,headS:1.05,shoeW:.11},torso:tVolkTorso,arm:tVolkArm,leg:tVolkLeg,foot:tVolkBoot,extra:J=>ushanka(J)},TWO(pShotgunP,'shotgun')),
  volkovc:Object.assign({name:'The Brotherhood',role:'Crew · Siberia',stop:'Boards in Siberia',color:'#1d2a5a',note:'Tracksuits, flat caps, gold teeth. They drink at the ice bar between fights and carry pistols in the sauna.',
    o:{hf:1.0,w:1.04,depth:1.02,lg:1.02,ag:1.04,jacket:.01,pants:.012},torso:tVolkcTorso,arm:tVolkcArm,leg:tVolkcLeg,foot:tTrainer,extra:J=>flatCap(J,'#3a3a40')},PISTOL),
  nonna:{name:'Nonna Assunta Esposito',role:'Boss · the Esposito family',stop:'Boards in Naples',color:'#f2d27a',crew:'nonnac',note:'Ninety-one, in a wheelchair, in black. Eats lunch in the trattoria every day with a sawn-off shotgun across her knees, and taunts you the whole fight. You can let her go.',
    o:Object.assign({jacket:.014,pants:.016,belly:1.06},FEM,{hf:.88}),torso:tNonnaTorso,arm:tNonnaArm,leg:tNonnaLeg,foot:tOxford,seated:true,extra:(J,o)=>{ collar(J,o,M(tNonnaCollar,{double:true}),.04,.01); bun(J,'#ece8e2'); },fight:{}},
  nonnac:Object.assign({name:'The grandsons',role:'Crew · Naples',stop:'Boards in Naples',color:'#1d2a4a',note:'Tight navy suits, open collars, gold chains, slicked hair. They will die for Nonna, and she will tell them so.',
    o:{hf:.99,w:.98,depth:.96,lg:.96,ag:.98,jacket:.008,pants:.008},torso:tNoncTorso,arm:tNoncArm,leg:tNoncLeg,foot:tOxford},PISTOL),
  gaffer:{name:'Terry "The Gaffer" Moss',role:'Boss · the Southside firm',stop:'Boards in London',color:'#e8a020',crew:'gafferc',note:'Top boy of the firm, in the club shirt he has worn to every match since 1998. No gun, no knife: it is fists only with the Gaffer, in the pub, with the match on.',
    o:{hf:1.0,w:1.08,depth:1.06,belly:1.08,lg:1.04,ag:1.1,jacket:.004,pants:.012},torso:tGafTorso,arm:tGafArm,leg:tGafLeg,foot:tTrainer,gripHand:true,fight:GUARD},
  gafferc:Object.assign({name:'The firm',role:'Crew · London',stop:'Boards in London',color:'#8a8c90',note:'Grey hoodies, club scarves, bottles from the bar. Pure brawlers. The best leg of the trip for fists.',
    o:{hf:.98,w:.98,depth:.98,lg:.96,ag:.98,jacket:.012,pants:.012},torso:tGafcTorso,arm:tGafcArm,leg:tGafcLeg,foot:tTrainer,extra:(J,o)=>collar(J,o,M(tScarfClub,{double:true}),.07,.02)},BLADE(pBottle)),
  king:{name:'"The King"',role:'Boss · the Kings',stop:'Boards in Las Vegas',color:'#f5c542',crew:'kingc',note:'Leader of a hit squad of Elvis impersonators. White jumpsuit, gold studs, gold glasses, a gold revolver in each hand. Fights on the casino stage, built for bullet time.',
    o:{hf:1.0,w:1.02,depth:1.02,belly:1.06,lg:1.02,ag:1.02,jacket:.008,pants:.016},torso:tKingTorso,arm:tKingArm,leg:tKingLeg,foot:tGoldBoot,prop:pRevGold,gripHand:true,wFight:{p:[.036,-.089,.035],r:[Math.PI/2,0,0]},fight:AIM_TWO,
    extra:(J,o)=>{ pompadour(J,'#08080a'); shades(J,M(null,{color:0x3a2a10,emissive:0x2a1a06}),mGold); collar(J,o,M(tKingCollar,{double:true}),.09,.03); const l=N(J.handL,-.036,-.089,.035,Math.PI/2,0,0); pRevGold(l); J.leftGun=l; }},
  kingc:Object.assign({name:'The Kings',role:'Crew · Las Vegas',stop:'Boards in Las Vegas',color:'#c8a040',note:'Younger, thinner impersonators in gold lame jackets and black jeans, quiffs held up with half a tin of pomade each.',
    o:{hf:.99,w:.96,depth:.96,lg:.96,ag:.96,jacket:.008,pants:.008},torso:tKingcTorso,arm:tKingcArm,leg:tKingcLeg,foot:tOxford,extra:J=>pompadour(J,'#0a0a0c')},PISTOL),
  tremor:Object.assign({name:'DJ Tremor',role:'Boss · Tremor\'s crew',stop:'Boards in Rio',color:'#ff4fae',crew:'tremorc',note:'Takes over the pool deck with a sound system and never turns it off. His crew moves to the beat, and so does the fight, on the roofs of the cars.',
    o:{hf:1.0,w:1.0,depth:1.0,lg:1.0,ag:1.0,jacket:.008,pants:.012},torso:tTremTorso,arm:tTremArm,leg:tTremLeg,foot:tHighTop,extra:J=>{ backCap(J,'#7cf06a','#ff4fae'); headphones(J); }},TWO(pSMGP,'smg')),
  tremorc:Object.assign({name:'Tremor\'s crew',role:'Crew · Rio',stop:'Boards in Rio',color:'#1aa8a0',note:'Teal numbered jerseys, orange bandanas over their faces, fast on their feet and happy on the roofs.',
    o:{hf:.99,w:.98,depth:.98,lg:1.0,ag:.98,jacket:.006,pants:.01},torso:tTremcTorso,arm:tTremcArm,leg:tTremcLeg,foot:tHighTop,extra:J=>bandana(J,'#f28a3a')},PISTOL)
};
const BOSSES=['ren','lau','volkov','nonna','gaffer','king','tremor'];
function makeChar(id,parent,grp){
  const R_=ROSTER[id], k=id; for(const t of [R_.torso,R_.arm,R_.leg,R_.foot]) void t.c; /* paint them now, behind the fade, not on the first frame they are drawn */
  const o=Object.assign(baseMats(k),R_.o,{torsoM:M(R_.torso),armM:M(R_.arm),legM:M(R_.leg),footM:M(R_.foot)});
  if(R_.hand) o.handM=M(R_.hand);
  const J=rig(o,parent); if(R_.extra) R_.extra(J,o);
  const s={kind:k,faces:FACE[k],grp,fight:R_.fight||ONE_HAND,showDrop:false,gripHand:R_.gripHand};
  if(R_.prop){ Object.assign(s,{prop:R_.prop,wFight:R_.wFight,twoHand:R_.twoHand,gun:R_.gun,support:R_.support}); if(R_.two) s.fightHipsY=J.hips.p[1]-.055; }
  if(id==='nico'){ s.fight=AIM_ONE; }
  const Cc=finish(parent,J,o,s); Cc.id=id;
  if(R_.seated){ wheelchair(parent); applyPose(Cc,'sit'); Cc.seated=true; }
  return Cc; }

/* (the art page's line-up and decorative crews are not built in the game: 70-crews.js spawns them as people) */
