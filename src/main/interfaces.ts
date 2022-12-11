import { BrowserWindow, Tray } from "electron";
import { INotifierCore } from "./modules/notifier-core";

export interface IAppContainer {
  mainWindow: BrowserWindow | null;
  tray: Tray | null;
  notifier: INotifierCore | null;
}