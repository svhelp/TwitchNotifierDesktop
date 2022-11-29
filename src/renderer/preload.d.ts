import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      store: {
        get<T>(key: string): T | undefined;
        set<T>(key: string, value: T): void;
      },
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
