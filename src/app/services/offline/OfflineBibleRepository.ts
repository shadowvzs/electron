import { BaseBibleRepository } from "../BaseBibleRepository";
import { About, Bible, Vers } from "../../model/Bible";
import { REMOTE_URL } from "@/app/global/Const";
import { FootNoteObj } from "@gyozelem/bible/base-backend";
import { SearchQueryParams } from "npm/@gyozelem/bible/base-backend";

export class OfflineBibleRepository extends BaseBibleRepository {

    public async getInstalledBibles(): Promise<Bible[]> {
        console.log('get offline bible list', this.offlineService);
        const bibles: Bible[] = await this.offlineService!.cacheManager.get('get-installed-bibles');
        return bibles.map(x => Object.assign(new Bible(this), x));
    }

    public async getBible(bibleId: string): Promise<Bible> {
        const bible: Bible = await this.offlineService!.cacheManager.get(`bible-${bibleId}`);
        return Object.assign(new Bible(this), bible);
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        const bible: Bible = await this.getBible(bibleId);
        const result = await fetch(`${REMOTE_URL}api/get-chapter-verses?bibleId=${bibleId}&bookId=${bookId}&chapterId=${chapterId}`);
        return await result.json();
    }

    public async getFootNotes(footNotes: FootNoteObj[], bibleId: string): Promise<Vers[][]> {
        const bible: Bible = await this.getBible(bibleId);
        const result = await fetch(`${REMOTE_URL}api/get-footnotes/${bibleId}`,
            {
                method: 'POST',
                body: JSON.stringify(footNotes),
                headers: { 'Content-Type': 'application/json' },
            });
        return await result.json();
    }

    public async search(data: SearchQueryParams): Promise<Vers[]> {
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

    public async about(): Promise<About> {
        return await this.offlineService!.cacheManager.get(`about`);
    }
}
