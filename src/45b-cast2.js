/* =====================================================================================================
   TWO MORE CREWS for the two new cars.
   Tanaka & Associates: hitmen dressed as salarymen, the first to try for the bounty, in the izakaya car
   leaving Tokyo by day. Fists, bottles, loosened ties. Section Chief Tanaka runs them like a sales team.
   The sushi chefs: Kagami-gumi sleepers who have ridden the whole loop behind the counter of the sushi
   bar, waiting for the Pacific tunnel. White coats, headbands, long yanagiba knives.
   ===================================================================================================== */
Object.assign(HEADS,{
  tanaka:{seed:581,skin:'#dcb894',skinD:'#ae8a6c',hair:'slick',hairC:'#2a2624',hairFront:12,sideburn:40,brow:'#2a2624',browT:2,iris:'#2a1a12',lip:'#9a6050',age:true,glasses:'#1a1a1a'},
  tanakac:{seed:582,skin:'#d8b490',skinD:'#a88668',hair:'fringe',hairC:'#16120f',hairFront:16,brow:'#16120f',browT:2,iris:'#2a1a12',lip:'#9a5c4c'},
  chefc:{seed:583,skin:'#d0a884',skinD:'#a07e60',hair:'buzz',hairC:'#121010',hairFront:15,brow:'#121010',browT:2,iris:'#22160e',lip:'#8e5242',scar:true}
});
for(const k of ['tanaka','tanakac','chefc']) FACE[k]=lazyFace(k);
/* salarymen: charcoal suits, white shirts, ties pulled loose after a long day */
const tTanakaTorso=torsoP('tanaka',641,(x,y)=>{ if(vNeck(x,y,11,44)) return Math.abs(x-64)<3&&y>T3.neck+4?['#5a1a22','poly',.3]:['#f2f0ea','cotton',.4]; return ['#2e3034','wool']; },{decor:I=>{ neckShadow(I); sideSeams(I,T3.neck,256);
  for(const s of [-1,1]) softLine(I,64+s*11,T3.neck,64+s*3,T3.neck+44,'#3e4046',.95,1.8); buttons(I,[66],T3.neck+56,T3.belt-4,22,'#141416'); softRect(I,84,T3.chest-6,14,3,'#f2f0ea',.9,.5); softLine(I,32,T3.chest+30,52,T3.chest+30,'#24262a',.6,1); }});
const tTanakaArm=armP(643,(x,y)=>y>118?['#f2f0ea','cotton',.2]:['#2e3034','wool'],{decor:I=>softRect(I,40,110,14,6,'#d4ad5a',.9,.5)});
const tTanakaLeg=legP(645,()=>['#2e3034','wool'],{decor:I=>softLine(I,32,0,32,128,'#3e4046',.8,1)});
const tSalaryTorso=torsoP('tanakac',651,(x,y)=>{ const tie=Math.abs(x-64-(y-T3.neck)*.08)<3.2&&y>T3.neck+8&&y<T3.chest+20; if(vNeck(x,y,14,52)) return tie?['#1e3a6a','poly',.3]:['#eef0f2','cotton',.4]; return ['#3a3e48','wool']; },{decor:I=>{ neckShadow(I); sideSeams(I,T3.neck,256);
  for(const s of [-1,1]) softLine(I,64+s*14,T3.neck,64+s*4,T3.neck+52,'#4a4e58',.95,1.8); softRect(I,58,T3.neck+2,12,6,'#eef0f2',.9,.6); buttons(I,[66],T3.neck+60,T3.belt-4,22,'#16181c'); blob(I,90,T3.chest+10,10,8,-.1); softRect(I,24,T3.chest+30,10,2,'#2a2e36',.8,.5); }});
