const { app, BrowserWindow, Notification, Menu, Tray } = require('electron');
const path = require('path');

var appName = 'Kepee';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {

  function createTray() {
    let appIcon = new Tray(path.join(__dirname, "/../assets/icons/256x256.png"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show', click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Exit', click: function () {
                app.exit();
            }
        }
    ]);

    appIcon.on('double-click', function (event) {
      mainWindow.show();
    });
    appIcon.setContextMenu(contextMenu);
    return appIcon;
}

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1270,
    height: 800,
  });
  mainWindow.loadURL('https://keep.google.com');

  let tray = null;

  function bgCall () {
    mainWindow.hide();
    tray = createTray();
    app.setAppUserModelId("Kepee | Google Keep");
    new Notification({ title: appName, body: "App is now running in the background",}).show();
  }

  mainWindow.on('close', function(event) {
    event.preventDefault();
    bgCall();
  });
  mainWindow.on('minimize', function(event) {
    bgCall();
  });
  
  mainWindow.on('restore', function(event) {
    mainWindow.show();
    tray.destroy();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

Menu.setApplicationMenu(null);

console.log(__dirname);