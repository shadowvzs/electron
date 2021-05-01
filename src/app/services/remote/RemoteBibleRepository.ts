import { BaseBibleRepository } from "../BaseBibleRepository";
import { Bible, Vers } from "../../models/Bible";

export class RemoteBibleRepository extends BaseBibleRepository {

    public async getInstalledBibles(): Promise<Bible[]> {
        // make request for getting bibles
        return [new Bible(this)];
    }

    public async getBible(bibleId: string): Promise<Bible> {
        // make request for getting bibles
        return new Bible(this);
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        throw new Error('Method not implemented.');
    }
}
