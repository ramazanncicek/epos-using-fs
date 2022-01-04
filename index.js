const electron = require('electron');
const {ipcRenderer} = electron;
const dailyOrdersClick = document.getElementById('daily-orders-click')
    if(dailyOrdersClick !== null) {
      dailyOrdersClick.addEventListener('click',function(){
        ipcRenderer.send('daily-orders-click',dailyOrdersClick.innerText);
      });
    }
    let sendByNumber = document.getElementById('send-by-number');
    if (sendByNumber !== null) {
    sendByNumber.addEventListener('click',function(){
    ipcRenderer.send('send-by-number');
    });
    };
    let upgradePrice = document.getElementById('upgrade-price');
    if(upgradePrice !== null) {
    upgradePrice.addEventListener('click',function(){
        ipcRenderer.send('upgrade-price');
    })
    };
// Upgrade Couriers
let updateCouriers = document.getElementById('update-couriers');
if(upgradePrice !== null) {
    updateCouriers.addEventListener('click',function(){
    ipcRenderer.send('update-couriers');
    })    
}