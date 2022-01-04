const electron = require('electron');
const {ipcRenderer} = electron;
const addButton = document.getElementsByClassName('add-button');
for(let i= 0; i<addButton.length;i++){
    addButton[i].addEventListener('click',function(e){
        const myDeneme = e.target.parentNode.parentNode;
        let myDeneme1 = myDeneme.childNodes;
        let orderNumbers = e.target.getAttribute('data-food-quantity');
        ipcRenderer.send('orders-ID',[myDeneme1[1].innerText,orderNumbers]);
    })
};
const sendByPriceButtons = document.getElementsByClassName('send-by-price');
for (let prop of sendByPriceButtons) {
    prop.addEventListener('click',function(e){
        const myDeneme = e.target.parentNode.parentNode;
        let myDeneme1 = myDeneme.childNodes;
        let orderPrice = myDeneme1[5].querySelector('input').value;
        ipcRenderer.send('orders-ID:per-price',[myDeneme1[1].innerText,orderPrice]);
        let priceHolder = myDeneme1[5].querySelector('input');
        priceHolder.value = "";
    })
}
const sendDonerByPrice = document.getElementsByClassName('send-by-price-doner');
if(sendDonerByPrice !== null) {
    for (let prop of sendDonerByPrice) {
        prop.addEventListener('click',function(e){
            const myDeneme = e.target.parentNode.parentNode;
            let myDeneme1 = myDeneme.childNodes;
            let orderPrice = myDeneme1[9].querySelector('input').value;
            ipcRenderer.send('orders-ID:per-price',[myDeneme1[1].innerText,orderPrice]);
            let priceHolder = myDeneme1[9].querySelector('input');
            priceHolder.value = "";
        })
}
}