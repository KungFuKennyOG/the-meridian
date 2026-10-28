/* =====================================================================================================
   TWO MORE CREWS for the two new cars.
   Tanaka & Associates: hitmen dressed as salarymen, the first to try for the bounty, in the izakaya car
   leaving Tokyo by day. Fists, bottles, loosened ties. Section Chief Tanaka runs them like a sales team.
   The sushi chefs: Kagami-gumi sleepers who have ridden the whole loop behind the counter of the sushi
   bar, waiting for the Pacific tunnel. White coats, headbands, long yanagiba knives.
   ===================================================================================================== */
Object.assign(HEADS,{
  tanaka:{seed:581,skin:'#dcb894',skinD:'#ae8a6c',hair:'slick',hairC:'#2a2624',hairFront:12,sideburn:40,brow:'#2a2624',browT:2,iris:'#2a1a12',lip:'#9a6050',age:true,glasses:'#1a1a1a'},
  tanakac:{seed:582,skin:'#d8b490',skinD:'#a88668',hair:'crop',hairC:'#16120f',hairFront:15,sideburn:40,behind:50,nape:56,brow:'#16120f',browT:2,iris:'#2a1a12',lip:'#9a5c4c'},
  chefc:{seed:583,skin:'#d0a884',skinD:'#a07e60',hair:'buzz',hairC:'#121010',hairFront:15,brow:'#121010',browT:2,iris:'#22160e',lip:'#8e5242',scar:true}
});
for(const k of ['tanaka','tanakac','chefc']) FACE[k]=lazyFace(k);
/* salarymen: charcoal suits, white shirts, ties pulled loose after a long day */
const tTanakaTorso=torsoL('tanaka',641,(x,y)=>{ if(vNeck(x,y,11,44)) return ['#f2f0ea','cotton',.4]; return ['#2e3034','wool']; },{decor:I=>{ neckShadow(I);
  suitI(I,{drop:44,w0:11,lapel:'#34363c',hi:'#7a7e88',sheen:'#5a5e68',shirt:'#f2f0ea',tie:'#5a1a22',stripe:'#8a3a42',cw:7,cd:8,btn:'#141416',btnY:[T3.neck+56,T3.neck+78],square:'#f2f0ea',form:1.1});
  for(let x=4;x<128;x+=6) if(Math.abs(x-64)>14) softLine(I,x,T3.neck+10,x,232,'#4a4e56',.18,.5); }}); /* a faint chalk stripe */
const tTanakaArm=suitArm(643,'#2e3034','#f2f0ea',{sheen:'#5a5e68',hi:'#7a7e88',decor:I=>{ softRect(I,40,119,14,6,'#000000',.3,1); softRect(I,40,118,14,5,'#d4ad5a',.97,.5); softLine(I,40,118.4,54,118.4,'#fff4c8',.8,.5); softEll(I,47,120.5,2.6,2,'#e8e0c8',1,.4); }});
const tTanakaLeg=suitLeg(645,'#2e3034',{sheen:'#5a5e68',hi:'#7a7e88'});
const tSalaryTorso=torsoL('tanakac',651,(x,y)=>{ if(vNeck(x,y,14,52)) return ['#eef0f2','cotton',.5]; return ['#3a3e48','wool']; },{decor:I=>{ neckShadow(I);
  suitI(I,{drop:52,w0:14,lapel:'#424652',hi:'#8a90a0',sheen:'#646a7a',shirt:'#eef0f2',open:true,tie:'#1e3a6a',stripe:'#c8b060',knot:9,skew:4,cw:9,cd:9,btn:'#16181c',btnY:[T3.neck+62],form:1.1,fold:1.3});
  softEll(I,64,T3.neck+5,1.6,1.6,'#d8dce0',.9,.4); blob(I,90,T3.chest+10,10,8,-.1); clFold(I,58,T3.neck+20,62,T3.neck+30,60,T3.neck+44,1.4,.3); }}); /* top button undone, the knot hanging */
const tSalaryArm=suitArm(653,'#3a3e48','#eef0f2',{sheen:'#646a7a',hi:'#8a90a0',cuffY:116});
const tSalaryLeg=suitLeg(655,'#3a3e48',{sheen:'#646a7a',hi:'#8a90a0'});
/* sushi chefs: white wrap coats, indigo aprons with white ties, wooden geta */
const tChefTorso=torsoL('chefc',661,(x,y)=>{ if(vNeck(x,y,10,26)) return sk('chefc'); return y>T3.chest+16?['#1e3a6a','cotton',.4]:['#f4f2ec','cotton',.5]; },{decor:I=>{ neckShadow(I); vEdge(I,10,26,'#f4f2ec'); torsoForm(I,1.3); torsoFolds(I,1.2);
  softLine(I,55,T3.neck+1,87,T3.chest+12,'#000000',.32,1.8); softLine(I,54,T3.neck,86,T3.chest+12,'#ffffff',.5,.8); stitchI(I,56,T3.neck+3,87,T3.chest+10,'#c8c4b8',.4);
  for(const s of [-1,1]){ softLine(I,64+s*10,T3.neck,64+s*4,T3.neck+20,'#000000',.2,1.4); }
  softRect(I,0,T3.chest+12,128,3,'#000000',.35,1.5); softRect(I,0,T3.chest+14,128,5,'#16305a',.95,.5); softLine(I,0,T3.chest+14.2,128,T3.chest+14.2,'#4a6aa0',.5,.6);
  for(let y=T3.chest+22;y<256;y+=1.4) softLine(I,0,y,128,y,'#000000',.05,.5); for(const x of [20,44,84,108]) clFold(I,x,T3.chest+24,x+2,T3.belt,x-1,256,1.6,.3,1.1);
  for(const s of [-1,1]){ softLine(I,64+s*40,T3.belt-4,64+s*58,T3.belt-2,'#f4f2ec',.95,1.4); } softRect(I,0,T3.belt-5,128,3,'#f4f2ec',.95,.5); softLine(I,0,T3.belt-2,128,T3.belt-2,'#000000',.3,.8);
  softEll(I,4,T3.belt-3,4,3,'#f4f2ec',.95,.5); softLine(I,2,T3.belt,0,T3.belt+28,'#f4f2ec',.95,1.4); softLine(I,6,T3.belt,8,T3.belt+24,'#f4f2ec',.95,1.4); /* the bow at the back */
  softEll(I,64,T3.chest+42,10,10,'#f4f2ec',.85,.6); softEll(I,64,T3.chest+42,7.6,7.6,'#1e3a6a',1,.6); for(let k=0;k<3;k++) curvePaint(I,57,T3.chest+38+k*4,64,T3.chest+35+k*4,71,T3.chest+38+k*4,1,.85,'#f4f2ec'); /* a wave crest dyed into the apron */ }});
