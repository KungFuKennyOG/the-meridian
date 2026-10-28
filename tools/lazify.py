#!/usr/bin/env python3
"""One-off conversion of the Meridian art-set files (copied from KungFuKennyOG/stairwell src/meridian/) into
on-demand builders for the game. The art page builds every car, station and character at load; the game builds
one level at a time. Run once from the repo root: python3 tools/lazify.py
Each edit asserts it found exactly what it expected, so a re-run on already-converted files fails loudly."""
import re, sys, pathlib
S = pathlib.Path(__file__).resolve().parent.parent / 'src'

def edit(name, fn):
    p = S / name; s = p.read_text(); s2 = fn(s)
    assert s2 != s, name + ': nothing changed'
    p.write_text(s2); print('converted', name)

def once(s, a, b):
    assert s.count(a) == 1, (a[:70], s.count(a)); return s.replace(a, b)

# 43: no whole-train model or terminal at load (the route view is the art page's, not the game's)
def ext(s):
    s = once(s, "const TRAIN=N(world), TRAIN_CARS=[];\nWAGONS.forEach((W,i)=>{ const n=buildCarExt(TRAIN,W,((WAGONS.length-1)/2-i)*CAR_PITCH); n.W=W; TRAIN_CARS.push(n); });",
             "const TRAIN_CARS=[]; /* the game builds car exteriors only where a station needs them */")
    s = once(s, "(function buildStation(){", "const buildTerminal=function buildStation(){ /* the art page's terminal; unused in the game */")
    i = s.index("const buildTerminal="); j = s.index("})();", i)
    return s[:j] + "};" + s[j + 5:]
edit('43-exterior.js', ext)

# 44: each car builder registers itself; the widening pass becomes per car
CARS = ['cab', 'casino', 'pool', 'pub', 'trattoria', 'banya', 'dimsum', 'capsule', 'aquarium']
def wag(s):
    s = once(s, "const WG={};", "const WG={}, CAR_BUILD={}, CAR_POST={};")
    for k in CARS:
        a = "(function %s(){" % k
        i = s.index(a); j = s.index("\n})();", i)
        s = s[:i] + "CAR_BUILD.%s=function %s(){" % (k, k) + s[i + len(a):j] + "\n};" + s[j + 6:]
    s = once(s, "for(const k in WG){ const w=WG[k];\n", "function widenCar(k){ const w=WG[k];\n")
    return s
edit('44-wagons.js', wag)

def wide(s):
    for k in CARS:
        a = "(function(){ const g=WG.%s.g" % k
        if a not in s: continue
        i = s.index(a); j = s.index("\n})();", i)
        s = s[:i] + "CAR_POST.%s=function(){ const g=WG.%s.g" % (k, k) + s[i + len(a):j] + "\n};" + s[j + 6:]
    a = "(function(){ const B_=-Math.PI/2, F_=Math.PI/2, P=Math.PI, add=(k,o)=>Object.assign(WG[k].spots,o);"
    i = s.index(a); j = s.index("\n})();", i)
    s = s[:i] + "function addCrewSpots(key){ const B_=-Math.PI/2, F_=Math.PI/2, P=Math.PI, add=(k,o)=>{ if(k===key) Object.assign(WG[k].spots,o); };" + s[i + len(a):j] + "\n}" + s[j + 6:]
    return s
edit('44b-wide.js', wide)

# 45: keep the roster and makeChar; drop the line-up and the decorative people (the game spawns crews itself)
def cast(s):
    i = s.index("/* the line-up on platform 0"); return s[:i] + "/* (the art page's line-up and decorative crews are not built in the game: 70-crews.js spawns them as people) */\n"
edit('45-cast.js', cast)

# 46/47: stations register themselves; no decorative people
ST1 = [('tokyoStation', 'tokyo'), ('naplesStation', 'naples'), ('londonStation', 'london')]
ST2 = [('hongkongStation', 'hongkong'), ('baikalStation', 'baikal'), ('rioStation', 'rio'), ('vegasStation', 'vegas')]
def stations(pairs):
    def f(s):
        if "const ST={}" in s: s = once(s, "const ST={},", "const ST={}, STATION_BUILD={}, STATION_POST={},")
        for fn, k in pairs:
            a = "(function %s(){" % fn; i = s.index(a); j = s.index("\n})();", i)
            s = s[:i] + "STATION_BUILD.%s=function %s(){" % (k, fn) + s[i + len(a):j] + "\n};" + s[j + 6:]
        return s
    return f
def st1(s):
    s = stations(ST1)(s)
    s, n = re.subn(r"/\* the boarding crews on each platform \*/\nconst stationChars=\[\];\nfor\(const key in ST\).*?\n", "", s, flags=re.S)
    assert n == 1; return s
edit('46-stations.js', st1)
def st2(s):
    s = stations(ST2)(s)
    a = "(function tokyoPolish(){"; i = s.index(a); j = s.index("\n})();", i)
    s = s[:i] + "STATION_POST.tokyo=function tokyoPolish(){" + s[i + len(a):j] + "\n};" + s[j + 6:]
    s, n = re.subn(r"\nfor\(const key of \['hongkong','baikal','rio','vegas'\]\)\{ const sp=ST\[key\]\.spots;.*?$", "\n", s, flags=re.S)
    assert n == 1; return s
edit('47-stations2.js', st2)

# 48: the wall map goes up when its station is built
def wmap(s):
    return once(s, "for(const k in MAP_WALL){ const st=ST[k]; if(!st) continue;", "function addWallMap(k){ const st=ST[k]; if(!st||MAP_WALL[k]==null) return;")
edit('48-metromap.js', wmap)
