# The Meridian 24

A PS1-styled VR shooter for Meta Quest 3 (WebXR). The biggest bullet train ever built does the whole world in one day; you are a hitman on holiday with a price on your head, and at every stop a new crew gets on to collect it.

**Play:** https://kungfukennyog.github.io/the-meridian/ (open it in the Quest browser and press *Play in VR*; it also runs on a desktop).

## The run
Tokyo station (the lobby: ticket machine, payphone briefing, vending machine, practice bottles) → Izakaya Hanami (Tanaka & Associates) → Hong Kong → Golden Crane Dim Sum → Lake Baikal → Banya & Ice Bar → London → The Rusty Anchor → Naples → Trattoria Assunta → Aquarium Lounge (South Atlantic tunnel) → Rio → Copacabana Pool Deck → Las Vegas → The King's Casino → Sushi Bar Kaiten (Pacific tunnel, Kagami sleepers) → Tokyo by night → Capsule Hotel → The Locomotive (Ren Kagami, the finale).

The art set: `art.html` (built alongside `index.html`) opens the same build as a viewer: the whole train, every car and station, the crews, the story.

Every car's far door stays shut until nobody in it can still fight. Every station leaves you a weapon. Progress saves at each station.

## Controls
**VR:** grip grabs (weapons, bodies) and grip again drops or throws; trigger fires; A/X reloads that hand; B/Y kicks; left stick moves (a quick click is bullet time); right stick turns (click for sharpness). **Hold the left stick down for the menu**, or poke MENU on your left wrist with your right hand. The Quest browser keeps the controller's own menu button for itself.

**Desktop:** WASD and mouse; click fires or swings; 1-9 and 0 pick weapons; F knife, E kick, Q throw, G grab, R reload, T bullet time; Esc or M for the menu.

## The menu
ROUTE (jump to any level), ARSENAL (any weapon), CREWS (spawn any crew or boss), CHEATS (god mode, infinite ammo, one-hit kills, world speed, enemy aim, frozen enemies, train speed), GORE (blood, limbs, bleeding), VIDEO (sharpness, colour, scenery, fog, lasers, subtitles, FPS), AUDIO (music, ambience, rumble, voices), COMFORT (snap or smooth turning, walk speed, height).

## Code
Source is in `src/`, concatenated in name order by `./build.sh` into `index.html`. Never edit `index.html` by hand.

- `10-engine.js` renderer, characters, faces (shared with KungFuKennyOG/stairwell)
- `30-level.js` the level: bounds, colliders and nav read off the built geometry, static meshes baked by texture
- `40`-`48` the Meridian art set: scenery, train, cars, cast, stations, wall map (cars and stations build on demand)
- `50-game.js` bodies, damage, AI, VR (shared with Stairwell), `55-voice.js` voices, `60`-`63` weapons, melee, grabbing, the Meridian arsenal and grenades
- `70-crews.js` the seven crews: who fights how, names, voices and everything they say
- `75-flow.js` the route: levels, exits, weapon gifts, saves, lights, scenery, music cues
- `78-menu.js` the menu, `80-music.js` music per car and city ambience per station (all synthesized)
- `tools/lazify.py` the one-off conversion of the art set into on-demand builders
