var keys = {};

window.addEventListener("keydown", e => {
  keys[e.key] = 1;

  // toggle crafting
  if((e.key==="c"||e.key==="C") && !e.repeat){
    if (inventoryOpen) return;
    if(craftingOpen && dragItem.id){
      addItem(dragItem.id,dragItem.count);
      dragItem={id:0,count:0};
    }
    craftingOpen = !craftingOpen;
    }

  if((e.key==="i" ||e.key==="I") && !e.repeat) {
    if (craftingOpen) return;
    if(inventoryOpen && dragItem.id) {
      addItem(dragItem.id,dragItem.count);
      dragItem={id:0,count:0}
    }
    inventoryOpen = !inventoryOpen;
  }

  if(e.key>="1"&&e.key<="5") selected = e.key-1;
});

window.addEventListener("keyup", e => {
  keys[e.key] = 0;
});
