document.addEventListener("contextmenu",e=>e.preventDefault());

var mouseX=0,mouseY=0;

canvas.addEventListener("mousemove",e=>{
  mouseX=e.offsetX;
  mouseY=e.offsetY;
});


let camX=0,camY=0;
const worldW=cols*tile,worldH=rows*tile;


// ===== WORLD DRAW =====

function drawBG(){
  for(let y=0;y<rows;y++)
  for(let x=0;x<cols;x++){
    let t=bgWorld[y][x];
    if(!t)continue;
  ctx.fillStyle=t==1?"#6B4423":"#2ECC40";
  ctx.fillRect((x*tile-camX)*zoom,(y*tile-camY)*zoom,tile*zoom +1,tile*zoom +1);
  }
}  

function drawWorld(){
  for(let y=0;y<rows;y++)
  for(let x=0;x<cols;x++){
    let t=world[y][x];
    if(!t)continue;

    ctx.fillStyle =
    t==TILE_GRASS ? "#3cb043" :
    t==TILE_IRON ? "#d6d6d6" :
    t==TILE_DIRT ? "#8B4513" :
    t==TILE_STONE ? "#555" :
    t==TILE_WOOD ? "#6B4423" :
    "#C48A3A"; 

    ctx.fillRect((x*tile-camX)*zoom,(y*tile-camY)*zoom,tile*zoom +1,tile*zoom +1);
  }
}

// ===== PLAYER =====

function drawPlayer(){

  let x=(p.x-camX)*zoom;
  let y=(p.y-camY)*zoom;
  let w=p.w*zoom;
  let h=p.h*zoom;

  let img=textures["player"];
  ctx.save();

  if(facing === -1){
    ctx.translate(x+w, y);
    ctx.scale(-1, 1);
    x = 0;
    y = 0;
  }

  if (img instanceof Image){
    ctx.drawImage(img, x, y, w, h);
  } else{
    ctx.fillStyle="red";
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

// ===== HOTBAR =====

function drawHotbar(){
  let size=50,start=canvas.width/2-size*2.5,y=canvas.height-60;

  for(let i=0;i<5;i++){
    let s=hotbar[i];
    ctx.fillStyle=i==selected?"#FFD700":"#555";
    ctx.fillRect(start+i*size,y,size-4,size-4);

    ctx.fillStyle =
    s.id==ITEM_PICK ? "#999999" :
    s.id==ITEM_SWORD ? "#2f43dd" :
    s.id==ITEM_AXE ? "#C0392B" :
    s.id==ITEM_WOOD ? "#6B4423" :
    s.id==ITEM_IRON ? "#d6d6d6" :
    s.id==ITEM_SAPLING ? "#2ECC40" :
    s.id==ITEM_CRAFT ? "#C48A3A" :
    s.id==ITEM_STONE ? "#777777" :
    s.id==ITEM_DIRT ? "#8B4513" :
    s.id==ITEM_HOE ? "#698459" :

    "#222";

    ctx.fillRect(start+i*size+10,y+10,30,30);

    if(s.count>1){
      ctx.fillStyle="white";
      ctx.font="16px Arial";
      ctx.fillText(s.count,start+i*size+5,y+45);
    }
  }
}

function drawBackdrop(){
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0,0,canvas.width,canvas.height);
};

// ===== ITEM DRAW =====
function drawItem(slot,x,y,size){
  ctx.fillStyle =
    slot.id==ITEM_PICK ? "#999999" :
    slot.id==ITEM_SWORD ? "#2f43dd" :
    slot.id==ITEM_STONE ? "#777777" : 
    slot.id==ITEM_AXE ? "#C0392B" :
    slot.id==ITEM_IRON ? "#d6d6d6" :
    slot.id==ITEM_WOOD ? "#6B4423" :
    slot.id==ITEM_SAPLING ? "#2ECC40" :
    slot.id==ITEM_CRAFT ? "#C48A3A" :
    slot.id==ITEM_DIRT ? "#8B4513" :
    slot.id==ITEM_HOE ? "#698459" :
    "#222";

  ctx.fillRect(x+10,y+10,size-20,size-20);

  if(slot.count>1){
    ctx.fillStyle="white";
    ctx.font="14px Arial";
    ctx.fillText(slot.count,x+4,y+size-4);
  }
}

// ===== CRAFTING UI =====

function drawCrafting(){
  if(!craftingOpen) return;

  var size=activeGridSize();
  var cell=60;

  var startX=canvas.width/2-cell*size/2;
  var startY=canvas.height/2-cell*size/2;

  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      let i=y*3+x;
      let px=startX+x*cell;
      let py=startY+y*cell;
      ctx.fillStyle="#444";
      ctx.fillRect(px,py,cell-4,cell-4);
      drawItem(craftGrid[i],px,py,cell);
    }
  }

  // result positioned relative to grid
  var rx=startX+size*cell+40;
  var ry=startY+(size*cell)/2-30;

  ctx.fillStyle="#FFD700";
  ctx.fillRect(rx,ry,56,56);
  drawItem(craftResult,rx,ry,60);

  // label
  ctx.fillStyle="white";
  ctx.font="20px Arial";
  ctx.fillText("Crafting",startX,startY-10);
}

// ===== DRAG CURSOR =====

function drawDragItem(){
  if(!dragItem.id) return;
  drawItem(dragItem,mouseX-25,mouseY-25,50);
}

// ===== MAIN DRAW =====

function draw(){
  drawBackdrop();
  drawBG();
  drawWorld();
  drawPlayer();
  drawHotbar();
  drawCrafting();
  drawDragItem();
}