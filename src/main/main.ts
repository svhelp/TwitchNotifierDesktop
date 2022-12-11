/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Tray, Menu } from 'electron';
import { getAssetPath, resolveHtmlPath } from './utils/path-utils';
import { initAccessToken, removeAccessToken } from './modules/token-storage';
import { initNotifierCore } from './modules/notifier-core';
import { startServer } from './modules/auth-server';
import { IAppContainer } from './interfaces';

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let isQuiting: boolean;

const appContainer: IAppContainer = {
  mainWindow: null,
  notifier: null,
  tray: null
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createTray = () => {
  const tray = new Tray(getAssetPath(app, 'icon.ico'))

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => {
      if (!appContainer.mainWindow){
        return;
      }

      appContainer.mainWindow.show();
    }},
    { label: 'Quit', click: () => {
      isQuiting = true;
      app.quit();
    }}
  ])

  tray.on('double-click', () => {
    if (!appContainer.mainWindow){
      return;
    }

    appContainer.mainWindow.show();
  })
  
  tray.setToolTip('Twitch Notifier')
  tray.setContextMenu(contextMenu)

  return tray;
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath(app, 'icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('close', event => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (isQuiting) {
      return;
    }
    
    console.log("***Quit prevented")
    
    event.preventDefault();
    mainWindow.hide();
    event.returnValue = false;
  })

  mainWindow.on('closed', () => {
    appContainer.mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();

  return mainWindow;
};

/**
 * Add event listeners...
 */

app.on('before-quit', () => {
  isQuiting = true;

  appContainer.notifier?.stopPolling();
  appContainer.tray?.destroy();
});

Menu.setApplicationMenu(null);

app
  .whenReady()
  .then(async () => {
    startServer(appContainer, isDebug);

    appContainer.notifier = initNotifierCore();
    appContainer.tray = createTray();
    appContainer.mainWindow = await createWindow();

    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (appContainer.mainWindow === null) {
        appContainer.mainWindow = await createWindow();
      }
    });
  })
  .catch(console.log);

ipcMain.handle('request_token', () => {
  return initAccessToken();
})

ipcMain.on('remove_token', async () => {
  appContainer.notifier?.stopPolling();
  removeAccessToken();
});
