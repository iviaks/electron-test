require('dotenv').config();

const path = require('path');
const { BrowserWindow, Tray, Menu } = require('electron');
const { app, ipcMain, protocol } = require('electron');

const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow, tray;

const iconPath = require.resolve(path.join(__dirname, 'icon.png'));

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
  mainWindow.loadFile(path.join(__dirname, 'frontend', 'index.html'));

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
app.on('ready', () => {
  // autoUpdater.checkForUpdates();
});

ipcMain.on('close-window', (event, arg) => {
  app.quit();
});

autoUpdater.on('checking-for-update', () => {});
autoUpdater.on('update-available', () => {});
autoUpdater.on('update-not-available', () => {});
autoUpdater.on('error', err => {});
autoUpdater.on('download-progress', progressObj => {});
autoUpdater.on('update-downloaded', info => {
  autoUpdater.quitAndInstall();
});

process.on('uncaughtException', async err => {
  log.error(err);
});
