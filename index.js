const path = require('path');
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');

let mainWindow, tray;

const iconPath = require.resolve('./favicon.png');

const initialize = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    title: 'Test application',
    icon: iconPath,
    // frame: false,
    show: false,
  });

  // Tray creator
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show application',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: 'Quit application',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip('This is my test application.');
  tray.setContextMenu(contextMenu);

  // Open dev tools
  // mainWindow.webContents.openDevTools();

  // Render HTML file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Events
  mainWindow.on('minimize', function(event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function(event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });
};

app.on('ready', initialize);

ipcMain.on('close-window', (event, arg) => {
  app.quit();
});
