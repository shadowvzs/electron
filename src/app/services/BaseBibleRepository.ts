import { Bible, Vers } from "../models/Bible";

export abstract class BaseBibleRepository {

    public async getInstalledBibles(): Promise<Bible[]> {
        throw new Error('Method not implemented.');
    }

    public getBible(bibleId: string): Promise<Bible> {
       throw new Error('Method not implemented.');
    }

    public async getChapterVerses(bibleId: string, bookId: string, chapterId: number): Promise<Vers[]> {
        throw new Error('Method not implemented.');
    }
  
    // public getChapter(bookId: string, chapterId: string): Promise<boolean> {
    //     throw new Error('Method not implemented.');
    // }

    // public getVerses(bookId: string, chapterId: string): Promise<Vers[]> {
    //     throw new Error('Method not implemented.');
    // }

    // public getFootnotes(versIds: string[]) {
    //    throw new Error('Method not implemented.');
    // }
}