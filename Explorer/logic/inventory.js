// Items
const ITEM_WOOD=1;
const ITEM_SAPLING=2;
const ITEM_AXE=10;
const ITEM_PICK = 200;
const ITEM_STONE = 300;
const ITEM_DIRT = 400;
const ITEM_IRON = 500;
const ITEM_CRAFT = 100;
const ITEM_SWORD = 600;
const ITEM_HOE = 700;

const MAX_STACK=999;
let selected=0;

let hotbar=[
  {id:ITEM_AXE,count:1},
  {id:0,count:0},
  {id:0,count:0},
  {id:0,count:0},
  {id:0,count:0}
];

//===== INVENTORY ======
var inventoryOpen=false;
dragItem={id:0,count:0};

function createEmptyInventory(){
  let arr=[];
  for(let i=0;i<15;i++){
    arr.push({id:0,count:0});
  }
  return arr;
}

let inventory = createEmptyInventory();

canvas.addEventListener("mousedown", e => {
  if(!inventoryOpen) return;
  var mx=e.offsetX,my=e.offsetY;

  // ===== HOTBAR =====
  var hbSize=50;
  var hbStart=canvas.width/2-hbSize*2.5;
  var hbY=canvas.height-60;

  for(let i=0;i<5;i++){
    let x=hbStart+i*hbSize;

    if(mx>x && mx<x+hbSize && my>hbY && my<hbY+hbSize){
      clickSlot(hotbar[i]);
      return;
    }
  }

  // ===== GRID =====
  let cell=60;
  let startX=canvas.width/2-cell*5/2;
  let startY=canvas.height/2-cell*3/2;

  for(let y=0;y<3;y++){
    for(let x=0;x<5;x++){

      let i = y*5 + x;
      let px=startX+x*cell; 
      let py=startY+y*cell;

      if(mx>px && mx<px+cell && my>py && my<py+cell){
        clickSlot(inventory[i]);
        return;
      }
    }
  }

});




//===== ADD ITEM ======
function addItem(id,count){
  for(let s of hotbar){
    if(s.id===id && s.count<MAX_STACK){
      let add=Math.min(count,MAX_STACK-s.count);
      s.count+=add;
      return count-add;
    }
  }
  for(let s of hotbar){
    if(s.id===0){
      let add=Math.min(count,MAX_STACK);
      s.id=id;s.count=add;
      return count-add;
    }
  }
  return count;
}