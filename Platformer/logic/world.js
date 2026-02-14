const tile=16,zoom=2;
const rows=60,cols=1000;

const TILE_DIRT=1;
const TILE_STONE=2; 
const TILE_WOOD=3; // solid placed wood
const TILE_CRAFT = 4; // crafting table block
const TILE_GRASS = 5;


var surfaceHeight = [];

let world=[],bgWorld=[],drops=[];
let saplings=[];

const GROW_TIME=120000;
var decayingLeaves = [];

function rand(n){return Math.sin(n*9999)%1;}
function noise(x){return Math.sin(x*.02)*15+Math.sin(x*.08)*6+(rand(x)-.5)*3;}

function growTree(x,y){
let h=4+Math.floor(rand(x)*3);
for(let i=0;i<h;i++) if(y-i>0) bgWorld[y-i][x]=1;

let top=y-h;
for(let dx=-2;dx<=2;dx++)
for(let dy=-2;dy<=2;dy++)
if(Math.abs(dx)+Math.abs(dy)<4){
let tx=x+dx,ty=top+dy;
if(tx>=0&&tx<cols&&ty>=0&&ty<rows&&bgWorld[ty][tx]==0)
bgWorld[ty][tx]=2;
}}

function updateLeafDecay(){

  // scan for unsupported leaves
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){

      if(bgWorld[y][x] === 2 && !hasTrunkNearby(x,y)){

        let already = decayingLeaves.find(d=>d.x===x && d.y===y);

        if(!already){
          decayingLeaves.push({x,y,t:60}); // frames to live
        }

      }

    }
  }

  // update decay
  decayingLeaves = decayingLeaves.filter(d=>{
    d.t--;

    if(d.t<=0){
      if(bgWorld[d.y][d.x] === 2)
        bgWorld[d.y][d.x] = 0; // vanish leaf
      return false;
    }

    return true;
  });

}

//leave decay
function hasTrunkNearby(x,y){

  for(let dx=-2; dx<=2; dx++){
    for(let dy=-14; dy<=3; dy++){
      let tx=x+dx, ty=y+dy;

      if(tx>=0 && tx<cols && ty>=0 && ty<rows){
        if(bgWorld[ty][tx] === 1) return true;
      }
    }
  }

  return false;
}


function generate(){
for(let y=0;y<rows;y++){
world[y]=[];bgWorld[y]=[];
for(let x=0;x<cols;x++){world[y][x]=0;bgWorld[y][x]=0;}
}

let h=rows/2;

for(let x=0;x<cols;x++){
let target=rows/2+noise(x);
h+=(target-h)*.2;
let height=Math.floor(h);
surfaceHeight[x]=height;

for(let y=height;y<rows;y++)
world[y][x]=(y>height+6)?TILE_STONE:TILE_DIRT;

if(rand(x*7)>.82) growTree(x,height-1);
}

// ===== GRASS PASS (2 block thick) =====

for(let x=0;x<cols;x++){
for(let y=1;y<rows;y++){

// find first exposed dirt
if(world[y][x]===TILE_DIRT && world[y-1][x]===0){

world[y][x]=TILE_GRASS;

// second layer
if(y+1<rows && world[y+1][x]===TILE_DIRT){
world[y+1][x]=TILE_GRASS;
}

break;
}

}
}



}
