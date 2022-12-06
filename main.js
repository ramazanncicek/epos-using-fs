const { app, BrowsermainWindowdow,Menu,ipcMain, ipcRenderer,dialog } = require('electron');
const path = require('path');
const ejse = require('ejs-electron');
const fs = require('fs');
// CallerID Requirements below.
const ffi = require('ffi-napi');
const PromiseTimers = require('promise-timers');
const launchDevice = new ffi.Library('cid.dll',{
  "CidStart": ["void",[]],
  "CidData": ["string",[]]
  });
let z = 0;
function method () {
    // this refers to interval
    if (z > 5) {
        z = 0;
    } else {
        // Raw data comes with actual time, the number. It needs to be splitted from ','
        let unparsedData = launchDevice.CidData();
        let parsedData = unparsedData.split(',');
        // The third item is the number.
        if(parsedData[2] !== undefined){
          let callingCustomer = parsedData[2];
          let callingCustomerData = [parsedData[2],allCustomers[callingCustomer]];
          setTimeout(function(){
            mainWindow.webContents.send('calling-customer',callingCustomerData);
          },1000);
          mainWindow.loadFile('order-screen.html');
          mainWindow.show();  
          mainWindow.focus(); 
            if(allCustomers[callingCustomer] === undefined){
              mainWindow.show();
              newCustomermainWindowdow();
              setTimeout(function(){
                newCustomer.webContents.send('unregistered-number',callingCustomer);
              },1000);
            }
            else {
              let callingCustomerData = [parsedData[2],allCustomers[callingCustomer]];
              setTimeout(function(){
                mainWindow.webContents.send('calling-customer',callingCustomerData);
              },1000);
              mainWindow.loadFile('order-screen.html');
              mainWindow.show();  
              mainWindow.focus(); 
            }
            
        }
        z++;
    }
};
// Creating Main mainWindowdow
let mainWindow;
let firedOnce = false;
// Break
function createmainWindowdow () {
      mainWindow = new BrowsermainWindowdow({
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
  
    mainWindow.loadFile('index.html');
    if(!firedOnce){
      launchDevice.CidStart();
      firedOnce = true;
    }
    PromiseTimers.setInterval(200, method);
    // Restoring to Courier A
    let date = new Date();
    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    const courierFolderA = `./backup-folders/courier-a-${day}-${month+1}.js`;
    fs.readFile(courierFolderA,"utf-8",(err,data)=>{
        if(err){
            console.log(err);
        }
        if(data){
            let parsedData = JSON.parse(data);
            dailyCourierDatabaseA = parsedData;
        }
    });
    // Restoring to Courier B
    const courierFolderB = `./backup-folders/courier-b-${day}-${month+1}.js`;
    fs.readFile(courierFolderB,"utf-8",(err,data)=>{
        if(err){
            console.log(err);
        }
        if(data){
            let parsedData = JSON.parse(data);
            dailyCourierDatabaseC = parsedData;
        }
    });
    // Restoring to Take Away Orders
    const takeAwayFoldersAll = `./backup-folders/take-aways-${day}-${month+1}.js`;
    fs.readFile(takeAwayFoldersAll,"utf-8",(err,data)=>{
      if(err){
          console.log(err);
      }
      if(data){
          let parsedData = JSON.parse(data);
          dailyTakeAwayDatabase = parsedData;
      }
  });

    // Restoring to Daily Orders Database
    const courierFoldersAll = `./backup-folders/backup-orders-${day}-${month+1}.js`;
    fs.readFile(courierFoldersAll,"utf-8",(err,data)=>{
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
    createmainWindowdow();
  });
  // Routing Test
  
  //Close the whole app when main mainWindowdow is closed.
  app.on('mainWindowdow-all-closed', function () {
    if (process.platform !== 'darmainWindow'){
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
            accelerator: process.platform == "darmainWindow" ? "Command+Q" : "Ctrl+Q",
            click(){
            app.quit();
        }}
        ]
    }
];
// New Customer mainWindow Function
function newCustomermainWindowdow(){
  newCustomer = new BrowsermainWindowdow({
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
  dialog.showErrorBox('','Müşteri adı 4 haneden kısa olmamalı.');
});

// Left food screen below
let foods;
function foodmainWindowdow(area,codename,product){
  foods = new BrowsermainWindowdow({
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
  switch(area){
    case "et":
      foods.loadFile('./views/food-screen.ejs');
      break;
    case "tavuk":
      foods.loadFile('./views/food-screen.ejs');
      break;
    case "kofte":
      foods.loadFile('./views/kofte.ejs');
      break;
    case "ayvalik":
      foods.loadFile('./views/ayvalik.ejs');
      break;
    case "sandvic":
      foods.loadFile('./views/sandvic.ejs');
      break;
    case "icecek":
      foods.loadFile('./views/icecekler.ejs');
      break;
    case "menuler":
      foods.loadFile('./views/menus.ejs');
      break;
  }
}
// Food Compilation Above 
// Food Event Listener Below
ipcMain.on('item:et-doner',function(){
  foodmainWindowdow('et','foodID','Et');
});
ipcMain.on('item:tavuk-doner',function(){
  foodmainWindowdow('tavuk','foodID','Tavuk');
});
ipcMain.on('item:kofte',function(){
  foodmainWindowdow('kofte','foodID','Köfte');
});
ipcMain.on('item:sandvic',function(){
  foodmainWindowdow('sandvic','foodID','Sandviç');
});
ipcMain.on('item:ayvalik',function(){
  foodmainWindowdow('ayvalik','foodID','Ayvalık');
});
ipcMain.on('item:icecekler',function(){
  foodmainWindowdow('icecek','','');
});
ipcMain.on('item:menuler',function(){
  foodmainWindowdow('menuler','','');
});
let newCustomer;
ipcMain.on('customer:new',function(e){
  newCustomermainWindowdow();
  newCustomer.loadFile('new-customer.html');
});
// Food to send orders screen below.
let foodOrder;
let foodPrices = {
  'Yarım Et': 20,
  'ÇİFT Lavaş Et': 21,
  'Dürüm Et': 20,
  'Pita Et': 20,
  'Bazlama Et': 20,
  '3/4 Ekmek Arası Et': 30,
  '120Gr Et': 40,
  'İskender Et': 40,
  'Zurna Et': 32,
  'Menü Et': 30,
  // Tavuk
  'Yarım Tavuk': 13,
  'Dürüm Tavuk': 13,
  'ÇİFT Lavaş Tavuk': 14,
  'Pita Tavuk': 13,
  'Bazlama Tavuk': 13,
  '3/4 Ekmek Arası Tavuk': 19,
  '120Gr Tavuk': 26,
  'İskender Tavuk': 26,
  'Zurna Tavuk': 24,
  'Tavuk Dönerli Pilav': 30,
  // Köfte
  'Yarım Köfte': 18,
  '3/4 Ekmek Arası Izgara Köfte': 27,
  'Bazlama Izgara Köfte': 18,
  'Izgara Dürüm Köfte': 18,
  'Izgara Köfte': 36,
  // Sandviç
  'Karışık Sandviç': 18,
  '3/4 Ekmek Karışık Sandviç': 27,
  'Et Dönerli Sandviç': 20,
  'Tavuk Dönerli Sandviç': 13,
  'Patso Sandviç': 11,
  'Karışık Patso Sandviç': 18,
  'Kaşarlı Patso Sandviç': 15,
  'Sosisli Patso Sandviç': 15,
  'Karışık Sandviç Dürüm': 18,
  // Ayvalık
  'Kaşarlı Ayvalık': 12,
  'Karışık Ayvalık': 16,
  'Karışık Bazlama Ayvalık': 16,
  'Kaşarlı Bazlama Ayvalık': 12,
  'Bazlama Kasap Sucuk': 20,
  'Sucuk Kaşar': 20,
  // İçecekler ve Patates
  'Büyük Patates': 16,
  'Küçük Patates': 8,
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
  // Su ve Şişe Kola
  "Su - (2TL)": 2,
  "Şişe Kola 20CL - (4TL)": 4,
  'Sade Soda 20 cl': 3,
  // Menüler
  "Menü 1 - Ekmek Arası Tavuk Döner + Patates + Ayran(20cl)": 24,
  "Menü 2 - Ekmek Arası Et Döner + Patates + Ayran(20cl)": 31,
  "Menü 3 - Karışık Sandviç + Patates + Ayran(20cl)": 29,
  "Menü 4 - Yarım Ekmek Karışık Tost + Patates + Ayran(20cl)": 27,
  "Menü 5 - Karışık Ayvalık Tost + Patates + Ayran(20cl)": 27,
  "Menü 6 - Ekmek Arası Tavuk Ciğer + Patates + Ayran(20cl)": 24,
  "Menü 7 - Ekmek Arası Köfte + Patates + Ayran(20cl)": 29,
  "Menü 8 - Dana Kasap Sucuk + Patates + Ayran(20cl)": 31,
  "Menü 9 - 120Gr Tavuk Döner + Patates + Ayran(20cl)": 37,
  "Menü 10 - Tavuk İskender(120gr) + Patates + Ayran(20cl)": 37,
  "Menü 11 - 120Gr Et Döner + Patates + Ayran(20cl)": 52,
  "Menü 12 - İskender Et Döner + Patates + Ayran(20cl)": 52,
  "Menü 13 - Izgara Köfte(200gr) + Patates + Ayran(20cl)": 47,
  "Menü 14 - Tavuk CİĞER(200gr) + Patates + Ayran(20cl)": 37,
  "Menü 15 - Dört(4) Adet Ekmek Arası Tavuk + İçecek(1L)": 59,
  "Menü 16 - Dört(4) Adet Ekmek Arası Et + İçecek (1L)": 89,
  "Menü 17 - Dört(4) Adet Karışık Sandviç + İçecek (1L)": 79,
  "Menü 18 - Dört(4) Adet Ekmek Arası Köfte + İçecek (1L)": 79,
  "Menü 19 - Tereyağlı Tavuklu Pilav + Ayran(30cl)": 16,
  "Menü 20 - Zurna Tavuk Dürüm(120gr) + Patates + Ayran(20cl)":35,
  "Menü 21 - Zurna ET Dürüm(120gr) + Patates + Ayran(20cl)": 43
}
ipcMain.on('orders-ID',function(e,arg) {
    let orderPrice = foodPrices[arg[0]] * arg[1];
    foodOrder = `<tr>
    <td class="order-foods">${arg[0]}</td>
    <td class = "order-quantity"><b>${arg[1]}</b></td>
    <td class="order-prices">${orderPrice}</td>
    <td class="order-delete-food"><button class="delete-food-button">SİL</button></td>
     </tr>`;
  mainWindow.webContents.send('confirmed-order-id',foodOrder);
});
ipcMain.on('orders-ID:per-price',function(e,arg) {
  foodOrder = `<tr>
  <td class="order-foods">${arg[0]}</td>
  <td class = "order-quantity"><b>1</b></td>
  <td class="order-prices">${arg[1]}</td>
  <td class="order-delete-food"><button class="delete-food-button">SİL</button></td>
   </tr>`;
mainWindow.webContents.send('confirmed-order-id',foodOrder);
});
// Sending orders from order-screen to All Daily Orders
let dailyOrdersDatabase = [];
// let orderID = dailyOrdersDatabase.length + 1;
function savingDailyOrdersForBackup(){
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  const orderBackupFolders = `./backup-folders/backup-orders-${day}-${month+1}.js`;
  // Backup 
  fs.writeFile(orderBackupFolders,JSON.stringify(dailyOrdersDatabase),
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
  setTimeout(function(){
    mainWindow.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000);
  mainWindow.loadFile('daily-orders.html');
});
// Cancelling An Order
ipcMain.on('cancelling-the-order',function(e,arg){
  dialog.showMessageBox({
    message:"Sipariş İptal Edilsin Mi?",
    buttons:[
      "Evet",
      "Hayır"
    ],
    title: "Sipariş İptali",
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
    mainWindow.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000);
  mainWindow.loadFile('daily-orders.html');
})
// Daily Orders Handle Below
ipcMain.on('daily-orders-click',function(e,arg){
  setTimeout(function(){
    mainWindow.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000)
  mainWindow.loadFile('daily-orders.html');
});
// Send By Number below
let sendByNumbermainWindow;
ipcMain.on('send-by-number',function(e,arg){
  sendByNumbermainWindow = new BrowsermainWindowdow({
    width: 400,
    height: 200,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  sendByNumbermainWindow.loadFile('send-by-number.html');
});
ipcMain.on('number-send-input',function(e,arg){
  if(arg.length == 11){
    sendByNumbermainWindow.close();
    if(allCustomers[arg] !== undefined){
    let callingCustomerData = [arg,allCustomers[arg]];
            setTimeout(function(){
              mainWindow.webContents.send('calling-customer',callingCustomerData);
            },1000);
            mainWindow.loadFile('order-screen.html');
            mainWindow.show();  
    }
    else {
    newCustomermainWindowdow();
    setTimeout(function(){
    newCustomer.webContents.send('unregistered-number',arg);
    },1000);
          }
  }
  else {
    dialog.showErrorBox('',"Müşteri numarası 11 veya 7 haneli olmalıdır.");
  }
  
});
// An Order Display below
let anOrdermainWindowdow;
ipcMain.on('orders:click-order-id',function(e,arg){
  anOrdermainWindowdow = new BrowsermainWindowdow({
    width: 900,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  dailyOrdersDatabase.forEach(launchDevice);
  function launchDevice(value){
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
      anOrdermainWindowdow.loadFile('./views/an-order.html');
      anOrdermainWindowdow.webContents.on('did-finish-load',function(){
        anOrdermainWindowdow.webContents.send('orders:clicked-order-details',returningArr);
      });
    }
  };

});
// New Customer Registration below
let allCustomers = {};
function saveAllCustomersBackup(){
  const folderName = `./backup-folders/all-customers.json`;
  // Backup 
  fs.writeFile(folderName,JSON.stringify(allCustomers),
  (err)=>{
    if(err){
      console.log('Error! All Customers are not saved.');
    };
  });
}
ipcMain.on('new-customer-added',function(e,arg){
  allCustomers[arg[0]] = {name: arg[1], address: arg[2], number: arg[0]};
  const folderName = `./backup-folders/all-customers.json`;
  // Backup 
  fs.writeFile(folderName,JSON.stringify(allCustomers),
  (err)=>{
    if(err){
      console.log('Error! All Customers are not saved.');
    };
  });
  newCustomer.close();
  let callingCustomerData = [arg[0],{name: arg[1], address: arg[2],number: arg[0]}];
  setTimeout(function(){
    mainWindow.webContents.send('calling-customer',callingCustomerData);
  },1000);
  mainWindow.show(); 
  mainWindow.loadFile('order-screen.html');
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
  function couriermainWindowdow(c){
      courier = new BrowsermainWindowdow({
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
  couriermainWindowdow();
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
  const folderName = `./backup-folders/courier-a-${day}-${month+1}.js`;
  fs.writeFile(folderName,JSON.stringify(dailyCourierDatabaseA),
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
  const folderName = `./backup-folders/courier-b-${day}-${month+1}.js`;
  fs.writeFile(folderName,JSON.stringify(dailyCourierDatabaseC),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  })
});
ipcMain.on('is-validated',function(e,arg){
  if(arg === "kurye-a") {
    let response1 = dialog.showMessageBox({
      message: `Sipariş ${couriersList[0].name} Atansın mı?`,
      type: "question",
      buttons: [
      "Onayla",
      "İptal Et"
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
      message: `Sipariş ${couriersList[1].name} Atansın mı?`,
      type: "question",
      buttons: [
      "Onayla",
      "İptal Et"
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
  const folderName = `./backup-folders/take-aways-${day}-${month+1}.js`;
  fs.writeFile(folderName,JSON.stringify(dailyTakeAwayDatabase),
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
    message: `${arg}'ın hesabı kapatılsın mı?`,
    type: "question",
    buttons: [
    "Onayla",
    "İptal Et"
        ],
    title: `${arg} Günlük Ödeme`,
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
    mainWindow.webContents.send('order-away-confirmed',dailyOrdersDatabase);
  },1000);
  mainWindow.loadFile('daily-orders.html');
});
// Debts below
let debtsDatabase = [];
ipcMain.on('assign-a-debt',function(e,arg){
  debtsDatabase.push(arg);
  let date = new Date();
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  const folderName = `./backup-folders/debts-${day}-${month+1}.js`;
  // Backup 
  fs.writeFile(folderName,JSON.stringify(debtsDatabase),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  });
});
ipcMain.on('all-debts',function(e,arg){
  setTimeout(()=>{
    mainWindow.webContents.send('all-debts-load',debtsDatabase);
  },1000);
  mainWindow.loadFile('debts.html');
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
  anOrdermainWindowdow.webContents.print(options, (success, failureReason) => {
    if (!success) console.log(failureReason);
});
});
// Uprading the prices below
let upgradeScreen;
ipcMain.on('upgrade-price',function(e,arg){
  upgradeScreen = new BrowsermainWindowdow({
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
  const folderName = `./backup-folders/all-prices.js`;
  fs.writeFile(folderName,JSON.stringify(foodPrices),
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
  const folderName = `./backup-folders/couriers-list.js`;
  fs.writeFile(folderName,JSON.stringify(couriersList),
  (err)=>{
    if(err){
      console.log('Error!');
    };
  });
}
let updateCouriersmainWindowdow;
let couriersList = [{id:1, name:"Furkan"},{id:2, name:"Erdinç"}];
ipcMain.on('update-couriers',function(e,arg){
  updateCouriersmainWindowdow = new BrowsermainWindowdow({
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
  updateCouriersmainWindowdow.loadFile('couriers-list.html');
  // setTimeout(function(){
  //   updateCouriersmainWindowdow.webContents.send("couriers-list",couriersList);
  // },1000)
  updateCouriersmainWindowdow.webContents.on('did-finish-load',function(){
    updateCouriersmainWindowdow.webContents.send("couriers-list",couriersList);
  })
});
ipcMain.on('new-courier-name',function(e,arg){
  couriersList[arg.id-1].name = arg.name;
  saveCouriersList();
});
ipcMain.on('couriers-loaded',function(e,arg){
  mainWindow.webContents.send("couriers-loaded:reply",couriersList);
})



// Menu options Below
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
      label: "Developer Tools",
      submenu: [{
          label: 'Toggle DevTools',
          accelerator: process.platfrom == "darmainWindow" ? "Command+I" : "Ctrl+I",
          click(item,focusedmainWindowdow){
              focusedmainWindowdow.toggleDevTools();
          }
      },
  {role: 'reload'}]
  })
}





  
  
  