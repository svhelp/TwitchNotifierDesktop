// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { version } from '../package.json';

export type Channels = 'remove_token' | 'request_token' | 'token_updated';

declare global {
    interface Window {
      electron: {
        currentVersion: string
        ipcRenderer: {
          sendMessage(channel: Channels, args: unknown[]): void;
          on(
            channel: Channels,
            func: (...args: unknown[]) => void
          ): (() => void) | undefined;
          invoke(channel: Channels, args: unknown[]): Promise<any>;
        };
      };
    }
}

contextBridge.exposeInMainWorld('electron', {
  currentVersion: version,
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
