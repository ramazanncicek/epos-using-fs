const electron = require('electron');
const {ipcRenderer} = electron;
const customerName = document.getElementById('reg-customer-name');
const customerAddress = document.getElementById('reg-customer-address');
const customerNumber = document.getElementById('reg-customer-phone');
const orderNote = document.getElementById('the-order-note');
const orderTime = document.getElementById('reg-order-time');
const totalPrice = document.getElementById('total-price-per');
const totalPricePayment = document.getElementById('total-price-payment');
const customerOrdersTable = document.getElementById('customer-orders-table');
ipcRenderer.on('orders:clicked-order-details',function(e,arg){
    customerName.innerHTML = arg[1];
    customerAddress.innerHTML = arg[2];
    orderTime.innerHTML = arg[8];
    if(arg[1] === "GEL - AL"){
        customerNumber.innerHTML = "-";
    }
    else{
        customerNumber.innerHTML = arg[6];
    }
    totalPrice.innerHTML = arg[3];
    totalPricePayment.innerHTML = arg[4];
    orderNote.innerHTML = arg[7];
    for(let key in arg[5]){
        let fullOrder = `<tr>
        <td class="food-type">${arg[5][key]["Food"]}</td>
        <td class="food-quantity">${arg[5][key]["Quantity"]}</td>
        <td class="food-price">${arg[5][key]["Price"]}</td>
        </tr>`
        customerOrdersTable.insertAdjacentHTML('beforeend',fullOrder);
    };
});
// Assign for Debt
// const debtButton = document.getElementById('assign-for-debt');
// let debtOrder = {};
// let allOrders = {};
// debtButton.addEventListener('click',function(){
//     const foodType = document.getElementsByClassName('food-type');
//     const foodQuantity = document.getElementsByClassName('food-quantity');
//     const foodPrice = document.getElementsByClassName('food-price');
//     // debtOrder[customerNumber.innerText] = {
//     //     "Customer Name": customerName.innerText,
//     //     "Customer Number": customerNumber.innerText,
//     //     "Customer Address": customerAddress.innerText,
//     //     "Total Price": totalPrice.innerText,
//     //     "Payment": totalPricePayment.innerText,
//     //     "Order Note": orderNote.innerText
//     // }
//     debtOrder["Customer Name"] = customerName.innerText;
//     debtOrder["Customer Number"] = customerNumber.innerText;
//     debtOrder["Customer Address"] = customerAddress.innerText;
//     debtOrder["Total Price"] = totalPrice.innerText;
//     debtOrder["Payment"] = totalPricePayment.innerText;
//     debtOrder["Order Note"] = orderNote.innerText;
//     for (let i = 0;i<foodType.length;i++){
//         let line = 'Line' + i;
//         allOrders[line] = {
//             "Food": foodType[i].innerText,
//             "Quantity": foodQuantity[i].innerText,
//             "Price": foodPrice[i].innerText
//         }
//     };
//     debtOrder["All Orders"] = allOrders;
//     ipcRenderer.send('assign-a-debt',debtOrder);
// });
// function printForm(a) {
//     printJS({
//         printable: a,
//         type: 'html',
//         targetStyles: ['*'],
//         header: 'PrintJS - Print Form With Customized Header'
//     })
//   };
let printTheOrder = document.getElementById('print-the-order');
printTheOrder.addEventListener('click',function(){
    ipcRenderer.send('print-my-order');
})