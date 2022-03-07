import { app, BrowserWindow, protocol, session } from 'electron';
import { Backend } from './Backend';
import * as remoteMain from '@electron/remote/main';

remoteMain.initialize();

export class BibleWindow {
  private _window: BrowserWindow;
  private _backend: Backend;

  constructor() {
    this._window = this.createWindow();
    app.on('activate', this.onActivate);
    app.on('ready', this.onActivate);
    app.on('window-all-closed', this.onClose);
  }

  private createWindow(): BrowserWindow {
    const window = new BrowserWindow({
      show: false,
      width: 300,
      height: 600,
      title: 'Bible',
      icon: `file://${app.getAppPath()}/assets/favicon.png`,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false,
        webSecurity: false,
      }
    });

    window.removeMenu();
    window.maximize();
    window.show();
    window.webContents.openDevTools()

    // create handler for backend events like get data from db
    this._backend = new Backend(app.getAppPath());

    // Load our index.html
    window.loadURL(`file://${app.getAppPath()}/index.html`);

    return window;
  }

  private onActivate = () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      this._window = this.createWindow();
    }
  }

  private onClose = () => {
    this._backend.destroy();
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }
}