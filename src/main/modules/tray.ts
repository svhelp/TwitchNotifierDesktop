import { app, Menu, Tray } from 'electron';
import { IAppContainer } from 'interfaces';
import { getAssetPath } from 'main/utils/path-utils';

export const createTray = (appContainer: IAppContainer) => {
  const tray = new Tray(getAssetPath('icon.ico'))

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => {
      if (!appContainer.mainWindow){
        return;
      }

      appContainer.mainWindow.show();
    }},
    { label: 'Quit', click: () => {
      appContainer.isQuitting = true;
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