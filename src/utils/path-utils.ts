/* eslint import/prefer-default-export: off */
import path from 'path';
import { App } from 'electron';

export const getAssetPath = (app: App, ...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  return path.join(RESOURCES_PATH, ...paths);
};

export const getStaticPath = (app: App): string => {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'static')
    : path.join(__dirname, '../../static');
};
