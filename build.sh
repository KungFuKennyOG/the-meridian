#!/bin/bash
# Builds index.html from src/: the head (HTML/CSS), then every .js in name order, all in one <script>.
# Never edit index.html by hand.
set -e
cd "$(dirname "$0")"
python3 - <<'PY'
import glob
parts=[open(f).read() for f in sorted(glob.glob('src/*.js'))]
html=open('src/00-head.html').read()+'\n'.join(parts)+'\n</script>\n'
open('index.html','w').write(html)
# the art set: the same build opened as a viewer (no fighting, orbit camera, a card per car, station and crew)
open('art.html','w').write(html.replace('<script>','<script>window.MERIDIAN_ART=1;</script>\n<script>',1).replace('<title>The Meridian 24</title>','<title>Meridian 24 Art Set</title>',1))
PY
node -e "const fs=require('fs');const s=fs.readFileSync('index.html','utf8');const js=s.split('<script>')[1].split('</script>')[0];try{new Function(js);console.log('index.html syntax ok',(s.length/1024|0)+' KB')}catch(e){console.log('index.html SYNTAX',e.message);process.exit(1)}"
