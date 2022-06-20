import { BaseBibleRepository } from "../BaseBibleRepository";
import { Bible } from "../../model/Bible";
import { FootNoteObj } from "@gyozelem/bible/base-backend";
import { SearchQueryParams } from "@gyozelem/bible/base-backend";
import { IAbout, IVers } from "@/app/interfaces/models";
import { TYPES } from "@/app/core/types";
import { createSearchRegExps, removeLanguageSpecCharacters } from "../../../../npm-packages/@gyozelem/bible/utils";
import { ICacheManager } from "@/app/interfaces/services";
import { myContainer } from "@/app/core/container";

type ICachedBible = {
    verses: IVers[][][];
    bible: Bible;
    bookMap: Record<string, Record<number, IVers[]>>;
};
type IBibleCache = Map<string, ICachedBible>;

export class OfflineBibleRepository extends BaseBibleRepository {

    private _cacheManager: ICacheManager;
    private _installedBibles: Bible[];
    private _bibleCache: IBibleCache = new Map();

    constructor() {
        super();
        this._cacheManager = myContainer.get<ICacheManager>(TYPES.ICacheManager);
    }

    public async getInstalledBibles(): Promise<Bible[]> {
        if (!this._installedBibles) {
            const bibles: Bible[] = await this._cacheManager.get('get-installed-bibles');
            this._installedBibles = bibles.map(x => Object.assign(new Bible(this), x));
        }
        return this._installedBibles;
    }

    public async getBible(bibleId: string): Promise<Bible> {
        const bible: Bible = await this._cacheManager.get(`bible-${bibleId}`);
        return Object.assign(new Bible(this), bible);
    }

    private async loadBible(bibleId: string): Promise<ICachedBible> {
        if (!this._bibleCache.has(bibleId)) {
            const verses: IVers[][][] = await this._cacheManager.get(`bible-${bibleId}`);
            const bibles = await this.getInstalledBibles();
            const bible = bibles.find(x => x.id === bibleId)!;
            const bookMap = bible.books.reduce((obj, [chapterName], idx) => {
                const book = verses[idx].reduce((t, c, i) => { t[i + 1] = c; return t }, {} as Record<number, IVers[]>);
                obj[chapterName] = book;
                return obj;
            }, {} as Record<string, Record<number, IVers[]>>)
            this._bibleCache.set(bibleId, {
                verses: verses,
                bible: bible,
                bookMap: bookMap
            });
        }
        return this._bibleCache.get(bibleId)!;
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<IVers[]> {
        const { bookMap } = await this.loadBible(bibleId);
        const result = bookMap[bookId][chapterId];
        return result;
    }

    public async getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<IVers[][]> {
        const { bookMap } = await this.loadBible(bibleId);
        const result = footNotes.map(({
            bookIndex,
            bookId,
            chapterId,
            versId,
            length
        }) => bookMap[bookId][chapterId].slice(versId - 1, versId + length - 1));
        return result;
    }

    public async search(searchParms: SearchQueryParams): Promise<IVers[]> {
        const {
            bibleId,
            books,
            caseSensitive,
            searchTerm,
            strictCharacters,
            wordMatchType
        } = searchParms;
        this.store.setSearchLoading(true);
        const bibleData = await this.loadBible(bibleId);
        const bookMap = { ...bibleData.bookMap };

        if (books) {
            Object.keys(bookMap).filter(x => !books.includes(x)).forEach(k => Reflect.deleteProperty(books, k));
        }

        const wordRegExps = createSearchRegExps(searchTerm, caseSensitive, wordMatchType);
        const result: IVers[] = Object.values(bookMap).map(chapters => Object.values(chapters).filter(Boolean).flat(2).filter(vers => {
            return (wordRegExps.every(re => re.test(strictCharacters ? vers.text : removeLanguageSpecCharacters(vers.text))));
        })).flat(2);
        this.store.setSearchResult(result);
        this.store.setSearchLoading(false);
        return result;
    }

    public async about(): Promise<IAbout> {
        return (await this._cacheManager.get(`about`)) as IAbout;
    }
}
