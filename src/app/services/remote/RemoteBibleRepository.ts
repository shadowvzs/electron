import { BaseBibleRepository } from "../BaseBibleRepository";
import { Bible } from "../../model/Bible";
import { REMOTE_URL } from "@/app/global/Const";
import { FootNoteObj } from "@gyozelem/bible/base-backend";
import { SearchQueryParams } from "@gyozelem/bible/base-backend";
import { IAbout, IVers } from "@/app/interfaces/models";

export class RemoteBibleRepository extends BaseBibleRepository {

    public static async getBibleBook(bibleId: string, bookId: string): Promise<IVers[][]> {
        const result = await fetch(REMOTE_URL + 'api/get-bible-book/' + bibleId + '/' + bookId);
        return await result.json();
    }

    public async getInstalledBibles(): Promise<Bible[]> {
        const result = await fetch(REMOTE_URL + 'api/get-installed-bibles');
        const bibles: Bible[] = await result.json();
        return bibles.map(x => Object.assign(new Bible(this), x));
    }

    public async getBible(bibleId: string): Promise<Bible> {
        const result = await fetch(REMOTE_URL + 'api/get-bible/' + bibleId);
        const loadedBible = await result.json();
        return Object.assign(new Bible(this), loadedBible);
    }

    public getBibleBook = RemoteBibleRepository.getBibleBook;

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<IVers[]> {
        const result = await fetch(`${REMOTE_URL}api/get-chapter-verses?bibleId=${bibleId}&bookId=${bookId}&chapterId=${chapterId}`);
        const verses = await result.json();
        return verses;
    }

    public async getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<IVers[][]> {
        const result = await fetch(`${REMOTE_URL}api/get-footnotes/${bibleId}`,
            {
                method: 'POST',
                body: JSON.stringify(footNotes),
                headers: { 'Content-Type': 'application/json' },
            });
        return await result.json();
    }

    public async search(data: SearchQueryParams): Promise<IVers[]> {
        this.store.setSearchLoading(true);
        const result = await fetch(`${REMOTE_URL}api/search`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });
        const verses = await result.json();
        this.store.setSearchResult(verses);
        this.store.setSearchLoading(false);
        return verses;
    }

    public async about(): Promise<IAbout> {
        const result = await fetch(`${REMOTE_URL}api/about`);
        return await result.json();
    }
}