const tSalaryArm=armP(653,(x,y)=>y>116?['#eef0f2','cotton',.2]:['#3a3e48','wool']);
const tSalaryLeg=legP(655,()=>['#3a3e48','wool'],{decor:I=>softLine(I,32,0,32,128,'#4a4e58',.8,1)});
/* sushi chefs: white coats, blue aprons, wooden geta clogs */
const tChefTorso=torsoP('chefc',661,(x,y)=>{ if(vNeck(x,y,10,26)) return sk('chefc'); return y>T3.chest+16?['#1e3a6a','cotton',.4]:['#f4f2ec','cotton',.5]; },{decor:I=>{ neckShadow(I); sideSeams(I,T3.neck,256);
  softLine(I,54,T3.neck,86,T3.chest+12,'#d8d4c8',.95,1.6); softRect(I,0,T3.chest+14,128,4,'#16305a',.9,.6); for(let x=10;x<128;x+=24) softRect(I,x,T3.chest+30,6,1,'#2a4a7a',.6,.4); }});
const tChefArm=armP(663,(x,y)=>y>96?sk('chefc'):['#f4f2ec','cotton',.5],{decor:I=>softRect(I,0,92,64,6,'#e4e0d6',.9,.6)});
const tChefLeg=legP(665,(x,y)=>y<72?['#1e3a6a','cotton',.4]:['#2a2a2e','cotton',.4]);
const tGeta=garment(64,32,667,(x,y)=>y<14?['#2a2a2e','cotton',.3]:['#a87a4a','leather',.2],{folds:2,grime:0,decor:I=>softRect(I,0,26,64,6,'#6a4a2a',1,1)});
function hachimaki(J){ const m=M(P2(32,8,(g,w,h)=>{ vfill(g,0,0,w,h,[[0,'#f8f6f0'],[1,'#dcd8ce']]); ell(g,16,4,2.6,2.6,'#c8202a'); })); mk(torus(.098,.014,4,16),m,J.head,0,.15,.005,Math.PI/2,0,0); }
function yanagiba(par){ const n=N(par); mk(box(.022,.11,.03),M(null,{color:0x3a2a1a}),n,0,0,0); mk(box(.006,.3,.032,{at:[0,.2,0]}),M(null,{color:0xd8dce0}),n,0,0,0); return n; }
Object.assign(ROSTER,{
  tanaka:Object.assign({name:'Section Chief Tanaka',role:'Boss · Tanaka & Associates',stop:'Boards in Tokyo, the first stop',color:'#5a1a22',crew:'tanakac',note:'Runs a team of contract killers like a sales department, and the bounty is this quarter\'s target. Grey at the temples, glasses, a gold watch, and he fights with his fists like it is a team-building exercise.',
    o:{hf:.98,w:1.04,depth:1.04,belly:1.08,lg:.98,ag:1.02,jacket:.01,pants:.01},torso:tTanakaTorso,arm:tTanakaArm,leg:tTanakaLeg,foot:tShoeBlack,gripHand:true,fight:GUARD}),
  tanakac:Object.assign({name:'Tanaka & Associates',role:'Crew · Tokyo',stop:'Boards in Tokyo, the first stop',color:'#3a3e48',note:'Hitmen dressed as salarymen after a long night out: loose ties, rolled sleeves, beer bottles. Fists and glass. The fight that makes it personal.',
    o:{hf:.99,w:.98,depth:.98,lg:.98,ag:.98,jacket:.008,pants:.008},torso:tSalaryTorso,arm:tSalaryArm,leg:tSalaryLeg,foot:tShoeBlack,gripHand:true,fight:GUARD}),
  tanakab:null,
  chefc:Object.assign({name:'The sushi chefs',role:'Crew · Kagami-gumi sleepers',stop:'Have been aboard since Tokyo',color:'#f4f2ec',note:'Kagami-gumi who have worked the sushi counter for the whole loop, waiting for the Pacific tunnel. White coats, headbands, a long knife each.',
    o:{hf:.99,w:1.0,depth:1.0,lg:.98,ag:1.02,jacket:.006,pants:.008},torso:tChefTorso,arm:tChefArm,leg:tChefLeg,foot:tGeta,extra:J=>hachimaki(J)},BLADE(yanagiba))
});
ROSTER.tanakab=Object.assign({},ROSTER.tanakac,BLADE(pBottle));
FACE.tanakab=FACE.tanakac; HEADS.tanakab=HEADS.tanakac;
