import { app, BrowserWindow, ipcMain, Menu, session } from 'electron';
import { IAppContainer } from 'interfaces';
import { startServer } from 'main/modules/auth-server';
import { initNotifierCore } from 'main/modules/notifier-core';
import { initAccessToken, removeAccessToken } from 'main/utils/token-storage';
import { configureUpdater } from 'main/modules/updater';
import { createTray } from 'main/modules/tray';
import { createWindow } from 'main/modules/main-window';

const appId = "com.squirrel.twitch.notifier.desktop.TwitchNotifier";
const gotTheLock = app.requestSingleInstanceLock();

const appContainer: IAppContainer = {
  mainWindow: null,
  notifier: null,
  tray: null,
  isQuitting: false,
}

const unableToStart = require('electron-squirrel-startup') || !gotTheLock

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// Close secondary windows.
if (unableToStart) {
  app.quit();
}

if (process.platform === 'win32')
{
  app.setAppUserModelId(appId)
}

Menu.setApplicationMenu(null);

/**
 * Add event listeners...
 */

app.on('before-quit', () => {
  appContainer.isQuitting = true;

  appContainer.notifier?.stopPolling();
  appContainer.tray?.destroy();
});

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (appContainer.mainWindow) {
    if (appContainer.mainWindow.isMinimized()) {
      appContainer.mainWindow.restore()
    }

    appContainer.mainWindow.focus()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {

  // Skip running modules on force quit.
  if (unableToStart) {
    return;
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'self\'; style-src \'unsafe-inline\'; connect-src \'self\' https://api.twitch.tv/; img-src \'self\' https://*.jtvnw.net/']
      }
    })
  })

  appContainer.notifier = initNotifierCore();
  appContainer.tray = createTray(appContainer);
  appContainer.mainWindow = await createWindow(appContainer);

  startServer(appContainer);
  configureUpdater();
});

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
    createWindow(appContainer);
  }
});

ipcMain.handle('request_token', () => {
  return initAccessToken();
})

ipcMain.on('remove_token', async () => {
  //appContainer.notifier?.stopPolling();
  removeAccessToken();
});
