import { FootNoteObj, SearchQueryParams } from "@gyozelem/bible/base-backend";
import { toJS } from "mobx";
import { About, Bible, Vers } from "../../model/Bible";
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

    public async getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<Vers[][]> {
        const result = await this.ipcRenderer.invoke('get-foot-notes', { bibleId, footNotes });
        return result;
    }

    public async search(data: SearchQueryParams): Promise<Vers[]> {
        this.store.setSearchLoading(true);
        data.books = toJS(data.books);
        const result = await this.ipcRenderer.invoke('search', data );
        this.store.setSearchResult(result);
        this.store.setSearchLoading(false);
        return result;
    }

    public async about(): Promise<About> {
        const result = await this.ipcRenderer.invoke('about', null);
        return result;
    }
}
