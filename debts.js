const electron = require('electron');
const {ipcRenderer,dialog} = electron;

let allDebtsTable = document.getElementById('all-debts-table');

ipcRenderer.on('all-debts-load',function(e,arg){
    console.log(arg);
    console.log(arg[0]["Customer Name"]);
    for(let i = 0;i<arg.length;i++){
        console.log(arg[i]);
        let fullOrder = `<tr class = "all-debts-trs">
        <td class = "debts-customer-id">${i+1}</td>
        <td class="debts-customer-name">${arg[i]["Customer Name"]}</td>
        <td class="debts-customer-address">${arg[i]["Customer Address"]}</td>
        <td class="debts-customer-total-price">${arg[i]["Total Price"]}</td>
        <td class="debts-customer-payment">${arg[i]["Payment"]}</td>
        <td><button class = "debt-paid">Ödeme Alındı</button></td>
        </tr>`;
        // allDebtsTable.insertAdjacentHTML('beforeend',fullOrder);
    }
});

let upgradePriceTable = document.getElementById('upgrade-price-table');
let displayMenu = document.getElementById('display-menu');
let displayEt = document.getElementById('display-et');
let displayTavuk = document.getElementById('display-tavuk');
let displayTost = document.getElementById('display-tost');
let displayKofte = document.getElementById('display-kofte');
let displayİcecek = document.getElementById('display-icecek');
if(displayMenu !== null) {
    displayMenu.addEventListener('click',function(){
        let hiddenMenus = document.getElementById('menu-displayed');
        // hiddenMenus.classList.toggle('menu-displayed');
        // ipcRenderer.send('upgrade:display-menu');
        if(hiddenMenus.style.display === "none") {
            hiddenMenus.style.display = "block";
        }
        else {
            hiddenMenus.style.display = "none";
        }
    })
};
if(displayEt !== null) {
    displayEt.addEventListener('click',function(){
        let hiddenEt = document.getElementById('et-displayed-screen');
        if(hiddenEt.style.display ==="none"){
            hiddenEt.style.display = "block";
        }
        else{
            hiddenEt.style.display = "none";
        }
        // ipcRenderer.send('upgrade:display-et');
    })
};
if(displayTavuk !== null) {
    displayTavuk.addEventListener('click',function(){
        let hiddenTavuk = document.getElementById('tavuk-displayed-screen');
        hiddenTavuk.classList.toggle('menu-displayed');
        // ipcRenderer.send('upgrade:display-tavuk');
    })
};
if(displayTost !== null) {
    displayTost.addEventListener('click',function(){
        let hiddenTost = document.getElementById('tost-displayed-screen');
        hiddenTost.style.display = "block";
        // ipcRenderer.send('upgrade:display-tost');
    })
};
if(displayKofte !== null) {
    displayKofte.addEventListener('click',function(){
        ipcRenderer.send('upgrade:display-kofte');
    })
};
if(displayİcecek !== null) {
    displayİcecek.addEventListener('click',function(){
        ipcRenderer.send('upgrade:display-icecek');
    })
};
