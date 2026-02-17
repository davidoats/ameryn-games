var activeSlot = 1;

function saveGame(){
  localStorage.setItem("sandboxSave_slot"+activeSlot, JSON.stringify({
    world,
    bgWorld,
    drops,
    hotbar,
    p,
    selected,
    saplings
  }));
}

function loadGame(slot){
  activeSlot = slot;
  let data = localStorage.getItem("sandboxSave_slot"+slot);

  if(!data){
    generate();
    return;
  }

  let s = JSON.parse(data);

  world=s.world;
  bgWorld=s.bgWorld;
  drops=s.drops;
  hotbar=s.hotbar;
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