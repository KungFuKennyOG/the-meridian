/* ---------- 03 · Sushi Bar Kaiten: the Pacific tunnel, Kagami-gumi sleepers (placeholder: the art pass builds this) ---------- */
CAR_BUILD.sushi=function sushi(){
  const g=shell('sushi',{floor:C('#3a3430'),ceil:C('#e8e4d8'),dado:C('#a87a4a'),upper:C('#e8e4d8'),pier:C('#e8e4d8'),trim:C('#2a2420'),end:C('#a87a4a'),
    wins:[[-12.4,12.4]],lamps:[lamp(-8,2.8,0,[1,.95,.85],7),lamp(0,2.8,0,[1,.95,.85],7),lamp(8,2.8,0,[1,.95,.85],7)]});
  WG.sushi.spots={chefc_1:{x:-3,z:.6,ry:-Math.PI/2},chefc_2:{x:2,z:-.6,ry:-Math.PI/2},chefc_3:{x:6,z:.8,ry:-Math.PI/2},chefc_4:{x:9.5,z:-.5,ry:-Math.PI/2}};
};
