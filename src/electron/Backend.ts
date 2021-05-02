import { app, ipcMain } from "electron";
import { BibleQueryParams, getChapterVerses } from "./BibleReadLogic";

const fs = require('fs');

interface IFile {
    name: string;
    isDirectory: () => boolean;
}

export class Backend {

    private chapterCache: Record<string, any> = {};
    private getBibleRoot = () => `${app.getAppPath()}/bibles/`;
    private getBibleDetailPath = (id: string) => `${app.getAppPath()}/bibles/${id}/index.json`;
    private getLocaleRoot = () => `${app.getAppPath()}/assets/locale/`;
    private getLocale = (name: string) => `${app.getAppPath()}/assets/locale/${name}`;

    constructor() {
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

    private getTranslations = (event?: Electron.IpcMainInvokeEvent) => {
        const translations = fs.readdirSync(this.getLocaleRoot(), { withFileTypes: true })
            .filter((file: IFile) => file.name.endsWith('.json'))
            .reduce((t: any, file: IFile) => {
                const lang = file.name.split('.')[0];
                t[lang] = JSON.parse(fs.readFileSync(this.getLocale(file.name), 'utf8'));
                return t;
            }, {});
        return translations;
    }

    private getInstalledBibles = (event?: Electron.IpcMainInvokeEvent) => {
        const bibles = fs.readdirSync(this.getBibleRoot(), { withFileTypes: true })
            .filter((file: IFile) => file.isDirectory())
            .map((file: IFile) => this.getBible(null, { bibleId: file.name }));
        return bibles;
    }

    private getBible = (event: Electron.IpcMainInvokeEvent | null, bibleQueryParams: Pick<BibleQueryParams, 'bibleId'>) => {
        const rawdata = fs.readFileSync(this.getBibleDetailPath(bibleQueryParams.bibleId));
        return JSON.parse(rawdata);
    }

    private getChapterVerses = (event: Electron.IpcMainInvokeEvent | null, bibleQueryParams: Pick<BibleQueryParams, 'bibleId' | 'bookId' | 'chapterId'>) => {
        const key = JSON.stringify(bibleQueryParams);
        if (this.chapterCache[key]) { return this.chapterCache[key]; }
        const verses = getChapterVerses(bibleQueryParams, app.getAppPath());
        return verses;
    }
}