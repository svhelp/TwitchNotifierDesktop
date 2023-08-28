/* eslint import/prefer-default-export: off */
import path from 'path';
import { app } from 'electron';

const getRelativePath = (location: string) => app.isPackaged
  ? path.join(process.resourcesPath, location)
  : path.join(__dirname, `../../${location}`);

export const getAssetPath = (...paths: string[]): string => 
  path.join(getRelativePath('assets'), ...paths);

export const getStaticPath = (): string =>
  getRelativePath('static');