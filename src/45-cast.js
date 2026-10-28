
/* =====================================================================================================
   THE CAST on the Stairwell rig: a hitman on vacation, and the seven crews who board to collect the bounty
   on him. New heads go through paintHead(), new clothes through torsoP()/armP()/legP()/garment().
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
function pWaki(g){ mk(box(.03,.034,.2),M(P2(8,16,(g,w,h)=>{ R(g,'#141214',0,0,w,h); for(let y=0;y<h;y+=3) R(g,'#e8e2d4',1,y,w-2,1); })),g,0,0,.02); mk(box(.06,.012,.06),mGold,g,0,0,.13); mk(box(.006,.03,.42,{td:.6}),M(tBlade,{double:true}),g,0,0,.36); return g; }
function pCleaver(g){ mk(box(.026,.03,.13),M(woodT('#5a3a24','#3a2416',301)),g,0,0,0); mk(box(.006,.12,.22,{td:.9}),M(tBladeBlood,{double:true}),g,0,-.05,.17); return g; }
function pRevGold(g){ mk(box(.026,.085,.035),M(null,{color:0xf0ece0}),g,0,-.035,-.015,.3); mk(box(.028,.045,.085),mGold,g,0,.025,.03); mk(cyl(.021,.021,.042,6),M(null,{color:0xd4ad5a,double:true}),g,0,.028,.045,Math.PI/2); mk(cyl(.009,.009,.09,6),M(null,{color:0xd4ad5a,double:true}),g,0,.036,.12,Math.PI/2); return g; }

/* ---------- painted outfits ---------- */
const vNeck=(x,y,w0,drop)=>y<T3.neck+drop&&Math.abs(x-64)<w0*(1-(y-T3.neck)/drop);
const buttons=(I,xs,y0,y1,step,col)=>{ for(const x of xs) for(let y=y0;y<y1;y+=step){ softEll(I,x,y,1.8,1.8,col,1,.4); softEll(I,x-.5,y-.5,.7,.7,'#ffffff',.4,.4); } };
const chain=(I,col='#d4ad5a')=>{ for(let x=48;x<=80;x+=2){ const y=T3.neck+6+Math.pow((x-64)/16,2)*-8+8; softEll(I,x,y,1.2,1,col,1,.4); } };
const leafPrint=(I,x0,y0,w,h,seed)=>{ const r=rng(seed); for(let i=0;i<w*h/120;i++){ const x=x0+r()*w,y=y0+r()*h,a=r()*Math.PI; for(let k=-4;k<=4;k++) softLine(I,x,y,x+Math.cos(a+k*.25)*7,y+Math.sin(a+k*.25)*7,k%2?'#3f7a3e':'#5a9a4a',.85,1.2); } };
const sk=k=>[HEADS[k].skin,'skin',0];
/* Nico: cream camp shirt with a palm-leaf print, shoulder holster, tan shorts */
const tNicoTorso=torsoP('nico',601,(x,y)=>{ if(vNeck(x,y,13,30)) return sk('nico'); return y>T3.belt+2?['#c8b07a','twill',.6]:['#efe6d2','cotton']; },{decor:I=>{ neckShadow(I); leafPrint(I,0,T3.neck+4,128,T3.belt-T3.neck-8,602); softLine(I,64,T3.neck+30,64,T3.belt-2,'#c8bca4',.9,1.2); chain(I);
  for(const s of [-1,1]) softLine(I,64+s*22,T3.sh-6,64+s*30,T3.chest+30,'#5a3a22',.95,2.4); softRect(I,30,T3.chest+10,12,30,'#4a2a18',.95,1); softRect(I,32,T3.chest+12,8,8,'#2a2a2e',.9,.6); beltI(I,'#5a3a22','#d4ad5a'); }});
