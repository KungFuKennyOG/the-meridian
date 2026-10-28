/* ---------- 11 · Izakaya Hanami: leaving Tokyo by day, Tanaka & Associates (placeholder: the art pass builds this) ---------- */
CAR_BUILD.izakaya=function izakaya(){
  const g=shell('izakaya',{floor:C('#6a4a2e'),ceil:C('#2a2420'),dado:C('#5a2a1e'),upper:C('#e8d8b0'),pier:C('#e8d8b0'),trim:C('#3a2a1e'),end:C('#5a2a1e'),
    wins:[[-11,-8.2],[-5.6,-2.8],[2.8,5.6],[8.2,11]],lamps:[lamp(-8,2.8,0,[1.1,.7,.4],7),lamp(0,2.8,0,[1.1,.7,.4],7),lamp(8,2.8,0,[1.1,.7,.4],7)]});
  WG.izakaya.spots={tanaka:{x:8,z:0,ry:-Math.PI/2},tanaka_c1:{x:-4,z:1.2,ry:-Math.PI/2},tanakab_1:{x:0,z:-1.2,ry:-Math.PI/2},tanaka_c2:{x:4,z:1.4,ry:-Math.PI/2},tanakab_2:{x:5.5,z:-1.3,ry:-Math.PI/2}};
};
