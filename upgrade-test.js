let item1 = document.getElementById('id:item-1');
let item2 = document.getElementById('id:item-2');
let item3 = document.getElementById('id:item-3');
let item4 = document.getElementById('id:item-4');
let item5 = document.getElementById('id:item-5');
// Break
let ul1 = document.getElementById('ul-1');
let ul2 = document.getElementById('ul-2');
let ul3 = document.getElementById('ul-3');
let ul4 = document.getElementById('ul-4');
let ul5 = document.getElementById('ul-5');
// Break
ul1.style.display = "none";
ul2.style.display = "none";
ul3.style.display = "none";
ul4.style.display = "none";
ul5.style.display = "none";
item1.addEventListener('click',function(){
    if(ul1.style.display === "none") {
        ul1.style.display ="block";
    }
    else {
        ul1.style.display = "none";
    }
});
// B
item2.addEventListener('click',function(){
    if(ul2.style.display === "none") {
        ul2.style.display ="block";
    }
    else {
        ul2.style.display = "none";
    }
})
// B
item3.addEventListener('click',function(){
    if(ul3.style.display === "none") {
        ul3.style.display ="block";
    }
    else {
        ul3.style.display = "none";
    }
})
// B
item4.addEventListener('click',function(){
    if(ul4.style.display === "none") {
        ul4.style.display ="block";
    }
    else {
        ul4.style.display = "none";
    }
})
// B
item5.addEventListener('click',function(){
    if(ul5.style.display === "none") {
        ul5.style.display ="block";
    }
    else {
        ul5.style.display = "none";
    }
})