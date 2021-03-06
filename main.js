const { app, BrowserWindow,Menu,ipcMain, ipcRenderer,dialog } = require('electron');
const path = require('path');
const ejse = require('ejs-electron');
const fs = require('fs');
// CallerID Requirements below.
const ffi = require('ffi-napi');
const PromiseTimers = require('promise-timers');
const myFunc = new ffi.Library('cid.dll',{
  "CidStart": ["void",[]],
  "CidData": ["string",[]]
  });
let z = 0;
function method () {
    // this refers to interval
    if (z > 5) {
        z = 0;
    } else {
        let myStr = myFunc.CidData();
        let mySplit = myStr.split(',');
        if(mySplit[2] !== undefined){
          let callingCustomer = mySplit[2];
          // Checking if the line is active
          let callingCustomerData = [mySplit[2],allCustomers[callingCustomer]];
          setTimeout(function(){
            win.webContents.send('calling-customer',callingCustomerData);
          },1000);
          win.loadFile('order-screen.html');
          win.show();  
          win.focus(); 
            if(allCustomers[callingCustomer] === undefined){
              win.show();
              newCustomerWindow();
              setTimeout(function(){
                newCustomer.webContents.send('unregistered-number',callingCustomer);
              },1000);
            }
            else {
              let callingCustomerData = [mySplit[2],allCustomers[callingCustomer]];
              setTimeout(function(){
                win.webContents.send('calling-customer',callingCustomerData);
              },1000);
              win.loadFile('order-screen.html');
              win.show();  
              win.focus(); 
            }
            
        }
        z++;
    }
};
// Creating Main Window
let win;
let firedOnce = false;
// Break
function createWindow () {
      win = new BrowserWindow({
      width: 1500,
      height: 900,
      // titleBarStyle: 'hidden',
      // titleBarOverlay: true,
      autoHideMenuBar: true,
      resizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      }
    })
  
    win.loadFile('index.html');
    if(!firedOnce){
      myFunc.CidStart();
      firedOnce = true;
    }
    PromiseTimers.setInterval(200, method);
    // Restoring to Courier A
    let date = new Date();
    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    let ourDate = [day,month+1,year];
    const myFolderNameA = `./backup-folders/courier-a-${day}-${month+1}.js`;
    fs.readFile(myFolderNameA,"utf-8",(err,data)=>{
        if(err){
            console.log(err);
        }
        if(data){
            let parsedData = JSON.parse(data);
            dailyCourierDatabaseA = parsedData;
        }
    });
    // Restoring to Courier B
    const myFolderNameB = `./backup-folders/courier-b-${day}-${month+1}.js`;
    fs.readFile(myFolderNameB,"utf-8",(err,data)=>{
        if(err){
            console.log(err);
        }
        if(data){
            let parsedData = JSON.parse(data);
            dailyCourierDatabaseC = parsedData;
        }
    });
    // Restoring to Take Away Orders
    const myTakeAwayFolder = `./backup-folders/take-aways-${day}-${month+1}.js`;
    fs.readFile(myTakeAwayFolder,"utf-8",(err,data)=>{
      if(err){
          console.log(err);
      }
      if(data){
          let parsedData = JSON.parse(data);
          dailyTakeAwayDatabase = parsedData;
      }
  });

    // Restoring to Daily Orders Database
    const myFolderNameAll = `./backup-folders/backup-orders-${day}-${month+1}.js`;
    fs.readFile(myFolderNameAll,"utf-8",(err,data)=>{
        if(err){
            console.log(err);
        }
        if(data){
            let parsedData = JSON.parse(data);
            dailyOrdersDatabase = parsedData;
        }
    });
    // Restoring All Customers
    const customersFolder = `./backup-folders/all-customers.json`;
    fs.readFile(customersFolder,"utf-8",(err,data)=>{
      if(err){
          console.log(err);
      }
      if(data){
          let parsedData = JSON.parse(data);
          allCustomers = parsedData;
      }
  });
    const allPricesFolder = `./backup-folders/all-prices.js`;
    fs.readFile(allPricesFolder,"utf-8",(err,data)=>{
      if(err){
          console.log(err);
      }
      if(data){
          let parsedData = JSON.parse(data);
          foodPrices = parsedData;
      }
  });
    //Restoring Couriers List
    const couriersListFile = `./backup-folders/couriers-list.js`;
    fs.readFile(couriersListFile,"utf-8",(err,data)=>{
      if(err){
          console.log(err);
      }
      if(data){
          let parsedData = JSON.parse(data);
          couriersList = parsedData;
      }
  });
    // Build Menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Now insert it.
    Menu.setApplicationMenu(mainMenu);
  };
  // The app launches.
  app.whenReady().then(() => {
    createWindow();
  });
  // Routing Test
  
  //Close the whole app when main window is closed.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin'){
      app.quit();
    }
  });
  // Menu Templates Below
  const mainMenuTemplate = [
    {
        label:'Dosya',
        submenu: [
            {label: 'Menu 1'},
            {label: 'Quit',
            accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
            click(){
            app.quit();
        }}
        ]
    }
];
// New Customer Window Function
function newCustomerWindow(){
  newCustomer = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  newCustomer.loadFile('new-customer.html');
}
// Refreshing the New Customer Page
ipcMain.on('wrong-input',function(e,arg){
  dialog.showErrorBox('','M????teri ad?? 4 haneden k??sa olmamal??.');
});

