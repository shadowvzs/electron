import { FootNoteObj } from "@gyozelem/bible/base-backend";
import { action, makeObservable, observable } from "mobx";
import { SearchQueryParams } from "@gyozelem/bible/base-backend";
import { About, Bible, Vers } from "../model/Bible";
import { OfflineService } from "./OfflineService";

class BibleStore {

    @observable
    public searchLoading: boolean = false;

    @action.bound
    public setSearchLoading(status: boolean) {
        this.searchLoading = status;
    }

    @observable
    public searchResult: Vers[] = [];

    @action.bound
    public setSearchResult(verses: Vers[]) {
        this.searchResult = verses;
    }

    constructor() {
        makeObservable(this);
    }
}

export abstract class BaseBibleRepository {
    public static $name = 'bibleRepository' as const;

    protected offlineService?: OfflineService

    constructor(
        offlineService?: OfflineService
    ) {
        this.offlineService = offlineService;
    }

    public static rawFootNoteToObject(footNote: string, bible?: Bible): FootNoteObj {
        const bookIndex = parseInt(footNote.substr(0, 2)) - 1;
        return {
            bookIndex: bookIndex,
            bookId: bible ? bible.books[bookIndex][0] : '',
            chapterId: parseInt(footNote.substr(2, 3)),
            versId: parseInt(footNote.substr(5, 3)),
            length: parseInt(footNote.substr(8, 2))
        }
    }

    public store: BibleStore = new BibleStore();

    public async getInstalledBibles(): Promise<Bible[]> {
        throw new Error('Method not implemented.');
    }

    public getBible(bibleId: string): Promise<Bible> {
        throw new Error('Method not implemented.');
    }

    public async getBibleBook(bibleId: string, bookId: string): Promise<Vers[][]> {
        throw new Error('Method not implemented.');
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        throw new Error('Method not implemented.');
    }

    public async getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<Vers[][]> {
        throw new Error('Method not implemented.');
    }

    public async search(data: SearchQueryParams): Promise<Vers[]> {
        throw new Error('Method not implemented.');
    }

    public async about(): Promise<About> {
        throw new Error('Method not implemented.');
    }
}