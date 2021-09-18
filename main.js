const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const shell = require('electron').shell
const ipc = require('electron').ipcMain

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd')
  });

let mainWindow

function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule:true,
        contextIsolation:false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
          submenu: [
               {
                   label: 'Adjust Notification Value'
                },
               {
                  label: 'Adjust ConinMarketCap',
                  click() {
                      shell.openExternal('http://coinmarketcap.com')
                  }
                },
                {type: 'separator'},
               {  
                  label: 'Exit',
                  click() {
                    app.quit()
                  }
                }
          ]
      },
      {
        label:'Info',
      }
  ])

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipc.on('update-notify-value', function(event, arg) {
    mainWindow.webContents.send('targetPriceVal', arg)
})