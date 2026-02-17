function updateWorld(){
  updateLeafDecay();

  let now=Date.now();

  saplings=saplings.filter(s=>{
    if(now-s.planted>GROW_TIME){
    growTree(s.x,s.y);
    return false;
    }
    return true;
  });

  let vw=canvas.width/zoom,vh=canvas.height/zoom;
  camX=Math.max(0,Math.min(p.x-vw/2,worldW-vw));
  camY=Math.max(0,Math.min(p.y-vh/2,worldH-vh));
}

function loop(){
  updatePlayer(keys);
  updateWorld();
  saveGame();
  draw();
  requestAnimationFrame(loop);
}

loop();
