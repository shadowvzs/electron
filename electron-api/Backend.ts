import { ipcMain } from "electron";
import { BaseBackend } from '@gyozelem/bible/base-backend';

export class Backend extends BaseBackend {

    constructor(
        public basePath: string,
    ) {
        super(basePath);
        ipcMain.handle('get-bible', this.getBible);
        ipcMain.handle('get-installed-bibles', this.getInstalledBibles);
        ipcMain.handle('get-chapter-verses', this.getChapterVerses);
        ipcMain.handle('get-translations', this.getTranslations);
    }
    
    public destroy() {
        ipcMain.removeAllListeners('get-bible');
        ipcMain.removeAllListeners('get-installed-bibles');
        ipcMain.removeAllListeners('get-chapter-verses');
        ipcMain.removeAllListeners('get-translations');
    }
}