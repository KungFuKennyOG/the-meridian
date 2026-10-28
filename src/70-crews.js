/* =====================================================================
   THE CREWS: who boards where, how each one fights, what they sound like and everything they say.
   The look comes from the art set (makeChar); the fighting comes from the shared bodies and AI, by kind:
   gunman (pistol), cutter (blade), corner (bottle), doorman (shotgun), enforcer (SMG), landlord (revolver),
   brawler (fists, the Gaffer) and seated (Nonna, who only talks).
   Lines: alert, leg, torso, arm, neck, stab, beg, crawl, dying, friend(name), call(name), plus idle chatter
   you overhear before they know you are there, personal pleas, and boss taunts.
   ===================================================================== */
KSTAT.brawler={melee:15,run:2.9}; KSTAT.seated={};
const NECK=['*choking*','*gurgling*','—hhk— hhk—','*coughs blood*'];
const crewLines=o=>Object.assign({neck:NECK},o);
const CREWS={
  kings:{label:'The Kings',voice:{f0:112,rasp:.25,breath:.35},
    names:['Vernon','Tupelo Tom','Lucky','Memphis Mike','Little Earl','Sonny','Hound Dog Hank','Rocky','Tex','Junior','Gold Lamé Gary','Big Ray'],
    lines:crewLines({
      alert:['There he is, baby!','It\'s the Tourist! Take care of business!','Thank you, thank you very much. Now hold still.','Hey, hey! Showtime, boys!','Ladies and gentlemen... the bounty!'],
      leg:['My leg! My dancin\' leg!','Oh, Lord, my knee—','I can\'t stand up, man!'],
      torso:['I\'m shot! I\'m all shook up!','Not the jumpsuit— not the jumpsuit—','Aw, that ain\'t right—'],
      arm:['My arm! My guitar arm!','Can\'t feel my fingers, baby—'],
      stab:['Get it out— get it outta me!','Oh, Lord— oh, Lord—','Hnnh— that burns—'],
      beg:['Please, man. I just do weddings.','I quit! I quit the Kings!','Have mercy. Please. Have mercy.','I got a residency in Reno, man, please—','Don\'t. I\'m begging you, son.'],
      crawl:['Somebody... call an ambulance... please...','Stay away from me, man—','I gotta get backstage—'],
      dying:['...the building...','...Mama...','...it\'s gettin\' dark in here...','...one more song...'],
      friend:n=>[`${n}! No!`,`${n}! Get up, baby!`,`You killed ${n}! He had a show tonight!`],
      call:n=>[`${n}! ${n}, help me!`,`${n}... don\'t leave me here...`],
      idle:['Seventies Elvis is the real Elvis and you know it.','Who took my comb? Who took my comb?','The King says nobody touches the bounty but him.','I\'m telling you, the sideburns are glued. They\'re glued.','Twenty grand each. Twenty. Grand.','You think the Tourist sings?'],
      pleas:['I got two kids in Henderson—','I only joined for the jumpsuit—','I sing at my mama\'s church on Sundays—','I was gonna open a chapel, man—','I can\'t even shoot straight, look at me—']}),
    boss:{taunt:['You came to the wrong show, son.','Thank you. Thank you very much.','Uh-huh-huh. Is that all you got?','This is my stage, Tourist.','The King don\'t die on a train!','Somebody get this man a spotlight.'],
      beg:['Okay... okay. The money\'s yours. All of it.','Please... not like this... not on a Tuesday...','Elvis has... left the building...']} },
  tremor:{label:'Tremor\'s crew',voice:{f0:124,rasp:.15,breath:.45},
    names:['Biscoito','Neguinho','Pardal','Caveira','Juninho','Magrelo','Tatu','Dentinho','Bombom','Peixe'],
    lines:crewLines({
      alert:['Olha ele aí! It\'s him!','Vai, vai, vai! Get him!','Tremor! The gringo\'s here!','Turn it up and kill him!','Ê, Tourist! Dance with us!'],
      leg:['Minha perna! My leg!','Ai— I can\'t run— I can\'t run!','Porra— my knee—'],
      torso:['I\'m hit, porra, I\'m hit!','Ai, meu Deus—','Calma! Calma!'],
      arm:['My arm! Ai, ai—','Can\'t hold it— can\'t hold the gun—'],
      stab:['Tira isso! Get it out!','Ai— ai— ai—','No, no, no, no—'],
      beg:['Por favor, man. Por favor.','I\'m done! Acabou! I\'m done!','I\'m seventeen days from going home—','Don\'t, man. Please. My mãe—','I just carry the speakers, I swear—'],
      crawl:['Alguém me ajuda... somebody...','Fica longe, fica longe—','I just wanna see the beach...'],
      dying:['...mãe...','...it\'s cold, man... it\'s cold...','...the music stopped...','...Deus...'],
      friend:n=>[`${n}! Não!`,`${n}, levanta! Get up!`,`You killed ${n}, desgraçado!`],
      call:n=>[`${n}! ${n}, me ajuda!`,`${n}... don\'t go...`],
      idle:['Tremor says the drop hits when the gringo dies.','Who\'s got the sunscreen?','This train is faster than my cousin\'s Kawasaki.','Two hundred thousand. Dollars. Not reais. Dollars.','Ê, turn it up, turn it up!','The water\'s too cold, man.'],
      pleas:['My little sister is waiting at Copacabana—','I only came for the party, man—','I owe Tremor money, that\'s all—','I\'m just the DJ\'s cousin—','I never even shot anybody—']}),
    boss:{taunt:['Feel that bass, gringo?','The drop hits when you drop!','My party, my rules!','Louder! LOUDER!','You\'re off the guest list, Tourist.','Dança! DANÇA!'],
      beg:['Okay, okay! Turn it off! I give up!','Please, man... I just wanted to play my set...']} },
  firm:{label:'The firm',voice:{f0:118,rasp:.3,breath:.4},
    names:['Dazza','Kev','Big Nige','Lee','Wayne','Tel','Shaun','Gaz','Mickey','Stevo','Deano','Little Paul'],
    lines:crewLines({
      alert:['Oi! OI! That\'s him!','Come on then! Come on!','He\'s here, lads! Get into him!','You want some? You want some?','Tourist! You\'re going home in an ambulance!'],
      leg:['Me leg! He\'s done me leg!','Ahh— I can\'t stand, I can\'t stand—','Me knee, me bleeding knee—'],
      torso:['I\'m shot— he\'s shot me!','Ahh, you cheeky—','Leave it! Leave it!'],
      arm:['Me arm! Me arm!','Can\'t feel me hand—'],
      stab:['Get it out of me!','Ahh— no— no—','Oh God, oh God—'],
      beg:['Leave it, mate. Leave it. I\'m done.','Alright! Alright! You win!','I\'ve got a little girl, mate, please—','I didn\'t even want to come—','It was just a bit of a laugh—'],
      crawl:['Somebody... phone someone...','Stay back— stay back—','Mum... where\'s me mum...'],
      dying:['...cold, innit...','...tell me mum...','...can\'t see the telly...','...we were winning...'],
      friend:n=>[`${n}! NO!`,`${n}! Get up, son!`,`You\'ve killed ${n}, you—`],
      call:n=>[`${n}! ${n}, help me, mate!`,`${n}... don\'t leave me...`],
      idle:['Two-nil and the ref gives them a penalty. Two-nil!','Whose round is it?','The Gaffer says nobody bottles him but the Gaffer.','I\'ve had nine pints and I can still see him coming.','Fifty grand for one bloke. One bloke!','Shh, shh, it\'s the replay.'],
      pleas:['I\'ve got a kid starting school Monday—','I only came for the away day—','I owe the Gaffer, that\'s all it is—','I work at a garden centre, mate—','I\'m not even from London—']}),
    boss:{taunt:['Come on then, son. Fists.','No guns. Proper fight.','I\'ve had worse off a Millwall fan.','Get up! I\'m not done with you!','This is my pub!','That all you got, Tourist?'],
      beg:['Alright... alright, son. You\'ve done me.','Go on then. Get it over with.']} },
  espositos:{label:'The grandsons',voice:{f0:116,rasp:.2,breath:.4},
    names:['Salvatore','Gennaro','Ciro','Enzo','Pasquale','Vincenzo','Tonino','Peppe','Luca','Gigi'],
    lines:crewLines({
      alert:['Eccolo! There he is!','Nonna! It\'s him!','Mannaggia— get him!','Ué! Tourist! Over here!','For Nonna! For the family!'],
      leg:['La gamba! My leg!','Mamma mia, my knee—','I can\'t stand, madonna—'],
      torso:['I\'m hit! Madonna santa—','Aaah— no, no—','He shot me, Nonna, he shot me!'],
      arm:['My arm! Il braccio!','I can\'t hold it—'],
      stab:['Toglilo! Get it out!','Ah— Gesù—','No— no— basta—'],
      beg:['Ti prego. Please. I\'m begging you.','Basta! Basta, I give up!','Don\'t tell Nonna I begged—','I got a wedding Saturday, please—','I\'m just the driver, I swear on my mother—'],
      crawl:['Aiutatemi... somebody...','Stay away, stay away—','Nonna... Nonna...'],
      dying:['...mamma...','...fa freddo...','...tell Nonna I tried...','...the sea... I can hear the sea...'],
      friend:n=>[`${n}! NO!`,`${n}, alzati! Get up!`,`You killed ${n}! He was my cousin!`],
      call:n=>[`${n}! ${n}, aiutami!`,`${n}... don\'t go...`],
      idle:['Nonna says eat first, then kill the American.','Who put pineapple on the pizza? WHO?','He\'s Hungarian, not American, idiota.','Mezzo milione. Half a million!','Shh! Nonna is saying grace.','I left the stove on in Posillipo.'],
      pleas:['I have a little boy in Naples—','I only came because Nonna asked—','I just make the sauce—','I\'m getting married in June—','I never wanted this, I wanted to be a chef—']}),
    boss:{taunt:['Look at him. Skin and bones. Nobody feeds you?','My grandsons will do it. Sit. Eat something.','In my day we killed people properly.','Shoot an old woman. Go on. Your mother would be proud.','Salvatore, stop crying and shoot him!','Mangia! Eat, before you die.','I buried two husbands. I\'ll bury you.'],
      beg:['Go on. Do it. I\'ve had a long life.','You think I\'m scared of you? I\'m ninety-one.']} },
  brotherhood:{label:'The brotherhood',voice:{f0:96,rasp:.4,breath:.32},
    names:['Sasha','Misha','Lyosha','Dima','Kolya','Vanya','Zhenya','Tolik','Grisha','Borya'],
    lines:crewLines({
      alert:['Vot on! There he is!','Davai, davai! Get him!','Brothers! The Tourist!','Hey! Who let you in the banya?','Blyat— it\'s him!'],
      leg:['Moya noga! My leg!','Ahh— I cannot stand—','My knee, my knee—'],
      torso:['I am shot— I am shot!','Ah, chort—','It is nothing, it is nothing— ahh—'],
      arm:['My arm! Ruka—','Cannot hold— cannot hold the gun—'],
      stab:['Take it out! Take it out!','Ahh— bozhe moi—','No— no—'],
      beg:['Pozhaluysta. Please. I am done.','Enough! Enough, brother!','I have a grandmother in Irkutsk—','Do not do this, I beg you—','I am only here for the sauna—'],
      crawl:['Pomogite... somebody...','Stay back— stay back—','I cannot feel my legs...'],
      dying:['...mama...','...so warm... finally warm...','...the snow...','...tell Grigor... I tried...'],
      friend:n=>[`${n}! Nyet!`,`${n}, get up! Vstavai!`,`You killed ${n}! My brother!`],
      call:n=>[`${n}! ${n}, help!`,`${n}... do not leave me...`],
      idle:['Grigor says the sauna stays at ninety degrees until the Tourist is dead.','Pass the vodka. No, the cold one.','My tracksuit is wet. Why is my tracksuit wet?','One million rubles. Each!','Hit me with the birch again, Misha.','Who ate the pickles? WHO?'],
      pleas:['I have a little daughter in Novosibirsk—','I only came for the free vodka—','I owe Grigor, everybody owes Grigor—','I fix cars, I am not a killer—','It is my first day, brother—']}),
    boss:{taunt:['I do not feel pain, little man.','Is that all? I have been hit harder by my mother.','Come into the steam. It is nice.','In Siberia, this is a warm day.','You will freeze before you bleed.','I am still coming, Tourist.'],
      beg:[]} },
  crane:{label:'Golden Crane',voice:{f0:122,rasp:.22,breath:.4},
    names:['Ah Keung','Siu Ming','Fat Chai','Ah Wai','Lok','Chun','Kin','Ah Bo','Tai Lo','Sam Gor'],
    lines:crewLines({
      alert:['Hai keoi! It\'s him!','The Tourist! Everybody, now!','Madam Lau! He\'s here!','Kill him! Fai di!','Waa— in the dining car!'],
      leg:['My leg! Aiya—','I can\'t stand— I can\'t—','Ah— my knee—'],
      torso:['I\'m hit! Aiya!','Diu— he got me—','Ah— ah—'],
      arm:['My arm! My arm!','I can\'t lift it—'],
      stab:['Get it out— get it out!','Aiya— aiya—','No— no—'],
      beg:['Please. Please, big brother.','I give up! I give up!','I have a mother in Sham Shui Po—','Don\'t, don\'t, I beg you—','I only cut the char siu, I swear—'],
      crawl:['Somebody... help...','Stay back— stay back—','Ma... Ma...'],
      dying:['...ma...','...so cold...','...the harbour lights...','...I want to go home...'],
      friend:n=>[`${n}! No!`,`${n}, get up! Get up!`,`You killed ${n}!`],
      call:n=>[`${n}! ${n}, help me!`,`${n}... don\'t go...`],
      idle:['Madam Lau wants him alive enough to apologise.','Who ordered the chicken feet? Nobody? Again?','Three million Hong Kong dollars. Three!','Keep your cleaver clean, she checks.','This tea is cold. Madam will kill someone.','Shh. She\'s on the phone.'],
      pleas:['My little brother is in school, he needs me—','I just wash the steamers—','I owe Madam Lau money—','I\'m not even triad, I\'m a waiter—','My mother thinks I work in a bank—']}),
    boss:{taunt:['You owe me an apology, Tourist.','In my restaurant, you wait to be seated.','My cleaver is faster than your gun.','Sit. Down.','You eat, you pay. You don\'t pay, you die.','I have killed better men over a bill.'],
      beg:['Fine. Fine. Take it. Take everything.','You think this is over? The triad never forgets.']} },
  kagami:{label:'Kagami-gumi',voice:{f0:108,rasp:.2,breath:.35},
    names:['Takeda','Morioka','Sugita','Kuroda','Ishii','Nakai','Endo','Hayashi','Okabe','Murata'],
    lines:crewLines({
      alert:['Ita zo! There!','The Tourist! Now!','For the young master!','Kill him! Korose!','He made it back to Tokyo—'],
      leg:['My leg— ashi ga—','I can\'t stand— I can\'t—','Kuso— my knee—'],
      torso:['I\'m hit— I\'m hit—','Kuso...','Ahh—'],
      arm:['My arm—','I can\'t hold it—'],
      stab:['Get it out— nuite kure—','Ugh— ugh—','No— no—'],
      beg:['Please. I am finished.','Yamete kure. Please. Stop.','I have a wife in Saitama—','I surrender. I surrender.','Forgive me. Please.'],
      crawl:['Somebody... tasukete...','Stay back—','I can\'t... feel...'],
      dying:['...okaasan...','...samui...','...the neon is so bright...','...young master... forgive me...'],
      friend:n=>[`${n}!`,`${n}, get up!`,`You killed ${n}!`],
      call:n=>[`${n}! ${n}, tasukete!`,`${n}... don\'t leave...`],
      idle:['The young master wants it done before midnight.','His suit is white. Don\'t get blood on it.','Ten million yen. Each.','Twenty-four hours around the world, and he comes back to us.','Stand straight. Ren-sama is watching.','Quiet. Listen. Something is moving in the pods.'],
      pleas:['My daughter starts university next month—','I only drive the car—','I owe the family, it is not my choice—','I was going to leave the gumi, I swear—','My father is sick in Osaka—']}),
    boss:{taunt:['Do you know who my father is?','Don\'t touch the suit.','I\'ll pay you double to walk away.','You are just a tourist.','My father\'s men will find you anywhere.','How much? Name a number!'],
      beg:['Wait! Wait! I\'ll pay! Name your price!','Please... my father... he\'ll give you anything...','Not the face. Please. Not the face.']} }
};
/* who is who: crew members and bosses, their behaviour kind, weapon and toughness */
const CREW_OF={
  kingc:{crew:'kings',kind:'gunman',wkey:'pistol'},          king:{crew:'kings',kind:'landlord',wkey:'revolver',boss:true,tough:.55,name:'"The King"'},
  tremorc:{crew:'tremor',kind:'gunman',wkey:'pistol'},       tremor:{crew:'tremor',kind:'enforcer',wkey:'smg',boss:true,tough:.6,name:'DJ Tremor'},
  gafferc:{crew:'firm',kind:'corner',wkey:'bottle'},         gaffer:{crew:'firm',kind:'brawler',wkey:null,boss:true,tough:.45,name:'The Gaffer'},
  nonnac:{crew:'espositos',kind:'gunman',wkey:'pistol'},     nonna:{crew:'espositos',kind:'seated',wkey:null,boss:true,seated:true,name:'Nonna Assunta',voice:{f0:178,rasp:.55,breath:.6}},
  volkovc:{crew:'brotherhood',kind:'gunman',wkey:'pistol'},  volkov:{crew:'brotherhood',kind:'doorman',wkey:'shotgun',boss:true,tough:.4,name:'Grigor Volkov',voice:{f0:82,rasp:.55,breath:.3}},
  lauc:{crew:'crane',kind:'cutter',wkey:'cleaver'},          lau:{crew:'crane',kind:'cutter',wkey:'cleaver',boss:true,tough:.6,name:'Madam Lau',voice:{f0:196,rasp:.15,breath:.45}},
  renc:{crew:'kagami',kind:'gunman',wkey:'pistol'},          ren:{crew:'kagami',kind:'cutter',wkey:'waki',boss:true,tough:.7,name:'Ren Kagami',voice:{f0:128,rasp:.12,breath:.4}}
};
/* a spot's name is the character id, maybe with a crew suffix and a number: 'king', 'king_c3', 'lauc2' */
function crewIdOf(name){ if(CREW_OF[name]) return name; const m=name.match(/^([a-z]+?)_?c\d*$/); return m&&CREW_OF[m[1]+'c']?m[1]+'c':null; }
const nameUse={};
function spawnCrew(id,x,z,hd,o={}){
  const D=CREW_OF[id]; if(!D) return null; const K=CREWS[D.crew]; const L=Object.assign({},K.lines);
  if(D.boss&&K.boss){ if(K.boss.beg&&K.boss.beg.length) L.beg=K.boss.beg; }
  const used=nameUse[D.crew]=(nameUse[D.crew]||0)+1, name=D.name||K.names[(used-1)%K.names.length];
  const v=Object.assign({},K.voice,D.voice||{}); v.f0*=rnd(.93,1.07);
  const E=spawnEnemy({maker:(h,g)=>makeChar(id,h,g),name,x,z,hd,extra:D.boss?(K.boss&&K.boss.beg&&K.boss.beg[0])||pick(L.pleas):pick(L.pleas),kind:D.kind,wkey:D.wkey,lines:L,crew:D.crew,boss:D.boss,tough:D.tough,seated:D.seated});
  E.voice=v; E.taunts=D.boss&&K.boss?K.boss.taunt:null; E.idleLines=L.idle; E.id=id;
  if(D.seated){ for(const k of E.holder.kids) if(k!==E.J.root){ k.p=[x,0,z]; k.r=[0,hd,0]; E.chair=k; } }
  if(o.pose==='sit'&&!D.seated){ E.seated=true; E.sitY=o.y||0; }
  enemies.push(E); attachLabels(); return E; }
