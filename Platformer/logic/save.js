function saveGame(){
  localStorage.setItem("sandboxSave",JSON.stringify({
    world,bgWorld,drops,hotbar,p,selected,saplings
  }));
}

function loadGame(){
  let data=localStorage.getItem("sandboxSave");
  if(!data)return false;
  let s=JSON.parse(data);

  world=s.world;
  bgWorld=s.bgWorld;
  drops=s.drops;
  hotbar=s.hotbar;
  selected=s.selected;
  saplings=s.saplings||[];

  p.x=s.p.x;
  p.y=s.p.y;

  return true;
}

if(!loadGame())generate();

function resetWorld(){

if(!confirm("Reset world? This cannot be undone 💔")) return;

localStorage.removeItem("sandboxSave");

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

