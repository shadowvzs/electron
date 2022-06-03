import { BaseBibleRepository } from "../BaseBibleRepository";
import { About, Bible, Vers } from "../../model/Bible";
import { REMOTE_URL } from "@/app/global/Const";
import { FootNoteObj } from "@gyozelem/bible/base-backend";
import { createSearchRegExps, removeLanguageSpecCharacters } from "@gyozelem/bible/utils";
import { SearchQueryParams } from "@gyozelem/bible/base-backend";

type ICachedBible = {
    verses: Vers[][][];
    bible: Bible;
    bookMap: Record<string, Record<number, Vers[]>>;
};
type IBibleCache = Map<string, ICachedBible>;

export class OfflineBibleRepository extends BaseBibleRepository {
    private _installedBibles: Bible[];
    private _bibleCache: IBibleCache = new Map();

    public async getInstalledBibles(): Promise<Bible[]> {
        if (!this._installedBibles) {
            const bibles: Bible[] = await this.offlineService!.cacheManager.get('get-installed-bibles');
            this._installedBibles = bibles.map(x => Object.assign(new Bible(this), x));
        }
        return this._installedBibles;
    }

    public async getBible(bibleId: string): Promise<Bible> {
        const bible: Bible = await this.offlineService!.cacheManager.get(`bible-${bibleId}`);
        return Object.assign(new Bible(this), bible);
    }

    private async loadBible(bibleId: string): Promise<ICachedBible> {
        if (!this._bibleCache.has(bibleId)) {
            const verses: Vers[][][] = await this.offlineService!.cacheManager.get(`bible-${bibleId}`);
            const bibles = await this.getInstalledBibles();
            const bible = bibles.find(x => x.id === bibleId)!;
            const bookMap = bible.books.reduce((obj, [chapterName], idx) => {
                const book = verses[idx].reduce((t, c, i) => { t[i + 1] = c; return t }, {} as Record<number, Vers[]>);
                obj[chapterName] = book;
                return obj;
            }, {} as Record<string, Record<number, Vers[]>>)
            this._bibleCache.set(bibleId, {
                verses: verses,
                bible: bible,
                bookMap: bookMap
            });
        }
        return this._bibleCache.get(bibleId)!;
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        const { bookMap } = await this.loadBible(bibleId);
        const result = bookMap[bookId][chapterId];
        return result;
    }

    public async getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<Vers[][]> {
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

    public async search(searchParms: SearchQueryParams): Promise<Vers[]> {
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
        const result: Vers[] = Object.values(bookMap).map(chapters => Object.values(chapters).filter(Boolean).flat(2).filter(vers => {
            return (wordRegExps.every(re => re.test(strictCharacters ? vers.text : removeLanguageSpecCharacters(vers.text))));
        })).flat(2);
        this.store.setSearchResult(result);
        this.store.setSearchLoading(false);
        return result;
    }

    public async about(): Promise<About> {
        return await this.offlineService!.cacheManager.get(`about`);
    }
}