const tNicoArm=armP(603,(x,y)=>y<46?['#efe6d2','cotton']:[HEADS.nico.skin,'skin',0],{decor:I=>{ leafPrint(I,0,0,64,42,604); blob(I,32,50,30,3,-.18); softRect(I,24,108,14,5,'#d4ad5a',.95,.5); }});
const tNicoLeg=legP(605,(x,y)=>y<60?['#c8b07a','twill']:[HEADS.nico.skin,'skin',0],{decor:I=>{ softLine(I,0,60,64,60,'#a8905a',.9,1.4); blob(I,32,64,30,3,-.15); }});
const tLoafer=garment(64,32,607,(x,y)=>[y<10?HEADS.nico.skin:'#6a3a22',y<10?'skin':'leather',.2],{folds:2,grime:0,decor:I=>softRect(I,0,24,64,8,'#2a1a10',1,1)});
/* Ren: ivory suit, red shirt */
const tRenTorso=torsoP('ren',611,(x,y)=>{ if(vNeck(x,y,14,40)) return Math.abs(x-64)<9?sk('ren'):['#c8202a','cotton',.5]; return ['#efe8da','wool']; },{decor:I=>{ neckShadow(I); sideSeams(I,T3.neck,256); for(const s of [-1,1]) softLine(I,64+s*14,T3.neck,64+s*4,T3.neck+46,'#d8d0c0',.95,1.8); buttons(I,[66],T3.neck+54,T3.belt-4,20,'#d4ad5a'); chain(I); }});
const tRenArm=armP(613,(x,y)=>y>118?['#c8202a','cotton',.2]:['#efe8da','wool']);
const tRenLeg=legP(615,()=>['#efe8da','wool'],{decor:I=>softLine(I,32,0,32,128,'#d8d0c0',.8,1)});
const tWhiteShoe=garment(64,32,617,()=>['#f2ece0','leather',.2],{folds:2,grime:0,decor:I=>softRect(I,0,24,64,8,'#c8c0b0',1,1)});
/* Kagami-gumi soldiers: black suits, white shirts, black ties */
const tRencTorso=torsoP('renc',621,(x,y)=>{ if(vNeck(x,y,10,30)) return Math.abs(x-64)<2.5&&y>T3.neck+5?['#121214','cotton',.3]:['#f2f0ea','cotton',.4]; return ['#1a1a1e','wool']; },{decor:I=>{ neckShadow(I); sideSeams(I,T3.neck,256); for(const s of [-1,1]) softLine(I,64+s*10,T3.neck,64+s*3,T3.neck+30,'#2a2a30',.9,1.6); buttons(I,[66],T3.neck+40,T3.belt-4,22,'#0a0a0c'); }});
const tRencArm=armP(623,(x,y)=>y>118?['#f2f0ea','cotton',.2]:['#1a1a1e','wool']);
const tRencLeg=legP(625,()=>['#1a1a1e','wool'],{decor:I=>softLine(I,32,0,32,128,'#2a2a30',.8,1)});
/* Madam Lau: jade high-collar long jacket with gold frogging and cranes */
const JADE='#1f6a5a';
const tLauTorso=torsoP('lau',631,(x,y)=>['#1f6a5a','cotton',.5],{decor:I=>{ neckShadow(I); softRect(I,0,T3.neck,128,9,'#14524a',1,.6); softLine(I,0,T3.neck+9,128,T3.neck+9,'#d4ad5a',.95,1);
  softLine(I,64,T3.neck+9,84,T3.chest-10,'#d4ad5a',.95,1.4); for(let y=T3.neck+16;y<T3.chest;y+=10){ softLine(I,70,y,84,y,'#d4ad5a',.95,1.6); softEll(I,77,y,2,1.4,'#d4ad5a',1,.4); }
  for(const [cx,cy] of [[30,T3.chest+20],[98,T3.chest+40]]){ softEll(I,cx,cy,8,4,'#e8d090',.8,.5); softLine(I,cx+6,cy-2,cx+12,cy-10,'#e8d090',.8,1); softEll(I,cx+13,cy-11,2,1.4,'#c8202a',.9,.4); }
  softLine(I,64,T3.belt-30,64,256,'#14524a',.9,1.6); }});
