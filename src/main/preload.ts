import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { removeAccessToken } from './tokenStorage';

export type Channels = 'request_token' | 'token_updated';

contextBridge.exposeInMainWorld('electron', {
  store: {
    removeAccessToken() {
      removeAccessToken();
    },
  },
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
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
