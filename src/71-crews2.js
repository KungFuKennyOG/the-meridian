/* the two crews for the izakaya (leaving Tokyo by day) and the sushi bar (under the Pacific) */
Object.assign(CREWS,{
  associates:{label:'Tanaka & Associates',voice:{f0:118,rasp:.2,breath:.4},
    names:['Sato','Suzuki','Takahashi','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi','Kato','Yoshida','Yamada','Sasaki'],
    lines:crewLines({
      alert:['That\'s him. That\'s the Tourist.','Gentlemen, our quarterly target.','Excuse me, sir. You\'ll need to come with us.','Oi! Over here! It\'s him!','Close the deal, boys!','Put your drink down. He\'s here.'],
      leg:['My knee! My knee—','I can\'t stand— I can\'t stand up—','Itai, itai, itai—'],
      torso:['Ugh— my ribs—','He hit me— he really hit me—','Kuso... I can\'t breathe...'],
      arm:['My arm! My typing arm!','I can\'t lift it—'],
      stab:['Get it out— get it out of me—','Itai— itai— itai—','Not glass— not glass—'],
      beg:['Please! I have a mortgage!','I\'m just middle management! Please!','I resign! I resign effective immediately!','Sumimasen— sumimasen— please—','Let me go home. Please. Just let me go home.'],
      crawl:['Somebody... call... HR...','The door... the door...','I just wanted the overtime...'],
      dying:['...okaasan...','...I never took my holidays...','...tell the office... I tried...','...so tired...'],
      friend:n=>[`${n}-san!`,`${n}! Get up, we have a deadline!`,`You killed ${n}! He had two kids!`],
      call:n=>[`${n}-san! Help me!`,`${n}... don\'t leave me here...`],
      idle:['Kanpai! To the bonus!','The chief says the first one to the Tourist gets promoted.','My wife thinks I\'m at a conference in Osaka.','One more round. One more, then we work.','Ten years at the company and this is my first train ride.','Why is the boss drinking tea? Is that a test?','Remember: we are a team. Teamwork!'],
      pleas:['My daughter has her entrance exams on Monday—','I only joined for the pension—','I\'ve never even killed anyone, I do the spreadsheets—','My father worked at this company forty years—','I have a mortgage in Saitama—']}),
    boss:{taunt:['Let\'s circle back to your death.','This is a performance review, Varga-san.','I have closed bigger deals than you.','No overtime pay for this, boys. Just glory.','Synergy! Surround him!','You are this quarter\'s target.'],
      beg:['Wait! Wait. We can negotiate.','Please... I have twenty years at the company...','I\'ll write you a glowing reference—']} },
  sleepers:{label:'Kagami-gumi sleepers',voice:{f0:116,rasp:.25,breath:.35},
    names:['Itamae Goro','Masa','Hiro','Jiro','Kenji','Taku','Sho','Daisuke','Ryo','Tetsu'],
    lines:crewLines({
      alert:['Irasshaimase, Tourist.','We have been waiting since Tokyo.','The young master sends his regards.','Omakase. Chef\'s choice.','Knives out. Now.','Close the shutters. Nobody leaves the counter.'],
      leg:['My leg— ahh—','I can\'t stand—','Kuso— kuso—'],
      torso:['Ugh— I\'m hit—','Hnn— not the stomach—','Ahh—'],
      arm:['My knife hand— my hand—','I can\'t hold the blade—'],
      stab:['Get it out— nuite kure—','Hnnh— cold— it\'s cold—','No— no—'],
      beg:['Please. I only make sushi now.','Yamete kure. I\'m begging you.','I\'ll tell you where Ren is. Anything.','Forgive me. Forgive me.','I have a shop in Tsukiji. Please.'],
      crawl:['Tasukete...','The counter... I have to reach the counter...','So much blood... on the rice...'],
      dying:['...okaasan...','...the sea is so dark...','...forgive me, young master...','...samui...'],
      friend:n=>[`${n}!`,`${n}, get up!`,`You killed ${n}!`],
      call:n=>[`${n}! Tasukete!`,`${n}... don\'t go...`],
      idle:['Twenty-two hours rolling rice for tourists.','When the windows go blue, we do it.','The young master said not before the tunnel.','The tuna is good tonight. Shame.','Sharpen it again. Again.','Smile. He might be watching the counter.'],
      pleas:['I trained twelve years to make sushi—','My father had a stall at the fish market—','I just wanted my own shop—','The gumi owns my debt, I had no choice—','I have a boy in Yokohama—']}),
    boss:null }
});
Object.assign(CREW_OF,{
  tanakac:{crew:'associates',kind:'brawler',wkey:null},
  tanakab:{crew:'associates',kind:'corner',wkey:'bottle'},
  tanaka:{crew:'associates',kind:'brawler',wkey:null,boss:true,tough:.5,name:'Section Chief Tanaka',voice:{f0:104,rasp:.3,breath:.35}},
  chefc:{crew:'sleepers',kind:'cutter',wkey:'knife'}
});