const tLauArm=armP(633,()=>[JADE,'cotton',.5],{decor:I=>{ softRect(I,0,112,64,4,'#d4ad5a',.95,.6); }});
const tLauLeg=legP(635,(x,y)=>y<70?[JADE,'cotton',.5]:['#141214','cotton',.5],{decor:I=>softLine(I,0,70,64,70,'#d4ad5a',.9,1.2)});
/* Golden Crane triad: black shirts, sleeves rolled, gold chains, tattooed forearms */
const tLaucTorso=torsoP('lauc',641,(x,y)=>{ if(vNeck(x,y,11,24)) return sk('lauc'); return y>T3.belt+2?['#2a2a30','wool',.6]:['#16161a','cotton']; },{decor:I=>{ neckShadow(I); buttons(I,[64],T3.neck+28,T3.belt-4,18,'#2a2a30'); chain(I); beltI(I,'#0a0a0c','#d4ad5a'); }});
const tLaucArm=armP(643,(x,y)=>y<58?['#16161a','cotton']:sk('lauc'),{decor:I=>{ softRect(I,0,54,64,6,'#2a2a30',.95,1); for(let k=0;k<5;k++) softLine(I,6+k*12,64+(k%2)*8,14+k*12,100-(k%3)*6,'#2a4a6a',.6,2.2); softEll(I,32,84,6,5,rgba('#c8202a',1),.5,.4); }});
const tLaucLeg=legP(645,()=>['#2a2a30','wool']);
/* Volkov: fur coat, black roll-neck */
const tFurCoat=(seed,base)=>torsoP('volkov',seed,(x,y)=>{ const open=Math.abs(x-64)<12; if(y<T3.neck+14&&open) return ['#121214','knit',.2]; if(open&&y<T3.belt-10) return ['#121214','knit',.4]; return [base,'wool',.4]; },{folds:10,decor:I=>{ neckShadow(I); const r=rng(seed+1); for(let i=0;i<1400;i++){ const x=r()*128,y=T3.neck+r()*(256-T3.neck); if(Math.abs(x-64)<12&&y<T3.belt-10) continue; softLine(I,x,y,x+(r()-.5)*2,y+3,r()>.5?'#8a6a4a':'#3a2a1a',.35,1); } softRect(I,0,T3.neck,128,16,'#6a4a32',.85,2); }});
const tVolkTorso=tFurCoat(651,'#5a3e28');
const tVolkArm=armP(653,()=>['#5a3e28','wool',.4],{decor:I=>{ const r=rng(654); for(let i=0;i<500;i++){ const x=r()*64,y=r()*128; softLine(I,x,y,x+(r()-.5)*2,y+3,r()>.5?'#8a6a4a':'#3a2a1a',.35,1); } softRect(I,0,108,64,20,'#7a5a3e',.9,2); }});
const tVolkLeg=legP(655,(x,y)=>y<64?['#5a3e28','wool',.4]:['#1a1a1e','wool'],{decor:I=>softLine(I,0,64,64,64,'#3a2a1a',.9,2)});
/* Volkov brotherhood: tracksuits */
const tVolkcTorso=torsoP('volkovc',661,(x,y)=>y>T3.belt+2?['#1d2a5a','poly',.6]:['#1d2a5a','poly'],{decor:I=>{ neckShadow(I); softRect(I,0,T3.neck,128,8,'#f2ece0',.95,.6); softLine(I,64,T3.neck+8,64,T3.belt,'#c8ccd2',.9,1.2); for(const x of [26,30,98,102]) softLine(I,x,T3.neck,x,256,'#f2ece0',.95,1.2); chain(I); }});
const tVolkcArm=armP(663,()=>['#1d2a5a','poly'],{decor:I=>{ for(const x of [44,48,52]) softLine(I,x,0,x,124,'#f2ece0',.95,1.1); }});
const tVolkcLeg=legP(665,()=>['#1d2a5a','poly'],{decor:I=>{ for(const x of [12,16,20,44,48,52]) softLine(I,x,0,x,124,'#f2ece0',.95,1.1); }});
const tTrainer=garment(64,32,667,()=>['#f2f0ea','leather',.2],{folds:2,grime:.08,decor:I=>{ softRect(I,0,24,64,8,'#c8c4bc',1,1); for(const x of [24,30,36]) softLine(I,x,6,x+4,18,'#1d2a5a',.95,1.6); }});
/* Nonna: black dress, lace shawl */
const tNonnaTorso=torsoP('nonna',671,(x,y)=>['#18161a','knit',.6],{decor:I=>{ neckShadow(I); for(let y=T3.neck;y<T3.chest;y+=4) for(let x=(y>>2)%2?0:2;x<128;x+=4) softEll(I,x,y,1,1,'#3a3640',.6,.4); softLine(I,0,T3.chest,128,T3.chest,'#3a3640',.9,1.4); softEll(I,64,T3.neck+18,3,4,'#d4ad5a',.95,.4); }});
const tNonnaArm=armP(673,()=>['#18161a','knit',.6]);
const tNonnaLeg=legP(675,(x,y)=>y<88?['#18161a','knit',.5]:['#3a3036','knit',.2],{decor:I=>softLine(I,0,88,64,88,'#0a080a',.9,1.4)});
/* the Esposito grandsons: tight navy suits, open shirts */
const tNoncTorso=torsoP('nonnac',681,(x,y)=>{ if(vNeck(x,y,12,34)) return Math.abs(x-64)<7?sk('nonnac'):['#f2f0ea','cotton',.4]; return ['#1d2a4a','wool']; },{decor:I=>{ neckShadow(I); sideSeams(I,T3.neck,256); for(const s of [-1,1]) softLine(I,64+s*12,T3.neck,64+s*3,T3.neck+40,'#141e36',.9,1.6); buttons(I,[66],T3.neck+48,T3.belt-4,22,'#0a0e1a'); chain(I); }});
const tNoncArm=armP(683,(x,y)=>y>120?['#f2f0ea','cotton',.2]:['#1d2a4a','wool']);
const tNoncLeg=legP(685,()=>['#1d2a4a','wool']);
/* the Gaffer: amber-and-black hooped club shirt, jeans */
const hoop=(y)=>(Math.floor((y-T3.neck)/14)%2)?'#121214':'#e8a020';
const tGafTorso=torsoP('gaffer',691,(x,y)=>y>T3.belt+2?['#2a3a5a','denim',.7]:[hoop(y),'poly'],{decor:I=>{ neckShadow(I); softRect(I,52,T3.neck,24,6,'#f2ece0',.95,.6); softEll(I,84,T3.sh+24,6,7,'#f2ece0',.95,.4); softEll(I,84,T3.sh+24,4,5,'#e8a020',.95,.4); beltI(I,'#2a1a10','#a8a49c'); }});
const tGafArm=armP(693,(x,y)=>y<44?[(Math.floor(y/14)%2)?'#121214':'#e8a020','poly']:sk('gaffer'),{decor:I=>{ blob(I,32,48,30,3,-.18); softLine(I,22,70,40,90,'#2a4a6a',.6,2); softEll(I,30,96,5,4,'#2a4a6a',.6,.4); }});
const tGafLeg=legP(695,()=>['#2a3a5a','denim'],{decor:I=>{ seam(I,48,0,48,128,'#a8834a'); seam(I,16,0,16,128,'#a8834a'); blob(I,32,40,9,20,.12,'#6a7a9a'); }});
/* the firm: grey hoodies, club scarves */
const tGafcTorso=torsoP('gafferc',701,(x,y)=>y>T3.belt+2?['#3a4a6a','denim',.7]:['#8a8c90','knit',.7],{decor:I=>{ neckShadow(I); softRect(I,50,T3.chest+30,28,26,'#7a7c80',.9,1.2); softLine(I,58,T3.neck,58,T3.chest,'#f2ece0',.9,1); softLine(I,70,T3.neck,70,T3.chest,'#f2ece0',.9,1); }});
const tGafcArm=armP(703,()=>['#8a8c90','knit',.7],{decor:I=>softRect(I,0,114,64,14,'#7a7c80',.9,1)});
const tGafcLeg=legP(705,()=>['#3a4a6a','denim'],{decor:I=>{ seam(I,48,0,48,128,'#a8834a'); blob(I,32,70,8,6,.15,'#6a7a9a'); }});
const tScarfClub=flat(64,16,707,'#e8a020','knit',{decor:I=>{ for(let x=0;x<64;x+=8) softRect(I,x,0,4,16,'#121214',.95,.5); }});
/* the King: white jumpsuit, gold studs, high collar */
const tKingTorso=torsoP('king',711,(x,y)=>{ if(vNeck(x,y,10,46)) return sk('king'); return ['#f6f2ea','poly']; },{decor:I=>{ neckShadow(I); for(const s of [-1,1]) for(let k=0;k<7;k++) softEll(I,64+s*(12-k*1.2),T3.neck+6+k*6,1.6,1.6,'#d4ad5a',1,.4);
  for(const [cx,cy] of [[34,T3.chest+16],[94,T3.chest+16]]) for(let k=0;k<10;k++){ const a=k/10*Math.PI*2; softEll(I,cx+Math.cos(a)*9,cy+Math.sin(a)*9,1.4,1.4,'#d4ad5a',1,.4); }
  softRect(I,0,T3.belt-6,128,12,'#d4ad5a',1,.6); softRect(I,56,T3.belt-8,16,16,'#e8c050',1,.6); for(let x=4;x<128;x+=10) softEll(I,x,T3.belt,1.6,1.6,'#c8202a',1,.4); }});
