import { MessageBoxOptions, app, autoUpdater, dialog } from 'electron';
import report from "electron-log"

const server = process.env.UPDATE_SERVER

const log = (message: unknown) => {
  console.log(`***Updater service: ${message}`);
}

export const configureUpdater = () => {
  if (!app.isPackaged || !server) {
    log('Updater configuration skipped.')
    return;
  }

  const url = `${server}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts: MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', (message) => {
    report.error('There was a problem updating the application')
    report.error(message)

    log('There was a problem updating the application.')
    log(message)
  })
}