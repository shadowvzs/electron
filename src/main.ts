import { app } from 'electron';
import { appManager } from '../electron-api/AppManager';
import { BibleWindow } from '../electron-api/BibleWindow';


app.on('ready', () => {
  appManager.setWindow('BibleWindow', new BibleWindow());
});