const tKingArm=armP(713,()=>['#f6f2ea','poly'],{decor:I=>{ for(let y=10;y<120;y+=12) softEll(I,32,y,1.6,1.6,'#d4ad5a',1,.4); softRect(I,0,116,64,12,'#f6f2ea',.9,1); }});
const tKingLeg=legP(715,(x,y)=>['#f6f2ea','poly'],{decor:I=>{ for(const x of [15,49]) for(let y=6;y<128;y+=10) softEll(I,x,y,1.4,1.4,'#d4ad5a',1,.4); softRect(I,0,100,64,28,'#f2ede4',.8,2); }});
const tGoldBoot=garment(64,32,717,()=>['#f6f2ea','leather',.2],{folds:2,grime:0,decor:I=>softRect(I,0,24,64,8,'#d4ad5a',1,1)});
/* the Kings: gold lame jackets */
const tKingcTorso=torsoP('kingc',721,(x,y)=>{ const open=Math.abs(x-64)<12; if(y>T3.belt+2) return ['#141416','denim',.6]; return open?['#141416','cotton',.5]:['#c8a040','poly',.8,1.1]; },{decor:I=>{ neckShadow(I); const r=rng(722); for(let i=0;i<400;i++) softEll(I,r()*128,T3.neck+r()*(T3.belt-T3.neck),.8,.8,'#fff0b0',.6,.4); }});
const tKingcArm=armP(723,()=>['#c8a040','poly',.8,1.1],{decor:I=>{ const r=rng(724); for(let i=0;i<160;i++) softEll(I,r()*64,r()*128,.8,.8,'#fff0b0',.6,.4); }});
const tKingcLeg=legP(725,()=>['#141416','denim']);
/* Tremor: pink-and-lime shirt over a white vest, cargo shorts */
const tTremTorso=torsoP('tremor',731,(x,y)=>{ const open=Math.abs(x-64)<14; if(y>T3.belt+2) return ['#6a6a4a','twill',.6]; return open?['#f2f0ea','knit',.4]:['#ff4fae','cotton']; },{decor:I=>{ neckShadow(I); const r=rng(732); for(let i=0;i<60;i++){ const x=r()*128,y=T3.neck+r()*(T3.belt-T3.neck); if(Math.abs(x-64)<14) continue; softEll(I,x,y,3+r()*3,2+r()*2,'#7cf06a',.85,.4); } chain(I); chain(I,'#e8c050'); }});
const tTremArm=armP(733,(x,y)=>y<40?['#ff4fae','cotton']:sk('tremor'),{decor:I=>{ blob(I,32,44,30,3,-.18); softRect(I,24,106,14,6,'#d4ad5a',.95,.5); }});
const tTremLeg=legP(735,(x,y)=>y<64?['#6a6a4a','twill']:sk('tremor'),{decor:I=>{ softRect(I,4,30,18,16,'#5a5a3e',.8,1); softRect(I,42,30,18,16,'#5a5a3e',.8,1); softLine(I,0,64,64,64,'#4a4a30',.9,1.4); }});
const tHighTop=garment(64,32,737,()=>['#f2f0ea','leather',.2],{folds:2,grime:.06,decor:I=>{ softRect(I,0,24,64,8,'#29e0e6',1,1); softRect(I,20,4,24,6,'#ff4fae',.9,.6); }});
/* Tremor's crew: teal numbered jerseys, orange bandanas */
const tTremcTorso=torsoP('tremorc',741,(x,y)=>{ if(y>T3.belt+2) return ['#141416','poly',.6]; return Math.abs(x-64)>40&&y<T3.chest?sk('tremorc'):['#1aa8a0','poly']; },{decor:I=>{ neckShadow(I); textI(I,'10',56,T3.chest-6,'#f2ece0',3,.95); softLine(I,0,T3.belt-30,128,T3.belt-30,'#f2c230',.8,2); }});
const tTremcArm=armP(743,()=>sk('tremorc'),{decor:I=>{ softRect(I,0,0,64,8,'#1aa8a0',.9,1); blob(I,32,30,24,10,.05); }});
const tTremcLeg=legP(745,(x,y)=>y<58?['#141416','poly']:sk('tremorc'),{decor:I=>{ for(const x of [15,49]) softLine(I,x,0,x,58,'#f2c230',.95,1.2); softLine(I,0,58,64,58,'#0a0a0c',.9,1.4); }});

