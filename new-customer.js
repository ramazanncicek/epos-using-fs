
    if(ipcRenderer == null) {
        const { ipcRenderer } = require("electron");
    }
    const newCustomer = document.getElementById('new-customer-reg');
    newCustomer.addEventListener('click',function(){
    ipcRenderer.send('customer:new',JSON.stringify(newCustomer));
    });
    const ourTable = document.getElementById('customer-orders-table');
    function totalPriceSum() {
        const priceSumInner = document.getElementById('total-price-per');
        const priceSumData = document.getElementsByClassName('order-prices');
        if(priceSumData.length === 0) {
            priceSumInner.innerHTML = 0;
        }
        let priceSum = 0;
        let a = 0;
        for (let i = 0; i<priceSumData.length;i++) {
            a = priceSumData[i].innerText;
            priceSum += parseFloat(a);
            priceSumInner.innerHTML = parseFloat(priceSum);
    }
    };
    ipcRenderer.on('confirmed-order-id',function(e,arg){
    ourTable.insertAdjacentHTML('beforeend',arg);
    const deleteButtons = document.getElementsByClassName('delete-food-button');
    for(let z = 0;z<deleteButtons.length;z++){
        deleteButtons[z].addEventListener('click',function(e){
            let parent = e.target.parentNode.parentNode.parentNode;
            let child = e.target.parentNode.parentNode;
            parent.removeChild(child);
            totalPriceSum();
        });
    }
    totalPriceSum();
    });
    
    // const dailyOrdersClick = document.getElementById('daily-orders-click')
    // if(dailyOrdersClick !== null) {
    //   dailyOrdersClick.addEventListener('click',function(){
    //     ipcRenderer.send('daily-orders-click',dailyOrdersClick.innerText);
    //   });
    // }
    // let sendByNumber = document.getElementById('send-by-number');
    // if (sendByNumber !== null) {
    // sendByNumber.addEventListener('click',function(){
    // ipcRenderer.send('send-by-number');
    // });
    // };
    // let upgradePrice = document.getElementById('upgrade-price');
    // if(upgradePrice !== null) {
    // upgradePrice.addEventListener('click',function(){
    //     ipcRenderer.send('upgrade-price');
    // })
    // };
    