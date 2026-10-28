
/* =====================================================================================================
   THE WALL MAP: a world map poster on the back wall of every station, in the blue of a 90s menu screen:
   faceted continents on a navy grid, the route as lines from city to city round the globe (ridden legs
   bright, legs to come dim, sea tunnels dashed), a square and a name for each stop, a yellow box for here.
   ===================================================================================================== */
const MAP_LAT0=82, MAP_LAT1=-56, MAP_LON0=-168, MAP_PADT=18, MAP_PADB=6;
const MAP_STOPS={
  tokyo:   {lon:139.7,lat:35.7, code:'TYO',name:'TOKYO',     day:'DAY 1 - 06:10', col:'#ff5a4a'},
  hongkong:{lon:114.2,lat:22.3, code:'HKG',name:'HONG KONG', day:'DAY 2 - 12:15', col:'#ffa030'},
  baikal:  {lon:104.3,lat:52.3, code:'BKL',name:'LAKE BAIKAL',day:'DAY 3 - 10:30',col:'#8ad8ff'},
  london:  {lon:-0.1, lat:51.5, code:'LON',name:'LONDON',    day:'DAY 5 - 16:45', col:'#ff6a8a'},
  naples:  {lon:14.3, lat:40.8, code:'NAP',name:'NAPLES',    day:'DAY 6 - 13:00', col:'#6af08a'},
  rio:     {lon:-43.2,lat:-22.9,code:'RIO',name:'RIO',       day:'DAY 8 - 17:40', col:'#ffe040'},
  vegas:   {lon:-115.1,lat:36.2,code:'LAS',name:'LAS VEGAS', day:'DAY 10 - 20:30',col:'#ff4ad8'}};
