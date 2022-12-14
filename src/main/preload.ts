import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'remove_token' | 'request_token' | 'token_updated';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    invoke(channel: Channels, args: unknown[]) {
      return ipcRenderer.invoke(channel, args);
    },
  },
});