// Left food screen below
let foods;
let drinks;
function foodWindow(area,codename,product){
  foods = new BrowserWindow({
    width: 700,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  ejse.data(codename,product);
  if(area == "et" || area == "tavuk") {
    foods.loadFile('./views/food-screen.ejs');
  }
  if(area == "kofte") {
    foods.loadFile('./views/kofte.ejs');
  }
  if(area == "ayvalik"){
    foods.loadFile('./views/ayvalik.ejs');
  }
  if(area == "sandvic") {
    foods.loadFile('./views/sandvic.ejs');
  }
  if(area == 'icecek') {
    foods.loadFile('./views/icecekler.ejs');
  }
  if(area == 'menuler') {
    foods.loadFile('./views/menus.ejs');
  }
}
// Food Compilation Above 
// Food Event Listener Below
ipcMain.on('item:et-doner',function(){
  foodWindow('et','foodID','Et');
});
ipcMain.on('item:tavuk-doner',function(){
  foodWindow('tavuk','foodID','Tavuk');
});
ipcMain.on('item:kofte',function(){
  foodWindow('kofte','foodID','K??fte');
});
ipcMain.on('item:sandvic',function(){
  foodWindow('sandvic','foodID','Sandvi??');
});
ipcMain.on('item:ayvalik',function(){
  foodWindow('ayvalik','foodID','Ayval??k');
});
ipcMain.on('item:icecekler',function(){
  foodWindow('icecek','','');
});
ipcMain.on('item:menuler',function(){
  foodWindow('menuler','','');
});
let newCustomer;
ipcMain.on('customer:new',function(e){
  newCustomerWindow();
  newCustomer.loadFile('new-customer.html');
});
// Food to send orders screen below.
let foodOrder;
let foodPrices = {
  'Yar??m Et': 20,
  '????FT Lava?? Et': 21,
  'D??r??m Et': 20,
  'Pita Et': 20,
  'Bazlama Et': 20,
  '3/4 Ekmek Aras?? Et': 30,
  '120Gr Et': 40,
  '??skender Et': 40,
  'Zurna Et': 32,
  'Men?? Et': 30,
  // Tavuk
  'Yar??m Tavuk': 13,
  'D??r??m Tavuk': 13,
  '????FT Lava?? Tavuk': 14,
  'Pita Tavuk': 13,
  'Bazlama Tavuk': 13,
  '3/4 Ekmek Aras?? Tavuk': 19,
  '120Gr Tavuk': 26,
  '??skender Tavuk': 26,
  'Zurna Tavuk': 24,
  'Tavuk D??nerli Pilav': 30,
  // K??fte
  'Yar??m K??fte': 18,
  '3/4 Ekmek Aras?? Izgara K??fte': 27,
  'Bazlama Izgara K??fte': 18,
  'Izgara D??r??m K??fte': 18,
  'Izgara K??fte': 36,
  // Sandvi??
  'Kar??????k Sandvi??': 18,
  '3/4 Ekmek Kar??????k Sandvi??': 27,
  'Et D??nerli Sandvi??': 20,
  'Tavuk D??nerli Sandvi??': 13,
  'Patso Sandvi??': 11,
  'Kar??????k Patso Sandvi??': 18,
  'Ka??arl?? Patso Sandvi??': 15,
  'Sosisli Patso Sandvi??': 15,
  'Kar??????k Sandvi?? D??r??m': 18,
  // Ayval??k
  'Ka??arl?? Ayval??k': 12,
  'Kar??????k Ayval??k': 16,
  'Kar??????k Bazlama Ayval??k': 16,
  'Ka??arl?? Bazlama Ayval??k': 12,
  'Bazlama Kasap Sucuk': 20,
  'Sucuk Ka??ar': 20,
  // ????ecekler ve Patates
  'B??y??k Patates': 16,
  'K??????k Patates': 8,
  'Ayran 20 cl': 3,
  'Ayran 30 cl': 4,
  // Tenekeler
  'Cappy 33 cl': 7,
  'Coca-Cola Light 33 cl': 7,
  'Coca-Cola Sekersiz 33 cl': 7,
  'Coca-Cola 33 cl': 7,
  'Fanta 33 cl': 7,
  'Sprite 33 cl': 7,
  'Lipton Ice Tea 33 cl': 7,
  // Litre
  'Coca-Cola 1L': 11,
  'Coca-Cola Light 1L': 11,
  'Coca-Cola Sekersiz 1L': 11,
  'Fanta 1L': 11,
  'Sprite 1L': 11,
  // 2.5L
  'Coca-Cola 2.5L': 15,
  'Coca-Cola Light 2.5L': 15,
  'Coca-Cola Sekersiz 2.5L': 15,
  'Fanta 2L': 12,
  'Sprite 2L': 12,
  'Fanta 2.5L': 15,
  'Sprite 2.5L': 15,
  // Salgam - Gazoz
  'Salgam Suyu 33 cl': 5,
  'Nigde Gazozu 25 cl':5,
  'Meyveli Soda 20 cl': 4,
  // Su ve ??i??e Kola
  "Su - (2TL)": 2,
  "??i??e Kola 20CL - (4TL)": 4,
  'Sade Soda 20 cl': 3,
  // Men??ler
  "Men?? 1 - Ekmek Aras?? Tavuk D??ner + Patates + Ayran(20cl)": 24,
  "Men?? 2 - Ekmek Aras?? Et D??ner + Patates + Ayran(20cl)": 31,
  "Men?? 3 - Kar??????k Sandvi?? + Patates + Ayran(20cl)": 29,
  "Men?? 4 - Yar??m Ekmek Kar??????k Tost + Patates + Ayran(20cl)": 27,
  "Men?? 5 - Kar??????k Ayval??k Tost + Patates + Ayran(20cl)": 27,
  "Men?? 6 - Ekmek Aras?? Tavuk Ci??er + Patates + Ayran(20cl)": 24,
  "Men?? 7 - Ekmek Aras?? K??fte + Patates + Ayran(20cl)": 29,
  "Men?? 8 - Dana Kasap Sucuk + Patates + Ayran(20cl)": 31,
  "Men?? 9 - 120Gr Tavuk D??ner + Patates + Ayran(20cl)": 37,
  "Men?? 10 - Tavuk ??skender(120gr) + Patates + Ayran(20cl)": 37,
  "Men?? 11 - 120Gr Et D??ner + Patates + Ayran(20cl)": 52,
  "Men?? 12 - ??skender Et D??ner + Patates + Ayran(20cl)": 52,
  "Men?? 13 - Izgara K??fte(200gr) + Patates + Ayran(20cl)": 47,
  "Men?? 14 - Tavuk C????ER(200gr) + Patates + Ayran(20cl)": 37,
  "Men?? 15 - D??rt(4) Adet Ekmek Aras?? Tavuk + ????ecek(1L)": 59,
  "Men?? 16 - D??rt(4) Adet Ekmek Aras?? Et + ????ecek (1L)": 89,
  "Men?? 17 - D??rt(4) Adet Kar??????k Sandvi?? + ????ecek (1L)": 79,
  "Men?? 18 - D??rt(4) Adet Ekmek Aras?? K??fte + ????ecek (1L)": 79,
  "Men?? 19 - Tereya??l?? Tavuklu Pilav + Ayran(30cl)": 16,
  "Men?? 20 - Zurna Tavuk D??r??m(120gr) + Patates + Ayran(20cl)":35,
  "Men?? 21 - Zurna ET D??r??m(120gr) + Patates + Ayran(20cl)": 43
}
ipcMain.on('orders-ID',function(e,arg) {
    let orderPrice = foodPrices[arg[0]] * arg[1];
    foodOrder = `<tr>
    <td class="order-foods">${arg[0]}</td>
    <td class = "order-quantity"><b>${arg[1]}</b></td>
    <td class="order-prices">${orderPrice}</td>
    <td class="order-delete-food"><button class="delete-food-button">S??L</button></td>
     </tr>`;
  win.webContents.send('confirmed-order-id',foodOrder);
});
ipcMain.on('orders-ID:per-price',function(e,arg) {
  foodOrder = `<tr>
  <td class="order-foods">${arg[0]}</td>
  <td class = "order-quantity"><b>1</b></td>
  <td class="order-prices">${arg[1]}</td>
  <td class="order-delete-food"><button class="delete-food-button">S??L</button></td>
   </tr>`;
win.webContents.send('confirmed-order-id',foodOrder);
});
// Sending orders from order-screen to All Daily Orders
let dailyOrdersDatabase = [];
// let orderID = dailyOrdersDatabase.length + 1;
function savingDailyOrdersForBackup(){
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  let ourDate = [day,month+1,year];
  const myFolderName = `./backup-folders/backup-orders-${day}-${month+1}.js`;
  // Backup 
  fs.writeFile(myFolderName,JSON.stringify(dailyOrdersDatabase),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  });
} 
ipcMain.on('order-away', function(e,arg){
  arg['Order ID'] = dailyOrdersDatabase.length+1;
  dailyOrdersDatabase.push(arg);
  allCustomers[arg["Customer Number"]] = {name: arg["Customer Name"], address: arg["Customer Address"], number: arg["Customer Number"]};
  saveAllCustomersBackup();
  // Backup
  savingDailyOrdersForBackup();
  // New Backup Try
  setTimeout(function(){
    win.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000);
  win.loadFile('daily-orders.html');
});
// Cancelling An Order
ipcMain.on('cancelling-the-order',function(e,arg){
  dialog.showMessageBox({
    message:"Sipari?? ??ptal Edilsin Mi?",
    buttons:[
      "Evet",
      "Hay??r"
    ],
    title: "Sipari?? ??ptali",
    cancelId: 1
  }).then((res)=>{
    if(res.response === 0) {
      e.returnValue = true;
    }
    else {
      e.returnValue = false;
    }
  })
})
ipcMain.on('order:cancel-order',function(e,arg){
  setTimeout(function(){
    win.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000);
  win.loadFile('daily-orders.html');
})
// Daily Orders Handle Below
ipcMain.on('daily-orders-click',function(e,arg){
  setTimeout(function(){
    win.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000)
  win.loadFile('daily-orders.html');
});
// Send By Number below
let sendByNumberWin;
ipcMain.on('send-by-number',function(e,arg){
  sendByNumberWin = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  sendByNumberWin.loadFile('send-by-number.html');
});
ipcMain.on('number-send-input',function(e,arg){
  if(arg.length == 11){
    sendByNumberWin.close();
    if(allCustomers[arg] !== undefined){
    let callingCustomerData = [arg,allCustomers[arg]];
            setTimeout(function(){
              win.webContents.send('calling-customer',callingCustomerData);
            },1000);
            win.loadFile('order-screen.html');
            win.show();  
    }
    else {
    newCustomerWindow();
    setTimeout(function(){
    newCustomer.webContents.send('unregistered-number',arg);
    },1000);
          }
  }
  else {
    dialog.showErrorBox('',"M????teri numaras?? 11 veya 7 haneli olmal??d??r.");
  }
  
});
// An Order Display below
let anOrderWindow;
ipcMain.on('orders:click-order-id',function(e,arg){
  anOrderWindow = new BrowserWindow({
    width: 900,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  dailyOrdersDatabase.forEach(myFunc);
  function myFunc(value){
    if(value["Order ID"] == arg){
      let returningArr = [];
      returningArr[0] = value["Order ID"];
      returningArr[1] = value["Customer Name"];
      returningArr[2] = value["Customer Address"];
      returningArr[3] = value["Total Price"];
      returningArr[4] = value["Payment"];
      returningArr[5] = value["Orders"];
      returningArr[6] = value["Customer Number"];
      returningArr[7] = value["Order Note"];
      returningArr[8] = value["Order Time"];
      anOrderWindow.loadFile('./views/an-order.html');
      anOrderWindow.webContents.on('did-finish-load',function(){
        anOrderWindow.webContents.send('orders:clicked-order-details',returningArr);
      });
    }
  };

});
// New Customer Registration below
let allCustomers = {};
function saveAllCustomersBackup(){
  const myFolderName = `./backup-folders/all-customers.json`;
  // Backup 
  fs.writeFile(myFolderName,JSON.stringify(allCustomers),
  (err)=>{
    if(err){
      console.log('Error! All Customers are not saved.');
    };
  });
}
ipcMain.on('new-customer-added',function(e,arg){
  allCustomers[arg[0]] = {name: arg[1], address: arg[2], number: arg[0]};
  const myFolderName = `./backup-folders/all-customers.json`;
  // Backup 
  fs.writeFile(myFolderName,JSON.stringify(allCustomers),
  (err)=>{
    if(err){
      console.log('Error! All Customers are not saved.');
    };
  });
  newCustomer.close();
  let callingCustomerData = [arg[0],{name: arg[1], address: arg[2],number: arg[0]}];
  setTimeout(function(){
    win.webContents.send('calling-customer',callingCustomerData);
  },1000);
  win.show(); 
  win.loadFile('order-screen.html');
});
ipcMain.on('customer-new-info:saved',function(e,arg){
  allCustomers[arg["Customer Number"]] = {name: arg["Customer Name"], address: arg["Customer Address"], number: arg["Customer Number"]};
  saveAllCustomersBackup();
})

// Making the couier page ready for loading assigned items.
let dailyCourierDatabaseA = [];
let dailyCourierDatabaseC = [];
let dailyTakeAwayDatabase = [];
let courier;
ipcMain.on('courier:id',function(e,arg){
  function courierWindow(c){
      courier = new BrowserWindow({
      width: 800,
      height: 500,
      resizable: false,
      autoHideMenuBar: true,
      webPreferences:{
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    courier.loadFile('acourier.html');
};
  courierWindow();
  courier.webContents.on('did-finish-load',function(){
    if(arg == "kurye1"){
      courier.webContents.send('id',couriersList[0].name);
      courier.webContents.send('database-a',dailyCourierDatabaseA);
    }
    else if(arg == "Gel - Al"){
      courier.webContents.send('take-away-database',dailyTakeAwayDatabase);
    }
    else if(arg == "kurye2"){
      courier.webContents.send('id',couriersList[1].name)
      courier.webContents.send('database-c',dailyCourierDatabaseC);
    }
  })
});
// Loading assigned-orders to a courier, to courier page.
ipcMain.on('order:assigned-a',function(e,arg){
  for (let i = 0; i<dailyOrdersDatabase.length;i++) {
    if(dailyOrdersDatabase[i]['Order ID'] == arg[4]) {
      dailyOrdersDatabase[i]['Assigned'] = 'kurye1';
    }
  }
  dailyCourierDatabaseA.push(arg);
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  let ourDate = [day,month+1,year];
  const myFolderName = `./backup-folders/courier-a-${day}-${month+1}.js`;
  fs.writeFile(myFolderName,JSON.stringify(dailyCourierDatabaseA),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  });
});

ipcMain.on('order:assigned-c',function(e,arg){
  for (let i = 0; i<dailyOrdersDatabase.length;i++) {
    if(dailyOrdersDatabase[i]['Order ID'] == arg[4]) {
      dailyOrdersDatabase[i]['Assigned'] = 'kurye2';
    }
  }
  dailyCourierDatabaseC.push(arg);
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  let ourDate = [day,month+1,year];
  const myFolderName = `./backup-folders/courier-b-${day}-${month+1}.js`;
  fs.writeFile(myFolderName,JSON.stringify(dailyCourierDatabaseC),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  })
});
ipcMain.on('is-validated',function(e,arg){
  if(arg === "kurye-a") {
    let response1 = dialog.showMessageBox({
      message: `Sipari?? ${couriersList[0].name} Atans??n m???`,
      type: "question",
      buttons: [
      "Onayla",
      "??ptal Et"
          ],
      title: `${couriersList[0].name}`,
      cancelId: 1
    })
  .then((res) => {
    if(res.response === 0) {
      e.returnValue = true;
    }
    else {
      e.returnValue = false;
    }
  })
  }
  // The Second Courier Below
  else if(arg === "kurye-b") {
    let response2 = dialog.showMessageBox({
      message: `Sipari?? ${couriersList[1].name} Atans??n m???`,
      type: "question",
      buttons: [
      "Onayla",
      "??ptal Et"
          ],
      title: `${couriersList[1].name}`,
      cancelId: 1
    })
  .then((res) => {
    if(res.response === 0) {
      e.returnValue = true;
    }
    else {
      e.returnValue = false;
    }
  })
  }
  
})
// Take-aways below
ipcMain.on('take-away-assigned',function(e,arg){
  dailyTakeAwayDatabase.push(arg);
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  let ourDate = [day,month+1,year];
  const myFolderName = `./backup-folders/take-aways-${day}-${month+1}.js`;
  fs.writeFile(myFolderName,JSON.stringify(dailyTakeAwayDatabase),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  })
});
// Backup After Couriers
ipcMain.on('backup-after-couriers',function(e,arg){
  savingDailyOrdersForBackup();
});
// Clear the bills of a day.
ipcMain.on('shall-pay-bills',function(e,arg){
  dialog.showMessageBox(courier, {
    message: `${arg}'??n hesab?? kapat??ls??n m???`,
    type: "question",
    buttons: [
    "Onayla",
    "??ptal Et"
        ],
    title: `${arg} G??nl??k ??deme`,
    cancelId: 1
  }).then((res) => {
    if(res.response === 0) {
      // If the response is onayla, do the things below
      // Loop through couriersList to find which courier to clear.
      for (let prop of couriersList) {
        if(prop.name === arg) {
          switch(prop.id){
            case 1:
              dailyCourierDatabaseA = [];
              break;
            case 2:
              dailyCourierDatabaseC = [];
              break; 
          }
          courier.close();
        }
      }
    }
  })
})

ipcMain.on('pay-the-bills', function(e,arg){
  if(arg == "kurye1") {
    dailyCourierDatabaseA = [];
  }
  else if(arg == "Gel - Al"){
    dailyTakeAwayDatabase = [];
  }
  else {
    dailyCourierDatabaseC = [];
  }
  courier.close();
});
// Cancel New Customer
ipcMain.on('cancel-new-customer',function(e,arg){
  newCustomer.close();
  setTimeout(function(){
    win.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000);
  win.loadFile('daily-orders.html');
});
// Debts below
let debtsDatabase = [];
ipcMain.on('assign-a-debt',function(e,arg){
  debtsDatabase.push(arg);
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  let ourDate = [day,month+1,year];
  const myFolderName = `./backup-folders/debts-${day}-${month+1}.js`;
  // Backup 
  fs.writeFile(myFolderName,JSON.stringify(debtsDatabase),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  });
});
ipcMain.on('all-debts',function(e,arg){
  setTimeout(()=>{
    win.webContents.send('all-debts-load',debtsDatabase);
  },1000);
  win.loadFile('debts.html');
});
var options = {
  silent: false,
  printBackground: true,
  color: false,
  margin: {
      marginType: 'printableArea'
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Header of the Page',
  footer: 'Footer of the Page'
};
ipcMain.on('print-my-order',function(e,arg){
  anOrderWindow.webContents.print(options, (success, failureReason) => {
    if (!success) console.log(failureReason);
});
});
// Uprading the prices below
let upgradeScreen;
ipcMain.on('upgrade-price',function(e,arg){
  upgradeScreen = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  upgradeScreen.loadFile('last-upgrade.html');
});
function savePrices(){
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  let ourDate = [day,month+1,year];
  const myFolderName = `./backup-folders/all-prices.js`;
  fs.writeFile(myFolderName,JSON.stringify(foodPrices),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  })
}
ipcMain.on('assigned:new-price',function(e,arg){
  foodPrices[arg[0]] = arg[1];
  savePrices();
});
// Upgrading the Couriers Below
function saveCouriersList(){
  const myFolderName = `./backup-folders/couriers-list.js`;
  fs.writeFile(myFolderName,JSON.stringify(couriersList),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  });
}
let updateCouriersWindow;
let couriersList = [{id:1, name:"Furkan"},{id:2, name:"Erdin??"}];
ipcMain.on('update-couriers',function(e,arg){
  updateCouriersWindow = new BrowserWindow({
    width: 500,
    height: 300,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  updateCouriersWindow.loadFile('couriers-list.html');
  // setTimeout(function(){
  //   updateCouriersWindow.webContents.send("couriers-list",couriersList);
  // },1000)
  updateCouriersWindow.webContents.on('did-finish-load',function(){
    updateCouriersWindow.webContents.send("couriers-list",couriersList);
  })
});
ipcMain.on('new-courier-name',function(e,arg){
  couriersList[arg.id-1].name = arg.name;
  saveCouriersList();
});
ipcMain.on('couriers-loaded',function(e,arg){
  win.webContents.send("couriers-loaded:reply",couriersList);
})



// Menu options Below
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
      label: "Developer Tools",
      submenu: [{
          label: 'Toggle DevTools',
          accelerator: process.platfrom == "darwin" ? "Command+I" : "Ctrl+I",
          click(item,focusedWindow){
              focusedWindow.toggleDevTools();
          }
      },
  {role: 'reload'}]
  })
}





  
  
  