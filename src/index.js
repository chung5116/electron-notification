const path = require('path')
const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios')
const ipc = electron.ipcRenderer


const notifyBtn = document.getElementById('notifyBtn');
var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal


const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!',
    icon: path.join( __dirname, '../assets/images/btc.png')
}

function getBTC() {
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
        .then(res => {
            const cryptos = res.data.USD
            price.innerHTML = '$' + cryptos.toLocaleString('en')
            

            if (targetPrice.innerHTML != '' && targetPriceVal < res.data.USD) {
                const myNotification = new window.Notification(notification.title, notification)
            }
        })
}

getBTC()
setInterval(getBTC, 10000)

notifyBtn.addEventListener('click', function(event) {
    const modalPath = path.join('file://', __dirname, 'add.html')

    let win = new BrowserWindow({
        width: 400,
        height: 200,
        frame: false,   // 去除掉menu bar還有多餘的東西
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            contextIsolation:false
        }
    })
    win.on('close', function() {win = null})
    win.loadURL(modalPath)
    win.show()
})


ipc.on('targetPriceVal', function(event, arg) {
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en')
})