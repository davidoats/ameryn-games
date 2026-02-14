// ===== TEXTURE MANAGER =====

var textures = {};

function loadTexture(name){

let img = new Image();
img.src = "./textures/" + name + ".png";

img.onload = () => {
textures[name] = img;
};

img.onerror = () => {
delete textures[name]; // force fallback
};

}


// ===== REGISTER TEXTURES =====

function loadTextures(){

[
"dirt",
"grass",
"stone",
"wood",
"sapling",
"craft",
"pickaxe",
"axe",
"player"
].forEach(loadTexture);

}

loadTextures();


// ===== DRAW HELPER =====

function drawTexture(name,x,y,size,fallback){

let img = textures[name];

if(img instanceof Image){
ctx.drawImage(img,x,y,size,size);
}else{
ctx.fillStyle = fallback;
ctx.fillRect(x,y,size,size);
}

}
