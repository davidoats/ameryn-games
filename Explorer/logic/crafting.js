// ===== CRAFTING =====
var craftingOpen=false;
var craftGrid=new Array(9).fill(0).map(()=>({id:0,count:0}));
var craftResult={id:0,count:0};
var dragItem={id:0,count:0};

// ===== RECIPES =====

var recipes=[
  {
    pattern:[
      ITEM_WOOD,ITEM_WOOD,0,
      ITEM_WOOD,ITEM_WOOD,0,
      0        ,0        ,0
    ],
    result:{id:ITEM_CRAFT,count:1}
  },

  {
    pattern:[
      ITEM_WOOD,ITEM_WOOD,ITEM_WOOD,
      0        ,ITEM_WOOD,0        ,
      0        ,ITEM_WOOD,0
    ],
    result:{id:ITEM_PICK,count:1}
  },

  {
    pattern:[
      0,ITEM_IRON,0,
      0,ITEM_IRON,0,
      0,ITEM_WOOD,0
    ],
    result:{id:ITEM_SWORD,count:1}
  },

  {
    pattern:[
      ITEM_IRON,ITEM_IRON,0,
      0.       ,ITEM_WOOD,0,
      0        ,ITEM_WOOD,0
    ],
    result:{id:ITEM_HOE,count:1}
  }
];

// ===== GRID SIZE =====
function nearCraftTable(){
  var px=Math.floor((p.x+p.w/2)/tile);
  var py=Math.floor((p.y+p.h/2)/tile);

  for(let dx=-2;dx<=2;dx++){
    for(let dy=-2;dy<=2;dy++){
      let tx=px+dx;
      let ty=py+dy;

      if(tx>=0&&ty>=0&&tx<cols&&ty<rows){
        if(world[ty][tx]===TILE_CRAFT) return true;
      }
    }
  }
  return false;
}

function activeGridSize(){
  return nearCraftTable()?3:2;
}

// ===== CHECK RECIPES =====
function updateCrafting(){
  let size=activeGridSize();

  for(let r of recipes){
    let match=true;

    for(let y=0;y<size;y++){
      for(let x=0;x<size;x++){
        let i=y*3+x;
        if(craftGrid[i].id!==r.pattern[i]){
          match=false;
          break;
        }
      }
    }

    if(match){
      craftResult={id:r.result.id,count:r.result.count};
      return;
    }
  }

  craftResult={id:0,count:0};
}

// ===== TAKE RESULT =====
function takeCraftResult(){
  if(!craftResult.id) return;
  addItem(craftResult.id,craftResult.count);

  let size=activeGridSize();

  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      let i=y*3+x;

      craftGrid[i].count--;
      if(craftGrid[i].count<=0){
        craftGrid[i]={id:0,count:0};
      }
    }
  }
  updateCrafting();
}

// ===== SLOT CLICK =====
function clickSlot(slot){
  // pick up 1
  if(dragItem.id===0 && slot.id!==0){
    dragItem.id=slot.id;
    dragItem.count=1;
    slot.count--;
    if(slot.count<=0) slot.id=0;
    return;
  }
  // place 1
  if(dragItem.id===slot.id && slot.count<MAX_STACK){
    slot.count++;
    dragItem.count--;

    if(dragItem.count<=0){
      dragItem.id=0;
      dragItem.count=0;
    }
    return;
  }
  // swap
  if(dragItem.id!==slot.id){
    swap(slot,dragItem);
  }
}

// ===== SWAP =====
function swap(a,b){
  var t={id:a.id,count:a.count};
  a.id=b.id;a.count=b.count;
  b.id=t.id;b.count=t.count;
}

// ===== MOUSE =====

canvas.addEventListener("mousedown", e => {
  if(!craftingOpen) return;

  var mx=e.offsetX,my=e.offsetY;

  // ===== HOTBAR =====
  var hbSize=50;
  var hbStart=canvas.width/2-hbSize*2.5;
  var hbY=canvas.height-60;

  for(let i=0;i<5;i++){
    let x=hbStart+i*hbSize;

    if(mx>x && mx<x+hbSize && my>hbY && my<hbY+hbSize){
      clickSlot(hotbar[i]);
      updateCrafting();
      return;
    }
  }

  // ===== GRID =====
  let size=activeGridSize();
  let cell=60;
  let startX=canvas.width/2-cell*size/2;
  let startY=canvas.height/2-cell*size/2;

  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){

      let i=y*3+x;
      let px=startX+x*cell;
      let py=startY+y*cell;

      if(mx>px && mx<px+cell && my>py && my<py+cell){
        clickSlot(craftGrid[i]);
        updateCrafting();
        return;
      }
    }
  }

  // ===== RESULT SLOT (aligned with render.js) =====
  var rx=startX+size*cell+40;
  var ry=startY+(size*cell)/2-30;

  if(mx>rx && mx<rx+60 && my>ry && my<ry+60){
    takeCraftResult();
    return;
  }
});
