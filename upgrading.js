const electron = require('electron');
const {ipcRenderer,dialog} = electron;

let upgradePriceTable = document.getElementById('upgrade-price-table');
let displayMenu = document.getElementById('display-menu');
let displayEt = document.getElementById('display-et');
let displayTavuk = document.getElementById('display-tavuk');
let displayTost = document.getElementById('display-tost');
let displayKofte = document.getElementById('display-kofte');
let displayIcecek = document.getElementById('display-icecek');
// Break
let hiddenMenus = document.getElementById('menu-displayed');
let hiddenEt = document.getElementById('et-displayed-screen');
let hiddenTavuk = document.getElementById('tavuk-displayed-screen');
let hiddenTost = document.getElementById('tost-displayed-screen');
let hiddenKofte = document.getElementById('kofte-displayed-screen');
let hiddenIcecek = document.getElementById('icecek-displayed-screen');
hiddenMenus.style.display = "none";
hiddenEt.style.display = "none";
hiddenTavuk.style.display = "none";
hiddenTost.style.display = "none";
hiddenKofte.style.display = "none";
hiddenIcecek.style.display = "none";

// Menus
displayMenu.addEventListener('click',function(){
    if(hiddenMenus.style.display === "none") {
        hiddenMenus.style.display = "block";
    }
    else {
        hiddenMenus.style.display = "none";
    }
});
// Et
displayEt.addEventListener('click',function(){
    if(hiddenEt.style.display ==="none"){
        hiddenEt.style.display = "block";
    }
    else{
        hiddenEt.style.display = "none";
    }
})
// Tavuk
displayTavuk.addEventListener('click',function(){
    if(hiddenTavuk.style.display === "none") {
        hiddenTavuk.style.display = "block";
    }
    else {
        hiddenTavuk.style.display = "none";
    }
});
// Tost
displayTost.addEventListener('click',function(){
    if(hiddenTost.style.display === "none") {
        hiddenTost.style.display = "block";
    }
    else {
        hiddenTost.style.display = "none";
    }
});
// Kofte
displayKofte.addEventListener('click',function(){
    if(hiddenKofte.style.display === "none") {
        hiddenKofte.style.display = "block";
    }
    else {
        hiddenKofte.style.display = "none";
    }
});
// Icecek
displayIcecek.addEventListener('click',function(){
    if(hiddenIcecek.style.display === "none") {
        hiddenIcecek.style.display = "block";
    }
    else {
        hiddenIcecek.style.display = "none";
    }
})