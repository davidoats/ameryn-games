function hasLineOfSight(tx,ty){
  let px=(p.x+p.w/2)/tile;
  let py=(p.y+p.h/2)/tile;
  let dx=tx+0.5-px;
  let dy=ty+0.5-py;
  let dist=Math.hypot(dx,dy);
  let steps=dist*4;

  for(let i=0;i<steps;i++){
    let t=i/steps;
    let x=px+dx*t;
    let y=py+dy*t;

    let ix=Math.floor(x);
    let iy=Math.floor(y);

    if(ix===tx && iy===ty) return true;
    if(world[iy] && world[iy][ix]){
      return false;
    }
  }

  return true;
}

function inReach(tx,ty){
  let px=Math.floor((p.x+p.w/2)/tile);
  let py=Math.floor((p.y+p.h/2)/tile);
  return Math.abs(px-tx)<=6 && Math.abs(py-ty)<=6;
}
