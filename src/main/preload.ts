import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import Store from 'electron-store';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  store: {
    get<T>(key: string) {
      const store = new Store();
      return store.get(key) as T | undefined;
    },
    set<T>(key: string, value: T) {
      const store = new Store();
      store.set(key, value);
    }
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