/* ---------- hats, glasses, hair pieces ---------- */
function crown(J,rings,m,cz=-.008){ return mk(lathe(rings.map(([y,rx,rz])=>[y,rx,rz,cz]),10),m,J.head); }
function shades(J,lens,frame){ for(const s of [-1,1]) mk(box(.056,.03,.012),lens,J.head,s*.032,.126,.094); mk(box(.02,.006,.01),frame,J.head,0,.132,.096); for(const s of [-1,1]) mk(box(.006,.006,.09),frame,J.head,s*.064,.13,.05); }
function bun(J,col,pins){ mk(lathe([[0,.012,.012],[.03,.05,.05],[.07,.052,.052],[.1,.012,.012]],8),M(null,{color:hexInt(col)}),J.head,0,.15,-.085,-1.2); if(pins) for(const s of [-1,1]) mk(box(.006,.006,.14),mGold,J.head,s*.03,.2,-.1,.4,s*.4,0); }
function pompadour(J,col){ mk(lathe([[0,.07,.06],[.04,.08,.075],[.08,.06,.06],[.1,.02,.02]],10),M(null,{color:hexInt(col)}),J.head,0,.205,.025,.55,0,0); }
function ushanka(J){ const fur=M(P2(16,16,(g,w,h)=>{ R(g,'#5a4430',0,0,w,h); const r=rng(9); for(let i=0;i<60;i++) R(g,r()>.5?'#7a5e40':'#3a2a1a',r()*w|0,r()*h|0,1,2); }));
  crown(J,[[.13,.09,.11],[.2,.095,.115],[.27,.09,.11],[.3,.0,.0]],fur); for(const s of [-1,1]) mk(box(.03,.12,.09),fur,J.head,s*.088,.12,-.01); mk(box(.17,.05,.03),fur,J.head,0,.23,.1); }
