const { BrowserWindow } = require('electron');
const electron = require('electron');
const {ipcRenderer} = electron;

const dailyOrderDiv = document.getElementById('daily-order-div');
const dailyOrderTable = document.getElementById('daily-order-table');
const dailyOrdersClick = document.getElementById('daily-orders-click');
const newCustomerRegister = document.getElementById('new-customer-reg');
newCustomerRegister.addEventListener('click',function(){
    ipcRenderer.send('customer:new');
});
// Getting Couriers List Below
let couriersList = [];
window.addEventListener('load',function(){
    ipcRenderer.send('couriers-loaded');
  });
ipcRenderer.on('couriers-loaded:reply',function(e,arg){
    couriersList = arg;
  })


ipcRenderer.on('order-away-confirmed',function(e,arg){
    for(let i = 0;i<arg.length;i++){
        if(arg[i]['Assigned'] == "kurye1") {
            let fullOrder = `<tr class = "all-orders-trs">
        <td class = "ordered-order-id">${arg[i]['Order ID']}</td>
        <td class="ordered-customer-name">${arg[i]["Customer Name"]}</td>
        <td class="ordered-customer-address">${arg[i]["Customer Address"]}</td>
        <td class="ordered-customer-address">${arg[i]["Order Time"]}</td>
        <td class="ordered-customer-total-price">${arg[i]["Total Price"]}</td>
        <td class="ordered-customer-payment">${arg[i]["Payment"]}</td>
        <td>${couriersList[0].name}</td>
        </tr>`;
        dailyOrderTable.insertAdjacentHTML('beforeend',fullOrder);
        }
        else if(arg[i]['Assigned'] == "kurye2") {
            let fullOrder = `<tr class = "all-orders-trs">
        <td class = "ordered-order-id">${arg[i]['Order ID']}</td>
        <td class="ordered-customer-name">${arg[i]["Customer Name"]}</td>
        <td class="ordered-customer-address">${arg[i]["Customer Address"]}</td>
        <td class="ordered-customer-address">${arg[i]["Order Time"]}</td>
        <td class="ordered-customer-total-price">${arg[i]["Total Price"]}</td>
        <td class="ordered-customer-payment">${arg[i]["Payment"]}</td>
        <td>${couriersList[1].name}</td>
        </tr>`;
        dailyOrderTable.insertAdjacentHTML('beforeend',fullOrder);
        }
        else if(arg[i]["Customer Number"] === "-"){
            let fullOrder = `<tr class = "all-orders-trs">
        <td class = "ordered-order-id">${arg[i]['Order ID']}</td>
        <td class="ordered-customer-name">${arg[i]["Customer Name"]}</td>
        <td class="ordered-customer-address">${arg[i]["Customer Address"]}</td>
        <td class="ordered-customer-address">${arg[i]["Order Time"]}</td>
        <td class="ordered-customer-total-price">${arg[i]["Total Price"]}</td>
        <td class="ordered-customer-payment">${arg[i]["Payment"]}</td>
        <td></td>
        </tr>`;
        dailyOrderTable.insertAdjacentHTML('beforeend',fullOrder);
        }
        else {
            let fullOrder = `<tr class = "all-orders-trs">
        <td class = "ordered-order-id">${arg[i]['Order ID']}</td>
        <td class="ordered-customer-name">${arg[i]["Customer Name"]}</td>
        <td class="ordered-customer-address">${arg[i]["Customer Address"]}</td>
        <td class="ordered-customer-address">${arg[i]["Order Time"]}</td>
        <td class="ordered-customer-total-price">${arg[i]["Total Price"]}</td>
        <td class="ordered-customer-payment">${arg[i]["Payment"]}</td>
        <td><button class = "kurye1">${couriersList[0].name}</button><button class= "kurye2">${couriersList[1].name}</button></td>
        </tr>`;
        dailyOrderTable.insertAdjacentHTML('beforeend',fullOrder);
        }
        const ordersClickListeners = document.getElementsByClassName('all-orders-trs');
        ordersClickListeners[i].addEventListener('click',function(e){
            const parent = e.target.parentNode.parentNode;
            const isAssigned = parent.querySelector('.ordered-order-id').innerText;
            ipcRenderer.send('orders:click-order-id',isAssigned);
        })
    };
const kurye1 = document.getElementsByClassName('kurye1');
const kurye2 = document.getElementsByClassName('kurye2');
for(const prop of kurye1) {
    prop.addEventListener('click',function(e){
        let theAnswer = ipcRenderer.sendSync('is-validated','kurye-a');
        const parent = e.target.parentNode.parentNode;
        const isAssigned = parent.querySelector('.ordered-order-id').innerText;
        const customerName = parent.querySelector('.ordered-customer-name').innerText;
        const customerAddress = parent.querySelector('.ordered-customer-address').innerText;
        const customerPrice = parent.querySelector('.ordered-customer-total-price').innerText;
        const customerPayment = parent.querySelector('.ordered-customer-payment').innerText;
        let orderedInfo = [];
        if(theAnswer){
            const item = e.target.parentNode;
            const toAdd = document.createElement('td');
            toAdd.innerText = `${couriersList[0].name}`;
            item.replaceWith(toAdd);
            orderedInfo[0] = customerName;
            orderedInfo[1] = customerAddress;
            orderedInfo[2] = customerPayment;
            orderedInfo[3] = customerPrice;
            orderedInfo[4] = isAssigned;
            ipcRenderer.send('order:assigned-a',orderedInfo);
            ipcRenderer.send('backup-after-couriers');
        }
    });
}
for(const prop of kurye2) {
    prop.addEventListener('click',function(e){
        let theAnswer = ipcRenderer.sendSync('is-validated','kurye-b');
        const parent = e.target.parentNode.parentNode;
        const isAssigned = parent.querySelector('.ordered-order-id').innerText;
        const customerName = parent.querySelector('.ordered-customer-name').innerText;
        const customerAddress = parent.querySelector('.ordered-customer-address').innerText;
        const customerPrice = parent.querySelector('.ordered-customer-total-price').innerText;
        const customerPayment = parent.querySelector('.ordered-customer-payment').innerText;
        let orderedInfo = [];
        if(theAnswer) {
            const item = e.target.parentNode;
            const toAdd = document.createElement('td');
            toAdd.innerText = `${couriersList[1].name}`;
            item.replaceWith(toAdd);
            orderedInfo[0] = customerName;
            orderedInfo[1] = customerAddress;
            orderedInfo[2] = customerPayment;
            orderedInfo[3] = customerPrice;
            orderedInfo[4] = isAssigned;
            ipcRenderer.send('order:assigned-c',orderedInfo);
            ipcRenderer.send('backup-after-couriers');
        }
    })
}; 
// Calculating the whole bill of the day
let dailyCashAmount = document.getElementById('daily-cash-amount');
let dailyTakeAwayAmount = document.getElementById('daily-take-away-amount');
let totalDeliverAmount = 0;
let totalTakeAwayAmount = 0;
let sumOfDailyOrders = document.getElementsByClassName('ordered-customer-name');
for(let prop of sumOfDailyOrders ){
    if(prop.innerText === "GEL - AL"){
        let onePrice = prop.parentNode.querySelector('.ordered-customer-total-price').innerText;
        totalTakeAwayAmount += parseInt(onePrice);
        dailyTakeAwayAmount.innerHTML = totalTakeAwayAmount;
    }
    else {
        let onePrice = prop.parentNode.querySelector('.ordered-customer-total-price').innerText;
        totalDeliverAmount += parseInt(onePrice);
        dailyCashAmount.innerHTML = totalDeliverAmount;
    }
}
});


// Routing Below
dailyOrdersClick.addEventListener('click', function(){
    ipcRenderer.send('daily-orders-click');
});
// Send By Number
let sendByNumber = document.getElementById('send-by-number');
sendByNumber.addEventListener('click',function(){
    ipcRenderer.send('send-by-number');
});

// All Debts
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