/* overheard chatter before they know you are there, and bosses taunting through the fight */
function crewChatter(dt){ GAME.chatT=(GAME.chatT||0)-dt; if(GAME.chatT>0||GAME.barkGlobal>0) return;
  const live=enemies.filter(E=>!E.dead&&E.st!=='down'&&E.barkCd<=0);
  const boss=live.find(E=>E.taunts&&(E.aware||E.seated)&&Math.hypot(E.pos[0]-PL.x,E.pos[1]-PL.z)<14);
  if(boss&&Math.random()<.6){ bark(boss,pick(boss.taunts),3); GAME.chatT=rnd(4,7); GAME.barkGlobal=1; return; }
  const near=live.filter(E=>!E.aware&&E.idleLines&&Math.hypot(E.pos[0]-PL.x,E.pos[1]-PL.z)<9);
  if(near.length){ const E=pick(near); bark(E,pick(E.idleLines),3.4); GAME.chatT=rnd(5,9); GAME.barkGlobal=1; } else GAME.chatT=1.5; }
/* everyone off the level: bodies, blades stuck in them, subtitles */
function clearEnemies(){ meleeClear(); for(const G of GRABS.slice()) endGrab(G); for(const E of enemies){ disposeTree(E.holder); const i=world.kids.indexOf(E.holder); if(i>=0) world.kids.splice(i,1); E.barkEl.remove(); if(E.label){ const k=world.kids.indexOf(E.label); if(k>=0) world.kids.splice(k,1); } }
  enemies=[]; chars.length=0; GAME.clear=false; }
