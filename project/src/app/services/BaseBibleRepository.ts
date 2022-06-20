import { FootNoteObj } from "@gyozelem/bible/base-backend";
import { action, makeObservable, observable } from "mobx";
import { SearchQueryParams } from "@gyozelem/bible/base-backend";
import { OfflineService } from "./OfflineService";
import { IBaseBibleRepository, IBibleStore } from "../interfaces/services";
import { Bible } from "../model/Bible";
import { IAbout, IBible, IVers } from "../interfaces/models";

class BibleStore implements IBibleStore {
    @observable
    public searchLoading: boolean = false;

    @action.bound
    public setSearchLoading(status: boolean) {
        this.searchLoading = status;
    }

    @observable
    public searchResult: IVers[] = [];

    @action.bound
    public setSearchResult(verses: IVers[]) {
        this.searchResult = verses;
    }

    constructor() {
        makeObservable(this);
    }
}

export abstract class BaseBibleRepository implements IBaseBibleRepository {
    public static readonly $name = 'bibleRepository' as const;

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

    public store: IBibleStore = new BibleStore();

    public async getInstalledBibles(): Promise<Bible[]> {
        throw new Error('Method not implemented.');
    }

    public getBible(bibleId: string): Promise<Bible> {
        throw new Error('Method not implemented.');
    }

    public async getBibleBook(bibleId: string, bookId: string): Promise<IVers[][]> {
        throw new Error('Method not implemented.');
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<IVers[]> {
        throw new Error('Method not implemented.');
    }

    public async getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<IVers[][]> {
        throw new Error('Method not implemented.');
    }

    public async search(data: SearchQueryParams): Promise<IVers[]> {
        throw new Error('Method not implemented.');
    }

    public async about(): Promise<IAbout> {
        throw new Error('Method not implemented.');
    }
}