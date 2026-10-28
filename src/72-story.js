/* =====================================================================
   THE STORY: every word the game says outside the crews' own barks (70-crews.js, 71-crews2.js).
   Nico Varga, "the Tourist", boards the Meridian 24 at Tokyo Meridian Terminal, platform 0, for his first
   holiday in eleven years. His handler, Margit Halasz, booked it, from a "grateful client"'s free ticket.
   THE REVEAL (paid off in the locomotive): eleven years ago, on his last holiday, Nico was at the Kagami
   hotel in Tokyo the night of Ren Kagami's eighteenth birthday. Six men came for old Kagami and Nico killed
   them all with the cake knife. The blood went all over Ren's white suit, and in front of everyone his father
   called Nico "the son I should have had" and "my tourist". The old man has been Nico's best client ever since,
   which is why he never got another holiday. Ren has worn white ever since. Now he has bought the ticket from
   his father's account, put the bounty on the Tourist, and paid a crew to board at every stop.
   Hints along the way: the gift ticket "for the Tourist", clean yen, white lilies, "a spoiled boy's money"
   (Nonna), "never worked a day" (the King), "it's somebody's birthday" (Vegas), the sleepers' "young master".
   Lines are [who,text]; who is 'nico', 'handler', 'pa', 'phone' (the cab radio: old man Kagami) or a ROSTER id.
   Plain strings are Nico's unless noted (pa lines are the station announcer). No clock times anywhere.
   ===================================================================== */
