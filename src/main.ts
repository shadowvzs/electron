import { app, BrowserWindow } from 'electron';
import { appManager } from '@/electron/AppManager';
import { BibleWindow } from '@/electron/BibleWindow';


app.on('ready', () => {
  appManager.setWindow('BibleWindow', new BibleWindow());
});