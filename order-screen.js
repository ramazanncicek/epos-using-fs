const { ipcMain } = require('electron');
const electron = require('electron');
const {ipcRenderer} = electron;
// Calling Customer Data Below
const regCustomerName = document.getElementById('reg-customer-name');
const regCustomerPhone = document.getElementById('reg-customer-phone');
const regCustomerAddress = document.getElementById('reg-customer-address');
// Food Data Below
const etDoner = document.getElementById('et');
const tavukDoner = document.getElementById('tavuk');
const kofte = document.getElementById('kofte');
const sandvic = document.getElementById('sandvic');
const ayvalik = document.getElementById('ayvalik');
const icecekler = document.getElementById('icecekler');
const menuler = document.getElementById('menuler');
etDoner.addEventListener('click',function(){
    ipcRenderer.send('item:et-doner',JSON.stringify(etDoner));
});
tavukDoner.addEventListener('click',function(){
    ipcRenderer.send('item:tavuk-doner',JSON.stringify(tavukDoner));
});
kofte.addEventListener('click',function(){
    ipcRenderer.send('item:kofte',JSON.stringify(kofte));
});
sandvic.addEventListener('click',function(){
    ipcRenderer.send('item:sandvic',JSON.stringify(sandvic));
});
ayvalik.addEventListener('click',function(){
    ipcRenderer.send('item:ayvalik',JSON.stringify(ayvalik));
});
icecekler.addEventListener('click',function(){
    ipcRenderer.send('item:icecekler',JSON.stringify(icecekler));
});
menuler.addEventListener('click',function(){
    ipcRenderer.send('item:menuler',JSON.stringify(icecekler));
});

    const dailyOrdersClick = document.getElementById('daily-orders-click')
    dailyOrdersClick.addEventListener('click',function(){
        ipcRenderer.send('daily-orders-click',dailyOrdersClick.innerText)
    })
// Sending Order Away
    let allOrders = {};
    let orderInfo = {};
    function sendOrder(){
        const orderFoods = document.getElementsByClassName('order-foods');
        const orderQuantity = document.getElementsByClassName('order-quantity');
        const orderPrices = document.getElementsByClassName('order-prices');
        const totalPrice = document.getElementById('total-price-per').innerText;
        const customerAddress = document.getElementById('reg-customer-address').value;
        const customerNumber = document.getElementById('reg-customer-phone').innerText;
        const orderNote = document.getElementById('order-note').value;
        let customerName = document.getElementById('reg-customer-name').value;
        let method = document.getElementById('payment-method');
        let payment = method.selectedIndex;
        let paymentMethod = method.options[payment].text;
        let date = new Date();
        let [hour,minute,second] = [date.getHours(),date.getMinutes(),date.getSeconds()];
        if(minute<10){
            minute = `0${minute}`;
        }
        else if(second<10){
            second = `0${second}`;
        }
        else if (hour<10) {
            hour = `0${hour}`;
        }
        const orderTime = `${hour}:${minute}:${second}`;
        // Adding 0 if less than 10
        if(orderQuantity.length == 0) {
            return;        
        }
        else {
            for (let i = 0;i<orderFoods.length;i++){
                let line = 'Line' + i;
                allOrders[line] = {
                    "Food": orderFoods[i].innerText,
                    "Quantity": orderQuantity[i].innerText,
                    "Price": orderPrices[i].innerText
                }
            };
            orderInfo["Customer Name"] = customerName;
            orderInfo["Customer Address"] = customerAddress;
            orderInfo["Customer Number"] = customerNumber;
            orderInfo["Total Price"] = totalPrice;
            orderInfo["Payment"] = paymentMethod;
            orderInfo["Orders"] = allOrders;
            orderInfo["Order Note"] = orderNote;
            orderInfo["Order Time"] = orderTime;
            ipcRenderer.send('order-away', orderInfo);
            if(customerName === "GEL - AL") {
                ipcRenderer.send('take-away-assigned',orderInfo);
            }
        }
    }
    const sendButton = document.getElementById('send-order');
    sendButton.addEventListener('click', sendOrder);
    // Cancelling an Order

    const cancelOrder = document.getElementById('cancel-order');
    cancelOrder.addEventListener('click',function(){
        let isValidated = ipcRenderer.sendSync('cancelling-the-order');
        if(isValidated){
            ipcRenderer.send('order:cancel-order');
        };
    });
    // Loading Calling Customer Screen
    ipcRenderer.on('calling-customer',function(e,arg){
        regCustomerPhone.innerHTML = arg[0];
        regCustomerName.value = arg[1].name;
        regCustomerAddress.value = arg[1].address;
    });
// Send By Number Below
let sendByNumber = document.getElementById('send-by-number');
sendByNumber.addEventListener('click',function(){
    ipcRenderer.send('send-by-number');
});
// All Debts Below
let allDebts = document.getElementById('all-debts');
if(allDebts !== null) {
  allDebts.addEventListener('click',function(){
    ipcRenderer.send('all-debts');
  })
}
// Upgrading the prices below
let upgradePrice = document.getElementById('upgrade-price');
if(upgradePrice !== null) {
    upgradePrice.addEventListener('click',function(){
        ipcRenderer.send('upgrade-price');
    })
};
// Save Customer Info 
let changeInfoButtons = document.getElementsByClassName('change-info-buttons');
for(let prop of changeInfoButtons) {
    prop.addEventListener('click',function(){
        let customerNewInfo = {};
        const customerAddress = document.getElementById('reg-customer-address').value;
        const customerNumber = document.getElementById('reg-customer-phone').innerText;
        let customerName = document.getElementById('reg-customer-name').value;
            customerNewInfo["Customer Name"] = customerName;
            customerNewInfo["Customer Address"] = customerAddress;
            customerNewInfo["Customer Number"] = customerNumber;
        ipcRenderer.send("customer-new-info:saved",customerNewInfo);
    })
}
// Upgrade Couriers
let updateCouriers = document.getElementById('update-couriers');
if(upgradePrice !== null) {
    updateCouriers.addEventListener('click',function(){
    ipcRenderer.send('update-couriers');
    })    
}