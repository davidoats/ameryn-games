let activeSlot = 1;
function saveGame(){
  if (!(activeSlot)) activeSlot =1;
  localStorage.setItem("sandboxSave_slot"+activeSlot, JSON.stringify({
    world,
    bgWorld,
    drops,
    hotbar,
    inventory,
    p,
    selected,
    saplings
  }));
}

function loadGame(slot){
  activeSlot = slot;
  if (!(activeSlot)) slot=1
  let data = localStorage.getItem("sandboxSave_slot"+slot);

  if(!data){
  world=[];
  bgWorld=[];
  drops=[];
  saplings=[];
  inventory=inventoryEmpty;

  generate();
  p.x=4000
  p.y=100;

  hotbar=[
    {id:ITEM_AXE,count:1},
    {id:0,count:0},
    {id:0,count:0},
    {id:0,count:0},
    {id:0,count:0}
  ];

  selected=0;
    return;
  }

  let s = JSON.parse(data);

  world=s.world;
  bgWorld=s.bgWorld;
  drops=s.drops;
  hotbar=s.hotbar;
  inventory=s.inventory;
  selected=s.selected;
  saplings=s.saplings||[];

  p.x=s.p.x;
  p.y=s.p.y;

}

if(!loadGame())generate();

function resetSlot(slot){
  if(!confirm("Reset slot "+slot+"? 💔")) return;

  localStorage.removeItem("sandboxSave_slot"+slot);
  if(slot===activeSlot){
    // rebuild everything
  world=[];
  bgWorld=[];
  drops=[];
  saplings=[];
  inventory=createEmptyInventory();

  generate();
  p.x=4000
  p.y=100;

  hotbar=[
    {id:ITEM_AXE,count:1},
    {id:0,count:0},
    {id:0,count:0},
    {id:0,count:0},
    {id:0,count:0}
  ];

  selected=0;
  saveGame();
  }
}