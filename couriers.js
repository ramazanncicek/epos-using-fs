const electron = require('electron');
const {ipcRenderer} = electron;

window.addEventListener('load',function(){
  ipcRenderer.send('couriers-loaded');
});

const kurye1 = document.getElementById(`kurye${1}`);
const kurye2 = document.getElementById(`kurye${2}`);
const takeAway = document.getElementById('take-away');
const totalCash = document.getElementById('total-cash-bill');
const totalCard = document.getElementById('total-card-bill');
const courierDisplay = document.getElementById('which-courier');

ipcRenderer.on('couriers-loaded:reply',function(e,arg){
  kurye1.innerText = arg[0].name;
  kurye2.innerText = arg[1].name;
})

if(kurye1!==null){
  kurye1.addEventListener('click',function(){
    ipcRenderer.send('courier:id',"kurye1");
  });
}
if(kurye2!==null){
  kurye2.addEventListener('click',function(){
    ipcRenderer.send('courier:id',"kurye2");
  });
};
if(takeAway!==null){
  takeAway.addEventListener('click',function(){
    ipcRenderer.send('courier:id' , "Gel - Al");
  })
}
// Courier ID for the Window.
ipcRenderer.on('id',function(e,arg){
  courierDisplay.innerText = arg;
});
let info;
ipcRenderer.on('database-a',function(e,arg){
  let courierOrders = document.getElementById('courier-orders');
  let totalCash = 0;
  let totalCard = 0;
  for(let i = 0;i<arg.length;i++){
    info = `
    <tr>
      <td>${i+1}</td>
      <td>${arg[i][0]}</td>
      <td>${arg[i][1]}</td>
      <td>${arg[i][2]}</td>
      <td>${arg[i][3]}</td>
    </tr>
    `;
    if(arg[i][2] == "Nakit") {
      totalCash += parseFloat(arg[i][3]);
    }
    else if(arg[i][2] == "Kredi Kartı") {
      totalCard += parseFloat(arg[i][3]);
    }
    courierOrders.insertAdjacentHTML('beforeend',info);
  }
  let totalCashBill = document.getElementById('total-cash-bill');
  let totalCardBill = document.getElementById('total-card-bill');
  let totalBill = document.getElementById('total-bill');
  totalCashBill.innerHTML = totalCash;
  totalCardBill.innerHTML = totalCard;
  totalBill.innerText = totalCash + totalCard; 
});
ipcRenderer.on('database-c',function(e,arg){
  let courierOrders = document.getElementById('courier-orders');
  let totalCash = 0;
  let totalCard = 0;
  for(let i = 0;i<arg.length;i++){
    info = `
    <tr>
      <td>${i+1}</td>
      <td>${arg[i][0]}</td>
      <td>${arg[i][1]}</td>
      <td>${arg[i][2]}</td>
      <td>${arg[i][3]}</td>
    </tr>
    `;
    if(arg[i][2] == "Nakit") {
      totalCash += parseFloat(arg[i][3]);
    }
    else if(arg[i][2] == "Kredi Kartı") {
      totalCard += parseFloat(arg[i][3]);
    }
    courierOrders.insertAdjacentHTML('beforeend',info);
  }
  let totalCashBill = document.getElementById('total-cash-bill');
  let totalCardBill = document.getElementById('total-card-bill');
  let totalBill = document.getElementById('total-bill');
  totalCashBill.innerText = totalCash;
  totalCardBill.innerText = totalCard;
  totalBill.innerText = totalCash + totalCard;
});
// Gel - Al
ipcRenderer.on('take-away-database',function(e,arg){
  let courierOrders = document.getElementById('courier-orders');
  let totalCash = 0;
  let totalCard = 0;
  for(let i = 0;i<arg.length;i++){
    info = `
    <tr>
      <td>${i+1}</td>
      <td>${arg[i]["Customer Name"]}</td>
      <td>${arg[i]["Customer Address"]}</td>
      <td>${arg[i]["Payment"]}</td>
      <td>${arg[i]["Total Price"]}</td>
    </tr>
    `;
    if(arg[i]["Payment"] == "Nakit") {
      totalCash += parseFloat(arg[i]["Total Price"]);
    }
    else if(arg[i]["Payment"] == "Kredi Kartı") {
      totalCard += parseFloat(arg[i]["Total Price"]);
    }
    courierOrders.insertAdjacentHTML('beforeend',info);
  }
  let totalCashBill = document.getElementById('total-cash-bill');
  let totalCardBill = document.getElementById('total-card-bill');
  let totalBill = document.getElementById('total-bill');
  totalCashBill.innerHTML = totalCash;
  totalCardBill.innerHTML = totalCard;
  totalBill.innerText = totalCash + totalCard; 
});
// Gel - Al 

const dailyOrdersClick = document.getElementById('daily-orders-click')
if(dailyOrdersClick !== null) {
  dailyOrdersClick.addEventListener('click',function(){
    ipcRenderer.send('daily-orders-click',dailyOrdersClick.innerText);
  });
}
// End of the day, clear the logs of a courier.
let payTheBills = document.getElementById('pay-the-bills');
if(payTheBills !== null) {
  payTheBills.addEventListener('click',function(){
    let courierID = courierDisplay.innerText;
    let isValidated = ipcRenderer.send('shall-pay-bills',courierID);
    // if(isValidated){
    //   console.log(isValidated);
    //   ipcRenderer.send('pay-the-bills',courierID);
    // }
  });
};
// Send By Number below
let sendByNumber = document.getElementById('send-by-number');
if (sendByNumber !== null) {
  sendByNumber.addEventListener('click',function(){
    ipcRenderer.send('send-by-number');
});
};
// All Debts Below
let allDebts = document.getElementById('all-debts');
if(allDebts !== null) {
  allDebts.addEventListener('click',function(){
    ipcRenderer.send('all-debts');
  })
};
// Upgrading the prices below
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

