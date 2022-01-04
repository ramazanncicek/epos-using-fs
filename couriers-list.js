const electron = require('electron');
const {ipcRenderer} = electron;

const allCouriersTable = document.getElementById('all-couriers-table')
const changeButtons = document.getElementsByClassName('change-the-courier');
// const removeButtons = document.getElementsByClassName('remove-the-courier');
ipcRenderer.on('couriers-list',function(e,arg){
    for (let prop of arg) {
        let courier = `
    <tr class="couriers-list-container">
    <td class="couriers-list-tds">${prop.id}</td>
    <td class="couriers-list-tds">${prop.name}</td>
    <td class="couriers-list-tds"><button class="change-the-courier">Değiştir</button></td>
    </tr>
    `
    allCouriersTable.insertAdjacentHTML('beforeend',courier);
    }
    // Change
    function firstChangeButton(button) {
        let nameUpdate = {};
        button.addEventListener('click',function(){
            let parentOfRemove = button.parentNode.parentNode;
            let toRemove = button.parentNode.parentNode.childNodes;
            let newName = toRemove[3].value;
            let tableData = document.createElement('td');
            tableData.innerText = newName;
            let newButton = document.createElement('button');
            newButton.className = "change-the-courier";
            newButton.style.width = "auto";
            newButton.style.height = "auto";
            newButton.innerText = "Değiştir";
            newName.type = "text";
            newName.size = "30";
            parentOfRemove.replaceChild(tableData,toRemove[3]);
            button.replaceWith(newButton);
            nameUpdate.id = parseInt(toRemove[1].innerText);
            nameUpdate.name = tableData.innerText;
            ipcRenderer.send('new-courier-name',nameUpdate);
            secondChangeButton(newButton);
        })
    }

    function secondChangeButton(button){
        button.addEventListener('click',function(){
            let newName = document.createElement('input');
            let newButton = document.createElement('button');
            newButton.className = "approve-the-change";
            newButton.style.width = "auto";
            newButton.style.height = "auto";
            newButton.innerText = "Kaydet";
            let parentOfRemove = button.parentNode.parentNode;
            let toRemove = button.parentNode.parentNode.childNodes;
            newName.type = "text";
            newName.size = "30";
            newName.className = "couriers-list-tds";
            parentOfRemove.replaceChild(newName,toRemove[3]);
            button.replaceWith(newButton);
            firstChangeButton(newButton);
        })
    }
    for(let prop of changeButtons) {
        secondChangeButton(prop);
    }
    // Remove
    // for(let prop of removeButtons) {
    //     prop.addEventListener("click",function(){
    //         let parentOfRemove = prop.parentNode.parentNode.parentNode;
    //         let toRemove = prop.parentNode.parentNode;
    //         parentOfRemove.removeChild(toRemove);
    //     })
    // }
});

