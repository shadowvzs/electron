import { BaseBibleRepository } from "../BaseBibleRepository";
import { Bible, Vers } from "../../../model/Bible";
import { REMOTE_URL } from "@/app/global/Const";

export class RemoteBibleRepository extends BaseBibleRepository {

    public async getInstalledBibles(): Promise<Bible[]> {
        const result = await fetch(REMOTE_URL + 'api/get-installed-bibles');
        const bibles: Bible[] = await result.json();
        return bibles.map(x => Object.assign(new Bible(this), x));
    }

    public async getBible(bibleId: string): Promise<Bible> {
        const result = await fetch(REMOTE_URL + 'api/get-bible/' + bibleId);
        return Object.assign(new Bible(this), await result.json());
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        const result = await fetch(`${REMOTE_URL}api/get-chapter-verses?bibleId=${bibleId}&bookId=${bookId}&chapterId=${chapterId}`);
        return await result.json();
    }
}