function flatCap(J,col){ const m=M(null,{color:hexInt(col)}); crown(J,[[.18,.088,.108],[.22,.095,.115],[.25,.07,.09],[.26,0,0]],m,.0); mk(box(.15,.012,.08),m,J.head,0,.2,.1,.2); }
function backCap(J,col,brim){ const m=M(null,{color:hexInt(col)}); crown(J,[[.17,.086,.106],[.24,.088,.106],[.27,.06,.08],[.28,0,0]],m); mk(box(.14,.012,.08),M(null,{color:hexInt(brim)}),J.head,0,.18,-.12,-.25); }
function headphones(J){ mk(torus(.085,.012,4,14),M(null,{color:0x1a1a1e}),J.neck,0,.04,.0,Math.PI/2); for(const s of [-1,1]) mk(cyl(.035,.035,.03,10),M(null,{color:0x29e0e6}),J.neck,s*.085,.04,.03,0,0,Math.PI/2); }
function bandana(J,col){ const m=M(P2(16,16,(g,w,h)=>{ R(g,col,0,0,w,h); for(let y=2;y<h;y+=5) for(let x=(y%2)*2;x<w;x+=5){ ell(g,x+1,y,1.4,1,'#f2ece0'); R(g,'#2a1a10',x+1,y,1,1); } },6,7));
  mk(lathe([[.012,.06,.074,.026],[.05,.07,.088,.016],[.098,.077,.098,.006]],12,{capB:false,capT:false}),m,J.head); mk(box(.11,.06,.012,{at:[0,-.03,0]}),m,J.head,0,.02,.1,.25); }
function wheelchair(parent){ const n=N(parent,0,0,0,0,-Math.PI/2,0), steel=M(null,{color:0x9aa0a6}), black=M(null,{color:0x18181a}), seat=M(null,{color:0x2a1a3a});
  for(const s of [-1,1]){ mk(torus(.3,.02,4,18),black,n,-.05,.3,s*.3,0,0,0); mk(cyl(.07,.07,.03,8),black,n,.35,.07,s*.24,Math.PI/2); mk(box(.5,.03,.03),steel,n,.1,.42,s*.24); mk(box(.03,.6,.03),steel,n,-.2,.72,s*.24,0,0,-.1); }
  mk(box(.46,.05,.46),seat,n,.05,.46,0); mk(box(.05,.42,.44),seat,n,-.2,.72,0,0,0,-.1); return n; }

