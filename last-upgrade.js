const electron = require('electron');
const {ipcRenderer,dialog} = electron;

//Start

let item1 = document.getElementById('id:item-1');
let item2 = document.getElementById('id:item-2');
let item3 = document.getElementById('id:item-3');
let item4 = document.getElementById('id:item-4');
let item5 = document.getElementById('id:item-5');
let item6 = document.getElementById('id:item-6');
// Break
let ul1 = document.getElementById('table-1');
let ul2 = document.getElementById('table-2');
let ul3 = document.getElementById('table-3');
let ul4 = document.getElementById('table-4');
let ul5 = document.getElementById('table-5');
let ul6 = document.getElementById('table-6');
// Break
ul1.style.display = "none";
ul2.style.display = "none";
ul3.style.display = "none";
ul4.style.display = "none";
ul5.style.display = "none";
ul6.style.display = "none";
// Break
item1.addEventListener('click',function(){
    ul2.style.display = "none";
    ul3.style.display = "none";
    ul4.style.display = "none";
    ul5.style.display = "none";
    ul6.style.display = "none";
    if(ul1.style.display === "none") {
        ul1.style.display ="block";
    }
    else {
        ul1.style.display = "none";
    }
});
// B
item2.addEventListener('click',function(){
    ul1.style.display = "none";
    ul3.style.display = "none";
    ul4.style.display = "none";
    ul5.style.display = "none";
    ul6.style.display = "none";
    if(ul2.style.display === "none") {
        ul2.style.display ="block";
    }
    else {
        ul2.style.display = "none";
    }
})
// B
item3.addEventListener('click',function(){
    ul1.style.display = "none";
    ul2.style.display = "none";
    ul4.style.display = "none";
    ul5.style.display = "none";
    ul6.style.display = "none";
    if(ul3.style.display === "none") {
        ul3.style.display ="block";
    }
    else {
        ul3.style.display = "none";
    }
})
// B
item4.addEventListener('click',function(){
    ul1.style.display = "none";
    ul2.style.display = "none";
    ul3.style.display = "none";
    ul5.style.display = "none";
    ul6.style.display = "none";
    if(ul4.style.display === "none") {
        ul4.style.display ="block";
    }
    else {
        ul4.style.display = "none";
    }
})
// B
item5.addEventListener('click',function(){
    ul2.style.display = "none";
    ul3.style.display = "none";
    ul4.style.display = "none";
    ul1.style.display = "none";
    ul6.style.display = "none";
    if(ul5.style.display === "none") {
        ul5.style.display ="block";
    }
    else {
        ul5.style.display = "none";
    }
})
// B
item6.addEventListener('click',function(){
    ul1.style.display = "none";
    ul2.style.display = "none";
    ul3.style.display = "none";
    ul4.style.display = "none";
    ul5.style.display = "none";
    if(ul6.style.display === "none") {
        ul6.style.display ="block";
    }
    else {
        ul6.style.display = "none";
    }
});
// Assigning new prices elements
let allAssignButtons = document.getElementsByClassName('assign-price-button');
for(let prop of allAssignButtons){
    prop.addEventListener('click',function(){
        let newPriceFood = prop.parentNode.parentNode.querySelector('.new-price-for').innerText;
        let newPriceData = prop.parentNode.parentNode.querySelector('.new-price-data').value;
        let allElements = [newPriceFood,newPriceData];
        ipcRenderer.send('assigned:new-price',allElements);
    })
}