const tChefArm=armL(663,(x,y)=>y>96?sk('chefc'):['#f4f2ec','cotton',.5],{decor:I=>{ blob(I,32,8,22,8,.12); clFold(I,16,30,30,36,46,30,1.8,.3); clFold(I,18,60,30,66,44,61,1.8,.3); clFold(I,20,74,32,80,42,75,1.4,.25);
  softRect(I,0,88,64,8,'#e8e4da',.95,.6); for(const y of [89,92.5,95.5]) softLine(I,0,y,64,y,'#000000',.22,.8); blob(I,32,98,30,3,-.25); blob(I,32,110,10,5,.06); }});
const tChefLeg=legL(665,(x,y)=>y<72?['#1e3a6a','cotton',.4]:['#2a2a2e','cotton',.4],{decor:I=>{ for(const x of [8,24,40,56]) clFold(I,x,0,x+2,36,x-1,70,1.5,.3,1.1); softLine(I,0,70,64,70,'#ffffff',.25,.8); softLine(I,0,71.5,64,71.5,'#000000',.4,1.4); legForm(I,.8,'#5a5a64',124); }});
const tGeta=shoeL(667,'#a87a4a',{zone:(x,y)=>y<14?['#2a2a2e','cotton',.3]:null,sole:'#5a3a1e',shine:.2,stitch:false,vamp:false,decor:I=>{ for(let y=15;y<23;y+=1.6) softLine(I,0,y,64,y+.6,'#6a4a2a',.25,.5); softLine(I,22,4,32,12,'#141416',.95,1.6); softLine(I,42,4,32,12,'#141416',.95,1.6); softEll(I,32,12,1.6,1.4,'#c8202a',.9,.4); }});
function hachimaki(J){ const m=M(P2(32,8,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f8f6f0'],[1,'#dcd8ce']]); ell(g,16,4,2.6,2.6,'#c8202a'); })); mk(torus(.098,.014,4,16),m,J.head,0,.15,.005,Math.PI/2,0,0); }
function yanagiba(par){ return pYanagibaP(N(par)); }
Object.assign(ROSTER,{
  tanaka:Object.assign({name:'Section Chief Tanaka',role:'Boss · Tanaka & Associates',stop:'Boards in Tokyo, the first stop',color:'#5a1a22',crew:'tanakac',note:'Runs a team of contract killers like a sales department, and the bounty is this quarter\'s target. Grey at the temples, glasses, a gold watch, and he fights with his fists like it is a team-building exercise.',
    o:{hf:.98,w:1.04,depth:1.04,belly:1.08,lg:.98,ag:1.02,jacket:.01,pants:.01},torso:tTanakaTorso,arm:tTanakaArm,leg:tTanakaLeg,foot:tOxford,gripHand:true,fight:GUARD}),
  tanakac:Object.assign({name:'Tanaka & Associates',role:'Crew · Tokyo',stop:'Boards in Tokyo, the first stop',color:'#3a3e48',note:'Hitmen dressed as salarymen after a long night out: loose ties, rolled sleeves, beer bottles. Fists and glass. The fight that makes it personal.',
    o:{hf:.99,w:.98,depth:.98,lg:.98,ag:.98,jacket:.008,pants:.008},torso:tSalaryTorso,arm:tSalaryArm,leg:tSalaryLeg,foot:tOxford,gripHand:true,fight:GUARD}),
  tanakab:null,
  chefc:Object.assign({name:'The sushi chefs',role:'Crew · Kagami-gumi sleepers',stop:'Have been aboard since Tokyo',color:'#f4f2ec',note:'Kagami-gumi who have worked the sushi counter for the whole loop, waiting for the Pacific tunnel. White coats, headbands, a long knife each.',
    o:{hf:.99,w:1.0,depth:1.0,lg:.98,ag:1.02,jacket:.006,pants:.008},torso:tChefTorso,arm:tChefArm,leg:tChefLeg,foot:tGeta,extra:J=>hachimaki(J)},BLADE(yanagiba))
});
ROSTER.tanakab=Object.assign({},ROSTER.tanakac,BLADE(pBottle));
FACE.tanakab=FACE.tanakac; HEADS.tanakab=HEADS.tanakac;