const MAP_ORDER=['tokyo','hongkong','baikal','london','naples','rio','vegas'];
/* legs in riding order: [from,to,sea?,bulge]; bulge lifts the line north like a great circle */
const MAP_LEGS=[['tokyo','hongkong',0,.1],['hongkong','baikal',0,.1],['baikal','london',0,.22],['london','naples',0,.1],['naples','rio',1,.12],['rio','vegas',0,.12],['vegas','tokyo',1,.16]];
const MAPW=512, MAPH=224;
const mapXY=k=>{ const s=MAP_STOPS[k]; return [(s.lon-MAP_LON0)/360*MAPW, MAP_PADT+(MAP_LAT0-s.lat)/(MAP_LAT0-MAP_LAT1)*(MAPH-MAP_PADT-MAP_PADB)]; };
/* where each name sits beside its dot: [dx,dy] in texture pixels, so no two labels collide */
const MAP_LABEL={tokyo:[9,-5],hongkong:[8,4],baikal:[-24,-17],london:[-56,-15],naples:[8,1],rio:[9,-4],vegas:[-34,-17]};
/* continents as a handful of flat facets (Natural Earth outlines simplified hard, no Antarctica, cropped so the whole loop fits), like the nation picker in Kenny's soccer game */
const LAND_POLY=[[173,-41,168,-47,167,-45],[50,-14,47,-25,44,-25,43,-21,44,-16],[144,-14,153,-26,149,-38,131,-31,117,-35,115,-29,114,-22,126,-14,136,-12,140,-18],[134,-1,145,-4,151,-10,145,-8,138,-8,138,-5,131,-1],[125,1,120,0,123,-1,121,-5,121,-3,119,-5,120,1],[118,2,115,-4,110,-3,110,2,117,7,119,5],[141,37,131,34,131,31,129,33,140,41],[-56,51,-54,48,-59,48],[-3,59,1,51,-6,50,-3,54,-6,57],[-15,66,-19,63,-22,65],[185,67,190,66,184,65,180,65,180,69],[-91,69,-81,68,-93,62,-92,57,-80,51,-78,62,-74,62,-56,52,-71,47,-60,46,-76,39,-80,25,-84,30,-97,28,-96,19,-87,22,-89,16,-81,9,-62,11,-35,-7,-41,-22,-63,-43,-68,-52,-75,-52,-70,-20,-81,-6,-78,8,-104,18,-114,32,-112,25,-124,40,-123,49,-134,58,-151,61,-165,54,-157,59,-168,66,-157,71],[-114,73,-105,73,-101,70,-107,69,-116,69,-112,70,-119,72],[-87,73,-62,67,-68,66,-66,62,-79,65,-73,68,-89,70,-90,72],[-120,71,-126,72,-122,74,-116,73],[58,71,51,72,61,76,69,77,58,74,55,72],[107,77,179,69,179,63,164,60,157,51,156,57,164,63,135,55,141,52,128,40,129,35,118,39,122,28,106,20,109,13,105,9,100,13,104,1,91,23,78,8,66,25,48,30,60,22,43,13,32,30,43,12,51,9,28,-33,18,-34,14,-22,9,4,-9,5,-17,12,-17,22,-6,36,34,31,36,37,26,39,42,42,39,47,31,47,22,36,13,46,16,38,9,44,-9,37,-9,43,-1,44,-5,49,9,57,20,54,29,60,21,61,22,66,13,55,5,62,25,71,40,68,33,67,37,64,73,73,72,66,75,73],[18,80,22,79,17,77,13,78,10,80],[-68,82,-62,82,-81,76,-88,78,-82,80,-92,82],[-27,82,-12,81,-20,80,-22,71,-46,61,-57,75,-73,78]];
function wallMapTex(cur){ return P2(MAPW,MAPH,(g,w,h)=>{
  const ci=MAP_ORDER.indexOf(cur), X=lon=>(lon-MAP_LON0)/360*w, Y=lat=>MAP_PADT+(MAP_LAT0-lat)/(MAP_LAT0-MAP_LAT1)*(h-MAP_PADT-MAP_PADB);
  /* navy screen with a grid */
  vfill(g,0,0,w,h,[[0,'#10204a'],[1,'#0a1636']]);
  for(let x=0;x<w;x+=32) R(g,'#182c62',x,0,1,h); for(let y=0;y<h;y+=26) R(g,'#182c62',0,y,w,1);
  /* land: a drop shadow, a flat blue fill and a light edge */
  const shape=(dx,dy)=>{ g.beginPath(); for(const p of LAND_POLY){ g.moveTo(X(p[0])+dx,Y(p[1])+dy); for(let i=2;i<p.length;i+=2) g.lineTo(X(p[i])+dx,Y(p[i+1])+dy); g.closePath(); } };
  shape(3,3); g.fillStyle='#050c22'; g.fill();
  shape(0,0); g.fillStyle='#2f5cb0'; g.fill(); g.lineJoin='miter'; g.lineWidth=1.5; g.strokeStyle='#6a9ae8'; g.stroke();
  /* the route: lines from city to city, ridden legs bright, legs to come dim, sea tunnels dashed, the Pacific leg off one edge and back in at the other */
  g.lineCap='square';
  MAP_LEGS.forEach(([a,b,sea,bu],li)=>{ const done=cur!=='tokyo'&&li<ci; let [x0,y0]=mapXY(a),[x1,y1]=mapXY(b); if(a==='vegas'&&b==='tokyo') x1-=w;
    const dist=Math.hypot(x1-x0,y1-y0), mx=(x0+x1)/2, my=(y0+y1)/2-dist*bu*2;
    for(const off of (x1<0?[0,w]:[0])){ g.setLineDash(sea?[5,4]:[]); g.strokeStyle=done?'#e8f2ff':'#5a7cc0'; g.lineWidth=2; g.beginPath(); g.moveTo(x0+off,y0); g.quadraticCurveTo(mx+off,my,x1+off,y1); g.stroke(); } });
  g.setLineDash([]);
  /* square dots, names beside them; here gets the yellow box and a white tag */
  for(const k of MAP_ORDER){ const [x,y]=mapXY(k), S=MAP_STOPS[k], here=k===cur, [dx,dy]=MAP_LABEL[k], X0=x|0, Y0=y|0;
    const nm=k==='baikal'?'BAIKAL':S.name, tx=Math.round(x+dx), ty=Math.round(y+dy), tw=textW(nm,2);
    if(here){ R(g,'#050c22',X0-6,Y0-6,12,12); R(g,'#ffd040',X0-5,Y0-5,10,10); R(g,'#050c22',X0-2,Y0-2,4,4); R(g,'#050c22',tx-3,ty-3,tw+6,16); R(g,'#ffffff',tx-2,ty-2,tw+4,14); text(g,nm,tx,ty,'#0a1636',2); }
    else { R(g,'#050c22',X0-3,Y0-3,7,7); R(g,'#e8f2ff',X0-2,Y0-2,5,5); text(g,nm,tx+1,ty+1,'#050c22',2); text(g,nm,tx,ty,'#b8d0ff',2); } }
  text(g,'WORLD',6,h-15,'#5a7cc0',2);
  R(g,'#3a5aa8',0,0,w,2); R(g,'#3a5aa8',0,h-2,w,2); R(g,'#3a5aa8',0,0,2,h); R(g,'#3a5aa8',w-2,0,2,h);
}); }
/* on the back wall (the one behind you on the platform), poster-sized: 4.4 x 1.8 m at eye height, a thin dark edge */
const MAP_WALL={tokyo:-3.25,hongkong:-7,baikal:-7,london:-7.5,naples:-7,rio:15,vegas:-7};
function addWallMap(k){ const st=ST[k]; if(!st||MAP_WALL[k]==null) return; const H0=st.H0, mh=Math.min(1.85,H0-.9), mw=mh*MAPW/MAPH, y0=Math.min(1.1,H0-mh-.2), x=MAP_WALL[k];
  B(st.back,C('#0a1226'),x,y0-.05,SZ1-.06,mw+.1,mh+.1,.04);
  mk(wplane(mw,mh,mw,mh),M(wallMapTex(k),{emissive:0x404040}),st.back,x,y0+mh/2,SZ1-.1,0,Math.PI,0);
  st.map={x,y:y0+mh/2,z:SZ1-.1,w:mw}; }
