import { BrowserWindow, Tray } from "electron";
import { INotifierCore } from "./main/modules/notifier-core";

export interface IAppContainer {
  mainWindow: BrowserWindow | null;
  tray: Tray | null;
  notifier: INotifierCore | null;
}