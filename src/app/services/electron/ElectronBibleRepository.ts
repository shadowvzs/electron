import { Bible, Vers } from "../../models/Bible";
import { BaseBibleRepository } from "../BaseBibleRepository";

export class ElectronBibleRepository extends BaseBibleRepository {
    private ipcRenderer: { invoke: (name: string, data: any) => Promise<any>};

    constructor() {
        super();
        this.ipcRenderer = require('electron').ipcRenderer;
    }

    public async getInstalledBibles(): Promise<Bible[]> {
        const bibles: Bible[] = await this.ipcRenderer.invoke('get-installed-bibles', null);
        return bibles.map(x => Object.assign(new Bible(this), x));
    }

    public async getBible(bibleId: string): Promise<Bible> {
        const bible = await this.ipcRenderer.invoke('get-bible', { bibleId: bibleId });
        return Object.assign(new Bible(this), bible);
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        const queryParams = {
            bibleId: bibleId,
            bookId: bookId,
            chapterId: chapterId
        };
        const chapterVerses = await this.ipcRenderer.invoke('get-chapter-verses', queryParams);
        return chapterVerses;
    }
}
