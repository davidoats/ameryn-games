// ===== PLAYER =====

var p = {x:8000,y:100,w:16,h:32,vx:0,vy:0,onGround:false};

var g=.6, a=.5, max=3, f=.82, jump=-10;

var facing = 1; // 1 = right, -1 = left

// ===== SOLID TILE CHECK =====

function solid(tx,ty){
  if(ty<0||tx<0||tx>=cols||ty>=rows) return false;
  return world[ty][tx] !== 0;
}


// ===== PLAYER UPDATE =====

function updatePlayer(keys){

  // movement
  if(keys.ArrowLeft||keys.a||keys.A) p.vx-=a;
  if(keys.ArrowRight||keys.d||keys.D) p.vx+=a;

  if(p.vx > 0) facing = 1;
  if(p.vx < 0) facing = -1;


  p.vx*=f;
  p.vx=Math.max(-max,Math.min(max,p.vx));

  if((keys[" "]||keys.w||keys.W)&&p.onGround){
    p.vy=jump;
    p.onGround=0;
  }

  p.vy+=g;

  // ===== HORIZONTAL =====

  p.x+=p.vx;

  var L=Math.floor(p.x/tile);
  var R=Math.floor((p.x+p.w-1)/tile);
  var T=Math.floor(p.y/tile);
  var B=Math.floor((p.y+p.h-1)/tile);

  for(let y=T;y<=B;y++){
    if(solid(L,y)||solid(R,y)){
      p.x-=p.vx;
      p.vx=0;
      break;
    }
  }

  // ===== VERTICAL =====

  p.y+=p.vy;
  p.onGround=0;

  L=Math.floor(p.x/tile);
  R=Math.floor((p.x+p.w-1)/tile);
  B=Math.floor((p.y+p.h-1)/tile);

  if(p.vy>=0){
    for(let x=L;x<=R;x++){
      if(solid(x,B+1)){
        p.y=(B+1)*tile-p.h;
        p.vy=0;
        p.onGround=1;
        break;
      }
    }
  }

  if(p.vy<0){
    var T=Math.floor(p.y/tile);
    for(let x=L;x<=R;x++){
      if(solid(x,T)){
        p.y=(T+1)*tile;
        p.vy=0;
        break;
      }
    }
  }
}


// ===== MOUSE INTERACTION =====

canvas.addEventListener("mousedown", e => {

  var rect = canvas.getBoundingClientRect();
  var mx = (e.clientX - rect.left) / zoom + camX;
  var my = (e.clientY - rect.top) / zoom + camY;

  var tx = mx / tile | 0;
  var ty = my / tile | 0;

  if(tx<0||ty<0||tx>=cols||ty>=rows) return;

  var slot = hotbar[selected];

  // ===== BREAK BLOCKS =====

if(e.button===0){

  if(!inReach(tx,ty)) return;
  if(!hasLineOfSight(tx,ty)) return;


// ===== BACKGROUND TREE =====
if(slot.id===ITEM_AXE && bgWorld[ty][tx]){

var t=bgWorld[ty][tx];
bgWorld[ty][tx]=0;

if(t===1) addItem(ITEM_WOOD,1);
if(t===2 && Math.random()<0.05) addItem(ITEM_SAPLING,1);

return;
}

// ===== PLACED WOOD =====
if(slot.id===ITEM_AXE && world[ty][tx]===TILE_WOOD){
world[ty][tx]=0;
addItem(ITEM_WOOD,1);
return;
}

// ===== CRAFT TABLE =====
if(world[ty][tx]===TILE_CRAFT){
world[ty][tx]=0;
addItem(ITEM_CRAFT,1);
return;
}

// ===== DIRT =====
if(world[ty][tx]===TILE_DIRT){
world[ty][tx]=0;
addItem(ITEM_DIRT,1);
return;
}
//grass
if(world[ty][tx]===TILE_GRASS){
world[ty][tx]=0;
addItem(ITEM_DIRT,1);
return;
}

// ===== STONE (pickaxe only) =====
if(slot.id===ITEM_PICK && world[ty][tx]===TILE_STONE){
world[ty][tx]=0;
addItem(ITEM_STONE,1);
return;
}

}

  // ===== PLACE =====

  if(e.button===2 && slot.count>0){

    if(slot.id===ITEM_WOOD){
      world[ty][tx]=TILE_WOOD;
    }
    else if(slot.id===ITEM_CRAFT){
      world[ty][tx]=TILE_CRAFT;
    }
    else if(slot.id===ITEM_STONE){
      world[ty][tx]=TILE_STONE;
    }
    else if(slot.id===ITEM_DIRT){
      world[ty][tx]=TILE_DIRT;
    }

    else if(slot.id===ITEM_SAPLING){
      bgWorld[ty][tx]=1;
      saplings.push({x:tx,y:ty,planted:Date.now()});
    }

    else return;

    slot.count--;
    if(!slot.count) slot.id=0;
  }

});