/* ---------- the roster ---------- */
const FEM={hf:.95,w:.88,depth:.92,lg:.86,ag:.84,belly:.95,shoeW:.085};
const ONE_HAND={armR:[-2.0,0,.25],elbowR:[-1.1,0,0],armL:[-.7,0,-.35],elbowL:[-.9,0,0],spine:[.15,-.25,0],head:[0,.25,0],thighL:[-.25,0,.06],kneeL:[.3,0,0],thighR:[.15,0,-.05],kneeR:[.1,0,0]};
const AIM_ONE={spine:[.1,0,0],neck:[-.06,0,0],armR:[-1.42,0,.05],elbowR:[-.05,0,0],armL:[.05,0,.12],elbowL:[-.25,0,0],head:[-.02,0,0],thighL:[-.12,0,.05],thighR:[.06,0,-.04]};
const AIM_TWO={spine:[.06,0,0],armR:[-1.45,0,.12],elbowR:[-.05,0,0],armL:[-1.45,0,-.12],elbowL:[-.05,0,0],head:[-.02,0,0],thighL:[-.22,0,.12],kneeL:[.2,0,0],thighR:[.1,0,-.12],kneeR:[.15,0,0]};
const GUARD={spine:[.06,.3,0],head:[.1,-.3,0],armL:[-.95,0,-.22],elbowL:[-1.95,0,0],armR:[-.85,0,.25],elbowR:[-2.0,0,0],thighL:[-.18,0,.06],kneeL:[.28,0,0],thighR:[.16,0,-.05],kneeR:[.18,0,0],ankleL:[-.1,0,0]};
const PISTOL={prop:pPistol,support:true,gripHand:true,wFight:{p:[.036,-.139,.035],r:[Math.PI/2,0,0]}};
const BLADE=(p)=>({prop:p,gripHand:true,wFight:{p:[0,-.075,0],r:[1.57,0,0]},fight:ONE_HAND});
const TWO=(p,gun)=>({prop:p,twoHand:true,gripHand:true,gun,wFight:{p:[0,0,0],r:[0,0,0]},fight:TWO_HAND_ARMS,two:true});
const ROSTER={
  nico:Object.assign({name:'Nico Varga',role:'You · "the Tourist"',stop:'Walks onto platform 0 in Tokyo',color:'#3fae9a',note:'A hitman on his first holiday in eleven years. Somebody put a price on his head the day he boarded, and every crew on the route wants it. He brought a pistol in his golf bag, just in case.',
    o:{hf:1.0,w:1.02,depth:1.0,lg:1.02,ag:1.04,jacket:.004,pants:.008},torso:tNicoTorso,arm:tNicoArm,leg:tNicoLeg,foot:tLoafer,
    extra:J=>shades(J,M(null,{color:0x1a2a3a,emissive:0x0a1a2a}),M(null,{color:0xd4ad5a}))},PISTOL,{fight:null}),
  ren:Object.assign({name:'Ren Kagami',role:'Boss · Kagami-gumi',stop:'Boards in Tokyo, at the end of the line',color:'#ff4fae',crew:'renc',note:'The yakuza boss\'s spoiled son, in a white suit he will not let you bleed on. Short sword in one hand. When he is losing he starts offering money.',
    o:{hf:.99,w:.96,depth:.96,lg:.96,ag:.96,jacket:.01,pants:.008},torso:tRenTorso,arm:tRenArm,leg:tRenLeg,foot:tWhiteShoe},BLADE(pWaki)),
  renc:Object.assign({name:'Kagami-gumi',role:'Crew · Tokyo',stop:'Boards in Tokyo, at the end of the line',color:'#2a2a34',note:'Black suits, white shirts, black ties, dark glasses. They fight in disciplined pairs and never run.',
    o:{hf:1.0,w:1.02,depth:1.0,lg:1.0,ag:1.02,jacket:.008,pants:.008},torso:tRencTorso,arm:tRencArm,leg:tRencLeg,foot:tShoeBlack,extra:J=>shades(J,M(null,{color:0x0a0a0c}),M(null,{color:0x0a0a0c}))},PISTOL),
  lau:Object.assign({name:'Madam Lau',role:'Boss · Golden Crane triad',stop:'Boards in Hong Kong',color:'#1f6a5a',crew:'lauc',note:'Runs the dim sum car like she runs the harbour. Jade silk, gold cranes, hair pinned with gold, and a cleaver she throws better than you shoot.',
    o:Object.assign({jacket:.014,pants:.012},FEM,{hf:.93}),torso:tLauTorso,arm:tLauArm,leg:tLauLeg,foot:tShoeBlack,extra:(J,o)=>{ collar(J,o,M(flat(64,16,636,'#14524a','cotton'),{double:true}),.06,.012); bun(J,'#0e0c10',true); }},BLADE(pCleaver)),
  lauc:Object.assign({name:'Golden Crane',role:'Crew · Hong Kong',stop:'Boards in Hong Kong',color:'#c8302a',note:'Black shirts, rolled sleeves, tattooed forearms, gold chains. Cleavers from the kitchen. They come at you all at once.',
    o:{hf:.98,w:.96,depth:.96,lg:.95,ag:.98,jacket:.006,pants:.008},torso:tLaucTorso,arm:tLaucArm,leg:tLaucLeg,foot:tShoeBlack},BLADE(pCleaver)),
  volkov:Object.assign({name:'Grigor "The Stove" Volkov',role:'Boss · Volkov brotherhood',stop:'Boards in Siberia',color:'#5aa8d8',crew:'volkovc',note:'Two metres of fur coat and beard. Takes his shotgun into the sauna. He does not feel pain and does not beg, so he keeps coming after he loses things.',
    o:{hf:1.08,w:1.24,depth:1.18,belly:1.14,lg:1.2,ag:1.24,jacket:.03,pants:.016,headS:1.05,shoeW:.11},torso:tVolkTorso,arm:tVolkArm,leg:tVolkLeg,foot:tBlackBoot,extra:J=>ushanka(J)},TWO(pShotgun,'shotgun')),
  volkovc:Object.assign({name:'The Brotherhood',role:'Crew · Siberia',stop:'Boards in Siberia',color:'#1d2a5a',note:'Tracksuits, flat caps, gold teeth. They drink at the ice bar between fights and carry pistols in the sauna.',
    o:{hf:1.0,w:1.04,depth:1.02,lg:1.02,ag:1.04,jacket:.01,pants:.012},torso:tVolkcTorso,arm:tVolkcArm,leg:tVolkcLeg,foot:tTrainer,extra:J=>flatCap(J,'#3a3a40')},PISTOL),
  nonna:{name:'Nonna Assunta Esposito',role:'Boss · the Esposito family',stop:'Boards in Naples',color:'#f2d27a',crew:'nonnac',note:'Ninety-one, in a wheelchair, in black. Eats lunch in the trattoria every day with a sawn-off shotgun across her knees, and taunts you the whole fight. You can let her go.',
    o:Object.assign({jacket:.014,pants:.016,belly:1.06},FEM,{hf:.88}),torso:tNonnaTorso,arm:tNonnaArm,leg:tNonnaLeg,foot:tShoeBlack,seated:true,extra:(J,o)=>{ collar(J,o,M(flat(64,16,676,'#2a2630','knit'),{double:true}),.04,.01); bun(J,'#ece8e2'); },fight:{}},
  nonnac:Object.assign({name:'The grandsons',role:'Crew · Naples',stop:'Boards in Naples',color:'#1d2a4a',note:'Tight navy suits, open collars, gold chains, slicked hair. They will die for Nonna, and she will tell them so.',
    o:{hf:.99,w:.98,depth:.96,lg:.96,ag:.98,jacket:.008,pants:.008},torso:tNoncTorso,arm:tNoncArm,leg:tNoncLeg,foot:tShoeBlack},PISTOL),
  gaffer:{name:'Terry "The Gaffer" Moss',role:'Boss · the Southside firm',stop:'Boards in London',color:'#e8a020',crew:'gafferc',note:'Top boy of the firm, in the club shirt he has worn to every match since 1998. No gun, no knife: it is fists only with the Gaffer, in the pub, with the match on.',
    o:{hf:1.0,w:1.08,depth:1.06,belly:1.08,lg:1.04,ag:1.1,jacket:.004,pants:.012},torso:tGafTorso,arm:tGafArm,leg:tGafLeg,foot:tTrainer,gripHand:true,fight:GUARD},
  gafferc:Object.assign({name:'The firm',role:'Crew · London',stop:'Boards in London',color:'#8a8c90',note:'Grey hoodies, club scarves, bottles from the bar. Pure brawlers. The best leg of the trip for fists.',
    o:{hf:.98,w:.98,depth:.98,lg:.96,ag:.98,jacket:.012,pants:.012},torso:tGafcTorso,arm:tGafcArm,leg:tGafcLeg,foot:tTrainer,extra:(J,o)=>collar(J,o,M(tScarfClub,{double:true}),.07,.02)},BLADE(pBottle)),
  king:{name:'"The King"',role:'Boss · the Kings',stop:'Boards in Las Vegas',color:'#f5c542',crew:'kingc',note:'Leader of a hit squad of Elvis impersonators. White jumpsuit, gold studs, gold glasses, a gold revolver in each hand. Fights on the casino stage, built for bullet time.',
    o:{hf:1.0,w:1.02,depth:1.02,belly:1.06,lg:1.02,ag:1.02,jacket:.008,pants:.016},torso:tKingTorso,arm:tKingArm,leg:tKingLeg,foot:tGoldBoot,prop:pRevGold,gripHand:true,wFight:{p:[.036,-.089,.035],r:[Math.PI/2,0,0]},fight:AIM_TWO,
    extra:(J,o)=>{ pompadour(J,'#08080a'); shades(J,M(null,{color:0x3a2a10,emissive:0x2a1a06}),mGold); collar(J,o,M(flat(64,16,716,'#f6f2ea','poly'),{double:true}),.09,.03); const l=N(J.handL,-.036,-.089,.035,Math.PI/2,0,0); pRevGold(l); J.leftGun=l; }},
  kingc:Object.assign({name:'The Kings',role:'Crew · Las Vegas',stop:'Boards in Las Vegas',color:'#c8a040',note:'Younger, thinner impersonators in gold lame jackets and black jeans, quiffs held up with half a tin of pomade each.',
    o:{hf:.99,w:.96,depth:.96,lg:.96,ag:.96,jacket:.008,pants:.008},torso:tKingcTorso,arm:tKingcArm,leg:tKingcLeg,foot:tShoeBlack,extra:J=>pompadour(J,'#0a0a0c')},PISTOL),
  tremor:Object.assign({name:'DJ Tremor',role:'Boss · Tremor\'s crew',stop:'Boards in Rio',color:'#ff4fae',crew:'tremorc',note:'Takes over the pool deck with a sound system and never turns it off. His crew moves to the beat, and so does the fight, on the roofs of the cars.',
    o:{hf:1.0,w:1.0,depth:1.0,lg:1.0,ag:1.0,jacket:.008,pants:.012},torso:tTremTorso,arm:tTremArm,leg:tTremLeg,foot:tHighTop,extra:J=>{ backCap(J,'#7cf06a','#ff4fae'); headphones(J); }},TWO(pSMG,'smg')),
  tremorc:Object.assign({name:'Tremor\'s crew',role:'Crew · Rio',stop:'Boards in Rio',color:'#1aa8a0',note:'Teal numbered jerseys, orange bandanas over their faces, fast on their feet and happy on the roofs.',
    o:{hf:.99,w:.98,depth:.98,lg:1.0,ag:.98,jacket:.006,pants:.01},torso:tTremcTorso,arm:tTremcArm,leg:tTremcLeg,foot:tHighTop,extra:J=>bandana(J,'#f28a3a')},PISTOL)
};
const BOSSES=['ren','lau','volkov','nonna','gaffer','king','tremor'];
function makeChar(id,parent,grp){
  const R_=ROSTER[id], k=id;
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
