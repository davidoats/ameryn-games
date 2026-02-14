var keys = {};

window.addEventListener("keydown", e => {

keys[e.key] = 1;

// toggle crafting
if((e.key==="c"||e.key==="C") && !e.repeat){

if(craftingOpen && dragItem.id){
addItem(dragItem.id,dragItem.count);
dragItem={id:0,count:0};
}

craftingOpen = !craftingOpen;
}


if(e.key>="1"&&e.key<="5")
selected = e.key-1;

});

window.addEventListener("keyup", e => {
keys[e.key] = 0;
});