const STORY={
  handler:{name:'Margit Halász',short:'MARGIT',voice:{f0:178,rasp:.42,breath:.4}},
  nicoVoice:{f0:100,rasp:.3,breath:.35},

  /* ---------- Tokyo Meridian Terminal, platform 0, B5, by day: the lobby ---------- */
  lobby:{
    pa:[
      'Attention please. The Meridian 24 world loop departs from platform 0.',
      'The Meridian 24. See the world in 24 hours. Please keep your belongings with you.',
      'Today\'s loop calls at Hong Kong, Lake Baikal, London, Naples, Rio, Las Vegas and Tokyo.',
      'The Meridian 24 stops only underground. Please do not ask to stop anywhere nice.',
      'Will passenger Varga please answer the payphone on platform 0. Passenger Varga.',
      'Please do not leave golf bags unattended on the platform.',
      'For your safety, stand behind the yellow line. For everyone else\'s, stand well back.',
      'The izakaya car is now open. Passengers are asked to drink responsibly, and quietly.',
      'Lost property: one umbrella, one briefcase, one gentleman\'s left hand. Please see staff.',
      'Swords must be wrapped while on the platform. Thank you for your cooperation.',
      'Our sushi chefs are aboard and ready. They have been ready for some time.',
      'Leave Tokyo by day. See the whole world. Come home to Tokyo by night. Mostly.',
      'Platform 0 is a quiet zone. Please keep screaming to a minimum.',
      'The Meridian 24 regrets it cannot be responsible for incidents in the dining cars.',
      'Passengers are reminded the world loop does not offer refunds. Or exits.'],
    phoneRing:'PAYPHONE · INCOMING CALL · FOR MR. VARGA',
    briefing:[
      ['handler','Nicky. You found the phone. I told them you would.'],
      ['nico','Margit. I\'m on holiday.'],
      ['handler','You were. Briefly. Somebody\'s put a price on your head.'],
      ['nico','How much?'],
      ['handler','Enough that I thought about it. Every crew on the loop has the flyer.'],
      ['nico','Who?'],
      ['handler','No name. Clean yen, through six banks. Very good manners.'],
      ['handler','And they know you\'re on the Meridian 24. Westward, round the world, home by night.'],
      ['nico','Can I get off?'],
      ['handler','It only stops underground. Every city. That\'s where they\'ll get on.'],
      ['nico','Why did you book this?'],
      ['handler','"See the world in 24 hours." And you looked tired. Eleven years tired.'],
      ['handler','The ticket was a gift. A grateful client. Card said "for the Tourist".'],
      ['nico','Which client?'],
      ['handler','Lovely handwriting, no name. Your golf bag\'s in the locker. The putter\'s a putter.'],
      ['handler','The other thing isn\'t. I\'ll leave you something better at every stop.'],
      ['nico','I don\'t play golf.'],
      ['handler','You do on holiday. And bring me something from every city. Something nice.'],
      ['nico','Get me a window seat.'],
      ['handler','It\'s all windows, Nicky. It\'s a train. Go and board it.']],
    kiosk:{title:'MERIDIAN 24 · WORLD LOOP',newRun:'NEW JOURNEY',cont:'CONTINUE JOURNEY',settings:'PASSENGER SETTINGS',thanks:'ARIGATOU GOZAIMASU · SEE THE WORLD IN 24 HOURS'},
    idle:[
      ['handler','The train won\'t board itself, Nicky.'],
      ['handler','Platform 0. It\'s the one with the train at it.'],
      ['handler','You can look at the vending machines on the way back round.'],
      ['handler','The departure board isn\'t going to change. I\'ve read it. Hong Kong. Then everywhere.'],
      ['handler','The conductor\'s looking at you, Nicky. He\'s looking at your golf bag.'],
      ['handler','If you miss it, it comes back round in a day. With more people on it.'],
      ['nico','Five more minutes.'],
      ['handler','That\'s what you said eleven years ago. Board.']],
    vending:[
      ['nico','Hot coffee. In a can.'],
      ['nico','...Corn soup.'],
      ['nico','Melon soda. Holiday rules.'],
      ['nico','It owes me change.'],
      ['nico','Exact change.'],
      ['nico','One more. Then work.'],
      ['handler','Stop punching the machines, Nicky. They\'re not on the list.'],
      ['handler','Is that breakfast? That\'s not breakfast.']],
    practice:[
      ['nico','Still got it.'],
      ['handler','Lovely. Now do that to people.'],
      ['handler','That\'s four bottles. I\'m putting them on your bill.'],
      ['handler','Your left side\'s lazy.'],
      ['nico','My left side is on holiday.'],
      ['nico','Holiday\'s going well.']],
    mirror:[
      'You look like a man on holiday.',
      '...You look like hell, Varga.',
      'Eleven years. It shows.',
      'Shave in Hong Kong.']
  },

  /* ---------- arriving at each underground station: the handler on the earpiece ---------- */
  stations:{
    hongkong:[
      ['handler','Meridian Central. Hong Kong. Did you see the junk with the red sails on the harbour?'],
      ['nico','I was busy with salarymen.'],
      ['handler','Golden Crane got on here. Madam Lau\'s people. Kitchen cleavers. All at once.'],
      ['handler','Dim sum counter on the platform. There\'s a takeaway box in your name. Don\'t eat it.'],
      ['handler','Your other pistol. Now you\'re a matching pair.'],
      ['handler','And the bounty\'s still paid in yen. Old money. Very clean.']],
    baikal:[
      ['handler','Baikalskaya. Days of white out there. Birch, onion domes, huts on the ice.'],
      ['nico','It\'s warm down here.'],
      ['handler','Bronze chandeliers. They spent the heating budget on the ceiling.'],
      ['handler','Volkov\'s brotherhood. Tracksuits, gold teeth. Grigor takes his shotgun in the sauna.'],
      ['handler','Luggage trolley. Fur coat. Under the coat, a shotgun. Keep the coat.'],
      ['handler','Bring me a snow globe.']],
    london:[
      ['handler','Kings Meridian. The clock tower, the dome, the bridge. It rained the whole way, didn\'t it?'],
      ['nico','It\'s London.'],
      ['handler','The puddles on that platform never dry. Mind your shoes.'],
      ['handler','The Southside firm. They\'ll come down the stairs singing. The Gaffer only uses fists.'],
      ['handler','Briefcase by the bench. Compact SMG. Very civil service.'],
      ['handler','Somebody sent white lilies to the office. White card. "For the Tourist." Again.']],
    naples:[
      ['handler','Napoli Meridiana. You came down past the volcano. Lemon trees right up to the line.'],
      ['nico','I could smell them.'],
      ['handler','The Espositos. Nonna Assunta, ninety-one, sawn-off across her knees.'],
      ['handler','The grandsons will die for her. She\'ll tell them so.'],
      ['handler','Cello case by the espresso bar. It isn\'t a cello.'],
      ['handler','Bring me lemons.']],
    rio:[
      ['handler','You came under the whole South Atlantic. Did you look at the whales?'],
      ['nico','One looked at me.'],
      ['handler','Meridiano Copacabana. That tiled staircase goes straight up to the beach. Sunset, too.'],
      ['handler','Tremor\'s crew. Jerseys, bandanas, a sound system he never turns off.'],
      ['handler','Blue cool box on the platform. Grenade launcher. On ice.'],
      ['handler','The bounty went up again. Somebody\'s spending an inheritance.']],
    vegas:[
      ['handler','Meridian Strip. Desert, a pyramid shooting a beam at the sky. Tacky. I love it.'],
      ['handler','The Kings. A hit squad of Elvis men. The King has a gold revolver in each hand.'],
      ['handler','Roulette table. Gold machine gun, red bow. Happy birthday.'],
      ['nico','It\'s not my birthday.'],
      ['handler','It\'s somebody\'s. And there\'s a wedding chapel on the platform. Don\'t.']],
    tokyonight:[
      ['handler','Tokyo by night. Neon to the horizon, the tower lit orange. You went all the way round.'],
      ['nico','Didn\'t feel like a day.'],
      ['handler','Kagami-gumi on the platform. Black suits, dark glasses. Pairs. They never run.'],
      ['handler','Ticket office counter. Red silk. A katana. That one\'s from me.'],
      ['handler','The ticket wasn\'t. I checked the account. It was Kagami money. Not the old man.'],
      ['nico','The boy.']]
  },

  /* ---------- picking up each station's weapon ---------- */
  pickup:{
    pistol:'Packed light.',
    pistol2:'Takeaway for two.',
    shotgun:'Warm coat. Warmer gun.',
    smg:'Finally. Paperwork I like.',
    rifle:'Plays one note. Loud.',
    gl:'Something cold for the beach.',
    goldmg:'Gift-wrapped. Somebody likes me.',
    katana:'Thanks, Margit.'
  },

  /* ---------- the cars ---------- */
  cars:{
    izakaya:{
      enter:[
        ['tanaka','Ah. Varga-san. Please, sit. We were just discussing you.'],
        ['tanaka','Gentlemen, put your drinks down. Our quarterly target has arrived.'],
        ['nico','I\'m on holiday.'],
        ['tanaka','So are we. Team-building. The company pays.'],
        ['handler','Tanaka and Associates, Nicky. Salarymen. Contract killers. Same thing, really.']],
      clear:[
        ['nico','Meeting adjourned.'],
        ['handler','Look out the window. Paddies, a pagoda, the volcano. Cherry blossom on the glass.'],
        ['nico','That\'s not blossom.']]},
    dimsum:{
      enter:[
        ['lau','No reservation. No manners. And now, no future.'],
        ['nico','Just the bill.'],
        ['lau','The bill is you, Mr. Varga.'],
        ['handler','Watch the cleaver. She throws it better than you shoot.']],
      clear:[
        ['nico','Compliments to the kitchen.'],
        ['handler','Get me some custard buns.'],
        ['nico','I got you a cleaver.']]},
    banya:{
      enter:[
        ['volkov','Close the door, little man. You let the steam out.'],
        ['volkov','Take off your shoes. Then die.'],
        ['nico','He brought a shotgun into a sauna.'],
        ['handler','He doesn\'t feel pain and he doesn\'t beg. He just keeps coming. Keep shooting.']],
      clear:[
        ['nico','I\'m sweating through my holiday shirt.'],
        ['handler','Snow globe, Nicky.'],
        ['nico','Got you a birch switch.']]},
    pub:{
      enter:[
        ['gaffer','Leave the shooters at the door, son. Fists only in my pub.'],
        ['gaffer','Turn the match up, lads. He\'s ours.'],
        ['nico','Who\'s winning?'],
        ['gaffer','Not you, son.'],
        ['handler','That shirt\'s from 1998, Nicky. So is the headlock. Stay out of it.']],
      clear:[
        ['nico','Last orders.'],
        ['handler','Get me a tea towel with the clock tower on it.'],
        ['nico','Got you a scarf. Bit bloody.']]},
    trattoria:{
      enter:[
        ['nonna','Ah. The Hungarian. Wipe your feet.'],
        ['nonna','A boy\'s money on your head. A spoiled boy. I can smell it from here.'],
        ['nonna','But money is money. Ragazzi! Lunch is over.'],
        ['nico','Smells good.'],
        ['nonna','It\'s your last meal. It should.'],
        ['handler','She\'s ninety-one with a sawn-off, Nicky. You can let her go. Your call.']],
      clear:[
        ['nico','Lunch is over.'],
        ['handler','The rest of the grandsons ran back to the aquarium car.'],
        ['nico','Got you lemons.']]},
    aquarium:{
      enter:[
        ['pa','Welcome to the Aquarium Lounge. Please do not tap on the glass.'],
        ['handler','Under the South Atlantic now. Glass on the sea floor, all the way to Brazil.'],
        ['handler','What\'s left of the Espositos is in the booths. Quietest leg of the trip.'],
        ['nico','Not for long.']],
      clear:[
        ['nico','A whale just watched all that.'],
        ['handler','They mate for life, you know.'],
        ['nico','Good for them.']]},
    pool:{
      enter:[
        ['tremor','Gringo! The roof\'s open, the sun\'s out, and this one\'s for you!'],
        ['nico','Turn it down.'],
        ['tremor','Never! NEVER!'],
        ['handler','He never turns it off. Shoot the speakers. Then shoot him.']],
      clear:[
        ['nico','Finally. Quiet.'],
        ['handler','Sugarloaf at sunset. It\'s on the brochure.'],
        ['nico','Not bad. Better without the bass.']]},
    casino:{
      enter:[
        ['king','Ladies and gentlemen... the Tourist has entered the building.'],
        ['king','The kid paying for you never worked a day in his life. Me? I work.'],
        ['nico','Which Elvis are you?'],
        ['king','The one that\'s gonna bury you, son.'],
        ['handler','Two gold revolvers and a stage, Nicky. Slow it down. Make him dance.']],
      clear:[
        ['nico','House wins.'],
        ['handler','A fridge magnet. That\'s all I want from Vegas.'],
        ['nico','Got you dice.']]},
    sushi:{
      enter:[
        ['pa','We are now entering the Pacific tunnel. The sushi car is open.'],
        ['handler','Deeper than the Atlantic. Darker. Jellyfish out there, Nicky.'],
        ['handler','Those chefs have rolled rice since Tokyo. Nobody works that long for tips.'],
        ['nico','Just tea, thanks.']],
      clear:[
        ['handler','Kagami-gumi. Sleepers. They got on with you in Tokyo.'],
        ['nico','Kagami.'],
        ['handler','Your best client. Eleven years. It can\'t be the old man, Nicky.'],
        ['nico','No. Not the old man.']]},
    capsule:{
      enter:[
        ['handler','Capsule hotel. Two storeys of pods. Every one\'s a place to hide. Or wait.'],
        ['ren','Varga. You made it all the way round. I\'m almost impressed.'],
        ['ren','I\'m at the front of the train. Come up. Don\'t bleed on anything white.'],
        ['nico','Hello, Ren.']],
      clear:[
        ['nico','Sleep tight.'],
        ['handler','Only the locomotive left. Him and you, Nicky.']]},
    cab:{
      enter:[
        ['ren','There he is. The Tourist. My father\'s favourite.'],
        ['ren','My eighteenth birthday. His hotel. You walked in on holiday.'],
        ['ren','Six men came for him and you killed them all with the cake knife.'],
        ['ren','Their blood went all over my suit. And he laughed. He hugged you.'],
        ['ren','So I bought your ticket. With his money. And every crew on the way.'],
        ['nico','Thanks for the holiday.'],
        ['ren','I\'ve worn white for eleven years, so I\'d remember.'],
        ['nico','Should\'ve worn black.']],
      clear:[
        ['handler','That\'s everyone, Nicky. Take the controls.'],
        ['nico','Always wanted to drive a train.']]}
  },

  /* ---------- a boss goes down ---------- */
  bossDown:{
    tanaka:[['nico','Consider this my resignation.'],['handler','One crew down. The rest of the world to go.']],
    lau:[['nico','Keep the change.']],
    volkov:[['nico','Stay down this time.'],['handler','He never begged. I\'ll give him that.']],
    gaffer:[['nico','Good game.'],['handler','That\'s full time.']],
    nonna:[['handler','...She was ninety-one, Nicky.'],['nico','She\'d have done me.'],['handler','She would.']],
    tremor:[['nico','There\'s your drop.']],
    king:[['nico','Show\'s over, Your Majesty.'],['handler','Thank you. Thank you very much.']],
    ren:[['nico','Mind the suit.']]
  },

  /* ---------- letting Nonna live / walking past her ---------- */
  spare:{
    nonna:[
      ['nonna','Hm. Manners. Your mother raised you right.'],
      ['nonna','Go. Before I change my mind. And eat something.'],
      ['nico','Enjoy your lunch, Nonna.'],
      ['handler','That was nice of you, Nicky.'],
      ['nico','She reminded me of you.'],
      ['handler','I\'m sixty-three!'],
      ['nico','She was nicer.']]
  },

  /* ---------- the end of the line: the locomotive, after Ren falls ---------- */
  ending:{
    lines:[
      ['phone','Varga-san. This is Kagami. ...Is my son with you?'],
      ['nico','He\'s lying down.'],
      ['phone','The ticket. The bounty. My account. I found out too late. I am sorry.'],
      ['phone','Eleven years ago you saved my life. I never let you rest after.'],
      ['phone','The bounty stands, Varga-san. I am paying it. To you.'],
      ['nico','Keep it. Buy him a new suit.'],
      ['phone','...Arigatou, Varga-san.'],
      ['handler','Nicky? Was that the old man?'],
      ['nico','Your grateful client.'],
      ['handler','I thought the ticket was from him. I picked the window seat myself.'],
      ['nico','It was a good holiday, Margit.'],
      ['handler','Was it? Honestly?'],
      ['nico','Hong Kong was nice. The whales were nice.'],
      ['handler','...Did you get me anything?'],
      ['nico','I got you a train.'],
      ['handler','Pull the horn, Nicky. Let Tokyo know you\'re home.']],
    card:[
      'THE MERIDIAN 24',
      'Eleven cars. Eight crews. One tourist.',
      'Ren Kagami never wore white again.',
      'Margit got her souvenirs. Most of them were weapons.',
      'Nico Varga slept for two days. Then he went to the seaside. By boat.',
      'SEE THE WORLD IN 24 HOURS']
  },

  /* ---------- dying: the level restarts ---------- */
  death:[
    ['handler','Get up, Nicky. The train\'s still going.'],
    ['handler','That isn\'t how holidays work. Again.'],
    ['handler','I\'m not refunding the ticket. Up you get.'],
    ['handler','Try ducking. People swear by it.'],
    ['handler','You were doing so well. Well. You were doing.'],
    ['handler','Deep breath. In through the nose. Shoot them first this time.'],
    ['handler','Eleven years without a holiday, and this is how you spend it?'],
    ['handler','Nicky. Nicky. ...There you are. Go again.'],
    ['handler','The travel insurance doesn\'t cover this, you know. Up.'],
    ['handler','I have a biscuit riding on you. Don\'t make me eat it sad.'],
    ['handler','Don\'t tell your mother about that one.'],
    ['nico','...Ow.'],
    ['nico','Again.']],
  hurt:['Hnn.','Not now.','Ow. Ow.','That\'ll scar.','...Still standing.','Bleeding on the holiday shirt.'],
  kills:[
    'Next.','Sit down.','Checked out.','No refunds.','Enjoy the view.','That\'s your stop.',
    'Wrong train.','Tickets, please.','Holiday rules.','Don\'t get up.','Sorry about the carpet.',
    'Window seat\'s free.','Should\'ve stayed home.','Lie down. It helps.','Wish you were here.',
    'Bon voyage.','Out of office.','Do not disturb.','Travel light.','I\'m on holiday.','Mind the gap.',
    'Postcard material.'],
  bulletTime:['Slow down.','Breathe.','There it is.','Everybody hold still.','Holiday pace.','Take your time, Varga.'],
  watch:{label:'NEXT',end:'END OF THE LINE'}
};
