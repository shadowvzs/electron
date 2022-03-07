import { ipcMain } from "electron";
import { BaseBackend, BaseVers, FootNoteObj, SearchQueryParams } from '@gyozelem/bible/base-backend';
import { aboutData } from "./About";

export class Backend extends BaseBackend {

    constructor(
        public basePath: string,
    ) {
        super(basePath);
        ipcMain.handle('get-bible', this.getBible);
        ipcMain.handle('get-installed-bibles', this.getInstalledBibles);
        ipcMain.handle('get-chapter-verses', this.getChapterVerses);
        ipcMain.handle('get-translations', this.getTranslations);
        ipcMain.handle('get-foot-notes', this.getFootNotes);
        ipcMain.handle('search', this.onSearch);
        ipcMain.handle('about', this.about);
        // ipcMain.handle('get-foot-notes', this.getFootNotes)
    }

    private onSearch = async (event: Electron.IpcMainInvokeEvent, data: SearchQueryParams) => {
        return this.search(data);
    }

    private about = async (event: Electron.IpcMainInvokeEvent, data: SearchQueryParams) => {
        return aboutData;
    }

    public getFootNotes(event: Electron.IpcMainInvokeEvent, options: { bibleId: string, footNoteObjs: FootNoteObj[] }): Record<number, BaseVers[]> {
        console.log(event, options);
        const a = super.getFootNotes(event, options);
        console.log('---', a);
        return {} as Record<number, BaseVers[]>;
    }

    public destroy() {
        ipcMain.removeAllListeners('get-bible');
        ipcMain.removeAllListeners('get-installed-bibles');
        ipcMain.removeAllListeners('get-chapter-verses');
        ipcMain.removeAllListeners('get-translations');
        ipcMain.removeAllListeners('search');
    }
}
