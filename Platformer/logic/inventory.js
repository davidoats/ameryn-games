const ITEM_WOOD=1;
const ITEM_SAPLING=2;
const ITEM_AXE=10;
const ITEM_PICK = 200;
const ITEM_STONE = 300;
const ITEM_DIRT = 400;


const ITEM_CRAFT = 100;


const MAX_STACK=999;

let hotbar=[
{id:ITEM_AXE,count:1},
{id:0,count:0},
{id:0,count:0},
{id:0,count:0},
{id:0,count:0}
];

let selected=0;

function addItem(id,count){
for(let s of hotbar){
if(s.id===id && s.count<MAX_STACK){
let add=Math.min(count,MAX_STACK-s.count);
s.count+=add;
return count-add;
}}
for(let s of hotbar){
if(s.id===0){
let add=Math.min(count,MAX_STACK);
s.id=id;s.count=add;
return count-add;
}}
return count;
}
